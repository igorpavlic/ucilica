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
const {wrapGenerator,storedExtras}=require("../services/pedagogyReview");
const obogacenje=require("./obogacenje");
const GRADE=3;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const pickN=(a,n)=>sh([...a]).slice(0,n);
const wf=(pool,c,n=3)=>sh(pool.filter(x=>x!==c)).slice(0,n);

const subjects=[{name:"Hrvatski jezik",slug:"hrvatski",icon:"📖",color:"#FF6B6B",description:"Vrste riječi, gramatika, književnost",order:1},{name:"Matematika",slug:"matematika",icon:"🔢",color:"#60A5FA",description:"Brojevi do 1000, množenje, dijeljenje, geometrija",order:2},{name:"Priroda i društvo",slug:"priroda",icon:"🌿",color:"#34D399",description:"Zavičaj, karta, biljke, životinje, tlo, voda",order:3}];
const topicsDef={
hrvatski:[{name:"Vrste riječi",slug:"vrste-rijeci",icon:"📝",order:1},{name:"Gramatika i pravopis",slug:"gramatika-pravopis",icon:"✏️",order:2},{name:"Književni tekstovi",slug:"knjizevni-tekst",icon:"📚",order:3},{name:"Jezično izražavanje",slug:"jezicno-izrazavanje",icon:"💬",order:4},{name:"Čitanje s razumijevanjem",slug:"citanje-3",icon:"📗",order:5}],
matematika:[{name:"Brojevi do 10 000",slug:"brojevi-1000",icon:"🔢",order:1},{name:"Zbrajanje i oduzimanje do 1000",slug:"zbr-oduz-1000",icon:"➕",order:2},{name:"Množenje i dijeljenje",slug:"mnoz-dijel-3",icon:"✖️",order:3},{name:"Geometrija i mjerenje",slug:"geometrija-mjerenje-3",icon:"📐",order:4},{name:"Podatci i grafovi",slug:"podatci-3",icon:"📊",order:5},{name:"Nepoznati broj",slug:"nepoznati-3",icon:"❓",order:6}],
priroda:[{name:"Zavičaj i karta",slug:"zavicaj-karta",icon:"🗺️",order:1},{name:"Tlo, voda, zrak",slug:"tlo-voda-zrak",icon:"🌍",order:2},{name:"Biljke i životinje zavičaja",slug:"biljke-zivotinje-3",icon:"🌳",order:3},{name:"Gospodarske djelatnosti",slug:"gospodarske-djelatnosti",icon:"🏭",order:4},{name:"Kulturna baština",slug:"kulturna-bastina",icon:"🏛️",order:5}]};

