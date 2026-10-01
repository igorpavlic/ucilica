#!/usr/bin/env node
/**
 * Simulirana recenzija učitelja — prvi prolaz prije stvarne recenzije.
 *
 * Primjenjuje kontrolni popis koji učitelj razredne nastave koristi pri
 * pregledu zadataka višestrukog izbora i pitanja uz tekst. Ne zamjenjuje
 * stvarnog učitelja: hvata tragove koji djetetu odaju odgovor bez znanja,
 * preduge tekstove i krivo označene procese razumijevanja, pa učitelj
 * dobiva kraći popis na koji treba pogledati.
 *
 * Mjerila:
 *  - Haladyna, Downing i Rodriguez (2002), 31 smjernica za zadatke
 *    višestrukog izbora (duljina ponuda, apsolutni izrazi, negacija,
 *    „sve navedeno”, ponavljanje riječi iz osnove);
 *  - NCVVO, Smjernice za izradu ispitnih zadataka (ometači istog oblika);
 *  - PIRLS: procesi razumijevanja (podatak / zaključak / tumačenje /
 *    vrednovanje) i duljina teksta primjerena dobi.
 *
 * Pokretanje:
 *   node tools/recenzija-ucitelj.js                 # sažetak po temi
 *   node tools/recenzija-ucitelj.js --detalji        # i popis označenih zadataka
 *   node tools/recenzija-ucitelj.js --tema citanje-4 # samo jedna tema
 *   node tools/recenzija-ucitelj.js --strogo         # izlazni kod 1 ako ima „ODBIJ”
 */
const path = require('path');
require.cache[require.resolve('dotenv')] = { exports: { config() {} } };
const log = console.log; console.log = () => {};

const KORIJEN = path.join(__dirname, '..');
const izvori = [
  [1, require(path.join(KORIJEN, 'seeds/gen-hrvatski'))],
  [1, require(path.join(KORIJEN, 'seeds/gen-matematika'))],
  [1, require(path.join(KORIJEN, 'seeds/gen-priroda'))],
  [2, require(path.join(KORIJEN, 'seeds/seed-r2'))],
  [3, require(path.join(KORIJEN, 'seeds/seed-r3'))],
  [4, require(path.join(KORIJEN, 'seeds/seed-r4'))],
];
console.log = log;

const arg = (ime) => process.argv.includes(`--${ime}`);
const vrijednost = (ime) => { const i = process.argv.indexOf(`--${ime}`); return i > 0 ? process.argv[i + 1] : null; };

