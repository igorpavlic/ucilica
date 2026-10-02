/**
 * dodatci/matematika.js — dodatna pitanja za matematičke teme s malom bankom.
 * Brojevi su nasumični, pa svaki poziv daje nove tekstove; činjenice o
 * likovima, tijelima i mjerama imaju više oblika pitanja.
 */
const { promijesaj, uzmi, jedan, cijeli, izbor, tocnoNetocno, upisBroja, poredaj, oblik, fmt, blizu, obaSmjera, tvrdnje, spajanja, izTablice, daNe, uObitelj, obiteljTablice } = require('./pomocno');

const ponovi = (n, f) => Array.from({ length: n }, (_, i) => f(i)).flat().filter(Boolean);
const ZNAK = { '<': '< manje', '>': '> veće', '=': '= jednako' };
const znakZa = (a, b) => (a < b ? '<' : a > b ? '>' : '=');

// ═══ 1. razred ═══

const OBLICI = ['🔴', '🔵', '🟢', '🟡', '⭐', '🔺', '🟦', '❤️'];
function nizoviDodatak() {
  const q = [];
  // Brojevni nizovi do 20: korak 1 ili 2, naprijed i natrag.
  ponovi(8, () => {
    const korak = jedan([1, 2]), smjer = jedan([1, -1]);
    const d = korak * smjer;
    const pocetak = smjer > 0 ? cijeli(0, 20 - 4 * korak) : cijeli(4 * korak, 20);
    const niz = [0, 1, 2, 3].map((i) => pocetak + i * d);
    const praznina = cijeli(1, 3);
    const prikaz = niz.map((x, i) => (i === praznina ? '___' : x)).join(', ');
    q.push(upisBroja(`Koji broj nedostaje u nizu: ${prikaz}?`, niz[praznina], 2,
      `Brojevi se ${d > 0 ? 'povećavaju' : 'smanjuju'} za ${korak}.`));
  });
  ponovi(4, () => {
    const pocetak = cijeli(10, 20), d = jedan([-1, -2]);
    const niz = [0, 1, 2].map((i) => pocetak + i * d);
    return upisBroja(`Brojimo unatrag: ${niz.join(', ')}, ___. Koji broj dolazi sljedeći?`, pocetak + 3 * d, 2,
      `Svaki je sljedeći broj za ${-d} manji.`);
  }).forEach((x) => q.push(x));
  // Uzorci slikama: AB, AAB, ABC, ABB.
  const UZORCI = [[0, 1], [0, 0, 1], [0, 1, 2], [0, 1, 1]];
  ponovi(6, () => {
    const u = jedan(UZORCI), znakovi = uzmi(OBLICI, 3);
    const dug = Array.from({ length: u.length * 2 + 1 }, (_, i) => znakovi[u[i % u.length]]);
    const sljedeci = znakovi[u[dug.length % u.length]];
    return izbor(`Koja sličica nastavlja uzorak: ${dug.join(' ')} …?`, sljedeci, znakovi.filter((z) => z !== sljedeci).concat(jedan(OBLICI.filter((z) => !znakovi.includes(z)))), 2,
      `Uzorak se ponavlja: ${u.map((i) => znakovi[i]).join(' ')}.`);
  }).forEach((x) => q.push(x));
  ponovi(3, () => {
    const u = jedan(UZORCI), znakovi = uzmi(OBLICI, 3);
    const dug = Array.from({ length: u.length * 3 }, (_, i) => znakovi[u[i % u.length]]);
    const prikaz = dug.map((z, i) => (i === u.length + 1 ? '❔' : z)).join(' ');
    const tocno = dug[u.length + 1];
    return izbor(`Koja sličica nedostaje umjesto upitnika: ${prikaz}?`, tocno, znakovi.filter((z) => z !== tocno), 2,
      'Pronađi dio koji se ponavlja i provjeri gdje je upitnik.');
  }).forEach((x) => q.push(x));
  // Usporedbe po veličini, duljini, visini, masi — iz tablice parova.
  const DULJE = [['vlak', 'automobil'], ['rijeka', 'potok'], ['zmija', 'gušter'], ['šal', 'rukavica'], ['klupa', 'stolica'], ['metla', 'žlica'], ['ravnalo', 'gumica'], ['konop za preskakanje', 'vezica']];
  const VISE = [['žirafa', 'koza'], ['neboder', 'kuća'], ['bor', 'grm'], ['tata', 'beba'], ['ormar', 'stolac'], ['planina', 'brežuljak'], ['toranj', 'klupa'], ['suncokret', 'tratinčica']];
  const TEZE = [['lubenica', 'jagoda'], ['slon', 'zec'], ['bicikl', 'kaciga'], ['kamen', 'pero'], ['torba s knjigama', 'pernica'], ['krava', 'kokoš'], ['bundeva', 'orah'], ['stol', 'olovka']];
  const usp = (tablica, rijec) => tablica.flatMap(([v, m]) => [
    izbor(`Što je ${rijec}: ${promijesaj([v, m]).join(' ili ')}?`, v, [m], 1),
  ]);
  q.push(...usp(DULJE, 'dulje'), ...usp(VISE, 'više'), ...usp(TEZE, 'teže'));
  q.push(...uObitelj(obiteljTablice(DULJE), DULJE.map(([v, m]) => izbor(`Što je kraće: ${promijesaj([v, m]).join(' ili ')}?`, m, [v], 1))));
  q.push(...uObitelj(obiteljTablice(VISE), VISE.map(([v, m]) => izbor(`Što je niže: ${promijesaj([v, m]).join(' ili ')}?`, m, [v], 1))));
  q.push(...uObitelj(obiteljTablice(TEZE), TEZE.map(([v, m]) => izbor(`Što je lakše: ${promijesaj([v, m]).join(' ili ')}?`, m, [v], 1))));
  ponovi(3, () => {
    const [a, b, c] = uzmi([['mrav', 1], ['olovka', 2], ['metla', 3], ['autobus', 4], ['vlak', 5]], 3).sort((x, y) => x[1] - y[1]);
    return poredaj(`Poredaj od najkraćega do najduljega: ${promijesaj([a[0], b[0], c[0]]).join(', ')}.`, [a[0], b[0], c[0]], 2);
  }).forEach((x) => q.push(x));
  return q;
}

