function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function generateMathQuestion() {
  const a = Math.floor(Math.random() * 50);
  const b = Math.floor(Math.random() * 50);

  const correct = a + b;

  return {
    question: `Koliko je ${a} + ${b}?`,
    options: shuffle([
      correct,
      correct + Math.floor(Math.random() * 5) + 1,
      correct - Math.floor(Math.random() * 5) - 1,
      correct + 2
    ]),
    correctAnswer: correct,
    subject: "matematika",
    difficulty: "easy",
    createdAt: new Date()
  };
}

function generateQuestionBySubject(subject) {
  switch (subject) {
    case "matematika":
      return generateMathQuestion();
    default:
      return generateMathQuestion();
  }
}

function generateQuestions(subject, count = 10) {
  const questions = [];

  for (let i = 0; i < count; i++) {
    questions.push(generateQuestionBySubject(subject));
  }

  return questions;
}

module.exports = {
  generateQuestions
};
