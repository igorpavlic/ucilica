/**
 * Zavičaj i karta, Kulturna baština — 3. razred (PID).
 *
 * Zavičaj: glavne i sporedne strane svijeta, snalaženje na planu mjesta,
 *          snalaženje prema Suncu, boje na zemljovidu, tumač znakova.
 * Baština: prirodna i kulturna, materijalna i nematerijalna baština,
 *          izvori o prošlosti, gdje se što čuva, vremenska crta
 *          (desetljeće, stoljeće, poredak događaja).
 *
 * Plan mjesta i godine na vremenskoj crti biraju se pri svakom pozivu, pa
 * zadatci nisu zatvoren popis.
 */

const cijeli = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const promijesaj = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const uzmi = (arr, n) => promijesaj(arr).slice(0, n);
const izbor = (pitanje, tocno, krivi, tezina, objasnjenje, extra = {}) => {
  const answers = promijesaj([tocno, ...uzmi([...new Set(krivi)].filter((k) => k !== tocno), 3)]);
  return { type: 'choice', difficulty: tezina, question: pitanje, answers, correctIndex: answers.indexOf(tocno), objasnjenje, ...extra };
};
const upis = (pitanje, odgovor, tezina, objasnjenje, extra = {}) =>
  ({ type: 'input', difficulty: tezina, question: pitanje, correctAnswer: String(odgovor), objasnjenje, ...extra });
const tocnoNetocno = (pitanje, tocno, tezina, objasnjenje) =>
  ({ type: 'true-false', difficulty: tezina, question: pitanje, correct: tocno, objasnjenje });
const poredaj = (pitanje, items, tezina, objasnjenje, extra = {}) =>
  ({ type: 'ordering', difficulty: tezina, question: pitanje, items, objasnjenje, ...extra });
const spoji = (pitanje, pairs, tezina, objasnjenje) =>
  ({ type: 'match', difficulty: tezina, question: pitanje, pairs, objasnjenje });

// ═══════════════════════════════════════════════════════════════════
// Zavičaj i karta
// ═══════════════════════════════════════════════════════════════════

// Smjerovi u krugu, u smjeru kazaljke na satu, počevši od sjevera.
const STRANE = ['sjever', 'sjeveroistok', 'istok', 'jugoistok', 'jug', 'jugozapad', 'zapad', 'sjeverozapad'];
const KRATICE = { sjever: 'S', sjeveroistok: 'SI', istok: 'I', jugoistok: 'JI', jug: 'J', jugozapad: 'JZ', zapad: 'Z', sjeverozapad: 'SZ' };
const GLAVNE = ['sjever', 'istok', 'jug', 'zapad'];
const SPOREDNE = ['sjeveroistok', 'jugoistok', 'jugozapad', 'sjeverozapad'];
// Genitiv za „sjeverno/istočno… od” i pridjevski oblik smjera.
const PRILOG = { sjever: 'sjeverno', sjeveroistok: 'sjeveroistočno', istok: 'istočno', jugoistok: 'jugoistočno', jug: 'južno', jugozapad: 'jugozapadno', zapad: 'zapadno', sjeverozapad: 'sjeverozapadno' };

// Plan 3 × 3: [red][stupac], red 0 je gore (sjever), stupac 0 lijevo (zapad).
// Pomak (dr, ds) od središta → strana svijeta.
const SMJER_POMAKA = {
  '-1,0': 'sjever', '-1,1': 'sjeveroistok', '0,1': 'istok', '1,1': 'jugoistok',
  '1,0': 'jug', '1,-1': 'jugozapad', '0,-1': 'zapad', '-1,-1': 'sjeverozapad',
};
const ZGRADE = ['knjižnica', 'pošta', 'park', 'crkva', 'trgovina', 'bolnica', 'vrtić', 'igralište', 'ljekarna', 'tržnica', 'muzej', 'vatrogasni dom'];
// Imenice u genitivu za „od …”.
const GEN = {
  škola: 'škole', knjižnica: 'knjižnice', pošta: 'pošte', park: 'parka', crkva: 'crkve', trgovina: 'trgovine', bolnica: 'bolnice',
  vrtić: 'vrtića', igralište: 'igrališta', ljekarna: 'ljekarne', tržnica: 'tržnice', muzej: 'muzeja', 'vatrogasni dom': 'vatrogasnog doma',
};

