const rateLimit = require('express-rate-limit');

/**
 * Globalni API rate limiter
 * 200 requesta po IP svakih 15 minuta
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Previše zahtjeva. Pokušaj ponovo za par minuta.' }
});

/**
 * Auth rate limiter (login/register)
 * 10 pokušaja po IP svakih 15 minuta — zaštita od brute force
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Previše pokušaja prijave. Pokušaj ponovo za 15 minuta.' },
  skipSuccessfulRequests: true // ne broji uspješne loginove
});

/**
 * AI generiranje rate limiter
 * 5 zahtjeva po IP svakih 60 minuta — zaštita AI kredita
 */
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Previše zahtjeva za generiranje. Pokušaj ponovo za sat vremena.' }
});

module.exports = { apiLimiter, authLimiter, aiLimiter };
