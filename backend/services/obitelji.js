/**
 * obitelji.js — jednokratna dopuna polja `obitelj` za pitanja upisana prije
 * nego što se obitelj zapisivala.
 *
 * Bez nje bi „U kojem se kraju Hrvatske nalazi grad Vukovar?” i „…grad Pula?”
 * ostali različite obitelji (imena nisu pod navodnicima), pa bi kviz iz stare
 * banke i dalje mogao složiti sedam takvih pitanja zaredom.
 *
 * Obitelj se uzima iz generatora teme (isti itemKey), a za pitanja koja
 * generator više ne daje prepoznaje se iz svih pitanja teme. Pitanja uz tekst
 * za čitanje ostaju bez obitelji (obitelj im je sam tekst pitanja).
 * Pokreće se u pozadini pri startu servera; kad je sve dopunjeno, ne radi ništa.
 */
const { getDb } = require('../db/mongo');
const { prepoznajObitelji } = require('./questionFamily');

async function dopuniObitelji({ ponavljanjaGeneratora = 5, log = console.log } = {}) {
  const { GENERATORS } = require('./questionGenerator');
  const db = getDb();
  const teme = await db.collection('topics').find({}).project({ _id: 1, slug: 1 }).toArray();
  let ukupno = 0;
  for (const tema of teme) {
    const bez = await db.collection('questions')
      .find({ topic_id: tema._id, obitelj: { $exists: false }, passage: { $in: ['', null] } })
      .project({ _id: 1, itemKey: 1, question: 1 }).toArray();
    if (!bez.length) continue;

    // 1) obitelj kakvu danas daje generator teme
    const izGeneratora = new Map();
    const gen = GENERATORS[tema.slug];
    if (gen) {
      for (let i = 0; i < ponavljanjaGeneratora; i++) {
        try { for (const q of gen()) if (q.itemKey && q.obitelj) izGeneratora.set(q.itemKey, q.obitelj); } catch { break; }
      }
    }
    // 2) inače prepoznaj predložak iz svih pitanja teme
    const sva = await db.collection('questions').find({ topic_id: tema._id, passage: { $in: ['', null] } }).project({ _id: 1, question: 1 }).toArray();
    const prepoznato = new Map(prepoznajObitelji(sva).map((o, i) => [String(sva[i]._id), o]));

    const zapisi = bez.map((q) => ({
      updateOne: { filter: { _id: q._id }, update: { $set: { obitelj: izGeneratora.get(q.itemKey) || prepoznato.get(String(q._id)) } } },
    })).filter((z) => z.updateOne.update.$set.obitelj);
    for (let i = 0; i < zapisi.length; i += 500) await db.collection('questions').bulkWrite(zapisi.slice(i, i + 500), { ordered: false });
    ukupno += zapisi.length;
  }
  if (ukupno) log(`🧩 Dopunjena obitelj za ${ukupno} pitanja.`);
  return ukupno;
}

/**
 * Isključi (isActive: false) pitanja iz postojeće baze koja se vežu uz strana
 * mjesta i pojmove ili spominju tropsko voće (seeds/lokalno.js). Generator
 * teme poslije daje zamjenska, lokalizirana pitanja. Napredak djece ostaje
 * (odgovori su vezani uz _id, koji se ne briše).
 */
async function iskljuciStrano({ log = console.log } = {}) {
  const { GENERATORS } = require('./questionGenerator');
  const { straniPojam } = require('../seeds/lokalno');
  const db = getDb();
  const teme = await db.collection('topics').find({}).project({ _id: 1, slug: 1 }).toArray();
  let ukupno = 0;
  for (const tema of teme) {
    const ime = GENERATORS[tema.slug]?.name || '';
    const sva = await db.collection('questions').find({ topic_id: tema._id, isActive: true })
      .project({ question: 1, answers: 1, correctAnswer: 1, pairs: 1, items: 1, visual: 1 }).toArray();
    const lose = sva.filter((q) => straniPojam(q, ime) || (!q.visual && /\b(banan|naranč)/i.test([q.question, ...(q.answers || []), ...(q.items || [])].join(' ')) && !/glas|slog|slov/i.test(q.question || '')));
    if (!lose.length) continue;
    await db.collection('questions').updateMany({ _id: { $in: lose.map((q) => q._id) } },
      { $set: { isActive: false, iskljucenoRazlog: 'strani pojam ili tropsko voće (seeds/lokalno.js)', iskljucenoAt: new Date() } });
    ukupno += lose.length;
  }
  if (ukupno) log(`🇭🇷 Isključeno ${ukupno} pitanja vezanih uz strane pojmove.`);
  return ukupno;
}

module.exports = { dopuniObitelji, iskljuciStrano };
