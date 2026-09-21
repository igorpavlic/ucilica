/**
 * gen-engine.js — Motor za raznovrsno generiranje pitanja
 * Koriste ga svi seed-r*.js generatori
 */
const { sh, cfc, fix, N, IF, IM, EL, rep } = require('./gen-hrvatski');
const HR = require('./hr-gramatika');
const pick = a => a[Math.floor(Math.random()*a.length)];
const pickN = (a,n) => sh([...a]).slice(0,n);
const wf = (pool,c,n=3) => sh(pool.filter(x=>x!==c)).slice(0,n);
const randInt = (min,max) => Math.floor(Math.random()*(max-min+1))+min;
// sh() iz gen-hrvatski.js je NAMJERNO determinističan (stabilan redoslijed
// distraktora). Kad treba stvarna nasumičnost — npr. različiti podskupovi
// parova — koristi ovo.
const shR = (a) => { const x=[...a]; for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];} return x; };
const pickNR = (a,n) => shR(a).slice(0,n);
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

/**
 * storyProb — tekstualni zadaci s ispravnim hrvatskim slaganjem.
 *
 * Svaki predložak dobiva kontekst `c` iz hr-gramatika:
 *   c.ime  ime djeteta          c.rod  rod imena
 *   c.N(n) "5 jabuka"  (subjekt)   c.A(n) "1 jabuku" (objekt)
 *   c.im(n) samo imenica         c.gl('dobi') → dobio/dobila
 *   c.zam  mu/joj                c.posv Anin/Markov
 */
