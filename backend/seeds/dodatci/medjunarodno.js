/**
 * dodatci/medjunarodno.js — oblici zadataka iz međunarodne prakse, prilagođeni
 * hrvatskom kurikulu, jeziku i zavičaju (hrvatska imena, euro, metričke mjere,
 * hrvatska abeceda, domaće životinje i mjesta).
 *
 * Izvori oblika (vidi ISTRAZIVANJE-MEDJUNARODNI-ZADATCI.md):
 *   Singapur — rastav broja (number bond), model dijelova i cjeline, zadatci u dva koraka;
 *   Njemačka — zid brojeva (Zahlenmauer), kućica brojeva (Zahlenhaus), stroj za brojeve;
 *   Klokan bez granica — logika položaja, rast uzorka, zamišljeni broj, kombinacije;
 *   Dabar (Bebras) — binarni zapis, stablo odlučivanja, najkraći put, šifra s pomakom;
 *   TIMSS / Sachunterricht — pliva ili tone, magnet, materijali, pošten pokus, sjena;
 *   PIRLS / jezični kurikuli — abecedni red, slova i glasovi, umanjenice, srodne riječi.
 *
 * Svaki oblik ima svoju temu (`obitelj: 'tema:…'`), pa kviz ima najviše dva
 * zadatka istog oblika.
 */
const { izbor, tocnoNetocno, upisBroja, poredaj, uzmi, jedan, cijeli, promijesaj, oblik, fmt } = require('./pomocno');

const ponovi = (n, f) => Array.from({ length: n }, (_, i) => f(i)).flat().filter(Boolean);
const tema = (ime, qs) => qs.filter(Boolean).map((q) => ({ ...q, obitelj: `tema:${ime}` }));
const IMENA = ['Ana', 'Luka', 'Mia', 'Ivan', 'Lea', 'Marko', 'Nika', 'Toma', 'Sara', 'Filip', 'Ema', 'Jakov', 'Lucija', 'Petar', 'Dora', 'Fran'];
const zensko = (ime) => /a$/.test(ime) && !['Luka', 'Toma'].includes(ime);

// ═══ MATEMATIKA ═══

/** Rastav broja (kućica brojeva): krov i dva stana. */
function rastavBroja(do_) {
  return tema('rastav-broja', ponovi(6, () => {
    const n = cijeli(5, do_), a = cijeli(1, n - 1);
    return jedan([
      upisBroja(`Broj ${n} rastavi na dva dijela: ${a} i ___. Koji broj nedostaje?`, n - a, 1, `${a} + ${n - a} = ${n}`),
      upisBroja(`U kućici brojeva na krovu je ${n}, a u jednom stanu ${a}. Koji broj ide u drugi stan?`, n - a, 2, `Dva stana zajedno daju krov: ${n} − ${a} = ${n - a}`),
    ]);
  }));
}

/** Vaga u ravnoteži: obje strane moraju imati jednako. */
function vaga(do_) {
  return tema('vaga', ponovi(5, () => {
    const a = cijeli(1, Math.floor(do_ / 2)), b = cijeli(1, Math.floor(do_ / 2)), c = cijeli(1, a + b - 1);
    return upisBroja(`Na lijevoj strani vage su ${a} i ${b} ${oblik(b, ['kocka', 'kocke', 'kocaka'])}, a na desnoj ${c}. Koliko kocaka treba dodati na desnu stranu da vaga bude u ravnoteži?`,
      a + b - c, 2, `Lijevo je ${a} + ${b} = ${a + b}; desno nedostaje ${a + b} − ${c} = ${a + b - c}.`);
  }));
}

