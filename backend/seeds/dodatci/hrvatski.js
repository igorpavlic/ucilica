/**
 * dodatci/hrvatski.js — dodatna pitanja za Hrvatski jezik (1.–4. razred).
 * Svaka tablica daje više oblika pitanja; riječi u pitanju nisu pod
 * navodnicima kad svaka treba biti zaseban zadatak (obitelj pitanja).
 */
const { promijesaj, uzmi, jedan, cijeli, izbor, tocnoNetocno, upisBroja, poredaj, spoji, oblik, obaSmjera, tvrdnje, sveTvrdnje, spajanja, izTablice, daNe, uObitelj, obiteljTablice } = require('./pomocno');
const { brojSlogova, rastavi } = require('../slogovi');

const ponovi = (n, f) => Array.from({ length: n }, (_, i) => f(i)).flat().filter(Boolean);
const upisRijeci = (pitanje, rijec, tezina = 2, objasnjenje = '') =>
  ({ type: 'input', difficulty: tezina, question: `${pitanje} Napiši jednu riječ.`, correctAnswer: rijec, konstrukt: 'rijec', objasnjenje });

// ═══ 1. razred ═══

// Riječi bez dvoslova (lj, nj, dž) — broj slova jednak je broju glasova.
const JEDNOSTAVNE = ['pas', 'mama', 'tata', 'sok', 'nos', 'med', 'sir', 'lopta', 'kapa', 'ruka', 'noga', 'riba', 'voda', 'sat', 'zec', 'miš', 'jež',
  'more', 'sova', 'ptica', 'kruh', 'stol', 'vrata', 'mrkva', 'škola', 'torba', 'olovka', 'krava', 'kuća', 'mačka', 'jabuka', 'trava', 'grana',
  'lisica', 'ruža', 'žaba', 'čaša', 'duga', 'drvo', 'brod', 'auto', 'oko', 'uho', 'list', 'kosa', 'vlak', 'mak', 'luk', 'torta', 'sunce'];
const SAMO = new Set(['a', 'e', 'i', 'o', 'u']);
function glasoviDodatak() {
  const q = [];
  for (const r of uzmi(JEDNOSTAVNE, 14)) {
    const prvi = r[0], zadnji = r[r.length - 1];
    q.push(izbor(`Kojim glasom počinje riječ ${r}?`, prvi.toUpperCase(), uzmi(['A', 'B', 'K', 'M', 'P', 'S', 'T', 'R', 'L', 'Č', 'Š', 'Ž', 'V', 'Z', 'O'].filter((g) => g !== prvi.toUpperCase()), 3), 1));
    q.push(izbor(`Kojim glasom završava riječ ${r}?`, zadnji.toUpperCase(), uzmi(['A', 'E', 'I', 'O', 'U', 'K', 'S', 'T', 'R', 'D', 'Š', 'Ž', 'Č', 'H'].filter((g) => g !== zadnji.toUpperCase()), 3), 1));
  }
  for (const r of uzmi(JEDNOSTAVNE, 10)) q.push(upisBroja(`Koliko glasova čuješ u riječi ${r}?`, r.length, 2, `${r.split('').join(' – ')}: ${r.length}`));
  for (const r of uzmi(JEDNOSTAVNE, 8)) {
    const g = jedan(['a', 'o', 'u', 'i', 'e', 'r', 's', 'k', 'm', 't']);
    q.push(tocnoNetocno(`Čuješ li glas ${g.toUpperCase()} u riječi ${r}?`, r.includes(g), 1));
  }
  for (const g of uzmi(['A', 'E', 'I', 'O', 'U', 'M', 'P', 'S', 'K', 'T', 'R', 'L', 'V', 'Z', 'Š', 'Ž', 'Č', 'B', 'D'], 8)) {
    const s = JEDNOSTAVNE.filter((r) => r[0] === g.toLowerCase()), n = JEDNOSTAVNE.filter((r) => r[0] !== g.toLowerCase());
    if (s.length) q.push(izbor(`Koja riječ počinje glasom ${g}?`, jedan(s), uzmi(n, 3), 1));
  }
  for (const r of uzmi(JEDNOSTAVNE, 8)) {
    const n = [...r].filter((x) => SAMO.has(x)).length;
    q.push(upisBroja(`Koliko samoglasnika ima riječ ${r}?`, n, 2, `Samoglasnici u riječi ${r}: ${[...r].filter((x) => SAMO.has(x)).join(', ')}.`));
  }
  ponovi(4, () => {
    const [a, b] = uzmi(JEDNOSTAVNE, 2);
    if (a.length === b.length) return null;
    return izbor(`Koja riječ ima više glasova: ${a} ili ${b}?`, a.length > b.length ? a : b, [a.length > b.length ? b : a], 2, `${a}: ${a.length}, ${b}: ${b.length}`);
  }).forEach((x) => q.push(x));
  return q;
}

const RIME = [['mak', 'rak', 'zrak', 'znak', 'vlak', 'mrak'], ['kosa', 'rosa', 'osa', 'bosa'], ['sat', 'brat', 'vrat'], ['med', 'led', 'red'], ['nos', 'kos'],
  ['kapa', 'šapa'], ['ruka', 'buka', 'muka'], ['sok', 'skok', 'tok'], ['most', 'gost', 'kost'], ['cvijet', 'svijet'], ['dom', 'grom'], ['trava', 'glava', 'krava']];
const SLOZENE = ['lopta', 'jabuka', 'kuća', 'mačka', 'olovka', 'krava', 'ptica', 'torba', 'riba', 'voda', 'sunce', 'lisica', 'škola', 'cipela', 'kišobran', 'prozor', 'livada', 'ljuljačka', 'leptir', 'trešnja', 'zvijezda', 'pas', 'sok', 'kruh', 'banana', 'čokolada', 'bicikl', 'automobil', 'televizor', 'krokodil'];
function rijeciDodatak() {
  const q = [];
  const rimaSkup = (r) => RIME.find((s) => s.includes(r));
  const sve = RIME.flat();
  for (const s of uzmi(RIME, 8)) {
    const [a, b] = uzmi(s, 2);
    q.push(tocnoNetocno(`Rimuju li se riječi ${a} i ${b}?`, true, 1));
    const c = jedan(sve.filter((x) => !s.includes(x)));
    q.push(tocnoNetocno(`Rimuju li se riječi ${a} i ${c}?`, false, 1, `${a} i ${c} ne završavaju jednako.`));
    q.push(izbor(`Koja se riječ rimuje s riječju ${a}?`, b, uzmi(sve.filter((x) => !rimaSkup(a).includes(x)), 3), 1));
  }
  for (const r of uzmi(SLOZENE, 12)) {
    const n = brojSlogova(r);
    q.push(upisBroja(`Koliko slogova ima riječ ${r}?`, n, 2, `${rastavi(r).join('-')}: ${n}`));
  }
  for (const r of uzmi(SLOZENE.filter((x) => brojSlogova(x) >= 2), 10)) {
    const s = rastavi(r);
    q.push(izbor(`Kojim slogom počinje riječ ${r}?`, s[0].toUpperCase(), uzmi(['MA', 'KO', 'LO', 'PA', 'RI', 'TO', 'ŠKO', 'BA', 'KI', 'LE', 'SU', 'VO', 'PTI', 'JA', 'ČO'].filter((x) => x !== s[0].toUpperCase()), 3), 2, `${s.join('-')}`));
  }
  for (const r of uzmi(SLOZENE.filter((x) => brojSlogova(x) >= 2), 8)) {
    const s = rastavi(r);
    q.push(izbor(`Koja riječ nastaje kad složiš slogove ${promijesaj(s).join(' + ')} pravim redom?`, r, uzmi(SLOZENE.filter((x) => x !== r), 3), 2, s.join('-')));
  }
  ponovi(5, () => {
    const [a, b] = uzmi(SLOZENE, 2);
    if (brojSlogova(a) === brojSlogova(b)) return null;
    return izbor(`Koja riječ ima više slogova: ${a} ili ${b}?`, brojSlogova(a) > brojSlogova(b) ? a : b, [brojSlogova(a) > brojSlogova(b) ? b : a], 2,
      `${rastavi(a).join('-')} i ${rastavi(b).join('-')}`);
  }).forEach((x) => q.push(x));
  return q;
}

