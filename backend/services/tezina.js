/**
 * tezina.js — mjerenje stvarne težine pitanja iz odgovora djece (Elo)
 *
 * ── Zašto ovo, kad već imamo FSRS ─────────────────────────────────────
 *
 * FSRS odgovara na pitanje "kada će dijete zaboraviti ovu vještinu". Ne
 * odgovara na pitanje "koliko je ovo pitanje teško". Dok su pitanja pisana
 * rukom, težinu procijeni autor. Naša su pitanja generirana, pa iz istog
 * predloška izlaze zadatci vrlo različite težine, a `difficulty` koji im
 * generator upiše je pretpostavka, ne mjerenje.
 *
 * Posljedica je konkretna: dijete koje dobro zbraja dobiva zadatke označene
 * kao teške, ali među njima ima i lakih; i obratno. Adaptivni odabir onda
 * radi s krivim brojevima.
 *
 * ── Kako radi ─────────────────────────────────────────────────────────
 *
 * Isti postupak kojim se rangiraju šahisti, ovdje između djeteta i pitanja:
 *   - svatko ima ocjenu (rating)
 *   - očekivani ishod računa se iz razlike ocjena
 *   - nakon odgovora obje se ocjene pomaknu prema stvarnom ishodu
 *
 * Točan odgovor na teško pitanje diže ocjenu djeteta mnogo, na lako malo.
 * Netočan odgovor na lako pitanje spušta je mnogo, na teško malo. Pitanje
 * se pomiče u suprotnom smjeru — pitanje koje svi rješavaju postaje lako.
 *
 * Postupak je opisan u: Klinkenberg, Straatemeier & van der Maas (2011),
 * "Computer adaptive practice of Maths ability using a new item response
 * model for on the fly ability and difficulty estimation", Computers &
 * Education 57(2). To je motor iza nizozemskoga Math Gardena (Rekentuin).
 *
 * Ocjene se drže oko 1500, kao u šahu, pa se lako čitaju:
 *   1500 = prosječno dijete odnosno prosječno pitanje
 *   +200 = rješava (ili ga rješava) oko 76 % slučajeva
 *
 * Kolekcija `item_ratings`:  { question_id, rating, odgovora, updatedAt }
 * Ocjena djeteta živi u `skill_states.rating` uz FSRS karticu.
 */

const { getDb } = require('../db/mongo');

/** Polazna ocjena i za dijete i za pitanje. */
const POCETNA = 1500;

/**
 * K-faktor — koliko se ocjena pomakne nakon jednog odgovora.
 *
 * Velik na početku (procjena je još neodređena), malen poslije (ne želimo
 * da jedan loš dan sruši ocjenu). Pitanje se smiruje brže od djeteta jer
 * ga rješava mnogo djece, a dijete napreduje pa mu ocjena smije rasti.
 */
function kFaktor(odgovora, { pitanje = false } = {}) {
  if (odgovora < 10) return pitanje ? 40 : 40;
  if (odgovora < 30) return pitanje ? 20 : 30;
  return pitanje ? 10 : 20;
}

/** Vjerojatnost da dijete ocjene `a` riješi pitanje ocjene `b`. */
const ocekivano = (a, b) => 1 / (1 + 10 ** ((b - a) / 400));

/**
 * Ishod odgovora kao broj između 0 i 1.
 *
 * Nije samo točno/netočno: brzina nosi informaciju. Dijete koje odgovori
 * točno nakon dugog oklijevanja zna manje od onoga koje odgovori odmah.
 * Zato točan odgovor vrijedi između 0,6 i 1,0 ovisno o brzini, a netočan
 * između 0,0 i 0,2 — brz promašaj je nagađanje, spor je barem pokušaj.
 *
 * Prag brzine raste s težinom: za teži zadatak 10 s nije sporo.
 */
function ishod({ tocno, vrijemeMs, difficulty = 1 }) {
  const prag = 3000 + (difficulty - 1) * 2000;
  if (!Number.isFinite(vrijemeMs) || vrijemeMs <= 0) return tocno ? 0.8 : 0.1;

  const omjer = Math.min(vrijemeMs / prag, 3);   // 0 = trenutno, 3 = vrlo sporo
  return tocno
    ? 1 - 0.4 * (omjer / 3)      // 1,0 → 0,6
    : 0.2 * (omjer / 3);         // 0,0 → 0,2
}

/**
 * Nova ocjena djeteta i pitanja nakon jednog odgovora.
 * Čista funkcija — nema baze, pa se lako testira.
 */
