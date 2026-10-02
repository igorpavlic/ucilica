/**
 * dodatci/dopuna.js — završna dopuna tema koje su nakon ostalih dodataka još
 * imale manje od ~150 različitih tekstova (algoritmi 1. r., kulturna baština,
 * ljudsko tijelo, zavičaj i karta, sigurnost, godišnja doba, životinje).
 */
const { izbor, tocnoNetocno, upisBroja, poredaj, obaSmjera, sveTvrdnje, izTablice, daNe, uzmi, jedan, cijeli, promijesaj, uObitelj, obiteljTablice } = require('./pomocno');

// ═══ Algoritmi i logika, 1. razred ═══
const RUTINE = [
  ['pereš ruke', ['Otvori slavinu.', 'Nasapunaj ruke.', 'Isperi sapun.', 'Obriši ruke ručnikom.']],
  ['oblačiš se za snijeg', ['Obuci čarape.', 'Obuci hlače.', 'Obuci jaknu.', 'Stavi rukavice.']],
  ['zalijevaš cvijet', ['Uzmi kantu.', 'Napuni kantu vodom.', 'Polij cvijet.', 'Vrati kantu na mjesto.']],
  ['pripremaš torbu za školu', ['Pogledaj raspored.', 'Uzmi potrebne knjige.', 'Stavi ih u torbu.', 'Zatvori torbu.']],
  ['ideš spavati', ['Operi zube.', 'Obuci pidžamu.', 'Legni u krevet.', 'Ugasi svjetlo.']],
  ['crtaš kućicu', ['Nacrtaj kvadrat.', 'Nacrtaj krov na vrhu.', 'Nacrtaj vrata.', 'Oboji kućicu.']],
  ['šalješ pismo', ['Napiši pismo.', 'Stavi ga u omotnicu.', 'Zalijepi marku.', 'Ubaci ga u poštanski sandučić.']],
  ['sadiš sjemenku', ['Napuni posudu zemljom.', 'Napravi rupicu.', 'Stavi sjemenku.', 'Zalij zemlju.']],
  ['pripremaš kakao', ['Ulij mlijeko u šalicu.', 'Dodaj kakao.', 'Promiješaj žličicom.', 'Popij kakao.']],
  ['prelaziš cestu', ['Stani na rubu pločnika.', 'Pogledaj lijevo i desno.', 'Pričekaj da nema vozila.', 'Prijeđi cestu.']],
  ['spremaš igračke', ['Skupi igračke s poda.', 'Razvrstaj ih po vrsti.', 'Stavi ih u kutije.', 'Vrati kutije na policu.']],
  ['kupuješ kruh', ['Uđi u pekarnicu.', 'Pozdravi.', 'Reci što želiš.', 'Plati i zahvali.']],
];
const STRELICE = [['→', 'desno'], ['←', 'lijevo'], ['↑', 'gore'], ['↓', 'dolje']];
const SKUPINE_U = [['voće', ['jabuka', 'kruška', 'šljiva', 'banana', 'trešnja', 'naranča']], ['životinje', ['pas', 'mačka', 'konj', 'zec', 'krava', 'ovca']],
  ['odjeća', ['kapa', 'majica', 'hlače', 'jakna', 'šal', 'čarape']], ['vozila', ['auto', 'autobus', 'vlak', 'bicikl', 'tramvaj', 'kamion']],
  ['školski pribor', ['olovka', 'gumica', 'ravnalo', 'bilježnica', 'bojica', 'šiljilo']], ['boje', ['crvena', 'plava', 'zelena', 'žuta', 'ljubičasta', 'narančasta']]];
