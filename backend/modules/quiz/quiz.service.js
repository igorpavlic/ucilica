const { getQuizQuestions, generateAndStore } = require('../../services/questionGenerator');
const { quizRepository } = require('./quiz.repository');
const vjestine = require('../../services/vjestine');
const tezina = require('../../services/tezina');
const { tocan, ocisti } = require('../../seeds/jasnoca');
const { getDb } = require('../../db/mongo');
const { questionFamilyKey } = require('../../services/questionFamily');

function createHttpError(status, message) {
  const error = new Error(message);
  error.statusCode = status;
  return error;
}

function mapSafeQuestion(question, answerOrder = null) {
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

  // Spajanje parova: klijent dobiva dva promiješana stupca, bez veze među njima.
  // Točan raspored ostaje na serveru.
  if (question.type === 'match') {
    osnovno.answers = [];
    osnovno.lijevo = (question.pairs || []).map((p, i) => ({ id: i, tekst: p[0] }));
    osnovno.desno = promijesaj((question.pairs || []).map((p, i) => ({ id: i, tekst: p[1] })));
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

function evaluateQuestion(question, rawAnswer, answerOrder = null) {
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

    // Usporedba po TEKSTU, ne po indeksu: ako se isti desni član pojavi
    // dvaput, svako značenjski ispravno spajanje se priznaje.
    let tocnih = 0;
    for (let i = 0; i < parovi.length; i++) {
      const spojenNa = veze[i];
      if (spojenNa === undefined || spojenNa === null) continue;
      const ponudeni = parovi[Number(spojenNa)];
      if (ponudeni && String(ponudeni[1]) === String(parovi[i][1])) tocnih++;
    }

    return {
      normalizedAnswer: veze,
      isCorrect: parovi.length > 0 && tocnih === parovi.length,
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
    isCorrect: tocan(normalized, expected, question.konstrukt, question.prihvatljivi || []),
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
    // Raspored ponuđenih odgovora je slučajan za svaku kviz-sesiju i čuva se
    // na serveru kako bi provjera odgovora ostala točna.
    const answerOrders = {};
    for (const question of questions) {
      const order = buildAnswerOrder(question);
      if (order) answerOrders[question._id.toString()] = order;
    }
    const attempt = {
      user_id: userId || null,
      topic_id: topic._id,
      subject_id: topic.subject_id,
      grade: topic.grade || 1,
      question_ids: questionIds,
      answer_orders: answerOrders,
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
      questions: questions.map((question) => mapSafeQuestion(question, answerOrders[question._id.toString()])),
      totalAvailable,
      exhausted: false
    };
  }

  async function createReviewSession({ grade, userId, count }) {
    const db = getDb();
    const recent = userId ? await db.collection('progress')
      .find({ user_id: userId, grade }).sort({ completedAt: -1 }).limit(10).toArray() : [];
    const seen = new Set(recent.flatMap(p => (p.answers || []).map(a => String(a.question_id))));
    const pool = await db.collection('questions').aggregate([
      { $match: { grade, isActive: true } }, { $sample: { size: 120 } }
    ]).toArray();
    const fresh = pool.filter(q => !seen.has(String(q._id)));
    const skills = [...new Set(fresh.map(q => q.gik?.outcome).filter(Boolean))];
    let due = new Set();
    if (userId && skills.length) due = await vjestine.dospjele(userId, skills);
    const ordered = [...fresh.filter(q => due.has(q.gik?.outcome)),
      ...fresh.filter(q => !due.has(q.gik?.outcome))];
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
    if (!chosen.length) return { questions: [], exhausted: true,
      message: 'Trenutačno nema novih pitanja za miješano ponavljanje.' };
    const answerOrders = {};
    for (const q of chosen) {
      const order = buildAnswerOrder(q);
      if (order) answerOrders[String(q._id)] = order;
    }
    const { insertedId } = await repo.createAttempt({ user_id: userId || null,
      topic_id: null, subject_id: null, grade, review: true,
      question_ids: chosen.map(q => q._id), answer_orders: answerOrders,
      createdAt: new Date(), completedAt: null });
    return { attemptId: insertedId, topic: { name: 'Miješano ponavljanje', icon: '🔄' },
      questions: chosen.map(q => mapSafeQuestion(q, answerOrders[String(q._id)])),
      totalAvailable: fresh.length, exhausted: false };
  }

  async function checkAnswer({ attemptId, questionId, answer }) {
    const attempt = await repo.findAttemptById(attemptId);
    if (!attempt) throw createHttpError(404, 'Kviz sesija nije pronađena.');
    if (attempt.completedAt) throw createHttpError(409, 'Kviz je već završen.');

    const isInAttempt = attempt.question_ids.some((id) => id.toString() === questionId.toString());
    if (!isInAttempt) throw createHttpError(403, 'Pitanje ne pripada ovoj kviz sesiji.');

    const question = await repo.findQuestionById(questionId);
    if (!question) throw createHttpError(404, 'Pitanje nije pronađeno.');

    const evaluation = evaluateQuestion(question, answer, attempt.answer_orders?.[questionId.toString()] || null);
    return { ...evaluation, objasnjenje: question.objasnjenje || '' };
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

    const topic = attempt.review ? null : (await ensureTopic(topicId)).topic;
    const allowedQuestionIds = attempt.question_ids.map((id) => id.toString());
    const answerQuestionIds = answers.map((answer) => answer.questionId.toString());

    for (const answerQuestionId of answerQuestionIds) {
      if (!allowedQuestionIds.includes(answerQuestionId)) {
        throw createHttpError(400, 'Odgovor sadrži pitanje koje nije dio ove sesije.');
      }
    }

    const uniqueQuestionIds = [...new Set(answerQuestionIds)];
    const questionIds = uniqueQuestionIds.map((id) => repo.toObjectId(id)).filter(Boolean);
    const questions = await repo.findQuestionsByIds(questionIds);
    const questionMap = new Map(questions.map((question) => [question._id.toString(), question]));

    const evaluatedAnswers = [];
    const stavkeVjestina = []; // ulaz za FSRS — jedna stavka po odgovoru
    const stavkeTezine = [];   // ulaz za Elo — mjeri stvarnu težinu pitanja
    let correctCount = 0;

    for (const answer of answers) {
      const question = questionMap.get(answer.questionId.toString());
      if (!question) {
        throw createHttpError(400, 'Jedno od pitanja više ne postoji.');
      }
      if (attempt.review ? question.grade !== attempt.grade : question.topic_id.toString() !== topicId.toString()) {
        throw createHttpError(400, 'Pitanje ne pripada odabranoj temi.');
      }

      const evaluation = evaluateQuestion(question, answer.userAnswer, attempt.answer_orders?.[question._id.toString()] || null);
      if (evaluation.isCorrect) correctCount += 1;

      const vrijemeMs = Number.parseInt(answer.timeTaken, 10) || 0;

      evaluatedAnswers.push({
        question_id: question._id,
        ...(attempt.review ? { topic_id: question.topic_id, subject_id: question.subject_id } : {}),
        wasCorrect: evaluation.isCorrect,
        userAnswer: evaluation.normalizedAnswer,
        // Kanonski tekst ostaje isti i nakon miješanja ponuđenih odgovora.
        ...(question.type === 'choice' && Number.isInteger(evaluation.normalizedAnswer)
          ? { chosenText: question.answers[attempt.answer_orders?.[question._id.toString()]?.[evaluation.normalizedAnswer]
            ?? evaluation.normalizedAnswer] } : {}),
        timeTaken: vrijemeMs
      });

      stavkeTezine.push({
        questionId: question._id,
        tocno: evaluation.isCorrect,
        vrijemeMs,
        difficulty: question.difficulty || 1
      });

      if (question.gik?.outcome) {
        stavkeVjestina.push({
          skill: question.gik.outcome,
          meta: question.gik,
          tocno: evaluation.isCorrect,
          vrijemeMs,
          difficulty: question.difficulty || 1
        });
      }
    }

    const score = correctCount * 10;
    const totalQuestions = evaluatedAnswers.length;
    const allCorrect = totalQuestions > 0 && correctCount === totalQuestions;

    const groups = new Map();
    for (const answer of evaluatedAnswers) {
      const q = questionMap.get(String(answer.question_id));
      const key = attempt.review ? String(q.topic_id) : String(topic._id);
      if (!groups.has(key)) groups.set(key, { topic_id: q.topic_id, subject_id: q.subject_id, answers: [] });
      groups.get(key).answers.push(answer);
    }
    for (const group of groups.values()) {
      const correct = group.answers.filter(a => a.wasCorrect).length;
      await repo.insertProgress({ user_id: userId, subject_id: group.subject_id,
        topic_id: group.topic_id, grade: attempt.grade,
        totalQuestions: group.answers.length, correctAnswers: correct,
        score: correct * 10, answers: group.answers, completedAt: new Date() });
    }

    await repo.updateUserScoreAndStreak(userId, score, allCorrect);
    await repo.markAttemptCompleted(attemptId);

    // Krivulja zaboravljanja: svaka dodirnuta vještina dobiva novi rok ponavljanja.
    // Ne smije srušiti predaju kviza ako zapne — rezultat je već spremljen.
    let vjestineIshod = [];
    try {
      vjestineIshod = await vjestine.zabiljeziKviz(userId, stavkeVjestina);
    } catch (err) {
      console.error('⚠️  Zapis vještina nije uspio:', err.message);
    }

    // Elo: težina pitanja mjeri se iz stvarnih odgovora, ne iz procjene
    // generatora. FSRS zna KADA ponoviti, Elo zna KOLIKO je pitanje teško.
    // Kao i gore, ne smije srušiti predaju kviza.
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

module.exports = { createQuizService, createHttpError };
