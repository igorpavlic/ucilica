/**
 * hr-imenice.js — rječnik imenica za generatore pitanja
 *
 * Svaki zapis:
 *   o          [nominativ jd, genitiv jd (paukal, za 2-4), genitiv mn (za 5+)]
 *   rod        'm' | 'z' | 's'
 *   zivo       muški rod: akuzativ jd = genitiv jd  ("vidim psa", ne "vidim pas")
 *   akJd       akuzativ jd kad ga pravilo ne pogađa
 *   jestivo    smije stajati uz jesti/piti
 *   predmet    stvar koju dijete može imati, dobiti, pokloniti, skupljati
 *   kat        kategorija — generatori biraju tematski prikladnu imenicu
 *
 * Oblici se ne mogu izvesti algoritamski: olovka → olovaka, ovca → ovaca,
 * trešnja → trešanja imaju nepostojano a, a lopta → lopti uzima -i umjesto -a.
 * Zato tablica. Za širenje: tools/hrlex-izvuci.js nad hrLex 1.3 (CC BY-SA 4.0).
 *
 * `npm test` provjerava dosljednost svakog unosa (vidi test/provjeri-pitanja.js).
 */

// ── ŠKOLA ────────────────────────────────────────────────────────────
const SKOLA = {
  olovka:     { o: ['olovka', 'olovke', 'olovaka'],            rod: 'z' },
  biljeznica: { o: ['bilježnica', 'bilježnice', 'bilježnica'], rod: 'z' },
  knjiga:     { o: ['knjiga', 'knjige', 'knjiga'],             rod: 'z' },
  gumica:     { o: ['gumica', 'gumice', 'gumica'],             rod: 'z' },
  pernica:    { o: ['pernica', 'pernice', 'pernica'],          rod: 'z' },
  bojica:     { o: ['bojica', 'bojice', 'bojica'],             rod: 'z' },
  stolica:    { o: ['stolica', 'stolice', 'stolica'],          rod: 'z' },
  ploca:      { o: ['ploča', 'ploče', 'ploča'],                rod: 'z' },
  kreda:      { o: ['kreda', 'krede', 'kreda'],                rod: 'z' },
  ravnalo:    { o: ['ravnalo', 'ravnala', 'ravnala'],          rod: 's' },
  marker:     { o: ['marker', 'markera', 'markera'],           rod: 'm' },
  ruksak:     { o: ['ruksak', 'ruksaka', 'ruksaka'],           rod: 'm' },
  crtez:      { o: ['crtež', 'crteža', 'crteža'],              rod: 'm' },
  papiric:    { o: ['papirić', 'papirića', 'papirića'],        rod: 'm' },
};

// ── HRANA ────────────────────────────────────────────────────────────
const HRANA = {
  jabuka:    { o: ['jabuka', 'jabuke', 'jabuka'],          rod: 'z' },
  kruska:    { o: ['kruška', 'kruške', 'krušaka'],         rod: 'z' },
  naranca:   { o: ['naranča', 'naranče', 'naranči'],       rod: 'z' },
  banana:    { o: ['banana', 'banane', 'banana'],          rod: 'z' },
  sljiva:    { o: ['šljiva', 'šljive', 'šljiva'],          rod: 'z' },
  tresnja:   { o: ['trešnja', 'trešnje', 'trešanja'],      rod: 'z' },
  jagoda:    { o: ['jagoda', 'jagode', 'jagoda'],          rod: 'z' },
  malina:    { o: ['malina', 'maline', 'malina'],          rod: 'z' },
  breskva:   { o: ['breskva', 'breskve', 'bresaka'],       rod: 'z' },
  lubenica:  { o: ['lubenica', 'lubenice', 'lubenica'],    rod: 'z' },
  mrkva:     { o: ['mrkva', 'mrkve', 'mrkava'],            rod: 'z' },
  rajcica:   { o: ['rajčica', 'rajčice', 'rajčica'],       rod: 'z' },
  cokolada:  { o: ['čokolada', 'čokolade', 'čokolada'],    rod: 'z' },
  bombon:    { o: ['bombon', 'bombona', 'bombona'],        rod: 'm' },
  kolac:     { o: ['kolač', 'kolača', 'kolača'],           rod: 'm' },
  keksic:    { o: ['keksić', 'keksića', 'keksića'],        rod: 'm' },
  sok:       { o: ['sok', 'soka', 'sokova'],               rod: 'm' },
  kruh:      { o: ['kruh', 'kruha', 'kruhova'],            rod: 'm' },
  sir:       { o: ['sir', 'sira', 'sireva'],               rod: 'm' },
  jaje:      { o: ['jaje', 'jajeta', 'jaja'],              rod: 's' },
};

