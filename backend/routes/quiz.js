const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/mongo');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/quiz/:topicId?count=7
router.get('/:topicId', optionalAuth, async (req, res) => {
  try {
    const count = Math.min(parseInt(req.query.count) || 7, 20);
    const db = getDb();

    let topicId;
    try {
      topicId = new ObjectId(req.params.topicId);
    } catch {
      return res.status(400).json({ error: 'Neispravan ID teme.' });
    }

    const topic = await db.collection('topics').findOne({ _id: topicId });
    if (!topic) {
      return res.status(404).json({ error: 'Tema nije pronađena.' });
    }

    // Dohvati subject za temu
    const subject = await db.collection('subjects').findOne({ _id: topic.subject_id });

    // Dohvati nasumična pitanja koristeći $sample aggregation
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
});

// POST /api/quiz/check
router.post('/check', async (req, res) => {
  try {
    const { questionId, answer } = req.body;
    const db = getDb();

    let qId;
    try {
      qId = new ObjectId(questionId);
    } catch {
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
});

// POST /api/quiz/submit (zahtijeva JWT)
router.post('/submit', auth, async (req, res) => {
  try {
    const { topicId, answers } = req.body;
    const db = getDb();

    let tId;
    try {
      tId = new ObjectId(topicId);
    } catch {
      return res.status(400).json({ error: 'Neispravan ID teme.' });
    }

    const topic = await db.collection('topics').findOne({ _id: tId });
    if (!topic) {
      return res.status(404).json({ error: 'Tema nije pronađena.' });
    }

    const correctCount = answers.filter(a => a.wasCorrect).length;
    const score = correctCount * 10;

    // Spremi progress
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

    // Ažuriraj korisnikov ukupni score i streak
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
});

module.exports = router;
