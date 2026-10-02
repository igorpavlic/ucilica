/**
 * dodatci/priroda-a.js — Priroda i društvo, 1. i 2. razred: životinje, biljke,
 * tijelo, sigurnost i zdravlje, ekologija, obitelj i dom, vrijeme, voda i tlo,
 * zavičaj. Tablice činjenica daju pitanja u više smjerova.
 */
const { izbor, tocnoNetocno, upisBroja, poredaj, obaSmjera, tvrdnje, sveTvrdnje, spajanja, izTablice, daNe, uzmi, jedan, cijeli, promijesaj } = require('./pomocno');
const HR = require('../hr-gramatika');

// ── zajedničke tablice ──
// [životinja, domaća?, mladunče, broj nogu, pokrov]
const ZIVOTINJE = [
  ['krava', true, 'tele', 4, 'dlaka'], ['konj', true, 'ždrijebe', 4, 'dlaka'], ['ovca', true, 'janje', 4, 'vuna'], ['koza', true, 'jare', 4, 'dlaka'],
  ['svinja', true, 'prase', 4, 'dlaka'], ['kokoš', true, 'pile', 2, 'perje'], ['patka', true, 'pače', 2, 'perje'], ['mačka', true, 'mače', 4, 'dlaka'],
  ['pas', true, 'štene', 4, 'dlaka'], ['guska', true, 'guščić', 2, 'perje'], ['zec', false, 'zečić', 4, 'dlaka'], ['vuk', false, 'vučić', 4, 'dlaka'],
  ['medvjed', false, 'medvjedić', 4, 'dlaka'], ['lisica', false, 'lisičić', 4, 'dlaka'], ['srna', false, 'lane', 4, 'dlaka'], ['jež', false, 'ježić', 4, 'bodlje'],
  ['vjeverica', false, 'mlado vjeverice', 4, 'dlaka'], ['sova', false, 'mlado sove', 2, 'perje'], ['roda', false, 'mlado rode', 2, 'perje'], ['orao', false, 'mlado orla', 2, 'perje'],
];
const KORIST = [['krava', 'mlijeko'], ['kokoš', 'jaja'], ['ovca', 'vunu'], ['pčela', 'med'], ['pas', 'čuva kuću'], ['konj', 'vuče kola'], ['mačka', 'lovi miševe']];

// ═══ 1. razred ═══
function zivotinjeDodatak() {
  const q = [];
  const dom = ZIVOTINJE.filter((z) => z[1]).map((z) => z[0]), div = ZIVOTINJE.filter((z) => !z[1]).map((z) => z[0]);
  for (const [z, d] of uzmi(ZIVOTINJE, 10).map((x) => [x[0], x[1]])) q.push(tocnoNetocno(`Je li ${z} domaća životinja?`, d, 1, d ? `${z} živi uz čovjeka.` : `${z} živi u prirodi, divlja je.`));
  q.push(...obaSmjera(ZIVOTINJE.filter((z) => !/mlado/.test(z[2])).map((z) => [z[0], z[2]]), { pitajB: (a) => `Kako se zove mladunče životinje ${a}?`, pitajA: (b) => `Čije je mladunče ${b}?`, tezina: 1 }));
  for (const z of uzmi(ZIVOTINJE, 8)) q.push(upisBroja(`Koliko nogu ima ${z[0]}?`, z[3], 1));
  for (const z of uzmi(ZIVOTINJE.filter((x) => ['dlaka', 'perje'].includes(x[4])), 8)) q.push(izbor(`Što prekriva tijelo životinje: ${z[0]}?`, z[4], ['dlaka', 'perje', 'ljuske', 'oklop'].filter((x) => x !== z[4]), 1));
  q.push(...obaSmjera(KORIST, { pitajB: (a) => `Što nam daje ili kako nam pomaže ${a}?`, pitajA: (b) => `Koja nam životinja daje ili radi ovo: ${b}?`, tezina: 1 }));
  q.push(izbor('Koja je od ovih životinja domaća?', jedan(dom), uzmi(div, 3), 1), izbor('Koja je od ovih životinja divlja?', jedan(div), uzmi(dom, 3), 1));
  q.push(...daNe([['Ima li riba škrge?', true], ['Može li kokoš letjeti visoko kao orao?', false], ['Spava li jež zimi?', true], ['Ima li pauk šest nogu?', false],
    ['Daje li ovca vunu?', true], ['Živi li riba na drvetu?', false], ['Ima li ptica kljun?', true], ['Ima li zmija noge?', false]], 1));
  return q;
}

const DIJELOVI = [['oči', 'gledamo'], ['uši', 'slušamo'], ['nos', 'mirišemo'], ['jezik', 'osjećamo okus'], ['zubi', 'žvačemo hranu'], ['noge', 'hodamo i trčimo'],
  ['ruke', 'hvatamo i držimo predmete'], ['pluća', 'dišemo'], ['koža', 'osjećamo dodir, toplinu i hladnoću']];
