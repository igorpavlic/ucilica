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
const GRADE=4;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const pickN=(a,n)=>sh([...a]).slice(0,n);
const wf=(pool,c,n=3)=>sh(pool.filter(x=>x!==c)).slice(0,n);

const subjects=[{name:"Hrvatski jezik",slug:"hrvatski",icon:"📖",color:"#FF6B6B",description:"Imenice, glagoli, pridjevi, pravopis, književnost",order:1},{name:"Matematika",slug:"matematika",icon:"🔢",color:"#60A5FA",description:"Brojevi do milijun, množenje, dijeljenje, geometrija",order:2},{name:"Priroda i društvo",slug:"priroda",icon:"🌿",color:"#34D399",description:"Hrvatska, krajevi, tijelo, biljke, životinje",order:3}];
const topicsDef={
hrvatski:[{name:"Imenice, glagoli, pridjevi",slug:"vrste-rijeci-4",icon:"📝",order:1},{name:"Pravopis i gramatika",slug:"pravopis-4",icon:"✏️",order:2},{name:"Književnost",slug:"knjizevnost-4",icon:"📚",order:3},{name:"Medijska kultura",slug:"medijska-kultura",icon:"🎬",order:4}],
matematika:[{name:"Brojevi do milijun",slug:"brojevi-milijun",icon:"🔢",order:1},{name:"Pisano zbrajanje i oduzimanje",slug:"pisano-zbr-oduz",icon:"➕",order:2},{name:"Pisano množenje i dijeljenje",slug:"pisano-mnoz-dijel",icon:"✖️",order:3},{name:"Geometrija — kutovi i likovi",slug:"geometrija-kutovi",icon:"📐",order:4},{name:"Opseg i površina",slug:"opseg-povrsina",icon:"📏",order:5},{name:"Kvader i kocka",slug:"kvader-kocka",icon:"🧊",order:6}],
priroda:[{name:"Prirodni uvjeti života",slug:"uvjeti-zivota",icon:"☀️",order:1},{name:"Krajevi Hrvatske",slug:"krajevi-hr",icon:"🇭🇷",order:2},{name:"Ljudsko tijelo",slug:"ljudsko-tijelo",icon:"🧍",order:3},{name:"Hrvatska — domovina",slug:"hrvatska-domovina",icon:"🏛️",order:4},{name:"Biljke i životinje",slug:"biljke-zivotinje-4",icon:"🌿",order:5}]};

function genVrsteRijeci4(){const q=[];
const imenice=["ljubav","prijateljstvo","sreća","dom","škola","grad","rijeka","planina","more","sloboda","zemlja","sunce","mjesec","zvijezda","oblak","kiša","snijeg","drvo","cvijet","put"];
imenice.forEach(w=>q.push({type:"choice",difficulty:1,question:`Koja je vrsta riječi "${w}"?`,answers:sh(["imenica","glagol","pridjev","prilog"]),correctIndex:-1,_c:"imenica"}));
[["čitam","sadašnjost"],["čitao sam","prošlost"],["čitat ću","budućnost"],["pišem","sadašnjost"],["pisao sam","prošlost"],["pisat ću","budućnost"],["trčim","sadašnjost"],["trčao sam","prošlost"],["trčat ću","budućnost"],["učim","sadašnjost"],["učio sam","prošlost"],["učit ću","budućnost"],["jedem","sadašnjost"],["jeo sam","prošlost"],["jest ću","budućnost"],["spavam","sadašnjost"],["spavao sam","prošlost"],["spavat ću","budućnost"]].forEach(([g,v])=>q.push({type:"choice",difficulty:2,question:`Što izriče riječ "${g}"?`,answers:["prošlost","sadašnjost","budućnost"],correctIndex:v==="prošlost"?0:v==="sadašnjost"?1:2}));
[["lijep","opisni"],["mamin","posvojni"],["velik","opisni"],["tatin","posvojni"],["crven","opisni"],["bratov","posvojni"],["hladan","opisni"],["školski","posvojni"],["brz","opisni"],["Anin","posvojni"],["star","opisni"],["sestrin","posvojni"],["dobar","opisni"],["djetetov","posvojni"]].forEach(([p,t])=>q.push({type:"choice",difficulty:3,question:`Koji pridjev nastaje od riječi "${p}"?`,answers:["opisni","posvojni"],correctIndex:t==="opisni"?0:1}));
[["Anin","veliko"],["gradski","malo"],["Zagrebački","veliko"],["školski","malo"],["Hrvatski","veliko"],["lijep","malo"],["Europski","veliko"],["zimski","malo"],["Markovo","veliko"],["drveni","malo"]].forEach(([p,s])=>q.push({type:"choice",difficulty:3,question:`Kako pišemo riječ "${p}"?`,answers:["velikim","malim"],correctIndex:s==="veliko"?0:1}));
return fix(q).slice(0,210)}

