/**
 * seed-2-razred.js - PREDLOŽAK za 2. razred
 * 
 * Pokretanje:  node seeds/seed-2-razred.js  (iz backend/ mape)
 * 
 * Kopirajte za svaki novi razred i popunite sadržaj.
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { MongoClient } = require('mongodb');

const GRADE = 2;

const subjects = [
  { name: 'Hrvatski jezik', slug: 'hrvatski', icon: '📖', color: '#FF6B6B', description: 'Čitanje, pisanje, gramatika', order: 1, isActive: true },
  { name: 'Matematika', slug: 'matematika', icon: '🔢', color: '#60A5FA', description: 'Zbrajanje i oduzimanje do 100', order: 2, isActive: true },
  { name: 'Priroda i društvo', slug: 'priroda', icon: '🌿', color: '#34D399', description: 'Zavičaj, promet, biljke', order: 3, isActive: true },
];

const topicsAndQuestions = {
  hrvatski: [
    {
      topic: { name: 'Imenice', slug: 'imenice', icon: '📝', order: 1 },
      questions: [
        // TODO: Dodajte pitanja
        { type: 'choice', question: 'Što je imenica?', answers: ['Radnja', 'Ime bića, stvari ili pojave', 'Opis', 'Broj'], correctIndex: 1 },
      ]
    },
  ],
  matematika: [
    {
      topic: { name: 'Zbrajanje do 100', slug: 'zbrajanje-100', icon: '➕', order: 1 },
      questions: [
        { type: 'choice', question: '25 + 13 = ?', answers: ['36', '38', '28', '48'], correctIndex: 1 },
      ]
    },
  ],
  priroda: [
    {
      topic: { name: 'Promet', slug: 'promet', icon: '🚦', order: 1 },
      questions: [
        { type: 'choice', question: 'Na koje svjetlo prelazimo cestu?', answers: ['crveno', 'žuto', 'zeleno', 'plavo'], correctIndex: 2 },
      ]
    },
  ]
};

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ucilica';
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    console.log(`✅ Spojen na MongoDB: ${db.databaseName}`);

    console.log(`🗑️  Brišem podatke za ${GRADE}. razred...`);
    await db.collection('questions').deleteMany({ grade: GRADE });
    await db.collection('topics').deleteMany({ grade: GRADE });
    await db.collection('subjects').deleteMany({ grade: GRADE });

    console.log(`📝 Seedam ${GRADE}. razred...\n`);
    let total = 0;

    for (const s of subjects) {
      const res = await db.collection('subjects').insertOne({ ...s, grade: GRADE, createdAt: new Date() });
      console.log(`  📚 ${s.icon} ${s.name}`);
      const tops = topicsAndQuestions[s.slug] || [];
      for (const t of tops) {
        const tRes = await db.collection('topics').insertOne({ ...t.topic, subject_id: res.insertedId, grade: GRADE, isActive: true, createdAt: new Date() });
        const docs = t.questions.map(q => ({ ...q, topic_id: tRes.insertedId, subject_id: res.insertedId, grade: GRADE, difficulty: 1, isActive: true, visual: q.visual||'', hint: q.hint||'', answers: q.answers||[], correctAnswer: q.correctAnswer||'', placeholder: q.placeholder||'Upiši odgovor...', createdAt: new Date() }));
        if (docs.length) await db.collection('questions').insertMany(docs);
        total += docs.length;
        console.log(`    📎 ${t.topic.icon} ${t.topic.name}: ${docs.length} pitanja`);
      }
    }
    console.log(`\n✅ Završeno! ${total} pitanja za ${GRADE}. razred.`);
  } catch (e) { console.error('❌', e); }
  finally { await client.close(); process.exit(0); }
}

seed();