function storyProb(op, ranges, count = 30) {
  const q = [];
  const V = HR.vel;

  // jestivo: true → predložak spominje jelo/piće, pa imenica mora biti jestiva
  const tplAdd = [
    { jestivo: false, f: (c) => `${c.ime} ima ${c.N(c.a)}. Dobije još ${c.A(c.b)}. Koliko ih sada ima?` },
    { jestivo: false, f: (c) => `U ${pick(CONTAINERS)} ${c.je(c.a)} ${c.N(c.a)}. ${c.ime} doda još ${c.A(c.b)}. Koliko ih je ukupno?` },
    { jestivo: false, f: (c) => `${V(pick(PLACES))} ${c.ime} skupi ${c.A(c.a)}, a prijatelj donese još ${c.A(c.b)}. Koliko ih je zajedno?` },
    { jestivo: false, f: (c) => `${c.ime} nacrta ${c.A(c.a)} ujutro i ${c.A(c.b)} popodne. Koliko ih je ${c.gl('nacrta')} ukupno?` },
    { jestivo: false, f: (c) => `U prvom redu ${c.je(c.a)} ${c.N(c.a)}, a u drugom ${c.N(c.b)}. Koliko ih je ukupno?` },
    { jestivo: false, f: (c) => `${c.ime} je ${c.gl('kupi')} ${c.A(c.a)}, a zatim još ${c.A(c.b)}. Koliko ih ima?` },
    { jestivo: true,  f: (c) => `Na stolu ${c.je(c.a)} ${c.N(c.a)}. Mama donese još ${c.A(c.b)}. Koliko ih je na stolu?` },
    { jestivo: null,  f: (c) => `${c.ime} pročita ${HR.brojIme(c.a, 'stranica', 'A')}, a sutra još ${HR.brojIme(c.b, 'stranica', 'A')}. Koliko ukupno?` },
    { jestivo: null,  f: (c) => `${V(pick(PLACES))} ${HR.biti(c.a)} ${HR.brojIme(c.a, 'dijete')}. Dođe još ${HR.brojIme(c.b, 'dijete')}. Koliko ih je sada?` },
    { jestivo: null,  f: (c) => `Na grani ${HR.glagolBroj(c.a,'sjedi','sjede')} ${HR.brojIme(c.a, 'ptica')}. Doleti još ${HR.brojIme(c.b, 'ptica')}. Koliko ih je na grani?` },
    { jestivo: null,  f: (c) => `${c.ime} ima ${HR.brojIme(c.a, 'kuna')}. Dobije još ${HR.brojIme(c.b, 'kuna', 'A')}. Koliko kuna sada ima?` },
  ];

  const tplSub = [
    { jestivo: true,  f: (c) => `${c.ime} ima ${c.N(c.a)}. Pojede ${c.A(c.b)}. Koliko ${c.zam} ostane?` },
    { jestivo: false, f: (c) => `U ${pick(CONTAINERS)} ${c.je(c.a)} ${c.N(c.a)}. ${c.ime} uzme ${c.A(c.b)}. Koliko ih ostane?` },
    { jestivo: false, f: (c) => `${c.ime} ima ${c.N(c.a)}. Pokloni ${c.A(c.b)} prijatelju. Koliko ${c.zam} ostane?` },
    { jestivo: false, f: (c) => `${c.ime} skupi ${c.A(c.a)}, ali izgubi ${c.A(c.b)}. Koliko ${c.zam} ostane?` },
    { jestivo: false, f: (c) => `${V(pick(PLACES))} ${c.je(c.a)} ${c.N(c.a)}. Netko odnese ${c.A(c.b)}. Koliko ih ostane?` },
    { jestivo: null,  f: (c) => `${V(pick(PLACES))} ${HR.biti(c.a)} ${HR.brojIme(c.a, 'dijete')}. Ode ${HR.brojIme(c.b, 'dijete')}. Koliko ih ostane?` },
    { jestivo: null,  f: (c) => `${c.ime} ima ${HR.brojIme(c.a, 'kuna')}. Potroši ${HR.brojIme(c.b, 'kuna', 'A')}. Koliko ${c.zam} kuna ostane?` },
    { jestivo: null,  f: (c) => `Na grani ${HR.glagolBroj(c.a,'sjedi','sjede')} ${HR.brojIme(c.a, 'ptica')}. Odleti ${HR.brojIme(c.b, 'ptica')}. Koliko ih ostane?` },
    { jestivo: null,  f: (c) => `U autobusu ${HR.biti(c.a)} ${HR.brojIme(c.a, 'putnik')}. Izađe ${HR.brojIme(c.b, 'putnik')}. Koliko ih ostane?` },
    { jestivo: null,  f: (c) => `U vrtu ${HR.glagolBroj(c.a,'raste','rastu')} ${HR.brojIme(c.a, 'cvijet')}. Uvene ${HR.brojIme(c.b, 'cvijet')}. Koliko ih još raste?` },
  ];

  const tplMul = [
    { jestivo: false, f: (c) => `${c.ime} ima ${HR.brojIme(c.a, 'kutija', 'A')}, a u svakoj ${c.je(c.b)} ${c.N(c.b)}. Koliko ih je ukupno?` },
    { jestivo: false, f: (c) => `U svakom od ${HR.brojIme(c.a, 'red')} stoji po ${HR.brojIme(c.b, 'dijete')}. Koliko je djece ukupno?` },
    { jestivo: true,  f: (c) => `${c.ime} kupi ${HR.brojIme(c.a, 'paket', 'A')}, a u svakom ${c.je(c.b)} ${c.N(c.b)}. Koliko ih je ukupno?` },
    { jestivo: null,  f: (c) => `Na svakom od ${HR.brojIme(c.a, 'stablo')} visi po ${HR.brojIme(c.b, 'jabuka')}. Koliko je jabuka ukupno?` },
    { jestivo: false, f: (c) => `Svako od ${HR.brojIme(c.a, 'dijete')} ima po ${c.N(c.b)}. Koliko ih je ukupno?` },
  ];

  const tplDiv = [
    { jestivo: false, f: (c) => `${c.ime} dijeli ${c.A(c.a)} na ${HR.brojIme(c.b, 'hrpa', 'A')}. Koliko ih je u svakoj hrpi?` },
    { jestivo: true,  f: (c) => `${c.N(c.a)} treba podijeliti na ${HR.brojIme(c.b, 'dijete')}. Koliko dobije svako dijete?` },
    { jestivo: false, f: (c) => `${c.ime} stavi ${c.A(c.a)} u ${HR.brojIme(c.b, 'kutija', 'A')}. Koliko ih je u svakoj kutiji?` },
  ];

  const tpls = { '+': tplAdd, '-': tplSub, '*': tplMul, '/': tplDiv };
  const fns = { '+': (a, b) => a + b, '-': (a, b) => a - b, '*': (a, b) => a * b, '/': (a, b) => a / b };
  const [aMin, aMax] = ranges.a, [bMin, bMax] = ranges.b;
  const t = tpls[op], fn = fns[op];

  for (let i = 0; i < count; i++) {
    let a, b;
    if (op === '/') {
      b = Math.max(2, randInt(bMin, bMax));
      const quot = randInt(2, Math.max(2, Math.floor(aMax / b)));
      a = b * quot;
    } else {
      a = randInt(aMin, aMax);
      b = randInt(bMin, bMax);
    }
    if (op === '-' && b >= a) continue;
    const r = fn(a, b);
    if (r < 0 || (op === '/' && r !== Math.floor(r))) continue;

    const tpl = t[i % t.length];
    const filtar = tpl.jestivo === null ? {} : { jestivo: tpl.jestivo };
    const c = HR.kontekst(a, b, filtar);
    q.push({
      type: 'input',
      difficulty: r <= 20 ? 2 : 3,
      question: tpl.f(c),
      correctAnswer: String(r),
    });
  }
  return q;
}