// ── IGRAČKE I SITNICE ────────────────────────────────────────────────
const IGRACKE = {
  lopta:      { o: ['lopta', 'lopte', 'lopti'],                rod: 'z' },
  loptica:    { o: ['loptica', 'loptice', 'loptica'],          rod: 'z' },
  igracka:    { o: ['igračka', 'igračke', 'igračaka'],         rod: 'z' },
  kocka:      { o: ['kocka', 'kocke', 'kocaka'],               rod: 'z' },
  naljepnica: { o: ['naljepnica', 'naljepnice', 'naljepnica'], rod: 'z' },
  slicica:    { o: ['sličica', 'sličice', 'sličica'],          rod: 'z' },
  zvjezdica:  { o: ['zvjezdica', 'zvjezdice', 'zvjezdica'],    rod: 'z' },
  balon:      { o: ['balon', 'balona', 'balona'],              rod: 'm' },
  autic:      { o: ['autić', 'autića', 'autića'],              rod: 'm' },
  magnet:     { o: ['magnet', 'magneta', 'magneta'],           rod: 'm' },
  kamencic:   { o: ['kamenčić', 'kamenčića', 'kamenčića'],     rod: 'm' },
  medvjedic:  { o: ['medvjedić', 'medvjedića', 'medvjedića'],  rod: 'm', zivo: true },
};

// ── PRIRODA ──────────────────────────────────────────────────────────
const PRIRODA = {
  ruza:        { o: ['ruža', 'ruže', 'ruža'],                    rod: 'z' },
  tratincica:  { o: ['tratinčica', 'tratinčice', 'tratinčica'],  rod: 'z' },
  suma:        { o: ['šuma', 'šume', 'šuma'],                    rod: 'z' },
  rijeka:      { o: ['rijeka', 'rijeke', 'rijeka'],              rod: 'z' },
  planina:     { o: ['planina', 'planine', 'planina'],           rod: 'z' },
  livada:      { o: ['livada', 'livade', 'livada'],              rod: 'z' },
  cvijet:      { o: ['cvijet', 'cvijeta', 'cvjetova'],           rod: 'm' },
  list:        { o: ['list', 'lista', 'listova'],                rod: 'm' },
  stablo:      { o: ['stablo', 'stabla', 'stabala'],             rod: 's' },
  jezero:      { o: ['jezero', 'jezera', 'jezera'],              rod: 's' },
  polje:       { o: ['polje', 'polja', 'polja'],                 rod: 's' },
  more:        { o: ['more', 'mora', 'mora'],                    rod: 's' },
};