const ABECEDA = ['A', 'B', 'C', 'Č', 'Ć', 'D', 'DŽ', 'Đ', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'LJ', 'M', 'N', 'NJ', 'O', 'P', 'R', 'S', 'Š', 'T', 'U', 'V', 'Z', 'Ž'];
function slovaDodatak() {
  const q = [];
  for (let i = 1; i < ABECEDA.length; i++) {
    const s = ABECEDA[i];
    q.push(izbor(`Koje slovo u abecedi dolazi neposredno prije slova ${s}?`, ABECEDA[i - 1], uzmi(ABECEDA.filter((x) => x !== ABECEDA[i - 1] && x !== s), 3), 2));
  }
  for (const s of ABECEDA) q.push(izbor(`Koje je malo slovo za veliko slovo ${s}?`, s.toLowerCase(), uzmi(ABECEDA.filter((x) => x !== s).map((x) => x.toLowerCase()), 3), 1));
  return q;
}

const RECENICE_R1 = ['Pas laje.', 'Mačka spava na stolcu.', 'Ana čita knjigu.', 'Tata vozi auto.', 'Ptica pjeva na grani.', 'Sunce sja.', 'Djeca se igraju u parku.',
  'Luka jede jabuku.', 'Baka peče kolač.', 'Riba pliva u moru.', 'Mama kupuje kruh.', 'Pada kiša.', 'Zec skače po livadi.', 'Ivo crta kuću.', 'Mia pije vodu.',
  'Vjetar puše.', 'Krava pase travu.', 'Brat igra nogomet.', 'Sestra pjeva pjesmu.', 'Djed čita novine.'];
function receniceDodatak() {
  const q = [];
  for (const r of uzmi(RECENICE_R1, 10)) {
    const n = r.replace(/[.!?]/g, '').split(/\s+/).length;
    q.push(upisBroja(`Koliko riječi ima rečenica „${r}”?`, n, 1));
  }
  for (const r of uzmi(RECENICE_R1, 8)) {
    const prva = r.split(' ')[0];
    q.push(izbor(`Koja je prva riječ u rečenici „${r}”?`, prva, uzmi(r.replace(/[.]/g, '').split(' ').slice(1).concat(['Ja', 'Mi']), 3), 1));
  }
  for (const r of uzmi(RECENICE_R1, 6)) {
    const krivo = r[0].toLowerCase() + r.slice(1);
    q.push(izbor(`Koji je pravilan zapis rečenice s riječima: ${r.replace('.', '').toLowerCase()}?`, r, [krivo, r.replace('.', ''), krivo.replace('.', '')], 2,
      'Rečenica počinje velikim slovom i završava točkom.'));
  }
  return q;
}

// ═══ 2. razred ═══

const ZVUKOVI = [['krava', 'muče'], ['ovca', 'bleji'], ['koza', 'meketa'], ['konj', 'rže'], ['pijetao', 'kukuriče'], ['magarac', 'njače'],
  ['svinja', 'grokće'], ['vuk', 'zavija'], ['žaba', 'krekeće'], ['pčela', 'zuji'], ['sova', 'huče'], ['golub', 'guče'], ['kokoš', 'kvoca'], ['miš', 'ciči'], ['zmija', 'sikće'], ['pas', 'laje']];
const ALATI = [
  ['Čime režemo papir?', 'škarama', ['olovkom', 'žlicom', 'četkom']],
  ['Čime pišemo u bilježnicu?', 'olovkom', ['škarama', 'češljem', 'vilicom']],
  ['Čime češljamo kosu?', 'češljem', ['četkicom za zube', 'olovkom', 'žlicom']],
  ['Čime peremo zube?', 'četkicom', ['češljem', 'vilicom', 'spužvom']],
  ['Čime jedemo juhu?', 'žlicom', ['nožem', 'vilicom', 'olovkom']],
  ['Čime zakucavamo čavao?', 'čekićem', ['pilom', 'škarama', 'žlicom']],
  ['Čime režemo dasku?', 'pilom', ['čekićem', 'škarama', 'olovkom']],
  ['Čime brišemo napisano olovkom?', 'gumicom', ['ravnalom', 'šiljilom', 'bojicom']],
  ['Čime crtamo ravne crte?', 'ravnalom', ['gumicom', 'kistom', 'šiljilom']],
  ['Čime bojimo zid?', 'kistom', ['gumicom', 'češljem', 'škarama']],
  ['Čime zalijevamo cvijeće?', 'kantom za zalijevanje', ['metlom', 'kišobranom', 'loncem za juhu']],
  ['Čime metemo pod?', 'metlom', ['kistom', 'žlicom', 'grabljama']],
];
const SUPROTNO_2 = [['visok', 'nizak'], ['debeo', 'tanak'], ['star', 'mlad'], ['pun', 'prazan'], ['mokar', 'suh'], ['dug', 'kratak'], ['tih', 'glasan'], ['težak', 'lagan'],
  ['širok', 'uzak'], ['svijetao', 'taman'], ['sretan', 'tužan'], ['gore', 'dolje'], ['dan', 'noć'], ['ljeto', 'zima'], ['otvoriti', 'zatvoriti'], ['ući', 'izaći'], ['smijati se', 'plakati'], ['dati', 'uzeti']];
function glagoli2Dodatak() {
  const q = [];
  q.push(...obaSmjera(ZVUKOVI, { pitajB: (a) => `Kako se oglašava ${a}?`, pitajA: (b) => `Koja životinja ${b}?`, tezina: 1 }));
  q.push(...izTablice(ALATI, 1));
  q.push(...obaSmjera(SUPROTNO_2, { pitajB: (a) => `Koja je riječ suprotnog značenja od riječi ${a}?`, tezina: 2 }));
  q.push(...spajanja(ZVUKOVI, 'Spoji životinju s glasanjem:', { koliko: 4, komada: 2 }));
  return q;
}

