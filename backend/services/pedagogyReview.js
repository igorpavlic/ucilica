const crypto = require('crypto');
const { questionFamilyKey } = require('./questionFamily');
const { dodajObjasnjenje, dodajSkupinska } = require('./objasnjenja');
const { pitanjaZaTemu } = require('../seeds/citanje-tekstovi');
const { dodatciZa } = require('../seeds/dodatci');

// Tekstovi za čitanje (seeds/citanje-tekstovi.js) po generatoru teme.
const TEKSTOVI_ZA_GENERATOR = {
  genCitanje2: 'citanje-2', genCitanje3: 'citanje-3', genCitanje4: 'citanje-4',
  genKnjizevnost4: 'knjizevnost-4', genMedijskaKultura: 'medijska-kultura'
};

const kratkiHash = (s) => crypto.createHash('sha1').update(String(s)).digest('hex').slice(0, 10);

/**
 * Stabilna oznaka predloška: isti generator + isti oblik pitanja (bez brojeva i
 * primjera u navodnicima) uvijek daju istu oznaku, bez obzira na nasumičnost.
 * Ručno zadan templateId (tekstovi, novi predlošci) ima prednost.
 */
function templateIdZa(generatorName, q) {
  return q.templateId || `${generatorName}:${kratkiHash(questionFamilyKey(q))}`;
}

/**
 * Sadržajni ključ zadatka: isti zadatak generiran ponovno dobiva isti ključ,
 * pa se njegova izmjerena težina ne gubi pri novom generiranju banke.
 * Redoslijed ponuđenih odgovora ne ulazi u ključ.
 */
function itemKeyZa(q) {
  const kljuc = q.type === 'choice' ? (q._c ?? q.answers?.[q.correctIndex])
    : q.type === 'true-false' ? q.correct : q.type === 'match' ? q.pairs : q.type === 'ordering' ? q.items : q.correctAnswer;
  const dijelovi = [q.type, q.question, q.visual || '', q.passage || '',
    [...(q.answers || [])].map(String).sort(), kljuc];
  // Isti tekst uz drugi grafikon je drugi zadatak. Grafikon se dodaje samo
  // kad postoji, pa ključevi pitanja bez grafikona ostaju nepromijenjeni.
  if (q.chart?.length) dijelovi.push(q.chart);
  // Isto vrijedi za mrežu (robot, cilj, stijene): drugi raspored je drugi zadatak.
  if (q.mreza?.length) dijelovi.push(q.mreza);
  return kratkiHash(JSON.stringify(dijelovi));
}
const HR = require('../seeds/hr-gramatika');
const PID_UVJETI = require('../seeds/gen-pid-uvjeti');
const KUTOVI = require('../seeds/gen-kutovi');
const ZAVICAJ = require('../seeds/gen-zavicaj-bastina');
const MEDIJI = require('../seeds/gen-mediji');
const { oznake } = require('../seeds/jasnoca');

// "5 skupine" nije hrvatski. Broj uz imenicu traži paukal ili genitiv množine,
// a to zna hr-gramatika: 1 skupina, 2 skupine, 5 skupina.
const [ZNAK_MANJE, ZNAK_VECE, ZNAK_JEDNAKO] = oznake(['<', '>', '=']);

const skupina = (n) => HR.brojIme(n, 'skupina');
const predmeta = (n) => HR.brojIme(n, 'predmet');

function numChoices(correct, min=0, max=100) {
  const c=Number(correct); const vals=[c,c+1,c-1,c+2,c-2,c+10,c-10].filter((v,i,a)=>Number.isInteger(v)&&v>=min&&v<=max&&a.indexOf(v)===i);
  while(vals.length<4){const v=Math.max(min,Math.min(max,c+vals.length+3)); if(!vals.includes(v)) vals.push(v); else break;}
  const ans=vals.slice(0,4).map(String); return {answers:ans,correctIndex:ans.indexOf(String(c))};
}
function choice(question, correct, wrongs, difficulty=2, extra={}) {
  const vals=[correct,...wrongs].filter((v,i,a)=>v!=null&&a.indexOf(v)===i).slice(0,4);
  // deterministic rotation avoids positional clues without randomness in tests
  const shift=Math.abs([...question].reduce((a,c)=>a+c.charCodeAt(0),0))%vals.length;
  const answers=vals.slice(shift).concat(vals.slice(0,shift));
  return {type:'choice',difficulty,question,answers,correctIndex:answers.indexOf(correct),...extra};
}
function input(question, answer, difficulty=2, extra={}) { return {type:'input',difficulty,question,correctAnswer:String(answer),...extra}; }

const BROJ_RIJEC=['nula','jedan','dva','tri','četiri','pet','šest','sedam','osam','devet','deset','jedanaest','dvanaest','trinaest','četrnaest','petnaest','šesnaest','sedamnaest','osamnaest','devetnaest','dvadeset'];
function transformVisualCount(q,i){
  const n=Number(q.correctAnswer ?? (q.answers?.[q.correctIndex])); if(!Number.isInteger(n)) return q;
  const mode=i%10, visual=q.visual;
  if(mode===0)return input('Prebroji prikazane znakove i upiši njihov broj.',n,1,{visual});
  if(mode===1){const c=numChoices(n,0,20);return {type:'choice',difficulty:1,question:'Koji broj odgovara prikazanoj količini?',visual,...c};}
  if(mode===2)return choice('Je li na slici više od 5 znakova?',n>5?'Da':'Ne',[n>5?'Ne':'Da'],2,{visual});
  if(mode===3)return input('Koliko znakova nedostaje do ukupno 10?',10-n,2,{visual});
  if(mode===4)return input('Kad bismo dodali još jedan znak, koliko bi ih bilo?',n+1,2,{visual});
  if(mode===5)return input('Kad bismo maknuli jedan znak, koliko bi ih ostalo?',Math.max(0,n-1),2,{visual});
  if(mode===6)return choice('Koja brojna riječ opisuje prikazanu količinu?',BROJ_RIJEC[n],[BROJ_RIJEC[Math.max(0,n-1)],BROJ_RIJEC[Math.min(20,n+1)],BROJ_RIJEC[Math.min(20,n+2)]],2,{visual});
  if(mode===7)return choice(`Je li prikazana količina jednaka broju ${n}?`,'Da',['Ne'],1,{visual});
  if(mode===8)return choice(`Je li prikazana količina manja, veća ili jednaka broju ${Math.min(20,n+1)}?`,'manja',['veća','jednaka'],2,{visual});
  return input('Prebroji znakove. Zatim napiši broj koji je za jedan veći od njihove količine.',n+1,3,{visual});
}

