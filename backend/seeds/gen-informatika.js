/**
 * Informatika — 1.–4. razred (kurikul NN 22/2018; izborni predmet 70 sati
 * godišnje, a gradivo se preklapa s predmetom Informacijske i digitalne
 * kompetencije u eksperimentalnoj cjelodnevnoj školi).
 *
 * Dvije teme po razredu:
 *   algoritmi-N        domena B — računalno razmišljanje i programiranje
 *   digitalni-svijet-N domene A, C i D — uređaji, programi, zdravlje, sigurnost
 *
 * Računalno razmišljanje uči se dobro i bez računala („unplugged”): niz
 * koraka, pronalaženje greške, uzorci, put robota po mreži, ponavljanje i
 * odluka. Zadatci s mrežom, uzorcima, šiframa i programima su parametrizirani
 * pa svaki poziv daje nove primjere. Ishodi:
 *   1. r. A.1.1, A.1.2, B.1.1 (logički zadatak), B.1.2 (slijed koraka), C.1.1, D.1.1, D.1.2
 *   2. r. A.2.1 (uloga programa), B.2.1 (niz uputa, ispravlja pogrešan redoslijed), D.2.1
 *   3. r. A.3.1 (simboli za podatke), B.3.1 (slijed, ponavljanje, odluka), B.3.2 (sortiranje)
 *   4. r. A.4.1 (mreže), A.4.2 (čovjek i stroj), B.4.1 (program s ulaznim vrijednostima),
 *         B.4.2 (složeniji logički zadatci), D.4.1 (zdravlje i sigurnost), D.4.2 (poslovi)
 */
const HR = require('./hr-gramatika');
const { promijesaj, uzmi, jedan, cijeli, izbor, tocnoNetocno, spoji, poredaj, upisBroja, vel } = require('./gen-pomocno');

const ish = (kod) => `OŠ INF ${kod}`;

// ═══════════════════════════════════════════════════════════════════
// Robot na mreži
// ═══════════════════════════════════════════════════════════════════
const SMJER = { '→': [0, 1], '←': [0, -1], '↑': [-1, 0], '↓': [1, 0] };
const SMJEROVI = Object.keys(SMJER);
const IME_SMJERA = { '→': 'desno', '←': 'lijevo', '↑': 'gore', '↓': 'dolje' };
const PRAZNO = '⬜', ROBOT = '🤖', STIJENA = '🪨';
// Cilj robota mijenja se od zadatka do zadatka, pa se ni tekst pitanja ne ponavlja
// („do zvjezdice”, „do kućice”…). [znak, genitiv (do …), akuzativ (na …)]
const CILJEVI = [['⭐', 'zvjezdice', 'zvjezdicu'], ['🏠', 'kućice', 'kućicu'], ['⚽', 'lopte', 'loptu'], ['🎁', 'poklona', 'poklon'],
  ['🌸', 'cvijeta', 'cvijet'], ['🔑', 'ključa', 'ključ'], ['🧀', 'sira', 'sir'], ['🚩', 'zastavice', 'zastavicu']];
const VOCE = [['🍎', 'jabuka'], ['🍒', 'trešnja'], ['🍓', 'jagoda'], ['🍐', 'kruška'], ['🍇', 'grožđe']];

const zapis = (niz) => niz.join(' ');
const kljucPolja = ([r, c]) => `${r},${c}`;

/** Prazna mreža n×n sa stijenama; vraća { n, stijene:Set, slobodna() } */
function novaMreza(n, brojStijena) {
  const sva = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) sva.push([r, c]);
  const mjesta = promijesaj(sva);
  const robot = mjesta.pop();
  const stijene = new Set(mjesta.splice(0, brojStijena).map(kljucPolja));
  return { n, robot, stijene, slobodna: mjesta };
}

/** Izvrši naredbe; vraća završno polje ili null ako robot izađe ili udari u stijenu. */
function izvrsi(m, niz, od = m.robot) {
  let [r, c] = od;
  for (const s of niz) {
    r += SMJER[s][0]; c += SMJER[s][1];
    if (r < 0 || c < 0 || r >= m.n || c >= m.n || m.stijene.has(`${r},${c}`)) return null;
  }
  return [r, c];
}

/** Najkraći put (BFS) od robota do polja; vraća niz strelica ili null. */
function najkraciPut(m, cilj) {
  const start = kljucPolja(m.robot), kraj = kljucPolja(cilj);
  const prethodni = new Map([[start, null]]);
  const red = [m.robot];
  while (red.length) {
    const p = red.shift();
    if (kljucPolja(p) === kraj) break;
    for (const s of promijesaj(SMJEROVI)) {
      const q = izvrsi(m, [s], p);
      if (q && !prethodni.has(kljucPolja(q))) { prethodni.set(kljucPolja(q), [kljucPolja(p), s]); red.push(q); }
    }
  }
  if (!prethodni.has(kraj)) return null;
  const put = [];
  for (let k = kraj; prethodni.get(k); k = prethodni.get(k)[0]) put.unshift(prethodni.get(k)[1]);
  return put;
}

/** Slika mreže: retci polja (emoji); `oznake` = { 'r,c': znak } */
function slika(m, oznake) {
  const retci = [];
  for (let r = 0; r < m.n; r++) {
    const red = [];
    for (let c = 0; c < m.n; c++) {
      const k = `${r},${c}`;
      red.push(k === kljucPolja(m.robot) ? ROBOT : oznake[k] || (m.stijene.has(k) ? STIJENA : PRAZNO));
    }
    retci.push(red);
  }
  return retci;
}

/** Postavi cilj na slobodno polje kojem je najkraći put dug od..do koraka. */
function ciljNaUdaljenosti(m, od, do_) {
  for (const p of promijesaj(m.slobodna)) {
    const put = najkraciPut(m, p);
    if (put && put.length >= od && put.length <= do_) return { cilj: p, put };
  }
  return null;
}

/** Inačice niza koje NE dovode do cilja (za ometače). */
function pogresniNizovi(m, put, cilj) {
  const kandidati = [];
  const zrcali = { '→': '←', '←': '→', '↑': '↓', '↓': '↑' };
  kandidati.push(put.map((s) => zrcali[s]));
  kandidati.push([...put].reverse().map((s) => ({ '→': '↓', '↓': '→', '←': '↑', '↑': '←' })[s]));
  kandidati.push(put.slice(0, -1));
  kandidati.push([...put, put[put.length - 1]]);
  for (let i = 0; i < put.length; i++) for (const s of SMJEROVI) {
    if (s === put[i]) continue;
    const x = [...put]; x[i] = s; kandidati.push(x);
  }
  const cilju = kljucPolja(cilj);
  const dobri = kandidati.filter((x) => x.length > 0)
    .filter((x) => { const k = izvrsi(m, x); return !k || kljucPolja(k) !== cilju; })
    .map(zapis);
  return [...new Set(dobri)].filter((z) => z !== zapis(put));
}

const OPIS_MREZE = 'Svaka strelica pomiče robota 🤖 za jedno polje.';