const OPISI_IMENICA = [
  ['Koja riječ imenuje životinju koja daje mlijeko?', 'krava', ['kokoš', 'pas', 'riba']],
  ['Koja riječ imenuje osobu koja liječi ljude?', 'liječnik', ['pekar', 'vozač', 'poštar']],
  ['Koja riječ imenuje mjesto na kojem kupujemo kruh?', 'pekarnica', ['knjižnica', 'bolnica', 'kino']],
  ['Koja riječ imenuje predmet koji nas štiti od kiše?', 'kišobran', ['naočale', 'šal', 'rukavica']],
  ['Koja riječ imenuje pojavu kad se nebo šareno obasja nakon kiše?', 'duga', ['magla', 'mraz', 'oluja']],
  ['Koja riječ imenuje mjesto na kojem gledamo filmove?', 'kino', ['vrtić', 'pošta', 'tržnica']],
  ['Koja riječ imenuje osobu koja nosi pisma?', 'poštar', ['kuhar', 'zidar', 'pilot']],
  ['Koja riječ imenuje predmet kojim otključavamo vrata?', 'ključ', ['zvono', 'čavao', 'žlica']],
  ['Koja riječ imenuje životinju koja gradi mrežu?', 'pauk', ['mrav', 'puž', 'leptir']],
  ['Koja riječ imenuje mjesto na kojem rastu mnoga stabla?', 'šuma', ['livada', 'cesta', 'trg']],
  ['Koja riječ imenuje pojavu kad zimi pada bijelo s neba?', 'snijeg', ['vjetar', 'sunce', 'duga']],
  ['Koja riječ imenuje osobu koja gasi požare?', 'vatrogasac', ['frizer', 'trgovac', 'slikar']],
  ['Koja riječ imenuje predmet na kojem spavamo?', 'krevet', ['ormar', 'stol', 'tepih']],
  ['Koja riječ imenuje životinju koja nosi kućicu na leđima?', 'puž', ['zec', 'jež', 'vrabac']],
  ['Koja riječ imenuje mjesto na kojem se liječe bolesni?', 'bolnica', ['škola', 'park', 'trgovina']],
  ['Koja riječ imenuje osobu koja vozi autobus?', 'vozač', ['kuhar', 'učitelj', 'pjevač']],
];
const MNOZINA = [['stol', 'stolovi'], ['grad', 'gradovi'], ['kuća', 'kuće'], ['dijete', 'djeca'], ['čovjek', 'ljudi'], ['oko', 'oči'], ['uho', 'uši'], ['pas', 'psi'],
  ['brat', 'braća'], ['cvijet', 'cvjetovi'], ['jaje', 'jaja'], ['more', 'mora'], ['selo', 'sela'], ['knjiga', 'knjige'], ['olovka', 'olovke'], ['prozor', 'prozori'],
  ['učenik', 'učenici'], ['prijatelj', 'prijatelji'], ['miš', 'miševi'], ['ptica', 'ptice'], ['zec', 'zečevi'], ['ključ', 'ključevi'], ['kralj', 'kraljevi'], ['vlak', 'vlakovi']];
function imeniceRodDodatak() {
  const q = [...izTablice(OPISI_IMENICA, 1)];
  q.push(...obaSmjera(MNOZINA, { pitajB: (a) => `Kako glasi riječ ${a} kad ih je više?`, pitajA: (b) => `Kako glasi riječ ${b} kad je samo jedan ili jedna?`, tezina: 2 }));
  q.push(...tvrdnje(MNOZINA, (a, b) => `Je li ${b} oblik riječi ${a} kad ih je više?`, { tezina: 2 }));
  return q;
}

const RECENICE_2 = ['Pada snijeg', 'Gdje je moja torba', 'Kako lijep dan', 'Ana ide u školu', 'Koliko je sati', 'Joj, što me boli zub', 'Mačka pije mlijeko',
  'Hoćeš li se igrati', 'Bravo, pobijedili smo', 'Djed sadi cvijeće', 'Tko je pojeo kolač', 'Pazi, auto', 'Sutra idemo na izlet', 'Zašto plačeš', 'Hura, praznici su'];
const ZNAK_R2 = { 'Pada snijeg': '.', 'Gdje je moja torba': '?', 'Kako lijep dan': '!', 'Ana ide u školu': '.', 'Koliko je sati': '?', 'Joj, što me boli zub': '!',
  'Mačka pije mlijeko': '.', 'Hoćeš li se igrati': '?', 'Bravo, pobijedili smo': '!', 'Djed sadi cvijeće': '.', 'Tko je pojeo kolač': '?', 'Pazi, auto': '!',
  'Sutra idemo na izlet': '.', 'Zašto plačeš': '?', 'Hura, praznici su': '!' };
function recenice2Dodatak() {
  const q = [];
  ponovi(8, () => {
    const n = cijeli(2, 4), r = uzmi(RECENICE_2, n).map((x) => x + ZNAK_R2[x]);
    return upisBroja(`Koliko rečenica ima ovaj tekst: „${r.join(' ')}”?`, n, 2, 'Svaka rečenica završava točkom, upitnikom ili uskličnikom.');
  }).forEach((x) => q.push(x));
  for (const r of uzmi(RECENICE_2, 10)) {
    const z = ZNAK_R2[r], ime = { '.': 'točku', '?': 'upitnik', '!': 'uskličnik' };
    q.push(izbor(`Koji znak treba staviti na kraj rečenice ${r} ___?`, ime[z], Object.values(ime).filter((x) => x !== ime[z]), 2));
  }
  ponovi(4, () => {
    const r = uzmi(RECENICE_2, 3).map((x) => x + ZNAK_R2[x]);
    const upitne = r.filter((x) => x.endsWith('?'));
    if (upitne.length !== 1) return null;
    return izbor(`Koja je od ovih rečenica upitna: ${r.join(' / ')}?`, upitne[0], r.filter((x) => !x.endsWith('?')), 2, 'Upitna rečenica završava upitnikom.');
  }).forEach((x) => q.push(x));
  return q;
}

// ═══ 3. razred ═══

const IMENICE_3 = ['škola', 'rijeka', 'oblak', 'prijatelj', 'stol', 'livada', 'grad', 'pjesma', 'jabuka', 'more', 'vjetar', 'brat', 'knjiga', 'planina', 'leptir', 'cesta', 'pekar', 'zima'];
const GLAGOLI_3 = ['trčati', 'pjevati', 'čitati', 'pisati', 'plivati', 'spavati', 'skakati', 'crtati', 'učiti', 'kuhati', 'graditi', 'svirati', 'letjeti', 'misliti', 'jesti', 'smijati se'];
const PRIDJEVI_3 = ['velik', 'malen', 'brz', 'spor', 'hladan', 'topao', 'zelen', 'plav', 'veseo', 'tužan', 'lijep', 'visok', 'nizak', 'mekan', 'tvrd', 'slatko', 'hrabar', 'pametan'];
const REC_VRSTE = [
  ['Mali zec brzo trči.', 'zec', 'trči', 'mali'], ['Zelena žaba skače u vodu.', 'žaba', 'skače', 'zelena'], ['Vesela djeca pjevaju.', 'djeca', 'pjevaju', 'vesela'],
  ['Stari djed čita novine.', 'djed', 'čita', 'stari'], ['Hladan vjetar puše.', 'vjetar', 'puše', 'hladan'], ['Mlada učiteljica piše na ploču.', 'učiteljica', 'piše', 'mlada'],
  ['Crveni balon leti.', 'balon', 'leti', 'crveni'], ['Gladna mačka mijauče.', 'mačka', 'mijauče', 'gladna'], ['Visoko stablo raste.', 'stablo', 'raste', 'visoko'],
  ['Mali brat crta.', 'brat', 'crta', 'mali'], ['Topla kiša pada.', 'kiša', 'pada', 'topla'], ['Žuto sunce sja.', 'sunce', 'sja', 'žuto'],
];
function vrsteRijeciDodatak() {
  const q = [];
  for (const [r, im, gl, pr] of REC_VRSTE) {
    const sve = r.replace('.', '').split(' ').map((x) => x.toLowerCase());
    const krivi = (t) => sve.filter((x) => x !== t.toLowerCase());
    q.push(izbor(`Koja je riječ glagol u rečenici: ${r}`.replace(/\.$/, '?'), gl, krivi(gl), 2, `${gl} kaže što netko radi.`));
    q.push(izbor(`Koja je riječ pridjev u rečenici: ${r}`.replace(/\.$/, '?'), pr, krivi(pr), 2, `${pr} kaže kakav je netko ili nešto.`));
    q.push(izbor(`Koja riječ imenuje biće ili stvar u rečenici: ${r}`.replace(/\.$/, '?'), im, krivi(im), 2));
  }
  ponovi(8, () => {
    const [vrsta, popis, ostali] = jedan([['imenica', IMENICE_3, [...GLAGOLI_3, ...PRIDJEVI_3]], ['glagola', GLAGOLI_3, [...IMENICE_3, ...PRIDJEVI_3]], ['pridjeva', PRIDJEVI_3, [...IMENICE_3, ...GLAGOLI_3]]]);
    const skup = uzmi(popis, 3), uljez = jedan(ostali);
    return izbor(`Koja riječ ne pripada skupini ${vrsta}: ${promijesaj([...skup, uljez]).join(', ')}?`, uljez, skup, 2);
  }).forEach((x) => q.push(x));
  ponovi(6, () => {
    const im = uzmi(IMENICE_3, 1)[0], gl = jedan(GLAGOLI_3), pr = jedan(PRIDJEVI_3);
    return spoji('Spoji riječ s vrstom riječi kojoj pripada:', promijesaj([[im, 'imenica'], [gl, 'glagol'], [pr, 'pridjev']]), 2);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const im = jedan(IMENICE_3);
    return tocnoNetocno(`Je li riječ ${im} imenica?`, true, 1);
  }).forEach((x) => q.push(x));
  ponovi(4, () => {
    const gl = jedan(GLAGOLI_3);
    return tocnoNetocno(`Je li riječ ${gl} pridjev?`, false, 2, `${gl} je glagol, kaže što netko radi.`);
  }).forEach((x) => q.push(x));
  return q;
}