function nakonOdgovora({ ocjenaDjeteta, ocjenaPitanja, odgovoraDijete = 0, odgovoraPitanje = 0, tocno, vrijemeMs, difficulty }) {
  const s = ishod({ tocno, vrijemeMs, difficulty });
  const e = ocekivano(ocjenaDjeteta, ocjenaPitanja);

  const kD = kFaktor(odgovoraDijete);
  const kP = kFaktor(odgovoraPitanje, { pitanje: true });

  return {
    dijete: Math.round(ocjenaDjeteta + kD * (s - e)),
    pitanje: Math.round(ocjenaPitanja - kP * (s - e)),
    ishod: s,
    ocekivano: e,
  };
}

const zbirka = () => getDb().collection('item_ratings');

/** Ocjene traženih pitanja; pitanje bez zapisa vrijedi POCETNA. */
async function ocjenePitanja(questionIds) {
  if (!questionIds?.length) return new Map();
  const zapisi = await zbirka().find({ question_id: { $in: questionIds } }).toArray();
  const m = new Map(zapisi.map((z) => [String(z.question_id), z]));
  return m;
}

/**
 * Upiši rezultate jednoga kviza.
 *
 * stavke: [{ questionId, tocno, vrijemeMs, difficulty }]
 * Vraća novu ocjenu djeteta; ocjene pitanja upisuje usput.
 *
 * Ne smije srušiti predaju kviza — pozivatelj ga zato zove u try/catch.
 */
async function zabiljezi(userId, stavke, ocjenaDjeteta = POCETNA, odgovoraDijete = 0) {
  if (!stavke?.length) return { rating: ocjenaDjeteta, odgovora: odgovoraDijete };

  const ids = stavke.map((s) => s.questionId).filter(Boolean);
  const poId = await ocjenePitanja(ids);

  let rating = ocjenaDjeteta;
  let odgovora = odgovoraDijete;
  const sada = new Date();

  for (const s of stavke) {
    if (!s.questionId) continue;
    const kljuc = String(s.questionId);
    const zapis = poId.get(kljuc) || { rating: POCETNA, odgovora: 0 };

    const nova = nakonOdgovora({
      ocjenaDjeteta: rating,
      ocjenaPitanja: zapis.rating ?? POCETNA,
      odgovoraDijete: odgovora,
      odgovoraPitanje: zapis.odgovora ?? 0,
      tocno: s.tocno,
      vrijemeMs: s.vrijemeMs,
      difficulty: s.difficulty,
    });

    await zbirka().updateOne(
      { question_id: s.questionId },
      {
        $set: { rating: nova.pitanje, updatedAt: sada },
        $inc: { odgovora: 1 },
        $setOnInsert: { question_id: s.questionId },
      },
      { upsert: true }
    );

    rating = nova.dijete;
    odgovora += 1;
  }

  return { rating, odgovora };
}

/**
 * Raspon ocjena pitanja primjeren djetetu.
 *
 * Cilj je da dijete rješava oko 70–75 % zadataka: dovoljno uspjeha da ne
 * odustane, dovoljno otpora da nešto nauči. To odgovara pitanjima nešto
 * lakšima od samoga djeteta, pa je raspon pomaknut prema dolje.
 *
 * (Nacionalni ispiti u 4. razredu 2025. imali su prosječnu riješenost
 * 45–50 %, što je mjerenje znanja, ne vježba. Za vježbu je 70 % bolji cilj.)
 */
function rasponZaDijete(rating = POCETNA) {
  return { min: rating - 350, max: rating + 100 };
}

/** Statistika za nadzor: koliko je pitanja uopće izmjereno. */
async function pregled({ minOdgovora = 5 } = {}) {
  const svi = await zbirka().find({ odgovora: { $gte: minOdgovora } }).toArray();
  if (!svi.length) return { izmjereno: 0 };
  const ocjene = svi.map((z) => z.rating).sort((a, b) => a - b);
  const p = (q) => ocjene[Math.floor(ocjene.length * q)];
  return {
    izmjereno: svi.length,
    najlakse: ocjene[0],
    p25: p(0.25),
    medijan: p(0.5),
    p75: p(0.75),
    najteze: ocjene[ocjene.length - 1],
  };
}

module.exports = {
  POCETNA, kFaktor, ocekivano, ishod, nakonOdgovora,
  ocjenePitanja, zabiljezi, rasponZaDijete, pregled,
};
