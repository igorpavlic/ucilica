/**
 * seed-r2.js — Učilica generatori za 2. razred
 * Prema GIK Razredna nastava 2. razred OS
 * 
 * Predmeti: Hrvatski jezik, Matematika, Priroda i društvo
 * Pokretanje: node seeds/seed-r2.js (iz backend/ mape)
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const { MongoClient } = require("mongodb");
const { N, IF, IM, sh, cfc, rep, fix, EL, CIRCLE } = require("./gen-hrvatski");

const GRADE = 2;

// ═══════════════════════════════════════════════════════
// PREDMETI I TEME
// ═══════════════════════════════════════════════════════
const subjects = [
  { name: "Hrvatski jezik", slug: "hrvatski", icon: "📖", color: "#FF6B6B", description: "Imenice, rečenice, čitanje i pisanje", order: 1 },
  { name: "Matematika", slug: "matematika", icon: "🔢", color: "#60A5FA", description: "Brojevi do 100, zbrajanje, oduzimanje, množenje", order: 2 },
  { name: "Priroda i društvo", slug: "priroda", icon: "🌿", color: "#34D399", description: "Zavičaj, vode, tlo, biljke, životinje", order: 3 }
];

const topicsDef = {
  hrvatski: [
    { name: "Imenice i rod", slug: "imenice-rod", icon: "📝", order: 1 },
    { name: "Glagoli", slug: "glagoli-2", icon: "🏃", order: 2 },
    { name: "Rečenice i interpunkcija", slug: "recenice-2", icon: "💬", order: 3 },
    { name: "Čitanje i razumijevanje", slug: "citanje-2", icon: "📚", order: 4 },
  ],
  matematika: [
    { name: "Brojevi do 100", slug: "brojevi-100", icon: "🔢", order: 1 },
    { name: "Zbrajanje do 100", slug: "zbrajanje-100", icon: "➕", order: 2 },
    { name: "Oduzimanje do 100", slug: "oduzimanje-100", icon: "➖", order: 3 },
    { name: "Množenje i dijeljenje", slug: "mnozenje-dijeljenje", icon: "✖️", order: 4 },
    { name: "Geometrija 2", slug: "geometrija-2", icon: "📐", order: 5 },
    { name: "Mjerenje i novac", slug: "mjerenje-novac", icon: "💰", order: 6 },
  ],
  priroda: [
    { name: "Zavičaj i snalaženje", slug: "zavicaj", icon: "🗺️", order: 1 },
    { name: "Godišnja doba i vrijeme", slug: "doba-vrijeme", icon: "🌦️", order: 2 },
    { name: "Biljke i životinje", slug: "biljke-zivotinje", icon: "🌱", order: 3 },
    { name: "Voda i tlo", slug: "voda-tlo", icon: "💧", order: 4 },
    { name: "Zdravlje i sigurnost", slug: "zdravlje-sigurnost-2", icon: "🏥", order: 5 },
  ]
};

// ═══════════════════════════════════════════════════════
// HRVATSKI JEZIK — 2. RAZRED
// ═══════════════════════════════════════════════════════

function genImeniceRod() {
  const q = [];
  // Imenice — muški, ženski, srednji rod
  const m = ["stol","pas","grad","brat","auto","vlak","sat","konj","zec","lav","medvjed","otac","dječak","učenik","prozor","ključ"];
  const z = ["kuća","škola","mama","sestra","knjiga","olovka","ruka","noga","voda","jabuka","mačka","učiteljica","ulica","zemlja","rijeka","šuma"];
  const s = ["dijete","sunce","more","selo","drvo","jaje","mlijeko","pismo","nebo","polje","jezero","proljeće","ljeto","uho","oko","srce"];
  
  m.forEach(w => q.push({ type:"choice", difficulty:1, question:`Koji je rod imenice "${w}"?`, answers:["muški","ženski","srednji"], correctIndex:0 }));
  z.forEach(w => q.push({ type:"choice", difficulty:1, question:`Koji je rod imenice "${w}"?`, answers:["muški","ženski","srednji"], correctIndex:1 }));
  s.forEach(w => q.push({ type:"choice", difficulty:1, question:`Koji je rod imenice "${w}"?`, answers:["muški","ženski","srednji"], correctIndex:2 }));

  // Jednina i množina
  [["pas","psi"],["mačka","mačke"],["knjiga","knjige"],["stol","stolovi"],["drvo","drva"],["dijete","djeca"],["grad","gradovi"],["rijeka","rijeke"],["selo","sela"],["brat","braća"],["sestra","sestre"],["jabuka","jabuke"],["cvijet","cvjetovi"],["ptica","ptice"],["list","listovi"]].forEach(([j,mn]) => {
    q.push({ type:"input", difficulty:2, question:`Množina od "${j}":`, correctAnswer:mn });
    q.push({ type:"input", difficulty:2, question:`Jednina od "${mn}":`, correctAnswer:j });
  });

  // Vlastite imenice — veliko slovo
  [["Zagreb","vlastita"],["pas","opća"],["Sava","vlastita"],["rijeka","opća"],["Ana","vlastita"],["djevojčica","opća"],["Hrvatska","vlastita"],["država","opća"],["Dinamo","vlastita"],["klub","opća"],["Marko","vlastita"],["dječak","opća"]].forEach(([w,tip]) => {
    q.push({ type:"choice", difficulty:2, question:`Je li "${w}" vlastita ili opća imenica?`, answers:["vlastita","opća"], correctIndex:tip==="vlastita"?0:1 });
  });

  // Što je imenica
  q.push({ type:"choice", difficulty:1, question:"Što je imenica?", answers:["Riječ za biće, stvar ili pojavu","Riječ za radnju","Riječ za opis","Broj"], correctIndex:0 });
  q.push({ type:"choice", difficulty:1, question:"Koja od ovih riječi je imenica?", answers:["trči","lijep","kuća","brzo"], correctIndex:2 });
  q.push({ type:"choice", difficulty:1, question:"Koja od ovih riječi NIJE imenica?", answers:["stol","veselo","jabuka","škola"], correctIndex:1 });

  return fix(q).slice(0, 210);
}

function genGlagoli2() {
  const q = [];
  const glagoli = ["trčati","pjevati","čitati","pisati","skakati","plivati","jesti","piti","spavati","crtati","učiti","igrati","sjediti","stajati","plesati","gledati"];
  const neGlagoli = ["kuća","lijep","stol","brzo","crvena","pas","škola","veliko"];
  
  // Prepoznaj glagol
  glagoli.forEach(g => {
    const wr = sh(neGlagoli).slice(0,3);
    q.push({ type:"choice", difficulty:1, question:"Koja riječ je glagol?", answers:sh([g,...wr]), correctIndex:-1, _c:g });
  });

  // Prepoznaj NE-glagol
  neGlagoli.forEach(ng => {
    const wr = sh(glagoli).slice(0,3);
    q.push({ type:"choice", difficulty:2, question:"Koja riječ NIJE glagol?", answers:sh([ng,...wr]), correctIndex:-1, _c:ng });
  });

  // Što radi...?
  [["Pas","laje"],["Mačka","mjauče"],["Ptica","pjeva"],["Riba","pliva"],["Dijete","igra se"],["Učiteljica","poučava"],["Kuhar","kuha"],["Liječnik","liječi"],["Vatrogasac","gasi"],["Pjevač","pjeva"]].forEach(([tko,sto]) => {
    const wr = sh(["laje","mjauče","pjeva","pliva","kuha","liječi","gasi","skače","trči","crta"].filter(x=>x!==sto)).slice(0,3);
    q.push({ type:"choice", difficulty:2, question:`Što radi ${tko.toLowerCase()}?`, answers:sh([sto,...wr]), correctIndex:-1, _c:sto });
  });

  q.push({ type:"choice", difficulty:1, question:"Što je glagol?", answers:["Riječ za radnju","Riječ za biće","Riječ za opis","Ime grada"], correctIndex:0 });

  return fix(q).slice(0, 210);
}

function genRecenice2() {
  const q = [];

  // Vrste rečenica
  [["Pada kiša.","izjavna"],["Pada li kiša?","upitna"],["Kakva kiša!","usklična"],["Sunce sija.","izjavna"],["Ideš li u školu?","upitna"],["Bravo!","usklična"],["Mama kuha ručak.","izjavna"],["Koliko je sati?","upitna"],["Super!","usklična"],["Ana čita knjigu.","izjavna"],["Voliš li čokoladu?","upitna"],["Jao!","usklična"]].forEach(([r,tip]) => {
    q.push({ type:"choice", difficulty:2, question:`"${r}" je koja vrsta rečenice?`, answers:["izjavna","upitna","usklična"], correctIndex:tip==="izjavna"?0:tip==="upitna"?1:2 });
  });

  // Interpunkcija
  [["Pada kiša","."],["Ideš li u školu","?"],["Kakva ljepota","!"],["Mama kuha","."],[" Koliko imaš godina","?"],["Bravo","!"]].forEach(([r,znak]) => {
    q.push({ type:"choice", difficulty:2, question:`Koji znak ide na kraj: "${r}"`, answers:[".","?","!"], correctIndex:znak==="."?0:znak==="?"?1:2 });
  });

  // Veliko slovo
  [["ana ide u školu.","Ana ide u školu."],["zagreb je lijep grad.","Zagreb je lijep grad."],["sava je rijeka.","Sava je rijeka."],["marko voli nogomet.","Marko voli nogomet."]].forEach(([wrong,correct]) => {
    q.push({ type:"choice", difficulty:1, question:"Koja rečenica je ispravno napisana?", answers:[wrong,correct], correctIndex:1 });
  });

  // Broj riječi u rečenici
  [["Pas laje.",2],["Mama kuha ručak.",3],["Ana i Luka idu u školu.",6],["Pada kiša.",2],["Sunce sija na nebu.",4]].forEach(([r,c]) => {
    const rc = cfc(c,1,8);
    q.push({ type:"choice", difficulty:3, question:`Koliko riječi: "${r}"?`, answers:rc.answers, correctIndex:rc.correctIndex });
  });

  return fix(q).slice(0, 210);
}

function genCitanje2() {
  const q = [];

  // Suprotnosti (antonimi) — prošireno za 2. razred
  [["veliko","malo"],["brzo","sporo"],["toplo","hladno"],["veselo","tužno"],["staro","novo"],["visoko","nisko"],["dugo","kratko"],["široko","usko"],["teško","lako"],["glasno","tiho"],["puno","prazno"],["mokro","suho"],["tamno","svijetlo"],["dobro","loše"],["bogato","siromašno"]].forEach(([w,opp]) => {
    const wr = sh(["veliko","malo","brzo","sporo","toplo","hladno","veselo","tužno","staro","novo","visoko","nisko"].filter(x=>x!==opp)).slice(0,3);
    q.push({ type:"choice", difficulty:2, question:`Suprotno od "${w}"?`, answers:sh([opp,...wr]), correctIndex:-1, _c:opp });
  });

  // Sinonimi
  [["kuća","dom"],["lijepo","krasno"],["veselo","radosno"],["brzo","hitro"],["malo","sitno"],["veliko","golemo"],["put","cesta"],["djeca","klinci"],["jesti","blagovati"],["gledati","promatrati"]].forEach(([w,syn]) => {
    const wr = sh(["dom","krasno","radosno","hitro","sitno","golemo","cesta","klinci","promatrati","šetati"].filter(x=>x!==syn)).slice(0,3);
    q.push({ type:"choice", difficulty:3, question:`Slično značenje kao "${w}"?`, answers:sh([syn,...wr]), correctIndex:-1, _c:syn });
  });

  // Umanjenice i uvećanice
  [["kuća","kućica","kućetina"],["pas","psić","psina"],["knjiga","knjižica","knjižurina"],["riba","ribica","ribetina"],["nos","nosić","nosina"],["mačka","mačkica","mačketina"]].forEach(([w,um,uv]) => {
    q.push({ type:"input", difficulty:2, question:`Umanjenica od "${w}":`, correctAnswer:um });
    q.push({ type:"input", difficulty:3, question:`Uvećanica od "${w}":`, correctAnswer:uv });
  });

  // Slogovi — prebrojavanje
  [["škola",2],["računalo",4],["dom",1],["prijatelj",3],["knjiga",2],["automobil",4],["ja",1],["učiteljica",5],["matematika",5],["pas",1]].forEach(([w,c]) => {
    const r = cfc(c,1,6);
    q.push({ type:"choice", difficulty:2, question:`Koliko slogova ima "${w}"?`, answers:r.answers, correctIndex:r.correctIndex });
  });

  return fix(q).slice(0, 210);
}

// ═══════════════════════════════════════════════════════
// MATEMATIKA — 2. RAZRED
// ═══════════════════════════════════════════════════════

function genBrojevi100() {
  const q = [];
  // Brojevi do 100 — desetice
  for (let d = 10; d <= 100; d += 10) {
    q.push({ type:"input", difficulty:1, question:`Koji broj dolazi NAKON ${d-1}?`, correctAnswer:String(d) });
  }
  // Mjesna vrijednost
  for (let n = 11; n <= 99; n += 7) {
    const des = Math.floor(n/10), jed = n%10;
    q.push({ type:"input", difficulty:2, question:`Koliko DESETICA ima broj ${n}?`, correctAnswer:String(des) });
    q.push({ type:"input", difficulty:2, question:`Koliko JEDINICA ima broj ${n}?`, correctAnswer:String(jed) });
  }
  // Uspoređivanje
  for (let i = 0; i < 30; i++) {
    const a = Math.floor(Math.random()*90)+10, b = Math.floor(Math.random()*90)+10;
    if (a === b) continue;
    const s = a < b ? "<" : ">";
    q.push({ type:"choice", difficulty:2, question:`${a} ${CIRCLE} ${b}`, answers:["<",">","="], correctIndex:s==="<"?0:1 });
  }
  // Parni/neparni
  for (let i = 1; i <= 30; i++) {
    q.push({ type:"choice", difficulty:2, question:`Je li ${i} paran ili neparan?`, answers:["paran","neparan"], correctIndex:i%2===0?0:1 });
  }
  // Rimski brojevi do 12
  [["I",1],["II",2],["III",3],["IV",4],["V",5],["VI",6],["VII",7],["VIII",8],["IX",9],["X",10],["XI",11],["XII",12]].forEach(([r,a]) => {
    const rc = cfc(a,1,12);
    q.push({ type:"choice", difficulty:3, question:`Rimski broj ${r} je:`, answers:rc.answers, correctIndex:rc.correctIndex });
  });
  return fix(q).slice(0, 210);
}

function genZbrajanje100() {
  const q = [];
  // Zbrajanje desetica
  for (let a = 10; a <= 90; a += 10) for (let b = 10; b <= 100-a; b += 10) {
    q.push({ type:"input", difficulty:1, question:`${a} + ${b} = ?`, correctAnswer:String(a+b) });
  }
  // Zbrajanje do 100 bez prijelaza
  for (let i = 0; i < 40; i++) {
    const a = Math.floor(Math.random()*40)+10, b = Math.floor(Math.random()*40)+5;
    if (a+b > 100) continue;
    const r = cfc(a+b, Math.max(a+b-5,0), Math.min(a+b+5,100));
    q.push({ type:"choice", difficulty:2, question:`${a} + ${b} = ?`, answers:r.answers, correctIndex:r.correctIndex });
    if (i%2===0) q.push({ type:"input", difficulty:2, question:`${a} + ${b} = ?`, correctAnswer:String(a+b) });
  }
  // Tekstualni zadaci
  for (let i = 0; i < 15; i++) {
    const a = (i%20)+15, b = ((i*3)%20)+5;
    if (a+b>100) continue;
    q.push({ type:"input", difficulty:3, question:`${N()} ima ${a} ${IF()}. Dobio/la je još ${b}. Koliko ih sada ima?`, correctAnswer:String(a+b) });
  }
  return fix(q).slice(0, 210);
}

function genOduzimanje100() {
  const q = [];
  // Oduzimanje desetica
  for (let a = 20; a <= 100; a += 10) for (let b = 10; b <= a; b += 10) {
    q.push({ type:"input", difficulty:1, question:`${a} - ${b} = ?`, correctAnswer:String(a-b) });
  }
  // Oduzimanje do 100
  for (let i = 0; i < 40; i++) {
    const a = Math.floor(Math.random()*60)+30, b = Math.floor(Math.random()*25)+5;
    if (b > a) continue;
    const r = cfc(a-b, Math.max(a-b-5,0), Math.min(a-b+5,100));
    q.push({ type:"choice", difficulty:2, question:`${a} - ${b} = ?`, answers:r.answers, correctIndex:r.correctIndex });
    if (i%2===0) q.push({ type:"input", difficulty:2, question:`${a} - ${b} = ?`, correctAnswer:String(a-b) });
  }
  // Tekstualni zadaci
  for (let i = 0; i < 15; i++) {
    const a = (i%30)+30, b = ((i*2)%15)+5;
    if (b>a) continue;
    q.push({ type:"input", difficulty:3, question:`${N()} ima ${a} ${IF()}. Potrošio/la je ${b}. Koliko mu/joj je ostalo?`, correctAnswer:String(a-b) });
  }
  return fix(q).slice(0, 210);
}

function genMnozenjeDijeljenje() {
  const q = [];
  // Tablica množenja do 5
  for (let a = 1; a <= 5; a++) for (let b = 1; b <= 10; b++) {
    const p = a*b;
    q.push({ type:"input", difficulty:a<=3?1:2, question:`${a} × ${b} = ?`, correctAnswer:String(p) });
    if (b <= 5) {
      const r = cfc(p, Math.max(p-5,0), p+5);
      q.push({ type:"choice", difficulty:2, question:`${a} × ${b} = ?`, answers:r.answers, correctIndex:r.correctIndex });
    }
  }
  // Dijeljenje
  for (let a = 1; a <= 5; a++) for (let b = 1; b <= 10; b++) {
    const p = a*b;
    q.push({ type:"input", difficulty:3, question:`${p} ÷ ${a} = ?`, correctAnswer:String(b) });
  }
  // Tekstualni
  for (let i = 0; i < 10; i++) {
    const a = (i%4)+2, b = (i%5)+2;
    q.push({ type:"input", difficulty:3, question:`${N()} ima ${a} kutije. U svakoj je ${b} ${IF()}. Koliko ukupno?`, correctAnswer:String(a*b) });
  }
  return fix(q).slice(0, 210);
}

function genGeometrija2() {
  const q = [];
  // Likovi i svojstva
  [["krug",0,0],["trokut",3,3],["kvadrat",4,4],["pravokutnik",4,4],["peterokut",5,5],["šesterokut",6,6]].forEach(([lik,str,kut]) => {
    const r = cfc(str,0,8);
    q.push({ type:"choice", difficulty:2, question:`Koliko stranica ima ${lik}?`, answers:r.answers, correctIndex:r.correctIndex });
    q.push({ type:"choice", difficulty:2, question:`Koliko kutova ima ${lik}?`, answers:r.answers, correctIndex:r.correctIndex });
  });
  // Tijela
  [["kugla","kotrlja se u svim smjerovima"],["valjak","kotrlja se u jednom smjeru"],["kocka","ima 6 jednakih strana"],["kvadar","ima 6 pravokutnih strana"],["piramida","ima šiljasti vrh"],["stožac","ima okruglu bazu i šiljak"]].forEach(([t,opis]) => {
    const wr = sh(["kugla","valjak","kocka","kvadar","piramida","stožac"].filter(x=>x!==t)).slice(0,3);
    q.push({ type:"choice", difficulty:3, question:`Koji opis odgovara: "${opis}"?`, answers:sh([t,...wr]), correctIndex:-1, _c:t });
  });
  // Simetrija
  q.push({ type:"choice", difficulty:2, question:"Koje slovo ima os simetrije?", answers:["A","F","G","J"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Koji lik ima os simetrije?", answers:["kvadrat","nepravilni četverokut","trapez","paralelogram"], correctIndex:0 });

  return fix(q).slice(0, 210);
}

function genMjerenjeNovac() {
  const q = [];
  // Sat
  [["🕐",1],["🕑",2],["🕒",3],["🕓",4],["🕔",5],["🕕",6],["🕖",7],["🕗",8],["🕘",9],["🕙",10],["🕚",11],["🕛",12]].forEach(([e,h]) => {
    const r = cfc(h,1,12);
    q.push({ type:"choice", difficulty:2, visual:e, question:"Koliko je sati?", answers:r.answers, correctIndex:r.correctIndex });
  });
  // Novac — kune (za kontekst 2020.)
  [["5 kn + 2 kn",7],["10 kn + 5 kn",15],["20 kn - 5 kn",15],["50 kn - 20 kn",30],["2 kn + 2 kn + 1 kn",5],["10 kn + 10 kn + 5 kn",25]].forEach(([expr,ans]) => {
    q.push({ type:"input", difficulty:2, question:`Koliko kuna: ${expr} = ?`, correctAnswer:String(ans) });
  });
  // Mjerenje duljina
  q.push({ type:"choice", difficulty:1, question:"Čime mjerimo duljinu?", answers:["ravnalom","vagom","satom","termometrom"], correctIndex:0 });
  q.push({ type:"choice", difficulty:1, question:"Čime mjerimo težinu?", answers:["ravnalom","vagom","satom","termometrom"], correctIndex:1 });
  q.push({ type:"choice", difficulty:1, question:"Čime mjerimo temperaturu?", answers:["ravnalom","vagom","satom","termometrom"], correctIndex:3 });
  q.push({ type:"choice", difficulty:2, question:"1 metar ima koliko centimetara?", answers:["10","100","1000","50"], correctIndex:1 });
  q.push({ type:"choice", difficulty:2, question:"1 kilogram ima koliko grama?", answers:["10","100","1000","500"], correctIndex:2 });

  return fix(q).slice(0, 210);
}

// ═══════════════════════════════════════════════════════
// PRIRODA I DRUŠTVO — 2. RAZRED
// ═══════════════════════════════════════════════════════

function genZavicaj() {
  const q = [];
  q.push({ type:"choice", difficulty:1, question:"Što je zavičaj?", answers:["Mjesto gdje živimo","Strana država","Svemirska stanica","Planina"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Kako se snalazimo u prostoru?", answers:["Pomoću strana svijeta","Pomoću boja","Pomoću zvukova","Pomoću okusa"], correctIndex:0 });
  // Strane svijeta
  [["sjever","S"],["jug","J"],["istok","I"],["zapad","Z"]].forEach(([s,kr]) => {
    q.push({ type:"input", difficulty:2, question:`Kratica za "${s}":`, correctAnswer:kr });
  });
  q.push({ type:"choice", difficulty:2, question:"Sunce izlazi na...?", answers:["istoku","zapadu","sjeveru","jugu"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Sunce zalazi na...?", answers:["istoku","zapadu","sjeveru","jugu"], correctIndex:1 });
  // Karta i plan
  q.push({ type:"choice", difficulty:2, question:"Što je plan mjesta?", answers:["Crtež mjesta gledanog odozgo","Fotografija","Priča o mjestu","Pjesma"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Na karti, plava boja obično označava...?", answers:["vodu","šumu","cestu","grad"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Na karti, zelena boja obično označava...?", answers:["vodu","nizinu/šumu","cestu","planinu"], correctIndex:1 });
  // Institucije
  [["Gdje učimo?","škola"],["Gdje se liječimo?","bolnica"],["Gdje kupujemo?","trgovina"],["Gdje posuđujemo knjige?","knjižnica"],["Gdje šaljemo pisma?","pošta"]].forEach(([pit,odg]) => {
    const wr = sh(["škola","bolnica","trgovina","knjižnica","pošta","stadion","kino"].filter(x=>x!==odg)).slice(0,3);
    q.push({ type:"choice", difficulty:2, question:pit, answers:sh([odg,...wr]), correctIndex:-1, _c:odg });
  });
  return fix(q).slice(0, 210);
}

function genDobaVrijeme() {
  const q = [];
  const S = ["proljeće","ljeto","jesen","zima"];
  // Mjeseci i godišnja doba
  [["ožujak","proljeće"],["travanj","proljeće"],["svibanj","proljeće"],["lipanj","ljeto"],["srpanj","ljeto"],["kolovoz","ljeto"],["rujan","jesen"],["listopad","jesen"],["studeni","jesen"],["prosinac","zima"],["siječanj","zima"],["veljača","zima"]].forEach(([m,d]) => {
    q.push({ type:"choice", difficulty:2, question:`"${m}" pripada kojem godišnjem dobu?`, answers:S, correctIndex:S.indexOf(d) });
  });
  // Redoslijed mjeseci
  [["siječanj","veljača"],["ožujak","travanj"],["svibanj","lipanj"],["srpanj","kolovoz"],["rujan","listopad"],["studeni","prosinac"]].forEach(([m1,m2]) => {
    const wr = sh(["ožujak","lipanj","rujan","prosinac","veljača","kolovoz","studeni","siječanj"].filter(x=>x!==m2)).slice(0,3);
    q.push({ type:"choice", difficulty:3, question:`Koji mjesec dolazi NAKON "${m1}"?`, answers:sh([m2,...wr]), correctIndex:-1, _c:m2 });
  });
  q.push({ type:"choice", difficulty:1, question:"Koliko mjeseci ima godina?", answers:["10","11","12","13"], correctIndex:2 });
  q.push({ type:"choice", difficulty:1, question:"Koliko dana ima tjedan?", answers:["5","6","7","8"], correctIndex:2 });
  // Vrijeme (meteorologija)
  q.push({ type:"choice", difficulty:2, question:"Čime mjerimo temperaturu zraka?", answers:["termometrom","ravnalom","vagom","satom"], correctIndex:0 });
  [["sunčano","☀️"],["oblačno","☁️"],["kišovito","🌧️"],["snježno","❄️"],["vjetrovito","💨"]].forEach(([v,e]) => {
    q.push({ type:"choice", difficulty:1, visual:e, question:"Kakvo je vrijeme?", answers:["sunčano","oblačno","kišovito","snježno"], correctIndex:["sunčano","oblačno","kišovito","snježno"].indexOf(v) >= 0 ? ["sunčano","oblačno","kišovito","snježno"].indexOf(v) : 0 });
  });
  return fix(q).slice(0, 210);
}

function genBiljkeZivotinje() {
  const q = [];
  // Dijelovi biljke
  [["korijen","upija vodu iz tla"],["stabljika","nosi vodu i hranu"],["list","proizvodi hranu"],["cvijet","služi za razmnožavanje"],["plod","sadrži sjemenku"]].forEach(([d,opis]) => {
    const wr = sh(["korijen","stabljika","list","cvijet","plod"].filter(x=>x!==d)).slice(0,3);
    q.push({ type:"choice", difficulty:2, question:`Koji dio biljke: "${opis}"?`, answers:sh([d,...wr]), correctIndex:-1, _c:d });
  });
  // Domaće vs divlje životinje
  [["krava","domaća"],["vuk","divlja"],["kokoš","domaća"],["medvjed","divlja"],["ovca","domaća"],["jelen","divlja"],["pas","domaća"],["lisica","divlja"],["mačka","domaća"],["zec","divlja"],["konj","domaća"],["sova","divlja"]].forEach(([z,tip]) => {
    q.push({ type:"choice", difficulty:2, question:`Je li "${z}" domaća ili divlja životinja?`, answers:["domaća","divlja"], correctIndex:tip==="domaća"?0:1 });
  });
  // Gdje žive
  [["riba","voda"],["ptica","zrak"],["crv","tlo"],["žaba","voda i kopno"],["medvjed","šuma"],["krava","farma"]].forEach(([z,mj]) => {
    const wr = sh(["voda","zrak","tlo","šuma","farma","more"].filter(x=>x!==mj)).slice(0,3);
    q.push({ type:"choice", difficulty:2, question:`Gdje živi ${z}?`, answers:sh([mj,...wr]), correctIndex:-1, _c:mj });
  });
  return fix(q).slice(0, 210);
}

function genVodaTlo() {
  const q = [];
  q.push({ type:"choice", difficulty:1, question:"U kojem stanju može biti voda?", answers:["tekuće, kruto, plinovito","samo tekuće","samo kruto","samo plinovito"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Kako se zove voda u krutom stanju?", answers:["led","para","rosa","kiša"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Kako se zove voda u plinovitom stanju?", answers:["led","vodena para","rosa","snijeg"], correctIndex:1 });
  // Kruženje vode
  q.push({ type:"choice", difficulty:3, question:"Sunce grije vodu → voda isparava → nastaju...?", answers:["oblaci","rijeke","jezera","stijene"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Iz oblaka pada...?", answers:["kiša ili snijeg","pijesak","lišće","vjetar"], correctIndex:0 });
  // Tlo
  q.push({ type:"choice", difficulty:2, question:"Što je tlo?", answers:["Gornji sloj Zemljine površine","Nebo","Oblak","Zvijezda"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Što se nalazi u tlu?", answers:["Minerali, voda, zrak, organizmi","Samo kamenje","Samo voda","Samo pijesak"], correctIndex:0 });
  // Vode u Hrvatskoj
  [["Sava","rijeka"],["Drava","rijeka"],["Jadransko","more"],["Plitvice","jezera"],["Dunav","rijeka"]].forEach(([ime,tip]) => {
    const wr = sh(["rijeka","more","jezera","potok","kanal"].filter(x=>x!==tip)).slice(0,3);
    q.push({ type:"choice", difficulty:3, question:`"${ime}" je...?`, answers:sh([tip,...wr]), correctIndex:-1, _c:tip });
  });
  return fix(q).slice(0, 210);
}

function genZdravljeSigurnost2() {
  const q = [];
  // Zdravlje
  q.push({ type:"choice", difficulty:1, question:"Koliko puta dnevno trebamo prati zube?", answers:["1","2","3","nikad"], correctIndex:1 });
  q.push({ type:"choice", difficulty:1, question:"Što je zdravo jesti svaki dan?", answers:["voće i povrće","slatkiše","čips","gazirana pića"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Zašto je tjelesna aktivnost važna?", answers:["Jača tijelo i zdravlje","Nije važna","Troši vrijeme","Samo za sportaše"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Koliko sati sna trebaju djeca?", answers:["4-5","6-7","9-11","15"], correctIndex:2 });
  // Sigurnost
  q.push({ type:"choice", difficulty:1, question:"Koga zovemo u hitnom slučaju?", answers:["112","000","999","123"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Što radiš ako se opečeš?", answers:["Stavim pod hladnu vodu","Trčim","Ništa","Stavim led direktno"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Smiješ li otvarati vrata nepoznatim osobama?", answers:["Da","Ne"], correctIndex:1 });
  q.push({ type:"choice", difficulty:2, question:"Što učiniti ako se izgubiš?", answers:["Tražiti policajca ili odraslu osobu","Plakati","Trčati","Sakriti se"], correctIndex:0 });
  // Promet
  q.push({ type:"choice", difficulty:1, question:"Na zeleno svjetlo pješak...?", answers:["čeka","prelazi cestu","trči","sjedi"], correctIndex:1 });
  q.push({ type:"choice", difficulty:2, question:"Prije prelaska ceste moraš...?", answers:["pogledati lijevo-desno","zatvoriti oči","trčati","ništa"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Gdje voziš bicikl?", answers:["Po biciklističkoj stazi","Po cesti za aute","Po nogostupu","Po travi"], correctIndex:0 });
  return fix(q).slice(0, 210);
}

// ═══════════════════════════════════════════════════════
// GEN_MAP I SEED
// ═══════════════════════════════════════════════════════
const GEN_MAP = {
  hrvatski: [genImeniceRod, genGlagoli2, genRecenice2, genCitanje2],
  matematika: [genBrojevi100, genZbrajanje100, genOduzimanje100, genMnozenjeDijeljenje, genGeometrija2, genMjerenjeNovac],
  priroda: [genZavicaj, genDobaVrijeme, genBiljkeZivotinje, genVodaTlo, genZdravljeSigurnost2]
};

async function seed() {
  console.log(`\n🌱 Učilica SEED — ${GRADE}. razred\n`);
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const dbName = process.env.DB_NAME || (() => { try { return new URL(uri).pathname.replace(/^\//, '') || 'ucilica'; } catch { return 'ucilica'; } })();
    const db = client.db(dbName);
    console.log(`🔗 MongoDB: ${db.databaseName}`);

    await db.collection("questions").deleteMany({ grade: GRADE });
    await db.collection("topics").deleteMany({ grade: GRADE });
    await db.collection("subjects").deleteMany({ grade: GRADE });
    console.log(`🗑️  Obrisani stari podaci za ${GRADE}. razred\n`);

    let totalQ = 0;
    for (const subject of subjects) {
      const sRes = await db.collection("subjects").insertOne({ ...subject, grade: GRADE, isActive: true, createdAt: new Date() });
      const sId = sRes.insertedId;
      console.log(`📘 ${subject.icon} ${subject.name}`);
      const gens = GEN_MAP[subject.slug];
      const tops = topicsDef[subject.slug];
      for (let i = 0; i < tops.length; i++) {
        const rawQ = gens[i]();
        const tRes = await db.collection("topics").insertOne({ ...tops[i], grade: GRADE, subject_id: sId, isActive: true, createdAt: new Date() });
        const tId = tRes.insertedId;
        const docs = rawQ.map(q => ({
          type: q.type, difficulty: q.difficulty || 1, question: q.question,
          visual: q.visual || "", hint: q.hint || "", answers: q.answers || [],
          correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : undefined,
          correctAnswer: q.correctAnswer || undefined, placeholder: q.placeholder || undefined,
          grade: GRADE, subject_id: sId, topic_id: tId, isActive: true, createdAt: new Date()
        }));
        if (docs.length > 0) await db.collection("questions").insertMany(docs);
        totalQ += docs.length;
        console.log(`   ${tops[i].icon} ${tops[i].name}: ${docs.length} pitanja`);
      }
    }
    console.log(`\n✅ Ukupno: ${totalQ} pitanja za ${GRADE}. razred`);
  } catch (err) { console.error("❌ Greška:", err); }
  finally { await client.close(); process.exit(0); }
}

// Pokreni seed samo ako je fajl pokrenut direktno (ne kad se importa)
if (require.main === module) {
  seed();
}

// Export generatora za questionGenerator servis
module.exports = { genImeniceRod, genGlagoli2, genRecenice2, genCitanje2, genBrojevi100, genZbrajanje100, genOduzimanje100, genMnozenjeDijeljenje, genGeometrija2, genMjerenjeNovac, genZavicaj, genDobaVrijeme, genBiljkeZivotinje, genVodaTlo, genZdravljeSigurnost2 };
