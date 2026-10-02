/**
 * prijave.js — prijava pogrešnog ili nejasnog pitanja.
 *
 * Svaka prijava se sprema u zbirku `prijave` (ništa se ne gubi ako pošta ne
 * radi) i, ako je SMTP podešen, šalje e-poštom na PRIJAVE_EMAIL
 * (zadano contact@fromrim.com). E-adresa roditelja iz profila, ako je upisana,
 * ide u Reply-To, pa odgovor stiže roditelju, a ne djetetu.
 *
 * Varijable okruženja: SMTP_HOST, SMTP_PORT (587), SMTP_SECURE (true za 465),
 * SMTP_USER, SMTP_PASS, MAIL_FROM (zadano SMTP_USER), PRIJAVE_EMAIL.
 */
const nodemailer = require('nodemailer');
const { getDb } = require('../db/mongo');

const PRIMATELJ = () => process.env.PRIJAVE_EMAIL || 'contact@fromrim.com';
let transport = null;

function posta() {
  if (!process.env.SMTP_HOST) return null;
  if (!transport) {
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
  }
  return transport;
}

// Jedan redak bez znakova za novi red (zaglavlja e-pošte)
const redak = (s, n = 80) => String(s || '').replace(/[\r\n]+/g, ' ').trim().slice(0, n);

/** Točan odgovor kao tekst, za e-poštu učitelju */
function tocanOdgovor(q) {
  if (q.type === 'choice') return q.answers?.[q.correctIndex] ?? '';
  if (q.type === 'true-false') return q.correct ? 'Da / Točno' : 'Ne / Netočno';
  if (q.type === 'ordering') return (q.items || []).join(' → ');
  if (q.type === 'match') return (q.pairs || []).map((p) => `${p[0]} – ${p[1]}`).join('; ');
  return q.correctAnswer || '';
}

function tekstPoruke({ prijava, pitanje, tema }) {
  return [
    `Razlog prijave:\n${prijava.razlog}`,
    '',
    `Pitanje: ${pitanje.question}`,
    pitanje.passage ? `Tekst uz pitanje: ${pitanje.passage}` : null,
    pitanje.answers?.length ? `Ponuđeno: ${pitanje.answers.join(' | ')}` : null,
    `Točan odgovor u bazi: ${tocanOdgovor(pitanje)}`,
    pitanje.objasnjenje ? `Objašnjenje: ${pitanje.objasnjenje}` : null,
    `Tema: ${tema ? `${tema.grade}. razred, ${tema.name} (${tema.slug})` : '—'}`,
    `ID pitanja: ${pitanje._id}`,
    `Predložak: ${pitanje.templateId || '—'}`,
    '',
    `Prijavio: ${prijava.korisnik || 'gost'}`,
    `E-adresa roditelja: ${prijava.emailRoditelja || 'nije upisana'}`,
    `Vrijeme: ${prijava.createdAt.toISOString()}`,
  ].filter((x) => x !== null).join('\n');
}

/**
 * Spremi prijavu i pokušaj je poslati. Vraća { id, poslano }.
 * Greška pri slanju ne ruši prijavu — ostaje u bazi s poslano: false.
 */
async function prijavi({ pitanje, razlog, korisnik }) {
  const db = getDb();
  const tema = pitanje.topic_id ? await db.collection('topics').findOne({ _id: pitanje.topic_id }) : null;
  const prijava = {
    question_id: pitanje._id,
    topic_id: pitanje.topic_id || null,
    pitanje: pitanje.question,
    razlog,
    user_id: korisnik?._id || null,
    korisnik: korisnik?.username || null,
    emailRoditelja: korisnik?.emailRoditelja || null,
    status: 'nova',
    poslano: false,
    createdAt: new Date(),
  };
  const { insertedId } = await db.collection('prijave').insertOne(prijava);

  const t = posta();
  if (!t) return { id: insertedId, poslano: false };
  try {
    await t.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: PRIMATELJ(),
      ...(prijava.emailRoditelja ? { replyTo: prijava.emailRoditelja } : {}),
      subject: `Mudrolina — prijava pitanja: ${redak(pitanje.question, 70)}`,
      text: tekstPoruke({ prijava, pitanje, tema }),
    });
    await db.collection('prijave').updateOne({ _id: insertedId }, { $set: { poslano: true, poslanoAt: new Date() } });
    return { id: insertedId, poslano: true };
  } catch (err) {
    console.error('Prijava pitanja: slanje e-pošte nije uspjelo:', err.message);
    return { id: insertedId, poslano: false };
  }
}

module.exports = { prijavi, tekstPoruke, tocanOdgovor, PRIMATELJ };
