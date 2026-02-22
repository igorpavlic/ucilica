const express = require('express');
const { getDb } = require('../db/mongo');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/subjects?grade=1
router.get('/', optionalAuth, async (req, res) => {
  try {
    const grade = parseInt(req.query.grade) || (req.user ? req.user.grade : 1);
    const db = getDb();

    const subjects = await db.collection('subjects')
      .find({ grade, isActive: true })
      .sort({ order: 1 })
      .toArray();

    res.json({ subjects, grade });
  } catch (err) {
    console.error('Subjects error:', err);
    res.status(500).json({ error: 'Greška pri dohvaćanju predmeta.' });
  }
});

// GET /api/subjects/:slug/topics?grade=1
router.get('/:slug/topics', optionalAuth, async (req, res) => {
  try {
    const grade = parseInt(req.query.grade) || (req.user ? req.user.grade : 1);
    const db = getDb();

    const subject = await db.collection('subjects').findOne({
      slug: req.params.slug,
      grade,
      isActive: true
    });

    if (!subject) {
      return res.status(404).json({ error: 'Predmet nije pronađen.' });
    }

    const topics = await db.collection('topics')
      .find({ subject_id: subject._id, isActive: true })
      .sort({ order: 1 })
      .toArray();

    res.json({ subject, topics });
  } catch (err) {
    console.error('Topics error:', err);
    res.status(500).json({ error: 'Greška pri dohvaćanju tema.' });
  }
});

module.exports = router;
