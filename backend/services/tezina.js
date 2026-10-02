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
 * Ishod odgovora: 1 za točan PRVI pokušaj, 0 za netočan.
 *
 * Ranije je brzina smanjivala vrijednost točnog odgovora (pragovi 3/5/7 s).
 * Analiza 2026-10-01: čitanje, tipkanje, uređaj i slušanje uputa nisu
 * odvojeni od znanja, pa se sporost ne smije automatski tumačiti kao slabije
 * znanje. Simulirani pilot pokazao je da kazna za vrijeme sustavno podcjenjuje
 * djecu koja sporije čitaju ili tipkaju. Vrijeme se i dalje sprema u
 * `responses` kao dijagnostički podatak, ali ne ulazi u ocjenu.
 */
function ishod({ tocno }) {
  return tocno ? 1 : 0;
}

/**
 * Polazna ocjena pitanja bez mjerenja. Autorska oznaka težine je heuristika,
 * pa je razmak namjerno malen (±150), a stvarni odgovori ga brzo nadjačaju.
 */
const PRIOR_TEZINE = { 1: 1350, 2: 1450, 3: 1550, 4: 1650 };
const priorZaTezinu = (difficulty) => PRIOR_TEZINE[Math.min(4, Math.max(1, difficulty || 1))];

/**
 * Efektivna ocjena pitanja: vlastita ocjena kad je dovoljno izmjerena,
 * inače vagano s ocjenom predloška (ista vrsta zadatka, drugi brojevi),
 * a bez ijednog mjerenja polazi od autorske težine.
 */
function efektivnaOcjena({ item, template, difficulty }) {
  const prior = template && template.odgovora >= 10 ? template.rating : priorZaTezinu(difficulty);
  if (!item || !item.odgovora) return prior;
  const w = item.odgovora / (item.odgovora + 10);
  return Math.round(w * item.rating + (1 - w) * prior);
}

/**
 * Izbor pitanja prema ocjeni djeteta: cilj je oko 75 % očekivane uspješnosti
 * (vježba, ne ispit). Bira se iz pojasa 55–92 %, najbliže cilju, uz različite
 * obitelji pitanja. Vraća null kad nema dovoljno podataka — tada pozivatelj
 * koristi kvote po autorskoj težini.
 */
