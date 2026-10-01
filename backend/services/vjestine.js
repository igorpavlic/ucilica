/**
 * vjestine.js — ponavljanje po krivulji zaboravljanja (FSRS)
 *
 * Dosad se pratilo samo "viđeno u zadnjih 10 rundi": binarno, bez pojma o tome
 * je li dijete pogodilo iz prve ili nakon tri pokušaja i kada je nešto vrijeme
 * ponoviti.
 *
 * Sada se prati VJEŠTINA, ne pojedino pitanje. Vještina je ishod iz kurikula
 * koji svako pitanje već nosi u `gik.outcome` (npr. "MAT OŠ A.1.4" — zbraja u
 * skupu brojeva do 20). Nakon svakog kviza FSRS za svaku dodirnutu vještinu
 * izračuna kada je sljedeći put treba ponoviti.
 *
 * Kolekcija `skill_states`: { user_id, skill, grade, subjectSlug, topicSlug,
 *                             card, stats, updatedAt }
 *
 * ts-fsrs, MIT: https://github.com/open-spaced-repetition/ts-fsrs
 */

const { fsrs, createEmptyCard, Rating, generatorParameters, State } = require('ts-fsrs');
const { getDb } = require('../db/mongo');

// enable_fuzz razbacuje rokove za par dana da se ponavljanja ne nakupe na isti
// dan. Djetetu je svejedno, a raspored je ravnomjerniji.
const raspored = fsrs(generatorParameters({ enable_fuzz: true }));

const zbirka = () => getDb().collection('skill_states');

/**
 * Ocjena pojedinog odgovora za FSRS.
 *
 * Za učenike 1.–4. razreda brzina čitanja i tipkanja ne smije biti skriveni
 * kriterij uspješnosti. Zato vrijeme odgovora ne mijenja ocjenu vještine:
 * točan odgovor je Good, a netočan Again. Vrijeme se i dalje može spremati
 * kao tehnički podatak, ali ne utječe na raspored ponavljanja.
 */
function ocjena({ tocno }) {
  return tocno ? Rating.Good : Rating.Again;
}

/**
 * Jedna FSRS ocjena po vještini iz svih zadataka te vještine u kvizu.
 * - sve točno      → Good
 * - dio točno      → Hard (potrebno skorije ponavljanje, ali znanje nije nula)
 * - ništa točno    → Again
 *
 * Time jedan promašaj više ne poništava nekoliko točnih odgovora.
 */
function objediniPoVjestini(stavke) {
  const poVjestini = new Map();

  for (const s of stavke) {
    if (!s.skill) continue;
    if (!poVjestini.has(s.skill)) {
      poVjestini.set(s.skill, { skill: s.skill, meta: s.meta, ocjene: [], tocnih: 0, ukupno: 0 });
    }
    const v = poVjestini.get(s.skill);
    v.ocjene.push(ocjena(s));
    v.ukupno++;
    if (s.tocno) v.tocnih++;
  }

  for (const v of poVjestini.values()) {
    if (v.tocnih === 0) v.ocjena = Rating.Again;
    else if (v.tocnih === v.ukupno) v.ocjena = Rating.Good;
    else v.ocjena = Rating.Hard;
  }
  return [...poVjestini.values()];
}

/**
 * Upiši rezultat kviza u stanje vještina.
 * stavke: [{ skill, meta, tocno, vrijemeMs, difficulty }]
 */
async function zabiljeziKviz(userId, stavke, sada = new Date()) {
  if (!userId || !stavke?.length) return [];

  const objedinjeno = objediniPoVjestini(stavke);
  if (!objedinjeno.length) return [];

  const postojeca = await zbirka()
    .find({ user_id: userId, skill: { $in: objedinjeno.map((v) => v.skill) } })
    .toArray();
  const poKljucu = new Map(postojeca.map((d) => [d.skill, d]));

  const ishodi = [];

  for (const v of objedinjeno) {
    const staro = poKljucu.get(v.skill);
    const karta = staro?.card ? ozivi(staro.card) : createEmptyCard(sada);
    const { card } = raspored.next(karta, sada, v.ocjena);

    const stats = staro?.stats || { pregleda: 0, tocnih: 0, ukupno: 0 };
    stats.pregleda += 1;
    stats.tocnih += v.tocnih;
    stats.ukupno += v.ukupno;

    await zbirka().updateOne(
      { user_id: userId, skill: v.skill },
      {
        $set: {
          user_id: userId,
          skill: v.skill,
          grade: v.meta?.grade,
          subjectSlug: v.meta?.subjectSlug,
          topicSlug: v.meta?.topicSlug,
          outcome: v.meta?.outcome,
          outcomeText: v.meta?.outcomeText,
          card: spremi(card),
          stats,
          updatedAt: sada,
        },
      },
      { upsert: true }
    );

    ishodi.push({ skill: v.skill, ocjena: v.ocjena, due: card.due, stabilnost: card.stability });
  }

  return ishodi;
}

/**
 * Vještine koje su dospjele za ponavljanje (ili se još nisu pojavile).
 * Vraća Set imena vještina koje bi kviz trebao uključiti.
 */
async function dospjele(userId, vjestine, sada = new Date()) {
  if (!userId || !vjestine?.length) return new Set(vjestine || []);

  const stanja = await zbirka()
    .find({ user_id: userId, skill: { $in: [...vjestine] } })
    .toArray();
  const poKljucu = new Map(stanja.map((d) => [d.skill, d]));

  const izlaz = new Set();
  for (const v of vjestine) {
    const s = poKljucu.get(v);
    if (!s || !s.card?.due) { izlaz.add(v); continue; } // nikad viđeno → uvijek
    if (new Date(s.card.due) <= sada) izlaz.add(v);
  }
  return izlaz;
}

/** Pregled stanja za prikaz roditelju ili djetetu */
async function pregled(userId, { grade } = {}) {
  if (!userId) return [];
  const upit = { user_id: userId };
  if (grade) upit.grade = grade;

  const stanja = await zbirka().find(upit).toArray();
  const sada = new Date();

  return stanja
    .map((s) => {
      const tocnost = s.stats?.ukupno ? s.stats.tocnih / s.stats.ukupno : 0;
      return {
        skill: s.skill,
        opis: s.outcomeText,
        predmet: s.subjectSlug,
        tema: s.topicSlug,
        tocnost: Math.round(tocnost * 100),
        pregleda: s.stats?.pregleda || 0,
        stabilnostDana: Math.round(s.card?.stability || 0),
        dospijeva: s.card?.due || null,
        dospjelo: s.card?.due ? new Date(s.card.due) <= sada : true,
        stanje: imeStanja(s.card?.state),
      };
    })
    .sort((a, b) => a.tocnost - b.tocnost); // najslabije prvo
}

const imeStanja = (st) => ({
  [State.New]: 'novo',
  [State.Learning]: 'uči se',
  [State.Review]: 'ponavljanje',
  [State.Relearning]: 'ponovno uči',
}[st] || 'novo');

/** FSRS karta ↔ MongoDB (datumi kao Date, ne ISO nizovi) */
const spremi = (c) => ({ ...c, due: new Date(c.due), last_review: c.last_review ? new Date(c.last_review) : undefined });
const ozivi = (c) => ({ ...c, due: new Date(c.due), last_review: c.last_review ? new Date(c.last_review) : undefined });

module.exports = { ocjena, objediniPoVjestini, zabiljeziKviz, dospjele, pregled, Rating };