const HIGIJENA = [
  ['Što trebaš učiniti prije jela?', 'oprati ruke', ['počešljati se', 'obući jaknu', 'upaliti televizor']],
  ['Što trebaš učiniti nakon korištenja zahoda?', 'oprati ruke sapunom', ['pojesti užinu', 'otići spavati', 'obrisati ruke o hlače']],
  ['Kada trebamo prati zube?', 'ujutro i navečer, nakon jela', ['jednom tjedno', 'samo kad idemo zubaru', 'nikad']],
  ['Čime peremo ruke da budu čiste?', 'sapunom i vodom', ['samo vodom iz čaše', 'sokom', 'mlijekom']],
  ['Zašto kašljemo u lakat ili maramicu?', 'da ne širimo klice na druge', ['da bude glasnije', 'da nas nitko ne čuje', 'da nam bude toplije']],
  ['Što je dobro učiniti kad se vratiš s igranja vani?', 'oprati ruke', ['odmah leći u krevet prljav', 'pojesti bez pranja ruku', 'obrisati ruke o zavjesu']],
  ['Zašto je važno dovoljno spavati?', 'da se tijelo odmori i bude zdravo', ['da manje jedemo', 'da ne idemo u školu', 'da bude tiho']],
  ['Što pijemo kad smo žedni?', 'vodu', ['gazirani sok', 'kavu', 'ništa']],
  ['Koja je od ovih namirnica voće?', 'jabuka', ['mrkva', 'kruh', 'sir']],
  ['Koje je od ovoga povrće?', 'mrkva', ['jabuka', 'banana', 'kruška']],
];
function tijeloDodatak() {
  const q = [];
  q.push(...obaSmjera(DIJELOVI, { pitajB: (a) => `Što radimo dijelom tijela koji se zove ${a}?`, pitajA: (b) => `Kojim dijelom tijela ${b}?`, tezina: 1 }));
  q.push(...izTablice(HIGIJENA, 1));
  q.push(...[['Koliko očiju ima čovjek?', 2], ['Koliko ušiju ima čovjek?', 2], ['Koliko prstiju ima jedna noga?', 5], ['Koliko nosova ima čovjek?', 1],
    ['Koliko ruku ima čovjek?', 2], ['Koliko prstiju imaju obje ruke zajedno?', 10]].map(([p, n]) => upisBroja(p, n, 1)));
  q.push(...daNe([['Vidimo li očima?', true], ['Čujemo li nosom?', false], ['Je li glava iznad ramena?', true], ['Jesu li koljena na rukama?', false],
    ['Je li lakat na ruci?', true], ['Treba li prati zube prije spavanja?', true], ['Je li dobro jesti samo slatkiše?', false], ['Žvačemo li hranu zubima?', true],
    ['Je li peta dio noge?', true], ['Je li obrva iznad oka?', true]], 1));
  return q;
}

