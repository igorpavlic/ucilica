const { getQuizQuestions, generateAndStore } = require('../../services/questionGenerator');
const { quizRepository } = require('./quiz.repository');
const vjestine = require('../../services/vjestine');
const tezina = require('../../services/tezina');
const { tocan, ocisti } = require('../../seeds/jasnoca');
const { getDb } = require('../../db/mongo');
const { questionFamilyKey } = require('../../services/questionFamily');
const { skillKeyOf } = require('../../services/gikEngine');
const obradjeno = require('../../services/obradjeno');
const crypto = require('crypto');

function createHttpError(status, message) {
  const error = new Error(message);
  error.statusCode = status;
  return error;
}

function mapSafeQuestion(question, answerOrder = null, matchTokens = null) {
  const osnovno = {
    _id: question._id,
    type: question.type,
    question: question.question,
    visual: question.visual || '',
    passage: question.passage || '',
    chart: question.chart || [],
    hint: question.hint || '',
    answers: question.type === 'choice' && Array.isArray(answerOrder)
      ? answerOrder.map((index) => question.answers[index])
      : (question.answers || []),
    placeholder: question.placeholder || 'Upiši odgovor...',
    difficulty: question.difficulty || 1
  };

  // Spajanje parova: klijent dobiva dva stupca bez veze među njima.
  // Desni članovi nose nasumične sesijske oznake — ranije su nosili isti
  // indeks kao lijevi par, pa je veza bila vidljiva iz samih ID-ova.
  if (question.type === 'match') {
    const pairs = question.pairs || [];
    const tokens = Array.isArray(matchTokens) && matchTokens.length === pairs.length
      ? matchTokens : pairs.map((_, i) => String(i));
    osnovno.answers = [];
    osnovno.lijevo = pairs.map((p, i) => ({ id: i, tekst: p[0] }));
    osnovno.desno = promijesaj(pairs.map((p, i) => ({ id: tokens[i], tekst: p[1] })));
  }

  if (question.type === 'ordering') {
    osnovno.answers = promijesaj(question.items || []);
  }

  return osnovno;
}