function genPravopis4(){const q=[];
[["RH","Republika Hrvatska"],["EU","Europska unija"],["UN","Ujedinjeni narodi"],["npr.","na primjer"],["itd.","i tako dalje"],["tzv.","takozvani"],["sl.","slično"],["dr.","doktor"],["prof.","profesor"],["ul.","ulica"]].forEach(([k,p])=>{q.push({type:"input",difficulty:2,question:`Koja je kratica za "${p}"?`,correctAnswer:k});q.push({type:"choice",difficulty:2,question:`Što znači kratica "${k}"?`,answers:sh([p,...wf(["Republika Hrvatska","Europska unija","Ujedinjeni narodi","na primjer","i tako dalje","takozvani","slično","doktor"],p)]),correctIndex:-1,_c:p})});
q.push({type:"choice",difficulty:3,question:"Što je upravni govor?",answers:['Ana reče: "Idem."','Ana reče Idem','Ana reče, idem','Ana: reče "Idem"'],correctIndex:0});
q.push({type:"choice",difficulty:3,question:"Što je upravni govor?",answers:["doslovne riječi","prepričane riječi","opis","pitanje"],correctIndex:0});
q.push({type:"choice",difficulty:3,question:"Što je neupravni govor?",answers:["doslovne riječi","prepričane tuđe riječi","pjesma","kratica"],correctIndex:1});
[["čokolada","č"],["voće","ć"],["lađa","đ"],["udžbenik","dž"],["mlijeko","ije"],["bijel","ije"],["cjena","je"],["pjesma","je"],["rijeka","ije"],["vjera","je"],["dijete","ije"],["bjelina","je"]].forEach(([w,g])=>{if(g==="č"||g==="ć")q.push({type:"choice",difficulty:3,question:`Koji se glas nalazi u riječi "${w}"?`,answers:["č","ć"],correctIndex:g==="č"?0:1});else if(g==="đ"||g==="dž")q.push({type:"choice",difficulty:3,question:`Koji se glas nalazi u riječi "${w}"?`,answers:["đ","dž"],correctIndex:g==="đ"?0:1});else q.push({type:"choice",difficulty:3,question:`Koji se glas nalazi u riječi "${w}"?`,answers:["ije","je"],correctIndex:g==="ije"?0:1})});
q.push({type:"choice",difficulty:2,question:"Što je standardni jezik?",answers:["službeni koji svi razumiju","jezik jednog sela","strani","matematički"],correctIndex:0});
return fix(q).slice(0,210)}