function zadatciMreza(razred) {
  const q = [];
  const n = { 1: 3, 2: 4, 3: 5, 4: 5 }[razred];
  const stijena = { 1: 0, 2: 2, 3: 3, 4: 4 }[razred];
  const [minK, maxK] = { 1: [2, 3], 2: [3, 4], 3: [3, 5], 4: [4, 6] }[razred];
  const ishodB = razred === 1 ? ish('B.1.2') : razred === 2 ? ish('B.2.1') : ish(`B.${razred}.1`);
  const opis = stijena ? `${OPIS_MREZE} Preko stijene 🪨 ne može.` : OPIS_MREZE;

  // 1) Koji niz naredbi vodi do zvjezdice?
  for (let i = 0; i < 2; i++) {
    const m = novaMreza(n, stijena);
    const c = ciljNaUdaljenosti(m, minK, maxK);
    if (!c) continue;
    const krivi = pogresniNizovi(m, c.put, c.cilj);
    if (krivi.length < 3) continue;
    const [znak, doCilja, naCilj] = jedan(CILJEVI);
    q.push(izbor(`Koje naredbe dovode robota do ${doCilja} ${znak}?`, zapis(c.put), krivi, razred === 1 ? 2 : 3,
      `Robot ide ${c.put.map((s) => IME_SMJERA[s]).join(', ')} i stane na ${naCilj}. Provjeri tako da prstom slijediš svaku strelicu.`,
      ishodB, { mreza: slika(m, { [kljucPolja(c.cilj)]: znak }), passage: opis }));
  }

  // 2) Kod kojeg voća robot stane?
  {
    const m = novaMreza(n, stijena);
    const voce = uzmi(VOCE, Math.min(4, m.slobodna.length));
    const polja = uzmi(m.slobodna, voce.length);
    const oznake = {};
    polja.forEach((p, i) => { oznake[kljucPolja(p)] = voce[i][0]; });
    const kandidat = polja.map((p, i) => ({ i, put: najkraciPut(m, p) }))
      .find((x) => x.put && x.put.length >= Math.max(2, minK - 1) && x.put.length <= maxK);
    if (kandidat) {
      const tocno = voce[kandidat.i][1];
      q.push(izbor(`Robot izvrši naredbe ${zapis(kandidat.put)}. Kod kojeg voća stane?`, tocno,
        voce.map((v) => v[1]), razred === 1 ? 2 : 3,
        `Korak po korak: ${kandidat.put.map((s) => IME_SMJERA[s]).join(', ')}. Na tom polju je ${tocno}.`,
        ishodB, { mreza: slika(m, oznake), passage: opis }));
    }
  }

  // 3) Najmanji broj koraka
  {
    const m = novaMreza(n, stijena);
    const c = ciljNaUdaljenosti(m, minK, maxK + 1);
    const [znak, doCilja] = jedan(CILJEVI);
    if (c) q.push(upisBroja(`Koliko najmanje koraka treba robotu do ${doCilja} ${znak}?`, c.put.length, razred <= 2 ? 2 : 3,
      `Najkraći put je ${zapis(c.put)}, a to je ${c.put.length} koraka.${stijena ? ' Stijene treba zaobići.' : ''}`,
      razred === 1 ? ish('B.1.1') : ishodB, { mreza: slika(m, { [kljucPolja(c.cilj)]: znak }), passage: opis }));
  }

  // 4) Pronađi pogrešnu naredbu (od 2. razreda): samo jedna zamjena popravlja niz
  if (razred >= 2) {
    for (let pokusaj = 0; pokusaj < 30; pokusaj++) {
      const m = novaMreza(n, stijena);
      const c = ciljNaUdaljenosti(m, minK, maxK);
      if (!c) continue;
      const k = Math.floor(Math.random() * c.put.length);
      const krivi = [...c.put];
      krivi[k] = jedan(SMJEROVI.filter((s) => s !== c.put[k]));
      const kraj = izvrsi(m, krivi);
      if (kraj && kljucPolja(kraj) === kljucPolja(c.cilj)) continue;
      // Jednoznačnost: niz popravlja zamjena SAMO na mjestu k.
      const popravci = new Set();
      krivi.forEach((_, j) => SMJEROVI.forEach((s) => {
        const x = [...krivi]; x[j] = s;
        const e = izvrsi(m, x);
        if (e && kljucPolja(e) === kljucPolja(c.cilj)) popravci.add(j);
      }));
      if (popravci.size !== 1 || !popravci.has(k)) continue;
      const redni = ['prva', 'druga', 'treća', 'četvrta', 'peta', 'šesta'];
      const [znak, doCilja] = jedan(CILJEVI);
      q.push(izbor(`Robot treba doći do ${doCilja} ${znak} naredbama ${zapis(krivi)}, ali jedna je naredba pogrešna. Koja?`,
        `${redni[k]} naredba`, redni.slice(0, krivi.length).map((r) => `${r} naredba`), 3,
        `Ispravno je ${zapis(c.put)}: ${redni[k]} naredba treba biti ${c.put[k]} (${IME_SMJERA[c.put[k]]}), a ne ${krivi[k]}.`,
        razred === 2 ? ish('B.2.1') : ishodB, { mreza: slika(m, { [kljucPolja(c.cilj)]: znak }), passage: opis }));
      break;
    }
  }
  return q;
}

/** Kraći zapis s ponavljanjem: → → → ↓ ↓ = 3 × →, 2 × ↓ (3. i 4. r.) */
function zadatciPonavljanjaKoraka(razred) {
  const q = [];
  for (let i = 0; i < 2; i++) {
    const a = jedan(SMJEROVI);
    const b = jedan(SMJEROVI.filter((s) => s !== a));
    const x = cijeli(2, razred === 3 ? 4 : 6), y = cijeli(2, razred === 3 ? 4 : 5);
    if (x === y) continue;
    const niz = [...Array(x).fill(a), ...Array(y).fill(b)];
    const tocno = `${x} × ${a}, ${y} × ${b}`;
    q.push(izbor(`Robot treba izvršiti naredbe ${zapis(niz)}. Koji kraći zapis znači isto?`, tocno,
      [`${y} × ${a}, ${x} × ${b}`, `${y} × ${b}, ${x} × ${a}`, `${x + y} × ${a}`, `${x} × ${b}, ${y} × ${a}`], 3,
      `Prvo se ${x} puta ponavlja ${a}, a zatim ${y} puta ${b}. Redoslijed i broj ponavljanja moraju ostati isti.`,
      ish(`B.${razred}.1`)));
  }
  return q;
}