/** Fisher-Yates — klijent ne smije dobiti parove u izvornom redoslijedu */
function promijesaj(niz) {
  const a = [...niz];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildAnswerOrder(question) {
  if (question.type !== 'choice' || !Array.isArray(question.answers)) return null;
  return promijesaj(question.answers.map((_, index) => index));
}

/** Nasumične oznake desnih članova spajanja; tokens[i] pripada izvornom paru i. */
function buildMatchTokens(question) {
  if (question.type !== 'match' || !Array.isArray(question.pairs)) return null;
  const used = new Set();
  return question.pairs.map(() => {
    let t;
    do { t = crypto.randomBytes(4).toString('hex'); } while (used.has(t));
    used.add(t);
    return t;
  });
}

/** Raspored odgovora i oznake spajanja za jednu sesiju. */
function buildSessionMaps(questions) {
  const answerOrders = {};
  const matchTokens = {};
  for (const q of questions) {
    const id = String(q._id);
    const order = buildAnswerOrder(q);
    if (order) answerOrders[id] = order;
    const tokens = buildMatchTokens(q);
    if (tokens) matchTokens[id] = tokens;
  }
  return { answerOrders, matchTokens };
}

function sessionContext(attempt, questionId) {
  const id = String(questionId);
  return {
    answerOrder: attempt.answer_orders?.[id] || null,
    matchTokens: attempt.match_tokens?.[id] || null
  };
}

function evaluateQuestion(question, rawAnswer, context = {}) {
  // Stariji pozivi predaju samo raspored odgovora (niz).
  const { answerOrder = null, matchTokens = null } = Array.isArray(context) ? { answerOrder: context } : (context || {});
  if (question.type === 'ordering') {
    const items = question.items || [];
    const valid = Array.isArray(rawAnswer) && rawAnswer.length === items.length &&
      new Set(rawAnswer).size === items.length &&
      rawAnswer.every((item) => items.includes(item));
    return {
      normalizedAnswer: valid ? rawAnswer : [],
      isCorrect: valid && rawAnswer.every((item, i) => item === items[i]),
      correctAnswer: items.join(' → '), correctIndex: null
    };
  }

  if (question.type === 'true-false') {
    const chosen = rawAnswer === true || rawAnswer === 'true' ? true
      : rawAnswer === false || rawAnswer === 'false' ? false : null;
    return { normalizedAnswer: chosen, isCorrect: chosen !== null && chosen === question.correct,
      correctAnswer: question.correct ? 'Točno' : 'Netočno', correctIndex: null };
  }
  // Spajanje parova: odgovor je { lijeviId: desniId, ... }.
  // Točno je kad je svaki lijevi spojen sa svojim izvornim parom.
  if (question.type === 'match') {
    const parovi = question.pairs || [];
    const veze = (rawAnswer && typeof rawAnswer === 'object' && !Array.isArray(rawAnswer))
      ? rawAnswer : {};

    // Desna oznaka → izvorni indeks para. Bez oznaka (stare sesije) oznaka je indeks.
    const desniIndeks = (oznaka) => {
      if (oznaka === undefined || oznaka === null) return -1;
      if (Array.isArray(matchTokens)) return matchTokens.indexOf(String(oznaka));
      const n = Number(oznaka);
      return Number.isInteger(n) ? n : -1;
    };

    // Jedan desni član smije biti spojen samo jednom.
    const iskoristeni = new Set();
    // Usporedba po TEKSTU, ne po indeksu: ako se isti desni član pojavi
    // dvaput, svako značenjski ispravno spajanje se priznaje.
    let tocnih = 0;
    const vezeTocne = {};
    for (let i = 0; i < parovi.length; i++) {
      const j = desniIndeks(veze[i]);
      const ponudeni = parovi[j];
      const ok = !!ponudeni && !iskoristeni.has(j) && String(ponudeni[1]) === String(parovi[i][1]);
      if (j >= 0) iskoristeni.add(j);
      vezeTocne[i] = ok;
      if (ok) tocnih++;
    }

    return {
      normalizedAnswer: veze,
      isCorrect: parovi.length > 0 && tocnih === parovi.length,
      vezeTocne,
      tocnihVeza: tocnih,
      ukupnoVeza: parovi.length,
      correctAnswer: parovi.map((p) => `${p[0]} → ${p[1]}`).join(', '),
      correctIndex: null
    };
  }

  if (question.type === 'choice') {
    const selectedIndex = Number.parseInt(rawAnswer, 10);
    const hasOrder = Array.isArray(answerOrder) && answerOrder.length === question.answers?.length;
    const originalIndex = Number.isNaN(selectedIndex)
      ? null
      : (hasOrder ? answerOrder[selectedIndex] : selectedIndex);
    const displayedCorrectIndex = hasOrder
      ? answerOrder.indexOf(question.correctIndex)
      : question.correctIndex;
    return {
      normalizedAnswer: Number.isNaN(selectedIndex) ? null : selectedIndex,
      isCorrect: originalIndex === question.correctIndex,
      correctAnswer: question.answers?.[question.correctIndex] || '',
      correctIndex: displayedCorrectIndex
    };
  }

  // Upis odgovora. Strogoća ovisi o tome što se pitanjem provjerava.
  //
  // Dosad se uspoređivao cijeli niz znakova, pa je "Pas trči" bilo netočno
  // kad se očekivalo "Pas trči." — čak i kad zadatak nije o interpunkciji.
  // Sada završni znak i veliko početno slovo ulaze u ocjenu samo kad su oni
  // ono što se poučava (konstrukt "recenica" ili "interpunkcija").
  // Dijakritike su uvijek bitne: "cetiri" nije "četiri".
  const normalized = ocisti(rawAnswer);
  const expected = ocisti(question.correctAnswer);

  return {
    normalizedAnswer: normalized,
    isCorrect: tocan(normalized, expected, question.konstrukt, question.prihvatljivi || [], { pitanje: question.question }),
    correctAnswer: expected,
    correctIndex: null
  };
}

function createQuizService() {
  const repo = quizRepository();

  async function ensureTopic(topicId) {
    const topic = await repo.findTopicById(topicId);
    if (!topic) throw createHttpError(404, 'Tema nije pronađena.');

    const subject = await repo.findSubjectById(topic.subject_id);
    if (!subject) throw createHttpError(404, 'Predmet nije pronađen.');

    return { topic, subject };
  }

  async function createSession({ topicId, userId, count }) {
    const { topic, subject } = await ensureTopic(topicId);

    const questions = await getQuizQuestions({
      topic,
      subjectId: topic.subject_id,
      grade: topic.grade || 1,
      userId,
      count
    });

    if (questions.length === 0) {
      return {
        topic: {
          _id: topic._id,
          name: topic.name,
          icon: topic.icon,
          subject
        },
        questions: [],
        totalAvailable: 0,
        exhausted: true,
        message: 'Sva pitanja za ovu temu su odigrana u zadnjih 10 kvizova. Odigraj druge teme pa se vrati!'
      };
    }

    const questionIds = questions.map((question) => question._id);
    // Raspored ponuđenih odgovora i oznake spajanja slučajni su za svaku
    // kviz-sesiju i čuvaju se na serveru kako bi provjera ostala točna.
    const { answerOrders, matchTokens } = buildSessionMaps(questions);
    const attempt = {
      user_id: userId || null,
      topic_id: topic._id,
      subject_id: topic.subject_id,
      grade: topic.grade || 1,
      question_ids: questionIds,
      answer_orders: answerOrders,
      match_tokens: matchTokens,
      checks: {},
      createdAt: new Date(),
      completedAt: null
    };

    const { insertedId } = await repo.createAttempt(attempt);
    const totalAvailable = await repo.countActiveQuestionsForTopic(topicId);

    return {
      attemptId: insertedId,
      topic: {
        _id: topic._id,
        name: topic.name,
        icon: topic.icon,
        subject
      },
      questions: questions.map((question) => mapSafeQuestion(question,
        answerOrders[question._id.toString()], matchTokens[question._id.toString()])),
      totalAvailable,
      exhausted: false
    };
  }

  async function createReviewSession({ grade, userId, count }) {
    const db = getDb();
    const recent = userId ? await db.collection('progress')
      .find({ user_id: userId, grade }).sort({ completedAt: -1 }).limit(10).toArray() : [];
    const seen = new Set(recent.flatMap(p => (p.answers || []).map(a => String(a.question_id))));

    // Opseg: samo obrađeno (označeno ili već vježbano) gradivo, ne cijeli razred.
    const opseg = await obradjeno.opsegZaPonavljanje(userId, grade);
    const teme = opseg.topicIds
      ? opseg.topicIds
      : (await db.collection('topics').find({ grade, isActive: true }).toArray()).map((t) => t._id);

    // Slojeviti uzorak: jednako po temi, umjesto jednog uzorka od 120 koji
    // prati veličinu banaka (velike teme su prije prevladavale).
    const poTemi = Math.max(4, Math.ceil((count * 3) / Math.max(1, teme.length)));
    const pool = [];
    for (const topicId of teme) {
      const uzorak = await db.collection('questions').aggregate([
        { $match: { grade, isActive: true, topic_id: topicId } }, { $sample: { size: poTemi } }
      ]).toArray();
      pool.push(...uzorak);
    }
    const fresh = pool.filter(q => !seen.has(String(q._id)));
    const skills = [...new Set(fresh.map(q => skillKeyOf(q)).filter(Boolean))];
    let due = new Set();
    if (userId && skills.length) due = await vjestine.dospjele(userId, skills);

    // Kružno po predmetima pa po temama, dospjele vještine prve unutar teme.
    const poPredmetu = new Map();
    for (const q of fresh) {
      const sk = String(q.subject_id), tk = String(q.topic_id);
      if (!poPredmetu.has(sk)) poPredmetu.set(sk, new Map());
      const pt = poPredmetu.get(sk);
      if (!pt.has(tk)) pt.set(tk, []);
      pt.get(tk).push(q);
    }
    for (const pt of poPredmetu.values()) for (const [tk, arr] of pt) {
      pt.set(tk, [...arr.filter(q => due.has(skillKeyOf(q))), ...arr.filter(q => !due.has(skillKeyOf(q)))]);
    }
    // U svakom krugu svaki predmet daje JEDNO pitanje, iz svoje sljedeće teme.
    // (Prvi pokušaj prolazio je sve teme jednoga predmeta prije drugoga, pa je
    // predmet s prvim mjestom prevladavao — otkriveno simulacijom pilota.)
    const ordered = [];
    const redovi = [...poPredmetu.values()].map((pt) => ({ teme: [...pt.values()], i: 0 }));
    for (let i = redovi.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [redovi[i], redovi[j]] = [redovi[j], redovi[i]]; }
    let ima = true;
    while (ima) {
      ima = false;
      for (const r of redovi) {
        for (let pokusaj = 0; pokusaj < r.teme.length; pokusaj++) {
          const arr = r.teme[r.i % r.teme.length]; r.i++;
          const q = arr.shift();
          if (q) { ordered.push(q); ima = true; break; }
        }
      }
    }

    const chosen = [], topics = new Set(), families = new Set();
    for (const q of ordered) {
      const family = questionFamilyKey(q);
      if (topics.has(String(q.topic_id)) || families.has(family)) continue;
      chosen.push(q); topics.add(String(q.topic_id)); families.add(family);
      if (chosen.length >= count) break;
    }
    if (chosen.length < count) for (const q of ordered) {
      if (chosen.some(x => String(x._id) === String(q._id))) continue;
      if (families.has(questionFamilyKey(q))) continue;
      chosen.push(q); families.add(questionFamilyKey(q));
      if (chosen.length >= count) break;
    }
    const opsegInfo = { nacin: opseg.nacin, brojTema: teme.length };
    if (!chosen.length) return { questions: [], exhausted: true, opseg: opsegInfo,
      message: 'Trenutačno nema novih pitanja za miješano ponavljanje.' };
    const { answerOrders, matchTokens } = buildSessionMaps(chosen);
    const { insertedId } = await repo.createAttempt({ user_id: userId || null,
      topic_id: null, subject_id: null, grade, review: true,
      question_ids: chosen.map(q => q._id), answer_orders: answerOrders,
      match_tokens: matchTokens, checks: {},
      createdAt: new Date(), completedAt: null });
    return { attemptId: insertedId, topic: { name: 'Miješano ponavljanje', icon: '🔄' }, opseg: opsegInfo,
      questions: chosen.map(q => mapSafeQuestion(q, answerOrders[String(q._id)], matchTokens[String(q._id)])),
      totalAvailable: fresh.length, exhausted: false };
  }

  async function checkAnswer({ attemptId, questionId, answer, userId = null }) {
    const attempt = await repo.findAttemptById(attemptId);
    if (!attempt) throw createHttpError(404, 'Kviz sesija nije pronađena.');
    if (attempt.completedAt) throw createHttpError(409, 'Kviz je već završen.');
    // Ista kontrola vlasnika kao kod predaje. Gostujuća sesija (user_id null)
    // ostaje dostupna onome tko ima njezin ID.
    if (attempt.user_id && (!userId || String(attempt.user_id) !== String(userId))) {
      throw createHttpError(403, 'Ova kviz sesija ne pripada prijavljenom korisniku.');
    }

    const isInAttempt = attempt.question_ids.some((id) => id.toString() === questionId.toString());
    if (!isInAttempt) throw createHttpError(403, 'Pitanje ne pripada ovoj kviz sesiji.');

    const question = await repo.findQuestionById(questionId);
    if (!question) throw createHttpError(404, 'Pitanje nije pronađeno.');

    const evaluation = evaluateQuestion(question, answer, sessionContext(attempt, questionId));

    // Prvi pokušaj je autoritativan i sprema se na serveru. Ponovni pokušaji
    // (vježba) samo se broje — predaja ih ne može pretvoriti u točan prvi odgovor.
    const first = await repo.recordFirstCheck(attemptId, String(questionId), {
      answer: evaluation.normalizedAnswer,
      isCorrect: evaluation.isCorrect,
      at: new Date()
    });
    const prviPokusaj = first === true;

    return { ...evaluation, prviPokusaj, objasnjenje: question.objasnjenje || '' };
  }

  async function submitQuiz({ userId, topicId, reviewGrade, attemptId, answers }) {
    const attempt = await repo.findAttemptById(attemptId);
    if (!attempt) throw createHttpError(404, 'Kviz sesija nije pronađena.');
    if (attempt.completedAt) throw createHttpError(409, 'Kviz je već predan.');
    if (attempt.user_id && attempt.user_id.toString() !== userId.toString()) {
      throw createHttpError(403, 'Ova kviz sesija ne pripada prijavljenom korisniku.');
    }
    if (attempt.review ? reviewGrade !== attempt.grade : (!topicId || attempt.topic_id.toString() !== topicId.toString())) {
      throw createHttpError(400, 'Tema i kviz sesija se ne podudaraju.');
    }

    const allowedQuestionIds = attempt.question_ids.map((id) => id.toString());
    const answerQuestionIds = answers.map((answer) => answer.questionId.toString());

    for (const answerQuestionId of answerQuestionIds) {
      if (!allowedQuestionIds.includes(answerQuestionId)) {
        throw createHttpError(400, 'Odgovor sadrži pitanje koje nije dio ove sesije.');
      }
    }
    // Jedan odgovor po pitanju sesije. Ranije se isti točan odgovor mogao
    // poslati više puta i svaki je donosio bodove.
    if (new Set(answerQuestionIds).size !== answerQuestionIds.length) {
      throw createHttpError(400, 'Isto pitanje je predano više puta.');
    }

    const topic = attempt.review ? null : (await ensureTopic(topicId)).topic;

    // Učitaj SVA pitanja sesije, ne samo odgovorena: neodgovorena ulaze u
    // nazivnik rezultata i u svoju temu kod miješanog ponavljanja.
    const sessionIds = attempt.question_ids.map((id) => repo.toObjectId(String(id))).filter(Boolean);
    const questions = await repo.findQuestionsByIds(sessionIds);
    const questionMap = new Map(questions.map((question) => [question._id.toString(), question]));

    for (const answer of answers) {
      const question = questionMap.get(answer.questionId.toString());
      if (!question) {
        throw createHttpError(400, 'Jedno od pitanja više ne postoji.');
      }
      if (attempt.review ? question.grade !== attempt.grade : question.topic_id.toString() !== topicId.toString()) {
        throw createHttpError(400, 'Pitanje ne pripada odabranoj temi.');
      }
    }

    // Atomsko zauzimanje sesije: samo jedna istodobna predaja prolazi.
    const claimed = await repo.claimAttempt(attemptId);
    if (!claimed) throw createHttpError(409, 'Kviz je već predan.');

    try {
      // Nakon zauzimanja pročitaj svježe stanje (provjere upisane u međuvremenu).
      const zauzeta = (await repo.findAttemptById(attemptId)) || attempt;
      return await finishSubmission({ attempt: zauzeta, topic, userId, answers, questionMap, sessionIds });
    } catch (err) {
      // Ako upis ne uspije prije bilo kakvog zapisa rezultata, otpusti sesiju
      // kako bi je dijete moglo ponovno predati.
      if (!err.resultWritten) await repo.releaseAttempt(attemptId).catch(() => {});
      throw err;
    }
  }

  async function finishSubmission({ attempt, topic, userId, answers, questionMap, sessionIds }) {
    const checks = attempt.checks || {};
    const evaluatedAnswers = [];
    const stavkeVjestina = []; // ulaz za FSRS — jedna stavka po odgovoru
    const stavkeTezine = [];   // ulaz za Elo — mjeri stvarnu težinu pitanja
    let correctCount = 0;

    for (const answer of answers) {
      const question = questionMap.get(answer.questionId.toString());
      const qid = question._id.toString();
      const evaluation = evaluateQuestion(question, answer.userAnswer, sessionContext(attempt, qid));

      // Ako je pitanje već provjereno tijekom kviza, vrijedi PRVI pokušaj
      // spremljen na serveru, a ne naknadno poslani (možda ispravljeni) odgovor.
      const prvi = checks[qid];
      const wasCorrect = prvi ? prvi.isCorrect === true : evaluation.isCorrect;
      if (wasCorrect) correctCount += 1;

      const vrijemeMs = Number.parseInt(answer.timeTaken, 10) || 0;

      evaluatedAnswers.push({
        question_id: question._id,
        ...(attempt.review ? { topic_id: question.topic_id, subject_id: question.subject_id } : {}),
        wasCorrect,
        userAnswer: prvi ? prvi.answer : evaluation.normalizedAnswer,
        ...(prvi ? { pokusaja: prvi.attempts || 1, kasnijeTocno: !prvi.isCorrect && evaluation.isCorrect } : {}),
        // Kanonski tekst ostaje isti i nakon miješanja ponuđenih odgovora.
        ...(question.type === 'choice' && Number.isInteger(prvi ? prvi.answer : evaluation.normalizedAnswer)
          ? { chosenText: question.answers[attempt.answer_orders?.[qid]?.[prvi ? prvi.answer : evaluation.normalizedAnswer]
            ?? (prvi ? prvi.answer : evaluation.normalizedAnswer)] } : {}),
        timeTaken: vrijemeMs
      });

      stavkeTezine.push({
        questionId: question._id,
        itemKey: question.itemKey,
        templateId: question.templateId || question.gik?.templateId,
        skill: skillKeyOf(question),
        tocno: wasCorrect,
        vrijemeMs,
        difficulty: question.difficulty || 1
      });

      if (skillKeyOf(question)) {
        stavkeVjestina.push({
          skill: skillKeyOf(question),
          meta: question.gik,
          tocno: wasCorrect,
          vrijemeMs,
          difficulty: question.difficulty || 1
        });
      }
    }

    // Nazivnik je broj pitanja SESIJE. Djelomična predaja više ne izgleda kao 100 %.
    const totalQuestions = attempt.question_ids.length;
    const answeredQuestions = evaluatedAnswers.length;
    const complete = answeredQuestions === totalQuestions;
    const score = correctCount * 10;
    const allCorrect = complete && totalQuestions > 0 && correctCount === totalQuestions;

    const answeredIds = new Set(evaluatedAnswers.map((a) => String(a.question_id)));
    const groups = new Map();
    const groupFor = (q) => {
      const key = attempt.review ? String(q.topic_id) : String(topic._id);
      if (!groups.has(key)) groups.set(key, { topic_id: attempt.review ? q.topic_id : topic._id,
        subject_id: q.subject_id, answers: [], total: 0 });
      return groups.get(key);
    };
    for (const id of sessionIds) {
      const q = questionMap.get(String(id));
      if (q) groupFor(q).total += 1;
    }
    for (const answer of evaluatedAnswers) {
      groupFor(questionMap.get(String(answer.question_id))).answers.push(answer);
    }

    const sada = new Date();
    let written = false;
    try {
      for (const group of groups.values()) {
        if (!group.answers.length) continue;
        const correct = group.answers.filter(a => a.wasCorrect).length;
        await repo.insertProgress({ user_id: userId, subject_id: group.subject_id,
          topic_id: group.topic_id, grade: attempt.grade, attempt_id: attempt._id,
          totalQuestions: group.total, answeredQuestions: group.answers.length,
          correctAnswers: correct, complete: group.answers.length === group.total,
          score: correct * 10, answers: group.answers, completedAt: sada });
        written = true;
      }

      await repo.updateUserScoreAndStreak(userId, score, allCorrect);
      written = true;
    } catch (err) {
      err.resultWritten = written;
      throw err;
    }

    // Krivulja zaboravljanja: svaka dodirnuta vještina dobiva novi rok ponavljanja.
    // Ne smije srušiti predaju kviza ako zapne — rezultat je već spremljen.
    let vjestineIshod = [];
    try {
      vjestineIshod = await vjestine.zabiljeziKviz(userId, stavkeVjestina);
    } catch (err) {
      console.error('⚠️  Zapis vještina nije uspio:', err.message);
    }

    // Elo: težina pitanja mjeri se iz stvarnih odgovora, ne iz procjene
    // generatora. Kao i gore, ne smije srušiti predaju kviza.
    let tezinaIshod = null;
    try {
      const subjectGroups = new Map();
      for (const item of stavkeTezine) {
        const q = questionMap.get(String(item.questionId));
        const key = String(q.subject_id);
        if (!subjectGroups.has(key)) subjectGroups.set(key, { subjectId: q.subject_id, items: [] });
        subjectGroups.get(key).items.push(item);
      }
      for (const { subjectId, items } of subjectGroups.values()) {
        const staro = await repo.findRating(userId, subjectId);
        const novo = await tezina.zabiljezi(userId, items, staro.rating, staro.odgovora);
        await repo.saveRating(userId, subjectId, novo);
        if (subjectGroups.size === 1) tezinaIshod = { rating: novo.rating, promjena: novo.rating - staro.rating };
      }
    } catch (err) {
      console.error('⚠️  Mjerenje težine nije uspjelo:', err.message);
    }

    const updatedUser = await repo.findSafeUserById(userId);

    return {
      ...(tezinaIshod ? { tezina: tezinaIshod } : {}),
      progress: {
        totalQuestions,
        answeredQuestions,
        complete,
        correctAnswers: correctCount,
        score,
        percentage: totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0
      },
      user: {
        totalScore: updatedUser.totalScore,
        streak: updatedUser.streak
      },
      vjestine: vjestineIshod.map((v) => ({
        skill: v.skill,
        sljedecePonavljanje: v.due
      }))
    };
  }

  async function generateForTopic({ topicId, count, force }) {
    const { topic } = await ensureTopic(topicId);
    const existingCount = await repo.countActiveQuestionsForTopic(topicId);

    if (existingCount >= 50 && !force) {
      return {
        message: `Tema "${topic.name}" već ima ${existingCount} pitanja.`,
        generated: 0,
        total: existingCount,
        skipped: true
      };
    }

    const inserted = await generateAndStore(topic, topic.subject_id, topic.grade || 1, count);
    const total = await repo.countActiveQuestionsForTopic(topicId);

    return {
      message: `Generirano ${inserted} novih pitanja za "${topic.name}".`,
      generated: inserted,
      inserted,
      total,
      skipped: false
    };
  }

  async function generateForGrade({ grade }) {
    const { getDb } = require('../../db/mongo');
    const db = getDb();
    const topics = await db.collection('topics').find({ grade, isActive: true }).toArray();

    const results = [];
    for (const topic of topics) {
      const existingCount = await repo.countActiveQuestionsForTopic(topic._id);
      if (existingCount >= 50) {
        results.push({ topic: topic.name, skipped: true, existing: existingCount, generated: 0 });
        continue;
      }

      const inserted = await generateAndStore(topic, topic.subject_id, topic.grade || grade);
      results.push({ topic: topic.name, skipped: false, existing: existingCount, generated: inserted });
    }

    const totalGenerated = results.reduce((sum, item) => sum + item.generated, 0);
    return {
      message: `Generirano ukupno ${totalGenerated} pitanja za ${results.length} tema.`,
      results
    };
  }

  return {
    createSession,
    createReviewSession,
    checkAnswer,
    submitQuiz,
    generateForTopic,
    generateForGrade,
    ensureIndexes: () => repo.createAttemptIndexes()
  };
}

module.exports = { createQuizService, createHttpError, evaluateQuestion, mapSafeQuestion };