const CC = [['ku_a', 'ć', 'kuća'], ['_aša', 'č', 'čaša'], ['no_', 'ć', 'noć'], ['ključ'.replace('č', '_'), 'č', 'ključ'], ['ma_ka', 'č', 'mačka'], ['vo_e', 'ć', 'voće'],
  ['sre_a', 'ć', 'sreća'], ['_okolada', 'č', 'čokolada'], ['kola_', 'č', 'kolač'], ['_up', 'ć', 'ćup'], ['_arapa', 'č', 'čarapa'], ['pti_', 'ć', 'ptić'],
  ['lon_i_', 'č', 'lončić'], ['ple_a', 'ć', 'pleća'], ['_ovjek', 'č', 'čovjek'], ['ve_er', 'č', 'večer'], ['ku_ica', 'ć', 'kućica'], ['ru_ak', 'č', 'ručak'],
  ['pe_', 'ć', 'peć'], ['_ekić', 'č', 'čekić']].filter(([z]) => (z.match(/_/g) || []).length === 1);
const IJE = [['mlijeko', 'mljeko'], ['rijeka', 'rjeka'], ['snijeg', 'snjeg'], ['cvijet', 'cvjet'], ['dijete', 'djete'], ['svijet', 'svjet'], ['lijep', 'ljep'], ['bijel', 'bjel'],
  ['vrijeme', 'vrjeme'], ['mjesec', 'mijesec'], ['djevojčica', 'dijevojčica'], ['pjesma', 'pijesma'], ['vjetar', 'vijetar'], ['ljeto', 'lijeto'], ['mjesto', 'mijesto'], ['djed', 'dijed'], ['sjena', 'sijena'], ['rječnik', 'riječnik']];
const DZ = [['džep', 'đep'], ['džem', 'đem'], ['đak', 'džak'], ['rođendan', 'rodžendan'], ['grožđe', 'grozdže'], ['žeđ', 'žedž'], ['lađa', 'ladža'], ['anđeo', 'andžeo'], ['džungla', 'đungla'], ['mađioničar', 'madžioničar']];
const VELIKO = [
  ['Zagreb', true, 'ime grada'], ['Sava', true, 'ime rijeke'], ['Hrvatska', true, 'ime države'], ['Marko', true, 'ime osobe'], ['Velebit', true, 'ime planine'],
  ['ponedjeljak', false, 'dan u tjednu'], ['siječanj', false, 'mjesec'], ['proljeće', false, 'godišnje doba'], ['rijeka', false, 'opća imenica'], ['grad', false, 'opća imenica'],
  ['Jadransko more', true, 'ime mora'], ['Božić', true, 'ime blagdana'], ['subota', false, 'dan u tjednu'], ['Dunav', true, 'ime rijeke'], ['zima', false, 'godišnje doba'],
];
const REC_VELIKO = [['Sutra putujemo u split.', 'split', 'Split'], ['moja sestra zove se Iva.', 'moja', 'Moja'], ['Ljeti se kupamo u jadranskom moru.', 'jadranskom', 'Jadranskom'],
  ['Na izletu smo vidjeli rijeku savu.', 'savu', 'Savu'], ['Moj pas zove se reks.', 'reks', 'Reks'], ['Baka živi u osijeku.', 'osijeku', 'Osijeku'],
  ['Najviša hrvatska planina je dinara.', 'dinara', 'Dinara'], ['U razredu sjedim s lukom.', 'lukom', 'Lukom']];
function gramatikaPravopisDodatak() {
  const q = [];
  for (const [zapis, glas, rijec] of CC) q.push(izbor(`Koje slovo nedostaje u riječi ${zapis}?`, glas, [glas === 'č' ? 'ć' : 'č'], 2, `Pravilno se piše: ${rijec}.`));
  for (const [dobro, krivo] of IJE) q.push(izbor(`Koji je zapis pravilan: ${promijesaj([dobro, krivo]).join(' ili ')}?`, dobro, [krivo], 2));
  for (const [dobro, krivo] of DZ) q.push(izbor(`Kako se pravilno piše: ${promijesaj([dobro, krivo]).join(' ili ')}?`, dobro, [krivo], 2));
  for (const [r, veliko, opis] of VELIKO) q.push(tocnoNetocno(`Piše li se ${r} velikim početnim slovom?`, veliko, 2, veliko ? `To je ${opis}, a vlastita imena pišemo velikim slovom.` : `To je ${opis}, pa ga pišemo malim slovom.`));
  // konstrukt velikoSlovo: ocjena razlikuje veliko i malo slovo (split ≠ Split)
  for (const [r, krivo, dobro] of REC_VELIKO) q.push({ ...upisRijeci(`Koju riječ u rečenici „${r}” treba napisati velikim početnim slovom?`, dobro, 2), konstrukt: 'velikoSlovo' });
  return q;
}

const VRSTE_3 = [['kratka priča u kojoj životinje govore i iz koje učimo pouku', 'basna'], ['priča u kojoj se događaju čarolije i čudesa', 'bajka'],
  ['kratko pitanje u stihu kojemu treba pogoditi rješenje', 'zagonetka'], ['niz riječi koje je teško brzo izgovoriti', 'brzalica'], ['kratka mudra izreka iz naroda', 'poslovica'],
  ['tekst napisan u stihovima i kiticama', 'pjesma'], ['tekst koji glumci izvode na pozornici', 'igrokaz'], ['knjiga u kojoj su slike važnije od teksta', 'slikovnica'],
  ['priča u slikama s oblačićima za govor likova', 'strip'], ['nježna pjesma kojom se uspavljuje dijete', 'uspavanka']];
const POJMOVI_3 = [['osoba koja je napisala priču', 'pisac'], ['osoba koja je napisala pjesmu', 'pjesnik'], ['osoba koja crta slike za knjigu', 'ilustrator'],
  ['jedan redak u pjesmi', 'stih'], ['skupina stihova u pjesmi', 'kitica'], ['bića o kojima priča govori', 'likovi'], ['ime priče ili pjesme', 'naslov'],
  ['mjesto na kojem glumci izvode predstavu', 'pozornica'], ['osoba koja glumi ulogu u predstavi', 'glumac'], ['ljudi koji gledaju predstavu', 'publika']];