/** Stroj za brojeve: pravilo, ulaz, izlaz (i obrnuto). */
function stroj(operacije, do_) {
  return tema('stroj-za-brojeve', ponovi(6, () => {
    const [opis, f, inv, znak] = jedan(operacije);
    const ulaz = cijeli(1, do_), izlaz = f(ulaz);
    if (izlaz < 0 || !Number.isInteger(izlaz) || izlaz > do_ * 10) return null;
    return jedan([
      upisBroja(`Stroj za brojeve ${opis}. U stroj ubacimo ${ulaz}. Koji broj izlazi?`, izlaz, 2, `${ulaz} ${znak} = ${izlaz}`),
      upisBroja(`Stroj za brojeve ${opis}. Iz stroja je izašao broj ${izlaz}. Koji smo broj ubacili?`, ulaz, 3, `Radimo obrnuto: ${inv(izlaz)} = ${ulaz}`),
    ]);
  }));
}
const STROJ_ZBR = [['svakom broju doda 3', (x) => x + 3, (y) => `${y} − 3`, '+ 3'], ['svakom broju doda 5', (x) => x + 5, (y) => `${y} − 5`, '+ 5'],
  ['od svakog broja oduzme 2', (x) => x - 2, (y) => `${y} + 2`, '− 2'], ['od svakog broja oduzme 4', (x) => x - 4, (y) => `${y} + 4`, '− 4']];
const STROJ_MNOZ = [['svaki broj pomnoži s 2', (x) => x * 2, (y) => `${y} : 2`, '× 2'], ['svaki broj pomnoži s 5', (x) => x * 5, (y) => `${y} : 5`, '× 5'],
  ['svaki broj pomnoži s 10', (x) => x * 10, (y) => `${y} : 10`, '× 10'], ['svaki broj pomnoži s 3', (x) => x * 3, (y) => `${y} : 3`, '× 3']];

/** Zid brojeva: svaka cigla je zbroj dviju ispod nje. */
function zidBrojeva(od, do_) {
  return tema('zid-brojeva', ponovi(6, () => {
    const [a, b, c] = [cijeli(od, do_), cijeli(od, do_), cijeli(od, do_)];
    const l = a + b, d = b + c, v = l + d;
    return jedan([
      upisBroja(`U zidu brojeva svaka je cigla zbroj dviju cigala ispod nje. Donji red je ${a}, ${b}, ${c}. Koji je broj na vrhu?`, v, 3, `${a} + ${b} = ${l}, ${b} + ${c} = ${d}, ${l} + ${d} = ${v}`),
      upisBroja(`U zidu brojeva svaka je cigla zbroj dviju cigala ispod nje. Na vrhu je ${v}, a u srednjem redu lijevo ${l}. Koji je broj u srednjem redu desno?`, d, 3, `${v} − ${l} = ${d}`),
      upisBroja(`U zidu brojeva svaka je cigla zbroj dviju cigala ispod nje. Donji red je ${a}, ___, ${c}, a srednji red ${l} i ${d}. Koji broj nedostaje u donjem redu?`, b, 3, `${l} − ${a} = ${b}`),
    ]);
  }));
}

/** Čarobni kvadrat: zbroj u svakom retku, stupcu i dijagonali jednak. */
function carobniKvadrat(pomak) {
  const BAZA = [[2, 7, 6], [9, 5, 1], [4, 3, 8]];
  const rotiraj = (m) => m[0].map((_, i) => m.map((r) => r[i]).reverse());
  return tema('carobni-kvadrat', ponovi(3, () => {
    let m = BAZA; for (let k = cijeli(0, 3); k > 0; k--) m = rotiraj(m);
    const p = jedan(pomak);
    m = m.map((r) => r.map((x) => x + p));
    const s = m[0].reduce((x, y) => x + y, 0);
    const i = cijeli(0, 2), j = cijeli(0, 2), skriven = m[i][j];
    const zapis = m.map((r, ri) => r.map((x, rj) => (ri === i && rj === j ? '___' : x)).join(' ')).join(' | ');
    return upisBroja(`U čarobnom kvadratu zbroj svakog retka, stupca i dijagonale je ${s}. Redovi su: ${zapis}. Koji broj nedostaje?`, skriven, 3,
      `U tom retku ostala dva broja daju ${s - skriven}, pa nedostaje ${s} − ${s - skriven} = ${skriven}.`);
  }));
}

