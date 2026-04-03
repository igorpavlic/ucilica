/**
 * seed-r2.js — Učilica 2. razred — OBOGAĆENI generatori
 * 200+ pitanja/tema, kombinatorika, template rotation, multi-format
 */
require("dotenv").config({path:require("path").join(__dirname,"../.env")});
const{MongoClient}=require("mongodb");
const{N,IF,IM,sh,cfc,rep,fix,EL,CIRCLE}=require("./gen-hrvatski");
const GRADE=2;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const pickN=(a,n)=>sh([...a]).slice(0,n);
const wf=(pool,c,n=3)=>sh(pool.filter(x=>x!==c)).slice(0,n);

const subjects=[
{name:"Hrvatski jezik",slug:"hrvatski",icon:"📖",color:"#FF6B6B",description:"Imenice, glagoli, rečenice, čitanje",order:1},
{name:"Matematika",slug:"matematika",icon:"🔢",color:"#60A5FA",description:"Brojevi do 100, zbrajanje, oduzimanje, množenje",order:2},
{name:"Priroda i društvo",slug:"priroda",icon:"🌿",color:"#34D399",description:"Zavičaj, vode, tlo, biljke, životinje",order:3}];
const topicsDef={
hrvatski:[{name:"Imenice i rod",slug:"imenice-rod",icon:"📝",order:1},{name:"Glagoli",slug:"glagoli-2",icon:"🏃",order:2},{name:"Rečenice i interpunkcija",slug:"recenice-2",icon:"💬",order:3},{name:"Čitanje i razumijevanje",slug:"citanje-2",icon:"📚",order:4}],
matematika:[{name:"Brojevi do 100",slug:"brojevi-100",icon:"🔢",order:1},{name:"Zbrajanje do 100",slug:"zbrajanje-100",icon:"➕",order:2},{name:"Oduzimanje do 100",slug:"oduzimanje-100",icon:"➖",order:3},{name:"Množenje i dijeljenje",slug:"mnozenje-dijeljenje",icon:"✖️",order:4},{name:"Geometrija 2",slug:"geometrija-2",icon:"📐",order:5},{name:"Mjerenje i novac",slug:"mjerenje-novac",icon:"💰",order:6}],
priroda:[{name:"Zavičaj i snalaženje",slug:"zavicaj",icon:"🗺️",order:1},{name:"Godišnja doba i vrijeme",slug:"doba-vrijeme",icon:"🌦️",order:2},{name:"Biljke i životinje",slug:"biljke-zivotinje",icon:"🌱",order:3},{name:"Voda i tlo",slug:"voda-tlo",icon:"💧",order:4},{name:"Zdravlje i sigurnost",slug:"zdravlje-sigurnost-2",icon:"🏥",order:5}]};

// ═══ HRVATSKI ═══
function genImeniceRod(){const q=[];
const M=["stol","pas","grad","brat","auto","vlak","sat","konj","zec","lav","medvjed","otac","dječak","učenik","prozor","ključ","most","put","kamen","snijeg","vjetar","oblak","film","dar","krov","pod","zid","cvijet","ormar","ručak","kolač","pauk","leptir","zmaj","brod","avion","balon","nož","orah","prst"];
const Z=["kuća","škola","mama","sestra","knjiga","olovka","ruka","noga","voda","jabuka","mačka","učiteljica","ulica","zemlja","rijeka","šuma","zvijezda","stolica","bilježnica","torba","košulja","čokolada","lopta","kruška","naranča","banana","malina","jagoda","livada","planina","obala","bolnica","igračka","kuhinja","soba","žlica","četka","cipela","biljka","trava"];
const S=["dijete","sunce","more","selo","drvo","jaje","mlijeko","pismo","nebo","polje","jezero","proljeće","ljeto","uho","oko","srce","zlato","srebro","brdo","pero","staklo","ogledalo","dvorište","cvijeće","lišće","voće","povrće","jelo","piće","odijelo","tijesto","blago","pluće","rame","ime"];
const rodQ=["Koji je rod imenice","Rod imenice","Imenica je roda:"];
M.forEach(w=>q.push({type:"choice",difficulty:1,question:`${pick(rodQ)} "${w}"?`,answers:["muški","ženski","srednji"],correctIndex:0}));
Z.forEach(w=>q.push({type:"choice",difficulty:1,question:`${pick(rodQ)} "${w}"?`,answers:["muški","ženski","srednji"],correctIndex:1}));
S.forEach(w=>q.push({type:"choice",difficulty:1,question:`${pick(rodQ)} "${w}"?`,answers:["muški","ženski","srednji"],correctIndex:2}));
pickN(M,12).forEach(w=>q.push({type:"input",difficulty:2,question:`Napiši rod: "${w}"`,correctAnswer:"muški"}));
pickN(Z,12).forEach(w=>q.push({type:"input",difficulty:2,question:`Napiši rod: "${w}"`,correctAnswer:"ženski"}));
pickN(S,12).forEach(w=>q.push({type:"input",difficulty:2,question:`Napiši rod: "${w}"`,correctAnswer:"srednji"}));
for(let i=0;i<15;i++){const o=pick(Z),r=pickN(M,3);q.push({type:"choice",difficulty:3,question:"Koja NIJE muškog roda?",answers:sh([o,...r]),correctIndex:-1,_c:o})}
for(let i=0;i<15;i++){const o=pick(M),r=pickN(Z,3);q.push({type:"choice",difficulty:3,question:"Koja NIJE ženskog roda?",answers:sh([o,...r]),correctIndex:-1,_c:o})}
for(let i=0;i<10;i++){const o=pick(S),r=pickN(M,3);q.push({type:"choice",difficulty:3,question:"Koja JE srednjeg roda?",answers:sh([o,...r]),correctIndex:-1,_c:o})}
const jm=[["pas","psi"],["mačka","mačke"],["knjiga","knjige"],["stol","stolovi"],["drvo","drva"],["dijete","djeca"],["grad","gradovi"],["rijeka","rijeke"],["selo","sela"],["brat","braća"],["sestra","sestre"],["jabuka","jabuke"],["cvijet","cvjetovi"],["ptica","ptice"],["list","listovi"],["prozor","prozori"],["ulica","ulice"],["zvijezda","zvijezde"],["most","mostovi"],["oblak","oblaci"],["cipela","cipele"],["kolač","kolači"],["lopta","lopte"],["olovka","olovke"],["bilježnica","bilježnice"],["prijatelj","prijatelji"],["učenik","učenici"],["kamen","kameni"]];
jm.forEach(([j,mn])=>{q.push({type:"input",difficulty:2,question:`Množina od "${j}":`,correctAnswer:mn});q.push({type:"input",difficulty:2,question:`Jednina od "${mn}":`,correctAnswer:j});q.push({type:"choice",difficulty:2,question:`Množina od "${j}"?`,answers:sh([mn,...wf(jm.map(x=>x[1]),mn)]),correctIndex:-1,_c:mn})});
const vl=["Zagreb","Rijeka","Split","Osijek","Sava","Drava","Dunav","Ana","Marko","Luka","Petra","Hrvatska","Europa","Dinamo","Jadransko"];
const op=["grad","rijeka","djevojčica","dječak","država","kontinent","klub","more","planina","škola","auto","pas","učiteljica","ulica","knjiga"];
vl.forEach(w=>q.push({type:"choice",difficulty:2,question:`"${w}" — vlastita ili opća?`,answers:["vlastita","opća"],correctIndex:0}));
op.forEach(w=>q.push({type:"choice",difficulty:2,question:`"${w}" — vlastita ili opća?`,answers:["vlastita","opća"],correctIndex:1}));
[["ana","Ana"],["zagreb","Zagreb"],["sava","Sava"],["marko","Marko"],["hrvatska","Hrvatska"],["rijeka","Rijeka"],["split","Split"],["europa","Europa"],["drava","Drava"],["luka","Luka"]].forEach(([w,c])=>{q.push({type:"choice",difficulty:2,question:`Ispravan zapis?`,answers:[w,c],correctIndex:1});q.push({type:"input",difficulty:3,question:`Ispravi: "${w}" →`,correctAnswer:c})});
q.push({type:"choice",difficulty:1,question:"Imenica je riječ za:?",answers:["biće, stvar, pojavu","radnju","opis","broj"],correctIndex:0});
q.push({type:"choice",difficulty:1,question:"Koliko rodova ima hrvatski?",answers:["2","3","4","5"],correctIndex:1});
q.push({type:"choice",difficulty:2,question:"Vlastita imenica se piše:?",answers:["velikim slovom","malim slovom","samo velikim","bez slova"],correctIndex:0});
return fix(q).slice(0,210)}

