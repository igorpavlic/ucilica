const { questionFamilyKey, orderWithoutAdjacentFamilies } = require('./questionFamily');

const GIK_VERSION = 'Razredna nastava OŠ (GIK)';

const SUBJECTS = {
  hrvatski: { name: 'Hrvatski jezik', slug: 'hrvatski', ciklus: 'razredna nastava' },
  matematika: { name: 'Matematika', slug: 'matematika', ciklus: 'razredna nastava' },
  priroda: { name: 'Priroda i društvo', slug: 'priroda', ciklus: 'razredna nastava' }
};

const TOPIC_METADATA = {
  'citanje-3': { grade: 3, subject: 'hrvatski', domain: 'Čitanje s razumijevanjem', outcome: 'OŠ HJ A.3.3', outcomeText: 'čita tekst i odgovara na pitanja o pročitanom', tags: ['čitanje', 'razumijevanje'] },
  'citanje-4': { grade: 4, subject: 'hrvatski', domain: 'Čitanje s razumijevanjem', outcome: 'OŠ HJ A.4.3', outcomeText: 'čita tekst i tumači informacije', tags: ['čitanje', 'razumijevanje'] },
  'podatci-3': { grade: 3, subject: 'matematika', domain: 'Podatci', outcome: 'MAT OŠ E.3.1', outcomeText: 'prikazuje i tumači jednostavne podatke', tags: ['podaci', 'graf'] },
  'podatci-4': { grade: 4, subject: 'matematika', domain: 'Podatci', outcome: 'MAT OŠ E.4.1', outcomeText: 'tumači podatke prikazane grafom', tags: ['podaci', 'graf'] },
  'nepoznati-3': { grade: 3, subject: 'matematika', domain: 'Brojevi', outcome: 'MAT OŠ B.3.1', outcomeText: 'određuje vrijednost nepoznate veličine u jednakosti', secondaryOutcomes: ['MAT OŠ A.3.6'], tags: ['jednakost', 'nepoznati broj'] },
  'nepoznati-4': { grade: 4, subject: 'matematika', domain: 'Brojevi', outcome: 'MAT OŠ B.4.1', outcomeText: 'određuje vrijednost nepoznate veličine u jednakosti ili nejednakosti', secondaryOutcomes: ['MAT OŠ A.4.4'], tags: ['jednakost', 'nepoznati broj'] },
  // 1. razred
  'slova': { grade: 1, subject: 'hrvatski', domain: 'Početno opismenjavanje', outcome: 'OŠ HJ A.1.7', outcomeText: 'prepoznaje glasovnu strukturu riječi te glasovno analizira i sintetizira riječi', tags: ['slova', 'glasovi', 'čitanje'] },
  'glasovi': { grade: 1, subject: 'hrvatski', domain: 'Početno opismenjavanje', outcome: 'OŠ HJ A.1.7', outcomeText: 'prepoznaje glasovnu strukturu riječi te glasovno analizira i sintetizira riječi', tags: ['glasovi', 'samoglasnici', 'suglasnici'] },
  'rijeci': { grade: 1, subject: 'hrvatski', domain: 'Čitanje i razumijevanje', outcome: 'OŠ HJ A.1.2', outcomeText: 'sluša i razumije jednostavne tekstove te prepoznaje osnovne jezične jedinice', tags: ['riječi', 'slogovi', 'značenje'] },
  'recenice': { grade: 1, subject: 'hrvatski', domain: 'Početno čitanje i pisanje', outcome: 'OŠ HJ A.1.3', outcomeText: 'čita i piše jednostavne rečenice poštujući osnovna pravopisna pravila', tags: ['rečenice', 'interpunkcija', 'čitanje'] },
  'brojevi': { grade: 1, subject: 'matematika', domain: 'Brojevi', outcome: 'MAT OŠ A.1.1', outcomeText: 'služi se prirodnim brojevima u skupu do 20', tags: ['brojevi do 20', 'brojenje'] },
  'zbrajanje': { grade: 1, subject: 'matematika', domain: 'Računske operacije', outcome: 'MAT OŠ A.1.4', outcomeText: 'zbraja u skupu brojeva do 20', tags: ['zbrajanje', 'računanje'] },
  'oduzimanje': { grade: 1, subject: 'matematika', domain: 'Računske operacije', outcome: 'MAT OŠ A.1.4', outcomeText: 'zbraja i oduzima u skupu brojeva do 20', secondaryOutcomes: ['MAT OŠ B.1.1'], tags: ['oduzimanje', 'računanje'] },
  'usporedi': { grade: 1, subject: 'matematika', domain: 'Odnosi među brojevima', outcome: 'MAT OŠ A.1.2', outcomeText: 'uspoređuje brojeve i određuje odnose veće manje jednako', tags: ['usporedba', 'veće manje'] },
  'geometrija': { grade: 1, subject: 'matematika', domain: 'Oblici i prostor', outcome: 'MAT OŠ C.1.1', outcomeText: 'prepoznaje i opisuje osnovne geometrijske oblike i odnose u prostoru', tags: ['oblici', 'prostor'] },
  'nizovi': { grade: 1, subject: 'matematika', domain: 'Uzorci i mjerenje', outcome: 'MAT OŠ B.1.1', needsReview: 'B.1.1 nije oznaka za nizove; ishod odrediti stručnim pregledom prema vrsti niza.', outcomeText: 'prepoznaje uzorak i nastavlja jednostavne nizove', tags: ['nizovi', 'uzorci', 'mjerenje'] },
  'doba': { grade: 1, subject: 'priroda', domain: 'Promjene u prirodi', outcome: 'PID OŠ B.1.1', outcomeText: 'uočava promjene u prirodi tijekom godišnjih doba', tags: ['godišnja doba', 'vrijeme'] },
  'zivotinje': { grade: 1, subject: 'priroda', domain: 'Živi svijet', outcome: 'PID OŠ B.1.1', outcomeText: 'razlikuje osnovna obilježja živoga svijeta u neposrednoj okolini', tags: ['životinje', 'staništa'] },
  'tijelo': { grade: 1, subject: 'priroda', domain: 'Čovjek', outcome: 'PID OŠ B.1.2', needsReview: 'B.1.2 nije opća oznaka za zdravlje; dio zadataka pripada B.1.1.', outcomeText: 'prepoznaje važnost brige o tijelu i zdravlju', tags: ['tijelo', 'zdravlje'] },
  'obitelj': { grade: 1, subject: 'priroda', domain: 'Zajednica', outcome: 'PID OŠ C.1.1', outcomeText: 'zaključuje o sebi svojoj ulozi u zajednici i uviđa vrijednosti sebe i drugih', tags: ['obitelj', 'dom', 'zajednica'] },
  'sigurnost': { grade: 1, subject: 'priroda', domain: 'Sigurnost', outcome: 'PID OŠ C.1.2', outcomeText: 'uspoređuje ulogu i utjecaj pravila prava i dužnosti na pojedinca i zajednicu', tags: ['promet', 'sigurnost', 'pravila'] },
  'ekologija': { grade: 1, subject: 'priroda', domain: 'Okoliš', outcome: 'PID OŠ B.1.2', needsReview: 'Tema miješa okoliš, higijenu, prehranu i školske uloge; mapirati po zadatku.', outcomeText: 'objašnjava važnost odgovornoga odnosa prema okolišu', tags: ['ekologija', 'okoliš'] },

  // 2. razred
  'imenice-rod': { grade: 2, subject: 'hrvatski', domain: 'Jezik i komunikacija', outcome: 'OŠ HJ A.2.5', outcomeText: 'upotrebljava i objašnjava riječi te prepoznaje česte konkretne imenice', tags: ['imenice', 'riječi'] },
  'glagoli-2': { grade: 2, subject: 'hrvatski', domain: 'Jezik i komunikacija', outcome: 'OŠ HJ A.2.5', outcomeText: 'upotrebljava riječi u skladu s komunikacijskom situacijom i objašnjava njihovo značenje', tags: ['riječi', 'značenje'] },
  'recenice-2': { grade: 2, subject: 'hrvatski', domain: 'Pisanje', outcome: 'OŠ HJ A.2.4', outcomeText: 'piše školskim rukopisnim pismom slova, riječi i kratke rečenice u skladu s jezičnim razvojem', secondaryOutcomes: ['OŠ HJ A.2.5'], tags: ['rečenice', 'interpunkcija'] },
  'citanje-2': { grade: 2, subject: 'hrvatski', domain: 'Čitanje s razumijevanjem', outcome: 'OŠ HJ A.2.5', outcomeText: 'upotrebljava i objašnjava riječi, sintagme i rečenice u skladu s komunikacijskom situacijom', limitation: 'Tema trenutačno provjerava značenje riječi (rječnik), ne razumijevanje pročitanoga teksta (A.2.3).', tags: ['čitanje', 'razumijevanje'] },
  'brojevi-100': { grade: 2, subject: 'matematika', domain: 'Brojevi', outcome: 'MAT OŠ A.2.1', outcomeText: 'služi se brojevima do 100', tags: ['brojevi do 100'] },
  'zbrajanje-100': { grade: 2, subject: 'matematika', domain: 'Računske operacije', outcome: 'MAT OŠ A.2.3', outcomeText: 'zbraja i oduzima u skupu brojeva do 100', tags: ['zbrajanje do 100'] },
  'oduzimanje-100': { grade: 2, subject: 'matematika', domain: 'Računske operacije', outcome: 'MAT OŠ A.2.3', outcomeText: 'zbraja i oduzima u skupu brojeva do 100', tags: ['oduzimanje do 100'] },
  'mnozenje-dijeljenje': { grade: 2, subject: 'matematika', domain: 'Računske operacije', outcome: 'MAT OŠ A.2.4', outcomeText: 'množi i dijeli u okviru tablice množenja', tags: ['množenje', 'dijeljenje'] },
  'geometrija-2': { grade: 2, subject: 'matematika', domain: 'Oblici i prostor', outcome: 'MAT OŠ C.2.1', outcomeText: 'opisuje geometrijske likove i tijela te njihove odnose', tags: ['geometrija', 'likovi'] },
  'mjerenje-novac': { grade: 2, subject: 'matematika', domain: 'Mjerenje', outcome: 'MAT OŠ D.2.1', outcomeText: 'primjenjuje mjerenje i koristi novac u jednostavnim problemskim situacijama', tags: ['mjerenje', 'novac'] },
  'zavicaj': { grade: 2, subject: 'priroda', domain: 'Prostor i zajednica', outcome: 'PID OŠ A.2.3', outcomeText: 'uspoređuje organiziranost različitih zajednica prostora dajući primjere iz neposrednoga okruženja', tags: ['zavičaj', 'snalaženje'] },
  'doba-vrijeme': { grade: 2, subject: 'priroda', domain: 'Promjene u prirodi', outcome: 'PID OŠ B.2.1', outcomeText: 'objašnjava važnost odgovornoga odnosa čovjeka prema sebi i prirodi', tags: ['godišnja doba', 'vrijeme'] },
  'biljke-zivotinje': { grade: 2, subject: 'priroda', domain: 'Živi svijet', outcome: 'PID OŠ A.B.C.D.2.1', outcomeText: 'opisuje i predstavlja rezultate promatranja prirode i pojava u neposrednome okruženju', tags: ['biljke', 'životinje'] },
  'voda-tlo': { grade: 2, subject: 'priroda', domain: 'Prirodne pojave', outcome: 'PID OŠ A.B.C.D.2.1', outcomeText: 'opisuje i predstavlja rezultate promatranja prirode i pojava u neposrednome okruženju', tags: ['voda', 'tlo'] },
  'zdravlje-sigurnost-2': { grade: 2, subject: 'priroda', domain: 'Zdravlje i sigurnost', outcome: 'PID OŠ C.2.1', needsReview: 'Zdravlje i pravila mapirati zasebno.', outcomeText: 'raspravlja o ulozi i utjecaju pravila prava i dužnosti na zajednicu i važnosti odgovornoga ponašanja', tags: ['zdravlje', 'sigurnost'] },

  // 3. razred
  'vrste-rijeci': { grade: 3, subject: 'hrvatski', domain: 'Jezik', outcome: 'OŠ HJ A.3.5', outcomeText: 'prepoznaje vrste riječi i njihovu funkciju u rečenici', tags: ['vrste riječi'] },
  'gramatika-pravopis': { grade: 3, subject: 'hrvatski', domain: 'Jezik i pravopis', outcome: 'OŠ HJ A.3.5', outcomeText: 'primjenjuje jezična i pravopisna pravila u pisanju', tags: ['pravopis', 'gramatika'] },
  'knjizevni-tekst': { grade: 3, subject: 'hrvatski', domain: 'Književnost i stvaralaštvo', outcome: 'OŠ HJ B.3.1', outcomeText: 'povezuje sadržaj i temu književnoga teksta s vlastitim iskustvom', tags: ['književnost', 'razumijevanje'] },
  'jezicno-izrazavanje': { grade: 3, subject: 'hrvatski', domain: 'Govorenje i pisanje', outcome: 'OŠ HJ A.3.2', limitation: 'Odabir ponuđenog odgovora nije izvedba govorenja ni prepričavanja; rezultat pokazuje samo prepoznavanje.', outcomeText: 'sluša tekst i prepričava sadržaj poslušanoga teksta', tags: ['izražavanje', 'prepričavanje'] },
  'brojevi-1000': { grade: 3, subject: 'matematika', domain: 'Brojevi', outcome: 'MAT OŠ A.3.1', outcomeText: 'služi se prirodnim brojevima do 10 000', tags: ['brojevi do 10 000'] },
  'zbr-oduz-1000': { grade: 3, subject: 'matematika', domain: 'Računske operacije', outcome: 'MAT OŠ A.3.2', outcomeText: 'zbraja i oduzima u skupu brojeva do 1000', tags: ['zbrajanje', 'oduzimanje'] },
  'mnoz-dijel-3': { grade: 3, subject: 'matematika', domain: 'Računske operacije', outcome: 'MAT OŠ A.3.4', outcomeText: 'množi i dijeli prirodne brojeve te rješava jednostavne problemske zadatke', tags: ['množenje', 'dijeljenje'] },
  'geometrija-mjerenje-3': { grade: 3, subject: 'matematika', domain: 'Geometrija i mjerenje', outcome: 'MAT OŠ C.3.1 / D.3.1–D.3.4', outcomeText: 'opisuje likove i tijela te mjeri duljinu masu volumen i vrijeme', tags: ['geometrija', 'mjerenje'] },
  'zavicaj-karta': { grade: 3, subject: 'priroda', domain: 'Prostor i snalaženje', outcome: 'PID OŠ B.3.4', outcomeText: 'snalazi se u prostoru, tumači plan mjesta i kartu zavičaja', secondaryOutcomes: ['PID OŠ A.3.3'], tags: ['zavičaj', 'karta'] },
  'tlo-voda-zrak': { grade: 3, subject: 'priroda', domain: 'Prirodni sustavi', outcome: 'PID OŠ A.B.C.D.3.1', outcomeText: 'objašnjava rezultate vlastitih istraživanja prirode društva i različitih izvora informacija', tags: ['tlo', 'voda', 'zrak'] },
  'biljke-zivotinje-3': { grade: 3, subject: 'priroda', domain: 'Živi svijet', outcome: 'PID OŠ B.3.2', outcomeText: 'zaključuje o povezanosti živih bića i uvjeta života', secondaryOutcomes: ['PID OŠ B.3.1'], tags: ['biljke', 'životinje'] },
  'gospodarske-djelatnosti': { grade: 3, subject: 'priroda', domain: 'Društvo i rad', outcome: 'PID OŠ C.3.1', outcomeText: 'objašnjava povezanost rada ljudi i djelatnosti u zajednici', tags: ['gospodarstvo', 'zanimanja'] },
  'kulturna-bastina': { grade: 3, subject: 'priroda', domain: 'Kultura i identitet', outcome: 'PID OŠ C.3.2', outcomeText: 'prepoznaje obilježja kulturne i povijesne baštine zavičaja', tags: ['baština', 'kultura'] },

  // 4. razred
  'vrste-rijeci-4': { grade: 4, subject: 'hrvatski', domain: 'Jezik', outcome: 'OŠ HJ A.4.5', outcomeText: 'primjenjuje gramatička znanja u govorenju i pisanju', tags: ['vrste riječi'] },
  'pravopis-4': { grade: 4, subject: 'hrvatski', domain: 'Pravopis', outcome: 'OŠ HJ A.4.4', outcomeText: 'primjenjuje pravopisna pravila u pisanju kraćih tekstova', tags: ['pravopis'] },
  'knjizevnost-4': { grade: 4, subject: 'hrvatski', domain: 'Književnost', outcome: 'OŠ HJ B.4.1', outcomeText: 'obrazlaže doživljaj književnoga teksta i uočava književne elemente', tags: ['književnost', 'čitanje'] },
  'medijska-kultura': { grade: 4, subject: 'hrvatski', domain: 'Kultura i mediji', outcome: 'OŠ HJ C.4.2', outcomeText: 'razlikuje elektroničke medije primjerene dobi i interesima učenika', secondaryOutcomes: ['OŠ HJ C.4.1', 'OŠ HJ C.4.3'], tags: ['mediji'] },
  'brojevi-milijun': { grade: 4, subject: 'matematika', domain: 'Brojevi', outcome: 'MAT OŠ A.4.1', outcomeText: 'služi se brojevima do milijun', tags: ['brojevi do milijun'] },
  'pisano-zbr-oduz': { grade: 4, subject: 'matematika', domain: 'Računske operacije', outcome: 'MAT OŠ A.4.2', outcomeText: 'pisano zbraja i oduzima u skupu brojeva do milijun', secondaryOutcomes: ['MAT OŠ A.4.4'], tags: ['pisano zbrajanje', 'pisano oduzimanje'] },
  'pisano-mnoz-dijel': { grade: 4, subject: 'matematika', domain: 'Računske operacije', outcome: 'MAT OŠ A.4.3', outcomeText: 'pisano množi i dijeli u skupu brojeva do milijun', secondaryOutcomes: ['MAT OŠ A.4.4'], tags: ['pisano množenje', 'pisano dijeljenje'] },
  'geometrija-kutovi': { grade: 4, subject: 'matematika', domain: 'Geometrija', outcome: 'MAT OŠ C.4.1–C.4.2', outcomeText: 'opisuje i konstruira geometrijske likove te prepoznaje kutove', tags: ['kutovi', 'geometrija'] },
  'opseg-povrsina': { grade: 4, subject: 'matematika', domain: 'Mjerenje', outcome: 'MAT OŠ D.4.2', outcomeText: 'uspoređuje površine likova i mjeri ih jediničnim kvadratima', tags: ['površina', 'jedinični kvadrati'] },
  'kvader-kocka': { grade: 4, subject: 'matematika', domain: 'Prostor', outcome: 'MAT OŠ C.4.5', outcomeText: 'povezuje geometrijske pojmove pri opisivanju geometrijskih tijela', tags: ['kocka', 'kvadar', 'plohe', 'bridovi', 'vrhovi'] },
  'uvjeti-zivota': { grade: 4, subject: 'priroda', domain: 'Priroda', outcome: 'PID OŠ B.4.1', outcomeText: 'objašnjava povezanost živih bića s uvjetima života', tags: ['uvjeti života'] },
  'krajevi-hr': { grade: 4, subject: 'priroda', domain: 'Prostor Republike Hrvatske', outcome: 'PID OŠ A.4.2', outcomeText: 'snalazi se na karti Republike Hrvatske i opisuje njezine krajeve', tags: ['Hrvatska', 'karta'] },
  'ljudsko-tijelo': { grade: 4, subject: 'priroda', domain: 'Čovjek i zdravlje', outcome: 'PID OŠ B.4.2', outcomeText: 'objašnjava građu i ulogu dijelova ljudskoga tijela te važnost zdravih navika', tags: ['ljudsko tijelo', 'zdravlje'] },
  'hrvatska-domovina': { grade: 4, subject: 'priroda', domain: 'Domovina i zajednica', outcome: 'PID OŠ C.4.1', outcomeText: 'opisuje obilježja Republike Hrvatske i važnost pripadnosti zajednici', tags: ['domovina', 'simboli'] },
  'biljke-zivotinje-4': { grade: 4, subject: 'priroda', domain: 'Živi svijet', outcome: 'PID OŠ B.4.1', outcomeText: 'objašnjava povezanost živih bića s uvjetima života', tags: ['biljke', 'životinje'] }
};