function planMjesta() {
  const odabrane = uzmi(ZGRADE, 8);
  const mreza = [[0, 0, 0], [0, 'škola', 0], [0, 0, 0]];
  let i = 0;
  for (let r = 0; r < 3; r++) for (let s = 0; s < 3; s++) if (!(r === 1 && s === 1)) mreza[r][s] = odabrane[i++];
  const passage = `Plan mjesta. Na planu je sjever gore.\n\n${mreza.map((red) => red.join('  |  ')).join('\n')}`;
  const gdje = (ime) => { for (let r = 0; r < 3; r++) for (let s = 0; s < 3; s++) if (mreza[r][s] === ime) return [r, s]; return null; };
  const extra = { passage };
  const q = [];

  // Što je [smjer] od škole?
  for (const smjer of [...uzmi(GLAVNE, 2), ...uzmi(SPOREDNE, 1)]) {
    const [dr, ds] = Object.entries(SMJER_POMAKA).find(([, v]) => v === smjer)[0].split(',').map(Number);
    const tocno = mreza[1 + dr][1 + ds];
    q.push(izbor(`Što se nalazi ${PRILOG[smjer]} od škole?`, tocno, odabrane, SPOREDNE.includes(smjer) ? 3 : 2,
      `Sjever je gore, jug dolje, istok desno, a zapad lijevo. ${tocno[0].toUpperCase() + tocno.slice(1)} je ${PRILOG[smjer]} od škole.`, extra));
  }
  // U kojem je smjeru X od škole?
  for (const ime of uzmi(odabrane, 2)) {
    const [r, s] = gdje(ime);
    const smjer = SMJER_POMAKA[`${r - 1},${s - 1}`];
    q.push(izbor(`U kojem se smjeru od škole nalazi ${ime}?`, smjer, STRANE, 3,
      `${ime[0].toUpperCase() + ime.slice(1)} je ${r === 0 ? 'u gornjem' : r === 2 ? 'u donjem' : 'u srednjem'} redu i ${s === 0 ? 'lijevom' : s === 2 ? 'desnom' : 'srednjem'} stupcu, dakle ${PRILOG[smjer]} od škole.`, extra));
  }
  // Put između dvije zgrade u istom redu ili stupcu (bez škole)
  const parovi = [];
  for (let r = 0; r < 3; r++) for (let s = 0; s < 3; s++) for (let r2 = 0; r2 < 3; r2++) for (let s2 = 0; s2 < 3; s2++) {
    if ((r === r2) === (s === s2)) continue; // isti red XOR isti stupac
    const a = mreza[r][s], b = mreza[r2][s2];
    if (a === 'škola' || b === 'škola') continue;
    const smjer = r === r2 ? (s2 > s ? 'istok' : 'zapad') : (r2 > r ? 'jug' : 'sjever');
    parovi.push([a, b, smjer]);
  }
  const [a, b, smjer] = uzmi(parovi, 1)[0];
  q.push(izbor(`Kojim smjerom ideš od ${GEN[a]} do ${GEN[b]}?`, `prema ${smjer === 'jug' ? 'jugu' : smjer === 'sjever' ? 'sjeveru' : smjer === 'istok' ? 'istoku' : 'zapadu'}`,
    ['prema sjeveru', 'prema jugu', 'prema istoku', 'prema zapadu'], 3,
    `Na planu je sjever gore, jug dolje, istok desno, a zapad lijevo.`, extra));
  return q;
}

// Okrenut si prema X — što je desno / lijevo / iza?
function okretanje() {
  const lice = GLAVNE[cijeli(0, 3)];
  const i = STRANE.indexOf(lice);
  const strana = { desno: STRANE[(i + 2) % 8], lijevo: STRANE[(i + 6) % 8], iza: STRANE[(i + 4) % 8] };
  const kamo = ['desno', 'lijevo', 'iza'][cijeli(0, 2)];
  const pitanje = kamo === 'iza' ? 'Koja je strana svijeta iza tebe?' : `Koja je strana svijeta s tvoje ${kamo === 'desno' ? 'desne' : 'lijeve'} strane?`;
  return izbor(`Stojiš okrenut prema ${lice === 'jug' ? 'jugu' : lice === 'sjever' ? 'sjeveru' : lice === 'istok' ? 'istoku' : 'zapadu'}. ${pitanje}`,
    strana[kamo], GLAVNE, 3,
    `Redom u smjeru kazaljke na satu: sjever, istok, jug, zapad. Desno je sljedeća strana, lijevo prethodna, a iza suprotna.`);
}

