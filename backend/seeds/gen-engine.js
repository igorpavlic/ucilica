/**
 * gen-engine.js — Motor za raznovrsno generiranje pitanja
 * Koriste ga svi seed-r*.js generatori
 */
const { sh, cfc, fix, N, IF, IM, EL, rep } = require('./gen-hrvatski');
const pick = a => a[Math.floor(Math.random()*a.length)];
const pickN = (a,n) => sh([...a]).slice(0,n);
const wf = (pool,c,n=3) => sh(pool.filter(x=>x!==c)).slice(0,n);
const randInt = (min,max) => Math.floor(Math.random()*(max-min+1))+min;
const PLACES=["u parku","u školi","u dvorištu","na livadi","u vrtu","na plaži","u šumi","na izletu","u razredu","na igralištu","u kuhinji","u sobi","na trgu","u knjižnici","na farmi"];
const CONTAINERS=["kutiji","košari","vrećici","ladici","polici","torbi","pernici","posudi","staklenki","kutijici"];

function smartDistAdd(a,b,sum){const d=new Set();d.add(sum+1);d.add(sum-1);d.add(sum+10);d.add(sum-10);d.add(Math.abs(a-b));d.add(a);return[...d].filter(x=>x!==sum&&x>=0&&x!==a&&x!==b).map(String).slice(0,3)}
function smartDistSub(a,b,diff){const d=new Set();d.add(diff+1);d.add(diff-1);d.add(a+b);d.add(diff+10);d.add(diff-10);return[...d].filter(x=>x!==diff&&x>=0).map(String).slice(0,3)}
function smartDistMul(a,b,p){const d=new Set();d.add(a+b);d.add(p+a);d.add(p-a);d.add(p+1);d.add(p-1);d.add((a+1)*b);return[...d].filter(x=>x!==p&&x>0).map(String).slice(0,3)}
function smartChoice(q,correct,dist,diff=2){const ans=sh([String(correct),...dist.slice(0,3)]);const ci=ans.indexOf(String(correct));return{type:"choice",difficulty:diff,question:q,answers:ans,correctIndex:ci===-1?0:ci}}

function mathCombi(op,ranges,filter,maxQ=80){const q=[];const[aMin,aMax,aS]=ranges.a,[bMin,bMax,bS]=ranges.b;
const ops={"+":((a,b)=>a+b),"-":((a,b)=>a-b),"*":((a,b)=>a*b),"/":((a,b)=>a/b)};
const sym={"+":"+","-":"-","*":"×","/":"÷"};const fn=ops[op],s=sym[op];
const distFn=op==="+"?smartDistAdd:op==="-"?smartDistSub:op==="*"?smartDistMul:null;
for(let a=aMin;a<=aMax;a+=aS){for(let b=bMin;b<=bMax;b+=bS){if(q.length>=maxQ)break;const r=fn(a,b);if(filter&&!filter(a,b,r))continue;
q.push({type:"input",difficulty:r<=20?1:r<=100?2:3,question:`${a} ${s} ${b} = ?`,correctAnswer:String(r)});
if(q.length%3===0&&distFn){const d=distFn(a,b,r);if(d.length>=3)q.push(smartChoice(`${a} ${s} ${b} = ?`,r,d,r<=20?1:2))}}}
return sh(q).slice(0,maxQ)}

