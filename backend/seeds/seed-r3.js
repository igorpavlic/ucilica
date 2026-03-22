/**
 * seed-r3.js — Učilica generatori za 3. razred
 * Prema GIK Razredna nastava 3. razred OS
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const { MongoClient } = require("mongodb");
const { N, IF, IM, sh, cfc, rep, fix, EL, CIRCLE } = require("./gen-hrvatski");

const GRADE = 3;

const subjects = [
  { name: "Hrvatski jezik", slug: "hrvatski", icon: "📖", color: "#FF6B6B", description: "Vrste riječi, gramatika, književnost", order: 1 },
  { name: "Matematika", slug: "matematika", icon: "🔢", color: "#60A5FA", description: "Brojevi do 1000, množenje, dijeljenje, geometrija", order: 2 },
  { name: "Priroda i društvo", slug: "priroda", icon: "🌿", color: "#34D399", description: "Zavičaj, karta, biljke, životinje, tlo, voda", order: 3 }
];

const topicsDef = {
  hrvatski: [
    { name: "Vrste riječi", slug: "vrste-rijeci", icon: "📝", order: 1 },
    { name: "Gramatika i pravopis", slug: "gramatika-pravopis", icon: "✏️", order: 2 },
    { name: "Književni tekstovi", slug: "knjizevni-tekst", icon: "📚", order: 3 },
    { name: "Jezično izražavanje", slug: "jezicno-izrazavanje", icon: "💬", order: 4 },
  ],
  matematika: [
    { name: "Brojevi do 1000", slug: "brojevi-1000", icon: "🔢", order: 1 },
    { name: "Zbrajanje i oduzimanje do 1000", slug: "zbr-oduz-1000", icon: "➕", order: 2 },
    { name: "Množenje i dijeljenje", slug: "mnoz-dijel-3", icon: "✖️", order: 3 },
    { name: "Geometrija i mjerenje", slug: "geometrija-mjerenje-3", icon: "📐", order: 4 },
  ],
  priroda: [
    { name: "Zavičaj i karta", slug: "zavicaj-karta", icon: "🗺️", order: 1 },
    { name: "Tlo, voda, zrak", slug: "tlo-voda-zrak", icon: "🌍", order: 2 },
    { name: "Biljke i životinje zavičaja", slug: "biljke-zivotinje-3", icon: "🌳", order: 3 },
    { name: "Gospodarske djelatnosti", slug: "gospodarske-djelatnosti", icon: "🏭", order: 4 },
    { name: "Kulturna baština", slug: "kulturna-bastina", icon: "🏛️", order: 5 },
  ]
};

// ═══════════════════════════════════════════════════════
// HRVATSKI JEZIK — 3. RAZRED
// ═══════════════════════════════════════════════════════

function genVrsteRijeci() {
  const q = [];
  // Imenice, glagoli, pridjevi
  const imenice = ["škola","prijatelj","sunce","sreća","radost","zemlja","ljubav","sloboda","knjiga","učenik"];
  const glagoli = ["trčati","pisati","čitati","učiti","plivati","sanjati","misliti","raditi","putovati","graditi"];
  const pridjevi = ["velik","lijep","brz","pametan","sretan","tužan","crven","hladan","topao","star"];
  
  imenice.forEach(w => { const wr = sh([...glagoli,...pridjevi]).slice(0,3); q.push({ type:"choice", difficulty:1, question:`"${w}" je...?`, answers:sh(["imenica",...["glagol","pridjev","prilog"]]), correctIndex:-1, _c:"imenica" }); });
  glagoli.forEach(w => { q.push({ type:"choice", difficulty:1, question:`"${w}" je...?`, answers:sh(["glagol","imenica","pridjev","prilog"]), correctIndex:-1, _c:"glagol" }); });
  pridjevi.forEach(w => { q.push({ type:"choice", difficulty:1, question:`"${w}" je...?`, answers:sh(["pridjev","imenica","glagol","prilog"]), correctIndex:-1, _c:"pridjev" }); });

  // Pridjevi — stupnjevanje
  [["lijep","ljepši","najljepši"],["velik","veći","najveći"],["brz","brži","najbrži"],["dobar","bolji","najbolji"],["loš","lošiji","najlošiji"]].forEach(([pos,komp,sup]) => {
    q.push({ type:"input", difficulty:3, question:`Komparativ od "${pos}":`, correctAnswer:komp });
    q.push({ type:"input", difficulty:3, question:`Superlativ od "${pos}":`, correctAnswer:sup });
  });

  // Broj imenica — jednina/množina
  [["stolovi","množina"],["knjiga","jednina"],["djeca","množina"],["pas","jednina"],["gradovi","množina"],["sunce","jednina"]].forEach(([w,br]) => {
    q.push({ type:"choice", difficulty:2, question:`"${w}" je u...?`, answers:["jednini","množini"], correctIndex:br==="jednina"?0:1 });
  });

  return fix(q).slice(0, 210);
}

function genGramatikaPravopis() {
  const q = [];
  // Veliko slovo
  [["hrvatska","Hrvatska"],["zagreb","Zagreb"],["marko","Marko"],["sava","Sava"],["jadransko more","Jadransko more"],["božić","Božić"],["uskrs","Uskrs"]].forEach(([wrong,correct]) => {
    q.push({ type:"choice", difficulty:2, question:`Ispravno napisano:`, answers:[wrong,correct], correctIndex:1 });
  });

  // č/ć
  [["čekati","č"],["ćup","ć"],["čitati","č"],["kuća","ć"],["čaj","č"],["noć","ć"],["ključ","č"],["mačka","č"],["srećo","ć"],["kolač","č"]].forEach(([w,gl]) => {
    q.push({ type:"choice", difficulty:3, question:`"${w}" sadrži glas:`, answers:["č","ć"], correctIndex:gl==="č"?0:1 });
  });

  // ije/je
  [["mlijeko","ije"],["mjesto","je"],["bijelo","ije"],["vjera","je"],["dijete","ije"],["pjesma","je"],["lijep","ije"],["vjeverica","je"]].forEach(([w,ref]) => {
    q.push({ type:"choice", difficulty:3, question:`"${w}" sadrži:`, answers:["ije","je"], correctIndex:ref==="ije"?0:1 });
  });

  // Rečenica — subjekt i predikat
  [["Pas laje.","Pas","laje"],["Mama kuha.","Mama","kuha"],["Djeca se igraju.","Djeca","igraju"],["Sunce sija.","Sunce","sija"]].forEach(([r,subj,pred]) => {
    q.push({ type:"choice", difficulty:3, question:`Tko je subjekt u: "${r}"?`, answers:sh([subj,"laje","kuha","sija","djeca"].filter((v,i,a)=>a.indexOf(v)===i)).slice(0,4), correctIndex:-1, _c:subj });
    q.push({ type:"choice", difficulty:3, question:`Koji je predikat u: "${r}"?`, answers:sh([pred,"Pas","Mama","Sunce","Djeca"].filter((v,i,a)=>a.indexOf(v)===i)).slice(0,4), correctIndex:-1, _c:pred });
  });

  return fix(q).slice(0, 210);
}

function genKnjizevniTekst() {
  const q = [];
  // Književne vrste
  [["bajka","priča s čarobnim elementima"],["basna","priča u kojoj životinje govore i donose pouku"],["pjesma","tekst pisan u stihovima"],["priča","kratki pripovjedni tekst"],["roman","dugi pripovjedni tekst"]].forEach(([vrsta,opis]) => {
    const wr = sh(["bajka","basna","pjesma","priča","roman"].filter(x=>x!==vrsta)).slice(0,3);
    q.push({ type:"choice", difficulty:2, question:`"${opis}" — koja je to književna vrsta?`, answers:sh([vrsta,...wr]), correctIndex:-1, _c:vrsta });
  });

  // Dijelovi priče
  q.push({ type:"choice", difficulty:2, question:"Koji su dijelovi priče?", answers:["uvod, zaplet, rasplet","početak, sredina","naslov, tekst","pitanje, odgovor"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Što je uvod u priči?", answers:["Početak koji upoznaje likove","Najuzbudljiviji dio","Kraj priče","Pouka"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Što je zaplet?", answers:["Početak","Najnapetiji dio","Kraj","Naslov"], correctIndex:1 });

  // Stilska sredstva
  q.push({ type:"choice", difficulty:3, question:"Što je personifikacija?", answers:["Kad predmetima dajemo ljudska svojstva","Kad uspoređujemo","Kad ponavljamo","Kad pitamo"], correctIndex:0 });
  q.push({ type:"choice", difficulty:3, question:"Što je usporedba?", answers:["Kad predmetima dajemo ljudska svojstva","Kad nešto uspoređujemo s nečim pomoću 'kao'","Kad ponavljamo","Kad pitamo"], correctIndex:1 });

  // Rima
  [["dom-grom","da"],["kuća-škola","ne"],["sat-brat","da"],["drvo-more","ne"],["cvijet-svijet","da"]].forEach(([par,rima]) => {
    q.push({ type:"choice", difficulty:2, question:`Rimuju li se: "${par}"?`, answers:["Da","Ne"], correctIndex:rima==="da"?0:1 });
  });

  return fix(q).slice(0, 210);
}

function genJezicnoIzrazavanje() {
  const q = [];
  // Pripovijedanje — redoslijed
  [["1. Ana se probudila. 2. Doručkovala je. 3. Otišla je u školu.","Da"],["1. Otišao je u školu. 2. Probudio se. 3. Obukao se.","Ne"]].forEach(([tekst,tocan]) => {
    q.push({ type:"choice", difficulty:2, question:`Je li redoslijed ispravan?\n${tekst}`, answers:["Da","Ne"], correctIndex:tocan==="Da"?0:1 });
  });

  // Opisivanje — koji pridjev
  [["Snijeg je...","bijel"],["Sunce je...","toplo"],["Limun je...","kiseo"],["Med je...","sladak"],["Noć je...","tamna"]].forEach(([pit,odg]) => {
    const wr = sh(["bijel","toplo","kiseo","sladak","tamna","hladno","gorko","tiho"].filter(x=>x!==odg)).slice(0,3);
    q.push({ type:"choice", difficulty:2, question:pit, answers:sh([odg,...wr]), correctIndex:-1, _c:odg });
  });

  // Sažimanje
  q.push({ type:"choice", difficulty:3, question:"Što je sažetak?", answers:["Kraći prikaz glavnih informacija","Duži tekst","Popis imena","Pjesma"], correctIndex:0 });

  // Pismo — dijelovi
  q.push({ type:"choice", difficulty:2, question:"Koji su dijelovi pisma?", answers:["Datum, pozdrav, tekst, potpis","Samo tekst","Naslov i kraj","Pitanje i odgovor"], correctIndex:0 });

  return fix(q).slice(0, 210);
}

// ═══════════════════════════════════════════════════════
// MATEMATIKA — 3. RAZRED
// ═══════════════════════════════════════════════════════

function genBrojevi1000() {
  const q = [];
  // Mjesna vrijednost
  for (let n = 100; n <= 999; n += 47) {
    const sto = Math.floor(n/100), des = Math.floor((n%100)/10), jed = n%10;
    q.push({ type:"input", difficulty:2, question:`Koliko STOTINA ima broj ${n}?`, correctAnswer:String(sto) });
    q.push({ type:"input", difficulty:2, question:`Koliko DESETICA ima broj ${n}?`, correctAnswer:String(des) });
    q.push({ type:"input", difficulty:2, question:`Koliko JEDINICA ima broj ${n}?`, correctAnswer:String(jed) });
  }
  // Usporedba
  for (let i = 0; i < 30; i++) {
    const a = Math.floor(Math.random()*900)+100, b = Math.floor(Math.random()*900)+100;
    if (a===b) continue;
    q.push({ type:"choice", difficulty:2, question:`${a} ${CIRCLE} ${b}`, answers:["<",">","="], correctIndex:a<b?0:1 });
  }
  // Zaokruživanje
  for (let n = 123; n <= 987; n += 73) {
    const z10 = Math.round(n/10)*10;
    q.push({ type:"input", difficulty:3, question:`Zaokruži ${n} na DESETICE:`, correctAnswer:String(z10) });
    const z100 = Math.round(n/100)*100;
    q.push({ type:"input", difficulty:3, question:`Zaokruži ${n} na STOTICE:`, correctAnswer:String(z100) });
  }
  // Nizovi
  for (let s = 100; s <= 800; s += 150) {
    q.push({ type:"input", difficulty:2, question:`Nastavi niz: ${s}, ${s+100}, ${s+200}, ?`, correctAnswer:String(s+300) });
  }
  return fix(q).slice(0, 210);
}

function genZbrOduz1000() {
  const q = [];
  // Zbrajanje stotina
  for (let a = 100; a <= 900; a += 100) for (let b = 100; b <= 1000-a; b += 100) {
    q.push({ type:"input", difficulty:1, question:`${a} + ${b} = ?`, correctAnswer:String(a+b) });
  }
  // Zbrajanje troznamenkastih
  for (let i = 0; i < 30; i++) {
    const a = Math.floor(Math.random()*400)+100, b = Math.floor(Math.random()*400)+50;
    if (a+b > 1000) continue;
    q.push({ type:"input", difficulty:2, question:`${a} + ${b} = ?`, correctAnswer:String(a+b) });
  }
  // Oduzimanje
  for (let i = 0; i < 30; i++) {
    const a = Math.floor(Math.random()*600)+300, b = Math.floor(Math.random()*250)+50;
    q.push({ type:"input", difficulty:2, question:`${a} - ${b} = ?`, correctAnswer:String(a-b) });
  }
  // Tekstualni
  for (let i = 0; i < 10; i++) {
    const a = (i%4)*100+250, b = (i%3)*50+75;
    q.push({ type:"input", difficulty:3, question:`U knjižnici je ${a} knjiga. Stiglo je još ${b}. Koliko ih sada ima?`, correctAnswer:String(a+b) });
    q.push({ type:"input", difficulty:3, question:`Škola ima ${a} učenika. ${b} ih je otišlo na izlet. Koliko ih je ostalo?`, correctAnswer:String(a-b) });
  }
  return fix(q).slice(0, 210);
}

function genMnozDijel3() {
  const q = [];
  // Tablica množenja do 10
  for (let a = 2; a <= 10; a++) for (let b = 1; b <= 10; b++) {
    q.push({ type:"input", difficulty:a<=5?1:2, question:`${a} × ${b} = ?`, correctAnswer:String(a*b) });
  }
  // Dijeljenje
  for (let a = 2; a <= 10; a++) for (let b = 1; b <= 10; b++) {
    q.push({ type:"input", difficulty:a<=5?2:3, question:`${a*b} ÷ ${a} = ?`, correctAnswer:String(b) });
  }
  // Tekstualni
  for (let i = 0; i < 10; i++) {
    const a = (i%5)+3, b = (i%7)+2;
    q.push({ type:"input", difficulty:3, question:`${N()} ima ${a} vrećice. U svakoj je ${b} ${IF()}. Koliko ukupno?`, correctAnswer:String(a*b) });
    q.push({ type:"input", difficulty:3, question:`${a*b} ${IF()} treba podijeliti na ${a} djece. Koliko svako dijete dobije?`, correctAnswer:String(b) });
  }
  return fix(q).slice(0, 210);
}

function genGeometrijaMjerenje3() {
  const q = [];
  // Opseg
  for (let a = 2; a <= 8; a++) for (let b = 2; b <= 8; b++) {
    if (a===b) {
      q.push({ type:"input", difficulty:2, question:`Opseg kvadrata sa stranicom ${a} cm:`, correctAnswer:String(4*a) });
    } else {
      q.push({ type:"input", difficulty:2, question:`Opseg pravokutnika ${a} cm × ${b} cm:`, correctAnswer:String(2*(a+b)) });
    }
  }
  // Pretvorbe
  [["1 m","100 cm"],["1 km","1000 m"],["1 kg","1000 g"],["1 L","1000 mL"],["1 h","60 min"],["1 min","60 s"]].forEach(([iz,u]) => {
    q.push({ type:"input", difficulty:2, question:`${iz} = ? ${u.split(" ")[1]}`, correctAnswer:u.split(" ")[0] });
  });
  // Kutovi
  q.push({ type:"choice", difficulty:2, question:"Pravi kut ima koliko stupnjeva?", answers:["45°","90°","180°","360°"], correctIndex:1 });
  q.push({ type:"choice", difficulty:2, question:"Šiljasti kut je...?", answers:["manji od 90°","jednak 90°","veći od 90°","jednak 180°"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Tupi kut je...?", answers:["manji od 90°","jednak 90°","veći od 90° a manji od 180°","jednak 180°"], correctIndex:2 });

  return fix(q).slice(0, 210);
}

// ═══════════════════════════════════════════════════════
// PRIRODA I DRUŠTVO — 3. RAZRED
// ═══════════════════════════════════════════════════════

function genZavicajKarta() {
  const q = [];
  q.push({ type:"choice", difficulty:2, question:"Što je zavičaj?", answers:["Kraj u kojem živimo","Strana država","Planet","Kontinent"], correctIndex:0 });
  // Strane svijeta
  q.push({ type:"choice", difficulty:1, question:"Koliko glavnih strana svijeta postoji?", answers:["2","4","6","8"], correctIndex:1 });
  q.push({ type:"choice", difficulty:2, question:"Koje su 4 glavne strane svijeta?", answers:["S, J, I, Z","gore, dolje, lijevo, desno","A, B, C, D","1, 2, 3, 4"], correctIndex:0 });
  // Karta
  q.push({ type:"choice", difficulty:2, question:"Što je mjerilo na karti?", answers:["Omjer udaljenosti na karti i stvarnosti","Boja karte","Naziv grada","Vrsta papira"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Smeđa boja na karti prikazuje...?", answers:["planine/brda","vodu","nizine","gradove"], correctIndex:0 });
  // Reljef
  q.push({ type:"choice", difficulty:2, question:"Što je reljef?", answers:["Oblik Zemljine površine","Vrsta biljke","Glazbeni instrument","Vrsta životinje"], correctIndex:0 });
  [["nizina","ravan teren blizu razine mora"],["brežuljak","blago uzdignut teren"],["planina","visoko uzdignut teren"],["dolina","udubljenje između brda"]].forEach(([r,opis]) => {
    const wr = sh(["nizina","brežuljak","planina","dolina"].filter(x=>x!==r)).slice(0,3);
    q.push({ type:"choice", difficulty:3, question:`"${opis}" — to je...?`, answers:sh([r,...wr]), correctIndex:-1, _c:r });
  });
  return fix(q).slice(0, 210);
}

function genTloVodaZrak() {
  const q = [];
  // Tlo
  q.push({ type:"choice", difficulty:2, question:"Od čega se sastoji tlo?", answers:["Minerali, voda, zrak, humus","Samo kamenje","Samo pijesak","Samo voda"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Što je humus?", answers:["Razgrađeni biljni i životinjski ostaci u tlu","Vrsta vode","Biljka","Kamen"], correctIndex:0 });
  // Voda
  q.push({ type:"choice", difficulty:2, question:"Koja su 3 agregatna stanja vode?", answers:["tekuće, kruto, plinovito","toplo, hladno, mlako","čisto, prljavo, mutno","slano, slatko, gorko"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Pri koliko °C voda se smrzava?", answers:["0°C","10°C","50°C","100°C"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Pri koliko °C voda ključa?", answers:["0°C","50°C","100°C","200°C"], correctIndex:2 });
  // Zrak
  q.push({ type:"choice", difficulty:2, question:"Koji plin u zraku je potreban za disanje?", answers:["kisik","dušik","ugljikov dioksid","vodik"], correctIndex:0 });
  q.push({ type:"choice", difficulty:3, question:"Koji je plin najzastupljeniji u zraku?", answers:["kisik","dušik","ugljikov dioksid","vodik"], correctIndex:1 });
  q.push({ type:"choice", difficulty:2, question:"Što onečišćuje zrak?", answers:["Ispušni plinovi, tvornice, požari","Biljke","Kiša","Oblaci"], correctIndex:0 });
  return fix(q).slice(0, 210);
}

function genBiljkeZivotinje3() {
  const q = [];
  // Šumske životinje
  [["jelen","biljožder"],["vuk","mesožder"],["medvjed","svežder"],["lisica","mesožder"],["zec","biljožder"],["vjeverica","biljožder"],["sova","mesožder"],["divlja svinja","svežder"]].forEach(([z,tip]) => {
    q.push({ type:"choice", difficulty:2, question:`"${z}" je:`, answers:["biljožder","mesožder","svežder"], correctIndex:tip==="biljožder"?0:tip==="mesožder"?1:2 });
  });
  // Biljke zavičaja
  [["hrast","stablo"],["bor","stablo"],["tratinčica","cvijet"],["maslačak","cvijet"],["kupina","grm"],["šipak","grm"]].forEach(([b,tip]) => {
    q.push({ type:"choice", difficulty:2, question:`"${b}" je:`, answers:["stablo","cvijet","grm","trava"], correctIndex:["stablo","cvijet","grm","trava"].indexOf(tip) });
  });
  // Životni uvjeti
  q.push({ type:"choice", difficulty:2, question:"Što biljke trebaju za rast?", answers:["Sunce, vodu, tlo, zrak","Samo vodu","Samo sunce","Samo tlo"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Što životinje trebaju za život?", answers:["Hranu, vodu, zrak, sklonište","Samo hranu","Samo vodu","Samo sklonište"], correctIndex:0 });
  // Hranidbeni lanac
  q.push({ type:"choice", difficulty:3, question:"Ispravan hranidbeni lanac:", answers:["trava → zec → lisica","lisica → zec → trava","zec → trava → lisica","trava → lisica → zec"], correctIndex:0 });
  return fix(q).slice(0, 210);
}

function genGospodarskeDjelatnosti() {
  const q = [];
  [["poljoprivreda","uzgoj biljaka i životinja"],["ribarstvo","lov i uzgoj ribe"],["šumarstvo","briga o šumama"],["turizam","putovanje i odmor"],["industrija","proizvodnja u tvornicama"],["trgovina","kupovina i prodaja"]].forEach(([d,opis]) => {
    const wr = sh(["poljoprivreda","ribarstvo","šumarstvo","turizam","industrija","trgovina"].filter(x=>x!==d)).slice(0,3);
    q.push({ type:"choice", difficulty:2, question:`"${opis}" — to je:`, answers:sh([d,...wr]), correctIndex:-1, _c:d });
  });
  q.push({ type:"choice", difficulty:2, question:"Koji proizvodi dolaze s farme?", answers:["mlijeko, jaja, meso","automobili","računala","odjeća"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Što je obrt?", answers:["Ručna izrada proizvoda","Tvornica","Škola","Bolnica"], correctIndex:0 });
  return fix(q).slice(0, 210);
}

function genKulturnaBastina() {
  const q = [];
  q.push({ type:"choice", difficulty:2, question:"Što je kulturna baština?", answers:["Vrijednosti naslijeđene od predaka","Vrsta hrane","Matematički pojam","Životinja"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Što je muzej?", answers:["Mjesto gdje se čuvaju i izlažu predmeti","Škola","Bolnica","Tvornica"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Što je običaj?", answers:["Način ponašanja koji se ponavlja kroz generacije","Vrsta biljke","Matematički zadatak","Glazbeni instrument"], correctIndex:0 });
  // Hrvatski običaji
  [["Božić","zima"],["Uskrs","proljeće"],["Svi sveti","jesen"],["Fašnik","zima/proljeće"]].forEach(([ob,doba]) => {
    q.push({ type:"choice", difficulty:2, question:`Blagdan "${ob}" obilježavamo u:`, answers:["proljeće","ljeto","jesen","zima/proljeće","zima"], correctIndex:["proljeće","ljeto","jesen","zima/proljeće","zima"].indexOf(doba) });
  });
  return fix(q).slice(0, 210);
}

// ═══════════════════════════════════════════════════════
const GEN_MAP = {
  hrvatski: [genVrsteRijeci, genGramatikaPravopis, genKnjizevniTekst, genJezicnoIzrazavanje],
  matematika: [genBrojevi1000, genZbrOduz1000, genMnozDijel3, genGeometrijaMjerenje3],
  priroda: [genZavicajKarta, genTloVodaZrak, genBiljkeZivotinje3, genGospodarskeDjelatnosti, genKulturnaBastina]
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

module.exports = { genVrsteRijeci, genGramatikaPravopis, genKnjizevniTekst, genJezicnoIzrazavanje, genBrojevi1000, genZbrOduz1000, genMnozDijel3, genGeometrijaMjerenje3, genZavicajKarta, genTloVodaZrak, genBiljkeZivotinje3, genGospodarskeDjelatnosti, genKulturnaBastina };