/** Zadatci u dva koraka (model dijelova i cjeline, usporedba). */
function dvaKoraka(do_) {
  // [akuzativ jednine, uz 2–4, uz 5 i više]
  const STVARI = [['sličicu', 'sličice', 'sličica'], ['olovku', 'olovke', 'olovaka'], ['jabuku', 'jabuke', 'jabuka'], ['kesten', 'kestena', 'kestena'], ['školjku', 'školjke', 'školjaka']];
  return tema('dva-koraka', ponovi(6, () => {
    const [x, y] = uzmi(IMENA, 2), s = jedan(STVARI), a = cijeli(5, Math.floor(do_ / 3)), v = cijeli(2, Math.floor(do_ / 4));
    const imaX = `${x} ima ${a} ${oblik(a, s)}`;
    return jedan([
      upisBroja(`${imaX}, a ${y} ${v} više. Koliko ih imaju zajedno?`, a + (a + v), 3, `${y}: ${a} + ${v} = ${a + v}; zajedno: ${a} + ${a + v} = ${2 * a + v}`),
      a > v ? upisBroja(`${imaX}, a ${y} ${v} manje. Koliko ih imaju zajedno?`, a + (a - v), 3, `${y}: ${a} − ${v} = ${a - v}; zajedno: ${a} + ${a - v} = ${2 * a - v}`) : null,
    ]);
  }));
}

/** Klokan: položaj u redu. */
function polozajURedu() {
  return tema('polozaj-u-redu', ponovi(4, () => {
    const n = cijeli(5, 12), k = cijeli(1, n), ime = jedan(IMENA);
    return upisBroja(`U redu stoji ${n} djece. ${ime} je ${k}. s lijeva. Koji je ${zensko(ime) ? 'ona' : 'on'} po redu s desna?`, n - k + 1, 3,
      `S lijeve strane je ${k - 1} djece prije, pa s desna: ${n} − ${k} + 1 = ${n - k + 1}.`);
  }));
}

/** Klokan: zamišljeni broj (rješavanje unatrag). */
function zamisljeniBroj(mnoz) {
  return tema('zamisljeni-broj', ponovi(4, () => {
    const x = cijeli(2, 12), m = jedan(mnoz), d = cijeli(1, 20), r = x * m + d;
    return upisBroja(`Zamislio sam broj, pomnožio ga s ${m} i dodao ${d}. Dobio sam ${r}. Koji sam broj zamislio?`, x, 3,
      `Unatrag: ${r} − ${d} = ${r - d}, ${r - d} : ${m} = ${x}.`);
  }));
}

/** Klokan: rast uzorka (štapići, kvadratići). */
function rastUzorka() {
  return tema('rast-uzorka', ponovi(4, () => {
    const p = cijeli(2, 6), k = cijeli(2, 4), n = cijeli(5, 10);
    return upisBroja(`Prvi lik složen je od ${p} ${oblik(p, ['štapića', 'štapića', 'štapića'])}, a svaki sljedeći ima ${k} štapića više. Koliko štapića ima ${n}. lik?`, p + (n - 1) * k, 3,
      `${p} + ${n - 1} × ${k} = ${p + (n - 1) * k}`);
  }));
}

/** Kalendar. */
const DANI = ['ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota', 'nedjelja'];
function kalendar() {
  return tema('kalendar', ponovi(5, () => {
    const d = cijeli(0, 6), dat = cijeli(1, 15), plus = jedan([7, 14, 3, 10]);
    return izbor(`Danas je ${DANI[d]}, ${dat}. svibnja. Koji je dan u tjednu ${dat + plus}. svibnja?`, DANI[(d + plus) % 7], DANI.filter((x) => x !== DANI[(d + plus) % 7]), 3,
      `Za ${plus} dana: ${plus % 7 === 0 ? 'isti dan u tjednu' : `${plus % 7} dana dalje u tjednu`}.`);
  }));
}

/** Kombinacije (odjeća, sendviči). */
function kombinacije() {
  return tema('kombinacije', ponovi(4, () => {
    const a = cijeli(2, 5), b = cijeli(2, 4);
    return jedan([
      upisBroja(`Iva ima ${a} ${oblik(a, ['majicu', 'majice', 'majica'])} i ${b} ${oblik(b, ['suknju', 'suknje', 'suknji'])}. Na koliko se različitih načina može odjenuti (jedna majica i jedna suknja)?`, a * b, 3, `${a} × ${b} = ${a * b}`),
      upisBroja(`U pekarnici biraš ${a} ${oblik(a, ['vrstu', 'vrste', 'vrsta'])} kruha i ${b} ${oblik(b, ['namaz', 'namaza', 'namaza'])}. Koliko različitih sendviča možeš složiti (jedan kruh i jedan namaz)?`, a * b, 3, `${a} × ${b} = ${a * b}`),
    ]);
  }));
}

