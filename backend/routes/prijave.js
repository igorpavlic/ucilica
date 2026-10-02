/**
 * POST /api/prijave — prijava pogrešnog ili nejasnog pitanja (services/prijave.js).
 * Može i gost; prijavljenom igraču e-adresa roditelja čita se iz profila.
 */
const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/mongo');
const { optionalAuth } = require('../middleware/auth');
const { prijavi } = require('../services/prijave');

const router = express.Router();

// Najviše 5 prijava u 15 minuta s iste adrese: dovoljno za dijete, premalo za spam.
const prijaveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Poslano je mnogo prijava. Pokušaj ponovo za 15 minuta.' },
});

router.post('/', prijaveLimiter, optionalAuth, [
  body('questionId').isMongoId().withMessage('Nepoznato pitanje'),
  body('razlog').isString().trim().isLength({ min: 5, max: 1000 }).withMessage('Opiši što nije u redu (5–1000 znakova).'),
  // Skriveno polje: čovjek ga ne vidi, robot ga popuni.
  body('web').optional().isString(),
], async (req, res) => {
  try {
    const greske = validationResult(req);
    if (!greske.isEmpty()) return res.status(400).json({ error: greske.array()[0].msg });
    if (req.body.web) return res.json({ ok: true, poslano: false });

    const pitanje = await getDb().collection('questions').findOne({ _id: new ObjectId(req.body.questionId) });
    if (!pitanje) return res.status(404).json({ error: 'Pitanje nije pronađeno.' });

    const { poslano } = await prijavi({ pitanje, razlog: req.body.razlog, korisnik: req.user || null });
    res.json({ ok: true, poslano });
  } catch (err) {
    console.error('Prijava pitanja:', err);
    res.status(500).json({ error: 'Prijava nije spremljena. Pokušaj ponovo.' });
  }
});

module.exports = router;
