const express = require('express');
const { ObjectId } = require('mongodb');
const { body, query, validationResult } = require('express-validator');
const { getDb } = require('../db/mongo');
const { auth, optionalAuth } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');
const { generateQuestions } = require('../services/deepai');

const router = express.Router();

// ═══════════════════════════════════════════════════════════
// Helper: validiraj ObjectId
// ═══════════════════════════════════════════════════════════
function parseObjectId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════
// POST /api/quiz/generate/:topicId — AI generiranje pitanja
// ═══════════════════════════════════════════════════════════
// ZAŠTIĆENO: zahtijeva JWT + rate limiting za AI kredite
router.post('/generate/:topicId',
  auth,        // ← ISPRAVLJENO: samo prijavljeni korisnici
  aiLimiter,   // ← NOVO: rate limiting za AI
  [
    body('count').optional().isInt({ min: 1, max: 30 }).withMessage('Count: 1-30'),
    body('force').optional().isBoolean().withMessage('Force mora biti boolean')
  ],
  async (req, res) => {
    try {
      // Validacija inputa
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const db = getDb();
      const count = parseInt(req.body.count) || 15;
      const force = req.body.force === true;

      const topicId = parseObjectId(req.params.topicId);
      if (!topicId) {
        return res.status(400).json({ error: 'Neispravan ID teme.' });
      }

      const topic = await db.collection('topics').findOne({ _id: topicId });
      if (!topic) {
        return res.status(404).json({ error: 'Tema nije pronađena.' });
      }

      const subject = await db.collection('subjects').findOne({ _id: topic.subject_id });
      if (!subject) {
        return res.status(404).json({ error: 'Predmet nije pronađen.' });
      }

      const existingCount = await db.collection('questions').countDocuments({
        topic_id: topicId,
        isActive: true
      });

      if (existingCount >= 50 && !force) {
        return res.json({
          message: `Tema "${topic.name}" već ima ${existingCount} pitanja.`,
          generated: 0,
          total: existingCount,
          skipped: true
        });
      }

      const existingQuestions = await db.collection('questions')
        .find({ topic_id: topicId, isActive: true })
        .project({ question: 1 })
        .limit(30)
        .toArray();
      const existingTexts = existingQuestions.map(q => q.question);

      let questions;
      try {
        questions = await generateQuestions({
          subjectName: subject.name,
          topicName: topic.name,
          grade: topic.grade || 1,
          count,
          existingQuestions: existingTexts
        });
      } catch (aiErr) {
        console.error('DeepAI greška:', aiErr.message);
        return res.status(502).json({
          error: 'Greška pri generiranju pitanja.',
          details: aiErr.message
        });
      }

      if (questions.length === 0) {
        return res.status(422).json({
          error: 'AI nije generirao valjana pitanja. Pokušaj ponovno.'
        });
      }

      const docs = questions.map(q => ({
        ...q,
        grade: topic.grade || 1,
        subject_id: topic.subject_id,
        topic_id: topicId,
        isActive: true,
        createdAt: new Date()
      }));

      const result = await db.collection('questions').insertMany(docs);

      const newTotal = await db.collection('questions').countDocuments({
        topic_id: topicId,
        isActive: true
      });

      res.json({
        message: `Generirano ${questions.length} novih pitanja za "${topic.name}".`,
        generated: questions.length,
        inserted: result.insertedCount,
        total: newTotal,
        skipped: false
      });

    } catch (err) {
      console.error('Generate error:', err);
      res.status(500).json({ error: 'Greška pri generiranju pitanja.' });
    }
  }
);

