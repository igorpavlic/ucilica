/**
 * hr-gramatika.js — hrvatsko slaganje broja, roda i padeža
 *
 * Bez ovoga generatori proizvode "Ana ima 5 jabuke" i "Dobio/la je".
 *
 * Kategoriju broja daje ugrađeni Intl.PluralRules("hr") — bez ovisnosti:
 *   one   → 1, 21, 101      → nominativ jednine   (1 jabuka)
 *   few   → 2-4, 22-24      → paukal              (2 jabuke)
 *   other → 0, 5-20, 25-30  → genitiv množine     (5 jabuka)
 *
 * Oblici se NE mogu izvesti algoritamski (olovka → olovaka, kruška → krušaka
 * zbog nepostojanog a), zato tablica. Za širu pokrivenost: hrLex 1.3 (CC BY-SA).
 */

const PR = new Intl.PluralRules('hr');
const IDX = { one: 0, few: 1, other: 2 };

const { IMENICE, SKUPINE } = require('./hr-imenice');

/**
 * IMENA — rod se NE smije pogađati iz nastavka.
 * Luka, Noa, Roko, Karlo, Marko, Bruno, Dino, Mateo su muška na -a/-o.
 */
const IMENA = {
  // ženska
  Ana: 'z', Iva: 'z', Petra: 'z', Ema: 'z', Sara: 'z', Nina: 'z', Mia: 'z',
  Klara: 'z', Tea: 'z', Lana: 'z', Tara: 'z', Jana: 'z', Ela: 'z', Maja: 'z',
  Hana: 'z', Lucija: 'z', Lorena: 'z', Paula: 'z', Helena: 'z', Katarina: 'z',
  Gabrijela: 'z',
  // muška
  Luka: 'm', Marko: 'm', Ivan: 'm', Leo: 'm', David: 'm', Noa: 'm', Filip: 'm',
  Fran: 'm', Mateo: 'm', Roko: 'm', Karlo: 'm', Dino: 'm', Tin: 'm', Bruno: 'm',
  Nikola: 'm', Josip: 'm', Antonio: 'm', Viktor: 'm', Dominik: 'm',
};

/** Indeks oblika za broj: 0 = N jd, 1 = paukal, 2 = G mn */
const oblikZa = (n) => IDX[PR.select(Math.abs(n))];

/**
 * Akuzativ jednine.
 *   ženski na -a  → -u        (jabuka → jabuku)
 *   muški ŽIVO    → = genitiv (pas → psa; "vidim psa", ne "vidim pas")
 *   muški neživo, srednji → = nominativ
 */
function akuzativJd(kljuc) {
  const im = IMENICE[kljuc];
  if (im.akJd) return im.akJd;
  const n = im.o[0];
  if (im.rod === 'z' && n.endsWith('a')) return n.slice(0, -1) + 'u';
  if (im.rod === 'm' && im.zivo) return im.o[1];
  return n;
}

/**
 * Imenica u ispravnom obliku za dani broj, bez broja.
 * padez: 'N' (zadano) ili 'A' (izravni objekt)
 */
function imeZa(n, kljuc, padez = 'N') {
  const im = IMENICE[kljuc];
  if (!im) throw new Error(`hr-gramatika: nepoznata imenica "${kljuc}"`);
  const i = oblikZa(n);
  if (i === 0 && padez === 'A') return akuzativJd(kljuc);
  return im.o[i];
}

/**
 * Broj + imenica: "5 jabuka" · "1 jabuka" · "22 jabuke"
 * padez 'A' za objekt: "dobila je 1 naranču"
 */
const brojIme = (n, kljuc, padez = 'N') => `${n} ${imeZa(n, kljuc, padez)}`;

/** Glagolski pridjev radni: radni('dobi', 'z') → 'dobila' */
const radni = (osnova, rod) =>
  rod === 'z' ? `${osnova}la` : rod === 's' ? `${osnova}lo` : `${osnova}o`;

/**
 * Slaganje glagola "biti" s brojem:
 *   1 jabuka JE · 2 jabuke SU · 5 jabuka JE
 * Paukal (2-4) traži množinu, jednina i genitiv množine jedninu.
 */
const biti = (n) => (oblikZa(n) === 1 ? 'su' : 'je');

/** Isto pravilo za bilo koji glagol: ima/imaju, stoji/stoje, ostaje/ostaju */
const glagolBroj = (n, jd, mn) => (oblikZa(n) === 1 ? mn : jd);

/** Dativ zamjenice: 'mu' / 'joj' */
const zamjenicaD = (rod) => (rod === 'z' ? 'joj' : 'mu');

/**
 * Posvojni pridjev od imena: Ana → Anin, Marko → Markov, Luka → Lukin
 * Imena na -a uzimaju -in bez obzira na rod (Luka, Nikola su muška).
 */
function posvojni(ime) {
  rodImena(ime); // provjera da je ime poznato
  if (ime.endsWith('a')) return ime.slice(0, -1) + 'in';
  if (ime.endsWith('o') || ime.endsWith('e')) return ime.slice(0, -1) + 'ov';
  return ime + 'ov';
}

/** Rod imena; baca ako ime nije u tablici — bolje pasti nego generirati krivo */
function rodImena(ime) {
  const r = IMENA[ime];
  if (!r) throw new Error(`hr-gramatika: nepoznato ime "${ime}" — dodaj ga u IMENA`);
  return r;
}

