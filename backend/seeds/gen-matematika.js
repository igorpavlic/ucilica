// gen-matematika.js — Math question generators
const { N, IF, IM, sh, cfc, rep, fix, EL, CIRCLE } = require("./gen-hrvatski");

function genBrojevi() {
  const q = [];
  for (let n = 1; n <= 10; n++) EL.forEach(e => q.push({ type:"input", difficulty:1, visual:rep(e,n), question:"Prebroji koliko ih ima:", correctAnswer:String(n) }));
  for (let i = 0; i <= 19; i++) q.push({ type:"input", difficulty:i<10?1:2, question:`Koji broj dolazi NAKON ${i}?`, correctAnswer:String(i+1) });
  for (let i = 1; i <= 20; i++) q.push({ type:"input", difficulty:i<=10?1:2, question:`Koji broj dolazi PRIJE ${i}?`, correctAnswer:String(i-1) });
  [[3,7,1,9],[12,5,8,15],[2,11,6,4],[17,13,19,10],[20,14,16,18],[1,3,5,7],[2,4,6,8],[10,20,15,5],[11,9,13,7],[6,12,3,18]].forEach(s => { q.push({ type:"choice", difficulty:2, question:`NAJVEĆI: ${s.join(", ")}?`, answers:s.map(String), correctIndex:s.indexOf(Math.max(...s)) }); q.push({ type:"choice", difficulty:2, question:`NAJMANJI: ${s.join(", ")}?`, answers:s.map(String), correctIndex:s.indexOf(Math.min(...s)) }); });
  for (let s = 1; s <= 15; s++) q.push({ type:"input", difficulty:3, question:`Nedostaje: ${s}, ?, ${s+2}, ${s+3}`, correctAnswer:String(s+1) });
  for (let i = 1; i <= 20; i++) q.push({ type:"choice", difficulty:3, question:`Je li ${i} paran ili neparan?`, answers:["paran","neparan"], correctIndex:i%2===0?0:1 });
  for (let i = 1; i <= 18; i++) { const r = cfc(i+1,1,20); q.push({ type:"choice", difficulty:2, question:`Broj između ${i} i ${i+2}?`, answers:r.answers, correctIndex:r.correctIndex }); }
  return fix(q).slice(0, 210);
}

function genZbrajanje() {
  const q = [];
  // 1) Klasična zbrajanja a+b<=10
  for (let a = 0; a <= 10; a++) for (let b = 0; b <= 10-a; b++) { if(!a&&!b) continue; const s=a+b; const r=cfc(s,0,15); q.push({ type:"choice", difficulty:a<=3&&b<=3?1:2, question:`${a} + ${b} = ?`, answers:r.answers, correctIndex:r.correctIndex }); if((a+b)%2===0) q.push({ type:"input", difficulty:2, question:`${a} + ${b} = ?`, correctAnswer:String(s) }); }
  // 2) Emoji zbrajanje
  for (let a=1;a<=5;a++) for (let b=1;b<=5;b++) { if(a+b>10) continue; const e1=EL[(a+b)%EL.length],e2=EL[(a+b+1)%EL.length]; const r=cfc(a+b,1,12); q.push({ type:"choice", difficulty:1, visual:`${rep(e1,a)} + ${rep(e2,b)}`, question:"Koliko je ukupno?", answers:r.answers, correctIndex:r.correctIndex }); }
  // 3) +0
  for (let a=1;a<=10;a++) q.push({ type:"input", difficulty:1, question:`${a} + 0 = ?`, correctAnswer:String(a) });
  // 4) Nepoznata
  for (let a=1;a<=5;a++) for (let b=1;b<=5;b++) { if(a+b>10) continue; q.push({ type:"input", difficulty:4, question:`${a} + ? = ${a+b}. Koji je nepoznati broj?`, correctAnswer:String(b) }); }

  // 5) RAZNOLIKE priče — zbrajanje riječima
  const stories = [];
  // a) "ima X, dobio još Y"
  for(let i=0;i<8;i++){const a=(i%4)+1,b=((i*2+1)%4)+1;if(a+b>10)continue;
    stories.push({q:`${N()} ima ${a} ${IF()}. Dobio/la je još ${b}. Koliko ih sada ima?`,ans:a+b});}
  // b) "na grani sjedi X, dođe još Y"
  for(let i=0;i<6;i++){const a=(i%3)+2,b=((i*3)%3)+1;
    stories.push({q:`Na grani sjedi ${a} ptica. Dođe još ${b}. Koliko ih je sada na grani?`,ans:a+b});}
  // c) "u košari X, mama stavi još Y"
  for(let i=0;i<6;i++){const a=(i%4)+1,b=((i*2+1)%3)+1;if(a+b>10)continue;
    stories.push({q:`U košari je ${a} ${IF()}. Mama stavi još ${b}. Koliko ih je u košari?`,ans:a+b});}
  // d) "X učenika u razredu, dođe još Y"
  for(let i=0;i<5;i++){const a=(i%3)+3,b=((i+1)%3)+1;if(a+b>10)continue;
    stories.push({q:`U razredu sjedi ${a} učenika. Dolazi još ${b}. Koliko ih je sad u razredu?`,ans:a+b});}
  // e) "na parkingu X auta, dođe još Y"
  for(let i=0;i<5;i++){const a=(i%4)+2,b=((i*2)%3)+1;if(a+b>10)continue;
    stories.push({q:`Na parkingu stoji ${a} auta. Došlo je još ${b}. Koliko auta je sada na parkingu?`,ans:a+b});}
  // f) "ujutro pojeo X, navečer Y"
  for(let i=0;i<6;i++){const a=(i%3)+1,b=((i+1)%4)+1;if(a+b>10)continue;
    stories.push({q:`${N()} je ujutro pojeo ${a} ${IM()}, a navečer još ${b}. Koliko je ukupno pojeo?`,ans:a+b});}
  // g) "u jednom džepu X, u drugom Y"
  for(let i=0;i<5;i++){const a=(i%3)+2,b=((i*3+1)%4)+1;if(a+b>10)continue;
    stories.push({q:`${N()} ima u jednom džepu ${a} ${IF()}, a u drugom ${b}. Koliko ukupno?`,ans:a+b});}
  // h) "na stolu X, u ladici Y"
  for(let i=0;i<5;i++){const a=(i%4)+1,b=((i*2)%4)+2;if(a+b>10)continue;
    stories.push({q:`Na stolu leži ${a} ${IM()}, a u ladici još ${b}. Koliko ukupno?`,ans:a+b});}
  // i) "crvenih X, plavih Y — koliko ukupno loptice"
  for(let i=0;i<5;i++){const a=(i%3)+2,b=((i+2)%4)+1;if(a+b>10)continue;
    stories.push({q:`${N()} ima ${a} crvenih i ${b} plavih loptica. Koliko loptica ima ukupno?`,ans:a+b});}
  // j) "na jezeru X patki, dopliva još Y"
  for(let i=0;i<5;i++){const a=(i%3)+1,b=((i*2+1)%3)+2;if(a+b>10)continue;
    stories.push({q:`Na jezeru pliva ${a} patki. Dopliva još ${b}. Koliko patki je sada na jezeru?`,ans:a+b});}

  stories.forEach(s => q.push({ type:"input", difficulty:3, question:s.q, correctAnswer:String(s.ans) }));

  return fix(q).slice(0, 210);
}