/** Zbroj i razlika (model s dvije trake). */
function zbrojRazlika() {
  return tema('zbroj-razlika', ponovi(4, () => {
    const m = cijeli(5, 60), r = cijeli(2, 30), v = m + r;
    return upisBroja(`Zbroj dvaju brojeva je ${m + v}, a njihova razlika ${r}. Koji je veći broj?`, v, 3, `(${m + v} + ${r}) : 2 = ${v}`);
  }));
}

/** Logika redoslijeda (Klokan). */
function logikaRedoslijeda() {
  // [muški, ženski] komparativ i superlativ za pitanje „Tko je …?”
  const SVOJSTVA = [[['viši', 'viša'], 'najniži'], [['stariji', 'starija'], 'najmlađi'], [['brži', 'brža'], 'najsporiji']];
  return tema('logika-redoslijed', ponovi(4, () => {
    const [a, b, c] = uzmi(IMENA, 3), [komp, sup] = jedan(SVOJSTVA);
    const k = (ime) => komp[zensko(ime) ? 1 : 0];
    return izbor(`${a} je ${k(a)} nego ${b}, a ${b} je ${k(b)} nego ${c}. Tko je ${sup}?`, c, [a, b], 3, `${a} > ${b} > ${c}, pa je ${sup} ${c}.`);
  }));
}

/** Euro kovanice i novčanice. */
function kovanice() {
  return tema('kovanice', ponovi(5, () => {
    const k2 = cijeli(0, 3), k1 = cijeli(0, 3), n5 = cijeli(0, 2), n10 = cijeli(0, 2);
    const s = 2 * k2 + k1 + 5 * n5 + 10 * n10;
    if (s === 0) return null;
    const dijelovi = [[n10, 'novčanica od 10 €', 'novčanice od 10 €', 'novčanica od 10 €'], [n5, 'novčanica od 5 €', 'novčanice od 5 €', 'novčanica od 5 €'],
      [k2, 'kovanica od 2 €', 'kovanice od 2 €', 'kovanica od 2 €'], [k1, 'kovanica od 1 €', 'kovanice od 1 €', 'kovanica od 1 €']].filter(([n]) => n > 0);
    return upisBroja(`U kasici imaš: ${dijelovi.map(([n, ...f]) => `${n} ${oblik(n, f)}`).join(', ')}. Koliko je to eura?`, s, 2, `${dijelovi.map(([n, f]) => `${n} × ${f.match(/\d+/)[0]}`).join(' + ')} = ${s}`);
  }));
}

// ═══ HRVATSKI JEZIK ═══