const GEOM_PREDMETI = [
  ['lopta', 'kugla'], ['naranča', 'kugla'], ['klikerica', 'kugla'], ['lubenica', 'kugla'],
  ['kutija za cipele', 'kvadar'], ['ormar', 'kvadar'], ['opeka', 'kvadar'], ['tetrapak mlijeka', 'kvadar'], ['kutija šibica', 'kvadar'],
  ['kocka šećera', 'kocka'], ['kocka za igru', 'kocka'], ['Rubikova kocka', 'kocka'],
  ['limenka', 'valjak'], ['svijeća', 'valjak'], ['čaša', 'valjak'], ['bubanj', 'valjak'],
  ['kornet sladoleda', 'stožac'], ['prometni čunj', 'stožac'], ['rođendanska kapica', 'stožac'], ['lijevak', 'stožac'],
];
const LIK_PREDMETI = [
  ['kotač', 'krug'], ['tanjur', 'krug'], ['novčić', 'krug'], ['gumb', 'krug'],
  ['prometni znak opasnosti', 'trokut'], ['komad pizze', 'trokut'], ['trokut za udaraljke', 'trokut'],
  ['ploča šahovnice', 'kvadrat'], ['salveta', 'kvadrat'], ['pločica u kupaonici', 'kvadrat'],
  ['vrata', 'pravokutnik'], ['školska ploča', 'pravokutnik'], ['razglednica', 'pravokutnik'], ['tepih', 'pravokutnik'],
];
function geometrijaDodatak() {
  const q = [];
  q.push(...obaSmjera(GEOM_PREDMETI, {
    pitajB: (a) => `Na koje geometrijsko tijelo oblikom podsjeća ${a}?`,
    pitajA: (b) => `Koji od ovih predmeta oblikom podsjeća na ${{ kugla: 'kuglu', kocka: 'kocku' }[b] || b}?`, tezina: 1,
  }));
  q.push(...obaSmjera(LIK_PREDMETI, {
    pitajB: (a) => `Na koji lik podsjeća obris predmeta „${a}”?`,
    pitajA: (b) => `Koji predmet ima obris u obliku ${b}a?`, tezina: 1,
  }));
  q.push(...tvrdnje(GEOM_PREDMETI, (a, b) => `Podsjeća li ${a} oblikom na ${{ kugla: 'kuglu', kocka: 'kocku' }[b] || b}?`, { tezina: 1 }));
  q.push(...spajanja(GEOM_PREDMETI, 'Spoji predmet s geometrijskim tijelom:', { koliko: 4, komada: 2, tezina: 2 }));
  q.push(...daNe([
    ['Može li se kugla kotrljati na sve strane?', true],
    ['Ima li kocka zakrivljenih ploha?', false],
    ['Može li valjak stajati uspravno na ravnoj plohi?', true],
    ['Ima li krug ravne stranice?', false],
    ['Ima li trokut tri vrha?', true],
    ['Ima li kvadrat pet stranica?', false],
    ['Može li se kocka kotrljati kao lopta?', false],
    ['Ima li pravokutnik četiri stranice?', true],
  ], 1));
  q.push(...izTablice([
    ['Koje se tijelo može kotrljati, a može i stajati uspravno?', 'valjak', ['kocka', 'kugla', 'kvadar']],
    ['Koje se tijelo kotrlja na sve strane?', 'kugla', ['kocka', 'kvadar', 'valjak']],
    ['Koje tijelo ima vrh i okruglu osnovku?', 'stožac', ['kocka', 'valjak', 'kugla']],
    ['Kojim se tijelima lako gradi toranj jer imaju ravne plohe?', 'kockama', ['kuglama', 'loptama', 'naranačama']],
    ['Koji lik nacrtamo ako spojimo tri točke koje nisu na istoj crti?', 'trokut', ['krug', 'kvadrat', 'pravokutnik']],
    ['Koji lik ima sve četiri stranice jednako duge?', 'kvadrat', ['pravokutnik', 'trokut', 'krug']],
    ['Koji lik ima dvije duže i dvije kraće stranice?', 'pravokutnik', ['kvadrat', 'trokut', 'krug']],
  ], 2));
  return q;
}