const PRIMJERI_3 = [['Tko rano rani, dvije sreće grabi.', 'poslovica'], ['Petar Petru plete petlju.', 'brzalica'], ['Bez muke nema nauke.', 'poslovica'],
  ['Crven je, a nije rak; okrugao je, a nije sat. Što je to?', 'zagonetka'], ['Riba ribi grize rep.', 'brzalica'], ['Tko drugome jamu kopa, sam u nju pada.', 'poslovica'],
  ['Visi, a ne pada, ima zube, a ne jede. Što je to?', 'zagonetka'], ['Na vrh brda vrba mrda.', 'brzalica']];
const USPOREDBE = [['brz kao vjetar', true], ['bijel kao snijeg', true], ['jak kao medvjed', true], ['sladak kao med', true], ['Ana ima psa.', false], ['hladan kao led', true],
  ['Sunce sja.', false], ['vrijedan kao mrav', true], ['tih kao miš', true], ['Djeca trče.', false], ['crven kao rak', true], ['Mama kuha ručak.', false]];
function knjizevniTekstDodatak() {
  const q = [];
  q.push(...obaSmjera(VRSTE_3, { pitajA: (b) => `Što je ${b}?`, pitajB: (a) => `Koja vrsta teksta odgovara opisu: ${a}?`, tezina: 2 }));
  q.push(...obaSmjera(POJMOVI_3, { pitajB: (a) => `Koji pojam odgovara opisu: ${a}?`, pitajA: (b) => `Što znači pojam ${b}?`, tezina: 2 }));
  q.push(...obaSmjera(PRIMJERI_3, { pitajB: (a) => `Je li ovo zagonetka, brzalica ili poslovica? „${a}”`, tezina: 2 }));
  q.push(...uObitelj(obiteljTablice(USPOREDBE), USPOREDBE.map(([izraz, jest]) => tocnoNetocno(`Je li ${izraz.endsWith('.') ? `rečenica „${izraz}”` : `izraz „${izraz}”`} usporedba?`, jest, 2,
    jest ? 'U izrazu se nešto uspoređuje riječju „kao”.' : 'U rečenici nema uspoređivanja riječju „kao” ili „poput”.'))));
  return q;
}

const SLICNO = [['lijep', 'krasan'], ['brz', 'hitar'], ['velik', 'golem'], ['govoriti', 'pričati'], ['gledati', 'promatrati'], ['veseo', 'radostan'], ['tužan', 'žalostan'],
  ['pametan', 'mudar'], ['hrabar', 'odvažan'], ['drug', 'prijatelj'], ['malen', 'sitan'], ['početi', 'započeti'], ['bježati', 'juriti'], ['tih', 'miran'], ['plašiti se', 'bojati se'], ['kuća', 'dom']];
const SUPROTNO_3 = [['početak', 'kraj'], ['vrijedan', 'lijen'], ['hrabar', 'plašljiv'], ['bogat', 'siromašan'], ['istina', 'laž'], ['mir', 'rat'], ['pobjeda', 'poraz'],
  ['dobiti', 'izgubiti'], ['rano', 'kasno'], ['blizu', 'daleko'], ['često', 'rijetko'], ['sigurno', 'opasno'], ['čist', 'prljav'], ['zdrav', 'bolestan'], ['sjever', 'jug'], ['istok', 'zapad']];
const PRIDJEV_ZA = [['limun', 'kiseo'], ['šećer', 'sladak'], ['led', 'hladan'], ['vatra', 'vruća'], ['puž', 'spor'], ['gepard', 'brz'], ['perje', 'lagano'], ['kamen', 'tvrd'],
  ['jastuk', 'mekan'], ['jablan', 'visok'], ['noć', 'tamna'], ['trava', 'zelena'], ['more', 'slano'], ['med', 'sladak'], ['snijeg', 'bijel']];
const PONASANJE = [
  ['Ujutro u hodniku srećeš ravnatelja. Kako ćeš ga pozdraviti?', 'Dobro jutro!', ['Bok, stari!', 'Ej!', 'Ništa ne kažem.']],
  ['Kako ćeš pozdraviti prijatelja na igralištu?', 'Bok!', ['Poštovani gospodine!', 'Laku noć!', 'S poštovanjem!']],
  ['Susjed ti je pridržao vrata. Što ćeš reći?', 'Hvala lijepa!', ['Makni se!', 'Oprosti!', 'Laku noć!']],
  ['Slučajno gurneš prijatelja. Što ćeš reći?', 'Oprosti, nisam namjerno.', ['Sam si kriv.', 'Hvala!', 'Dobar tek!']],
  ['Kako ćeš pristojno zamoliti učiteljicu za olovku?', 'Molim vas, možete li mi posuditi olovku?', ['Daj olovku!', 'Olovka, odmah!', 'Hoću olovku.']],
  ['Što kažemo kad netko kihne?', 'Nazdravlje!', ['Dobar tek!', 'Laku noć!', 'Sretan put!']],
  ['Što kažemo prije jela za stolom?', 'Dobar tek!', ['Nazdravlje!', 'Sretan put!', 'Dobro jutro!']],
  ['Prijatelj odlazi na more. Što mu poželiš?', 'Sretan put!', ['Dobar tek!', 'Laku noć!', 'Nazdravlje!']],
  ['Kako se obraćamo nepoznatoj odrasloj osobi?', 'persiramo joj (govorimo „vi”)', ['kažemo joj „ti”', 'vičemo na nju', 'ne gledamo je']],
  ['Kako ćeš završiti telefonski razgovor s bakom?', 'Doviđenja, bako, volim te!', ['Spustim slušalicu bez riječi.', 'Dosta je bilo!', 'Ej!']],
];
const PISMO = [
  ['Što obavezno mora pisati u pozivnici za rođendan?', 'kada i gdje je proslava', ['koji je tvoj omiljeni film', 'koliko imaš igračaka', 'kako se zove tvoj pas']],
  ['Gdje u pismu pišemo mjesto i datum?', 'na početku, gore desno', ['u sredini pisma', 'na poleđini omotnice', 'nigdje']],
  ['Čime završava pismo prijatelju?', 'pozdravom i potpisom', ['naslovom', 'datumom', 'adresom primatelja']],
  ['Što pišemo na omotnicu pisma?', 'adresu primatelja', ['cijelo pismo', 'svoju ocjenu', 'naslov priče']],
  ['Čemu služi obavijest?', 'da kratko i jasno javi važan podatak', ['da ispriča izmišljenu priču', 'da opiše osjećaje u stihovima', 'da nasmije čitatelja']],
  ['Kako počinje pismo baki?', 'Draga bako,', ['Poštovani gospodine,', 'Bok, svi!', 'Naslov: Baka']],
  ['Što je sažetak priče?', 'kratko prepričavanje najvažnijih događaja', ['prepisana cijela priča', 'popis likova bez događaja', 'nova priča s drugim likovima']],
  ['Što trebamo učiniti prije pisanja sastavka?', 'smisliti plan: uvod, glavni dio i završetak', ['odmah pisati bez razmišljanja', 'nacrtati samo sliku', 'prepisati tuđi sastavak']],
];
const SLIJED = [
  ['Pranje zuba', ['Uzmem četkicu.', 'Stavim pastu na četkicu.', 'Perem zube.', 'Isperem usta vodom.']],
  ['Sadnja cvijeta', ['Iskopam rupu u zemlji.', 'Stavim sjeme u rupu.', 'Zatrpam sjeme zemljom.', 'Zalijem zemlju vodom.']],
  ['Pisanje pisma', ['Napišem mjesto i datum.', 'Napišem pozdrav na početku.', 'Napišem što želim reći.', 'Potpišem se.']],
  ['Odlazak u školu', ['Probudim se.', 'Obučem se.', 'Doručkujem.', 'Krenem u školu.']],
  ['Pečenje kolača', ['Pripremim sastojke.', 'Umijesim tijesto.', 'Stavim tijesto u pećnicu.', 'Izvadim pečeni kolač.']],
  ['Izlet u šumu', ['Spakiramo ruksake.', 'Autobusom dođemo do šume.', 'Šećemo i promatramo prirodu.', 'Vratimo se kući umorni.']],
  ['Bojanje slike', ['Nacrtam crtež olovkom.', 'Odaberem boje.', 'Obojim crtež.', 'Pustim da se boja osuši.']],
  ['Kupnja kruha', ['Uđem u pekarnicu.', 'Pozdravim prodavačicu.', 'Kažem što želim.', 'Platim i zahvalim.']],
];
const VEZNE = [
  ['___ smo se probudili, zatim smo doručkovali.', 'Najprije', ['Na kraju', 'Zatim', 'Nakon toga']],
  ['Najprije smo se obukli, ___ smo izašli van.', 'zatim', ['najprije', 'na početku', 'jučer']],
  ['Igrali smo se cijelo poslijepodne, a ___ smo umorni zaspali.', 'na kraju', ['najprije', 'na početku', 'ujutro']],
  ['Pas je lajao ___ je čuo zvono.', 'jer', ['ali', 'ili', 'nego']],
  ['Htio sam van, ___ je padala kiša.', 'ali', ['jer', 'i', 'da']],
  ['Hoćeš li sok ___ vodu?', 'ili', ['ali', 'jer', 'nego']],
];
function jezicnoIzrazavanjeDodatak() {
  const q = [];
  q.push(...obaSmjera(SLICNO, { pitajB: (a) => `Koja riječ ima slično značenje kao riječ ${a}?`, pitajA: (b) => `Koju riječ možemo zamijeniti riječju ${b}, a da značenje ostane isto?`, tezina: 2 }));
  q.push(...obaSmjera(SUPROTNO_3, { pitajB: (a) => `Koja riječ ima suprotno značenje od riječi ${a}?`, tezina: 2 }));
  q.push(...uObitelj(obiteljTablice(PRIDJEV_ZA), PRIDJEV_ZA.map(([im, pr]) => izbor(`Koja riječ najbolje opisuje imenicu ${im}?`, pr, uzmi(PRIDJEV_ZA.filter(([, p]) => p !== pr && p.slice(0, 3) !== pr.slice(0, 3)).map(([, p]) => p), 3), 1))));
  q.push(...izTablice(PONASANJE, 1), ...izTablice(PISMO, 2), ...izTablice(VEZNE.map(([r, ...x]) => [`Koja riječ dolazi na crtu: ${r}`.replace(/\.$/, '?'), ...x]), 2));
  q.push(...uObitelj(obiteljTablice(SLIJED), SLIJED.map(([naslov, koraci]) => poredaj(`Poredaj rečenice tako da opisuju radnju: ${naslov.toLowerCase()}.`, koraci, 2))));
  return q;
}

