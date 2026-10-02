/**
 * dnevni.js — dnevni izazov: jedan miješani kviz dnevno i niz dana zaredom.
 *
 * Dan se računa po zagrebačkom vremenu, ne po UTC-u: dijete koje igra u
 * 00:30 po našem vremenu igra „sutrašnji” izazov, a ne „jučerašnji” (UTC je
 * tada još prethodni dan).
 *
 * Niz se računa iz zapisa u `progress` (polja `dnevni: true`, `dan`), pa ga
 * nije moguće „pokvariti” neuspjelim upisom u korisnika i uvijek se može
 * ponovno izračunati.
 */
const { getDb } = require('../db/mongo');

const ZONA = 'Europe/Zagreb';
const BROJ_PITANJA = 10;

const formatDana = new Intl.DateTimeFormat('en-CA', { timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit' });

/** Datum u obliku 'YYYY-MM-DD' za trenutak `d`, po zagrebačkom vremenu. */
function dan(d = new Date()) {
  return formatDana.format(d);
}

/** Prethodni kalendarski dan za 'YYYY-MM-DD'. */
function prethodni(datum) {
  const [g, m, d] = datum.split('-').map(Number);
  const t = new Date(Date.UTC(g, m - 1, d - 1));
  return t.toISOString().slice(0, 10);
}

/**
 * Niz dana zaredom iz skupa odigranih dana.
 * Ako danas još nije odigrano, niz se računa do jučer (nije prekinut dok dan
 * ne prođe).
 */
function izracunajNiz(odigraniDani, danas) {
  const skup = new Set(odigraniDani);
  let d = skup.has(danas) ? danas : prethodni(danas);
  let niz = 0;
  while (skup.has(d)) { niz++; d = prethodni(d); }

  let najdulji = 0, tekuci = 0, prosli = null;
  for (const x of [...skup].sort()) {
    tekuci = prosli && prethodni(x) === prosli ? tekuci + 1 : 1;
    najdulji = Math.max(najdulji, tekuci);
    prosli = x;
  }
  return { niz, najduljiNiz: najdulji };
}

/** Stanje dnevnog izazova za korisnika. */
async function stanje(userId, sada = new Date()) {
  const danas = dan(sada);
  const zapisi = await getDb().collection('progress')
    .find({ user_id: userId, dnevni: true })
    .project({ dan: 1 })
    .toArray();
  const dani = [...new Set(zapisi.map((z) => z.dan).filter(Boolean))];
  return { danas, odigranoDanas: dani.includes(danas), ukupnoDana: dani.length, ...izracunajNiz(dani, danas) };
}

module.exports = { dan, prethodni, izracunajNiz, stanje, BROJ_PITANJA, ZONA };
