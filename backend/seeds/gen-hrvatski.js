const {wrapGenerator}=require("../services/pedagogyReview");
// generators.js — Question generators for Učilica V4
// Each function returns 200+ questions for its topic

const { unos, oznake, FORMAT, dopuniFormat } = require("./jasnoca");
const { brojSlogova, rastavi } = require("./slogovi");
const { IMENICE } = require("./hr-imenice");

// Riječi za zadatke o slogovima: jezgra + sve imenice iz rječnika koje
// dijete 1. razreda može pročitati. Rječnik raste → raste i ovaj popis.
const RIJECI_SLOGOVI = [...new Set([
  'ja', 'da', 'ne', 'mama', 'tata', 'riba', 'škola', 'ljeto', 'jabuka',
  'loptica', 'auto', 'ulica', 'olovka', 'planina', 'televizor', 'automobil',
  'računalo', 'čokolada', 'stolica', 'cvjetić',
  ...Object.values(IMENICE).map((im) => im.o[0]).filter((w) => w.length <= 9),
])];

const CIRCLE = "○";

function sh(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function cfc(correct, min, max) { min = min ?? 0; max = max ?? 20; const w = new Set(); let o = 1; while (w.size < 3) { [correct + o, correct - o, correct + o + 1, correct - o - 1].forEach(c => { if (c !== correct && c >= min && c <= max) w.add(c); }); o++; } const all = sh([correct, ...[...w].slice(0, 3)]); return { answers: all.map(String), correctIndex: all.indexOf(correct) }; }
const rep = (e, n) => e.repeat(n);
const EM = { A: "🍎", G: "🍏", S: "⭐", F: "🐟", W: "🌼", B: "⚽", H: "❤️", K: "🧱", C: "🐥", T: "🌳" };
const EL = Object.values(EM);

const NAMES = ["Ana","Luka","Iva","Marko","Petra","Ivan","Ema","Sara","Nina","Leo","Mia","David","Klara","Noa","Tea","Filip","Lana","Fran","Tara","Mateo","Jana","Roko","Ela","Karlo","Maja","Dino","Hana","Tin","Lucija","Bruno"];
const ITEMS_F = ["jabuke","olovke","kocke","loptice","knjige","čokolade","bomboni","bilježnice","bojice","igračke","naranče","kruške","pernice","gumice","zvjezdice"];
const ITEMS_M = ["baloni","papirići","markeri","magneti","naljepnice","kolači","keksići","sokovi","medvjedići","autići","dinosauri","listovi","crteži","kameni","satovi"];
let _ni = 0, _fi = 0, _mi = 0;
const N = () => NAMES[_ni++ % NAMES.length];
const IF = () => ITEMS_F[_fi++ % ITEMS_F.length];
const IM = () => ITEMS_M[_mi++ % ITEMS_M.length];

// Resolve _c field to correctIndex for choice questions
/**
 * fix() — završna obrada svakog generiranog pitanja:
 *   1. razriješi _c → correctIndex
 *   2. ukloni duplicirane ponuđene odgovore (dijete je vidjelo isto slovo dvaput)
 *   3. nasumično promiješa sve ponuđene odgovore i ponovno izračuna correctIndex
 *   4. odbaci pitanja koja nakon čišćenja nemaju barem 2 izbora
 */
/** 4 različita slova: točno + 3 distraktora iz abecede */
function distraktoriSlova(abc, tocanIdx) {
  const tocan = abc[tocanIdx];
  const kandidati = abc.filter((x) => x !== tocan);
  const bliski = kandidati.filter((x) => Math.abs(abc.indexOf(x) - tocanIdx) <= 4);
  const izvor = bliski.length >= 3 ? bliski : kandidati;
  return [tocan, ...sh(izvor).slice(0, 3)];
}

function fix(arr) {
  const out = [];
  for (const q of arr) {
    if (q.type === 'choice' && Array.isArray(q.answers)) {
      // točan odgovor prije deduplikacije
      let tocan = q._c !== undefined
        ? q._c
        : (typeof q.correctIndex === 'number' && q.correctIndex >= 0 ? q.answers[q.correctIndex] : undefined);

      const vidjeno = new Set();
      const jedinstveni = [];
      for (const a of q.answers) {
        const k = String(a);
        if (vidjeno.has(k)) continue;
        vidjeno.add(k);
        jedinstveni.push(a);
      }

      if (jedinstveni.length < 2) continue; // neupotrebljivo pitanje

      q.answers = sh(jedinstveni);
      q.correctIndex = q.answers.findIndex(a => String(a) === String(tocan));
      if (q.correctIndex === -1) continue; // točan odgovor ispao — odbaci
      delete q._c;
    } else if (q._c !== undefined) {
      delete q._c;
    }
    // Svaki zadatak s upisom mora reći u kojem se obliku odgovara — inače
    // dijete pogađa oblik umjesto da pokaže znanje.
    out.push(dopuniFormat(q));
  }
  return out;
}

// ═══════════════ HRVATSKI JEZIK ═══════════════

function genSlova() {
  const q = [];
  const abc = "A B C Č Ć D Đ E F G H I J K L M N O P R S Š T U V Z Ž".split(" ");
  const dig = [["DŽ","Dž","dž"],["LJ","Lj","lj"],["NJ","Nj","nj"]];

  abc.forEach(L => { const s = L.toLowerCase();
    q.push({ type:"choice", difficulty:1, question:`Koje je malo slovo od "${L}"?`, answers:sh([s,"m","k","t"]).filter((v,i,a)=>a.indexOf(v)===i).slice(0,4), correctIndex:-1, _c:s });
    q.push(unos({ pitanje:`Koje je malo slovo od "${L}"?`, odgovor:s, format:"slovo", difficulty:1 }));
    q.push(unos({ pitanje:`Koje je veliko slovo od "${s}"?`, odgovor:L, format:"slovo", difficulty:2 }));
  });
  // Dvoslov: ponuda je nekad imala DŽ, Dž, dž i D — tri inačice istoga i jedno
  // slovo. Dijete nije biralo znanje nego je tražilo razliku u veličini slova.
  // Sada su ponuđena tri jasno različita zapisa.
  dig.forEach(([u,t,l]) => {
    q.push({ type:"choice", difficulty:2, question:`Kako se dvoslov "${l}" piše velikim početnim slovom?`, answers:sh([t,u]), correctIndex:-1, _c:t, hint:"Kod dvoslova veliko je samo prvo slovo." });
    q.push({ ...unos({ pitanje:`Kako se dvoslov "${l}" piše velikim početnim slovom?`, odgovor:t, format:"slova", difficulty:3 }), konstrukt:"velikoSlovo" }); // veličina slova je predmet zadatka
  });
  for (let i = 0; i < abc.length - 1; i++)
    q.push({ type:"choice", difficulty:2, question:`Koje slovo u abecedi dolazi nakon slova "${abc[i]}"?`, answers:sh(distraktoriSlova(abc, i+1)), correctIndex:-1, _c:abc[i+1] });
  for (let i = 1; i < abc.length; i++)
    q.push({ type:"choice", difficulty:2, question:`Koje slovo u abecedi dolazi prije slova "${abc[i]}"?`, answers:sh(distraktoriSlova(abc, i-1)), correctIndex:-1, _c:abc[i-1] });

  [["🍎","jabuka","j"],["🐶","pas","p"],["🐱","mačka","m"],["🚗","auto","a"],["🌞","sunce","s"],["🐟","riba","r"],["🌳","drvo","d"],["🏠","kuća","k"],["🐝","pčela","p"],["📖","knjiga","k"],["✏️","olovka","o"],["🎵","nota","n"],["🦋","leptir","l"],["🐦","ptica","p"],["🐸","žaba","ž"],["🌹","ruža","r"],["⚽","lopta","l"],["🧸","medvjedić","m"],["🐻","medvjed","m"],["🎒","torba","t"]].forEach(([e,w,l]) => q.push(unos({ pitanje:`Kojim slovom počinje riječ "${w}"?`, odgovor:l, format:"slovo", difficulty:2, visual:e })));
  [["mama","a"],["tata","a"],["pas","s"],["rak","k"],["nos","s"],["put","t"],["dom","m"],["sat","t"],["dan","n"],["led","d"],["med","d"],["sok","k"],["list","t"],["grad","d"],["brod","d"]].forEach(([w,l]) => q.push(unos({ pitanje:`Koje je zadnje slovo u riječi "${w}"?`, odgovor:l, format:"slovo", difficulty:3 })));
  ["Q","W","X","Y"].forEach(f => { const o = sh(abc).slice(0,3); q.push({ type:"choice", difficulty:2, question:"Koje slovo NIJE u hrvatskoj abecedi?", answers:sh([f,...o]), correctIndex:-1, _c:f }); });
  q.push({ type:"choice", difficulty:2, question:"Koliko slova ima hrvatska abeceda?", answers:["26","30","27","32"], correctIndex:1 });
  // Slovo koje nedostaje: prije je stajalo samo "_uka" → očekivalo se "r".
  // Ali "muka", "luka" i "buka" jednako su dobre riječi — dijete koje ih upiše
  // nije pogriješilo. Sada slika kaže koja je riječ, a ostavljene su samo one
  // kojima jedno slovo daje jedno rješenje.
  [["🏠","_uća","k"],["🌞","_unce","s"],["🏫","_kola","š"],["⚽","_opta","l"],["🌳","_rvo","d"],["🚆","_lak","v"],["🏙️","_rad","g"],["🐝","_čela","p"],["🦋","_eptir","l"],["📖","_njiga","k"],["🍐","_ruška","k"],["🌧️","_iša","k"],["🧀","_ir","s"],["🪟","_rozor","p"],["🚪","_rata","v"]].forEach(([e,p,l]) => q.push(unos({ pitanje:`Koje slovo nedostaje u riječi "${p}"?`, odgovor:l, format:"slovo", difficulty:3, visual:e })));
  return fix(q).slice(0, 210);
}

function genGlasovi() {
  const q = [];
  const vow = ["a","e","i","o","u"];
  const con = ["b","c","č","ć","d","đ","f","g","h","j","k","l","m","n","p","r","s","š","t","v","z","ž"];

  vow.forEach(v => q.push({ type:"choice", difficulty:1, question:`Je li glas "${v.toUpperCase()}" samoglasnik ili suglasnik?`, answers:["samoglasnik","suglasnik"], correctIndex:0 }));
  con.forEach(c => q.push({ type:"choice", difficulty:1, question:`Je li glas "${c.toUpperCase()}" samoglasnik ili suglasnik?`, answers:["samoglasnik","suglasnik"], correctIndex:1 }));
  for (let i = 0; i < 20; i++) { const v = vow[i%5]; const cs = sh(con).slice(0,3); const a = sh([v,...cs]).map(x=>x.toUpperCase()); q.push({ type:"choice", difficulty:1, question:"Koji glas je samoglasnik?", answers:a, correctIndex:-1, _c:v.toUpperCase() }); }
  for (let i = 0; i < 15; i++) { const c = con[i%con.length]; const vs = sh(vow).slice(0,3); const a = sh([c,...vs]).map(x=>x.toUpperCase()); q.push({ type:"choice", difficulty:1, question:"Koji glas je suglasnik?", answers:a, correctIndex:-1, _c:c.toUpperCase() }); }
  q.push(unos({ pitanje:"Koji su samoglasnici u hrvatskom jeziku? Napiši ih velikim slovima, redom a-e-i-o-u.", odgovor:"AEIOU", format:"slova", difficulty:2 }));
  q.push({ type:"choice", difficulty:2, question:"Koliko samoglasnika ima hrvatski jezik?", answers:["3","4","5","6"], correctIndex:2 });
  [["kuća",2],["pas",1],["riba",2],["auto",2],["mama",2],["tata",2],["škola",2],["sunce",2],["drvo",1],["oblak",2],["jabuka",3],["lopta",2],["olovo",3],["igla",2],["ulica",3],["olovka",3],["večera",3],["banana",3],["ananas",3],["more",2],["rijeka",3],["planina",3],["zemlja",2],["ptica",2],["leptir",2],["cvijet",2],["petica",3],["metar",2],["kamen",2],["prozor",2]].forEach(([w,c]) => { const r = cfc(c,0,5); q.push({ type:"choice", difficulty:2, question:`Koliko samoglasnika ima riječ "${w}"?`, answers:r.answers, correctIndex:r.correctIndex }); });
  [["kuća",2],["pas",2],["riba",2],["škola",3],["mama",2],["drvo",3],["oblak",3],["lopta",3],["sunce",3],["cvijet",4],["ptica",3],["knjiga",4],["stolica",4],["planina",3],["medvjed",5]].forEach(([w,c]) => { const r = cfc(c,0,7); q.push({ type:"choice", difficulty:3, question:`Koliko suglasnika ima riječ "${w}"?`, answers:r.answers, correctIndex:r.correctIndex }); });
  [["rak","a"],["led","e"],["list","i"],["dom","o"],["put","u"],["sat","a"],["med","e"],["dim","i"],["sok","o"],["luk","u"],["brat","a"],["ples","e"],["mir","i"],["nos","o"],["duh","u"]].forEach(([w,v]) => q.push({ type:"choice", difficulty:2, question:`Koji se samoglasnik nalazi u riječi "${w}"?`, answers:["a","e","i","o","u"], correctIndex:vow.indexOf(v) }));
  // Broj slogova se računa (seeds/slogovi.js), ne prepisuje iz tablice.
  // Dvije vrijednosti u staroj tablici bile su krive: "auto" je a-u-to (3),
  // "automobil" a-u-to-mo-bil (5) — hrvatski nema dvoglasa.
  RIJECI_SLOGOVI.forEach((w) => { const c = brojSlogova(w); const r = cfc(c,1,6); q.push({ type:"choice", difficulty:3, question:`Koliko slogova ima riječ "${w}"?`, answers:r.answers, correctIndex:r.correctIndex }); });
  // koji glas NE PRIPADA grupi (samoglasnik među suglasnicima) diff 2
  for (let i=0;i<15;i++) { const v=vow[(i*2)%5]; const cs=sh(con).slice(0,3); const all=sh([v,...cs]).map(x=>x.toUpperCase()); q.push({ type:"choice", difficulty:2, question:"Koji glas NE pripada ostalima?", answers:all, correctIndex:-1, _c:v.toUpperCase(), hint:"Jedan je samoglasnik, ostali suglasnici." }); }
  // suglasnik među samoglasnicima diff 2
  for (let i=0;i<10;i++) { const c=con[(i*3)%con.length]; const vs=sh(vow).slice(0,3); const all=sh([c,...vs]).map(x=>x.toUpperCase()); q.push({ type:"choice", difficulty:2, question:"Koji glas NE pripada ostalima?", answers:all, correctIndex:-1, _c:c.toUpperCase(), hint:"Jedan je suglasnik, ostali samoglasnici." }); }
  // input: napiši samoglasnike u riječi diff 3
  [["kuća","ua"],["mama","aa"],["riba","ia"],["škola","oa"],["sunce","ue"],["jabuka","aua"],["lopta","oa"],["olovka","ooa"]].forEach(([w,v]) => q.push(unos({ pitanje:`Koji se samoglasnici nalaze u riječi "${w}"? Napiši ih redom kako dolaze.`, odgovor:v, format:"slova", difficulty:3 })));
  // točno/netočno diff 2
  [["'A' je samoglasnik.",true],["'B' je samoglasnik.",false],["'E' je suglasnik.",false],["'K' je suglasnik.",true],["Samoglasnika ima 5.",true],["Samoglasnika ima 6.",false],["'U' je samoglasnik.",true],["'R' je samoglasnik.",false],["Svaka riječ ima barem jedan samoglasnik.",true],["'O' je suglasnik.",false]].forEach(([s,c]) => q.push({ type:"choice", difficulty:2, question:s, answers:["Točno","Netočno"], correctIndex:c?0:1 }));
  return fix(q).slice(0, 210);
}

function genRijeci() {
  const q = [];
  const ew = [["🐱","mačka"],["🐶","pas"],["🐟","riba"],["🍎","jabuka"],["🐰","zec"],["🐮","krava"],["🌞","sunce"],["🌙","mjesec"],["⭐","zvijezda"],["🌳","drvo"],["🌹","ruža"],["🦋","leptir"],["🐝","pčela"],["🐸","žaba"],["🐦","ptica"],["🐻","medvjed"],["🐴","konj"],["🐑","ovca"],["🐷","svinja"],["🐔","kokoš"],["🍌","banana"],["🍊","naranča"],["🍇","grožđe"],["🍓","jagoda"],["🍉","lubenica"],["⚽","lopta"],["📖","knjiga"],["✏️","olovka"],["🎒","torba"],["🏠","kuća"],["🚗","auto"],["🚌","autobus"],["🚲","bicikl"],["✈️","avion"],["🚢","brod"],["👁️","oko"],["👂","uho"],["👃","nos"],["🦷","zub"],["🧸","igračka"]];

  ew.forEach(([e,w]) => {
    q.push(unos({ pitanje:"Što je na slici?", odgovor:w, format:"rijec", difficulty:1, visual:e }));
    const wr = sh(ew.filter(([_,x])=>x!==w)).slice(0,3).map(([_,x])=>x);
    q.push({ type:"choice", difficulty:1, visual:e, question:"Što je na slici?", answers:sh([w,...wr]), correctIndex:-1, _c:w });
  });
  // Rime: izbačeni su "yoga" (y nije u hrvatskoj abecedi, a isti generator uči
  // dijete upravo to), "puća" (nije riječ) i "plata" (hrvatski je "plaća").
  [["sat","brat"],["grom","dom"],["dan","stan"],["vlak","mrak"],["dom","grom"],["led","med"],["sok","skok"],["rak","mak"],["put","krut"],["dim","tim"],["brod","plod"],["grad","rad"],["list","čist"],["nos","kos"],["more","gore"],["ruka","muka"],["noga","duga"],["kosa","rosa"],["zima","rima"],["škola","gola"],["ptica","ulica"],["mama","drama"],["tata","vrata"],["kuća","vruća"],["sat","mat"]].forEach(([w,r]) => { const wr = sh(["pero","auto","sunce","mačka","knjiga","stol","kuća","voda","drvo","lopta"]).filter(x=>x!==r).slice(0,3); q.push({ type:"choice", difficulty:2, question:`Koja se riječ rimuje s riječi "${w}"?`, answers:sh([r,...wr]), correctIndex:-1, _c:r }); });
  [[["ma","ma"],"mama"],[["ta","ta"],"tata"],[["ri","ba"],"riba"],[["ško","la"],"škola"],[["lje","to"],"ljeto"],[["zi","ma"],"zima"],[["ku","ća"],"kuća"],[["lo","pti","ca"],"loptica"],[["ja","bu","ka"],"jabuka"],[["knji","ga"],"knjiga"],[["olov","ka"],"olovka"],[["pti","ca"],"ptica"],[["sun","ce"],"sunce"],[["ob","lak"],"oblak"],[["cvi","jet"],"cvijet"],[["pro","lje","će"],"proljeće"],[["bo","ji","ca"],"bojica"],[["je","sen"],"jesen"],[["u","li","ca"],"ulica"],[["ba","na","na"],"banana"]].forEach(([p,f]) => { const wr = sh(ew.map(([_,w])=>w).filter(x=>x!==f)).slice(0,3); q.push({ type:"choice", difficulty:3, question:`Koja riječ nastaje od slogova "${p.join("-")}"?`, answers:sh([f,...wr]), correctIndex:-1, _c:f }); });
  [["pas",3],["dom",3],["mama",4],["riba",4],["škola",5],["sunce",5],["jabuka",6],["loptica",7],["kuća",4],["drvo",4],["auto",4],["more",4],["ptica",5],["oblak",5],["cvijet",6]].forEach(([w,c]) => { const r = cfc(c,2,9); q.push({ type:"choice", difficulty:3, question:`Koliko glasova ima riječ "${w}"?`, answers:r.answers, correctIndex:r.correctIndex }); });
  [["mama","mačka","kuća"],["tata","torba","riba"],["sunce","sat","drvo"],["pas","ptica","auto"],["lopta","leptir","škola"],["krava","knjiga","riba"],["ruka","ruža","jabuka"],["brod","banana","cvijet"],["dom","drvo","sat"],["voda","vlak","kuća"]].forEach(([w1,w2,wr]) => { const a = sh([w2,wr,sh(["čokolada","igla","šuma","zvijezda"])[0]]); q.push({ type:"choice", difficulty:2, question:`Koja riječ počinje istim slovom kao riječ "${w1}"?`, answers:a, correctIndex:-1, _c:w2 }); });
  // Dodatni različiti načini rada: ne samo ista uputa s drugom riječi.
  [["m_čka","a","mačka"],["p_s","a","pas"],["r_ba","i","riba"],["k_ća","u","kuća"]].forEach(([uzorak,slovo,rijec]) => q.push({type:"choice",difficulty:2,question:`Koje slovo nedostaje da nastane riječ "${rijec}"? ${uzorak}`,answers:sh([slovo,...sh(["a","e","i","o","u"].filter(x=>x!==slovo)).slice(0,3)]),correctIndex:-1,_c:slovo}));
  [["pas","životinja"],["olovka","predmet"],["jabuka","voće"],["kuća","mjesto za stanovanje"]].forEach(([w,o]) => q.push({type:"choice",difficulty:2,question:`Što najbolje opisuje riječ "${w}"?`,answers:sh([o,...sh(["životinja","predmet","voće","mjesto za stanovanje"].filter(x=>x!==o)).slice(0,3)]),correctIndex:-1,_c:o}));
  q.push({type:"choice",difficulty:2,question:"Koja riječ ima najviše slova?",answers:["pas","riba","olovka","dom"],correctIndex:2});
  return fix(q).slice(0, 210);
}

function genRecenice() {
  const q = [];

  // 1) Odaberi ispravnu rečenicu — RAZNOLIKE duljine i strukture diff 2
  const sentences = [
    "Pas trči po parku.","Mačka spava na kauču.","Mama kuha ručak u kuhinji.",
    "Tata čita novine.","Baka peče kolače za nas.","Djed šeće psa u parku.",
    "Ana i Luka idu u školu.","Ptice pjevaju na drvetu.","Sunce sija na nebu.",
    "Pada kiša i puše vjetar.","Djeca se igraju u dvorištu.","Učiteljica piše na ploči.",
    "Moj brat voli čokoladu.","Riba pliva u moru.","Leptir leti iznad cvijeta.",
    "Ema crta kuću u bilježnici.","Marko jede jabuku nakon škole.",
    "U proljeće cvjeta cvijeće.","Zimi pada bijeli snijeg.",
    "Mi volimo ići na izlete.","Danas je lijep i sunčan dan.",
    "Moja sestra ima pet godina.","Pas i mačka su prijatelji.",
    "Mama je kupila novu knjigu.","Idemo na more ovo ljeto.",
    "Baka nam priča priče prije spavanja.","Učenik piše zadaću svaki dan.",
    "Tata popravlja bicikl u garaži.","Na stolu stoji čaša vode.",
    "Djeca trče po livadi i smiju se.","Ujutro jedemo doručak.",
    "Navečer gledamo filmove.","Luka je naučio plivati.",
    "Škola počinje u rujnu.","Božić je u prosincu."
  ];
  // Prije su se nudile četiri gotovo iste rečenice — razlika je bila samo u
  // veličini prvoga slova i u točki na kraju. Dijete koje zna pravilo svejedno
  // je griješilo jer točku na gumbu nije vidjelo. Sada se provjerava jedno po
  // jedno pravilo, s tri ponude i uputom što treba pogledati.
  sentences.forEach((s, i) => {
    const malo = s[0].toLowerCase() + s.slice(1);
    const bezZnaka = s.slice(0, -1);
    if (i % 2 === 0) {
      q.push({ type:"choice", difficulty:2, question:"Koja rečenica počinje velikim slovom?", answers:sh([s, malo]), correctIndex:-1, _c:s, hint:"Svaka rečenica počinje velikim slovom." });
    } else {
      q.push({ type:"choice", difficulty:2, question:"Koja rečenica ima znak na kraju?", answers:sh([s, bezZnaka]), correctIndex:-1, _c:s, hint:"Izjavna rečenica završava točkom." });
    }
  });

  // 2) Popravi rečenicu — napiši ispravno diff 3
  //
  // OVDJE JE BILA GREŠKA NA KOJU SE KORISNIK ŽALIO.
  // Pitanje je glasilo: Popravi rečenicu: "pada kiša"
  // Očekivalo se "Pada kiša." — dijete koje upiše "Pada kiša" dobije netočno,
  // a nigdje nije pisalo da treba i točku. Sada pitanje kaže oba uvjeta, a
  // ocjenjivanje zna da su veliko slovo i točka dio zadatka (konstrukt
  // "recenica"), pa ih smije tražiti.
  [["pas trči.","Pas trči."],["mama kuha ručak.","Mama kuha ručak."],["pada kiša","Pada kiša."],["sunce sija","Sunce sija."],["ana ide u školu.","Ana ide u školu."],["djeca se igraju","Djeca se igraju."],["baka peče kolače","Baka peče kolače."],["luka čita knjige.","Luka čita knjige."]].forEach(([wrong,correct]) =>
    q.push(unos({ pitanje:`Napiši ovu rečenicu pravilno: "${wrong}"`, odgovor:correct, format:"recenica", difficulty:3, hint:"Pogledaj prvo slovo i kraj rečenice." })));

  // 3) Vrsta rečenice diff 1-2
  [["Pada kiša.","izjavna"],["Zoveš li se Ana?","upitna"],["Bravo!","usklična"],
   ["Sunce sija.","izjavna"],["Koliko imaš godina?","upitna"],["Super!","usklična"],
   ["Idem u školu.","izjavna"],["Voliš li čokoladu?","upitna"],["Hura!","usklična"],
   ["Mama kuha ručak.","izjavna"],["Gdje je pas?","upitna"],["Pobijedio sam!","usklična"],
   ["Pada snijeg.","izjavna"],["Kakvo je vrijeme?","upitna"],["Izvrsno!","usklična"],
   ["Mačka spava na kauču.","izjavna"],["Tko je to?","upitna"],["Pomozi!","usklična"],
   ["Ptica leti visoko.","izjavna"],["Koji je danas dan?","upitna"],["Čestitam!","usklična"],
   ["Djeca se igraju.","izjavna"],["Imaš li brata?","upitna"],["Pazi!","usklična"],
   ["Baka peče kolače.","izjavna"],["Što radiš?","upitna"],["Jupi!","usklična"],
   ["Tata čita novine.","izjavna"],["Gdje živiš?","upitna"],["Fantastično!","usklična"]
  ].forEach(([s,t]) => q.push({ type:"choice", difficulty:1, question:`Pročitaj rečenicu: "${s}" Kakva je to rečenica?`, answers:["izjavna rečenica","upitna rečenica","usklična rečenica"], correctIndex:t==="izjavna"?0:t==="upitna"?1:2 }));

  // 4) Čime završava diff 1
  // Gumb je prije bio gola točka — na zaslonu dvije točkice, a čitač zaslona
  // je uopće ne pročita. Sada svaki znak nosi i svoje ime.
  const ZNAKOVI4 = oznake([".", "?", "!", ","]);
  q.push({ type:"choice", difficulty:1, question:"Kojim znakom završava izjavna rečenica?", answers:ZNAKOVI4, correctIndex:0 });
  q.push({ type:"choice", difficulty:1, question:"Kojim znakom završava upitna rečenica?", answers:ZNAKOVI4, correctIndex:1 });
  q.push({ type:"choice", difficulty:1, question:"Kojim znakom završava usklična rečenica?", answers:ZNAKOVI4, correctIndex:2 });

  // 5) Veliko slovo za imena diff 2
  // "Kako se pravilno piše rijeka?" nije imalo jedno rješenje: "rijeka" je
  // voda, "Rijeka" je grad. Sada rečenica kaže o čemu je riječ.
  [["Zagreb","glavni grad Hrvatske"],["Hrvatska","naša domovina"],["Ana","djevojčica iz razreda"],["Dunav","najveća rijeka u Europi"],["Split","grad uz more"],["Osijek","grad na Dravi"],["Europa","naš kontinent"],["Marko","dječak iz razreda"],["Sava","rijeka koja teče kroz Zagreb"],["Drava","rijeka na sjeveru Hrvatske"],["Varaždin","grad barokne arhitekture"],["Dubrovnik","grad okružen zidinama"],["Zadar","grad s morskim orguljama"],["Rijeka","velika luka u Kvarneru"],["Karlovac","grad na četiri rijeke"]].forEach(([n,opis]) =>
    q.push({ type:"choice", difficulty:2, question:`Kako se pravilno piše ime koje označava ${opis}?`, answers:sh([n, n.toLowerCase()]), correctIndex:-1, _c:n, hint:"Imena gradova, rijeka i ljudi pišu se velikim početnim slovom." }));

  // 6) Stavi znak diff 3
  [["Idem kući","."],["Kako se zoveš","?"],["Super","!"],["Pada kiša","."],["Voliš li sladoled","?"],["Hura","!"],["Mama kuha ručak","."],["Gdje živiš","?"],["Bravo","!"],["Sunce sija","."],["Koliko imaš godina","?"],["Pobijedio sam","!"],["Djeca se igraju","."],["Što je ovo","?"],["Pazi","!"],["Tata vozi auto","."],["Ideš li na more","?"],["Jupi","!"]].forEach(([s,sign]) => q.push({ type:"choice", difficulty:3, question:`Koji rečenični znak dolazi na prazno mjesto? "${s} ___"`, answers:oznake([".","?","!"]), correctIndex:sign==="."?0:sign==="?"?1:2 }));

  // 7) Koliko riječi diff 3
  [["Pas trči.",2],["Mama kuha ručak.",3],["Ja volim čokoladu.",3],["Sunce sija.",2],["Luka čita knjige.",3],["Pada kiša.",2],["Ptica leti visoko.",3],["Baka peče kolače za nas.",5],["Ana i Luka idu u školu.",6],["Djeca se igraju u dvorištu.",5],["Pada kiša i puše vjetar.",5],["Moj brat voli čokoladu.",4]].forEach(([s,c]) => { const r = cfc(c,1,8); q.push({ type:"choice", difficulty:3, question:`Koliko riječi ima ova rečenica? "${s}"`, answers:r.answers, correctIndex:r.correctIndex }); });

  // 8) Posloži riječi u rečenicu diff 4
  // "Posloži" je uputa za tipkanje, a dijete je zapravo biralo ponuđeno.
  // Glagol sada odgovara radnji koju dijete izvodi.
  [["trči Pas parku. po","Pas trči po parku."],["kuha Mama ručak.","Mama kuha ručak."],["Pada snijeg. bijeli","Pada bijeli snijeg."],["idu školu. Djeca u","Djeca idu u školu."],["jabuku. Luka jede","Luka jede jabuku."],["sija Sunce nebu. na","Sunce sija na nebu."],["čita Baka knjigu.","Baka čita knjigu."],["spava Mačka kauču. na","Mačka spava na kauču."]].forEach(([jumbled,correct]) => { const wrongs = sh(sentences.filter(x=>x!==correct)).slice(0,3); q.push({ type:"choice", difficulty:4, question:`Koja je rečenica složena od ovih riječi? "${jumbled}"`, answers:sh([correct,...wrongs]), correctIndex:-1, _c:correct }); });

  // 9) Dopuni rečenicu diff 3
  [["Pas ___ po parku.","trči"],["Mama ___ ručak.","kuha"],["Ptica ___ na drvetu.","pjeva"],["Riba ___ u moru.","pliva"],["Sunce ___ na nebu.","sija"],["Djeca se ___ u dvorištu.","igraju"],["Pada bijeli ___.","snijeg"],["Mačka ___ na kauču.","spava"]].forEach(([s,w]) => { const wrongs = sh(["trči","kuha","pjeva","pliva","sija","igraju","snijeg","spava","jede","čita","leti","piše"]).filter(x=>x!==w).slice(0,3); q.push({ type:"choice", difficulty:3, question:`Koja riječ dolazi na prazno mjesto? "${s}"`, answers:sh([w,...wrongs]), correctIndex:-1, _c:w }); });

  // 10) Veliko slovo u rečenici diff 2
  // Prije je stem glasio samo "Koji je ispravan zapis?" — dijete nije moglo
  // znati o kojoj se riječi radi dok ne pogleda ponuđene odgovore.
  [["Hrvatska","___ je naša domovina."],["Marko","Moj prijatelj zove se ___."],["Zagreb","Vlakom putujemo u ___."],["Dunav","Rijeka ___ teče kroz Vukovar."],["Ana","U klupi sjedi ___."],["Europa","Hrvatska leži u ___."],["Split","Ljeto smo proveli u ___."],["Sava","Kroz Zagreb teče ___."]].forEach(([tocno,recenica]) =>
    q.push({ type:"choice", difficulty:2, question:`Koja riječ pravilno dopunjuje ovu rečenicu? "${recenica}"`, answers:sh([tocno,tocno.toLowerCase()]), correctIndex:-1, _c:tocno, hint:"Imena se pišu velikim početnim slovom." }));

  // 11) Jednina / množina diff 3
  [["pas","psi"],["mačka","mačke"],["knjiga","knjige"],["jabuka","jabuke"],["olovka","olovke"],["ptica","ptice"],["stol","stolovi"],["cvijet","cvjetovi"],["sat","satovi"],["brod","brodovi"]].forEach(([j,m]) => {
    q.push(unos({ pitanje:`Kako glasi množina riječi "${j}"?`, odgovor:m, format:"rijec", difficulty:3 }));
    q.push(unos({ pitanje:`Kako glasi jednina riječi "${m}"?`, odgovor:j, format:"rijec", difficulty:3 }));
  });

  // 12) Suprotno značenje (antonimi) diff 3
  [["veliko","malo"],["brzo","sporo"],["toplo","hladno"],["dan","noć"],["gore","dolje"],["lijevo","desno"],["veselo","tužno"],["staro","novo"],["tiho","glasno"],["mokro","suho"]].forEach(([w,opp]) => {
    const wrongs = sh(["veliko","malo","brzo","sporo","toplo","hladno","gore","dolje","veselo","tužno","staro","novo"].filter(x=>x!==opp)).slice(0,3);
    q.push({ type:"choice", difficulty:3, question:`Koja riječ znači suprotno od riječi "${w}"?`, answers:sh([opp,...wrongs]), correctIndex:-1, _c:opp });
  });

  // 13) Što ne pripada? diff 3
  [["pas, mačka, riba, stol","stol"],["jabuka, kruška, banana, stolica","stolica"],["crvena, plava, zelena, mama","mama"],["mama, tata, baka, auto","auto"],["olovka, knjiga, bilježnica, sunce","sunce"],["zima, ljeto, jesen, stol","stol"],["oko, nos, uho, stolica","stolica"],["košulja, hlače, cipele, knjiga","knjiga"]].forEach(([group,odd]) => {
    q.push({ type:"choice", difficulty:3, question:`Koja riječ NE pripada u skupinu: ${group}?`, answers:group.split(", "), correctIndex:group.split(", ").indexOf(odd) });
  });

  // 14) Umanji/uveličaj diff 3
  [["mačka","mačkica"],["pas","psić"],["kuća","kućica"],["knjiga","knjižica"],["riba","ribica"],["ptica","ptičica"],["brat","bratić"],["cvijet","cvjetić"],["nos","nosić"],["zub","zubić"]].forEach(([w,um]) => {
    const wrongs = sh(["mačkica","psić","kućica","knjižica","ribica","ptičica","bratić","cvjetić","nosić","zubić"].filter(x=>x!==um)).slice(0,3);
    q.push({ type:"choice", difficulty:3, question:`Kako glasi umanjenica riječi "${w}"?`, answers:sh([um,...wrongs]), correctIndex:-1, _c:um });
  });

  return fix(q).slice(0, 210);
}

module.exports = { genSlova:wrapGenerator(genSlova), genGlasovi:wrapGenerator(genGlasovi), genRijeci:wrapGenerator(genRijeci), genRecenice:wrapGenerator(genRecenice), N, IF, IM, sh, cfc, rep, fix, EL, CIRCLE, unos, oznake };
