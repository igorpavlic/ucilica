#!/usr/bin/env node
/**
 * provjeri-pitanja.js — kontrola kvalitete svih generiranih pitanja.
 *
 * Pokretanje:  npm test          (iz backend/ mape)
 * Izlazni kod: 0 = sve u redu, 1 = pao barem jedan test → CI ruši build.
 *
 * Ne dira bazu. Samo pokreće generatore i provjerava što proizvode.
 */

const path = require('path');
const HR = require('../seeds/hr-gramatika');

const SEEDS = path.join(__dirname, '..', 'seeds');
const MODULI = {
  'gen-hrvatski': 1, 'gen-matematika': 1, 'gen-priroda': 1,
  'seed-r2': 2, 'seed-r3': 3, 'seed-r4': 4,
  'nove-teme-r1': 1,
};

// ── prikupi sva pitanja ────────────────────────────────────────────
const sva = [];
const greskeGeneratora = [];

for (const [modul, razred] of Object.entries(MODULI)) {
  let mod;
  try {
    mod = require(path.join(SEEDS, modul));
  } catch (e) {
    greskeGeneratora.push(`${modul}: modul se ne učitava — ${e.message}`);
    continue;
  }
  for (const [ime, fn] of Object.entries(mod)) {
    if (typeof fn !== 'function' || !ime.startsWith('gen')) continue;
    try {
      const pitanja = fn();
      if (!Array.isArray(pitanja) || pitanja.length === 0) {
        greskeGeneratora.push(`${modul}::${ime} vraća 0 pitanja`);
        continue;
      }
      pitanja.forEach((q) => sva.push({ ...q, _gen: ime, _modul: modul, _razred: razred }));
    } catch (e) {
      greskeGeneratora.push(`${modul}::${ime} baca iznimku — ${e.message}`);
    }
  }
}

// ── pomoćno ────────────────────────────────────────────────────────
const rezultati = [];
function test(naziv, losa, prikazi = (q) => `[R${q._razred}/${q._gen}] ${q.question}`) {
  rezultati.push({ naziv, broj: losa.length, primjeri: losa.slice(0, 5).map(prikazi) });
}

// ── 0. dosljednost rječnika imenica ────────────────────────────────
// Tablica je pisana ručno; ovo hvata tipfelere prije nego dođu do djeteta.
const lošiUnosi = [];
const bezDij = (x) => x.replace(/č|ć/g, 'c').replace(/ž/g, 'z').replace(/š/g, 's').replace(/đ/g, 'd');

for (const [kljuc, im] of Object.entries(HR.IMENICE)) {
  const kvar = (razlog) => lošiUnosi.push({ _gen: 'rječnik', _razred: '—', question: `${kljuc}: ${razlog}` });

  if (!Array.isArray(im.o) || im.o.length !== 3 || im.o.some((x) => !x || !x.trim())) {
    kvar(`oblici moraju biti tri neprazna niza, dobiveno ${JSON.stringify(im.o)}`);
    continue;
  }
  const [Njd, Gjd, Gmn] = im.o;
  if (!['m', 'z', 's'].includes(im.rod)) kvar(`nepoznat rod "${im.rod}"`);
  if (bezDij(Njd) !== kljuc) kvar(`ključ bi trebao biti "${bezDij(Njd)}" prema N jd "${Njd}"`);
  if (im.zivo && im.rod !== 'm') kvar('zivo ima smisla samo uz muški rod');
  // Životinje i ljudi u muškom rodu su gramatički živi — bez toga bi
  // generator napisao "vidim lav" umjesto "vidim lava".
  if (im.rod === 'm' && ['zivotinje', 'ljudi'].includes(im.kat) && !im.zivo) {
    kvar(`kategorija "${im.kat}" u muškom rodu traži zivo: true`);
  }

  const A = HR.akuzativJd(kljuc);
  if (im.rod === 'z' && Njd.endsWith('a')) {
    if (!Gjd.endsWith('e')) kvar(`ž rod na -a: G jd "${Gjd}" bi trebao završavati na -e`);
    if (!A.endsWith('u')) kvar(`ž rod na -a: A jd "${A}" bi trebao završavati na -u`);
    if (Gjd.slice(0, -1) !== Njd.slice(0, -1)) kvar(`osnova se ne poklapa: "${Njd}" / "${Gjd}"`);
  }
  if (im.rod === 'm') {
    if (!Gjd.endsWith('a')) kvar(`m rod: G jd "${Gjd}" bi trebao završavati na -a`);
    if (im.zivo && A !== Gjd) kvar(`živo: A jd treba biti = G jd ("${Gjd}"), dobiveno "${A}"`);
    if (!im.zivo && A !== Njd) kvar(`neživo: A jd treba biti = N jd ("${Njd}"), dobiveno "${A}"`);
  }
  if (im.rod === 's' && !/[aiu]$/.test(Gjd)) kvar(`s rod: neobičan G jd "${Gjd}"`);
  if (!Gmn.trim()) kvar('nedostaje G mn');
  if (typeof im.jestivo !== 'boolean') kvar('nedostaje oznaka jestivo');
  if (typeof im.predmet !== 'boolean') kvar('nedostaje oznaka predmet');
  if (!im.kat) kvar('nedostaje kategorija');
}
test('Dosljednost rječnika imenica', lošiUnosi, (q) => q.question);

