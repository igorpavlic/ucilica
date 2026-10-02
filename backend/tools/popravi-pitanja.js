/**
 * popravi-pitanja.js — pitanja koja su u bazi spremljena sa starim, pogrešnim
 * tekstom isključuje (isActive: false) i za njihove teme generira ispravljena.
 *
 * Što hvata:
 *   - prijedlog s pogrešnim padežom: „nakon: četvrtak”, „Tko radi u "polje"?”
 *     (ista provjera kao u testu, seeds/padezi.js);
 *   - „Točno/Netočno” ponuđeno uz pitanje (treba Da/Ne);
 *   - stare kratke osnove koje su zamijenjene („Umanjenica od…”, „Što je
 *     suprotno od…”, „Koja dva godišnja doba…”, „Koji je PRVI korak…”).
 *
 * Napredak djece ostaje: odgovori su vezani uz _id pitanja, koje se ne briše.
 *
 * Pokretanje (iz backend/):
 *   node tools/popravi-pitanja.js              — samo ispis (ništa ne mijenja)
 *   node tools/popravi-pitanja.js --primijeni  — isključi i generiraj nova
 */
require('dotenv').config();
const { connect, getDb, close } = require('../db/mongo');
const { generateAndStore } = require('../services/questionGenerator');
const { pogresanPadez, tocnoUzPitanje } = require('../seeds/padezi');

const PRIMIJENI = process.argv.includes('--primijeni');
const STARE_OSNOVE = [
  /^Umanjenica od "/, /^Što je suprotno od "/, /suprotno značenje od "/, /zadužen za "/,
  /^Koja dva godišnja doba dolaze nakon/, /^Koji je PRVI korak za/,
];

const zaPopravak = (q) => pogresanPadez(q.question) || tocnoUzPitanje(q) || STARE_OSNOVE.some((r) => r.test(q.question || ''));

async function main() {
  await connect();
  try {
    const db = getDb();
    const sva = await db.collection('questions')
      .find({ isActive: true }).project({ question: 1, type: 1, answers: 1, topic_id: 1 }).toArray();
    const lose = sva.filter(zaPopravak);
    const poTemi = new Map();
    for (const q of lose) {
      const k = String(q.topic_id);
      if (!poTemi.has(k)) poTemi.set(k, { topic_id: q.topic_id, primjeri: [] });
      poTemi.get(k).primjeri.push(q.question);
    }
    console.log(`Aktivnih pitanja: ${sva.length}; za popravak: ${lose.length} u ${poTemi.size} tema.`);
    for (const { topic_id, primjeri } of poTemi.values()) {
      const t = await db.collection('topics').findOne({ _id: topic_id });
      console.log(`  ${t ? `${t.grade}. ${t.name}` : topic_id}: ${primjeri.length} — npr. „${primjeri[0]}”`);
    }
    if (!PRIMIJENI) {
      console.log('\nNišta nije promijenjeno. Za popravak pokreni s --primijeni.');
      return;
    }
    await db.collection('questions').updateMany(
      { _id: { $in: lose.map((q) => q._id) } },
      { $set: { isActive: false, iskljucenoRazlog: 'stari tekst (padež ili Točno/Netočno uz pitanje)', iskljucenoAt: new Date() } }
    );
    let novih = 0;
    for (const { topic_id } of poTemi.values()) {
      const t = await db.collection('topics').findOne({ _id: topic_id });
      if (t) novih += await generateAndStore(t, t.subject_id, t.grade);
    }
    console.log(`\nIsključeno ${lose.length}, generirano ${novih} novih pitanja.`);
  } finally { await close(); }
}
main().catch((err) => { console.error(err); process.exitCode = 1; });