// ═══ 4. razred ═══

const PRIDJEVI_MJESTA = [['Zagreb', 'zagrebački'], ['Split', 'splitski'], ['Rijeka', 'riječki'], ['Osijek', 'osječki'], ['Zadar', 'zadarski'], ['Pula', 'pulski'],
  ['Dubrovnik', 'dubrovački'], ['Varaždin', 'varaždinski'], ['Karlovac', 'karlovački'], ['Sisak', 'sisački'], ['Šibenik', 'šibenski'], ['Vukovar', 'vukovarski'],
  ['Čakovec', 'čakovečki'], ['Slavonija', 'slavonski'], ['Dalmacija', 'dalmatinski'], ['Istra', 'istarski'], ['Zagorje', 'zagorski'],
  ['Koprivnica', 'koprivnički'], ['Bjelovar', 'bjelovarski'], ['Gospić', 'gospićki'], ['Krk', 'krčki'], ['Knin', 'kninski'], ['Rovinj', 'rovinjski'],
  ['Poreč', 'porečki'], ['Đakovo', 'đakovački'], ['Vinkovci', 'vinkovački'], ['Krapina', 'krapinski'], ['Lika', 'lički'], ['Baranja', 'baranjski']];
const VELIKO_4 = [['Republika Hrvatska', true], ['Osnovna škola Ivana Gorana Kovačića', true], ['Nacionalni park Plitvička jezera', true], ['Uskrs', true], ['Nova godina', true],
  ['Trg bana Jelačića', true], ['Ulica kralja Tomislava', true], ['utorak', false], ['listopad', false], ['jesen', false], ['zagrebački', false], ['hrvatski jezik', false],
  ['Dan državnosti', true], ['Jadransko more', true], ['Gorski kotar', true]];
const UPRAVNI = [
  ['Kojim znakom odvajamo najavu od upravnoga govora kad najava stoji ispred?', 'dvotočkom', ['točkom', 'upitnikom', 'zarezom']],
  ['Kojim znakovima označavamo tuđe riječi u upravnom govoru?', 'navodnicima', ['zagradama', 'crticama', 'točkama']],
  ['Kojim slovom počinje upravni govor?', 'velikim slovom', ['malim slovom', 'brojkom', 'bilo kojim']],
];
function pravopis4Dodatak() {
  const q = [];
  q.push(...obaSmjera(PRIDJEVI_MJESTA, { pitajB: (a) => `Kako glasi pridjev od imena ${a}?`, pitajA: (b) => `Od kojega je imena nastao pridjev ${b}?`, tezina: 2 }));
  q.push(...uObitelj(obiteljTablice(VELIKO_4), VELIKO_4.map(([r, v]) => {
    // Pokaži pravilan ili pogrešan zapis (veliko ↔ malo početno slovo).
    const krivo = v ? r[0].toLowerCase() + r.slice(1) : r[0].toUpperCase() + r.slice(1);
    const pravilno = Math.random() < 0.5;
    return tocnoNetocno(`Je li pravilno napisano: ${pravilno ? r : krivo}?`, pravilno, 2,
      v ? `Pravilno je ${r}: vlastito ime počinje velikim slovom.` : `Pravilno je ${r}: to nije vlastito ime, pa počinje malim slovom.`);
  })));
  q.push(...VELIKO_4.filter(([, v]) => v).map(([r]) => izbor(`Koji je zapis pravilan: ${promijesaj([r, r.toLowerCase()]).join(' ili ')}?`, r, [r.toLowerCase()], 2)));
  q.push(...izTablice(UPRAVNI, 3));
  q.push(...daNe([
    ['Je li upravni govor pravilno napisan u rečenici: Mama je rekla: „Operi ruke.”?', true],
    ['Je li upravni govor pravilno napisan u rečenici: Mama je rekla: operi ruke.?', false, 'Tuđe riječi stavljamo u navodnike i počinjemo velikim slovom: „Operi ruke.”'],
    ['Je li upravni govor pravilno napisan u rečenici: Luka je upitao: „Gdje je lopta?”?', true],
    ['Je li upravni govor pravilno napisan u rečenici: Luka je upitao: „gdje je lopta?”?', false, 'Upravni govor počinje velikim slovom: „Gdje je lopta?”'],
  ], 3));
  q.push(...IJE.slice(0, 12).map(([dobro, krivo]) => izbor(`Kako se pravilno piše riječ: ${promijesaj([dobro, krivo]).join(' ili ')}?`, dobro, [krivo], 2)));
  return q;
}

