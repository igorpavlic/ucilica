/**
 * Lažna MongoDB baza u memoriji za simulaciju pilota.
 * Podržava upravo ono što servisi Mudroline koriste, s hash-indeksima na
 * najčešćim poljima kako bi tisuće sesija prošle u razumnom vremenu.
 */
const { ObjectId } = require('mongodb');

const oid = () => new ObjectId();
const dohvati = (doc, put) => put.split('.').reduce((o, k) => (o == null ? undefined : o[k]), doc);
const postavi = (doc, put, v) => {
  const d = put.split('.');
  let o = doc;
  for (const k of d.slice(0, -1)) { if (o[k] == null || typeof o[k] !== 'object') o[k] = {}; o = o[k]; }
  o[d[d.length - 1]] = v;
};
const jednako = (a, b) => (a instanceof ObjectId || b instanceof ObjectId ? String(a) === String(b) : a === b || (a == null && b == null));

function podudara(doc, upit) {
  return Object.entries(upit).every(([k, v]) => {
    if (k === '$and') return v.every((p) => podudara(doc, p));
    const dv = dohvati(doc, k);
    if (v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof ObjectId) && !(v instanceof Date)) {
      if ('$exists' in v) return (dv !== undefined) === !!v.$exists;
      if ('$in' in v) return v.$in.some((x) => jednako(x, dv));
      if ('$nin' in v) return !v.$nin.some((x) => jednako(x, dv));
      if ('$ne' in v) return !jednako(dv, v.$ne);
      if ('$gte' in v) return dv >= v.$gte;
    }
    return jednako(dv, v);
  });
}

const INDEKSI = ['_id', 'user_id', 'topic_id', 'kljuc', 'template_id', 'question_id'];

function napraviBazu() {
  const kolekcije = {};
  function kol(ime) {
    if (kolekcije[ime]) return kolekcije[ime].api;
    const docs = [];
    const idx = Object.fromEntries(INDEKSI.map((f) => [f, new Map()]));
    const dodajIdx = (d) => { for (const f of INDEKSI) { const v = d[f]; if (v === undefined) continue; const k = String(v); if (!idx[f].has(k)) idx[f].set(k, []); idx[f].get(k).push(d); } };
    const kandidati = (upit) => {
      for (const f of INDEKSI) {
        const v = upit[f];
        if (v === undefined) continue;
        if (v && typeof v === 'object' && !(v instanceof ObjectId)) {
          if (Array.isArray(v.$in)) return v.$in.flatMap((x) => idx[f].get(String(x)) || []);
          continue;
        }
        return idx[f].get(String(v)) || [];
      }
      return docs;
    };
    const nadji = (upit = {}) => kandidati(upit).filter((d) => podudara(d, upit));
    const kursor = (arr) => ({
      sort(spec) {
        const [[k, smjer]] = Object.entries(spec);
        arr = [...arr].sort((a, b) => (dohvati(a, k) > dohvati(b, k) ? 1 : -1) * smjer);
        return this;
      },
      limit(n) { arr = arr.slice(0, n); return this; },
      project() { return this; },
      toArray: async () => arr
    });
    const api = {
      findOne: async (u) => nadji(u)[0] || null,
      find: (u = {}) => kursor(nadji(u)),
      countDocuments: async (u = {}) => nadji(u).length,
      insertOne: async (d) => { const doc = { _id: d._id || oid(), ...d }; docs.push(doc); dodajIdx(doc); return { insertedId: doc._id }; },
      insertMany: async (arr) => { const ids = {}; arr.forEach((d, i) => { const doc = { _id: d._id || oid(), ...d }; docs.push(doc); dodajIdx(doc); ids[i] = doc._id; }); return { insertedCount: arr.length, insertedIds: ids }; },
      updateOne: async (u, op, opt = {}) => {
        let d = nadji(u)[0];
        if (!d && opt.upsert) {
          d = { _id: oid() };
          for (const [k, v] of Object.entries(u)) if (!(v && typeof v === 'object' && !(v instanceof ObjectId))) postavi(d, k, v);
          if (op.$setOnInsert) for (const [k, v] of Object.entries(op.$setOnInsert)) postavi(d, k, v);
          if (op.$set) for (const [k, v] of Object.entries(op.$set)) postavi(d, k, v);
          if (op.$inc) for (const [k, v] of Object.entries(op.$inc)) postavi(d, k, (dohvati(d, k) || 0) + v);
          docs.push(d); dodajIdx(d);
          return { matchedCount: 0, modifiedCount: 0, upsertedCount: 1 };
        }
        if (!d) return { matchedCount: 0, modifiedCount: 0 };
        if (op.$set) for (const [k, v] of Object.entries(op.$set)) postavi(d, k, v);
        if (op.$inc) for (const [k, v] of Object.entries(op.$inc)) postavi(d, k, (dohvati(d, k) || 0) + v);
        return { matchedCount: 1, modifiedCount: 1 };
      },
      updateMany: async (u, op) => {
        const sve = nadji(u);
        for (const d of sve) if (op.$set) for (const [k, v] of Object.entries(op.$set)) postavi(d, k, v);
        return { matchedCount: sve.length, modifiedCount: sve.length };
      },
      createIndex: async () => 'ok',
      aggregate: (cjevovod) => {
        let arr = docs;
        for (const f of cjevovod) {
          if (f.$match) arr = nadji(f.$match);
          if (f.$sample) {
            const a = [...arr];
            for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
            arr = a.slice(0, f.$sample.size);
          }
        }
        return { toArray: async () => arr };
      },
      _docs: docs
    };
    kolekcije[ime] = { api, docs };
    return api;
  }
  return { collection: kol, kolekcije, databaseName: 'simulacija' };
}

/** Podmetni bazu u db/mongo prije učitavanja servisa. */
function podmetni(baza, korijen) {
  const path = require('path');
  const put = require.resolve(path.join(korijen, 'db', 'mongo.js'));
  require.cache[put] = { id: put, filename: put, loaded: true, exports: {
    connect: async () => baza, getDb: () => baza, getClient: () => null, close: async () => {}, resolveDbName: () => 'sim'
  } };
}

module.exports = { napraviBazu, podmetni, oid };