// ═══════════════════════════════════════════════════════════════════
// Slijed koraka (algoritmi iz svakodnevice)
// ═══════════════════════════════════════════════════════════════════
// Algoritmi iz svakodnevice (pranje ruku, sadnja) namjerno su tu: tako ih uče
// i Code.org („Real-Life Algorithms: Plant a Seed”) i hrvatski udžbenici
// informatike za 1. razred. Da dijete ne pomisli da je pogriješilo predmet,
// takav zadatak nosi napomenu (hint) što je algoritam i zašto je ovdje.
// Upute za računalo, tablet i robota su u većini.
const RUTINE = [
  ['pranje ruku', ['Otvori slavinu.', 'Nasapunaj ruke.', 'Isperi sapun vodom.', 'Obriši ruke ručnikom.'], 'svakodnevno'],
  ['pranje zubi', ['Uzmi četkicu.', 'Stavi pastu na četkicu.', 'Četkaj zube.', 'Isperi usta vodom.'], 'svakodnevno'],
  ['sadnju cvijeta', ['Iskopaj rupu u zemlji.', 'Stavi sjemenku u rupu.', 'Zatrpaj sjemenku zemljom.', 'Zalij zemlju vodom.'], 'svakodnevno'],
  ['izradu sendviča', ['Uzmi dvije kriške kruha.', 'Namaži krišku maslacem.', 'Stavi sir na krišku.', 'Poklopi drugom kriškom.'], 'svakodnevno'],
  ['crtanje kuće', ['Nacrtaj kvadrat.', 'Na kvadrat nacrtaj krov.', 'Na krov nacrtaj dimnjak.', 'Iz dimnjaka nacrtaj dim.'], 'svakodnevno'],
  ['uključivanje računala', ['Pritisni tipku za uključivanje.', 'Pričekaj da se računalo pokrene.', 'Upiši lozinku.', 'Otvori program.'], 'racunalo'],
  ['gašenje računala', ['Spremi svoj rad.', 'Zatvori program.', 'Odaberi isključivanje računala.', 'Pričekaj da se zaslon ugasi.'], 'racunalo'],
  ['snimanje fotografije tabletom', ['Uključi tablet.', 'Otvori aplikaciju za kameru.', 'Usmjeri tablet prema cvijetu.', 'Dodirni gumb za snimanje.'], 'racunalo'],
  ['spremanje crteža na računalu', ['Nacrtaj crtež u programu za crtanje.', 'Odaberi naredbu Spremi.', 'Upiši ime crteža.', 'Potvrdi spremanje.'], 'racunalo'],
  ['ispis crteža na pisaču', ['Otvori svoj crtež.', 'Odaberi naredbu Ispis.', 'Pričekaj da pisač ispiše crtež.', 'Uzmi papir iz pisača.'], 'racunalo'],
  ['slanje e-poruke', ['Otvori program za e-poštu.', 'Odaberi Nova poruka.', 'Napiši poruku.', 'Pritisni gumb Pošalji.'], 'racunalo'],
  ['robota koji otvara vrata', ['Ustani.', 'Okreni se prema vratima.', 'Hodaj do vrata.', 'Otvori vrata.'], 'racunalo'],
];
const NAPOMENA_SVAKODNEVNO = 'Algoritam je niz koraka točno određenim redom. Ima ga i svakodnevni posao, ne samo računalo: tim koracima uputili bismo robota da to napravi.';
/** Napomena uz algoritam iz svakodnevice */
const uz = (vrsta) => (vrsta === 'svakodnevno' ? { hint: NAPOMENA_SVAKODNEVNO } : {});
const ZASTO = 'Računalo i robot rade samo ono što im zapišemo, korak po korak. Zato je redoslijed važan.';

function zadatciSlijeda(razred) {
  const q = [];
  const ishod = razred === 1 ? ish('B.1.2') : ish('B.2.1');
  const duljina = razred === 1 ? 3 : 4;
  for (const [ime, koraci, vrsta] of uzmi(RUTINE, 2)) {
    q.push(poredaj(`Poredaj korake algoritma za „${ime}” pravim redom.`, koraci.slice(0, duljina), razred === 1 ? 1 : 2,
      `Algoritam je niz koraka koji se izvode točno određenim redom. Svaki korak treba ono što je napravljeno prije njega. ${ZASTO}`, ishod, uz(vrsta)));
  }
  {
    const [ime, koraci, vrsta] = jedan(RUTINE);
    // Ometači su samo koraci iste upute: korak iz druge upute („Spremi svoj rad.”
    // uz sadnju cvijeta) dijete odbaci bez razmišljanja o redoslijedu.
    q.push(izbor(`Koji je prvi korak algoritma za „${ime}”?`, koraci[0], koraci.slice(1), 1,
      `Prvo: ${koraci[0].toLowerCase()} Tek nakon toga dolaze ostali koraci.`, ishod, uz(vrsta)));
  }
  if (razred >= 2) {
    const [ime, koraci, vrsta] = jedan(RUTINE);
    const k = cijeli(1, 2);
    const prikaz = koraci.map((s, i) => `${i + 1}. ${i === k ? '___' : s}`).join('\n');
    const tudji = RUTINE.filter((r) => r[0] !== ime).flatMap((r) => r[1]);
    q.push(izbor(`U algoritmu za „${ime}” nedostaje jedan korak. Koji?`, koraci[k], [koraci[3], ...uzmi(tudji, 2)], 2,
      `Bez tog koraka sljedeći se ne može napraviti. Korak „${koraci[3]}” već postoji na kraju uputa.`, ish('B.2.1'), { passage: prikaz, ...uz(vrsta) }));
    // Zamijenjena dva koraka: koji je par na krivom mjestu
    const [ime2, k2, vrsta2] = jedan(RUTINE);
    const j = cijeli(0, 2);
    const krivo = [...k2]; [krivo[j], krivo[j + 1]] = [krivo[j + 1], krivo[j]];
    q.push(izbor(`U algoritmu za „${ime2}” dva su koraka zamijenila mjesta. Koja?`, `${j + 1}. i ${j + 2}.`,
      ['1. i 2.', '2. i 3.', '3. i 4.', '1. i 4.'], 3,
      `„${k2[j]}” mora doći prije koraka „${k2[j + 1]}”.`, ish('B.2.1'),
      { passage: krivo.map((s, i) => `${i + 1}. ${s}`).join('\n'), ...uz(vrsta2) }));
  }
  return q;
}

/** Koji korak dolazi nakon zadanoga (1. i 2. r.) */
function zadatakSljedecegKoraka(razred) {
  const [ime, koraci, vrsta] = jedan(RUTINE);
  const k = cijeli(0, razred === 1 ? 1 : 2);
  const bez = (x) => x.replace(/\.$/, '');
  return izbor(`U algoritmu za „${ime}” napravljeno je: „${bez(koraci[k])}”. Koji korak dolazi sljedeći?`, koraci[k + 1],
    koraci.filter((_, i) => i !== k + 1), razred === 1 ? 1 : 2,
    `Nakon koraka „${bez(koraci[k])}” dolazi „${bez(koraci[k + 1])}”.`, razred === 1 ? ish('B.1.2') : ish('B.2.1'), uz(vrsta));
}

// ═══════════════════════════════════════════════════════════════════
// Razvrstavanje: što ne pripada skupini (logički zadatak, 1. i 2. r.)
// ═══════════════════════════════════════════════════════════════════
const SKUPINE = [
  ['voće', [['🍎', 'jabuka'], ['🍒', 'trešnja'], ['🍐', 'kruška'], ['🍇', 'grožđe'], ['🍓', 'jagoda']]],
  ['prijevozna sredstva', [['🚗', 'automobil'], ['🚌', 'autobus'], ['🚲', 'bicikl'], ['🚂', 'vlak'], ['✈️', 'zrakoplov']]],
  ['životinje', [['🐶', 'pas'], ['🐱', 'mačka'], ['🐰', 'zec'], ['🐮', 'krava'], ['🐷', 'svinja']]],
  ['odjeća', [['👕', 'majica'], ['👖', 'hlače'], ['🧦', 'čarape'], ['🧢', 'kapa'], ['👗', 'haljina']]],
];

function zadatakRazvrstavanja(razred) {
  const [skupina, druga] = uzmi(SKUPINE, 2);
  const tri = uzmi(skupina[1], 3);
  const uljez = jedan(druga[1]);
  const sve = uzmi([...tri, uljez], 4);
  return izbor('Koja sličica NE pripada ostalima?', uljez[1], tri.map((x) => x[1]), 1,
    `Ostale sličice su ${skupina[0]} (${tri.map((x) => x[1]).join(', ')}). Sličica „${uljez[1]}” ne pripada toj skupini.`,
    razred === 1 ? ish('B.1.1') : 'OŠ INF B (logički zadatak)', { visual: sve.map((x) => x[0]).join(' ') });
}

