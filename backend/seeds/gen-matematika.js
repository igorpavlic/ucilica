// gen-matematika.js — R1 Math generators (ENGINE-powered)
const{N,IF,IM,sh,cfc,rep,fix,EL,CIRCLE}=require("./gen-hrvatski");
const{mathCombi,storyProb,smartChoice,smartDistAdd,smartDistSub,pick,pickN,wf,randInt,PLACES}=require("./gen-engine");

function genBrojevi(){const q=[];
// Emoji prebrojavanja — 10 emoji × 10 brojeva = 100 pitanja
for(let n=1;n<=10;n++)EL.forEach(e=>q.push({type:"input",difficulty:1,visual:rep(e,n),question:"Prebroji koliko ih ima:",correctAnswer:String(n)}));
// Sljedbenik 0-19
for(let i=0;i<=19;i++)q.push({type:"input",difficulty:i<10?1:2,question:`Koji broj dolazi NAKON ${i}?`,correctAnswer:String(i+1)});
// Prethodnik 1-20
for(let i=1;i<=20;i++)q.push({type:"input",difficulty:i<=10?1:2,question:`Koji broj dolazi PRIJE ${i}?`,correctAnswer:String(i-1)});
// Najveći/najmanji
[[3,7,1,9],[12,5,8,15],[2,11,6,4],[17,13,19,10],[20,14,16,18],[1,3,5,7],[2,4,6,8],[10,20,15,5],[11,9,13,7],[6,12,3,18]].forEach(s=>{q.push({type:"choice",difficulty:2,question:`NAJVEĆI: ${s.join(", ")}?`,answers:s.map(String),correctIndex:s.indexOf(Math.max(...s))});q.push({type:"choice",difficulty:2,question:`NAJMANJI: ${s.join(", ")}?`,answers:s.map(String),correctIndex:s.indexOf(Math.min(...s))})});
// Nedostaje u nizu
for(let s=1;s<=15;s++)q.push({type:"input",difficulty:3,question:`Nedostaje: ${s}, ?, ${s+2}, ${s+3}`,correctAnswer:String(s+1)});
// Paran/neparan
for(let i=1;i<=20;i++)q.push({type:"choice",difficulty:3,question:`Je li ${i} paran ili neparan?`,answers:["paran","neparan"],correctIndex:i%2===0?0:1});
// Broj između
for(let i=1;i<=18;i++){const r=cfc(i+1,1,20);q.push({type:"choice",difficulty:2,question:`Broj između ${i} i ${i+2}?`,answers:r.answers,correctIndex:r.correctIndex})}
return fix(q).slice(0,210)}

function genZbrajanje(){const q=[];
// 1) Kombinatoričko a+b<=10 sa smart distraktorima
q.push(...mathCombi("+",{a:[0,10,1],b:[0,10,1]},(a,b,r)=>r<=10&&(a>0||b>0),80));
// 2) Emoji zbrajanje
for(let a=1;a<=5;a++)for(let b=1;b<=5;b++){if(a+b>10)continue;const e1=EL[(a+b)%EL.length],e2=EL[(a+b+1)%EL.length];const r=cfc(a+b,1,12);q.push({type:"choice",difficulty:1,visual:`${rep(e1,a)} + ${rep(e2,b)}`,question:"Koliko je ukupno?",answers:r.answers,correctIndex:r.correctIndex})}
// 3) +0
for(let a=1;a<=10;a++)q.push({type:"input",difficulty:1,question:`${a} + 0 = ?`,correctAnswer:String(a)});
// 4) Nepoznata
for(let a=1;a<=5;a++)for(let b=1;b<=5;b++){if(a+b>10)continue;q.push({type:"input",difficulty:4,question:`${a} + ? = ${a+b}`,correctAnswer:String(b)})}
// 5) Tekstualni sa 10 šablona
q.push(...storyProb("+",{a:[1,6],b:[1,5]},25));
return fix(q).slice(0,210)}

function genOduzimanje(){const q=[];
// 1) Kombinatoričko a-b, a<=10
q.push(...mathCombi("-",{a:[1,10,1],b:[0,10,1]},(a,b,r)=>b<=a,80));
// 2) Emoji oduzimanje
for(let t=3;t<=10;t++){const m=((t-1)%(t-1))+1;const e=EL[t%EL.length];q.push({type:"input",difficulty:2,visual:`${rep(e,t)} − ${rep(e,m)}`,question:"Koliko ostane?",correctAnswer:String(t-m)})}
// 3) Oduzmi od 10
for(let b=0;b<=10;b++)q.push({type:"input",difficulty:2,question:`10 - ${b} = ?`,correctAnswer:String(10-b)});
// 4) Nepoznata
for(let a=3;a<=10;a++)for(let b=1;b<a&&b<=5;b++)q.push({type:"input",difficulty:4,question:`${a} - ? = ${a-b}`,correctAnswer:String(b)});
// 5) Tekstualni
q.push(...storyProb("-",{a:[3,10],b:[1,5]},25));
return fix(q).slice(0,210)}