const PAR_VRSTA=[["škola","imenica"],["trčati","glagol"],["velik","pridjev"],
["knjiga","imenica"],["pisati","glagol"],["lijep","pridjev"],["sunce","imenica"],
["plivati","glagol"],["brz","pridjev"],["grad","imenica"],["učiti","glagol"],["hladan","pridjev"]];
function genVrsteRijeci(){const q=[];
q.push(...spajanje(PAR_VRSTA,"Spoji riječ s vrstom riječi:",{koliko:4,komada:10,difficulty:3}));
const im=["škola","prijatelj","sunce","sreća","zemlja","knjiga","učenik","rijeka","more","drvo","cvijet","oblak","kiša","grad","selo"];
const gl=["trčati","pisati","čitati","učiti","plivati","sanjati","raditi","putovati","pjevati","plesati","spavati","jesti","hodati","crtati","skakati"];
const pr=["velik","lijep","brz","pametan","sretan","tužan","crven","hladan","topao","star","mlad","visok","tih","čist","mekan"];
const sve=[...im,...gl,...pr];
const vrsta=w=>im.includes(w)?"imenica":gl.includes(w)?"glagol":"pridjev";

// 1) Izravna klasifikacija — ograničen broj, ne cijeli fond.
pickN(sve,15).forEach(w=>q.push({type:"choice",difficulty:1,question:`Kojoj vrsti riječi pripada "${w}"?`,answers:sh(["imenica","glagol","pridjev"]),correctIndex:-1,_c:vrsta(w)}));

// 2) Prepoznavanje po ulozi/značenju.
[
  ["Koja riječ imenuje biće, predmet ili pojavu?",pick(im),[pick(gl),pick(pr)]],
  ["Koja riječ označava radnju?",pick(gl),[pick(im),pick(pr)]],
  ["Koja riječ opisuje kakvo je nešto?",pick(pr),[pick(im),pick(gl)]]
].forEach(([pit,c,wr])=>q.push({type:"choice",difficulty:1,question:pit,answers:sh([c,...wr]),correctIndex:-1,_c:c}));

// 3) Vrsta riječi u rečenici — riječ se promatra u stvarnom kontekstu.
[
  ["Mala ptica pjeva.","ptica","imenica"],["Mala ptica pjeva.","pjeva","glagol"],["Mala ptica pjeva.","mala","pridjev"],
  ["Brzi vlak prolazi gradom.","vlak","imenica"],["Brzi vlak prolazi gradom.","prolazi","glagol"],["Brzi vlak prolazi gradom.","brzi","pridjev"],
  ["Hladna kiša pada.","kiša","imenica"],["Hladna kiša pada.","pada","glagol"],["Hladna kiša pada.","hladna","pridjev"]
].forEach(([r,w,c])=>q.push({type:"choice",difficulty:2,question:`Koja je vrsta riječi "${w}" u rečenici "${r}"?`,answers:["imenica","glagol","pridjev"],correctIndex:c==="imenica"?0:c==="glagol"?1:2}));

// 4) Odabir riječi zadane vrste za dovršavanje rečenice.
[
  ["Na grani sjedi ___.","imenica","ptica",["pjeva","mala"]],
  ["Pas brzo ___.","glagol","trči",["pas","brz"]],
  ["To je ___ kuća.","pridjev","velika",["kuća","stoji"]],
  ["U vrtu raste ___.","imenica","cvijet",["zelen","raste"]],
  ["Djeca veselo ___.","glagol","plešu",["djeca","vesela"]],
  ["Nosim ___ torbu.","pridjev","tešku",["torba","nosim"]]
].forEach(([r,v,c,wr])=>q.push({type:"choice",difficulty:2,question:`Koja ${v} najbolje dovršava rečenicu "${r}"?`,answers:sh([c,...wr]),correctIndex:-1,_c:c}));

// 5) Skupovi riječi.
[
  [["knjiga","rijeka","učenik"],"imenice"],[["čitati","plivati","učiti"],"glagoli"],[["hladan","brz","veseo"],"pridjevi"]
].forEach(([a,c])=>q.push({type:"choice",difficulty:2,question:`Kojoj vrsti pripadaju sve riječi: ${a.join(", ")}?`,answers:["imenice","glagoli","pridjevi"],correctIndex:c==="imenice"?0:c==="glagoli"?1:2}));

// 6) Uljez — po jedan smislen zadatak za svaku vrstu umjesto 30 kopija.
q.push({type:"choice",difficulty:2,question:"Koja riječ NE pripada skupini imenica?",answers:sh([pick(gl),...pickN(im,3)]),correctIndex:-1,_c:null});
q[q.length-1]._c=q[q.length-1].answers.find(x=>gl.includes(x));
q.push({type:"choice",difficulty:2,question:"Koja riječ NE pripada skupini glagola?",answers:sh([pick(im),...pickN(gl,3)]),correctIndex:-1,_c:null});
q[q.length-1]._c=q[q.length-1].answers.find(x=>im.includes(x));
q.push({type:"choice",difficulty:2,question:"Koja riječ NE pripada skupini pridjeva?",answers:sh([pick(im),...pickN(pr,3)]),correctIndex:-1,_c:null});
q[q.length-1]._c=q[q.length-1].answers.find(x=>im.includes(x));

// 7) Jednina / množina ostaje kao zasebna gramatička vještina.
[["stolovi","množina"],["knjiga","jednina"],["djeca","množina"],["pas","jednina"],["gradovi","množina"],["sunce","jednina"],["rijeke","množina"],["selo","jednina"]]
.forEach(([w,br])=>q.push({type:"choice",difficulty:2,question:`Riječ "${w}" označava jedno ili više?`,answers:["jedno","više"],correctIndex:br==="jednina"?0:1}));
return fix(q).slice(0,210)}

