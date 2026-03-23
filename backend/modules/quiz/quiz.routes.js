const express = require('express');
const { auth, optionalAuth } = require('../../middleware/auth');
const { aiLimiter } = require('../../middleware/rateLimiter');
const controller = require('./quiz.controller');
const {
  getQuizValidators,
  generateTopicValidators,
  generateAllValidators,
  checkAnswerValidators,
  submitQuizValidators,
  validateRequest
} = require('./quiz.validators');

const router = express.Router();

router.post('/generate/:topicId', auth, aiLimiter, generateTopicValidators, validateRequest, controller.generateTopic);
router.post('/generate-all', auth, aiLimiter, generateAllValidators, validateRequest, controller.generateAll);
router.get('/:topicId', optionalAuth, getQuizValidators, validateRequest, controller.getQuiz);
router.post('/check', checkAnswerValidators, validateRequest, controller.checkAnswer);
router.post('/submit', auth, submitQuizValidators, validateRequest, controller.submitQuiz);

module.exports = router;