function genOduzimanje() {
  const q = [];
  // 1) Klasična oduzimanja a-b, a<=10
  for (let a=1;a<=10;a++) for (let b=0;b<=a;b++) { const d=a-b; const r=cfc(d,0,12); q.push({ type:"choice", difficulty:a<=5?1:2, question:`${a} - ${b} = ?`, answers:r.answers, correctIndex:r.correctIndex }); if((a+b)%2===0) q.push({ type:"input", difficulty:2, question:`${a} - ${b} = ?`, correctAnswer:String(d) }); }
  // 2) Emoji oduzimanje
  for (let t=3;t<=10;t++) { const m=((t-1)%(t-1))+1; const e=EL[t%EL.length]; q.push({ type:"input", difficulty:2, visual:`${rep(e,t)} − ${rep(e,m)}`, question:"Koliko ostane?", correctAnswer:String(t-m) }); }
  // 3) Oduzmi od 10
  for (let b=0;b<=10;b++) q.push({ type:"input", difficulty:2, question:`10 - ${b} = ?`, correctAnswer:String(10-b) });
  // 4) Nepoznata
  for (let a=3;a<=10;a++) for (let b=1;b<a&&b<=5;b++) q.push({ type:"input", difficulty:4, question:`${a} - ? = ${a-b}. Koji je nepoznati broj?`, correctAnswer:String(b) });

  // 5) RAZNOLIKE priče — oduzimanje riječima
  const stories = [];
  // a) "ima X, pojeo/potrošio Y"
  for(let i=0;i<8;i++){const t=(i%5)+4,take=(i%3)+1;if(take>=t)continue;
    stories.push({q:`${N()} ima ${t} ${IF()}. Pojeo/la je ${take}. Koliko mu/joj je ostalo?`,ans:t-take});}
  // b) "u vazi X cvjetova, uvene Y"
  for(let i=0;i<5;i++){const t=(i%4)+4,take=(i%2)+1;
    stories.push({q:`U vazi stoji ${t} cvjetova. ${take} ih je uvenulo. Koliko cvjetova još stoji?`,ans:t-take});}
  // c) "na grani X ptica, odleti Y"
  for(let i=0;i<6;i++){const t=(i%4)+3,take=(i%2)+1;if(take>=t)continue;
    stories.push({q:`Na grani sjedi ${t} ptica. ${take} ih odleti. Koliko ih ostane na grani?`,ans:t-take});}
  // d) "u autobusu X putnika, izađe Y"
  for(let i=0;i<5;i++){const t=(i%4)+5,take=(i%3)+1;
    stories.push({q:`U autobusu je ${t} putnika. Na stanici izađe ${take}. Koliko putnika ostane?`,ans:t-take});}
  // e) "ima X kuna, kupi nešto za Y"
  for(let i=0;i<5;i++){const t=(i%4)+5,take=(i%3)+2;if(take>=t)continue;
    stories.push({q:`${N()} ima ${t} kuna. Kupi sladoled za ${take} kune. Koliko kuna mu/joj ostane?`,ans:t-take});}
  // f) "u kutiji X keksa, pojedu Y"
  for(let i=0;i<5;i++){const t=(i%5)+4,take=(i%2)+1;
    stories.push({q:`U kutiji je ${t} keksa. Djeca pojedu ${take}. Koliko keksa ostane u kutiji?`,ans:t-take});}
  // g) "u razredu X djece, Y ode kući"
  for(let i=0;i<5;i++){const t=(i%4)+5,take=(i%3)+1;
    stories.push({q:`U razredu je ${t} djece. ${take} učenika ode kući ranije. Koliko djece ostane?`,ans:t-take});}
  // h) "mama napravila X kolača, pojeli Y"
  for(let i=0;i<5;i++){const t=(i%4)+5,take=(i%3)+2;if(take>=t)continue;
    stories.push({q:`Mama je napravila ${t} kolača. Obitelj je pojela ${take}. Koliko kolača je ostalo?`,ans:t-take});}
  // i) "na parkingu X auta, ode Y"
  for(let i=0;i<5;i++){const t=(i%4)+4,take=(i%2)+1;
    stories.push({q:`Na parkingu stoji ${t} auta. ${take} ih je otišlo. Koliko auta je ostalo?`,ans:t-take});}
  // j) "imao X naljepnica, dao prijatelju Y"
  for(let i=0;i<5;i++){const t=(i%5)+4,take=(i%3)+1;if(take>=t)continue;
    stories.push({q:`${N()} ima ${t} naljepnica. Dao/la je prijatelju ${take}. Koliko naljepnica mu/joj ostaje?`,ans:t-take});}
  // k) "na jezeru X patki, Y ode"
  for(let i=0;i<4;i++){const t=(i%3)+4,take=(i%2)+1;
    stories.push({q:`Na jezeru pliva ${t} patki. ${take} ih odleti. Koliko patki ostane na jezeru?`,ans:t-take});}
  // l) "u vrećici X bombona, izvadi Y"
  for(let i=0;i<4;i++){const t=(i%4)+5,take=(i%3)+1;
    stories.push({q:`U vrećici je ${t} bombona. ${N()} izvadi ${take}. Koliko bombona ostane u vrećici?`,ans:t-take});}

  stories.forEach(s => q.push({ type:"input", difficulty:3, question:s.q, correctAnswer:String(s.ans) }));

  return fix(q).slice(0, 210);
}