// ── 1. slaganje broja i imenice ────────────────────────────────────
// Gradi se iz same tablice: za svaku imenicu i svaku kategoriju znamo
// koji je oblik ispravan, pa hvatamo SVAKI "broj + poznata imenica".
const sviOblici = new Map(); // oblik → Set(kljuceva kojima taj oblik pripada)
for (const [kljuc, im] of Object.entries(HR.IMENICE)) {
  const varijante = [...im.o, HR.akuzativJd(kljuc)];
  for (const v of varijante) {
    if (!sviOblici.has(v)) sviOblici.set(v, new Set());
    sviOblici.get(v).add(kljuc);
  }
}
const reBrojImenica = new RegExp(
  `(\\d+)\\s+(${[...sviOblici.keys()].sort((a, b) => b.length - a.length).join('|')})(?![\\p{L}])`,
  'gu'
);

const losoSlaganje = [];
for (const q of sva) {
  const tekst = `${q.question || ''} ${q.correctAnswer || ''}`;
  let m;
  reBrojImenica.lastIndex = 0;
  while ((m = reBrojImenica.exec(tekst)) !== null) {
    const broj = Number(m[1]);
    const oblik = m[2];
    const kandidati = sviOblici.get(oblik);
    // ispravno je ako BAR JEDNA imenica kojoj taj oblik pripada
    // traži upravo taj oblik za taj broj (N ili A)
    const ispravno = [...kandidati].some(
      (k) => HR.imeZa(broj, k, 'N') === oblik || HR.imeZa(broj, k, 'A') === oblik
    );
    if (!ispravno) {
      losoSlaganje.push({ ...q, _detalj: `"${m[0]}"` });
      break;
    }
  }
}
test('Slaganje broja i imenice', losoSlaganje,
  (q) => `[R${q._razred}/${q._gen}] ${q._detalj} u: ${q.question}`);

// ── 2. rodni hackovi ───────────────────────────────────────────────
test('Rodne kose crte (Dobio/la, mu/joj)',
  sva.filter((q) => /(\bDobio\/la|\bPojeo\/la|\bDao\/la|\bmu\/joj|o\/la\b)/.test(q.question || '')));

// ── 3. žensko ime + muški particip ─────────────────────────────────
const zenska = Object.entries(HR.IMENA).filter(([, r]) => r === 'z').map(([i]) => i);
const muskiParticip = /\b(pojeo|dobio|potrošio|dao|izgubio|skupio|kupio|nacrtao|pročitao|napravio|ubrao|popio|donio|stavio|podijelio)\b/;
const reZenskaMuski = new RegExp(`\\b(${zenska.join('|')})\\b[^.?!]{0,80}?${muskiParticip.source}`);
test('Žensko ime uz muški particip',
  sva.filter((q) => reZenskaMuski.test(q.question || '')));

