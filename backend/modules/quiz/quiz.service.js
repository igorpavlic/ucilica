const repo = require('./quiz.repository');
const { generateQuestions } = require('./quiz.generator');

const MIN_QUESTIONS = 50;
const GENERATE_BATCH = 20;

async function ensureQuestionPool(subject) {
  const count = await repo.countQuestions(subject);

  if (count < MIN_QUESTIONS) {
    const newQuestions = generateQuestions(subject, GENERATE_BATCH);
    await repo.insertQuestions(newQuestions);
  }
}

async function getQuizQuestions(subject, limit = 10) {
  await ensureQuestionPool(subject);
  const questions = await repo.getRandomQuestions(subject, limit);
  return questions;
}

module.exports = {
  getQuizQuestions
};
