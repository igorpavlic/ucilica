/**
 * seed.js — Učilica V4 (2400+ pitanja, 200+ po temi)
 * 1. razred hrvatske osnovne škole
 * Pokretanje:  node seeds/seed.js   (iz backend/ mape)
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const { MongoClient } = require("mongodb");

const { genSlova, genGlasovi, genRijeci, genRecenice } = require("./gen-hrvatski");
const { genBrojevi, genZbrajanje, genOduzimanje, genUsporedbe, genGeometrija, genNizovi } = require("./gen-matematika");
const { genDoba, genZivotinje, genTijelo, genObitelj, genSigurnost, genEkologija } = require("./gen-priroda");

const GRADE = 1;

const subjects = [
  { name: "Hrvatski jezik", slug: "hrvatski", icon: "📖", color: "#FF6B6B", description: "Slova, glasovi, riječi, rečenice", order: 1 },
  { name: "Matematika", slug: "matematika", icon: "🔢", color: "#60A5FA", description: "Brojevi, računanje, geometrija, nizovi", order: 2 },
  { name: "Priroda i društvo", slug: "priroda", icon: "🌿", color: "#34D399", description: "Priroda, zdravlje, sigurnost, zajednica", order: 3 }
];

const topicsDef = {
  hrvatski: [
    { name: "Velika i mala slova", slug: "slova", icon: "🔤", order: 1 },
    { name: "Samoglasnici i suglasnici", slug: "glasovi", icon: "🗣️", order: 2 },
    { name: "Slaganje riječi", slug: "rijeci", icon: "📝", order: 3 },
    { name: "Rečenice", slug: "recenice", icon: "💬", order: 4 },
  ],
  matematika: [
    { name: "Brojevi do 20", slug: "brojevi", icon: "🔢", order: 1 },
    { name: "Zbrajanje do 10", slug: "zbrajanje", icon: "➕", order: 2 },
    { name: "Oduzimanje do 10", slug: "oduzimanje", icon: "➖", order: 3 },
    { name: "Veće, manje, jednako", slug: "usporedi", icon: "⚖️", order: 4 },
    { name: "Geometrija", slug: "geometrija", icon: "📐", order: 5 },
    { name: "Nizovi i mjerenja", slug: "nizovi", icon: "🔄", order: 6 },
  ],
  priroda: [
    { name: "Godišnja doba", slug: "doba", icon: "🍂", order: 1 },
    { name: "Životinje", slug: "zivotinje", icon: "🐾", order: 2 },
    { name: "Moje tijelo", slug: "tijelo", icon: "🧍", order: 3 },
    { name: "Obitelj i dom", slug: "obitelj", icon: "👨‍👩‍👧", order: 4 },
    { name: "Sigurnost i promet", slug: "sigurnost", icon: "🚦", order: 5 },
    { name: "Ekologija i zajednica", slug: "ekologija", icon: "🌍", order: 6 },
  ]
};

const GEN_MAP = {
  hrvatski: [genSlova, genGlasovi, genRijeci, genRecenice],
  matematika: [genBrojevi, genZbrajanje, genOduzimanje, genUsporedbe, genGeometrija, genNizovi],
  priroda: [genDoba, genZivotinje, genTijelo, genObitelj, genSigurnost, genEkologija]
};

async function seed() {
  console.log(`\n🌱 Učilica SEED V4 — ${GRADE}. razred\n`);
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const dbName = process.env.DB_NAME || (uri.includes("/") ? uri.split("/").pop().split("?")[0] : "ucilica");
    const db = client.db(dbName);
    console.log(`🔗 MongoDB: ${db.databaseName}`);

    await db.collection("questions").deleteMany({ grade: GRADE });
    await db.collection("topics").deleteMany({ grade: GRADE });
    await db.collection("subjects").deleteMany({ grade: GRADE });
    console.log(`🗑️  Obrisani stari podaci za ${GRADE}. razred\n`);

    let totalQ = 0;

    for (const subject of subjects) {
      const sRes = await db.collection("subjects").insertOne({
        ...subject, grade: GRADE, isActive: true, createdAt: new Date()
      });
      const sId = sRes.insertedId;
      console.log(`📘 ${subject.icon} ${subject.name}`);

      const gens = GEN_MAP[subject.slug];
      const tops = topicsDef[subject.slug];

      for (let i = 0; i < tops.length; i++) {
        const rawQ = gens[i]();
        const tRes = await db.collection("topics").insertOne({
          ...tops[i], grade: GRADE, subject_id: sId, isActive: true, createdAt: new Date()
        });
        const tId = tRes.insertedId;

        const docs = rawQ.map(q => ({
          type: q.type,
          difficulty: q.difficulty || 1,
          question: q.question,
          visual: q.visual || "",
          hint: q.hint || "",
          answers: q.answers || [],
          correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : 0,
          correctAnswer: q.correctAnswer || "",
          placeholder: q.placeholder || "Upiši odgovor...",
          grade: GRADE,
          subject_id: sId,
          topic_id: tId,
          isActive: true,
          createdAt: new Date()
        }));

        await db.collection("questions").insertMany(docs);
        totalQ += docs.length;
        console.log(`   📎 ${tops[i].icon} ${tops[i].name}: ${docs.length} pitanja`);
      }
      console.log();
    }

    console.log("📊 Kreiram indekse...");
    await db.collection("users").createIndex({ username: 1 }, { unique: true });
    await db.collection("subjects").createIndex({ slug: 1, grade: 1 }, { unique: true });
    await db.collection("topics").createIndex({ subject_id: 1, slug: 1 }, { unique: true });
    await db.collection("topics").createIndex({ grade: 1, subject_id: 1, order: 1 });
    await db.collection("questions").createIndex({ topic_id: 1, isActive: 1 });
    await db.collection("questions").createIndex({ subject_id: 1, grade: 1 });
    await db.collection("progress").createIndex({ user_id: 1, topic_id: 1 });
    await db.collection("progress").createIndex({ user_id: 1, completedAt: -1 });

    const totalTopics = Object.values(topicsDef).reduce((s,t) => s + t.length, 0);
    console.log(`\n✅ SEED ZAVRŠEN!`);
    console.log(`   Razred: ${GRADE}.`);
    console.log(`   Predmeta: ${subjects.length}`);
    console.log(`   Tema: ${totalTopics}`);
    console.log(`   Ukupno pitanja: ${totalQ}`);
    console.log(`   Prosjek po temi: ${Math.round(totalQ / totalTopics)}\n`);
  } catch (err) {
    console.error("❌ Greška:", err);
  } finally {
    await client.close();
    process.exit(0);
  }
}

seed();