function inferDifficultyBand(difficulty) {
  if (difficulty >= 4) return 'hard';
  if (difficulty >= 3) return 'medium';
  return 'easy';
}

/**
 * Oznaka ishoda dodjeljuje se po TEMI, ne po pojedinom pitanju, i nije
 * stručno potvrđena. Zato se više ne tvrdi curriculumAlignment: 'high'.
 * Nepoznata tema ne dobiva izmišljeni ishod "GIK" ni zadani predmet.
 */
function buildQuestionMetadata({ topic, subject, difficulty, question = null }) {
  const known = TOPIC_METADATA[topic.slug];
  const base = known || {
    grade: topic.grade || subject?.grade || null,
    subject: subject?.slug || null,
    domain: topic.name,
    outcome: null,
    outcomeText: topic.name,
    tags: []
  };

  const subjectInfo = SUBJECTS[base.subject] || {
    slug: subject?.slug || base.subject,
    name: subject?.name || base.subject,
    ciklus: 'razredna nastava'
  };

  return {
    curriculum: GIK_VERSION,
    // 'topic-level': ishod je pridružen cijeloj temi, bez provjere pojedinog pitanja.
    curriculumAlignment: known ? 'topic-level' : 'none',
    reviewStatus: 'unreviewed',
    ...(base.needsReview ? { needsReview: base.needsReview } : {}),
    ...(base.limitation ? { limitation: base.limitation } : {}),
    ...(base.secondaryOutcomes ? { secondaryOutcomes: base.secondaryOutcomes } : {}),
    // Ključ za ponavljanje (FSRS): tema kao mikrovještina, ne široki ishod koji
    // dijele različite teme (npr. zbrajanje i oduzimanje do 100).
    skillId: `R${base.grade || topic.grade || 0}:${topic.slug}`,
    ...(question?.templateId ? { templateId: question.templateId } : {}),
    ...(question?.proces ? { proces: question.proces } : {}),
    // Ishod zapisan uz samo pitanje (npr. pitanje uz tekst u temi rječnika) ima prednost.
    ...(question?.ishod && question.ishod !== base.outcome ? { topicOutcome: base.outcome, alignmentSource: 'question' } : {}),
    grade: base.grade,
    subject: subjectInfo.name,
    subjectSlug: subjectInfo.slug,
    domain: base.domain,
    outcome: question?.ishod || base.outcome,
    outcomeText: base.outcomeText,
    topicSlug: topic.slug,
    topicName: topic.name,
    difficultyBand: inferDifficultyBand(difficulty || 1),
    tags: Array.from(new Set([...(base.tags || []), topic.slug, subjectInfo.slug]))
  };
}

