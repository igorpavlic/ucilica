const rateLimit = require('express-rate-limit');

/**
 * Globalni API rate limiter po IP-u (zadano 600 zahtjeva / 15 min, API_LIMIT_MAX).
 *
 * Ranije 200 i za provjeru odgovora: jedan kviz je ~10 zahtjeva, a cijeli
 * razred u školi dijeli jednu javnu IP adresu — nakon nekoliko minuta svaka je
 * provjera vraćala 429 i „Provjeri” nije radio. Provjera odgovora zato ide
 * kroz zaseban limit po kviz-sesiji (provjeraLimiter).
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.API_LIMIT_MAX) || 600,
  skip: (req) => req.method === 'POST' && req.path === '/quiz/check',
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

/**
 * Provjera odgovora: 60 provjera u minuti po kviz-sesiji (7 pitanja i
 * ponovni pokušaji stanu s velikom zalihom), neovisno o tome koliko djece
 * dijeli IP. Zahtjev bez valjane sesije broji se po IP-u.
 */
const provjeraLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const id = String(req.body?.attemptId || '');
    return /^[a-f0-9]{24}$/i.test(id) ? `sesija:${id}` : `ip:${req.ip}`;
  },
  message: { error: 'Previše provjera zaredom. Pričekaj trenutak pa pokušaj ponovo.' }
});

module.exports = { apiLimiter, authLimiter, aiLimiter, provjeraLimiter };
