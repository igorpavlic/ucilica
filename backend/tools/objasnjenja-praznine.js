#!/usr/bin/env node
/**
 * Radni popis predložaka bez objašnjenja — za autore i učitelje.
 * Pokreće generatore bez baze i piše CSV (UTF-8 s BOM-om, točka-zarez):
 *   node tools/objasnjenja-praznine.js > objasnjenja-radna-lista.csv
 * Jedan redak = jedan predložak (templateId), s primjerom pitanja i ključa.
 */
const path = require('path');
require.cache[require.resolve('dotenv')] = { exports: { config() {} } };
const log = console.log; console.log = () => {};
const { GENERATORS } = require(path.join(__dirname, '..', 'services', 'questionGenerator'));
const { TOPIC_METADATA } = require(path.join(__dirname, '..', 'services', 'gikEngine'));

const red = new Map();
for (const [slug, gen] of Object.entries(GENERATORS)) {
  const meta = TOPIC_METADATA[slug] || {};
  for (const q of gen()) {
    const kljuc = q.type === 'choice' ? (q._c ?? q.answers?.[q.correctIndex]) : q.type === 'true-false' ? (q.correct ? 'Točno' : 'Netočno') : q.correctAnswer ?? '';
    const k = q.templateId;
    if (!red.has(k)) red.set(k, { templateId: k, razred: meta.grade, predmet: meta.subject, tema: slug, pitanja: 0, bez: 0, primjer: q.question, kljuc: String(kljuc), izvor: q.objasnjenjeIzvor || '' });
    const r = red.get(k); r.pitanja++; if (!q.objasnjenje) { r.bez++; r.primjer = q.question; r.kljuc = String(kljuc); }
  }
}
const esc = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
const out = ['﻿razred;predmet;tema;templateId;pitanja_u_predlosku;bez_objasnjenja;primjer_pitanja;primjer_kljuca;prijedlog_objasnjenja'];
[...red.values()].filter((r) => r.bez > 0)
  .sort((a, b) => a.razred - b.razred || String(a.predmet).localeCompare(b.predmet) || b.bez - a.bez)
  .forEach((r) => out.push([r.razred, r.predmet, r.tema, r.templateId, r.pitanja, r.bez, r.primjer, r.kljuc, ''].map(esc).join(';')));
process.stdout.write(out.join('\r\n') + '\r\n');
console.log = log;
