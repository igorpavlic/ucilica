/**
 * Podatci, grafovi i vjerojatnost — MAT OŠ E.3.1, E.4.1, E.4.2.
 *
 * Konteksti su napisani ručno (školski život, zavičaj), a brojevi se biraju
 * pri svakom pozivu. Zato generator nije zatvoren popis: kad dijete iscrpi
 * temu, `generateAndStore` dobiva nove skupove podataka s novim `itemKey`,
 * a obitelji zadataka (što dijete radi) ostaju iste.
 *
 * E.3.1 — tablica i stupčasti dijagram: očitavanje, usporedba, razlika, zbroj.
 * E.4.1 — prikupljanje i razvrstavanje: prebrojavanje s popisa i crtica,
 *          tumačenje istraživanja, tvrdnje o podatcima.
 * E.4.2 — opisivanje vjerojatnosti: siguran / moguć / nemoguć događaj,
 *          vjerojatnije / manje vjerojatno / jednako vjerojatno.
 */
const HR = require('./hr-gramatika');

const cijeli = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const promijesaj = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const izbor = (pitanje, tocno, krivi, tezina, extra = {}) => {
  const answers = promijesaj([tocno, ...[...new Set(krivi.map(String))].filter((k) => k !== String(tocno))].slice(0, 4).map(String));
  if (!answers.includes(String(tocno))) answers[0] = String(tocno);
  const sve = promijesaj(answers);
  return { type: 'choice', difficulty: tezina, question: pitanje, answers: sve, correctIndex: sve.indexOf(String(tocno)), ...extra };
};
const upis = (pitanje, odgovor, tezina, extra = {}) =>
  ({ type: 'input', difficulty: tezina, question: pitanje, correctAnswer: String(odgovor), ...extra });
const tocnoNetocno = (pitanje, tocno, tezina, extra = {}) =>
  ({ type: 'true-false', difficulty: tezina, question: pitanje, correct: !!tocno, ...extra });
const poredaj = (pitanje, items, tezina, extra = {}) =>
  ({ type: 'ordering', difficulty: tezina, question: pitanje, items, ...extra });

/** Različite vrijednosti, korak `korak`, opcionalno s gornjom granicom zbroja. */
function vrijednosti(n, min, max, korak = 1, zbrojNajvise = Infinity) {
  for (let pokusaj = 0; pokusaj < 200; pokusaj++) {
    const skup = new Set();
    while (skup.size < n) skup.add(cijeli(Math.ceil(min / korak), Math.floor(max / korak)) * korak);
    const v = promijesaj([...skup]);
    if (v.reduce((a, b) => a + b, 0) <= zbrojNajvise) return v;
  }
  return Array.from({ length: n }, (_, i) => min + i * korak);
}

// `koje` je upitna riječ s imenicom, `jedinica` genitiv množine onoga što se broji.
const KONTEKSTI_3 = [
  { naslov: 'Omiljeno voće učenika 3. b', koje: 'Koje voće', jedinica: 'učenika', oznake: ['jabuka', 'kruška', 'banana', 'šljiva', 'naranča', 'breskva'], min: 2, max: 12 },
  { naslov: 'Posuđene knjige u školskoj knjižnici', koje: 'Koji dan', jedinica: 'knjiga', oznake: ['ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak'], min: 3, max: 20 },
  { naslov: 'Vrijeme u travnju', koje: 'Koje vrijeme', jedinica: 'dana', oznake: ['sunčano', 'oblačno', 'kišovito', 'vjetrovito'], min: 2, max: 12, zbrojNajvise: 30 },
  { naslov: 'Ptice na školskoj hranilici', koje: 'Koja ptica', jedinica: 'ptica', oznake: ['sjenica', 'vrabac', 'kos', 'zeba', 'djetlić'], min: 1, max: 15 },
  { naslov: 'Omiljeni sport u razredu', koje: 'Koji sport', jedinica: 'učenika', oznake: ['nogomet', 'košarka', 'plivanje', 'rukomet', 'odbojka'], min: 2, max: 10 },
  { naslov: 'Bodovi ekipa u razrednom kvizu', koje: 'Koja ekipa', jedinica: 'bodova', oznake: ['Sove', 'Lisice', 'Ježevi', 'Dupini'], min: 5, max: 30 },
  { naslov: 'Prodane ulaznice za školsku priredbu', koje: 'Koji razred', jedinica: 'ulaznica', oznake: ['1. a', '2. a', '3. a', '4. a'], min: 10, max: 40 },
  { naslov: 'Sakupljeni stari papir u kilogramima', koje: 'Koji razred', jedinica: 'kilograma', oznake: ['1. b', '2. b', '3. b', '4. b'], min: 10, max: 50 },
];

