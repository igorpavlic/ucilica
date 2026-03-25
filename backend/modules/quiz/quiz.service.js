
const crypto = require('crypto');
const repo = require('./quiz.repository');
const { generateQuestions } = require('../../services/questionGenerator');

// hash helper
function hashQuestion(q) {
  return crypto
    .createHash('md5')
    .update(q.question + JSON.stringify(q.options))
    .digest('hex');
}

// wrapper generator with hash + metadata
function generateQuestionsForTopic({ grade, subject, topic, count }) {
  const generated = generateQuestions(subject, count);

  return generated.map(q => ({
    ...q,
    grade,
    subject,
    topic,
    hash: hashQuestion(q),
    createdAt: new Date()
  }));
}

async function getQuizQuestions({ grade, subject, topic, userId, limit = 10 }) {
  // 1. get from DB
  let questions = await repo.getRandomQuestions(subject, limit);

  // 2. exclude already played
  const playedIds = await repo.getRecentlyPlayedQuestionIds(userId) || [];

  questions = questions.filter(q => !playedIds.includes(q._id?.toString()));

  // 3. ensure enough questions
  if (questions.length < limit) {
    const missing = limit - questions.length;

    console.log("⚠️ Generating new questions:", missing);

    let newQuestions = generateQuestionsForTopic({
      grade,
      subject,
      topic,
      count: missing * 2 // generate extra to avoid duplicates
    });

    // remove duplicates by hash
    const existingHashes = await repo.getAllQuestionHashes(subject);

    newQuestions = newQuestions.filter(q => !existingHashes.includes(q.hash));

    // take only needed
    newQuestions = newQuestions.slice(0, missing);

    if (newQuestions.length > 0) {
      await repo.insertQuestions(newQuestions);
    }

    questions = [...questions, ...newQuestions];
  }

  return questions.slice(0, limit);
}
function createQuizService() {
  return {
    getQuizQuestions
  };
}

module.exports = createQuizService;

