/**
 * provjeri-bazu.js — provjera veze s MongoDB-om (npr. Atlas s webhostinga).
 * Pokretanje (iz backend/):  npm run provjeri:bazu
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { MongoClient } = require('mongodb');

(async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) { console.error('✗ MONGODB_URI nije upisan u backend/.env'); process.exit(1); }
  console.log(`Node ${process.version}; spajam se na ${uri.replace(/\/\/[^@]*@/, '//***@')} …`);
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    await client.db().command({ ping: 1 });
    console.log(`✓ Baza radi: ${client.db().databaseName}`);
  } catch (e) {
    console.error(`✗ Nema veze: ${e.message}`);
    console.error('  Provjeri: lozinku u adresi, Network Access u Atlasu (IP hostinga) i je li hosting otvorio odlazni port 27017.');
    process.exitCode = 1;
  } finally { await client.close(); }
})();
