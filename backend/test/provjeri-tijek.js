#!/usr/bin/env node
/**
 * provjeri-tijek.js — end-to-end provjera tijeka kviza bez MongoDB-a.
 *
 * Podmeće lažnu bazu u db/mongo pa prolazi cijeli put:
 *   createSession → checkAnswer (točno i netočno) → submitQuiz
 *
 * Hvata ono što provjeri-pitanja.js ne može: krivo povezane module,
 * pitanja koja odlaze klijentu s odgovorom, nevaljanu sesiju.
 *
 * Pokretanje:  npm run test:tijek
 */

const path = require('path');
const { ObjectId } = require('mongodb');

// ── lažna baza ─────────────────────────────────────────────────────
const oid = () => new ObjectId();
const ID = {
  user: oid(), subject: oid(), topic: oid(), attempt: null,
};

const kolekcije = {
  subjects: [{ _id: ID.subject, slug: 'matematika', name: 'Matematika', grade: 1, isActive: true }],
  topics: [{ _id: ID.topic, slug: 'zbrajanje', name: 'Zbrajanje do 10', icon: '➕', grade: 1, subject_id: ID.subject, isActive: true }],
  questions: [],
  quiz_attempts: [],
  progress: [],
  users: [{ _id: ID.user, username: 'test', displayName: 'Test', totalScore: 0, streak: 0, password: 'tajna' }],
};

const podudara = (doc, upit) => Object.entries(upit).every(([k, v]) => {
  if (k === '$and') return v.every((p) => podudara(doc, p));
  const dv = doc[k];
  if (v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof ObjectId)) {
    if ('$in' in v) return v.$in.some((x) => String(x) === String(dv));
    if ('$nin' in v) return !v.$nin.some((x) => String(x) === String(dv));
    if ('$ne' in v) return String(dv) !== String(v.$ne);
  }
  return String(dv) === String(v);
});

function kolekcija(ime) {
  const red = kolekcije[ime] || (kolekcije[ime] = []);
  const kursor = (docs) => ({
    sort() { return this; },
    limit(n) { return kursor(docs.slice(0, n)); },
    project() { return this; },
    toArray: async () => docs,
  });
  return {
    findOne: async (u) => red.find((d) => podudara(d, u)) || null,
    find: (u = {}) => kursor(red.filter((d) => podudara(d, u))),
    countDocuments: async (u = {}) => red.filter((d) => podudara(d, u)).length,
    insertOne: async (doc) => { const _id = doc._id || oid(); red.push({ ...doc, _id }); return { insertedId: _id }; },
    insertMany: async (docs) => {
      const ids = {};
      docs.forEach((d, i) => { const _id = d._id || oid(); red.push({ ...d, _id }); ids[i] = _id; });
      return { insertedCount: docs.length, insertedIds: ids };
    },
    updateOne: async (u, op, opt = {}) => {
      let d = red.find((x) => podudara(x, u));
      if (!d && opt.upsert) { d = { _id: oid(), ...u }; red.push(d); }
      if (!d) return { matchedCount: 0 };
      if (op.$set) Object.assign(d, op.$set);
      if (op.$inc) for (const [k, v] of Object.entries(op.$inc)) d[k] = (d[k] || 0) + v;
      return { matchedCount: 1 };
    },
    createIndex: async () => 'ok',
    aggregate: (cjevovod) => {
      let docs = red.slice();
      for (const faza of cjevovod) {
        if (faza.$match) docs = docs.filter((d) => podudara(d, faza.$match));
        if (faza.$sample) docs = docs.slice().sort(() => Math.random() - 0.5).slice(0, faza.$sample.size);
      }
      return { toArray: async () => docs };
    },
  };
}

// podmetni lažnu bazu PRIJE nego je itko zatraži
const mongoPut = require.resolve(path.join(__dirname, '..', 'db', 'mongo.js'));
require.cache[mongoPut] = {
  id: mongoPut, filename: mongoPut, loaded: true, exports: {
    connect: async () => ({ collection: kolekcija }),
    getDb: () => ({ collection: kolekcija, databaseName: 'test' }),
    getClient: () => null,
    close: async () => {},
    resolveDbName: () => 'test',
  },
};

// ── test ───────────────────────────────────────────────────────────
const { createQuizService } = require('../modules/quiz/quiz.service');

let pao = false;
const tvrdi = (uvjet, opis, detalj = '') => {
  console.log(`  ${uvjet ? '✓' : '✗'} ${opis}${uvjet || !detalj ? '' : ` — ${detalj}`}`);
  if (!uvjet) pao = true;
};

