const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { getDb } = require('../db/mongo');
const { auth } = require('../middleware/auth');

const router = express.Router();

function generateToken(userId) {
  return jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

function sanitizeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

function validate(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array()[0].msg });
    return false;
  }
  return true;
}

router.post('/register', [
  body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Korisničko ime: 3-30 znakova'),
  body('password').isLength({ min: 4 }).withMessage('Lozinka: minimalno 4 znaka'),
  body('displayName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Ime za prikaz: 1-50 znakova'),
  body('avatar').optional().isString().isLength({ min: 1, max: 10 }).withMessage('Avatar nije valjan'),
  body('grade').optional().isInt({ min: 1, max: 8 }).withMessage('Razred: 1-8')
], async (req, res) => {
  try {
    if (!validate(req, res)) return;

    const { username, password, displayName, avatar, grade } = req.body;
    const db = getDb();

    const existing = await db.collection('users').findOne({ username: username.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'Korisničko ime već postoji.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      username: username.toLowerCase(),
      password: hashedPassword,
      displayName: displayName || username,
      avatar: avatar || '🧒',
      grade: grade || 1,
      role: 'student',
      totalScore: 0,
      streak: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);
    newUser._id = result.insertedId;

    res.status(201).json({
      message: 'Registracija uspješna!',
      token: generateToken(newUser._id),
      user: sanitizeUser(newUser)
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Greška pri registraciji.' });
  }
});

router.post('/login', [
  body('username').trim().notEmpty().withMessage('Unesite korisničko ime'),
  body('password').notEmpty().withMessage('Unesite lozinku')
], async (req, res) => {
  try {
    if (!validate(req, res)) return;

    const { username, password } = req.body;
    const db = getDb();

    const user = await db.collection('users').findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Neispravno korisničko ime ili lozinka.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Neispravno korisničko ime ili lozinka.' });
    }

    res.json({
      message: 'Prijava uspješna!',
      token: generateToken(user._id),
      user: sanitizeUser(user)
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Greška pri prijavi.' });
  }
});

router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

router.patch('/me', auth, [
  body('displayName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Ime za prikaz: 1-50 znakova'),
  body('avatar').optional().isString().isLength({ min: 1, max: 10 }).withMessage('Avatar nije valjan'),
  body('grade').optional().isInt({ min: 1, max: 8 }).withMessage('Razred: 1-8')
], async (req, res) => {
  try {
    if (!validate(req, res)) return;

    const allowed = ['displayName', 'avatar', 'grade'];
    const updates = { updatedAt: new Date() };
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const db = getDb();
    await db.collection('users').updateOne({ _id: req.user._id }, { $set: updates });
    const user = await db.collection('users').findOne(
      { _id: req.user._id },
      { projection: { password: 0 } }
    );

    res.json({ user });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(400).json({ error: 'Greška pri ažuriranju profila.' });
  }
});

module.exports = router;
