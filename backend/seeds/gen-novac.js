/**
 * Novac i kupovina — 3. i 4. razred (Matematika; međupredmetna tema
 * Poduzetništvo, domena C „ekonomska i financijska pismenost”; Nacionalni
 * strateški okvir financijske pismenosti 2021.–2026.).
 * U 2. razredu novac ostaje u temi „Mjerenje i novac”.
 *
 * Računski zadatci su parametrizirani (cijene, iznosi, imena, predmeti), pa
 * svaki poziv daje nove zadatke. Iznosi su u cijelim eurima — decimalni
 * brojevi dolaze tek u 5. razredu; centi se pojavljuju samo u pretvorbi
 * € ↔ c (3. r.). Raspon prati gradivo: 3. r. brojevi do 1000 i tablica
 * množenja, 4. r. veći iznosi i pisano množenje i dijeljenje.
 *
 * Pojmovni zadatci: potreba i želja, zašto čuvamo račun, oznake roka trajanja
 * („upotrijebiti do” je sigurnost, „najbolje upotrijebiti do” je kvaliteta),
 * svrha reklame, štednja.
 */
const HR = require('./hr-gramatika');
const { uzmi, jedan, cijeli, izbor, tocnoNetocno, upisBroja, vel } = require('./gen-pomocno');

const MAT = 'MAT OŠ (računanje s novcem)';
const POD = 'pod C (financijska pismenost)';

// Predmeti iz rječnika imenica (ispravni padeži i slaganje s brojem) i raspon cijene u €.
const ROBA = {
  olovka: [1, 3], biljeznica: [2, 4], gumica: [1, 2], ravnalo: [2, 4], sok: [1, 3],
  knjiga: [8, 18], lopta: [10, 25], majica: [8, 16], kruh: [1, 3],
};
const ime = () => jedan(Object.keys(HR.IMENA));
const cijena = (k) => cijeli(...ROBA[k]);
const nom = (k) => HR.imeZa(1, k, 'N');
const akuz = (k) => HR.imeZa(1, k, 'A');
const koji = (k) => ({ z: 'koja', m: 'koji', s: 'koje' })[HR.IMENICE[k].rod];
const eura = (n) => `${n} ${['euro', 'eura', 'eura'][HR.oblikZa(n)]}`;
const tjedana = (n) => `${n} ${['tjedan', 'tjedna', 'tjedana'][HR.oblikZa(n)]}`;
const centi = (n) => `${n} ${['cent', 'centa', 'centi'][HR.oblikZa(n)]}`;

/** Najmanji broj novčanica i kovanica za iznos u cijelim eurima. */
function najmanjeKomada(iznos) {
  let n = 0, ostatak = iznos;
  const koraci = [];
  for (const v of [200, 100, 50, 20, 10, 5, 2, 1]) {
    const k = Math.floor(ostatak / v);
    if (k) { n += k; ostatak -= k * v; koraci.push(`${k} × ${v} €`); }
  }
  return { n, koraci };
}

const POTREBE = ['hrana', 'voda za piće', 'topla jakna zimi', 'lijek kad smo bolesni', 'cipele koje nam pristaju'];
const ZELJE = ['nova igraća konzola', 'treća lopta za nogomet', 'slatkiši sa svakom kupnjom', 'igračka iz reklame', 'skupe tenisice s natpisom'];

