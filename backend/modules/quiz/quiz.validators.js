const { body, param, query, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');

const objectIdRule = (field, message) => body(field)
  .custom((value) => ObjectId.isValid(value))
  .withMessage(message);

const getQuizValidators = [
  param('topicId').custom((value) => ObjectId.isValid(value)).withMessage('Neispravan ID teme.'),
  query('count').optional().isInt({ min: 1, max: 20 }).withMessage('Count: 1-20')
];

const generateTopicValidators = [
  param('topicId').custom((value) => ObjectId.isValid(value)).withMessage('Neispravan ID teme.'),
  body('count').optional().isInt({ min: 1, max: 30 }).withMessage('Count: 1-30'),
  body('force').optional().isBoolean().withMessage('Force mora biti boolean')
];

const generateAllValidators = [
  body('grade').optional().isInt({ min: 1, max: 4 }).withMessage('Razred: 1-4')
];

const checkAnswerValidators = [
  objectIdRule('attemptId', 'Neispravan ID kviz sesije.'),
  objectIdRule('questionId', 'Neispravan ID pitanja.'),
  body('answer').exists().withMessage('answer je obavezan')
    .bail()
    .custom((v) => ['string', 'number', 'object', 'boolean'].includes(typeof v))
    .withMessage('Neispravan odgovor')
];

const submitQuizValidators = [
  objectIdRule('attemptId', 'Neispravan ID kviz sesije.'),
  body('topicId').optional().custom((value) => ObjectId.isValid(value)).withMessage('Neispravan ID teme.'),
  body('reviewGrade').optional().isInt({ min: 1, max: 4 }),
  body().custom((value) => !!value.topicId !== !!value.reviewGrade)
    .withMessage('Potrebna je tema ili razred ponavljanja.'),
  body('answers').isArray({ min: 1 }).withMessage('answers mora biti neprazan array'),
  body('answers.*.questionId').custom((value) => ObjectId.isValid(value)).withMessage('questionId mora biti valjani ObjectId'),
  body('answers.*.userAnswer').exists().withMessage('userAnswer je obavezan')
    .bail()
    .custom((v) => ['string', 'number', 'object', 'boolean'].includes(typeof v))
    .withMessage('Neispravan odgovor'),
  body('answers.*.timeTaken').optional().isInt({ min: 0 }).withMessage('timeTaken mora biti nenegativan broj')
];

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  return next();
}

module.exports = {
  getQuizValidators,
  generateTopicValidators,
  generateAllValidators,
  checkAnswerValidators,
  submitQuizValidators,
  validateRequest
};