// ── Pomoćnici ───────────────────────────────────────────────────────
const norm = (s) => String(s || '').toLowerCase().replace(/[„“”"«».,!?:;()]/g, ' ').replace(/\s+/g, ' ').trim();
const rijeci = (s) => norm(s).split(' ').filter(Boolean);
const APSOLUTNI = /\b(uvijek|nikad|nikada|samo|svi|sve|svatko|nitko|ništa|potpuno)\b/i;
const SVE_NAVEDENO = /(sve navedeno|ništa od navedenog|oboje|nijedno)/i;
// Negacija u osnovi bez isticanja (NIJE / NE velikim slovima je istaknuta).
const NEGACIJA = /(^|\s)(nije|ne može|ne smije|ne pripada|ne posuđuje)(\s|$)/;
const DULJINA_TEKSTA = { 2: 110, 3: 160, 4: 200 };
const DULJINA_RECENICE = { 2: 14, 3: 16, 4: 18 };
const ZAJEDNICKE = new Set(['koji', 'koja', 'koje', 'kojem', 'kojoj', 'zašto', 'kako', 'što', 'gdje', 'kada', 'tekstu', 'tekst', 'ovom', 'ovaj', 'priče', 'priči', 'navedenih', 'navedenog', 'navedenoga', 'između']);

// Zadatci kojima je oblik (veliko slovo, točka, pravopis) upravo predmet
// znanja: ponude se namjerno razlikuju samo po tome.
const OBLIK_JE_KONSTRUKT = (q) => !!q.konstrukt || /(slov|znak|piše|pisan|pravopis|točk|interpunk|pravil|zapis|posvojn)/i.test(q.question || '');

/** Kriteriji: [kod, opis, težina (ODBIJ / DORADI / NAPOMENA), provjera(q, kontekst) → poruka|null] */
const KRITERIJI = [
  ['K1', 'Točan odgovor jedini je najdulji', 'NAPOMENA', (q) => {
    if (q.type !== 'choice' || (q.answers || []).length < 3) return null;
    const L = q.answers.map((a) => String(a).length), max = Math.max(...L);
    const t = L[q.correctIndex];
    // Trag je tek kad je točan odgovor osjetno dulji (≥ 1,4 × drugi najdulji).
    const drugi = Math.max(...L.filter((_, i) => i !== q.correctIndex));
    return t === max && L.filter((x) => x === max).length === 1 && t >= 1.25 * drugi && t - drugi >= 4
      ? `točan ${t} znakova, najdulji ometač ${drugi}` : null;
  }],
  ['K2', 'Apsolutni izrazi samo u ometačima', 'DORADI', (q) => {
    if (q.type !== 'choice') return null;
    const t = q.answers[q.correctIndex];
    const m = q.answers.filter((a, i) => i !== q.correctIndex && APSOLUTNI.test(a));
    return !APSOLUTNI.test(t) && m.length >= 2 ? `ometači: ${m.join(' / ')}` : null;
  }],
  ['K3', 'Riječ iz osnove ponovljena samo u točnom odgovoru', 'NAPOMENA', (q) => {
    if (q.type !== 'choice' || q.passage) return null;
    const osnova = new Set(rijeci(q.question).filter((w) => w.length >= 5 && !ZAJEDNICKE.has(w)));
    const t = rijeci(q.answers[q.correctIndex]);
    const ometaci = q.answers.filter((_, i) => i !== q.correctIndex).flatMap(rijeci);
    const pogodak = t.filter((w) => osnova.has(w) && !ometaci.includes(w));
    return pogodak.length ? `„${pogodak.join(', ')}”` : null;
  }],
  ['K4', 'Ponude različitog oblika (točka, veliko slovo)', 'DORADI', (q) => {
    if (q.type !== 'choice' || q.answers.length < 3 || OBLIK_JE_KONSTRUKT(q)) return null;
    const tocka = q.answers.map((a) => /[.!]$/.test(String(a).trim()));
    const veliko = q.answers.map((a) => /^[A-ZČĆŽŠĐ]/.test(String(a).trim()) && !/^[A-ZČĆŽŠĐ]{2}/.test(String(a).trim()));
    const odskace = (niz) => { const t = niz[q.correctIndex]; return niz.filter((x, i) => i !== q.correctIndex && x === t).length === 0; };
    if (odskace(tocka)) return 'samo se točan odgovor razlikuje točkom na kraju';
    if (odskace(veliko)) return 'samo se točan odgovor razlikuje početnim slovom';
    return null;
  }],
  ['K5', 'Negacija u osnovi nije istaknuta', 'NAPOMENA', (q) => (NEGACIJA.test(q.question || '') && q.type === 'choice' ? 'napiši NE / NIJE velikim slovima' : null)],
  ['K6', 'Ponuda „sve navedeno / ništa od navedenog”', 'DORADI', (q) => (q.type === 'choice' && q.answers.some((a) => SVE_NAVEDENO.test(a)) ? 'zamijeni stvarnim ometačem' : null)],
  ['K7', 'Proces „zaključak/tumačenje”, a točan je odgovor prepisan iz teksta', 'DORADI', (q) => {
    if (!q.passage || !['zakljucak', 'tumacenje'].includes(q.proces) || q.type !== 'choice') return null;
    const t = norm(q.answers[q.correctIndex]);
    return t.split(' ').length >= 3 && norm(q.passage).includes(t) ? 'odgovor doslovno stoji u tekstu — to je „podatak”' : null;
  }],
  ['K8', 'Nema objašnjenja', 'NAPOMENA', (q) => (!q.objasnjenje ? 'dodaj objašnjenje (zašto je odgovor točan)' : null)],
  ['K9', 'Dvije ponude su jednake (bez obzira na velika slova)', 'ODBIJ', (q) => {
    if (q.type !== 'choice' || OBLIK_JE_KONSTRUKT(q)) return null;
    const n = q.answers.map(norm);
    return new Set(n).size !== n.length ? 'dvostruka ponuda' : null;
  }],
];

function tekstPrimjeren(passage, razred) {
  if (!passage) return [];
  const tijelo = passage.split('\n\n').slice(1).join(' ') || passage;
  const brRijeci = rijeci(tijelo).length;
  const recenice = tijelo.split(/[.!?]+\s|\n/).filter((x) => rijeci(x).length);
  const prosjek = brRijeci / Math.max(1, recenice.length);
  const out = [];
  if (DULJINA_TEKSTA[razred] && brRijeci > DULJINA_TEKSTA[razred]) out.push(`tekst ima ${brRijeci} riječi (preporuka za ${razred}. r. ≤ ${DULJINA_TEKSTA[razred]})`);
  if (DULJINA_RECENICE[razred] && prosjek > DULJINA_RECENICE[razred]) out.push(`prosječna rečenica ${prosjek.toFixed(1)} riječi (preporuka ≤ ${DULJINA_RECENICE[razred]})`);
  return out;
}

// ── Prolaz ──────────────────────────────────────────────────────────
const samoTema = vrijednost('tema');
const rezultat = [];
const tekstovi = new Map();
for (const [razred, mod] of izvori) {
  for (const [ime, fn] of Object.entries(mod)) {
    if (!ime.startsWith('gen') || typeof fn !== 'function') continue;
    console.log = () => {};
    let qs; try { qs = fn(); } finally { console.log = log; }
    for (const q of qs) {
      const tema = ime;
      if (samoTema && !(q.tekstId || '').includes(samoTema) && !ime.toLowerCase().includes(samoTema.replace(/-/g, '').toLowerCase())) continue;
      const nalazi = [];
      for (const [kod, opis, tezina, f] of KRITERIJI) {
        const p = f(q); if (p) nalazi.push({ kod, opis, tezina, p });
      }
      if (q.passage && !tekstovi.has(q.passage)) tekstovi.set(q.passage, { razred, tema, problemi: tekstPrimjeren(q.passage, razred) });
      rezultat.push({ razred, tema, q, nalazi });
    }
  }
}

// ── Izvještaj ───────────────────────────────────────────────────────
const poTemi = new Map();
for (const r of rezultat) {
  const k = `R${r.razred} ${r.tema}`;
  if (!poTemi.has(k)) poTemi.set(k, { n: 0, izbor: 0, najdulji: 0, odbij: 0, doradi: 0, napomena: 0 });
  const t = poTemi.get(k); t.n++;
  if (r.q.type === 'choice' && r.q.answers.length >= 3) {
    t.izbor++;
    // „Osjetno najdulji”: barem 1,25 × dulji od najduljeg ometača — razliku
    // od znaka ili dva dijete ne primijeti, a četvrtinu duljine primijeti.
    const L = r.q.answers.map((a) => String(a).length);
    const drugi = Math.max(...L.filter((_, i) => i !== r.q.correctIndex));
    if (L[r.q.correctIndex] >= 1.25 * drugi && L[r.q.correctIndex] - drugi >= 4) t.najdulji++;
  }
  for (const n of r.nalazi) t[n.tezina === 'ODBIJ' ? 'odbij' : n.tezina === 'DORADI' ? 'doradi' : 'napomena']++;
}

log('# Simulirana recenzija učitelja\n');
log('| Tema | Zadataka | Točan osjetno najdulji | ODBIJ | DORADI | NAPOMENA |');
log('|---|---:|---:|---:|---:|---:|');
let ukupnoOdbij = 0;
for (const [k, t] of [...poTemi].sort()) {
  ukupnoOdbij += t.odbij;
  if (!t.odbij && !t.doradi && !(t.izbor >= 6 && t.najdulji / t.izbor > 0.2) && !arg('sve')) continue;
  const pct = t.izbor ? Math.round((100 * t.najdulji) / t.izbor) : 0;
  log(`| ${k} | ${t.n} | ${t.izbor ? `${pct} %${t.izbor >= 6 && pct > 20 ? ' ⚠' : ''}` : '—'} | ${t.odbij} | ${t.doradi} | ${t.napomena} |`);
}
const losiTekstovi = [...tekstovi].filter(([, v]) => v.problemi.length);
log(`\nTekstova: ${tekstovi.size}, s napomenom o duljini: ${losiTekstovi.length}`);
for (const [p, v] of losiTekstovi) log(`- R${v.razred} „${p.split('\n')[0].slice(0, 50)}”: ${v.problemi.join('; ')}`);

if (arg('detalji')) {
  log('\n## Označeni zadatci (ODBIJ i DORADI)\n');
  for (const r of rezultat) {
    const ozbiljni = r.nalazi.filter((n) => n.tezina !== 'NAPOMENA');
    if (!ozbiljni.length) continue;
    log(`- **R${r.razred} ${r.tema}** — ${r.q.question.slice(0, 90)}`);
    if (r.q.answers) log(`  ponude: ${r.q.answers.map((a, i) => (i === r.q.correctIndex ? `**${a}**` : a)).join(' · ')}`);
    for (const n of ozbiljni) log(`  - ${n.tezina} ${n.kod} ${n.opis}: ${n.p}`);
  }
}
if (arg('strogo') && ukupnoOdbij) process.exit(1);