function genUsporedbe(){const q=[];
// Kombinatoričko uspoređivanje do 10
for(let a=1;a<=10;a++)for(let b=1;b<=10;b++){const s=a<b?"<":a>b?">":"=";q.push({type:"choice",difficulty:a<=5&&b<=5?1:2,question:`${a}  ${CIRCLE}  ${b}`,answers:["<",">","="],correctIndex:s==="<"?0:s===">"?1:2})}
// do 20
for(let a=11;a<=20;a+=2)for(let b=10;b<=20;b+=3){const s=a<b?"<":a>b?">":"=";q.push({type:"choice",difficulty:3,question:`${a}  ${CIRCLE}  ${b}`,answers:["<",">","="],correctIndex:s==="<"?0:s===">"?1:2})}
// Emoji
for(let a=1;a<=6;a++)for(let b=1;b<=6;b++){if(a===b&&a>2)continue;const e=EL[(a+b)%EL.length];const s=a<b?"<":a>b?">":"=";q.push({type:"choice",difficulty:2,question:`${rep(e,a)}  ${CIRCLE}  ${rep(e,b)}`,answers:["<",">","="],correctIndex:s==="<"?0:s===">"?1:2})}
// Izraz vs izraz
[["3+2","4+1"],["7-1","3+3"],["5+2","10-3"],["4+4","9-1"],["2+3","8-3"],["6-2","1+3"],["5+1","4+2"],["8-5","1+2"],["7-4","2+1"],["9-3","3+3"],["10-5","2+3"],["6+1","10-3"],["4+3","5+2"],["8-2","3+3"],["9-4","2+3"],["1+7","10-2"],["5+4","10-1"],["3+6","4+5"],["7-2","1+4"],["8-1","6+1"]].forEach(([e1,e2])=>{const v1=Function(`return ${e1}`)(),v2=Function(`return ${e2}`)();const s=v1<v2?"<":v1>v2?">":"=";q.push({type:"choice",difficulty:4,question:`${e1}  ${CIRCLE}  ${e2}`,answers:["<",">","="],correctIndex:s==="<"?0:s===">"?1:2})});
// Značenje znakova
q.push({type:"choice",difficulty:1,question:'Što znači "<"?',answers:["manje od","veće od","jednako","plus"],correctIndex:0});
q.push({type:"choice",difficulty:1,question:'Što znači ">"?',answers:["manje od","veće od","jednako","minus"],correctIndex:1});
q.push({type:"choice",difficulty:1,question:'Što znači "="?',answers:["manje od","veće od","jednako","puta"],correctIndex:2});
// Situacijske
for(let i=0;i<25;i++){const a=(i%8)+1,b=((i*3+1)%8)+1;const n1=N(),n2=N(),item=IF();let cIdx;if(a>b)cIdx=0;else if(a<b)cIdx=1;else cIdx=2;q.push({type:"choice",difficulty:i<10?3:5,question:`${n1} ima ${a} ${item}, ${n2} ima ${b}. Tko ima više?`,answers:[n1,n2,"isti broj"],correctIndex:cIdx})}
return fix(q).slice(0,210)}