function transformMoney(i){
  // Parovi apoena kojima zbroj ostaje u rasponu do 100 (2. razred).
  // Ranije je (20, 100) i (100, 2) davalo 120 € i 102 €.
  const parovi=[[1,5],[2,10],[5,20],[10,50],[20,50],[50,2],[20,10]];
  const [d1,d2]=parovi[i%parovi.length];
  const mode=i%8;
  if(mode===0)return input(`Koliko eura vrijede zajedno ${d1} € i ${d2} €?`,d1+d2,2);
  if(mode===1)return choice(`Koja dva apoena mogu zajedno dati ${d1+d2} €?`,`${d1} € i ${d2} €`,[`${d1} € i ${d1} €`,`${d2} € i ${d2} €`,`1 € i 2 €`],2);
  if(mode===2){const p=[5,10,20,50,100][i%5],price=Math.max(1,p-(i%4+1));return input(`Predmet stoji ${price} €. Plaćaš novčanicom od ${p} €. Koliko eura dobiješ natrag?`,p-price,3);}
  if(mode===3)return choice(`Koji je iznos veći?`,`${Math.max(d1,d2)} €`,[`${Math.min(d1,d2)} €`],1);
  if(mode===4)return input(`Imaš ${d1} € i dobiješ kovanicu ili novčanicu od ${d2} €. Koliko eura imaš ukupno?`,d1+d2,2);
  if(mode===5){const p=[10,20,50,100][i%4],spend=[1,2,5,10,20][i%5];return input(`Imaš ${p} €. Potrošiš ${Math.min(spend,p)} €. Koliko eura ostane?`,p-Math.min(spend,p),2);}
  if(mode===6)return choice(`Koji je stvarni apoen eura?`,`${d1} €`,['3 €','7 €','15 €'],1);
  return choice(`Koji skup prikazuje stvarne apoene eura?`,'1 €, 2 €, 5 €, 10 €',['3 €, 7 €, 15 €, 30 €','4 €, 8 €, 12 €, 16 €','6 €, 9 €, 11 €, 25 €'],2);
}

function safeStory(op,a,b,r,i,grade){
  const add=[
    [`U kutiji su ${a} bojice. Dodamo još ${b}. Koliko je bojica sada u kutiji?`,r],
    [`Na polici je ${a} knjiga, a na drugoj još ${b}. Koliko je knjiga ukupno?`,r],
    [`U prvoj košari je ${a} jabuka, a u drugoj ${b}. Koliko je jabuka zajedno?`,r],
    [`U razredu je složeno ${a} bilježnica. Učiteljica donese još ${b}. Koliko ih je sada?`,r]
  ];
  const sub=[
    [`U kutiji je ${a} bojica. Potrošimo ${b}. Koliko bojica ostane?`,r],
    [`Na polici je ${a} knjiga. Posudimo ${b}. Koliko knjiga ostane?`,r],
    [`U košari je ${a} jabuka. Pojedemo ${b}. Koliko jabuka ostane?`,r],
    [`Na stolu je ${a} kartica. Maknemo ${b}. Koliko ih ostane?`,r]
  ];
  const arr=op==='+'?add:sub; return input(arr[i%arr.length][0],arr[i%arr.length][1], grade<=1?2:3);
}

function transformMath(q, i, generatorName){
  let m=q.question.match(/^Koliko je (\d+) \+ (\d+)\?$/); if(m){
    const a=+m[1],b=+m[2],r=a+b,mode=i%8;
    if(mode===0)return input(`Izračunaj zbroj brojeva ${a} i ${b}.`,r,q.difficulty);
    if(mode===1)return input(`Dopuni jednakost: ${a} + ${b} = ___.`,r,q.difficulty);
    if(mode===2)return input(`Koji broj treba dodati broju ${a} da dobiješ ${r}?`,b,q.difficulty+1);
    if(mode===3){const c=numChoices(r,0,10000);return {type:'choice',difficulty:q.difficulty,question:`Koji je rezultat zbrajanja ${a} + ${b}?`,...c};}
    if(mode===4)return choice(`Koja jednakost ima rezultat ${r}?`,`${a} + ${b} = ${r}`,[`${a} + ${b} = ${r+1}`,`${a} + ${Math.max(0,b-1)} = ${r}`,`${a+1} + ${b} = ${r}`],q.difficulty+1);
    if(mode===5)return safeStory('+',a,b,r,i,generatorName.includes('1000')?3:2);
    if(mode===6)return choice(`Je li zbroj ${a} + ${b} veći, manji ili jednak broju ${r+1}?`,'manji',['veći','jednak'],q.difficulty+1);
    return input(`Broju ${a} dodaj ${b}. Koji broj dobiješ?`,r,q.difficulty);
  }
  m=q.question.match(/^Koliko je (\d+) - (\d+)\?$/); if(m){
    const a=+m[1],b=+m[2],r=a-b,mode=i%8;
    if(mode===0)return input(`Izračunaj razliku brojeva ${a} i ${b}.`,r,q.difficulty);
    if(mode===1)return input(`Dopuni jednakost: ${a} - ${b} = ___.`,r,q.difficulty);
    if(mode===2)return input(`Koliko treba oduzeti od ${a} da dobiješ ${r}?`,b,q.difficulty+1);
    if(mode===3){const c=numChoices(r,0,10000);return {type:'choice',difficulty:q.difficulty,question:`Koji je rezultat oduzimanja ${a} - ${b}?`,...c};}
    if(mode===4)return choice(`Koja jednakost ima rezultat ${r}?`,`${a} - ${b} = ${r}`,[`${a} - ${b} = ${r+1}`,`${a} - ${Math.max(0,b-1)} = ${r}`,`${a+1} - ${b} = ${r}`],q.difficulty+1);
    if(mode===5)return safeStory('-',a,b,r,i,generatorName.includes('1000')?3:2);
    if(mode===6)return choice(`Je li razlika ${a} - ${b} veća, manja ili jednaka broju ${r+1}?`,'manja',['veća','jednaka'],q.difficulty+1);
    return input(`Od broja ${a} oduzmi ${b}. Koji broj dobiješ?`,r,q.difficulty);
  }
  m=q.question.match(/^Koliko je (\d+) × (\d+)\?$/); if(m){
    const a=+m[1],b=+m[2],r=a*b,mode=i%8;
    if(mode===0)return input(`Izračunaj umnožak brojeva ${a} i ${b}.`,r,q.difficulty);
    if(mode===1)return input(`Dopuni: ${a} × ${b} = ___.`,r,q.difficulty);
    if(mode===2)return input(`Ako imamo ${skupina(a)} po ${predmeta(b)}, koliko je predmeta ukupno?`,r,q.difficulty);
    if(mode===3)return choice(`Koje ponovljeno zbrajanje odgovara računu ${a} × ${b}?`,Array(a).fill(b).join(' + '),[Array(Math.max(1,a-1)).fill(b).join(' + '),Array(a).fill(Math.max(0,b-1)).join(' + '),`${a} + ${b}`],q.difficulty+1);
    if(mode===4)return input(`Koji broj nedostaje: ${a} × ___ = ${r}?`,b,q.difficulty+1);
    if(mode===5)return choice(`Koji izraz ima vrijednost ${r}?`,`${a} × ${b}`,[`${a} × ${b+1}`,`${a+1} × ${b}`,`${a} + ${b}`],q.difficulty+1);
    if(mode===6)return input(`Na ${a} tanjura nalaze se po ${b} kolačića. Koliko je kolačića ukupno?`,r,q.difficulty+1);
    return input(`Koliko dobiješ kada broj ${b} zbrojiš sam sa sobom ${a} puta?`,r,q.difficulty+1);
  }
  m=q.question.match(/^Koliko je (\d+) ÷ (\d+)\?$/); if(m){
    const t=+m[1],d=+m[2],r=t/d,mode=i%8;
    if(mode===0)return input(`Izračunaj količnik brojeva ${t} i ${d}.`,r,q.difficulty);
    if(mode===1)return input(`Dopuni: ${t} ÷ ${d} = ___.`,r,q.difficulty);
    if(mode===2)return input(`${predmeta(t)} rasporedi jednako u ${skupina(d)}. Koliko je predmeta u svakoj skupini?`,r,q.difficulty);
    if(mode===3)return input(`${t} kartica podijeli među ${d} učenika tako da svi dobiju jednako. Koliko dobije svaki učenik?`,r,q.difficulty+1);
    if(mode===4)return input(`Koji broj nedostaje: ${d} × ___ = ${t}?`,r,q.difficulty+1);
    if(mode===5)return choice(`Koji račun provjerava da je ${t} ÷ ${d} = ${r}?`,`${r} × ${d} = ${t}`,[`${r} + ${d} = ${t}`,`${t} × ${d} = ${r}`,`${r} - ${d} = ${t}`],q.difficulty+1);
    if(mode===6)return choice(`Ako ${predmeta(t)} podijelimo u skupine po ${r}, koliko ćemo skupina dobiti?`,String(d),[String(d+1),String(Math.max(1,d-1)),String(r)],q.difficulty+1);
    return input(`Koliko puta broj ${d} stane u broj ${t}?`,r,q.difficulty);
  }
  return null;
}