/** Ključ vještine za FSRS; stara pitanja bez skillId padaju na ishod. */
function skillKeyOf(q) {
  return q?.gik?.skillId || q?.gik?.outcome || null;
}

function decideDifficultyTarget(stats = {}) {
  const accuracy = Number.isFinite(stats.accuracy) ? stats.accuracy : 0.65;
  const streak = Number.isFinite(stats.streak) ? stats.streak : 0;

  if (accuracy >= 0.85 && streak >= 2) {
    return { level: 'advanced', quotas: { easy: 1, medium: 2, hard: 4 } };
  }
  if (accuracy >= 0.65) {
    return { level: 'balanced', quotas: { easy: 2, medium: 3, hard: 2 } };
  }
  return { level: 'support', quotas: { easy: 4, medium: 2, hard: 1 } };
}

function normalizeQuotas(count, quotas) {
  const total = Object.values(quotas).reduce((sum, value) => sum + value, 0) || 1;
  const scaled = {};
  let used = 0;
  for (const [band, value] of Object.entries(quotas)) {
    scaled[band] = Math.floor((value / total) * count);
    used += scaled[band];
  }

  const order = ['medium', 'easy', 'hard'];
  while (used < count) {
    const band = order[used % order.length];
    scaled[band] = (scaled[band] || 0) + 1;
    used += 1;
  }
  return scaled;
}

