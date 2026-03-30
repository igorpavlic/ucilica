const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/mongo');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /api/progress
router.get('/', auth, async (req, res) => {
  try {
    const db = getDb();
    const userId = req.user._id;
    const grade = parseInt(req.query.grade) || req.user.grade;

    const overallStats = await db.collection('progress').aggregate([
      { $match: { user_id: userId, grade } },
      {
        $group: {
          _id: null,
          totalQuizzes: { $sum: 1 },
          totalQuestions: { $sum: '$totalQuestions' },
          totalCorrect: { $sum: '$correctAnswers' },
          totalScore: { $sum: '$score' },
          avgPercentage: {
            $avg: { $multiply: [{ $divide: ['$correctAnswers', '$totalQuestions'] }, 100] }
          }
        }
      }
    ]).toArray();

    const subjectStats = await db.collection('progress').aggregate([
      { $match: { user_id: userId, grade } },
      {
        $group: {
          _id: '$subject_id',
          quizzes: { $sum: 1 },
          totalCorrect: { $sum: '$correctAnswers' },
          totalQuestions: { $sum: '$totalQuestions' },
          avgPercentage: {
            $avg: { $multiply: [{ $divide: ['$correctAnswers', '$totalQuestions'] }, 100] }
          }
        }
      },
      {
        $lookup: {
          from: 'subjects',
          localField: '_id',
          foreignField: '_id',
          as: 'subject'
        }
      },
      { $unwind: '$subject' }
    ]).toArray();

    const recent = await db.collection('progress').aggregate([
      { $match: { user_id: userId } },
      { $sort: { completedAt: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'subjects',
          localField: 'subject_id',
          foreignField: '_id',
          as: 'subject'
        }
      },
      { $unwind: { path: '$subject', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'topics',
          localField: 'topic_id',
          foreignField: '_id',
          as: 'topic'
        }
      },
      { $unwind: { path: '$topic', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          totalQuestions: 1,
          correctAnswers: 1,
          score: 1,
          completedAt: 1,
          'subject.name': 1,
          'subject.icon': 1,
          'topic.name': 1,
          'topic.icon': 1
        }
      }
    ]).toArray();

    res.json({
      overall: overallStats[0] || {
        totalQuizzes: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        totalScore: 0,
        avgPercentage: 0
      },
      subjects: subjectStats,
      recent,
      grade
    });
  } catch (err) {
    console.error('Progress error:', err);
    res.status(500).json({ error: 'Greška pri dohvaćanju napretka.' });
  }
});

module.exports = router;

// ═══════════════════════════════════════════════════════════
// GET /api/progress/answers?filter=correct|wrong&limit=50
// ═══════════════════════════════════════════════════════════
// Vraća pitanja s detaljima — za pregled točnih i netočnih odgovora
router.get('/answers', auth, async (req, res) => {
  try {
    const db = getDb();
    const userId = req.user._id;
    const filter = req.query.filter; // 'correct' ili 'wrong'
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);

    // Dohvati zadnje kvizove korisnika
    const progressDocs = await db.collection('progress')
      .find({ user_id: userId })
      .sort({ completedAt: -1 })
      .limit(20)
      .toArray();

    // Izvuci sve odgovore s metapodacima
    const allAnswers = [];
    for (const prog of progressDocs) {
      if (!Array.isArray(prog.answers)) continue;
      for (const ans of prog.answers) {
        allAnswers.push({
          question_id: ans.question_id,
          wasCorrect: ans.wasCorrect,
          userAnswer: ans.userAnswer,
          timeTaken: ans.timeTaken || 0,
          completedAt: prog.completedAt,
          topic_id: prog.topic_id,
          subject_id: prog.subject_id
        });
      }
    }

    // Filtriraj po correct/wrong
    let filtered = allAnswers;
    if (filter === 'correct') {
      filtered = allAnswers.filter(a => a.wasCorrect);
    } else if (filter === 'wrong') {
      filtered = allAnswers.filter(a => !a.wasCorrect);
    }

    // Uzmi samo limit
    filtered = filtered.slice(0, limit);

    // Dohvati detalje pitanja iz baze
    const questionIds = [...new Set(filtered.map(a => a.question_id.toString()))];
    const questions = await db.collection('questions')
      .find({ _id: { $in: questionIds.map(id => new ObjectId(id)) } })
      .toArray();

    const qMap = {};
    for (const q of questions) {
      qMap[q._id.toString()] = q;
    }

    // Dohvati teme i predmete
    const topicIds = [...new Set(filtered.map(a => a.topic_id?.toString()).filter(Boolean))];
    const topics = await db.collection('topics')
      .find({ _id: { $in: topicIds.map(id => new ObjectId(id)) } })
      .toArray();
    const tMap = {};
    for (const t of topics) tMap[t._id.toString()] = t;

    const subjectIds = [...new Set(filtered.map(a => a.subject_id?.toString()).filter(Boolean))];
    const subjects = await db.collection('subjects')
      .find({ _id: { $in: subjectIds.map(id => new ObjectId(id)) } })
      .toArray();
    const sMap = {};
    for (const s of subjects) sMap[s._id.toString()] = s;

    // Sastavi odgovor
    const results = filtered.map(a => {
      const q = qMap[a.question_id.toString()];
      if (!q) return null;

      const topic = tMap[a.topic_id?.toString()];
      const subject = sMap[a.subject_id?.toString()];

      return {
        question: q.question,
        visual: q.visual || '',
        type: q.type,
        answers: q.answers || [],
        correctAnswer: q.type === 'choice'
          ? (q.answers[q.correctIndex] || '')
          : (q.correctAnswer || ''),
        correctIndex: q.correctIndex,
        userAnswer: a.userAnswer,
        wasCorrect: a.wasCorrect,
        timeTaken: a.timeTaken,
        completedAt: a.completedAt,
        topic: topic ? { name: topic.name, icon: topic.icon } : null,
        subject: subject ? { name: subject.name, icon: subject.icon } : null
      };
    }).filter(Boolean);

    res.json({ answers: results, filter, total: results.length });
  } catch (err) {
    console.error('Progress answers error:', err);
    res.status(500).json({ error: 'Greška pri dohvaćanju odgovora.' });
  }
});
