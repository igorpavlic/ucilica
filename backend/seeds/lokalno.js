/**
 * lokalno.js — pitanja ostaju u hrvatskom okviru.
 *
 * Zadatci za 1.–4. razred vežu se uz zavičaj i Hrvatsku: domaće životinje i
 * biljke, hrvatska mjesta, euro, metričke mjere i hrvatska književnost. Ovaj
 * modul:
 *   1. u računskim pričama mijenja tropsko voće domaćim (banana → šljiva,
 *      naranča → mandarina), sa svim padežnim oblicima;
 *   2. prepoznaje pitanja koja se i dalje vežu uz strana mjesta i pojmove
 *      (pregled ih izbacuje, test ih prijavljuje, a pri pokretanju servera
 *      isključuju se iz postojeće baze).
 *
 * Iznimke su opravdane gradivom: susjedne države i kontinenti u temi
 * „Hrvatska — moja domovina”; „hrvatski Andersen” u tekstu o Ivani
 * Brlić-Mažuranić.
 */

// Strana mjesta i pojmovi (gledaju se pitanje, ponude, parovi i stavke — ne tekst za čitanje).
const STRANO = new RegExp([
  // egzotične životinje i biljke
  'egipat\\w*', 'pingvin\\w*', 'kameleon\\w*', 'dev[aeu]', 'kaktus\\w*', 'krokodil\\w*', 'klokan\\w*', 'žiraf\\w*', 'slon\\w*',
  'tigr\\w*', 'tigar', 'majmun\\w*', 'nosorog\\w*', 'kit', 'kita', 'kitovi', 'ananas\\w*', 'kokos\\w*', 'kivi', 'palm[aeiou]\\w*',
  'pustinj\\w*', 'tropsk\\w*', 'banan\\w*', 'lav', 'lava', 'lavu', 'lavom', 'lavovi',
  // strana mjesta, valute, mjere
  'london\\w*', 'pariz\\w*', 'new york\\w*', 'graz\\w*', 'amerik\\w*', 'afrik\\w*', 'azij\\w*', 'dolar\\w*', 'funt\\w*', 'inč\\w*', 'fahrenheit\\w*',
  'italij\\w*', 'talijansk\\w*', 'francusk\\w*', 'njemač\\w*', 'austrij\\w*', 'albanij\\w*', 'bugarsk\\w*', 'engles\\w*', 'europsk\\w*', 'europ[aeiou]',
  // strane bajke i autori (književnost se veže uz hrvatske autore)
  'grimm\\w*', 'collodi\\w*', 'pinokio\\w*', 'saint-exup\\w*', 'mali princ', 'heidi', 'spyri', 'carroll', 'alis[aeiu] u zemlji', 'twain', 'sawyer\\w*',
  'andersen\\w*', 'crvenkapic\\w*', 'snjeguljic\\w*', 'pepeljug\\w*', 'trnoružic\\w*', 'zlatokos\\w*', 'mačak u čizmama', 'tri praščića', 'ružno pače',
  'halloween', 'ragbi', 'bejzbol',
].map((r) => `(?<![\\p{L}])${r}(?![\\p{L}])`).join('|'), 'iu');

// Gradivo koje se izravno tiče Hrvatske i smije spomenuti strano.
const DOPUSTENO = {
  genHrvatskaDomovina: /^(amerik|afrik|azij|europ|europsk|dolar|italij|njemač|austrij|albanij|bugarsk|engles)/i,
  genCitanje4: /^andersen/i,
  genVrsteRijeci4: /^europsk/i,
};

const tekstPitanja = (q) => [q.question, ...(q.answers || []), q.correctAnswer || '', ...(q.pairs || []).flat(), ...(q.items || [])].join(' | ');

/** Prvi strani pojam u pitanju (ili null), uz iznimke za generator. */
function straniPojam(q, generator = '') {
  const t = tekstPitanja(q);
  const re = new RegExp(STRANO.source, 'giu');
  for (const m of t.matchAll(re)) {
    if (DOPUSTENO[generator]?.test(m[0])) continue;
    return m[0];
  }
  return null;
}

// Tropsko voće → domaće, oblik po oblik (isti nastavci: banana/šljiva, naranča/mandarina).
const NASTAVCI = { a: 'a', e: 'e', u: 'u', i: 'i', om: 'om', ama: 'ama' };
const OBLICI = [
  [/\b(\d+) naranči\b/g, (m, n) => `${n} mandarina`],
  [/\b([Bb])anan(a|e|u|i|om|ama)\b/g, (m, b, n) => `${b === 'B' ? 'Š' : 'š'}ljiv${NASTAVCI[n]}`],
  [/\b([Nn])aranč(a|e|u|i|om|ama)\b/g, (m, b, n) => `${b === 'N' ? 'M' : 'm'}andarin${NASTAVCI[n]}`],
];
const zamijeni = (s) => {
  if (typeof s !== 'string') return s;
  let t = s;
  for (const [re, z] of OBLICI) t = t.replace(re, z);
  return t;
};

/**
 * Domaće voće umjesto tropskoga u pitanju. Ne mijenja zadatke o glasovima i
 * slogovima (tamo riječ je sam predmet zadatka) — njih filtar izbacuje.
 * Ako zamjena napravi dvije iste ponude, vraća null (pitanje se izbacuje).
 */
function lokaliziraj(q) {
  // zadatci o riječima i zadatci sa slikom (🍌 na slici) ostaju kakvi jesu
  if (q.visual || /glas|slog|slov|samoglasni|suglasni|rimuj|na slici/i.test(q.question || '')) return q;
  const x = { ...q, question: zamijeni(q.question), correctAnswer: zamijeni(q.correctAnswer), _c: zamijeni(q._c) };
  if (Array.isArray(q.answers)) x.answers = q.answers.map(zamijeni);
  if (Array.isArray(q.items)) x.items = q.items.map(zamijeni);
  if (Array.isArray(q.pairs)) x.pairs = q.pairs.map((p) => (Array.isArray(p) ? p.map(zamijeni) : p));
  if (Array.isArray(x.chart)) x.chart = q.chart.map((c) => (c && typeof c === 'object' ? { ...c, label: zamijeni(c.label) } : c));
  if (x._c === undefined) delete x._c;
  if (x.correctAnswer === undefined) delete x.correctAnswer;
  const dupli = (a) => Array.isArray(a) && new Set(a.map(String)).size !== a.length;
  if (dupli(x.answers) || dupli(x.items)) return null;
  return x;
}

module.exports = { STRANO, DOPUSTENO, straniPojam, lokaliziraj };