/** Veliko početno slovo */
const vel = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

const _imena = Object.keys(IMENA);
const _imenice = Object.keys(IMENICE);
const _rnd = (a) => a[Math.floor(Math.random() * a.length)];

/** Nasumično ime uz njegov rod */
function nasumicnoIme() {
  const ime = _rnd(_imena);
  return { ime, rod: IMENA[ime] };
}

/** Nasumična imenica; filtar npr. { jestivo: true }, { rod: 'z' } */
function nasumicnaImenica(filtar = {}) {
  // Po zadanom samo "obični predmeti" — kutija, red, stablo, dijete nisu stvari
  // koje dijete skuplja ili poklanja. Kad predložak izričito traži kategoriju
  // (npr. životinje), to ograničenje ne vrijedi.
  const svePusti = filtar.sve || filtar.kat;
  let k = svePusti ? _imenice : _imenice.filter((x) => IMENICE[x].predmet);
  if (filtar.jestivo !== undefined) k = k.filter((x) => IMENICE[x].jestivo === filtar.jestivo);
  if (filtar.rod) k = k.filter((x) => IMENICE[x].rod === filtar.rod);
  if (filtar.kat) {
    const kats = Array.isArray(filtar.kat) ? filtar.kat : [filtar.kat];
    k = k.filter((x) => kats.includes(IMENICE[x].kat));
  }
  if (filtar.osim) k = k.filter((x) => !filtar.osim.includes(x));
  if (k.length === 0) throw new Error(`hr-gramatika: nijedna imenica ne odgovara ${JSON.stringify(filtar)}`);
  return _rnd(k);
}

/**
 * Kontekst za predloške zadataka — sve što predložak treba, gramatički ispravno.
 *   c.ime · c.rod · c.a · c.b
 *   c.N(n)  → "5 jabuka"      (subjekt)
 *   c.A(n)  → "1 jabuku"      (objekt)
 *   c.im(n) → "jabuka"        (samo imenica)
 *   c.gl('dobi') → "dobila"   (particip prema rodu imena)
 *   c.zam   → "joj"
 */
function kontekst(a, b, filtar = {}) {
  const { ime, rod } = nasumicnoIme();
  const kljuc = nasumicnaImenica(filtar);
  return {
    ime, rod, a, b, kljuc,
    N: (n) => brojIme(n, kljuc, 'N'),
    A: (n) => brojIme(n, kljuc, 'A'),
    im: (n, p = 'N') => imeZa(n, kljuc, p),
    gl: (osnova) => radni(osnova, rod),
    zam: zamjenicaD(rod),
    je: (n) => biti(n),
    gb: (n, jd, mn) => glagolBroj(n, jd, mn),
    posv: posvojni(ime),
  };
}

/**
 * Genitiv vremenskih imenica — iza „nakon”, „prije”, „poslije”, „do”, „od”:
 * „nakon četvrtka”, „prije siječnja”, „nakon jeseni” (ne „nakon četvrtak”).
 * Vrsta služi za prirodno pitanje („Koji mjesec…”, „Koji dan…”).
 */
const VREMENSKE = {
  siječanj: ['siječnja', 'mjesec'], veljača: ['veljače', 'mjesec'], ožujak: ['ožujka', 'mjesec'], travanj: ['travnja', 'mjesec'],
  svibanj: ['svibnja', 'mjesec'], lipanj: ['lipnja', 'mjesec'], srpanj: ['srpnja', 'mjesec'], kolovoz: ['kolovoza', 'mjesec'],
  rujan: ['rujna', 'mjesec'], listopad: ['listopada', 'mjesec'], studeni: ['studenoga', 'mjesec'], prosinac: ['prosinca', 'mjesec'],
  ponedjeljak: ['ponedjeljka', 'dan'], utorak: ['utorka', 'dan'], srijeda: ['srijede', 'dan'], četvrtak: ['četvrtka', 'dan'],
  petak: ['petka', 'dan'], subota: ['subote', 'dan'], nedjelja: ['nedjelje', 'dan'],
  proljeće: ['proljeća', 'godišnje doba'], ljeto: ['ljeta', 'godišnje doba'], jesen: ['jeseni', 'godišnje doba'], zima: ['zime', 'godišnje doba'],
  jutro: ['jutra', 'doba dana'], prijepodne: ['prijepodneva', 'doba dana'], poslijepodne: ['poslijepodneva', 'doba dana'],
  večer: ['večeri', 'doba dana'], noć: ['noći', 'doba dana'],
};
/** Genitiv vremenske imenice; nepoznata riječ ostaje kakva jest. */
const genitivVremena = (rijec) => VREMENSKE[String(rijec).toLowerCase()]?.[0] || rijec;
/** 'mjesec' | 'dan' | 'godišnje doba' | 'doba dana' | null */
const vrstaVremena = (rijec) => VREMENSKE[String(rijec).toLowerCase()]?.[1] || null;

module.exports = {
  VREMENSKE, genitivVremena, vrstaVremena,
  IMENICE, IMENA, SKUPINE,
  oblikZa, imeZa, brojIme, akuzativJd,
  radni, zamjenicaD, posvojni, rodImena, vel, biti, glagolBroj,
  nasumicnoIme, nasumicnaImenica, kontekst,
};