// ── ŽIVOTINJE ────────────────────────────────────────────────────────
// Muški rod: akuzativ jd = genitiv jd  ("vidim psa"), zato zivo: true
const ZIVOTINJE = {
  ptica:      { o: ['ptica', 'ptice', 'ptica'],              rod: 'z' },
  pcela:      { o: ['pčela', 'pčele', 'pčela'],              rod: 'z' },
  riba:       { o: ['riba', 'ribe', 'riba'],                 rod: 'z' },
  macka:      { o: ['mačka', 'mačke', 'mačaka'],             rod: 'z' },
  krava:      { o: ['krava', 'krave', 'krava'],              rod: 'z' },
  ovca:       { o: ['ovca', 'ovce', 'ovaca'],                rod: 'z' },
  vjeverica:  { o: ['vjeverica', 'vjeverice', 'vjeverica'],  rod: 'z' },
  pas:        { o: ['pas', 'psa', 'pasa'],                   rod: 'm', zivo: true },
  konj:       { o: ['konj', 'konja', 'konja'],               rod: 'm', zivo: true },
  zec:        { o: ['zec', 'zeca', 'zečeva'],                rod: 'm', zivo: true },
  leptir:     { o: ['leptir', 'leptira', 'leptira'],         rod: 'm', zivo: true },
  medvjed:    { o: ['medvjed', 'medvjeda', 'medvjeda'],      rod: 'm', zivo: true },
  vuk:        { o: ['vuk', 'vuka', 'vukova'],                rod: 'm', zivo: true },
  lav:        { o: ['lav', 'lava', 'lavova'],                rod: 'm', zivo: true },
};

// ── KUĆANSTVO ────────────────────────────────────────────────────────
const KUCANSTVO = {
  casa:     { o: ['čaša', 'čaše', 'čaša'],          rod: 'z' },
  zlica:    { o: ['žlica', 'žlice', 'žlica'],       rod: 'z' },
  vilica:   { o: ['vilica', 'vilice', 'vilica'],    rod: 'z' },
  svijeca:  { o: ['svijeća', 'svijeće', 'svijeća'], rod: 'z' },
  cipela:   { o: ['cipela', 'cipele', 'cipela'],    rod: 'z' },
  carapa:   { o: ['čarapa', 'čarape', 'čarapa'],    rod: 'z' },
  majica:   { o: ['majica', 'majice', 'majica'],    rod: 'z' },
  kapa:     { o: ['kapa', 'kape', 'kapa'],          rod: 'z' },
  soba:     { predmet: false, o: ['soba', 'sobe', 'soba'],          rod: 'z' },
  kuca:     { predmet: false, o: ['kuća', 'kuće', 'kuća'],          rod: 'z' },
  stol:     { predmet: false, o: ['stol', 'stola', 'stolova'],      rod: 'm' },
  prozor:   { o: ['prozor', 'prozora', 'prozora'],  rod: 'm', predmet: false },
  ormar:    { o: ['ormar', 'ormara', 'ormara'],     rod: 'm', predmet: false },
  kljuc:    { o: ['ključ', 'ključa', 'ključeva'],   rod: 'm' },
  pero:     { o: ['pero', 'pera', 'pera'],          rod: 's' },
};

// ── PROMET I MJESTA ──────────────────────────────────────────────────
const PROMET = {
  bicikl:  { o: ['bicikl', 'bicikla', 'bicikala'], rod: 'm' },
  vlak:    { o: ['vlak', 'vlaka', 'vlakova'],      rod: 'm' },
  brod:    { o: ['brod', 'broda', 'brodova'],      rod: 'm' },
  avion:   { o: ['avion', 'aviona', 'aviona'],     rod: 'm' },
  most:    { o: ['most', 'mosta', 'mostova'],      rod: 'm' },
  grad:    { o: ['grad', 'grada', 'gradova'],      rod: 'm' },
  skola:   { o: ['škola', 'škole', 'škola'],       rod: 'z' },
  selo:    { o: ['selo', 'sela', 'sela'],          rod: 's' },
};

// ── LJUDI ────────────────────────────────────────────────────────────
const LJUDI = {
  dijete:     { o: ['dijete', 'djeteta', 'djece'],           rod: 's' },
  ucenik:     { o: ['učenik', 'učenika', 'učenika'],         rod: 'm', zivo: true },
  prijatelj:  { o: ['prijatelj', 'prijatelja', 'prijatelja'], rod: 'm', zivo: true },
  putnik:     { o: ['putnik', 'putnika', 'putnika'],         rod: 'm', zivo: true },
  djecak:     { o: ['dječak', 'dječaka', 'dječaka'],         rod: 'm', zivo: true },
};