function usporediDodatak() {
  const q = [];
  ponovi(6, () => {
    const a = cijeli(0, 20), b = cijeli(0, 20);
    return izbor(`Koji znak usporedbe stavljamo između brojeva ${a} i ${b}?`, ZNAK[znakZa(a, b)], Object.values(ZNAK), 1,
      a === b ? 'Brojevi su jednaki.' : `${Math.max(a, b)} je veći od ${Math.min(a, b)}.`);
  }).forEach((x) => q.push(x));
  ponovi(5, () => {
    const a = cijeli(0, 20), b = cijeli(0, 20), z = jedan(['<', '>']);
    const tocno = z === '<' ? a < b : a > b;
    return tocnoNetocno(`Je li točno: ${a} ${z} ${b}?`, tocno, 1, `${a} je ${a < b ? 'manje od' : a > b ? 'veće od' : 'jednako'} ${b}.`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const brojevi = uzmi(Array.from({ length: 21 }, (_, i) => i), 4);
    return poredaj(`Poredaj brojeve od najmanjega do najvećega: ${brojevi.join(', ')}.`, [...brojevi].sort((x, y) => x - y).map(String), 2);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const brojevi = uzmi(Array.from({ length: 21 }, (_, i) => i), 4);
    return poredaj(`Poredaj brojeve od najvećega do najmanjega: ${brojevi.join(', ')}.`, [...brojevi].sort((x, y) => y - x).map(String), 2);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const a = cijeli(2, 18), b = cijeli(a + 2, 20);
    return upisBroja(`Koji je broj veći od ${a}, a manji od ${a + 2}?`, a + 1, 2, `Između ${a} i ${a + 2} nalazi se samo ${a + 1}.`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const a = cijeli(1, 9), b = cijeli(1, 9), c = cijeli(1, 9), d = cijeli(1, 9);
    if (a + b > 20 || c + d > 20) return null;
    return izbor(`Koji znak ide između zbrojeva ${a} + ${b} i ${c} + ${d}?`, ZNAK[znakZa(a + b, c + d)], Object.values(ZNAK), 3,
      `${a} + ${b} = ${a + b}, a ${c} + ${d} = ${c + d}.`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const ana = cijeli(1, 15), ivo = cijeli(1, 15);
    if (ana === ivo) return null;
    return izbor(`Ana ima ${ana} ${oblik(ana, ['bombon', 'bombona', 'bombona'])}, a Ivo ${ivo}. Tko ima više bombona?`, ana > ivo ? 'Ana' : 'Ivo', [ana > ivo ? 'Ivo' : 'Ana', 'imaju jednako'], 1,
      `${Math.max(ana, ivo)} je više od ${Math.min(ana, ivo)}.`);
  }).forEach((x) => q.push(x));
  ponovi(3, () => {
    const a = cijeli(3, 20);
    const ponude = uzmi(Array.from({ length: 21 }, (_, i) => i).filter((x) => x !== a), 3);
    const manji = ponude.filter((x) => x < a);
    if (manji.length !== 1) return null;
    return izbor(`Koji je od ovih brojeva manji od ${a}?`, manji[0], ponude.filter((x) => x > a), 1);
  }).forEach((x) => q.push(x));
  return q;
}

function brojeviDodatak() {
  const q = [];
  const RIJECI = ['nula', 'jedan', 'dva', 'tri', 'četiri', 'pet', 'šest', 'sedam', 'osam', 'devet', 'deset', 'jedanaest', 'dvanaest', 'trinaest', 'četrnaest', 'petnaest', 'šesnaest', 'sedamnaest', 'osamnaest', 'devetnaest', 'dvadeset'];
  ponovi(5, () => {
    const n = cijeli(0, 20);
    return izbor(`Kako riječju pišemo broj ${n}?`, RIJECI[n], blizu(n, [1, -1, 2, 10, -10]).filter((x) => x <= 20).map((x) => RIJECI[x]), 1);
  }).forEach((x) => q.push(x));
  ponovi(5, () => {
    const n = cijeli(0, 20);
    return upisBroja(`Napiši brojkom broj „${RIJECI[n]}”.`, n, 1);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const n = cijeli(1, 19);
    return n > 18 ? null : upisBroja(`Koji je broj za 2 veći od ${n}?`, n + 2, 2, `${n} + 2 = ${n + 2}`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const n = cijeli(2, 20);
    return upisBroja(`Koji je broj za 2 manji od ${n}?`, n - 2, 2, `${n} − 2 = ${n - 2}`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const n = cijeli(11, 20);
    return upisBroja(`Broj ${n} ima jednu deseticu. Koliko još jedinica ima?`, n - 10, 2, `${n} = 10 + ${n - 10}`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const n = cijeli(1, 19);
    return tocnoNetocno(`Dolazi li broj ${n + 1} odmah nakon broja ${n}?`, true, 1);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const n = cijeli(1, 18), m = n + cijeli(2, 2);
    return tocnoNetocno(`Dolazi li broj ${m} odmah nakon broja ${n}?`, false, 1, `Odmah nakon ${n} dolazi ${n + 1}.`);
  }).forEach((x) => q.push(x));
  [['Koliko prstiju ima jedna ruka?', 5], ['Koliko prstiju imaju dvije ruke zajedno?', 10], ['Koliko dana ima tjedan?', 7], ['Koliko nogu ima pas?', 4],
    ['Koliko nogu ima ptica?', 2], ['Koliko nogu ima pauk?', 8], ['Koliko stranica ima trokut?', 3], ['Koliko kotača ima bicikl?', 2], ['Koliko kotača ima tricikl?', 3],
  ].forEach(([p, n]) => q.push(upisBroja(p, n, 1)));
  ponovi(3, () => {
    const n = cijeli(2, 9);
    return izbor(`Koji je broj paran: ${promijesaj([2 * n, 2 * n + 1, 2 * n - 1]).join(', ')}?`, 2 * n, [2 * n + 1, 2 * n - 1], 3,
      'Paran broj možemo podijeliti u dva jednaka dijela.');
  }).forEach((x) => q.push(x));
  return q;
}

// ═══ 2. razred ═══

function brojevi100Dodatak() {
  const q = [];
  const JED = ['', 'jedan', 'dva', 'tri', 'četiri', 'pet', 'šest', 'sedam', 'osam', 'devet'];
  const DES = ['', 'deset', 'dvadeset', 'trideset', 'četrdeset', 'pedeset', 'šezdeset', 'sedamdeset', 'osamdeset', 'devedeset'];
  const rijecima = (n) => (n === 100 ? 'sto' : n < 10 ? JED[n] : n < 20 ? ['deset', 'jedanaest', 'dvanaest', 'trinaest', 'četrnaest', 'petnaest', 'šesnaest', 'sedamnaest', 'osamnaest', 'devetnaest'][n - 10] : DES[Math.floor(n / 10)] + (n % 10 ? ' ' + JED[n % 10] : ''));
  ponovi(5, () => {
    const n = cijeli(21, 99);
    return izbor(`Kako riječima pišemo broj ${n}?`, rijecima(n), [rijecima((n % 10) * 10 + Math.floor(n / 10)) , rijecima(Math.min(99, n + 10)), rijecima(n - 1)].filter((x) => x !== rijecima(n)), 2);
  }).forEach((x) => q.push(x));
  ponovi(5, () => {
    const n = cijeli(21, 99);
    return upisBroja(`Napiši brojkom: ${rijecima(n)}.`, n, 2);
  }).forEach((x) => q.push(x));
  ponovi(5, () => {
    const d = cijeli(1, 9), j = cijeli(0, 9);
    return upisBroja(`Koji broj ima ${d} ${oblik(d, ['deseticu', 'desetice', 'desetica'])} i ${j} ${oblik(j, ['jedinicu', 'jedinice', 'jedinica'])}?`, d * 10 + j, 2, `${d} × 10 + ${j} = ${d * 10 + j}`);
  }).forEach((x) => q.push(x));
  ponovi(5, () => {
    const pocetak = cijeli(1, 60), korak = jedan([2, 5, 10]);
    const niz = [0, 1, 2, 3].map((i) => pocetak + i * korak);
    return upisBroja(`Koji broj nastavlja niz: ${niz.join(', ')}, ___?`, pocetak + 4 * korak, 2, `Svaki je sljedeći broj veći za ${korak}.`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const pocetak = cijeli(40, 100), korak = jedan([2, 5, 10]);
    const niz = [0, 1, 2].map((i) => pocetak - i * korak);
    return upisBroja(`Brojimo unatrag: ${niz.join(', ')}, ___. Koji broj slijedi?`, pocetak - 3 * korak, 2, `Svaki je sljedeći broj manji za ${korak}.`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const n = cijeli(11, 99);
    const d = Math.round(n / 10) * 10;
    return n % 10 === 5 ? null : izbor(`Kojem je desetičnom broju najbliži broj ${n}?`, d, blizu(d, [10, -10, 20]).filter((x) => x <= 100), 3, `${n} je bliže ${d} nego susjednoj desetici.`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const ponude = uzmi(Array.from({ length: 90 }, (_, i) => i + 10), 4);
    return poredaj(`Poredaj brojeve od najmanjega do najvećega: ${ponude.join(', ')}.`, [...ponude].sort((x, y) => x - y).map(String), 2);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const a = cijeli(10, 98);
    return upisBroja(`Koji se broj nalazi između ${a} i ${a + 2}?`, a + 1, 1);
  }).forEach((x) => q.push(x));
  ponovi(3, () => {
    const a = cijeli(10, 99), b = (a % 10) * 10 + Math.floor(a / 10);
    if (a === b || b < 10) return null;
    return izbor(`Koji je broj veći: ${a} ili ${b}?`, Math.max(a, b), [Math.min(a, b)], 2, 'Najprije usporedimo desetice.');
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const n = cijeli(10, 99), paran = n % 2 === 0;
    return tocnoNetocno(`Je li broj ${n} paran?`, paran, 2, `Znamenka jedinica je ${n % 10}, pa je broj ${paran ? 'paran' : 'neparan'}.`);
  }).forEach((x) => q.push(x));
  return q;
}

const TIJELA_2 = [['kocka', 6, 12, 8], ['kvadar', 6, 12, 8]];
function geometrija2Dodatak() {
  const q = [...geometrijaDodatak().filter((x) => x.type !== 'true-false')];
  q.push(...izTablice([
    ['Koliko ravnih ploha ima kocka?', '6', ['4', '8', '12']],
    ['Kakve su plohe kvadra?', 'pravokutnici', ['krugovi', 'trokuti', 'zakrivljene']],
    ['Koje tijelo nema ni jedan vrh ni brid?', 'kugla', ['kocka', 'kvadar', 'piramida']],
    ['Koje tijelo ima dvije jednake okrugle osnovke?', 'valjak', ['stožac', 'kocka', 'kvadar']],
    ['Kako zovemo crtu koja nema početak ni kraj?', 'pravac', ['dužina', 'krug', 'točka']],
    ['Kojim slovima obično označavamo točke?', 'velikim tiskanim slovima', ['malim pisanim slovima', 'brojkama', 'znakovima']],
    ['Čime crtamo ravnu crtu?', 'ravnalom', ['šestarom', 'gumicom', 'kistom']],
    ['Kako zovemo dio pravca između dviju točaka?', 'dužina', ['krug', 'kut', 'ploha']],
  ], 2));
  ponovi(6, () => {
    const a = cijeli(2, 12);
    return upisBroja(`Dužina AB duga je ${a} cm. Dužina CD dvostruko je dulja. Koliko je centimetara duga dužina CD?`, 2 * a, 3, `${a} + ${a} = ${2 * a}`);
  }).forEach((x) => q.push(x));
  ponovi(6, () => {
    const a = cijeli(3, 15), b = cijeli(2, 12);
    return izbor(`Dužina AB duga je ${a} cm, a dužina CD ${b} cm. Koja je dužina dulja?`, a > b ? 'AB' : a < b ? 'CD' : 'jednako su duge', ['AB', 'CD', 'jednako su duge'], 2);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const a = cijeli(5, 20), b = cijeli(1, a - 1);
    return upisBroja(`Dužina je duga ${a} cm. Odrežemo ${b} cm. Koliko je centimetara ostalo?`, a - b, 2, `${a} − ${b} = ${a - b}`);
  }).forEach((x) => q.push(x));
  q.push(...daNe([
    ['Ima li kocka 8 vrhova?', true], ['Ima li kvadar 12 bridova?', true], ['Ima li kugla bridove?', false],
    ['Je li dužina dio pravca?', true], ['Ima li trokut četiri vrha?', false], ['Ima li valjak dvije osnovke?', true],
  ], 2));
  return q;
}

function mjerenjeNovacDodatak() {
  const q = [];
  const APOENI = [1, 2, 5, 10, 20, 50];
  ponovi(6, () => {
    const [a, b, c] = [jedan(APOENI), jedan(APOENI), jedan([1, 2, 5, 10])];
    const z = a + b + c;
    return z > 100 ? null : upisBroja(`U novčaniku su ${a} €, ${b} € i ${c} €. Koliko je to eura ukupno?`, z, 2, `${a} + ${b} + ${c} = ${z}`);
  }).forEach((x) => q.push(x));
  const STVARI = ['bilježnica', 'lopta', 'knjiga', 'slikovnica', 'boje', 'kapa', 'puzzle', 'autić', 'lutka', 'ruksak'];
  ponovi(6, () => {
    const cijena = cijeli(3, 45), imam = cijeli(3, 60);
    return tocnoNetocno(`Igračka stoji ${cijena} €, a ti imaš ${imam} €. Imaš li dovoljno novca za nju?`, imam >= cijena, 2,
      imam >= cijena ? `${imam} € je dovoljno za ${cijena} €.` : `Nedostaje ${cijena - imam} €.`);
  }).forEach((x) => q.push(x));
  ponovi(5, () => {
    const s1 = jedan(STVARI), s2 = jedan(STVARI.filter((x) => x !== s1)), a = cijeli(2, 30), b = cijeli(2, 30);
    return upisBroja(`Kupuješ: ${s1} za ${a} € i ${s2} za ${b} €. Koliko eura platiš ukupno?`, a + b, 2, `${a} + ${b} = ${a + b}`);
  }).forEach((x) => q.push(x));
  ponovi(5, () => {
    const imam = cijeli(20, 80), nedostaje = cijeli(2, 20);
    return upisBroja(`Ana ima ${imam} €. Lopta stoji ${imam + nedostaje} €. Koliko joj eura nedostaje?`, nedostaje, 3, `${imam + nedostaje} − ${imam} = ${nedostaje}`);
  }).forEach((x) => q.push(x));
  ponovi(5, () => {
    const h = cijeli(1, 12), sljedeci = h === 12 ? 1 : h + 1;
    return upisBroja(`Sat pokazuje ${h} ${oblik(h, ['sat', 'sata', 'sati'])}. Koliko će sati pokazivati za jedan sat?`, sljedeci, 2);
  }).forEach((x) => q.push(x));
  ponovi(5, () => {
    const h = cijeli(1, 10), traje = cijeli(1, 2);
    return upisBroja(`Utakmica počinje u ${h} ${oblik(h, ['sat', 'sata', 'sati'])} i traje ${traje} ${oblik(traje, ['sat', 'sata', 'sati'])}. U koliko sati završava?`, h + traje, 2, `${h} + ${traje} = ${h + traje}`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const m = cijeli(2, 9);
    return upisBroja(`Koliko je centimetara ${m} m?`, m * 100, 3, `1 m = 100 cm, pa je ${m} m = ${m * 100} cm.`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const d = cijeli(2, 4);
    return upisBroja(`Koliko je dana u ${d} tjedna?`, d * 7, 3, `Tjedan ima 7 dana: ${d} × 7 = ${d * 7}.`);
  }).forEach((x) => q.push(x));
  q.push(...obaSmjera([
    ['duljinu školske ploče', 'metar'], ['duljinu olovke', 'centimetar'], ['trajanje školskog sata', 'minuta'], ['trajanje noćnog sna', 'sat'],
    ['duljinu hodnika', 'metar'], ['širinu bilježnice', 'centimetar'], ['trajanje jednog odmora', 'minuta'], ['trajanje školskih praznika', 'dan'],
  ], { pitajB: (a) => `Kojom je jedinicom najprikladnije izraziti ${a}?`, tezina: 2 }));
  q.push(...izTablice([
    ['Koja je novčanica najveće vrijednosti među ponuđenima?', '50 €', ['5 €', '10 €', '20 €']],
    ['Koja je kovanica najmanje vrijednosti među ponuđenima?', '1 cent', ['10 centi', '50 centi', '1 euro']],
    ['Koliko centi ima jedan euro?', '100', ['10', '50', '1000']],
    ['Koliko kovanica od 2 € treba za 10 €?', '5', ['2', '4', '10']],
    ['Koliko novčanica od 5 € vrijedi kao jedna od 20 €?', '4', ['2', '5', '10']],
    ['Koliko minuta ima pola sata?', '30', ['15', '50', '60']],
    ['Koliko sati ima jedan dan?', '24', ['12', '60', '7']],
  ], 2));
  return q;
}

// ═══ 3. razred ═══

function brojevi1000Dodatak() {
  const q = [];
  ponovi(6, () => {
    const n = cijeli(1000, 9999), mjesto = jedan([['tisućica', 1000], ['stotica', 100], ['desetica', 10], ['jedinica', 1]]);
    return upisBroja(`Koja je znamenka ${mjesto[0]} u broju ${n}?`, Math.floor(n / mjesto[1]) % 10, 2);
  }).forEach((x) => q.push(x));
  ponovi(5, () => {
    const t = cijeli(1, 9), s = cijeli(0, 9), d = cijeli(0, 9), j = cijeli(0, 9);
    return upisBroja(`Koji broj ima ${t} T, ${s} S, ${d} D i ${j} J?`, t * 1000 + s * 100 + d * 10 + j, 2, `${t * 1000} + ${s * 100} + ${d * 10} + ${j}`);
  }).forEach((x) => q.push(x));
  ponovi(5, () => {
    const n = cijeli(1001, 9998);
    return jedan([
      upisBroja(`Koji je sljedbenik broja ${n}?`, n + 1, 1, `${n} + 1 = ${n + 1}`),
      upisBroja(`Koji je prethodnik broja ${n}?`, n - 1, 1, `${n} − 1 = ${n - 1}`),
    ]);
  }).forEach((x) => q.push(x));
  ponovi(5, () => {
    const n = cijeli(1010, 9989), d = Math.round(n / 10) * 10;
    return n % 10 === 5 ? null : upisBroja(`Koji broj dobiješ kad ${n} zaokružiš na desetice?`, d, 3, `Znamenka jedinica je ${n % 10}, pa ${n % 10 < 5 ? 'zaokružujemo na manju' : 'zaokružujemo na veću'} deseticu.`);
  }).forEach((x) => q.push(x));
  ponovi(5, () => {
    const n = cijeli(1100, 9899), s = Math.round(n / 100) * 100;
    return Math.floor(n / 10) % 10 === 5 ? null : upisBroja(`Koji broj dobiješ kad ${n} zaokružiš na stotice?`, s, 3, `Znamenka desetica je ${Math.floor(n / 10) % 10}.`);
  }).forEach((x) => q.push(x));
  ponovi(5, () => {
    const a = cijeli(1000, 9999), b = a + jedan([-1, 1]) * jedan([1, 10, 100, 1000]);
    if (b > 9999 || b < 1000) return null;
    return izbor(`Koji znak ide između brojeva ${a} i ${b}?`, ZNAK[znakZa(a, b)], Object.values(ZNAK), 2, 'Uspoređujemo znamenke s lijeva nadesno.');
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const ponude = uzmi(Array.from({ length: 50 }, () => cijeli(1000, 9999)), 4);
    return new Set(ponude).size < 4 ? null : poredaj(`Poredaj od najmanjega do najvećega: ${ponude.join(', ')}.`, [...ponude].sort((x, y) => x - y).map(String), 3);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const n = cijeli(1, 9) * 1000 + cijeli(0, 9) * 100;
    return upisBroja(`Koliko stotica ima broj ${n}?`, n / 100, 3, `${n} = ${n / 100} × 100`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const pocetak = cijeli(10, 90) * 100, korak = jedan([100, 500, 1000]);
    const niz = [0, 1, 2].map((i) => pocetak + i * korak);
    return niz[2] + korak > 9999 ? null : upisBroja(`Koji broj nastavlja niz: ${niz.join(', ')}, ___?`, niz[2] + korak, 2, `Korak je ${korak}.`);
  }).forEach((x) => q.push(x));
  ponovi(3, () => {
    const n = cijeli(1000, 9999);
    return tocnoNetocno(`Je li broj ${n} veći od ${Math.floor(n / 1000) * 1000 + 500}?`, n > Math.floor(n / 1000) * 1000 + 500, 2);
  }).forEach((x) => q.push(x));
  return q;
}

function geometrijaMjerenje3Dodatak() {
  const q = [];
  const PRETVORBE = [['m', 'cm', 100], ['m', 'dm', 10], ['dm', 'cm', 10], ['cm', 'mm', 10], ['km', 'm', 1000], ['kg', 'g', 1000], ['L', 'dL', 10], ['h', 'min', 60]];
  ponovi(10, () => {
    const [vece, manje, f] = jedan(PRETVORBE), n = cijeli(2, 9);
    return upisBroja(`Dopuni: ${n} ${vece} = ___ ${manje}.`, n * f, 2, `1 ${vece} = ${f} ${manje}, pa je ${n} ${vece} = ${n * f} ${manje}.`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const [vece, manje, f] = jedan(PRETVORBE.filter((p) => p[2] <= 100)), n = cijeli(2, 9);
    return upisBroja(`Dopuni: ${n * f} ${manje} = ___ ${vece}.`, n, 3, `${n * f} : ${f} = ${n}`);
  }).forEach((x) => q.push(x));
  ponovi(5, () => {
    const a = cijeli(2, 9), b = cijeli(2, 9), c = cijeli(Math.abs(a - b) + 1, a + b - 1);
    return upisBroja(`Trokut ima stranice ${a} cm, ${b} cm i ${c} cm. Koliki je njegov opseg u centimetrima?`, a + b + c, 2, `${a} + ${b} + ${c} = ${a + b + c}`);
  }).forEach((x) => q.push(x));
  ponovi(5, () => {
    const a = cijeli(2, 12);
    return upisBroja(`Opseg kvadrata je ${4 * a} cm. Kolika je duljina jedne stranice u centimetrima?`, a, 3, `${4 * a} : 4 = ${a}`);
  }).forEach((x) => q.push(x));
  ponovi(5, () => {
    const a = cijeli(3, 15), b = cijeli(2, 10);
    return upisBroja(`Pravokutni vrt ima stranice ${a} m i ${b} m. Koliko je metara ograde potrebno oko cijelog vrta?`, 2 * (a + b), 3, `${a} + ${b} + ${a} + ${b} = ${2 * (a + b)}`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const g = cijeli(1, 9) * 100;
    return upisBroja(`Vrećica brašna ima ${g} g. Koliko grama nedostaje do 1 kg?`, 1000 - g, 3, `1 kg = 1000 g; 1000 − ${g} = ${1000 - g}`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const a = cijeli(2, 8) * 10, b = cijeli(1, 9) * 10;
    return izbor(`Što je dulje: ${a} cm ili ${b / 10} dm?`, a > b ? `${a} cm` : a < b ? `${b / 10} dm` : 'jednako su duga', [`${a} cm`, `${b / 10} dm`, 'jednako su duga'], 3, `${b / 10} dm = ${b} cm`);
  }).forEach((x) => q.push(x));
  q.push(...obaSmjera([
    ['duljinu učionice', 'metar'], ['udaljenost između dvaju gradova', 'kilometar'], ['debljinu novčića', 'milimetar'], ['masu jabuke', 'gram'],
    ['masu vreće krumpira', 'kilogram'], ['količinu vode u kadi', 'litra'], ['trajanje školskog sata', 'minuta'], ['duljinu olovke', 'centimetar'],
  ], { pitajB: (a) => `Kojom je jedinicom najprikladnije izraziti ${a}?`, tezina: 2 }));
  q.push(...izTablice([
    ['Kako zovemo pravce koji se nikad ne sijeku?', 'usporedni pravci', ['okomiti pravci', 'dužine', 'polupravci']],
    ['Kako zovemo zbroj duljina svih stranica lika?', 'opseg', ['površina', 'dužina', 'brid']],
    ['Koliko polupravaca dobijemo kad točkom podijelimo pravac?', '2', ['1', '3', '4']],
    ['Koliko krajnjih točaka ima dužina?', '2', ['1', '0', '3']],
    ['Kojim priborom najlakše crtamo okomite pravce?', 'geometrijskim trokutom', ['šestarom', 'kistom', 'gumicom']],
  ], 2));
  return q;
}

// ═══ 4. razred ═══

function brojeviMilijunDodatak() {
  const q = [];
  const MJESTA = [['jedinica', 1], ['desetica', 10], ['stotica', 100], ['tisućica', 1000], ['desetica tisuća', 10000], ['stotica tisuća', 100000]];
  ponovi(8, () => {
    const n = cijeli(10000, 999999), [ime, v] = jedan(MJESTA.filter((m) => m[1] <= n));
    return upisBroja(`Koja je znamenka na mjestu ${ime} u broju ${fmt(n)}?`, Math.floor(n / v) % 10, 2);
  }).forEach((x) => q.push(x));
  ponovi(5, () => {
    const n = cijeli(10000, 999998);
    return jedan([
      upisBroja(`Koji je sljedbenik broja ${fmt(n)}?`, n + 1, 1, `${fmt(n)} + 1 = ${fmt(n + 1)}`),
      upisBroja(`Koji je prethodnik broja ${fmt(n)}?`, n - 1, 1, `${fmt(n)} − 1 = ${fmt(n - 1)}`),
    ]);
  }).forEach((x) => q.push(x));
  ponovi(6, () => {
    const n = cijeli(10000, 989999), t = Math.round(n / 10000) * 10000;
    return Math.floor(n / 1000) % 10 === 5 ? null : upisBroja(`Koji broj dobiješ kad ${fmt(n)} zaokružiš na desetice tisuća?`, t, 3, `Gledamo znamenku tisućica: ${Math.floor(n / 1000) % 10}.`);
  }).forEach((x) => q.push(x));
  ponovi(5, () => {
    const n = cijeli(10000, 999999), t = Math.round(n / 1000) * 1000;
    return Math.floor(n / 100) % 10 === 5 ? null : upisBroja(`Koji broj dobiješ kad ${fmt(n)} zaokružiš na tisućice?`, t, 3, `Gledamo znamenku stotica: ${Math.floor(n / 100) % 10}.`);
  }).forEach((x) => q.push(x));
  ponovi(5, () => {
    const a = cijeli(10000, 999999), b = a + jedan([-1, 1]) * jedan([10, 1000, 10000, 100000]);
    if (b < 10000 || b > 999999) return null;
    return izbor(`Koji znak ide između brojeva ${fmt(a)} i ${fmt(b)}?`, ZNAK[znakZa(a, b)], Object.values(ZNAK), 2, 'Uspoređujemo znamenke istih mjesta s lijeva nadesno.');
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const ponude = Array.from({ length: 4 }, () => cijeli(10000, 999999));
    return new Set(ponude).size < 4 ? null : poredaj(`Poredaj od najmanjega do najvećega: ${ponude.map(fmt).join('; ')}.`, [...ponude].sort((x, y) => x - y).map(fmt), 3);
  }).forEach((x) => q.push(x));
  ponovi(5, () => {
    const st = cijeli(1, 9), dt = cijeli(0, 9), t = cijeli(0, 9), s = cijeli(0, 9);
    const n = st * 100000 + dt * 10000 + t * 1000 + s * 100;
    return upisBroja(`Koji broj ima ${st} stotica tisuća, ${dt} desetica tisuća, ${t} tisućica i ${s} stotica?`, n, 3);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const t = cijeli(11, 999);
    return upisBroja(`Koliko tisućica ima broj ${fmt(t * 1000)}?`, t, 3, `${fmt(t * 1000)} = ${t} × 1000`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const korak = jedan([1000, 10000, 100000]), pocetak = cijeli(1, 5) * korak + cijeli(0, 9) * (korak / 10);
    const niz = [0, 1, 2].map((i) => pocetak + i * korak);
    return niz[2] + korak > 1000000 ? null : upisBroja(`Koji broj nastavlja niz: ${niz.map(fmt).join('; ')}; ___?`, niz[2] + korak, 3, `Korak je ${fmt(korak)}.`);
  }).forEach((x) => q.push(x));
  ponovi(3, () => {
    const n = cijeli(100, 999) * 1000;
    return izbor(`Kako čitamo broj ${fmt(n)}?`, `${n / 1000} tisuća`, [`${n / 100} tisuća`, `${n / 1000} milijuna`, `${n / 1000} stotina`], 2);
  }).forEach((x) => q.push(x));
  return q;
}

function opsegPovrsinaDodatak() {
  const q = [];
  ponovi(6, () => {
    const a = cijeli(2, 20), b = cijeli(2, 15);
    if (a === b) return null;
    const j = jedan(['cm', 'dm', 'm']);
    return upisBroja(`Pravokutnik ima duljinu ${a} ${j} i širinu ${b} ${j}. Koliki je njegov opseg u ${{ cm: 'centimetrima', dm: 'decimetrima', m: 'metrima' }[j]}?`, 2 * (a + b), 2, `2 × ${a} + 2 × ${b} = ${2 * (a + b)}`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const a = cijeli(2, 25);
    return upisBroja(`Kvadrat ima stranicu ${a} cm. Koliki je njegov opseg u centimetrima?`, 4 * a, 2, `4 × ${a} = ${4 * a}`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const a = cijeli(2, 20);
    return upisBroja(`Opseg kvadrata je ${4 * a} m. Kolika je duljina njegove stranice u metrima?`, a, 3, `${4 * a} : 4 = ${a}`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const a = cijeli(3, 15), b = cijeli(2, a - 1);
    return upisBroja(`Opseg pravokutnika je ${2 * (a + b)} cm, a duljina mu je ${a} cm. Kolika mu je širina u centimetrima?`, b, 3, `${2 * (a + b)} : 2 = ${a + b}; ${a + b} − ${a} = ${b}`);
  }).forEach((x) => q.push(x));
  ponovi(6, () => {
    const r = cijeli(2, 9), s = cijeli(2, 9);
    return upisBroja(`Pod je popločan pločicama u ${r} ${oblik(r, ['red', 'reda', 'redova'])}, po ${s} ${oblik(s, ['pločica', 'pločice', 'pločica'])} u svakom redu. Koliko je pločica ukupno?`, r * s, 2, `${r} × ${s} = ${r * s}`);
  }).forEach((x) => q.push(x));
  ponovi(5, () => {
    const a = cijeli(2, 10), b = cijeli(2, 10);
    return upisBroja(`Pravokutnik je na kvadratnoj mreži dug ${a} kvadratića i širok ${b}. Kolika je njegova površina u kvadratićima?`, a * b, 2, `${a} × ${b} = ${a * b}`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const a = cijeli(2, 10);
    return upisBroja(`Kvadrat ima stranicu ${a} cm. Kolika je njegova površina u kvadratnim centimetrima?`, a * a, 3, `${a} × ${a} = ${a * a}`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const a = cijeli(2, 9), b = cijeli(2, 9), c = cijeli(2, 9), d = cijeli(2, 9);
    if (a * b === c * d) return null;
    return izbor(`Lik A je pravokutnik ${a} × ${b} kvadratića, a lik B ${c} × ${d} kvadratića. Koji ima veću površinu?`, a * b > c * d ? 'lik A' : 'lik B', [a * b > c * d ? 'lik B' : 'lik A', 'jednake su'], 3, `${a} × ${b} = ${a * b}; ${c} × ${d} = ${c * d}`);
  }).forEach((x) => q.push(x));
  q.push(...obaSmjera([
    ['površinu poštanske marke', 'cm²'], ['površinu stranice knjige', 'dm²'], ['površinu poda u sobi', 'm²'], ['površinu Hrvatske', 'km²'],
  ], { pitajB: (a) => `Kojom je jedinicom najprikladnije izraziti ${a}?`, tezina: 3 }));
  q.push(...daNe([
    ['Je li opseg zbroj duljina svih stranica lika?', true], ['Mjeri li se površina u metrima (m)?', false],
    ['Je li 1 m² površina kvadrata sa stranicom 1 m?', true], ['Mogu li dva lika različitog oblika imati jednaku površinu?', true],
    ['Ima li kvadrat stranice 3 cm opseg 9 cm?', false], ['Je li opseg pravokutnika 5 cm × 2 cm jednak 14 cm?', true],
  ], 2));
  return q;
}

function kvaderKockaDodatak() {
  const q = [];
  q.push(...izTablice([
    ['Kakvog su oblika plohe kvadra?', 'pravokutnici', ['krugovi', 'trokuti', 'peterokuti']],
    ['Koliko bridova izlazi iz svakog vrha kocke?', '3', ['2', '4', '6']],
    ['Koliko ploha kocke vidiš kad je gledaš ravno sprijeda?', '1', ['2', '3', '6']],
    ['Koliko se ploha kocke sastaje u jednom vrhu?', '3', ['2', '4', '6']],
    ['Što je zajedničko kocki i kvadru?', 'oba imaju 6 ploha, 12 bridova i 8 vrhova', ['oba imaju samo kvadratne plohe', 'oba se kotrljaju', 'nijedno nema vrhova']],
    ['Po čemu se kocka razlikuje od kvadra?', 'svi su bridovi kocke jednako dugi', ['kocka ima više vrhova', 'kocka nema bridova', 'kvadar ima 8 ploha']],
    ['Kako zovemo crtež koji izrežemo i presavijemo u kocku?', 'mreža kocke', ['opseg kocke', 'brid kocke', 'tlocrt sobe']],
    ['Od koliko se kvadrata sastoji mreža kocke?', '6', ['4', '8', '12']],
    ['Kako zovemo dužinu u kojoj se sastaju dvije plohe tijela?', 'brid', ['vrh', 'ploha', 'mreža']],
    ['Kako zovemo točku u kojoj se sastaju bridovi tijela?', 'vrh', ['ploha', 'brid', 'središte']],
    ['Koliko najviše ploha kocke možeš vidjeti odjednom?', '3', ['2', '4', '6']],
    ['Koliko pari nasuprotnih ploha ima kvadar?', '3', ['2', '4', '6']],
  ], 2));
  const PREDMETI = [['kutija za cipele', 'kvadar'], ['kocka šećera', 'kocka'], ['opeka', 'kvadar'], ['kocka za igru', 'kocka'], ['ormar', 'kvadar'], ['tetrapak soka', 'kvadar'], ['Rubikova kocka', 'kocka'], ['akvarij', 'kvadar'], ['kutija šibica', 'kvadar'], ['knjiga', 'kvadar']];
  q.push(...uObitelj(obiteljTablice(PREDMETI), PREDMETI.map(([p, t]) => izbor(`Je li ${p} oblika kocke ili kvadra?`, t, [t === 'kocka' ? 'kvadar' : 'kocka'], 1))));
  ponovi(6, () => {
    const a = cijeli(2, 15);
    return upisBroja(`Brid kocke dug je ${a} cm. Koliki je zbroj duljina svih njezinih bridova u centimetrima?`, 12 * a, 3, `Kocka ima 12 jednakih bridova: 12 × ${a} = ${12 * a}`);
  }).forEach((x) => q.push(x));
  ponovi(6, () => {
    const a = cijeli(2, 9), b = cijeli(2, 9), c = cijeli(2, 9);
    if (new Set([a, b, c]).size < 3) return null;
    return upisBroja(`Kvadar ima bridove duljina ${a} cm, ${b} cm i ${c} cm. Koliki je zbroj duljina svih bridova u centimetrima?`, 4 * (a + b + c), 3, `Svaka duljina javlja se 4 puta: 4 × (${a} + ${b} + ${c}) = ${4 * (a + b + c)}`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const a = cijeli(2, 12);
    return upisBroja(`Zbroj duljina svih bridova kocke je ${12 * a} cm. Koliko je dug jedan brid u centimetrima?`, a, 3, `${12 * a} : 12 = ${a}`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const a = cijeli(2, 9);
    return upisBroja(`Brid kocke dug je ${a} cm. Koliki je opseg jedne njezine plohe u centimetrima?`, 4 * a, 3, `Ploha je kvadrat: 4 × ${a} = ${4 * a}`);
  }).forEach((x) => q.push(x));
  ponovi(3, () => {
    const n = cijeli(2, 6);
    return upisBroja(`Koliko vrhova ${oblik(n, ['ima', 'imaju', 'ima'])} ${n} ${oblik(n, ['kocka', 'kocke', 'kocaka'])} zajedno?`, 8 * n, 2, `Svaka kocka ima 8 vrhova: ${n} × 8 = ${8 * n}`);
  }).forEach((x) => q.push(x));
  ponovi(3, () => {
    const n = cijeli(2, 6);
    return upisBroja(`Koliko ploha ${oblik(n, ['ima', 'imaju', 'ima'])} ${n} ${oblik(n, ['kvadar', 'kvadra', 'kvadara'])} zajedno?`, 6 * n, 2, `Svaki kvadar ima 6 ploha: ${n} × 6 = ${6 * n}`);
  }).forEach((x) => q.push(x));
  q.push(...daNe([
    ['Jesu li sve plohe kocke jednaki kvadrati?', true], ['Ima li kvadar 8 ploha?', false], ['Ima li kocka 12 bridova?', true],
    ['Može li se kocka kotrljati kao kugla?', false], ['Ima li kvadar zakrivljene plohe?', false],
    ['Jesu li nasuprotne plohe kvadra jednake?', true], ['Ima li kocka 6 vrhova?', false],
  ], 2));
  return q;
}

function pisanoMnozDijelDodatak() {
  const q = [];
  ponovi(6, () => {
    const a = cijeli(102, 999), b = cijeli(2, 9);
    return upisBroja(`Pisano pomnoži troznamenkasti broj jednoznamenkastim: ${a} × ${b}. Koliki je umnožak?`, a * b, 3);
  }).forEach((x) => q.push(x));
  ponovi(6, () => {
    const b = cijeli(2, 9), k = cijeli(21, 199);
    return upisBroja(`Pisano podijeli: ${b * k} : ${b}. Koliki je količnik?`, k, 3);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const b = cijeli(3, 9), k = cijeli(12, 99), o = cijeli(1, b - 1);
    return upisBroja(`Koliki je ostatak pri dijeljenju ${b * k + o} : ${b}?`, o, 3, `${b} × ${k} = ${b * k}; ${b * k + o} − ${b * k} = ${o}`);
  }).forEach((x) => q.push(x));
  const PRICE = [
    (a, b) => [`Autobus ima ${a} ${oblik(a, ['sjedalo', 'sjedala', 'sjedala'])}. Koliko sjedala ${oblik(b, ['ima', 'imaju', 'ima'])} ${b} ${oblik(b, ['takav autobus', 'takva autobusa', 'takvih autobusa'])}?`, a * b],
    (a, b) => [`Knjiga ima ${a} ${oblik(a, ['stranicu', 'stranice', 'stranica'])}. Koliko stranica ${oblik(b, ['ima', 'imaju', 'ima'])} ${b} ${oblik(b, ['takva knjiga', 'takve knjige', 'takvih knjiga'])}?`, a * b],
    (a, b) => [`Kino dvorana ima ${a} ${oblik(a, ['mjesto', 'mjesta', 'mjesta'])}. Koliko mjesta ${oblik(b, ['ima', 'imaju', 'ima'])} ${b} ${oblik(b, ['takva dvorana', 'takve dvorane', 'takvih dvorana'])}?`, a * b],
  ];
  ponovi(6, () => {
    const a = cijeli(23, 98), b = cijeli(3, 9);
    const [t, r] = jedan(PRICE)(a, b);
    return upisBroja(t, r, 3, `${a} × ${b} = ${r}`);
  }).forEach((x) => q.push(x));
  ponovi(5, () => {
    const b = cijeli(3, 9), k = cijeli(12, 95);
    const n = b * k;
    return upisBroja(jedan([
      `Učiteljica dijeli ${n} učenika u ${b} ${oblik(b, ['skupinu', 'jednake skupine', 'jednakih skupina'])}. Koliko će učenika biti u svakoj skupini?`,
      `Treba rasporediti ${n} ${oblik(n, ['jabuku', 'jabuke', 'jabuka'])} jednako u ${b} ${oblik(b, ['košaru', 'košare', 'košara'])}. Koliko će jabuka biti u svakoj košari?`,
      `Biciklisti su put od ${n} km podijelili na ${b} ${oblik(b, ['dio', 'jednaka dijela', 'jednakih dijelova'])}. Koliko je kilometara dug jedan dio?`,
    ]), k, 3, `${n} : ${b} = ${k}`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const a = cijeli(12, 99), b = cijeli(12, 99);
    const granica = Math.round(a * b / 100) * 100 + jedan([-100, 100]);
    return tocnoNetocno(`Je li umnožak ${a} × ${b} veći od ${fmt(granica)}?`, a * b > granica, 3, `${a} × ${b} = ${fmt(a * b)}`);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const a = cijeli(11, 99), b = cijeli(11, 99), r = a * b;
    const kriv = r + jedan([10, -10, 100, -100]);
    return izbor(`Koji je umnožak ${a} × ${b}?`, fmt(r), [fmt(kriv), fmt(r + 1), fmt(a + b)], 3);
  }).forEach((x) => q.push(x));
  return q;
}

module.exports = {
  genNizovi: nizoviDodatak, genGeometrija: geometrijaDodatak, genUsporedbe: usporediDodatak, genBrojevi: brojeviDodatak,
  genBrojevi100: brojevi100Dodatak, genGeometrija2: geometrija2Dodatak, genMjerenjeNovac: mjerenjeNovacDodatak,
  genBrojevi1000: brojevi1000Dodatak, genGeometrijaMjerenje3: geometrijaMjerenje3Dodatak,
  genBrojeviMilijun: brojeviMilijunDodatak, genOpsegPovrsina: opsegPovrsinaDodatak, genKvaderKocka: kvaderKockaDodatak,
  genPisanoMnozDijel: pisanoMnozDijelDodatak,
};
