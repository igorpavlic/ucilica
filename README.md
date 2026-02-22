# 🌈 Učilica - Aplikacija za učenje

Interaktivna web aplikacija za učenike hrvatskih osnovnih škola.
Trenutno: **1. razred** · Proširivo na razrede 1-8.

## 🛠️ Tehnologije

| Sloj | Tehnologija |
|------|-------------|
| Frontend | Vue.js 3, HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Baza | MongoDB (native driver) |
| Auth | JWT + bcrypt |
| API | REST |
| Testiranje | Postman |

## 📁 Struktura

```
ucilica/
├── backend/
│   ├── server.js              # Entry point
│   ├── .env                   # Konfiguracija
│   ├── package.json
│   ├── db/
│   │   └── mongo.js           # MongoDB native konekcija (singleton)
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── routes/
│   │   ├── auth.js            # POST register/login, GET/PATCH me
│   │   ├── subjects.js        # GET subjects, GET topics
│   │   ├── quiz.js            # GET pitanja, POST check, POST submit
│   │   └── progress.js        # GET statistika
│   └── seeds/
│       ├── seed.js            # 1. razred (~130 pitanja)
│       └── seed-2-razred.js   # Predložak za 2. razred
└── frontend/
    └── index.html             # Vue.js 3 SPA
```

## 🚀 Pokretanje

```bash
# 1. Pokreni MongoDB (lokalno ili Atlas)
mongod

# 2. Instaliraj backend pakete
cd backend
npm install

# 3. Napuni bazu za 1. razred
npm run seed

# 4. Pokreni server
npm start
# → http://localhost:3000
```

## 📡 REST API

### Autentikacija
```
POST /api/auth/register   { username, password, displayName, avatar, grade }
POST /api/auth/login      { username, password }
GET  /api/auth/me         🔒 JWT → profil korisnika
PATCH /api/auth/me        🔒 JWT → ažuriraj profil
```

### Predmeti i teme
```
GET /api/subjects?grade=1              → lista predmeta
GET /api/subjects/:slug/topics?grade=1 → teme za predmet
```

### Kviz
```
GET  /api/quiz/:topicId?count=7   → nasumična pitanja (bez odgovora!)
POST /api/quiz/check               { questionId, answer } → provjera
POST /api/quiz/submit  🔒 JWT     { topicId, answers[] } → spremi rezultat
```

### Napredak
```
GET /api/progress  🔒 JWT  → statistika, povijest, najbolje teme
```

## 🧪 Postman primjeri

**Register:**
```json
POST http://localhost:3000/api/auth/register
{
  "username": "marko",
  "password": "1234",
  "displayName": "Marko",
  "grade": 1,
  "avatar": "🧒"
}
```

**Login:**
```json
POST http://localhost:3000/api/auth/login
{ "username": "marko", "password": "1234" }
// → kopirati token
```

**Dohvati predmete:**
```
GET http://localhost:3000/api/subjects?grade=1
```

**Dohvati teme:**
```
GET http://localhost:3000/api/subjects/hrvatski/topics?grade=1
```

**Kviz pitanja:**
```
GET http://localhost:3000/api/quiz/{topicId}?count=7
```

**Provjeri odgovor:**
```json
POST http://localhost:3000/api/quiz/check
{ "questionId": "...", "answer": 0 }
```

**Spremi rezultat (🔒):**
```json
POST http://localhost:3000/api/quiz/submit
Authorization: Bearer {token}
{
  "topicId": "...",
  "answers": [
    { "questionId": "...", "wasCorrect": true, "userAnswer": "0", "timeTaken": 3200 }
  ]
}
```

## ➕ Proširenje

### Novi razred
1. Kopiraj `backend/seeds/seed-2-razred.js` → `seed-3-razred.js`
2. Promijeni `GRADE = 3`
3. Popuni predmete, teme i pitanja
4. Pokreni: `node seeds/seed-3-razred.js`

### Novi predmet (u postojeći razred)
U seed datoteci dodaj u `subjects` i `topicsAndQuestions`:
```javascript
// subjects:
{ name: 'Glazbena kultura', slug: 'glazbena', icon: '🎵', ... }

// topicsAndQuestions:
glazbena: [
  { topic: { name: 'Note', slug: 'note', icon: '🎶', order: 1 },
    questions: [ ... ] }
]
```

## 📊 MongoDB kolekcije

| Kolekcija | Opis |
|-----------|------|
| `users` | Korisnici (bcrypt hash, JWT) |
| `subjects` | Predmeti po razredima |
| `topics` | Teme (reference na subject) |
| `questions` | Pitanja (choice/input, reference na topic+subject) |
| `progress` | Povijest kvizova i bodovi |

## 🔒 Sigurnost

- Lozinke: bcrypt 12 rundi
- JWT tokeni s konfiguabilnim istekom (default 7 dana)
- Odgovori se provjeravaju server-side (klijent ne dobiva točne odgovore)
- Input validacija: express-validator
- CORS konfiguriran
