# 📚 Učilica - Aplikacija za učenje

Interaktivna web aplikacija za učenike hrvatskih osnovnih škola.
Razredi **1–4** · 3 predmeta · 60+ generatora pitanja · Real-time generiranje

## 🛠️ Tehnologije

| Sloj | Tehnologija |
|------|-------------|
| Frontend | Vue.js 3 (Vite + SFC + Pinia) |
| Backend | Node.js, Express 5 |
| Baza | MongoDB (native driver) |
| Auth | JWT + bcrypt |
| Sigurnost | Helmet, Rate Limiting, CORS |
| API | REST + Quiz Session (anti-cheat) |

## 📁 Struktura

```
ucilica/
├── package.json                  # Root — concurrently + wait-on
├── backend/
│   ├── server.js                 # Entry point
│   ├── db/mongo.js               # MongoDB singleton + indeksi
│   ├── middleware/
│   │   ├── auth.js               # JWT (auth, optionalAuth, adminOnly)
│   │   └── rateLimiter.js        # Rate limiting (API, auth, AI)
│   ├── modules/quiz/             # Modularni quiz sustav
│   │   ├── quiz.routes.js
│   │   ├── quiz.controller.js
│   │   ├── quiz.service.js       # Business logika + session management
│   │   ├── quiz.repository.js    # DB pristup
│   │   └── quiz.validators.js
│   ├── routes/
│   │   ├── auth.js               # Register/Login/Me
│   │   ├── subjects.js           # Predmeti i teme
│   │   ├── progress.js           # Statistika + pregled odgovora
│   │   └── quiz.js               # Proxy → modules/quiz
│   ├── services/
│   │   └── questionGenerator.js  # Real-time generiranje (svi razredi)
│   └── seeds/
│       ├── gen-hrvatski.js       # Generatori 1. razred
│       ├── gen-matematika.js
│       ├── gen-priroda.js
│       ├── seed.js               # Seed 1. razred
│       ├── seed-r2.js            # Seed + generatori 2. razred
│       ├── seed-r3.js            # Seed + generatori 3. razred
│       └── seed-r4.js            # Seed + generatori 4. razred
└── frontend/
    ├── index.html                # Vite entry
    ├── vite.config.js
    └── src/
        ├── main.js               # Vue + Pinia + Router
        ├── App.vue               # Shell (topbar, error, stars)
        ├── stores/               # Pinia stores
        │   ├── auth.js
        │   └── quiz.js
        ├── composables/
        │   ├── useApi.js         # Fetch wrapper + retry
        │   └── useAuth.js
        ├── components/
        │   ├── LoginView.vue
        │   ├── RegisterView.vue
        │   ├── HomeView.vue
        │   ├── TopicsView.vue
        │   ├── QuizView.vue
        │   ├── ResultsView.vue
        │   ├── ProfileView.vue
        │   └── AnswerHistoryView.vue
        └── assets/
            └── main.css
```

## 🚀 Pokretanje

```bash
# 1. Instaliraj sve
npm install && npm run install:all

# 2. Napuni bazu
npm run seed:all    # sva 4 razreda

# 3. Pokreni (backend + frontend)
npm run dev
# BE → http://localhost:3000
# FE → http://localhost:5173
```

## 📡 REST API

### Auth
```
POST /api/auth/register   { username, password, displayName, avatar, grade }
POST /api/auth/login      { username, password }
GET  /api/auth/me         🔒
PATCH /api/auth/me        🔒 { displayName?, avatar?, grade? }
```

### Predmeti
```
GET /api/subjects?grade=1
GET /api/subjects/:slug/topics?grade=1
```

### Kviz (session-based)
```
GET  /api/quiz/:topicId?count=7   → attemptId + pitanja (bez odgovora)
POST /api/quiz/check               { attemptId, questionId, answer }
POST /api/quiz/submit  🔒         { attemptId, topicId, answers[] }
```

### Napredak
```
GET /api/progress          🔒
GET /api/progress/answers  🔒 ?filter=correct|wrong
```

## 📊 MongoDB kolekcije

| Kolekcija | Opis |
|-----------|------|
| `users` | Korisnici (bcrypt, JWT) |
| `subjects` | Predmeti po razredima |
| `topics` | Teme (ref → subject) |
| `questions` | Pitanja (choice/input) |
| `progress` | Povijest kvizova |
| `quiz_attempts` | Aktivne sesije (TTL 6h) |

## 🔒 Sigurnost

- Lozinke: bcrypt 12 rundi
- JWT tokeni (default 7 dana)
- Helmet HTTP headeri
- Rate limiting: API (200/15min), Auth (10/15min), AI (5/h)
- Quiz sessions sprječavaju cheating
- Server-side evaluacija odgovora
- express-validator na svim rutama

## 🎓 Predmeti po razredima

| Razred | Hrvatski | Matematika | Priroda i društvo |
|--------|----------|------------|-------------------|
| 1. | Slova, glasovi, riječi, rečenice | Brojevi do 20, +/- do 10, geometrija | Godišnja doba, životinje, tijelo, sigurnost |
| 2. | Imenice, glagoli, rečenice, čitanje | Brojevi do 100, +/- do 100, ×/÷ | Zavičaj, biljke, voda, zdravlje |
| 3. | Vrste riječi, pravopis, književnost | Brojevi do 1000, ×/÷ do 10, opseg | Karta, tlo/voda/zrak, gospodarske djel. |
| 4. | Pridjevi, pravopis, mediji | Brojevi do milijun, geometrija, površina | Krajevi HR, ljudsko tijelo, Hrvatska |