const KONTEKSTI_4 = [
  { naslov: 'Posjetitelji zavičajnog muzeja', koje: 'Koji mjesec', jedinica: 'posjetitelja', oznake: ['siječanj', 'veljača', 'ožujak', 'travanj', 'svibanj'], min: 100, max: 900, korak: 10 },
  { naslov: 'Prodana peciva u pekari', koje: 'Koji dan', jedinica: 'peciva', oznake: ['ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak'], min: 40, max: 200, korak: 5 },
  { naslov: 'Posađena stabla u akciji Zelena škola', koje: 'Koja škola', jedinica: 'stabala', oznake: ['OŠ Bukovac', 'OŠ Jarun', 'OŠ Retfala', 'OŠ Gripe'], min: 20, max: 150 },
  { naslov: 'Učenici u školskim sekcijama', koje: 'Koja sekcija', jedinica: 'učenika', oznake: ['zbor', 'robotika', 'likovna', 'dramska', 'sportska'], min: 8, max: 45 },
  { naslov: 'Prijeđeni kilometri na biciklističkoj utrci', koje: 'Koja ekipa', jedinica: 'kilometara', oznake: ['Orlovi', 'Sokolovi', 'Galebovi', 'Rode'], min: 120, max: 480, korak: 2 },
  { naslov: 'Stanovnici sela u zavičaju', koje: 'Koje selo', jedinica: 'stanovnika', oznake: ['Gornje Selo', 'Brestovac', 'Lipovac', 'Dubrava'], min: 250, max: 2400, korak: 50 },
  { naslov: 'Litre vode u školskom spremniku', koje: 'Koji dan', jedinica: 'litara', oznake: ['ponedjeljak', 'utorak', 'srijeda', 'četvrtak'], min: 300, max: 950, korak: 25 },
];

const prikaz = (k, oznake, v, vrsta) => {
  if (vrsta === 'graf') return { chart: oznake.map((label, i) => ({ label, value: v[i] })) };
  // Tablica: dva stupca, svaki redak jedan podatak.
  return { passage: `${k.naslov}\n\n${oznake.map((o, i) => `${o} — ${v[i]}`).join('\n')}` };
};

/**
 * Zadatci nad jednim skupom podataka. Stem nosi naziv prikaza u navodnicima
 * („…” se pri određivanju obitelji normalizira), pa ista radnja u drugom
 * kontekstu ostaje u istoj obitelji, a graf i tablica u različitim.
 */
