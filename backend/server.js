require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connect } = require('./db/mongo');

const authRoutes = require('./routes/auth');
const subjectRoutes = require('./routes/subjects');
const quizRoutes = require('./routes/quiz');
const progressRoutes = require('./routes/progress');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// API rute
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/progress', progressRoutes);

// SPA fallback - sve ostale rute vodi na frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Pokreni server
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connect();
    app.listen(PORT, () => {
      console.log(`🚀 Server pokrenut na http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Greška pri pokretanju:', err.message);
    process.exit(1);
  }
}

start();
