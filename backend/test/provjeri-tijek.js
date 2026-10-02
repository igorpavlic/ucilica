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

// Točkasti put ("checks.abc.attempts") kao u MongoDB-u.
const dohvati = (doc, put) => put.split('.').reduce((o, k) => (o == null ? undefined : o[k]), doc);
const postavi = (doc, put, vrijednost) => {
  const dijelovi = put.split('.');
  let o = doc;
  for (const k of dijelovi.slice(0, -1)) { if (o[k] == null || typeof o[k] !== 'object') o[k] = {}; o = o[k]; }
  o[dijelovi[dijelovi.length - 1]] = vrijednost;
};

const podudara = (doc, upit) => Object.entries(upit).every(([k, v]) => {
  if (k === '$and') return v.every((p) => podudara(doc, p));
  const dv = dohvati(doc, k);
  if (v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof ObjectId)) {
    if ('$exists' in v) return (dv !== undefined) === !!v.$exists;
    if ('$in' in v) return v.$in.some((x) => String(x) === String(dv));
    if ('$nin' in v) return !v.$nin.some((x) => String(x) === String(dv));
    if ('$ne' in v) return String(dv) !== String(v.$ne);
  }
  return String(dv) === String(v);
});

function kolekcija(ime) {
  const red = kolekcije[ime] || (kolekcije[ime] = []);
  const kursor = (docs) => ({
    // Stvarno sortiranje po prvom ključu: prozor viđenih pitanja ovisi o
    // redoslijedu kvizova (najnoviji prvi).
    sort(spec = {}) {
      const [k, smjer] = Object.entries(spec)[0] || [];
      if (!k) return this;
      return kursor([...docs].sort((a, b) => (dohvati(a, k) > dohvati(b, k) ? 1 : dohvati(a, k) < dohvati(b, k) ? -1 : 0) * smjer));
    },
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
      if (!d) return { matchedCount: 0, modifiedCount: 0 };
      if (op.$set) for (const [k, v] of Object.entries(op.$set)) postavi(d, k, v);
      if (op.$inc) for (const [k, v] of Object.entries(op.$inc)) postavi(d, k, (dohvati(d, k) || 0) + v);
      return { matchedCount: 1, modifiedCount: 1 };
    },
    deleteOne: async (u) => { const i = red.findIndex((d) => podudara(d, u)); if (i >= 0) red.splice(i, 1); return { deletedCount: i >= 0 ? 1 : 0 }; },
    deleteMany: async (u) => { const prije = red.length; for (let i = red.length - 1; i >= 0; i--) if (podudara(red[i], u)) red.splice(i, 1); return { deletedCount: prije - red.length }; },
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
  const rez1 = await service.checkAnswer({ userId: ID.user, attemptId: sesija.attemptId, questionId: prvo._id, answer: tocan });
  tvrdi(rez1.isCorrect === true, 'checkAnswer prepoznaje točan odgovor', JSON.stringify(rez1));

  // 4) netočan odgovor
  const netocan = uBazi.type === 'choice'
    ? (tocan + 1) % uBazi.answers.length
    : `${uBazi.correctAnswer}xx`;
  const rez2 = await service.checkAnswer({ userId: ID.user, attemptId: sesija.attemptId, questionId: prvo._id, answer: netocan });
  tvrdi(rez2.isCorrect === false, 'checkAnswer prepoznaje netočan odgovor');

  // 5) dijakritici i velika slova kod input pitanja
  const inputP = sesija.questions
    .map((q) => kolekcije.questions.find((x) => String(x._id) === String(q._id)))
    .find((q) => q.type === 'input' && /[a-zA-Zčćžšđ]/.test(q.correctAnswer));
  if (inputP) {
    const r = await service.checkAnswer({ userId: ID.user,
      attemptId: sesija.attemptId, questionId: inputP._id,
      answer: `  ${String(inputP.correctAnswer).toUpperCase()}  `,
    });
    tvrdi(r.isCorrect === true, 'input tolerira velika slova i razmake', `"${inputP.correctAnswer}"`);
  }

  // 6) pitanje izvan sesije mora biti odbijeno
  const tuđe = oid();
  kolekcije.questions.push({ _id: tuđe, type: 'input', correctAnswer: '1', topic_id: ID.topic, isActive: true });
  let odbijeno = false;
  try { await service.checkAnswer({ userId: ID.user, attemptId: sesija.attemptId, questionId: tuđe, answer: '1' }); }
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
  // ── Elo: mjerena težina pitanja ──────────────────────────────────
  // FSRS zna kada ponoviti; Elo zna koliko je pitanje teško. Kod generiranih
  // pitanja to je jedini način da se sazna stvarna težina.
  {
    const T = require('../services/tezina');

    tvrdi(Math.abs(T.ocekivano(1500, 1500) - 0.5) < 1e-9,
      'jednake ocjene → očekivana uspješnost 50 %');
    tvrdi(T.ocekivano(1700, 1500) > 0.7,
      'jače dijete od pitanja → veća očekivana uspješnost');

    const brzTocan = T.nakonOdgovora({ ocjenaDjeteta: 1500, ocjenaPitanja: 1500, tocno: true, vrijemeMs: 800, difficulty: 1 });
    tvrdi(brzTocan.dijete > 1500 && brzTocan.pitanje < 1500,
      'točan odgovor diže dijete i spušta pitanje', `${brzTocan.dijete}/${brzTocan.pitanje}`);

    const promasaj = T.nakonOdgovora({ ocjenaDjeteta: 1500, ocjenaPitanja: 1500, tocno: false, vrijemeMs: 800, difficulty: 1 });
    tvrdi(promasaj.dijete < 1500 && promasaj.pitanje > 1500,
      'netočan odgovor spušta dijete i diže pitanje', `${promasaj.dijete}/${promasaj.pitanje}`);

    const sporTocan = T.nakonOdgovora({ ocjenaDjeteta: 1500, ocjenaPitanja: 1500, tocno: true, vrijemeMs: 9000, difficulty: 1 });
    tvrdi(sporTocan.dijete === brzTocan.dijete,
      'brzina ne mijenja vrijednost točnog odgovora (sporost nije manjak znanja)', `${sporTocan.dijete} = ${brzTocan.dijete}`);

    // Pomaci idu u suprotnim smjerovima, ali NISU jednaki: pitanje ima manji
    // K-faktor jer ga rješava mnogo djece pa mu se ocjena prije smiri, dok
    // dijete napreduje i njegova ocjena smije dulje rasti.
    const par = T.nakonOdgovora({ ocjenaDjeteta: 1500, ocjenaPitanja: 1500, odgovoraDijete: 50, odgovoraPitanje: 50, tocno: true, vrijemeMs: 1500, difficulty: 1 });
    tvrdi((par.dijete - 1500) > 0 && (par.pitanje - 1500) < 0,
      'pomaci djeteta i pitanja idu u suprotnim smjerovima', `${par.dijete - 1500} / ${par.pitanje - 1500}`);
    tvrdi(Math.abs(par.pitanje - 1500) < Math.abs(par.dijete - 1500),
      'ocjena pitanja se mijenja sporije od ocjene djeteta',
      `K pitanja ${T.kFaktor(50, { pitanje: true })} < K djeteta ${T.kFaktor(50)}`);

    // Nakon mnogo odgovora ocjena se mora smiriti, a ne rasti bez kraja.
    let stab = 1500;
    for (let i = 0; i < 200; i++) stab = T.nakonOdgovora({ ocjenaDjeteta: stab, ocjenaPitanja: stab - 100, odgovoraDijete: i, tocno: i % 4 !== 0, vrijemeMs: 2000, difficulty: 1 }).dijete;
    tvrdi(stab > 1300 && stab < 2200, 'ocjena se ne raspliva kroz 200 odgovora', String(stab));

    // Teško pitanje koje svi rješavaju mora postati lakše.
    let p = 1800;
    for (let i = 0; i < 25; i++) p = T.nakonOdgovora({ ocjenaDjeteta: 1500, ocjenaPitanja: p, odgovoraPitanje: i, tocno: true, vrijemeMs: 1200, difficulty: 1 }).pitanje;
    tvrdi(p < 1600, 'pitanje koje svi rješavaju postaje lakše', `1800 → ${p}`);

    const raspon = T.rasponZaDijete(1500);
    tvrdi(raspon.min < 1500 && raspon.max > 1500 && raspon.max - raspon.min > 100,
      'raspon za vježbu je pomaknut prema lakšemu', JSON.stringify(raspon));

    const it = kolekcije.item_ratings || [];
    tvrdi(it.length > 0, 'kviz je upisao mjerenu težinu pitanja', `${it.length} zapisa`);
    tvrdi(it.every((z) => Number.isFinite(z.rating) && z.odgovora >= 1),
      'svaki zapis ima ocjenu i broj odgovora');

    const ur = kolekcije.user_ratings || [];
    tvrdi(ur.length === 1 && ur[0].rating !== 1500,
      'dijete je dobilo svoju ocjenu po predmetu', JSON.stringify(ur[0] && { r: ur[0].rating, n: ur[0].odgovora }));
  }

  const stanja = kolekcije.skill_states || [];
  tvrdi(stanja.length > 0, 'kviz je upisao stanje vještina', `${stanja.length} zapisa`);
  if (stanja.length) {
    const s0 = stanja[0];
    tvrdi(!!s0.card && !!s0.card.due, 'vještina ima FSRS kartu s rokom',
      s0.card ? String(s0.card.due) : 'nema');
    tvrdi(s0.card.due > new Date(), 'rok ponavljanja je u budućnosti');
    tvrdi(s0.stats && s0.stats.ukupno === s0.stats.tocnih,
      'statistika bilježi sve točne', JSON.stringify(s0.stats));
    tvrdi(!!s0.skill && /^R\d:/.test(s0.skill), 'ključ vještine je mikrovještina teme (skillId)', s0.skill);
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

    // Desne oznake ne smiju otkrivati par (ranije desni id === lijevi id).
    tvrdi(matchKlijent.desno.every((d) => !matchKlijent.lijevo.some((l) => String(l.id) === String(d.id))),
      'desne oznake spajanja ne ponavljaju lijeve ID-ove');
    const att2 = kolekcije.quiz_attempts.find((a) => String(a._id) === String(ses2.attemptId));
    const tokeni = att2.match_tokens[String(matchKlijent._id)];

    // točno spajanje: lijevi i → oznaka desnog i
    const tocneVeze = {};
    matchKlijent.lijevo.forEach((l) => { tocneVeze[l.id] = tokeni[l.id]; });
    const rm1 = await service.checkAnswer({ userId: ID.user,
      attemptId: ses2.attemptId, questionId: matchKlijent._id, answer: tocneVeze });
    tvrdi(rm1.isCorrect === true, 'ispravno spajanje je točno',
      `${rm1.tocnihVeza}/${rm1.ukupnoVeza}`);
    tvrdi(rm1.tocnihVeza === uBazi2.pairs.length, 'broji sve točne veze');

    // zamijeni dvije veze → netočno
    const ids = matchKlijent.lijevo.map((l) => l.id);
    const kriveVeze = { ...tocneVeze };
    kriveVeze[ids[0]] = tokeni[ids[1]];
    kriveVeze[ids[1]] = tokeni[ids[0]];
    const rm2 = await service.checkAnswer({ userId: ID.user,
      attemptId: ses2.attemptId, questionId: matchKlijent._id, answer: kriveVeze });
    tvrdi(rm2.isCorrect === false, 'zamijenjene veze su netočne');
    tvrdi(rm2.tocnihVeza === uBazi2.pairs.length - 2, 'broji koliko je veza ipak točno',
      `${rm2.tocnihVeza}/${rm2.ukupnoVeza}`);
  }

  // ── ocjenjivanje upisanog odgovora ──────────────────────────────
  {
    const review = await service.createReviewSession({ grade: 1, userId: ID.user, count: 3 });
    tvrdi(review.questions.length > 0 && !!review.attemptId, 'miješano ponavljanje otvara sesiju po razredu');
    const answers = review.questions.map(q => {
      const original = kolekcije.questions.find(x => String(x._id) === String(q._id));
      const userAnswer = original.type === 'choice'
        ? q.answers.indexOf(original.answers[original.correctIndex])
        : original.type === 'match' ? Object.fromEntries(original.pairs.map((_, i) => [i,
          kolekcije.quiz_attempts.find((a) => String(a._id) === String(review.attemptId)).match_tokens[String(q._id)][i]]))
        : original.type === 'ordering' ? original.items
        : original.type === 'true-false' ? original.correct : original.correctAnswer;
      return { questionId: q._id, userAnswer, timeTaken: 900 };
    });
    const result = await service.submitQuiz({ userId: ID.user, topicId: null, reviewGrade: 1,
      attemptId: review.attemptId, answers });
    tvrdi(result.progress.correctAnswers === answers.length,
      'miješano ponavljanje sprema točne odgovore', JSON.stringify(result.progress));
  }

  // ── dnevni izazov, prozor viđenih pitanja, privatnost (2026-10-02) ──
  console.log('\n── dnevni izazov, viđena pitanja, privatnost ──\n');
  {
    const tocniOdgovori = (sesija) => sesija.questions.map((q) => {
      const original = kolekcije.questions.find((x) => String(x._id) === String(q._id));
      const pokusaj = kolekcije.quiz_attempts.find((a) => String(a._id) === String(sesija.attemptId));
      const userAnswer = original.type === 'choice' ? q.answers.indexOf(original.answers[original.correctIndex])
        : original.type === 'match' ? Object.fromEntries(original.pairs.map((_, i) => [i, pokusaj.match_tokens[String(q._id)][i]]))
        : original.type === 'ordering' ? original.items
        : original.type === 'true-false' ? original.correct : original.correctAnswer;
      return { questionId: q._id, userAnswer, timeTaken: 900 };
    });

    const D = require('../services/dnevni');
    tvrdi(D.dan(new Date('2026-10-01T22:30:00Z')) === '2026-10-02', 'dnevni izazov broji dane po zagrebačkom vremenu (00:30 je već novi dan)');
    const n = D.izracunajNiz(['2026-09-29', '2026-09-30', '2026-10-01'], '2026-10-02');
    tvrdi(n.niz === 3, 'niz nije prekinut dok današnji dan ne prođe', JSON.stringify(n));
    tvrdi(D.izracunajNiz(['2026-09-28'], '2026-10-02').niz === 0, 'propušten dan prekida niz');

    const prije = await D.stanje(ID.user);
    tvrdi(!prije.odigranoDanas, 'prije izazova: danas nije odigrano');
    const dnevna = await service.createDailySession({ grade: 1, userId: ID.user });
    tvrdi(dnevna.questions.length > 0 && dnevna.topic.name === 'Dnevni izazov', 'dnevni izazov otvara miješanu sesiju', `${dnevna.questions.length}`);
    const pokusaj = kolekcije.quiz_attempts.find((a) => String(a._id) === String(dnevna.attemptId));
    tvrdi(pokusaj.dnevni === true && pokusaj.dan === D.dan(), 'sesija je označena kao dnevna, s današnjim datumom');
    const r = await service.submitQuiz({ userId: ID.user, topicId: null, reviewGrade: 1, attemptId: dnevna.attemptId, answers: tocniOdgovori(dnevna) });
    tvrdi(r.dnevni && r.dnevni.odigranoDanas && r.dnevni.niz === 1, 'predaja vraća niz od 1 dana', JSON.stringify(r.dnevni));
    const opet = await service.createDailySession({ grade: 1, userId: ID.user });
    tvrdi(opet.odigrano === true && opet.questions.length === 0, 'drugi dnevni izazov istoga dana se ne otvara');

    // Prozor viđenih pitanja: kviz star 40 dana ne skriva pitanja ako ima 10+ novijih kvizova.
    const QG = require('../services/questionGenerator');
    const staroId = oid(), novoId = oid(), tema = oid(), korisnik = oid();
    const daniUnatrag = (d) => new Date(Date.now() - d * 86400000);
    kolekcije.progress.push({ user_id: korisnik, topic_id: tema, completedAt: daniUnatrag(40), answers: [{ question_id: staroId }] });
    for (let i = 0; i < 10; i++) kolekcije.progress.push({ user_id: korisnik, topic_id: tema, completedAt: daniUnatrag(39 - i), answers: [] });
    kolekcije.progress.push({ user_id: korisnik, topic_id: tema, completedAt: daniUnatrag(2), answers: [{ question_id: novoId }] });
    const v = await QG.nedavnoVidjeno(korisnik, { topic_id: tema });
    tvrdi(v.ids.includes(String(novoId)) && !v.ids.includes(String(staroId)), 'pitanje od prije 2 dana je viđeno, ono od prije 40 dana (iza 10 kvizova) nije', JSON.stringify(v.ids));
    tvrdi(v.svjeze.has(String(novoId)), 'pitanje iz zadnja 3 kviza se ne vraća ni u nuždi');
    // Ista igra pet puta istoga dana: unutar 30 dana ostaje „viđeno” i nakon 10 kvizova.
    const k2 = oid(), t2 = oid(), jutros = oid();
    kolekcije.progress.push({ user_id: k2, topic_id: t2, completedAt: daniUnatrag(5), answers: [{ question_id: jutros }] });
    for (let i = 0; i < 12; i++) kolekcije.progress.push({ user_id: k2, topic_id: t2, completedAt: daniUnatrag(1), answers: [] });
    tvrdi((await QG.nedavnoVidjeno(k2, { topic_id: t2 })).ids.includes(String(jutros)), 'pitanje od prije 5 dana ostaje viđeno i nakon 12 novijih kvizova');

    // Prijava pitanja: sprema se uvijek, šalje se kad je SMTP podešen,
    // e-adresa roditelja ide u Reply-To; brisanje računa briše i prijave.
    {
      const PR = require('../services/prijave');
      const nodemailer = require('nodemailer');
      const pitanje = kolekcije.questions.find((x) => x.type === 'choice');
      const korisnik = { _id: ID.user, username: 'test', emailRoditelja: 'roditelj@example.hr' };
      delete process.env.SMTP_HOST;
      const bez = await PR.prijavi({ pitanje, razlog: 'Dva odgovora su točna.', korisnik });
      tvrdi(bez.poslano === false && (kolekcije.prijave || []).length === 1, 'bez SMTP-a prijava se sprema, ali ne šalje');
      const poslano = [];
      const izvorni = nodemailer.createTransport;
      nodemailer.createTransport = () => ({ sendMail: async (m) => { poslano.push(m); } });
      process.env.SMTP_HOST = 'smtp.test';
      const sa = await PR.prijavi({ pitanje, razlog: 'Pitanje je nejasno.\nBcc: napadac@example.com', korisnik });
      nodemailer.createTransport = izvorni;
      delete process.env.SMTP_HOST;
      const m = poslano[0] || {};
      tvrdi(sa.poslano && m.to === 'contact@fromrim.hr' && m.replyTo === 'roditelj@example.hr',
        'prijava ide na contact@fromrim.hr, odgovor roditelju (Reply-To)', JSON.stringify({ to: m.to, replyTo: m.replyTo }));
      tvrdi(!/[\r\n]/.test(m.subject || '') && m.text.includes(pitanje.question) && m.text.includes('Pitanje je nejasno'),
        'naslov je jedan redak, a poruka sadrži pitanje i razlog');
    }

    // Privatnost: izvoz bez lozinke, brisanje svega što pripada djetetu.
    const P = require('../services/privatnost');
    const izvoz = await P.izvoz(ID.user);
    tvrdi(izvoz.korisnik && !('password' in izvoz.korisnik) && izvoz.progress.length > 0, 'izvoz sadrži napredak, a ne sadrži lozinku');
    kolekcije.skill_states = kolekcije.skill_states || [];
    kolekcije.skill_states.push({ user_id: ID.user, skill: 'x' });
    const obrisano = await P.obrisi(ID.user);
    const ostalo = P.KORISNICKE_ZBIRKE.reduce((n, z) => n + (kolekcije[z] || []).filter((d) => String(d.user_id) === String(ID.user)).length, 0);
    tvrdi(obrisano.users === 1 && ostalo === 0 && !kolekcije.users.some((u) => String(u._id) === String(ID.user)),
      'brisanje računa uklanja korisnika i sve njegove zapise', JSON.stringify(obrisano));
    tvrdi(P.zapisPrivole().daje === 'roditelj ili skrbnik' && !!P.zapisPrivole().verzijaObavijesti, 'privola bilježi tko ju je dao i na koju verziju obavijesti');
    // Vrati korisnika za ostale provjere.
    kolekcije.users.push({ _id: ID.user, username: 'test', displayName: 'Test', totalScore: 0, streak: 0, password: 'tajna' });
  }

  {
    const orderingId = oid(), tfId = oid(), structuredAttempt = oid();
    kolekcije.questions.push({ _id: orderingId, topic_id: ID.topic, type: 'ordering',
      question: 'Poredaj korake?', items: ['prvo', 'drugo', 'treće'], objasnjenje: 'Po vremenskom redoslijedu.' });
    kolekcije.questions.push({ _id: tfId, topic_id: ID.topic, type: 'true-false',
      question: 'Je li tvrdnja točna?', correct: false, objasnjenje: 'Tvrdnja je pogrešna.' });
    kolekcije.quiz_attempts.push({ _id: structuredAttempt, user_id: ID.user, topic_id: ID.topic,
      question_ids: [orderingId, tfId], answer_orders: {}, completedAt: null });
    const correctOrder = await service.checkAnswer({ userId: ID.user, attemptId: structuredAttempt,
      questionId: orderingId, answer: ['prvo', 'drugo', 'treće'] });
    tvrdi(correctOrder.isCorrect && !!correctOrder.objasnjenje, 'redoslijed se ocjenjuje i vraća objašnjenje');
    const invalidOrder = await service.checkAnswer({ userId: ID.user, attemptId: structuredAttempt,
      questionId: orderingId, answer: ['prvo', 'prvo', 'treće'] });
    tvrdi(!invalidOrder.isCorrect, 'duplicirane stavke ne prolaze');
    const correctFalse = await service.checkAnswer({ userId: ID.user, attemptId: structuredAttempt,
      questionId: tfId, answer: false });
    tvrdi(correctFalse.isCorrect && correctFalse.correctAnswer === 'Ne', 'točno/netočno ocjenjuje boolean (pitanje → „Ne”)');
    {
      const { evaluateQuestion } = require('../modules/quiz/quiz.service');
      const pitanje = evaluateQuestion({ type: 'true-false', question: 'Smiješ li prijatelju reći lozinku?', correct: false }, false);
      const tvrdnja = evaluateQuestion({ type: 'true-false', question: 'Zimi pada snijeg.', correct: true }, true);
      tvrdi(pitanje.correctAnswer === 'Ne' && tvrdnja.correctAnswer === 'Točno', 'na pitanje se odgovara s Da/Ne, na tvrdnju s Točno/Netočno');
    }
    const absent = await service.checkAnswer({ userId: ID.user, attemptId: structuredAttempt,
      questionId: tfId, answer: 'nešto' });
    tvrdi(!absent.isCorrect, 'nevaljana tvrdnja ne prolazi');
  }

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

  // ── P0 regresije iz analize 2026-10-01 ─────────────────────────
  {
    console.log('\n── predaja, sesija i prvi pokušaj ──\n');
    const nova = async () => service.createSession({ topicId: ID.topic, userId: ID.user, count: 4 });
    const tocanOdgovor = (q) => {
      const b = kolekcije.questions.find((x) => String(x._id) === String(q._id));
      return b.type === 'choice' ? q.answers.indexOf(b.answers[b.correctIndex]) : b.correctAnswer;
    };
    const krivOdgovor = (q) => {
      const b = kolekcije.questions.find((x) => String(x._id) === String(q._id));
      return b.type === 'choice' ? (q.answers.indexOf(b.answers[b.correctIndex]) + 1) % q.answers.length : 'xx-krivo';
    };

    // a) duplikat istog pitanja
    const sA = await nova();
    const q0 = sA.questions[0];
    let dupOdbijen = false;
    try {
      await service.submitQuiz({ userId: ID.user, topicId: ID.topic, attemptId: sA.attemptId,
        answers: [0, 1, 2].map(() => ({ questionId: q0._id, userAnswer: tocanOdgovor(q0), timeTaken: 500 })) });
    } catch (e) { dupOdbijen = e.statusCode === 400; }
    tvrdi(dupOdbijen, 'isto pitanje predano više puta je odbijeno (400)');
    const sA2 = kolekcije.quiz_attempts.find((a) => String(a._id) === String(sA.attemptId));
    tvrdi(sA2.completedAt === null, 'odbijena predaja ne zaključava sesiju');

    // b) djelomična predaja ne smije izgledati kao 100 %
    const djel = await service.submitQuiz({ userId: ID.user, topicId: ID.topic, attemptId: sA.attemptId,
      answers: [{ questionId: q0._id, userAnswer: tocanOdgovor(q0), timeTaken: 500 }] });
    tvrdi(djel.progress.totalQuestions === sA.questions.length,
      'nazivnik je broj pitanja sesije', `${djel.progress.totalQuestions}/${sA.questions.length}`);
    tvrdi(djel.progress.percentage < 100 && djel.progress.complete === false,
      'djelomična predaja nije 100 % ni potpuna', JSON.stringify(djel.progress));
    const zapis = kolekcije.progress.find((p) => String(p.attempt_id) === String(sA.attemptId));
    tvrdi(zapis && zapis.complete === false && zapis.totalQuestions === sA.questions.length,
      'zapis napretka bilježi nepotpunu predaju');

    // c) istodobne predaje — samo jedna prolazi
    const sC = await nova();
    const sveC = sC.questions.map((q) => ({ questionId: q._id, userAnswer: tocanOdgovor(q), timeTaken: 500 }));
    const bodoviPrije = kolekcije.users[0].totalScore;
    const rez = await Promise.allSettled([
      service.submitQuiz({ userId: ID.user, topicId: ID.topic, attemptId: sC.attemptId, answers: sveC }),
      service.submitQuiz({ userId: ID.user, topicId: ID.topic, attemptId: sC.attemptId, answers: sveC })
    ]);
    const uspjelo = rez.filter((r) => r.status === 'fulfilled').length;
    tvrdi(uspjelo === 1, 'od dviju istodobnih predaja prolazi točno jedna', `${uspjelo}`);
    tvrdi(kolekcije.users[0].totalScore - bodoviPrije === sC.questions.length * 10,
      'bodovi su upisani samo jednom', `${kolekcije.users[0].totalScore - bodoviPrije}`);

    // d) prvi pokušaj je autoritativan
    const sD = await nova();
    const qd = sD.questions[0];
    const p1 = await service.checkAnswer({ attemptId: sD.attemptId, questionId: qd._id, answer: krivOdgovor(qd), userId: ID.user });
    const p2 = await service.checkAnswer({ attemptId: sD.attemptId, questionId: qd._id, answer: tocanOdgovor(qd), userId: ID.user });
    tvrdi(p1.prviPokusaj === true && p2.prviPokusaj === false, 'server razlikuje prvi i ponovni pokušaj');
    const sveD = sD.questions.map((q) => ({ questionId: q._id, userAnswer: tocanOdgovor(q), timeTaken: 500 }));
    const predD = await service.submitQuiz({ userId: ID.user, topicId: ID.topic, attemptId: sD.attemptId, answers: sveD });
    tvrdi(predD.progress.correctAnswers === sD.questions.length - 1,
      'naknadno ispravljen odgovor ne broji se kao točan prvi pokušaj', JSON.stringify(predD.progress));
    const zD = kolekcije.progress.find((p) => String(p.attempt_id) === String(sD.attemptId));
    const ansD = zD.answers.find((a) => String(a.question_id) === String(qd._id));
    tvrdi(ansD.pokusaja === 2 && ansD.kasnijeTocno === true, 'zapis čuva broj pokušaja i kasniji uspjeh', JSON.stringify(ansD));

    // e) checkAnswer provjerava vlasnika sesije
    const sE = await nova();
    let tudaOdbijena = false;
    try { await service.checkAnswer({ attemptId: sE.attemptId, questionId: sE.questions[0]._id, answer: 0, userId: oid() }); }
    catch (e) { tudaOdbijena = e.statusCode === 403; }
    tvrdi(tudaOdbijena, 'provjera odgovora u tuđoj sesiji je odbijena (403)');
    let anonimnaOdbijena = false;
    try { await service.checkAnswer({ attemptId: sE.attemptId, questionId: sE.questions[0]._id, answer: 0 }); }
    catch (e) { anonimnaOdbijena = e.statusCode === 403; }
    tvrdi(anonimnaOdbijena, 'neprijavljeni ne može provjeravati u tuđoj sesiji');
  }

  {
    console.log('\n── ključevi i ocjenjivanje (analiza 2026-10-01) ──\n');
    const J = require('../seeds/jasnoca');
    tvrdi(J.tocan('A', 'a', 'velikoSlovo') === false, 'veličina slova se razlikuje kad je ona predmet zadatka');
    tvrdi(J.tocan('a', 'a', 'velikoSlovo') === true, 'ispravno malo slovo prolazi');
    tvrdi(J.tocan('27 770', '27770', 'broj') === true, 'broj sa razmakom između skupina znamenki je točan');
    tvrdi(J.tocan('27770', '27 770') === true, 'broj bez razmaka jednak je zapisu s razmakom');
    tvrdi(J.tocan('8 cm', '8', 'broj', [], { pitanje: 'Koliko je cm dugačka olovka?' }) === true,
      'jedinica iz pitanja ne ruši brojčani odgovor');
    tvrdi(J.tocan('8 kg', '8', 'broj', [], { pitanje: 'Koliko je cm dugačka olovka?' }) === false,
      'pogrešna jedinica se ne priznaje');

    const { GENERATORS } = require('../services/questionGenerator');
    const r4 = GENERATORS['brojevi-milijun']();
    const kljuc = (tekst) => { const q = r4.find((x) => x.question === tekst); return q && q.answers[q.correctIndex]; };
    tvrdi(kljuc('Koliko stotica ima jedna tisuća?') === '10', 'tisuća ima 10 stotica');
    tvrdi(kljuc('Koliko tisuća ima deset tisuća?') === '10', 'deset tisuća ima 10 tisuća');
    tvrdi(kljuc('Koliko tisuća ima jedan milijun?') === '1 000', 'milijun ima 1 000 tisuća');

    // Upitna riječ i oblik ključa: "Koliko" traži broj, "Koje/Koja su" ne smije imati brojčani ključ.
    const sve = Object.entries(GENERATORS).flatMap(([slug, fn]) => fn().map((q) => ({ ...q, slug })));
    const kljucOd = (q) => q.type === 'choice' ? q.answers?.[q.correctIndex] : q.correctAnswer;
    const kolikoBezBroja = sve.filter((q) => /^Koliko\b/.test(q.question) && !/^Koliko je to\b/.test(q.question)
      && ['choice', 'input'].includes(q.type) && !/\d/.test(String(kljucOd(q))) && !/^(nula|jedan|jedna|dva|dvije|tri|četiri|pet|šest|sedam|osam|devet|deset|\p{L}*naest|\p{L}*deset|više|manje|jednako|manja|veća|jednaka|manji|veći)(\s|$)/iu.test(String(kljucOd(q))));
    tvrdi(kolikoBezBroja.length === 0, 'pitanje "Koliko…" ima brojčani ključ',
      kolikoBezBroja.slice(0, 3).map((q) => `${q.slug}: ${q.question} → ${kljucOd(q)}`).join(' | '));
    const kojeSBrojem = sve.filter((q) => /^Koj[eai] su\b/.test(q.question) && /^\d+$/.test(String(kljucOd(q))));
    tvrdi(kojeSBrojem.length === 0, 'pitanje "Koje su…" nema čisto brojčani ključ',
      kojeSBrojem.slice(0, 3).map((q) => `${q.slug}: ${q.question}`).join(' | '));
    const proturjecno = sve.filter((q) => q.type === 'input' && q.question.includes('Napiši jednu riječ.') && /\s/.test(String(q.correctAnswer).trim()));
    tvrdi(proturjecno.length === 0, 'uputa "Napiši jednu riječ." nema ključ od više riječi',
      proturjecno.slice(0, 3).map((q) => `${q.slug}: ${q.question}`).join(' | '));
    const genitiv = sve.filter((q) => /Koliko (stranica|kutova|vrhova) ima (kruga|trokuta|kvadrata|pravokutnika)\?/.test(q.question)
      || /kut koji je [^?]* je /.test(q.question) || /koji je krakovi/.test(q.question));
    tvrdi(genitiv.length === 0, 'nema poznatih negramatičnih predložaka', genitiv.slice(0, 3).map((q) => q.question).join(' | '));
    const slovoVelicina = sve.filter((q) => q.type === 'input' && /(veliko|malo)( tiskano)? slovo|velikim početnim slovom/.test(q.question) && !['velikoSlovo', 'recenica'].includes(q.konstrukt));
    tvrdi(slovoVelicina.length === 0, 'zadatci o veličini slova razlikuju veliko i malo slovo', slovoVelicina.slice(0, 2).map((q) => q.question).join(' | '));
    const novacR2 = GENERATORS['mjerenje-novac']().filter((q) => (q.question.match(/\d+(?= €)/g) || []).some((n) => Number(n) > 100)
      || /(\d+) € i (\d+) €\?/.test(q.question) && 0);
    const zbrojiIznad100 = GENERATORS['mjerenje-novac']().filter((q) => /dati (\d+) €/.test(q.question) && Number(q.question.match(/dati (\d+) €/)[1]) > 100);
    tvrdi(novacR2.length === 0 && zbrojiIznad100.length === 0, '2. razred: novčani iznosi ostaju do 100 €');
    const r2Pretvorbe = GENERATORS['mjerenje-novac']().filter((q) => /1 (km|kg|L)\b/.test(q.question));
    tvrdi(r2Pretvorbe.length === 0, '2. razred: nema pretvorbi km/kg/L', r2Pretvorbe.slice(0, 2).map((q) => q.question).join(' | '));

    // Kalibracija: predložak kao polazište, izbor prema ocjeni, analiza pitanja
    const T2 = require('../services/tezina');
    tvrdi(T2.efektivnaOcjena({ item: null, template: { rating: 1700, odgovora: 40 }, difficulty: 1 }) === 1700,
      'neizmjereni zadatak polazi od ocjene svoga predloška');
    tvrdi(T2.efektivnaOcjena({ item: { rating: 1300, odgovora: 90 }, template: { rating: 1700, odgovora: 40 }, difficulty: 1 }) < 1360,
      'dovoljno izmjeren zadatak nosi vlastitu ocjenu');
    const bazen = [1200, 1350, 1450, 1500, 1600, 1750, 1900].map((r, i) => ({ _id: i, r }));
    const izbor = T2.odaberiPoTezini(bazen, 3, 1500, (q) => q.r);
    const pIzb = izbor.map((q) => T2.ocekivano(1500, q.r));
    tvrdi(pIzb.every((p) => p >= 0.55 && p <= 0.92), 'izbor po ocjeni drži očekivanu uspješnost u pojasu 55–92 %', pIzb.map((p) => p.toFixed(2)).join(', '));
    const zapisi = [];
    for (let i = 0; i < 60; i++) {
      const o = 1200 + i * 10;
      zapisi.push({ kljuc: 'dobro', template_id: 't', ocjenaDjeteta: o, tocno: o > 1450 });
      zapisi.push({ kljuc: 'krivi-kljuc', template_id: 't', ocjenaDjeteta: o, tocno: o < 1300 });
    }
    const an = T2.analizaPitanja(zapisi);
    tvrdi(an.find((x) => x.kljuc === 'krivi-kljuc').oznake.includes('sumnjiv-kljuc') && !an.find((x) => x.kljuc === 'dobro').oznake.length,
      'analiza označava pitanje koje jača djeca češće promašuju', JSON.stringify(an.map((x) => [x.kljuc, x.rpb.toFixed(2), x.oznake])));

    // Objašnjenja: postupak, ne samo ključ
    const O = require('../services/objasnjenja');
    const ob = O.objasni({ type: 'input', question: 'Koji broj dolazi na prazno mjesto: 45 + ___ = 72?', correctAnswer: '27' });
    tvrdi(ob && /72 − 45 = 27/.test(ob.tekst), 'objašnjenje nepoznatog pribrojnika pokazuje postupak', ob && ob.tekst);
    const krivo = O.objasni({ type: 'input', question: 'Koliko je 45 + 27?', correctAnswer: '71' });
    tvrdi(krivo === null, 'objašnjenje se ne piše kad se račun ne slaže s ključem');
    const tekstovi = require('../seeds/citanje-tekstovi').TEKSTOVI;
    tvrdi(tekstovi.every((t) => t.pitanja.every((p) => p.objasnjenje && p.proces)), 'svako pitanje uz tekst ima proces i objašnjenje');

    const G = require('../services/gikEngine');
    const meta = G.buildQuestionMetadata({ topic: { slug: 'zbrajanje-100', name: 'Zbrajanje do 100', grade: 2 }, subject: null, difficulty: 1 });
    tvrdi(meta.outcome === 'MAT OŠ A.2.3' && meta.curriculumAlignment !== 'high', 'zbrajanje do 100 nosi A.2.3 bez tvrdnje "high"', JSON.stringify([meta.outcome, meta.curriculumAlignment]));
    const nepoznata = G.buildQuestionMetadata({ topic: { slug: 'nesto-novo', name: 'Nešto', grade: 2 }, subject: null, difficulty: 1 });
    tvrdi(nepoznata.outcome === null && nepoznata.curriculumAlignment === 'none', 'nepoznata tema ne dobiva izmišljeni ishod');
  }

  console.log('');
  if (pao) { console.log('PALO.\n'); process.exit(1); }
  console.log('Tijek kviza radi.\n');
  process.exit(0);
})().catch((e) => {
  console.error('\n✗ Iznimka:', e.stack || e.message, '\n');
  process.exit(1);
});