function pickBalancedQuestions(questions, count, quotas, options = {}) {
  const avoidFamilies = options.avoidFamilies instanceof Set
    ? options.avoidFamilies
    : new Set(options.avoidFamilies || []);

  const buckets = {
    easy: questions.filter((q) => inferDifficultyBand(q.difficulty || 1) === 'easy'),
    medium: questions.filter((q) => inferDifficultyBand(q.difficulty || 1) === 'medium'),
    hard: questions.filter((q) => inferDifficultyBand(q.difficulty || 1) === 'hard')
  };

  const plan = normalizeQuotas(count, quotas);
  const selected = [];
  const selectedIds = new Set();
  const usedFamilies = new Set();

  const takeFrom = (candidates, wanted, mode) => {
    let added = 0;
    for (const q of candidates) {
      if (added >= wanted || selected.length >= count) break;
      const id = String(q._id || `${q.question}|${q.correctAnswer || q.correctIndex}`);
      if (selectedIds.has(id)) continue;
      const family = questionFamilyKey(q);

      // 1. prolaz: nova obitelj koja nije bila ni u nedavnim kvizovima
      if (mode === 'fresh-family' && (usedFamilies.has(family) || avoidFamilies.has(family))) continue;
      // 2. prolaz: nova obitelj u ovoj rundi, čak i ako je nedavno viđena
      if (mode === 'new-family' && usedFamilies.has(family)) continue;

      selected.push(q);
      selectedIds.add(id);
      usedFamilies.add(family);
      added++;
    }
    return added;
  };

  // Prvo poštuj željenu težinu, ali bez ponavljanja obrasca pitanja.
  const deficits = {};
  for (const band of ['easy', 'medium', 'hard']) {
    const wanted = plan[band] || 0;
    let got = takeFrom(buckets[band], wanted, 'fresh-family');
    if (got < wanted) got += takeFrom(buckets[band], wanted - got, 'new-family');
    deficits[band] = Math.max(0, wanted - got);
  }

  // Ako neka razina nema dovoljno različitih obitelji, popuni iz drugih razina,
  // ali i dalje najprije bez ponavljanja obrasca.
  if (selected.length < count) {
    takeFrom(questions, count - selected.length, 'fresh-family');
  }
  if (selected.length < count) {
    takeFrom(questions, count - selected.length, 'new-family');
  }

  // Tek krajnji fallback dopušta istu obitelj više puta. To je potrebno kod
  // tema koje stvarno imaju vrlo malo vrsta zadataka (npr. usko uvježbavanje).
  if (selected.length < count) {
    takeFrom(questions, count - selected.length, 'any');
  }

  // Čak i u fallbacku isti obrazac ne smije doći dvaput zaredom ako postoji
  // ikakva mogućnost da se razdvoji drugim pitanjem.
  return orderWithoutAdjacentFamilies(selected.slice(0, count));
}

function gradeGenerationTarget(grade) {
  return grade <= 2 ? 90 : 80;
}

module.exports = {
  SUBJECTS,
  TOPIC_METADATA,
  buildQuestionMetadata,
  skillKeyOf,
  decideDifficultyTarget,
  pickBalancedQuestions,
  inferDifficultyBand,
  gradeGenerationTarget
};