const ZAVICAJ_CINJENICE = [
  izbor('Koja se strana svijeta nalazi između sjevera i istoka?', 'sjeveroistok', ['jugoistok', 'sjeverozapad', 'jugozapad'], 2, 'Sporedna strana nosi imena dviju glavnih između kojih se nalazi: sjever + istok = sjeveroistok.'),
  izbor('Koja se strana svijeta nalazi između juga i zapada?', 'jugozapad', ['jugoistok', 'sjeverozapad', 'sjeveroistok'], 2, 'Jug + zapad = jugozapad (JZ).'),
  izbor('Koja se strana svijeta nalazi između juga i istoka?', 'jugoistok', ['jugozapad', 'sjeveroistok', 'sjeverozapad'], 2, 'Jug + istok = jugoistok (JI).'),
  izbor('Koja se strana svijeta nalazi između sjevera i zapada?', 'sjeverozapad', ['sjeveroistok', 'jugozapad', 'jugoistok'], 2, 'Sjever + zapad = sjeverozapad (SZ).'),
  izbor('Kojom se kraticom označava jugoistok?', 'JI', ['SI', 'JZ', 'IJ'], 2, 'Kratica se slaže od prvih slova: jug + istok = JI.'),
  izbor('Kojom se kraticom označava sjeverozapad?', 'SZ', ['SI', 'JZ', 'ZS'], 2, 'Sjever + zapad = SZ.'),
  izbor('Gdje je Sunce u podne?', 'na jugu', ['na sjeveru', 'na istoku', 'na zapadu'], 2, 'U našim krajevima Sunce je u podne na jugu.'),
  izbor('Kojim instrumentom pouzdano određujemo strane svijeta?', 'kompasom', ['termometrom', 'ravnalom', 'satom pješčanikom'], 1, 'Magnetna igla kompasa uvijek pokazuje prema sjeveru.'),
  izbor('Što je tumač znakova (legenda) na zemljovidu?', 'objašnjenje značenja znakova i boja', ['popis ulica', 'naslov zemljovida', 'strelica prema sjeveru'], 2, 'U tumaču znakova piše što znači svaki znak i svaka boja na zemljovidu.'),
  izbor('Kojom su bojom na zemljovidu prikazane rijeke, jezera i mora?', 'plavom', ['smeđom', 'zelenom', 'crvenom'], 1, 'Vode su na zemljovidu plave.'),
  izbor('Kojom su bojom na zemljovidu prikazane nizine?', 'zelenom', ['plavom', 'smeđom', 'bijelom'], 1, 'Nizine su zelene, a što je kraj viši, boja prelazi u žutu i smeđu.'),
  izbor('Kojom su bojom na zemljovidu prikazane planine?', 'smeđom', ['zelenom', 'plavom', 'žutom'], 1, 'Najviši krajevi prikazani su tamnosmeđom bojom.'),
  tocnoNetocno('Je li na zemljovidu sjever obično gore?', true, 1, 'Zemljovidi se crtaju tako da je sjever na vrhu.'),
  tocnoNetocno('Izlazi li Sunce na zapadu?', false, 1, 'Sunce izlazi na istoku, a zalazi na zapadu.'),
  tocnoNetocno('Je li sjeveroistok glavna strana svijeta?', false, 1, 'Glavne su sjever, jug, istok i zapad; sjeveroistok je sporedna.'),
  tocnoNetocno('Pokazuje li igla kompasa prema sjeveru?', true, 1, 'Obojeni kraj magnetne igle okreće se prema sjeveru.'),
];

function genZavicajKartaDodatak() {
  const q = [...planMjesta(), ...planMjesta()];
  q.push(okretanje(), okretanje(), okretanje());
  q.push(...uzmi(ZAVICAJ_CINJENICE, 8));
  q.push(poredaj('Poredaj strane svijeta u smjeru kazaljke na satu, počevši od sjeveroistoka.', ['sjeveroistok', 'jugoistok', 'jugozapad', 'sjeverozapad'], 3,
    'U smjeru kazaljke na satu: SI → JI → JZ → SZ.'));
  return q;
}

function ocistiZavicajKarta(qs) {
  return qs.filter((q) => {
    const a = (q.answers || []).join('|');
    // Ponude bez razmaka i nečitljive kratice („S,J,I,Z”, „omjer karta/stvarnost”)
    if (/[A-Z],[A-Z]|gore,dolje|karta\/stvarnost/.test(a)) return false;
    return true;
  });
}

// ═══════════════════════════════════════════════════════════════════
// Kulturna baština
// ═══════════════════════════════════════════════════════════════════