// ═══════════════════════════════════════════════════════════════════
// Uzorci (logički zadatci)
// ═══════════════════════════════════════════════════════════════════
// Imena boja slične duljine, da duljina ponude ne oda odgovor.
const ZNAKOVI = [['🔴', 'crveni krug'], ['🔵', 'plavi krug'], ['🟢', 'zeleni krug'], ['🟡', 'žuti krug']];
const OBRASCI = { 1: ['AB', 'ABC'], 2: ['AAB', 'ABB', 'ABC'], 3: ['AABB', 'ABBC', 'ABCB'], 4: ['AABC', 'ABCC', 'ABACB'] };

const OBLICI = [['▲', 'trokut'], ['■', 'kvadrat'], ['●', 'krug'], ['★', 'zvijezda']];

function zadatciUzoraka(razred) {
  const q = [];
  // Jedan zadatak s oblicima ili brojevima (od 2. r.), da niz ne bude uvijek „krugovi”
  if (Math.random() < 0.5) {
    const obrazac = jedan(OBRASCI[Math.min(razred, 3)]);
    const slova = [...new Set(obrazac)];
    const izabrani = uzmi(OBLICI, slova.length + 1);
    const znak = Object.fromEntries(slova.map((s, j) => [s, izabrani[j]]));
    const visak = cijeli(0, obrazac.length - 1);
    const niz = [...obrazac.repeat(2), ...obrazac.slice(0, visak)].map((s) => znak[s][0]);
    const sljedeci = znak[obrazac[visak]];
    q.push(izbor('Koji oblik dolazi sljedeći u nizu?', sljedeci[1], izabrani.map((z) => z[1]), razred <= 2 ? 1 : 2,
      `Ponavlja se ${obrazac.split('').map((s) => znak[s][1]).join(', ')}. Sljedeći je ${sljedeci[1]}.`,
      razred === 1 ? ish('B.1.1') : 'OŠ INF B (logički zadatak)', { visual: `${niz.join(' ')} ❓` }));
  } else if (razred >= 2) {
    const korak = razred === 2 ? cijeli(2, 5) : cijeli(3, 12), start = cijeli(1, 20);
    const niz = Array.from({ length: 4 }, (_, i) => start + i * korak);
    q.push(upisBroja(`Koji broj dolazi sljedeći u nizu ${niz.join(', ')}, ___?`, start + 4 * korak, 2,
      `Svaki sljedeći broj je za ${korak} veći: ${niz[3]} + ${korak} = ${start + 4 * korak}.`,
      razred === 4 ? ish('B.4.2') : 'OŠ INF B (logički zadatak)'));
  }
  for (let i = 0; i < (q.length ? 1 : 2); i++) {
    const obrazac = jedan(OBRASCI[razred]);
    const slova = [...new Set(obrazac)];
    const izabrani = uzmi(ZNAKOVI, slova.length + 1);
    const znak = Object.fromEntries(slova.map((s, j) => [s, izabrani[j]]));
    const visak = cijeli(0, obrazac.length - 1);
    const niz = [...obrazac.repeat(2), ...obrazac.slice(0, visak)].map((s) => znak[s]);
    const sljedeci = znak[obrazac[visak]];
    q.push(izbor('Niz se ponavlja. Koji krug dolazi na mjesto upitnika?', `${sljedeci[0]} ${sljedeci[1]}`,
      izabrani.map((z) => `${z[0]} ${z[1]}`), razred <= 2 ? 1 : 2,
      `Dio koji se ponavlja je ${obrazac.split('').map((s) => znak[s][0]).join(' ')}. Nakon zadnjeg kruga u nizu dolazi ${sljedeci[1]}.`,
      razred === 1 ? ish('B.1.1') : razred === 4 ? ish('B.4.2') : 'OŠ INF B (logički zadatak)',
      { visual: `${niz.map((z) => z[0]).join(' ')} ❓` }));
  }
  return q;
}

// ═══════════════════════════════════════════════════════════════════
// Šifre: simboli za podatke (A.3.1)
// ═══════════════════════════════════════════════════════════════════
const RIJECI_SIFRE = ['MAMA', 'TATA', 'SOK', 'NOS', 'VUK', 'SOVA', 'KOZA', 'RIBA', 'VODA', 'LIST', 'ZEC', 'KAPA', 'LOPTA', 'NEBO', 'SIR', 'TRAVA', 'MORE', 'SOL'];
const SIMBOLI = ['🔺', '⭐', '🌙', '❤️', '🔷', '🍀', '☀️', '⚡'];

function zadatciSifre(razred) {
  const q = [];
  const ishod = razred === 3 ? ish('A.3.1') : 'OŠ INF A (simboli za podatke)';
  // Dvije riječi kojima zajedno treba najviše 7 slova, pa šifra stane u 8 znakova.
  let rijec, druga, slova;
  for (let i = 0; i < 50; i++) {
    [rijec, druga] = uzmi(RIJECI_SIFRE, 2);
    slova = [...new Set(rijec + druga)];
    if (slova.length <= 7) break;
  }
  if (slova.length > 7) { druga = rijec; slova = [...new Set(rijec)]; }
  const dodatno = jedan('ABDEIJKLMNOPRSTUVZ'.split('').filter((s) => !slova.includes(s)));
  const sva = promijesaj([...slova, dodatno]);
  const simboli = uzmi(SIMBOLI, sva.length);
  const kod = Object.fromEntries(sva.map((s, i) => [s, simboli[i]]));
  const tablica = sva.map((s) => `${kod[s]} = ${s}`).join('\n');
  const zapisRijeci = (r) => [...r].map((s) => kod[s]).join('');

  const iste = RIJECI_SIFRE.filter((r) => r !== rijec && r.length === rijec.length);
  const naopako = [...rijec].reverse().join('');
  q.push(izbor('Pogledaj šifru. Koja je riječ zapisana znakovima na slici?', rijec, [...uzmi(iste, 2), naopako], 2,
    `Svaki znak zamijeni slovom iz šifre: ${[...rijec].map((s) => `${kod[s]} → ${s}`).join(', ')}.`,
    ishod, { passage: `Šifra:\n${tablica}`, visual: zapisRijeci(rijec) }));

  {
    const slovo = jedan(sva);
    q.push(izbor(`Koje slovo u šifri označava znak ${kod[slovo]}?`, slovo, sva, 1,
      `U tablici šifre piše ${kod[slovo]} = ${slovo}.`, ishod, { passage: `Šifra:\n${tablica}` }));
  }
  if (druga !== rijec) {
    const tocno = zapisRijeci(druga);
    const znakovi = [...druga].map((s) => kod[s]);
    const krivi = new Set();
    for (let i = 0; i < 20 && krivi.size < 3; i++) {
      const x = [...znakovi];
      if (i % 2 === 0) { const j = cijeli(0, x.length - 2); [x[j], x[j + 1]] = [x[j + 1], x[j]]; }
      else x[cijeli(0, x.length - 1)] = jedan(simboli);
      if (x.join('') !== tocno) krivi.add(x.join(''));
    }
    if (krivi.size >= 2) q.push(izbor(`Kako se šifrom zapisuje riječ ${druga}?`, tocno, [...krivi], 3,
      `Svako slovo zamijeni njegovim znakom, redom: ${[...druga].map((s) => `${s} → ${kod[s]}`).join(', ')}.`,
      ishod, { passage: `Šifra:\n${tablica}` }));
  }
  return q;
}

// ═══════════════════════════════════════════════════════════════════
// Sortiranje (B.3.2)
// ═══════════════════════════════════════════════════════════════════
const kolator = new Intl.Collator('hr');

