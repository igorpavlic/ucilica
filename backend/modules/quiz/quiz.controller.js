const quizService = require('./quiz.service');

async function getQuiz(req, res) {
  try {
    const subject = req.query.subject || "matematika";
    const limit = parseInt(req.query.limit) || 10;

    const questions = await quizService.getQuizQuestions(subject, limit);

    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška kod dohvaćanja kviza" });
  }
}

module.exports = {
  getQuiz
};
