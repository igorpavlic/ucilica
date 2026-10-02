/**
 * gen-pomocno.js — zajednički oblikovači zadataka za generatore novih tema
 * (informatika, ja i drugi, promet, novac).
 *
 * Svaki zadatak nosi objašnjenje (zašto je odgovor točan) i oznaku ishoda.
 * Ponuđeni odgovori miješaju se nasumično, pa točan nije uvijek na istom mjestu.
 */

const promijesaj = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const uzmi = (arr, n) => promijesaj(arr).slice(0, n);
const jedan = (arr) => arr[Math.floor(Math.random() * arr.length)];
const cijeli = (od, do_) => od + Math.floor(Math.random() * (do_ - od + 1));

/** Izbor: točan + do 3 ometača iz skupa (bez točnog i bez ponavljanja). */
const izbor = (pitanje, tocno, krivi, tezina, objasnjenje, ishod, extra = {}) => {
  const ometaci = uzmi([...new Set(krivi.map(String))].filter((k) => k !== String(tocno)), 3);
  const answers = promijesaj([String(tocno), ...ometaci]);
  return { type: 'choice', difficulty: tezina, question: pitanje, answers, correctIndex: answers.indexOf(String(tocno)), objasnjenje, ishod, ...extra };
};
const tocnoNetocno = (pitanje, tocno, tezina, objasnjenje, ishod, extra = {}) =>
  ({ type: 'true-false', difficulty: tezina, question: pitanje, correct: tocno, objasnjenje, ishod, ...extra });
const spoji = (pitanje, pairs, tezina, objasnjenje, ishod) =>
  ({ type: 'match', difficulty: tezina, question: pitanje, pairs, objasnjenje, ishod });
const poredaj = (pitanje, items, tezina, objasnjenje, ishod, extra = {}) =>
  ({ type: 'ordering', difficulty: tezina, question: pitanje, items, objasnjenje, ishod, ...extra });
/** Upis broja: oblik odgovora je iz zadatka očit, pa ga ne treba opisivati. */
const upisBroja = (pitanje, broj, tezina, objasnjenje, ishod, extra = {}) =>
  ({ type: 'input', difficulty: tezina, question: pitanje, correctAnswer: String(broj), objasnjenje, ishod, ...extra });

const vel = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

module.exports = { promijesaj, uzmi, jedan, cijeli, izbor, tocnoNetocno, spoji, poredaj, upisBroja, vel };