function genGramatikaPravopis(){const q=[];
[["hrvatska","Hrvatska"],["zagreb","Zagreb"],["marko","Marko"],["sava","Sava"],["jadransko more","Jadransko more"],["božić","Božić"],["uskrs","Uskrs"],["europa","Europa"],["dinamo","Dinamo"],["drava","Drava"]].forEach(([w,c])=>{q.push({type:"choice",difficulty:2,question:`Koji je zapis pravilan?`,answers:[w,c],correctIndex:1});q.push({type:"input",difficulty:3,question:`Kako se pravilno piše "${w}"? ${w.includes(" ")?"Napiši obje riječi.":"Napiši jednu riječ."}`,konstrukt:"velikoSlovo",correctAnswer:c})});
[["čekati","č"],["ćup","ć"],["čitati","č"],["kuća","ć"],["čaj","č"],["noć","ć"],["ključ","č"],["mačka","č"],["kolač","č"],["čokolada","č"],["srećo","ć"],["otac","c"],["peć","ć"],["liječnik","č"],["tečaj","č"]].forEach(([w,g])=>{if(g==="č"||g==="ć")q.push({type:"choice",difficulty:3,question:`Koji se glas nalazi u riječi "${w}"?`,answers:["č","ć"],correctIndex:g==="č"?0:1})});
[["mlijeko","ije"],["mjesto","je"],["bijelo","ije"],["vjera","je"],["dijete","ije"],["pjesma","je"],["lijep","ije"],["vjeverica","je"],["rijeka","ije"],["cvijet","ije"],["bjelina","je"],["zvijezda","ije"]].forEach(([w,r])=>q.push({type:"choice",difficulty:3,question:`Koji se glas nalazi u riječi "${w}"?`,answers:["ije","je"],correctIndex:r==="ije"?0:1}));
q.push({type:"choice",difficulty:2,question:"Koja je rečenica pravilno napisana?",answers:["Ana živi u Zagrebu.","ana živi u zagrebu."],correctIndex:0});
q.push({type:"choice",difficulty:2,question:`Koju riječ u rečenici "Sutra putujemo u split." treba napisati velikim početnim slovom?`,answers:["Sutra","putujemo","Split","u"],correctIndex:2});
q.push({type:"choice",difficulty:3,question:"Dopuni riječ pravilnim glasom: ku_a",answers:["č","ć"],correctIndex:1});
q.push({type:"choice",difficulty:3,question:"Dopuni riječ pravilnim skupom glasova: ml__ko",answers:["ije","je"],correctIndex:0});
q.push({type:"choice",difficulty:3,question:"U kojoj su skupini sve riječi pravilno napisane?",answers:["kuća, čaj, riječ","kuča, ćaj, rijeć","kuća, ćaj, riječ"],correctIndex:0});
return fix(q).slice(0,210)}

