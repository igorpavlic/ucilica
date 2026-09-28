/**
 * seed-r4.js — Učilica 4. razred — OBOGAĆENI generatori
 */
require("dotenv").config({path:require("path").join(__dirname,"../.env")});
const{oznake}=require("./jasnoca");
const ZNAKOVI_USP=oznake(["<",">","="]);
const{MongoClient}=require("mongodb");
const{buildQuestionMetadata}=require("../services/gikEngine");
const{N,IF,IM,sh,cfc,rep,fix,EL,CIRCLE}=require("./gen-hrvatski");
const{spajanje}=require("./gen-engine");
const{mathCombi,storyProb,smartChoice,multiFormat,oddOneOut,trueFalse,pick:_pick,pickN:_pickN,wf:_wf}=require("./gen-engine");
const {wrapGenerator}=require("../services/pedagogyReview");
const obogacenje=require("./obogacenje");
const GRADE=4;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const pickN=(a,n)=>sh([...a]).slice(0,n);
const wf=(pool,c,n=3)=>sh(pool.filter(x=>x!==c)).slice(0,n);

const subjects=[{name:"Hrvatski jezik",slug:"hrvatski",icon:"📖",color:"#FF6B6B",description:"Imenice, glagoli, pridjevi, pravopis, književnost",order:1},{name:"Matematika",slug:"matematika",icon:"🔢",color:"#60A5FA",description:"Brojevi do milijun, množenje, dijeljenje, geometrija",order:2},{name:"Priroda i društvo",slug:"priroda",icon:"🌿",color:"#34D399",description:"Hrvatska, krajevi, tijelo, biljke, životinje",order:3}];
const topicsDef={
hrvatski:[{name:"Imenice, glagoli, pridjevi",slug:"vrste-rijeci-4",icon:"📝",order:1},{name:"Pravopis i gramatika",slug:"pravopis-4",icon:"✏️",order:2},{name:"Književnost",slug:"knjizevnost-4",icon:"📚",order:3},{name:"Medijska kultura",slug:"medijska-kultura",icon:"🎬",order:4},{name:"Čitanje s razumijevanjem",slug:"citanje-4",icon:"📗",order:5}],
matematika:[{name:"Brojevi do milijun",slug:"brojevi-milijun",icon:"🔢",order:1},{name:"Pisano zbrajanje i oduzimanje",slug:"pisano-zbr-oduz",icon:"➕",order:2},{name:"Pisano množenje i dijeljenje",slug:"pisano-mnoz-dijel",icon:"✖️",order:3},{name:"Geometrija — kutovi i likovi",slug:"geometrija-kutovi",icon:"📐",order:4},{name:"Površina",slug:"opseg-povrsina",icon:"📏",order:5},{name:"Kvader i kocka",slug:"kvader-kocka",icon:"🧊",order:6},{name:"Podatci i grafovi",slug:"podatci-4",icon:"📊",order:7},{name:"Nepoznati broj",slug:"nepoznati-4",icon:"❓",order:8}],
priroda:[{name:"Prirodni uvjeti života",slug:"uvjeti-zivota",icon:"☀️",order:1},{name:"Krajevi Hrvatske",slug:"krajevi-hr",icon:"🇭🇷",order:2},{name:"Ljudsko tijelo",slug:"ljudsko-tijelo",icon:"🧍",order:3},{name:"Hrvatska — domovina",slug:"hrvatska-domovina",icon:"🏛️",order:4},{name:"Biljke i životinje",slug:"biljke-zivotinje-4",icon:"🌿",order:5}]};

