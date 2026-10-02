/**
 * privatnost.js — prava iz GDPR-a za dječji račun: privola roditelja,
 * izvoz svih podataka (pravo na pristup i prenosivost, čl. 15 i 20) i
 * brisanje računa (pravo na brisanje, čl. 17).
 *
 * Djeca u Hrvatskoj sama daju privolu za usluge informacijskog društva tek od
 * 16. godine (Zakon o provedbi Opće uredbe o zaštiti podataka, NN 42/2018,
 * čl. 19). Za učenike 1.–4. razreda privolu zato daje roditelj ili skrbnik.
 *
 * Svaka zbirka koja čuva podatke o pojedinom djetetu mora biti u
 * KORISNICKE_ZBIRKE — inače bi brisanje ostavilo trag. `item_ratings` i
 * `template_ratings` su zbirni podatci o pitanjima, bez korisnika.
 */
const { getDb } = require('../db/mongo');

// Verzija obavijesti o privatnosti na koju je dana privola. Kad se obavijest
// bitno promijeni, povećaj verziju — tada se može tražiti nova privola.
const VERZIJA_OBAVIJESTI = '2026-10-02';

// Zbirke s podatcima pojedinog djeteta (ključ: user_id).
const KORISNICKE_ZBIRKE = ['progress', 'quiz_attempts', 'skill_states', 'user_ratings', 'responses'];

/** Zapis privole koji se sprema uz korisnika pri registraciji. */
function zapisPrivole(sada = new Date()) {
  return { daje: 'roditelj ili skrbnik', verzijaObavijesti: VERZIJA_OBAVIJESTI, datum: sada };
}

/** Svi podatci o djetetu u jednom JSON-u (bez lozinke). */
async function izvoz(userId) {
  const db = getDb();
  // Lozinka (hash) ne izlazi iz poslužitelja ni u izvozu: uklanja se i
  // projekcijom i ovdje, za slučaj da se upit jednom promijeni.
  const zapis = await db.collection('users').findOne({ _id: userId }, { projection: { password: 0 } });
  const { password, ...korisnik } = zapis || {};
  const podatci = {};
  for (const z of KORISNICKE_ZBIRKE) {
    podatci[z] = await db.collection(z).find({ user_id: userId }).project({ user_id: 0 }).toArray();
  }
  return {
    izvezeno: new Date().toISOString(),
    opis: 'Svi podatci koje Učilica čuva o ovom računu.',
    korisnik,
    ...podatci,
  };
}

/** Trajno briše račun i sve podatke djeteta. Vraća broj obrisanih zapisa po zbirci. */
async function obrisi(userId) {
  const db = getDb();
  const obrisano = {};
  for (const z of KORISNICKE_ZBIRKE) {
    obrisano[z] = (await db.collection(z).deleteMany({ user_id: userId })).deletedCount;
  }
  obrisano.users = (await db.collection('users').deleteOne({ _id: userId })).deletedCount;
  return obrisano;
}

module.exports = { VERZIJA_OBAVIJESTI, KORISNICKE_ZBIRKE, zapisPrivole, izvoz, obrisi };