// ═══════════════════════════════════════════════════════════
// POST /api/quiz/generate-all — Generiraj pitanja za SVE teme
// ═══════════════════════════════════════════════════════════
// ZAŠTIĆENO: samo prijavljeni korisnici + rate limiting
router.post('/generate-all',
  auth,        // ← ISPRAVLJENO
  aiLimiter,   // ← NOVO
  [
    body('count').optional().isInt({ min: 1, max: 30 }).withMessage('Count: 1-30'),
    body('grade').optional().isInt({ min: 1, max: 8 }).withMessage('Grade: 1-8')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const db = getDb();
      const count = parseInt(req.body.count) || 15;
      const grade = parseInt(req.body.grade) || 1;

      const topics = await db.collection('topics')
        .find({ grade, isActive: true })
        .toArray();

      const results = [];

      for (const topic of topics) {
        const subject = await db.collection('subjects').findOne({ _id: topic.subject_id });

        const existingCount = await db.collection('questions').countDocuments({
          topic_id: topic._id,
          isActive: true
        });

        if (existingCount >= 50) {
          results.push({
            topic: topic.name,
            skipped: true,
            existing: existingCount,
            generated: 0
          });
          continue;
        }

        try {
          const existingQ = await db.collection('questions')
            .find({ topic_id: topic._id })
            .project({ question: 1 })
            .limit(20)
            .toArray();

          const questions = await generateQuestions({
            subjectName: subject?.name || 'Nepoznato',
            topicName: topic.name,
            grade,
            count,
            existingQuestions: existingQ.map(q => q.question)
          });

          if (questions.length > 0) {
            const docs = questions.map(q => ({
              ...q,
              grade,
              subject_id: topic.subject_id,
              topic_id: topic._id,
              isActive: true,
              createdAt: new Date()
            }));
            await db.collection('questions').insertMany(docs);
          }

          results.push({
            topic: topic.name,
            skipped: false,
            existing: existingCount,
            generated: questions.length
          });

        } catch (aiErr) {
          results.push({
            topic: topic.name,
            skipped: false,
            error: aiErr.message,
            generated: 0
          });
        }
      }

      const totalGenerated = results.reduce((s, r) => s + r.generated, 0);
      res.json({
        message: `Generirano ukupno ${totalGenerated} pitanja za ${results.length} tema.`,
        results
      });

    } catch (err) {
      console.error('Generate-all error:', err);
      res.status(500).json({ error: 'Greška pri generiranju.' });
    }
  }
);

// ═══════════════════════════════════════════════════════════
// GET /api/quiz/:topicId?count=7
// ═══════════════════════════════════════════════════════════
router.get('/:topicId',
  optionalAuth,
  [
    query('count').optional().isInt({ min: 1, max: 20 }).withMessage('Count: 1-20')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const count = parseInt(req.query.count) || 7;
      const db = getDb();

      const topicId = parseObjectId(req.params.topicId);
      if (!topicId) {
        return res.status(400).json({ error: 'Neispravan ID teme.' });
      }

      const topic = await db.collection('topics').findOne({ _id: topicId });
      if (!topic) {
        return res.status(404).json({ error: 'Tema nije pronađena.' });
      }

      const subject = await db.collection('subjects').findOne({ _id: topic.subject_id });

      const questions = await db.collection('questions').aggregate([
        { $match: { topic_id: topicId, isActive: true } },
        { $sample: { size: count } }
      ]).toArray();

      // Ne šalji točne odgovore klijentu
      const safeQuestions = questions.map(q => ({
        _id: q._id,
        type: q.type,
        question: q.question,
        visual: q.visual || '',
        hint: q.hint || '',
        answers: q.answers || [],
        placeholder: q.placeholder || 'Upiši odgovor...',
        difficulty: q.difficulty || 1
      }));

      const totalAvailable = await db.collection('questions').countDocuments({
        topic_id: topicId,
        isActive: true
      });

      res.json({
        topic: {
          _id: topic._id,
          name: topic.name,
          icon: topic.icon,
          subject: subject || null
        },
        questions: safeQuestions,
        totalAvailable
      });
    } catch (err) {
      console.error('Quiz get error:', err);
      res.status(500).json({ error: 'Greška pri dohvaćanju pitanja.' });
    }
  }
);