const ABECEDA = ['a', 'b', 'c', 'č', 'ć', 'd', 'dž', 'đ', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'lj', 'm', 'n', 'nj', 'o', 'p', 'r', 's', 'š', 't', 'u', 'v', 'z', 'ž'];
/** Riječ kao niz slova hrvatske abecede (dž, lj, nj jedno su slovo). */
const slova = (w) => { const out = []; for (let i = 0; i < w.length; i++) { const d = w.slice(i, i + 2); if (['dž', 'lj', 'nj'].includes(d)) { out.push(d); i++; } else out.push(w[i]); } return out; };
const abecedno = (a, b) => { const x = slova(a), y = slova(b); for (let i = 0; i < Math.min(x.length, y.length); i++) { const d = ABECEDA.indexOf(x[i]) - ABECEDA.indexOf(y[i]); if (d) return d; } return x.length - y.length; };
const RIJECI_ABC = ['cesta', 'čaša', 'ćup', 'dom', 'džep', 'đak', 'lopta', 'ljeto', 'more', 'nebo', 'njiva', 'sova', 'šuma', 'zec', 'žaba', 'cvijet', 'čokolada', 'ćuk', 'lisica', 'ljiljan', 'noga', 'njuška', 'sunce', 'škola', 'zima', 'žir', 'dan', 'džem', 'đurđica', 'kuća', 'krava', 'kruh'];
function abecedniRed() {
  return tema('abecedni-red', ponovi(6, () => {
    const r = uzmi(RIJECI_ABC, 4);
    return poredaj(`Poredaj riječi abecednim redom: ${r.join(', ')}.`, [...r].sort(abecedno), 2,
      'U hrvatskoj abecedi c dolazi prije č i ć, d prije dž i đ, l prije lj, a n prije nj.');
  }));
}
const DVOSLOVI = ['ljubav', 'konj', 'džep', 'njuška', 'ljeto', 'pjesma', 'kralj', 'svinja', 'džem', 'ključ', 'zemlja', 'lonac', 'polje', 'sunce', 'snijeg', 'vodenjak'];
function slovaIGlasovi() {
  return tema('slova-i-glasovi', DVOSLOVI.map((w) => {
    const glasova = slova(w).length, slovaZnakova = w.length;
    return jedan([
      upisBroja(`Koliko glasova ima riječ ${w}?`, glasova, 2, `${slova(w).join(' – ')}: ${glasova} (dž, lj i nj su po jedan glas).`),
      upisBroja(`Koliko znakova pišemo kad napišemo riječ ${w}?`, slovaZnakova, 2, `${w.split('').join(' ')}: ${slovaZnakova} znakova.`),
    ]);
  }));
}
const UMANJENICE = [['kuća', 'kućica'], ['pas', 'psić'], ['mačka', 'mačkica'], ['stol', 'stolić'], ['knjiga', 'knjižica'], ['brod', 'brodić'], ['kamen', 'kamenčić'],
  ['ruka', 'ručica'], ['nos', 'nosić'], ['zub', 'zubić'], ['noga', 'nožica'], ['selo', 'selce'], ['drvo', 'drvce'], ['grad', 'gradić'], ['ptica', 'ptičica'], ['riba', 'ribica']];
const UVECANICE = [['kuća', 'kućerina'], ['pas', 'psina'], ['ruka', 'ručerda'], ['nos', 'nosina'], ['glava', 'glavurda']];
function umanjenice() {
  return tema('umanjenice', [
    ...UMANJENICE.map(([a, b]) => izbor(`Koja je riječ umanjenica od riječi ${a}?`, b, uzmi(UMANJENICE.filter(([x]) => x !== a).map(([, y]) => y), 3), 2, `${b} znači malen ${a}.`)),
    ...UVECANICE.map(([a, b]) => izbor(`Koja je riječ uvećanica od riječi ${a}?`, b, [...uzmi(UMANJENICE.map(([, y]) => y), 1), ...uzmi(UVECANICE.filter(([x]) => x !== a).map(([, y]) => y), 2)], 3, `${b} znači velik, ogroman ${a}.`)),
  ]);
}
const SRODNE = [['šuma', ['šumar', 'šumski', 'šumica'], ['vjetar', 'livada', 'cesta']], ['voda', ['vodeni', 'vodica', 'vodenjak'], ['vatra', 'kruh', 'stol']],
  ['škola', ['školski', 'školarac', 'školica'], ['knjiga', 'olovka', 'ploča']], ['riba', ['ribar', 'ribica', 'ribnjak'], ['more', 'brod', 'mreža']],
  ['cvijet', ['cvjetić', 'cvjećarnica', 'cvjetati'], ['vrt', 'trava', 'list']], ['snijeg', ['snježni', 'snjegović', 'snježan'], ['led', 'zima', 'mraz']],
  ['kruh', ['krušni', 'krušac'], ['pekar', 'brašno', 'kolač']]];
function srodneRijeci() {
  return tema('srodne-rijeci', SRODNE.map(([k, srodne, druge]) => {
    const skup = [k, ...uzmi(srodne, 2)], uljez = jedan(druge);
    return izbor(`Koja riječ nije srodna ostalima: ${promijesaj([...skup, uljez]).join(', ')}?`, uljez, skup, 2, `Srodne riječi imaju isti korijen (${k}); ${uljez} ga nema.`);
  }));
}
const ZAGONETKE = [['Zimi i ljeti jednake je boje.', 'bor', ['lipa', 'hrast', 'breza']], ['Ima zube, a ništa ne jede.', 'češalj', ['pas', 'vuk', 'jež']],
  ['Bez ruku i nogu vrata otvara.', 'vjetar', ['miš', 'ključ', 'mačka']], ['Bijelo polje, crno sjeme, tko ga sije, pametan je.', 'pisanje po papiru', ['oranje njive', 'snijeg na livadi', 'čokolada']],
  ['Ide i ide, a s mjesta se ne miče.', 'sat', ['puž', 'auto', 'rijeka']], ['Što je puno rupa, a ipak drži vodu?', 'spužva', ['sito', 'kanta', 'lonac']],
  ['Nosi kuću na leđima.', 'puž', ['konj', 'pas', 'vrabac']], ['Bodljikav je, a nije čičak.', 'jež', ['mačka', 'zec', 'srna']]];
