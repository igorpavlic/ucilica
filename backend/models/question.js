const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  options: [mongoose.Schema.Types.Mixed],
  correctAnswer: mongoose.Schema.Types.Mixed,
  subject: String,
  difficulty: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', questionSchema);
