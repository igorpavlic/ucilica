const { getQuizQuestions, generateAndStore, ensureTopicPool } = require('../../services/questionGenerator');
const { gradeGenerationTarget } = require('../../services/gikEngine');
const { quizRepository } = require('./quiz.repository');

function createHttpError(status, message) {
  const error = new Error(message);
  error.statusCode = status;
  return error;
}

function mapSafeQuestion(question) {
  return {
    _id: question._id,
    type: question.type,
    question: question.question,
    visual: question.visual || '',
    hint: question.hint || '',
    answers: question.answers || [],
    placeholder: question.placeholder || 'Upiši odgovor...',
    difficulty: question.difficulty || 1,
    metadata: question.metadata || {
      grade: question.grade,
      subject: 'Nepoznato',
      outcome: 'GIK',
      topicName: ''
    }
  };
}

function evaluateQuestion(question, rawAnswer) {
  if (question.type === 'choice') {
    const selectedIndex = Number.parseInt(rawAnswer, 10);
    return {
      normalizedAnswer: Number.isNaN(selectedIndex) ? null : selectedIndex,
      isCorrect: selectedIndex === question.correctIndex,
      correctAnswer: question.answers?.[question.correctIndex] || '',
      correctIndex: question.correctIndex
    };
  }

  const normalized = String(rawAnswer ?? '').trim();
  const expected = String(question.correctAnswer ?? '').trim();

  return {
    normalizedAnswer: normalized,
    isCorrect: normalized.localeCompare(expected, undefined, { sensitivity: 'accent' }) === 0,
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

    const quizPayload = await getQuizQuestions({
      topic,
      subjectId: topic.subject_id,
      grade: topic.grade || 1,
      userId,
      count
    });

    const questions = quizPayload.questions || [];

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
        engine: quizPayload.engine || { mode: 'gik-adaptive' },
        message: 'Sva pitanja za ovu temu su odigrana u zadnjih 10 kvizova. Odigraj druge teme pa se vrati!'
      };
    }

    const questionIds = questions.map((question) => question._id);
    const attempt = {
      user_id: userId || null,
      topic_id: topic._id,
      subject_id: topic.subject_id,
      grade: topic.grade || 1,
      question_ids: questionIds,
      engine: quizPayload.engine || { mode: 'gik-adaptive' },
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
      questions: questions.map(mapSafeQuestion),
      totalAvailable,
      exhausted: false,
      engine: quizPayload.engine || { mode: 'gik-adaptive' }
    };
  }

  async function checkAnswer({ attemptId, questionId, answer }) {
    const attempt = await repo.findAttemptById(attemptId);
    if (!attempt) throw createHttpError(404, 'Kviz sesija nije pronađena.');
    if (attempt.completedAt) throw createHttpError(409, 'Kviz je već završen.');

    const isInAttempt = attempt.question_ids.some((id) => id.toString() === questionId.toString());
    if (!isInAttempt) throw createHttpError(403, 'Pitanje ne pripada ovoj kviz sesiji.');

    const question = await repo.findQuestionById(questionId);
    if (!question) throw createHttpError(404, 'Pitanje nije pronađeno.');

    return evaluateQuestion(question, answer);
  }

  async function submitQuiz({ userId, topicId, attemptId, answers }) {
    const attempt = await repo.findAttemptById(attemptId);
    if (!attempt) throw createHttpError(404, 'Kviz sesija nije pronađena.');
    if (attempt.completedAt) throw createHttpError(409, 'Kviz je već predan.');
    if (attempt.user_id && attempt.user_id.toString() !== userId.toString()) {
      throw createHttpError(403, 'Ova kviz sesija ne pripada prijavljenom korisniku.');
    }
    if (attempt.topic_id.toString() !== topicId.toString()) {
      throw createHttpError(400, 'Tema i kviz sesija se ne podudaraju.');
    }

    const { topic } = await ensureTopic(topicId);
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
    let correctCount = 0;

    for (const answer of answers) {
      const question = questionMap.get(answer.questionId.toString());
      if (!question) {
        throw createHttpError(400, 'Jedno od pitanja više ne postoji.');
      }
      if (question.topic_id.toString() !== topicId.toString()) {
        throw createHttpError(400, 'Pitanje ne pripada odabranoj temi.');
      }

      const evaluation = evaluateQuestion(question, answer.userAnswer);
      if (evaluation.isCorrect) correctCount += 1;

      evaluatedAnswers.push({
        question_id: question._id,
        wasCorrect: evaluation.isCorrect,
        userAnswer: evaluation.normalizedAnswer,
        timeTaken: Number.parseInt(answer.timeTaken, 10) || 0,
        metadata: question.metadata || null,
        difficulty: question.difficulty || 1
      });
    }

    const score = correctCount * 10;
    const totalQuestions = evaluatedAnswers.length;
    const allCorrect = totalQuestions > 0 && correctCount === totalQuestions;

    await repo.insertProgress({
      user_id: userId,
      subject_id: topic.subject_id,
      topic_id: topic._id,
      grade: topic.grade,
      totalQuestions,
      correctAnswers: correctCount,
      score,
      engine: attempt.engine || { mode: 'gik-adaptive' },
      answers: evaluatedAnswers,
      completedAt: new Date()
    });

    await repo.updateUserScoreAndStreak(userId, score, allCorrect);
    await repo.markAttemptCompleted(attemptId);
    const updatedUser = await repo.findSafeUserById(userId);

    return {
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
      engine: attempt.engine || { mode: 'gik-adaptive' }
    };
  }

  async function generateForTopic({ topicId, count, force }) {
    const { topic } = await ensureTopic(topicId);
    const existingCount = await repo.countActiveQuestionsForTopic(topicId);
    const target = Math.max(Number(count) || 0, gradeGenerationTarget(topic.grade || 1));

    if (existingCount >= target && !force) {
      return {
        message: `Tema "${topic.name}" već ima ${existingCount} pitanja.`,
        generated: 0,
        total: existingCount,
        skipped: true,
        target
      };
    }

    if (!force) {
      await ensureTopicPool(topic, topic.grade || 1, target);
    }

    const inserted = force
      ? await generateAndStore(topic, topic.subject_id, topic.grade || 1, Math.max(target - existingCount, count || 0, 20))
      : Math.max(target - existingCount, 0);

    const total = await repo.countActiveQuestionsForTopic(topicId);

    return {
      message: `Tema "${topic.name}" sada ima ${total} pitanja.`,
      generated: inserted,
      inserted,
      total,
      skipped: false,
      target
    };
  }

  async function generateForGrade({ grade }) {
    const { getDb } = require('../../db/mongo');
    const db = getDb();
    const topics = await db.collection('topics').find({ grade, isActive: true }).toArray();

    const results = [];
    for (const topic of topics) {
      const existingCount = await repo.countActiveQuestionsForTopic(topic._id);
      const target = gradeGenerationTarget(grade);
      if (existingCount >= target) {
        results.push({ topic: topic.name, skipped: true, existing: existingCount, generated: 0, target });
        continue;
      }

      const { generated, total } = await ensureTopicPool(topic, grade, target);
      results.push({ topic: topic.name, skipped: false, existing: existingCount, generated, total, target });
    }

    const totalGenerated = results.reduce((sum, item) => sum + item.generated, 0);
    return {
      message: `GIK engine je generirao ukupno ${totalGenerated} pitanja za ${results.length} tema.`,
      results
    };
  }

  return {
    createSession,
    checkAnswer,
    submitQuiz,
    generateForTopic,
    generateForGrade,
    ensureIndexes: () => repo.createAttemptIndexes()
  };
}

module.exports = { createQuizService };