const POSLOVICE = [['Tko rano rani, dvije sreće grabi.', 'tko ustaje rano, više stigne napraviti'], ['Bez muke nema nauke.', 'za učenje treba truda'],
  ['Tko drugome jamu kopa, sam u nju pada.', 'tko želi drugome zlo, sam strada'], ['Ne odgađaj za sutra ono što možeš učiniti danas.', 'posao ne treba odgađati'],
  ['Zrno po zrno – pogača, kamen po kamen – palača.', 'malim koracima dolazi se do velikog cilja'], ['U laži su kratke noge.', 'laž se brzo otkrije'],
  ['Bolje vrabac u ruci nego golub na grani.', 'bolje je sigurno malo nego nesigurno mnogo'], ['Gdje ima volje, ima i načina.', 'tko nešto jako želi, nađe način']];
function zagonetke() {
  return tema('zagonetke', ZAGONETKE.map(([z, t, k]) => izbor(`Riješi zagonetku: ${z.replace(/\?$/, '.')} Što je to?`, t, k, 1)));
}
function poslovice() {
  return tema('poslovice', POSLOVICE.map(([p, z]) => izbor(`Što znači poslovica „${p}”?`, z, uzmi(POSLOVICE.filter(([x]) => x !== p).map(([, y]) => y), 3), 3)));
}

// ═══ PRIRODA I DRUŠTVO ═══

const PLIVA = [['drvena žlica', true], ['kamenčić', false], ['jabuka', true], ['željezni čavao', false], ['plastična lopta', true], ['ključ', false],
  ['suhi list', true], ['kovanica', false], ['čep od pluta', true], ['staklena kuglica', false], ['spužva', true], ['spajalica', false]];
const MAGNET = [['željezni čavao', true], ['spajalica', true], ['čelična žlica', true], ['drvena olovka', false], ['staklena čaša', false], ['papir', false],
  ['gumica', false], ['plastični čep', false], ['vunena čarapa', false], ['željezna matica', true]];
const MATERIJALI = [['prozor', 'staklo'], ['školska klupa', 'drvo'], ['čavao', 'metal'], ['boca za vodu', 'plastika'], ['čarape', 'vuna'], ['bilježnica', 'papir'],
  ['lonac', 'metal'], ['gumica za brisanje', 'guma'], ['majica', 'pamuk'], ['vrata ormara', 'drvo']];
const SVOJSTVA = [['Koji je materijal proziran, pa kroz njega vidimo?', 'staklo', ['drvo', 'metal', 'karton']], ['Koji se materijal lako savija i rasteže?', 'guma', ['staklo', 'kamen', 'drvo']],
  ['Koji materijal upija vodu?', 'papirnati ručnik', ['plastična vrećica', 'staklena čaša', 'metalna žlica']], ['Od čega je najbolje napraviti kabanicu za kišu?', 'od nepromočive plastike', ['od papira', 'od vune', 'od kartona']],
  ['Zašto je drška lonca često od plastike ili drva?', 'jer slabo provode toplinu', ['jer su teški', 'jer su prozirni', 'jer su skupi']]];
