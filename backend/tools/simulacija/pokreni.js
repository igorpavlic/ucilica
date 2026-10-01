#!/usr/bin/env node
/**
 * Simulirani pilot Učilice — sintetička djeca kroz STVARNI servis kviza.
 *
 * Ovo NIJE pilot s djecom. Simulacija provjerava mehaniku sustava pod jasno
 * navedenim pretpostavkama: kalibraciju težine, izbor pitanja, opseg
 * ponavljanja, otkrivanje loših pitanja i izloženost objašnjenjima. Ne može
 * pokazati razumljivost uputa, kvalitetu tekstova ni učinak objašnjenja na
 * učenje — to mjeri samo stvarni pilot.
 *
 * Model odgovora (pretpostavke, ne mjerenja):
 *   P(točno) = c + (1 − c) · σ(a · (θ_predmet + λ · čitanje − b))
 *   θ ~ N(0,1) po predmetu, čitanje ~ N(0,1); λ = 0,6 za pitanja uz tekst,
 *   0,25 za ostala pitanja u 1.–2. razredu, 0,1 inače.
 *   b = b_predložak + b_zadatak; b_predložak ~ N(m(težina), 0,6), b_zadatak ~ N(0, 0,35),
 *   m(1..4) = −1,1 / −0,4 / 0,3 / 0,9 — autorska težina djelomično točna.
 *   c = 1/broj ponuda (izbor), 0,5 (točno/netočno), 0,02 (upis).
 *   Vrijeme: ovisi o vrsti zadatka, brzini čitanja i tipkanja, NE o znanju izravno.
 *   Ubačene neispravnosti (≈2 % + 2 %): „krivi ključ” (bolja djeca češće
 *   „griješe”) i „višeznačno” (uspjeh ≈ 45 % bez obzira na znanje).
 *
 * Pokretanje:
 *   node tools/simulacija/pokreni.js --krak elo  --djece 240 --sesija 18 --seed 20261001 --izlaz sim-elo.json
 *   node tools/simulacija/pokreni.js --krak kvote ...
 */
const path = require('path');
const fs = require('fs');
const KORIJEN = path.join(__dirname, '..', '..');

const arg = (ime, zadano) => { const i = process.argv.indexOf(`--${ime}`); return i > 0 ? process.argv[i + 1] : zadano; };
const KRAK = arg('krak', 'elo');
const DJECE = Number(arg('djece', 240));
const SESIJA = Number(arg('sesija', 18));
const SEED = Number(arg('seed', 20261001));
const IZLAZ = arg('izlaz', `sim-${KRAK}.json`);

// Kvote = Elo se nikad ne uključuje; Elo krak = uobičajeni prag.
process.env.UCILICA_MIN_ODGOVORA_ZA_ELO = KRAK === 'kvote' ? '1000000000' : '15';

// Ponovljiva nasumičnost za generatore, servis i model.
let st = SEED >>> 0;
Math.random = () => { st = (Math.imul(st, 1664525) + 1013904223) >>> 0; return st / 4294967296; };
const rnd = () => Math.random();
const normal = () => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const sigm = (x) => 1 / (1 + Math.exp(-x));

// Tiho: servisi pišu u konzolu pri generiranju.
const log = console.log; console.log = () => {}; console.error = () => {};
require.cache[require.resolve('dotenv')] = { exports: { config() {} } };

const { napraviBazu, podmetni, oid } = require('./lazna-baza');
const baza = napraviBazu();
podmetni(baza, KORIJEN);

const { TOPIC_METADATA } = require(path.join(KORIJEN, 'services/gikEngine'));
const { GENERATORS, generateAndStore } = require(path.join(KORIJEN, 'services/questionGenerator'));
const { createQuizService } = require(path.join(KORIJEN, 'modules/quiz/quiz.service'));
const obradjeno = require(path.join(KORIJEN, 'services/obradjeno'));
const service = createQuizService();
const db = baza;

