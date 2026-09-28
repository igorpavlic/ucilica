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
const { buildQuestionMetadata, decideDifficultyTarget, pickBalancedQuestions } = require('./gikEngine');
const { questionFamilyKey } = require('./questionFamily');

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
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Dohvati ID-eve pitanja koja je igrač vidio u zadnjih N kvizova za danu temu
 */
async function getSeenQuestionIds(userId, topicId, rounds = 10) {
  if (!userId) return [];

  const db = getDb();
  const recent = await db.collection('progress')
    .find({ user_id: userId, topic_id: topicId })
    .sort({ completedAt: -1 })
    .limit(rounds)
    .project({ answers: 1 })
    .toArray();

  const ids = new Set();
  for (const r of recent) {
    if (Array.isArray(r.answers)) {
      for (const a of r.answers) {
        if (a.question_id) ids.add(a.question_id.toString());
      }
    }
  }
  return [...ids];
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
      grade,
      subject_id: subjectId,
      gik: buildQuestionMetadata({ topic, subject: null, difficulty: q.difficulty || 1 }),
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

  const result = await db.collection('questions').insertMany(docs);
  console.log(`  📝 Generirano ${result.insertedCount} pitanja za "${topic.name}"`);
  return result.insertedCount;
}

/**
 * Glavni entry point.
 * 
 * 1. Dohvati viđena pitanja iz zadnjih 10 kvizova igrača
 * 2. Traži neviđena pitanja u bazi
 * 3. Ako nema dovoljno → generiraj nova, spremi, traži ponovo
 * 4. Ako JOŠ nema dovoljno (sva su viđena) → vrati prazan array
 *    Frontend prikazuje poruku da treba odigrati još kvizova
 */
async function getQuizQuestions({ topic, subjectId, grade, userId, count = 7 }) {
  const db = getDb();
  const topicId = topic._id;

  // 1. Viđena pitanja
  const seenIds = await getSeenQuestionIds(userId, topicId, 10);
  const seenOids = seenIds.map(id => new ObjectId(id));

  // ID zaštita sprječava doslovno isto pitanje. Dodatno pratimo i obitelj
  // pitanja jer različiti brojevi/riječi u istome predlošku nisu stvarno nova
  // vrsta zadatka (npr. 7x "Koja riječ imenuje...?").
  const recentFamilies = new Set();
  if (seenOids.length > 0) {
    const seenQuestions = await db.collection('questions')
      .find({ _id: { $in: seenOids } })
      .project({ type: 1, question: 1 })
      .toArray();
    for (const q of seenQuestions) recentFamilies.add(questionFamilyKey(q));
  }

  const matchFresh = {
    topic_id: topicId,
    isActive: true,
    ...(seenOids.length > 0 ? { _id: { $nin: seenOids } } : {})
  };

  // 2. Širi uzorak kandidata — treba ih više od `count` da se može birati po težini
  const poolSize = Math.max(count * 6, 30);
  let pool = await db.collection('questions')
    .aggregate([{ $match: matchFresh }, { $sample: { size: poolSize } }])
    .toArray();

  // 3. Nedovoljno? Generiraj nova pa ponovi
  if (pool.length < count) {
    const generated = await generateAndStore(topic, subjectId, grade);
    if (generated > 0) {
      pool = await db.collection('questions')
        .aggregate([{ $match: matchFresh }, { $sample: { size: poolSize } }])
        .toArray();
    }
  }
  if (pool.length === 0) return [];

  // 4. Prednost vještinama koje su dospjele za ponavljanje (FSRS).
  //    Vještina je ishod iz kurikula koji pitanje nosi u gik.outcome.
  //    Ako zapne, nastavi bez prioritizacije — kviz je važniji od rasporeda.
  try {
    const sveVjestine = [...new Set(pool.map((q) => q.gik?.outcome).filter(Boolean))];
    if (sveVjestine.length > 1 && userId) {
      const dospjele = await vjestine.dospjele(userId, sveVjestine);
      if (dospjele.size > 0 && dospjele.size < sveVjestine.length) {
        const prioritet = pool.filter((q) => dospjele.has(q.gik?.outcome));
        const ostatak = pool.filter((q) => !dospjele.has(q.gik?.outcome));
        // Dospjelo ide naprijed, ostatak ostaje kao dopuna ako nema dovoljno
        if (prioritet.length >= count) pool = prioritet;
        else pool = [...prioritet, ...ostatak];
      }
    }
  } catch (err) {
    console.error('⚠️  Prioritizacija vještina preskočena:', err.message);
  }

  // 5. Težina prema dosadašnjoj uspješnosti na ovoj temi
  const stats = await getTopicStats(userId, topicId, 5);
  const { quotas } = decideDifficultyTarget(stats);
  const questions = pickBalancedQuestions(pool, count, quotas, { avoidFamilies: recentFamilies });

  // 4. Još uvijek nedovoljno? Sva pitanja su viđena u zadnjih 10 rundi.
  //    Ne vraćamo stara — korisnik mora odigrati druge teme pa se vratiti.
  return questions;
}

/**
 * Provjeri koliko neviđenih pitanja igrač ima za temu
 */
async function getFreshCount(userId, topicId) {
  const db = getDb();
  const seenIds = await getSeenQuestionIds(userId, topicId, 10);
  const seenOids = seenIds.map(id => new ObjectId(id));

  return db.collection('questions').countDocuments({
    topic_id: topicId,
    isActive: true,
    ...(seenOids.length > 0 ? { _id: { $nin: seenOids } } : {})
  });
}

module.exports = { getQuizQuestions, getTopicStats, getFreshCount, generateAndStore, GENERATORS };