function transformComparison(q,i){
  let m=q.question.match(/Koji znak dolazi umjesto kružića:\s*(\d+)\s+○\s+(\d+)\?/); if(!m)return null;
  const a=+m[1],b=+m[2]; const rel=a<b?'<':a>b?'>':'='; const mode=i%6;
  if(mode===0)return a===b?choice(`Jesu li brojevi ${a} i ${b} jednaki?`,'Da',['Ne'],2):choice(`Koji je broj veći: ${a} ili ${b}?`,String(Math.max(a,b)),[String(Math.min(a,b))],2);
  if(mode===1)return a===b?choice(`Koji znak usporedbe odgovara brojevima ${a} i ${b}?`,ZNAK_JEDNAKO,[ZNAK_MANJE,ZNAK_VECE],2):choice(`Koji je broj manji: ${a} ili ${b}?`,String(Math.min(a,b)),[String(Math.max(a,b))],2);
  if(mode===2)return choice(`Odaberi točnu usporedbu brojeva ${a} i ${b}.`,`${a} ${rel} ${b}`,[`${a} ${rel==='<'?'>':'<'} ${b}`,`${a} = ${b}`],2);
  if(mode===3)return input(`Upiši veći od brojeva ${a} i ${b}.`,Math.max(a,b),2);
  if(mode===4)return input(`Upiši manji od brojeva ${a} i ${b}.`,Math.min(a,b),2);
  if(mode===5)return choice(`Jesu li brojevi ${a} i ${b} jednaki?`,a===b?'Da':'Ne',[a===b?'Ne':'Da'],2);
  return choice(`Koji znak čini tvrdnju točnom: ${a} __ ${b}?`,rel,['<','>','='].filter(x=>x!==rel),2);
}

function transformLetter(q,i){
  let m=q.question.match(/^Koje je malo slovo od "([A-ZČĆĐŠŽ])"/u); if(m){const U=m[1],l=U.toLowerCase(),mode=i%5;
    if(mode===0)return choice(`Koje malo slovo odgovara velikom slovu ${U}?`,l,['a','e','m'].filter(x=>x!==l),1);
    if(mode===1)return input(`Koje malo tiskano slovo odgovara velikom slovu ${U}? Napiši samo jedno slovo.`,l,1,{konstrukt:'velikoSlovo'});
    if(mode===2)return choice(`U paru ${U} – ___ nedostaje koje malo slovo?`,l,[U,'a','e'].filter(x=>x!==l),1);
    if(mode===3)return choice(`Koje je od ovih slova malo slovo?`,l,[U,'B','D'],1);
    return input(`Koje malo slovo odgovara velikom slovu ${U}? Napiši samo jedno slovo.`,l,1,{konstrukt:'velikoSlovo'});
  }
  m=q.question.match(/^Koje je veliko slovo od "([a-zčćđšž])"/u); if(m){const l=m[1],U=l.toUpperCase(),mode=i%4;
    if(mode===0)return input(`Koje veliko tiskano slovo odgovara malom slovu ${l}? Napiši samo jedno slovo.`,U,1,{konstrukt:'velikoSlovo'});
    if(mode===1)return choice(`U paru ${l} – ___ nedostaje koje veliko slovo?`,U,[l,'A','E'].filter(x=>x!==U),1);
    if(mode===2)return choice(`Koje veliko slovo odgovara malom slovu ${l}?`,U,['A','E','M'].filter(x=>x!==U),1);
    return input(`Koje veliko slovo odgovara malom slovu ${l}? Napiši samo jedno slovo.`,U,1,{konstrukt:'velikoSlovo'});
  }
  return null;
}

function transformVowel(q,i){
  let m=q.question.match(/^Je li glas "([A-ZČĆĐŠŽ])" samoglasnik ili suglasnik\?/u); if(!m)return null;
  const g=m[1],is='AEIOU'.includes(g),mode=i%5;
  if(mode===0)return choice(`U koju skupinu pripada glas ${g}?`,is?'samoglasnici':'suglasnici',[is?'suglasnici':'samoglasnici'],1);
  if(mode===1)return choice(`Koja tvrdnja o glasu ${g} je točna?`,is?`${g} je samoglasnik.`:`${g} je suglasnik.`,[is?`${g} je suglasnik.`:`${g} je samoglasnik.`],2);
  if(mode===2)return choice(`Pripada li glas ${g} skupini samoglasnika?`,is?'Da':'Ne',[is?'Ne':'Da'],1);
  if(mode===3)return choice(`Pripada li glas ${g} skupini suglasnika?`,is?'Ne':'Da',[is?'Da':'Ne'],1);
  return choice(`Odaberi skupinu u kojoj se nalazi glas ${g}.`,is?'A, E, I, O, U':'suglasnici',['A, E, I, O, U','suglasnici'].filter(x=>x!==(is?'A, E, I, O, U':'suglasnici')),2);
}

