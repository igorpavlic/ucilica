const Question = require('../../models/question');

async function getRandomQuestions(subject, limit) {
  return Question.aggregate([
    { $match: { subject } },
    { $sample: { size: limit } }
  ]);
}

async function insertQuestions(questions) {
  return Question.insertMany(questions);
}

async function countQuestions(subject) {
  return Question.countDocuments({ subject });
}

module.exports = {
  getRandomQuestions,
  insertQuestions,
  countQuestions
};