const crypto = require('crypto');
const h01 = (s) => parseInt(crypto.createHash('md5').update(String(s) + SEED).digest('hex').slice(0, 8), 16) / 0xffffffff;
const hNorm = (s) => { const u = Math.max(1e-9, h01(s + 'a')), v = h01(s + 'b'); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

(async () => {
  const t0 = Date.now();
  // ── 1. banka pitanja ───────────────────────────────────────────
  const predmetiPoRazredu = {};
  const teme = [];
  const redPoPredmetu = {};
  for (const [slug, meta] of Object.entries(TOPIC_METADATA)) {
    if (!GENERATORS[slug]) continue;
    const kljuc = `${meta.grade}:${meta.subject}`;
    if (!predmetiPoRazredu[kljuc]) {
      const { insertedId } = await db.collection('subjects').insertOne({ slug: meta.subject, name: meta.subject, grade: meta.grade, isActive: true });
      predmetiPoRazredu[kljuc] = insertedId;
    }
    redPoPredmetu[kljuc] = (redPoPredmetu[kljuc] || 0) + 1;
    const topic = { _id: oid(), slug, name: slug, grade: meta.grade, subject_id: predmetiPoRazredu[kljuc], order: redPoPredmetu[kljuc], isActive: true };
    await db.collection('topics').insertOne(topic);
    await generateAndStore(topic, topic.subject_id, meta.grade);
    teme.push(topic);
  }
  const pitanja = db.kolekcije.questions.docs;

  // ── 2. stvarni parametri pitanja (skriveni od sustava) ──────────
  const M = { 1: -1.1, 2: -0.4, 3: 0.3, 4: 0.9 };
  const pravo = new Map();
  for (const q of pitanja) {
    const tpl = q.templateId || q.question;
    const bT = M[Math.min(4, q.difficulty || 1)] + 0.6 * hNorm('t' + tpl);
    const b = bT + 0.35 * hNorm('i' + (q.itemKey || q._id));
    const r = h01('d' + (q.itemKey || q._id));
    const kvar = r < 0.02 ? 'krivi-kljuc' : r < 0.04 ? 'visezn' : null;
    const lambda = q.passage ? 0.6 : q.grade <= 2 ? 0.25 : 0.1;
    const c = q.type === 'choice' ? 1 / Math.max(2, q.answers.length) : q.type === 'true-false' ? 0.5 : q.type === 'input' ? 0.02 : 0.05;
    pravo.set(String(q._id), { b, bT, kvar, lambda, c, a: 1 + 0.2 * hNorm('a' + q._id) });
  }

  // ── 3. djeca ────────────────────────────────────────────────────
  const djeca = [];
  for (let i = 0; i < DJECE; i++) {
    const grade = 1 + (i % 4);
    const { insertedId } = await db.collection('users').insertOne({ username: `d${i}`, grade, totalScore: 0, streak: 0 });
    // Napredak školske godine: koliki je udio tema u svakom predmetu obrađen (30–100 %).
    const godina = 0.3 + 0.7 * rnd();
    djeca.push({ id: insertedId, i, grade, godina,
      theta: { hrvatski: normal(), matematika: normal(), priroda: normal() },
      citanje: normal(), tipkanje: normal(), oznacava: i % 8 < 4 });
  }
  const temeRazreda = (g) => teme.filter((t) => t.grade === g);
  const obradjeneTeme = (d) => {
    const po = {};
    for (const t of temeRazreda(d.grade)) (po[String(t.subject_id)] ||= []).push(t);
    return Object.values(po).flatMap((arr) => arr.sort((a, b) => a.order - b.order).slice(0, Math.max(1, Math.round(arr.length * d.godina))));
  };
  for (const d of djeca) {
    d.obradjeno = obradjeneTeme(d);
    d.obradjenoSet = new Set(d.obradjeno.map((t) => String(t._id)));
    if (d.oznacava) await obradjeno.postavi(d.id, d.grade, d.obradjeno.map((t) => String(t._id)));
  }

  // ── 4. model odgovora ──────────────────────────────────────────
  // Pitanja po ID-u; banka može narasti kad servis dogenerira pitanja.
  const poId = new Map();
  const pit = (id) => {
    let q = poId.get(String(id));
    if (!q) { for (const x of pitanja) if (!poId.has(String(x._id))) poId.set(String(x._id), x); q = poId.get(String(id)); }
    return q;
  };
  const parametri = (q) => {
    if (!pravo.has(String(q._id))) {
      // dogenerirano pitanje istoga sadržaja dijeli parametre s izvornim (isti itemKey)
      const isti = pitanja.find((x) => x.itemKey && x.itemKey === q.itemKey && pravo.has(String(x._id)));
      pravo.set(String(q._id), isti ? pravo.get(String(isti._id)) : { b: 0, bT: 0, kvar: null, lambda: 0.1, c: 0.25, a: 1 });
    }
    return pravo.get(String(q._id));
  };
  const temaSlug = new Map(teme.map((t) => [String(t._id), t.slug]));
  const predmetPit = (q) => TOPIC_METADATA[temaSlug.get(String(q.topic_id))].subject;
  function odgovori(d, q) {
    const p = parametri(q);
    const th = d.theta[predmetPit(q)] + p.lambda * d.citanje;
    const zna = sigm(p.a * (th - p.b));
    let pTocno = p.c + (1 - p.c) * zna;
    if (p.kvar === 'krivi-kljuc') pTocno = p.c + (1 - p.c) * (1 - zna) * 0.6;
    if (p.kvar === 'visezn') pTocno = 0.45;
    const tocno = rnd() < pTocno;
    // vrijeme: čitanje i tipkanje, ne znanje
    const baza = q.passage ? 25000 : q.type === 'input' ? 9000 : 6000;
    const t = baza * Math.exp(-0.35 * d.citanje) * (q.type === 'input' ? Math.exp(-0.3 * d.tipkanje) : 1) * Math.exp(0.25 * normal());
    return { tocno, vrijemeMs: Math.round(t), pTocno, zna };
  }
  function kaoOdgovor(q, safe, attempt, tocno) {
    const id = String(q._id);
    if (q.type === 'choice') {
      const order = attempt.answer_orders?.[id];
      const prikazTocan = order ? order.indexOf(q.correctIndex) : q.correctIndex;
      if (tocno) return prikazTocan;
      const ostali = safe.answers.map((_, i) => i).filter((i) => i !== prikazTocan);
      return ostali[Math.floor(rnd() * ostali.length)];
    }
    if (q.type === 'input') return tocno ? q.correctAnswer : 'netočno';
    if (q.type === 'true-false') return tocno ? q.correct : !q.correct;
    if (q.type === 'ordering') return tocno ? q.items : [...q.items].reverse();
    if (q.type === 'match') {
      const tok = attempt.match_tokens[id];
      const veze = Object.fromEntries(q.pairs.map((_, i) => [i, tok[i]]));
      if (!tocno && q.pairs.length > 1) { veze[0] = tok[1]; veze[1] = tok[0]; }
      return veze;
    }
    return null;
  }

  // ── 5. sesije ──────────────────────────────────────────────────
  const zapisSesija = [];
  const izlozenost = { pogresnih: 0, pogresnihSObjasnjenjem: 0, poVrsti: {} };
  const ponavljanje = [];
  const iscrpljeno = [];
  for (let s = 0; s < SESIJA; s++) {
    for (const d of djeca) {
      const review = s % 6 === 5; // svaka šesta sesija je miješano ponavljanje
      let ses, temaSesije = null;
      if (review) ses = await service.createReviewSession({ grade: d.grade, userId: d.id, count: 7 });
      else {
        // dijete vježba obrađene teme; 10 % „iz znatiželje” bilo koju temu razreda
        const izbor = rnd() < 0.1 ? temeRazreda(d.grade) : d.obradjeno;
        const t = izbor[Math.floor(rnd() * izbor.length)];
        temaSesije = t.slug;
        ses = await service.createSession({ topicId: t._id, userId: d.id, count: 7 });
      }
      if (!ses.questions?.length) { iscrpljeno.push({ dijete: d.i, s, review, tema: temaSesije }); continue; }
      const attempt = await db.collection('quiz_attempts').findOne({ _id: ses.attemptId });
      const answers = [];
      const stavke = [];
      for (const sq of ses.questions) {
        const q = pit(sq._id);
        const o = odgovori(d, q);
        const ua = kaoOdgovor(q, sq, attempt, o.tocno);
        const r = await service.checkAnswer({ attemptId: ses.attemptId, questionId: q._id, answer: ua, userId: d.id });
        if (!r.isCorrect) {
          izlozenost.pogresnih++;
          if (r.objasnjenje) izlozenost.pogresnihSObjasnjenjem++;
          const v = q.objasnjenjeVrsta || (q.objasnjenje ? (q.passage ? 'dokaz' : 'autor') : 'nema');
          izlozenost.poVrsti[v] = (izlozenost.poVrsti[v] || 0) + 1;
        }
        answers.push({ questionId: q._id, userAnswer: ua, timeTaken: o.vrijemeMs });
        stavke.push({ q: String(q._id), tocno: r.isCorrect, p: o.pTocno, model: o.tocno });
      }
      const pred = await service.submitQuiz({ userId: d.id, topicId: review ? null : ses.questions.length && pit(ses.questions[0]._id).topic_id,
        reviewGrade: review ? d.grade : null, attemptId: ses.attemptId, answers });
      zapisSesija.push({ dijete: d.i, s, review, uspjeh: pred.progress.correctAnswers / pred.progress.totalQuestions,
        ocekivano: stavke.reduce((a, x) => a + x.p, 0) / stavke.length });
      if (review) {
        const ids = ses.questions.map((q) => String(pit(q._id).topic_id));
        const predmeti = ses.questions.map((q) => predmetPit(pit(q._id)));
        ponavljanje.push({ dijete: d.i, nacin: ses.opseg?.nacin, izvanObradjenog: ids.filter((id) => !d.obradjenoSet.has(id)).length,
          ukupno: ids.length, predmeti });
      }
    }
  }

  // ── 6. izvoz ───────────────────────────────────────────────────
  const responses = db.kolekcije.responses?.docs || [];
  const izvoz = {
    krak: KRAK, seed: SEED, djece: DJECE, sesija: SESIJA, trajanjeS: Math.round((Date.now() - t0) / 1000),
    pitanja: pitanja.map((q) => ({ id: String(q._id), itemKey: q.itemKey, templateId: q.templateId, grade: q.grade,
      predmet: predmetPit(q), tema: temaSlug.get(String(q.topic_id)), type: q.type, difficulty: q.difficulty,
      passage: !!q.passage, proces: q.proces || null, objasnjenje: !!q.objasnjenje, objasnjenjeVrsta: q.objasnjenjeVrsta || (q.objasnjenje ? (q.passage ? 'dokaz' : 'autor') : null),
      ...parametri(q) })),
    djeca: djeca.map((d) => ({ i: d.i, id: String(d.id), grade: d.grade, theta: d.theta, citanje: d.citanje, tipkanje: d.tipkanje, oznacava: d.oznacava, godina: d.godina })),
    odgovori: responses.map((r) => ({ u: String(r.user_id), q: String(r.question_id), k: r.kljuc, t: r.template_id, tocno: r.tocno, ms: r.vrijemeMs, oD: r.ocjenaDjeteta })),
    sesije: zapisSesija, izlozenost, ponavljanje, iscrpljeno,
    ocjeneDjece: (db.kolekcije.user_ratings?.docs || []).map((r) => ({ u: String(r.user_id), s: String(r.subject_id), rating: r.rating, n: r.odgovora })),
    ocjenePitanja: (db.kolekcije.item_ratings?.docs || []).map((r) => ({ k: r.kljuc, q: String(r.question_id), rating: r.rating, n: r.odgovora })),
    predmeti: Object.fromEntries(Object.entries(predmetiPoRazredu).map(([k, v]) => [String(v), k]))
  };
  fs.writeFileSync(IZLAZ, JSON.stringify(izvoz));
  log(`${KRAK}: ${zapisSesija.length} sesija (${iscrpljeno.length} bez novih pitanja), ${responses.length} odgovora, ${pitanja.length} pitanja, ${izvoz.trajanjeS} s → ${IZLAZ}`);
})().catch((e) => { log(e.stack); process.exit(1); });