function rewriteKnown(generatorName,q){
  let text=q.question;
  // Screenshot 2: terse geometry stems.
  text=text.replace(/^Kutovi ([^?]+)\?$/u,'Koliko kutova ima $1?');
  text=text.replace(/^Stranice ([^?]+)\?$/u,'Koliko stranica ima $1?');
  // Screenshot 3: do not use the undefined shorthand "Simetrija X?".
  text=text.replace(/^Simetrija "([^"]+)"\?$/u,'Ima li prikazano veliko tiskano slovo "$1" os simetrije?');
  // „Nakon "četvrtak"?” → „Koji dan dolazi nakon četvrtka?” (genitiv i prava vrsta).
  text=text.replace(/^(Nakon|Prije) "([^"]+)"\?$/u,(_,p,w)=>{
    const vrsta=HR.vrstaVremena(w)||'mjesec ili dan';
    const koji=vrsta==='godišnje doba'||vrsta==='doba dana'?'Koje':'Koji';
    return `${koji} ${vrsta} dolazi ${p.toLowerCase()} ${HR.genitivVremena(w)}?`;
  });
  text=text.replace(/^"([^"]+)" je _\. mjesec\?$/u,'Koji je po redu u godini mjesec $1?');
  text=text.replace(/^Slogovi "([^"]+)"\?$/u,'Koliko slogova ima riječ "$1"?');
  text=text.replace(/^Slično "([^"]+)"\?$/u,'Koja riječ ima slično značenje kao "$1"?');
  text=text.replace(/^Kratica za "([^"]+)"\?$/u,'Koja je kratica za stranu svijeta "$1"?');
  text=text.replace(/^Kakva je voda u rijeka\?$/u,'Kakva je voda u rijeci?');
  text=text.replace(/^Kakva je voda u more\?$/u,'Kakva je voda u moru?');
  text=text.replace(/^Kakva je voda u jezero\?$/u,'Kakva je voda u jezeru?');
  text=text.replace(/^Kakva je voda u ocean\?$/u,'Kakva je voda u oceanu?');
  text=text.replace(/^Kakva je voda u potok\?$/u,'Kakva je voda u potoku?');
  text=text.replace(/^Koja glagol /u,'Koji glagol ');
  text=text.replace(/^Koja pridjev /u,'Koji pridjev ');
  if(text!==q.question) q={...q,question:text};

  if(generatorName==='genJezicnoIzrazavanje' && q.question.startsWith('Koji je redoslijed pravilan?')){
    q={...q,question:q.question.replace('Koji je redoslijed pravilan?','Je li prikazani redoslijed događaja logičan?')};
  }
  if(generatorName==='genTloVodaZrak' && q.question==='Što najviše onečišćuje zrak?') q={...q,question:'Koji od navedenih primjera onečišćuje zrak?'};
  if(generatorName==='genTloVodaZrak' && q.question==='Kako se zove stalno kruženje vode u prirodi?') q={...q,question:'Koji redoslijed najbolje prikazuje kruženje vode u prirodi?'};
  if(generatorName==='genUvjetiZivota' && q.question==='Što biljka stvara fotosintezom?') q={...q,question:'Koji plin biljka oslobađa tijekom fotosinteze?'};
  if(generatorName==='genLjudskoTijelo' && q.question==='Koliko obroka dnevno treba jesti?') q=choice('Koja navika najbolje podupire zdravu prehranu?','redoviti i raznoliki obroci',['jesti samo jednu vrstu hrane','preskakati obroke','jesti samo slatkiše'],2);
  if(generatorName==='genKnjizevniTekst' && q.question==='Koji su dijelovi priče?') q=choice('Koje riječi pomažu pratiti redoslijed događaja u priči?','najprije, zatim, na kraju',['crven, plav, zelen','stol, stolica, ormar','veselo, tužno, ljutito'],2);
  if(generatorName==='genZavicajKarta' && q.question.includes('zelena boja')) q=choice('Na fizičkoj karti, kojom se bojom najčešće prikazuju nizine?','zelenom',['plavom','smeđom','crnom'],2);
  if(generatorName==='genZavicaj' && q.question.includes('zelena boja')) q=choice('Na fizičkoj karti, kojom se bojom najčešće prikazuju nizine?','zelenom',['plavom','smeđom','crnom'],2);
  if(generatorName==='genZavicaj' && q.question==='Tko gasi požar?') q=choice('Koja služba gasi požare?','vatrogasci',['policija','hitna medicinska služba','poštari'],2);
  if(generatorName==='genZavicaj' && q.question==='Tko čuva red?') q=choice('Koja služba brine o javnoj sigurnosti i redu?','policija',['vatrogasci','pošta','knjižnica'],2);
  if(generatorName==='genZavicaj' && q.question==='Gdje jedemo u restoranu?') q=choice('U kojoj ustanovi možemo naručiti pripremljen obrok?','restoran',['knjižnica','pošta','bolnica'],2);
  if(generatorName==='genZavicaj' && q.question==='Gdje se mole?') q=choice('Koja je od ponuđenih građevina vjerska građevina?','crkva',['škola','pošta','kino'],2);
  if(generatorName==='genZavicaj' && q.question==='Što je zavičaj?') q=choice('Što najbolje opisuje zavičaj?','prostor s kojim smo povezani životom, ljudima i iskustvima',['samo jedna zgrada','bilo koja strana država','samo mjesto rođenja'],2);
  return q;
}

function shouldRemove(generatorName,q){
  const t=(q.question||'').toLowerCase();
  if(generatorName==='genBrojevi' && t.includes('paran ili neparan')) return true;
  // Binarne oznake hrane ("zdravo/nije zdravo") uklonjene su i u drugim temama.
  if(generatorName==='genTijelo' && t.startsWith('je li ova hrana zdrava')) return true;
  if(generatorName==='genRecenice' && t.startsWith('kako se pravilno piše ime koje označava')) return true;
  if(generatorName==='genGlasovi' && t.startsWith('svaka riječ ima barem jedan samoglasnik')) return true;
  if(generatorName==='genDoba' && ['kada idemo na more','kada nosimo jaknu','kada pada kiša','kada jedemo sladoled','kada idemo u školu','kada imamo odmor za ručak','kada igramo se vani','kada se igramo vani','kada gledamo tv'].some(x=>t.startsWith(x))) return true;
  if(generatorName==='genZivotinje' && (t.includes('domaća ili divlja') || t.startsWith('čime se hrani '))) return true;
  if(generatorName==='genGeometrija' && (t.startsWith('što se najčešće nalazi ispred kuće')||t.startsWith('što se najčešće nalazi iza kuće'))) return true;
  if(generatorName==='genDobaVrijeme' && t.startsWith('koliko sati pokazuje ovaj sat')) return true;
  if(generatorName==='genVodaTlo' && (t.includes('na kojoj se temperaturi voda smrzava')||t.includes('na kojoj temperaturi voda ključa'))) return true;
  if(generatorName==='genZavicaj' && t.includes('žuta boja')) return true;
  if(generatorName==='genBiljkeZivotinje' && t.startsWith('kakva je životinja') && /riba|ptica|zec|kornjača/.test(t)) return true;
  if(generatorName==='genGospodarskeDjelatnosti' && t.startsWith('koji reljefni oblik odgovara opisu')) return true;
  if(generatorName==='genUvjetiZivota' && t==='što je biljci potrebno za fotosintezu?') return true;
  // Grade 2 curriculum: no pentagon/hexagon/octagon or symmetry outcome here.
  if(generatorName==='genGeometrija2' && (/peterokut|šesterokut|osmerokut/.test(t) || t.startsWith('simetrija ') || t.includes('os simetrije'))) return true;
  // Inaccurate capped visual addition from old R2 generator.
  if(generatorName==='genZbrajanje100' && q.visual && q.question==='Koliko je ukupno?') return true;
  return false;
}