const SITUACIJE = [
  ['Nepoznata osoba nudi ti slatkiše i poziva te u auto. Što ćeš učiniti?', 'reći ne, otići i reći odrasloj osobi od povjerenja', ['ući u auto', 'uzeti slatkiše i šutjeti', 'otići s njom']],
  ['Na podu pronađeš tablete. Što ćeš učiniti?', 'ne dirati ih i reći odrasloj osobi', ['pojesti jednu', 'dati ih prijatelju', 'staviti ih u džep']],
  ['U trgovini se izgubiš od roditelja. Što ćeš učiniti?', 'obratiti se prodavaču ili zaštitaru', ['izaći sam na ulicu', 'sakriti se', 'otići s nepoznatom osobom']],
  ['Što trebaš učiniti prije nego prijeđeš cestu?', 'stati i pogledati lijevo, desno pa opet lijevo', ['potrčati bez gledanja', 'zatvoriti oči', 'gledati u mobitel']],
  ['Gdje je najsigurnije prijeći cestu?', 'na pješačkom prijelazu', ['između parkiranih automobila', 'iza zavoja', 'bilo gdje']],
  ['Kakvu odjeću nosimo kad hodamo po mraku?', 'svijetlu odjeću ili prsluk s reflektirajućim trakama', ['tamnu odjeću', 'samo crnu jaknu', 'nije važno']],
  ['Što radiš ako u kući osjetiš miris dima?', 'odmah izaći i pozvati odraslu osobu', ['sakriti se pod krevet', 'nastaviti se igrati', 'otvoriti ormar']],
  ['Smiješ li sam paliti šibice?', 'ne, to smiju samo odrasli', ['da, uvijek', 'da, ako nitko ne vidi', 'samo u svojoj sobi']],
  ['Gdje se djeca igraju loptom?', 'na igralištu ili u dvorištu', ['na cesti', 'na parkiralištu', 'uz prugu']],
  ['Što nosimo kad vozimo bicikl ili romobil?', 'kacigu', ['šal preko očiju', 'papuče', 'slušalice']],
  ['Kako sjedimo u automobilu?', 'vezani pojasom u dječjoj sjedalici', ['stojeći', 'nevezani na krilu', 'okrenuti prema natrag bez pojasa']],
  ['Pas kojega ne poznaješ trči prema tebi. Što ćeš učiniti?', 'stati mirno i ne mahati rukama', ['vrištati i bježati', 'gurnuti ga', 'pokušati ga zagrliti']],
];
function sigurnostDodatak() {
  const q = [...izTablice(SITUACIJE, 1)];
  q.push(...obaSmjera([['112', 'hitne službe (jedinstveni broj)'], ['193', 'vatrogasci'], ['192', 'policija'], ['194', 'hitna medicinska pomoć']],
    { pitajB: (a) => `Koga zovemo na broj ${a}?`, pitajA: (b) => `Na koji broj zovemo: ${b}?`, tezina: 2 }));
  q.push(...daNe([['Smiješ li se igrati uz cestu?', false], ['Treba li na zeleno svjetlo ipak pogledati prije prelaska?', true], ['Smiješ li otvoriti vrata nepoznatoj osobi kad si sam kod kuće?', false],
    ['Treba li znati svoju adresu?', true], ['Smiješ li dirati utičnicu mokrim rukama?', false], ['Smiješ li se kupati u moru bez odrasle osobe?', false],
    ['Treba li reći roditeljima kamo ideš?', true], ['Jesu li lijekovi bomboni?', false], ['Treba li se pri izlasku iz autobusa pričekati da autobus ode prije prelaska ceste?', true]], 1));
  return q;
}

const OTPAD = [['novine', 'papir'], ['kartonska kutija', 'papir'], ['bilježnica', 'papir'], ['plastična boca', 'plastika'], ['jogurtna čašica', 'plastika'],
  ['limenka', 'metal'], ['staklena boca', 'staklo'], ['staklenka od pekmeza', 'staklo'], ['kora banane', 'biootpad'], ['ogrizak jabuke', 'biootpad'], ['ljuske jaja', 'biootpad'], ['stara baterija', 'posebni otpad']];
const BOJE_KANTI = [['papir', 'plava'], ['plastika i metal', 'žuta'], ['staklo', 'zelena'], ['biootpad', 'smeđa']];
const NAVIKE = [['Zatvaram slavinu dok perem zube.', true], ['Gasim svjetlo kad izlazim iz sobe.', true], ['Bacam smeće u rijeku.', false], ['Idem pješice ili biciklom kad mogu.', true],
  ['Ostavljam punjač u utičnici cijeli dan.', false], ['Pišem na objema stranama papira.', true], ['Lomim grane drveća u parku.', false], ['Nosim platnenu vrećicu u trgovinu.', true],
  ['Ostavljam smeće na izletu u šumi.', false], ['Hranu koju ne pojedem bacam svaki dan.', false]];
function ekologijaDodatak() {
  const q = [];
  q.push(...obaSmjera(OTPAD, { pitajB: (a) => `U koju vrstu otpada pripada: ${a}?`, tezina: 1 }));
  q.push(...obaSmjera(BOJE_KANTI, { pitajB: (a) => `Koje je boje spremnik za ${a}?`, pitajA: (b) => `Što odlažemo u ${b.replace(/a$/, 'i')} spremnik?`, tezina: 2 }));
  q.push(...NAVIKE.map(([r, d]) => tocnoNetocno(`Čuva li ova navika prirodu: ${r.replace(/\.$/, '')}?`, d, 1)));
  q.push(...daNe([['Može li se stari papir preraditi u novi?', true], ['Raspada li se plastična boca u prirodi brzo?', false], ['Daju li nam stabla kisik?', true],
    ['Smijemo li brati zaštićeno cvijeće?', false], ['Je li dobro posaditi drvo?', true], ['Može li se od kore voća napraviti kompost?', true]], 1));
  return q;
}

const PROSTORIJE = [['kuhinja', 'kuhamo i jedemo'], ['kupaonica', 'peremo se'], ['spavaća soba', 'spavamo'], ['dnevni boravak', 'odmaramo se i družimo'],
  ['ostava', 'čuvamo hranu i stvari'], ['hodnik', 'ulazimo i ostavljamo cipele']];
const PREDMETI_SOBA = [['štednjak', 'kuhinja'], ['hladnjak', 'kuhinja'], ['sudoper', 'kuhinja'], ['tuš', 'kupaonica'], ['umivaonik', 'kupaonica'], ['četkica za zube', 'kupaonica'],
  ['krevet', 'spavaća soba'], ['jastuk', 'spavaća soba'], ['kauč', 'dnevni boravak'], ['televizor', 'dnevni boravak'], ['vješalica za kapute', 'hodnik']];
