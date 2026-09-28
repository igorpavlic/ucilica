/**
 * Read-only editorial report from completed answers. Run from backend:
 * node tools/analyze-distractors.js
 * At least 20 responses per item; never prints user IDs or raw personal data.
 */
require('dotenv').config();
const { connect, getDb, close } = require('../db/mongo');

async function main() {
  await connect();
  try {
    const db = getDb();
    const rows = await db.collection('progress').aggregate([
      { $unwind: '$answers' },
      { $match: { 'answers.chosenText': { $type: 'string' } } },
      { $group: { _id: { question: '$answers.question_id', answer: '$answers.chosenText' }, count: { $sum: 1 } } },
      { $group: { _id: '$_id.question', total: { $sum: '$count' }, selected: { $push: { text: '$_id.answer', count: '$count' } } } },
      { $match: { total: { $gte: 20 } } }
    ], { allowDiskUse: true }).toArray();
    const ids = rows.map(row => row._id);
    const questions = await db.collection('questions').find({ _id: { $in: ids }, type: 'choice' }).toArray();
    const byId = new Map(rows.map(row => [String(row._id), row]));
    const report = questions.map(q => {
      const stats = byId.get(String(q._id));
      const correct = q.answers[q.correctIndex];
      const distractors = q.answers.filter(a => a !== correct).map(a => {
        const count = stats.selected.find(s => s.text === a)?.count || 0;
        return { answer: a, count, share: Math.round(100 * count / stats.total) };
      }).sort((a, b) => b.count - a.count);
      return { questionId: String(q._id), skill: q.gik?.outcome || '', question: q.question,
        responses: stats.total, mostCommonError: distractors[0] || null,
        replaceCandidates: distractors.filter(d => d.count / stats.total < 0.05) };
    });
    console.log(JSON.stringify({ minimumResponses: 20, items: report }, null, 2));
  } finally { await close(); }
}
main().catch(err => { console.error(err); process.exitCode = 1; });
