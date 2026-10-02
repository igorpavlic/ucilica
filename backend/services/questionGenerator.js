/**
 * services/questionGenerator.js
 * 
 * Real-time generiranje pitanja koristeći iste generatore kao seed skripte.
 * Flow: generira → sprema u bazu → filtrira po povijesti igrača (zadnjih 10 kvizova)
 */

const { ObjectId } = require('mongodb');
const { getDb } = require('../db/mongo');
const EMOJI_ONLY = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\u{200D}\u{FE0F}\u{20E3}]+$/u;
const vjestine = require('./vjestine');
const { buildQuestionMetadata, decideDifficultyTarget, pickBalancedQuestions, skillKeyOf } = require('./gikEngine');
const { questionFamilyKey, orderWithoutAdjacentFamilies } = require('./questionFamily');
const tezina = require('./tezina');

/** Koliko odgovora u predmetu treba prije izbora po izmjerenoj težini. */
const MIN_ODGOVORA_ZA_ELO = Number(process.env.UCILICA_MIN_ODGOVORA_ZA_ELO || 15);
const { storedExtras } = require('./pedagogyReview');

// Generatori iz seeds/
// Razred 1
const { genSlova, genGlasovi, genRijeci, genRecenice } = require('../seeds/gen-hrvatski');
const { genBrojevi, genZbrajanje, genOduzimanje, genUsporedbe, genGeometrija, genNizovi } = require('../seeds/gen-matematika');
const { genDoba, genZivotinje, genTijelo, genObitelj, genSigurnost, genEkologija } = require('../seeds/gen-priroda');
// Razred 2
const { genImeniceRod, genGlagoli2, genRecenice2, genCitanje2, genBrojevi100, genZbrajanje100, genOduzimanje100, genMnozenjeDijeljenje, genGeometrija2, genMjerenjeNovac, genZavicaj, genDobaVrijeme, genBiljkeZivotinje, genVodaTlo, genZdravljeSigurnost2 } = require('../seeds/seed-r2');
// Razred 3
const { genVrsteRijeci, genGramatikaPravopis, genKnjizevniTekst, genJezicnoIzrazavanje, genBrojevi1000, genZbrOduz1000, genMnozDijel3, genGeometrijaMjerenje3, genZavicajKarta, genTloVodaZrak, genBiljkeZivotinje3, genGospodarskeDjelatnosti, genKulturnaBastina, genPodatci3, genNepoznati3, genCitanje3 } = require('../seeds/seed-r3');
// Razred 4
const { genVrsteRijeci4, genPravopis4, genKnjizevnost4, genMedijskaKultura, genBrojeviMilijun, genPisanoZbrOduz, genPisanoMnozDijel, genGeometrijaKutovi, genOpsegPovrsina, genKvaderKocka, genUvjetiZivota, genKrajeviHR, genLjudskoTijelo, genHrvatskaDomovina, genBiljkeZivotinje4, genPodatci4, genNepoznati4, genCitanje4 } = require('../seeds/seed-r4');

