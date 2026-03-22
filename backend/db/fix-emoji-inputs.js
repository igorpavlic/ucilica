/**
 * fix-emoji-inputs.js
 * 
 * Popravlja pitanja koja imaju type:"input" ali correctAnswer je emoji.
 * Pretvara ih u type:"choice" s 4 ponuđena odgovora.
 * 
 * Pokretanje:  node seeds/fix-emoji-inputs.js  (iz backend/ mape)
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { MongoClient } = require('mongodb');

// Regex koji hvata emoji (široki raspon unicode blokova)
const emojiRegex = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\u{200D}\u{FE0F}\u{20E3}]+$/u;

// Pool emoji-a za krive odgovore
const emojiPool = [
  '🔴','🔵','⭐','🌙','🍎','🍏','🐱','🐶','🟢','🌞','🌧️',
  '🎈','🎁','🐸','🐝','❤️','💙','💚','🌳','🌻','△','○','□'
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function fix() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ucilica';
  const client = new MongoClient(uri);

  try {
    await client.connect();

    // Koristi istu logiku za ime baze kao mongo.js
    const dbName = process.env.DB_NAME
      || (() => { try { return new URL(uri).pathname.replace(/^\//, '') || 'ucilica'; } catch { return 'ucilica'; } })();

    const db = client.db(dbName);
    console.log(`🔗 MongoDB: ${db.databaseName}`);

    // Pronađi sva input pitanja gdje je correctAnswer emoji
    const questions = await db.collection('questions').find({
      type: 'input',
      isActive: true
    }).toArray();

    let fixed = 0;

    for (const q of questions) {
      if (!q.correctAnswer) continue;
      const answer = q.correctAnswer.trim();

      // Provjeri je li odgovor emoji
      if (!emojiRegex.test(answer)) continue;

      // Generiraj 3 kriva odgovora iz poola (koji nisu točan)
      const wrongs = shuffle(emojiPool.filter(e => e !== answer)).slice(0, 3);
      const allAnswers = shuffle([answer, ...wrongs]);
      const correctIndex = allAnswers.indexOf(answer);

      // Update u bazu
      await db.collection('questions').updateOne(
        { _id: q._id },
        {
          $set: {
            type: 'choice',
            answers: allAnswers,
            correctIndex: correctIndex,
            question: q.question.replace(/Napiši emoji\.?\s*/i, '').trim() || q.question
          },
          $unset: {
            correctAnswer: '',
            placeholder: ''
          }
        }
      );

      console.log(`  ✅ ${q._id}: "${answer}" → choice [${allAnswers.join(', ')}] (correct: ${correctIndex})`);
      fixed++;
    }

    console.log(`\n🏁 Popravljeno ${fixed} pitanja.`);

  } catch (err) {
    console.error('❌ Greška:', err.message);
  } finally {
    await client.close();
  }
}

fix();