const PRIRODNA = ['Plitvička jezera', 'slapovi rijeke Krke', 'Velebit', 'otočje Kornati', 'stara hrastova šuma'];
const KULTURNA = ['zidine Dubrovnika', 'Dioklecijanova palača u Splitu', 'Eufrazijeva bazilika u Poreču', 'dvorac Trakošćan', 'stari mlin na potoku'];
const MATERIJALNA = ['stara crkva', 'tradicijska nošnja', 'stari mlin', 'dvorac', 'stara kamena kuća'];
const NEMATERIJALNA = ['narodni ples kolo', 'klapsko pjevanje', 'bećarac', 'običaj ophoda zvončara', 'priča koju pričaju bake', 'izrada licitarskih srca'];
const IZVORI = [
  ['staro pismo', 'pisani'], ['stara knjiga', 'pisani'], ['rodni list', 'pisani'],
  ['stara fotografija', 'slikovni'], ['razglednica s prizorom grada', 'slikovni'],
  ['bakino pričanje o djetinjstvu', 'usmeni'], ['djedova pjesma iz mladosti', 'usmeni'],
  ['stari kovani novac', 'predmet'], ['glinena posuda pronađena u zemlji', 'predmet'],
];
const CUVA_SE = [
  ['stari predmeti i umjetnine', 'muzej'],
  ['knjige za posudbu', 'knjižnica'],
  ['stari dokumenti i spisi', 'arhiv'],
  ['slike i kipovi umjetnika', 'galerija'],
];
// Svaki događaj ima vjerodostojan raspon godina (željeznica u hrvatskim
// krajevima od 1860-ih, domovi zdravlja nakon 1950. …).
const DOGADAJI = [
  ['izgrađena je crkva', 1600, 1790], ['otvorena je prva škola u mjestu', 1780, 1880],
  ['izgrađen je kameni most preko rijeke', 1800, 1930], ['u mjesto je stigla željeznica', 1862, 1935],
  ['otvorena je knjižnica', 1900, 1990], ['izgrađen je dom zdravlja', 1950, 2000], ['otvoren je zavičajni muzej', 1960, 2015],
];

function vremenskaCrta() {
  const q = [];
  // Poredak tri do četiri događaja po godinama
  const n = 4;
  let parovi;
  do {
    parovi = uzmi(DOGADAJI, n).map(([d, od, do_]) => [cijeli(od, do_), d]);
  } while (new Set(parovi.map((p) => p[0])).size < n);
  const dog = parovi.map((p) => p[1]);
  const passage = `Iz prošlosti našeg mjesta:\n\n${parovi.map(([y, d]) => `${y}. — ${d}`).join('\n')}`;
  const red = [...parovi].sort((a, b) => a[0] - b[0]);
  q.push(poredaj('Poredaj događaje od najstarijeg do najnovijeg.', red.map(([y, d]) => `${y}. — ${d}`), 3,
    'Stariji događaj ima manju godinu; na vremenskoj crti stoji lijevo.', { passage }));
  // Razlika četveroznamenkastih godina izlazi iz računa 3. razreda (oduzimanje do 1000),
  // pa se pita samo poredak: najranije i najkasnije.
  q.push(izbor('Koji se događaj dogodio najkasnije?', red[n - 1][1], dog, 2, `${red[n - 1][0]}. je najveća godina na popisu.`, { passage }));
  q.push(izbor('Koji se događaj dogodio najranije?', red[0][1], dog, 2, `${red[0][0]}. je najmanja godina na popisu.`, { passage }));

  // Desetljeće i stoljeće
  const st = cijeli(2, 9);
  // „stoljeća” i „desetljeća” isti su oblik u paukalu i genitivu množine.
  q.push(upis(`Koliko je godina u ${st} stoljeća?`, st * 100, 2,
    `Jedno stoljeće ima 100 godina: ${st} · 100 = ${st * 100}.`));
  const dz = cijeli(2, 9);
  q.push(upis(`Koliko je godina u ${dz} desetljeća?`, dz * 10, 1, `Jedno desetljeće ima 10 godina: ${dz} · 10 = ${dz * 10}.`));
  return q;
}