function genKnjizevnost4(){const q=[];
[["bajka","čarobna bića"],["mit","bogovi i postanak"],["legenda","temelj u stvarnosti"],["basna","poučna s životinjama"],["roman","dugačko prozno djelo"]].forEach(([v,o])=>{q.push({type:"choice",difficulty:2,question:`Koji je ovo pjesnički izraz? "${o}"`,answers:sh([v,...wf(["bajka","mit","legenda","basna","roman","pjesma"],v)]),correctIndex:-1,_c:v});q.push({type:"input",difficulty:3,question:`Koja se književna vrsta ovako opisuje? "${o}"`,correctAnswer:v})});
q.push({type:"choice",difficulty:2,question:"Tko je glavni lik u priči?",answers:["oko njega se vrti radnja","nevažan","autor","čitatelj"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Tko su sporedni likovi u priči?",answers:["pomažu u radnji","najvažniji","autori","čitatelji"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Koji su dijelovi priče?",answers:["uvod,zaplet,rasplet","samo početak","samo kraj","pitanje,odgovor"],correctIndex:0});
q.push({type:"choice",difficulty:3,question:`Koji je ovo pjesnički izraz? "Vjetar pjeva"`,answers:["personifikacija","usporedba","hiperbola","rima"],correctIndex:0});
q.push({type:"choice",difficulty:3,question:`Koji je ovo pjesnički izraz? "Brz kao vjetar"`,answers:["personifikacija","usporedba","hiperbola","rima"],correctIndex:1});
q.push({type:"choice",difficulty:3,question:`Koji je ovo pjesnički izraz? "Kiša plače"`,answers:["personifikacija","usporedba","hiperbola","rima"],correctIndex:0});
q.push({type:"choice",difficulty:3,question:`Koji je ovo pjesnički izraz? "Jak kao bik"`,answers:["personifikacija","usporedba","hiperbola","rima"],correctIndex:1});
q.push({type:"choice",difficulty:3,question:`Koji je ovo pjesnički izraz? "Sunce se smije"`,answers:["personifikacija","usporedba","hiperbola","rima"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što je rima?",answers:["slaganje glasova na kraju","naslov","lik","slovo"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što je stih?",answers:["redak pjesme","cijela pjesma","naslov","autor"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što je strofa?",answers:["skupina stihova","jedan stih","naslov","rima"],correctIndex:0});
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
q.push({type:"choice",difficulty:2,question:"Koliko stupnjeva ima pravi kut?",answers:["45°","90°","180°","360°"],correctIndex:1});
q.push({type:"choice",difficulty:2,question:"Koliko stupnjeva ima ravni kut?",answers:["45°","90°","180°","360°"],correctIndex:2});
q.push({type:"choice",difficulty:2,question:"Koliko stupnjeva ima puni kut?",answers:["90°","180°","270°","360°"],correctIndex:3});
q.push({type:"input",difficulty:2,question:"Koliko stupnjeva ima pravi kut?",correctAnswer:"90"});
q.push({type:"input",difficulty:2,question:"Koliko stupnjeva ima ravni kut?",correctAnswer:"180"});
q.push({type:"input",difficulty:2,question:"Koliko stupnjeva ima puni kut?",correctAnswer:"360"});
q.push({type:"choice",difficulty:3,question:"Kako se zove trokut s tri jednake stranice?",answers:["jednakostranični","jednakokračan","raznostranični","pravokutni"],correctIndex:0});
q.push({type:"choice",difficulty:3,question:"Kako se zove trokut s dvije jednake stranice?",answers:["jednakostranični","jednakokračan","raznostranični","pravokutni"],correctIndex:1});
q.push({type:"choice",difficulty:3,question:"Kako se zove trokut kojemu su sve stranice različite?",answers:["jednakostranični","jednakokračan","raznostranični","pravokutni"],correctIndex:2});
q.push({type:"choice",difficulty:3,question:"Koliko stupnjeva ima jedan pravi kut?",answers:["jednakostranični","jednakokračan","raznostranični","pravokutni"],correctIndex:3});
for(let i=0;i<20;i++){const a=(i%5)+3,b=(i%4)+4,c=(i%3)+5;q.push({type:"input",difficulty:2,question:`Koliki je opseg trokuta sa stranicama ${a} cm, ${b} cm i ${c} cm?`,correctAnswer:String(a+b+c)})}
return fix(q).slice(0,210)}

function genOpsegPovrsina(){const q=[];
for(let a=1;a<=12;a++)q.push({type:"input",difficulty:2,question:`Koliki je opseg kvadrata sa stranicom ${a} cm?`,correctAnswer:String(4*a)});
for(let a=2;a<=10;a++)for(let b=a+1;b<=12;b++)q.push({type:"input",difficulty:2,question:`Koliki je opseg pravokutnika stranica ${a} cm i ${b} cm?`,correctAnswer:String(2*(a+b))});
for(let a=1;a<=10;a++)q.push({type:"input",difficulty:2,question:`Kolika je površina kvadrata sa stranicom ${a} cm?`,correctAnswer:String(a*a)});
for(let a=2;a<=8;a++)for(let b=a;b<=10;b++)q.push({type:"input",difficulty:2,question:`Kolika je površina pravokutnika stranica ${a} cm i ${b} cm?`,correctAnswer:String(a*b)});
q.push({type:"choice",difficulty:3,question:"Koliko kvadratnih centimetara ima jedan kvadratni decimetar?",answers:["10","100","1000","10000"],correctIndex:1});
q.push({type:"choice",difficulty:3,question:"Koliko kvadratnih decimetara ima jedan kvadratni metar?",answers:["10","100","1000","10000"],correctIndex:1});
return fix(q).slice(0,210)}

function genKvaderKocka(){const q=[];
q.push({type:"choice",difficulty:2,question:"Koliko strana ima kocka?",answers:["4","6","8","12"],correctIndex:1});
q.push({type:"choice",difficulty:2,question:"Koliko bridova ima kocka?",answers:["6","8","10","12"],correctIndex:3});
q.push({type:"choice",difficulty:2,question:"Koliko vrhova ima kocka?",answers:["4","6","8","12"],correctIndex:2});
q.push({type:"input",difficulty:2,question:"Koliko strana ima kocka?",correctAnswer:"6"});
q.push({type:"input",difficulty:2,question:"Koliko bridova ima kocka?",correctAnswer:"12"});
q.push({type:"input",difficulty:2,question:"Koliko vrhova ima kocka?",correctAnswer:"8"});
q.push({type:"choice",difficulty:2,question:"Kakvog su oblika strane kocke?",answers:["kvadrati","pravokutnici","trokuti","krugovi"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Koliko strana ima kvadar?",answers:["kvadrati","pravokutnici","trokuti","krugovi"],correctIndex:1});
for(let a=1;a<=10;a++)q.push({type:"input",difficulty:3,question:`Koliki je volumen kocke s bridom ${a} cm?`,correctAnswer:String(a*a*a)});
q.push({type:"choice",difficulty:3,question:"Od kojih se likova sastoji mreža kocke?",answers:["4","5","6","8"],correctIndex:2});
q.push({type:"input",difficulty:3,question:"Koliko kvadrata ima mreža kocke?",correctAnswer:"6"});
// Obujam kvader
for(let i=0;i<10;i++){const a=(i%3)+2,b=(i%4)+3,c=(i%5)+1;q.push({type:"input",difficulty:3,question:`Koliki je volumen kvadra bridova ${a} cm, ${b} cm i ${c} cm?`,correctAnswer:String(a*b*c)})}
return fix(q).slice(0,210)}

function genUvjetiZivota(){const q=[];
[["Sunce","izvor topline i svjetlosti"],["Voda","neophodna za organizme"],["Zrak","sadrži kisik"],["Tlo","podloga za biljke"]].forEach(([u,o])=>{q.push({type:"choice",difficulty:2,question:`Koji je ovo pjesnički izraz? "${o}"`,answers:sh([u,...wf(["Sunce","Voda","Zrak","Tlo"],u)]),correctIndex:-1,_c:u});q.push({type:"input",difficulty:3,question:`Koji se uvjet života ovako opisuje? "${o}"`,correctAnswer:u})});
q.push({type:"choice",difficulty:2,question:"Što biljka stvara fotosintezom?",answers:["kisik","CO₂","dušik","vodik"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Što je biljci potrebno za fotosintezu?",answers:["sunce i CO₂","samo vodu","samo tlo","samo zrak"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Čime počinje kruženje vode u prirodi?",answers:["isparavanjem","padavinama","zamrzavanjem","filtriranjem"],correctIndex:0});
q.push({type:"choice",difficulty:2,question:"Zašto su biljke važne za život na Zemlji?",answers:["proizvode kisik","jedu životinje","stvaraju oblake","grade kuće"],correctIndex:0});
return fix(q).slice(0,210)}

const PAR_KRAJ=[["Osijek","nizinski"],["Zagreb","brežuljkasti"],["Split","primorski"],
["Gospić","gorski"],["Varaždin","brežuljkasti"],["Zadar","primorski"],["Delnice","gorski"],
["Slavonski Brod","nizinski"]];
function genKrajeviHR(){const q=[];
q.push(...spajanje(PAR_KRAJ,"Spoji grad s krajem u kojem se nalazi:",{koliko:4,komada:8,difficulty:3}));
[["nizinski","ravnice, rijeke, poljoprivreda"],["brežuljkasti","blaga brda, vinogradi"],["gorski","visoke planine, šume"],["primorski","more, otoci, turizam"]].forEach(([k,o])=>{q.push({type:"choice",difficulty:2,question:`Kojem hrvatskom kraju ovo pripada: "${o}"?`,answers:sh([k,...wf(["nizinski","brežuljkasti","gorski","primorski"],k)]),correctIndex:-1,_c:k});q.push({type:"input",difficulty:3,question:`Koji se hrvatski kraj ovako opisuje? "${o}"`,correctAnswer:k})});
[["Osijek","nizinski"],["Zagreb","brežuljkasti"],["Rijeka","primorski"],["Split","primorski"],["Gospić","gorski"],["Varaždin","brežuljkasti"],["Dubrovnik","primorski"],["Slavonski Brod","nizinski"],["Delnice","gorski"],["Zadar","primorski"]].forEach(([g,k])=>q.push({type:"choice",difficulty:3,question:`Kojem kraju Hrvatske pripada ${g}?`,answers:["nizinski","brežuljkasti","gorski","primorski"],correctIndex:["nizinski","brežuljkasti","gorski","primorski"].indexOf(k)}));
[["Sava","nizinski"],["Drava","nizinski"],["Dunav","nizinski"],["Kupa","gorski"],["Neretva","primorski"],["Mrežnica","gorski"]].forEach(([r,k])=>q.push({type:"choice",difficulty:2,question:`Kroz koji grad teče rijeka ${r}?`,answers:["nizinski","brežuljkasti","gorski","primorski"],correctIndex:["nizinski","brežuljkasti","gorski","primorski"].indexOf(k)}));
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
q.push({type:"choice",difficulty:2,question:"Što jačamo hranom bogatom kalcijem?",answers:["kalcij (mlijeko)","slatkiši","gazirana pića","čips"],correctIndex:0});
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
[["sisavci","rađaju žive, doje"],["ptice","perje, nesu jaja"],["ribe","ljuske, škrge"],["gmazovi","ljuske, hladnokrvni"],["vodozemci","voda i kopno"]].forEach(([s,o])=>{q.push({type:"choice",difficulty:2,question:`Koji je ovo pjesnički izraz? "${o}"`,answers:sh([s,...wf(["sisavci","ptice","ribe","gmazovi","vodozemci"],s)]),correctIndex:-1,_c:s});q.push({type:"input",difficulty:3,question:`Koja se skupina životinja ovako opisuje? "${o}"`,correctAnswer:s})});
[["mačka","sisavac"],["orao","ptica"],["šaran","riba"],["gušter","gmaz"],["žaba","vodozemac"],["medvjed","sisavac"],["lastavica","ptica"],["zmija","gmaz"],["kit","sisavac"],["pingvin","ptica"],["pastrva","riba"],["daždevnjak","vodozemac"],["krokodil","gmaz"],["delfin","sisavac"]].forEach(([z,s])=>q.push({type:"choice",difficulty:2,question:`Kojoj skupini životinja pripada "${z}"?`,answers:["sisavac","ptica","riba","gmaz","vodozemac"],correctIndex:["sisavac","ptica","riba","gmaz","vodozemac"].indexOf(s)}));
[["šuma","stabla,gljive,životinje"],["livada","trave,cvjetovi,kukci"],["more","ribe,alge,morske živ."],["travnjak","niska veg.,sitne živ."]].forEach(([e,o])=>{q.push({type:"choice",difficulty:2,question:`Kojem ekosustavu ovo pripada: "${o}"?`,answers:sh([e,...wf(["šuma","livada","more","travnjak","jezero"],e)]),correctIndex:-1,_c:e})});
return fix(q).slice(0,210)}

const GEN_MAP={hrvatski:[genVrsteRijeci4,genPravopis4,genKnjizevnost4,genMedijskaKultura],matematika:[genBrojeviMilijun,genPisanoZbrOduz,genPisanoMnozDijel,genGeometrijaKutovi,genOpsegPovrsina,genKvaderKocka],priroda:[genUvjetiZivota,genKrajeviHR,genLjudskoTijelo,genHrvatskaDomovina,genBiljkeZivotinje4]};
async function seed(){let pogreska=false;console.log(`\n🌱 SEED ${GRADE}. razred\n`);const uri=process.env.MONGODB_URI||process.env.MONGO_URI;const client=new MongoClient(uri);try{await client.connect();const dbName=process.env.DB_NAME||(()=>{try{return new URL(uri).pathname.replace(/^\//,'')||'ucilica'}catch{return'ucilica'}})();const db=client.db(dbName);console.log(`🔗 ${db.databaseName}`);await db.collection("questions").deleteMany({grade:GRADE});await db.collection("topics").deleteMany({grade:GRADE});await db.collection("subjects").deleteMany({grade:GRADE});let t=0;for(const s of subjects){const sr=await db.collection("subjects").insertOne({...s,grade:GRADE,isActive:true,createdAt:new Date()});const si=sr.insertedId;console.log(`📘 ${s.icon} ${s.name}`);const gs=GEN_MAP[s.slug],ts=topicsDef[s.slug];for(let i=0;i<ts.length;i++){const rq=gs[i]();const tr=await db.collection("topics").insertOne({...ts[i],grade:GRADE,subject_id:si,isActive:true,createdAt:new Date()});const ti=tr.insertedId;const docs=rq.map(qq=>({type:qq.type,difficulty:qq.difficulty||1,question:qq.question,visual:qq.visual||"",hint:qq.hint||"",answers:qq.answers||[],correctIndex:typeof qq.correctIndex==="number"?qq.correctIndex:undefined,correctAnswer:qq.correctAnswer||undefined,...(qq.konstrukt?{konstrukt:qq.konstrukt}:{}),...(qq.prihvatljivi?.length?{prihvatljivi:qq.prihvatljivi}:{}),...(qq.type==="match"?{pairs:qq.pairs}:{}),grade:GRADE,subject_id:si,topic_id:ti,gik:buildQuestionMetadata({topic:{...ts[i],grade:GRADE},subject:null,difficulty:qq.difficulty||1}),isActive:true,createdAt:new Date()}));if(docs.length)await db.collection("questions").insertMany(docs);t+=docs.length;console.log(`   ${ts[i].icon} ${ts[i].name}: ${docs.length}`)}}console.log(`\n✅ ${t} pitanja`)}catch(e){console.error("❌",e);pogreska=true}finally{await client.close();process.exit(pogreska?1:0)}}
if(require.main===module){seed()}
module.exports={genVrsteRijeci4,genPravopis4,genKnjizevnost4,genMedijskaKultura,genBrojeviMilijun,genPisanoZbrOduz,genPisanoMnozDijel,genGeometrijaKutovi,genOpsegPovrsina,genKvaderKocka,genUvjetiZivota,genKrajeviHR,genLjudskoTijelo,genHrvatskaDomovina,genBiljkeZivotinje4};
