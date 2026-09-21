/**
 * seed-r3.js — Učilica 3. razred — OBOGAĆENI generatori
 */
require("dotenv").config({path:require("path").join(__dirname,"../.env")});
const{oznake}=require("./jasnoca");
const ZNAKOVI_USP=oznake(["<",">","="]);
const{MongoClient}=require("mongodb");
const{buildQuestionMetadata}=require("../services/gikEngine");
const{N,IF,IM,sh,cfc,rep,fix,EL,CIRCLE}=require("./gen-hrvatski");
const{spajanje}=require("./gen-engine");
const{mathCombi,storyProb,smartChoice,multiFormat,oddOneOut,trueFalse,pick:_pick,pickN:_pickN,wf:_wf}=require("./gen-engine");
const GRADE=3;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const pickN=(a,n)=>sh([...a]).slice(0,n);
const wf=(pool,c,n=3)=>sh(pool.filter(x=>x!==c)).slice(0,n);

const subjects=[{name:"Hrvatski jezik",slug:"hrvatski",icon:"📖",color:"#FF6B6B",description:"Vrste riječi, gramatika, književnost",order:1},{name:"Matematika",slug:"matematika",icon:"🔢",color:"#60A5FA",description:"Brojevi do 1000, množenje, dijeljenje, geometrija",order:2},{name:"Priroda i društvo",slug:"priroda",icon:"🌿",color:"#34D399",description:"Zavičaj, karta, biljke, životinje, tlo, voda",order:3}];
const topicsDef={
hrvatski:[{name:"Vrste riječi",slug:"vrste-rijeci",icon:"📝",order:1},{name:"Gramatika i pravopis",slug:"gramatika-pravopis",icon:"✏️",order:2},{name:"Književni tekstovi",slug:"knjizevni-tekst",icon:"📚",order:3},{name:"Jezično izražavanje",slug:"jezicno-izrazavanje",icon:"💬",order:4}],
matematika:[{name:"Brojevi do 1000",slug:"brojevi-1000",icon:"🔢",order:1},{name:"Zbrajanje i oduzimanje do 1000",slug:"zbr-oduz-1000",icon:"➕",order:2},{name:"Množenje i dijeljenje",slug:"mnoz-dijel-3",icon:"✖️",order:3},{name:"Geometrija i mjerenje",slug:"geometrija-mjerenje-3",icon:"📐",order:4}],
priroda:[{name:"Zavičaj i karta",slug:"zavicaj-karta",icon:"🗺️",order:1},{name:"Tlo, voda, zrak",slug:"tlo-voda-zrak",icon:"🌍",order:2},{name:"Biljke i životinje zavičaja",slug:"biljke-zivotinje-3",icon:"🌳",order:3},{name:"Gospodarske djelatnosti",slug:"gospodarske-djelatnosti",icon:"🏭",order:4},{name:"Kulturna baština",slug:"kulturna-bastina",icon:"🏛️",order:5}]};