function genVrsteRijeci4(){const q=[];
const imenice=["ljubav","prijateljstvo","sreća","dom","škola","grad","rijeka","planina","more","sloboda","zemlja","sunce","mjesec","zvijezda","oblak","kiša","snijeg","drvo","cvijet","put"];
imenice.forEach(w=>q.push({type:"choice",difficulty:1,question:`Koja je vrsta riječi "${w}"?`,answers:sh(["imenica","glagol","pridjev"]),correctIndex:-1,_c:"imenica"}));
[["čitam","sadašnjost"],["čitao sam","prošlost"],["čitat ću","budućnost"],["pišem","sadašnjost"],["pisao sam","prošlost"],["pisat ću","budućnost"],["trčim","sadašnjost"],["trčao sam","prošlost"],["trčat ću","budućnost"],["učim","sadašnjost"],["učio sam","prošlost"],["učit ću","budućnost"],["jedem","sadašnjost"],["jeo sam","prošlost"],["jest ću","budućnost"],["spavam","sadašnjost"],["spavao sam","prošlost"],["spavat ću","budućnost"]].forEach(([g,v])=>q.push({type:"choice",difficulty:2,question:`Koje vrijeme izriče glagolski oblik "${g}"?`,answers:["prošlost","sadašnjost","budućnost"],correctIndex:v==="prošlost"?0:v==="sadašnjost"?1:2}));
[["mama","mamin"],["tata","tatin"],["brat","bratov"],["Ana","Anin"],["sestra","sestrin"],["dijete","djetetov"]].forEach(([i,p])=>q.push({type:"choice",difficulty:3,question:`Koji posvojni pridjev nastaje od riječi "${i}"?`,answers:sh([p,...wf(["mamin","tatin","bratov","Anin","sestrin","djetetov"],p)]),correctIndex:-1,_c:p}));
[["Anin","veliko"],["gradski","malo"],["zagrebački","malo"],["školski","malo"],["hrvatski","malo"],["lijep","malo"],["europski","malo"],["zimski","malo"],["Markovo","veliko"],["drveni","malo"]].forEach(([p,s])=>q.push({type:"choice",difficulty:3,question:`Kako pišemo riječ "${p}"?`,answers:["velikim","malim"],correctIndex:s==="veliko"?0:1}));
q.push({type:"choice",difficulty:2,question:"U rečenici 'Vesela djevojčica pjeva.' koja je riječ imenica?",answers:["vesela","djevojčica","pjeva"],correctIndex:1});
q.push({type:"choice",difficulty:2,question:"U rečenici 'Vesela djevojčica pjeva.' koja je riječ glagol?",answers:["vesela","djevojčica","pjeva"],correctIndex:2});
q.push({type:"choice",difficulty:2,question:"U rečenici 'Vesela djevojčica pjeva.' koja je riječ pridjev?",answers:["vesela","djevojčica","pjeva"],correctIndex:0});
q.push({type:"choice",difficulty:3,question:"Koja skupina sadrži imenicu, glagol i pridjev tim redom?",answers:["pas, trči, brz","trči, pas, brz","brz, pas, trči"],correctIndex:0});
q.push({type:"choice",difficulty:3,question:"Koja riječ najbolje dovršava rečenicu 'Jučer sam ___ knjigu.'?",answers:["čitao","čitam","čitat ću"],correctIndex:0});
return fix(q).slice(0,210)}

function genPravopis4(){const q=[];
// OŠ HJ A.4.4: veliko početno slovo i česti pravopisni obrasci u pisanju.
const veliko=[
["hrvatska","Hrvatska"],["italija","Italija"],["jadransko more","Jadransko more"],
["gorski kotar","Gorski kotar"],["lika","Lika"],["hrvat","Hrvat"],["hrvatica","Hrvatica"],
["riječanin","Riječanin"],["zagrepčanka","Zagrepčanka"]
];
veliko.forEach(([w,c])=>{q.push({type:"choice",difficulty:2,question:`Koji je zapis pravilan?`,answers:[w,c],correctIndex:1});q.push({type:"input",difficulty:3,question:`Napiši pravilno: "${w}".`,konstrukt:"velikoSlovo",correctAnswer:c})});
const pridjevi=[["Zagreb","zagrebački"],["Hrvatska","hrvatski"],["Europa","europski"],["Rijeka","riječki"],["Split","splitski"],["Ana","Anin"],["Marko","Markov"],["Ivana","Ivanin"]];
pridjevi.forEach(([i,c])=>q.push({type:"choice",difficulty:3,question:`Koji je pravilan pridjev izveden od imena "${i}"?`,answers:sh([c,...wf(pridjevi.map(x=>x[1]),c)]),correctIndex:-1,_c:c}));
[["čokolada","č"],["voće","ć"],["lađa","đ"],["udžbenik","dž"],["mlijeko","ije"],["bijel","ije"],["cijena","ije"],["pjesma","je"],["rijeka","ije"],["vjera","je"],["dijete","ije"],["bjelina","je"]].forEach(([w,g])=>{if(g==="č"||g==="ć")q.push({type:"choice",difficulty:2,question:`Koji se glas nalazi u riječi "${w}"?`,answers:["č","ć"],correctIndex:g==="č"?0:1});else if(g==="đ"||g==="dž")q.push({type:"choice",difficulty:2,question:`Koji se glas nalazi u riječi "${w}"?`,answers:["đ","dž"],correctIndex:g==="đ"?0:1});else q.push({type:"choice",difficulty:2,question:`Koji se skup glasova nalazi u riječi "${w}"?`,answers:["ije","je"],correctIndex:g==="ije"?0:1})});
q.push({type:"choice",difficulty:3,question:"Koja je rečenica pravilno napisana?",answers:["Ana živi u Rijeci.","ana živi u rijeci."],correctIndex:0});
return fix(q).slice(0,210)}

