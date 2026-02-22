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

    // Ukupna statistika
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

    // Statistika po predmetima
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

    // Zadnjih 10 kvizova
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

    // Najbolje teme
    const bestTopics = await db.collection('progress').aggregate([
      { $match: { user_id: userId, grade } },
      {
        $group: {
          _id: '$topic_id',
          avgPercentage: {
            $avg: { $multiply: [{ $divide: ['$correctAnswers', '$totalQuestions'] }, 100] }
          },
          attempts: { $sum: 1 }
        }
      },
      { $sort: { avgPercentage: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'topics',
          localField: '_id',
          foreignField: '_id',
          as: 'topic'
        }
      },
      { $unwind: '$topic' }
    ]).toArray();

    res.json({
      overall: overallStats[0] || {
        totalQuizzes: 0, totalQuestions: 0,
        totalCorrect: 0, totalScore: 0, avgPercentage: 0
      },
      subjects: subjectStats,
      recent,
      bestTopics,
      user: {
        totalScore: req.user.totalScore,
        streak: req.user.streak,
        displayName: req.user.displayName,
        avatar: req.user.avatar
      }
    });
  } catch (err) {
    console.error('Progress error:', err);
    res.status(500).json({ error: 'Greška pri dohvaćanju napretka.' });
  }
});

module.exports = router;