const RODBINA = [['Tko je mamina mama?', 'baka', ['teta', 'sestra', 'kći']], ['Tko je tatin tata?', 'djed', ['stric', 'brat', 'ujak']], ['Tko je mamin brat?', 'ujak', ['stric', 'djed', 'tata']],
  ['Tko je tatin brat?', 'stric', ['ujak', 'djed', 'bratić']], ['Tko je mamina sestra?', 'teta', ['baka', 'sestrična', 'mama']], ['Kako zovemo sina tvoje tete?', 'bratić', ['brat', 'stric', 'djed']],
  ['Kako zovemo kćer tvojega strica?', 'sestrična', ['sestra', 'teta', 'baka']], ['Tko su tvoji roditelji?', 'mama i tata', ['baka i djed', 'brat i sestra', 'stric i teta']]];
const POSLOVI = [['Kako možeš pomoći kod kuće nakon ručka?', 'pospremiti stol', ['razbacati igračke', 'otići bez riječi', 'ostaviti tanjur na podu']],
  ['Što možeš učiniti kad se igraš u sobi pa završiš?', 'pospremiti igračke', ['ostaviti ih na podu', 'baciti ih kroz prozor', 'sakriti ih bratu']],
  ['Kako možeš pomoći u brizi o kućnom ljubimcu?', 'nahraniti ga i dati mu vode', ['zaboraviti na njega', 'zatvoriti ga u ormar', 'vući ga za rep']],
  ['Kako se ponašamo prema starijim članovima obitelji?', 's poštovanjem i pomažemo im', ['vičemo na njih', 'ne slušamo ih', 'rugamo im se']]];
function obiteljDodatak() {
  const q = [];
  q.push(...obaSmjera(PROSTORIJE, { pitajB: (a) => `Što najčešće radimo u prostoriji: ${a}?`, pitajA: (b) => `U kojoj prostoriji ${b}?`, tezina: 1 }));
  q.push(...obaSmjera(PREDMETI_SOBA, { pitajB: (a) => `U kojoj se prostoriji najčešće nalazi ${a}?`, tezina: 1 }));
  q.push(...izTablice(RODBINA, 2), ...izTablice(POSLOVI, 1));
  return q;
}

// ═══ 2. razred ═══
const DANI = ['ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota', 'nedjelja'];
const MJESECI = ['siječanj', 'veljača', 'ožujak', 'travanj', 'svibanj', 'lipanj', 'srpanj', 'kolovoz', 'rujan', 'listopad', 'studeni', 'prosinac'];
const MJESEC_DOBA = [['siječanj', 'zima'], ['veljača', 'zima'], ['travanj', 'proljeće'], ['svibanj', 'proljeće'], ['srpanj', 'ljeto'], ['kolovoz', 'ljeto'], ['listopad', 'jesen'], ['studeni', 'jesen']];
const G = (r) => HR.genitivVremena(r);
function dobaVrijemeDodatak() {
  const q = [];
  DANI.forEach((d, i) => {
    q.push(izbor(`Ako je danas ${d}, koji je dan sutra?`, DANI[(i + 1) % 7], DANI.filter((x) => x !== DANI[(i + 1) % 7]), 1));
    q.push(izbor(`Ako je danas ${d}, koji je dan bio jučer?`, DANI[(i + 6) % 7], DANI.filter((x) => x !== DANI[(i + 6) % 7]), 2));
    q.push(izbor(`Ako je danas ${d}, koji će dan biti prekosutra?`, DANI[(i + 2) % 7], DANI.filter((x) => x !== DANI[(i + 2) % 7]), 3));
  });
  MJESECI.forEach((m, i) => {
    q.push(izbor(`Koji mjesec dolazi poslije ${G(m)}?`, MJESECI[(i + 1) % 12], uzmi(MJESECI.filter((x) => x !== MJESECI[(i + 1) % 12]), 3), 2));
    q.push(izbor(`Koji mjesec dolazi prije ${G(m)}?`, MJESECI[(i + 11) % 12], uzmi(MJESECI.filter((x) => x !== MJESECI[(i + 11) % 12]), 3), 2));
  });
  q.push(...MJESEC_DOBA.map(([m, d]) => izbor(`U kojem je godišnjem dobu mjesec ${m}?`, d, ['proljeće', 'ljeto', 'jesen', 'zima'].filter((x) => x !== d), 2)));
  for (let h = 1; h <= 12; h++) q.push(upisBroja(`Velika kazaljka pokazuje 12, a mala ${h}. Koliko je sati?`, h, 2));
  q.push(poredaj('Poredaj godišnja doba počevši od proljeća.', ['proljeće', 'ljeto', 'jesen', 'zima'], 1));
  q.push(...[['Koliko mjeseci ima godina?', 12], ['Koliko dana ima tjedan?', 7], ['Koliko dana traje vikend?', 2], ['Koliko godišnjih doba ima godina?', 4], ['Koliko minuta ima jedan sat?', 60]].map(([p, n]) => upisBroja(p, n, 1)));
  return q;
}