(async () => {
  console.log('\nTijek kviza (lažna baza, bez MongoDB-a)\n');
  const service = createQuizService();

  // 1) sesija
  const sesija = await service.createSession({ topicId: ID.topic, userId: ID.user, count: 7 });
  tvrdi(!!sesija.attemptId, 'createSession vraća attemptId');
  tvrdi(sesija.questions.length === 7, 'sesija sadrži 7 pitanja', `dobiveno ${sesija.questions.length}`);
  tvrdi(kolekcije.questions.length > 0, 'generator je napunio pitanja u bazu', `${kolekcije.questions.length}`);

  // 2) klijent NE SMIJE dobiti odgovor
  const procurilo = sesija.questions.filter(
    (q) => 'correctIndex' in q || 'correctAnswer' in q || 'gik' in q);
  tvrdi(procurilo.length === 0, 'pitanja klijentu ne nose točan odgovor',
    procurilo.length ? JSON.stringify(Object.keys(procurilo[0])) : '');

  // Ponuđeni odgovori imaju raspored vezan uz sesiju, a izvorni correctIndex ne izlazi klijentu.
  const spremljeniAttempt = kolekcije.quiz_attempts.find((a) => String(a._id) === String(sesija.attemptId));
  tvrdi(!!spremljeniAttempt?.answer_orders, 'sesija sprema permutaciju ponuđenih odgovora');

  // 3) točan odgovor
  const prvo = sesija.questions[0];
  const uBazi = kolekcije.questions.find((q) => String(q._id) === String(prvo._id));
  const tocan = uBazi.type === 'choice'
    ? prvo.answers.indexOf(uBazi.answers[uBazi.correctIndex])
    : uBazi.correctAnswer;
  const rez1 = await service.checkAnswer({ attemptId: sesija.attemptId, questionId: prvo._id, answer: tocan });
  tvrdi(rez1.isCorrect === true, 'checkAnswer prepoznaje točan odgovor', JSON.stringify(rez1));

  // 4) netočan odgovor
  const netocan = uBazi.type === 'choice'
    ? (tocan + 1) % uBazi.answers.length
    : `${uBazi.correctAnswer}xx`;
  const rez2 = await service.checkAnswer({ attemptId: sesija.attemptId, questionId: prvo._id, answer: netocan });
  tvrdi(rez2.isCorrect === false, 'checkAnswer prepoznaje netočan odgovor');

  // 5) dijakritici i velika slova kod input pitanja
  const inputP = sesija.questions
    .map((q) => kolekcije.questions.find((x) => String(x._id) === String(q._id)))
    .find((q) => q.type === 'input' && /[a-zA-Zčćžšđ]/.test(q.correctAnswer));
  if (inputP) {
    const r = await service.checkAnswer({
      attemptId: sesija.attemptId, questionId: inputP._id,
      answer: `  ${String(inputP.correctAnswer).toUpperCase()}  `,
    });
    tvrdi(r.isCorrect === true, 'input tolerira velika slova i razmake', `"${inputP.correctAnswer}"`);
  }

  // 6) pitanje izvan sesije mora biti odbijeno
  const tuđe = oid();
  kolekcije.questions.push({ _id: tuđe, type: 'input', correctAnswer: '1', topic_id: ID.topic, isActive: true });
  let odbijeno = false;
  try { await service.checkAnswer({ attemptId: sesija.attemptId, questionId: tuđe, answer: '1' }); }
  catch (e) { odbijeno = e.statusCode === 403; }
  tvrdi(odbijeno, 'odgovor na pitanje izvan sesije je odbijen (403)');

  // 7) predaja kviza
  const odgovori = sesija.questions.map((q) => {
    const b = kolekcije.questions.find((x) => String(x._id) === String(q._id));
    return {
      questionId: q._id,
      userAnswer: b.type === 'choice' ? q.answers.indexOf(b.answers[b.correctIndex]) : b.correctAnswer,
      timeTaken: 1200,
    };
  });
  const predaja = await service.submitQuiz({
    userId: ID.user, topicId: ID.topic, attemptId: sesija.attemptId, answers: odgovori,
  });
  tvrdi(predaja.progress.correctAnswers === 7, 'submitQuiz broji svih 7 točnih',
    `${predaja.progress.correctAnswers}`);
  tvrdi(predaja.progress.percentage === 100, 'postotak je 100');
  tvrdi(predaja.user.totalScore === 70, 'bodovi zbrojeni (7 × 10)', `${predaja.user.totalScore}`);
  tvrdi(predaja.user.streak === 1, 'niz povećan na 1', `${predaja.user.streak}`);

  // 8) dvostruka predaja mora pasti
  let dvostruka = false;
  try {
    await service.submitQuiz({ userId: ID.user, topicId: ID.topic, attemptId: sesija.attemptId, answers: odgovori });
  } catch (e) { dvostruka = e.statusCode === 409; }
  tvrdi(dvostruka, 'ponovna predaja iste sesije je odbijena (409)');

  // 9) GIK metapodaci na spremljenim pitanjima
  const sGik = kolekcije.questions.filter((q) => q.gik && q.gik.outcome);
  tvrdi(sGik.length > 0, 'spremljena pitanja nose GIK ishod',
    sGik.length ? sGik[0].gik.outcome : 'nijedno');

  // 10) FSRS — stanje vještina nakon kviza
  const stanja = kolekcije.skill_states || [];
  tvrdi(stanja.length > 0, 'kviz je upisao stanje vještina', `${stanja.length} zapisa`);
  if (stanja.length) {
    const s0 = stanja[0];
    tvrdi(!!s0.card && !!s0.card.due, 'vještina ima FSRS kartu s rokom',
      s0.card ? String(s0.card.due) : 'nema');
    tvrdi(s0.card.due > new Date(), 'rok ponavljanja je u budućnosti');
    tvrdi(s0.stats && s0.stats.ukupno === s0.stats.tocnih,
      'statistika bilježi sve točne', JSON.stringify(s0.stats));
    tvrdi(!!s0.skill && s0.skill.includes('OŠ'), 'ključ vještine je GIK ishod', s0.skill);
  }
  tvrdi(Array.isArray(predaja.vjestine) && predaja.vjestine.length > 0,
    'submitQuiz vraća sažetak vještina');

  // 11) ocjena prema brzini i točnosti
  const V = require('../services/vjestine');
  tvrdi(V.ocjena({ tocno: false, vrijemeMs: 500, difficulty: 1 }) === V.Rating.Again,
    'netočan odgovor → Again');
  tvrdi(V.ocjena({ tocno: true, vrijemeMs: 800, difficulty: 1 }) === V.Rating.Good,
    'brz točan odgovor → Good (brzina se ne vrednuje)');
  tvrdi(V.ocjena({ tocno: true, vrijemeMs: 20000, difficulty: 1 }) === V.Rating.Good,
    'spor točan odgovor → Good (brzina se ne vrednuje)');
  tvrdi(V.ocjena({ tocno: true, vrijemeMs: 20000, difficulty: 5 }) === V.Rating.Good,
    'točan odgovor → Good neovisno o težini i brzini');

  // 12) promašaj u skupini ruši ocjenu cijele vještine
  const objed = V.objediniPoVjestini([
    { skill: 'X', tocno: true, vrijemeMs: 900, difficulty: 1 },
    { skill: 'X', tocno: false, vrijemeMs: 900, difficulty: 1 },
  ]);
  tvrdi(objed.length === 1 && objed[0].ocjena === V.Rating.Hard,
    'mješovita uspješnost na istoj vještini → Hard, ne potpuno Again');

  // 13) spajanje parova — cijeli put kroz servis
  console.log('');
  const TID = oid();
  kolekcije.topics.push({ _id: TID, slug: 'zivotinje', name: 'Životinje', icon: '🐾',
    grade: 1, subject_id: ID.subject, isActive: true });

  // Deterministično: tema dobiva isključivo match pitanja, pa ih sesija mora ponuditi.
  // (Kad se generira iz genZivotinje, match je ~11 % pa je uzorak od 7 nestabilan.)
  const { GENERATORS } = require('../services/questionGenerator');
  const izGeneratora = GENERATORS.zivotinje().filter((q) => q.type === 'match').slice(0, 8);
  tvrdi(izGeneratora.length >= 4, 'generator zivotinje proizvodi match pitanja',
    `${izGeneratora.length}`);
  izGeneratora.forEach((q) => kolekcije.questions.push({
    ...q, _id: oid(), topic_id: TID, subject_id: ID.subject, grade: 1, isActive: true,
  }));

  const ses2 = await service.createSession({ topicId: TID, userId: ID.user, count: 4 });
  const matchKlijent = ses2.questions.find((q) => q.type === 'match');
  tvrdi(!!matchKlijent, 'sesija nudi pitanje tipa match');

  if (matchKlijent) {
    tvrdi(!('pairs' in matchKlijent), 'match pitanje klijentu NE nosi rješenje (pairs)');
    tvrdi(Array.isArray(matchKlijent.lijevo) && Array.isArray(matchKlijent.desno),
      'match nosi dva stupca');
    tvrdi(matchKlijent.lijevo.length === matchKlijent.desno.length, 'stupci su jednake duljine');

    const uBazi2 = kolekcije.questions.find((q) => String(q._id) === String(matchKlijent._id));
    const redoslijedDesnih = matchKlijent.desno.map((d) => d.id).join(',');
    const izvorni = matchKlijent.lijevo.map((l) => l.id).join(',');
    tvrdi(matchKlijent.desno.length < 3 || redoslijedDesnih !== izvorni,
      'desni stupac je promiješan', redoslijedDesnih);

    // točno spajanje: lijevi i → desni i
    const tocneVeze = {};
    matchKlijent.lijevo.forEach((l) => { tocneVeze[l.id] = l.id; });
    const rm1 = await service.checkAnswer({
      attemptId: ses2.attemptId, questionId: matchKlijent._id, answer: tocneVeze });
    tvrdi(rm1.isCorrect === true, 'ispravno spajanje je točno',
      `${rm1.tocnihVeza}/${rm1.ukupnoVeza}`);
    tvrdi(rm1.tocnihVeza === uBazi2.pairs.length, 'broji sve točne veze');

    // zamijeni dvije veze → netočno
    const ids = matchKlijent.lijevo.map((l) => l.id);
    const kriveVeze = { ...tocneVeze };
    kriveVeze[ids[0]] = ids[1];
    kriveVeze[ids[1]] = ids[0];
    const rm2 = await service.checkAnswer({
      attemptId: ses2.attemptId, questionId: matchKlijent._id, answer: kriveVeze });
    tvrdi(rm2.isCorrect === false, 'zamijenjene veze su netočne');
    tvrdi(rm2.tocnihVeza === uBazi2.pairs.length - 2, 'broji koliko je veza ipak točno',
      `${rm2.tocnihVeza}/${rm2.ukupnoVeza}`);
  }

  // ── ocjenjivanje upisanog odgovora ──────────────────────────────
  //
  // Prijavljena greška: "Popravi rečenicu: pada kiša" → dijete upiše
  // "Pada kiša", dobije netočno jer se očekivalo "Pada kiša.".
  // Sada se završni znak i veliko slovo traže samo kad ih zadatak i uči.
  {
    console.log('\n── ocjenjivanje upisanog odgovora ──\n');
    const J = require('../seeds/jasnoca');

    // Zadatak o pravopisu rečenice — točka i veliko slovo SU dio odgovora
    tvrdi(J.tocan('Pada kiša.', 'Pada kiša.', 'recenica') === true,
      'pravopisni zadatak: potpuno točan odgovor prolazi');
    tvrdi(J.tocan('Pada kiša', 'Pada kiša.', 'recenica') === false,
      'pravopisni zadatak: bez točke je netočno (to se i uči)');
    tvrdi(J.tocan('pada kiša.', 'Pada kiša.', 'recenica') === false,
      'pravopisni zadatak: bez velikog slova je netočno');

    // Zadatak o sadržaju — točka i veliko slovo NISU dio odgovora
    tvrdi(J.tocan('zima', 'zima', 'rijec') === true,
      'sadržajni zadatak: točan odgovor prolazi');
    tvrdi(J.tocan('zima.', 'zima', 'rijec') === true,
      'sadržajni zadatak: suvišna točka se ne kažnjava');
    tvrdi(J.tocan('Zima', 'zima', 'rijec') === true,
      'sadržajni zadatak: veliko slovo se ne kažnjava');
    tvrdi(J.tocan('  zima  ', 'zima', 'rijec') === true,
      'sadržajni zadatak: rubni razmaci se ne kažnjavaju');

    // Dijakritici su uvijek dio odgovora
    tvrdi(J.tocan('proljece', 'proljeće', 'rijec') === false,
      'dijakritici se traže i u sadržajnom zadatku');

    // Više prihvatljivih odgovora
    tvrdi(J.tocan('oči', 'oko', 'rijec', ['oči']) === true,
      'prihvaća se i naveden istoznačan odgovor');

    // Prazan odgovor nikad nije točan
    tvrdi(J.tocan('', 'zima', 'rijec') === false, 'prazan odgovor je netočan');

    // Svaki zadatak s upisom mora reći u kojem se obliku odgovara
    const opisi = Object.values(J.FORMAT).map((f) => f.tekst);
    const primjer = J.dopuniFormat({ type: 'input', question: 'Kada pada snijeg?', correctAnswer: 'zima' });
    tvrdi(opisi.some((t) => primjer.question.includes(t)),
      'zadatak s upisom dobije opis traženog oblika odgovora', primjer.question);
    tvrdi(primjer.konstrukt === 'rijec', 'uz opis se zapamti i konstrukt');

    // Gumb sa znakom nosi i ime znaka
    tvrdi(J.oznake(['.', '?', '!']).every((o) => /[a-zčćžšđ]/.test(o)),
      'gumb sa znakom nosi i ime znaka', J.oznake(['.', '?', '!']).join(' | '));
  }

  console.log('');
  if (pao) { console.log('PALO.\n'); process.exit(1); }
  console.log('Tijek kviza radi.\n');
  process.exit(0);
})().catch((e) => {
  console.error('\n✗ Iznimka:', e.stack || e.message, '\n');
  process.exit(1);
});