// ── 4. muško ime + ženski particip ─────────────────────────────────
const muska = Object.entries(HR.IMENA).filter(([, r]) => r === 'm').map(([i]) => i);
const zenskiParticip = /\b(pojela|dobila|potrošila|dala|izgubila|skupila|kupila|nacrtala|pročitala|napravila|ubrala|popila|donijela|stavila|podijelila)\b/;
const reMuskaZenski = new RegExp(`\\b(${muska.join('|')})\\b[^.?!]{0,80}?${zenskiParticip.source}`);
test('Muško ime uz ženski particip',
  sva.filter((q) => reMuskaZenski.test(q.question || '')));

// ── 5. jede/pije nejestivo ─────────────────────────────────────────
const nejestivi = Object.entries(HR.IMENICE)
  .filter(([, im]) => !im.jestivo)
  .flatMap(([k, im]) => [...im.o, HR.akuzativJd(k)]);
const reNejestivo = new RegExp(
  `\\b(pojede|pojeo|pojela|popije|popio|popila|jede|pije)\\b[^.?!]{0,30}\\b(${[...new Set(nejestivi)].join('|')})\\b`, 'i');
test('Jedenje/pijenje nejestivog',
  sva.filter((q) => reNejestivo.test(q.question || '')));

// ── 6. choice: valjan correctIndex ─────────────────────────────────
test('Choice s nevaljanim correctIndex',
  sva.filter((q) => q.type === 'choice' && (
    !Array.isArray(q.answers) || q.answers.length < 2 ||
    typeof q.correctIndex !== 'number' || q.correctIndex < 0 ||
    q.correctIndex >= q.answers.length)),
  (q) => `[R${q._razred}/${q._gen}] ci=${q.correctIndex} odgovori=${JSON.stringify(q.answers)}`);

// ── 7. choice: duplicirani odgovori ────────────────────────────────
test('Choice s dupliciranim odgovorima',
  sva.filter((q) => q.type === 'choice' && Array.isArray(q.answers) &&
    new Set(q.answers.map(String)).size !== q.answers.length),
  (q) => `[R${q._razred}/${q._gen}] ${JSON.stringify(q.answers)}`);

// ── 8. input: emoji kao odgovor ────────────────────────────────────
const SAMO_EMOJI = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\u{200D}\u{FE0F}\u{20E3}]+$/u;
test('Input pitanja s emoji odgovorom (dijete ga ne može utipkati)',
  sva.filter((q) => q.type === 'input' && SAMO_EMOJI.test(String(q.correctAnswer || '').trim())),
  (q) => `[R${q._razred}/${q._gen}] "${q.question}" → ${q.correctAnswer}`);

// ── 8b. spajanje parova ────────────────────────────────────────────
test('Match s neispravnim parovima (treba 3-5 parova po dva člana)',
  sva.filter((q) => q.type === 'match' && (
    !Array.isArray(q.pairs) || q.pairs.length < 3 || q.pairs.length > 5 ||
    q.pairs.some((p) => !Array.isArray(p) || p.length !== 2 || !String(p[0]).trim() || !String(p[1]).trim()))),
  (q) => `[R${q._razred}/${q._gen}] ${JSON.stringify(q.pairs)}`);

test('Match s ponovljenim članom (dva ista lijeva ili desna)',
  sva.filter((q) => {
    if (q.type !== 'match' || !Array.isArray(q.pairs)) return false;
    const l = q.pairs.map((p) => String(p[0]));
    const d = q.pairs.map((p) => String(p[1]));
    return new Set(l).size !== l.length || new Set(d).size !== d.length;
  }),
  (q) => `[R${q._razred}/${q._gen}] ${JSON.stringify(q.pairs)}`);

// ── 9. input: prazan odgovor ───────────────────────────────────────
test('Input bez odgovora',
  sva.filter((q) => q.type === 'input' && !String(q.correctAnswer ?? '').trim()));

// ── 10. neriješeno _c polje ────────────────────────────────────────
test('Neriješeno _c polje', sva.filter((q) => q._c !== undefined));