function genUsporedbe() {
  const q = [];
  // broj ○ broj
  for (let a=0;a<=10;a++) for (let b=0;b<=10;b++) { if(a===b&&a>3) continue; const s=a<b?"<":a>b?">":"="; q.push({ type:"choice", difficulty:a<=5&&b<=5?1:2, question:`${a}  ${CIRCLE}  ${b}`, answers:["<",">","="], correctIndex:s==="<"?0:s===">"?1:2 }); }
  // do 20
  [[11,15],[18,12],[13,13],[20,17],[14,16],[19,11],[15,15],[12,20],[16,14],[17,19]].forEach(([a,b])=>{ const s=a<b?"<":a>b?">":"="; q.push({ type:"choice", difficulty:3, question:`${a}  ${CIRCLE}  ${b}`, answers:["<",">","="], correctIndex:s==="<"?0:s===">"?1:2 }); });
  // emoji
  for (let a=1;a<=6;a++) for (let b=1;b<=6;b++) { if(a===b&&a>2) continue; const e=EL[(a+b)%EL.length]; const s=a<b?"<":a>b?">":"="; q.push({ type:"choice", difficulty:2, question:`${rep(e,a)}  ${CIRCLE}  ${rep(e,b)}`, answers:["<",">","="], correctIndex:s==="<"?0:s===">"?1:2 }); }
  // izraz ○ izraz
  [["3+2","4+1"],["7-1","3+3"],["5+2","10-3"],["4+4","9-1"],["2+3","8-3"],["6-2","1+3"],["5+1","4+2"],["8-5","1+2"],["7-4","2+1"],["9-3","3+3"],["10-5","2+3"],["6+1","10-3"],["4+3","5+2"],["8-2","3+3"],["9-4","2+3"],["1+7","10-2"],["5+4","10-1"],["3+6","4+5"],["7-2","1+4"],["8-1","6+1"]].forEach(([e1,e2])=>{ const v1=Function(`return ${e1}`)(),v2=Function(`return ${e2}`)(); const s=v1<v2?"<":v1>v2?">":"="; q.push({ type:"choice", difficulty:4, question:`${e1}  ${CIRCLE}  ${e2}`, answers:["<",">","="], correctIndex:s==="<"?0:s===">"?1:2 }); });
  q.push({ type:"choice", difficulty:1, question:'Što znači "<"?', answers:["manje od","veće od","jednako","plus"], correctIndex:0 });
  q.push({ type:"choice", difficulty:1, question:'Što znači ">"?', answers:["manje od","veće od","jednako","minus"], correctIndex:1 });
  q.push({ type:"choice", difficulty:1, question:'Što znači "="?', answers:["manje od","veće od","jednako","puta"], correctIndex:2 });
  // situacijske
  for (let i=0;i<25;i++) { const a=(i%8)+1,b=((i*3+1)%8)+1; const n1=N(),n2=N(),item=IF(); let cIdx; if(a>b)cIdx=0;else if(a<b)cIdx=1;else cIdx=2; q.push({ type:"choice", difficulty:i<10?3:5, question:`${n1} ima ${a} ${item}, ${n2} ima ${b}. Tko ima više?`, answers:[n1,n2,"isti broj"], correctIndex:cIdx }); }
  return fix(q).slice(0, 210);
}

