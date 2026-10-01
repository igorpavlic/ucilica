/**
 * obradjeno.js — koje je gradivo dijete već obradilo
 *
 * Analiza 2026-10-01: „Razred nije isto što i naučeno gradivo.” Miješano
 * ponavljanje filtriralo je samo po razredu, pa je u rujnu moglo izvući
 * sadržaj s kraja godine.
 *
 * Opseg ponavljanja određuje se ovim redom:
 *   1. 'oznaceno' — roditelj ili učitelj označio je obrađene teme (users.obradjeneTeme[razred])
 *   2. 'vjezbano' — teme koje je dijete već vježbalo barem jednom (progress)
 *   3. 'sve'      — nema podataka (gost ili novi korisnik); klijent to jasno kaže
 *
 * Označavanje je izričito i ima prednost: dijete je možda vježbalo temu
 * „iz znatiželje” prije nego što je obrađena u školi.
 */
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/mongo');

const kolekcija = (ime) => getDb().collection(ime);

async function temeRazreda(grade) {
  return kolekcija('topics').find({ grade, isActive: true }).toArray();
}

/** Teme koje je dijete već vježbalo u razredu (iz zapisa napretka). */
async function vjezbaneTeme(userId, grade) {
  if (!userId) return [];
  const zapisi = await kolekcija('progress').find({ user_id: userId, grade }).project({ topic_id: 1 }).toArray();
  const ids = new Map();
  for (const z of zapisi) if (z.topic_id) ids.set(String(z.topic_id), z.topic_id);
  return [...ids.values()];
}

/**
 * Opseg miješanog ponavljanja.
 * Vraća { nacin, topicIds } — topicIds je null kad nema ograničenja.
 */
async function opsegZaPonavljanje(userId, grade) {
  if (userId) {
    const user = await kolekcija('users').findOne({ _id: userId }, { projection: { obradjeneTeme: 1 } });
    const oznaceno = user?.obradjeneTeme?.[String(grade)];
    if (Array.isArray(oznaceno) && oznaceno.length) {
      return { nacin: 'oznaceno', topicIds: oznaceno.map((id) => (id instanceof ObjectId ? id : new ObjectId(String(id)))) };
    }
    const vjezbano = await vjezbaneTeme(userId, grade);
    if (vjezbano.length) return { nacin: 'vjezbano', topicIds: vjezbano };
  }
  return { nacin: 'sve', topicIds: null };
}

/** Pregled tema razreda s oznakama za prikaz u profilu. */
async function pregled(userId, grade) {
  const [teme, user, vjezbano] = await Promise.all([
    temeRazreda(grade),
    kolekcija('users').findOne({ _id: userId }, { projection: { obradjeneTeme: 1 } }),
    vjezbaneTeme(userId, grade)
  ]);
  const oznaceno = new Set((user?.obradjeneTeme?.[String(grade)] || []).map(String));
  const vj = new Set(vjezbano.map(String));
  const predmeti = new Map((await kolekcija('subjects').find({ grade }).toArray()).map((s) => [String(s._id), s]));
  return teme
    .sort((a, b) => String(a.subject_id).localeCompare(String(b.subject_id)) || (a.order || 0) - (b.order || 0))
    .map((t) => ({
      _id: t._id, name: t.name, icon: t.icon, slug: t.slug,
      predmet: predmeti.get(String(t.subject_id))?.name || '',
      oznaceno: oznaceno.has(String(t._id)),
      vjezbano: vj.has(String(t._id))
    }));
}

/** Spremi označene teme za razred. Prazan popis briše oznake (vraća se na 'vjezbano'). */
async function postavi(userId, grade, topicIds) {
  const teme = await temeRazreda(grade);
  const dopusteno = new Set(teme.map((t) => String(t._id)));
  const valjani = [...new Set((topicIds || []).map(String))].filter((id) => dopusteno.has(id));
  if (valjani.length !== new Set((topicIds || []).map(String)).size) {
    const e = new Error('Neka tema ne pripada odabranom razredu.');
    e.statusCode = 400;
    throw e;
  }
  await kolekcija('users').updateOne({ _id: userId },
    { $set: { [`obradjeneTeme.${grade}`]: valjani.map((id) => new ObjectId(id)), updatedAt: new Date() } });
  return valjani.length;
}

module.exports = { opsegZaPonavljanje, pregled, postavi, vjezbaneTeme };