function odaberiPoTezini(pool, count, ocjenaDjeteta, ocjenaPitanja, { familyKey = (q) => q._id, avoidFamilies = new Set(), cilj = 0.75, starost = null } = {}) {
  const ocijenjeni = pool.map((q) => {
    const r = ocjenaPitanja(q);
    const p = ocekivano(ocjenaDjeteta, r);
    return { q, p, d: Math.abs(p - cilj) };
  }).sort((a, b) => a.d - b.d);
  // Kad su sve obitelji nedavno viđene: unutar pojasa težine prednost ima
  // obitelj viđena najdavnije (starost: 0 = nikad, veće = nedavnije).
  const poStarosti = starost
    ? [...ocijenjeni].sort((a, b) => starost(a.q) - starost(b.q) || a.d - b.d)
    : ocijenjeni;
  const odabrani = [], obitelji = new Set();
  const uzmi = (filtar, redoslijed = ocijenjeni) => {
    for (const x of redoslijed) {
      if (odabrani.length >= count) break;
      if (odabrani.includes(x)) continue;
      const f = familyKey(x.q);
      if (!filtar(x, f)) continue;
      odabrani.push(x); obitelji.add(f);
    }
  };
  uzmi((x, f) => x.p >= 0.55 && x.p <= 0.92 && !obitelji.has(f) && !avoidFamilies.has(f));
  uzmi((x, f) => x.p >= 0.55 && x.p <= 0.92 && !obitelji.has(f), poStarosti);
  uzmi((x, f) => !obitelji.has(f), poStarosti);
  uzmi(() => true);
  return odabrani.map((x) => x.q);
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
const predlosci = () => getDb().collection('template_ratings');
const odgovori = () => getDb().collection('responses');

/**
 * Ključ pod kojim se pamti težina zadatka: sadržajni `itemKey` (preživljava
 * ponovno generiranje banke), a za stara pitanja bez njega ID pitanja.
 */
const kljucZadatka = (s) => (s.itemKey ? `k:${s.itemKey}` : `q:${String(s.questionId ?? s._id)}`);

/** Ocjene zadataka (po ključu) i predložaka za popis pitanja/stavki. */
async function ocjeneZa(stavke) {
  const kljucevi = [...new Set(stavke.map(kljucZadatka))];
  const tpl = [...new Set(stavke.map((s) => s.templateId).filter(Boolean))];
  const [zi, zt] = await Promise.all([
    kljucevi.length ? zbirka().find({ kljuc: { $in: kljucevi } }).toArray() : [],
    tpl.length ? predlosci().find({ template_id: { $in: tpl } }).toArray() : []
  ]);
  return {
    item: new Map(zi.map((z) => [z.kljuc, z])),
    template: new Map(zt.map((z) => [z.template_id, z]))
  };
}

/** Stari API: ocjene po ID-u pitanja. */
async function ocjenePitanja(questionIds) {
  if (!questionIds?.length) return new Map();
  const { item } = await ocjeneZa(questionIds.map((id) => ({ questionId: id })));
  return new Map([...item.values()].map((z) => [String(z.question_id), z]));
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

  const valjane = stavke.filter((s) => s.questionId);
  const { item, template } = await ocjeneZa(valjane);

  let rating = ocjenaDjeteta;
  let odgovora = odgovoraDijete;
  const sada = new Date();

  for (const s of valjane) {
    const kljuc = kljucZadatka(s);
    const zi = item.get(kljuc);
    const zt = s.templateId ? template.get(s.templateId) : null;
    const polazna = zi ? zi.rating : efektivnaOcjena({ item: null, template: zt, difficulty: s.difficulty });

    const nova = nakonOdgovora({
      ocjenaDjeteta: rating,
      ocjenaPitanja: polazna,
      odgovoraDijete: odgovora,
      odgovoraPitanje: zi?.odgovora ?? 0,
      tocno: s.tocno,
      vrijemeMs: s.vrijemeMs,
      difficulty: s.difficulty,
    });

    // Zapis odgovora za analizu pitanja (diskriminativnost, sumnjivi ključevi).
    await odgovori().insertOne({
      user_id: userId, question_id: s.questionId, kljuc, template_id: s.templateId || null,
      skill: s.skill || null, tocno: !!s.tocno, vrijemeMs: s.vrijemeMs ?? null,
      ocjenaDjeteta: rating, ocjenaPitanja: polazna, at: sada
    });

    await zbirka().updateOne(
      { kljuc },
      {
        $set: { kljuc, question_id: s.questionId, rating: nova.pitanje, updatedAt: sada },
        $inc: { odgovora: 1 },
      },
      { upsert: true }
    );
    if (s.templateId) {
      const tPolazna = zt ? zt.rating : priorZaTezinu(s.difficulty);
      const tNova = Math.round(tPolazna - kFaktor(zt?.odgovora ?? 0, { pitanje: true }) * (nova.ishod - ocekivano(rating, tPolazna)));
      await predlosci().updateOne(
        { template_id: s.templateId },
        { $set: { template_id: s.templateId, rating: tNova, updatedAt: sada }, $inc: { odgovora: 1 } },
        { upsert: true }
      );
      template.set(s.templateId, { template_id: s.templateId, rating: tNova, odgovora: (zt?.odgovora ?? 0) + 1 });
    }
    item.set(kljuc, { kljuc, rating: nova.pitanje, odgovora: (zi?.odgovora ?? 0) + 1 });

    rating = nova.dijete;
    odgovora += 1;
  }

  return { rating, odgovora };
}

/**
 * Analiza pitanja iz zapisa odgovora — čista funkcija.
 *
 * Za svako pitanje s dovoljno odgovora računa riješenost i točkasto-biserijsku
 * korelaciju između ocjene djeteta (prije odgovora) i točnosti. Dobro pitanje
 * češće rješavaju jača djeca (korelacija > 0). Oznake:
 *   'sumnjiv-kljuc'     — korelacija ≤ 0 i niska riješenost među najjačom trećinom
 *   'ne-razlikuje'      — korelacija < 0,1 (pitanje ne razlikuje znanje)
 *   'prelagano'         — riješenost > 97 %
 *   'preteško'          — riješenost < 20 %
 * Oznaka je poziv na STRUČNI PREGLED, nikad razlog za automatsko brisanje.
 */
function analizaPitanja(zapisi, { minOdgovora = 30 } = {}) {
  const po = new Map();
  for (const z of zapisi) {
    if (!po.has(z.kljuc)) po.set(z.kljuc, []);
    po.get(z.kljuc).push(z);
  }
  const izlaz = [];
  for (const [kljuc, arr] of po) {
    if (arr.length < minOdgovora) continue;
    const n = arr.length;
    const p = arr.filter((z) => z.tocno).length / n;
    const x = arr.map((z) => z.ocjenaDjeteta);
    const mx = x.reduce((a, b) => a + b, 0) / n;
    const sx = Math.sqrt(x.reduce((a, b) => a + (b - mx) ** 2, 0) / n) || 1;
    const m1 = arr.filter((z) => z.tocno).reduce((a, z) => a + z.ocjenaDjeteta, 0) / Math.max(1, arr.filter((z) => z.tocno).length);
    const rpb = p > 0 && p < 1 ? ((m1 - mx) / sx) * Math.sqrt(p / (1 - p)) : 0;
    const sorted = [...arr].sort((a, b) => b.ocjenaDjeteta - a.ocjenaDjeteta);
    const vrh = sorted.slice(0, Math.max(1, Math.floor(n / 3)));
    const pVrh = vrh.filter((z) => z.tocno).length / vrh.length;
    const oznake = [];
    if (rpb <= 0 && pVrh < 0.5) oznake.push('sumnjiv-kljuc');
    else if (rpb < 0.1) oznake.push('ne-razlikuje');
    if (p > 0.97) oznake.push('prelagano');
    if (p < 0.2) oznake.push('preteško');
    izlaz.push({ kljuc, n, p, rpb, pVrh, template_id: arr[0].template_id, oznake });
  }
  return izlaz.sort((a, b) => a.rpb - b.rpb);
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
  ocjenePitanja, ocjeneZa, kljucZadatka, efektivnaOcjena, priorZaTezinu, odaberiPoTezini,
  zabiljezi, analizaPitanja, rasponZaDijete, pregled,
};
