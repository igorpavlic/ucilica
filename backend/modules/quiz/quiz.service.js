
const crypto = require('crypto');
const { quizRepository } = require('./quiz.repository');
const repo = quizRepository();
const { generateQuestions } = require('../../services/questionGenerator');

function hashQuestion(q) {
  return crypto
    .createHash('md5')
    .update(q.question + JSON.stringify(q.options))
    .digest('hex');
}

function generateQuestionsForTopic({ grade, subject, topic, count }) {
  const generated = generateQuestions(subject, count);

  return generated.map(q => ({
    ...q,
    grade,
    subject,
    topic,
    hash: hashQuestion(q),
    createdAt: new Date(),
    isActive: true
  }));
}

async function getQuizQuestions({ topicId, grade, subject, topic, userId, limit = 10 }) {
  let questions = await repo.getRandomQuestionsByTopic(topicId, limit);

  const playedIds = await repo.getRecentlyPlayedQuestionIds(userId) || [];
  questions = questions.filter(q => !playedIds.includes(q._id?.toString()));

  if (questions.length < limit) {
    const missing = limit - questions.length;

    let newQuestions = generateQuestionsForTopic({
      grade,
      subject,
      topic,
      count: missing * 2
    });

    const existingHashes = await repo.getAllQuestionHashes(subject);
    newQuestions = newQuestions.filter(q => !existingHashes.includes(q.hash));
    newQuestions = newQuestions.slice(0, missing);

    if (newQuestions.length > 0) {
      const insertResult = await repo.insertQuestions(newQuestions);

      // attach inserted IDs back
      const insertedIds = Object.values(insertResult.insertedIds);
      newQuestions = newQuestions.map((q, i) => ({
        ...q,
        _id: insertedIds[i]
      }));
    }

    questions = [...questions, ...newQuestions];
  }

  return questions.slice(0, limit);
}

async function createSession({ topicId, userId, count }) {
  const topic = await repo.findTopicById(repo.toObjectId(topicId));

  if (!topic) throw new Error("Topic not found");

  const { grade, subject, slug } = topic;

  const questions = await getQuizQuestions({
    topicId: repo.toObjectId(topicId),
    grade,
    subject,
    topic: slug,
    userId,
    limit: count
  });

  const attempt = {
    user_id: userId,
    topic_id: repo.toObjectId(topicId),
    question_ids: questions.map(q => q._id),
    createdAt: new Date()
  };

  const result = await repo.createAttempt(attempt);

  return {
    topicId,
    attemptId: result.insertedId,
    questions
  };
}

function createQuizService() {
  return {
    createSession,
    getQuizQuestions
  };
}

module.exports = createQuizService;