// ── 11. prazan ili predugačak tekst pitanja ────────────────────────
test('Prazno pitanje', sva.filter((q) => !String(q.question || '').trim()));
test('Predugačko pitanje (>200 znakova, za 1.–4. razred)',
  sva.filter((q) => String(q.question || '').length > 200),
  (q) => `[R${q._razred}/${q._gen}] ${String(q.question).slice(0, 70)}…`);

// ── 12. dvostruki razmaci i viseća interpunkcija ───────────────────
// Namjerni razmaci oko znaka usporedbe (○) nisu greška — oni razdvajaju operande.
test('Dvostruki razmak u tekstu',
  sva.filter((q) => {
    const t = String(q.question || '').replace(/\n/g, ' ').replace(/\s+[○□△]\s+/g, ' X ');
    return /\s{2,}/.test(t);
  }),
  (q) => `[R${q._razred}/${q._gen}] ${JSON.stringify(String(q.question).slice(0, 60))}`);

// ═══════════════════════════════════════════════════════════════════
// JASNOĆA PITANJA
//
// Povod: "Popravi rečenicu: pada kiša" — dijete upiše "Pada kiša", dobije
// netočno jer se očekivalo "Pada kiša.", a nigdje nije pisalo da treba točku.
// Provjere ispod hvataju tu vrstu greške prije nego dođe do djeteta.
//
// Mjerila po NCVVO-ovim Smjernicama za izradu ispitnih zadataka (2020) i
// Haladyna/Downing/Rodriguez (2002) — vidi seeds/jasnoca.js za izvore.
// ═══════════════════════════════════════════════════════════════════
const JAS = require('../seeds/jasnoca');
const OPIS_FORMATA = Object.values(JAS.FORMAT).map((f) => f.tekst);

// ── 13. pitanje mora biti cijela rečenica, ne natuknica ────────────
// Hvata oblike iz kojih dijete ne može pročitati što se traži:
//   "Prostorija?"            — samo imenica
//   "Sustav za \"srce\":"      — natuknica s dvotočkom
//   "Plinovito stanje="      — natuknica sa znakom jednakosti
//   "\"skijanje\" → doba?"     — strelica umjesto pitanja
//   "Nakon ljeta dolazi..."  — nedovršena rečenica
// Tvrdnje za točno/netočno po naravi nisu pitanja pa su iznimka, kao i
// čisti računski izrazi ("7 + 0 = ?"), koji su standardan zapis u udžbeniku.
const tvrdnja = (q) =>
  Array.isArray(q.answers) && q.answers.length === 2 && /Točno|Netočno/.test(q.answers.join('|'));

const IZRAZ = /^[\d\s+\-−×÷:=?<>○□△.,()kncmdmg]+$/i;
const UPUTA = /^(Napiši|Upiši|Odaberi|Poveži|Spoji|Dopuni|Dovrši|Nadopuni|Ispravi|Izračunaj|Prebroji|Označi|Pronađi|Pročitaj|Poredaj|Nastavi)/;

