/**
 * seed-r4.js — Učilica generatori za 4. razred
 * Prema GIK Razredna nastava 4. razred OS
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const { MongoClient } = require("mongodb");
const { N, IF, IM, sh, cfc, rep, fix, EL, CIRCLE } = require("./gen-hrvatski");

const GRADE = 4;

const subjects = [
  { name: "Hrvatski jezik", slug: "hrvatski", icon: "📖", color: "#FF6B6B", description: "Imenice, glagoli, pridjevi, pravopis, književnost", order: 1 },
  { name: "Matematika", slug: "matematika", icon: "🔢", color: "#60A5FA", description: "Brojevi do milijun, množenje, dijeljenje, geometrija", order: 2 },
  { name: "Priroda i društvo", slug: "priroda", icon: "🌿", color: "#34D399", description: "Hrvatska, krajevi, tijelo, biljke, životinje", order: 3 }
];

const topicsDef = {
  hrvatski: [
    { name: "Imenice, glagoli, pridjevi", slug: "vrste-rijeci-4", icon: "📝", order: 1 },
    { name: "Pravopis i gramatika", slug: "pravopis-4", icon: "✏️", order: 2 },
    { name: "Književnost", slug: "knjizevnost-4", icon: "📚", order: 3 },
    { name: "Medijska kultura", slug: "medijska-kultura", icon: "🎬", order: 4 },
  ],
  matematika: [
    { name: "Brojevi do milijun", slug: "brojevi-milijun", icon: "🔢", order: 1 },
    { name: "Pisano zbrajanje i oduzimanje", slug: "pisano-zbr-oduz", icon: "➕", order: 2 },
    { name: "Pisano množenje i dijeljenje", slug: "pisano-mnoz-dijel", icon: "✖️", order: 3 },
    { name: "Geometrija — kutovi i likovi", slug: "geometrija-kutovi", icon: "📐", order: 4 },
    { name: "Opseg i površina", slug: "opseg-povrsina", icon: "📏", order: 5 },
    { name: "Kvader i kocka", slug: "kvader-kocka", icon: "🧊", order: 6 },
  ],
  priroda: [
    { name: "Prirodni uvjeti života", slug: "uvjeti-zivota", icon: "☀️", order: 1 },
    { name: "Krajevi Hrvatske", slug: "krajevi-hr", icon: "🇭🇷", order: 2 },
    { name: "Ljudsko tijelo", slug: "ljudsko-tijelo", icon: "🧍", order: 3 },
    { name: "Hrvatska — domovina", slug: "hrvatska-domovina", icon: "🏛️", order: 4 },
    { name: "Biljke i životinje", slug: "biljke-zivotinje-4", icon: "🌿", order: 5 },
  ]
};

// ═══════════════════════════════════════════════════════
// HRVATSKI JEZIK — 4. RAZRED
// ═══════════════════════════════════════════════════════

function genVrsteRijeci4() {
  const q = [];
  // Imenice — rod, broj, padež (osnove)
  const imenice = ["ljubav","prijateljstvo","sreća","dom","škola","grad","rijeka","planina","more","sloboda","zemlja","sunce","mjesec","zvijezda","oblak"];
  imenice.forEach(w => q.push({ type:"choice", difficulty:1, question:`"${w}" je:`, answers:sh(["imenica","glagol","pridjev","prilog"]), correctIndex:-1, _c:"imenica" }));

  // Glagoli — prošlost, sadašnjost, budućnost
  [["čitam","sadašnjost"],["čitao sam","prošlost"],["čitat ću","budućnost"],["pišem","sadašnjost"],["pisao sam","prošlost"],["pisat ću","budućnost"],["trčim","sadašnjost"],["trčao sam","prošlost"],["trčat ću","budućnost"],["učim","sadašnjost"],["učio sam","prošlost"],["učit ću","budućnost"]].forEach(([g,v]) => {
    q.push({ type:"choice", difficulty:2, question:`"${g}" izriče:`, answers:["prošlost","sadašnjost","budućnost"], correctIndex:v==="prošlost"?0:v==="sadašnjost"?1:2 });
  });

  // Pridjevi — opisni i posvojni
  [["lijep","opisni"],["mamin","posvojni"],["velik","opisni"],["tatin","posvojni"],["crven","opisni"],["bratov","posvojni"],["hladan","opisni"],["školski","posvojni"],["brz","opisni"],["Anin","posvojni"]].forEach(([p,tip]) => {
    q.push({ type:"choice", difficulty:3, question:`"${p}" je koji pridjev?`, answers:["opisni","posvojni"], correctIndex:tip==="opisni"?0:1 });
  });

  // Pridjevi izvedeni od vlastitih imena — veliko/malo slovo
  [["Anin","veliko"],["gradski","malo"],["Zagrebački","veliko"],["školski","malo"],["Hrvatski","veliko"],["lijep","malo"]].forEach(([p,sl]) => {
    q.push({ type:"choice", difficulty:3, question:`"${p}" pišemo:`, answers:["velikim slovom","malim slovom"], correctIndex:sl==="veliko"?0:1 });
  });

  return fix(q).slice(0, 210);
}

function genPravopis4() {
  const q = [];
  // Veliko slovo — kratice
  [["RH","Republika Hrvatska"],["EU","Europska unija"],["UN","Ujedinjeni narodi"],["npr.","na primjer"],["itd.","i tako dalje"],["tzv.","takozvani"]].forEach(([kr,puno]) => {
    q.push({ type:"input", difficulty:2, question:`Kratica za "${puno}":`, correctAnswer:kr });
  });

  // Upravni govor — interpunkcija
  q.push({ type:"choice", difficulty:3, question:`Kako se piše upravni govor?`, answers:['Ana reče: "Idem kući."','Ana reče Idem kući','Ana reče, idem kući','Ana: reče "Idem kući"'], correctIndex:0 });
  q.push({ type:"choice", difficulty:3, question:`Što je upravni govor?`, answers:["Doslovne riječi govornika","Prepričane tuđe riječi","Opis radnje","Pitanje"], correctIndex:0 });
  q.push({ type:"choice", difficulty:3, question:`Što je neupravni govor?`, answers:["Doslovne riječi govornika","Prepričane tuđe riječi","Pjesma","Kratica"], correctIndex:1 });

  // č/ć, đ/dž, ije/je
  [["čokolada","č"],["voće","ć"],["lađa","đ"],["udžbenik","dž"],["svječica","je"],["mlijeko","ije"],["bijel","ije"],["cjena","je"]].forEach(([w,gl]) => {
    if (gl === "č" || gl === "ć") q.push({ type:"choice", difficulty:3, question:`"${w}" sadrži:`, answers:["č","ć"], correctIndex:gl==="č"?0:1 });
    else if (gl === "đ" || gl === "dž") q.push({ type:"choice", difficulty:3, question:`"${w}" sadrži:`, answers:["đ","dž"], correctIndex:gl==="đ"?0:1 });
    else q.push({ type:"choice", difficulty:3, question:`"${w}" sadrži:`, answers:["ije","je"], correctIndex:gl==="ije"?0:1 });
  });

  // Književni jezik vs zavičajni govor
  q.push({ type:"choice", difficulty:2, question:"Što je standardni jezik?", answers:["Službeni jezik koji svi razumiju","Jezik jednog sela","Strani jezik","Matematički jezik"], correctIndex:0 });

  return fix(q).slice(0, 210);
}

function genKnjizevnost4() {
  const q = [];
  // Književne vrste
  [["bajka","priča s čarobnim bićima"],["mit","priča o bogovima i postanku"],["legenda","priča o junacima koja ima temelj u stvarnosti"],["basna","poučna priča s životinjama"],["roman","dugačko prozno djelo"]].forEach(([v,opis]) => {
    const wr = sh(["bajka","mit","legenda","basna","roman","pjesma"].filter(x=>x!==v)).slice(0,3);
    q.push({ type:"choice", difficulty:2, question:`"${opis}" — to je:`, answers:sh([v,...wr]), correctIndex:-1, _c:v });
  });

  // Likovi — glavni, sporedni
  q.push({ type:"choice", difficulty:2, question:"Glavni lik u priči je:","answers":["lik oko kojeg se vrti radnja","nevažan lik","autor priče","čitatelj"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Sporedni likovi su:", answers:["likovi koji pomažu u radnji","najvažniji likovi","autori","čitatelji"], correctIndex:0 });

  // Struktura priče
  q.push({ type:"choice", difficulty:2, question:"Koji su dijelovi priče?", answers:["uvod, zaplet, rasplet","samo početak","samo kraj","pitanje i odgovor"], correctIndex:0 });

  // Personifikacija, usporedba
  q.push({ type:"choice", difficulty:3, question:`"Vjetar je pjevao" — to je:`, answers:["personifikacija","usporedba","hiperbola","rima"], correctIndex:0 });
  q.push({ type:"choice", difficulty:3, question:`"Brz kao vjetar" — to je:`, answers:["personifikacija","usporedba","hiperbola","rima"], correctIndex:1 });

  // Ritam u pjesmi
  q.push({ type:"choice", difficulty:2, question:"Što je rima?", answers:["Slaganje glasova na kraju stihova","Naslov pjesme","Lik u priči","Vrsta slova"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Što je stih?", answers:["Jedan redak u pjesmi","Cijela pjesma","Naslov","Autor"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Što je strofa?", answers:["Skupina stihova","Jedan stih","Naslov","Rima"], correctIndex:0 });

  return fix(q).slice(0, 210);
}

function genMedijskaKultura() {
  const q = [];
  q.push({ type:"choice", difficulty:2, question:"Što je dokumentarni film?", answers:["Film koji prikazuje stvarne događaje","Izmišljena priča","Crtani film","Reklamni spot"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Što je animirani film?", answers:["Film s crtanim ili lutkarskim likovima","Film o stvarnim ljudima","Dokumentarni film","Reklamni spot"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Što je strip?", answers:["Priča ispričana crtežima i tekstom","Samo tekst","Samo slike","Glazbeno djelo"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Čemu služi knjižnica?", answers:["Posuđivanju i čitanju knjiga","Kupovini hrane","Gledanju filmova","Igranju igara"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Što je rječnik?", answers:["Knjiga koja objašnjava značenja riječi","Roman","Bajka","Udžbenik matematike"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Što je pravopis?", answers:["Knjiga s pravilima pisanja","Roman","Pjesma","Atlas"], correctIndex:0 });
  return fix(q).slice(0, 210);
}

// ═══════════════════════════════════════════════════════
// MATEMATIKA — 4. RAZRED
// ═══════════════════════════════════════════════════════

function genBrojeviMilijun() {
  const q = [];
  // Mjesna vrijednost
  [1234, 5678, 12345, 98765, 100000, 543210, 999999].forEach(n => {
    const s = String(n);
    q.push({ type:"input", difficulty:2, question:`Koliko ZNAMENAKA ima broj ${n.toLocaleString('hr')}?`, correctAnswer:String(s.length) });
  });
  // Dekadske jedinice
  q.push({ type:"choice", difficulty:2, question:"1 tisuća = ?", answers:["100","1 000","10 000","100 000"], correctIndex:1 });
  q.push({ type:"choice", difficulty:2, question:"10 tisuća = ?", answers:["1 000","10 000","100 000","1 000 000"], correctIndex:1 });
  q.push({ type:"choice", difficulty:2, question:"1 milijun = ?", answers:["100 000","1 000 000","10 000 000","100"], correctIndex:1 });
  // Uspoređivanje
  for (let i = 0; i < 20; i++) {
    const a = Math.floor(Math.random()*900000)+10000, b = Math.floor(Math.random()*900000)+10000;
    if (a===b) continue;
    q.push({ type:"choice", difficulty:2, question:`${a.toLocaleString('hr')} ${CIRCLE} ${b.toLocaleString('hr')}`, answers:["<",">","="], correctIndex:a<b?0:1 });
  }
  // Zaokruživanje
  for (let n = 1234; n <= 9999; n += 1111) {
    q.push({ type:"input", difficulty:3, question:`Zaokruži ${n} na stotice:`, correctAnswer:String(Math.round(n/100)*100) });
    q.push({ type:"input", difficulty:3, question:`Zaokruži ${n} na tisućice:`, correctAnswer:String(Math.round(n/1000)*1000) });
  }
  return fix(q).slice(0, 210);
}

function genPisanoZbrOduz() {
  const q = [];
  // Zbrajanje velikih brojeva
  for (let i = 0; i < 30; i++) {
    const a = Math.floor(Math.random()*90000)+10000, b = Math.floor(Math.random()*90000)+10000;
    if (a+b > 999999) continue;
    q.push({ type:"input", difficulty:2, question:`${a.toLocaleString('hr')} + ${b.toLocaleString('hr')} = ?`, correctAnswer:String(a+b) });
  }
  // Oduzimanje
  for (let i = 0; i < 30; i++) {
    const a = Math.floor(Math.random()*80000)+20000, b = Math.floor(Math.random()*15000)+1000;
    q.push({ type:"input", difficulty:2, question:`${a.toLocaleString('hr')} - ${b.toLocaleString('hr')} = ?`, correctAnswer:String(a-b) });
  }
  // Tekstualni
  for (let i = 0; i < 10; i++) {
    const a = (i+1)*5000+12345, b = (i+1)*1000+2345;
    q.push({ type:"input", difficulty:3, question:`Grad ima ${a.toLocaleString('hr')} stanovnika. Doseli se još ${b.toLocaleString('hr')}. Koliko ih sada ima?`, correctAnswer:String(a+b) });
  }
  return fix(q).slice(0, 210);
}

function genPisanoMnozDijel() {
  const q = [];
  // Množenje višeznamenkastog jednoznamenkastim
  for (let a = 12; a <= 999; a += 37) for (let b = 2; b <= 9; b++) {
    if (a*b > 999999) continue;
    q.push({ type:"input", difficulty:2, question:`${a} × ${b} = ?`, correctAnswer:String(a*b) });
  }
  // Množenje dvoznamenkastim
  for (let i = 0; i < 20; i++) {
    const a = Math.floor(Math.random()*90)+10, b = Math.floor(Math.random()*90)+10;
    q.push({ type:"input", difficulty:3, question:`${a} × ${b} = ?`, correctAnswer:String(a*b) });
  }
  // Dijeljenje jednoznamenkastim
  for (let b = 2; b <= 9; b++) for (let res = 10; res <= 100; res += 13) {
    q.push({ type:"input", difficulty:2, question:`${res*b} ÷ ${b} = ?`, correctAnswer:String(res) });
  }
  // Dijeljenje dvoznamenkastim
  for (let i = 0; i < 15; i++) {
    const b = Math.floor(Math.random()*40)+11, res = Math.floor(Math.random()*50)+5;
    q.push({ type:"input", difficulty:3, question:`${b*res} ÷ ${b} = ?`, correctAnswer:String(res) });
  }
  return fix(q).slice(0, 210);
}

function genGeometrijaKutovi() {
  const q = [];
  q.push({ type:"choice", difficulty:2, question:"Pravi kut ima:", answers:["45°","90°","180°","360°"], correctIndex:1 });
  q.push({ type:"choice", difficulty:2, question:"Ravni kut ima:", answers:["45°","90°","180°","360°"], correctIndex:2 });
  q.push({ type:"choice", difficulty:2, question:"Puni kut ima:", answers:["90°","180°","270°","360°"], correctIndex:3 });
  // Vrste trokuta po stranicama
  q.push({ type:"choice", difficulty:3, question:"Trokut s 3 jednake stranice:", answers:["jednakostranični","jednakokračan","raznostranični","pravokutni"], correctIndex:0 });
  q.push({ type:"choice", difficulty:3, question:"Trokut s 2 jednake stranice:", answers:["jednakostranični","jednakokračan","raznostranični","pravokutni"], correctIndex:1 });
  q.push({ type:"choice", difficulty:3, question:"Trokut sa svim različitim stranicama:", answers:["jednakostranični","jednakokračan","raznostranični","pravokutni"], correctIndex:2 });
  q.push({ type:"choice", difficulty:3, question:"Trokut s jednim pravim kutom:", answers:["jednakostranični","jednakokračan","raznostranični","pravokutni"], correctIndex:3 });
  // Opseg trokuta
  for (let i = 0; i < 15; i++) {
    const a = (i%5)+3, b = (i%4)+4, c = (i%3)+5;
    q.push({ type:"input", difficulty:2, question:`Opseg trokuta sa stranicama ${a}, ${b}, ${c} cm:`, correctAnswer:String(a+b+c) });
  }
  return fix(q).slice(0, 210);
}

function genOpsegPovrsina() {
  const q = [];
  // Opseg pravokutnika i kvadrata
  for (let a = 2; a <= 12; a++) {
    q.push({ type:"input", difficulty:2, question:`Opseg kvadrata sa stranicom ${a} cm:`, correctAnswer:String(4*a) });
  }
  for (let a = 2; a <= 10; a++) for (let b = a+1; b <= 12; b++) {
    q.push({ type:"input", difficulty:2, question:`Opseg pravokutnika ${a}×${b} cm:`, correctAnswer:String(2*(a+b)) });
  }
  // Površina
  for (let a = 1; a <= 10; a++) {
    q.push({ type:"input", difficulty:2, question:`Površina kvadrata sa stranicom ${a} cm:`, correctAnswer:String(a*a) });
  }
  for (let a = 2; a <= 8; a++) for (let b = a; b <= 10; b++) {
    q.push({ type:"input", difficulty:2, question:`Površina pravokutnika ${a}×${b} cm:`, correctAnswer:String(a*b) });
  }
  // Mjerne jedinice površine
  q.push({ type:"choice", difficulty:3, question:"1 dm² = ? cm²", answers:["10","100","1000","10000"], correctIndex:1 });
  q.push({ type:"choice", difficulty:3, question:"1 m² = ? dm²", answers:["10","100","1000","10000"], correctIndex:1 });
  return fix(q).slice(0, 210);
}

function genKvaderKocka() {
  const q = [];
  q.push({ type:"choice", difficulty:2, question:"Koliko strana ima kocka?", answers:["4","6","8","12"], correctIndex:1 });
  q.push({ type:"choice", difficulty:2, question:"Koliko bridova ima kocka?", answers:["6","8","10","12"], correctIndex:3 });
  q.push({ type:"choice", difficulty:2, question:"Koliko vrhova ima kocka?", answers:["4","6","8","12"], correctIndex:2 });
  q.push({ type:"choice", difficulty:2, question:"Sve strane kocke su:", answers:["kvadrati","pravokutnici","trokuti","krugovi"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Strane kvadra su:", answers:["kvadrati","pravokutnici","trokuti","krugovi"], correctIndex:1 });
  // Obujam kocke
  for (let a = 1; a <= 10; a++) {
    q.push({ type:"input", difficulty:3, question:`Obujam kocke sa stranicom ${a} cm:`, correctAnswer:String(a*a*a) });
  }
  // Mreža kocke
  q.push({ type:"choice", difficulty:3, question:"Od koliko kvadrata se sastoji mreža kocke?", answers:["4","5","6","8"], correctIndex:2 });
  return fix(q).slice(0, 210);
}

// ═══════════════════════════════════════════════════════
// PRIRODA I DRUŠTVO — 4. RAZRED
// ═══════════════════════════════════════════════════════

function genUvjetiZivota() {
  const q = [];
  [["Sunce","izvor svjetlosti i topline"],["Voda","neophodna za sve žive organizme"],["Zrak","sadrži kisik za disanje"],["Tlo","podloga za rast biljaka"]].forEach(([u,opis]) => {
    const wr = sh(["Sunce","Voda","Zrak","Tlo"].filter(x=>x!==u)).slice(0,3);
    q.push({ type:"choice", difficulty:2, question:`"${opis}" — to je:`, answers:sh([u,...wr]), correctIndex:-1, _c:u });
  });
  q.push({ type:"choice", difficulty:2, question:"Što biljke proizvode za vrijeme fotosinteze?", answers:["kisik","ugljikov dioksid","dušik","vodik"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Za fotosintezu biljke trebaju:", answers:["sunčevu svjetlost i CO₂","samo vodu","samo tlo","samo zrak"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Kruženje vode u prirodi započinje:", answers:["isparavanjem","padavinama","zamrzavanjem","filtriranjem"], correctIndex:0 });
  return fix(q).slice(0, 210);
}

function genKrajeviHR() {
  const q = [];
  [["nizinski","ravnice, rijeke, poljoprivreda"],["brežuljkasti","blaga brda, vinogradi"],["gorski","visoke planine, šume"],["primorski","more, otoci, turizam"]].forEach(([kraj,opis]) => {
    const wr = sh(["nizinski","brežuljkasti","gorski","primorski"].filter(x=>x!==kraj)).slice(0,3);
    q.push({ type:"choice", difficulty:2, question:`"${opis}" — to je koji kraj?`, answers:sh([kraj,...wr]), correctIndex:-1, _c:kraj });
  });
  // Gradovi i krajevi
  [["Osijek","nizinski"],["Zagreb","brežuljkasti"],["Rijeka","primorski"],["Split","primorski"],["Gospić","gorski"],["Varaždin","brežuljkasti"]].forEach(([grad,kraj]) => {
    q.push({ type:"choice", difficulty:3, question:`${grad} se nalazi u kojem kraju?`, answers:["nizinskom","brežuljkastom","gorskom","primorskom"], correctIndex:["nizinski","brežuljkasti","gorski","primorski"].indexOf(kraj) });
  });
  // Rijeke
  [["Sava","nizinski"],["Drava","nizinski"],["Dunav","nizinski"],["Kupa","gorski"],["Neretva","primorski"]].forEach(([r,kr]) => {
    q.push({ type:"choice", difficulty:2, question:`Rijeka ${r} teče kroz koji kraj?`, answers:["nizinski","brežuljkasti","gorski","primorski"], correctIndex:["nizinski","brežuljkasti","gorski","primorski"].indexOf(kr) });
  });
  return fix(q).slice(0, 210);
}

function genLjudskoTijelo() {
  const q = [];
  // Organski sustavi
  [["srce","krvožilni"],["pluća","dišni"],["želudac","probavni"],["mozak","živčani"],["kost","koštano-mišićni"]].forEach(([organ,sustav]) => {
    const wr = sh(["krvožilni","dišni","probavni","živčani","koštano-mišićni"].filter(x=>x!==sustav)).slice(0,3);
    q.push({ type:"choice", difficulty:2, question:`"${organ}" pripada kojem sustavu?`, answers:sh([sustav,...wr]), correctIndex:-1, _c:sustav });
  });
  // Osjetila
  [["vid","oči"],["sluh","uši"],["njuh","nos"],["okus","jezik"],["opip","koža"]].forEach(([osj,organ]) => {
    const wr = sh(["oči","uši","nos","jezik","koža"].filter(x=>x!==organ)).slice(0,3);
    q.push({ type:"choice", difficulty:1, question:`Organ za "${osj}":`, answers:sh([organ,...wr]), correctIndex:-1, _c:organ });
  });
  // Zdravlje
  q.push({ type:"choice", difficulty:2, question:"Koliko obroka dnevno je preporučljivo?", answers:["1-2","3-5","7-8","samo 1"], correctIndex:1 });
  q.push({ type:"choice", difficulty:2, question:"Za zdrave kosti trebamo:","answers":["kalcij (mlijeko, sir)","samo slatkiše","gazirana pića","čips"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Tjelovježba je važna jer:", answers:["jača tijelo i poboljšava zdravlje","troši vrijeme","samo za sportaše","nije važna"], correctIndex:0 });
  return fix(q).slice(0, 210);
}

function genHrvatskaDomovina() {
  const q = [];
  q.push({ type:"choice", difficulty:1, question:"Glavni grad Hrvatske:", answers:["Split","Rijeka","Zagreb","Osijek"], correctIndex:2 });
  q.push({ type:"choice", difficulty:2, question:"Himna RH:", answers:["Lijepa naša domovino","Ode Radosti","Bože, čuvaj Hrvatsku","Marš na Drinu"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Zastava RH ima boje:", answers:["crvena, bijela, plava","zelena, bijela, crvena","plava, žuta, crvena","bijela, plava, bijela"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Grb RH:", answers:["šahovnica","orao","lav","zvijezda"], correctIndex:0 });
  // Susjedne zemlje
  [["Slovenija","zapad"],["Mađarska","sjever"],["Srbija","istok"],["BiH","jugoistok"],["Crna Gora","jug"]].forEach(([z,_]) => {
    q.push({ type:"choice", difficulty:2, question:`Je li ${z} susjedna zemlja Hrvatske?`, answers:["Da","Ne"], correctIndex:0 });
  });
  q.push({ type:"choice", difficulty:2, question:"Je li Austrija susjedna zemlja Hrvatske?", answers:["Da","Ne"], correctIndex:1 });
  // Hrvatska u Europi
  q.push({ type:"choice", difficulty:2, question:"Hrvatska je članica:", answers:["Europske unije","NATO-a samo","Nijedne organizacije","Afričke unije"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Na kojem je kontinentu Hrvatska?", answers:["Europa","Azija","Afrika","Amerika"], correctIndex:0 });
  return fix(q).slice(0, 210);
}

function genBiljkeZivotinje4() {
  const q = [];
  // Životinjske skupine
  [["sisavci","rađaju žive mlade, doje ih"],["ptice","imaju perje, nesu jaja"],["ribe","žive u vodi, imaju ljuske i škrge"],["gmazovi","imaju ljuske, hladnokrvni"],["vodozemci","žive u vodi i na kopnu"]].forEach(([sk,opis]) => {
    const wr = sh(["sisavci","ptice","ribe","gmazovi","vodozemci"].filter(x=>x!==sk)).slice(0,3);
    q.push({ type:"choice", difficulty:2, question:`"${opis}" — to su:`, answers:sh([sk,...wr]), correctIndex:-1, _c:sk });
  });
  // Svrstaj životinju
  [["mačka","sisavac"],["orao","ptica"],["šaran","riba"],["gušter","gmaz"],["žaba","vodozemac"],["medvjed","sisavac"],["lastavica","ptica"],["zmija","gmaz"]].forEach(([z,sk]) => {
    q.push({ type:"choice", difficulty:2, question:`"${z}" je:`, answers:["sisavac","ptica","riba","gmaz","vodozemac"], correctIndex:["sisavac","ptica","riba","gmaz","vodozemac"].indexOf(sk) });
  });
  // Ekosustavi
  [["šuma","stabla, gljive, životinje šume"],["livada","trave, cvjetovi, kukci"],["more","ribe, alge, morske životinje"],["travnjak","niska vegetacija, sitne životinje"]].forEach(([eko,opis]) => {
    const wr = sh(["šuma","livada","more","travnjak","jezero"].filter(x=>x!==eko)).slice(0,3);
    q.push({ type:"choice", difficulty:2, question:`"${opis}" — koji je to ekosustav?`, answers:sh([eko,...wr]), correctIndex:-1, _c:eko });
  });
  return fix(q).slice(0, 210);
}

// ═══════════════════════════════════════════════════════
const GEN_MAP = {
  hrvatski: [genVrsteRijeci4, genPravopis4, genKnjizevnost4, genMedijskaKultura],
  matematika: [genBrojeviMilijun, genPisanoZbrOduz, genPisanoMnozDijel, genGeometrijaKutovi, genOpsegPovrsina, genKvaderKocka],
  priroda: [genUvjetiZivota, genKrajeviHR, genLjudskoTijelo, genHrvatskaDomovina, genBiljkeZivotinje4]
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
    let totalQ = 0;
    for (const subject of subjects) {
      const sRes = await db.collection("subjects").insertOne({ ...subject, grade: GRADE, isActive: true, createdAt: new Date() });
      const sId = sRes.insertedId;
      console.log(`📘 ${subject.icon} ${subject.name}`);
      const gens = GEN_MAP[subject.slug]; const tops = topicsDef[subject.slug];
      for (let i = 0; i < tops.length; i++) {
        const rawQ = gens[i]();
        const tRes = await db.collection("topics").insertOne({ ...tops[i], grade: GRADE, subject_id: sId, isActive: true, createdAt: new Date() });
        const tId = tRes.insertedId;
        const docs = rawQ.map(q => ({ type:q.type, difficulty:q.difficulty||1, question:q.question, visual:q.visual||"", hint:q.hint||"", answers:q.answers||[], correctIndex:typeof q.correctIndex==="number"?q.correctIndex:undefined, correctAnswer:q.correctAnswer||undefined, placeholder:q.placeholder||undefined, grade:GRADE, subject_id:sId, topic_id:tId, isActive:true, createdAt:new Date() }));
        if (docs.length > 0) await db.collection("questions").insertMany(docs);
        totalQ += docs.length;
        console.log(`   ${tops[i].icon} ${tops[i].name}: ${docs.length} pitanja`);
      }
    }
    console.log(`\n✅ Ukupno: ${totalQ} pitanja za ${GRADE}. razred`);
  } catch (err) { console.error("❌ Greška:", err); }
  finally { await client.close(); process.exit(0); }
}
if (require.main === module) {
  seed();
}

module.exports = { genVrsteRijeci4, genPravopis4, genKnjizevnost4, genMedijskaKultura, genBrojeviMilijun, genPisanoZbrOduz, genPisanoMnozDijel, genGeometrijaKutovi, genOpsegPovrsina, genKvaderKocka, genUvjetiZivota, genKrajeviHR, genLjudskoTijelo, genHrvatskaDomovina, genBiljkeZivotinje4 };