const BASTINA_CINJENICE = [
  izbor('Što je kulturna baština?', 'sve vrijedno što su nam ostavili preci', ['samo nove zgrade u gradu', 'životinje u zoološkom vrtu', 'sve što kupimo u trgovini'], 1, 'Baštinu čine građevine, predmeti, običaji, pjesme i priče koje čuvamo od predaka.'),
  izbor('Što je običaj?', 'način na koji ljudi nešto rade i prenose s koljena na koljeno', ['novi zakon', 'vrsta biljke', 'školski predmet'], 2, 'Običaji se prenose s generacije na generaciju.'),
  izbor('Koliko je desetljeća u jednom stoljeću?', '10', ['100', '5', '1000'], 2, 'Stoljeće ima 100 godina, a desetljeće 10: 100 : 10 = 10.'),
  izbor('Zašto čuvamo kulturnu baštinu?', 'da bi i budući naraštaji znali kako se živjelo prije', ['da bismo je mogli prodati', 'jer je zakonom zabranjeno igrati se', 'da bi muzeji bili puni'], 2, 'Baština nas povezuje s precima i govori tko smo.'),
  tocnoNetocno('Mogu li stara pjesma i ples biti kulturna baština?', true, 1, 'To je nematerijalna baština — ne može se dotaknuti, ali se prenosi.'),
  tocnoNetocno('Jesu li Plitvička jezera kulturna baština koju su izgradili ljudi?', false, 2, 'Plitvička jezera su prirodna baština — nastala su bez ljudske gradnje.'),
  tocnoNetocno('Je li stoljeće razdoblje od 100 godina?', true, 1, 'Stoljeće = 100 godina, desetljeće = 10 godina.'),
  tocnoNetocno('Je li bakino pričanje izvor podataka o prošlosti?', true, 1, 'Pričanje starijih ljudi je usmeni izvor.'),
];

function genKulturnaBastinaDodatak() {
  const q = [];
  // Prirodna ili kulturna
  for (const p of uzmi(PRIRODNA, 2)) q.push(izbor(`Kojoj vrsti baštine pripada primjer „${p}”?`,
    'prirodnoj baštini', ['kulturnoj baštini'], 2, `Primjer „${p}” nastao je u prirodi, bez ljudske gradnje — to je prirodna baština.`));
  for (const k of uzmi(KULTURNA, 2)) q.push(izbor(`Kojoj vrsti baštine pripada primjer „${k}”?`,
    'kulturnoj baštini', ['prirodnoj baštini'], 2, `Primjer „${k}” izgradili su ljudi — to je kulturna baština.`));
  // Materijalna / nematerijalna
  for (const m of uzmi(MATERIJALNA, 2)) {
    q.push(izbor('Što je od navedenoga materijalna baština (može se dotaknuti)?', m, NEMATERIJALNA, 2, `${m[0].toUpperCase() + m.slice(1)} je predmet ili građevina — materijalna baština.`));
  }
  for (const n of uzmi(NEMATERIJALNA, 2)) {
    q.push(izbor('Što je od navedenoga nematerijalna baština (ne može se dotaknuti)?', n, MATERIJALNA, 2, `${n[0].toUpperCase() + n.slice(1)} se prenosi znanjem, pjesmom ili običajem — nematerijalna baština.`));
  }
  // Izvori o prošlosti
  const vrste = ['pisani', 'slikovni', 'usmeni', 'predmet'];
  for (const [i, v] of uzmi(IZVORI, 3)) {
    q.push(izbor(`Kakav je izvor o prošlosti „${i}”?`, v === 'predmet' ? 'predmet iz prošlosti' : `${v} izvor`,
      vrste.map((x) => (x === 'predmet' ? 'predmet iz prošlosti' : `${x} izvor`)), 2,
      v === 'pisani' ? 'Pisani izvor je nešto zapisano.' : v === 'slikovni' ? 'Slikovni izvor prikazuje prošlost slikom.'
        : v === 'usmeni' ? 'Usmeni izvor prenosi se pričanjem.' : 'Predmeti iz prošlosti također nam govore kako se živjelo.'));
  }
  // Gdje se što čuva — spajanje
  q.push(spoji('Spoji ono što se čuva s mjestom gdje se čuva:', CUVA_SE, 2, 'Muzej čuva predmete, knjižnica knjige, arhiv dokumente, a galerija umjetnička djela.'));
  q.push(...vremenskaCrta(), ...uzmi(BASTINA_CINJENICE, 5));
  return q;
}

function ocistiKulturnaBastina(qs) {
  return qs.filter((q) => {
    const t = q.question || '';
    // „U koje godišnje doba radimo ovo: …” — objašnjenje opisuje godišnje doba, a ne blagdan.
    if (/^U koje godišnje doba radimo ovo/.test(t)) return false;
    // Ponude različitih vrsta riječi („škola”, „tvornica” uz „čuvanje i izlaganje”)
    if (t === 'Čemu služi muzej?' || t === 'Čemu služi knjižnica?' || t === 'Što je običaj?' || t === 'Što je kulturna baština?') return false;
    return true;
  });
}

module.exports = { genZavicajKartaDodatak, genKulturnaBastinaDodatak, ocistiZavicajKarta, ocistiKulturnaBastina };
