/**
 * db/mongo.js - MongoDB Native Driver konekcija
 * 
 * Koristi singleton pattern - jedna konekcija za cijelu aplikaciju.
 * Svi moduli koriste getDb() za pristup bazi.
 */

const { MongoClient } = require('mongodb');

let client = null;
let db = null;

/**
 * Izvuci ime baze iz URI-ja ili env varijable
 */
function resolveDbName(uri) {
  // Eksplicitno ime baze ima prioritet
  if (process.env.DB_NAME) return process.env.DB_NAME;

  // Parsiraj iz URI-ja (mongodb://host:port/DBNAME ili mongodb+srv://...host/DBNAME?opts)
  try {
    const url = new URL(uri);
    const pathDb = url.pathname.replace(/^\//, '');
    if (pathDb) return pathDb;
  } catch {
    // Fallback za nestandardne URI formate
    const match = uri.match(/\/([^/?]+)(\?|$)/);
    if (match && match[1]) return match[1];
  }

  return 'ucilica'; // default
}

/**
 * Spoji se na MongoDB i vrati db instancu
 */
async function connect() {
  if (db) return db;

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ucilica';
  const dbName = resolveDbName(uri);

  client = new MongoClient(uri);
  await client.connect();

  db = client.db(dbName);

  console.log('✅ Spojen na MongoDB:', db.databaseName);

  await createIndexes();

  return db;
}

/**
 * Dohvati db instancu (mora se prvo pozvati connect)
 */
function getDb() {
  if (!db) throw new Error('Baza nije spojena! Pozovi connect() prvo.');
  return db;
}

/**
 * Dohvati MongoClient instancu
 */
function getClient() {
  return client;
}

/**
 * Zatvori konekciju
 */
async function close() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB konekcija zatvorena.');
  }
}

/**
 * Kreiraj potrebne indekse
 */
async function createIndexes() {
  await db.collection('users').createIndex({ username: 1 }, { unique: true });
  await db.collection('subjects').createIndex({ slug: 1, grade: 1 }, { unique: true });
  await db.collection('subjects').createIndex({ grade: 1, order: 1 });
  await db.collection('topics').createIndex({ subject_id: 1, slug: 1 }, { unique: true });
  await db.collection('topics').createIndex({ grade: 1, subject_id: 1, order: 1 });
  await db.collection('questions').createIndex({ topic_id: 1, isActive: 1 });
  await db.collection('questions').createIndex({ subject_id: 1, grade: 1 });
  await db.collection('progress').createIndex({ user_id: 1, topic_id: 1 });
  await db.collection('progress').createIndex({ user_id: 1, completedAt: -1 });

  console.log('✅ Indeksi kreirani');
}

module.exports = { connect, getDb, getClient, close, resolveDbName };
