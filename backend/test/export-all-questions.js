const Module=require('module');
const origLoad=Module._load;
Module._load=function(request,parent,isMain){
  if(request==='dotenv') return {config:()=>({})};
  if(request==='mongodb') return {MongoClient: class {}};
  return origLoad.apply(this,arguments);
};
const path=require('path');
const fam=require('../services/questionFamily');
const rows=[];
function add(grade, subject, topic, genName, fn){
  const qs=fn();
  qs.forEach((q,i)=>{
    let correct='';
    if(q.type==='choice' && Array.isArray(q.answers) && Number.isInteger(q.correctIndex) && q.correctIndex>=0) correct=String(q.answers[q.correctIndex]);
    else if(q.type==='input') correct=String(q.correctAnswer??'');
    else if(q.type==='match') correct=(q.pairs||[]).map(p=>`${p[0]} -> ${p[1]}`).join(' | ');
    let family='';
    try { family=fam.questionFamilyKey?fam.questionFamilyKey(q):fam.getQuestionFamily?q.getQuestionFamily(q):''; } catch(e){}
    rows.push({id:`R${grade}-${String(rows.length+1).padStart(5,'0')}`,grade,subject,topic,generator:genName,index:i+1,type:q.type||'',difficulty:q.difficulty||1,question:q.question||'',visual:q.visual||'',answers:Array.isArray(q.answers)?q.answers.join(' | '):'',correct,pairs:q.type==='match'?JSON.stringify(q.pairs||[]):'',family});
  });
}
const g1h=require('../seeds/gen-hrvatski'), g1m=require('../seeds/gen-matematika'), g1p=require('../seeds/gen-priroda');
[
['Hrvatski jezik','Velika i mala slova','genSlova',g1h.genSlova],['Hrvatski jezik','Samoglasnici i suglasnici','genGlasovi',g1h.genGlasovi],['Hrvatski jezik','Slaganje riječi','genRijeci',g1h.genRijeci],['Hrvatski jezik','Rečenice','genRecenice',g1h.genRecenice],
['Matematika','Brojevi do 20','genBrojevi',g1m.genBrojevi],['Matematika','Zbrajanje do 10','genZbrajanje',g1m.genZbrajanje],['Matematika','Oduzimanje do 10','genOduzimanje',g1m.genOduzimanje],['Matematika','Veće, manje, jednako','genUsporedbe',g1m.genUsporedbe],['Matematika','Geometrija','genGeometrija',g1m.genGeometrija],['Matematika','Nizovi i mjerenja','genNizovi',g1m.genNizovi],
['Priroda i društvo','Godišnja doba','genDoba',g1p.genDoba],['Priroda i društvo','Životinje','genZivotinje',g1p.genZivotinje],['Priroda i društvo','Moje tijelo','genTijelo',g1p.genTijelo],['Priroda i društvo','Obitelj i dom','genObitelj',g1p.genObitelj],['Priroda i društvo','Sigurnost i promet','genSigurnost',g1p.genSigurnost],['Priroda i društvo','Ekologija i zajednica','genEkologija',g1p.genEkologija]
].forEach(x=>add(1,...x));

const r2=require('../seeds/seed-r2');
[
['Hrvatski jezik','Imenice','genImeniceRod',r2.genImeniceRod],['Hrvatski jezik','Riječi i značenje','genGlagoli2',r2.genGlagoli2],['Hrvatski jezik','Rečenice i interpunkcija','genRecenice2',r2.genRecenice2],['Hrvatski jezik','Čitanje i razumijevanje','genCitanje2',r2.genCitanje2],
['Matematika','Brojevi do 100','genBrojevi100',r2.genBrojevi100],['Matematika','Zbrajanje do 100','genZbrajanje100',r2.genZbrajanje100],['Matematika','Oduzimanje do 100','genOduzimanje100',r2.genOduzimanje100],['Matematika','Množenje i dijeljenje','genMnozenjeDijeljenje',r2.genMnozenjeDijeljenje],['Matematika','Geometrija 2','genGeometrija2',r2.genGeometrija2],['Matematika','Mjerenje i novac','genMjerenjeNovac',r2.genMjerenjeNovac],
['Priroda i društvo','Zavičaj i snalaženje','genZavicaj',r2.genZavicaj],['Priroda i društvo','Godišnja doba i vrijeme','genDobaVrijeme',r2.genDobaVrijeme],['Priroda i društvo','Biljke i životinje','genBiljkeZivotinje',r2.genBiljkeZivotinje],['Priroda i društvo','Voda i tlo','genVodaTlo',r2.genVodaTlo],['Priroda i društvo','Zdravlje i sigurnost','genZdravljeSigurnost2',r2.genZdravljeSigurnost2]
].forEach(x=>add(2,...x));

