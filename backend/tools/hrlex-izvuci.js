#!/usr/bin/env node
/**
 * hrlex-izvuci.js — iz hrLex-a izvlači imenice u oblik koji koristi hr-gramatika.js
 *
 * hrLex 1.3: 6 427 709 oblika, 164 206 lema, CC BY-SA 4.0
 *   https://www.clarin.si/repository/xmlui/handle/11356/1232
 *
 * PREUZIMANJE (ručno — repozitorij traži pristanak na licencu):
 *   curl -L -o hrLex_v1.3.gz \
 *     "https://www.clarin.si/repository/xmlui/bitstream/handle/11356/1232/hrLex_v1.3.gz"
 *
 * POKRETANJE:
 *   node tools/hrlex-izvuci.js hrLex_v1.3.gz               # sve leme iz popisa
 *   node tools/hrlex-izvuci.js hrLex_v1.3.gz jabuka olovka # samo navedene
 *
 * Izlaz: seeds/hr-imenice-hrlex.json — spreman za spajanje u IMENICE.
 *
 * LICENCA: hrLex je CC BY-SA 4.0. Izvedeni rječnik nasljeđuje tu licencu.
 * Drži ga u zasebnom repozitoriju s navedenim izvorom; kod aplikacije time
 * nije zahvaćen jer se JSON samo učitava kao podatak.
 *
 * ── Format hrLex retka (TSV, 8 stupaca) ──────────────────────────
 *   oblik · lema · MSD · MSD-obilježja · UPOS · obilježja · frek · frek/mil
 *
 * ── MULTEXT-East MSD za imenice (hbs) ────────────────────────────
 *   poz. 1  N        imenica
 *   poz. 2  c/p      opća / vlastita
 *   poz. 3  m/f/n    rod
 *   poz. 4  s/p      broj (jednina / množina)
 *   poz. 5  n/g/d/a/v/l/i   padež
 *
 *   Ncfsn = opća imenica, ženski rod, jednina, nominativ  → "jabuka"
 *   Ncfsg = ... genitiv jednine (paukal, za 2-4)          → "jabuke"
 *   Ncfpg = ... genitiv množine (za 5+)                   → "jabuka"
 *   Ncfsa = ... akuzativ jednine (objekt)                 → "jabuku"
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const readline = require('readline');

const [, , datoteka, ...tražene] = process.argv;

if (!datoteka) {
  console.error('Uporaba: node tools/hrlex-izvuci.js <hrLex_v1.3.gz> [lema ...]');
  process.exit(1);
}
if (!fs.existsSync(datoteka)) {
  console.error(`Nema datoteke: ${datoteka}`);
  console.error('Preuzmi je s https://www.clarin.si/repository/xmlui/handle/11356/1232');
  process.exit(1);
}

// Leme koje projekt već koristi — proširi popis po potrebi.
const ZADANE_LEME = [
  // škola
  'olovka', 'bilježnica', 'knjiga', 'gumica', 'pernica', 'bojica', 'ravnalo',
  'torba', 'ruksak', 'stolica', 'ploča', 'kreda', 'šiljilo', 'marker',
  // hrana
  'jabuka', 'kruška', 'naranča', 'banana', 'šljiva', 'trešnja', 'jagoda',
  'čokolada', 'bombon', 'kolač', 'keksić', 'sok', 'jaje', 'kruh', 'sir',
  'mrkva', 'krumpir', 'rajčica', 'lubenica', 'breskva', 'malina',
  // igračke i stvari
  'loptica', 'lopta', 'igračka', 'autić', 'medvjedić', 'balon', 'kocka',
  'naljepnica', 'sličica', 'zvjezdica', 'magnet', 'papirić', 'crtež', 'kamenčić',
  // priroda
  'cvijet', 'stablo', 'list', 'ptica', 'leptir', 'pčela', 'riba', 'mačka',
  'pas', 'konj', 'krava', 'ovca', 'zec', 'vjeverica',
  // ostalo
  'dijete', 'putnik', 'kutija', 'vrećica', 'hrpa', 'paket', 'red', 'stranica',
  'kuna', 'euro', 'sat', 'minuta', 'dan', 'tjedan', 'mjesec',
];

const leme = new Set(tražene.length ? tražene : ZADANE_LEME);

// MSD → ključ u našem zapisu
const SLOT = {
  sn: 'Njd',  // nominativ jednine   → 1 jabuka
  sg: 'Gjd',  // genitiv jednine     → 2 jabuke  (paukal)
  pg: 'Gmn',  // genitiv množine     → 5 jabuka
  sa: 'Ajd',  // akuzativ jednine    → objekt: 1 jabuku
};
const ROD = { m: 'm', f: 'z', n: 's' };

const nađeno = new Map(); // lema → { rod, oblici:{}, frek }
let redaka = 0;

const ulaz = datoteka.endsWith('.gz')
  ? fs.createReadStream(datoteka).pipe(zlib.createGunzip())
  : fs.createReadStream(datoteka);

const rl = readline.createInterface({ input: ulaz, crlfDelay: Infinity });

rl.on('line', (redak) => {
  redaka++;
  const p = redak.split('\t');
  if (p.length < 3) return;

  const [oblik, lema, msd] = p;
  if (!leme.has(lema)) return;
  if (msd[0] !== 'N' || msd[1] !== 'c') return; // samo opće imenice

  const rod = ROD[msd[2]];
  const slot = SLOT[msd[3] + msd[4]];
  if (!rod || !slot) return;

  if (!nađeno.has(lema)) nađeno.set(lema, { rod, oblici: {}, frek: Number(p[6]) || 0 });
  const zapis = nađeno.get(lema);

  // hrLex zna imati više oblika za isti slot (dublete) — uzmi češći
  const staro = zapis.oblici[slot];
  const frek = Number(p[6]) || 0;
  if (!staro || frek > staro.frek) zapis.oblici[slot] = { oblik, frek };
});

rl.on('close', () => {
  const izlaz = {};
  const nepotpune = [];

  for (const [lema, { rod, oblici }] of [...nađeno].sort()) {
    const Njd = oblici.Njd?.oblik;
    const Gjd = oblici.Gjd?.oblik;
    const Gmn = oblici.Gmn?.oblik;
    const Ajd = oblici.Ajd?.oblik;

    if (!Njd || !Gjd || !Gmn) { nepotpune.push(lema); continue; }

    const zapis = { o: [Njd, Gjd, Gmn], rod };
    // Ajd bilježimo samo kad se razlikuje od Njd (ž rod na -a, živo u m rodu)
    if (Ajd && Ajd !== Njd) zapis.akJd = Ajd;
    izlaz[bezDijakritika(lema)] = zapis;
  }

  const cilj = path.join(__dirname, '..', 'seeds', 'hr-imenice-hrlex.json');
  fs.writeFileSync(cilj, JSON.stringify(izlaz, null, 2) + '\n', 'utf8');

  console.log(`Pročitano redaka:  ${redaka.toLocaleString('hr')}`);
  console.log(`Tražene leme:      ${leme.size}`);
  console.log(`Izvučeno:          ${Object.keys(izlaz).length}`);
  if (nepotpune.length) {
    console.log(`Nepotpune (${nepotpune.length}): ${nepotpune.join(', ')}`);
    console.log('  → dopuni ručno u hr-gramatika.js ili provjeri lemu u hrLex-u');
  }
  console.log(`\nZapisano: ${cilj}`);
  console.log('\nSpajanje u hr-gramatika.js:');
  console.log("  const IZ_HRLEX = require('./hr-imenice-hrlex.json');");
  console.log('  // svakom zapisu dodaj jestivo/predmet/kategorija pa spoji u IMENICE');
  console.log('\nLicenca: hrLex je CC BY-SA 4.0 — izvedeni JSON nasljeđuje istu licencu.');
});

/** ključ bez dijakritika — usklađeno s postojećim ključevima u IMENICE */
function bezDijakritika(s) {
  return s
    .replace(/č|ć/g, 'c').replace(/Č|Ć/g, 'C')
    .replace(/ž/g, 'z').replace(/Ž/g, 'Z')
    .replace(/š/g, 's').replace(/Š/g, 'S')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}