const BILJKE = [['jabuka', 'voće'], ['kruška', 'voće'], ['šljiva', 'voće'], ['trešnja', 'voće'], ['jagoda', 'voće'], ['grožđe', 'voće'], ['mrkva', 'povrće'], ['krumpir', 'povrće'],
  ['luk', 'povrće'], ['kupus', 'povrće'], ['paprika', 'povrće'], ['grah', 'povrće'], ['pšenica', 'žitarica'], ['kukuruz', 'žitarica'], ['ječam', 'žitarica']];
const DRVECE = [['hrast', 'listopadno'], ['bukva', 'listopadno'], ['lipa', 'listopadno'], ['javor', 'listopadno'], ['breza', 'listopadno'], ['kesten', 'listopadno'],
  ['bor', 'zimzeleno'], ['jela', 'zimzeleno'], ['smreka', 'zimzeleno'], ['maslina', 'zimzeleno']];
const DIO_BILJKE = [['korijen', 'upija vodu iz tla i drži biljku u zemlji'], ['stabljika', 'nosi listove i provodi vodu'], ['list', 'pomoću sunčeve svjetlosti stvara hranu'],
  ['cvijet', 'iz njega nastaje plod'], ['plod', 'u njemu su sjemenke']];
function biljkeZivotinjeDodatak() {
  const q = [];
  q.push(...obaSmjera(BILJKE, { pitajB: (a) => `Je li ${a} voće, povrće ili žitarica?`, tezina: 1 }));
  q.push(...DRVECE.map(([d, v]) => izbor(`Je li ${d} listopadno ili zimzeleno drvo?`, v, [v === 'listopadno' ? 'zimzeleno' : 'listopadno'], 2,
    v === 'listopadno' ? 'U jesen mu lišće otpada.' : 'Ostaje zeleno i zimi.')));
  q.push(...obaSmjera(DIO_BILJKE, { pitajB: (a) => `Čemu služi ${a}?`, pitajA: (b) => `Koji dio biljke ${b}?`, tezina: 2 }));
  q.push(...obaSmjera(ZIVOTINJE.filter((z) => z[1] && !/mlado/.test(z[2])).map((z) => [z[0], z[2]]), { pitajA: (b) => `Koja je životinja majka mladunčeta koje se zove ${b}?`, tezina: 1 }));
  q.push(...obaSmjera(KORIST, { pitajB: (a) => `Koja je korist od životinje: ${a}?`, tezina: 1 }));
  q.push(...spajanja(DIO_BILJKE, 'Spoji dio biljke s njegovom ulogom:', { koliko: 4, komada: 2 }));
  q.push(...daNe([['Trebaju li biljke svjetlost?', true], ['Rastu li biljke bez vode?', false], ['Nastaje li plod iz cvijeta?', true], ['Ima li bor iglice?', true],
    ['Otpada li hrastu lišće u jesen?', true], ['Polaže li krava jaja?', false], ['Jesu li jagode povrće?', false]], 1));
  return q;
}

const STANJA = [['led', 'kruto'], ['snijeg', 'kruto'], ['tuča', 'kruto'], ['ledenica', 'kruto'], ['kiša', 'tekuće'], ['rosa', 'tekuće'], ['voda u rijeci', 'tekuće'],
  ['voda u čaši', 'tekuće'], ['para iz lonca', 'plinovito'], ['vodena para u zraku', 'plinovito']];
const VODE = [['rijeka', 'tekućica'], ['potok', 'tekućica'], ['jezero', 'stajaćica'], ['bara', 'stajaćica'], ['močvara', 'stajaćica'], ['ribnjak', 'stajaćica']];
const HR_VODE = [['Sava', 'rijeka'], ['Drava', 'rijeka'], ['Dunav', 'rijeka'], ['Kupa', 'rijeka'], ['Krka', 'rijeka'], ['Neretva', 'rijeka'], ['Cetina', 'rijeka'],
  ['Vransko jezero', 'jezero'], ['Plitvička jezera', 'jezera'], ['Jadransko more', 'more']];