const VELICINE = [['mrav', 1], ['miš', 2], ['mačka', 3], ['pas', 4], ['konj', 5], ['slon', 6]];
function algoritmi1Dodatak() {
  const q = [];
  for (const [naziv, koraci] of RUTINE) {
    q.push(poredaj(`Poredaj korake kad ${naziv}.`, koraci, 2));
    q.push(izbor(`Koji je prvi korak kad ${naziv}?`, koraci[0], koraci.slice(1), 1));
    const i = cijeli(0, koraci.length - 2);
    q.push(izbor(`Kad ${naziv}, koji korak dolazi nakon koraka „${koraci[i].replace(/\.$/, '')}”?`, koraci[i + 1], koraci.filter((_, j) => j !== i + 1), 2));
    q.push(izbor(`Koji je posljednji korak kad ${naziv}?`, koraci[koraci.length - 1], koraci.slice(0, -1), 1));
  }
  q.push(...obaSmjera(STRELICE, { pitajB: (a) => `Kamo robota pomiče naredba ${a}?`, pitajA: (b) => `Koja strelica pokazuje ${b}?`, tezina: 1 }));
  for (let k = 0; k < 6; k++) {
    const d = cijeli(2, 5), l = cijeli(1, d);
    q.push(upisBroja(`Robot napravi ${d} koraka desno, a zatim ${l} ${l === 1 ? 'korak' : 'koraka'} lijevo. Koliko je koraka desno od početka?`, d - l, 2,
      `${d} − ${l} = ${d - l}`));
  }
  for (let k = 0; k < 6; k++) {
    const [ime, popis] = jedan(SKUPINE_U), [, drugi] = jedan(SKUPINE_U.filter((x) => x[0] !== ime));
    const skup = uzmi(popis, 3), uljez = jedan(drugi);
    q.push(izbor(`Što ne pripada skupini: ${promijesaj([...skup, uljez]).join(', ')}?`, uljez, skup, 1, `Ostalo su ${ime}.`));
  }
  for (let k = 0; k < 4; k++) {
    const izabrani = uzmi(VELICINE, 3).sort((a, b) => a[1] - b[1]).map((x) => x[0]);
    q.push(poredaj(`Poredaj životinje od najmanje do najveće: ${promijesaj(izabrani).join(', ')}.`, izabrani, 2));
  }
  return q;
}

// ═══ Kulturna baština (3. r.) ═══
const BASTINA_2 = [['Krapinski pračovjek (nalazište)', 'materijalna'], ['katedrala u Šibeniku', 'materijalna'], ['Trogir, stari grad', 'materijalna'], ['Eufrazijeva bazilika', 'materijalna'],
  ['stari kameni most', 'materijalna'], ['djedov ručno izrađeni alat', 'materijalna'], ['ojkanje', 'nematerijalna'], ['nijemo kolo', 'nematerijalna'], ['paška čipka (umijeće izrade)', 'nematerijalna'],
  ['dvoglasno pjevanje Istre (tarankanje)', 'nematerijalna'], ['proljetna procesija ljelja', 'nematerijalna'], ['narodna priča koju prepričavamo', 'nematerijalna']];
const OBICAJI = [['Božić', 'kićenje bora i sijanje pšenice na svetu Luciju'], ['Uskrs', 'bojanje pisanica'], ['poklade (maškare)', 'maskiranje i tjeranje zime'],
  ['Martinje', 'blagoslov mladoga vina'], ['Sveti Nikola', 'djeca stavljaju čizmice na prozor'], ['berba grožđa', 'zajedničko branje grožđa i pjesma'], ['Ivanje', 'paljenje krijesova']];