// ═══════════════════════════════════════════════════════════
// POST /api/quiz/check
// ═══════════════════════════════════════════════════════════
router.post('/check',
  [
    body('questionId').notEmpty().withMessage('questionId je obavezan'),
    body('answer').exists().withMessage('answer je obavezan')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const { questionId, answer } = req.body;
      const db = getDb();

      const qId = parseObjectId(questionId);
      if (!qId) {
        return res.status(400).json({ error: 'Neispravan ID pitanja.' });
      }

      const question = await db.collection('questions').findOne({ _id: qId });
      if (!question) {
        return res.status(404).json({ error: 'Pitanje nije pronađeno.' });
      }

      let isCorrect = false;
      let correctAnswer = '';

      if (question.type === 'choice') {
        isCorrect = parseInt(answer) === question.correctIndex;
        correctAnswer = question.answers[question.correctIndex];
      } else if (question.type === 'input') {
        const userAnswer = String(answer).trim().toLowerCase();
        const expected = question.correctAnswer.toLowerCase();
        isCorrect = userAnswer === expected;
        correctAnswer = question.correctAnswer;
      }

      res.json({
        isCorrect,
        correctAnswer,
        correctIndex: question.type === 'choice' ? question.correctIndex : undefined
      });
    } catch (err) {
      console.error('Quiz check error:', err);
      res.status(500).json({ error: 'Greška pri provjeri odgovora.' });
    }
  }
);

// ═══════════════════════════════════════════════════════════
// POST /api/quiz/submit (zahtijeva JWT)
// ═══════════════════════════════════════════════════════════
router.post('/submit',
  auth,
  [
    body('topicId').notEmpty().withMessage('topicId je obavezan'),
    body('answers').isArray({ min: 1 }).withMessage('answers mora biti neprazan array'),
    body('answers.*.questionId').notEmpty().withMessage('questionId je obavezan u svakom odgovoru'),
    body('answers.*.wasCorrect').isBoolean().withMessage('wasCorrect mora biti boolean'),
    body('answers.*.userAnswer').exists().withMessage('userAnswer je obavezan')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const { topicId, answers } = req.body;
      const db = getDb();

      const tId = parseObjectId(topicId);
      if (!tId) {
        return res.status(400).json({ error: 'Neispravan ID teme.' });
      }

      const topic = await db.collection('topics').findOne({ _id: tId });
      if (!topic) {
        return res.status(404).json({ error: 'Tema nije pronađena.' });
      }

      const correctCount = answers.filter(a => a.wasCorrect).length;
      const score = correctCount * 10;

      const progress = {
        user_id: req.user._id,
        subject_id: topic.subject_id,
        topic_id: topic._id,
        grade: topic.grade,
        totalQuestions: answers.length,
        correctAnswers: correctCount,
        score,
        answers: answers.map(a => ({
          question_id: new ObjectId(a.questionId),
          wasCorrect: a.wasCorrect,
          userAnswer: a.userAnswer,
          timeTaken: a.timeTaken || 0
        })),
        completedAt: new Date()
      };

      await db.collection('progress').insertOne(progress);

      const allCorrect = correctCount === answers.length;
      const updateOps = {
        $inc: { totalScore: score },
        $set: { updatedAt: new Date() }
      };

      if (allCorrect) {
        updateOps.$inc.streak = 1;
      } else {
        updateOps.$set.streak = 0;
      }

      await db.collection('users').updateOne(
        { _id: req.user._id },
        updateOps
      );

      const updatedUser = await db.collection('users').findOne(
        { _id: req.user._id },
        { projection: { password: 0 } }
      );

      res.json({
        progress: {
          totalQuestions: answers.length,
          correctAnswers: correctCount,
          score,
          percentage: Math.round((correctCount / answers.length) * 100)
        },
        user: {
          totalScore: updatedUser.totalScore,
          streak: updatedUser.streak
        }
      });
    } catch (err) {
      console.error('Quiz submit error:', err);
      res.status(500).json({ error: 'Greška pri spremanju rezultata.' });
    }
  }
);

module.exports = router;
