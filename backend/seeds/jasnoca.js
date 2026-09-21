/**
 * jasnoca.js — pravila za razumljivo postavljeno pitanje
 *
 * Povod: dijete je dobilo "Popravi rečenicu: pas trči" i upisalo "Pas trči".
 * Označeno je netočnim jer se očekivalo "Pas trči." — a nigdje nije pisalo da
 * treba i točku. Dijete nije pogriješilo u pravopisu nego u pogađanju što se
 * od njega traži.
 *
 * Izvori (smjernice za sastavljanje zadataka):
 *   NCVVO, Smjernice za izradu ispitnih zadataka, 2020 — osnova zadatka u
 *     upitnome obliku; uputa kratka, jasna i nedvosmislena; ometači ne smiju
 *     biti djelomično točni ni previše slični točnome odgovoru.
 *   Haladyna, Downing & Rodriguez (2002), 31 item-writing guidelines —
 *     pitanje prije nedovršene rečenice, tri ponuđena odgovora dovoljna,
 *     izbjegavati negaciju, ometači iz tipičnih dječjih pogrešaka.
 *   TIMSS 2019 Item Writing Guidelines — naznačiti očekivanu razinu
 *     detalja odgovora.
 *   Čubrić, M., Pravopisni zadatci (hrcak.srce.hr/file/253904) — upisivanje
 *     samo znaka, izvan rečenice, djetetu je neprirodno; nedoumicu rješava
 *     kontekst.
 *   Deque — čitači zaslona ne izgovaraju pouzdano samostalan interpunkcijski
 *     znak, pa gumb ne smije biti samo ".".
 *
 * Tri pravila koja ovaj modul provodi:
 *   1. Pitanje je cijela rečenica i završava znakom (? : .).
 *   2. Zadatak s upisom uvijek kaže u kojem se obliku odgovara.
 *   3. Gumb sa znakom nosi i ime znaka (". točka", a ne gola točka).
 */

/** Ime svakog znaka koji se može naći na gumbu. */
const IME_ZNAKA = {
  '.': 'točka',
  '?': 'upitnik',
  '!': 'uskličnik',
  ',': 'zarez',
  '<': 'manje',
  '>': 'veće',
  '=': 'jednako',
  '+': 'plus',
  '−': 'minus',
  '-': 'minus',
  '×': 'puta',
  ':': 'podijeljeno',
};

/**
 * Oznaka za gumb: znak + ime.
 * Sama točka na gumbu je dvije točke zaslona — dijete je ne vidi, a čitač
 * zaslona je ne pročita.
 */
function oznaka(znak) {
  const ime = IME_ZNAKA[znak];
  // Jedan razmak: u HTML-u se višestruki razmak ionako sažima u jedan.
  return ime ? `${znak} ${ime}` : String(znak);
}

/** Niz oznaka; `correctIndex` ostaje isti jer se mijenja samo natpis. */
const oznake = (znakovi) => znakovi.map(oznaka);

/**
 * Rečenični znakovi kako ih kurikul zove u 1. i 2. razredu.
 * Namjerno "rečenični", ne "interpunkcijski" — to je riječ koju dijete zna.
 */
const RECENICNI = ['.', '?', '!'];

/**
 * Opisi traženog oblika odgovora. Svaki zadatak s upisom mora uzeti jedan.
 * Tekst se lijepi u pitanje da ga dijete pročita, a `konstrukt` određuje
 * koliko je ocjenjivanje strogo.
 */
const FORMAT = {
  broj:        { tekst: 'Odgovori brojkom.',                                     konstrukt: 'broj' },
  slovo:       { tekst: 'Napiši samo jedno slovo.',                              konstrukt: 'slovo' },
  slova:       { tekst: 'Napiši slova jedno do drugoga, bez razmaka.',           konstrukt: 'slovo' },
  rijec:       { tekst: 'Napiši jednu riječ.',                                   konstrukt: 'rijec' },
  rijeci:      { tekst: 'Odgovori s nekoliko riječi.',                           konstrukt: 'rijec' },
  recenica:    { tekst: 'Napiši cijelu rečenicu — velikim početnim slovom i s rečeničnim znakom na kraju.', konstrukt: 'recenica' },
  recenicniZnak: { tekst: 'Napiši rečenični znak: točku (.), upitnik (?) ili uskličnik (!).',               konstrukt: 'interpunkcija' },
};

/**
 * Je li tekst cijela rečenica — pitanje ili uputa, a ne natuknica.
 *
 * Citat na kraju se ne broji: "Napiši ovu rečenicu pravilno: „pada kiša""
 * je uredna uputa, iako zadnji znak nije upitnik. Bitno je da prije citata
 * stoji upitnik, dvotočka ili točka.
 */