function genKnjizevniTekst(){const q=[];
[["bajka","priča s čarobnim elementima"],["basna","priča s životinjama i poukom"],["pjesma","tekst u stihovima"],["priča","kratki pripovjedni tekst"],["roman","dugi pripovjedni tekst"],["legenda","priča s temeljima u stvarnosti"],["mit","priča o bogovima"]].forEach(([v,o])=>{q.push({type:"choice",difficulty:2,question:`Kojoj književnoj vrsti pripada ovaj opis? "${o}"`,answers:sh([v,...wf(["bajka","basna","pjesma","priča","roman","legenda","mit"],v)]),correctIndex:-1,_c:v});q.push({type:"input",difficulty:3,question:`Kojoj književnoj vrsti pripada ovaj opis? "${o}"`,correctAnswer:v})});
q.push({type:"choice",difficulty:2,question:"Koji su dijelovi priče?",answers:["uvod, zaplet, rasplet","početak, sredina","naslov, tekst","pitanje, odgovor"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što je uvod u priči?",answers:["dio u kojem upoznajemo likove i mjesto radnje", "dio u kojem nastaje problem ili sukob", "najnapetiji dio priče", "dio u kojem se problem riješi"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što je zaplet u priči?",answers:["dio u kojem upoznajemo likove i mjesto radnje", "dio u kojem nastaje problem ili sukob", "najnapetiji dio priče", "dio u kojem se problem riješi"],correctIndex:1});
q.push({type:"choice",difficulty:2,question:"Što je vrhunac u priči?",answers:["dio u kojem upoznajemo likove i mjesto radnje", "dio u kojem nastaje problem ili sukob", "najnapetiji dio priče", "dio u kojem se problem riješi"],correctIndex:2});
q.push({type:"choice",difficulty:2,question:"Što je rasplet u priči?",answers:["dio u kojem upoznajemo likove i mjesto radnje", "dio u kojem nastaje problem ili sukob", "najnapetiji dio priče", "dio u kojem se problem riješi"],correctIndex:3});
q.push({type:"choice",difficulty:3,question:"Po čemu najlakše prepoznajemo usporedbu?",answers:["po riječima kao ili poput","po naslovu pjesme","po broju redaka u kitici","po točki na kraju rečenice"],correctIndex:0});
q.push({type:"choice",difficulty:3,question:`Je li izraz "Brz kao vjetar" usporedba?`,answers:["Da","Ne"],correctIndex:0});
q.push({type:"choice",difficulty:3,question:`Je li izraz "Lijep kao slika" usporedba?`,answers:["Da","Ne"],correctIndex:0});
[["dom-grom","da"],["kuća-škola","ne"],["sat-brat","da"],["drvo-more","ne"],["cvijet-svijet","da"],["dan-san","da"],["knjiga-voda","ne"],["mrak-vlak","da"]].forEach(([p,r])=>q.push({type:"choice",difficulty:2,question:`Rimuju li se riječi "${p}"?`,answers:["Da","Ne"],correctIndex:r==="da"?0:1}));
q.push({type:"choice",difficulty:2,question:"Što je stih?",answers:["jedan redak pjesme","skupina od nekoliko redaka","riječ koja se rimuje s drugom","ime osobe koja je napisala pjesmu"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što je strofa?",answers:["skupina stihova","jedan redak pjesme","dvije riječi koje se rimuju","naslov na vrhu pjesme"],correctIndex:0});
return fix(q).slice(0,210)}

function genJezicnoIzrazavanje(){const q=[];
[["snijeg","bijel"],["sunce","toplo"],["limun","kiseo"],["med","sladak"],["noć","tamna"],["more","plavo"],["trava","zelena"],["led","hladan"],["pijesak","vruć"],["mlijeko","bijelo"]].map(([i,o])=>[`Koji pridjev najbolje opisuje riječ "${i}"?`,o]).forEach(([p,o])=>{q.push({type:"choice",difficulty:2,question:p,answers:sh([o,...wf(["bijel","toplo","kiseo","sladak","tamna","plavo","zelena","hladan","vrući","bijelo"],o)]),correctIndex:-1,_c:o})});
q.push({type:"choice",difficulty:3,question:"Što je sažetak?",answers:["kraći prikaz glavnog","duži tekst","popis imena","pjesma"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Koji su dijelovi pisma?",answers:["datum, pozdrav, tekst, potpis","samo tekst","naslov i kraj","pitanje i odgovor"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Čemu služi opis?",answers:["stvaranje slike riječima","pričanje priče","pisanje pisma","računanje"],correctIndex:0});
[["1.Ana se probudila. 2.Doručkovala. 3.Otišla u školu.","Da"],["1.Otišao u školu. 2.Probudio se. 3.Obukao se.","Ne"],["1.Uzeo loptu. 2.Otišao u park. 3.Igrao nogomet.","Da"],["1.Pojeo ručak. 2.Došao kući. 3.Oprao ruke.","Ne"]].forEach(([t,c])=>q.push({type:"choice",difficulty:2,question:`Koji je redoslijed pravilan?\n${t}`,answers:["Da","Ne"],correctIndex:c==="Da"?0:1}));
return fix(q).slice(0,210)}

function genBrojevi1000(){const q=[];
// OŠ A.3.1: brojevi do 10 000 — čitanje, uspoređivanje, mjesne vrijednosti i rastavljanje.
for(let n=1000;n<=9999;n+=379){const t=Math.floor(n/1000),s=Math.floor((n%1000)/100),d=Math.floor((n%100)/10),j=n%10;q.push({type:"input",difficulty:2,question:`Koliko tisućica ima broj ${n}?`,correctAnswer:String(t)});q.push({type:"input",difficulty:2,question:`Koja je znamenka stotica u broju ${n}?`,correctAnswer:String(s)});q.push({type:"input",difficulty:2,question:`Koja je znamenka desetica u broju ${n}?`,correctAnswer:String(d)});q.push({type:"input",difficulty:2,question:`Koja je znamenka jedinica u broju ${n}?`,correctAnswer:String(j)});q.push({type:"input",difficulty:3,question:`Napiši broj ${n} kao zbroj tisućica, stotica, desetica i jedinica.`,correctAnswer:`${t*1000} + ${s*100} + ${d*10} + ${j}`})}
for(let i=0;i<45;i++){const a=1000+((i*673)%9000),b=1000+((i*419+137)%9000);if(a===b)continue;q.push({type:"choice",difficulty:2,question:`Koji znak ide između brojeva ${a} ${CIRCLE} ${b}?`,answers:ZNAKOVI_USP,correctIndex:a<b?0:1})}
for(let s=1200;s<=7200;s+=1200)q.push({type:"input",difficulty:2,question:`Koji broj nastavlja niz: ${s}, ${s+1000}, ${s+2000}, ___?`,correctAnswer:String(s+3000)});
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
for(let a=2;a<=10;a++){q.push({type:"input",difficulty:2,question:`Kvadrat ima četiri stranice duljine ${a} cm. Koliki je njegov opseg?`,correctAnswer:String(4*a)})}
for(let a=2;a<=8;a++)for(let b=a+1;b<=10;b++){q.push({type:"input",difficulty:2,question:`Pravokutnik ima stranice ${a} cm i ${b} cm. Koliki je zbroj duljina svih njegovih stranica?`,correctAnswer:String(2*(a+b))})}
[["1 m","100","cm"],["1 km","1000","m"],["1 kg","1000","g"],["1 L","10","dL"],["1 h","60","min"],["1 min","60","s"]].forEach(([iz,v,j])=>{q.push({type:"input",difficulty:2,question:`Dopuni: ${iz} = ___ ${j}.`,correctAnswer:v});const r=cfc(parseInt(v),Math.max(parseInt(v)-10,1),parseInt(v)+10);q.push({type:"choice",difficulty:2,question:`Dopuni: ${iz} = ___ ${j}.`,answers:r.answers,correctIndex:r.correctIndex})});
const pojmovi=[["dužina","dio pravca omeđen dvjema krajnjim točkama"],["pravac","ravna crta koja se proteže neograničeno u oba smjera"],["polupravac","dio pravca koji ima početnu točku i proteže se u jednom smjeru"],["usporedni pravci","pravci u ravnini koji se ne sijeku"],["okomiti pravci","pravci koji se sijeku pod pravim kutom"]];
pojmovi.forEach(([c,o])=>q.push({type:"choice",difficulty:2,question:`Koji pojam odgovara opisu: "${o}"?`,answers:sh([c,...wf(pojmovi.map(x=>x[0]),c)]),correctIndex:-1,_c:c}));
return fix(q).slice(0,210)}

function genZavicajKarta(){const q=[];
q.push({type:'choice',difficulty:3,passage:'Na jednostavnoj karti škola je u sredini, knjižnica je iznad škole, a park desno od škole. Sjever je na vrhu karte.',question:'Što je sjeverno od škole?',answers:['knjižnica','park','škola'],correctIndex:0,objasnjenje:'Na karti je sjever gore, a knjižnica je iznad škole.'});
q.push({type:'choice',difficulty:3,passage:'Na jednostavnoj karti škola je u sredini, knjižnica je iznad škole, a park desno od škole. Sjever je na vrhu karte.',question:'Što je istočno od škole?',answers:['knjižnica','park','škola'],correctIndex:1,objasnjenje:'Istok je desno na ovoj karti, gdje se nalazi park.'});
q.push({type:"choice",difficulty:1,question:"Koliko je glavnih strana svijeta?",answers:["2","4","6","8"],correctIndex:1,objasnjenje:"Glavne su strane svijeta sjever, jug, istok i zapad — ukupno četiri."});
q.push({type:"choice",difficulty:2,question:"Koje su četiri glavne strane svijeta?",answers:["S,J,I,Z","gore,dolje,L,D","A,B,C,D","1,2,3,4"],correctIndex:0});
// Premješteno iz 2. razreda: sustavni rad sa stranama svijeta pripada 3. razredu.
[["sjever","S"],["jug","J"],["istok","I"],["zapad","Z"]].forEach(([s,k])=>{q.push({type:"input",difficulty:2,question:`Koja je kratica za stranu svijeta "${s}"?`,correctAnswer:k});q.push({type:"input",difficulty:2,question:`Koju stranu svijeta označava kratica "${k}"?`,correctAnswer:s})});
[["sjever","jug"],["jug","sjever"],["istok","zapad"],["zapad","istok"]].forEach(([a,b])=>q.push({type:"choice",difficulty:2,question:`Koja je strana svijeta suprotna strani "${a}"?`,answers:sh(["sjever","jug","istok","zapad"]),correctIndex:-1,_c:b}));
q.push({type:"choice",difficulty:2,question:"Na kojoj strani svijeta Sunce izlazi?",answers:["na istoku","na zapadu","na sjeveru","na jugu"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Na kojoj strani svijeta Sunce zalazi?",answers:["na istoku","na zapadu","na sjeveru","na jugu"],correctIndex:1});
q.push({type:"choice",difficulty:2,question:"Čemu služi mjerilo na zemljovidu?",answers:["omjer karta/stvarnost","boja","naziv grada","papir"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što na zemljovidu označava smeđa boja?",answers:["planine","vodu","nizine","gradove"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što na zemljovidu označava plava boja?",answers:["planine","vodu","nizine","gradove"],correctIndex:1});
q.push({type:"choice",difficulty:2,question:"Što na zemljovidu označava zelena boja?",answers:["planine","vodu","nizine/šume","gradove"],correctIndex:2});
q.push({type:"choice",difficulty:2,question:"Što je reljef?",answers:["oblik površine","biljka","instrument","životinja"],correctIndex:0});
[["nizina","ravan teren"],["brežuljak","blago uzdignut"],["planina","visoko uzdignut"],["dolina","udubljenje"]].forEach(([r,o])=>q.push({type:"choice",difficulty:3,question:`Koji reljefni oblik odgovara opisu: "${o}"?`,answers:sh([r,...wf(["nizina","brežuljak","planina","dolina"],r)]),correctIndex:-1,_c:r}));
q.push({type:"ordering",difficulty:2,question:"Poredaj glavne strane svijeta u smjeru kazaljke na satu, počevši od sjevera.",items:["sjever","istok","jug","zapad"],objasnjenje:"Na zemljovidu je sjever gore, istok desno, jug dolje, zapad lijevo."});
q.push({type:"choice",difficulty:2,question:"Što je zavičaj?",answers:["kraj u kojem živimo","strana država","planet","kontinent"],correctIndex:0});
return fix(q).slice(0,210)}

function genTloVodaZrak(){const q=[];
q.push({type:"choice",difficulty:2,question:"Što je tlo?",answers:["minerali,voda,zrak,humus","samo kamenje","samo pijesak","samo voda"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što je humus?",answers:["razgrađeni ostaci","vrsta vode","biljka","kamen"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Koja su tri agregatna stanja vode?",answers:["tekuće, čvrsto i plinovito","toplo, hladno i mlako","čisto, prljavo i mutno","slano, slatko i gorko"],correctIndex:0,objasnjenje:"Voda može biti tekuća, čvrsta (led) i plinovita (vodena para)."});
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
djel.forEach(([d,o])=>{q.push({type:"choice",difficulty:2,question:`Koja gospodarska djelatnost odgovara opisu: "${o}"?`,answers:sh([d,...wf(sd,d)]),correctIndex:-1,_c:d});q.push({type:"input",difficulty:3,question:`Kojoj djelatnosti pripada ovaj opis? "${o}"`,correctAnswer:d})});
// Obrnuto
djel.forEach(([d,o])=>{q.push({type:"choice",difficulty:3,question:`Čime se bavi djelatnost "${d}"?`,answers:sh([o,...wf(djel.map(x=>x[1]),o)]),correctIndex:-1,_c:o})});
q.push({type:"choice",difficulty:2,question:"Što dobivamo s farme?",answers:["mlijeko, jaja, meso","automobili","računala","odjeća"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što se radi u tvornici?",answers:["uzgajaju biljke","proizvode stvari","love ribe","brinu o šumama"],correctIndex:1});
q.push({type:"choice",difficulty:2,question:"Koje zanimanje najčešće povezujemo s liječenjem ljudi?",answers:["liječnik","pekar","stolar","vozač"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Koji proizvod najčešće povezujemo s poljoprivredom?",answers:["pšenicu","računalo","automobil","knjigu"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Koja djelatnost pruža uslugu prijevoza ljudi i robe?",answers:["promet","ratarstvo","ribarstvo","šumarstvo"],correctIndex:0});
return fix(q).slice(0,210)}

function genKulturnaBastina(){const q=[];
q.push({type:"choice",difficulty:2,question:"Što je kulturna baština?",answers:["vrijednosti od predaka","hrana","matematika","životinja"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Čemu služi muzej?",answers:["čuvanje i izlaganje predmeta","škola","bolnica","tvornica"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što je običaj?",answers:["ponašanje kroz generacije","biljka","zadatak","instrument"],correctIndex:0});
[["Božić","zima"],["Uskrs","proljeće"],["Svi sveti","jesen"],["Fašnik","zima"]].forEach(([ob,doba])=>{const S=["proljeće","ljeto","jesen","zima"];q.push({type:"choice",difficulty:2,question:`U koje godišnje doba radimo ovo: "${ob}"?`,answers:S,correctIndex:S.indexOf(doba)})});
q.push({type:"choice",difficulty:2,question:"Što je tradicijska nošnja?",answers:["odjeća naših predaka","odjeća kupljena prošloga tjedna","uniforma koju nose učenici","dres za nogometnu utakmicu"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što čuvamo u muzeju?",answers:["stare predmete i umjetnine","divlje životinje iz šume","nove automobile za prodaju","svježu hranu iz trgovine"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Čemu služi knjižnica?",answers:["posuđivanje knjiga","kupovinu hrane","gledanje filmova","sport"],correctIndex:0});
return fix(q).slice(0,210)}

const REVIEWED_GENERATORS={ genVrsteRijeci:wrapGenerator(genVrsteRijeci), genGramatikaPravopis:wrapGenerator(genGramatikaPravopis), genKnjizevniTekst:wrapGenerator(genKnjizevniTekst), genJezicnoIzrazavanje:wrapGenerator(genJezicnoIzrazavanje), genBrojevi1000:wrapGenerator(genBrojevi1000), genZbrOduz1000:wrapGenerator(genZbrOduz1000), genMnozDijel3:wrapGenerator(genMnozDijel3), genGeometrijaMjerenje3:wrapGenerator(genGeometrijaMjerenje3), genZavicajKarta:wrapGenerator(genZavicajKarta), genTloVodaZrak:wrapGenerator(genTloVodaZrak), genBiljkeZivotinje3:wrapGenerator(genBiljkeZivotinje3), genGospodarskeDjelatnosti:wrapGenerator(genGospodarskeDjelatnosti), genKulturnaBastina:wrapGenerator(genKulturnaBastina), genPodatci3:wrapGenerator(obogacenje.genPodatci3), genNepoznati3:wrapGenerator(obogacenje.genNepoznati3), genCitanje3:wrapGenerator(obogacenje.genCitanje3) };
const GEN_MAP={hrvatski:[REVIEWED_GENERATORS.genVrsteRijeci,REVIEWED_GENERATORS.genGramatikaPravopis,REVIEWED_GENERATORS.genKnjizevniTekst,REVIEWED_GENERATORS.genJezicnoIzrazavanje,REVIEWED_GENERATORS.genCitanje3],matematika:[REVIEWED_GENERATORS.genBrojevi1000,REVIEWED_GENERATORS.genZbrOduz1000,REVIEWED_GENERATORS.genMnozDijel3,REVIEWED_GENERATORS.genGeometrijaMjerenje3,REVIEWED_GENERATORS.genPodatci3,REVIEWED_GENERATORS.genNepoznati3],priroda:[REVIEWED_GENERATORS.genZavicajKarta,REVIEWED_GENERATORS.genTloVodaZrak,REVIEWED_GENERATORS.genBiljkeZivotinje3,REVIEWED_GENERATORS.genGospodarskeDjelatnosti,REVIEWED_GENERATORS.genKulturnaBastina]};
async function seed(){let pogreska=false;console.log(`\n🌱 SEED ${GRADE}. razred\n`);const uri=process.env.MONGODB_URI||process.env.MONGO_URI;const client=new MongoClient(uri);try{await client.connect();const dbName=process.env.DB_NAME||(()=>{try{return new URL(uri).pathname.replace(/^\//,'')||'ucilica'}catch{return'ucilica'}})();const db=client.db(dbName);console.log(`🔗 ${db.databaseName}`);await db.collection("questions").deleteMany({grade:GRADE});await db.collection("topics").deleteMany({grade:GRADE});await db.collection("subjects").deleteMany({grade:GRADE});let t=0;for(const s of subjects){const sr=await db.collection("subjects").insertOne({...s,grade:GRADE,isActive:true,createdAt:new Date()});const si=sr.insertedId;console.log(`📘 ${s.icon} ${s.name}`);const gs=GEN_MAP[s.slug],ts=topicsDef[s.slug];for(let i=0;i<ts.length;i++){const rq=gs[i]();const tr=await db.collection("topics").insertOne({...ts[i],grade:GRADE,subject_id:si,isActive:true,createdAt:new Date()});const ti=tr.insertedId;const docs=rq.map(qq=>({type:qq.type,difficulty:qq.difficulty||1,question:qq.question,visual:qq.visual||"",hint:qq.hint||"",objasnjenje:qq.objasnjenje||"",passage:qq.passage||"",chart:qq.chart||[],answers:qq.answers||[],correctIndex:typeof qq.correctIndex==="number"?qq.correctIndex:undefined,correctAnswer:qq.correctAnswer||undefined,...(qq.konstrukt?{konstrukt:qq.konstrukt}:{}),...(qq.prihvatljivi?.length?{prihvatljivi:qq.prihvatljivi}:{}),...(qq.type==="match"?{pairs:qq.pairs}:{}),...(qq.type==="ordering"?{items:qq.items}:{}),...(qq.type==="true-false"?{correct:qq.correct}:{}),...storedExtras(qq),grade:GRADE,subject_id:si,topic_id:ti,gik:buildQuestionMetadata({topic:{...ts[i],grade:GRADE},subject:null,difficulty:qq.difficulty||1,question:qq}),isActive:true,createdAt:new Date()}));if(docs.length)await db.collection("questions").insertMany(docs);t+=docs.length;console.log(`   ${ts[i].icon} ${ts[i].name}: ${docs.length}`)}}console.log(`\n✅ ${t} pitanja`)}catch(e){console.error("❌",e);pogreska=true}finally{await client.close();process.exit(pogreska?1:0)}}
if(require.main===module){seed()}
module.exports=REVIEWED_GENERATORS;