function genKnjizevnost4(){const q=[];
const vrste=[["bajka","priča s čudesnim događajima i bićima"],["basna","kratka poučna priča u kojoj često govore životinje"],["pjesma","književni tekst oblikovan u stihovima"],["igrokaz","tekst namijenjen izvođenju na pozornici"],["biografija","tekst o životu stvarne osobe"],["dječji roman","dulje prozno djelo namijenjeno djeci"],["pripovijetka","kraće prozno književno djelo"]];
vrste.forEach(([v,o])=>{q.push({type:"choice",difficulty:2,question:`Kojoj književnoj vrsti pripada opis: "${o}"?`,answers:sh([v,...wf(vrste.map(x=>x[0]),v)]),correctIndex:-1,_c:v});q.push({type:"input",difficulty:3,question:`Napiši naziv književne vrste opisane ovako: "${o}".`,konstrukt:"rijec",correctAnswer:v})});
q.push({type:"choice",difficulty:2,question:"Tko je glavni lik u priči?",answers:["lik oko kojega se razvija glavni dio događaja","autor teksta","čitatelj","izdavač"],correctIndex:0});
const personifikacije=["Vjetar pjeva.","Kiša plače.","Sunce se smije.","Lišće pleše na vjetru."];
personifikacije.forEach(t=>q.push({type:"choice",difficulty:3,question:`Koje je obilježje pjesničkoga jezika u primjeru "${t}"?`,answers:["personifikacija","onomatopeja","rima","ponavljanje"],correctIndex:0}));
const onomatopeje=["bum","mijau","kuc-kuc","šuš"];
onomatopeje.forEach(t=>q.push({type:"choice",difficulty:3,question:`Koje je obilježje pjesničkoga jezika riječ "${t}"?`,answers:["personifikacija","onomatopeja","rima","ponavljanje"],correctIndex:1}));
q.push({type:"choice",difficulty:2,question:"Što je stih?",answers:["jedan redak pjesme","cijela pjesma","naslov","ime autora"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što je strofa?",answers:["skupina stihova","jedan stih","naslov","ime lika"],correctIndex:0});
return fix(q).slice(0,210)}

function genMedijskaKultura(){const q=[];
q.push({type:"choice",difficulty:2,question:"Što je dokumentarni film?",answers:["stvarni događaji","izmišljena priča","crtani","reklama"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što je animirani film?",answers:["crtani/lutkarski likovi","stvarni ljudi","dokumentarni","reklama"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što je strip?",answers:["priča crtežima i tekstom","samo tekst","samo slike","glazba"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Čemu služi knjižnica?",answers:["posuđivanje knjiga","kupovina hrane","filmovi","igre"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Čemu služi rječnik?",answers:["objašnjava značenja","roman","bajka","udžbenik mat."],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Čemu služi pravopis?",answers:["pravila pisanja","roman","pjesma","atlas"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što je radijska emisija?",answers:["program na radiju","TV emisija","film","knjiga"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Po čemu se film razlikuje od knjige?",answers:["film ima sliku i zvuk","nema razlike","knjiga ima zvuk","film nema priču"],correctIndex:0});
return fix(q).slice(0,210)}

function genBrojeviMilijun(){const q=[];
[1234,5678,12345,98765,100000,543210,999999].forEach(n=>{q.push({type:"input",difficulty:2,question:`Koliko znamenaka ima broj ${n.toLocaleString('hr')}?`,correctAnswer:String(String(n).length)})});
q.push({type:"choice",difficulty:2,question:"Koliko stotica ima jedna tisuća?",answers:["100","1 000","10 000","100 000"],correctIndex:1});
q.push({type:"choice",difficulty:2,question:"Koliko tisuća ima deset tisuća?",answers:["1 000","10 000","100 000","1 000 000"],correctIndex:1});
q.push({type:"choice",difficulty:2,question:"Koliko tisuća ima jedan milijun?",answers:["100 000","1 000 000","10 000 000","100"],correctIndex:1});
for(let i=0;i<25;i++){const a=(i*73123+10000)%900000+10000,b=(i*51237+20000)%900000+10000;if(a===b)continue;q.push({type:"choice",difficulty:2,question:`${a.toLocaleString('hr')} ${CIRCLE} ${b.toLocaleString('hr')}`,answers:ZNAKOVI_USP,correctIndex:a<b?0:1})}
for(let n=1234;n<=9999;n+=1111){q.push({type:"input",difficulty:3,question:`Koliko je ${n} zaokruženo na stotice?`,correctAnswer:String(Math.round(n/100)*100)});q.push({type:"input",difficulty:3,question:`Koliko je ${n} zaokruženo na tisućice?`,correctAnswer:String(Math.round(n/1000)*1000)})}
return fix(q).slice(0,210)}

function genPisanoZbrOduz(){const q=[];
q.push(...mathCombi("+",{a:[10000,90000,7123],b:[10000,90000,5237]},(a,b,r)=>r<=999999,60));
q.push(...mathCombi("-",{a:[20000,99000,6789],b:[1000,20000,4321]},(a,b,r)=>r>=0,60));
q.push(...storyProb("+",{a:[10000,50000],b:[5000,30000]},20));
q.push(...storyProb("-",{a:[30000,80000],b:[5000,20000]},20));
return fix(q).slice(0,210)}

function genPisanoMnozDijel(){const q=[];
q.push(...mathCombi("*",{a:[12,200,13],b:[2,9,1]},(a,b,r)=>r<=999999,80));
q.push(...mathCombi("*",{a:[10,99,7],b:[10,99,11]},(a,b,r)=>r<=999999,40));
for(let b=2;b<=9;b++)for(let r=10;r<=100;r+=13)q.push({type:"input",difficulty:2,question:`Koliko je ${r*b} ÷ ${b}?`,correctAnswer:String(r)});
q.push(...storyProb("*",{a:[5,30],b:[3,12]},20));
q.push(...storyProb("/",{a:[20,100],b:[2,10]},15));
return fix(q).slice(0,210)}

function genGeometrijaKutovi(){const q=[];
// 4. razred: prepoznavanje i crtanje vrsta kutova; mjerenje u stupnjevima dolazi kasnije.
const kutovi=[["pravi","krakovi zatvaraju pravi kut"],["šiljasti","manji je od pravoga kuta"],["tupi","veći je od pravoga, a manji od ispruženoga"]];
kutovi.forEach(([k,o])=>{q.push({type:"choice",difficulty:2,question:`Koji kut odgovara opisu: "${o}"?`,answers:sh([k,...wf(kutovi.map(x=>x[0]),k)]),correctIndex:-1,_c:k});q.push({type:"input",difficulty:2,question:`Kako se zove kut koji je ${o}?`,correctAnswer:k})});
q.push({type:"choice",difficulty:2,question:"Kako se zove zajednička točka dvaju krakova kuta?",answers:["vrh","središte","brid","stranica"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Od čega se sastoji kut?",answers:["od vrha i dvaju krakova","od tri stranice","od središta i polumjera","od dvaju usporednih pravaca"],correctIndex:0});
q.push({type:"choice",difficulty:3,question:"Kako se zove trokut s tri jednake stranice?",answers:["jednakostranični","jednakokračan","raznostranični","pravokutni"],correctIndex:0});
q.push({type:"choice",difficulty:3,question:"Kako se zove trokut s dvije jednake stranice?",answers:["jednakostranični","jednakokračan","raznostranični","pravokutni"],correctIndex:1});
q.push({type:"choice",difficulty:3,question:"Kako se zove trokut kojemu su sve stranice različite?",answers:["jednakostranični","jednakokračan","raznostranični","pravokutni"],correctIndex:2});
q.push({type:"choice",difficulty:3,question:"Kako se zove trokut koji ima pravi kut?",answers:["jednakostranični","jednakokračan","raznostranični","pravokutni"],correctIndex:3});
return fix(q).slice(0,210)}

function genOpsegPovrsina(){const q=[];
// D.4.2: površina se u 4. razredu mjeri jediničnim kvadratima, bez formule a×b.
for(let r=2;r<=9;r++)for(let s=2;s<=9;s++){const br=r*s;q.push({type:"input",difficulty:2,question:`Pravokutni lik u kvadratnoj mreži prekriven je s ${r} redaka po ${s} jediničnih kvadrata. Kolika je njegova površina u jediničnim kvadratima?`,correctAnswer:String(br)})}
for(let n=4;n<=30;n+=2)q.push({type:"choice",difficulty:2,question:`Lik A zauzima ${n} jediničnih kvadrata, a lik B ${n+3}. Koji lik ima veću površinu?`,answers:["lik A","lik B","jednake su","ne može se odrediti"],correctIndex:1});
q.push({type:"choice",difficulty:2,question:"Koja je standardna mjerna jedinica za površinu?",answers:["cm²","cm","L","kg"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Kako možemo izmjeriti površinu lika nacrtanog u kvadratnoj mreži?",answers:["prebrojavanjem jediničnih kvadrata","brojenjem vrhova","mjerenjem mase","brojenjem boja"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Lik je prekriven s 12 jediničnih kvadrata. Kolika mu je površina?",answers:["12 jediničnih kvadrata","12 cm","24 jedinična kvadrata","6 jediničnih kvadrata"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Dva lika zauzimaju jednak broj jediničnih kvadrata. Kakve su njihove površine?",answers:["jednake","prvi je veći","drugi je veći","ne mogu se usporediti"],correctIndex:0});
q.push({type:"choice",difficulty:3,question:"Lik A zauzima 9, a lik B 14 jediničnih kvadrata. Za koliko je površina lika B veća?",answers:["5","23","14","9"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što treba prebrojiti da odrediš površinu lika u kvadratnoj mreži?",answers:["jedinične kvadrate","vrhove","boje","stranice papira"],correctIndex:0});
return fix(q).slice(0,210)}

function genKvaderKocka(){const q=[];
// C.4.5: opisivanje i povezivanje geometrijskih tijela; bez računanja volumena (5. razred).
const pitanja=[
["Koliko ploha ima kocka?",["4","6","8","12"],1],
["Koliko bridova ima kocka?",["6","8","10","12"],3],
["Koliko vrhova ima kocka?",["4","6","8","12"],2],
["Kakvog su oblika sve plohe kocke?",["kvadrati","pravokutnici različitih veličina","trokuti","krugovi"],0],
["Koliko ploha ima kvadar?",["4","6","8","12"],1],
["Koliko bridova ima kvadar?",["6","8","10","12"],3],
["Koliko vrhova ima kvadar?",["4","6","8","12"],2],
["Koje tijelo ima šest jednakih kvadratnih ploha?",["kocka","kvadar","kugla","valjak"],0]
];
pitanja.forEach(([question,answers,correctIndex])=>q.push({type:"choice",difficulty:2,question,answers,correctIndex}));
q.push({type:"input",difficulty:2,question:"Koliko ploha ima kocka?",correctAnswer:"6"});
q.push({type:"input",difficulty:2,question:"Koliko bridova ima kocka?",correctAnswer:"12"});
q.push({type:"input",difficulty:2,question:"Koliko vrhova ima kocka?",correctAnswer:"8"});
return fix(q).slice(0,210)}

function genUvjetiZivota(){const q=[];
q.push({type:'choice',difficulty:3,question:'Dvije biljke dobivaju jednako vode, ali samo jedna stoji uz prozor. Koji se uvjet razlikuje?',answers:['svjetlost','količina vode','vrsta sjemena'],correctIndex:0,objasnjenje:'Voda je jednaka, a položaj uz prozor mijenja količinu svjetlosti.'});
q.push({type:'true-false',difficulty:2,question:'Može li biljka bez vode trajno normalno rasti?',correct:false,objasnjenje:'Voda je jedan od uvjeta života biljke.'});
[["Sunce","izvor topline i svjetlosti"],["Voda","neophodna za organizme"],["Zrak","sadrži kisik"],["Tlo","podloga za biljke"]].forEach(([u,o])=>{q.push({type:"choice",difficulty:2,question:`Koji je uvjet života opisan: "${o}"?`,answers:sh([u,...wf(["Sunce","Voda","Zrak","Tlo"],u)]),correctIndex:-1,_c:u});q.push({type:"input",difficulty:3,question:`Koji se uvjet života ovako opisuje? "${o}"`,correctAnswer:u})});
q.push({type:"choice",difficulty:2,question:"Što biljka stvara fotosintezom?",answers:["kisik","CO₂","dušik","vodik"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što je biljci potrebno za fotosintezu?",answers:["sunce i CO₂","samo vodu","samo tlo","samo zrak"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Čime počinje kruženje vode u prirodi?",answers:["isparavanjem","padavinama","zamrzavanjem","filtriranjem"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Zašto su biljke važne za život na Zemlji?",answers:["proizvode kisik","jedu životinje","stvaraju oblake","grade kuće"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Biljka bez dovoljno svjetlosti teško raste. Koji joj uvjet nedostaje?",answers:["svjetlost","tlo","zvuk","vjetar"],correctIndex:0});
return fix(q).slice(0,210)}

const PAR_KRAJ=[["Osijek","nizinski"],["Zagreb","brežuljkasti"],["Split","primorski"],
["Gospić","gorski"],["Varaždin","brežuljkasti"],["Zadar","primorski"],["Delnice","gorski"],
["Slavonski Brod","nizinski"]];
function genKrajeviHR(){const q=[];
q.push(...spajanje(PAR_KRAJ,"Spoji grad s krajem u kojem se nalazi:",{koliko:4,komada:8,difficulty:3}));
[["nizinski","ravnice, rijeke, poljoprivreda"],["brežuljkasti","blaga brda, vinogradi"],["gorski","visoke planine, šume"],["primorski","more, otoci, turizam"]].forEach(([k,o])=>{q.push({type:"choice",difficulty:2,question:`Kojem hrvatskom kraju ovo pripada: "${o}"?`,answers:sh([k,...wf(["nizinski","brežuljkasti","gorski","primorski"],k)]),correctIndex:-1,_c:k});q.push({type:"input",difficulty:3,question:`Koji se hrvatski kraj ovako opisuje? "${o}"`,correctAnswer:k})});
[["Osijek","nizinski"],["Zagreb","brežuljkasti"],["Rijeka","primorski"],["Split","primorski"],["Gospić","gorski"],["Varaždin","brežuljkasti"],["Dubrovnik","primorski"],["Slavonski Brod","nizinski"],["Delnice","gorski"],["Zadar","primorski"]].forEach(([g,k])=>q.push({type:"choice",difficulty:3,question:`Kojem kraju Hrvatske pripada ${g}?`,answers:["nizinski","brežuljkasti","gorski","primorski"],correctIndex:["nizinski","brežuljkasti","gorski","primorski"].indexOf(k)}));
return fix(q).slice(0,210)}

const PAR_ORGAN=[["srce","krvožilni"],["pluća","dišni"],["želudac","probavni"],
["mozak","živčani"],["kost","koštani"],["bubreg","izlučivački"]];
const PAR_OSJET=[["vid","oči"],["sluh","uši"],["njuh","nos"],["okus","jezik"],["opip","koža"]];
function genLjudskoTijelo(){const q=[];
q.push(...spajanje(PAR_ORGAN,"Spoji organ sa sustavom kojem pripada:",{koliko:4,komada:8,difficulty:3}));
q.push(...spajanje(PAR_OSJET,"Spoji osjetilo s organom:",{koliko:4,komada:6,difficulty:2}));
[["srce","krvožilni"],["pluća","dišni"],["želudac","probavni"],["mozak","živčani"],["kost","koštano-mišićni"],["jetra","probavni"],["bubreg","izlučivački"]].forEach(([o,s])=>{q.push({type:"choice",difficulty:2,question:`Kojem sustavu organa ovo pripada: "${o}"?`,answers:sh([s,...wf(["krvožilni","dišni","probavni","živčani","koštano-mišićni","izlučivački"],s)]),correctIndex:-1,_c:s});q.push({type:"input",difficulty:3,question:`Kojem sustavu organa pripada "${o}"?`,correctAnswer:s})});
[["vid","oči"],["sluh","uši"],["njuh","nos"],["okus","jezik"],["opip","koža"]].forEach(([o,org])=>{q.push({type:"choice",difficulty:1,question:`Koji je organ zadužen za "${o}"?`,answers:sh([org,...wf(["oči","uši","nos","jezik","koža"],org)]),correctIndex:-1,_c:org});q.push({type:"input",difficulty:2,question:`Koji je organ osjetila "${o}"?`,correctAnswer:org})});
q.push({type:"choice",difficulty:2,question:"Koliko obroka dnevno treba jesti?",answers:["1-2","3-5","7-8","samo 1"],correctIndex:1});
q.push({type:"choice",difficulty:2,question:"Čemu kalcij posebno pridonosi?",answers:["zdravlju kostiju i zubi","slatkišima","gaziranim pićima","čipsu"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Zašto je tjelovježba važna?",answers:["jača zdravlje","troši vrijeme","samo za sportaše","nije važna"],correctIndex:0});
return fix(q).slice(0,210)}

function genHrvatskaDomovina(){const q=[];
q.push({type:"choice",difficulty:1,question:"Koji je glavni grad Hrvatske?",answers:["Split","Rijeka","Zagreb","Osijek"],correctIndex:2});
q.push({type:"input",difficulty:2,question:"Koji je glavni grad Hrvatske?",correctAnswer:"Zagreb"});
q.push({type:"choice",difficulty:2,question:"Kako se zove hrvatska himna?",answers:["Lijepa naša domovino","Ode Radosti","Bože čuvaj HR","Marš na Drinu"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Koje su boje na hrvatskoj zastavi?",answers:["crvena,bijela,plava","zelena,bijela,crvena","plava,žuta,crvena","bijela,plava,bijela"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što je na grbu Republike Hrvatske?",answers:["šahovnica","orao","lav","zvijezda"],correctIndex:0});
q.push({type:"input",difficulty:2,question:"Što je na grbu Republike Hrvatske?",correctAnswer:"šahovnica"});
["Slovenija","Mađarska","Srbija","BiH","Crna Gora"].forEach(z=>q.push({type:"choice",difficulty:2,question:`Graniči li ${z} s Hrvatskom?`,answers:["Da","Ne"],correctIndex:0}));
["Austrija","Njemačka","Albanija","Bugarska"].forEach(z=>q.push({type:"choice",difficulty:2,question:`Graniči li ${z} s Hrvatskom?`,answers:["Da","Ne"],correctIndex:1}));
q.push({type:"choice",difficulty:2,question:"Čija je članica Hrvatska od 2013. godine?",answers:["EU","samo NATO","nijedne","Afričke unije"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Na kojem se kontinentu nalazi Hrvatska?",answers:["Europa","Azija","Afrika","Amerika"],correctIndex:0});
q.push({type:"input",difficulty:2,question:"Na kojem se kontinentu nalazi Hrvatska?",correctAnswer:"Europa"});
q.push({type:"choice",difficulty:2,question:"Koje more zapljuskuje hrvatsku obalu?",answers:["Jadransko","Crno","Baltičko","Egejsko"],correctIndex:0});
q.push({type:"input",difficulty:2,question:"Koje more zapljuskuje hrvatsku obalu?",correctAnswer:"Jadransko"});
return fix(q).slice(0,210)}

function genBiljkeZivotinje4(){const q=[];
[["sisavci","rađaju žive, doje"],["ptice","perje, nesu jaja"],["ribe","ljuske, škrge"],["gmazovi","ljuske, hladnokrvni"],["vodozemci","voda i kopno"]].forEach(([s,o])=>{q.push({type:"choice",difficulty:2,question:`Koja je skupina životinja opisana: "${o}"?`,answers:sh([s,...wf(["sisavci","ptice","ribe","gmazovi","vodozemci"],s)]),correctIndex:-1,_c:s});q.push({type:"input",difficulty:3,question:`Koja se skupina životinja ovako opisuje? "${o}"`,correctAnswer:s})});
[["mačka","sisavac"],["orao","ptica"],["šaran","riba"],["gušter","gmaz"],["žaba","vodozemac"],["medvjed","sisavac"],["lastavica","ptica"],["zmija","gmaz"],["kit","sisavac"],["pingvin","ptica"],["pastrva","riba"],["daždevnjak","vodozemac"],["krokodil","gmaz"],["delfin","sisavac"]].forEach(([z,s])=>q.push({type:"choice",difficulty:2,question:`Kojoj skupini životinja pripada "${z}"?`,answers:["sisavac","ptica","riba","gmaz","vodozemac"],correctIndex:["sisavac","ptica","riba","gmaz","vodozemac"].indexOf(s)}));
[["šuma","stabla,gljive,životinje"],["livada","trave,cvjetovi,kukci"],["more","ribe,alge,morske živ."],["travnjak","niska veg.,sitne živ."]].forEach(([e,o])=>{q.push({type:"choice",difficulty:2,question:`Kojem ekosustavu ovo pripada: "${o}"?`,answers:sh([e,...wf(["šuma","livada","more","travnjak","jezero"],e)]),correctIndex:-1,_c:e})});
q.push({type:"choice",difficulty:2,question:"Koja prilagodba pomaže ribi živjeti u vodi?",answers:["škrge","perje","krzno","pluća kao jedini organ disanja"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Koja životinja može živjeti i u vodi i na kopnu?",answers:["žaba","orao","mačka","šaran"],correctIndex:0});
q.push({type:"choice",difficulty:3,question:"Koji je jednostavan hranidbeni slijed smislen?",answers:["trava → zec → lisica","lisica → trava → zec","zec → lisica → trava","trava → lisica → sunce"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što je zajedničko pticama poput vrapca i orla?",answers:["imaju perje","imaju škrge","imaju ljuske kao ribe","žive samo u vodi"],correctIndex:0});
return fix(q).slice(0,210)}

const REVIEWED_GENERATORS={ genVrsteRijeci4:wrapGenerator(genVrsteRijeci4), genPravopis4:wrapGenerator(genPravopis4), genKnjizevnost4:wrapGenerator(genKnjizevnost4), genMedijskaKultura:wrapGenerator(genMedijskaKultura), genBrojeviMilijun:wrapGenerator(genBrojeviMilijun), genPisanoZbrOduz:wrapGenerator(genPisanoZbrOduz), genPisanoMnozDijel:wrapGenerator(genPisanoMnozDijel), genGeometrijaKutovi:wrapGenerator(genGeometrijaKutovi), genOpsegPovrsina:wrapGenerator(genOpsegPovrsina), genKvaderKocka:wrapGenerator(genKvaderKocka), genUvjetiZivota:wrapGenerator(genUvjetiZivota), genKrajeviHR:wrapGenerator(genKrajeviHR), genLjudskoTijelo:wrapGenerator(genLjudskoTijelo), genHrvatskaDomovina:wrapGenerator(genHrvatskaDomovina), genBiljkeZivotinje4:wrapGenerator(genBiljkeZivotinje4), genPodatci4:wrapGenerator(obogacenje.genPodatci4), genNepoznati4:wrapGenerator(obogacenje.genNepoznati4), genCitanje4:wrapGenerator(obogacenje.genCitanje4) };
const GEN_MAP={hrvatski:[REVIEWED_GENERATORS.genVrsteRijeci4,REVIEWED_GENERATORS.genPravopis4,REVIEWED_GENERATORS.genKnjizevnost4,REVIEWED_GENERATORS.genMedijskaKultura,REVIEWED_GENERATORS.genCitanje4],matematika:[REVIEWED_GENERATORS.genBrojeviMilijun,REVIEWED_GENERATORS.genPisanoZbrOduz,REVIEWED_GENERATORS.genPisanoMnozDijel,REVIEWED_GENERATORS.genGeometrijaKutovi,REVIEWED_GENERATORS.genOpsegPovrsina,REVIEWED_GENERATORS.genKvaderKocka,REVIEWED_GENERATORS.genPodatci4,REVIEWED_GENERATORS.genNepoznati4],priroda:[REVIEWED_GENERATORS.genUvjetiZivota,REVIEWED_GENERATORS.genKrajeviHR,REVIEWED_GENERATORS.genLjudskoTijelo,REVIEWED_GENERATORS.genHrvatskaDomovina,REVIEWED_GENERATORS.genBiljkeZivotinje4]};
async function seed(){let pogreska=false;console.log(`\n🌱 SEED ${GRADE}. razred\n`);const uri=process.env.MONGODB_URI||process.env.MONGO_URI;const client=new MongoClient(uri);try{await client.connect();const dbName=process.env.DB_NAME||(()=>{try{return new URL(uri).pathname.replace(/^\//,'')||'ucilica'}catch{return'ucilica'}})();const db=client.db(dbName);console.log(`🔗 ${db.databaseName}`);await db.collection("questions").deleteMany({grade:GRADE});await db.collection("topics").deleteMany({grade:GRADE});await db.collection("subjects").deleteMany({grade:GRADE});let t=0;for(const s of subjects){const sr=await db.collection("subjects").insertOne({...s,grade:GRADE,isActive:true,createdAt:new Date()});const si=sr.insertedId;console.log(`📘 ${s.icon} ${s.name}`);const gs=GEN_MAP[s.slug],ts=topicsDef[s.slug];for(let i=0;i<ts.length;i++){const rq=gs[i]();const tr=await db.collection("topics").insertOne({...ts[i],grade:GRADE,subject_id:si,isActive:true,createdAt:new Date()});const ti=tr.insertedId;const docs=rq.map(qq=>({type:qq.type,difficulty:qq.difficulty||1,question:qq.question,visual:qq.visual||"",hint:qq.hint||"",objasnjenje:qq.objasnjenje||"",passage:qq.passage||"",chart:qq.chart||[],answers:qq.answers||[],correctIndex:typeof qq.correctIndex==="number"?qq.correctIndex:undefined,correctAnswer:qq.correctAnswer||undefined,...(qq.konstrukt?{konstrukt:qq.konstrukt}:{}),...(qq.prihvatljivi?.length?{prihvatljivi:qq.prihvatljivi}:{}),...(qq.type==="match"?{pairs:qq.pairs}:{}),...(qq.type==="ordering"?{items:qq.items}:{}),...(qq.type==="true-false"?{correct:qq.correct}:{}),grade:GRADE,subject_id:si,topic_id:ti,gik:buildQuestionMetadata({topic:{...ts[i],grade:GRADE},subject:null,difficulty:qq.difficulty||1}),isActive:true,createdAt:new Date()}));if(docs.length)await db.collection("questions").insertMany(docs);t+=docs.length;console.log(`   ${ts[i].icon} ${ts[i].name}: ${docs.length}`)}}console.log(`\n✅ ${t} pitanja`)}catch(e){console.error("❌",e);pogreska=true}finally{await client.close();process.exit(pogreska?1:0)}}
if(require.main===module){seed()}
module.exports=REVIEWED_GENERATORS;