const U_TLU = ['gujavica', 'krtica', 'mrav', 'puž golać', 'korijen biljke', 'gljiva'];
function vodaTloDodatak() {
  const q = [];
  q.push(...STANJA.map(([v, s]) => izbor(`U kojem je stanju voda u primjeru: ${v}?`, s, ['kruto', 'tekuće', 'plinovito'].filter((x) => x !== s), 2)));
  q.push(...VODE.map(([v, s]) => izbor(`Je li ${v} tekućica ili stajaćica?`, s, [s === 'tekućica' ? 'stajaćica' : 'tekućica'], 2, s === 'tekućica' ? 'Voda u njoj teče.' : 'Voda u njoj stoji.')));
  q.push(...obaSmjera(HR_VODE.filter(([, b]) => b !== 'jezera'), { pitajB: (a) => `Što je ${a}: rijeka, jezero ili more?`, tezina: 1 }));
  q.push(...[
    ['Što se događa s vodom kad je jako zagrijemo?', 'isparava', ['smrzava se', 'postaje kamen', 'nestaje zauvijek']],
    ['Što se događa s vodom kad se jako ohladi?', 'smrzava se u led', ['ključa', 'isparava', 'postaje slana']],
    ['Što nastaje kad se led zagrije?', 'tekuća voda', ['snijeg', 'kamen', 'zrak']],
    ['Koja je voda pitka?', 'čista voda iz slavine ili izvora', ['morska voda', 'voda iz bare', 'voda iz lokve']],
    ['Zašto u tlu žive gujavice?', 'u tlu nalaze hranu i rahle zemlju', ['jer ne vole sunce i vodu', 'jer ondje grade gnijezda', 'jer ondje ima mora']],
    ['Koje je tlo najbolje za biljke?', 'tamno, rahlo tlo bogato humusom', ['suhi pijesak', 'goli kamen', 'asfalt']],
    ['Kako čuvamo vodu od onečišćenja?', 'ne bacamo smeće i ulje u vodu', ['bacamo boce u rijeku', 'peremo auto uz potok', 'izlijevamo boju u sudoper']],
    ['Kako štedimo vodu?', 'zatvaramo slavinu dok peremo zube', ['ostavljamo slavinu otvorenu', 'kupamo se tri puta dnevno', 'zalijevamo cestu']],
  ].map(([p, t, k]) => izbor(p, t, k, 2)));
  q.push(...U_TLU.map((z) => tocnoNetocno(`Živi li ili raste li u tlu ${z}?`, true, 1)));
  q.push(...['šaran', 'roda', 'lastavica'].map((z) => tocnoNetocno(`Živi li ${z} u tlu?`, false, 1)));
  q.push(...daNe([['Je li morska voda slana?', true], ['Možemo li piti morsku vodu?', false], ['Je li rosa voda?', true], ['Teče li voda u jezeru kao u rijeci?', false],
    ['Je li humus važan za plodnost tla?', true], ['Može li voda biti kruta, tekuća i plinovita?', true]], 2));
  return q;
}

const ZDRAVLJE_2 = [
  ['Koliko je otprilike sati sna potrebno djetetu tvoje dobi?', 'oko 10 sati', ['2 sata', '4 sata', '20 sati']],
  ['Što je zdraviji izbor za užinu?', 'voće ili jogurt', ['čips', 'bomboni', 'gazirani sok']],
  ['Zašto je dobro svaki dan se kretati i igrati vani?', 'jača tijelo i čuva zdravlje', ['da više jedemo slatkiše', 'da manje spavamo', 'da se umorimo za igrice']],
  ['Što trebaš učiniti ako ti je mučno ili te nešto boli?', 'reći roditelju ili učitelju', ['šutjeti', 'sakriti se', 'uzeti bilo koji lijek']],
  ['Smije li dijete samo uzimati lijekove?', 'ne, samo uz odraslu osobu', ['da, kad god želi', 'da, ako su slatki', 'da, ako ih nađe u ormariću']],
  ['Kako se štitimo od jakog ljetnog sunca?', 'kapom, kremom za sunčanje i boravkom u hladu', ['tamnim kaputom', 'igrom na suncu u podne', 'bez vode cijeli dan']],
  ['Što obučemo kad je vani hladno i pada snijeg?', 'toplu jaknu, kapu, šal i rukavice', ['kupaći kostim', 'majicu kratkih rukava', 'sandale']],
  ['Kada trebamo piti više vode?', 'kad je vruće i kad se mnogo krećemo', ['samo navečer', 'nikad', 'samo kad smo bolesni']],
  ['Zašto peremo voće prije jela?', 'da uklonimo prljavštinu i klice', ['da bude slađe', 'da bude hladnije', 'da promijeni boju']],
  ['Što radimo kad kišemo?', 'pokrijemo usta i nos maramicom ili laktom', ['kišemo prema drugima', 'kišemo u dlan pa se rukujemo', 'ništa']],
  ['Što je dobro učiniti ako dugo sjediš za računalom?', 'ustati, protegnuti se i odmoriti oči', ['sjediti još dulje', 'približiti oči zaslonu', 'jesti grickalice']],
  ['Što trebaš učiniti ako te ugrize krpelj?', 'reći odrasloj osobi da ga pravilno ukloni', ['ostaviti ga', 'iščupati ga zubima', 'namazati ga pekmezom']],
];
function zdravljeSigurnost2Dodatak() {
  const q = [...izTablice(ZDRAVLJE_2, 2), ...izTablice(SITUACIJE, 2), ...sigurnostDodatak().filter((x) => x.type === 'true-false')];
  q.push(...obaSmjera([['112', 'hitne službe (jedinstveni broj)'], ['193', 'vatrogasci'], ['192', 'policija'], ['194', 'hitna medicinska pomoć']],
    { pitajB: (a) => `Tko se javlja na broj ${a}?`, pitajA: (b) => `Koji broj biramo kad trebamo: ${b}?`, tezina: 2 }));
  q.push(...izTablice(HIGIJENA.slice(0, 8), 2));
  q.push(...daNe([['Smije li se pješak igrati na kolniku?', false], ['Nosimo li kacigu i kad vozimo romobil?', true], ['Treba li se u automobilu vezati i na kratkoj vožnji?', true],
    ['Smijemo li dugo boraviti na jakom suncu bez kape i kreme za sunčanje?', false], ['Je li važno doručkovati prije škole?', true],
    ['Pomažu li voće i povrće tijelu da bude zdravo?', true], ['Smiješ li na igralištu gurati druge s tobogana?', false], ['Trebaš li se umiti nakon buđenja?', true],
    ['Smiješ li sam otvarati vrata stana nepoznatima?', false], ['Treba li reći odraslima ako te netko na internetu plaši?', true]], 2));
  return q;
}