function zadatciNadPodatcima(k, { vrsta, razred, ukljuci }) {
  const n = Math.min(k.oznake.length, razred === 3 ? 4 : 5);
  const oznake = promijesaj(k.oznake).slice(0, n);
  const v = vrijednosti(n, k.min, k.max, k.korak || 1, k.zbrojNajvise);
  const p = prikaz(k, oznake, v, vrsta);
  const gdje = vrsta === 'graf' ? `Na grafikonu „${k.naslov}”` : `U tablici „${k.naslov}”`;
  const prema = vrsta === 'graf' ? 'grafikonu' : 'tablici';
  const q = [];
  const iMax = v.indexOf(Math.max(...v)), iMin = v.indexOf(Math.min(...v));
  const zbroj = v.reduce((a, b) => a + b, 0);
  const [i1, i2] = promijesaj([...v.keys()]).slice(0, 2);
  const vise = v[i1] > v[i2] ? i1 : i2, manje = vise === i1 ? i2 : i1;
  const d = { ...p, ishod: razred === 3 ? 'MAT OŠ E.3.1' : 'MAT OŠ E.4.1' };

  const svi = {
    najvise: () => izbor(`${gdje} prikazan je broj ${k.jedinica}. ${k.koje} ima najveći broj?`, oznake[iMax], oznake, 1,
      { ...d, objasnjenje: `Najveći broj je ${v[iMax]}, a pripada podatku „${oznake[iMax]}”.` }),
    najmanje: () => izbor(`${gdje} prikazan je broj ${k.jedinica}. ${k.koje} ima najmanji broj?`, oznake[iMin], oznake, 1,
      { ...d, objasnjenje: `Najmanji broj je ${v[iMin]}, a pripada podatku „${oznake[iMin]}”.` }),
    ocitaj: () => {
      const i = cijeli(0, n - 1);
      return upis(`Prema ${prema} „${k.naslov}”, koliki je broj uz „${oznake[i]}”?`, v[i], 1,
        { ...d, objasnjenje: `Pronađi „${oznake[i]}” i pročitaj broj uz njega: ${v[i]}.` });
    },
    razlika: () => upis(`Prema ${prema} „${k.naslov}”, za koliko je broj uz „${oznake[vise]}” veći od broja uz „${oznake[manje]}”?`,
      v[vise] - v[manje], 2, { ...d, objasnjenje: `Oduzmi manji broj od većega: ${v[vise]} − ${v[manje]} = ${v[vise] - v[manje]}.` }),
    zbroj: () => upis(`Koliko je ${k.jedinica} ukupno prikazano ${vrsta === 'graf' ? 'na grafikonu' : 'u tablici'} „${k.naslov}”?`, zbroj, 2,
      { ...d, objasnjenje: `Zbroji sve podatke: ${v.join(' + ')} = ${zbroj}.` }),
    usporedba: () => {
      const tocno = Math.random() < 0.5;
      const [a, b] = tocno ? [vise, manje] : [manje, vise];
      return tocnoNetocno(`Prema ${prema} „${k.naslov}”, je li uz „${oznake[a]}” veći broj nego uz „${oznake[b]}”?`, tocno, 1,
        { ...d, objasnjenje: `Uz „${oznake[a]}” je ${v[a]}, a uz „${oznake[b]}” ${v[b]}.` });
    },
    poredaj: () => {
      const red = promijesaj([...v.keys()]).slice(0, 4).sort((x, y) => v[x] - v[y]);
      const izabrani = red.map((i) => oznake[i]);
      return poredaj(`Poredaj podatke iz ${vrsta === 'graf' ? 'grafikona' : 'tablice'} „${k.naslov}” od najmanjeg do najvećeg broja.`, izabrani, 2,
        { ...d, objasnjenje: `Brojevi redom: ${red.map((i) => v[i]).join(' < ')}.` });
    },
    dopuna: () => upis(`Prema ${prema} „${k.naslov}”, koliko nedostaje podatku „${oznake[iMin]}” da bude jednak podatku „${oznake[iMax]}”?`,
      v[iMax] - v[iMin], 2, { ...d, objasnjenje: `${v[iMin]} + ___ = ${v[iMax]}, pa nedostaje ${v[iMax] - v[iMin]}.` }),
    prag: () => {
      const sortirano = [...v].sort((a, b) => a - b);
      const prag = sortirano[cijeli(0, n - 2)];
      const koliko = v.filter((x) => x > prag).length;
      return upis(`Prema ${prema} „${k.naslov}”, uz koliko je podataka broj veći od ${prag}?`, koliko, 2,
        { ...d, objasnjenje: `Veći od ${prag}: ${v.filter((x) => x > prag).join(', ')} — to je ${koliko}.` });
    },
    tvrdnja: () => {
      const istina = `Uz „${oznake[iMax]}” je najveći broj.`;
      const iDrugi = [...v.keys()].find((i) => i !== iMax && i !== iMin);
      const lazne = [
        `Uz „${oznake[iMin]}” je najveći broj.`,
        `Uz „${oznake[iMax]}” je za ${v[iMax] - v[iMin] + (k.korak || 1)} više nego uz „${oznake[iMin]}”.`,
        `Ukupno je prikazano ${zbroj + (k.korak || 1) * 2}.`,
        `Uz „${oznake[iDrugi]}” je najmanji broj.`,
      ];
      return izbor(`Koja je tvrdnja točna prema ${prema} „${k.naslov}”?`, istina, promijesaj(lazne), 3,
        { ...d, objasnjenje: `Najveći je broj ${v[iMax]} uz „${oznake[iMax]}”; ostale tvrdnje ne slažu se s podatcima.` });
    },
    par: () => {
      const parovi = [];
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) parovi.push([i, j]);
      const zbrojevi = parovi.map(([i, j]) => v[i] + v[j]);
      const jedinstveni = parovi.filter((_, x) => zbrojevi.filter((z) => z === zbrojevi[x]).length === 1);
      if (jedinstveni.length < 4) return null;
      const [t, ...ostali] = promijesaj(jedinstveni);
      const naziv = ([i, j]) => `„${oznake[i]}” i „${oznake[j]}”`;
      return izbor(`Prema ${prema} „${k.naslov}”, koja dva podatka zajedno imaju ${v[t[0]] + v[t[1]]}?`, naziv(t), ostali.slice(0, 3).map(naziv), 3,
        { ...d, objasnjenje: `${v[t[0]]} + ${v[t[1]]} = ${v[t[0]] + v[t[1]]}.` });
    },
  };
  for (const ime of ukljuci) { const z = svi[ime](); if (z) q.push(z); }
  return q;
}