function genGlagoli2(){const q=[];
const gl=["trčati","pjevati","čitati","pisati","skakati","plivati","jesti","piti","spavati","crtati","učiti","igrati","sjediti","stajati","plesati","gledati","slušati","hodati","letjeti","padati","kuhati","prati","šetati","voziti","graditi","kupiti","prodati","misliti","sanjati","raditi"];
const im=["kuća","škola","stol","pas","sunce","knjiga","lopta","auto","drvo","brod"];
const pr=["lijep","velik","mali","brz","crven","hladan","topao","dobar","loš","tih"];
for(let i=0;i<35;i++){const g=gl[i%gl.length],wr=[pick(im),pick(pr),pick(im)];q.push({type:"choice",difficulty:1,question:"Koja riječ je glagol?",answers:sh([g,...wr]),correctIndex:-1,_c:g})}
for(let i=0;i<20;i++){const n=pick(im),wr=pickN(gl,3);q.push({type:"choice",difficulty:2,question:"Koja NIJE glagol?",answers:sh([n,...wr]),correctIndex:-1,_c:n})}
const tsr=[["Pas","laje"],["Mačka","mjauče"],["Ptica","pjeva"],["Riba","pliva"],["Dijete","igra se"],["Učiteljica","poučava"],["Kuhar","kuha"],["Liječnik","liječi"],["Vatrogasac","gasi vatru"],["Pjevač","pjeva"],["Pilot","leti"],["Vozač","vozi"],["Slikar","slika"],["Pisac","piše"],["Pekar","peče kruh"],["Frizer","šiša"],["Policajac","čuva red"],["Poštarica","nosi pisma"],["Vrtlar","sadi cvijeće"],["Farmer","uzgaja životinje"],["Footballer","igra nogomet"],["Stolar","radi s drvetom"]];
const sr=tsr.map(x=>x[1]),st=tsr.map(x=>x[0]);
tsr.forEach(([t,s])=>{q.push({type:"choice",difficulty:2,question:`Što radi ${t.toLowerCase()}?`,answers:sh([s,...wf(sr,s)]),correctIndex:-1,_c:s});q.push({type:"choice",difficulty:3,question:`Tko "${s}"?`,answers:sh([t,...wf(st,t)]),correctIndex:-1,_c:t})});
const recGl=[["Ana čita knjigu.","čita"],["Pas trči po parku.","trči"],["Mama kuha ručak.","kuha"],["Sunce sija.","sija"],["Djeca se igraju.","igraju"],["Ptica leti visoko.","leti"],["Tata popravlja auto.","popravlja"],["Baka plete šal.","plete"],["Kiša pada.","pada"],["Vjetar puše.","puše"],["Luka crta sliku.","crta"],["Učiteljica piše.","piše"],["Marko pjeva.","pjeva"],["Riba pliva u moru.","pliva"]];
const sviGl=recGl.map(x=>x[1]);
recGl.forEach(([r,g])=>{q.push({type:"choice",difficulty:3,question:`Glagol u: "${r}"?`,answers:sh([g,...wf(sviGl,g)]),correctIndex:-1,_c:g});q.push({type:"input",difficulty:3,question:`Pronađi glagol: "${r}"`,correctAnswer:g})});
[["Pas ___ po parku.","trči"],["Mama ___ ručak.","kuha"],["Ptica ___ na grani.","pjeva"],["Riba ___ u moru.","pliva"],["Sunce ___ na nebu.","sija"],["Kiša ___.","pada"],["Djeca se ___.","igraju"],["Mačka ___ na kauču.","spava"],["Baka ___ kolače.","peče"],["Tata ___ novine.","čita"]].forEach(([r,g])=>{q.push({type:"choice",difficulty:2,question:`Dopuni: "${r}"`,answers:sh([g,...wf(["trči","kuha","pjeva","pliva","sija","pada","igraju","spava","peče","čita","leti","skače"],g)]),correctIndex:-1,_c:g})});
q.push({type:"choice",difficulty:1,question:"Glagol je riječ za:?",answers:["radnju","biće","opis","grad"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Koliko glagola: 'Ana čita i piše.'?",answers:["0","1","2","3"],correctIndex:2});
return fix(q).slice(0,210)}

function genRecenice2(){const q=[];
const izj=["Pada kiša.","Sunce sija.","Mama kuha ručak.","Ana ide u školu.","Pas trči po parku.","Djeca se igraju.","Tata čita novine.","Baka peče kolače.","Ptica pjeva.","Danas je lijep dan.","Marko voli čokoladu.","Riba pliva u moru.","Luka crta sliku.","Učiteljica piše na ploči.","Zima je hladna.","Na stolu je knjiga.","U vrtu rastu ruže.","Moj brat je u školi."];
const upi=["Pada li kiša?","Ideš li u školu?","Koliko je sati?","Voliš li čokoladu?","Kako se zoveš?","Gdje živiš?","Što radiš?","Tko je to?","Zašto plačeš?","Kad ćeš doći?","Imaš li brata?","Je li to tvoje?","Koliko imaš godina?","Čiji je to pas?","Jesi li gladan?"];
const usk=["Kakva ljepota!","Bravo!","Jao!","Super!","Pomozite!","Požar!","Pazi!","Stani!","Hurra!","Kakav gol!","Tiše!","Dosta!","Brže!","Odlično!","Čestitam!"];
izj.forEach(r=>q.push({type:"choice",difficulty:2,question:`"${r}" je:`,answers:["izjavna","upitna","usklična"],correctIndex:0}));
upi.forEach(r=>q.push({type:"choice",difficulty:2,question:`"${r}" je:`,answers:["izjavna","upitna","usklična"],correctIndex:1}));
usk.forEach(r=>q.push({type:"choice",difficulty:2,question:`"${r}" je:`,answers:["izjavna","upitna","usklična"],correctIndex:2}));
izj.slice(0,12).forEach(r=>{q.push({type:"choice",difficulty:2,question:`Znak: "${r.slice(0,-1)}"`,answers:[".","?","!"],correctIndex:0})});
upi.slice(0,12).forEach(r=>{q.push({type:"choice",difficulty:2,question:`Znak: "${r.slice(0,-1)}"`,answers:[".","?","!"],correctIndex:1})});
usk.slice(0,12).forEach(r=>{q.push({type:"choice",difficulty:2,question:`Znak: "${r.slice(0,-1)}"`,answers:[".","?","!"],correctIndex:2})});
pickN(izj,6).forEach(r=>q.push({type:"input",difficulty:3,question:`Vrsta: "${r}"`,correctAnswer:"izjavna"}));
pickN(upi,6).forEach(r=>q.push({type:"input",difficulty:3,question:`Vrsta: "${r}"`,correctAnswer:"upitna"}));
pickN(usk,6).forEach(r=>q.push({type:"input",difficulty:3,question:`Vrsta: "${r}"`,correctAnswer:"usklična"}));
[["ana ide u školu.","Ana ide u školu."],["zagreb je lijep.","Zagreb je lijep."],["sava je rijeka.","Sava je rijeka."],["marko voli nogomet.","Marko voli nogomet."],["pada kiša.","Pada kiša."],["mama kuha.","Mama kuha."],["živim u rijeci.","Živim u Rijeci."],["idem u školu.","Idem u školu."],["moj pas se zove rex.","Moj pas se zove Rex."],["danas je utorak.","Danas je utorak."]].forEach(([w,c])=>q.push({type:"choice",difficulty:1,question:"Ispravno?",answers:[w,c],correctIndex:1}));
[["Pas laje.",2],["Mama kuha ručak.",3],["Ana i Luka idu u školu.",6],["Pada kiša.",2],["Sunce sija na nebu.",4],["Djeca se igraju.",3],["Moj brat voli čokoladu.",4],["Danas je lijep dan.",4],["Ptica pjeva na grani.",4],["Tata čita novine.",3]].forEach(([r,c])=>{const rc=cfc(c,1,8);q.push({type:"choice",difficulty:3,question:`Koliko riječi: "${r}"?`,answers:rc.answers,correctIndex:rc.correctIndex});q.push({type:"input",difficulty:3,question:`Prebroji: "${r}"`,correctAnswer:String(c)})});
q.push({type:"choice",difficulty:1,question:"Izjavna završava:?",answers:["točkom","upitnikom","uskličnikom","zarezom"],correctIndex:0});
q.push({type:"choice",difficulty:1,question:"Upitna završava:?",answers:["točkom","upitnikom","uskličnikom","zarezom"],correctIndex:1});
q.push({type:"choice",difficulty:1,question:"Rečenica počinje:?",answers:["velikim slovom","malim","brojem","znakom"],correctIndex:0});
return fix(q).slice(0,210)}

function genCitanje2(){const q=[];
const ant=[["veliko","malo"],["brzo","sporo"],["toplo","hladno"],["veselo","tužno"],["staro","novo"],["visoko","nisko"],["dugo","kratko"],["široko","usko"],["teško","lako"],["glasno","tiho"],["puno","prazno"],["mokro","suho"],["tamno","svijetlo"],["dobro","loše"],["debelo","mršavo"],["čisto","prljavo"],["blizu","daleko"],["lijevo","desno"],["otvoreno","zatvoreno"],["tvrdo","meko"],["rano","kasno"],["bogato","siromašno"]];
const sa=ant.flat();
ant.forEach(([w,o])=>{q.push({type:"choice",difficulty:2,question:`Suprotno od "${w}"?`,answers:sh([o,...wf(sa,o)]),correctIndex:-1,_c:o});q.push({type:"input",difficulty:3,question:`Suprotno od "${w}":`,correctAnswer:o});q.push({type:"choice",difficulty:2,question:`Suprotno od "${o}"?`,answers:sh([w,...wf(sa,w)]),correctIndex:-1,_c:w})});
const sin=[["kuća","dom"],["lijepo","krasno"],["veselo","radosno"],["brzo","hitro"],["malo","sitno"],["veliko","golemo"],["put","cesta"],["djeca","klinci"],["jesti","blagovati"],["gledati","promatrati"],["govoriti","pričati"],["hodati","šetati"]];
sin.forEach(([w,s])=>{q.push({type:"choice",difficulty:3,question:`Slično: "${w}"?`,answers:sh([s,...wf(sin.flat(),s)]),correctIndex:-1,_c:s})});
const uu=[["kuća","kućica","kućetina"],["pas","psić","psina"],["knjiga","knjižica","knjižurina"],["riba","ribica","ribetina"],["nos","nosić","nosina"],["mačka","mačkica","mačketina"],["stol","stolić","stolčina"],["cvijet","cvjetić","cvjetina"],["zub","zubić","zubetina"],["ruka","ručica","ručetina"],["noga","nožica","nožetina"],["ptica","ptičica","ptičetina"],["grad","gradić","gradina"],["brat","bratić","bratina"]];
uu.forEach(([w,um,uv])=>{q.push({type:"input",difficulty:2,question:`Umanjenica od "${w}":`,correctAnswer:um});q.push({type:"input",difficulty:3,question:`Uvećanica od "${w}":`,correctAnswer:uv});q.push({type:"choice",difficulty:2,question:`Umanjenica od "${w}"?`,answers:sh([um,...wf(uu.map(x=>x[1]),um)]),correctIndex:-1,_c:um})});
[["škola",2],["računalo",4],["dom",1],["prijatelj",3],["knjiga",2],["automobil",4],["ja",1],["učiteljica",5],["matematika",5],["pas",1],["mama",2],["telefon",3],["loptica",3],["bilježnica",4],["zvijezda",3],["čokolada",4],["rak",1],["banana",3],["sunce",2],["olovka",3]].forEach(([w,c])=>{const r=cfc(c,1,6);q.push({type:"choice",difficulty:2,question:`Slogovi: "${w}"?`,answers:r.answers,correctIndex:r.correctIndex});q.push({type:"input",difficulty:3,question:`Prebroji slogove: "${w}"`,correctAnswer:String(c)})});
[["pas,mačka,riba,stol","stol"],["jabuka,kruška,banana,stolica","stolica"],["crvena,plava,zelena,mama","mama"],["mama,tata,baka,auto","auto"],["olovka,knjiga,bilježnica,sunce","sunce"],["košulja,hlače,cipele,knjiga","knjiga"],["jagoda,malina,kupina,stolica","stolica"],["ruka,noga,uho,lopta","lopta"],["utorak,srijeda,petak,jabuka","jabuka"],["krava,ovca,koza,stolica","stolica"]].forEach(([g,o])=>{const a=g.split(",");q.push({type:"choice",difficulty:3,question:`Što NE pripada: ${a.join(", ")}?`,answers:a,correctIndex:a.indexOf(o)})});
return fix(q).slice(0,210)}

// ═══ MATEMATIKA ═══
function genBrojevi100(){const q=[];
for(let d=10;d<=100;d+=10){q.push({type:"input",difficulty:1,question:`NAKON ${d-1}:`,correctAnswer:String(d)});q.push({type:"input",difficulty:1,question:`PRIJE ${d}:`,correctAnswer:String(d-1)})}
for(let n=11;n<=99;n+=3){q.push({type:"input",difficulty:1,question:`Sljedbenik od ${n}:`,correctAnswer:String(n+1)});if(n>1)q.push({type:"input",difficulty:1,question:`Prethodnik od ${n}:`,correctAnswer:String(n-1)})}
for(let n=11;n<=99;n+=3){const d=Math.floor(n/10),j=n%10;q.push({type:"input",difficulty:2,question:`Desetice u ${n}:`,correctAnswer:String(d)});q.push({type:"input",difficulty:2,question:`Jedinice u ${n}:`,correctAnswer:String(j)});if(n%7===0){const r=cfc(n,10,99);q.push({type:"choice",difficulty:3,question:`${d} des. + ${j} jed. = ?`,answers:r.answers,correctIndex:r.correctIndex})}}
for(let a=10;a<=95;a+=5){const b=a+((a*3+7)%19)-9;if(b<1||b>99||a===b)continue;q.push({type:"choice",difficulty:2,question:`${a} ${CIRCLE} ${b}`,answers:["<",">","="],correctIndex:a<b?0:1})}
for(let i=1;i<=50;i++)q.push({type:"choice",difficulty:2,question:`${i} je:`,answers:["paran","neparan"],correctIndex:i%2===0?0:1});
const rim=[["I",1],["II",2],["III",3],["IV",4],["V",5],["VI",6],["VII",7],["VIII",8],["IX",9],["X",10],["XI",11],["XII",12]];
rim.forEach(([r,a])=>{const rc=cfc(a,1,12);q.push({type:"choice",difficulty:3,question:`${r} =`,answers:rc.answers,correctIndex:rc.correctIndex});q.push({type:"input",difficulty:3,question:`${r} arapski:`,correctAnswer:String(a)});q.push({type:"choice",difficulty:3,question:`${a} rimski:`,answers:sh([r,...wf(rim.map(x=>x[0]),r)]),correctIndex:-1,_c:r})});
for(let s=2;s<=50;s+=7)q.push({type:"input",difficulty:2,question:`Niz: ${s},${s+2},${s+4},?`,correctAnswer:String(s+6)});
for(let s=5;s<=50;s+=11)q.push({type:"input",difficulty:2,question:`Niz: ${s},${s+5},${s+10},?`,correctAnswer:String(s+15)});
return fix(q).slice(0,210)}

function genZbrajanje100(){const q=[];
const pt=[(n,a,b,it)=>`${n} ima ${a} ${it}. Dobije još ${b}. Koliko sada?`,(n,a,b,it)=>`U košari ${a} ${it}. Mama doda ${b}. Ukupno?`,(n,a,b,it)=>`Na livadi ${a} ${it}. Dođe ${b}. Koliko sada?`,(n,a,b,it)=>`${n} skupi ${a} ${it}. Prijatelj da ${b}. Zajedno?`,(n,a,b,it)=>`U razredu ${a} djece. Dođe ${b}. Koliko sada?`,(n,a,b,it)=>`${n} pročita ${a} str., pa još ${b}. Ukupno?`,(n,a,b,it)=>`Na stolu ${a} ${it}. ${n} donese ${b}. Koliko?`,(n,a,b,it)=>`${n} ima ${a} kn, dobije ${b} kn. Koliko?`,(n,a,b,it)=>`U vrtu ${a} ${it}. Posadimo ${b}. Koliko sada?`,(n,a,b,it)=>`${n} napravi ${a} ${it}. Sutra napravi ${b}. Ukupno?`];
for(let a=10;a<=90;a+=10)for(let b=10;b<=100-a;b+=10)q.push({type:"input",difficulty:1,question:`${a}+${b}=?`,correctAnswer:String(a+b)});
for(let a=11;a<=85;a+=4)for(let b=3;b<=85;b+=7){if(a+b>100)continue;const r=cfc(a+b,Math.max(a+b-5,0),Math.min(a+b+5,100));q.push({type:"choice",difficulty:2,question:`${a}+${b}=?`,answers:r.answers,correctIndex:r.correctIndex});if((a+b)%3===0)q.push({type:"input",difficulty:2,question:`${a}+${b}=?`,correctAnswer:String(a+b)})}
for(let a=3;a<=15;a+=2)for(let b=2;b<=12;b+=3){if(a+b>25)continue;const e=EL[(a+b)%EL.length];q.push({type:"input",difficulty:2,visual:`${rep(e,Math.min(a,8))}+${rep(e,Math.min(b,8))}`,question:"Ukupno?",correctAnswer:String(a+b)})}
for(let i=0;i<30;i++){const a=(i*7+13)%40+10,b=(i*5+3)%35+5;if(a+b>99)continue;q.push({type:"input",difficulty:3,question:pt[i%pt.length](N(),a,b,IF()),correctAnswer:String(a+b)})}
for(let a=10;a<=50;a+=5)for(let b=5;b<=40;b+=8){if(a+b>99)continue;q.push({type:"input",difficulty:4,question:`${a}+?=${a+b}`,correctAnswer:String(b)})}
return fix(q).slice(0,210)}

function genOduzimanje100(){const q=[];
const pt=[(n,a,b,it)=>`${n} ima ${a} ${it}. Pojede ${b}. Ostane?`,(n,a,b,it)=>`U kutiji ${a} ${it}. Pojedu ${b}. Ostane?`,(n,a,b,it)=>`Na grani ${a} ptica. ${b} odleti. Ostane?`,(n,a,b,it)=>`${n} ima ${a} kn. Potroši ${b}. Ostane?`,(n,a,b,it)=>`U busu ${a} putnika. Izađe ${b}. Ostane?`,(n,a,b,it)=>`U vrtu ${a} ${it}. Uvene ${b}. Ostane?`,(n,a,b,it)=>`${n} ima ${a} ${it}. Pokloni ${b}. Ostane?`,(n,a,b,it)=>`U jezeru ${a} riba. Ulove ${b}. Ostane?`,(n,a,b,it)=>`${n} ima ${a} ${it}. Izgubi ${b}. Ostane?`,(n,a,b,it)=>`Na parkingu ${a} auta. Ode ${b}. Ostane?`];
for(let a=20;a<=100;a+=10)for(let b=10;b<=a;b+=10)q.push({type:"input",difficulty:1,question:`${a}-${b}=?`,correctAnswer:String(a-b)});
for(let a=20;a<=99;a+=4)for(let b=2;b<=a-1;b+=7){const r=cfc(a-b,Math.max(a-b-5,0),Math.min(a-b+5,99));q.push({type:"choice",difficulty:2,question:`${a}-${b}=?`,answers:r.answers,correctIndex:r.correctIndex});if((a-b)%3===0)q.push({type:"input",difficulty:2,question:`${a}-${b}=?`,correctAnswer:String(a-b)})}
for(let i=0;i<30;i++){const a=(i*7+30)%50+30,b=(i*5+3)%20+5;if(b>=a)continue;q.push({type:"input",difficulty:3,question:pt[i%pt.length](N(),a,b,IF()),correctAnswer:String(a-b)})}
for(let a=20;a<=80;a+=8)for(let b=5;b<=30;b+=9){if(b>=a)continue;q.push({type:"input",difficulty:4,question:`${a}-?=${a-b}`,correctAnswer:String(b)})}
return fix(q).slice(0,210)}

function genMnozenjeDijeljenje(){const q=[];
const pm=[(n,a,b,it)=>`${n} ima ${a} kutije po ${b} ${it}. Ukupno?`,(n,a,b,it)=>`U ${a} redova po ${b} djece. Ukupno?`,(n,a,b,it)=>`Na ${a} stabala po ${b} jabuka. Ukupno?`,(n,a,b,it)=>`${a} djece ima po ${b} ${it}. Ukupno?`,(n,a,b,it)=>`${n} kupi ${a} paketa po ${b} ${it}. Ukupno?`];
const pd=[(n,t,d,it)=>`${n} dijeli ${t} ${it} na ${d} hrpe. Koliko u svakoj?`,(n,t,d,it)=>`${t} ${it} na ${d} djece. Koliko svako?`,(n,t,d,it)=>`${t} ${it} u ${d} kutija. Koliko u svakoj?`];
for(let a=1;a<=5;a++)for(let b=1;b<=10;b++){const p=a*b;q.push({type:"input",difficulty:a<=3?1:2,question:`${a}×${b}=?`,correctAnswer:String(p)});if(b<=5){const r=cfc(p,Math.max(p-5,0),p+5);q.push({type:"choice",difficulty:2,question:`${a}×${b}=?`,answers:r.answers,correctIndex:r.correctIndex})}if(a!==b&&b<=5)q.push({type:"input",difficulty:2,question:`${b}×${a}=?`,correctAnswer:String(p)})}
for(let a=1;a<=5;a++)for(let b=1;b<=10;b++){q.push({type:"input",difficulty:3,question:`${a*b}÷${a}=?`,correctAnswer:String(b)})}
for(let i=0;i<20;i++){const a=(i%4)+2,b=(i%5)+2;if(a*b>50)continue;q.push({type:"input",difficulty:3,question:pm[i%pm.length](N(),a,b,IF()),correctAnswer:String(a*b)})}
for(let i=0;i<15;i++){const d=(i%4)+2,r=(i%5)+2;q.push({type:"input",difficulty:3,question:pd[i%pd.length](N(),d*r,d,IF()),correctAnswer:String(r)})}
for(let a=1;a<=10;a++){q.push({type:"input",difficulty:1,question:`${a}×0=?`,correctAnswer:"0"});q.push({type:"input",difficulty:1,question:`${a}×1=?`,correctAnswer:String(a)})}
for(let a=2;a<=5;a++)for(let b=2;b<=5;b++)q.push({type:"input",difficulty:4,question:`${a}×?=${a*b}`,correctAnswer:String(b)});
return fix(q).slice(0,210)}

function genGeometrija2(){const q=[];
const li=[["krug",0],["trokut",3],["kvadrat",4],["pravokutnik",4],["peterokut",5],["šesterokut",6]];
li.forEach(([l,s])=>{const r=cfc(s,0,8);q.push({type:"choice",difficulty:2,question:`Stranice ${l}a?`,answers:r.answers,correctIndex:r.correctIndex});q.push({type:"input",difficulty:2,question:`Broj stranica ${l}a:`,correctAnswer:String(s)});q.push({type:"choice",difficulty:2,question:`Kutovi ${l}a?`,answers:r.answers,correctIndex:r.correctIndex})});
[["sat","krug"],["prozor","pravokutnik"],["krov kuće","trokut"],["pizza","krug"],["vrata","pravokutnik"],["novčić","krug"],["bilježnica","pravokutnik"],["šahovsko polje","kvadrat"],["kotač","krug"],["prometni znak STOP","šesterokut"],["sendvič dijagonalno","trokut"]].forEach(([o,l])=>{q.push({type:"choice",difficulty:2,question:`"${o}" → oblik?`,answers:sh([l,...wf(li.map(x=>x[0]),l)]),correctIndex:-1,_c:l})});
const tj=[["kugla","⚽"],["valjak","🥫"],["kocka","🎲"],["kvadar","📦"],["piramida","🔺"],["stožac","🎄"]];
tj.forEach(([t,e])=>{q.push({type:"choice",difficulty:3,visual:e,question:"Tijelo?",answers:sh([t,...wf(tj.map(x=>x[0]),t)]),correctIndex:-1,_c:t})});
[["lopta","kugla"],["limenka","valjak"],["kutija","kvadar"],["kocka za igru","kocka"],["sladoled kornet","stožac"],["piramida u Egiptu","piramida"],["globus","kugla"],["svijeća","valjak"],["cigla","kvadar"],["šator","piramida"]].forEach(([o,t])=>{q.push({type:"choice",difficulty:2,question:`"${o}" → tijelo?`,answers:sh([t,...wf(tj.map(x=>x[0]),t)]),correctIndex:-1,_c:t})});
[["A","da"],["B","da"],["D","da"],["H","da"],["M","da"],["O","da"],["T","da"],["X","da"],["C","ne"],["F","ne"],["G","ne"],["J","ne"],["K","ne"],["S","ne"]].forEach(([s,sim])=>q.push({type:"choice",difficulty:3,question:`Simetrija "${s}"?`,answers:["Da","Ne"],correctIndex:sim==="da"?0:1}));
return fix(q).slice(0,210)}

function genMjerenjeNovac(){const q=[];
const se=[["🕐",1],["🕑",2],["🕒",3],["🕓",4],["🕔",5],["🕕",6],["🕖",7],["🕗",8],["🕘",9],["🕙",10],["🕚",11],["🕛",12]];
se.forEach(([e,h])=>{const r=cfc(h,1,12);q.push({type:"choice",difficulty:2,visual:e,question:"Sati?",answers:r.answers,correctIndex:r.correctIndex});q.push({type:"input",difficulty:2,visual:e,question:"Koliko sati?",correctAnswer:String(h)})});
for(let a=1;a<=20;a+=2)for(let b=1;b<=20;b+=3){if(a+b>50)continue;q.push({type:"input",difficulty:2,question:`${a}kn+${b}kn=?`,correctAnswer:String(a+b)})}
for(let a=10;a<=50;a+=5)for(let b=1;b<=a;b+=4)q.push({type:"input",difficulty:2,question:`${a}kn-${b}kn=?`,correctAnswer:String(a-b)});
for(let i=0;i<15;i++){const c=(i%8)+3,p=c+(i%5)+1;q.push({type:"input",difficulty:3,question:`${N()} kupi ${IF()} za ${c}kn. Plati ${p}kn. Ostatak?`,correctAnswer:String(p-c)})}
[["duljinu","ravnalo"],["težinu","vaga"],["temperaturu","termometar"],["vrijeme","sat"],["tekućinu","menzura"]].forEach(([s,c])=>{q.push({type:"choice",difficulty:1,question:`Čime mjerimo ${s}?`,answers:sh([c,...wf(["ravnalo","vaga","termometar","sat","menzura"],c)]),correctIndex:-1,_c:c})});
[["1 m","100","cm"],["1 km","1000","m"],["1 kg","1000","g"],["1 L","1000","mL"],["1 h","60","min"],["1 min","60","s"],["1 dan","24","h"],["1 tjedan","7","dana"]].forEach(([iz,v,j])=>{const r=cfc(parseInt(v),Math.max(parseInt(v)-50,1),parseInt(v)+50);q.push({type:"choice",difficulty:2,question:`${iz}=? ${j}`,answers:r.answers,correctIndex:r.correctIndex});q.push({type:"input",difficulty:2,question:`${iz}=__ ${j}`,correctAnswer:v})});
return fix(q).slice(0,210)}

// ═══ PRIRODA ═══
function genZavicaj(){const q=[];
const st=[["sjever","S"],["jug","J"],["istok","I"],["zapad","Z"]];
st.forEach(([s,k])=>{q.push({type:"input",difficulty:2,question:`Kratica "${s}":`,correctAnswer:k});q.push({type:"input",difficulty:3,question:`Strana "${k}":`,correctAnswer:s});q.push({type:"choice",difficulty:2,question:`Kratica za "${s}"?`,answers:sh(["S","J","I","Z"]),correctIndex:-1,_c:k})});
[["sjever","jug"],["istok","zapad"]].forEach(([a,b])=>{q.push({type:"input",difficulty:3,question:`Suprotno od "${a}":`,correctAnswer:b});q.push({type:"input",difficulty:3,question:`Suprotno od "${b}":`,correctAnswer:a});q.push({type:"choice",difficulty:2,question:`Suprotno od "${a}"?`,answers:sh(st.map(x=>x[0])),correctIndex:-1,_c:b});q.push({type:"choice",difficulty:2,question:`Suprotno od "${b}"?`,answers:sh(st.map(x=>x[0])),correctIndex:-1,_c:a})});
q.push({type:"choice",difficulty:2,question:"Sunce izlazi na:?",answers:["istoku","zapadu","sjeveru","jugu"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Sunce zalazi na:?",answers:["istoku","zapadu","sjeveru","jugu"],correctIndex:1});
[["plava","vodu"],["zelena","nizinu/šumu"],["smeđa","planine"],["žuta","cestu"]].forEach(([b,z])=>q.push({type:"choice",difficulty:2,question:`${b} na karti=?`,answers:["vodu","nizinu/šumu","planine","cestu"],correctIndex:["vodu","nizinu/šumu","planine","cestu"].indexOf(z)}));
const inst=[["Gdje učimo?","škola"],["Gdje se liječimo?","bolnica"],["Gdje kupujemo?","trgovina"],["Gdje posuđujemo knjige?","knjižnica"],["Gdje šaljemo pisma?","pošta"],["Gdje gledamo filmove?","kino"],["Tko gasi požar?","vatrogasci"],["Tko čuva red?","policija"],["Gdje jedemo u restoranu?","restoran"],["Gdje se mole?","crkva"]];
const si=inst.map(x=>x[1]);
inst.forEach(([p,o])=>{q.push({type:"choice",difficulty:2,question:p,answers:sh([o,...wf(si,o)]),correctIndex:-1,_c:o})});
q.push({type:"choice",difficulty:1,question:"Zavičaj je:?",answers:["Mjesto gdje živimo","Strana država","Planet","Stanica"],correctIndex:0});
return fix(q).slice(0,210)}

function genDobaVrijeme(){const q=[];
const S=["proljeće","ljeto","jesen","zima"];
const mj=[["siječanj","zima"],["veljača","zima"],["ožujak","proljeće"],["travanj","proljeće"],["svibanj","proljeće"],["lipanj","ljeto"],["srpanj","ljeto"],["kolovoz","ljeto"],["rujan","jesen"],["listopad","jesen"],["studeni","jesen"],["prosinac","zima"]];
mj.forEach(([m,d])=>{q.push({type:"choice",difficulty:2,question:`"${m}" → doba?`,answers:S,correctIndex:S.indexOf(d)});q.push({type:"input",difficulty:3,question:`Doba za "${m}":`,correctAnswer:d})});
for(let i=0;i<12;i++){const nx=mj[(i+1)%12][0];q.push({type:"choice",difficulty:3,question:`Nakon "${mj[i][0]}"?`,answers:sh([nx,...wf(mj.map(x=>x[0]),nx)]),correctIndex:-1,_c:nx});const pv=mj[(i+11)%12][0];q.push({type:"choice",difficulty:3,question:`Prije "${mj[i][0]}"?`,answers:sh([pv,...wf(mj.map(x=>x[0]),pv)]),correctIndex:-1,_c:pv})}
mj.forEach(([m],i)=>{const r=cfc(i+1,1,12);q.push({type:"choice",difficulty:2,question:`"${m}" je _. mjesec?`,answers:r.answers,correctIndex:r.correctIndex})});
S.forEach((s,i)=>{q.push({type:"choice",difficulty:2,question:`Nakon "${s}"?`,answers:S,correctIndex:S.indexOf(S[(i+1)%4])})});
[["🌸","proljeće"],["☀️","ljeto"],["🍂","jesen"],["❄️","zima"],["🌷","proljeće"],["🏖️","ljeto"],["🍁","jesen"],["⛄","zima"],["🌱","proljeće"],["🍉","ljeto"],["🌧️","jesen"],["🧣","zima"]].forEach(([e,s])=>q.push({type:"choice",difficulty:1,visual:e,question:"Doba?",answers:S,correctIndex:S.indexOf(s)}));
const dn=["ponedjeljak","utorak","srijeda","četvrtak","petak","subota","nedjelja"];
for(let i=0;i<7;i++){const nx=dn[(i+1)%7];q.push({type:"choice",difficulty:2,question:`Nakon "${dn[i]}"?`,answers:sh([nx,...wf(dn,nx)]),correctIndex:-1,_c:nx})}
q.push({type:"choice",difficulty:1,question:"Mjeseci?",answers:["10","11","12","13"],correctIndex:2});
q.push({type:"choice",difficulty:1,question:"Dana u tjednu?",answers:["5","6","7","8"],correctIndex:2});
[["☀️","sunčano"],["☁️","oblačno"],["🌧️","kišovito"],["❄️","snježno"],["💨","vjetrovito"]].forEach(([e,v])=>{q.push({type:"choice",difficulty:1,visual:e,question:"Vrijeme?",answers:sh([v,...wf(["sunčano","oblačno","kišovito","snježno","vjetrovito"],v)]),correctIndex:-1,_c:v})});
return fix(q).slice(0,210)}

function genBiljkeZivotinje(){const q=[];
const db=[["korijen","upija vodu"],["stabljika","nosi hranu"],["list","fotosinteza"],["cvijet","razmnožavanje"],["plod","sjemenka"]];
db.forEach(([d,o])=>{q.push({type:"choice",difficulty:2,question:`"${o}" → dio biljke?`,answers:sh([d,...wf(db.map(x=>x[0]),d)]),correctIndex:-1,_c:d});q.push({type:"input",difficulty:3,question:`Koji dio: "${o}"?`,correctAnswer:d})});
const dom=["krava","kokoš","ovca","pas","mačka","konj","svinja","koza","magarac","patka","guska","kunić","purica"];
const div=["vuk","medvjed","jelen","lisica","zec","sova","orao","jež","vjeverica","srna","divlja svinja","vidra","kuna","jazavac"];
dom.forEach(z=>q.push({type:"choice",difficulty:2,question:`"${z}" je:`,answers:["domaća","divlja"],correctIndex:0}));
div.forEach(z=>q.push({type:"choice",difficulty:2,question:`"${z}" je:`,answers:["domaća","divlja"],correctIndex:1}));
for(let i=0;i<12;i++){const o=pick(div),r=pickN(dom,3);q.push({type:"choice",difficulty:3,question:"DIVLJA?",answers:sh([o,...r]),correctIndex:-1,_c:o})}
for(let i=0;i<12;i++){const o=pick(dom),r=pickN(div,3);q.push({type:"choice",difficulty:3,question:"DOMAĆA?",answers:sh([o,...r]),correctIndex:-1,_c:o})}
[["riba","voda"],["ptica","zrak"],["crv","tlo"],["žaba","voda i kopno"],["medvjed","šuma"],["krava","farma"],["kit","more"],["pčela","livade"],["delfin","more"],["orao","planine"],["vjeverica","šuma"]].forEach(([z,m])=>{q.push({type:"choice",difficulty:2,question:`Gdje živi ${z}?`,answers:sh([m,...wf(["voda","zrak","tlo","šuma","farma","more","livade","planine"],m)]),correctIndex:-1,_c:m})});
[["krava","mlijeko"],["kokoš","jaja"],["ovca","vunu"],["pčela","med"],["svinja","meso"],["koza","mlijeko i sir"]].forEach(([z,d])=>{q.push({type:"choice",difficulty:2,question:`Što daje ${z}?`,answers:sh([d,...wf(["mlijeko","jaja","vunu","med","meso","mlijeko i sir"],d)]),correctIndex:-1,_c:d})});
const vo=["jabuka","kruška","šljiva","trešnja","jagoda","banana","naranča","limun","grožđe","breskva","malina","kupina","lubenica"];
const po=["mrkva","krumpir","rajčica","paprika","luk","salata","kupus","brokula","grah","grašak","blitva","tikvica","krastavac"];
vo.forEach(v=>q.push({type:"choice",difficulty:1,question:`"${v}" je:`,answers:["voće","povrće"],correctIndex:0}));
po.forEach(p=>q.push({type:"choice",difficulty:1,question:`"${p}" je:`,answers:["voće","povrće"],correctIndex:1}));
return fix(q).slice(0,210)}

function genVodaTlo(){const q=[];
[["tekuće","voda u čaši"],["kruto","led, snijeg"],["plinovito","para, magla"]].forEach(([s,p])=>q.push({type:"choice",difficulty:2,question:`"${p}" → stanje?`,answers:["tekuće","kruto","plinovito"],correctIndex:["tekuće","kruto","plinovito"].indexOf(s)}));
q.push({type:"choice",difficulty:1,question:"Stanja vode?",answers:["1","2","3","4"],correctIndex:2});
q.push({type:"input",difficulty:2,question:"Kruto stanje=",correctAnswer:"led"});q.push({type:"input",difficulty:2,question:"Plinovito stanje=",correctAnswer:"vodena para"});
q.push({type:"choice",difficulty:2,question:"Smrzava pri:?",answers:["0°C","10°C","50°C","100°C"],correctIndex:0});q.push({type:"choice",difficulty:2,question:"Ključa pri:?",answers:["0°C","50°C","100°C","200°C"],correctIndex:2});
q.push({type:"input",difficulty:2,question:"Smrzava ___°C:",correctAnswer:"0"});q.push({type:"input",difficulty:2,question:"Ključa ___°C:",correctAnswer:"100"});
q.push({type:"choice",difficulty:3,question:"Kruženje vode:",answers:["isparavanje→oblak→padavina→otjecanje","padavina→isparavanje→otjecanje","oblak→otjecanje→padavina","otjecanje→padavina→oblak"],correctIndex:0});
[["Sava","rijeka"],["Drava","rijeka"],["Dunav","rijeka"],["Jadransko","more"],["Plitvička jezera","jezera"],["Kupa","rijeka"]].forEach(([i,t])=>{q.push({type:"choice",difficulty:3,question:`"${i}" je:`,answers:sh([t,...wf(["rijeka","more","jezera","potok","ocean"],t)]),correctIndex:-1,_c:t})});
[["rijeka","slatka"],["more","slana"],["jezero","slatka"],["ocean","slana"],["potok","slatka"]].forEach(([v,t])=>q.push({type:"choice",difficulty:2,question:`Voda u ${v} je:`,answers:["slatka","slana"],correctIndex:t==="slatka"?0:1}));
q.push({type:"choice",difficulty:2,question:"Tlo je:?",answers:["Gornji sloj Zemlje","Nebo","Oblak","Zvijezda"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"U tlu:?",answers:["minerali,voda,zrak,organizmi","samo kamenje","samo voda","samo pijesak"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Humus je:?",answers:["razgrađeni ostaci","vrsta vode","biljka","kamen"],correctIndex:0});
["crv","krtica","mravi","stonoga","gujavica"].forEach(z=>q.push({type:"choice",difficulty:2,question:`"${z}" živi u tlu?`,answers:["Da","Ne"],correctIndex:0}));
["ptica","riba","kit","orao"].forEach(z=>q.push({type:"choice",difficulty:2,question:`"${z}" živi u tlu?`,answers:["Da","Ne"],correctIndex:1}));
return fix(q).slice(0,210)}

function genZdravljeSigurnost2(){const q=[];
const zd=["voće","povrće","mlijeko","kruh","riba","jaja","sir","orasi","med","voda"];
const nz=["čips","slatkiši","gazirana pića","brza hrana","bomboni","kolači","pomfrit","energetska pića"];
zd.forEach(h=>q.push({type:"choice",difficulty:1,question:`"${h}" zdravo?`,answers:["Da","Ne"],correctIndex:0}));
nz.forEach(h=>q.push({type:"choice",difficulty:1,question:`"${h}" zdravo?`,answers:["Da","Ne"],correctIndex:1}));
for(let i=0;i<10;i++){const o=pick(nz),r=pickN(zd,3);q.push({type:"choice",difficulty:2,question:"NIJE zdravo?",answers:sh([o,...r]),correctIndex:-1,_c:o})}
for(let i=0;i<10;i++){const o=pick(zd),r=pickN(nz,3);q.push({type:"choice",difficulty:2,question:"JE zdravo?",answers:sh([o,...r]),correctIndex:-1,_c:o})}
q.push({type:"choice",difficulty:2,question:"Prati zube:?",answers:["1×","2×","3×","nikad"],correctIndex:1});
q.push({type:"choice",difficulty:2,question:"San djece:?",answers:["4-5h","6-7h","9-11h","15h"],correctIndex:2});
q.push({type:"choice",difficulty:1,question:"Zeleno=pješak:?",answers:["prelazi","čeka","trči","sjedi"],correctIndex:0});
q.push({type:"choice",difficulty:1,question:"Crveno=pješak:?",answers:["prelazi","čeka","trči","skače"],correctIndex:1});
q.push({type:"choice",difficulty:2,question:"Prije ceste:?",answers:["pogledaj L-D","zatvori oči","trči","ništa"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Bicikl:?",answers:["stazom","cestom","nogostupom","travom"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Na biciklu:?",answers:["kacigu","kapu","naočale","ništa"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"U autu:?",answers:["pojas","kacigu","naočale","rukavice"],correctIndex:0});
q.push({type:"choice",difficulty:1,question:"Hitni broj:?",answers:["112","000","999","123"],correctIndex:0});
q.push({type:"input",difficulty:2,question:"Hitni broj:",correctAnswer:"112"});
q.push({type:"choice",difficulty:2,question:"Opeklina:?",answers:["hladna voda","trčim","ništa","led"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Vrata nepoznatima:?",answers:["Da","Ne"],correctIndex:1});
q.push({type:"choice",difficulty:2,question:"Igra s vatrom:?",answers:["Da","Ne"],correctIndex:1});
q.push({type:"choice",difficulty:2,question:"Ako se izgubiš:?",answers:["traži policajca","plači","trči","sakrij se"],correctIndex:0});
return fix(q).slice(0,210)}

const GEN_MAP={hrvatski:[genImeniceRod,genGlagoli2,genRecenice2,genCitanje2],matematika:[genBrojevi100,genZbrajanje100,genOduzimanje100,genMnozenjeDijeljenje,genGeometrija2,genMjerenjeNovac],priroda:[genZavicaj,genDobaVrijeme,genBiljkeZivotinje,genVodaTlo,genZdravljeSigurnost2]};
async function seed(){console.log(`\n🌱 SEED ${GRADE}. razred\n`);const uri=process.env.MONGODB_URI||process.env.MONGO_URI;const client=new MongoClient(uri);try{await client.connect();const dbName=process.env.DB_NAME||(()=>{try{return new URL(uri).pathname.replace(/^\//,'')||'ucilica'}catch{return'ucilica'}})();const db=client.db(dbName);console.log(`🔗 ${db.databaseName}`);await db.collection("questions").deleteMany({grade:GRADE});await db.collection("topics").deleteMany({grade:GRADE});await db.collection("subjects").deleteMany({grade:GRADE});let t=0;for(const s of subjects){const sr=await db.collection("subjects").insertOne({...s,grade:GRADE,isActive:true,createdAt:new Date()});const si=sr.insertedId;console.log(`📘 ${s.icon} ${s.name}`);const gs=GEN_MAP[s.slug],ts=topicsDef[s.slug];for(let i=0;i<ts.length;i++){const rq=gs[i]();const tr=await db.collection("topics").insertOne({...ts[i],grade:GRADE,subject_id:si,isActive:true,createdAt:new Date()});const ti=tr.insertedId;const docs=rq.map(qq=>({type:qq.type,difficulty:qq.difficulty||1,question:qq.question,visual:qq.visual||"",hint:qq.hint||"",answers:qq.answers||[],correctIndex:typeof qq.correctIndex==="number"?qq.correctIndex:undefined,correctAnswer:qq.correctAnswer||undefined,grade:GRADE,subject_id:si,topic_id:ti,isActive:true,createdAt:new Date()}));if(docs.length)await db.collection("questions").insertMany(docs);t+=docs.length;console.log(`   ${ts[i].icon} ${ts[i].name}: ${docs.length}`)}}console.log(`\n✅ ${t} pitanja`)}catch(e){console.error("❌",e)}finally{await client.close();process.exit(0)}}
if(require.main===module){seed()}
module.exports={genImeniceRod,genGlagoli2,genRecenice2,genCitanje2,genBrojevi100,genZbrajanje100,genOduzimanje100,genMnozenjeDijeljenje,genGeometrija2,genMjerenjeNovac,genZavicaj,genDobaVrijeme,genBiljkeZivotinje,genVodaTlo,genZdravljeSigurnost2};