function diversifySpecific(generatorName,q,i){
  let x;
  if(generatorName==='genBrojevi' && q.question.startsWith('Prebroji koliko ih ima na slici')) return transformVisualCount(q,i);
  if(generatorName==='genMjerenjeNovac' && /^Koliko je \d+ € [+-] \d+ €\?$/.test(q.question)) return transformMoney(i);
  if(['genZbrajanje100','genOduzimanje100','genMnozenjeDijeljenje','genMnozDijel3','genZbrOduz1000'].includes(generatorName)){
    x=transformMath(q,i,generatorName); if(x)return x;
  }
  if(generatorName==='genUsporedbe'){x=transformComparison(q,i);if(x)return x;}
  if(generatorName==='genSlova'){x=transformLetter(q,i);if(x)return x;}
  if(generatorName==='genGlasovi'){x=transformVowel(q,i);if(x)return x;}

  // Repetitive lexical questions: alternate recognition, sentence use and matching.
  let m=q.question.match(/^Koja riječ znači suprotno od riječi "([^"]+)"\?/u);
  if(m && q.type==='choice'){
    const w=m[1],c=q.answers?.[q.correctIndex]; const mode=i%4;
    if(mode===0)return choice(`Dovrši par suprotnih značenja: ${w} – ___.`,c,q.answers.filter(a=>a!==c),q.difficulty);
    if(mode===1)return choice(`Koja riječ NE znači isto što i riječ ${w}, nego njezinu suprotnost?`,c,q.answers.filter(a=>a!==c),q.difficulty);
    if(mode===2)return {...q,question:`U paru „${w} — ${c}” riječi imaju kakav odnos značenja?`,answers:['suprotno značenje','isto značenje','nisu riječi','isto slovo'],correctIndex:0};
    return {...q,question:`Odaberi riječ koja najbolje dovršava par: ${w} ↔ ___.`};
  }
  m=q.question.match(/^Pročitaj rečenicu: "([^"]+)" Kakva je to rečenica\?/u);
  if(m){const c=q.type==='choice'?q.answers[q.correctIndex]:q.correctAnswer; const base=m[1],mode=i%4;
    if(mode===0)return choice(`Koji rečenični znak na kraju pomaže prepoznati ovu rečenicu: „${base}”?`,base.endsWith('?')?'upitnik':base.endsWith('!')?'uskličnik':'točka',['točka','upitnik','uskličnik'].filter(x=>x!==(base.endsWith('?')?'upitnik':base.endsWith('!')?'uskličnik':'točka')),2);
    if(mode===1)return choice(`Što govornik ovom rečenicom radi: „${base}”?`,String(c).startsWith('upit')?'postavlja pitanje':String(c).startsWith('usklič')?'izražava usklik ili osjećaj':'nešto izjavljuje',['postavlja pitanje','izražava usklik ili osjećaj','nešto izjavljuje'].filter(x=>x!==(String(c).startsWith('upit')?'postavlja pitanje':String(c).startsWith('usklič')?'izražava usklik ili osjećaj':'nešto izjavljuje')),2);
    if(mode===2)return choice(`Odaberi oznaku vrste rečenice za primjer „${base}”.`,String(c),['izjavna','upitna','usklična'].filter(x=>x!==String(c)),2);
    return q;
  }
  // Surface language: eliminate terse forms without merely paraphrasing.
  m=q.question.match(/^Što imenuje riječ "([^"]+)"\?/u); if(m){const c=q.answers?.[q.correctIndex]; const w=m[1],mode=i%3;
    if(mode===0)return choice(`U koju skupinu po značenju pripada imenica ${w}?`,c,q.answers.filter(a=>a!==c),2);
    if(mode===1)return choice(`Dovrši rečenicu: „Riječ ${w} ime je za ___.”`,c,q.answers.filter(a=>a!==c),2);
    return {...q,question:`Što je riječ ${w}: naziv osobe, životinje, predmeta, mjesta ili pojave?`};
  }
  return q;
}