function storyProb(op,ranges,count=30){const q=[];
const tplAdd=[(n,a,b,it)=>`${n} ima ${a} ${it}. Dobije još ${b}. Koliko sada?`,(n,a,b,it)=>`U ${pick(CONTAINERS)} je ${a} ${it}. ${n} doda ${b}. Ukupno?`,(n,a,b,it)=>`${pick(PLACES)}, ${n} skupi ${a} ${it}. Prijatelj donese ${b}. Zajedno?`,(n,a,b,it)=>`${n} pročita ${a} str., pa još ${b}. Ukupno?`,(n,a,b,it)=>`${pick(PLACES)} je ${a} djece. Dođe ${b}. Koliko sada?`,(n,a,b,it)=>`${n} ima ${a} kn. Dobije ${b} kn. Koliko sada?`,(n,a,b,it)=>`Na grani ${a} ptica. Doleti ${b}. Koliko na grani?`,(n,a,b,it)=>`${n} nacrta ${a} ${it} ujutro i ${b} popodne. Ukupno?`,(n,a,b,it)=>`${n} ubere ${a} ${it}. Mama ubere ${b}. Zajedno?`,(n,a,b,it)=>`U prvom redu ${a}, u drugom ${b} ${it}. Ukupno?`];
const tplSub=[(n,a,b,it)=>`${n} ima ${a} ${it}. Pojede ${b}. Koliko ostane?`,(n,a,b,it)=>`U ${pick(CONTAINERS)} ${a} ${it}. ${n} uzme ${b}. Ostane?`,(n,a,b,it)=>`${pick(PLACES)} je ${a} djece. Ode ${b}. Ostane?`,(n,a,b,it)=>`${n} ima ${a} kn. Kupi ${it} za ${b} kn. Ostane?`,(n,a,b,it)=>`Na grani ${a} ptica. Odleti ${b}. Ostane?`,(n,a,b,it)=>`${n} ima ${a} ${it}. Pokloni ${b}. Ostane?`,(n,a,b,it)=>`U busu ${a} putnika. Izađe ${b}. Ostane?`,(n,a,b,it)=>`${n} skupi ${a} ${it}. Izgubi ${b}. Ostane?`,(n,a,b,it)=>`${pick(PLACES)} raste ${a} ${it}. Uvene ${b}. Ostane?`,(n,a,b,it)=>`${n} ima ${a} naljepnica. Da ${b}. Ostane?`];
const tplMul=[(n,a,b,it)=>`${n} ima ${a} kutije po ${b} ${it}. Ukupno?`,(n,a,b,it)=>`U ${a} redova po ${b} djece. Ukupno?`,(n,a,b,it)=>`Na ${a} stabala po ${b} jabuka. Ukupno?`,(n,a,b,it)=>`${n} kupi ${a} paketa po ${b} ${it}. Ukupno?`,(n,a,b,it)=>`${a} djece ima po ${b} ${it}. Ukupno?`];
const tplDiv=[(n,a,b,it)=>`${n} dijeli ${a} ${it} na ${b} hrpa. Koliko u svakoj?`,(n,a,b,it)=>`${a} ${it} na ${b} djece. Koliko svako?`,(n,a,b,it)=>`${n} stavi ${a} ${it} u ${b} ${pick(CONTAINERS)}. Koliko u svakoj?`];
const tpls={"+":tplAdd,"-":tplSub,"*":tplMul,"/":tplDiv};
const fns={"+":((a,b)=>a+b),"-":((a,b)=>a-b),"*":((a,b)=>a*b),"/":((a,b)=>a/b)};
const[aMin,aMax]=ranges.a,[bMin,bMax]=ranges.b;const t=tpls[op],fn=fns[op];
for(let i=0;i<count;i++){let a,b;if(op==="/"){b=randInt(bMin,bMax);const quot=randInt(2,Math.floor(aMax/b));a=b*quot}else{a=randInt(aMin,aMax);b=randInt(bMin,bMax)}
if(op==="-"&&b>=a)continue;const r=fn(a,b);if(r<0||(op==="/"&&r!==Math.floor(r)))continue;
q.push({type:"input",difficulty:r<=20?2:3,question:t[i%t.length](N(),a,b,IF()),correctAnswer:String(r)})}
return q}

function multiFormat(facts){const q=[];const terms=facts.map(f=>f.term),defs=facts.map(f=>f.def);
facts.forEach(f=>{q.push({type:"choice",difficulty:f.diff||2,question:`${f.def} — to je?`,answers:sh([f.term,...wf(terms,f.term)]),correctIndex:-1,_c:f.term});
if(f.reverse!==false)q.push({type:"choice",difficulty:(f.diff||2)+1,question:`Što je "${f.term}"?`,answers:sh([f.def,...wf(defs,f.def)]),correctIndex:-1,_c:f.def});
if(f.inputQ)q.push({type:"input",difficulty:(f.diff||2)+1,question:f.inputQ,correctAnswer:f.inputA||f.term})});return q}

function oddOneOut(cats,count=15){const q=[];const cn=Object.keys(cats);
for(let i=0;i<count;i++){const mc=cn[i%cn.length],oc=cn[(i+1)%cn.length];const main=pickN(cats[mc],3),odd=pick(cats[oc]);const all=sh([...main,odd]);
q.push({type:"choice",difficulty:3,question:`Što NE pripada: ${all.join(", ")}?`,answers:all,correctIndex:all.indexOf(odd)})}return q}

function trueFalse(stmts){return stmts.map(s=>({type:"choice",difficulty:s.diff||2,question:`Točno ili netočno: "${s.text}"`,answers:["Točno","Netočno"],correctIndex:s.correct?0:1}))}

module.exports={pick,pickN,wf,randInt,smartDistAdd,smartDistSub,smartDistMul,smartChoice,mathCombi,storyProb,multiFormat,oddOneOut,trueFalse,PLACES,CONTAINERS};