/**
 * spajanje — pitanje tipa "match": povuci lijevo na desno.
 * Za 1. i 2. razred prirodnije od tipkanja.
 *
 *   parovi   [[lijevo, desno], ...]  cijeli skup iz kojeg se bira
 *   naslov   tekst pitanja
 *   koliko   parova po pitanju (3-5)
 *   komada   koliko pitanja generirati
 */
function spajanje(parovi, naslov, { koliko = 4, komada = 8, difficulty = 2 } = {}) {
  const q = [];
  const n = Math.max(3, Math.min(5, koliko));
  if (parovi.length < n) return q;

  const vidjeno = new Set();
  for (let i = 0; i < komada * 8 && q.length < komada; i++) {
    // Desni članovi moraju biti različiti, inače je zadatak dvosmislen:
    // uz dva "ženski" dijete ne može znati koji je "pravi" par.
    const izbor = [];
    const desniUzeti = new Set();
    for (const par of shR(parovi)) {
      if (izbor.length >= n) break;
      if (desniUzeti.has(par[1])) continue;
      desniUzeti.add(par[1]);
      izbor.push(par);
    }
    if (izbor.length < 3) break; // skup ne može dati dovoljno različitih parova

    const kljuc = izbor.map((p) => p[0]).sort().join('|');
    if (vidjeno.has(kljuc)) continue;
    vidjeno.add(kljuc);
    q.push({ type: 'match', difficulty, question: naslov, pairs: izbor });
  }
  return q;
}

function multiFormat(facts){const q=[];const terms=facts.map(f=>f.term),defs=facts.map(f=>f.def);
facts.forEach(f=>{q.push({type:"choice",difficulty:f.diff||2,question:`Kako se zove ovo: ${f.def}?`,answers:sh([f.term,...wf(terms,f.term)]),correctIndex:-1,_c:f.term});
if(f.reverse!==false)q.push({type:"choice",difficulty:(f.diff||2)+1,question:`Što je "${f.term}"?`,answers:sh([f.def,...wf(defs,f.def)]),correctIndex:-1,_c:f.def});
if(f.inputQ)q.push({type:"input",difficulty:(f.diff||2)+1,question:f.inputQ,correctAnswer:f.inputA||f.term})});return q}

function oddOneOut(cats,count=15){const q=[];const cn=Object.keys(cats);
for(let i=0;i<count;i++){const mc=cn[i%cn.length],oc=cn[(i+1)%cn.length];const main=pickN(cats[mc],3),odd=pick(cats[oc]);const all=sh([...main,odd]);
q.push({type:"choice",difficulty:3,question:`Koji pojam NE pripada u skupinu: ${all.join(", ")}?`,answers:all,correctIndex:all.indexOf(odd)})}return q}

function trueFalse(stmts){return stmts.map(s=>({type:"choice",difficulty:s.diff||2,question:`Točno ili netočno: "${s.text}"`,answers:["Točno","Netočno"],correctIndex:s.correct?0:1}))}

module.exports={spajanje,pick,pickN,pickNR,shR,wf,randInt,smartDistAdd,smartDistSub,smartDistMul,smartChoice,mathCombi,storyProb,multiFormat,oddOneOut,trueFalse,PLACES,CONTAINERS};
