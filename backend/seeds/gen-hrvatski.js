// generators.js — Question generators for Učilica V4
// Each function returns 200+ questions for its topic

const CIRCLE = "○";

function sh(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = (i * 7 + 3) % (i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
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
function fix(arr) {
  return arr.map(q => {
    if (q._c !== undefined && q.correctIndex === -1) {
      q.correctIndex = q.answers.indexOf(q._c);
      if (q.correctIndex === -1) q.correctIndex = 0;
      delete q._c;
    }
    return q;
  });
}

// ═══════════════ HRVATSKI JEZIK ═══════════════

function genSlova() {
  const q = [];
  const abc = "A B C Č Ć D Đ E F G H I J K L M N O P R S Š T U V Z Ž".split(" ");
  const dig = [["DŽ","Dž","dž"],["LJ","Lj","lj"],["NJ","Nj","nj"]];

  abc.forEach(L => { const s = L.toLowerCase();
    q.push({ type:"choice", difficulty:1, question:`Koje je malo slovo od "${L}"?`, answers:sh([s,"m","k","t"]).filter((v,i,a)=>a.indexOf(v)===i).slice(0,4), correctIndex:-1, _c:s });
    q.push({ type:"input", difficulty:1, question:`Napiši malo slovo od "${L}":`, correctAnswer:s });
    q.push({ type:"input", difficulty:2, question:`Napiši veliko slovo od "${s}":`, correctAnswer:L });
  });
  dig.forEach(([u,t,l]) => {
    q.push({ type:"choice", difficulty:2, question:`Veliko slovo dvoslova "${l}"?`, answers:sh([t,u,l,l[0].toUpperCase()]), correctIndex:-1, _c:t });
    q.push({ type:"input", difficulty:3, question:`Napiši veliko slovo od "${l}":`, correctAnswer:t });
  });
  for (let i = 0; i < abc.length - 1; i++)
    q.push({ type:"choice", difficulty:2, question:`Slovo nakon "${abc[i]}"?`, answers:sh([abc[i+1],abc[Math.max(0,i-1)],abc[Math.min(abc.length-1,i+2)],"Ž"]), correctIndex:-1, _c:abc[i+1] });
  for (let i = 1; i < abc.length; i++)
    q.push({ type:"choice", difficulty:2, question:`Slovo prije "${abc[i]}"?`, answers:sh([abc[i-1],abc[Math.min(abc.length-1,i+1)],"A","Z"]), correctIndex:-1, _c:abc[i-1] });

  [["🍎","jabuka","j"],["🐶","pas","p"],["🐱","mačka","m"],["🚗","auto","a"],["🌞","sunce","s"],["🐟","riba","r"],["🌳","drvo","d"],["🏠","kuća","k"],["🐝","pčela","p"],["📖","knjiga","k"],["✏️","olovka","o"],["🎵","nota","n"],["🦋","leptir","l"],["🐦","ptica","p"],["🐸","žaba","ž"],["🌹","ruža","r"],["⚽","lopta","l"],["🧸","medvjedić","m"],["🐻","medvjed","m"],["🎒","torba","t"]].forEach(([e,w,l]) => q.push({ type:"input", difficulty:2, visual:e, question:`Kojim slovom počinje "${w}"?`, correctAnswer:l }));
  [["mama","a"],["tata","a"],["pas","s"],["rak","k"],["nos","s"],["put","t"],["dom","m"],["sat","t"],["dan","n"],["led","d"],["med","d"],["sok","k"],["list","t"],["grad","d"],["brod","d"]].forEach(([w,l]) => q.push({ type:"input", difficulty:3, question:`Zadnje slovo u "${w}"?`, correctAnswer:l }));
  ["Q","W","X","Y"].forEach(f => { const o = sh(abc).slice(0,3); q.push({ type:"choice", difficulty:2, question:"Koje slovo NIJE u hrvatskoj abecedi?", answers:sh([f,...o]), correctIndex:-1, _c:f }); });
  q.push({ type:"choice", difficulty:2, question:"Koliko slova ima hrvatska abeceda?", answers:["26","30","27","32"], correctIndex:1 });
  [["_ama","m"],["_ata","t"],["_kola","š"],["_uto","a"],["_unce","s"],["_iba","r"],["_uća","k"],["_opta","l"],["_rvo","d"],["_jeto","lj"],["_uka","r"],["_lak","v"],["_rad","g"],["_ist","l"],["_ore","m"]].forEach(([p,l]) => q.push({ type:"input", difficulty:3, question:`Slovo nedostaje: "${p}"?`, correctAnswer:l }));
  return fix(q).slice(0, 210);
}

function genGlasovi() {
  const q = [];
  const vow = ["a","e","i","o","u"];
  const con = ["b","c","č","ć","d","đ","f","g","h","j","k","l","m","n","p","r","s","š","t","v","z","ž"];

  vow.forEach(v => q.push({ type:"choice", difficulty:1, question:`"${v.toUpperCase()}" je...`, answers:["samoglasnik","suglasnik"], correctIndex:0 }));
  con.forEach(c => q.push({ type:"choice", difficulty:1, question:`"${c.toUpperCase()}" je...`, answers:["samoglasnik","suglasnik"], correctIndex:1 }));
  for (let i = 0; i < 20; i++) { const v = vow[i%5]; const cs = sh(con).slice(0,3); const a = sh([v,...cs]).map(x=>x.toUpperCase()); q.push({ type:"choice", difficulty:1, question:"Koji glas je samoglasnik?", answers:a, correctIndex:-1, _c:v.toUpperCase() }); }
  for (let i = 0; i < 15; i++) { const c = con[i%con.length]; const vs = sh(vow).slice(0,3); const a = sh([c,...vs]).map(x=>x.toUpperCase()); q.push({ type:"choice", difficulty:1, question:"Koji glas je suglasnik?", answers:a, correctIndex:-1, _c:c.toUpperCase() }); }
  q.push({ type:"input", difficulty:2, question:"Napiši sve samoglasnike (velikim, bez razmaka):", correctAnswer:"AEIOU" });
  q.push({ type:"choice", difficulty:2, question:"Koliko samoglasnika u hrvatskom?", answers:["3","4","5","6"], correctIndex:2 });
  [["kuća",2],["pas",1],["riba",2],["auto",2],["mama",2],["tata",2],["škola",2],["sunce",2],["drvo",1],["oblak",2],["jabuka",3],["lopta",2],["olovo",3],["igla",2],["ulica",3],["olovka",3],["večera",3],["banana",3],["ananas",3],["more",2],["rijeka",3],["planina",3],["zemlja",2],["ptica",2],["leptir",2],["cvijet",2],["petica",3],["metar",2],["kamen",2],["prozor",2]].forEach(([w,c]) => { const r = cfc(c,0,5); q.push({ type:"choice", difficulty:2, question:`Koliko samoglasnika u "${w}"?`, answers:r.answers, correctIndex:r.correctIndex }); });
  [["kuća",2],["pas",2],["riba",2],["škola",3],["mama",2],["drvo",3],["oblak",3],["lopta",3],["sunce",3],["cvijet",4],["ptica",3],["knjiga",4],["stolica",4],["planina",3],["medvjed",5]].forEach(([w,c]) => { const r = cfc(c,0,7); q.push({ type:"choice", difficulty:3, question:`Koliko suglasnika u "${w}"?`, answers:r.answers, correctIndex:r.correctIndex }); });
  [["rak","a"],["led","e"],["list","i"],["dom","o"],["put","u"],["sat","a"],["med","e"],["dim","i"],["sok","o"],["luk","u"],["brat","a"],["ples","e"],["mir","i"],["nos","o"],["duh","u"]].forEach(([w,v]) => q.push({ type:"choice", difficulty:2, question:`Koji samoglasnik u "${w}"?`, answers:["a","e","i","o","u"], correctIndex:vow.indexOf(v) }));
  [["ja",1],["da",1],["ne",1],["mama",2],["tata",2],["riba",2],["škola",2],["ljeto",2],["jabuka",3],["loptica",3],["auto",2],["ulica",3],["olovka",3],["planina",3],["televizor",4],["automobil",4],["računalo",4],["čokolada",4],["stolica",3],["cvjetić",2]].forEach(([w,c]) => { const r = cfc(c,1,6); q.push({ type:"choice", difficulty:3, question:`Koliko slogova: "${w}"?`, answers:r.answers, correctIndex:r.correctIndex }); });
  // koji glas NE PRIPADA grupi (samoglasnik među suglasnicima) diff 2
  for (let i=0;i<15;i++) { const v=vow[(i*2)%5]; const cs=sh(con).slice(0,3); const all=sh([v,...cs]).map(x=>x.toUpperCase()); q.push({ type:"choice", difficulty:2, question:"Koji glas NE pripada ostalima?", answers:all, correctIndex:-1, _c:v.toUpperCase(), hint:"Jedan je samoglasnik, ostali suglasnici." }); }
  // suglasnik među samoglasnicima diff 2
  for (let i=0;i<10;i++) { const c=con[(i*3)%con.length]; const vs=sh(vow).slice(0,3); const all=sh([c,...vs]).map(x=>x.toUpperCase()); q.push({ type:"choice", difficulty:2, question:"Koji glas NE pripada ostalima?", answers:all, correctIndex:-1, _c:c.toUpperCase(), hint:"Jedan je suglasnik, ostali samoglasnici." }); }
  // input: napiši samoglasnike u riječi diff 3
  [["kuća","ua"],["mama","aa"],["riba","ia"],["škola","oa"],["sunce","ue"],["jabuka","aua"],["lopta","oa"],["olovka","ooa"]].forEach(([w,v]) => q.push({ type:"input", difficulty:3, question:`Napiši samoglasnike iz "${w}" (redom, bez razmaka):`, correctAnswer:v }));
  // točno/netočno diff 2
  [["'A' je samoglasnik.",true],["'B' je samoglasnik.",false],["'E' je suglasnik.",false],["'K' je suglasnik.",true],["Samoglasnika ima 5.",true],["Samoglasnika ima 6.",false],["'U' je samoglasnik.",true],["'R' je samoglasnik.",false],["Svaka riječ ima barem jedan samoglasnik.",true],["'O' je suglasnik.",false]].forEach(([s,c]) => q.push({ type:"choice", difficulty:2, question:s, answers:["Točno","Netočno"], correctIndex:c?0:1 }));
  return fix(q).slice(0, 210);
}

function genRijeci() {
  const q = [];
  const ew = [["🐱","mačka"],["🐶","pas"],["🐟","riba"],["🍎","jabuka"],["🐰","zec"],["🐮","krava"],["🌞","sunce"],["🌙","mjesec"],["⭐","zvijezda"],["🌳","drvo"],["🌹","ruža"],["🦋","leptir"],["🐝","pčela"],["🐸","žaba"],["🐦","ptica"],["🐻","medvjed"],["🐴","konj"],["🐑","ovca"],["🐷","svinja"],["🐔","kokoš"],["🍌","banana"],["🍊","naranča"],["🍇","grožđe"],["🍓","jagoda"],["🍉","lubenica"],["⚽","lopta"],["📖","knjiga"],["✏️","olovka"],["🎒","torba"],["🏠","kuća"],["🚗","auto"],["🚌","autobus"],["🚲","bicikl"],["✈️","avion"],["🚢","brod"],["👁️","oko"],["👂","uho"],["👃","nos"],["🦷","zub"],["🧸","igračka"]];

  ew.forEach(([e,w]) => {
    q.push({ type:"input", difficulty:1, visual:e, question:"Što je na slici?", correctAnswer:w });
    const wr = sh(ew.filter(([_,x])=>x!==w)).slice(0,3).map(([_,x])=>x);
    q.push({ type:"choice", difficulty:1, visual:e, question:"Što je na slici?", answers:sh([w,...wr]), correctIndex:-1, _c:w });
  });
  [["sat","brat"],["grom","dom"],["dan","stan"],["vlak","mrak"],["dom","grom"],["led","med"],["sok","skok"],["rak","mak"],["put","krut"],["dim","tim"],["brod","plod"],["grad","rad"],["list","čist"],["nos","kos"],["more","gore"],["ruka","muka"],["noga","yoga"],["kosa","rosa"],["zima","rima"],["škola","gola"],["ptica","ulica"],["mama","drama"],["tata","plata"],["kuća","puća"],["sat","mat"]].forEach(([w,r]) => { const wr = sh(["pero","auto","sunce","mačka","knjiga","stol","kuća","voda","drvo","lopta"]).filter(x=>x!==r).slice(0,3); q.push({ type:"choice", difficulty:2, question:`Rimuje se s "${w}"?`, answers:sh([r,...wr]), correctIndex:-1, _c:r }); });
  [[["ma","ma"],"mama"],[["ta","ta"],"tata"],[["ri","ba"],"riba"],[["ško","la"],"škola"],[["lje","to"],"ljeto"],[["zi","ma"],"zima"],[["ku","ća"],"kuća"],[["lo","pti","ca"],"loptica"],[["ja","bu","ka"],"jabuka"],[["knji","ga"],"knjiga"],[["olov","ka"],"olovka"],[["pti","ca"],"ptica"],[["sun","ce"],"sunce"],[["ob","lak"],"oblak"],[["cvi","jet"],"cvijet"],[["pro","lje","će"],"proljeće"],[["bo","ji","ca"],"bojica"],[["je","sen"],"jesen"],[["u","li","ca"],"ulica"],[["ba","na","na"],"banana"]].forEach(([p,f]) => { const wr = sh(ew.map(([_,w])=>w).filter(x=>x!==f)).slice(0,3); q.push({ type:"choice", difficulty:3, question:`Riječ od slogova "${p.join("-")}"?`, answers:sh([f,...wr]), correctIndex:-1, _c:f }); });
  [["pas",3],["dom",3],["mama",4],["riba",4],["škola",5],["sunce",5],["jabuka",6],["loptica",7],["kuća",4],["drvo",4],["auto",4],["more",4],["ptica",5],["oblak",5],["cvijet",6]].forEach(([w,c]) => { const r = cfc(c,2,9); q.push({ type:"choice", difficulty:3, question:`Koliko glasova: "${w}"?`, answers:r.answers, correctIndex:r.correctIndex }); });
  [["mama","mačka","kuća"],["tata","torba","riba"],["sunce","sat","drvo"],["pas","ptica","auto"],["lopta","leptir","škola"],["krava","knjiga","riba"],["ruka","ruža","jabuka"],["brod","banana","cvijet"],["dom","drvo","sat"],["voda","vlak","kuća"]].forEach(([w1,w2,wr]) => { const a = sh([w2,wr,sh(["čokolada","igla","šuma","zvijezda"])[0]]); q.push({ type:"choice", difficulty:2, question:`Isto početno slovo kao "${w1}"?`, answers:a, correctIndex:-1, _c:w2 }); });
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
  sentences.forEach(s => {
    const wrong1 = s[0].toLowerCase() + s.slice(1); // malo početno
    const wrong2 = s.slice(0, -1); // bez točke
    const wrong3 = s[0].toLowerCase() + s.slice(1, -1); // oba krivo
    q.push({ type:"choice", difficulty:2, question:"Koja rečenica je ispravno napisana?", answers:sh([s, wrong1, wrong2, wrong3]), correctIndex:-1, _c:s });
  });

  // 2) Popravi rečenicu — napiši ispravno diff 3
  [["pas trči.","Pas trči."],["mama kuha ručak.","Mama kuha ručak."],["pada kiša","Pada kiša."],["sunce sija","Sunce sija."],["ana ide u školu.","Ana ide u školu."],["djeca se igraju","Djeca se igraju."],["baka peče kolače","Baka peče kolače."],["luka čita knjige.","Luka čita knjige."]].forEach(([wrong,correct]) => q.push({ type:"input", difficulty:3, question:`Popravi rečenicu: "${wrong}"`, correctAnswer:correct, placeholder:"Napiši ispravno..." }));

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
  ].forEach(([s,t]) => q.push({ type:"choice", difficulty:1, question:`"${s}" je...`, answers:["izjavna rečenica","upitna rečenica","usklična rečenica"], correctIndex:t==="izjavna"?0:t==="upitna"?1:2 }));

  // 4) Čime završava diff 1
  q.push({ type:"choice", difficulty:1, question:"Čime završava izjavna rečenica?", answers:[".","?","!",","], correctIndex:0 });
  q.push({ type:"choice", difficulty:1, question:"Čime završava upitna rečenica?", answers:[".","?","!",","], correctIndex:1 });
  q.push({ type:"choice", difficulty:1, question:"Čime završava usklična rečenica?", answers:[".","?","!",","], correctIndex:2 });

  // 5) Veliko slovo za imena diff 2
  ["Zagreb","Hrvatska","Ana","Luka","Dunav","Rijeka","Split","Osijek","Europa","Marko","Sava","Drava","Varaždin","Dubrovnik","Zadar"].forEach(n => q.push({ type:"choice", difficulty:2, question:`Kako se pravilno piše "${n.toLowerCase()}"?`, answers:[n,n.toLowerCase(),n.toUpperCase(),n[0].toLowerCase()+n.slice(1)], correctIndex:0 }));

  // 6) Stavi znak diff 3
  [["Idem kući","."],["Kako se zoveš","?"],["Super","!"],["Pada kiša","."],["Voliš li sladoled","?"],["Hura","!"],["Mama kuha ručak","."],["Gdje živiš","?"],["Bravo","!"],["Sunce sija","."],["Koliko imaš godina","?"],["Pobijedio sam","!"],["Djeca se igraju","."],["Što je ovo","?"],["Pazi","!"],["Tata vozi auto","."],["Ideš li na more","?"],["Jupi","!"]].forEach(([s,sign]) => q.push({ type:"choice", difficulty:3, question:`Koji znak na kraj: "${s}"`, answers:[".","?","!"], correctIndex:sign==="."?0:sign==="?"?1:2 }));

  // 7) Koliko riječi diff 3
  [["Pas trči.",2],["Mama kuha ručak.",3],["Ja volim čokoladu.",3],["Sunce sija.",2],["Luka čita knjige.",3],["Pada kiša.",2],["Ptica leti visoko.",3],["Baka peče kolače za nas.",5],["Ana i Luka idu u školu.",6],["Djeca se igraju u dvorištu.",5],["Pada kiša i puše vjetar.",5],["Moj brat voli čokoladu.",4]].forEach(([s,c]) => { const r = cfc(c,1,8); q.push({ type:"choice", difficulty:3, question:`Koliko riječi: "${s}"?`, answers:r.answers, correctIndex:r.correctIndex }); });

  // 8) Posloži riječi u rečenicu diff 4
  [["trči Pas parku. po","Pas trči po parku."],["kuha Mama ručak.","Mama kuha ručak."],["Pada snijeg. bijeli","Pada bijeli snijeg."],["idu školu. Djeca u","Djeca idu u školu."],["jabuku. Luka jede","Luka jede jabuku."],["sija Sunce nebu. na","Sunce sija na nebu."],["čita Baka knjigu.","Baka čita knjigu."],["spava Mačka kauču. na","Mačka spava na kauču."]].forEach(([jumbled,correct]) => { const wrongs = sh(sentences.filter(x=>x!==correct)).slice(0,3); q.push({ type:"choice", difficulty:4, question:`Posloži u rečenicu: "${jumbled}"`, answers:sh([correct,...wrongs]), correctIndex:-1, _c:correct }); });

  // 9) Dopuni rečenicu diff 3
  [["Pas ___ po parku.","trči"],["Mama ___ ručak.","kuha"],["Ptica ___ na drvetu.","pjeva"],["Riba ___ u moru.","pliva"],["Sunce ___ na nebu.","sija"],["Djeca se ___ u dvorištu.","igraju"],["Pada bijeli ___.","snijeg"],["Mačka ___ na kauču.","spava"]].forEach(([s,w]) => { const wrongs = sh(["trči","kuha","pjeva","pliva","sija","igraju","snijeg","spava","jede","čita","leti","piše"]).filter(x=>x!==w).slice(0,3); q.push({ type:"choice", difficulty:3, question:`Dopuni: "${s}"`, answers:sh([w,...wrongs]), correctIndex:-1, _c:w }); });

  // 10) Što je pravilno? diff 2 — razne greške
  [["Rijeka","rijeka"],["hrvatska","Hrvatska"],["marko","Marko"],["zagreb","Zagreb"],["dunav","Dunav"],["ana","Ana"],["europa","Europa"],["luka","Luka"]].forEach(([wrong,correct]) => q.push({ type:"choice", difficulty:2, question:`Koji je ispravan zapis?`, answers:[correct,wrong], correctIndex:0 }));

  // 11) Jednina / množina diff 3
  [["pas","psi"],["mačka","mačke"],["knjiga","knjige"],["jabuka","jabuke"],["olovka","olovke"],["ptica","ptice"],["stol","stolovi"],["cvijet","cvjetovi"],["sat","satovi"],["brod","brodovi"]].forEach(([j,m]) => {
    q.push({ type:"input", difficulty:3, question:`Množina od "${j}":`, correctAnswer:m, placeholder:"Napiši množinu..." });
    q.push({ type:"input", difficulty:3, question:`Jednina od "${m}":`, correctAnswer:j, placeholder:"Napiši jedninu..." });
  });

  // 12) Suprotno značenje (antonimi) diff 3
  [["veliko","malo"],["brzo","sporo"],["toplo","hladno"],["dan","noć"],["gore","dolje"],["lijevo","desno"],["veselo","tužno"],["staro","novo"],["tiho","glasno"],["mokro","suho"]].forEach(([w,opp]) => {
    const wrongs = sh(["veliko","malo","brzo","sporo","toplo","hladno","gore","dolje","veselo","tužno","staro","novo"].filter(x=>x!==opp)).slice(0,3);
    q.push({ type:"choice", difficulty:3, question:`Suprotno od "${w}"?`, answers:sh([opp,...wrongs]), correctIndex:-1, _c:opp });
  });

  // 13) Što ne pripada? diff 3
  [["pas, mačka, riba, stol","stol"],["jabuka, kruška, banana, stolica","stolica"],["crvena, plava, zelena, mama","mama"],["mama, tata, baka, auto","auto"],["olovka, knjiga, bilježnica, sunce","sunce"],["zima, ljeto, jesen, stol","stol"],["oko, nos, uho, stolica","stolica"],["košulja, hlače, cipele, knjiga","knjiga"]].forEach(([group,odd]) => {
    q.push({ type:"choice", difficulty:3, question:`Što NE pripada u skupinu: ${group}?`, answers:group.split(", "), correctIndex:group.split(", ").indexOf(odd) });
  });

  // 14) Umanji/uveličaj diff 3
  [["mačka","mačkica"],["pas","psić"],["kuća","kućica"],["knjiga","knjižica"],["riba","ribica"],["ptica","ptičica"],["brat","bratić"],["cvijet","cvjetić"],["nos","nosić"],["zub","zubić"]].forEach(([w,um]) => {
    const wrongs = sh(["mačkica","psić","kućica","knjižica","ribica","ptičica","bratić","cvjetić","nosić","zubić"].filter(x=>x!==um)).slice(0,3);
    q.push({ type:"choice", difficulty:3, question:`Umanjenica od "${w}"?`, answers:sh([um,...wrongs]), correctIndex:-1, _c:um });
  });

  return fix(q).slice(0, 210);
}

module.exports = { genSlova, genGlasovi, genRijeci, genRecenice, N, IF, IM, sh, cfc, rep, fix, EL, CIRCLE };
