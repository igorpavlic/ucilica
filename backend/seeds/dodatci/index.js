/**
 * dodatci/index.js — dodatna pitanja po imenu generatora.
 *
 * Teme s malom bankom (20–40 različitih tekstova) davale su djetetu koje temu
 * igra često ista pitanja svakih nekoliko kvizova. Dodatci podižu svaku temu na
 * najmanje ~150 različitih tekstova, pa 20 kvizova po 7 pitanja ne ponavlja tekst.
 * Uključuju se u pedagogyReview.reviewQuestions, pa prolaze istu provjeru,
 * ograničenje obitelji, objašnjenja i ključeve kao izvorna pitanja.
 */
const IZVORI = [
  require('./matematika'),
  require('./hrvatski'),
  require('./hrvatski-2'),
  require('./priroda-a'),
  require('./priroda-a2'),
  require('./priroda-b'),
  require('./drustvo'),
];
/** ime generatora → funkcija koja vraća dodatna pitanja (više izvora se spaja). */
const DODATCI = {};
for (const izvor of IZVORI) {
  for (const [ime, f] of Object.entries(izvor)) {
    if (typeof f !== 'function') continue;
    const prije = DODATCI[ime];
    DODATCI[ime] = prije ? () => [...prije(), ...f()] : f;
  }
}

/** Dodatna pitanja za generator (nasumičnim redom, da ograničenje obitelji ne bira uvijek iste). */
function dodatciZa(imeGeneratora) {
  const f = DODATCI[imeGeneratora];
  if (!f) return [];
  const q = f().filter(Boolean);
  for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; }
  return q;
}

module.exports = { dodatciZa, DODATCI };