const PAR_VRSTA=[["škola","imenica"],["trčati","glagol"],["velik","pridjev"],
["knjiga","imenica"],["pisati","glagol"],["lijep","pridjev"],["sunce","imenica"],
["plivati","glagol"],["brz","pridjev"],["grad","imenica"],["učiti","glagol"],["hladan","pridjev"]];
function genVrsteRijeci(){const q=[];
q.push(...spajanje(PAR_VRSTA,"Spoji riječ s vrstom riječi:",{koliko:4,komada:12,difficulty:3}));
const im=["škola","prijatelj","sunce","sreća","radost","zemlja","ljubav","sloboda","knjiga","učenik","dom","rijeka","more","drvo","cvijet","kamen","oblak","kiša","grad","selo","mama","tata","brat","sestra","dijete","snijeg","proljeće","nebo","zvijezda","mjesec"];
const gl=["trčati","pisati","čitati","učiti","plivati","sanjati","misliti","raditi","putovati","graditi","pjevati","plesati","spavati","jesti","piti","gledati","slušati","hodati","letjeti","padati","kuhati","voziti","crtati","skakati","nositi"];
const pr=["velik","lijep","brz","pametan","sretan","tužan","crven","hladan","topao","star","mlad","dobar","loš","visok","nizak","širok","uzak","težak","lagan","tih","glasan","debeo","mršav","čist","prljav"];
im.forEach(w=>q.push({type:"choice",difficulty:1,question:`Koja je vrsta riječi "${w}"?`,answers:sh(["imenica","glagol","pridjev","prilog"]),correctIndex:-1,_c:"imenica"}));
gl.forEach(w=>q.push({type:"choice",difficulty:1,question:`Koja je vrsta riječi "${w}"?`,answers:sh(["glagol","imenica","pridjev","prilog"]),correctIndex:-1,_c:"glagol"}));
pr.forEach(w=>q.push({type:"choice",difficulty:1,question:`Koja je vrsta riječi "${w}"?`,answers:sh(["pridjev","imenica","glagol","prilog"]),correctIndex:-1,_c:"pridjev"}));
// Odd-one-out po vrsti
for(let i=0;i<15;i++){const odd=pick(gl),rest=pickN(im,3);q.push({type:"choice",difficulty:2,question:"Koja NIJE imenica?",answers:sh([odd,...rest]),correctIndex:-1,_c:odd})}
for(let i=0;i<15;i++){const odd=pick(im),rest=pickN(gl,3);q.push({type:"choice",difficulty:2,question:"Koja NIJE glagol?",answers:sh([odd,...rest]),correctIndex:-1,_c:odd})}
// Stupnjevanje
[["lijep","ljepši","najljepši"],["velik","veći","najveći"],["brz","brži","najbrži"],["dobar","bolji","najbolji"],["loš","lošiji","najlošiji"],["visok","viši","najviši"],["mlad","mlađi","najmlađi"],["star","stariji","najstariji"],["hladan","hladniji","najhladniji"],["topao","topliji","najtopliji"]].forEach(([p,k,s])=>{q.push({type:"input",difficulty:3,question:`Kako glasi komparativ pridjeva "${p}"? Napiši jednu riječ.`,konstrukt:"rijec",correctAnswer:k});q.push({type:"input",difficulty:3,question:`Kako glasi superlativ pridjeva "${p}"? Napiši jednu riječ.`,konstrukt:"rijec",correctAnswer:s});q.push({type:"choice",difficulty:3,question:`Kako glasi komparativ pridjeva "${p}"?`,answers:sh([k,...wf(["ljepši","veći","brži","bolji","viši","mlađi","stariji"],k)]),correctIndex:-1,_c:k})});
[["stolovi","množina"],["knjiga","jednina"],["djeca","množina"],["pas","jednina"],["gradovi","množina"],["sunce","jednina"],["rijeke","množina"],["selo","jednina"],["ptice","množina"],["cvijet","jednina"],["oblaci","množina"],["dijete","jednina"]].forEach(([w,br])=>q.push({type:"choice",difficulty:2,question:`Je li riječ "${w}" u jednini ili množini?`,answers:["jednini","množini"],correctIndex:br==="jednina"?0:1}));
return fix(q).slice(0,210)}

