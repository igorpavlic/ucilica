const GIK_VERSION = 'Razredna nastava OŠ (GIK)';

const SUBJECTS = {
  hrvatski: { name: 'Hrvatski jezik', slug: 'hrvatski', ciklus: 'razredna nastava' },
  matematika: { name: 'Matematika', slug: 'matematika', ciklus: 'razredna nastava' },
  priroda: { name: 'Priroda i društvo', slug: 'priroda', ciklus: 'razredna nastava' }
};

const TOPIC_METADATA = {
  // 1. razred
  'slova': { grade: 1, subject: 'hrvatski', domain: 'Početno opismenjavanje', outcome: 'OŠ HJ A.1.7', outcomeText: 'prepoznaje glasovnu strukturu riječi te glasovno analizira i sintetizira riječi', tags: ['slova', 'glasovi', 'čitanje'] },
  'glasovi': { grade: 1, subject: 'hrvatski', domain: 'Početno opismenjavanje', outcome: 'OŠ HJ A.1.7', outcomeText: 'prepoznaje glasovnu strukturu riječi te glasovno analizira i sintetizira riječi', tags: ['glasovi', 'samoglasnici', 'suglasnici'] },
  'rijeci': { grade: 1, subject: 'hrvatski', domain: 'Čitanje i razumijevanje', outcome: 'OŠ HJ A.1.2', outcomeText: 'sluša i razumije jednostavne tekstove te prepoznaje osnovne jezične jedinice', tags: ['riječi', 'slogovi', 'značenje'] },
  'recenice': { grade: 1, subject: 'hrvatski', domain: 'Početno čitanje i pisanje', outcome: 'OŠ HJ A.1.3', outcomeText: 'čita i piše jednostavne rečenice poštujući osnovna pravopisna pravila', tags: ['rečenice', 'interpunkcija', 'čitanje'] },
  'brojevi': { grade: 1, subject: 'matematika', domain: 'Brojevi', outcome: 'MAT OŠ A.1.1', outcomeText: 'služi se prirodnim brojevima u skupu do 20', tags: ['brojevi do 20', 'brojenje'] },
  'zbrajanje': { grade: 1, subject: 'matematika', domain: 'Računske operacije', outcome: 'MAT OŠ A.1.4', outcomeText: 'zbraja u skupu brojeva do 20', tags: ['zbrajanje', 'računanje'] },
  'oduzimanje': { grade: 1, subject: 'matematika', domain: 'Računske operacije', outcome: 'MAT OŠ A.1.5', outcomeText: 'oduzima u skupu brojeva do 20', tags: ['oduzimanje', 'računanje'] },
  'usporedi': { grade: 1, subject: 'matematika', domain: 'Odnosi među brojevima', outcome: 'MAT OŠ A.1.2', outcomeText: 'uspoređuje brojeve i određuje odnose veće manje jednako', tags: ['usporedba', 'veće manje'] },
  'geometrija': { grade: 1, subject: 'matematika', domain: 'Oblici i prostor', outcome: 'MAT OŠ C.1.1', outcomeText: 'prepoznaje i opisuje osnovne geometrijske oblike i odnose u prostoru', tags: ['oblici', 'prostor'] },
  'nizovi': { grade: 1, subject: 'matematika', domain: 'Uzorci i mjerenje', outcome: 'MAT OŠ B.1.1', outcomeText: 'prepoznaje uzorak i nastavlja jednostavne nizove', tags: ['nizovi', 'uzorci', 'mjerenje'] },
  'doba': { grade: 1, subject: 'priroda', domain: 'Promjene u prirodi', outcome: 'PID OŠ B.1.1', outcomeText: 'uočava promjene u prirodi tijekom godišnjih doba', tags: ['godišnja doba', 'vrijeme'] },
  'zivotinje': { grade: 1, subject: 'priroda', domain: 'Živi svijet', outcome: 'PID OŠ B.1.1', outcomeText: 'razlikuje osnovna obilježja živoga svijeta u neposrednoj okolini', tags: ['životinje', 'staništa'] },
  'tijelo': { grade: 1, subject: 'priroda', domain: 'Čovjek', outcome: 'PID OŠ B.1.2', outcomeText: 'prepoznaje važnost brige o tijelu i zdravlju', tags: ['tijelo', 'zdravlje'] },
  'obitelj': { grade: 1, subject: 'priroda', domain: 'Zajednica', outcome: 'PID OŠ C.1.1', outcomeText: 'zaključuje o sebi svojoj ulozi u zajednici i uviđa vrijednosti sebe i drugih', tags: ['obitelj', 'dom', 'zajednica'] },
  'sigurnost': { grade: 1, subject: 'priroda', domain: 'Sigurnost', outcome: 'PID OŠ C.1.2', outcomeText: 'uspoređuje ulogu i utjecaj pravila prava i dužnosti na pojedinca i zajednicu', tags: ['promet', 'sigurnost', 'pravila'] },
  'ekologija': { grade: 1, subject: 'priroda', domain: 'Okoliš', outcome: 'PID OŠ B.1.2', outcomeText: 'objašnjava važnost odgovornoga odnosa prema okolišu', tags: ['ekologija', 'okoliš'] },

  // 2. razred
  'imenice-rod': { grade: 2, subject: 'hrvatski', domain: 'Jezik i komunikacija', outcome: 'OŠ HJ A.2.4', outcomeText: 'uočava i primjenjuje osnovne gramatičke kategorije u jeziku', tags: ['imenice', 'rod'] },
  'glagoli-2': { grade: 2, subject: 'hrvatski', domain: 'Jezik i komunikacija', outcome: 'OŠ HJ A.2.4', outcomeText: 'uočava i primjenjuje osnovne gramatičke kategorije u jeziku', tags: ['glagoli'] },
  'recenice-2': { grade: 2, subject: 'hrvatski', domain: 'Pisanje', outcome: 'OŠ HJ A.2.3', outcomeText: 'piše kratke tekstove i rečenice poštujući osnovna pravopisna pravila', tags: ['rečenice', 'interpunkcija'] },
  'citanje-2': { grade: 2, subject: 'hrvatski', domain: 'Čitanje s razumijevanjem', outcome: 'OŠ HJ A.2.2', outcomeText: 'čita tekstove primjerene dobi i izdvaja važne podatke', tags: ['čitanje', 'razumijevanje'] },
  'brojevi-100': { grade: 2, subject: 'matematika', domain: 'Brojevi', outcome: 'MAT OŠ A.2.1', outcomeText: 'služi se brojevima do 100', tags: ['brojevi do 100'] },
  'zbrajanje-100': { grade: 2, subject: 'matematika', domain: 'Računske operacije', outcome: 'MAT OŠ A.2.4', outcomeText: 'zbraja i oduzima u skupu brojeva do 100', tags: ['zbrajanje do 100'] },
  'oduzimanje-100': { grade: 2, subject: 'matematika', domain: 'Računske operacije', outcome: 'MAT OŠ A.2.4', outcomeText: 'zbraja i oduzima u skupu brojeva do 100', tags: ['oduzimanje do 100'] },
  'mnozenje-dijeljenje': { grade: 2, subject: 'matematika', domain: 'Računske operacije', outcome: 'MAT OŠ A.2.5', outcomeText: 'množi i dijeli brojeve u skladu s dobi i programom', tags: ['množenje', 'dijeljenje'] },
  'geometrija-2': { grade: 2, subject: 'matematika', domain: 'Oblici i prostor', outcome: 'MAT OŠ C.2.1', outcomeText: 'opisuje geometrijske likove i tijela te njihove odnose', tags: ['geometrija', 'likovi'] },
  'mjerenje-novac': { grade: 2, subject: 'matematika', domain: 'Mjerenje', outcome: 'MAT OŠ D.2.1', outcomeText: 'primjenjuje mjerenje i koristi novac u jednostavnim problemskim situacijama', tags: ['mjerenje', 'novac'] },
  'zavicaj': { grade: 2, subject: 'priroda', domain: 'Prostor i zajednica', outcome: 'PID OŠ A.2.3', outcomeText: 'uspoređuje organiziranost različitih zajednica prostora dajući primjere iz neposrednoga okruženja', tags: ['zavičaj', 'snalaženje'] },
  'doba-vrijeme': { grade: 2, subject: 'priroda', domain: 'Promjene u prirodi', outcome: 'PID OŠ B.2.1', outcomeText: 'objašnjava važnost odgovornoga odnosa čovjeka prema sebi i prirodi', tags: ['godišnja doba', 'vrijeme'] },
  'biljke-zivotinje': { grade: 2, subject: 'priroda', domain: 'Živi svijet', outcome: 'PID OŠ A.B.C.D.2.1', outcomeText: 'opisuje i predstavlja rezultate promatranja prirode i pojava u neposrednome okruženju', tags: ['biljke', 'životinje'] },
  'voda-tlo': { grade: 2, subject: 'priroda', domain: 'Prirodne pojave', outcome: 'PID OŠ A.B.C.D.2.1', outcomeText: 'opisuje i predstavlja rezultate promatranja prirode i pojava u neposrednome okruženju', tags: ['voda', 'tlo'] },
  'zdravlje-sigurnost-2': { grade: 2, subject: 'priroda', domain: 'Zdravlje i sigurnost', outcome: 'PID OŠ C.2.1', outcomeText: 'raspravlja o ulozi i utjecaju pravila prava i dužnosti na zajednicu i važnosti odgovornoga ponašanja', tags: ['zdravlje', 'sigurnost'] },

  // 3. razred
  'vrste-rijeci': { grade: 3, subject: 'hrvatski', domain: 'Jezik', outcome: 'OŠ HJ A.3.4', outcomeText: 'prepoznaje vrste riječi i njihovu funkciju u rečenici', tags: ['vrste riječi'] },
  'gramatika-pravopis': { grade: 3, subject: 'hrvatski', domain: 'Jezik i pravopis', outcome: 'OŠ HJ A.3.4', outcomeText: 'primjenjuje jezična i pravopisna pravila u pisanju', tags: ['pravopis', 'gramatika'] },
  'knjizevni-tekst': { grade: 3, subject: 'hrvatski', domain: 'Književnost i stvaralaštvo', outcome: 'OŠ HJ B.3.1', outcomeText: 'povezuje sadržaj i temu književnoga teksta s vlastitim iskustvom', tags: ['književnost', 'razumijevanje'] },
  'jezicno-izrazavanje': { grade: 3, subject: 'hrvatski', domain: 'Govorenje i pisanje', outcome: 'OŠ HJ A.3.2', outcomeText: 'sluša tekst i prepričava sadržaj poslušanoga teksta', tags: ['izražavanje', 'prepričavanje'] },
  'brojevi-1000': { grade: 3, subject: 'matematika', domain: 'Brojevi', outcome: 'MAT OŠ A.3.1', outcomeText: 'služi se brojevima do 1000', tags: ['brojevi do 1000'] },
  'zbr-oduz-1000': { grade: 3, subject: 'matematika', domain: 'Računske operacije', outcome: 'MAT OŠ A.3.4', outcomeText: 'zbraja i oduzima u skupu brojeva do 1000', tags: ['zbrajanje', 'oduzimanje'] },
  'mnoz-dijel-3': { grade: 3, subject: 'matematika', domain: 'Računske operacije', outcome: 'MAT OŠ A.3.5', outcomeText: 'množi i dijeli prirodne brojeve te rješava jednostavne problemske zadatke', tags: ['množenje', 'dijeljenje'] },
  'geometrija-mjerenje-3': { grade: 3, subject: 'matematika', domain: 'Geometrija i mjerenje', outcome: 'MAT OŠ C.3.1', outcomeText: 'opisuje likove i tijela te mjeri duljinu masu volumen i vrijeme', tags: ['geometrija', 'mjerenje'] },
  'zavicaj-karta': { grade: 3, subject: 'priroda', domain: 'Prostor i snalaženje', outcome: 'PID OŠ A.B.C.D.3.1', outcomeText: 'objašnjava rezultate vlastitih istraživanja prirode društva i različitih izvora informacija', tags: ['zavičaj', 'karta'] },
  'tlo-voda-zrak': { grade: 3, subject: 'priroda', domain: 'Prirodni sustavi', outcome: 'PID OŠ A.B.C.D.3.1', outcomeText: 'objašnjava rezultate vlastitih istraživanja prirode društva i različitih izvora informacija', tags: ['tlo', 'voda', 'zrak'] },
  'biljke-zivotinje-3': { grade: 3, subject: 'priroda', domain: 'Živi svijet', outcome: 'PID OŠ B.3.1', outcomeText: 'objašnjava povezanost živih bića i uvjeta života', tags: ['biljke', 'životinje'] },
  'gospodarske-djelatnosti': { grade: 3, subject: 'priroda', domain: 'Društvo i rad', outcome: 'PID OŠ C.3.1', outcomeText: 'objašnjava povezanost rada ljudi i djelatnosti u zajednici', tags: ['gospodarstvo', 'zanimanja'] },
  'kulturna-bastina': { grade: 3, subject: 'priroda', domain: 'Kultura i identitet', outcome: 'PID OŠ C.3.2', outcomeText: 'prepoznaje obilježja kulturne i povijesne baštine zavičaja', tags: ['baština', 'kultura'] },

  // 4. razred
  'vrste-rijeci-4': { grade: 4, subject: 'hrvatski', domain: 'Jezik', outcome: 'OŠ HJ A.4.4', outcomeText: 'primjenjuje gramatička znanja u govorenju i pisanju', tags: ['vrste riječi'] },
  'pravopis-4': { grade: 4, subject: 'hrvatski', domain: 'Pravopis', outcome: 'OŠ HJ A.4.4', outcomeText: 'primjenjuje pravopisna pravila u pisanju kraćih tekstova', tags: ['pravopis'] },
  'knjizevnost-4': { grade: 4, subject: 'hrvatski', domain: 'Književnost', outcome: 'OŠ HJ B.4.1', outcomeText: 'obrazlaže doživljaj književnoga teksta i uočava književne elemente', tags: ['književnost', 'čitanje'] },
  'medijska-kultura': { grade: 4, subject: 'hrvatski', domain: 'Medijska kultura', outcome: 'OŠ HJ C.4.1', outcomeText: 'razlikuje medijske sadržaje primjerene dobi i odgovorno ih koristi', tags: ['mediji'] },
  'brojevi-milijun': { grade: 4, subject: 'matematika', domain: 'Brojevi', outcome: 'MAT OŠ A.4.1', outcomeText: 'služi se brojevima do milijun', tags: ['brojevi do milijun'] },
  'pisano-zbr-oduz': { grade: 4, subject: 'matematika', domain: 'Računske operacije', outcome: 'MAT OŠ A.4.4', outcomeText: 'primjenjuje pisano zbrajanje i oduzimanje', tags: ['pisano zbrajanje', 'pisano oduzimanje'] },
  'pisano-mnoz-dijel': { grade: 4, subject: 'matematika', domain: 'Računske operacije', outcome: 'MAT OŠ A.4.5', outcomeText: 'primjenjuje pisano množenje i dijeljenje te rješava složenije zadatke', tags: ['pisano množenje', 'pisano dijeljenje'] },
  'geometrija-kutovi': { grade: 4, subject: 'matematika', domain: 'Geometrija', outcome: 'MAT OŠ C.4.1', outcomeText: 'opisuje i konstruira geometrijske likove te prepoznaje kutove', tags: ['kutovi', 'geometrija'] },
  'opseg-povrsina': { grade: 4, subject: 'matematika', domain: 'Mjerenje', outcome: 'MAT OŠ D.4.1', outcomeText: 'računa opseg i površinu jednostavnih likova', tags: ['opseg', 'površina'] },
  'kvader-kocka': { grade: 4, subject: 'matematika', domain: 'Prostor', outcome: 'MAT OŠ C.4.2', outcomeText: 'opisuje kocku i kvadar te njihove elemente', tags: ['kocka', 'kvadar'] },
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

function buildQuestionMetadata({ topic, subject, difficulty }) {
  const base = TOPIC_METADATA[topic.slug] || {
    grade: topic.grade || subject?.grade || 1,
    subject: subject?.slug || 'hrvatski',
    domain: topic.name,
    outcome: 'GIK',
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
    curriculumAlignment: 'high',
    grade: base.grade,
    subject: subjectInfo.name,
    subjectSlug: subjectInfo.slug,
    domain: base.domain,
    outcome: base.outcome,
    outcomeText: base.outcomeText,
    topicSlug: topic.slug,
    topicName: topic.name,
    difficultyBand: inferDifficultyBand(difficulty || 1),
    tags: Array.from(new Set([...(base.tags || []), topic.slug, subjectInfo.slug]))
  };
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

function pickBalancedQuestions(questions, count, quotas) {
  const buckets = {
    easy: questions.filter((q) => inferDifficultyBand(q.difficulty || 1) === 'easy'),
    medium: questions.filter((q) => inferDifficultyBand(q.difficulty || 1) === 'medium'),
    hard: questions.filter((q) => inferDifficultyBand(q.difficulty || 1) === 'hard')
  };

  const plan = normalizeQuotas(count, quotas);
  const selected = [];
  for (const band of ['easy', 'medium', 'hard']) {
    selected.push(...buckets[band].slice(0, plan[band] || 0));
  }

  if (selected.length < count) {
    const selectedIds = new Set(selected.map((q) => String(q._id)));
    const leftovers = questions.filter((q) => !selectedIds.has(String(q._id)));
    selected.push(...leftovers.slice(0, count - selected.length));
  }

  return selected.slice(0, count);
}

function gradeGenerationTarget(grade) {
  return grade <= 2 ? 90 : 80;
}

module.exports = {
  SUBJECTS,
  TOPIC_METADATA,
  buildQuestionMetadata,
  decideDifficultyTarget,
  pickBalancedQuestions,
  inferDifficultyBand,
  gradeGenerationTarget
};