function zadatciSortiranja(razred) {
  // Svaki poziv bira 3 od 9 oblika zadatka, pa se ista rečenica ne vraća svaki kviz.
  const ishodS = razred === 3 ? ish('B.3.2') : 'OŠ INF B (sortiranje)';
  const djeca = uzmi(Object.keys(HR.IMENA), 4);
  const sve = uzmi(Array.from({ length: 31 }, (_, i) => 120 + i), 4);
  const visine = djeca.map((d, i) => ({ label: d, value: sve[i] }));
  const poVisini = [...visine].sort((a, b) => a.value - b.value);
  const veliki = razred === 3 ? 1000 : 100000;
  const brojevi = () => uzmi(Array.from({ length: 60 }, () => cijeli(10, veliki - 1)), 5).filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);
  const ZIVOTINJE = [['mrav', 1], ['miš', 2], ['mačka', 3], ['pas', 4], ['ovca', 5], ['krava', 6], ['konj', 7]];

  const varijante = [
    () => {
      const izabrana = [];
      for (const ime of uzmi(Object.keys(HR.IMENA), 12)) if (!izabrana.some((x) => x[0] === ime[0]) && izabrana.length < 4) izabrana.push(ime);
      return poredaj('Poredaj imena abecednim redom, onako kako ih računalo slaže u imeniku.', [...izabrana].sort(kolator.compare), 2,
        'Abecedni red gleda prvo slovo imena: A, B, C, Č, Ć, D, DŽ, Đ, E, F, G, H, I, J, K, L, LJ, M, N, NJ, O, P, R, S, Š, T, U, V, Z, Ž.', ishodS);
    },
    () => poredaj('Grafikon pokazuje visinu djece u centimetrima. Kojim redom stoje djeca od najnižeg do najvišeg?', poVisini.map((x) => x.label), 2,
      `Uspoređujemo brojeve: ${poVisini.map((x) => `${x.label} ${x.value} cm`).join(', ')}. Tako računalo sortira podatke od najmanjeg do najvećeg.`,
      ishodS, { chart: visine }),
    () => {
      const t = cijeli(1, 2);
      return izbor(`Djeca su poredana od najnižeg do najvišeg. Tko je ${['prvi', 'drugi', 'treći'][t]} u redu?`, poVisini[t].label, visine.map((x) => x.label), 3,
        `Poredano po visini: ${poVisini.map((x) => x.label).join(', ')}. Na ${t + 1}. mjestu je ${poVisini[t].label}.`, ishodS, { chart: visine });
    },
    () => {
      const najvisi = Math.random() < 0.5;
      const x = najvisi ? poVisini[3] : poVisini[0];
      return izbor(`Pogledaj grafikon. Tko je ${najvisi ? 'najviši' : 'najniži'}?`, x.label, visine.map((v) => v.label), 1,
        `${x.label} ima ${x.value} cm, a to je ${najvisi ? 'najveći' : 'najmanji'} broj u grafikonu.`, ishodS, { chart: visine });
    },
    () => {
      const granica = poVisini[cijeli(0, 2)].value;
      const n = visine.filter((v) => v.value > granica).length;
      return upisBroja(`Pogledaj grafikon. Koliko je djece više od ${granica} cm?`, n, 2,
        `Više od ${granica} cm su: ${visine.filter((v) => v.value > granica).map((v) => `${v.label} (${v.value})`).join(', ')}.`, ishodS, { chart: visine });
    },
    () => {
      const b = brojevi();
      return poredaj('Poredaj brojeve od najmanjeg do najvećeg.', [...b].sort((x, y) => x - y).map(String), 2,
        'Uspoređujemo najprije broj znamenaka, a zatim znamenke slijeva nadesno.', ishodS);
    },
    () => {
      const b = brojevi();
      return poredaj('Poredaj brojeve od najvećeg do najmanjeg.', [...b].sort((x, y) => y - x).map(String), 2,
        'Silazni redoslijed: prvo najveći broj, na kraju najmanji.', ishodS);
    },
    () => {
      const b = uzmi(Array.from({ length: 40 }, (_, i) => (i + 1) * cijeli(2, 9)), 5).filter((v, i, a) => a.indexOf(v) === i);
      if (b.length < 5) return null;
      const sredina = [...b].sort((x, y) => x - y)[2];
      return upisBroja(`Brojeve ${b.join(', ')} poredamo od najmanjeg do najvećeg. Koji je broj u sredini?`, sredina, 3,
        `Poredano: ${[...b].sort((x, y) => x - y).join(', ')}. Treći od pet brojeva je ${sredina}.`, ishodS);
    },
    () => {
      const z = uzmi(ZIVOTINJE, 4).sort((x, y) => x[1] - y[1]);
      return poredaj('Poredaj životinje od najlakše do najteže.', z.map((x) => x[0]), 1,
        `Od najlakše do najteže: ${z.map((x) => x[0]).join(', ')}.`, ishodS);
    },
  ];
  return uzmi(varijante, 3).map((f) => f()).filter(Boolean);
}

// ═══════════════════════════════════════════════════════════════════
// Odluka i ponavljanje u programu (3. i 4. r.)
// ═══════════════════════════════════════════════════════════════════
const PRAVILA = [
  ['pada kiša', 'kišobran', 'kapu', ['Vani pada kiša.', 'Vani sja sunce.']],
  ['je hladno', 'jaknu', 'majicu kratkih rukava', ['Vani je hladno.', 'Vani je toplo.']],
  ['je semafor crven', 'stani', 'kreni', ['Semafor je crven.', 'Semafor je zelen.']],
  ['je mrak', 'upali svjetlo', 'ugasi svjetlo', ['Vani je mrak.', 'Vani je dan.']],
];
const bodova = (n) => ['bod', 'boda', 'bodova'][HR.oblikZa(n)];

