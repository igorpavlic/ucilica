/** Idempotentno dodaje nove teme u postojeću bazu, bez brisanja napretka. */
require('dotenv').config();
const { connect, getDb, close } = require('../db/mongo');
const { generateAndStore, GENERATORS } = require('../services/questionGenerator');
const { buildQuestionMetadata } = require('../services/gikEngine');

const additions = [
  { grade: 3, subject: 'hrvatski', slug: 'citanje-3', name: 'Čitanje s razumijevanjem', icon: '📗', order: 5 },
  { grade: 3, subject: 'matematika', slug: 'podatci-3', name: 'Podatci i grafovi', icon: '📊', order: 5 },
  { grade: 3, subject: 'matematika', slug: 'nepoznati-3', name: 'Nepoznati broj', icon: '❓', order: 6 },
  { grade: 4, subject: 'hrvatski', slug: 'citanje-4', name: 'Čitanje s razumijevanjem', icon: '📗', order: 5 },
  { grade: 4, subject: 'matematika', slug: 'podatci-4', name: 'Podatci i grafovi', icon: '📊', order: 7 },
  { grade: 4, subject: 'matematika', slug: 'nepoznati-4', name: 'Nepoznati broj', icon: '❓', order: 8 }
];

async function main() {
  await connect();
  try {
    const db = getDb();
    for (const entry of additions) {
      const subject = await db.collection('subjects').findOne({ grade: entry.grade, slug: entry.subject });
      if (!subject) throw new Error(`Nedostaje predmet ${entry.subject} u ${entry.grade}. razredu. Pokreni početni seed na praznoj bazi.`);
      if (!GENERATORS[entry.slug]) throw new Error(`Nedostaje generator ${entry.slug}`);
      const { value: topic } = await db.collection('topics').findOneAndUpdate(
        { subject_id: subject._id, slug: entry.slug },
        { $setOnInsert: { grade: entry.grade, subject_id: subject._id, slug: entry.slug,
          name: entry.name, icon: entry.icon, order: entry.order, isActive: true, createdAt: new Date() } },
        { upsert: true, returnDocument: 'after', includeResultMetadata: true }
      );
      const existing = await db.collection('questions').countDocuments({ topic_id: topic._id, isActive: true });
      if (existing === 0) {
        const inserted = await generateAndStore(topic, subject._id, entry.grade);
        console.log(`${entry.grade}. ${entry.name}: ${inserted} novih pitanja`);
      } else console.log(`${entry.grade}. ${entry.name}: već ima ${existing} pitanja`);
    }
    // Statički, ručno provjereni primjeri u postojećim PID temama.
    for (const { grade, slug } of [{ grade: 3, slug: 'zavicaj-karta' },
      { grade: 4, slug: 'uvjeti-zivota' }]) {
      const topic = await db.collection('topics').findOne({ grade, slug });
      if (!topic) continue;
      for (const q of GENERATORS[slug]().filter(q => q.objasnjenje)) {
        const doc = { ...q, correctIndex: q._c ? q.answers.indexOf(q._c) : q.correctIndex,
          grade, subject_id: topic.subject_id, topic_id: topic._id,
          gik: buildQuestionMetadata({ topic, subject: null, difficulty: q.difficulty || 1, question: q }),
          isActive: true, createdAt: new Date() };
        delete doc._c;
        await db.collection('questions').updateOne({ topic_id: topic._id, question: q.question },
          { $setOnInsert: doc }, { upsert: true });
      }
    }
  } finally { await close(); }
}
main().catch(err => { console.error(err); process.exitCode = 1; });