// Hrvatski autori i djela iz lektire razredne nastave
const DJELA = [['Čudnovate zgode šegrta Hlapića', 'Ivana Brlić-Mažuranić'], ['Vlak u snijegu', 'Mato Lovrak'], ['Družba Pere Kvržice', 'Mato Lovrak'],
  ['Bijeli jelen', 'Vladimir Nazor'], ['Veli Jože', 'Vladimir Nazor'], ['Regoč', 'Ivana Brlić-Mažuranić'], ['Grga Čvarak', 'Ratko Zvrko'],
  ['Konjic sedlenjak', 'Nada Iveljić'], ['Zlatni danci', 'Jagoda Truhelka'], ['Alkar', 'Dinko Šimunović'], ['Duh u močvari', 'Anto Gardaš'],
  ['Divlji konj', 'Božidar Prosenjak'], ['Koko i duhovi', 'Ivan Kušan'], ['Smogovci', 'Hrvoje Hitrec'], ['Kad bi drveće hodalo', 'Grigor Vitez'],
  ['Zaljubljen do ušiju', 'Miro Gavran']];
const POJMOVI_4 = [['dulje prozno djelo s više likova i događaja', 'roman'], ['kraće prozno djelo s manje likova', 'pripovijetka'], ['pjesma koja izražava osjećaje', 'lirska pjesma'],
  ['narodna priča o nekom mjestu ili junaku s malo istine', 'legenda'], ['događaji u priči poredani jedan za drugim', 'fabula'], ['najnapetiji dio priče', 'vrhunac'],
  ['dio priče u kojem se problem riješi', 'rasplet'], ['lik oko kojega se zbiva radnja', 'glavni lik'], ['riječi koje oponašaju zvukove', 'onomatopeja'],
  ['davanje ljudskih osobina neživim stvarima', 'personifikacija'], ['jednak glas na kraju stihova', 'rima'], ['razgovor dvaju likova', 'dijalog']];
const SREDSTVA = [['Vjetar pjeva u krošnjama.', 'personifikacija'], ['Cvrči, cvrči cvrčak.', 'onomatopeja'], ['Oči su joj plave kao more.', 'usporedba'],
  ['Sunce se smiješi djeci.', 'personifikacija'], ['Tik-tak, kuca sat.', 'onomatopeja'], ['Snijeg je bijel poput šećera.', 'usporedba'], ['Rijeka priča priče.', 'personifikacija'],
  ['Bum! Zagrmi nebo.', 'onomatopeja'], ['Snažan je kao medvjed.', 'usporedba'], ['Kiša tuče po prozoru: kap-kap.', 'onomatopeja'], ['Mjesec nas gleda s neba.', 'personifikacija'], ['Lagan je poput pera.', 'usporedba']];
function knjizevnost4Dodatak() {
  const q = [];
  q.push(...obaSmjera(DJELA, { pitajB: (a) => `Tko je autor djela ${a}?`, pitajA: (b) => `Koje od ovih djela potpisuje ${b}?`, tezina: 2 }));
  q.push(...obaSmjera(POJMOVI_4, { pitajB: (a) => `Koji književni pojam odgovara opisu: ${a}?`, pitajA: (b) => `Što je ${b}?`, tezina: 2 }));
  q.push(...uObitelj(obiteljTablice(SREDSTVA), SREDSTVA.map(([stih, s]) => izbor(`Koje je pjesničko sredstvo u stihu: ${stih.replace(/\.$/, '')}?`, s, ['personifikacija', 'onomatopeja', 'usporedba'].filter((x) => x !== s), 3))));
  q.push(poredaj('Poredaj dijelove fabule redom kojim dolaze u priči.', ['uvod', 'zaplet', 'vrhunac', 'rasplet', 'završetak'], 3));
  q.push(...daNe([['Je li roman dulji od pripovijetke?', true], ['Ima li basna obično pouku?', true], ['Pišu li se lirske pjesme u stihovima?', true],
    ['Je li pisac isto što i glavni lik?', false], ['Je li Ivana Brlić-Mažuranić napisala Šumu Striborovu?', true], ['Je li Veli Jože djelo Vladimira Nazora?', true]], 2));
  return q;
}

const GLAGOLI_4 = [['čitati', 'čitam', 'čitao sam', 'čitat ću'], ['pisati', 'pišem', 'pisao sam', 'pisat ću'], ['crtati', 'crtam', 'crtao sam', 'crtat ću'],
  ['pjevati', 'pjevam', 'pjevao sam', 'pjevat ću'], ['trčati', 'trčim', 'trčao sam', 'trčat ću'], ['plivati', 'plivam', 'plivao sam', 'plivat ću'], ['učiti', 'učim', 'učio sam', 'učit ću'],
  ['igrati', 'igram', 'igrao sam', 'igrat ću'], ['spavati', 'spavam', 'spavao sam', 'spavat ću'], ['jesti', 'jedem', 'jeo sam', 'jest ću'], ['piti', 'pijem', 'pio sam', 'pit ću'],
  ['voziti', 'vozim', 'vozio sam', 'vozit ću'], ['gledati', 'gledam', 'gledao sam', 'gledat ću'], ['slušati', 'slušam', 'slušao sam', 'slušat ću'], ['govoriti', 'govorim', 'govorio sam', 'govorit ću'],
  ['nositi', 'nosim', 'nosio sam', 'nosit ću']];
const ROD = [['stol', 'muški'], ['kuća', 'ženski'], ['more', 'srednji'], ['prozor', 'muški'], ['knjiga', 'ženski'], ['sunce', 'srednji'], ['vjetar', 'muški'], ['rijeka', 'ženski'],
  ['selo', 'srednji'], ['pas', 'muški'], ['olovka', 'ženski'], ['jezero', 'srednji'], ['grad', 'muški'], ['ptica', 'ženski'], ['dijete', 'srednji'], ['brod', 'muški'],
  ['noć', 'ženski'], ['polje', 'srednji'], ['kruh', 'muški'], ['stvar', 'ženski'], ['jaje', 'srednji']];
const POSVOJNI = [['Ana', 'Anin'], ['Marko', 'Markov'], ['Ivan', 'Ivanov'], ['Petra', 'Petrin'], ['Luka', 'Lukin'], ['Maja', 'Majin'], ['Josip', 'Josipov'], ['Iva', 'Ivin'],
  ['Mia', 'Mijin'], ['Nikola', 'Nikolin'], ['Filip', 'Filipov'], ['Ema', 'Emin'], ['Lovro', 'Lovrin'], ['Karlo', 'Karlov'], ['brat', 'bratov'], ['sestra', 'sestrin'],
  ['baka', 'bakin'], ['djed', 'djedov'], ['susjed', 'susjedov'], ['teta', 'tetin']];
const VLASTITE = [['Drava', 'vlastita'], ['rijeka', 'opća'], ['Zagreb', 'vlastita'], ['grad', 'opća'], ['Marija', 'vlastita'], ['djevojčica', 'opća'], ['Velebit', 'vlastita'],
  ['planina', 'opća'], ['Hrvatska', 'vlastita'], ['država', 'opća'], ['Bobi', 'vlastita'], ['pas', 'opća'], ['Krk', 'vlastita'], ['otok', 'opća']];