const KB_2 = [
  ['Kako zovemo stari zanat izrade predmeta od gline?', 'lončarstvo', ['kovaštvo', 'stolarstvo', 'čipkarstvo']],
  ['Kako zovemo zanat izrade predmeta od željeza grijanjem i kovanjem?', 'kovaštvo', ['lončarstvo', 'pletarstvo', 'pekarstvo']],
  ['Kako se zove obrtnik koji izrađuje bačve?', 'bačvar', ['kovač', 'lončar', 'postolar']],
  ['Kako se zove obrtnik koji popravlja i izrađuje cipele?', 'postolar', ['krojač', 'stolar', 'bačvar']],
  ['Što je zavičajni muzej?', 'muzej koji čuva predmete iz prošlosti nekoga kraja', ['trgovina suvenira', 'školska knjižnica', 'zoološki vrt']],
  ['Tko nam najbolje može ispričati kako se nekad živjelo u našem kraju?', 'bake, djedovi i stariji mještani', ['mlađi brat', 'reklama na televiziji', 'nepoznati ljudi na internetu']],
  ['Što su pisanice?', 'ukrašena jaja koja se poklanjaju za Uskrs', ['božićni kolači', 'stare novine', 'vrsta narodne nošnje']],
  ['Koje je drevno hrvatsko pismo?', 'glagoljica', ['ćirilica', 'arapsko pismo', 'kinesko pismo']],
  ['Što su suveniri?', 'predmeti koji podsjećaju na neko mjesto', ['vrste kolača', 'stari zanati', 'narodni plesovi']],
  ['Zašto se održavaju smotre folklora?', 'da se sačuvaju narodni plesovi, pjesme i nošnje', ['da se prodaju automobili', 'da se natječe u matematici', 'da se gradi cesta']],
];
function kulturnaDodatak() {
  return [
    ...uObitelj(obiteljTablice(BASTINA_2), BASTINA_2.map(([b, v]) => izbor(`Je li ${b} materijalna ili nematerijalna baština?`, v, [v === 'materijalna' ? 'nematerijalna' : 'materijalna'], 2))),
    ...obaSmjera(OBICAJI, { pitajB: (a) => `Koji je običaj vezan uz blagdan ili događaj: ${a}?`, pitajA: (b) => `Uz koji je blagdan ili događaj vezan običaj: ${b}?`, tezina: 2 }),
    ...sveTvrdnje(OBICAJI, (a, b) => `Je li ${b} običaj koji se veže uz ${a}?`, { lazni: 1 }),
    ...izTablice(KB_2, 2),
  ];
}

// ═══ Ljudsko tijelo (4. r.) ═══
const LT_2 = [
  ['Koji dio oka propušta svjetlo i mijenja veličinu?', 'zjenica', ['trepavica', 'obrva', 'kapak']],
  ['Kako zovemo cijevi kroz koje krv teče tijelom?', 'krvne žile', ['živci', 'kosti', 'mišići']],
  ['Kojim plinom iz zraka dišemo?', 'kisikom', ['dušikom', 'ugljikovim dioksidom', 'helijem']],
  ['Koji plin izdišemo?', 'ugljikov dioksid', ['kisik', 'vodu', 'vodik']],
  ['Gdje počinje probava hrane?', 'u ustima', ['u plućima', 'u bubrezima', 'u srcu']],
  ['Što spaja kosti i omogućuje savijanje?', 'zglobovi', ['zubi', 'živci', 'krvne žile']],
  ['Zašto je važno sporo žvakati hranu?', 'lakše se probavlja', ['brže se zaspi', 'jača kosa', 'ne treba piti vodu']],
  ['Što nas štiti od mnogih bolesti?', 'cijepljenje i higijena', ['preskakanje doručka', 'spavanje uz televizor', 'jedenje slatkiša']],
  ['Kako se zove liječnik za zube?', 'stomatolog', ['pedijatar', 'veterinar', 'ljekarnik']],
  ['Kako se zove liječnik za djecu?', 'pedijatar', ['stomatolog', 'veterinar', 'kirurg za automobile']],
];
function ljudskoTijeloDodatak() {
  return [...izTablice(LT_2, 2), ...daNe([['Kuca li srce brže kad trčimo?', true], ['Ima li čovjek u tijelu samo jednu kost?', false],
    ['Šalje li mozak poruke tijelu preko živaca?', true], ['Jesu li mliječni zubi trajni?', false], ['Treba li nakon tjelovježbe piti vodu?', true]], 2)];
}

