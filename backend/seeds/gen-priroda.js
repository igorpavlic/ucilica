// gen-priroda.js — Nature & Society question generators
const { N, IF, IM, sh, cfc, rep, fix, EL } = require("./gen-hrvatski");

function genDoba() {
  const q = []; const S = ["proljeće","ljeto","jesen","zima"]; const si = n => S.indexOf(n);
  [["🌸","proljeće"],["☀️","ljeto"],["🍂","jesen"],["❄️","zima"],["🌷","proljeće"],["🏖️","ljeto"],["🍁","jesen"],["⛄","zima"],["🌱","proljeće"],["🌻","ljeto"],["🎃","jesen"],["🎿","zima"],["🐣","proljeće"],["🍦","ljeto"],["🌧️","jesen"],["🧣","zima"],["🦋","proljeće"],["🍉","ljeto"],["🌰","jesen"],["🧤","zima"]].forEach(([e,s]) => q.push({ type:"choice", difficulty:1, visual:e, question:"Koje godišnje doba?", answers:S, correctIndex:si(s) }));
  [["Kada pada snijeg?","zima"],["Kada cvjeta cvijeće?","proljeće"],["Kada je najtoplije?","ljeto"],["Kada lišće žuti?","jesen"],["Kada se ptice vraćaju?","proljeće"],["Kada idemo na more?","ljeto"],["Kada beremo voće?","jesen"],["Kada je najkraći dan?","zima"],["Kada se bude životinje?","proljeće"],["Kada nosimo kupaći?","ljeto"],["Kada sakupljamo kestene?","jesen"],["Kada nosimo jaknu?","zima"],["Kada pjevaju ptice?","proljeće"],["Kada je najduži dan?","ljeto"],["Kada pada kiša?","jesen"],["Kada klizamo?","zima"],["Kada sadimo cvijeće?","proljeće"],["Kada jedemo sladoled?","ljeto"],["Kada počinje škola?","jesen"],["Kada slavimo Božić?","zima"]].forEach(([t,a]) => { q.push({ type:"choice", difficulty:2, question:t, answers:S, correctIndex:si(a) }); q.push({ type:"input", difficulty:3, question:t, correctAnswer:a }); });
  S.forEach((s,i) => { const nx = S[(i+1)%4]; q.push({ type:"choice", difficulty:2, question:`Što dolazi nakon: ${s}?`, answers:S, correctIndex:si(nx) }); });
  S.forEach((s,i) => { const pr = S[(i+3)%4]; q.push({ type:"choice", difficulty:2, question:`Što dolazi prije: ${s}?`, answers:S, correctIndex:si(pr) }); });
  q.push({ type:"choice", difficulty:1, question:"Koliko godišnjih doba?", visual:"🌸☀️🍂❄️", answers:["2","3","4","5"], correctIndex:2 });
  [["siječanj","zima"],["veljača","zima"],["ožujak","proljeće"],["travanj","proljeće"],["svibanj","proljeće"],["lipanj","ljeto"],["srpanj","ljeto"],["kolovoz","ljeto"],["rujan","jesen"],["listopad","jesen"],["studeni","jesen"],["prosinac","zima"]].forEach(([m,s]) => q.push({ type:"choice", difficulty:3, question:`${m} → godišnje doba?`, answers:S, correctIndex:si(s) }));
  [["skijanje","zima"],["plivanje","ljeto"],["branje jabuka","jesen"],["sadnja cvijeća","proljeće"],["gradnja snjegovića","zima"],["vožnja biciklom","proljeće"],["igranje na plaži","ljeto"],["skupljanje lišća","jesen"],["klizanje","zima"],["izleti u prirodu","proljeće"],["roštiljanje","ljeto"],["berba grožđa","jesen"],["sankanje","zima"],["let zmajeva","proljeće"],["kupanje u moru","ljeto"],["šetnja po kiši","jesen"],["grijanje uz kamin","zima"],["promatranje leptira","proljeće"],["jedenje lubenice","ljeto"],["nošenje kišobrana","jesen"]].forEach(([a,s]) => q.push({ type:"choice", difficulty:3, question:`"${a}" → doba?`, answers:S, correctIndex:si(s) }));
  [["🧣","zima"],["👙","ljeto"],["🧤","zima"],["👒","ljeto"],["🧥","zima"],["👕","ljeto"],["☂️","jesen"],["🌂","jesen"],["🥾","zima"],["🩴","ljeto"],["🧢","proljeće"],["🩱","ljeto"]].forEach(([e,s]) => q.push({ type:"choice", difficulty:2, visual:e, question:"Kada nosimo ovo?", answers:S, correctIndex:si(s) }));
  // hrana po dobima
  [["🍓","proljeće"],["🍉","ljeto"],["🍇","jesen"],["🍊","zima"],["🌽","ljeto"],["🍎","jesen"],["🥕","proljeće"],["🎃","jesen"],["🍒","proljeće"],["🍑","ljeto"]].forEach(([e,s]) => q.push({ type:"choice", difficulty:3, visual:e, question:"Kada jedemo ovo voće/povrće?", answers:S, correctIndex:si(s) }));
  // točno/netočno
  [["Zimi pada snijeg.",true],["Ljeti pada snijeg.",false],["U proljeće cvjeta cvijeće.",true],["Zimi cvjeta cvijeće.",false],["Ljeti idemo na more.",true],["Zimi idemo na more.",false],["U jesen lišće pada.",true],["U proljeće lišće pada.",false],["Ljeti je najtoplije.",true],["Zimi je najtoplije.",false],["U jesen počinje škola.",true],["U proljeće počinje škola.",false],["Zimi gradimo snjegovića.",true],["Ljeti gradimo snjegovića.",false],["U proljeće se ptice vraćaju.",true],["U jesen se ptice vraćaju.",false]].forEach(([s,c]) => q.push({ type:"choice", difficulty:2, question:s, answers:["Točno","Netočno"], correctIndex:c?0:1 }));
  // koliko mjeseci
  q.push({ type:"choice", difficulty:3, question:"Koliko mjeseci ima jedna godina?", answers:["10","11","12","13"], correctIndex:2 });
  q.push({ type:"choice", difficulty:3, question:"Koliko mjeseci traje jedno godišnje doba?", answers:["2","3","4","5"], correctIndex:1 });
  // redoslijed
  q.push({ type:"choice", difficulty:2, question:"Koji je redoslijed godišnjih doba?", answers:["proljeće, ljeto, jesen, zima","zima, ljeto, proljeće, jesen","jesen, zima, ljeto, proljeće","ljeto, proljeće, zima, jesen"], correctIndex:0 });
  // prirodne pojave
  [["🌈","dugin","proljeće"],["⛈️","grmljavina","ljeto"],["🌫️","magla","jesen"],["🧊","led","zima"],["🌪️","vjetar","jesen"],["☀️","sunčano","ljeto"]].forEach(([e,n,s]) => q.push({ type:"choice", difficulty:3, visual:e, question:`"${n}" — u koje doba je najčešće?`, answers:S, correctIndex:si(s) }));
  // input: napiši godišnje doba
  [["Doba snijega?","zima"],["Doba cvijeća?","proljeće"],["Doba kupanja?","ljeto"],["Doba lišća?","jesen"],["Doba skijanja?","zima"],["Doba žetve?","jesen"],["Doba sunca?","ljeto"],["Doba buđenja?","proljeće"]].forEach(([q2,a]) => q.push({ type:"input", difficulty:2, question:q2, correctAnswer:a }));

  // ═══ REDOSLIJED GODIŠNJIH DOBA — prošireno ═══
  // nakon + input
  [["proljeća","ljeto"],["ljeta","jesen"],["jeseni","zima"],["zime","proljeće"]].forEach(([gen,nx]) => {
    q.push({ type:"input", difficulty:2, question:`Koje godišnje doba dolazi nakon ${gen}?`, correctAnswer:nx });
    q.push({ type:"choice", difficulty:2, question:`Nakon ${gen} dolazi...`, answers:S, correctIndex:si(nx) });
  });
  // prije + input
  [["proljeća","zima"],["ljeta","proljeće"],["jeseni","ljeto"],["zime","jesen"]].forEach(([gen,pr]) => {
    q.push({ type:"input", difficulty:2, question:`Koje godišnje doba dolazi prije ${gen}?`, correctAnswer:pr });
    q.push({ type:"choice", difficulty:2, question:`Prije ${gen} bilo je...`, answers:S, correctIndex:si(pr) });
  });
  // dva koraka
  [["proljeće","jesen"],["ljeto","zima"],["jesen","proljeće"],["zima","ljeto"]].forEach(([s1,s2]) => {
    q.push({ type:"choice", difficulty:3, question:`Dva godišnja doba nakon: ${s1}?`, answers:S, correctIndex:si(s2) });
  });
  // koje je između
  [["zime","ljeta","proljeće"],["proljeća","jeseni","ljeto"],["ljeta","zime","jesen"],["jeseni","proljeća","zima"]].forEach(([a,b,mid]) => {
    q.push({ type:"choice", difficulty:3, question:`Koje doba je između ${a} i ${b}?`, answers:S, correctIndex:si(mid) });
  });
  // poredaj
  q.push({ type:"choice", difficulty:3, question:"Koji redoslijed je TOČAN?", answers:["proljeće→ljeto→jesen→zima","ljeto→proljeće→zima→jesen","jesen→ljeto→proljeće→zima","zima→jesen→ljeto→proljeće"], correctIndex:0 });
  q.push({ type:"choice", difficulty:3, question:"Koji redoslijed je NETOČAN?", answers:["proljeće→ljeto→jesen→zima","ljeto→jesen→zima→proljeće","zima→proljeće→ljeto→jesen","jesen→zima→ljeto→proljeće"], correctIndex:3 });
  // koje doba NIJE susjedovano
  [["proljeće","jesen"],["ljeto","zima"]].forEach(([a,b]) => {
    q.push({ type:"choice", difficulty:4, question:`Koja dva doba NE dolaze jedno za drugim?`, answers:[`${a} i ${b}`,"proljeće i ljeto","jesen i zima","ljeto i jesen"], correctIndex:0 });
  });
  // koliko puta godišnje
  q.push({ type:"choice", difficulty:2, question:"Koliko puta u godini bude proljeće?", answers:["1","2","3","4"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Koliko puta u godini bude zima?", answers:["1","2","3","4"], correctIndex:0 });

  // ═══ DOBA DANA ═══
  const DD = ["jutro","prijepodne","poslijepodne","večer","noć"];
  const ddi = n => DD.indexOf(n);

  // prepoznaj emoji doba dana
  [["🌅","jutro"],["☀️","prijepodne"],["🌇","poslijepodne"],["🌆","večer"],["🌙","noć"],["⏰","jutro"],["🍳","jutro"],["📚","prijepodne"],["⚽","poslijepodne"],["📺","večer"],["🛏️","noć"],["🌄","jutro"],["🌃","noć"]].forEach(([e,d]) => {
    q.push({ type:"choice", difficulty:2, visual:e, question:"Koje je doba dana?", answers:DD, correctIndex:ddi(d) });
  });

  // aktivnosti po dobu dana
  [["doručkujemo","jutro"],["idemo u školu","jutro"],["učimo u školi","prijepodne"],["imamo odmor za ručak","prijepodne"],["radimo zadaću","poslijepodne"],["igramo se vani","poslijepodne"],["večeramo","večer"],["gledamo TV","večer"],["spavamo","noć"],["sanjamo","noć"],["peremo zube prije spavanja","večer"],["ustajemo iz kreveta","jutro"],["pijemo čaj prije spavanja","večer"],["čitamo priču za laku noć","noć"]].forEach(([a,d]) => {
    q.push({ type:"choice", difficulty:2, question:`Kada ${a}?`, answers:DD, correctIndex:ddi(d) });
  });

  // redoslijed doba dana
  [["jutra","prijepodne"],["prijepodneva","poslijepodne"],["poslijepodneva","večer"],["večeri","noć"],["noći","jutro"]].forEach(([gen,nx]) => {
    q.push({ type:"choice", difficulty:2, question:`Što dolazi nakon ${gen}?`, answers:DD, correctIndex:ddi(nx) });
    q.push({ type:"input", difficulty:3, question:`Koje doba dana dolazi nakon ${gen}?`, correctAnswer:nx });
  });

  // prije
  [["prijepodneva","jutro"],["poslijepodneva","prijepodne"],["večeri","poslijepodne"],["noći","večer"],["jutra","noć"]].forEach(([gen,pr]) => {
    q.push({ type:"choice", difficulty:2, question:`Što dolazi prije ${gen}?`, answers:DD, correctIndex:ddi(pr) });
  });

  // koliko doba dana
  q.push({ type:"choice", difficulty:2, question:"Koliko doba dana ima?", answers:["3","4","5","6"], correctIndex:2 });
  q.push({ type:"choice", difficulty:2, question:"Koji je redoslijed doba dana?", answers:["jutro, prijepodne, poslijepodne, večer, noć","noć, jutro, večer, prijepodne, poslijepodne","večer, jutro, noć, poslijepodne, prijepodne","prijepodne, jutro, noć, večer, poslijepodne"], correctIndex:0 });

  // kada je svijetlo/tamno
  q.push({ type:"choice", difficulty:1, question:"Kada je vani tamno?", answers:["ujutro","prijepodne","poslijepodne","noću"], correctIndex:3 });
  q.push({ type:"choice", difficulty:1, question:"Kada je vani najsvjetlije?", answers:["noću","ujutro","prijepodne","večer"], correctIndex:2 });
  q.push({ type:"choice", difficulty:2, question:"Sunce izlazi...", answers:["ujutro","navečer","noću","poslijepodne"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Sunce zalazi...", answers:["ujutro","prijepodne","navečer","noću"], correctIndex:2 });

  // input doba dana
  [["Kada spavamo?","noć"],["Kada doručkujemo?","jutro"],["Kada idemo u školu?","jutro"],["Kada večeramo?","večer"],["Kada se igramo poslije škole?","poslijepodne"]].forEach(([q2,a]) => q.push({ type:"input", difficulty:2, question:q2, correctAnswer:a }));

  // točno/netočno doba dana
  [["Doručkujemo ujutro.",true],["Spavamo prijepodne.",false],["Večeramo navečer.",true],["U školu idemo noću.",false],["Poslijepodne se igramo.",true],["Zvijezde vidimo ujutro.",false]].forEach(([s,c]) => q.push({ type:"choice", difficulty:2, question:s, answers:["Točno","Netočno"], correctIndex:c?0:1 }));

  return fix(q).slice(0, 250);
}

function genZivotinje() {
  const q = [];
  const A = [["🐶","pas","dvorište","domaća","laje","kost"],["🐱","mačka","kuća","domaća","mjauče","riba"],["🐄","krava","farma","domaća","muče","trava"],["🐑","ovca","farma","domaća","blekeće","trava"],["🐴","konj","farma","domaća","njišti","sijeno"],["🐓","pijetao","dvorište","domaća","kukuriče","zrno"],["🐔","kokoš","dvorište","domaća","kokodače","zrno"],["🐷","svinja","farma","domaća","roktanje","sve"],["🐰","zec","livada","domaća","šuti","mrkva"],["🐝","pčela","livada","divlja","zuji","nektar"],["🦋","leptir","livada","divlja","šuti","nektar"],["🐸","žaba","bara","divlja","kreče","muhe"],["🦊","lisica","šuma","divlja","laje","meso"],["🐻","medvjed","šuma","divlja","riče","med"],["🦌","jelen","šuma","divlja","riče","trava"],["🐬","dupin","more","divlja","pište","riba"],["🦅","orao","planina","divlja","kriješti","meso"],["🐦","ptica","drvo","divlja","pjeva","sjemenke"],["🐢","kornjača","bara","divlja","šuti","salata"],["🐍","zmija","šuma","divlja","siče","miševi"],["🐠","riba","more","divlja","šuti","plankton"],["🕷️","pauk","kuća","divlja","šuti","muhe"],["🐜","mrav","zemlja","divlja","šuti","mrvice"],["🐌","puž","vrt","divlja","šuti","lišće"]];
  // prepoznaj
  A.forEach(([e,n]) => { q.push({ type:"input", difficulty:1, visual:e, question:"Koja životinja?", correctAnswer:n }); const w=sh(A.filter(([_,x])=>x!==n)).slice(0,3).map(([_,x])=>x); q.push({ type:"choice", difficulty:1, visual:e, question:"Koja životinja?", answers:sh([n,...w]), correctIndex:-1, _c:n }); });
  // gdje živi
  const hab=[...new Set(A.map(a=>a[2]))];
  A.forEach(([e,n,h]) => { const o=sh(hab).slice(0,4); if(!o.includes(h))o[3]=h; q.push({ type:"choice", difficulty:2, visual:e, question:`Gdje živi ${n}?`, answers:sh(o), correctIndex:-1, _c:h }); });
  // domaća/divlja
  A.forEach(([e,n,_,t]) => q.push({ type:"choice", difficulty:2, visual:e, question:`${n[0].toUpperCase()+n.slice(1)} je...`, answers:["domaća životinja","divlja životinja"], correctIndex:t==="domaća"?0:1 }));
  // hrana
  A.forEach(([e,n,_1,_2,_3,f]) => q.push({ type:"input", difficulty:3, visual:e, question:`Čime se hrani ${n}?`, correctAnswer:f }));
  // glas
  A.filter(([,,,,s])=>s!=="šuti").forEach(([e,n,_1,_2,s]) => { const sounds=["laje","mjauče","muče","blekeće","kukuriče","kokodače","njišti","zuji","kreče","riče","pjeva","pište","kriješti","siče"]; const o=sh(sounds.filter(x=>x!==s)).slice(0,3); q.push({ type:"choice", difficulty:2, visual:e, question:`Kako se glasa ${n}?`, answers:sh([s,...o]), correctIndex:-1, _c:s }); });
  // proizvodi
  [["🐄","krava","mlijeko"],["🐔","kokoš","jaja"],["🐑","ovca","vunu"],["🐝","pčela","med"]].forEach(([e,n,p]) => { const w=sh(["mlijeko","jaja","vunu","med","sir","perje","meso"]).filter(x=>x!==p).slice(0,3); q.push({ type:"choice", difficulty:2, visual:e, question:`Što daje ${n}?`, answers:sh([p,...w]), correctIndex:-1, _c:p }); });
  // noge
  [["pas",4],["mačka",4],["ptica",2],["riba",0],["pauk",8],["mrav",6],["konj",4],["kokoš",2],["zmija",0],["žaba",4]].forEach(([n,c]) => { const r=cfc(c,0,10); q.push({ type:"choice", difficulty:2, question:`Koliko nogu: ${n}?`, answers:r.answers, correctIndex:r.correctIndex }); });
  return fix(q).slice(0, 210);
}

function genTijelo() {
  const q = [];
  const P = [["👁️","oko"],["👂","uho"],["👃","nos"],["👄","usta"],["✋","ruka"],["🦵","noga"],["🦷","zub"],["💪","mišić"],["🧠","mozak"],["❤️","srce"]];
  P.forEach(([e,n]) => { q.push({ type:"input", difficulty:1, visual:e, question:"Dio tijela?", correctAnswer:n }); const w=sh(P.filter(([_,x])=>x!==n)).slice(0,3).map(([_,x])=>x); q.push({ type:"choice", difficulty:1, visual:e, question:"Dio tijela?", answers:sh([n,...w]), correctIndex:-1, _c:n }); });
  [["vid","očima"],["sluh","ušima"],["njuh","nosom"],["okus","jezikom"],["opip","kožom"]].forEach(([s,o]) => q.push({ type:"choice", difficulty:2, question:`Osjetilo ${s==="vid"?"vida":s==="sluh"?"sluha":s==="njuh"?"njuha":s==="okus"?"okusa":"opipa"} — čime?`, answers:sh(["očima","ušima","nosom","jezikom","kožom"]), correctIndex:-1, _c:o }));
  [["vidimo","očima"],["čujemo","ušima"],["hodamo","nogama"],["pišemo","rukama"],["mirišemo","nosom"],["žvačemo","zubima"],["mislimo","mozgom"],["trčimo","nogama"],["jedemo","ustima"],["govorimo","ustima"],["slušamo","ušima"],["gledamo","očima"],["crtamo","rukama"],["skačemo","nogama"],["pjevamo","ustima"],["plješćemo","rukama"],["njušimo","nosom"],["kušamo","jezikom"],["držimo","rukama"],["stojimo","nogama"]].forEach(([a,o]) => { const opts=sh(["očima","ušima","nogama","rukama","nosom","zubima","mozgom","ustima","jezikom","kožom"].filter(x=>x!==o)).slice(0,3); q.push({ type:"choice", difficulty:2, question:`Čime ${a}?`, answers:sh([o,...opts]), correctIndex:-1, _c:o }); });
  [["očiju",2],["ušiju",2],["ruku",2],["nogu",2],["nosova",1],["prstiju na ruci",5],["prstiju na nozi",5],["prstiju ukupno na rukama",10],["prstiju ukupno na nogama",10],["prstiju ukupno",20],["usana",2],["obrva",2],["koljena",2],["laktova",2],["palčeva na rukama",2]].forEach(([p,c]) => { const r=cfc(c,0,25); q.push({ type:"choice", difficulty:c<=2?2:3, question:`Koliko ${p}?`, answers:r.answers, correctIndex:r.correctIndex }); q.push({ type:"input", difficulty:3, question:`Koliko ${p}?`, correctAnswer:String(c) }); });
  q.push({ type:"choice", difficulty:2, question:"Koliko osjetila?", answers:["3","4","5","6"], correctIndex:2, hint:"Vid, sluh, njuh, okus, opip" });
  q.push({ type:"input", difficulty:2, question:"Koliko osjetila ima čovjek?", correctAnswer:"5" });
  [["Zašto peremo ruke?","da uklonimo klice"],["Zašto peremo zube?","da ne dobijemo karijes"],["Zašto jedemo voće?","jer ima vitamine"],["Zašto spavamo?","da se tijelo odmori"],["Zašto se igramo vani?","da budemo zdravi"]].forEach(([q2,c]) => { const w=sh(["da uklonimo klice","da ne dobijemo karijes","jer ima vitamine","da se tijelo odmori","da budemo zdravi"].filter(x=>x!==c)).slice(0,3); q.push({ type:"choice", difficulty:3, question:q2, answers:sh([c,...w]), correctIndex:-1, _c:c }); });
  // dijelovi lica
  [["👁️","oko","lice"],["👃","nos","lice"],["👄","usta","lice"],["👂","uho","glava"],["🦷","zub","usta"]].forEach(([e,n,loc]) => q.push({ type:"choice", difficulty:2, visual:e, question:`Gdje se nalazi ${n}?`, answers:sh(["lice","ruka","noga","glava","usta","trbuh"].filter(x=>true)).slice(0,4).includes(loc)?sh(["lice","ruka","noga","glava","usta","trbuh"].filter(x=>true)).slice(0,4):sh([loc,"ruka","noga","trbuh"]), correctIndex:-1, _c:loc }));
  // unutarnji organi
  [["srce","pumpa krv"],["pluća","dišu"],["mozak","misli"],["želudac","probavlja hranu"]].forEach(([o,f]) => { q.push({ type:"choice", difficulty:4, question:`Što radi ${o}?`, answers:sh([f,"hoda","vidi","čuje"]), correctIndex:-1, _c:f }); q.push({ type:"input", difficulty:4, question:`Koji organ ${f}?`, correctAnswer:o }); });
  // higijena
  [["Koliko puta dnevno treba prati zube?","2"],["Treba li prati ruke prije jela?","da"],["Treba li prati ruke nakon WC-a?","da"],["Je li važno jesti voće?","da"],["Treba li spavati dovoljno?","da"]].forEach(([q2,a]) => { if(a==="da"||a==="ne") q.push({ type:"choice", difficulty:2, question:q2, answers:["da","ne"], correctIndex:a==="da"?0:1 }); else q.push({ type:"input", difficulty:3, question:q2, correctAnswer:a }); });
  // kosti i mišići
  q.push({ type:"choice", difficulty:4, question:"Što drži naše tijelo uspravno?", answers:["koža","kosti","kovrče","odjeća"], correctIndex:1 });
  q.push({ type:"choice", difficulty:4, question:"Čime pomičemo ruke i noge?", answers:["kostima","kožom","mišićima","noktima"], correctIndex:2 });
  // emocije
  [["😊","sretan"],["😢","tužan"],["😡","ljut"],["😨","uplašen"],["😲","iznenađen"]].forEach(([e,em]) => { q.push({ type:"input", difficulty:2, visual:e, question:"Kako se osjeća ova osoba?", correctAnswer:em }); const w=sh(["sretan","tužan","ljut","uplašen","iznenađen"].filter(x=>x!==em)).slice(0,3); q.push({ type:"choice", difficulty:2, visual:e, question:"Kako se osjeća?", answers:sh([em,...w]), correctIndex:-1, _c:em }); });
  // hrana i zdravlje
  [["🍎","zdravo"],["🍕","nije zdravo"],["🥦","zdravo"],["🍬","nije zdravo"],["🥕","zdravo"],["🍫","nije zdravo"],["🍌","zdravo"],["🥤","nije zdravo"],["🍓","zdravo"],["🍩","nije zdravo"]].forEach(([e,h]) => q.push({ type:"choice", difficulty:2, visual:e, question:"Je li ova hrana zdrava?", answers:["zdravo","nije zdravo"], correctIndex:h==="zdravo"?0:1 }));
  // sport i kretanje
  [["⚽","nogama"],["🏀","rukama"],["🏊","cijelim tijelom"],["🚴","nogama"],["🤸","cijelim tijelom"]].forEach(([e,p]) => { const w=sh(["nogama","rukama","cijelim tijelom","glavom"]).filter(x=>x!==p).slice(0,3); q.push({ type:"choice", difficulty:3, visual:e, question:"Čime se ovaj sport igra?", answers:sh([p,...w]), correctIndex:-1, _c:p }); });
  // lijevo desno gore dolje
  q.push({ type:"choice", difficulty:3, question:"Glava je na ... dijelu tijela.", answers:["gornjem","donjem","lijevom","desnom"], correctIndex:0 });
  q.push({ type:"choice", difficulty:3, question:"Noge su na ... dijelu tijela.", answers:["gornjem","donjem","lijevom","desnom"], correctIndex:1 });
  q.push({ type:"choice", difficulty:3, question:"Srce je na ... strani prsa.", answers:["lijevoj","desnoj","gornjoj","donjoj"], correctIndex:0 });
  return fix(q).slice(0, 210);
}

function genObitelj() {
  const q = [];
  [["Tko je majčin muž?","otac"],["Tko je očeva žena?","majka"],["Tko je očev otac?","djed"],["Tko je očeva majka?","baka"],["Tko je majčin otac?","djed"],["Tko je majčina majka?","baka"],["Tko je brat mame?","ujak"],["Tko je sestra mame?","teta"],["Tko je brat tate?","stric"],["Tko je sestra tate?","teta"],["Tko su mama i tata?","roditelji"],["Tko je sin ujaka?","bratić"],["Tko je kći ujaka?","sestrična"]].forEach(([q2,a]) => { q.push({ type:"input", difficulty:2, question:q2, correctAnswer:a }); const w=sh(["otac","majka","djed","baka","ujak","teta","stric","brat","sestra","bratić","sestrična","roditelji"].filter(x=>x!==a)).slice(0,3); q.push({ type:"choice", difficulty:1, question:q2, answers:sh([a,...w]), correctIndex:-1, _c:a }); });
  [["🛏️","spavaća soba","spavamo"],["🍳","kuhinja","kuhamo"],["🛁","kupaonica","kupamo se"],["📺","dnevni boravak","gledamo TV"],["🚗","garaža","parkiramo auto"],["🌳","dvorište","igramo se"],["📚","radna soba","učimo"],["🍽️","blagovaonica","jedemo"]].forEach(([e,r,a]) => { q.push({ type:"input", difficulty:2, visual:e, question:"Prostorija?", correctAnswer:r }); const w=sh(["spavaća soba","kuhinja","kupaonica","dnevni boravak","garaža","dvorište","radna soba","blagovaonica"].filter(x=>x!==r)).slice(0,3); q.push({ type:"choice", difficulty:2, question:`Gdje ${a}?`, answers:sh([r,...w]), correctIndex:-1, _c:r }); });
  [["🛏️","krevet"],["🪑","stolica"],["🚪","vrata"],["📺","televizor"],["🪥","četkica"],["🧹","metla"],["🍴","vilica"],["🥄","žlica"],["📖","knjiga"],["⏰","sat"],["💡","žarulja"],["🪞","ogledalo"],["🧸","igračka"],["🎒","torba"],["✏️","olovka"],["📱","telefon"]].forEach(([e,n]) => q.push({ type:"input", difficulty:2, visual:e, question:"Predmet?", correctAnswer:n }));
  [["👩‍🏫","učiteljica","škola"],["👨‍⚕️","liječnik","bolnica"],["👩‍🍳","kuharica","kuhinja"],["👮","policajac","policija"],["🧑‍🚒","vatrogasac","vatrogasna"],["👩‍🌾","poljoprivrednik","polje"],["✈️","pilot","avion"],["📬","poštar","pošta"],["🏗️","građevinar","gradilište"]].forEach(([e,j,p]) => { const jw=sh(["učiteljica","liječnik","kuharica","policajac","vatrogasac","pilot","poštar","građevinar"].filter(x=>x!==j)).slice(0,3); q.push({ type:"choice", difficulty:2, visual:e, question:`Tko radi u: "${p}"?`, answers:sh([j,...jw]), correctIndex:-1, _c:j }); const pw=sh(["škola","bolnica","kuhinja","policija","vatrogasna","polje","avion","pošta","gradilište"].filter(x=>x!==p)).slice(0,3); q.push({ type:"choice", difficulty:3, question:`Gdje radi ${j}?`, answers:sh([p,...pw]), correctIndex:-1, _c:p }); });
  [["Što kažemo kad tražimo?","Molim"],["Kad dobijemo?","Hvala"],["Kad nekome stanemo na nogu?","Oprosti"],["Pozdrav ujutro?","Dobro jutro"],["Pozdrav navečer?","Laku noć"],["Pozdrav tijekom dana?","Dobar dan"],["Kad odlazimo?","Doviđenja"],["Kad sretnemo prijatelja?","Bok"]].forEach(([q2,a]) => { const w=sh(["Molim","Hvala","Oprosti","Dobro jutro","Laku noć","Dobar dan","Doviđenja","Bok"].filter(x=>x!==a)).slice(0,3); q.push({ type:"choice", difficulty:2, question:q2, answers:sh([a,...w]), correctIndex:-1, _c:a }); q.push({ type:"input", difficulty:3, question:q2, correctAnswer:a }); });
  q.push({ type:"choice", difficulty:2, question:"Broj za hitnu pomoć?", answers:["192","193","194","112"], correctIndex:3 });
  q.push({ type:"choice", difficulty:2, question:"Broj za vatrogasce?", answers:["192","193","194","112"], correctIndex:1 });
  q.push({ type:"choice", difficulty:2, question:"Broj za policiju?", answers:["192","193","194","112"], correctIndex:0 });
  // dani u tjednu
  const dani=["ponedjeljak","utorak","srijeda","četvrtak","petak","subota","nedjelja"];
  dani.forEach((d,i) => { if(i<6) q.push({ type:"choice", difficulty:3, question:`Koji dan dolazi nakon: ${d}?`, answers:sh([dani[i+1],dani[(i+3)%7],dani[(i+5)%7],dani[(i+2)%7]]), correctIndex:-1, _c:dani[i+1] }); });
  q.push({ type:"choice", difficulty:2, question:"Koliko dana ima tjedan?", answers:["5","6","7","8"], correctIndex:2 });
  q.push({ type:"choice", difficulty:3, question:"Koji su dani vikenda?", answers:["ponedjeljak i utorak","subota i nedjelja","petak i subota","četvrtak i petak"], correctIndex:1 });
  // kućni predmeti - funkcija
  [["🪥","četkica","peremo zube"],["🧹","metla","čistimo pod"],["🍴","vilica","jedemo"],["📱","telefon","zovemo"],["💡","žarulja","svijetli"],["⏰","sat","pokazuje vrijeme"],["🪞","ogledalo","gledamo se"]].forEach(([e,n,f]) => { const w=sh(["peremo zube","čistimo pod","jedemo","zovemo","svijetli","pokazuje vrijeme","gledamo se"].filter(x=>x!==f)).slice(0,3); q.push({ type:"choice", difficulty:3, visual:e, question:`Za što koristimo ${n}?`, answers:sh([f,...w]), correctIndex:-1, _c:f }); });
  // pravila u školi
  [["Trebamo li slušati učiteljicu?","da"],["Smijemo li trčati po hodniku?","ne"],["Trebamo li biti tihi dok učiteljica govori?","da"],["Smijemo li gurnuti prijatelja?","ne"],["Trebamo li pomoći prijatelju?","da"],["Smijemo li jesti na satu?","ne"],["Trebamo li donijeti knjige?","da"],["Smijemo li vikati u razredu?","ne"]].forEach(([q2,a]) => q.push({ type:"choice", difficulty:2, question:q2, answers:["da","ne"], correctIndex:a==="da"?0:1 }));
  // dijelovi škole
  [["učionica","učimo"],["knjižnica","čitamo knjige"],["dvorište","igramo se"],["blagovaonica","jedemo"],["dvorana za sport","vježbamo"]].forEach(([r,a]) => { const w=sh(["učimo","čitamo knjige","igramo se","jedemo","vježbamo"].filter(x=>x!==a)).slice(0,3); q.push({ type:"choice", difficulty:3, question:`U ${r} ...`, answers:sh([a,...w]), correctIndex:-1, _c:a }); });
  // sigurnost
  [["Što radiš ako se izgubiš?","tražim odraslu osobu"],["Smijete li otvarati vrata nepoznatima?","ne"],["Što radiš na pješačkom prijelazu?","pogledaš lijevo-desno"],["Smijete li se igrati s vatrom?","ne"]].forEach(([q2,a]) => { if(a==="da"||a==="ne") q.push({ type:"choice", difficulty:3, question:q2, answers:["da","ne"], correctIndex:a==="da"?0:1 }); else { const w=sh(["trčim dalje","plačem","tražim odraslu osobu","pogledaš lijevo-desno","ništa"].filter(x=>x!==a)).slice(0,3); q.push({ type:"choice", difficulty:3, question:q2, answers:sh([a,...w]), correctIndex:-1, _c:a }); } });
  return fix(q).slice(0, 210);
}

module.exports = { genDoba, genZivotinje, genTijelo, genObitelj, genSigurnost, genEkologija };

// ═══════════════════════════════════════════════════════
// PID B.1.3 + C.1.2 + D.1.1 — Sigurnost, promet, energija, prostor
// ═══════════════════════════════════════════════════════
function genSigurnost() {
  const q = [];
  const { sh, fix } = require('./gen-hrvatski');

  // --- PROMET I SIGURNOST (B.1.3, zdr.C.1.1.A) ---
  q.push({ type:"choice", difficulty:1, question:"Što moraš napraviti na pješačkom prijelazu?", answers:["Pogledati lijevo-desno","Trčati","Zatvoriti oči","Ništa"], correctIndex:0 });
  q.push({ type:"choice", difficulty:1, question:"Na koju boju semafora pješaci prelaze cestu?", answers:["Crvenu","Žutu","Zelenu","Plavu"], correctIndex:2 });
  q.push({ type:"choice", difficulty:1, question:"Na crveno svjetlo pješak...?", answers:["trči","stoji i čeka","prelazi cestu","skače"], correctIndex:1 });
  q.push({ type:"choice", difficulty:2, question:"Što znači žuto svjetlo na semaforu?", answers:["Pripremi se","Idi","Stani","Trči"], correctIndex:0 });
  q.push({ type:"choice", difficulty:1, question:"Gdje pješaci hodaju?", answers:["Po cesti","Po nogostupu","Po travi","Po krovu"], correctIndex:1 });
  q.push({ type:"choice", difficulty:2, question:"Smiju li se djeca igrati na cesti?", answers:["Da","Ne"], correctIndex:1 });
  q.push({ type:"choice", difficulty:2, question:"Koji znak znači STOP?", answers:["🔴 Crveni osmerokut","🔵 Plavi krug","🟡 Žuti trokut","⬜ Bijeli kvadrat"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Što moraš nositi u autu?", answers:["Sigurnosni pojas","Kapu","Naočale","Rukavice"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Kada je sigurnije prijeći cestu?", answers:["Kad nema auta","Kad su auta blizu","Kad je mrak","Kad pada kiša"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Kako se najsigurnije voziti bicikl?", answers:["S kacigom","Bez ruku","U mraku","Po cesti"], correctIndex:0 });
  // kretanje od kuće do škole
  q.push({ type:"choice", difficulty:2, question:"Kada ideš u školu, hodiš po...?", answers:["nogostupu","cesti","parkingu","travi"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Ako nema nogostupa, hodiš...?", answers:["lijevom stranom ceste","sredinom ceste","desnom stranom ceste","po travi"], correctIndex:0 });

  // T/N promet
  [["Cestu prelazimo na pješačkom prijelazu.",true],["Djeca se smiju igrati na cesti.",false],["Zeleno svjetlo znači 'idi'.",true],["Bicikl vozimo bez kacige.",false],["U autu moramo imati pojas.",true],["Možemo trčati preko ceste.",false],["Na crveno čekamo.",true],["Nogostup je za automobile.",false]].forEach(([s,c]) => q.push({ type:"choice", difficulty:1, question:s, answers:["Točno","Netočno"], correctIndex:c?0:1 }));

  // --- SIGURNOST U KUĆI (zdr.C.1.1.B) ---
  q.push({ type:"choice", difficulty:2, question:"Smijemo li se igrati s vatrom?", answers:["Da","Ne"], correctIndex:1 });
  q.push({ type:"choice", difficulty:2, question:"Smijemo li dirati vruću peć?", answers:["Da","Ne"], correctIndex:1 });
  q.push({ type:"choice", difficulty:2, question:"Smijemo li otvarati vrata nepoznatima?", answers:["Da","Ne"], correctIndex:1 });
  q.push({ type:"choice", difficulty:2, question:"Što radiš ako se izgubiš?", answers:["Tražim odraslu osobu","Trčim dalje","Plačem sam","Idem kući sam"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Smijemo li trčati po mokrom podu?", answers:["Da","Ne"], correctIndex:1 });
  q.push({ type:"choice", difficulty:2, question:"Što je opasno u kuhinji?", answers:["Nož i vruća voda","Žlica","Tanjur","Ubrus"], correctIndex:0 });
  q.push({ type:"choice", difficulty:3, question:"Ako vidiš požar, zoveš broj...", answers:["193","192","194","112"], correctIndex:3 });
  q.push({ type:"choice", difficulty:3, question:"Broj za hitnu pomoć je...", answers:["193","194","112","199"], correctIndex:2 });
  q.push({ type:"choice", difficulty:3, question:"Smijemo li umetati prste u utičnicu?", answers:["Da","Ne"], correctIndex:1 });
  q.push({ type:"choice", difficulty:2, question:"Smijemo li piti nepoznate tekućine iz bočica?", answers:["Da","Ne"], correctIndex:1 });

  // T/N sigurnost u kući
  [["S vatrom se ne smijemo igrati.",true],["Vruća peć nije opasna.",false],["Nepoznatim osobama ne otvaramo vrata.",true],["Struja je opasna.",true],["Smijemo piti nepoznate tekućine.",false],["Nož je opasan za djecu.",true],["Na mokrom podu se može poskliznuti.",true],["Igračke na stepenicama su sigurne.",false]].forEach(([s,c]) => q.push({ type:"choice", difficulty:2, question:s, answers:["Točno","Netočno"], correctIndex:c?0:1 }));

  // --- SNALAŽENJE U PROSTORU (B.1.3) ---
  q.push({ type:"choice", difficulty:1, question:"Što je GORE?", answers:["Strop","Pod","Vrata","Prozor"], correctIndex:0 });
  q.push({ type:"choice", difficulty:1, question:"Što je DOLJE?", answers:["Strop","Pod","Lampa","Oblak"], correctIndex:1 });
  q.push({ type:"choice", difficulty:2, question:"Lijeva ruka je na ___ strani.", answers:["lijevoj","desnoj","gornjoj","donjoj"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Ako stojiš licem prema ploči, ploča je...", answers:["ispred tebe","iza tebe","pored tebe","iznad tebe"], correctIndex:0 });
  [["ispred","iza"],["lijevo","desno"],["gore","dolje"],["blizu","daleko"],["unutra","van"]].forEach(([a,b]) => {
    q.push({ type:"choice", difficulty:2, question:`Što je suprotno od "${a}"?`, answers:[b,a,"pored","iznad"], correctIndex:0 });
  });
  // gdje se nalazim
  [["učionica","učimo"],["blagovaonica","jedemo"],["dvorište","igramo se"],["knjižnica","čitamo knjige"],["dvorana","vježbamo"]].forEach(([r,a]) => {
    q.push({ type:"choice", difficulty:2, question:`U ${r.charAt(0).toUpperCase()+r.slice(1)} ...`, answers:[a,"spavamo","kupujemo","vozimo auto"], correctIndex:0 });
  });

  // --- ENERGIJA (D.1.1) ---
  q.push({ type:"choice", difficulty:2, question:"Što nam daje toplinu?", answers:["Sunce","Mjesec","Zvijezde","Oblaci"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Čemu treba struja?", answers:["Lampi","Kamenu","Drveću","Oblaku"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Smijemo li ostavljati upaljeno svjetlo kad izlazimo?", answers:["Da","Ne"], correctIndex:1 });
  q.push({ type:"choice", difficulty:3, question:"Kako štedimo struju?", answers:["Gasimo svjetlo kad izlazimo","Ostavljamo TV upaljen","Otvaramo hladnjak","Palimo sve lampe"], correctIndex:0 });
  q.push({ type:"choice", difficulty:3, question:"Koji uređaj koristi struju?", answers:["Televizor","Stolica","Knjiga","Lopta"], correctIndex:0 });
  [["hladnjak",true],["stol",false],["perilica",true],["olovka",false],["računalo",true],["lopta",false],["lampa",true],["jastuk",false]].forEach(([o,c]) => q.push({ type:"choice", difficulty:2, question:`Koristi li ${o} struju?`, answers:["Da","Ne"], correctIndex:c?0:1 }));

  // T/N energija
  [["Sunce nam daje toplinu i svjetlost.",true],["Struja nije opasna.",false],["Trebamo gasiti svjetlo kad izlazimo iz sobe.",true],["Televizor radi bez struje.",false]].forEach(([s,c]) => q.push({ type:"choice", difficulty:2, question:s, answers:["Točno","Netočno"], correctIndex:c?0:1 }));

  // --- DANE U TJEDNU / SAT (A.1.2, B.1.2) ---
  const dani = ["ponedjeljak","utorak","srijeda","četvrtak","petak","subota","nedjelja"];
  for (let i=0;i<7;i++) q.push({ type:"choice", difficulty:2, question:`Koji dan dolazi nakon ${dani[i].charAt(0).toUpperCase()+dani[i].slice(1)}?`, answers:[dani[(i+1)%7],dani[(i+2)%7],dani[(i+5)%7],dani[(i+3)%7]], correctIndex:0 });
  q.push({ type:"input", difficulty:2, question:"Koliko dana ima u tjednu?", correctAnswer:"7" });
  q.push({ type:"choice", difficulty:2, question:"Koji je PRVI dan u tjednu?", answers:["Ponedjeljak","Utorak","Nedjelja","Subota"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Koji dani su VIKEND?", answers:["Subota i nedjelja","Ponedjeljak i utorak","Srijeda i četvrtak","Petak i subota"], correctIndex:0 });
  q.push({ type:"choice", difficulty:3, question:"Idemo li u školu vikendom?", answers:["Da","Ne"], correctIndex:1 });

  // --- MJESECI ---
  q.push({ type:"input", difficulty:3, question:"Koliko mjeseci ima u godini?", correctAnswer:"12" });
  q.push({ type:"choice", difficulty:3, question:"Koji je prvi mjesec u godini?", answers:["Siječanj","Veljača","Ožujak","Prosinac"], correctIndex:0 });
  q.push({ type:"choice", difficulty:3, question:"Koji je zadnji mjesec u godini?", answers:["Siječanj","Studeni","Prosinac","Lipanj"], correctIndex:2 });

  return fix(q).slice(0, 210);
}

// ═══════════════════════════════════════════════════════
// PID B.1.1 + C.1.1 + C.1.2 — Ekologija, zdravlje, zajednica
// odr A.1.3, zdr A.1.2, zdr A.1.3
// ═══════════════════════════════════════════════════════
function genEkologija() {
  const q = [];
  const { sh, fix } = require('./gen-hrvatski');

  // --- BRIGA ZA PRIRODU (B.1.1, odr C.1.1) ---
  q.push({ type:"choice", difficulty:1, question:"Gdje bacamo smeće?", answers:["U kantu za smeće","Na pod","U rijeku","Na travu"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Zašto ne smijemo bacati smeće u prirodu?", answers:["Zagađuje okoliš","Zato što je lijepo","Životinje to vole","Nema razloga"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Što znači RECIKLIRATI?", answers:["Ponovno koristiti otpad","Baciti u rijeku","Zapaliti smeće","Zakopati u zemlju"], correctIndex:0 });

  // sortiraj otpad po bojama kontejnera
  [["papir","plavi"],["plastika","žuti"],["staklo","zeleni"],["biootpad","smeđi"]].forEach(([mat,boja]) => {
    q.push({ type:"choice", difficulty:3, question:`U koji kontejner ide ${mat}?`, answers:["Plavi","Žuti","Zeleni","Smeđi"], correctIndex:["plavi","žuti","zeleni","smeđi"].indexOf(boja) });
  });
  // što ide u koji kontejner
  [["novine","plavi"],["plastična boca","žuti"],["staklenka","zeleni"],["kora od banane","smeđi"],["kartonska kutija","plavi"],["vrećica","žuti"],["tegla od džema","zeleni"],["lišće","smeđi"]].forEach(([obj,boja]) => {
    q.push({ type:"choice", difficulty:3, question:`"${obj}" bacamo u ___ kontejner.`, answers:["plavi","žuti","zeleni","smeđi"], correctIndex:["plavi","žuti","zeleni","smeđi"].indexOf(boja) });
  });

  // briga za biljke i životinje
  q.push({ type:"choice", difficulty:1, question:"Što biljke trebaju za rast?", answers:["Vodu, sunce i zemlju","Čokoladu","Igračke","Televizor"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Smijemo li trgati cvijeće u parku?", answers:["Da","Ne"], correctIndex:1 });
  q.push({ type:"choice", difficulty:2, question:"Smijemo li hraniti divlje životinje u zoološkom vrtu?", answers:["Da","Ne"], correctIndex:1 });
  q.push({ type:"choice", difficulty:1, question:"Kako brinemo za kućnog ljubimca?", answers:["Hranimo ga i pazimo","Ignoriramo ga","Ostavljamo ga vani","Dajemo mu čokoladu"], correctIndex:0 });

  // T/N ekologija
  [["Smeće bacamo u kantu.",true],["Smeće možemo baciti u rijeku.",false],["Recikliranje je dobro za prirodu.",true],["Papir ide u žuti kontejner.",false],["Plastika ide u žuti kontejner.",true],["Biljke trebaju vodu.",true],["Cvijeće u parku smijemo trgati.",false],["Moramo čuvati prirodu.",true],["Smeće u šumi nije problem.",false],["Životinje trebaju čistu vodu.",true]].forEach(([s,c]) => q.push({ type:"choice", difficulty:2, question:s, answers:["Točno","Netočno"], correctIndex:c?0:1 }));

  // --- ZDRAVLJE I HIGIJENA (zdr A.1.2, A.1.3) ---
  q.push({ type:"choice", difficulty:1, question:"Kada peremo ruke?", answers:["Prije jela i nakon WC-a","Nikad","Samo ujutro","Samo navečer"], correctIndex:0 });
  q.push({ type:"choice", difficulty:1, question:"Čime peremo zube?", answers:["Četkicom i pastom","Sapunom","Vodom","Ručnikom"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Koliko puta dnevno trebamo prati zube?", answers:["Jednom","Dva puta","Tri puta","Nikad"], correctIndex:1 });
  q.push({ type:"choice", difficulty:1, question:"Što je ZDRAVA hrana?", answers:["Voće i povrće","Čips i slatkiši","Grickalice","Sokovi"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Zašto je sport važan?", answers:["Za zdravlje tijela","Nije važan","Samo za odrasle","Samo zimi"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Koliko vode trebamo piti dnevno?", answers:["Puno čaša","Ništa","Samo sok","Samo mlijeko"], correctIndex:0 });
  // zdrava/nezdrava hrana
  [["🍎 jabuka",true],["🍬 bombon",false],["🥕 mrkva",true],["🍟 pomfrit",false],["🥛 mlijeko",true],["🍭 lizalica",false],["🍌 banana",true],["🧁 kolač",false],["🥦 brokula",true],["🍩 krafna",false],["🥚 jaje",true],["🌽 kukuruz",true]].forEach(([item,healthy]) => {
    q.push({ type:"choice", difficulty:1, question:`Je li ${item} zdrava hrana?`, answers:["Da","Ne"], correctIndex:healthy?0:1 });
  });
  // T/N higijena
  [["Ruke peremo prije jela.",true],["Zube peremo jednom tjedno.",false],["Voće je zdravo.",true],["Tjelovježba je važna za zdravlje.",true],["Slatkiši su zdravi.",false],["Trebamo piti dovoljno vode.",true],["Tuširanje nije potrebno.",false],["Čist zrak je važan za zdravlje.",true]].forEach(([s,c]) => q.push({ type:"choice", difficulty:1, question:s, answers:["Točno","Netočno"], correctIndex:c?0:1 }));

  // --- ZAJEDNICA I PRAVILA (C.1.1, C.1.2) ---
  q.push({ type:"choice", difficulty:1, question:"Tko radi u školi?", answers:["Učiteljica i ravnatelj","Liječnik","Vatrogasac","Pilot"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Zašto imamo pravila u razredu?", answers:["Da svi budu sigurni i sretni","Da budemo tužni","Da ne učimo","Bez razloga"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Što znači biti dobar prijatelj?", answers:["Dijelimo i pomažemo","Svađamo se","Ignoriramo druge","Uzimamo tuđe"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Što radimo kad netko govori?", answers:["Slušamo","Vičemo","Trčimo","Gledamo telefon"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Što kažemo kad nešto dobijemo?", answers:["Hvala","Daj mi još","Ništa","Ne želim"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Što kažemo kad nekoga gurnemo?", answers:["Oprosti","Ništa","To je tvoja krivica","Baš me briga"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Što kažemo ujutro kad dođemo u školu?", answers:["Dobro jutro","Laku noć","Doviđenja","Bok"], correctIndex:0 });
  // zanimanja u zajednici
  [["liječnik","liječi ljude"],["vatrogasac","gasi požar"],["policajac","čuva red"],["učiteljica","uči djecu"],["poštar","nosi pisma"],["kuhar","kuha hranu"],["vozač","vozi autobus"],["farmer","uzgaja hranu"]].forEach(([job,what]) => {
    const wrongs = sh(["liječi ljude","gasi požar","čuva red","uči djecu","nosi pisma","kuha hranu","vozi autobus","uzgaja hranu"].filter(x=>x!==what)).slice(0,3);
    q.push({ type:"choice", difficulty:2, question:`Što radi ${job}?`, answers:sh([what,...wrongs]), correctIndex:-1, _c:what });
  });

  // prava djece
  q.push({ type:"choice", difficulty:3, question:"Svako dijete ima pravo na...?", answers:["Obrazovanje i igru","Samo rad","Samo spavanje","Ništa"], correctIndex:0 });
  q.push({ type:"choice", difficulty:3, question:"Tko brine o djeci?", answers:["Roditelji i obitelj","Nitko","Samo učitelj","Samo liječnik"], correctIndex:0 });

  // T/N zajednica
  [["U školi imamo pravila.",true],["Pravila nisu važna.",false],["Trebamo pomagati jedni drugima.",true],["Svako dijete ima pravo na školu.",true],["Možemo uzimati tuđe stvari.",false],["Kad pogriješimo, kažemo oprosti.",true],["Liječnik gasi požar.",false],["Vatrogasac liječi ljude.",false]].forEach(([s,c]) => q.push({ type:"choice", difficulty:2, question:s, answers:["Točno","Netočno"], correctIndex:c?0:1 }));

  return fix(q).slice(0, 210);
}
