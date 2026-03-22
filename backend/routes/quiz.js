const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/mongo');
const { auth, optionalAuth } = require('../middleware/auth');
const { generateQuestions } = require('../services/deepai');

const router = express.Router();

// ═══════════════════════════════════════════════════════════
// POST /api/quiz/generate/:topicId — AI generiranje pitanja
// ═══════════════════════════════════════════════════════════
// Poziva DeepAI API, generira nova pitanja i sprema ih u bazu.
// Ako tema već ima dovoljno pitanja, vraća koliko ih ima bez generiranja.
//
// Body (opcionalno): { count: 15, force: false }
//   count — koliko pitanja generirati (default 15, max 30)
//   force — generiraj čak i ako već ima dovoljno pitanja
//
router.post('/generate/:topicId', optionalAuth, async (req, res) => {
  try {
    const db = getDb();
    const count = Math.min(parseInt(req.body.count) || 15, 30);
    const force = req.body.force === true;

    // Validiraj topicId
    let topicId;
    try {
      topicId = new ObjectId(req.params.topicId);
    } catch {
      return res.status(400).json({ error: 'Neispravan ID teme.' });
    }

    // Dohvati temu i predmet
    const topic = await db.collection('topics').findOne({ _id: topicId });
    if (!topic) {
      return res.status(404).json({ error: 'Tema nije pronađena.' });
    }

    const subject = await db.collection('subjects').findOne({ _id: topic.subject_id });
    if (!subject) {
      return res.status(404).json({ error: 'Predmet nije pronađen.' });
    }

    // Provjeri koliko pitanja već postoji
    const existingCount = await db.collection('questions').countDocuments({
      topic_id: topicId,
      isActive: true
    });

    // Ako već ima 50+ pitanja i nije force, ne generiraj
    if (existingCount >= 50 && !force) {
      return res.json({
        message: `Tema "${topic.name}" već ima ${existingCount} pitanja.`,
        generated: 0,
        total: existingCount,
        skipped: true
      });
    }

    // Dohvati tekst postojećih pitanja za izbjegavanje duplikata
    const existingQuestions = await db.collection('questions')
      .find({ topic_id: topicId, isActive: true })
      .project({ question: 1 })
      .limit(30)
      .toArray();
    const existingTexts = existingQuestions.map(q => q.question);

    // Pozovi DeepAI
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

    // Spremi u bazu
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
});

// ═══════════════════════════════════════════════════════════
// POST /api/quiz/generate-all — Generiraj pitanja za SVE teme
// ═══════════════════════════════════════════════════════════
router.post('/generate-all', optionalAuth, async (req, res) => {
  try {
    const db = getDb();
    const count = Math.min(parseInt(req.body.count) || 15, 30);
    const grade = parseInt(req.body.grade) || 1;

    const topics = await db.collection('topics')
      .find({ grade, isActive: true })
      .toArray();

    const results = [];

    for (const topic of topics) {
      const subject = await db.collection('subjects').findOne({ _id: topic.subject_id });

      // Provjeri postojeća pitanja
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
});

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