// topic slug → generator funkcija (svi razredi)
const GENERATORS = {
  // Razred 1
  'slova': genSlova,
  'glasovi': genGlasovi,
  'rijeci': genRijeci,
  'recenice': genRecenice,
  'brojevi': genBrojevi,
  'zbrajanje': genZbrajanje,
  'oduzimanje': genOduzimanje,
  'usporedi': genUsporedbe,
  'geometrija': genGeometrija,
  'nizovi': genNizovi,
  'doba': genDoba,
  'zivotinje': genZivotinje,
  'tijelo': genTijelo,
  'obitelj': genObitelj,
  'sigurnost': genSigurnost,
  'ekologija': genEkologija,
  // Razred 2
  'imenice-rod': genImeniceRod,
  'glagoli-2': genGlagoli2,
  'recenice-2': genRecenice2,
  'citanje-2': genCitanje2,
  'brojevi-100': genBrojevi100,
  'zbrajanje-100': genZbrajanje100,
  'oduzimanje-100': genOduzimanje100,
  'mnozenje-dijeljenje': genMnozenjeDijeljenje,
  'geometrija-2': genGeometrija2,
  'mjerenje-novac': genMjerenjeNovac,
  'zavicaj': genZavicaj,
  'doba-vrijeme': genDobaVrijeme,
  'biljke-zivotinje': genBiljkeZivotinje,
  'voda-tlo': genVodaTlo,
  'zdravlje-sigurnost-2': genZdravljeSigurnost2,
  'citanje-3': genCitanje3,
  'podatci-3': genPodatci3,
  'nepoznati-3': genNepoznati3,
  'citanje-4': genCitanje4,
  'podatci-4': genPodatci4,
  'nepoznati-4': genNepoznati4,
  // Razred 3
  'vrste-rijeci': genVrsteRijeci,
  'gramatika-pravopis': genGramatikaPravopis,
  'knjizevni-tekst': genKnjizevniTekst,
  'jezicno-izrazavanje': genJezicnoIzrazavanje,
  'brojevi-1000': genBrojevi1000,
  'zbr-oduz-1000': genZbrOduz1000,
  'mnoz-dijel-3': genMnozDijel3,
  'geometrija-mjerenje-3': genGeometrijaMjerenje3,
  'zavicaj-karta': genZavicajKarta,
  'tlo-voda-zrak': genTloVodaZrak,
  'biljke-zivotinje-3': genBiljkeZivotinje3,
  'gospodarske-djelatnosti': genGospodarskeDjelatnosti,
  'kulturna-bastina': genKulturnaBastina,
  // Razred 4
  'vrste-rijeci-4': genVrsteRijeci4,
  'pravopis-4': genPravopis4,
  'knjizevnost-4': genKnjizevnost4,
  'medijska-kultura': genMedijskaKultura,
  'brojevi-milijun': genBrojeviMilijun,
  'pisano-zbr-oduz': genPisanoZbrOduz,
  'pisano-mnoz-dijel': genPisanoMnozDijel,
  'geometrija-kutovi': genGeometrijaKutovi,
  'opseg-povrsina': genOpsegPovrsina,
  'kvader-kocka': genKvaderKocka,
  'uvjeti-zivota': genUvjetiZivota,
  'krajevi-hr': genKrajeviHR,
  'ljudsko-tijelo': genLjudskoTijelo,
  'hrvatska-domovina': genHrvatskaDomovina,
  'biljke-zivotinje-4': genBiljkeZivotinje4,
  // Nove teme: Informatika, Ja i drugi, Promet i bicikl, Novac i kupovina
  ...require('../seeds/nove-teme').GENERATORI,
};

const jsonIliPrazno = (v) => (v && (!Array.isArray(v) || v.length) ? JSON.stringify(v) : '');
/**
 * Što dijete stvarno vidi: tekst pitanja, slika, tekst za čitanje, grafikon,
 * mreža, parovi/stavke i točan odgovor. Isto pitanje s drugim netočnim
 * ponudama nije novo; „Koji je zapis pravilan?” s drugim točnim zapisom jest.
 */