function zadatciOdluke(razred) {
  // 2 od 6 oblika AKO–INAČE po pozivu
  const iB = ish(`B.${razred}.1`);
  const varijante = [
    () => {
      const [uvjet, da, ne, [jest, nije]] = jedan(PRAVILA);
      const istina = Math.random() < 0.5;
      const glagolske = ['stani', 'kreni', 'upali svjetlo', 'ugasi svjetlo'].includes(da);
      const pitanje = glagolske
        ? `Program kaže: AKO ${uvjet}, ONDA „${da}”, INAČE „${ne}”. ${istina ? jest : nije} Što program kaže?`
        : `Program kaže: AKO ${uvjet}, ONDA uzmi ${da}, INAČE uzmi ${ne}. ${istina ? jest : nije} Što lik uzima?`;
      return izbor(pitanje, istina ? da : ne, [istina ? ne : da], 2,
        `Uvjet „${uvjet}” ${istina ? 'je ispunjen, pa se izvodi dio iza ONDA' : 'nije ispunjen, pa se izvodi dio iza INAČE'}.`, iB);
    },
    () => {
      const granica = razred === 3 ? cijeli(5, 20) * 5 : cijeli(10, 90) * 10;
      const broj = jedan([granica, granica + cijeli(1, 9), granica - cijeli(1, 9)]);
      const vece = broj > granica;
      return izbor(`Program kaže: AKO je broj veći od ${granica}, ispiši „veliki”, INAČE ispiši „mali”. Upisan je broj ${broj}. Što program ispiše?`,
        vece ? '„veliki”' : '„mali”', ['„veliki”', '„mali”'], broj === granica ? 3 : 2,
        broj === granica ? `${broj} nije veći od ${granica}, nego jednak. Uvjet nije ispunjen, pa vrijedi dio INAČE.`
          : `${broj} ${vece ? 'je' : 'nije'} veći od ${granica}, pa vrijedi dio ${vece ? 'ONDA' : 'INAČE'}.`, iB);
    },
    () => {
      const n = cijeli(11, 99), paran = n % 2 === 0;
      return izbor(`Program kaže: AKO je broj paran, ispiši „paran”, INAČE ispiši „neparan”. Upisan je broj ${n}. Što program ispiše?`,
        paran ? '„paran”' : '„neparan”', ['„paran”', '„neparan”'], 2,
        `${n} ${paran ? 'je djeljiv s 2, pa je paran' : 'nije djeljiv s 2, pa je neparan'}.`, iB);
    },
    () => {
      const t = cijeli(-9, 12);
      return izbor(`Program kaže: AKO je temperatura ispod 0 °C, ispiši „led”, INAČE ispiši „voda”. Toplomjer pokazuje ${t} °C. Što program ispiše?`,
        t < 0 ? '„led”' : '„voda”', ['„led”', '„voda”'], t === 0 ? 3 : 2,
        t < 0 ? `${t} °C je ispod nule, pa vrijedi dio ONDA.` : `${t} °C nije ispod nule, pa vrijedi dio INAČE.`, iB);
    },
    () => {
      const zid = Math.random() < 0.5;
      return izbor(`Robot ima naredbu: AKO je ispred njega zid, ONDA se okreni, INAČE idi naprijed. ${zid ? 'Ispred robota je zid.' : 'Ispred robota je slobodno polje.'} Što robot napravi?`,
        zid ? 'okrene se' : 'ide naprijed', ['okrene se', 'ide naprijed', 'stane i ugasi se'], 2,
        zid ? 'Uvjet je ispunjen (zid je ispred), pa se izvodi ONDA: okreni se.' : 'Uvjet nije ispunjen, pa se izvodi INAČE: idi naprijed.', iB);
    },
    () => {
      const granica = jedan([10, 20, 50]), b = granica + jedan([-3, -1, 0, 2, 5]);
      const prolazi = b >= granica;
      return izbor(`U igri vrijedi: AKO imaš barem ${granica} bodova, ONDA prelaziš na sljedeću razinu. Imaš ${b} bodova. Prelaziš li na sljedeću razinu?`,
        prolazi ? 'Da' : 'Ne', ['Da', 'Ne'], b === granica ? 3 : 2,
        prolazi ? `${b} je barem ${granica} („barem” znači ${granica} ili više).` : `${b} je manje od ${granica}.`, iB);
    },
  ];
  return uzmi(varijante, 2).map((f) => f());
}

function zadatciPonavljanja(razred) {
  const q = [];
  {
    const n = cijeli(3, 9);
    q.push(upisBroja(`Program kaže: PONOVI ${n} PUTA: nacrtaj zvjezdicu. Koliko je zvjezdica nacrtano?`, n, 1,
      `Naredba unutar ponavljanja izvodi se ${n} puta, pa je broj zvjezdica jednak broju ponavljanja: ${n}.`, ish(`B.${razred}.1`)));
  }
  {
    const n = cijeli(2, 5), k = cijeli(2, 3);
    const likovi = uzmi(['krug', 'kvadrat', 'trokut', 'zvjezdicu'], k);
    q.push(upisBroja(`Program kaže: PONOVI ${n} PUTA: ${likovi.map((l) => `nacrtaj ${l}`).join(', ')}. Koliko je likova nacrtano ukupno?`, n * k, 2,
      `Jedno ponavljanje daje ${k} lika, a ponavlja se ${n} puta: ${n} · ${k} = ${n * k}.`, ish(`B.${razred}.1`)));
  }
  // Dodatni oblici petlji: po pozivu jedan nasumični
  const dodatni = [
    () => { const n = cijeli(3, 8), k = cijeli(2, 3);
      return upisBroja(`Program kaže: PONOVI ${n} PUTA: skoči ${k} polja naprijed. Koliko polja lik prijeđe ukupno?`, n * k, 2,
        `${n} skokova po ${k} polja: ${n} · ${k} = ${n * k}.`, ish(`B.${razred}.1`)); },
    () => { const [lik, n] = jedan([['kvadrat', 4], ['trokut', 3], ['šesterokut', 6]]);
      return upisBroja(`Lik crta ${lik}: PONOVI ${n} PUTA: idi naprijed, okreni se. Koliko se puta lik okrenuo?`, n, 2,
        `Okret je unutar ponavljanja, pa se izvodi ${n} puta — koliko ${lik} ima stranica.`, ish(`B.${razred}.1`)); },
    () => { const n = cijeli(2, 6), k = cijeli(2, 5);
      return upisBroja(`Košara je prazna. Program ${n} puta ponovi: stavi ${k} jabuke u košaru. Koliko je jabuka u košari?`.replace(`${k} jabuke`, `${HR.brojIme(k, 'jabuka', 'A')}`), n * k, 2,
        `${n} · ${k} = ${n * k}.`, ish(`B.${razred}.1`)); },
    () => { const k = cijeli(2, 4), n = cijeli(3, 6);
      return upisBroja(`Svaki korak lika ide ${k} polja naprijed. Koliko puta treba ponoviti korak da lik prijeđe ${n * k} polja?`, n, 3,
        `${n * k} : ${k} = ${n}.`, ish(`B.${razred}.1`)); },
  ];
  q.push(jedan(dodatni)());
  if (razred === 4) {
    const start = jedan([0, 0, 10, 20]), n = cijeli(3, 8), d = cijeli(2, 9);
    const minus = start > 0 && start - n * d >= 0 && Math.random() < 0.5;
    const kraj = minus ? start - n * d : start + n * d;
    q.push(upisBroja(`Na početku igre bodovi su ${start}. Program ${n} puta ponovi: ${minus ? 'oduzmi' : 'dodaj'} ${d} ${bodova(d)}. Koliko je bodova na kraju?`, kraj, 3,
      `${start} ${minus ? '−' : '+'} ${n} · ${d} = ${kraj}. Varijabla „bodovi” pamti vrijednost i mijenja je u svakom ponavljanju.`, ish('B.4.1')));
    const a = cijeli(2, 4), b = cijeli(2, 5);
    q.push(upisBroja(`Program kaže: PONOVI ${a} PUTA: (PONOVI ${b} PUTA: napravi korak). Koliko koraka lik napravi?`, a * b, 3,
      `Unutarnje ponavljanje daje ${b} koraka, a ono se izvodi ${a} puta: ${a} · ${b} = ${a * b}.`, ish('B.4.1')));
    const x = cijeli(2, 12), m = cijeli(2, 5), p = cijeli(1, 9);
    q.push(upisBroja(`Program traži da upišeš broj, pomnoži ga s ${m} i doda ${p}. Upisan je broj ${x}. Koji broj program ispiše?`, x * m + p, 3,
      `Ulazna vrijednost je ${x}. Program računa ${x} · ${m} + ${p} = ${x * m + p}.`, ish('B.4.1')));
  }
  return q;
}