const USTANOVE = [['škola', 'učimo', 'učitelj'], ['bolnica', 'liječimo se', 'liječnik'], ['ljekarna', 'kupujemo lijekove', 'ljekarnik'], ['pošta', 'šaljemo pisma i pakete', 'poštar'],
  ['knjižnica', 'posuđujemo knjige', 'knjižničar'], ['kazalište', 'gledamo predstave', 'glumac'], ['pekarnica', 'kupujemo kruh', 'pekar'], ['vrtić', 'mala djeca se igraju i uče', 'odgojiteljica'],
  ['vatrogasna postaja', 'polaze vatrogasci na intervenciju', 'vatrogasac'], ['tržnica', 'kupujemo voće i povrće', 'prodavač'], ['frizerski salon', 'šišamo se', 'frizer'],
  ['zubna ordinacija', 'popravljamo zube', 'stomatolog'], ['muzej', 'razgledavamo stare i vrijedne predmete', 'kustos'], ['autobusni kolodvor', 'čekamo autobus', 'vozač']];
const STRANE = [
  ['Na kojoj strani svijeta izlazi Sunce?', 'na istoku', ['na zapadu', 'na sjeveru', 'na jugu']],
  ['Na kojoj strani svijeta zalazi Sunce?', 'na zapadu', ['na istoku', 'na jugu', 'na sjeveru']],
  ['Na kojoj je strani svijeta Sunce u podne?', 'na jugu', ['na sjeveru', 'na istoku', 'na zapadu']],
  ['Koliko ima glavnih strana svijeta?', '4', ['2', '3', '8']],
  ['Čime najlakše odredimo strane svijeta?', 'kompasom', ['termometrom', 'satom s kukavicom', 'ravnalom']],
  ['Kako zovemo mjesto na kojem se dodiruju nebo i zemlja kad gledamo u daljinu?', 'obzor', ['sjever', 'karta', 'brežuljak']],
  ['Što je zavičaj?', 'kraj u kojem živimo i koji dobro poznajemo', ['samo naša soba', 'neka daleka država', 'svemir']],
  ['Čime se razlikuje selo od grada?', 'selo ima manje stanovnika i više polja', ['selo ima više nebodera', 'u selu nema kuća', 'selo je uvijek uz more']],
  ['Kako zovemo crtež mjesta gledano odozgo, umanjen?', 'plan', ['fotografija', 'slikovnica', 'kalendar']],
  ['Što je promet?', 'kretanje ljudi i prijevoz robe', ['samo vožnja bicikla', 'trgovina hranom', 'igranje na igralištu']],
];
const PROMET_VRSTE = [['automobil', 'cestovni'], ['autobus', 'cestovni'], ['kamion', 'cestovni'], ['vlak', 'željeznički'], ['tramvaj', 'gradski (tračnički)'],
  ['brod', 'pomorski'], ['trajekt', 'pomorski'], ['zrakoplov', 'zračni'], ['helikopter', 'zračni']];