function genGeometrija(){const q=[];
const tijela=[["kugla","⚽","lopta, jabuka, globus"],["valjak","🥫","limenka, svijeća, čaša"],["kocka","🎲","kocka za igru, šećer kocka"],["kvadar","📦","kutija, cigla, ormar"],["stožac","🎄","sladoled kornet, šešir čarobnjaka"],["piramida","🔺","egipatska piramida"]];
tijela.forEach(([t,e,_])=>{const wr=sh(tijela.filter(([x])=>x!==t)).slice(0,3).map(([x])=>x);q.push({type:"choice",difficulty:1,visual:e,question:"Koje geometrijsko tijelo vidiš?",answers:sh([t,...wr]),correctIndex:-1,_c:t})});
tijela.forEach(([t,e,primjeri])=>{q.push({type:"choice",difficulty:2,question:`Koji predmet ima oblik ${t.endsWith("a")?t.slice(0,-1)+"e":t+"a"}?`,answers:sh([primjeri.split(", ")[0],...sh(tijela.filter(([x])=>x!==t)).slice(0,3).map(([_,__,p])=>p.split(", ")[0])]),correctIndex:-1,_c:primjeri.split(", ")[0]})});
const likovi=[["krug","nema stranica ni kutova"],["trokut","3 stranice, 3 kuta"],["kvadrat","4 jednake stranice, 4 prava kuta"],["pravokutnik","4 stranice (2 para jednakih), 4 prava kuta"]];
likovi.forEach(([l,opis])=>{const wr=sh(likovi.filter(([x])=>x!==l)).slice(0,3).map(([x])=>x);q.push({type:"choice",difficulty:2,question:`${opis} — koji lik?`,answers:sh([l,...wr]),correctIndex:-1,_c:l});q.push({type:"choice",difficulty:2,question:`Koliko stranica ima ${l}?`,answers:sh(["0","3","4","5"]),correctIndex:-1,_c:l==="krug"?"0":l==="trokut"?"3":"4"})});
// Predmeti → oblik
[["lopta","kugla"],["knjiga","kvadar"],["kapa od rođendana","stožac"],["kocka za igru","kocka"],["limenka","valjak"],["piramida u Egiptu","piramida"],["globus","kugla"],["kutija cipela","kvadar"],["sladoled kornet","stožac"],["cigla","kvadar"],["novčić","krug"],["sat","krug"],["prozor","pravokutnik"],["krov kuće","trokut"],["pizza","krug"],["bilježnica","pravokutnik"]].forEach(([obj,oblik])=>{const wr=wf(["kugla","valjak","kocka","kvadar","stožac","piramida","krug","trokut","kvadrat","pravokutnik"],oblik);q.push({type:"choice",difficulty:2,question:`"${obj}" ima oblik:`,answers:sh([oblik,...wr]),correctIndex:-1,_c:oblik})});
// Prostorni odnosi
[["Što je GORE?","krov"],["Što je DOLJE?","pod"],["Što je ISPRED kuće?","dvorište"],["Što je IZA kuće?","vrt"],["Što je LIJEVO od vrata?","prozor"],["Što je UNUTRA?","namještaj"]].forEach(([pit,odg])=>{q.push({type:"choice",difficulty:1,question:pit,answers:sh([odg,...wf(["krov","pod","dvorište","vrt","prozor","namještaj","stol","zid"],odg)]),correctIndex:-1,_c:odg})});
return fix(q).slice(0,210)}

function genNizovi(){const q=[];
// Nastavi niz +1
for(let s=1;s<=15;s++)q.push({type:"input",difficulty:1,question:`Nastavi: ${s}, ${s+1}, ${s+2}, ?`,correctAnswer:String(s+3)});
// Nastavi niz +2
for(let s=1;s<=10;s++)q.push({type:"input",difficulty:2,question:`Nastavi: ${s}, ${s+2}, ${s+4}, ?`,correctAnswer:String(s+6)});
// Nastavi -1
for(let s=20;s>=8;s-=3)q.push({type:"input",difficulty:2,question:`Nastavi: ${s}, ${s-1}, ${s-2}, ?`,correctAnswer:String(s-3)});
// Nastavi -2
for(let s=20;s>=10;s-=4)q.push({type:"input",difficulty:3,question:`Nastavi: ${s}, ${s-2}, ${s-4}, ?`,correctAnswer:String(s-6)});
// Emoji uzorci
[["🔴🔵","🔴🔵🔴","🔵"],["⭐🌙","⭐🌙⭐","🌙"],["🐱🐶🐱","🐶🐱🐶","🐱"],["🍎🍏🍎","🍏🍎🍏","🍎"]].forEach(([uzorak,niz,sljedeci])=>{q.push({type:"choice",difficulty:2,visual:niz,question:"Što dolazi sljedeće?",answers:sh([sljedeci,"🔴","⭐","🐱","🍎"].filter((v,i,a)=>a.indexOf(v)===i)).slice(0,4),correctIndex:-1,_c:sljedeci})});
// Mjerenja — duljina
q.push({type:"choice",difficulty:2,question:"Čime mjerimo duljinu?",answers:["ravnalom","vagom","satom","termometrom"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Čime mjerimo težinu?",answers:["ravnalom","vagom","satom","termometrom"],correctIndex:1});
q.push({type:"choice",difficulty:2,question:"Čime mjerimo vrijeme?",answers:["ravnalom","vagom","satom","termometrom"],correctIndex:2});
// Dulje/kraće
[["olovka ili stol","stol"],["prst ili ruka","ruka"],["mrav ili pas","pas"],["knjiga ili bilježnica","knjiga"]].forEach(([pit,odg])=>{q.push({type:"choice",difficulty:1,question:`Što je DULJE: ${pit}?`,answers:pit.split(" ili "),correctIndex:pit.split(" ili ").indexOf(odg)})});
[["slon ili mačka","slon"],["autobus ili bicikl","autobus"],["kuća ili kutija","kuća"]].forEach(([pit,odg])=>{q.push({type:"choice",difficulty:1,question:`Što je VEĆE: ${pit}?`,answers:pit.split(" ili "),correctIndex:pit.split(" ili ").indexOf(odg)})});
return fix(q).slice(0,210)}

module.exports={genBrojevi,genZbrajanje,genOduzimanje,genUsporedbe,genGeometrija,genNizovi};