function kljucPrikaza(q) {
  const tocno = q.type === 'choice' ? q.answers?.[q.correctIndex] : '';
  const parovi = Array.isArray(q.pairs) ? q.pairs.map((p) => `${p.left ?? p[0]}=${p.right ?? p[1]}`).sort().join(';') : '';
  const stavke = Array.isArray(q.items) ? [...q.items].sort().join(';') : '';
  return [kljucTeksta(q), q.visual || '', q.passage || '', jsonIliPrazno(q.chart), jsonIliPrazno(q.mreza), tocno, parovi, stavke].join('\u0001');
}
/** Sam tekst pitanja (bez razmaka na rubovima i višestrukih razmaka). */
function kljucTeksta(q) {
  return String(q.question || '').replace(/\s+/g, ' ').trim();
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pitanje je „nedavno viđeno” ako je bilo u kvizu u zadnjih N dana ili u
// zadnjih MIN_KVIZOVA kvizova (što god pokriva više). Prije je vrijedilo samo
// „zadnjih 10 kvizova”: dijete koje istu temu igra pet puta na dan potrošilo bi
// taj prozor za dva dana i dobivalo pitanja od prošlog tjedna.
const VIDJENO_DANA = Number(process.env.UCILICA_VIDJENO_DANA) || 30;
const MIN_KVIZOVA = 10;
const MAX_KVIZOVA = 300;          // gornja granica čitanja povijesti
const NE_PONAVLJAJ_KVIZOVA = 3;   // čak ni u nuždi ne vraćaj pitanja iz zadnja 3 kviza

/**
 * Nedavno viđena pitanja igrača u danom opsegu (tema ili razred).
 * Vraća `ids` (nedavno viđeni ID-evi), `zadnjiPut` (ID → datum kad je zadnji
 * put viđeno) i `svjeze` (ID-evi iz zadnjih NE_PONAVLJAJ_KVIZOVA kvizova).
 */
async function nedavnoVidjeno(userId, opseg, { dana = VIDJENO_DANA, sada = new Date() } = {}) {
  const prazno = { ids: [], zadnjiPut: new Map(), svjeze: new Set() };
  if (!userId) return prazno;
  const granica = new Date(sada.getTime() - dana * 24 * 60 * 60 * 1000);
  const kvizovi = await getDb().collection('progress')
    .find({ user_id: userId, ...opseg })
    .sort({ completedAt: -1 })
    .limit(MAX_KVIZOVA)
    .project({ answers: 1, completedAt: 1 })
    .toArray();

  const ids = new Set(), zadnjiPut = new Map(), svjeze = new Set();
  kvizovi.forEach((k, i) => {
    const nedavno = i < MIN_KVIZOVA || (k.completedAt && new Date(k.completedAt) >= granica);
    for (const a of k.answers || []) {
      if (!a.question_id) continue;
      const id = a.question_id.toString();
      if (!zadnjiPut.has(id)) zadnjiPut.set(id, k.completedAt ? new Date(k.completedAt) : new Date(0));
      if (nedavno) ids.add(id);
      if (i < NE_PONAVLJAJ_KVIZOVA) svjeze.add(id);
    }
  });
  return { ids: [...ids], zadnjiPut, svjeze };
}

/** ID-evi pitanja koja je igrač nedavno vidio u temi (vidi `nedavnoVidjeno`). */
async function getSeenQuestionIds(userId, topicId) {
  return (await nedavnoVidjeno(userId, { topic_id: topicId })).ids;
}

/**
 * Uspješnost učenika na temi iz zadnjih N rundi — ulaz za odabir težine.
 */
async function getTopicStats(userId, topicId, rounds = 5) {
  if (!userId) return { accuracy: 0.65, streak: 0 };
  const db = getDb();
  const recent = await db.collection('progress')
    .find({ user_id: userId, topic_id: topicId })
    .sort({ completedAt: -1 })
    .limit(rounds)
    .project({ totalQuestions: 1, correctAnswers: 1 })
    .toArray();

  if (recent.length === 0) return { accuracy: 0.65, streak: 0 };

  const uk = recent.reduce((s, r) => s + (r.totalQuestions || 0), 0);
  const tocno = recent.reduce((s, r) => s + (r.correctAnswers || 0), 0);

  // niz uzastopnih rundi s >= 80 % točnosti, od najnovije
  let streak = 0;
  for (const r of recent) {
    if (r.totalQuestions > 0 && r.correctAnswers / r.totalQuestions >= 0.8) streak++;
    else break;
  }
  return { accuracy: uk > 0 ? tocno / uk : 0.65, streak };
}

/**
 * Pokreni generator i spremi nova pitanja u bazu.
 * Vraća broj umetnutih dokumenata.
 */
async function generateAndStore(topic, subjectId, grade, requestedCount = null) {
  const gen = GENERATORS[topic.slug];
  if (!gen) return 0;

  const db = getDb();

  let raw;
  try {
    raw = gen();
    if (typeof requestedCount == 'number' && requestedCount > 0) {
      raw = raw.slice(0, requestedCount);
    }
  } catch (err) {
    console.error(`Generator greška [${topic.slug}]:`, err.message);
    return 0;
  }
  if (!raw || !raw.length) return 0;

  const docs = raw.map(q => {
    // Razriješi correctIndex za pitanja s _c poljem (shuffle pattern)
    let ci = q.correctIndex;
    if (ci === -1 && q._c && Array.isArray(q.answers)) {
      ci = q.answers.indexOf(q._c);
      if (ci === -1) ci = 0; // fallback
    }

    return {
      type: q.type,
      difficulty: q.difficulty || 1,
      question: q.question,
      visual: q.visual || '',
      hint: q.hint || '',
      objasnjenje: q.objasnjenje || '',
      passage: q.passage || '',
      chart: q.chart || [],
      answers: q.answers || [],
      ...(q.type === 'choice' ? { correctIndex: ci } : {}),
      ...(q.type === 'input' ? { correctAnswer: q.correctAnswer, placeholder: q.placeholder || '' } : {}),
      // konstrukt = što se pitanjem zapravo provjerava; određuje strogoću ocjene
      ...(q.konstrukt ? { konstrukt: q.konstrukt } : {}),
      ...(q.prihvatljivi?.length ? { prihvatljivi: q.prihvatljivi } : {}),
      ...(q.type === 'match' ? { pairs: q.pairs } : {}),
      ...(q.type === 'ordering' ? { items: q.items } : {}),
      ...(q.type === 'true-false' ? { correct: q.correct } : {}),
      ...storedExtras(q),
      grade,
      subject_id: subjectId,
      gik: buildQuestionMetadata({ topic, subject: null, difficulty: q.difficulty || 1, question: q }),
      topic_id: topic._id,
      isActive: true,
      createdAt: new Date()
    };
  }).filter(d => {
    // Nikad ne upisuj input pitanje čiji je odgovor emoji — dijete ga ne može utipkati
    if (d.type === 'input' && EMOJI_ONLY.test(String(d.correctAnswer || '').trim())) return false;
    // Odbaci choice pitanja bez valjanog correctIndex
    if (d.type === 'choice' && (d.correctIndex === undefined || d.correctIndex < 0)) return false;
    // Odbaci input pitanja bez odgovora
    if (d.type === 'input' && !d.correctAnswer) return false;
    // Spajanje treba 3-5 parova; manje je trivijalno, više je previše za dijete
    if (d.type === 'match' && (!Array.isArray(d.pairs) || d.pairs.length < 3 || d.pairs.length > 5)) return false;
    if (d.type === 'ordering' && (!Array.isArray(d.items) || d.items.length < 3 || d.items.length > 5 || new Set(d.items).size !== d.items.length)) return false;
    if (d.type === 'true-false' && typeof d.correct !== 'boolean') return false;
    return true;
  });

  if (!docs.length) return 0;

  // Ne upisuj zadatak koji u temi već postoji (isti itemKey). Ranije se pri
  // svakom „iscrpljivanju” upisivao cijeli izlaz generatora iznova, pa je isti
  // zadatak dobivao novi _id i djetetu se vraćao kao „novo” pitanje
  // (simulirani pilot: +27 % duplikata u banci).
  const postojeci = new Set((await db.collection('questions')
    .find({ topic_id: topic._id, itemKey: { $exists: true } }).project({ itemKey: 1 }).toArray())
    .map((q) => q.itemKey));
  const noviDocs = docs.filter((d) => !d.itemKey || !postojeci.has(d.itemKey));
  if (!noviDocs.length) return 0;

  const result = await db.collection('questions').insertMany(noviDocs);
  console.log(`  📝 Generirano ${result.insertedCount} pitanja za "${topic.name}"`);
  return result.insertedCount;
}

/**
 * Glavni entry point.
 * 
 * 1. Dohvati pitanja viđena u zadnjih 30 dana (najmanje zadnjih 10 kvizova teme)
 * 2. Traži neviđena pitanja u bazi
 * 3. Ako nema dovoljno → generiraj nova, spremi, traži ponovo
 * 4. Ako JOŠ nema dovoljno → dopuni pitanjima koja dijete najdulje nije vidjelo
 *    (osim onih iz zadnja 3 kviza); prazan kviz samo ako ni toga nema
 */
async function getQuizQuestions({ topic, subjectId, grade, userId, count = 7 }) {
  const db = getDb();
  const topicId = topic._id;

  // 1. Viđena pitanja (zadnjih 30 dana / najmanje zadnjih 10 kvizova teme)
  const vidjeno = await nedavnoVidjeno(userId, { topic_id: topicId });
  const seenIds = vidjeno.ids;
  const seenOids = seenIds.map(id => new ObjectId(id));

  // ID zaštita sprječava doslovno isto pitanje. Dodatno pratimo i obitelj
  // pitanja jer različiti brojevi/riječi u istome predlošku nisu stvarno nova
  // vrsta zadatka (npr. 7x "Koja riječ imenuje...?").
  const recentFamilies = new Set();
  // Obitelj → kad ju je dijete zadnji put vidjelo. Kad su sve obitelji teme već
  // viđene (mala tema, mnogo kvizova), prednost ima ona viđena NAJDAVNIJE —
  // inače bi se „Tko je drugi u redu?” vraćao svaki drugi kviz.
  const obiteljZadnjiPut = new Map();
  if (seenOids.length > 0) {
    const seenQuestions = await db.collection('questions')
      .find({ _id: { $in: seenOids } })
      .project({ type: 1, question: 1 })
      .toArray();
    for (const q of seenQuestions) {
      const f = questionFamilyKey(q);
      recentFamilies.add(f);
      const t = vidjeno.zadnjiPut.get(String(q._id))?.getTime?.() ?? 0;
      if (!obiteljZadnjiPut.has(f) || obiteljZadnjiPut.get(f) < t) obiteljZadnjiPut.set(f, t);
    }
  }
  // 0 = obitelj nikad viđena; veći broj = viđena nedavnije
  const starostObitelji = (q) => obiteljZadnjiPut.get(questionFamilyKey(q)) ?? 0;

  // Isti tekst (s istom slikom/tekstom za čitanje) pod drugim _id-em — npr.
  // isto pitanje s drukčijim netočnim odgovorima — za dijete NIJE novo pitanje.
  // Zato se uz ID-eve prati i prikaz, a uz prikaz i sam tekst pitanja: tekst
  // koji dijete još nije vidjelo ima prednost pred istim tekstom s novom slikom.
  const prikazZadnjiPut = new Map(), tekstZadnjiPut = new Map(), svjeziPrikazi = new Set();
  const zabiljezi = (mapa, k, t) => { if (!mapa.has(k) || mapa.get(k) < t) mapa.set(k, t); };
  const KLJUC_POLJA = { question: 1, visual: 1, passage: 1, chart: 1, mreza: 1, type: 1, answers: 1, correctIndex: 1, pairs: 1, items: 1 };

  // 2. Kandidati: sva aktivna pitanja teme koja dijete nije vidjelo po ID-u
  //    ni po prikazu (lagana projekcija; cijeli dokumenti tek za odabrane).
  const lagano = (upit) => db.collection('questions').find(upit).project(KLJUC_POLJA).toArray();
  if (seenOids.length > 0) {
    for (const q of await lagano({ _id: { $in: seenOids } })) {
      const t = vidjeno.zadnjiPut.get(String(q._id))?.getTime?.() ?? 0;
      zabiljezi(prikazZadnjiPut, kljucPrikaza(q), t);
      zabiljezi(tekstZadnjiPut, kljucTeksta(q), t);
      if (vidjeno.svjeze.has(String(q._id))) svjeziPrikazi.add(kljucPrikaza(q));
    }
  }
  const matchFresh = {
    topic_id: topicId,
    isActive: true,
    ...(seenOids.length > 0 ? { _id: { $nin: seenOids } } : {})
  };
  const svjeziKandidati = async () => {
    const jedinstveni = new Map();
    for (const q of shuffle(await lagano(matchFresh))) {
      const k = kljucPrikaza(q);
      if (!prikazZadnjiPut.has(k) && !jedinstveni.has(k)) jedinstveni.set(k, q);
    }
    return [...jedinstveni.values()];
  };
  let kandidati = await svjeziKandidati();

  // 3. Nedovoljno novih tekstova? Generiraj nova (generator je nasumičan, pa
  //    nekoliko pokušaja) i ponovi.
  const noviTekstovi = () => kandidati.filter((q) => !tekstZadnjiPut.has(kljucTeksta(q))).length;
  for (let pokusaj = 0; pokusaj < 3 && noviTekstovi() < count; pokusaj++) {
    if (!(await generateAndStore(topic, subjectId, grade))) break;
    kandidati = await svjeziKandidati();
  }

  // Redoslijed: najprije tekst koji dijete nikad nije vidjelo, pa onaj viđen
  // najdavnije; unutar toga obitelj viđena najdavnije (sort je stabilan, a
  // kandidati su promiješani).
  const starostTeksta = (q) => tekstZadnjiPut.get(kljucTeksta(q)) ?? 0;
  const poStarosti = (a, b) => (starostTeksta(a) - starostTeksta(b)) || (starostObitelji(a) - starostObitelji(b));
  kandidati.sort(poStarosti);
  // Isti tekst dvaput u istom kvizu samo ako drukčijih nema dovoljno.
  const vidjenTekst = new Set(), prvi = [], drugi = [];
  for (const q of kandidati) (vidjenTekst.has(kljucTeksta(q)) ? drugi : (vidjenTekst.add(kljucTeksta(q)), prvi)).push(q);
  kandidati = [...prvi, ...drugi];

  // Kad ima dovoljno neviđenih tekstova, biraj samo među njima; inače uzmi sve
  // neviđene i dopuni najdavnije viđenima (tada izbor po težini ne smije
  // preskočiti neviđeno, pa je bazen točno `count`).
  const poolSize = Math.max(count * 6, 30);
  const brojNovih = noviTekstovi();
  let odabrani = brojNovih >= count
    ? kandidati.filter((q) => !tekstZadnjiPut.has(kljucTeksta(q))).slice(0, poolSize)
    : kandidati.slice(0, count);

  // 3b. Ni generator nije dao dovoljno (mala tema s ručno pisanim pitanjima)?
  //     Umjesto praznog kviza dopuni pitanjima koja dijete NAJDULJE nije
  //     vidjelo — najprije ne onima iz zadnja tri kviza, a tek ako ni tada
  //     nema dovoljno, i njima (kratak kviz bolji je od praznoga).
  if (odabrani.length < count && seenOids.length > 0) {
    const vec = new Set(odabrani.map(kljucPrikaza));
    const stari = [...seenIds].sort((a, b) => vidjeno.zadnjiPut.get(a) - vidjeno.zadnjiPut.get(b));
    const redoslijed = new Map(stari.map((id, i) => [id, i]));
    const nadjeni = (await lagano({ _id: { $in: stari.map((id) => new ObjectId(id)) }, topic_id: topicId, isActive: true }))
      .sort((a, b) => redoslijed.get(String(a._id)) - redoslijed.get(String(b._id)));
    for (const dopustiSvjeze of [false, true]) {
      for (const q of nadjeni) {
        if (odabrani.length >= count) break;
        const k = kljucPrikaza(q);
        // prikaz iz zadnja tri kviza ne vraćaj ni pod drugim _id-em
        if (vec.has(k) || (!dopustiSvjeze && svjeziPrikazi.has(k))) continue;
        vec.add(k); odabrani.push(q);
      }
    }
  }
  if (odabrani.length === 0) return [];

  // Cijeli dokumenti samo za odabrane kandidate, u istom redoslijedu
  const redPoola = new Map(odabrani.map((q, i) => [String(q._id), i]));
  let pool = (await db.collection('questions').find({ _id: { $in: odabrani.map((q) => q._id) } }).toArray())
    .sort((a, b) => redPoola.get(String(a._id)) - redPoola.get(String(b._id)));

  // 4. Prednost vještinama koje su dospjele za ponavljanje (FSRS).
  //    Vještina je gik.skillId (tema kao mikrovještina); starija pitanja padaju na gik.outcome.
  //    Ako zapne, nastavi bez prioritizacije — kviz je važniji od rasporeda.
  try {
    const sveVjestine = [...new Set(pool.map((q) => skillKeyOf(q)).filter(Boolean))];
    if (sveVjestine.length > 1 && userId) {
      const dospjele = await vjestine.dospjele(userId, sveVjestine);
      if (dospjele.size > 0 && dospjele.size < sveVjestine.length) {
        const prioritet = pool.filter((q) => dospjele.has(skillKeyOf(q)));
        const ostatak = pool.filter((q) => !dospjele.has(skillKeyOf(q)));
        // Dospjelo ide naprijed, ostatak ostaje kao dopuna ako nema dovoljno
        if (prioritet.length >= count) pool = prioritet;
        else pool = [...prioritet, ...ostatak];
      }
    }
  } catch (err) {
    console.error('⚠️  Prioritizacija vještina preskočena:', err.message);
  }

  // 5. Težina. Kad dijete ima dovoljno odgovora u predmetu, bira se prema
  //    izmjerenoj (Elo) težini zadatka i predloška, s ciljem ~75 % uspjeha.
  //    Inače (hladni početak) kvote prema autorskoj oznaci težine.
  let questions = null;
  try {
    if (userId) {
      const dijete = await db.collection('user_ratings').findOne({ user_id: userId, subject_id: subjectId });
      if (dijete && dijete.odgovora >= MIN_ODGOVORA_ZA_ELO) {
        const { item, template } = await tezina.ocjeneZa(pool.map((q) => ({ questionId: q._id, itemKey: q.itemKey, templateId: q.templateId })));
        const ocjena = (q) => tezina.efektivnaOcjena({
          item: item.get(tezina.kljucZadatka({ questionId: q._id, itemKey: q.itemKey })),
          template: q.templateId ? template.get(q.templateId) : null,
          difficulty: q.difficulty
        });
        questions = orderWithoutAdjacentFamilies(tezina.odaberiPoTezini(pool, count, dijete.rating, ocjena,
          { familyKey: questionFamilyKey, avoidFamilies: recentFamilies, starost: starostObitelji }));
      }
    }
  } catch (err) {
    console.error('⚠️  Izbor po izmjerenoj težini preskočen:', err.message);
    questions = null;
  }
  if (!questions) {
    const stats = await getTopicStats(userId, topicId, 5);
    const { quotas } = decideDifficultyTarget(stats);
    questions = pickBalancedQuestions(pool, count, quotas, { avoidFamilies: recentFamilies });
  }

  return questions;
}

/**
 * Provjeri koliko neviđenih pitanja igrač ima za temu
 */
async function getFreshCount(userId, topicId) {
  const db = getDb();
  const seenIds = await getSeenQuestionIds(userId, topicId);
  const seenOids = seenIds.map(id => new ObjectId(id));

  return db.collection('questions').countDocuments({
    topic_id: topicId,
    isActive: true,
    ...(seenOids.length > 0 ? { _id: { $nin: seenOids } } : {})
  });
}

module.exports = { getQuizQuestions, getTopicStats, getFreshCount, generateAndStore, nedavnoVidjeno, VIDJENO_DANA, GENERATORS };