// ── 4. razred: prikupljanje i razvrstavanje (E.4.1) ─────────────────

const ANKETE = [
  { tema: 'omiljeni sport', moguce: ['nogomet', 'košarka', 'plivanje', 'rukomet'] },
  { tema: 'omiljeno godišnje doba', moguce: ['proljeće', 'ljeto', 'jesen', 'zima'] },
  { tema: 'način dolaska u školu', moguce: ['pješice', 'autobusom', 'biciklom', 'autom'] },
  { tema: 'omiljeni kućni ljubimac', moguce: ['pas', 'mačka', 'zec', 'ribica'] },
];

function popisZaBrojanje() {
  const a = ANKETE[cijeli(0, ANKETE.length - 1)];
  const v = vrijednosti(a.moguce.length, 1, 7);
  const odgovori = promijesaj(a.moguce.flatMap((m, i) => Array(v[i]).fill(m)));
  const passage = `Učenici su zapisali ${a.tema}:\n\n${odgovori.join(', ')}`;
  const i = cijeli(0, a.moguce.length - 1);
  const iMax = v.indexOf(Math.max(...v));
  const d = { passage, ishod: 'MAT OŠ E.4.1' };
  return [
    upis(`Prebroji odgovore. Koliko je učenika napisalo „${a.moguce[i]}”?`, v[i], 2,
      { ...d, objasnjenje: `Riječ „${a.moguce[i]}” pojavljuje se ${v[i]} puta.` }),
    izbor(`Razvrstaj odgovore. Koji je odgovor najčešći?`, a.moguce[iMax], a.moguce, 2,
      { ...d, objasnjenje: `„${a.moguce[iMax]}” se pojavljuje ${v[iMax]} puta, više od ostalih.` }),
    upis(`Koliko je učenika ukupno sudjelovalo u ovom istraživanju?`, odgovori.length, 2,
      { ...d, objasnjenje: `Svaki zapisani odgovor je jedan učenik: ${v.join(' + ')} = ${odgovori.length}.` }),
  ];
}

const crtice = (n) => {
  const skupine = [];
  for (let i = 0; i < Math.floor(n / 5); i++) skupine.push('||||/');
  if (n % 5) skupine.push('|'.repeat(n % 5));
  return skupine.join(' ');
};