function curateKnownBank(generatorName, qs){
  if(generatorName==='genSlova'){ let li=0; qs=qs.map(q=>transformLetter(q,li++)||q); }
  // Grade 1 HJ: functional language use instead of isolated terminology.
  if(generatorName==='genGlasovi'){
    qs=qs.map(q=>{
      if(/^Samoglasnika ima \d+\.$/.test(q.question||'')){
        const correct=String(q.correctAnswer ?? q.answers?.[q.correctIndex]);
        return choice('Koliko samoglasnika ima hrvatski jezik?',correct,[correct==='5'?'6':'5','4','7'],2);
      }
      return q;
    });
  }
  if(generatorName==='genRecenice'){
    qs=qs.filter(q=>!/Kako glasi (jednina|množina)|Kako glasi umanjenica/.test(q.question||''));
    const extra=[
      choice('U rečenici „Pas trči.” koja riječ govori tko trči?','Pas',['trči','rečenica','točka'],2),
      choice('Koja rečenica govori o više životinja?','Psi trče.',['Pas trči.','Mačka spava.','Ptica leti.'],2),
      choice('Koja rečenica govori o jednoj knjizi?','Knjiga je na stolu.',['Knjige su na stolu.','Čitamo knjige.','Police imaju knjige.'],2),
      choice('Koja riječ znači malu mačku?','mačkica',['mačka','mačak','mačke'],2),
      choice('Koja riječ znači maloga psa?','psić',['pas','psi','pseći'],2),
      choice('Koja riječ znači malu kuću?','kućica',['kuća','kuće','kućni'],2),
      choice('Dovrši rečenicu: „U dvorištu su dva ___.”','psa',['pas','psić','pseći'],2),
      choice('Dovrši rečenicu: „Na grani sjede tri ___.”','ptice',['ptica','ptičica','ptičji'],2),
      choice('Koja je rečenica potpuna?','Ana čita knjigu.',['Ana knjigu.','Čita.','Ana i.'],2),
      choice('Koja rečenica najbolje odgovara pitanju „Tko spava?”','Mačka spava.',['Spava na kauču.','Kauč je mekan.','Gdje je mačka?'],2),
      choice('Koja riječ najbolje dovršava ovu rečenicu? „Na stolu je jedna ___.”','olovka',['olovke','olovaka','olovkom'],2),
      choice('Koja riječ najbolje dovršava ovu rečenicu? „U pernici su dvije ___.”','olovke',['olovka','olovkom','olovaka'],2)
    ];
    qs.push(...extra);
  }

  // Grade 1 mathematics: never rely on an icon equation whose drawn count can disagree with the stored answer.
  if(generatorName==='genBrojevi'){
    let vi=0; qs=qs.map(q=>q.visual && /Prebroji koliko ih ima na slici/.test(q.question||'') ? transformVisualCount(q,vi++) : q);
  }
  if(generatorName==='genZbrajanje' || generatorName==='genOduzimanje'){
    // Remove generated icon equations and prose templates. Keep clean symbolic/choice items, then add varied representations.
    qs=qs.filter(q=>!q.visual && !/( ima | dobije | kupila | nacrta | pročita |na grani|na igralištu|na stolu| skupi | doda |u prvom redu|u školi| pokloni | pojede | potroši | ode | ostane |zajedno\?|ukupno\?)/i.test(' '+(q.question||'')));
    if(generatorName==='genZbrajanje') qs.push(
      choice('Koji račun daje rezultat 7?','3 + 4',['2 + 4','1 + 5','5 + 3'],2),
      input('Dopuni jednakost: 6 + ___ = 10.',4,2),
      choice('Na koja dva broja možemo rastaviti broj 8?','5 i 3',['5 i 4','6 i 3','7 i 2'],2),
      input('Kreni od broja 4 i pomakni se 3 mjesta naprijed na brojevnoj crti. Na kojem si broju?',7,2),
      choice('Koji je zbroj jednak 10?','6 + 4',['6 + 3','5 + 4','8 + 1'],2),
      input('Broju 2 dodaj 5. Koji broj dobiješ?',7,1),
      choice('Koja jednakost je točna?','4 + 5 = 9',['4 + 5 = 8','3 + 5 = 9','5 + 5 = 9'],2),
      input('Koliko nedostaje od 7 do 10?',3,2)
    );
    else qs.push(
      choice('Koji račun daje rezultat 4?','9 - 5',['8 - 5','7 - 2','10 - 5'],2),
      input('Dopuni jednakost: 10 - ___ = 6.',4,2),
      choice('Od broja 9 oduzmemo 3. Koji rezultat dobivamo?','6',['5','7','8'],1),
      input('Kreni od broja 8 i pomakni se 3 mjesta unatrag na brojevnoj crti. Na kojem si broju?',5,2),
      choice('Koja jednakost je točna?','7 - 2 = 5',['7 - 2 = 4','8 - 2 = 5','6 - 2 = 5'],2),
      input('Dopuni jednakost: 10 - ___ = 7.',3,2),
      choice('Koja razlika je jednaka 2?','6 - 4',['6 - 3','5 - 2','8 - 5'],2),
      input('Od broja 9 oduzmi 1. Koji broj dobiješ?',8,1)
    );
  }
  if(generatorName==='genUsporedbe'){
    let j=0; qs=qs.map(q=>/^Koji znak dolazi umjesto kružića:/.test(q.question||'') ? (transformComparison(q,j++)||q) : q)
             .filter(q=>!/( ima \d+ perlica|Tko ima više)/.test(q.question||''));
  }
  if(generatorName==='genGeometrija'){
    qs=qs.map(q=>{
      let t=q.question||'';
      t=t.replace('oblik valjaka','oblik valjka').replace('oblik stožaca','oblik stošca')
           .replace('Koji geometrijski lik ima nema stranica ni kutova?','Koji geometrijski lik nema ravne stranice ni vrhove?');
      if(/^Koji predmet ima oblik /.test(t)){
        // "ima oblik kugle" (genitiv) → "podsjeća na kuglu" (akuzativ)
        const AK={kugle:'kuglu',valjka:'valjak',kocke:'kocku',kvadra:'kvadar',kvadara:'kvadar',stošca:'stožac',piramide:'piramidu'};
        t=t.replace(/^Koji predmet ima oblik (\p{L}+)\?$/u,(m,w)=>`Koji predmet oblikom najviše podsjeća na ${AK[w]||w}?`);
      }
      if(/^Koji oblik ima (novčić|sat|prozor|krov kuće|pizza|bilježnica)\?$/.test(t)) t=t.replace(/^Koji oblik ima /,'Na koji geometrijski lik najviše podsjeća obris predmeta: ').replace(/\?$/, '?');
      if(t==='Koliko stranica ima krug?') return choice('Odaberi točan opis kruga.','nema ravnih stranica',['ima tri ravne stranice','ima četiri ravne stranice'],2);
      t=t.replace(/^Koji geometrijski lik ima /,'Prepoznaj geometrijski lik prema opisu: ');
      t=t.replace(/^Koliko stranica ima trokut\?$/,'Koliki je broj stranica trokuta?');
      t=t.replace(/^Koliko stranica ima kvadrat\?$/,'Koliki je broj stranica kvadrata?');
      t=t.replace(/^Koliko stranica ima pravokutnik\?$/,'Koliki je broj stranica pravokutnika?');
      t=t.replace(/^Koji oblik ima (.+)\?$/u,'Kojem geometrijskom tijelu ili liku oblikom najviše nalikuje $1?');
      return {...q,question:t};
    });
  }

  // Grade 1/2 health: replace binary moral labels for food with habits and varied meals.
  if(generatorName==='genEkologija'){
    qs=qs.filter(q=>!/(zdrava hrana|zdravi\.|slatkiši su zdravi|voće je zdravo|koliko vode trebamo piti dnevno)/i.test(q.question||''));
    qs.push(
      choice('Koji obrok je raznolikiji?','jogurt, zobene pahuljice i voće',['samo bomboni','samo čips','samo sok'],2),
      choice('Što je dobar izbor kada smo žedni?','voda',['energetsko piće','sirup','slatkiši'],1),
      choice('Zašto je dobro jesti različite vrste hrane?','tijelu trebaju različite hranjive tvari',['da svaki obrok bude iste boje','da preskačemo obroke','da jedemo samo slatko'],3),
      choice('Koja navika pripada brizi o zdravlju?','redovito prati ruke',['preskakati pranje zuba','piti samo zaslađena pića','spavati vrlo malo'],2)
    );
  }
  if(generatorName==='genZdravljeSigurnost2'){
    qs=qs.filter(q=>!/(zdravo\?|namirnica.*zdrava|namirnica.*nije zdrava|koliko sati sna treba djetetu|što prvo činimo kod opekline)/i.test(q.question||''));
    qs.push(
      choice('Koji je primjer raznolikog doručka?','kruh, sir i voće',['samo bomboni','samo čips','samo gazirano piće'],2),
      choice('Što je dobar izbor kada smo žedni?','voda',['energetsko piće','slatkiši','čips'],1),
      choice('Zašto su redovit san i odmor važni?','pomažu tijelu i mozgu da se odmore',['zamjenjuju pranje zuba','znače da ne trebamo kretanje','služe samo vikendom'],2),
      choice('Što učiniti ako se opečeš?','odmah obavijestiti odraslu osobu i hladiti opeklinu pod tekućom vodom',['sakriti ozljedu','staviti led izravno na kožu i ništa ne reći','nastaviti se igrati vatrom'],3),
      choice('Koja navika pomaže čuvati zube?','redovito pranje zuba',['pranje jednom tjedno','jesti slatkiše nakon svakog obroka','ne koristiti četkicu'],2),
      choice('Koja kombinacija čini raznolikiji međuobrok?','voće i jogurt',['samo bomboni','samo čips','samo gazirano piće'],2)
    );
  }

  // Animal questions: avoid pretending a broad species name has exactly one habitat or one food.
  if(generatorName==='genZivotinje'){
    qs=qs.filter(q=>!/^Gdje živi /.test(q.question||''));
    qs.push(
      choice('Koja životinja ima perje?','ptica',['pas','riba','žaba'],1),
      choice('Koja životinja ima škrge?','riba',['mačka','ptica','konj'],1),
      choice('Koja životinja ima šest nogu?','mrav',['pas','pauk','ptica'],2),
      choice('Koja životinja ima osam nogu?','pauk',['mrav','pas','riba'],2),
      choice('Koja životinja može letjeti i ima perje?','ptica',['riba','krava','žaba'],1),
      choice('Koja životinja proizvodi med?','pčela',['krava','ovca','kokoš'],1)
    );
  }
  if(generatorName==='genBiljkeZivotinje') qs=qs.filter(q=>!/^Gdje živi /.test(q.question||''));
  if(generatorName==='genBiljkeZivotinje3'){
    qs=qs.filter(q=>!/^Gdje živi /.test(q.question||''));
    qs=qs.map(q=>{
      const m=(q.question||'').match(/^Čime se hrani "([^"]+)"\?$/u);
      return m?{...q,question:`Prema načinu prehrane, je li ${m[1]} biljožder, mesožder ili svežder?`}:q;
    });
  }

  if(generatorName==='genGlagoli2'){
    qs=qs.filter(q=>!/^Tko najčešće obavlja ovu radnju/.test(q.question||'') && !/^Što najčešće radi dijete\?/.test(q.question||''));
    qs=qs.map(q=>{
      const m=(q.question||'').match(/^Što najčešće radi (.+)\?$/u);
      if(!m) return q;
      return {...q,question:`Koja radnja smisleno dovršava ovu rečenicu? „${m[1][0].toUpperCase()+m[1].slice(1)} ___.”`};
    });
  }

  if(generatorName==='genVodaTlo'){
    qs=qs.map(q=>{
      if(q.question==='Kako se zove stalno kruženje vode u prirodi?') return {...q,question:'Koji redoslijed najbolje opisuje kruženje vode u prirodi?'};
      const m=(q.question||'').match(/^Kakva je voda u (rijeci|moru|jezeru|oceanu|potoku)\?$/u);
      if(m) return {...q,question:`Je li voda u ${m[1]} slatka ili slana?`};
      return q;
    });
  }
  if(generatorName==='genDoba') qs=qs.filter(q=>!/^Kada (cvjeta cvijeće|beremo voće)\?/.test(q.question||''));

  // Grade 4 language: test the spelling decision in context, not by showing the answer in the stem.
  if(generatorName==='genVrsteRijeci4'){
    qs=qs.map(q=>{
      const m=(q.question||'').match(/^Kako pišemo riječ "([^"]+)"\?$/u); if(!m)return q;
      const w=m[1], big=(q.answers?.[q.correctIndex]||q.correctAnswer)==='velikim';
      const lower=w[0].toLowerCase()+w.slice(1), upper=w[0].toUpperCase()+w.slice(1);
      const corr=big?upper:lower;
      return choice(`Koji je zapis riječi pravilan: ${upper} ili ${lower}?`,corr,[big?lower:upper],2);
    });
  }

  // Grade 4 math: natural Croatian and realistic large-number contexts.
  if(generatorName==='genOpsegPovrsina'){
    qs=qs.map(q=>{
      let m=(q.question||'').match(/^Pravokutni lik u kvadratnoj mreži prekriven je s (\d+) redaka po (\d+) jediničnih kvadrata\./u);
      if(m) return {...q,question:`Na kvadratnoj mreži pravokutnik zauzima ${m[1]} × ${m[2]} polja. Koliko polja zauzima ukupno?`};
      m=(q.question||'').match(/^Lik A zauzima (\d+) jediničnih kvadrata, a lik B (\d+)\. Koji lik ima veću površinu\?$/u);
      if(m) return {...q,question:`Lik A prekriva ${HR.brojIme(Number(m[1]),"polje")} mreže, a lik B ${HR.brojIme(Number(m[2]),"polje")}. Koji lik zauzima veću površinu?`};
      m=(q.question||'').match(/^Lik A zauzima (\d+), a lik B (\d+) jediničnih kvadrata\. Za koliko je površina lika B veća\?$/u);
      if(m) return {...q,question:`Lik A prekriva ${HR.brojIme(Number(m[1]),"polje")} mreže, a lik B ${HR.brojIme(Number(m[2]),"polje")}. Za koliko polja lik B zauzima veću površinu?`};
      return q;
    });
  }
  if(generatorName==='genPisanoZbrOduz'){
    qs=qs.map(q=>{
      const t=q.question||''; const nums=(t.match(/\d+/g)||[]).map(Number); const c=Number(q.correctAnswer ?? q.answers?.[q.correctIndex]);
      if(nums.length>=2 && Math.max(...nums)>=1000 && !/^\d+\s*[+\-]/.test(t)){
        const a=nums[0],b=nums[1];
        if(a+b===c) return input(`Tvornica je u prvom mjesecu proizvela ${HR.brojIme(a,"komad")} proizvoda, a u drugom ${b}. Koliko je komada proizvedeno ukupno?`,c,3);
        if(a-b===c) return input(`U skladištu je bilo ${HR.brojIme(a,"paket")}. Otpremljeno je ${HR.brojIme(b,"paket")}. Koliko je paketa ostalo?`,c,3);
      }
      return q;
    });
    qs.push(
      input('Izračunaj zbroj brojeva 24 638 i 13 251. Koji rezultat dobivaš?',37889,3),
      input('Izračunaj razliku brojeva 58 420 i 16 305. Koji rezultat dobivaš?',42115,3),
      input('Koji broj nedostaje u jednakosti 32 450 + ___ = 50 000?',17550,3),
      input('Koji broj nedostaje u jednakosti 70 000 - ___ = 46 250?',23750,3),
      choice('Koji izraz ima veći rezultat?','35 000 + 14 000',['60 000 - 12 000','oba imaju jednak rezultat'],3),
      input('Muzej je u travnju posjetilo 12 450 ljudi, a u svibnju 15 320. Koliko je posjetitelja bilo ukupno?',27770,3),
      input('Skladište je imalo 64 800 paketa. Otpremljeno je 18 450. Koliko je paketa ostalo?',46350,3),
      choice('Koja procjena najbolje odgovara zbroju 41 230 + 27 680?','oko 69 000',['oko 50 000','oko 80 000','oko 100 000'],3)
    );
  }

  if(generatorName==='genBiljkeZivotinje4'){
    qs=qs.map(q=>{
      if((q.question||'').includes('"rađaju žive, doje"')) return {...q,question:(q.question||'').replace('"rađaju žive, doje"','"mladunce hrane mlijekom; većina ima dlaku"')};
      return q;
    });
  }
  if(generatorName==='genNizovi') qs=qs.map(q=>q.question==='Čime mjerimo težinu?'?{...q,question:'Čime mjerimo masu?'}:q);
  // Tlo/voda/zrak (3. r.) i uvjeti života (4. r.): čišćenje starog fonda i
  // zadatci u više obitelji nad istim činjenicama (seeds/gen-pid-uvjeti.js).
  qs=PID_UVJETI.prosiri(generatorName,qs);
  // Kutovi (4. r.), Zavičaj i karta i Kulturna baština (3. r.).
  if(generatorName==='genGeometrijaKutovi') qs=[...KUTOVI.ocistiKutove(qs),...KUTOVI.genKutoviDodatak()];
  if(generatorName==='genZavicajKarta') qs=[...ZAVICAJ.ocistiZavicajKarta(qs),...ZAVICAJ.genZavicajKartaDodatak()];
  if(generatorName==='genKulturnaBastina') qs=[...ZAVICAJ.ocistiKulturnaBastina(qs),...ZAVICAJ.genKulturnaBastinaDodatak()];
  if(generatorName==='genMedijskaKultura') qs=[...MEDIJI.ocistiMedije(qs),...MEDIJI.genMedijiDodatak()];
  return qs;
}