// Citat na kraju ("Kakva je ovo rečenica: „Pada kiša."") ne kvari uputu.
const bezZavrsnogCitata = (s) =>
  s.replace(/\s*[„“”"«»][^„“”"«»]*[„“”"«»][.!]?\s*$/u, '').trim() || s;

function natuknica(q) {
  if (tvrdnja(q)) return false;
  const puni = String(q.question || '').replace(/\n/g, ' ').trim();
  if (!puni || IZRAZ.test(puni)) return false;
  // Uputa koja počinje glagolom radnje je ispravan oblik zadatka
  // ("Spoji životinju s glasanjem:").
  if (UPUTA.test(puni)) return false;

  // Oblici natuknice — iz njih dijete ne može pročitati što se traži.
  if (/\.\.\.\s*$/.test(puni)) return true;                    // "Nakon ljeta dolazi..."
  // Strelica kao prečac pitanja je natuknica; strelice kao naredbe robotu
  // (informatika: „Robot izvrši naredbe → → ↓.”) nisu.
  if (/→/.test(puni) && !/naredb/i.test(puni)) return true;   // "„skijanje" → doba?"
  if (/^[^?!]{1,30}[:=]\s*\??$/.test(puni)) return true;        // "Humus:?", "Kruto stanje="

  // Inače mora negdje stajati pitanje.
  if (!/\?/.test(puni)) return true;

  // "Prostorija?" je pitanje, ali prekratko da bi išta reklo.
  // "Kada klizamo?" jest — dvije riječi su dovoljne ako ima glagol.
  const prvaRecenica = puni.split(/(?<=[?!.])\s/)[0] || puni;
  if (prvaRecenica.split(/\s+/).length < 2) return true;

  return false;
}

test('Pitanje nije cijela rečenica (natuknica umjesto pitanja)',
  sva.filter(natuknica),
  (q) => `[R${q._razred}/${q._gen}] ${JSON.stringify(String(q.question).slice(0, 70))}`);

// ── 14. upis bez opisa traženog oblika odgovora ────────────────────
// Ovo je provjera koja bi bila uhvatila prijavljenu grešku.

// Iznimka: kad je odgovor čisti broj, oblik je iz samog zadatka očit
// ("Koliko je 7 + 0?"). Dvojba nastaje kod slova, riječi i rečenica.
const brojcani = (q) => /^-?\d+([.,]\d+)?$/.test(String(q.correctAnswer ?? '').trim());

test('Upis bez opisa traženog oblika odgovora',
  sva.filter((q) => {
    if (q.type !== 'input' || brojcani(q)) return false;
    const s = String(q.question || '');
    return !OPIS_FORMATA.some((t) => s.includes(t));
  }),
  (q) => `[R${q._razred}/${q._gen}] ${JSON.stringify(String(q.question).slice(0, 70))} → ${JSON.stringify(q.correctAnswer)}`);

// ── 15. upis koji traži znak interpunkcije, a ne kaže koji su mogući ──
test('Upis traži znak, a ne nabraja moguće znakove',
  sva.filter((q) => {
    if (q.type !== 'input') return false;
    const a = String(q.correctAnswer ?? '');
    if (a.length !== 1 || /[\p{L}\p{N}]/u.test(a)) return false;
    const s = String(q.question || '');
    return !(/rečenični znak/i.test(s) && JAS.RECENICNI.every((z) => s.includes(z)));
  }),
  (q) => `[R${q._razred}/${q._gen}] ${JSON.stringify(String(q.question).slice(0, 70))} → ${JSON.stringify(q.correctAnswer)}`);

// ── 16. gol znak kao ponuđeni odgovor ──────────────────────────────
// Točka na gumbu je nekoliko piksela, a čitač zaslona je ne pročita.
test('Gol znak kao ponuđeni odgovor (bez imena znaka)',
  sva.filter((q) => {
    if (q.type !== 'choice' || !Array.isArray(q.answers)) return false;
    return q.answers.some((a) => {
      const t = String(a).trim();
      return t.length === 1 && !/[\p{L}\p{N}]/u.test(t) && JAS.IME_ZNAKA[t];
    });
  }),
  (q) => `[R${q._razred}/${q._gen}] ${JSON.stringify(String(q.question).slice(0, 50))} ${JSON.stringify(q.answers)}`);

// ── 17. ponude koje se razlikuju samo veličinom slova ili točkom ───
// NCVVO: "Ometači ne smiju biti djelomično točni niti previše slični
// točnomu odgovoru." Iznimka su zadaci kojima je baš pravopis predmet —
// njih prepoznajemo po tome što imaju najviše dvije ponude, pa je razlika
// jedna i istaknuta.
// Iznimka: kad pitanje samo kaže da se gleda veličina slova ili pravopis
// ("Koje je od ovih slova malo slovo?"), sličnost ponuda JEST zadatak.
const OPRAVDANA_SLICNOST = /malo slovo|veliko slovo|velikim slovom|malim slovom|pravilno piše|ispravan zapis|pravilan zapis|dvoslov|kojim se slovom/i;

test('Više od dvije ponude koje se razlikuju samo točkom ili velikim slovom',
  sva.filter((q) => {
    if (q.type !== 'choice' || !Array.isArray(q.answers) || q.answers.length <= 2) return false;
    if (OPRAVDANA_SLICNOST.test(String(q.question || ''))) return false;
    const golo = q.answers.map((a) => String(a).toLowerCase().replace(/[.!?]+$/, '').trim());
    return new Set(golo).size < golo.length;
  }),
  (q) => `[R${q._razred}/${q._gen}] ${JSON.stringify(String(q.question).slice(0, 50))} ${JSON.stringify(q.answers)}`);

// ── 18. "?" kao oznaka praznog mjesta ──────────────────────────────
// U nizu "1, ?, 3, 4" dijete upitnik čita kao rečenični znak. Prazno mjesto
// se piše crtom.
test('Upitnik umjesto crte za prazno mjesto',
  sva.filter((q) => /[,=+×÷−-]\s*\?(?!$)|\?\s*[,=]/.test(String(q.question || ''))),
  (q) => `[R${q._razred}/${q._gen}] ${JSON.stringify(String(q.question).slice(0, 60))}`);

// ── 20. brojanje slogova ───────────────────────────────────────────
// Brojevi slogova više ne stoje u tablici nego ih računa seeds/slogovi.js.
// Ovo je kontrolni uzorak iz udžbenika: ako se pravilo pokvari, pada ovdje.
const SL = require('../seeds/slogovi');
const UZORAK_SLOGOVA = [
  ['ja', 1], ['pas', 1], ['mama', 2], ['škola', 2], ['jabuka', 3], ['olovka', 3],
  ['računalo', 4], ['učiteljica', 5], ['matematika', 5], ['bilježnica', 4],
  // slogotvorno "r" — nema samoglasnika, a slog postoji
  ['prst', 1], ['vrt', 1], ['krv', 1], ['smrt', 1], ['srce', 2], ['crven', 2], ['Hrvatska', 3],
  // "r" uz samoglasnik nije slogotvorno
  ['trava', 2], ['ruka', 2], ['vrijeme', 3],
  // hrvatski nema dvoglasa: svaki samoglasnik je svoj slog
  ['auto', 3], ['automobil', 5], ['radio', 3], ['oko', 2], ['ulica', 3],
];
test('Brojanje slogova',
  UZORAK_SLOGOVA
    .filter(([w, n]) => SL.brojSlogova(w) !== n)
    .map(([w, n]) => ({ _gen: 'slogovi', _razred: '—', question: `"${w}": očekivano ${n}, dobiveno ${SL.brojSlogova(w)}` })),
  (q) => q.question);

// Svaki dio rastavljene riječi mora imati točno jedan slog, a spojeni
// dijelovi moraju dati izvornu riječ.
const losRastav = [];
for (const [w] of UZORAK_SLOGOVA) {
  const d = SL.rastavi(w);
  const spojeno = d.join('');
  const ocekivano = w.toLowerCase();
  if (spojeno !== ocekivano) losRastav.push(`"${w}" → ${d.join('-')} ne daje natrag riječ`);
  else if (d.length !== SL.brojSlogova(w)) losRastav.push(`"${w}" → ${d.join('-')} ima ${d.length} dijelova, a ${SL.brojSlogova(w)} slogova`);
}
test('Rastavljanje na slogove',
  losRastav.map((t) => ({ _gen: 'slogovi', _razred: '—', question: t })), (q) => q.question);

// ── ispis ──────────────────────────────────────────────────────────
console.log(`\nProvjereno pitanja: ${sva.length}\n`);

let pao = false;

if (greskeGeneratora.length) {
  pao = true;
  console.log('✗ GENERATORI');
  greskeGeneratora.forEach((g) => console.log(`    ${g}`));
  console.log('');
}

for (const r of rezultati) {
  if (r.broj === 0) {
    console.log(`  ✓ ${r.naziv}`);
  } else {
    pao = true;
    console.log(`  ✗ ${r.naziv} — ${r.broj}`);
    r.primjeri.forEach((p) => console.log(`      ${p}`));
  }
}

console.log('');
if (pao) {
  console.log('PALO. Popravi gore navedeno prije nego napuniš bazu.\n');
  process.exit(1);
}
console.log('Sve provjere prošle.\n');
process.exit(0);