function genNovac(razred) {
  const q = [];
  const R3 = razred === 3;

  // 1) Ukupna cijena dviju stvari
  {
    const [a, b] = uzmi(R3 ? Object.keys(ROBA) : ['lopta', 'knjiga', 'majica'], 2);
    const ca = R3 ? cijena(a) : cijeli(12, 45), cb = R3 ? cijena(b) : cijeli(12, 45);
    q.push(upisBroja(`${ime()} kupuje ${akuz(a)} i ${akuz(b)}. ${vel(nom(a))} stoji ${ca} €, a ${nom(b)} ${cb} €. Koliko eura plaća ukupno?`,
      ca + cb, 1, `${ca} € + ${cb} € = ${ca + cb} €.`, MAT));
  }
  // 2) Koliko se dobije natrag
  {
    const k = jedan(R3 ? Object.keys(ROBA) : ['lopta', 'knjiga', 'majica']);
    const novcanice = R3 ? [5, 10, 20, 50] : [50, 100];
    const c = R3 ? cijena(k) : cijeli(13, 89);
    const p = novcanice.find((v) => v > c) || novcanice[novcanice.length - 1];
    q.push(upisBroja(`${ime()} kupuje ${akuz(k)} za ${c} € i plaća novčanicom od ${p} €. Koliko eura dobiva natrag?`,
      p - c, 2, `Od novčanice oduzmemo cijenu: ${p} € − ${c} € = ${p - c} €.`, MAT));
  }
  // 3) Više jednakih komada
  {
    const k = jedan(['olovka', 'biljeznica', 'gumica', 'ravnalo', 'sok']);
    const c = cijena(k), n = R3 ? cijeli(3, 9) : cijeli(12, 35);
    q.push(upisBroja(`Jedna ${nom(k)} stoji ${c} €. Koliko eura treba platiti za ${HR.brojIme(n, k, 'A')}?`
      .replace('Jedna', { z: 'Jedna', m: 'Jedan', s: 'Jedno' }[HR.IMENICE[k].rod]),
    n * c, R3 ? 2 : 3, `${n} · ${c} € = ${n * c} €.`, MAT));
  }
  // 4) Cijena jednog komada
  {
    const k = jedan(['olovka', 'biljeznica', 'gumica', 'ravnalo', 'sok']);
    const c = cijena(k), n = R3 ? cijeli(2, 9) : cijeli(4, 9);
    const jedan_ = { z: 'jedna', m: 'jedan', s: 'jedno' }[HR.IMENICE[k].rod];
    q.push(upisBroja(`Za ${HR.brojIme(n, k, 'A')} plaćeno je ${n * c} €. Koliko eura stoji ${jedan_} ${nom(k)}?`,
      c, 2, `Ukupnu cijenu dijelimo brojem komada: ${n * c} € : ${n} = ${c} €.`, MAT));
  }
  // 5) Štednja
  {
    const k = jedan(['lopta', 'knjiga', 'majica']);
    const s = R3 ? cijeli(2, 5) : cijeli(3, 9), t = R3 ? cijeli(3, 6) : cijeli(4, 9);
    const vec = R3 ? 0 : cijeli(1, 4) * 5;
    const c = vec + s * t;
    const tekst = R3
      ? `${ime()} želi kupiti ${akuz(k)} ${koji(k)} stoji ${c} €. Svaki tjedan uštedi ${s} €. Koliko tjedana mora štedjeti?`
      : `${ime()} želi kupiti ${akuz(k)} ${koji(k)} stoji ${c} €. Već ima ${vec} €, a svaki tjedan uštedi još ${s} €. Koliko tjedana mora štedjeti?`;
    q.push(upisBroja(tekst, t, R3 ? 2 : 3,
      R3 ? `${c} € : ${s} € = ${t}. Toliko tjedana treba štedjeti po ${s} €.`
        : `Nedostaje ${c} € − ${vec} € = ${c - vec} €, a to je ${c - vec} € : ${s} € = ${tjedana(t)} štednje.`, POD));
  }
  // 6) Što se može kupiti za određen iznos (samo jedan par stane)
  for (let pokusaj = 0; pokusaj < 20; pokusaj++) {
    const stvari = uzmi(['lopta', 'knjiga', 'majica', 'biljeznica', 'sok', 'olovka'], 4).map((k) => ({ k, c: cijena(k) }));
    const parovi = [];
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) parovi.push({ t: `${nom(stvari[i].k)} i ${nom(stvari[j].k)}`, s: stvari[i].c + stvari[j].c });
    parovi.sort((x, y) => x.s - y.s);
    if (parovi[0].s === parovi[1].s) continue;
    const imaNovca = parovi[0].s + cijeli(0, parovi[1].s - parovi[0].s - 1);
    q.push(izbor(`${ime()} ima ${imaNovca} €. Koje dvije stvari iz cjenika može kupiti tim novcem?`, parovi[0].t, parovi.slice(1).map((p) => p.t), 3,
      `${vel(parovi[0].t)} stoje zajedno ${parovi[0].s} €, a to je najviše ${imaNovca} €. Svaki drugi par stoji više od ${imaNovca} €.`,
      MAT, { passage: `Cjenik:\n${stvari.map((x) => `${nom(x.k)} — ${x.c} €`).join('\n')}` }));
    break;
  }

  // 7) Potrebe i želje
  q.push(izbor('Što je od ovoga potreba, a ne želja?', jedan(POTREBE), ZELJE, 1,
    'Potrebe su ono bez čega ne možemo zdravo živjeti: hrana, voda, odjeća, lijekovi. Želje su lijepe, ali bez njih možemo.', POD));
  q.push(izbor('Što je od ovoga želja, a ne potreba?', jedan(ZELJE), POTREBE, 1,
    'Bez želja možemo živjeti, pa ih kupujemo tek kad su potrebe podmirene i kad za to ima novca.', POD));
  // 8) Račun i reklama
  q.push(izbor('Zašto čuvamo račun nakon kupnje?', 'da možemo vratiti neispravan proizvod',
    ['da ga možemo pokazati prijateljima', 'da sljedeći put dobijemo besplatnu stvar', 'da trgovac zna gdje stanujemo'], 2,
    'Račun dokazuje što smo kupili, kada i za koliko. S njim možemo reklamirati neispravan proizvod.', POD));
  q.push(izbor('Što reklama najčešće želi postići?', 'da kupimo proizvod', ['da naučimo nešto o prirodi', 'da se odmorimo od televizije', 'da uštedimo novac'], 1,
    'Reklama hvali proizvod da bismo ga kupili. Zato nije uvijek najbolji izvor podataka o proizvodu.', POD));

  if (R3) {
    // 9) Euri i centi
    const e = cijeli(1, 9);
    q.push(upisBroja(`Koliko centi ima ${eura(e)}?`, e * 100, 2, `1 € = 100 centi, pa je ${e} € = ${e} · 100 = ${e * 100} centi.`, MAT));
    const e2 = cijeli(1, 9), c2 = cijeli(1, 9) * 10;
    q.push(upisBroja(`Koliko je ${eura(e2)} i ${centi(c2)} u centima?`, e2 * 100 + c2, 2,
      `${e2} € = ${e2 * 100} centi, pa je ukupno ${e2 * 100} + ${c2} = ${e2 * 100 + c2} centi.`, MAT));
    q.push(izbor('Koja euro novčanica NE postoji?', jedan(['30 €', '25 €', '15 €', '40 €']), ['5 €', '10 €', '20 €', '50 €', '100 €', '200 €'], 2,
      'Euro novčanice koje se izdaju su 5, 10, 20, 50, 100 i 200 €.', MAT));
    q.push(izbor('Koja euro kovanica NE postoji?', jedan(['3 €', '5 €', '25 centi']), ['1 €', '2 €', '50 centi', '20 centi', '10 centi'], 2,
      'Kovanice su 1, 2, 5, 10, 20 i 50 centi te 1 i 2 €.', MAT));
  } else {
    // 10) Paket ili pojedinačno
    {
      const k = jedan(['sok', 'olovka', 'biljeznica', 'gumica']);
      const n = cijeli(4, 8), c = cijeli(2, 4);
      const razlika = jedan([-2, -1, 1, 2]);
      const paket = n * c + razlika * cijeli(1, 3);
      const jeftiniji = paket < n * c ? 'paket' : 'jedan po jedan';
      const jedan_ = { z: 'Jedna', m: 'Jedan', s: 'Jedno' }[HR.IMENICE[k].rod];
      q.push(izbor(`Paket od ${HR.brojIme(n, k)} stoji ${paket} €. ${jedan_} ${nom(k)} posebno stoji ${c} €. Što je jeftinije za ${HR.brojIme(n, k)}?`,
        jeftiniji === 'paket' ? 'kupiti paket' : 'kupiti komade jedan po jedan', ['kupiti paket', 'kupiti komade jedan po jedan', 'jednako je skupo'], 3,
        `${n} komada pojedinačno stoji ${n} · ${c} € = ${n * c} €, a paket ${paket} €. ${jeftiniji === 'paket' ? 'Paket' : 'Pojedinačna kupnja'} je jeftinija.`, POD));
    }
    // 11) Račun iz trgovine
    {
      const stavke = uzmi(Object.keys(ROBA), 3).map((k) => { const kol = cijeli(1, 3); return { k, kol, c: cijena(k) * kol }; });
      const ukupno = stavke.reduce((s, x) => s + x.c, 0);
      const placeno = [20, 50, 100].find((v) => v > ukupno) || 100;
      const racun = `RAČUN\n${stavke.map((x) => `${nom(x.k)}${x.kol > 1 ? ` × ${x.kol}` : ''} — ${x.c} €`).join('\n')}\nUKUPNO — ___\nPlaćeno — ${placeno} €`;
      q.push(upisBroja('Pogledaj račun. Koliko eura iznosi UKUPNO?', ukupno, 2,
        `${stavke.map((x) => x.c).join(' + ')} = ${ukupno} €.`, MAT, { passage: racun }));
      q.push(upisBroja('Pogledaj račun. Koliko eura je kupac dobio natrag?', placeno - ukupno, 3,
        `Ukupno je ${ukupno} €, a plaćeno ${placeno} €: ${placeno} − ${ukupno} = ${placeno - ukupno} €.`, MAT, { passage: racun }));
    }
    // 12) Najmanje novčanica i kovanica
    {
      const iznos = cijeli(6, 99);
      const { n, koraci } = najmanjeKomada(iznos);
      q.push(upisBroja(`S koliko najmanje novčanica i kovanica možeš platiti točno ${iznos} €?`, n, 3,
        `Uzimamo najveće što stane: ${koraci.join(' + ')}. To je ${n} komada.`, MAT));
    }
    // 13) Džeparac i sniženje
    {
      const d = cijeli(3, 10), t = cijeli(4, 12);
      q.push(upisBroja(`${ime()} dobiva ${d} € džeparca svaki tjedan. Koliko eura dobije za ${tjedana(t)}?`, d * t, 2,
        `${t} · ${d} € = ${d * t} €.`, MAT));
      const k = jedan(['lopta', 'knjiga', 'majica']);
      const c = cijeli(6, 30) * 2;
      q.push(upisBroja(`${vel(nom(k))} stoji ${c} €. Na sniženju je upola jeftinija. Koliko eura sada stoji?`
        .replace('jeftinija', { z: 'jeftinija', m: 'jeftiniji', s: 'jeftinije' }[HR.IMENICE[k].rod]), c / 2, 2,
        `Upola znači podijeliti s 2: ${c} € : 2 = ${c / 2} €.`, MAT));
    }
    // 14) Rok trajanja
    {
      const dan = cijeli(4, 25), mj = cijeli(1, 12), razlika = jedan([-3, -2, -1, 1, 2, 3]);
      const danas = dan + razlika;
      const smije = danas <= dan;
      q.push(tocnoNetocno(`Na jogurtu piše „Upotrijebiti do: ${dan}. ${mj}.” Danas je ${danas}. ${mj}. Smije li se jogurt pojesti?`, smije, 3,
        smije ? 'Datum još nije prošao, pa je jogurt siguran ako je čuvan u hladnjaku.'
          : '„Upotrijebiti do” znači da nakon tog datuma hrana može biti štetna za zdravlje.', POD));
    }
    q.push(izbor('Što znači oznaka „najbolje upotrijebiti do” na keksima?', 'do tog datuma keksi su najukusniji i najbolji',
      ['tog dana keksi postaju otrovni i opasni za jelo', 'keksi se smiju jesti tek od toga dana nadalje', 'tog dana su keksi u trgovini najjeftiniji'], 3,
      '„Najbolje upotrijebiti do” govori o kvaliteti. „Upotrijebiti do” (na svježoj hrani) govori o sigurnosti.', POD));
    q.push(tocnoNetocno('Kad roditelj plati karticom, troši li novac sa svog računa u banci?', true, 2,
      'Kartica nije besplatan novac. Plaćanjem karticom novac odlazi s računa.', POD));
  }
  return q;
}

function genNovac3() { return genNovac(3); }
function genNovac4() { return genNovac(4); }

module.exports = { genNovac3, genNovac4, _najmanjeKomada: najmanjeKomada };