function cijelaRecenica(tekst) {
  const bezCitata = String(tekst).trim().replace(/\s*[„“”"«»]?[^„“”"«»]*[„“”"«»]\s*$/u, '');
  const jezgra = (bezCitata || String(tekst)).trim();
  return /[?:.]$/.test(jezgra) && jezgra.split(/\s+/).length >= 3;
}

/**
 * Sastavi zadatak s upisom. Format je obavezan — bez njega dijete pogađa
 * oblik odgovora umjesto da pokaže znanje.
 *
 * unos({ pitanje: 'Koje je doba godine kad pada snijeg?', odgovor: 'zima', format: 'rijec' })
 *   → "Koje je doba godine kad pada snijeg? Napiši jednu riječ."
 */
function unos({ pitanje, odgovor, format, difficulty = 1, visual, hint, prihvatljivi }) {
  const f = FORMAT[format];
  if (!f) throw new Error(`unos(): nepoznat format "${format}" za "${pitanje}"`);
  if (!pitanje || !cijelaRecenica(pitanje)) {
    throw new Error(`unos(): pitanje mora biti cijela rečenica i završiti znakom — "${pitanje}"`);
  }
  return {
    type: 'input',
    difficulty,
    question: `${pitanje.trim()} ${f.tekst}`,
    correctAnswer: odgovor,
    konstrukt: f.konstrukt,
    ...(prihvatljivi?.length ? { prihvatljivi } : {}),
    ...(visual ? { visual } : {}),
    ...(hint ? { hint } : {}),
  };
}

/**
 * Dopuni zadatak s upisom opisom traženog oblika odgovora.
 *
 * Generatori su pisani prije ovog pravila i većina ih odgovor zadaje izravno,
 * bez `unos()`. Umjesto da se svaki od njih prepisuje, oblik se izvodi iz
 * samog očekivanog odgovora: jedan broj → "Odgovori brojkom", jedno slovo →
 * "Napiši samo jedno slovo", i tako dalje. Zadatak koji je oblik već naveo
 * (ili ga je složio `unos()`) ostaje netaknut.
 *
 * Čisti računski zadatak ("Koliko je 7 + 0?") se preskače — ondje nema
 * dvojbe o obliku, a dodatak bi samo produljio tekst.
 */
function dopuniFormat(q) {
  if (q.type !== 'input') return q;
  const pitanje = String(q.question || '');
  const odgovor = String(q.correctAnswer ?? '').trim();
  if (!odgovor) return q;
  if (Object.values(FORMAT).some((f) => pitanje.includes(f.tekst))) return q;

  let kljuc;
  if (/^-?\d+([.,]\d+)?$/.test(odgovor)) return q;             // broj — oblik je očit
  else if (/^\p{L}$/u.test(odgovor)) kljuc = 'slovo';
  else if (/^\p{L}{2,4}$/u.test(odgovor) && odgovor === odgovor.toUpperCase()) kljuc = 'slova';
  else if (/\s/.test(odgovor)) kljuc = 'rijeci';
  else kljuc = 'rijec';

  const f = FORMAT[kljuc];
  return { ...q, question: `${pitanje.trim()} ${f.tekst}`, konstrukt: q.konstrukt || f.konstrukt };
}

/**
 * Usporedba upisanog i očekivanog odgovora.
 *
 * Strogoća ovisi o tome što se provjerava. Ako se provjerava pravopis
 * rečenice, veliko slovo i točka su dio zadatka. Ako se provjerava koje je
 * doba godine, "zima." i "Zima" su isti točan odgovor — kažnjavati ih znači
 * mjeriti nešto što se ne poučava.
 */
function tocan(dano, ocekivano, konstrukt = 'rijec', prihvatljivi = []) {
  const kandidati = [ocekivano, ...prihvatljivi];
  return kandidati.some((k) => jednako(dano, k, konstrukt));
}

function jednako(dano, ocekivano, konstrukt) {
  let a = ocisti(dano);
  let b = ocisti(ocekivano);
  if (a === '' || b === '') return false;

  // Završni rečenični znak je dio odgovora samo kad se pravopis i provjerava.
  if (konstrukt !== 'interpunkcija' && konstrukt !== 'recenica') {
    a = a.replace(/[.!?]+$/, '');
    b = b.replace(/[.!?]+$/, '');
  }

  // Veliko početno slovo je dio odgovora samo kad se ono i provjerava.
  // Dijakritike su uvijek bitne: "cetiri" nije "četiri".
  const osjetljivost = (konstrukt === 'recenica' || konstrukt === 'velikoSlovo') ? 'variant' : 'accent';
  return a.localeCompare(b, 'hr', { sensitivity: osjetljivost }) === 0;
}

/** NFKC, bez rubnih razmaka, višestruki razmak u jedan, razni navodnici u jedan. */
const ocisti = (s) =>
  String(s ?? '')
    .normalize('NFKC')
    .replace(/[„“”"]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

module.exports = { IME_ZNAKA, oznaka, oznake, RECENICNI, FORMAT, unos, dopuniFormat, tocan, jednako, ocisti, cijelaRecenica };