const POKUSI = [
  ['Učenici žele provjeriti otapa li se šećer brže u toploj nego u hladnoj vodi. Što mora biti JEDNAKO u obje čaše?', 'količina vode i šećera', ['temperatura vode', 'boja čaše i stola', 'ništa']],
  ['Učenici žele provjeriti suši li se rublje brže na suncu nego u sjeni. Što moraju mijenjati?', 'samo mjesto sušenja (sunce ili sjena)', ['vrstu i mokrinu rublja', 'sve odjednom', 'ništa']],
  ['Zašto u pokusu mijenjamo samo jednu stvar?', 'da znamo što je uzrokovalo razliku', ['da pokus bude kraći', 'da potrošimo manje vode', 'nije važno']],
  ['Što je prvi korak istraživanja?', 'postaviti pitanje i pretpostavku', ['zapisati zaključak', 'pospremiti pribor', 'nacrtati grafikon']],
  ['Učenici su izmjerili temperaturu zraka svaki dan u podne. Kako će najpreglednije prikazati rezultate?', 'tablicom ili grafikonom', ['pjesmom', 'jednom riječju', 'nikako']],
];
const SJENA = [['Kada je sjena najkraća tijekom sunčanog dana?', 'u podne', ['ujutro', 'navečer', 'noću']], ['Što je potrebno da nastane sjena?', 'izvor svjetlosti i predmet koji zaklanja svjetlost', ['samo voda', 'samo vjetar', 'mrak bez svjetla']],
  ['Ako je Sunce na istoku, na koju stranu pada sjena?', 'na zapad', ['na istok', 'prema Suncu', 'nema sjene']], ['Kakva je sjena ujutro i navečer?', 'dugačka', ['najkraća', 'nevidljiva', 'plava']]];
function plivaTone() {
  return tema('pliva-tone', PLIVA.map(([p, pl]) => izbor(`Što će se dogoditi kad u posudu s vodom stavimo: ${p}?`, pl ? 'plutat će' : 'potonut će', [pl ? 'potonut će' : 'plutat će'], 1)));
}
function magnet() {
  return tema('magnet', MAGNET.map(([p, m]) => tocnoNetocno(`Hoće li magnet privući ovaj predmet: ${p}?`, m, 2, m ? 'Magnet privlači predmete od željeza i čelika.' : 'Magnet ne privlači drvo, staklo, papir, gumu ni plastiku.')));
}
function materijali() {
  return tema('materijali', [...MATERIJALI.map(([p, m]) => izbor(`Od kojeg je materijala najčešće ${p}?`, m, uzmi([...new Set(MATERIJALI.map(([, x]) => x))].filter((x) => x !== m), 3), 1)),
    ...SVOJSTVA.map(([p, t, k]) => izbor(p, t, k, 2))]);
}
const pokusi = () => tema('pokus', POKUSI.map(([p, t, k]) => izbor(p, t, k, 3)));
const sjena = () => tema('sjena', SJENA.map(([p, t, k]) => izbor(p, t, k, 2)));

// ═══ INFORMATIKA (Dabar) ═══