function crticeZaBrojanje() {
  const a = ANKETE[cijeli(0, ANKETE.length - 1)];
  const v = vrijednosti(a.moguce.length, 3, 16);
  const passage = `Istraživanje: ${a.tema}. Svaka crtica je jedan učenik, a ||||/ je skupina od pet.\n\n${a.moguce.map((m, i) => `${m}: ${crtice(v[i])}`).join('\n')}`;
  const i = cijeli(0, a.moguce.length - 1);
  const [x, y] = promijesaj([...v.keys()]).slice(0, 2);
  const d = { passage, ishod: 'MAT OŠ E.4.1' };
  return [
    upis(`Koliko je učenika odabralo „${a.moguce[i]}” prema crticama?`, v[i], 2,
      { ...d, objasnjenje: `Svaka skupina vrijedi 5: ${[...Array(Math.floor(v[i] / 5)).fill(5), ...(v[i] % 5 ? [v[i] % 5] : [])].join(' + ')} = ${v[i]}.` }),
    upis(`Koliko je učenika ukupno odabralo „${a.moguce[x]}” ili „${a.moguce[y]}” prema crticama?`, v[x] + v[y], 3,
      { ...d, objasnjenje: `${v[x]} + ${v[y]} = ${v[x] + v[y]}.` }),
  ];
}

// ── 4. razred: vjerojatnost (E.4.2) ─────────────────────────────────

const BOJE = [['crven', 'crvenu'], ['plav', 'plavu'], ['žut', 'žutu'], ['zelen', 'zelenu']];
// Pridjev uz broj slaže se s imenicom: 1 crvena, 2 crvene, 5 crvenih loptica.
const sBrojem = (n, osnova) => `${n} ${osnova}${['a', 'e', 'ih'][HR.oblikZa(n)]} ${HR.imeZa(n, 'loptica')}`;
const DOGADAJ = ['siguran', 'moguć', 'nemoguć'];
const veliko = (s) => s[0].toUpperCase() + s.slice(1);

function vrecica() {
  const q = [];
  const [b1, b2, b3] = promijesaj(BOJE);
  const d = { ishod: 'MAT OŠ E.4.2' };
  let n1 = cijeli(2, 9), n2 = cijeli(1, 8);
  if (n1 === n2) n2 = n1 + 1;
  const opis = `U vrećici ${HR.biti(n1)} ${sBrojem(n1, b1[0])} i ${sBrojem(n2, b2[0])}. Bez gledanja izvlačimo jednu lopticu.`;
  q.push(izbor(`${opis} Kakav je događaj „izvučena je ${b3[0]}a loptica”?`, 'nemoguć', DOGADAJ, 2,
    { ...d, objasnjenje: `U vrećici nema ${b3[0]}ih loptica, pa ${b3[1]} ne možemo izvući.` }));
  q.push(izbor(`${opis} Kakav je događaj „izvučena je ${b1[0]}a loptica”?`, 'moguć', DOGADAJ, 2,
    { ...d, objasnjenje: `${veliko(b1[1])} lopticu možemo izvući, ali možemo izvući i ${b2[1]}.` }));
  const vise = n1 > n2 ? b1 : b2, manje = n1 > n2 ? b2 : b1;
  q.push(izbor(`${opis} Koju je boju vjerojatnije izvući?`, `${vise[1]}`, [manje[1], 'obje jednako', b3[1]], 3,
    { ...d, objasnjenje: `Više je ${vise[0]}ih loptica (${Math.max(n1, n2)}) nego ${manje[0]}ih (${Math.min(n1, n2)}).` }));
  const n = cijeli(3, 12);
  q.push(izbor(`U vrećici ${HR.biti(n)} samo ${sBrojem(n, b1[0])}. Kakav je događaj „izvučena je ${b1[0]}a loptica”?`, 'siguran', DOGADAJ, 2,
    { ...d, objasnjenje: `Sve su loptice ${b1[0]}e, pa ćemo sigurno izvući ${b1[1]}.` }));
  const m = cijeli(2, 6), jednako = Math.random() < 0.5, m2 = jednako ? m : m + cijeli(1, 3);
  q.push(tocnoNetocno(`U vrećici ${HR.biti(m)} ${sBrojem(m, b1[0])} i ${sBrojem(m2, b2[0])}. Je li jednako vjerojatno izvući ${b1[1]} i ${b2[1]} lopticu?`,
    jednako, 3, { ...d, objasnjenje: jednako ? `Loptica obiju boja ima jednako mnogo (${m}).` : `${veliko(b2[0])}ih loptica ima više (${m2}), pa je vjerojatnije izvući ${b2[1]}.` }));
  return q;
}