function genGramatikaPravopis(){const q=[];
[["hrvatska","Hrvatska"],["zagreb","Zagreb"],["marko","Marko"],["sava","Sava"],["jadransko more","Jadransko more"],["božić","Božić"],["uskrs","Uskrs"],["europa","Europa"],["dinamo","Dinamo"],["drava","Drava"]].forEach(([w,c])=>{q.push({type:"choice",difficulty:2,question:`Koji je zapis pravilan?`,answers:[w,c],correctIndex:1});q.push({type:"input",difficulty:3,question:`Kako se pravilno piše "${w}"? Napiši jednu riječ.`,konstrukt:"velikoSlovo",correctAnswer:c})});
[["čekati","č"],["ćup","ć"],["čitati","č"],["kuća","ć"],["čaj","č"],["noć","ć"],["ključ","č"],["mačka","č"],["kolač","č"],["čokolada","č"],["srećo","ć"],["otac","c"],["peć","ć"],["liječnik","č"],["tečaj","č"]].forEach(([w,g])=>{if(g==="č"||g==="ć")q.push({type:"choice",difficulty:3,question:`Koji se glas nalazi u riječi "${w}"?`,answers:["č","ć"],correctIndex:g==="č"?0:1})});
[["mlijeko","ije"],["mjesto","je"],["bijelo","ije"],["vjera","je"],["dijete","ije"],["pjesma","je"],["lijep","ije"],["vjeverica","je"],["rijeka","ije"],["cvijet","ije"],["bjelina","je"],["zvijezda","ije"]].forEach(([w,r])=>q.push({type:"choice",difficulty:3,question:`Koji se glas nalazi u riječi "${w}"?`,answers:["ije","je"],correctIndex:r==="ije"?0:1}));
[["Pas laje.","Pas","laje"],["Mama kuha.","Mama","kuha"],["Djeca se igraju.","Djeca","igraju"],["Sunce sija.","Sunce","sija"],["Ana čita.","Ana","čita"],["Kiša pada.","Kiša","pada"],["Vjetar puše.","Vjetar","puše"],["Tata radi.","Tata","radi"]].forEach(([r,su,pr])=>{const wr1=wf([su,pr,"laje","kuha","sija","pada","puše","radi","Ana","Mama","Djeca","Sunce"],su);q.push({type:"choice",difficulty:3,question:`Koji je subjekt u rečenici "${r}"?`,answers:sh([su,...wr1]),correctIndex:-1,_c:su});const wr2=wf(["laje","kuha","igraju","sija","čita","pada","puše","radi"],pr);q.push({type:"choice",difficulty:3,question:`Koji je predikat u rečenici "${r}"?`,answers:sh([pr,...wr2]),correctIndex:-1,_c:pr})});
return fix(q).slice(0,210)}

