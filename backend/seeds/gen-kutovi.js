/**
 * Kut i trokut — 4. razred (MAT OŠ C.4.1, C.4.2).
 *
 * C.4.1: razlikuje kutove — šiljasti, pravi, tupi, ispruženi; vrh i krakovi.
 * C.4.2: razlikuje i opisuje trokute prema duljinama stranica
 *        (jednakostranični, jednakokračni, raznostranični) te pravokutni trokut.
 * Mjerenje kuta u stupnjevima nije gradivo 4. razreda, pa ga ovdje nema:
 * vrsta kuta određuje se usporedbom s pravim kutom (kut lista papira, sat).
 *
 * Duljine stranica trokuta biraju se pri svakom pozivu (uz uvjet da trokut
 * postoji), a vrste kuta zadaju se satom i predmetima iz okoline.
 */

const cijeli = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const promijesaj = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const uzmi = (arr, n) => promijesaj(arr).slice(0, n);
const izbor = (pitanje, tocno, krivi, tezina, objasnjenje) => {
  const answers = promijesaj([tocno, ...uzmi([...new Set(krivi)].filter((k) => k !== tocno), 3)]);
  return { type: 'choice', difficulty: tezina, question: pitanje, answers, correctIndex: answers.indexOf(tocno), objasnjenje };
};
const upis = (pitanje, odgovor, tezina, objasnjenje) =>
  ({ type: 'input', difficulty: tezina, question: pitanje, correctAnswer: String(odgovor), objasnjenje });
const tocnoNetocno = (pitanje, tocno, tezina, objasnjenje) =>
  ({ type: 'true-false', difficulty: tezina, question: pitanje, correct: tocno, objasnjenje });

const KUTOVI = ['šiljasti', 'pravi', 'tupi', 'ispruženi'];
const TROKUTI = ['jednakostranični', 'jednakokračni', 'raznostranični'];

// Kut između kazaljki sata u punim satima. Svaki sat je 1/12 kruga:
// 3 sata = četvrtina kruga = pravi kut; 6 sati = pola kruga = ispruženi.
function vrstaKutaSata(h) {
  const k = Math.min(h % 12, 12 - (h % 12));
  if (k === 3) return 'pravi';
  if (k === 6) return 'ispruženi';
  return k < 3 ? 'šiljasti' : 'tupi';
}
const OBJ_SAT = {
  šiljasti: 'Kazaljke su razmaknute manje od četvrtine kruga (manje nego u 3 sata), pa je kut manji od pravoga.',
  pravi: 'U 3 i u 9 sati kazaljke zatvaraju četvrtinu kruga — pravi kut, kao kut lista papira.',
  tupi: 'Kazaljke su razmaknute više od četvrtine, a manje od pola kruga, pa je kut veći od pravoga, a manji od ispruženoga.',
  ispruženi: 'U 6 sati kazaljke leže na istom pravcu u suprotnim smjerovima — to je ispruženi kut.',
};
const satiRijecima = (h) => `${h} ${h === 1 ? 'sat' : h < 5 ? 'sata' : 'sati'}`;

const PREDMETI_KUT = [
  ['kut lista bilježnice', 'pravi', 'Kut lista je pravi — po njemu provjeravamo jesu li drugi kutovi pravi.'],
  ['kut između poda i zida sobe', 'pravi', 'Zid stoji okomito na pod, pa je kut pravi.'],
  ['kut vrha kriške pizze izrezane na osam dijelova', 'šiljasti', 'Kriška je uska: kut je manji od pravoga.'],
  ['kut između oštrica malo otvorenih škara', 'šiljasti', 'Malo otvorene škare zatvaraju kut manji od pravoga.'],
  ['kut između nogu otvorenih ljestava', 'šiljasti', 'Ljestve su malo raširene, kut je manji od pravoga.'],
  ['kut između ruku raširenih ravno u stranu', 'ispruženi', 'Ruke leže na istom pravcu u suprotnim smjerovima.'],
  ['kut između naslona i sjedala ležaljke na plaži', 'tupi', 'Naslon je nagnut unatrag, pa je kut veći od pravoga.'],
];

const OPIS_KUTA = [
  ['je manji od pravoga kuta', 'šiljasti'],
  ['ima međusobno okomite krakove', 'pravi'],
  ['je veći od pravoga, a manji od ispruženoga kuta', 'tupi'],
  ['ima krakove na istom pravcu u suprotnim smjerovima', 'ispruženi'],
];

function trokutPoStranicama() {
  const vrsta = TROKUTI[cijeli(0, 2)];
  let a, b, c;
  if (vrsta === 'jednakostranični') { a = b = c = cijeli(2, 15); }
  else if (vrsta === 'jednakokračni') {
    // Krakovi jednaki, osnovica različita; trokut postoji ako je osnovica < 2 · krak.
    a = b = cijeli(3, 15);
    do { c = cijeli(2, 2 * a - 1); } while (c === a);
  } else {
    do { [a, b, c] = [cijeli(3, 15), cijeli(3, 15), cijeli(3, 15)]; }
    while (a === b || b === c || a === c || a + b <= c || a + c <= b || b + c <= a);
  }
  return { vrsta, stranice: promijesaj([a, b, c]) };
}
const OBJ_TROKUT = {
  jednakostranični: 'Sve su tri stranice jednake duljine.',
  jednakokračni: 'Dvije su stranice (krakovi) jednake, a treća (osnovica) je različita.',
  raznostranični: 'Sve su tri stranice različitih duljina.',
};