const KOCKA = [
  ['dobiti broj 7', 'nemoguć', 'Na kocki su samo brojevi od 1 do 6.'],
  ['dobiti broj veći od 6', 'nemoguć', 'Najveći broj na kocki je 6.'],
  ['dobiti broj manji od 7', 'siguran', 'Svi brojevi na kocki manji su od 7.'],
  ['dobiti jedan od brojeva od 1 do 6', 'siguran', 'Kocka uvijek pokaže jedan od tih brojeva.'],
  ['dobiti broj 4', 'moguć', 'Broj 4 je na kocki, ali može pasti i neki drugi broj.'],
  ['dobiti paran broj', 'moguć', 'Mogu pasti 2, 4 ili 6, ali i neparan broj.'],
  ['dobiti broj veći od 3', 'moguć', 'Mogu pasti 4, 5 ili 6, ali i 1, 2 ili 3.'],
  ['dobiti broj 0', 'nemoguć', 'Na kocki nema broja 0.'],
];
const SVAKODNEVNO = [
  ['nakon ponedjeljka doći će utorak', 'siguran', 'Dani u tjednu uvijek idu istim redom.'],
  ['ovaj mjesec imat će 35 dana', 'nemoguć', 'Nijedan mjesec nema više od 31 dana.'],
  ['sutra će padati kiša', 'moguć', 'Kiša može, ali ne mora padati.'],
  ['bačeni novčić pokazat će pismo', 'moguć', 'Novčić može pokazati pismo ili glavu.'],
  ['bačeni novčić pokazat će pismo ili glavu', 'siguran', 'Novčić uvijek padne na jednu od te dvije strane.'],
  ['nakon zime doći će jesen', 'nemoguć', 'Nakon zime dolazi proljeće.'],
  ['na rođendanskoj proslavi netko će dobiti poklon', 'moguć', 'To se često dogodi, ali nije sigurno.'],
];

function dogadaji(koliko) {
  return promijesaj([
    ...KOCKA.map(([o, t, obj]) => izbor(`Bacamo običnu kocku s brojevima od 1 do 6. Kakav je događaj „${o}”?`, t, DOGADAJ, 2, { ishod: 'MAT OŠ E.4.2', objasnjenje: obj })),
    ...SVAKODNEVNO.map(([o, t, obj]) => izbor(`Kakav je događaj „${o}”?`, t, DOGADAJ, 2, { ishod: 'MAT OŠ E.4.2', objasnjenje: obj })),
  ]).slice(0, koliko);
}

// ── Javni generatori ────────────────────────────────────────────────

const OBITELJI_3 = ['najvise', 'najmanje', 'ocitaj', 'razlika', 'zbroj', 'usporedba', 'poredaj', 'dopuna', 'prag', 'tvrdnja', 'par'];

function genPodatci3() {
  const q = [];
  // Svaki kontekst jednom kao grafikon i jednom kao tablica, s različitim
  // podatcima; obitelji se raspoređuju da nijedna ne prevlada.
  promijesaj(KONTEKSTI_3).slice(0, 6).forEach((k, i) => {
    const vrsta = i % 2 ? 'tablica' : 'graf';
    const ukljuci = promijesaj(OBITELJI_3).slice(0, 7);
    q.push(...zadatciNadPodatcima(k, { vrsta, razred: 3, ukljuci }));
  });
  return q;
}

function genPodatci4() {
  const q = [];
  promijesaj(KONTEKSTI_4).slice(0, 5).forEach((k, i) => {
    const vrsta = i % 2 ? 'tablica' : 'graf';
    const ukljuci = promijesaj(OBITELJI_3).slice(0, 6);
    q.push(...zadatciNadPodatcima(k, { vrsta, razred: 4, ukljuci }));
  });
  q.push(...popisZaBrojanje(), ...popisZaBrojanje());
  q.push(...crticeZaBrojanje(), ...crticeZaBrojanje());
  q.push(...vrecica(), ...vrecica());
  q.push(...dogadaji(6));
  return q;
}

module.exports = { genPodatci3, genPodatci4, KONTEKSTI_3, KONTEKSTI_4 };
