const { createQuizService } = require('./quiz.service');
const { quizRepository } = require('./quiz.repository');

const service = createQuizService();
const repo = quizRepository();

async function getQuiz(req, res, next) {
  try {
    const result = await service.createSession({
      topicId: repo.toObjectId(req.params.topicId),
      userId: req.user?._id || null,
      count: Number.parseInt(req.query.count, 10) || 7
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function checkAnswer(req, res, next) {
  try {
    const result = await service.checkAnswer({
      attemptId: repo.toObjectId(req.body.attemptId),
      questionId: repo.toObjectId(req.body.questionId),
      answer: req.body.answer
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function submitQuiz(req, res, next) {
  try {
    const result = await service.submitQuiz({
      userId: req.user._id,
      topicId: repo.toObjectId(req.body.topicId),
      attemptId: repo.toObjectId(req.body.attemptId),
      answers: req.body.answers.map((answer) => ({
        ...answer,
        questionId: answer.questionId
      }))
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function generateTopic(req, res, next) {
  try {
    const result = await service.generateForTopic({
      topicId: repo.toObjectId(req.params.topicId),
      count: Number.parseInt(req.body.count, 10) || 15,
      force: req.body.force === true
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function generateAll(req, res, next) {
  try {
    const result = await service.generateForGrade({
      grade: Number.parseInt(req.body.grade, 10) || 1
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getQuiz,
  checkAnswer,
  submitQuiz,
  generateTopic,
  generateAll,
  ensureIndexes: () => service.ensureIndexes()
};
