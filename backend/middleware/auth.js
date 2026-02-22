const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/mongo');

/**
 * Obavezna autentikacija - zahtijeva valjan JWT
 */
async function auth(req, res, next) {
  try {
    const header = req.header('Authorization');
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Niste prijavljeni.' });
    }

    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const db = getDb();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(decoded.id) },
      { projection: { password: 0 } } // ne vraćaj password
    );

    if (!user) {
      return res.status(401).json({ error: 'Korisnik nije pronađen.' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Sesija je istekla. Prijavite se ponovo.' });
    }
    res.status(401).json({ error: 'Neispravna autorizacija.' });
  }
}

/**
 * Opcionalna autentikacija - dodaje korisnika ako je token prisutan
 */
async function optionalAuth(req, res, next) {
  try {
    const header = req.header('Authorization');
    if (header && header.startsWith('Bearer ')) {
      const token = header.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const db = getDb();
      req.user = await db.collection('users').findOne(
        { _id: new ObjectId(decoded.id) },
        { projection: { password: 0 } }
      );
    }
  } catch (err) {
    // Ignoriraj greške za opcionalni auth
  }
  next();
}

/**
 * Samo admin pristup
 */
function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Samo administratori imaju pristup.' });
  }
  next();
}

module.exports = { auth, optionalAuth, adminOnly };
