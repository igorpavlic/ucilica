require('dotenv').config();

// ═══════════════════════════════════════════════════════════
// Provjera obaveznih env varijabli PRIJE bilo čega drugog
// ═══════════════════════════════════════════════════════════
const REQUIRED_ENV = ['JWT_SECRET', 'MONGODB_URI'];
const missing = REQUIRED_ENV.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ Nedostaju obavezne env varijable: ${missing.join(', ')}`);
  console.error('   Kreiraj .env datoteku prema .env.example');
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { connect } = require('./db/mongo');
const { apiLimiter, authLimiter, aiLimiter } = require('./middleware/rateLimiter');

const authRoutes = require('./routes/auth');
const subjectRoutes = require('./routes/subjects');
const quizRoutes = require('./routes/quiz');
const progressRoutes = require('./routes/progress');

const app = express();

// ═══════════════════════════════════════════════════════════
// Middleware
// ═══════════════════════════════════════════════════════════

// Sigurnosni headeri
app.use(helmet({
  contentSecurityPolicy: false // dopusti Google Fonts i inline styles
}));

// CORS — u produkciji ograniči na svoj domain
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '1mb' }));

// Serve frontend static files (Vite build output)
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// ═══════════════════════════════════════════════════════════
// API rute s rate limitingom
// ═══════════════════════════════════════════════════════════
app.use('/api', apiLimiter);                    // Globalni limit za sve API rute
app.use('/api/auth', authLimiter, authRoutes);   // Stroži limit za auth
app.use('/api/subjects', subjectRoutes);
app.use('/api/quiz', quizRoutes);                // AI rute imaju svoj limiter unutar routera
app.use('/api/progress', progressRoutes);

// ═══════════════════════════════════════════════════════════
// SPA fallback — SAMO za ne-API rute
// ═══════════════════════════════════════════════════════════
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

// ═══════════════════════════════════════════════════════════
// Globalni error handler
// ═══════════════════════════════════════════════════════════
app.use((err, req, res, next) => {
  console.error('⚠️  Unhandled error:', err.stack || err.message);

  // Mongoose/MongoDB greške
  if (err.name === 'MongoServerError' && err.code === 11000) {
    return res.status(409).json({ error: 'Duplicirani zapis.' });
  }

  // JSON parse greške
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Neispravan JSON format.' });
  }

  // Sve ostalo
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Interna greška servera.'
      : err.message
  });
});

// ═══════════════════════════════════════════════════════════
// Globalno hvatanje unhandled errora
// ═══════════════════════════════════════════════════════════
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️  Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

// ═══════════════════════════════════════════════════════════
// Pokreni server
// ═══════════════════════════════════════════════════════════
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connect();
    app.listen(PORT, () => {
      console.log(`🚀 Server pokrenut na http://localhost:${PORT}`);
      console.log(`   Okruženje: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('❌ Greška pri pokretanju:', err.message);
    process.exit(1);
  }
}

start();