function genKnjizevniTekst(){const q=[];
[["bajka","priča s čarobnim elementima"],["basna","priča s životinjama i poukom"],["pjesma","tekst u stihovima"],["priča","kratki pripovjedni tekst"],["roman","dugi pripovjedni tekst"],["legenda","priča s temeljima u stvarnosti"],["mit","priča o bogovima"]].forEach(([v,o])=>{q.push({type:"choice",difficulty:2,question:`Kojoj književnoj vrsti pripada ovaj opis? "${o}"`,answers:sh([v,...wf(["bajka","basna","pjesma","priča","roman","legenda","mit"],v)]),correctIndex:-1,_c:v});q.push({type:"input",difficulty:3,question:`Kojoj književnoj vrsti pripada ovaj opis? "${o}"`,correctAnswer:v})});
q.push({type:"choice",difficulty:2,question:"Koji su dijelovi priče?",answers:["uvod, zaplet, rasplet","početak, sredina","naslov, tekst","pitanje, odgovor"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što je uvod u priči?",answers:["početak s likovima","najnapetiji dio","kraj","pouka"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što je zaplet u priči?",answers:["početak","najnapetiji dio","kraj","naslov"],correctIndex:1});
q.push({type:"choice",difficulty:2,question:"Što je rasplet u priči?",answers:["početak","najnapetiji dio","rješenje/kraj","naslov"],correctIndex:2});
q.push({type:"choice",difficulty:3,question:"Što je personifikacija?",answers:["predmetima dajemo ljudska svojstva","usporedba","ponavljanje","pitanje"],correctIndex:0});
q.push({type:"choice",difficulty:3,question:"Što je usporedba?",answers:["predmetima dajemo ljudska svojstva","usporedba pomoću 'kao'","ponavljanje","pitanje"],correctIndex:1});
q.push({type:"choice",difficulty:3,question:`Koji je ovo pjesnički izraz? "Vjetar pjeva"`,answers:["personifikacija","usporedba","hiperbola","rima"],correctIndex:0});
q.push({type:"choice",difficulty:3,question:`Koji je ovo pjesnički izraz? "Brz kao vjetar"`,answers:["personifikacija","usporedba","hiperbola","rima"],correctIndex:1});
q.push({type:"choice",difficulty:3,question:`Koji je ovo pjesnički izraz? "Lijep kao slika"`,answers:["personifikacija","usporedba","hiperbola","rima"],correctIndex:1});
q.push({type:"choice",difficulty:3,question:`Koji je ovo pjesnički izraz? "Sunce se smije"`,answers:["personifikacija","usporedba","hiperbola","rima"],correctIndex:0});
[["dom-grom","da"],["kuća-škola","ne"],["sat-brat","da"],["drvo-more","ne"],["cvijet-svijet","da"],["dan-san","da"],["knjiga-voda","ne"],["mrak-vlak","da"]].forEach(([p,r])=>q.push({type:"choice",difficulty:2,question:`Rimuju li se riječi "${p}"?`,answers:["Da","Ne"],correctIndex:r==="da"?0:1}));
q.push({type:"choice",difficulty:2,question:"Što je stih?",answers:["jedan redak pjesme","cijela pjesma","naslov","autor"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što je strofa?",answers:["skupina stihova","jedan stih","naslov","rima"],correctIndex:0});
return fix(q).slice(0,210)}

function genJezicnoIzrazavanje(){const q=[];
[["snijeg","bijel"],["sunce","toplo"],["limun","kiseo"],["med","sladak"],["noć","tamna"],["more","plavo"],["trava","zelena"],["led","hladan"],["pijesak","vruć"],["mlijeko","bijelo"]].map(([i,o])=>[`Koji pridjev najbolje opisuje riječ "${i}"?`,o]).forEach(([p,o])=>{q.push({type:"choice",difficulty:2,question:p,answers:sh([o,...wf(["bijel","toplo","kiseo","sladak","tamna","plavo","zelena","hladan","vrući","bijelo"],o)]),correctIndex:-1,_c:o})});
q.push({type:"choice",difficulty:3,question:"Što je sažetak?",answers:["kraći prikaz glavnog","duži tekst","popis imena","pjesma"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Koji su dijelovi pisma?",answers:["datum, pozdrav, tekst, potpis","samo tekst","naslov i kraj","pitanje i odgovor"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Čemu služi opis?",answers:["stvaranje slike riječima","pričanje priče","pisanje pisma","računanje"],correctIndex:0});
[["1.Ana se probudila. 2.Doručkovala. 3.Otišla u školu.","Da"],["1.Otišao u školu. 2.Probudio se. 3.Obukao se.","Ne"],["1.Uzeo loptu. 2.Otišao u park. 3.Igrao nogomet.","Da"],["1.Pojeo ručak. 2.Došao kući. 3.Oprao ruke.","Ne"]].forEach(([t,c])=>q.push({type:"choice",difficulty:2,question:`Koji je redoslijed pravilan?\n${t}`,answers:["Da","Ne"],correctIndex:c==="Da"?0:1}));
return fix(q).slice(0,210)}

function genBrojevi1000(){const q=[];
for(let n=100;n<=999;n+=47){const s=Math.floor(n/100),d=Math.floor((n%100)/10),j=n%10;q.push({type:"input",difficulty:2,question:`Koliko stotica ima broj ${n}?`,correctAnswer:String(s)});q.push({type:"input",difficulty:2,question:`Koliko desetica ima broj ${n}?`,correctAnswer:String(d)});q.push({type:"input",difficulty:2,question:`Koliko jedinica ima broj ${n}?`,correctAnswer:String(j)})}
for(let i=0;i<30;i++){const a=(i*73+100)%900+100,b=(i*51+200)%900+100;if(a===b)continue;q.push({type:"choice",difficulty:2,question:`${a} ${CIRCLE} ${b}`,answers:ZNAKOVI_USP,correctIndex:a<b?0:1})}
for(let n=123;n<=987;n+=73){q.push({type:"input",difficulty:3,question:`Koliko je ${n} zaokruženo na desetice?`,correctAnswer:String(Math.round(n/10)*10)});q.push({type:"input",difficulty:3,question:`Koliko je ${n} zaokruženo na stotice?`,correctAnswer:String(Math.round(n/100)*100)})}
for(let s=100;s<=800;s+=150)q.push({type:"input",difficulty:2,question:`Koji broj nastavlja niz: ${s}, ${s+100}, ${s+200}, ___?`,correctAnswer:String(s+300)});
for(let s=5;s<=50;s+=9)q.push({type:"input",difficulty:2,question:`Koji broj nastavlja niz: ${s}, ${s+5}, ${s+10}, ___?`,correctAnswer:String(s+15)});
return fix(q).slice(0,210)}

function genZbrOduz1000(){const q=[];
for(let a=100;a<=900;a+=100)for(let b=100;b<=1000-a;b+=100)q.push({type:"input",difficulty:1,question:`Koliko je ${a} + ${b}?`,correctAnswer:String(a+b)});
q.push(...mathCombi("+",{a:[100,900,47],b:[50,800,53]},(a,b,r)=>r<=1000,60));
q.push(...mathCombi("-",{a:[200,999,41],b:[50,500,37]},(a,b,r)=>r>=0,60));
q.push(...storyProb("+",{a:[100,500],b:[50,300]},25));
q.push(...storyProb("-",{a:[200,600],b:[50,200]},25));
return fix(q).slice(0,210)}

function genMnozDijel3(){const q=[];
q.push(...mathCombi("*",{a:[2,10,1],b:[1,10,1]},(a,b,r)=>r<=100,90));
for(let a=2;a<=10;a++)for(let b=1;b<=10;b++)q.push({type:"input",difficulty:a<=5?2:3,question:`Koliko je ${a*b} ÷ ${a}?`,correctAnswer:String(b)});
q.push(...storyProb("*",{a:[2,8],b:[2,8]},20));
q.push(...storyProb("/",{a:[20,80],b:[2,8]},15));
for(let a=2;a<=10;a++)for(let b=2;b<=5;b++)q.push({type:"input",difficulty:4,question:`Koji broj dolazi na prazno mjesto: ${a} × ___ = ${a*b}?`,correctAnswer:String(b)});
return fix(q).slice(0,210)}

function genGeometrijaMjerenje3(){const q=[];
for(let a=2;a<=10;a++){q.push({type:"input",difficulty:2,question:`Koliki je opseg kvadrata sa stranicom ${a} cm?`,correctAnswer:String(4*a)})}
for(let a=2;a<=8;a++)for(let b=a+1;b<=10;b++){q.push({type:"input",difficulty:2,question:`Koliki je opseg pravokutnika stranica ${a} cm i ${b} cm?`,correctAnswer:String(2*(a+b))})}
[["1 m","100","cm"],["1 km","1000","m"],["1 kg","1000","g"],["1 L","1000","mL"],["1 h","60","min"],["1 min","60","s"]].forEach(([iz,v,j])=>{q.push({type:"input",difficulty:2,question:`Koliko je to ${j}? Izraz glasi ${iz}.`,correctAnswer:v});const r=cfc(parseInt(v),Math.max(parseInt(v)-50,1),parseInt(v)+50);q.push({type:"choice",difficulty:2,question:`Koliko je to ${j}? Izraz glasi ${iz}.`,answers:r.answers,correctIndex:r.correctIndex})});
q.push({type:"choice",difficulty:2,question:"Koliko stupnjeva ima pravi kut?",answers:["45°","90°","180°","360°"],correctIndex:1});
q.push({type:"choice",difficulty:2,question:"Kakav je kut manji od 90°?",answers:["<90°","=90°",">90°","=180°"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Kakav je kut veći od 90°, a manji od 180°?",answers:["<90°","=90°",">90° i <180°","=180°"],correctIndex:2});
q.push({type:"input",difficulty:2,question:"Koliko stupnjeva ima pravi kut?",correctAnswer:"90"});
return fix(q).slice(0,210)}

function genZavicajKarta(){const q=[];
q.push({type:"choice",difficulty:1,question:"Koje su glavne strane svijeta?",answers:["2","4","6","8"],correctIndex:1});
q.push({type:"choice",difficulty:2,question:"Koje su četiri glavne strane svijeta?",answers:["S,J,I,Z","gore,dolje,L,D","A,B,C,D","1,2,3,4"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Čemu služi mjerilo na zemljovidu?",answers:["omjer karta/stvarnost","boja","naziv grada","papir"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što na zemljovidu označava smeđa boja?",answers:["planine","vodu","nizine","gradove"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što na zemljovidu označava plava boja?",answers:["planine","vodu","nizine","gradove"],correctIndex:1});
q.push({type:"choice",difficulty:2,question:"Što na zemljovidu označava zelena boja?",answers:["planine","vodu","nizine/šume","gradove"],correctIndex:2});
q.push({type:"choice",difficulty:2,question:"Što je reljef?",answers:["oblik površine","biljka","instrument","životinja"],correctIndex:0});
[["nizina","ravan teren"],["brežuljak","blago uzdignut"],["planina","visoko uzdignut"],["dolina","udubljenje"]].forEach(([r,o])=>q.push({type:"choice",difficulty:3,question:`Koji je ovo pjesnički izraz? "${o}"`,answers:sh([r,...wf(["nizina","brežuljak","planina","dolina"],r)]),correctIndex:-1,_c:r}));
q.push({type:"choice",difficulty:2,question:"Što je zavičaj?",answers:["kraj u kojem živimo","strana država","planet","kontinent"],correctIndex:0});
return fix(q).slice(0,210)}

function genTloVodaZrak(){const q=[];
q.push({type:"choice",difficulty:2,question:"Što je tlo?",answers:["minerali,voda,zrak,humus","samo kamenje","samo pijesak","samo voda"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što je humus?",answers:["razgrađeni ostaci","vrsta vode","biljka","kamen"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Koliko agregatnih stanja ima voda?",answers:["tekuće,kruto,plinovito","toplo,hladno,mlako","čisto,prljavo,mutno","slano,slatko"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Na kojoj se temperaturi voda smrzava?",answers:["0°C","10°C","50°C","100°C"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Na kojoj temperaturi voda ključa?",answers:["0°C","50°C","100°C","200°C"],correctIndex:2});
q.push({type:"input",difficulty:2,question:"Na kojoj se temperaturi voda smrzava?",correctAnswer:"0"});
q.push({type:"input",difficulty:2,question:"Na kojoj temperaturi voda ključa?",correctAnswer:"100"});
q.push({type:"choice",difficulty:2,question:"Koji plin iz zraka trebamo za disanje?",answers:["kisik","dušik","CO₂","vodik"],correctIndex:0});
q.push({type:"choice",difficulty:3,question:"Kojeg plina ima najviše u zraku?",answers:["kisik","dušik","CO₂","vodik"],correctIndex:1});
q.push({type:"choice",difficulty:2,question:"Što najviše onečišćuje zrak?",answers:["ispušni plinovi","biljke","kiša","oblaci"],correctIndex:0});
q.push({type:"choice",difficulty:3,question:"Kako se zove stalno kruženje vode u prirodi?",answers:["ispar.→oblak→padavina→otjecanje","pad.→ispar.→otjecanje","oblak→otjec.→pad.","otjec.→pad.→oblak"],correctIndex:0});
return fix(q).slice(0,210)}

function genBiljkeZivotinje3(){const q=[];
[["jelen","biljožder"],["vuk","mesožder"],["medvjed","svežder"],["lisica","mesožder"],["zec","biljožder"],["vjeverica","biljožder"],["sova","mesožder"],["divlja svinja","svežder"],["orao","mesožder"],["jež","svežder"],["srna","biljožder"],["kuna","mesožder"]].forEach(([z,t])=>q.push({type:"choice",difficulty:2,question:`Čime se hrani "${z}"?`,answers:["biljožder","mesožder","svežder"],correctIndex:t==="biljožder"?0:t==="mesožder"?1:2}));
[["hrast","stablo"],["bor","stablo"],["tratinčica","cvijet"],["maslačak","cvijet"],["kupina","grm"],["šipak","grm"],["smreka","stablo"],["ljubičica","cvijet"],["lipa","stablo"],["ruža","grm"]].forEach(([b,t])=>q.push({type:"choice",difficulty:2,question:`Kakva je biljka "${b}"?`,answers:["stablo","cvijet","grm","trava"],correctIndex:["stablo","cvijet","grm","trava"].indexOf(t)}));
q.push({type:"choice",difficulty:2,question:"Što je biljkama potrebno za život?",answers:["sunce,vodu,tlo,zrak","samo vodu","samo sunce","samo tlo"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što je životinjama potrebno za život?",answers:["hranu,vodu,zrak,sklonište","samo hranu","samo vodu","samo sklonište"],correctIndex:0});
q.push({type:"choice",difficulty:3,question:"Što je hranidbeni lanac?",answers:["trava→zec→lisica","lisica→zec→trava","zec→trava→lisica","trava→lisica→zec"],correctIndex:0});
q.push({type:"choice",difficulty:3,question:"Koji je hranidbeni lanac pravilno složen?",answers:["biljka→kukac→žaba→zmija","zmija→žaba→kukac→biljka","kukac→biljka→zmija→žaba","žaba→zmija→biljka→kukac"],correctIndex:0});
// šumske vs livadne
[["jelen","šuma"],["zec","livada"],["vjeverica","šuma"],["leptir","livada"],["medvjed","šuma"],["pčela","livada"],["sova","šuma"],["skakavac","livada"]].forEach(([z,s])=>q.push({type:"choice",difficulty:2,question:`Gdje živi "${z}"?`,answers:["šuma","livada","more","grad"],correctIndex:["šuma","livada","more","grad"].indexOf(s)}));
return fix(q).slice(0,210)}

function genGospodarskeDjelatnosti(){const q=[];
const djel=[["poljoprivreda","uzgoj biljaka i životinja"],["ribarstvo","lov i uzgoj ribe"],["šumarstvo","briga o šumama"],["turizam","putovanje i odmor"],["industrija","proizvodnja u tvornicama"],["trgovina","kupovina i prodaja"],["obrt","ručna izrada proizvoda"],["promet","prijevoz ljudi i robe"],["građevinarstvo","gradnja zgrada i cesta"]];
const sd=djel.map(x=>x[0]);
djel.forEach(([d,o])=>{q.push({type:"choice",difficulty:2,question:`Koji je ovo pjesnički izraz? "${o}"`,answers:sh([d,...wf(sd,d)]),correctIndex:-1,_c:d});q.push({type:"input",difficulty:3,question:`Kojoj djelatnosti pripada ovaj opis? "${o}"`,correctAnswer:d})});
// Obrnuto
djel.forEach(([d,o])=>{q.push({type:"choice",difficulty:3,question:`Čime se bavi djelatnost "${d}"?`,answers:sh([o,...wf(djel.map(x=>x[1]),o)]),correctIndex:-1,_c:o})});
q.push({type:"choice",difficulty:2,question:"Što dobivamo s farme?",answers:["mlijeko, jaja, meso","automobili","računala","odjeća"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što se radi u tvornici?",answers:["uzgajaju biljke","proizvode stvari","love ribe","brinu o šumama"],correctIndex:1});
return fix(q).slice(0,210)}

function genKulturnaBastina(){const q=[];
q.push({type:"choice",difficulty:2,question:"Što je kulturna baština?",answers:["vrijednosti od predaka","hrana","matematika","životinja"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Čemu služi muzej?",answers:["čuvanje i izlaganje predmeta","škola","bolnica","tvornica"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što je običaj?",answers:["ponašanje kroz generacije","biljka","zadatak","instrument"],correctIndex:0});
[["Božić","zima"],["Uskrs","proljeće"],["Svi sveti","jesen"],["Fašnik","zima"]].forEach(([ob,doba])=>{const S=["proljeće","ljeto","jesen","zima"];q.push({type:"choice",difficulty:2,question:`U koje godišnje doba radimo ovo: "${ob}"?`,answers:S,correctIndex:S.indexOf(doba)})});
q.push({type:"choice",difficulty:2,question:"Što je tradicijska nošnja?",answers:["odjeća naših predaka","moderna odjeća","školska uniforma","sportska odjeća"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što čuvamo u muzeju?",answers:["stare predmete i umjetnine","hranu","životinje","automobile"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Čemu služi knjižnica?",answers:["posuđivanje knjiga","kupovinu hrane","gledanje filmova","sport"],correctIndex:0});
return fix(q).slice(0,210)}

const GEN_MAP={hrvatski:[genVrsteRijeci,genGramatikaPravopis,genKnjizevniTekst,genJezicnoIzrazavanje],matematika:[genBrojevi1000,genZbrOduz1000,genMnozDijel3,genGeometrijaMjerenje3],priroda:[genZavicajKarta,genTloVodaZrak,genBiljkeZivotinje3,genGospodarskeDjelatnosti,genKulturnaBastina]};
async function seed(){let pogreska=false;console.log(`\n🌱 SEED ${GRADE}. razred\n`);const uri=process.env.MONGODB_URI||process.env.MONGO_URI;const client=new MongoClient(uri);try{await client.connect();const dbName=process.env.DB_NAME||(()=>{try{return new URL(uri).pathname.replace(/^\//,'')||'ucilica'}catch{return'ucilica'}})();const db=client.db(dbName);console.log(`🔗 ${db.databaseName}`);await db.collection("questions").deleteMany({grade:GRADE});await db.collection("topics").deleteMany({grade:GRADE});await db.collection("subjects").deleteMany({grade:GRADE});let t=0;for(const s of subjects){const sr=await db.collection("subjects").insertOne({...s,grade:GRADE,isActive:true,createdAt:new Date()});const si=sr.insertedId;console.log(`📘 ${s.icon} ${s.name}`);const gs=GEN_MAP[s.slug],ts=topicsDef[s.slug];for(let i=0;i<ts.length;i++){const rq=gs[i]();const tr=await db.collection("topics").insertOne({...ts[i],grade:GRADE,subject_id:si,isActive:true,createdAt:new Date()});const ti=tr.insertedId;const docs=rq.map(qq=>({type:qq.type,difficulty:qq.difficulty||1,question:qq.question,visual:qq.visual||"",hint:qq.hint||"",answers:qq.answers||[],correctIndex:typeof qq.correctIndex==="number"?qq.correctIndex:undefined,correctAnswer:qq.correctAnswer||undefined,...(qq.konstrukt?{konstrukt:qq.konstrukt}:{}),...(qq.prihvatljivi?.length?{prihvatljivi:qq.prihvatljivi}:{}),...(qq.type==="match"?{pairs:qq.pairs}:{}),grade:GRADE,subject_id:si,topic_id:ti,gik:buildQuestionMetadata({topic:{...ts[i],grade:GRADE},subject:null,difficulty:qq.difficulty||1}),isActive:true,createdAt:new Date()}));if(docs.length)await db.collection("questions").insertMany(docs);t+=docs.length;console.log(`   ${ts[i].icon} ${ts[i].name}: ${docs.length}`)}}console.log(`\n✅ ${t} pitanja`)}catch(e){console.error("❌",e);pogreska=true}finally{await client.close();process.exit(pogreska?1:0)}}
if(require.main===module){seed()}
module.exports={genVrsteRijeci,genGramatikaPravopis,genKnjizevniTekst,genJezicnoIzrazavanje,genBrojevi1000,genZbrOduz1000,genMnozDijel3,genGeometrijaMjerenje3,genZavicajKarta,genTloVodaZrak,genBiljkeZivotinje3,genGospodarskeDjelatnosti,genKulturnaBastina};