function zavicajDodatak() {
  const q = [];
  q.push(...obaSmjera(USTANOVE.filter(([m]) => m !== 'vatrogasna postaja').map(([m, r]) => [m, r]), { pitajB: (a) => `Što radimo u ustanovi koja se zove ${a}?`, tezina: 1 }));
  q.push(...obaSmjera(USTANOVE.map(([m, , z]) => [z, m]), { pitajB: (a) => `Gdje radi ${a}?`, pitajA: (b) => `Tko radi u ustanovi: ${b}?`, tezina: 1 }));
  q.push(...izTablice(STRANE, 2));
  q.push(...obaSmjera(PROMET_VRSTE.filter(([, v]) => !v.startsWith('gradski')), { pitajB: (a) => `Kojoj vrsti prometa pripada ${a}?`, tezina: 2 }));
  q.push(...daNe([['Izlazi li Sunce na istoku?', true], ['Je li sjever suprotan jugu?', true], ['Je li istok suprotan sjeveru?', false], ['Prikazuje li plan mjesta ulice i zgrade?', true],
    ['Je li parkirani automobil dobar orijentir?', false], ['Može li crkveni toranj biti orijentir?', true]], 2));
  return q;
}

// ── tvrdnje Da/Ne iz tablica (sva uparivanja) ──
const INSTR = { oči: 'očima', uši: 'ušima', nos: 'nosom', jezik: 'jezikom', zubi: 'zubima', noge: 'nogama', ruke: 'rukama', pluća: 'plućima', koža: 'kožom' };
const U_PROSTORIJI = { kuhinja: 'u kuhinji', kupaonica: 'u kupaonici', 'spavaća soba': 'u spavaćoj sobi', 'dnevni boravak': 'u dnevnom boravku', ostava: 'u ostavi', hodnik: 'u hodniku' };
const SPREMNIK = { papir: 'papir', plastika: 'plastiku', metal: 'metal', staklo: 'staklo', biootpad: 'biootpad', 'posebni otpad': 'posebni otpad' };
const PROSTORIJA_TVRDNJA = { 'peremo se': 'se peremo', 'odmaramo se i družimo': 'se odmaramo i družimo' };
const tijeloTvrdnje = () => sveTvrdnje(DIJELOVI, (a, b) => `Je li točno da ${INSTR[a]} ${b}?`, { lazni: 2, tezina: 1 });
const obiteljTvrdnje = () => [
  ...sveTvrdnje(PROSTORIJE, (a, b) => `Je li točno da ${U_PROSTORIJI[a]} ${PROSTORIJA_TVRDNJA[b] || b}?`, { lazni: 2, tezina: 1 }),
  ...sveTvrdnje(PREDMETI_SOBA, (a, b) => `Nalazi li se ${a} najčešće ${U_PROSTORIJI[b]}?`, { lazni: 2, tezina: 1 }),
];
const ekologijaTvrdnje = () => sveTvrdnje(OTPAD, (a, b) => `Ide li ${a} u spremnik za ${SPREMNIK[b]}?`, { lazni: 2, tezina: 1 });
const biljkeTvrdnje = () => [
  ...sveTvrdnje(BILJKE, (a, b) => `Je li ${a} ${b}?`, { lazni: 1, tezina: 1 }),
  ...sveTvrdnje(DIO_BILJKE, (a, b) => `Je li točno da ${a} ${b}?`, { lazni: 2 }),
];
const vodaTvrdnje = () => [
  ...sveTvrdnje(HR_VODE.filter(([, b]) => b !== 'jezera'), (a, b) => `Je li ${a} ${b}?`, { lazni: 1, tezina: 1 }),
  ...sveTvrdnje(VODE, (a, b) => `Je li ${a} ${b}?`, { lazni: 1 }),
];
const zavicajTvrdnje = () => sveTvrdnje(USTANOVE.map(([m, , z]) => [z, m]), (a, b) => `Radi li ${a} u ustanovi koja se zove ${b}?`, { lazni: 2, tezina: 1 });

module.exports = {
  genZivotinje: zivotinjeDodatak, genTijelo: () => [...tijeloDodatak(), ...tijeloTvrdnje()], genSigurnost: sigurnostDodatak,
  genEkologija: () => [...ekologijaDodatak(), ...ekologijaTvrdnje()], genObitelj: () => [...obiteljDodatak(), ...obiteljTvrdnje()],
  genDobaVrijeme: dobaVrijemeDodatak, genBiljkeZivotinje: () => [...biljkeZivotinjeDodatak(), ...biljkeTvrdnje()], genVodaTlo: () => [...vodaTloDodatak(), ...vodaTvrdnje()],
  genZdravljeSigurnost2: zdravljeSigurnost2Dodatak, genZavicaj: () => [...zavicajDodatak(), ...zavicajTvrdnje()],
  // za R3/R4 (priroda-b.js)
  _tablice: { ZIVOTINJE, BILJKE, DRVECE, DIO_BILJKE, STANJA, VODE, HR_VODE, OTPAD, DIJELOVI },
};