module.exports = { genBrojevi, genZbrajanje, genOduzimanje, genUsporedbe, genGeometrija, genNizovi };

// ═══════════════════════════════════════════════════════
// MAT C.1.1 + C.1.2 + C.1.3 — Geometrija
// Tijela, likovi, crte, točke
// ═══════════════════════════════════════════════════════
function genGeometrija() {
  const q = [];

  // --- GEOMETRIJSKA TIJELA (C.1.1) ---
  const tijela = [
    ["kugla","⚽","lopta, jabuka, globus"],["valjak","🥫","limenka, svijeća, čaša"],
    ["kocka","🎲","kocka za igru, šećer kocka"],["kvadar","📦","kutija, cigla, ormar"],
    ["stožac","🎄","sladoled kornet, šešir čarobnjaka"],["piramida","🔺","egipatska piramida"]
  ];

  // Prepoznaj tijelo po slici
  tijela.forEach(([t,e,_]) => {
    const wr = sh(tijela.filter(([x])=>x!==t)).slice(0,3).map(([x])=>x);
    q.push({ type:"choice", difficulty:1, visual:e, question:"Koje geometrijsko tijelo vidiš?", answers:sh([t,...wr]), correctIndex:-1, _c:t });
  });
  // input - napiši ime
  tijela.forEach(([t,e,_]) => q.push({ type:"input", difficulty:2, visual:e, question:"Kako se zove ovo tijelo?", correctAnswer:t }));
  // predmet → tijelo
  [["lopta","kugla"],["limenka","valjak"],["kocka za igru","kocka"],["kutija cipela","kvadar"],["sladoled kornet","stožac"],["jabuka","kugla"],["ormar","kvadar"],["svijeća","valjak"],["čaša","valjak"],["cigla","kvadar"],["globus","kugla"],["šećer kocka","kocka"],["šator","stožac"],["kišobran","stožac"],["knjiga","kvadar"]].forEach(([obj,t]) => {
    const wr = sh(tijela.filter(([x])=>x!==t)).slice(0,3).map(([x])=>x);
    q.push({ type:"choice", difficulty:2, question:`"${obj}" ima oblik...`, answers:sh([t,...wr]), correctIndex:-1, _c:t });
  });
  // može/ne može se kotrljati
  [["kugla",true],["valjak",true],["kocka",false],["kvadar",false],["stožac",true],["piramida",false]].forEach(([t,c]) => q.push({ type:"choice", difficulty:2, question:`Može li se ${t} kotrljati?`, answers:["Da","Ne"], correctIndex:c?0:1 }));
  // ima ravnu/zakrivljenu površinu
  [["kugla","zakrivljenu"],["kocka","ravnu"],["valjak","i ravnu i zakrivljenu"],["kvadar","ravnu"]].forEach(([t,o]) => {
    q.push({ type:"choice", difficulty:3, question:`${t.charAt(0).toUpperCase()+t.slice(1)} ima ___ površinu.`, answers:["ravnu","zakrivljenu","i ravnu i zakrivljenu"], correctIndex:o==="ravnu"?0:o==="zakrivljenu"?1:2 });
  });

  // --- GEOMETRIJSKI LIKOVI (C.1.1) ---
  const likovi = [["krug","⭕"],["trokut","🔺"],["kvadrat","⬜"],["pravokutnik","🟫"]];
  // prepoznaj
  likovi.forEach(([l,e]) => {
    const wr = sh(likovi.filter(([x])=>x!==l)).slice(0,3).map(([x])=>x);
    q.push({ type:"choice", difficulty:1, visual:e, question:"Koji je ovo lik?", answers:sh([l,...wr]), correctIndex:-1, _c:l });
    q.push({ type:"input", difficulty:2, visual:e, question:"Kako se zove ovaj lik?", correctAnswer:l });
  });
  // koliko stranica
  [["krug",0],["trokut",3],["kvadrat",4],["pravokutnik",4]].forEach(([l,s]) => {
    const r = cfc(s,0,6);
    q.push({ type:"choice", difficulty:2, question:`Koliko stranica ima ${l}?`, answers:r.answers, correctIndex:r.correctIndex });
  });
  // koliko kutova
  [["krug",0],["trokut",3],["kvadrat",4],["pravokutnik",4]].forEach(([l,k]) => {
    const r = cfc(k,0,6);
    q.push({ type:"choice", difficulty:2, question:`Koliko kutova ima ${l}?`, answers:r.answers, correctIndex:r.correctIndex });
  });
  // predmeti → lik
  [["sat","krug"],["prozor","pravokutnik"],["krov kuće","trokut"],["pizza","krug"],["vrata","pravokutnik"],["pločica","kvadrat"],["kotač","krug"],["sendvič prepolovljen dijagonalno","trokut"],["bilježnica","pravokutnik"],["kocka za igru (jedna strana)","kvadrat"],["šahovsko polje","kvadrat"],["novčić","krug"]].forEach(([obj,l]) => {
    const wr = sh(likovi.filter(([x])=>x!==l)).slice(0,2).map(([x])=>x);
    q.push({ type:"choice", difficulty:2, question:`"${obj}" ima oblik...`, answers:sh([l,...wr,"trokut".includes(l)?"krug":"trokut"]), correctIndex:-1, _c:l });
  });

  // --- RAVNE I ZAKRIVLJENE CRTE (C.1.2) ---
  q.push({ type:"choice", difficulty:1, question:"Što je ravna crta?", answers:["Crta koja ne skreće","Crta koja se savija","Crta s točkom","Krug"], correctIndex:0 });
  q.push({ type:"choice", difficulty:1, question:"Što je zakrivljena crta?", answers:["Crta koja ne skreće","Crta koja se savija","Ravnalo","Točka"], correctIndex:1 });
  [["rub stola","ravna"],["banana","zakrivljena"],["ravnalo","ravna"],["zmija","zakrivljena"],["rub bilježnice","ravna"],["duga","zakrivljena"],["konop na podu","ravna"],["slovo S","zakrivljena"],["cedevita slamka","ravna"],["slovo O","zakrivljena"]].forEach(([obj,tip]) => {
    q.push({ type:"choice", difficulty:2, question:`"${obj}" — ravna ili zakrivljena crta?`, answers:["Ravna","Zakrivljena"], correctIndex:tip==="ravna"?0:1 });
  });
  // otvorena/zatvorena crta
  [["krug","zatvorena"],["slovo C","otvorena"],["trokut","zatvorena"],["val","otvorena"],["pravokutnik","zatvorena"],["slovo U","otvorena"]].forEach(([obj,tip]) => {
    q.push({ type:"choice", difficulty:3, question:`"${obj}" — otvorena ili zatvorena crta?`, answers:["Otvorena","Zatvorena"], correctIndex:tip==="otvorena"?0:1 });
  });

  // --- TOČKE (C.1.3) ---
  q.push({ type:"choice", difficulty:1, question:"Što je točka u geometriji?", answers:["Oznaka za mjesto","Vrsta crte","Geometrijski lik","Geometrijsko tijelo"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Čime označavamo točke?", answers:["Velikim tiskanim slovima (A, B, C)","Malim slovima (a, b, c)","Brojevima (1, 2, 3)","Bojama"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Koliko točaka treba za ravnu crtu?", answers:["Barem 2","Barem 3","Barem 1","Barem 4"], correctIndex:0 });
  q.push({ type:"choice", difficulty:2, question:"Koliko točaka (vrhova) ima trokut?", answers:["2","3","4","5"], correctIndex:1 });
  q.push({ type:"choice", difficulty:2, question:"Koliko točaka (vrhova) ima kvadrat?", answers:["2","3","4","5"], correctIndex:2 });

  // T/N geometrija
  [["Kugla se može kotrljati.",true],["Kocka se može kotrljati.",false],["Krug nema stranica.",true],["Trokut ima 4 stranice.",false],["Kvadrat ima 4 jednake stranice.",true],["Pravokutnik je okrugao.",false],["Valjak ima zakrivljenu površinu.",true],["Piramida ima šiljasti vrh.",true],["Krug ima kutove.",false],["Ravna crta ne skreće.",true]].forEach(([s,c]) => q.push({ type:"choice", difficulty:2, question:s, answers:["Točno","Netočno"], correctIndex:c?0:1 }));

  // --- DODATNE VARIJACIJE ---
  // Koliko strana ima tijelo
  [["kocka",6],["kvadar",6],["piramida",5],["valjak",3],["stožac",2]].forEach(([t,s]) => {
    const r = cfc(s,1,8);
    q.push({ type:"choice", difficulty:3, question:`Koliko površina (strana) ima ${t}?`, answers:r.answers, correctIndex:r.correctIndex });
  });
  // Koji lik nastaje kad izrežemo tijelo
  [["kugla","krug"],["valjak","krug"],["kocka","kvadrat"],["kvadar","pravokutnik"],["piramida","trokut"]].forEach(([t,l]) => {
    const wr = sh(likovi.filter(([x])=>x!==l)).slice(0,3).map(([x])=>x);
    q.push({ type:"choice", difficulty:4, question:`Ako prerežemo ${t}, dobijemo lik...`, answers:sh([l,...wr]), correctIndex:-1, _c:l });
  });
  // Simetrija - jednostavno
  [["🦋 leptir",true],["✏️ olovka",false],["❤️ srce",true],["⭐ zvijezda",true],["🔑 ključ",false]].forEach(([o,sym]) => q.push({ type:"choice", difficulty:3, question:`Je li ${o} simetričan?`, answers:["Da","Ne"], correctIndex:sym?0:1 }));
  // Spoji lik i tijelo
  [["krug","kugla"],["kvadrat","kocka"],["pravokutnik","kvadar"],["trokut","piramida"]].forEach(([l,t]) => {
    const wr = sh(tijela.filter(([x])=>x!==t)).slice(0,3).map(([x])=>x);
    q.push({ type:"choice", difficulty:3, question:`"${l}" je lik koji odgovara tijelu...`, answers:sh([t,...wr]), correctIndex:-1, _c:t });
  });
  // input - napiši ime lika/tijela
  [["Tijelo koje ima 6 jednakih strana","kocka"],["Lik bez kutova","krug"],["Lik s 3 stranice","trokut"],["Lik s 4 jednake stranice","kvadrat"],["Tijelo u obliku lopte","kugla"],["Tijelo u obliku kutije","kvadar"]].forEach(([desc,ans]) => q.push({ type:"input", difficulty:3, question:desc+"?", correctAnswer:ans }));
  // Broj vrhova
  [["trokut",3],["kvadrat",4],["pravokutnik",4],["krug",0]].forEach(([l,v]) => q.push({ type:"input", difficulty:2, question:`Koliko vrhova ima ${l}?`, correctAnswer:String(v) }));
  // Prepoznaj po opisu
  q.push({ type:"choice", difficulty:3, question:"Imam 4 jednake stranice i 4 kuta. Tko sam?", answers:["Kvadrat","Trokut","Krug","Pravokutnik"], correctIndex:0 });
  q.push({ type:"choice", difficulty:3, question:"Imam 3 stranice i 3 kuta. Tko sam?", answers:["Kvadrat","Trokut","Krug","Pravokutnik"], correctIndex:1 });
  q.push({ type:"choice", difficulty:3, question:"Nemam stranica ni kutova. Tko sam?", answers:["Kvadrat","Trokut","Krug","Pravokutnik"], correctIndex:2 });
  q.push({ type:"choice", difficulty:3, question:"Kotrljam se poput lopte. Tko sam?", answers:["Kocka","Valjak","Kugla","Piramida"], correctIndex:2 });
  q.push({ type:"choice", difficulty:3, question:"Imam šiljasti vrh. Tko sam?", answers:["Kocka","Valjak","Kugla","Piramida"], correctIndex:3 });
  q.push({ type:"choice", difficulty:3, question:"Izgledam kao limenka. Tko sam?", answers:["Kocka","Valjak","Kugla","Piramida"], correctIndex:1 });

  return fix(q).slice(0, 210);
}

// ═══════════════════════════════════════════════════════
// MAT B.1.2 + D.1.1 + A.1.3 + E.1.1
// Nizovi/uzorci, mjerenja, redni brojevi, piktogrami
// ═══════════════════════════════════════════════════════
function genNizovi() {
  const q = [];

  // --- NIZOVI / UZORCI (B.1.2) ---
  // Nastavi niz brojeva
  for (let s=1;s<=10;s++) q.push({ type:"input", difficulty:2, question:`Nastavi niz: ${s}, ${s+1}, ${s+2}, ?`, correctAnswer:String(s+3) });
  // Parnovi
  q.push({ type:"input", difficulty:3, question:"Nastavi niz: 2, 4, 6, 8, ?", correctAnswer:"10" });
  q.push({ type:"input", difficulty:3, question:"Nastavi niz: 1, 3, 5, 7, ?", correctAnswer:"9" });
  q.push({ type:"input", difficulty:3, question:"Nastavi niz: 10, 9, 8, 7, ?", correctAnswer:"6" });
  q.push({ type:"input", difficulty:3, question:"Nastavi niz: 20, 18, 16, 14, ?", correctAnswer:"12" });
  q.push({ type:"input", difficulty:4, question:"Nastavi niz: 1, 2, 4, 7, 11, ?", correctAnswer:"16" });
  q.push({ type:"input", difficulty:4, question:"Nastavi niz: 3, 6, 9, 12, ?", correctAnswer:"15" });
  // Emoji uzorci
  [["🔴🔵🔴🔵🔴","🔵"],["⭐🌙⭐🌙⭐","🌙"],["🍎🍎🍏🍎🍎","🍏"],["🐱🐶🐱🐶🐱","🐶"],["△○□△○","□"],["❤️💙💚❤️💙","💚"],["🌳🌻🌳🌻🌳","🌻"]].forEach(([pattern,next]) => {
    const wrongs = sh(["🔴","🔵","⭐","🌙","🍎","🍏","🐱","🐶"]).filter(x=>x!==next).slice(0,3);
    q.push({ type:"choice", difficulty:2, visual:pattern, question:"Što dolazi sljedeće?", answers:sh([next,...wrongs]), correctIndex:-1, _c:next });
  });
  // Koji ne pripada nizu
  [["2, 4, 6, 7, 8","7"],["1, 3, 5, 6, 7","6"],["10, 8, 6, 5, 4","5"],["5, 10, 15, 17, 20","17"]].forEach(([niz,odd]) => {
    q.push({ type:"choice", difficulty:4, question:`Koji broj NE pripada nizu: ${niz}?`, answers:niz.split(", "), correctIndex:niz.split(", ").indexOf(odd) });
  });

  // --- REDNI BROJEVI (A.1.3) ---
  const redni = ["prvi","drugi","treći","četvrti","peti","šesti","sedmi","osmi","deveti","deseti"];
  for (let i=0;i<10;i++) {
    const r = cfc(i+1,1,12);
    q.push({ type:"choice", difficulty:2, question:`"${redni[i]}" je koji po redu?`, answers:r.answers, correctIndex:r.correctIndex });
  }
  for (let i=0;i<10;i++) {
    const wrongs = sh(redni.filter(x=>x!==redni[i])).slice(0,3);
    q.push({ type:"choice", difficulty:2, question:`Broj ${i+1} po redu je...`, answers:sh([redni[i],...wrongs]), correctIndex:-1, _c:redni[i] });
  }
  // input
  [["1.","prvi"],["2.","drugi"],["3.","treći"],["5.","peti"],["10.","deseti"]].forEach(([n,r]) => q.push({ type:"input", difficulty:3, question:`Napiši riječima: ${n} po redu`, correctAnswer:r }));
  // tko je na kojem mjestu u redu
  const emRow = "🐶🐱🐰🐸🐻🦊🐦🐴🐷🐝";
  const emArr = [...emRow.match(/./gu)]; // svaki emoji
  // simplificiramo - koristimo 5 životinja
  const animals5 = [["🐶","pas"],["🐱","mačka"],["🐰","zec"],["🐸","žaba"],["🐻","medvjed"]];
  const row5 = animals5.map(([e])=>e).join("");
  animals5.forEach(([e,n],i) => {
    q.push({ type:"choice", difficulty:2, visual:row5, question:`${e} je na ___ mjestu.`, answers:redni.slice(0,5), correctIndex:i });
  });
  animals5.forEach(([e,n],i) => {
    const wrongs = sh(animals5.filter(([_,x])=>x!==n)).slice(0,3).map(([_,x])=>x);
    q.push({ type:"choice", difficulty:2, visual:row5, question:`Tko je ${redni[i]}?`, answers:sh([n,...wrongs]), correctIndex:-1, _c:n });
  });

  // --- MJERENJA (D.1.1) ---
  // dulje/kraće
  [["olovka","stol","stol"],["prst","ruka","ruka"],["mačka","mrav","mačka"],["autobus","auto","autobus"],["cipela","čizma","čizma"],["vjeverica","slon","slon"]].forEach(([a,b,longer]) => {
    q.push({ type:"choice", difficulty:1, question:`Što je DULJE?`, answers:[a,b], correctIndex:longer===a?0:1 });
  });
  // teže/lakše
  [["pero","kamen","kamen"],["jabuka","lubenica","lubenica"],["list","knjiga","knjiga"],["balon","lopta","lopta"],["mrav","ptica","ptica"],["olovka","stol","stol"]].forEach(([a,b,heavier]) => {
    q.push({ type:"choice", difficulty:1, question:`Što je TEŽE?`, answers:[a,b], correctIndex:heavier===a?0:1 });
  });
  // više/manje stane
  [["čaša","kanta","kanta"],["žlica","lonac","lonac"],["šalica","bazen","bazen"]].forEach(([a,b,more]) => {
    q.push({ type:"choice", difficulty:2, question:`U što stane VIŠE vode?`, answers:[a,b], correctIndex:more===a?0:1 });
  });
  // čime mjerimo
  [["duljinu","ravnalom"],["težinu","vagom"],["temperaturu","termometrom"],["vrijeme","satom"]].forEach(([what,tool]) => {
    const wrongs = sh(["ravnalom","vagom","termometrom","satom","kalkulatorom"]).filter(x=>x!==tool).slice(0,3);
    q.push({ type:"choice", difficulty:3, question:`Čime mjerimo ${what}?`, answers:sh([tool,...wrongs]), correctIndex:-1, _c:tool });
  });

  // --- PIKTOGRAMI (E.1.1) ---
  // čitanje jednostavne tablice
  q.push({ type:"choice", difficulty:3, visual:"🍎🍎🍎🍎🍎\n🍊🍊🍊\n🍌🍌🍌🍌", question:"Kojeg voća ima NAJVIŠE?", answers:["🍎 jabuke","🍊 naranče","🍌 banane"], correctIndex:0 });
  q.push({ type:"choice", difficulty:3, visual:"🍎🍎🍎🍎🍎\n🍊🍊🍊\n🍌🍌🍌🍌", question:"Kojeg voća ima NAJMANJE?", answers:["🍎 jabuke","🍊 naranče","🍌 banane"], correctIndex:1 });
  q.push({ type:"input", difficulty:3, visual:"🍎🍎🍎🍎🍎\n🍊🍊🍊\n🍌🍌🍌🍌", question:"Koliko jabuka ima?", correctAnswer:"5" });
  q.push({ type:"input", difficulty:3, visual:"🍎🍎🍎🍎🍎\n🍊🍊🍊\n🍌🍌🍌🍌", question:"Koliko naranči ima?", correctAnswer:"3" });
  q.push({ type:"input", difficulty:4, visual:"🍎🍎🍎🍎🍎\n🍊🍊🍊\n🍌🍌🍌🍌", question:"Koliko voća ima UKUPNO?", correctAnswer:"12" });
  q.push({ type:"input", difficulty:4, visual:"🍎🍎🍎🍎🍎\n🍊🍊🍊\n🍌🍌🍌🍌", question:"Koliko jabuka ima VIŠE od naranči?", correctAnswer:"2" });

  // drugi piktogram
  q.push({ type:"choice", difficulty:3, visual:"⚽⚽⚽⚽\n🏀🏀🏀🏀🏀🏀\n🎾🎾", question:"Koje lopte ima NAJVIŠE?", answers:["⚽ nogometne","🏀 košarkaške","🎾 teniske"], correctIndex:1 });
  q.push({ type:"input", difficulty:3, visual:"⚽⚽⚽⚽\n🏀🏀🏀🏀🏀🏀\n🎾🎾", question:"Koliko košarkaških lopti ima?", correctAnswer:"6" });
  q.push({ type:"input", difficulty:4, visual:"⚽⚽⚽⚽\n🏀🏀🏀🏀🏀🏀\n🎾🎾", question:"Koliko lopti ima UKUPNO?", correctAnswer:"12" });

  // T/N
  [["Redni broj za 3. je 'treći'.",true],["'Peti' znači broj 6.",false],["Ravnalom mjerimo duljinu.",true],["Vagom mjerimo temperaturu.",false],["U nizu 2,4,6,8 slijedi 10.",true],["U nizu 1,3,5,7 slijedi 8.",false]].forEach(([s,c]) => q.push({ type:"choice", difficulty:2, question:s, answers:["Točno","Netočno"], correctIndex:c?0:1 }));

  // --- DODATNE VARIJACIJE ---
  // Nizovi po 2, 3, 5
  q.push({ type:"input", difficulty:3, question:"Nastavi niz: 5, 10, 15, 20, ?", correctAnswer:"25" });
  q.push({ type:"input", difficulty:4, question:"Nastavi niz: 2, 5, 8, 11, ?", correctAnswer:"14" });
  q.push({ type:"input", difficulty:4, question:"Nastavi niz: 20, 17, 14, 11, ?", correctAnswer:"8" });
  q.push({ type:"input", difficulty:3, question:"Nastavi niz: 0, 2, 4, 6, ?", correctAnswer:"8" });
  q.push({ type:"input", difficulty:3, question:"Nastavi niz: 19, 17, 15, 13, ?", correctAnswer:"11" });
  // Koji broj fali
  q.push({ type:"input", difficulty:3, question:"Koji broj fali? 1, 2, ?, 4, 5", correctAnswer:"3" });
  q.push({ type:"input", difficulty:3, question:"Koji broj fali? 5, ?, 15, 20", correctAnswer:"10" });
  q.push({ type:"input", difficulty:3, question:"Koji broj fali? 2, 4, ?, 8, 10", correctAnswer:"6" });
  q.push({ type:"input", difficulty:3, question:"Koji broj fali? 10, 8, ?, 4, 2", correctAnswer:"6" });

  // Više emoji uzoraka
  [["🟢🔴🟢🔴🟢","🔴"],["🌞🌧️🌞🌧️🌞","🌧️"],["🎈🎈🎁🎈🎈","🎁"],["🐸🐸🐝🐸🐸","🐝"]].forEach(([p,next]) => {
    q.push({ type:"input", difficulty:2, visual:p, question:"Što dolazi sljedeće? Napiši emoji.", correctAnswer:next });
  });

  // Više mjerenja
  [["most","put do škole","most"],["prst","noga","noga"],["ručnik","deka","deka"],["čaša","kantica","kantica"]].forEach(([a,b,longer]) => {
    q.push({ type:"choice", difficulty:2, question:`Što je DULJE: ${a} ili ${b}?`, answers:[a,b], correctIndex:longer===a?0:1 });
  });
  [["ptica","konj","konj"],["dijete","auto","auto"],["šalica","kanta","kanta"],["mačka","slon","slon"]].forEach(([a,b,heavier]) => {
    q.push({ type:"choice", difficulty:2, question:`Što je TEŽE: ${a} ili ${b}?`, answers:[a,b], correctIndex:heavier===a?0:1 });
  });

  // Treći piktogram
  q.push({ type:"choice", difficulty:3, visual:"🌳🌳🌳🌳🌳🌳🌳\n🌻🌻🌻🌻🌻\n🌹🌹🌹", question:"Čega ima NAJVIŠE?", answers:["🌳 stabala","🌻 suncokreta","🌹 ruža"], correctIndex:0 });
  q.push({ type:"input", difficulty:3, visual:"🌳🌳🌳🌳🌳🌳🌳\n🌻🌻🌻🌻🌻\n🌹🌹🌹", question:"Koliko stabala ima?", correctAnswer:"7" });
  q.push({ type:"input", difficulty:4, visual:"🌳🌳🌳🌳🌳🌳🌳\n🌻🌻🌻🌻🌻\n🌹🌹🌹", question:"Koliko biljaka ima UKUPNO?", correctAnswer:"15" });
  q.push({ type:"input", difficulty:4, visual:"🌳🌳🌳🌳🌳🌳🌳\n🌻🌻🌻🌻🌻\n🌹🌹🌹", question:"Koliko stabala ima VIŠE od ruža?", correctAnswer:"4" });

  // Koliki sat
  q.push({ type:"choice", difficulty:3, question:"🕐 Koliko je sati?", answers:["1","2","3","12"], correctIndex:0 });
  q.push({ type:"choice", difficulty:3, question:"🕕 Koliko je sati?", answers:["3","6","9","12"], correctIndex:1 });
  q.push({ type:"choice", difficulty:3, question:"🕘 Koliko je sati?", answers:["3","6","9","12"], correctIndex:2 });
  q.push({ type:"choice", difficulty:3, question:"🕛 Koliko je sati?", answers:["3","6","9","12"], correctIndex:3 });

  return fix(q).slice(0, 210);
}