// ── MJERE I NOVAC ────────────────────────────────────────────────────
const MJERE = {
  kuna:         { o: ['kuna', 'kune', 'kuna'],                       rod: 'z' },
  minuta:       { o: ['minuta', 'minute', 'minuta'],                 rod: 'z' },
  sekunda:      { o: ['sekunda', 'sekunde', 'sekundi'],              rod: 'z' },
  godina:       { o: ['godina', 'godine', 'godina'],                 rod: 'z' },
  stranica:     { o: ['stranica', 'stranice', 'stranica'],           rod: 'z' },
  euro:         { o: ['euro', 'eura', 'eura'],                       rod: 'm' },
  metar:        { o: ['metar', 'metra', 'metara'],                   rod: 'm' },
  centimetar:   { o: ['centimetar', 'centimetra', 'centimetara'],    rod: 'm' },
  kilogram:     { o: ['kilogram', 'kilograma', 'kilograma'],         rod: 'm' },
  sat:          { o: ['sat', 'sata', 'sati'],                        rod: 'm' },
  dan:          { o: ['dan', 'dana', 'dana'],                        rod: 'm' },
  tjedan:       { o: ['tjedan', 'tjedna', 'tjedana'],                rod: 'm' },
  mjesec:       { o: ['mjesec', 'mjeseca', 'mjeseci'],               rod: 'm' },
};

// ── STRUKTURNE ───────────────────────────────────────────────────────
// Spremnici i skupine — predlošci ih zovu izravno, ne ulaze u opći izbor
const STRUKTURNE = {
  kutija:   { o: ['kutija', 'kutije', 'kutija'],       rod: 'z' },
  vrecica:  { o: ['vrećica', 'vrećice', 'vrećica'],    rod: 'z' },
  hrpa:     { o: ['hrpa', 'hrpe', 'hrpa'],             rod: 'z' },
  skupina:  { o: ['skupina', 'skupine', 'skupina'],    rod: 'z' },
  polica:   { o: ['polica', 'police', 'polica'],       rod: 'z' },
  paket:    { o: ['paket', 'paketa', 'paketa'],        rod: 'm' },
  red:      { o: ['red', 'reda', 'redova'],            rod: 'm' },
};

// ── sastavljanje ─────────────────────────────────────────────────────
const SKUPINE = {
  skola: { izvor: SKOLA, jestivo: false, predmet: true },
  hrana: { izvor: HRANA, jestivo: true, predmet: true },
  igracke: { izvor: IGRACKE, jestivo: false, predmet: true },
  priroda: { izvor: PRIRODA, jestivo: false, predmet: false },
  zivotinje: { izvor: ZIVOTINJE, jestivo: false, predmet: false },
  kucanstvo: { izvor: KUCANSTVO, jestivo: false, predmet: true },
  promet: { izvor: PROMET, jestivo: false, predmet: false },
  ljudi: { izvor: LJUDI, jestivo: false, predmet: false },
  mjere: { izvor: MJERE, jestivo: false, predmet: false },
  strukturne: { izvor: STRUKTURNE, jestivo: false, predmet: false },
};

const IMENICE = {};
for (const [kat, { izvor, jestivo, predmet }] of Object.entries(SKUPINE)) {
  for (const [kljuc, zapis] of Object.entries(izvor)) {
    if (IMENICE[kljuc]) throw new Error(`hr-imenice: dvostruki ključ "${kljuc}"`);
    IMENICE[kljuc] = { jestivo, predmet, ...zapis, kat };
  }
}

module.exports = { IMENICE, SKUPINE: Object.keys(SKUPINE) };