function vrsteRijeci4Dodatak() {
  const q = [];
  const VR = ['u sadašnjem', 'u prošlom', 'u budućem'];
  for (const [inf, sad, pro, bud] of uzmi(GLAGOLI_4, 10)) {
    const i = cijeli(0, 2), oblici = [sad, pro, bud];
    q.push(izbor(`Koji je oblik glagola ${inf} u ${['sadašnjem', 'prošlom', 'budućem'][i]} vremenu?`, oblici[i], oblici.filter((_, j) => j !== i).concat(inf), 2));
    const j = cijeli(0, 2);
    q.push(izbor(`U kojem je vremenu glagolski oblik ${oblici[j]}?`, VR[j], VR.filter((_, k) => k !== j), 2));
  }
  q.push(...obaSmjera(ROD, { pitajB: (a) => `Kojega je roda imenica ${a}?`, tezina: 2 }));
  q.push(...obaSmjera(POSVOJNI, { pitajB: (a) => `Kako glasi posvojni pridjev od riječi ${a}?`, tezina: 2 }));
  q.push(...uObitelj(obiteljTablice(VLASTITE), VLASTITE.map(([a, b]) => izbor(`Je li imenica ${a} vlastita ili opća?`, b, [b === 'opća' ? 'vlastita' : 'opća'], 2))));
  return q;
}

const MEDIJI_VRSTA = [['novine', 'tiskani'], ['časopis', 'tiskani'], ['knjiga', 'tiskani'], ['strip', 'tiskani'], ['plakat', 'tiskani'], ['radio', 'elektronički'],
  ['televizija', 'elektronički'], ['internetska stranica', 'elektronički'], ['film u kinu', 'elektronički'], ['videoigra', 'elektronički'], ['podcast', 'elektronički'], ['letak', 'tiskani']];
const MEDIJI_POJMOVI = [['osoba koja vodi snimanje filma i glumce', 'redatelj'], ['tekst po kojem se snima film', 'scenarij'], ['osoba koja snima kamerom', 'snimatelj'],
  ['osoba koja izrađuje odjeću za likove', 'kostimograf'], ['osoba koja uređuje izgled pozornice', 'scenograf'], ['osoba koja čita vijesti na televiziji', 'voditelj vijesti'],
  ['osoba koja piše članke za novine', 'novinar'], ['osoba koja radi u knjižnici i pomaže pri izboru knjiga', 'knjižničar'], ['film nacrtan ili oblikovan i pokrenut', 'animirani film'],
  ['film o stvarnim događajima i ljudima', 'dokumentarni film'], ['emisija u kojoj se doznaje kakvo će biti vrijeme', 'vremenska prognoza'], ['kratka obavijest koja nagovara na kupnju', 'reklama']];
const CINJENICA = [['Zagreb je glavni grad Hrvatske.', true], ['Najukusnija je pizza s gljivama.', false], ['Tjedan ima sedam dana.', true], ['Nogomet je najljepši sport.', false],
  ['Voda se smrzava na nula stupnjeva.', true], ['Zima je dosadno godišnje doba.', false], ['Jadransko more je slano.', true], ['Crvena je najljepša boja.', false],
  ['Sunce izlazi na istoku.', true], ['Matematika je najzabavniji predmet.', false], ['Pas ima četiri noge.', true], ['Taj je film predug.', false]];
function medijskaKulturaDodatak() {
  const q = [];
  q.push(...uObitelj(obiteljTablice(MEDIJI_VRSTA), MEDIJI_VRSTA.map(([a, b]) => izbor(`Je li ${a} tiskani ili elektronički medij?`, b, [b === 'tiskani' ? 'elektronički' : 'tiskani'], 2))));
  q.push(...obaSmjera(MEDIJI_POJMOVI, { pitajB: (a) => `Kako zovemo: ${a}?`, tezina: 2 }));
  q.push(...uObitelj(obiteljTablice(CINJENICA), CINJENICA.map(([r, c]) => izbor(`Iznosi li rečenica „${r}” činjenicu ili mišljenje?`, c ? 'činjenicu' : 'mišljenje', [c ? 'mišljenje' : 'činjenicu'], 2,
    c ? 'To se može provjeriti.' : 'To je nečije mišljenje; netko drugi može misliti drukčije.'))));
  q.push(...daNe([['Treba li provjeriti vijest u više izvora prije nego što je proslijediš?', true], ['Smiješ li u knjižnici glasno razgovarati?', false],
    ['Je li reklama napisana da bi nas nagovorila na kupnju?', true], ['Može li se fotografija na internetu promijeniti računalom?', true],
    ['Trebaš li vratiti knjigu u knjižnicu na vrijeme?', true], ['Je li svaka vijest na društvenim mrežama provjerena?', false]], 2));
  return q;
}

// ── tvrdnje Da/Ne iz tablica (sva uparivanja) ──
const glagoli2Tvrdnje = () => [
  ...sveTvrdnje(ZVUKOVI, (a, b) => `Kaže li se da ${a} ${b}?`, { lazni: 2, tezina: 1 }),
  ...sveTvrdnje(SUPROTNO_2, (a, b) => `Imaju li riječi ${a} i ${b} suprotno značenje?`, { lazni: 1 }),
];
const jezicnoTvrdnje = () => [
  ...sveTvrdnje(SLICNO, (a, b) => `Imaju li riječi ${a} i ${b} slično značenje?`, { lazni: 1 }),
  ...sveTvrdnje(SUPROTNO_3, (a, b) => `Imaju li riječi ${a} i ${b} suprotno značenje?`, { lazni: 1 }),
];
const knjizevniTvrdnje = () => [
  ...sveTvrdnje(VRSTE_3, (a, b) => `Je li ${b} ${a}?`, { lazni: 2 }),
  ...sveTvrdnje(POJMOVI_3, (a, b) => `Znači li pojam ${b} ovo: ${a}?`, { lazni: 2 }),
];
const knjizevnost4Tvrdnje = () => [
  ...sveTvrdnje(DJELA, (a, b) => `Je li ${a} djelo koje potpisuje ${b}?`, { lazni: 1 }),
  ...sveTvrdnje(POJMOVI_4, (a, b) => `Odgovara li pojam ${b} opisu: ${a}?`, { lazni: 2 }),
  ...sveTvrdnje(SREDSTVA, (a, b) => `Krije li se u stihu „${a}” ${b}?`, { lazni: 1 }),
];
const medijskaTvrdnje = () => sveTvrdnje(MEDIJI_POJMOVI, (a, b) => `Odgovara li pojam ${b} opisu: ${a}?`, { lazni: 2 });

module.exports = {
  genGlasovi: glasoviDodatak, genRijeci: rijeciDodatak, genSlova: slovaDodatak, genRecenice: receniceDodatak,
  genGlagoli2: () => [...glagoli2Dodatak(), ...glagoli2Tvrdnje()], genImeniceRod: imeniceRodDodatak, genRecenice2: recenice2Dodatak,
  genVrsteRijeci: vrsteRijeciDodatak, genGramatikaPravopis: gramatikaPravopisDodatak, genKnjizevniTekst: () => [...knjizevniTekstDodatak(), ...knjizevniTvrdnje()],
  genJezicnoIzrazavanje: () => [...jezicnoIzrazavanjeDodatak(), ...jezicnoTvrdnje()],
  genPravopis4: pravopis4Dodatak, genKnjizevnost4: () => [...knjizevnost4Dodatak(), ...knjizevnost4Tvrdnje()], genVrsteRijeci4: vrsteRijeci4Dodatak,
  genMedijskaKultura: () => [...medijskaKulturaDodatak(), ...medijskaTvrdnje()],
};
