/** Regression checks for pedagogical/content issues found in 2026 review. */
const path=require('path');
const seeds=path.join(__dirname,'..','seeds');
const modules=['gen-hrvatski','gen-matematika','gen-priroda','seed-r2','seed-r3','seed-r4'].map(x=>require(path.join(seeds,x)));
const all=[]; for(const m of modules) for(const [name,fn] of Object.entries(m)) if(name.startsWith('gen')&&typeof fn==='function') for(const q of fn()) all.push({...q,_gen:name});
const text=q=>`${q.question||''} ${(q.answers||[]).join(' ')} ${q.correctAnswer||''}`;
const forbidden=[
 /Footballer/i,
 /Koji je ovo pjesnički izraz\? "rađaju žive, doje"/i,
 /Što obavezno nosimo na biciklu\?.*stazom/i,
 /Što sve živi u tlu\?/i,
 /Kroz koji grad teče rijeka .*?(nizinski|brežuljkasti|gorski|primorski)/i,
 /Koliko stupnjeva ima (pravi|ravni|puni) kut/i,
 /volumen kocke/i,
 /Koliko novca prikazuje .* boja/i,
 /mlijeko i sir/i,
 /Uz koji se hrvatski kraj u ovom zadatku povezuje rijeka/i,
 /\b\d+\s*kn\b/i,
 /Koliko kuna (sada ima|dobije natrag|ostane)/i
];
const bad=all.filter(q=>forbidden.some(r=>r.test(text(q))));
if(bad.length){console.error('PEDAGOŠKI REGRESSION:',bad.slice(0,10).map(q=>q.question));process.exit(1)}
// The shared shuffle must not force a single permutation.
const {sh}=require(path.join(seeds,'gen-hrvatski'));
const variants=new Set(Array.from({length:80},()=>sh(['T','A','B','C']).join('|')));
if(variants.size<4){console.error('Shuffle nema dovoljnu varijabilnost:',[...variants]);process.exit(1)}

// Sustavna provjera položaja točnog odgovora. Na više generiranja svaka od
// četiri pozicije mora ostati približno jednako zastupljena. Time se hvata
// regresija poput stare determinističke permutacije koja je gurala odgovor na 4. mjesto.
const positions=[0,0,0,0]; let positionTotal=0;
for(let round=0;round<12;round++) {
  for(const m of modules) {
    for(const [name,fn] of Object.entries(m)) {
      if(!name.startsWith('gen') || typeof fn!=='function') continue;
      for(const q of fn()) {
        if(q.type!=='choice' || !Array.isArray(q.answers) || q.answers.length!==4) continue;
        let ci=q.correctIndex;
        if(ci===-1 && q._c!==undefined) ci=q.answers.indexOf(q._c);
        if(Number.isInteger(ci) && ci>=0 && ci<4) { positions[ci]++; positionTotal++; }
      }
    }
  }
}
if(positionTotal<1000){console.error('Premalo choice pitanja za test položaja:',positionTotal);process.exit(1)}
const udjeli=positions.map(n=>n/positionTotal);
if(udjeli.some(p=>p<0.20 || p>0.30)) {
  console.error('Pronađena pristranost položaja točnog odgovora:', positions, udjeli.map(p=>(p*100).toFixed(1)+'%'));
  process.exit(1);
}

console.log(`OK: ${all.length} pitanja; nema poznatih semantičkih regresija; shuffle varijante=${variants.size}; položaji=${positions.map(n=>(100*n/positionTotal).toFixed(1)+'%').join('/')}`);