const r3=require('../seeds/seed-r3');
[
['Hrvatski jezik','Vrste riječi','genVrsteRijeci',r3.genVrsteRijeci],['Hrvatski jezik','Gramatika i pravopis','genGramatikaPravopis',r3.genGramatikaPravopis],['Hrvatski jezik','Književni tekstovi','genKnjizevniTekst',r3.genKnjizevniTekst],['Hrvatski jezik','Jezično izražavanje','genJezicnoIzrazavanje',r3.genJezicnoIzrazavanje],
['Matematika','Brojevi do 10 000','genBrojevi1000',r3.genBrojevi1000],['Matematika','Zbrajanje i oduzimanje do 1000','genZbrOduz1000',r3.genZbrOduz1000],['Matematika','Množenje i dijeljenje','genMnozDijel3',r3.genMnozDijel3],['Matematika','Geometrija i mjerenje','genGeometrijaMjerenje3',r3.genGeometrijaMjerenje3],
['Priroda i društvo','Zavičaj i karta','genZavicajKarta',r3.genZavicajKarta],['Priroda i društvo','Tlo, voda, zrak','genTloVodaZrak',r3.genTloVodaZrak],['Priroda i društvo','Biljke i životinje zavičaja','genBiljkeZivotinje3',r3.genBiljkeZivotinje3],['Priroda i društvo','Gospodarske djelatnosti','genGospodarskeDjelatnosti',r3.genGospodarskeDjelatnosti],['Priroda i društvo','Kulturna baština','genKulturnaBastina',r3.genKulturnaBastina]
].forEach(x=>add(3,...x));

const r4=require('../seeds/seed-r4');
[
['Hrvatski jezik','Imenice, glagoli, pridjevi','genVrsteRijeci4',r4.genVrsteRijeci4],['Hrvatski jezik','Pravopis i gramatika','genPravopis4',r4.genPravopis4],['Hrvatski jezik','Književnost','genKnjizevnost4',r4.genKnjizevnost4],['Hrvatski jezik','Medijska kultura','genMedijskaKultura',r4.genMedijskaKultura],
['Matematika','Brojevi do milijun','genBrojeviMilijun',r4.genBrojeviMilijun],['Matematika','Pisano zbrajanje i oduzimanje','genPisanoZbrOduz',r4.genPisanoZbrOduz],['Matematika','Pisano množenje i dijeljenje','genPisanoMnozDijel',r4.genPisanoMnozDijel],['Matematika','Geometrija — kutovi i likovi','genGeometrijaKutovi',r4.genGeometrijaKutovi],['Matematika','Površina','genOpsegPovrsina',r4.genOpsegPovrsina],['Matematika','Kvader i kocka','genKvaderKocka',r4.genKvaderKocka],
['Priroda i društvo','Prirodni uvjeti života','genUvjetiZivota',r4.genUvjetiZivota],['Priroda i društvo','Krajevi Hrvatske','genKrajeviHR',r4.genKrajeviHR],['Priroda i društvo','Ljudsko tijelo','genLjudskoTijelo',r4.genLjudskoTijelo],['Priroda i društvo','Hrvatska — domovina','genHrvatskaDomovina',r4.genHrvatskaDomovina],['Priroda i društvo','Biljke i životinje','genBiljkeZivotinje4',r4.genBiljkeZivotinje4]
].forEach(x=>add(4,...x));

console.log(JSON.stringify(rows));