// ═══════════════════════════════════════════════════════════════════
// Digitalni svijet: uređaji, programi, zdravlje, sigurnost
// ═══════════════════════════════════════════════════════════════════
const DIGITALNI = ['tablet', 'mobitel', 'računalo', 'pametni sat', 'igraća konzola'];
const NEDIGITALNI = ['lopta', 'olovka', 'kišobran', 'tanjur', 'drvena kocka', 'društvena igra', 'plišani medvjedić'];
const ULAZNI = ['tipkovnica', 'miš', 'mikrofon', 'kamera', 'skener'];
const IZLAZNI = ['zaslon', 'pisač', 'zvučnici', 'slušalice', 'projektor'];
const SLUZI = [
  ['tipkovnica', 'upisivanje slova i brojeva'], ['miš', 'pomicanje strelice na zaslonu'], ['zaslon', 'prikaz slike i teksta'],
  ['zvučnici', 'reprodukcija zvuka'], ['pisač', 'ispis na papir'], ['mikrofon', 'snimanje glasa'], ['kamera', 'snimanje slike'],
];
const PROGRAMI = [
  ['program za crtanje', 'izradu slike'], ['program za pisanje teksta', 'pisanje sastava'], ['mrežni preglednik', 'otvaranje mrežnih stranica'],
  ['kalkulator', 'računanje'], ['program za prezentacije', 'izradu prezentacije'], ['program za e-poštu', 'slanje pisama preko interneta'],
];
const OSOBNI = ['kućna adresa', 'broj mobitela', 'lozinka', 'ime i prezime', 'fotografija lica'];
const NEOSOBNI = ['omiljena boja', 'omiljeni crtić', 'omiljeno voće', 'omiljena životinja'];

const ZDRAVLJE = [
  ['Je li dobro nakon pola sata igranja na tabletu napraviti pauzu i protegnuti se?', true, 'Pauza odmara oči i tijelo.'],
  ['Treba li zaslon gledati s udaljenosti od barem jedne duljine ruke?', true, 'Previše blizu zaslona oči se brže umaraju.'],
  ['Smijemo li jesti i piti uz tipkovnicu?', false, 'Mrvice i tekućina mogu pokvariti tipkovnicu.'],
  ['Smijemo li uređaj dirati mokrim rukama?', false, 'Voda može oštetiti uređaj, a mokre ruke i struja su opasni.'],
  ['Je li dobro koristiti tablet u krevetu prije spavanja?', false, 'Svjetlo zaslona otežava uspavljivanje.'],
  ['Sjedimo li uz računalo uspravnih leđa i s nogama na podu?', true, 'Pravilno sjedenje čuva leđa i vrat.'],
  ['Je li dobro odmoriti oči tako da nakratko pogledamo kroz prozor u daljinu?', true, 'Pogled u daljinu opušta oči nakon gledanja u zaslon.'],
  ['Treba li zaslon biti jako svijetao u mračnoj sobi?', false, 'Prejak zaslon u mraku zamara oči. Upali svjetlo u sobi ili smanji svjetlinu.'],
  ['Smijemo li slušalice stalno slušati na najjačoj glasnoći?', false, 'Preglasan zvuk oštećuje sluh.'],
  ['Je li dobro igrati igrice umjesto spavanja?', false, 'San je važan za zdravlje i učenje.'],
  ['Trebamo li tablet nositi pažljivo, objema rukama?', true, 'Tako ga nećemo ispustiti i razbiti.'],
  ['Smijemo li sami otvarati računalo i dirati dijelove unutra?', false, 'Unutra je struja i osjetljivi dijelovi. To radi odrasla osoba ili serviser.'],
];
const SIGURNOST = [
  ['Smiješ li prijatelju iz razreda reći svoju lozinku?', false, 'Lozinku zna samo vlasnik i roditelj.'],
  ['Trebaš li reći roditelju ako ti nepoznata osoba piše poruke?', true, 'Odrasla osoba od povjerenja procijenit će je li poruka opasna.'],
  ['Smiješ li se naći s osobom koju poznaješ samo iz igre na internetu?', false, 'Na internetu se netko može lažno predstaviti. Takav susret bez roditelja je opasan.'],
  ['Smiješ li bez pitanja objaviti fotografiju prijatelja?', false, 'Za objavu tuđe fotografije treba dopuštenje te osobe i njezinih roditelja.'],
  ['Može li fotografija koju objaviš na internetu ostati negdje spremljena i kad je obrišeš?', true, 'Drugi su je mogli spremiti. To je digitalni trag.'],
  ['Je li sve što piše na internetu sigurno točno?', false, 'Na internetu svatko može objaviti bilo što, pa podatke provjeravamo.'],
  ['Je li poruka „Čestitamo, tvoj je novi tablet! Upiši lozinku.” vjerojatno prijevara?', true, 'Prave nagrade nikad ne traže lozinku.'],
  ['Trebaš li se odjaviti s računa kad radiš na školskom računalu?', true, 'Inače sljedeći učenik može ući u tvoj račun.'],
  ['Smiješ li otvoriti privitak u poruci od nepoznate osobe?', false, 'Privitak može sadržavati virus. Pokaži poruku odrasloj osobi.'],
  ['Trebaš li pitati roditelja prije nego što preuzmeš novu igricu?', true, 'Neke igrice nisu za djecu ili traže plaćanje.'],
  ['Je li u redu na internetu pisati ružne poruke o drugima?', false, 'Riječi na internetu jednako bole kao i uživo.'],
  ['Smiješ li bez pitanja kliknuti na reklamu koja kaže da si osvojio nagradu?', false, 'Takve reklame su najčešće prijevara.'],
  ['Trebaš li reći odrasloj osobi ako te netko na internetu zadirkuje?', true, 'Odrasla osoba pomoći će zaustaviti zadirkivanje.'],
  ['Je li dobra lozinka tvoj datum rođenja?', false, 'Datum rođenja drugi mogu lako saznati i pogoditi.'],
  ['Smije li igrica tražiti tvoju kućnu adresu?', false, 'Igrici ne treba tvoja adresa. Ne upisuj je i reci roditelju.'],
];

function slabeLozinke() {
  const ime = jedan(Object.keys(HR.IMENA));
  // I slabe lozinke imaju veliko slovo i sličnu duljinu, da oblik ne oda točan odgovor.
  return ['1234567890', 'Lozinka1', `${ime}${ime}`, 'aaaaaaaaaaaa', `${ime}2018`, 'Qwerty12'];
}
function jakaLozinka() {
  const rijeci = ['Plavi', 'Mali', 'Veseli', 'Brzi', 'Tihi', 'Ljubičasti'];
  const imenice = ['Konj', 'Oblak', 'Zmaj', 'Kit', 'Puž', 'Bicikl'];
  // Znak u sredini: lozinka ne završava kao rečenica („!”, „?”).
  return `${jedan(rijeci)}${jedan(['#', '%', '&', '*'])}${jedan(imenice)}${cijeli(10, 98)}`;
}

