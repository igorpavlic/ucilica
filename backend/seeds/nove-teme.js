/**
 * nove-teme.js — registar tema iz ISTRAZIVANJE-NOVE-TEME.md:
 *   Informatika (novi predmet, 1.–4. r.): „Algoritmi i logika”, „Računalo i sigurnost”
 *   Ja i drugi (Priroda i društvo, 1.–4. r.)
 *   Promet i bicikl (Priroda i društvo, 3.–4. r.)
 *   Novac i kupovina (Matematika, 3.–4. r.)
 *
 * Jedno mjesto za sve: seed skripte (prosiriSeed), generiranje u hodu
 * (GENERATORI po slugu), dodavanje u postojeću bazu (tools/add-new-topics.js)
 * i testove (zaRazred).
 */
const { wrapGenerator } = require('../services/pedagogyReview');
const INF = require('./gen-informatika');
const JID = require('./gen-ja-i-drugi');
const PROMET = require('./gen-promet');
const NOVAC = require('./gen-novac');

const OPIS_INFORMATIKE = {
  1: 'Koraci, uzorci, robot na mreži, sigurnost',
  2: 'Upute i greške, programi, uređaji, sigurnost',
  3: 'Ponavljanje, odluka, šifre, sortiranje, lozinke',
  4: 'Programi s ulazom, petlje, internet, sigurnost',
};
const predmetInformatika = (razred) => ({
  name: 'Informatika', slug: 'informatika', icon: '💻', color: '#A78BFA', description: OPIS_INFORMATIKE[razred], order: 4,
});

// [razred, predmet, slug, ime, ikona, redoslijed, generator]
const POPIS = [
  ...[1, 2, 3, 4].flatMap((r) => [
    [r, 'informatika', `algoritmi-${r}`, 'Algoritmi i logika', '🤖', 1, INF[`genAlgoritmi${r}`]],
    [r, 'informatika', `digitalni-svijet-${r}`, 'Računalo i sigurnost', '🛡️', 2, INF[`genDigitalniSvijet${r}`]],
    [r, 'priroda', `ja-i-drugi-${r}`, 'Ja i drugi', '🤝', 20, JID[`genJaIDrugi${r}`]],
  ]),
  [3, 'priroda', 'promet-3', 'Promet i bicikl', '🚲', 21, PROMET.genPromet3],
  [4, 'priroda', 'promet-4', 'Promet i bicikl', '🚲', 21, PROMET.genPromet4],
  [3, 'matematika', 'novac-3', 'Novac i kupovina', '💶', 20, NOVAC.genNovac3],
  [4, 'matematika', 'novac-4', 'Novac i kupovina', '💶', 20, NOVAC.genNovac4],
];

const TEME = POPIS.map(([grade, subject, slug, name, icon, order, fn]) => ({
  grade, subject, slug, name, icon, order, gen: wrapGenerator(fn),
}));

/** slug → generator (za services/questionGenerator.js) */
const GENERATORI = Object.fromEntries(TEME.map((t) => [t.slug, t.gen]));

/** { genIme: generator } za jedan razred (za testove i recenziju) */
const zaRazred = (razred) => Object.fromEntries(TEME.filter((t) => t.grade === razred).map((t) => [t.gen.name, t.gen]));

/**
 * Dopuni definicije iz seed skripte razreda: novi predmet Informatika i nove
 * teme na kraju postojećih predmeta. GEN_MAP[predmet] i topicsDef[predmet]
 * moraju ostati poravnati po indeksu.
 */
function prosiriSeed(razred, subjects, topicsDef, GEN_MAP) {
  for (const t of TEME.filter((x) => x.grade === razred)) {
    if (!subjects.some((s) => s.slug === t.subject)) {
      if (t.subject !== 'informatika') throw new Error(`nove-teme: nema predmeta ${t.subject} u ${razred}. razredu`);
      subjects.push(predmetInformatika(razred));
    }
    topicsDef[t.subject] = topicsDef[t.subject] || [];
    GEN_MAP[t.subject] = GEN_MAP[t.subject] || [];
    if (topicsDef[t.subject].some((x) => x.slug === t.slug)) continue;
    const order = t.subject === 'informatika' ? t.order : topicsDef[t.subject].length + 1;
    topicsDef[t.subject].push({ name: t.name, slug: t.slug, icon: t.icon, order });
    GEN_MAP[t.subject].push(t.gen);
  }
}

module.exports = { TEME, GENERATORI, zaRazred, prosiriSeed, predmetInformatika };
