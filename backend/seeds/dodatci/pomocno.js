/**
 * dodatci/pomocno.js — zajednički alati za dodatna pitanja (seeds/dodatci).
 *
 * Cilj dodataka: dijete koje istu temu odigra 20 puta (140 pitanja) ne vidi
 * isti tekst pitanja dvaput. Zato svaka činjenica dobiva više oblika (pitanje u
 * oba smjera, tvrdnja Da/Ne, spajanje), a brojčani zadatci nasumične brojeve.
 */
const { promijesaj, uzmi, jedan, cijeli, izbor, tocnoNetocno, spoji, poredaj, upisBroja, vel } = require('../gen-pomocno');

/** Pravilan oblik imenice uz broj: oblik(5, ['jabuka','jabuke','jabuka']). */
function oblik(n, [jd, pauk, mn]) {
  const d = n % 10, s = n % 100;
  if (d === 1 && s !== 11) return jd;
  if (d >= 2 && d <= 4 && (s < 12 || s > 14)) return pauk;
  return mn;
}
const sOblikom = (n, oblici) => `${fmt(n)} ${oblik(n, oblici)}`;

/** Zapis broja kako ga dijete vidi: 12 450 (razmak tek od pet znamenaka). */
function fmt(n) {
  const s = String(Math.abs(n));
  const g = s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : s;
  return (n < 0 ? '−' : '') + g;
}

/** Brojčani ometači oko točnog (bez negativnih i duplikata). */
function blizu(tocno, koraci = [1, -1, 10, -10, 2, -2]) {
  return [...new Set(koraci.map((k) => tocno + k))].filter((x) => x >= 0 && x !== tocno);
}

/**
 * Jedan zapis iz tablice parova [a, b] → pitanja u oba smjera.
 * `pitajB(a)` traži b (ponude su ostali b-ovi), `pitajA(b)` traži a.
 */
function obaSmjera(tablica, { pitajB, pitajA, tezina = 2, objasni = () => '' }) {
  const sviA = [...new Set(tablica.map((x) => x[0]))], sviB = [...new Set(tablica.map((x) => x[1]))];
  const q = [];
  for (const [a, b] of tablica) {
    // ometač ne smije biti drugi točan odgovor (isti a s više b-ova)
    const drugiB = sviB.filter((x) => !tablica.some(([a2, b2]) => a2 === a && b2 === x));
    const drugiA = sviA.filter((x) => !tablica.some(([a2, b2]) => b2 === b && a2 === x));
    if (pitajB && drugiB.length >= 2) q.push(izbor(pitajB(a, b), b, drugiB, tezina, objasni(a, b)));
    if (pitajA && drugiA.length >= 2) q.push(izbor(pitajA(b, a), a, drugiA, tezina, objasni(a, b)));
  }
  return q;
}

/**
 * Tvrdnje Da/Ne iz tablice parova: za svaki par jedna točna ili jedna netočna
 * tvrdnja (s tuđim b), nasumično. `recenica(a, b)` vraća pitanje s „li”.
 */
function tvrdnje(tablica, recenica, { tezina = 2, objasni = () => '' } = {}) {
  const sviB = [...new Set(tablica.map((x) => x[1]))];
  return tablica.map(([a, b]) => {
    const tocno = Math.random() < 0.5;
    const drugi = sviB.filter((x) => !tablica.some(([a2, b2]) => a2 === a && b2 === x));
    const bb = tocno || !drugi.length ? b : jedan(drugi);
    return tocnoNetocno(recenica(a, bb), bb === b, tezina, objasni(a, b));
  });
}

/**
 * Sve tvrdnje Da/Ne iz tablice parova: za svaki par točna tvrdnja i `lazni`
 * netočnih (s tuđim b koji za taj a nije točan). Netočni se biraju nasumično,
 * pa se kroz više generiranja skupi cijela tablica uparivanja.
 */
function sveTvrdnje(tablica, recenica, { lazni = 2, tezina = 2, objasni = () => '' } = {}) {
  const sviB = [...new Set(tablica.map((x) => x[1]))];
  const q = [];
  for (const [a, b] of tablica) {
    q.push(tocnoNetocno(recenica(a, b), true, tezina, objasni(a, b)));
    const krivi = sviB.filter((x) => !tablica.some(([a2, b2]) => a2 === a && b2 === x));
    for (const k of uzmi(krivi, lazni)) q.push(tocnoNetocno(recenica(a, k), false, tezina, objasni(a, b)));
  }
  return q;
}

/** Spajanje: nasumično `komada` zadataka po `koliko` parova iz tablice (jedinstveni lijevi i desni). */
function spajanja(tablica, pitanje, { koliko = 4, komada = 3, tezina = 2, objasnjenje = '' } = {}) {
  const q = [];
  for (let k = 0; k < komada; k++) {
    const izabrani = [], lijevi = new Set(), desni = new Set();
    for (const [a, b] of promijesaj(tablica)) {
      if (lijevi.has(a) || desni.has(b)) continue;
      izabrani.push([a, b]); lijevi.add(a); desni.add(b);
      if (izabrani.length === koliko) break;
    }
    if (izabrani.length >= 3) q.push(spoji(pitanje, izabrani, tezina, objasnjenje));
  }
  return q;
}

/** Izbor s tablicom [pitanje, točno, [ometači], objašnjenje?]. */
const izTablice = (redovi, tezina = 2) => redovi.map(([p, t, k, o]) => izbor(p, t, k, tezina, o || ''));
/** Da/Ne s tablicom [pitanje, true/false, objašnjenje?]. */
const daNe = (redovi, tezina = 2) => redovi.map(([p, t, o]) => tocnoNetocno(p, t, tezina, o || ''));

module.exports = {
  promijesaj, uzmi, jedan, cijeli, izbor, tocnoNetocno, spoji, poredaj, upisBroja, vel,
  oblik, sOblikom, fmt, blizu, obaSmjera, tvrdnje, sveTvrdnje, spajanja, izTablice, daNe,
};