function zadatciDigitalnogSvijeta(razred) {
  const q = [];
  // Oznake ishoda koje su provjerene u kurikulu; inače samo domena.
  const A = razred === 1 ? ish('A.1.2') : 'OŠ INF A (uređaji)';
  const D = razred === 1 ? ish('D.1.1') : razred === 4 ? ish('D.4.1') : 'OŠ INF D (sigurnost)';

  if (razred <= 2) {
    for (const d of uzmi(DIGITALNI, 2)) q.push(izbor('Koji je od ovih predmeta digitalni uređaj?', d, NEDIGITALNI, 1,
      `${vel(d)} radi na struju ili bateriju i ima program. Ostali predmeti nisu digitalni.`, razred === 1 ? ish('A.1.1') : ish('A.2.1')));
    q.push(spoji('Spoji dio računala s onim čemu služi:', uzmi(SLUZI, 4), razred, 'Svaki dio računala ima svoj posao.', razred === 1 ? ish('A.1.2') : ish('A.2.1')));
  }
  if (razred >= 2) {
    q.push(spoji('Spoji program s onim za što ga koristimo:', uzmi(PROGRAMI, 4), 2, 'Program je skup uputa koje računalo izvodi. Za svaki posao koristimo prikladan program.', razred === 2 ? ish('A.2.1') : 'OŠ INF A (programi)'));
    const u = jedan(ULAZNI);
    q.push(izbor('Koji uređaj UNOSI podatke u računalo?', u, IZLAZNI, 2, `${vel(u)} je ulazni uređaj: preko njega podatci ulaze u računalo. Zaslon, pisač i zvučnici su izlazni.`, A));
    const iz = jedan(IZLAZNI);
    q.push(izbor('Koji uređaj računalo koristi da nam pokaže ili pusti rezultat?', iz, ULAZNI, 2, `${vel(iz)} je izlazni uređaj: preko njega podatci izlaze iz računala do nas.`, A));
  }
  for (const o of uzmi(OSOBNI, razred <= 2 ? 1 : 2)) q.push(izbor('Koji je od ovih podataka osobni podatak koji ne dijelimo s nepoznatima?', o, NEOSOBNI, 1,
    'Adresa, broj mobitela, lozinka, ime i prezime i fotografija pomažu nepoznatoj osobi da te pronađe ili uđe u tvoj račun. Dijelimo ih samo uz dopuštenje roditelja.', D));
  for (const [p, t, obj] of uzmi(ZDRAVLJE, 2)) q.push(tocnoNetocno(p, t, 1, obj, razred === 1 ? ish('D.1.2') : razred === 4 ? ish('D.4.1') : 'OŠ INF D (zdravlje)'));
  for (const [p, t, obj] of uzmi(SIGURNOST, razred === 1 ? 2 : 3)) q.push(tocnoNetocno(p, t, razred <= 2 ? 1 : 2, obj, razred === 1 ? ish('D.1.1') : D));
  q.push(izbor('Kome se obratiš kad te nešto na internetu uplaši ili zbuni?', jedan(['roditelju', 'učiteljici ili učitelju']),
    ['nepoznatoj osobi iz igre', 'zadržiš to za sebe', 'osobi koja ti je poslala poruku'], 1,
    'Odrasla osoba od povjerenja pomoći će ti i neće te kriviti.', D));

  if (razred >= 3) {
    const jaka = jakaLozinka();
    q.push(izbor('Koja je lozinka najsigurnija?', jaka, slabeLozinke(), 2,
      `„${jaka}” ima velika i mala slova, brojeve i znak, a nije ime ni poznata riječ. Lozinke s imenom, nizom brojeva ili istim slovima lako se pogode.`, D));
    q.push(izbor('Što učiniš ako ti stigne poruka „Čestitamo, čeka te nagrada! Pošalji svoju adresu.”?', 'pokažem je roditelju',
      ['pošaljem adresu', 'proslijedim je prijateljima', 'odgovorim da želim nagradu'], 2,
      'Takve poruke su najčešće prijevara. Odrasla osoba pomoći će ti je obrisati i prijaviti.', D));
    q.push(izbor('Koja je poruka u razrednoj grupi pristojna?', 'Može li mi netko reći što je za zadaću? Hvala!',
      ['KAŽITE MI ODMAH ZADAĆU!!!', 'Vi ste dosadni, odgovorite već jednom.', 'Ako mi ne kažete, ljutim se.'], 1,
      'Pristojna poruka pozdravlja, moli i zahvaljuje. Pisanje velikim slovima na internetu znači vikanje.', 'OŠ INF C (komunikacija)'));
  }
  if (razred === 3) {
    q.push(izbor('Kako se zove mjesto na računalu u koje spremamo više datoteka zajedno?', 'mapa', ['datoteka', 'zaslon', 'pisač'], 2,
      'Datoteke slažemo u mape kao papire u fascikle, pa ih lakše pronađemo.', A));
  }
  if (razred === 4) {
    q.push(izbor('Što je internet?', 'mreža povezanih računala po cijelom svijetu', ['jedan veliki program na školskom računalu', 'kabel kojim se puni mobitel i tablet', 'trgovina u kojoj se kupuju računala'], 2,
      'Internet povezuje milijune računala i uređaja, pa preko njega razmjenjujemo podatke i poruke.', ish('A.4.1')));
    q.push(tocnoNetocno('Može li računalo raditi bez programa?', false, 2,
      'Računalo samo izvodi upute. Bez programa ne zna što treba raditi.', ish('A.4.2')));
    q.push(tocnoNetocno('Izvodi li računalo naredbe točno onim redom kojim su napisane?', true, 2,
      'Računalo ne pogađa što smo htjeli reći. Zato greška u redoslijedu daje pogrešan rezultat.', ish('A.4.2')));
    q.push(izbor('Što računalo radi bolje od čovjeka?', 'brzo računa s velikim brojevima', ['razumije kako se osjeća prijatelj', 'smišlja vlastite želje i snove', 'raduje se lijepom danu'], 2,
      'Računalo je vrlo brzo i točno u računanju, ali nema osjećaje ni vlastite želje.', ish('A.4.2')));
    q.push(spoji('Spoji zanimanje s poslom koji obavlja uz računalo:', uzmi([
      ['programer', 'piše programe'], ['grafički dizajner', 'izrađuje plakate i slike'], ['knjižničar', 'traži knjige u katalogu'],
      ['meteorolog', 'izrađuje vremensku prognozu'], ['liječnik', 'upisuje nalaze bolesnika']], 4), 2,
      'Gotovo svako zanimanje danas koristi računalo, ali svako za drugi posao.', ish('D.4.2')));
  }
  if (razred === 2) {
    q.push(izbor('Tko piše programe za računala?', 'programer', ['pekar', 'vrtlar', 'frizer'], 1,
      'Programer piše upute koje računalo izvodi.', ish('D.2.1')));
  }
  return q;
}

// ═══════════════════════════════════════════════════════════════════
// Generatori po razredu (ime funkcije = ime generatora za recenziju)
// ═══════════════════════════════════════════════════════════════════
function genAlgoritmi1() { return [...zadatciSlijeda(1), zadatakSljedecegKoraka(1), zadatakRazvrstavanja(1), zadatakRazvrstavanja(1), ...zadatciMreza(1), ...zadatciMreza(1), ...zadatciUzoraka(1)]; }
function genAlgoritmi2() { return [...zadatciSlijeda(2), zadatakSljedecegKoraka(2), zadatakRazvrstavanja(2), ...zadatciMreza(2), ...zadatciMreza(2), ...zadatciUzoraka(2)]; }
function genAlgoritmi3() { return [...zadatciMreza(3), ...zadatciPonavljanjaKoraka(3), ...zadatciUzoraka(3), ...zadatciSifre(3), ...zadatciSortiranja(3), ...zadatciOdluke(3), ...zadatciPonavljanja(3)]; }
function genAlgoritmi4() { return [...zadatciMreza(4), ...zadatciPonavljanjaKoraka(4), ...zadatciUzoraka(4), ...zadatciSifre(4), ...zadatciSortiranja(4), ...zadatciOdluke(4), ...zadatciPonavljanja(4)]; }
function genDigitalniSvijet1() { return zadatciDigitalnogSvijeta(1); }
function genDigitalniSvijet2() { return zadatciDigitalnogSvijeta(2); }
function genDigitalniSvijet3() { return zadatciDigitalnogSvijeta(3); }
function genDigitalniSvijet4() { return zadatciDigitalnogSvijeta(4); }

module.exports = {
  genAlgoritmi1, genAlgoritmi2, genAlgoritmi3, genAlgoritmi4,
  genDigitalniSvijet1, genDigitalniSvijet2, genDigitalniSvijet3, genDigitalniSvijet4,
  // za testove
  _mreza: { novaMreza, izvrsi, najkraciPut, pogresniNizovi },
};