function binarno() {
  return tema('binarni-zapis', ponovi(5, () => {
    const n = cijeli(3, 5), niz = Array.from({ length: n }, () => cijeli(0, 1));
    const opis = niz.map((b) => (b ? 'upaljena' : 'ugašena')).join(', ');
    const tocno = niz.join('');
    const krivi = [niz.map((b) => 1 - b).join(''), [...niz].reverse().join(''), niz.map((b, i) => (i === 0 ? 1 - b : b)).join('')].filter((x) => x !== tocno);
    return izbor(`Upaljena žarulja zapisuje se kao 1, a ugašena kao 0. Žarulje su redom: ${opis}. Koji je zapis?`, tocno, krivi, 2, `Svaka upaljena je 1, svaka ugašena 0: ${tocno}.`);
  }));
}
const STABLO = [['ima perje', 'ptica'], ['ima šest nogu', 'kukac'], ['diše škrgama', 'riba'], ['ima dlaku i mladunce hrani mlijekom', 'sisavac']];
function stabloOdluke() {
  return tema('stablo-odluke', STABLO.map(([s, t]) => izbor(`Razvrstavamo životinje pitanjima: „Ima li perje?” – ptica; „Ima li šest nogu?” – kukac; „Diše li škrgama?” – riba; inače sisavac. Kamo ide životinja koja ${s}?`, t, STABLO.map(([, x]) => x).filter((x) => x !== t), 2)));
}
function najkraciPut() {
  return tema('najkraci-put', ponovi(4, () => {
    const [a, b, c, d] = [cijeli(1, 6), cijeli(1, 6), cijeli(1, 6), cijeli(1, 6)];
    if (a + b === c + d) return null;
    const kraci = a + b < c + d ? 'preko pekarnice' : 'preko parka';
    return izbor(`Od kuće do pekarnice ima ${a} min, od pekarnice do škole ${b} min. Od kuće do parka ima ${c} min, a od parka do škole ${d} min. Kojim je putem kraće do škole?`, kraci,
      [kraci === 'preko pekarnice' ? 'preko parka' : 'preko pekarnice', 'jednako je dugo'], 2, `Preko pekarnice: ${a} + ${b} = ${a + b} min; preko parka: ${c} + ${d} = ${c + d} min.`);
  }));
}
const RIJECI_SIFRA = ['mama', 'tata', 'sok', 'nos', 'sir', 'more', 'kapa', 'riba', 'voda', 'zec', 'lopta', 'sova'];
function sifraPomak() {
  return tema('sifra-pomak', ponovi(4, () => {
    const w = jedan(RIJECI_SIFRA), p = jedan([1, 2]);
    const pomakni = (x) => slova(x).map((s) => ABECEDA[(ABECEDA.indexOf(s) + p) % ABECEDA.length]).join('').toUpperCase();
    const tocno = pomakni(w);
    const krivi = [slova(w).map((s) => ABECEDA[(ABECEDA.indexOf(s) + p + 1) % ABECEDA.length]).join('').toUpperCase(), w.toUpperCase(), [...tocno].reverse().join('')].filter((x) => x !== tocno);
    return izbor(`U šifri svako slovo zamijenimo slovom koje je ${p === 1 ? 'sljedeće' : 'dva mjesta dalje'} u hrvatskoj abecedi. Kako se šifrira riječ ${w.toUpperCase()}?`, tocno, krivi, 3,
      `${slova(w).map((s) => `${s.toUpperCase()}→${ABECEDA[(ABECEDA.indexOf(s) + p) % ABECEDA.length].toUpperCase()}`).join(', ')}`);
  }));
}

module.exports = {
  // matematika
  genZbrajanje: () => [...rastavBroja(20), ...vaga(20)],
  genOduzimanje: () => [...stroj(STROJ_ZBR, 15), ...rastavBroja(20)],
  genNizovi: () => polozajURedu(),
  genZbrajanje100: () => [...zidBrojeva(5, 30), ...vaga(80)],
  genOduzimanje100: () => [...dvaKoraka(100), ...stroj(STROJ_ZBR, 90)],
  genMnozenjeDijeljenje: () => stroj(STROJ_MNOZ, 10),
  genMjerenjeNovac: () => kovanice(),
  genBrojevi100: () => carobniKvadrat([0, 10, 20]),
  genZbrOduz1000: () => [...zidBrojeva(50, 300), ...dvaKoraka(900)],
  genMnozDijel3: () => [...zamisljeniBroj([2, 3, 4, 5]), ...kombinacije()],
  genNepoznati3: () => vaga(200),
  genGeometrijaMjerenje3: () => [...kalendar(), ...rastUzorka()],
  genPisanoZbrOduz: () => zidBrojeva(1000, 9000),
  genPisanoMnozDijel: () => zamisljeniBroj([6, 7, 8, 9]),
  genNepoznati4: () => [...zbrojRazlika(), ...logikaRedoslijeda()],
  genPodatci4: () => kombinacije(),
  // hrvatski
  genSlova: () => slovaIGlasovi(), genGlasovi: () => slovaIGlasovi(), genRijeci: () => zagonetke(),
  genGlagoli2: () => abecedniRed(), genGramatikaPravopis: () => abecedniRed(),
  genVrsteRijeci: () => umanjenice(), genVrsteRijeci4: () => srodneRijeci(),
  genKnjizevniTekst: () => zagonetke(), genKnjizevnost4: () => poslovice(),
  // priroda i društvo
  genVodaTlo: () => plivaTone(), genTloVodaZrak: () => [...magnet(), ...materijali(), ...pokusi()],
  genUvjetiZivota: () => pokusi(), genDobaVrijeme: () => sjena(), genEkologija: () => materijali(),
  // informatika
  genAlgoritmi2: () => [...stabloOdluke(), ...najkraciPut()], genAlgoritmi3: () => [...binarno(), ...najkraciPut()], genAlgoritmi4: () => [...binarno(), ...sifraPomak()],
  _test: { abecedno, slova },
};