function reviewQuestions(generatorName, questions){
  let qs=(questions||[]).filter(q=>!shouldRemove(generatorName,q)).map(q=>rewriteKnown(generatorName,{...q}));
  qs=curateKnownBank(generatorName,qs);

  // Money: payment is explicitly one real coin/banknote denomination, not an arbitrary total like 7 €.
  if(generatorName==='genMjerenjeNovac'){
    qs=qs.filter(q=>!/^.+ kupi .+ za \d+ eur/.test((q.question||'').toLowerCase()));
    const pay=[5,10,20,50,100];
    for(let i=0;i<15;i++){
      const p=pay[i%pay.length]; const price=Math.max(1,p-(i%4+1));
      qs.push(input(`Igračka stoji ${price} €. David plati novčanicom od ${p} €. Koliko eura dobije natrag?`,p-price,3));
    }
  }

  // Replace removed Grade-2 geometry material with curriculum-aligned dužine, vrhovi, stranice and bodies.
  if(generatorName==='genGeometrija2'){
    const extra=[
      choice('Koji lik ima tri stranice i tri vrha?','trokut',['kvadrat','pravokutnik','krug'],2),
      choice('Koji lik ima četiri jednake stranice?','kvadrat',['trokut','krug','pravokutnik'],2),
      choice('Koji lik ima četiri stranice i četiri vrha?','pravokutnik',['trokut','krug','kugla'],2),
      input('Koliko vrhova ima trokut?',3,2), input('Koliko vrhova ima kvadrat?',4,2), input('Koliko vrhova ima pravokutnik?',4,2),
      choice('Kako zovemo najkraću spojnicu dviju točaka?','dužina',['krivulja','krug','ploha'],3),
      choice('Koja geometrijska tijela imaju ravne plohe?','kocka, kvadar i piramida',['samo kugla','samo krug','samo trokut'],3),
      choice('Što su bridovi kocke?','dužine',['točke','krugovi','zakrivljene crte'],3),
      choice('Što su vrhovi geometrijskog tijela?','točke',['dužine','plohe','kružnice'],3)
    ]; qs.push(...extra);
  }

  // Replace deleted economics copy/paste items with correctly framed economic-activity tasks.
  if(generatorName==='genGospodarskeDjelatnosti'){
    const data=[['uzgoj biljaka i životinja','poljoprivreda'],['lov i uzgoj ribe','ribarstvo'],['briga o šumama','šumarstvo'],['putovanje i odmor','turizam'],['proizvodnja u tvornicama','industrija'],['kupovina i prodaja','trgovina'],['ručna izrada proizvoda','obrt'],['prijevoz ljudi i robe','promet'],['gradnja zgrada i cesta','građevinarstvo']];
    const all=data.map(x=>x[1]); data.forEach(([opis,c])=>qs.push(choice(`Kojoj gospodarskoj djelatnosti pripada opis „${opis}”?`,c,all.filter(x=>x!==c),2)));
  }


  // Izvorni tekstovi za čitanje s pitanjima po procesima razumijevanja.
  if (TEKSTOVI_ZA_GENERATOR[generatorName]) qs.push(...pitanjaZaTemu(TEKSTOVI_ZA_GENERATOR[generatorName]));
  // Dodatna pitanja za teme s malom bankom (seeds/dodatci): više oblika iste
  // činjenice i nasumični brojevi, da se tekst ne ponavlja ni nakon 20 kvizova.
  qs.push(...dodatciZa(generatorName));

  // Family diversification. Keep a useful drill core; transform surplus instances into other representations.
  const groups=new Map();
  qs.forEach((q,idx)=>{const k=questionFamilyKey(q);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(idx);});
  for(const idxs of groups.values()){
    if(idxs.length<12)continue;
    const keep=generatorName.startsWith('gen') && /Zbrajanje|Oduzimanje|Mnoz|Brojevi|Usporedbe/.test(generatorName)?8:5;
    idxs.forEach((idx,pos)=>{if(pos>=keep)qs[idx]=diversifySpecific(generatorName,qs[idx],pos-keep);});
  }
  // Final safeguard: after transformations no quiz bank should be dominated by one identical stem.
  // We keep a small drill set and remove surplus clones that could teach the UI pattern instead of the concept.
  const seen=new Map();
  qs=qs.filter(q=>{
    const k=questionFamilyKey(q); const n=(seen.get(k)||0)+1; seen.set(k,n);
    const mathFluency=/^\d+\s*[+\-×÷]\s*\d+\s*=\s*\?$/.test(q.question||'');
    const cap=mathFluency?24:10;
    return n<=cap;
  });
  // Objašnjenja (postupak ili pravilo, nikad samo „točan odgovor je…”),
  // stabilna oznaka predloška i sadržajni ključ zadatka.
  const oznaceno = qs.map((q) => {
    const x = dodajObjasnjenje(q);
    return { ...x, templateId: templateIdZa(generatorName, x), itemKey: itemKeyZa(x) };
  });
  return dodajSkupinska(oznaceno);
}

/** Polja koja seed i generiranje upisuju uz pitanje (osim osnovnih). */
function storedExtras(q) {
  const out = {};
  for (const k of ['templateId', 'itemKey', 'objasnjenjeIzvor', 'objasnjenjeVrsta', 'proces', 'tekstId', 'ishod', 'mreza']) {
    if (q[k] !== undefined && q[k] !== null && q[k] !== '') out[k] = q[k];
  }
  return out;
}

function wrapGenerator(fn){
  const wrapped=function(...args){return reviewQuestions(fn.name,fn(...args));};
  Object.defineProperty(wrapped,'name',{value:fn.name});
  return wrapped;
}

module.exports={reviewQuestions,wrapGenerator,storedExtras,templateIdZa,itemKeyZa};