function genKutoviDodatak() {
  const q = [];

  // Vrsta kuta prema satu (12 mogućih položaja)
  for (const h of uzmi([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 4)) {
    const v = vrstaKutaSata(h);
    q.push(izbor(`Sat pokazuje točno ${satiRijecima(h)}. Kakav kut zatvaraju velika i mala kazaljka?`, v, KUTOVI, 2, OBJ_SAT[v]));
  }

  // Kut u okolini
  for (const [p, v, obj] of uzmi(PREDMETI_KUT, 3)) {
    q.push(izbor(`Kakav je ${p}?`, v, KUTOVI, 2, obj));
  }

  // Opis → naziv kuta i obrnuto
  for (const [opis, v] of uzmi(OPIS_KUTA, 2)) {
    q.push(izbor(`Kako se zove kut koji ${opis}?`, v, KUTOVI, 1,
      `Po veličini: šiljasti < pravi < tupi < ispruženi. Kut koji ${opis} je ${v} kut.`));
  }

  // Trokut po duljinama stranica (parametrizirano)
  for (let i = 0; i < 4; i++) {
    const { vrsta, stranice } = trokutPoStranicama();
    q.push(izbor(`Trokut ima stranice duljina ${stranice.map((s) => `${s} cm`).join(', ').replace(/, ([^,]*)$/, ' i $1')}. Kakav je to trokut prema duljinama stranica?`,
      vrsta, TROKUTI, 2, OBJ_TROKUT[vrsta]));
  }

  // Jednakokračni: koliko je dugačak drugi krak (parametrizirano)
  const krak = cijeli(4, 12), osn = cijeli(2, 2 * krak - 1);
  if (osn !== krak) {
    q.push(upis(`Jednakokračni trokut ima osnovicu dugu ${osn} cm i jedan krak dug ${krak} cm. Koliko je centimetara dug drugi krak?`, krak, 2,
      'Krakovi jednakokračnoga trokuta jednake su duljine.'));
  }
  const js = cijeli(3, 20);
  q.push(upis(`Jedna stranica jednakostraničnog trokuta duga je ${js} cm. Koliko su centimetara duge ostale dvije stranice (upiši jedan broj)?`, js, 1,
    'U jednakostraničnom trokutu sve su stranice jednake.'));

  // Točno / netočno — tipične zablude
  q.push(...uzmi([
    tocnoNetocno('Može li trokut imati dva prava kuta?', false, 3, 'S dva prava kuta stranice bi bile usporedne i nikad se ne bi spojile u treći vrh.'),
    tocnoNetocno('Ima li pravokutni trokut jedan pravi kut?', true, 1, 'Pravokutni trokut ima točno jedan pravi kut.'),
    tocnoNetocno('Je li kut veći ako su mu krakovi dulji?', false, 3, 'Veličina kuta ovisi o razmaku krakova, a ne o njihovoj duljini.'),
    tocnoNetocno('Ima li kvadrat četiri prava kuta?', true, 1, 'Svi kutovi kvadrata i pravokutnika su pravi.'),
    tocnoNetocno('Je li tupi kut manji od pravoga?', false, 1, 'Tupi kut je veći od pravoga.'),
    tocnoNetocno('Označavaju li se vrhovi trokuta velikim tiskanim slovima?', true, 1, 'Vrhove označavamo velikim slovima, npr. A, B i C, a trokut ∆ABC.'),
  ], 3));

  // Dijelovi
  q.push(...uzmi([
    upis('Koliko vrhova ima trokut?', 3, 1, 'Trokut ima tri vrha, tri stranice i tri kuta.'),
    upis('Koliko pravih kutova ima pravokutnik?', 4, 1, 'Sva četiri kuta pravokutnika su prava.'),
    izbor('Što od navedenog čini kut?', 'vrh i dva kraka', ['tri stranice', 'dva usporedna pravca', 'središte i polumjer'], 1, 'Kut čine dva polupravca (kraka) sa zajedničkom početnom točkom (vrhom).'),
    izbor('Kako se zove trokut koji ima jedan pravi kut?', 'pravokutni', ['jednakostranični', 'tupokutni', 'raznostranični'], 2, 'Trokut s jednim pravim kutom je pravokutni trokut.'),
  ], 2));

  return q;
}

/** Ujednačuje „jednakokračan” → „jednakokračni” (određeni oblik kao ostali). */
function ocistiKutove(qs) {
  return qs.map((q) => {
    const fix = (s) => String(s).replace(/\bjednakokračan\b/g, 'jednakokračni');
    if (!Array.isArray(q.answers) || !q.answers.some((a) => /jednakokračan\b/.test(a))) return q;
    return { ...q, answers: q.answers.map(fix), ...(q._c ? { _c: fix(q._c) } : {}) };
  });
}

module.exports = { genKutoviDodatak, ocistiKutove, vrstaKutaSata };