// ═══ Zavičaj i karta (3. r.) ═══
const STRANE_8 = [['sjever', 'jug'], ['istok', 'zapad'], ['sjeveroistok', 'jugozapad'], ['sjeverozapad', 'jugoistok']];
function zavicajKartaDodatak() {
  const q = [];
  q.push(...STRANE_8.flatMap(([a, b]) => [
    izbor(`Koja je strana svijeta suprotna strani: ${a}?`, b, uzmi(['sjever', 'jug', 'istok', 'zapad', 'sjeveroistok', 'jugozapad', 'sjeverozapad', 'jugoistok'].filter((x) => x !== a && x !== b), 3), 2),
    izbor(`Koja je strana svijeta suprotna strani: ${b}?`, a, uzmi(['sjever', 'jug', 'istok', 'zapad', 'sjeveroistok', 'jugozapad', 'sjeverozapad', 'jugoistok'].filter((x) => x !== a && x !== b), 3), 2),
  ]));
  const ZNAKOVI_KARTE = [['plava crta', 'rijeka'], ['crna crta s poprečnim crticama', 'željeznička pruga'], ['crvena ili žuta debela crta', 'cesta'], ['zeleno područje', 'nizina'],
    ['smeđe područje', 'planina ili gorje'], ['plavo područje', 'more ili jezero'], ['kružić', 'naselje']];
  q.push(...obaSmjera(ZNAKOVI_KARTE, { pitajB: (a) => `Što na zemljovidu najčešće označava ${a}?`, tezina: 2 }));
  q.push(...sveTvrdnje(ZNAKOVI_KARTE, (a, b) => `Označava li ${a} na zemljovidu ovo: ${b}?`, { lazni: 1 }));
  return q;
}

// ═══ Sigurnost (1. r.), godišnja doba (2. r.), životinje (1. r.) ═══
function sigurnostDodatak() {
  return daNe([['Treba li se igrati daleko od ceste?', true], ['Smiješ li sam u dubok bazen bez odrasle osobe?', false], ['Treba li kod kuće znati broj telefona roditelja?', true],
    ['Smiješ li dirati lijekove u ormariću?', false], ['Treba li na skijanju nositi kacigu?', true], ['Smiješ li baciti kamen na drugo dijete?', false],
    ['Treba li prije jela oprati ruke?', true], ['Smiješ li sam paliti štednjak?', false], ['Treba li se kloniti nepoznatih životinja?', true], ['Smiješ li se penjati na ogradu balkona?', false],
    ['Treba li se u lift ulaziti mirno?', true], ['Smiješ li se sakriti u ormar ako u kući izbije požar?', false], ['Treba li u šumi ostati blizu odraslih?', true],
    ['Smiješ li trčati s olovkom u ustima?', false], ['Treba li na ledu hodati polako i oprezno?', true]], 1);
}
const POJAVE = [['snijeg', 'zima'], ['duga nakon kiše', 'proljeće'], ['žetva pšenice', 'ljeto'], ['opadanje lišća', 'jesen'], ['cvjetanje trešanja', 'proljeće'],
  ['berba jabuka', 'jesen'], ['led na jezeru', 'zima'], ['kupanje u moru', 'ljeto'], ['dolazak lastavica', 'proljeće'], ['odlazak roda na jug', 'jesen']];
function dobaVrijemeDodatak() {
  return [...obaSmjera(POJAVE, { pitajB: (a) => `U kojem godišnjem dobu najčešće vidimo: ${a}?`, tezina: 1 }),
    ...sveTvrdnje(POJAVE, (a, b) => `Je li ${a} pojava koju najčešće vidimo ${({ zima: 'zimi', ljeto: 'ljeti', proljeće: 'u proljeće', jesen: 'u jesen' })[b]}?`, { lazni: 1, tezina: 1 })];
}
const STANISTA = [['riba', 'u vodi'], ['krtica', 'pod zemljom'], ['ptica', 'u gnijezdu'], ['pčela', 'u košnici'], ['krava', 'u staji'], ['pas', 'u kućici'], ['lisica', 'u jazbini'],
  ['medvjed', 'u brlogu'], ['konj', 'u štali'], ['kokoš', 'u kokošinjcu']];
function zivotinjeDodatak() {
  return [...obaSmjera(STANISTA, { pitajB: (a) => `Gdje najčešće živi ili spava ${a}?`, pitajA: (b) => `Koja životinja živi ili spava ${b}?`, tezina: 1 }),
    ...sveTvrdnje(STANISTA, (a, b) => `Živi li ili spava ${a} ${b}?`, { lazni: 1, tezina: 1 })];
}

module.exports = {
  genAlgoritmi1: algoritmi1Dodatak, genKulturnaBastina: kulturnaDodatak, genLjudskoTijelo: ljudskoTijeloDodatak, genZavicajKarta: zavicajKartaDodatak,
  genSigurnost: sigurnostDodatak, genDobaVrijeme: dobaVrijemeDodatak, genZivotinje: zivotinjeDodatak,
};
