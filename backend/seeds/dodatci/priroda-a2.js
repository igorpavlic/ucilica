/**
 * dodatci/priroda-a2.js — drugi skup za Prirodu i društvo 1. i 2. razreda
 * (teme koje ni nakon priroda-a.js nisu imale ~150 različitih tekstova).
 */
const { izbor, tocnoNetocno, poredaj, obaSmjera, sveTvrdnje, izTablice, daNe, uzmi } = require('./pomocno');

// ── promet i sigurnost pješaka ──
const PROMET_PJESAK = [
  ['Što znači crveno svjetlo na semaforu za pješake?', 'stani i čekaj', ['kreni brzo', 'trči preko ceste', 'prijeđi polako']],
  ['Što znači zeleno svjetlo na semaforu za pješake?', 'smiješ prijeći, ali najprije pogledaj', ['moraš stati', 'trči bez gledanja', 'semafor ne radi']],
  ['Kako se zove dio ceste po kojemu hodaju pješaci?', 'pločnik', ['kolnik', 'raskrižje', 'pruga']],
  ['Kako se zove dio ceste po kojemu voze automobili?', 'kolnik', ['pločnik', 'pješački prijelaz', 'park']],
  ['Kako zovemo bijele crte na cesti preko kojih pješaci prelaze?', 'pješački prijelaz (zebra)', ['parkiralište', 'biciklistička staza', 'pločnik']],
  ['Kojom stranom ceste hodamo kad nema pločnika?', 'lijevom stranom, prema vozilima koja nam dolaze', ['sredinom ceste', 'desnom stranom leđima prema vozilima', 'bilo kojom']],
  ['Gdje čekamo autobus?', 'na autobusnom stajalištu, podalje od ruba ceste', ['na sredini ceste', 'na rubu kolnika', 'iza autobusa']],
  ['Kako izlazimo iz automobila?', 'na strani prema pločniku', ['na strani prema cesti', 'kroz prozor', 'dok auto vozi']],
  ['Što trebamo učiniti ako policajac na raskrižju pokazuje da stanemo?', 'stati, jer vrijedi njegov znak', ['nastaviti hodati', 'potrčati', 'gledati samo semafor']],
  ['Zašto ne prelazimo cestu između parkiranih automobila?', 'vozači nas ne vide, a ni mi njih', ['jer je ondje prljavo', 'jer je ondje predaleko', 'jer je ondje zabranjeno trčati']],
];
const PRVA_POMOC = [
  ['Ogrebeš koljeno. Što je najprije dobro učiniti?', 'isprati ranu čistom vodom i reći odraslom', ['staviti zemlju na ranu', 'ništa ne reći', 'trljati ranu prstima']],
  ['Prijatelju krvari iz nosa. Kako mu treba držati glavu?', 'lagano nagnutu prema naprijed', ['jako zabačenu unatrag', 'okrenutu prema dolje između koljena', 'naslonjenu na pod']],
  ['Ubola te pčela. Što trebaš učiniti?', 'reći odraslom i staviti hladan oblog', ['češati ubod', 'pojesti med', 'potrčati za pčelom']],
  ['Prijatelj je pao i ne može ustati. Što trebaš učiniti?', 'pozvati odraslu osobu', ['otići kući', 'smijati se', 'vući ga za ruke']],
  ['Što se nalazi u kutiji prve pomoći?', 'flasteri, zavoji i škarice', ['bomboni i igračke', 'boje i kistovi', 'kruh i sir']],
  ['Što učiniti kad se netko u blizini jako ozlijedi, a nema odraslih?', 'nazvati 112', ['čekati sutrašnji dan', 'snimiti ga mobitelom', 'otići']],
];
const NAMIRNICE = [['voće', 'svaki dan'], ['povrće', 'svaki dan'], ['voda', 'svaki dan'], ['kruh od cjelovitog zrna', 'svaki dan'], ['mlijeko i jogurt', 'svaki dan'],
  ['bomboni', 'rijetko'], ['čips', 'rijetko'], ['gazirani sok', 'rijetko'], ['torta', 'rijetko'], ['pomfrit', 'rijetko'], ['riba', 'nekoliko puta tjedno'], ['jaja', 'nekoliko puta tjedno']];
const SIGURNOST_DA_NE = [['Smiješ li prelaziti cestu na crveno svjetlo ako nema automobila?', false], ['Treba li na pješačkom prijelazu pogledati lijevo i desno?', true],
  ['Smiješ li se voziti biciklom bez kacige?', false], ['Je li pločnik za pješake?', true], ['Smiješ li trčati za loptom na cestu?', false],
  ['Treba li u autu sjediti u dječjoj sjedalici?', true], ['Smije li se igrati na željezničkoj pruzi?', false], ['Treba li noću nositi svijetlu odjeću ili svjetlosne trake?', true],
  ['Smiješ li dirati električne žice koje vise?', false], ['Treba li ranu isprati čistom vodom?', true], ['Smiješ li u šumi paliti vatru?', false],
  ['Je li dobro jesti voće i povrće svaki dan?', true], ['Smijemo li jesti gljive koje sami nađemo u šumi?', false], ['Treba li bazen koristiti samo uz odraslu osobu?', true],
  ['Smiješ li se kupati na mjestu gdje piše da je kupanje zabranjeno?', false]];
function zdravljeSigurnost2Dodatak() {
  const q = [...izTablice(PROMET_PJESAK, 2), ...izTablice(PRVA_POMOC, 2)];
  q.push(...NAMIRNICE.map(([n, k]) => izbor(`Kad je dobro jesti ili piti ovo: ${n}?`, k, ['svaki dan', 'nekoliko puta tjedno', 'rijetko'].filter((x) => x !== k), 2)));
  q.push(...SIGURNOST_DA_NE.map(([p, t]) => tocnoNetocno(p, t, 2)));
  return q;
}

// ── voda i tlo ──
const PADALINE = [['kiša', 'kapljice vode koje padaju iz oblaka'], ['snijeg', 'pahulje leda koje padaju zimi'], ['tuča', 'kuglice leda koje padaju za ljetnih oluja'],
  ['rosa', 'kapljice vode na travi ujutro'], ['inje', 'tanki sloj leda na granama u hladnu jutru'], ['magla', 'oblak pri tlu kroz koji se slabo vidi']];
const UPORABA_VODE = [['Za što ljudi koriste vodu u kući?', 'za piće, kuhanje i pranje', ['za grijanje u kaminu', 'za pisanje', 'za gradnju igračaka']],
  ['Za što poljoprivrednici koriste vodu?', 'za zalijevanje polja', ['za oranje', 'za sušenje sijena', 'za pečenje kruha']],
  ['Kako voda pomaže u dobivanju struje?', 'pokreće turbine u hidroelektrani', ['grije žarulje', 'čuva struju u bocama', 'ne pomaže']],
  ['Zašto su rijeke i mora važni za promet?', 'njima plove brodovi', ['njima voze vlakovi', 'po njima hodaju pješaci', 'njima lete zrakoplovi']]];
const U_VODI = [['riba', true], ['žaba', true], ['rak', true], ['školjka', true], ['alga', true], ['lopoč', true], ['krtica', false], ['vjeverica', false], ['krava', false], ['sova', false]];
const KRUZENJE = [
  ['Poredaj kako nastaje kiša.', ['Sunce grije vodu.', 'Voda isparava.', 'Para se skuplja u oblake.', 'Iz oblaka pada kiša.']],
  ['Poredaj što se događa s ledenom kockom na suncu.', ['Kocka je kruta.', 'Kocka se počinje topiti.', 'Nastaje lokva vode.', 'Voda ispari.']],
  ['Poredaj kako biljka dobiva vodu nakon kiše.', ['Pada kiša.', 'Voda se upija u tlo.', 'Korijen upija vodu.', 'Voda putuje do listova.']],
];
const VODA_TLO_DA_NE = [['Ispari li voda kad je jako zagrijemo?', true], ['Je li tuča od leda?', true], ['Je li rosa vrsta padaline koja pada iz oblaka?', false],
  ['Je li tlo važno za rast biljaka?', true], ['Žive li u tlu sitna bića koja ga rahle?', true], ['Može li se riba dugo zadržati izvan vode?', false],
  ['Je li jezero tekućica?', false], ['Teče li rijeka od izvora prema ušću?', true], ['Treba li čuvati izvore pitke vode?', true], ['Je li kompost dobar za tlo?', true]];
function vodaTloDodatak() {
  const q = [];
  q.push(...obaSmjera(PADALINE, { pitajB: (a) => `Što je ${a}?`, pitajA: (b) => `Kako zovemo: ${b}?`, tezina: 2 }));
  q.push(...izTablice(UPORABA_VODE, 2));
  q.push(...U_VODI.map(([z, d]) => tocnoNetocno(`Živi li ${z} u vodi?`, d, 1)));
  q.push(...KRUZENJE.map(([p, items]) => poredaj(p, items, 2)));
  q.push(...VODA_TLO_DA_NE.map(([p, t]) => tocnoNetocno(p, t, 2)));
  return q;
}

// ── zavičaj: zanimanja ──
const ZANIMANJA = [['pekar', 'peče kruh'], ['liječnik', 'liječi bolesne'], ['učiteljica', 'poučava učenike'], ['poštar', 'raznosi pisma'], ['vatrogasac', 'gasi požare'],
  ['policajac', 'brine o redu i sigurnosti'], ['zidar', 'gradi kuće'], ['frizerka', 'šiša i češlja kosu'], ['kuhar', 'priprema jela'], ['vozač autobusa', 'prevozi putnike'],
  ['poljoprivrednik', 'uzgaja biljke i životinje'], ['stolar', 'izrađuje namještaj od drva'], ['krojačica', 'šije odjeću'], ['veterinar', 'liječi životinje'], ['ribar', 'lovi ribu'],
  ['knjižničarka', 'posuđuje knjige'], ['prodavačica', 'prodaje robu u trgovini'], ['električar', 'popravlja električne instalacije'], ['pilot', 'upravlja zrakoplovom'], ['smetlar', 'odvozi otpad']];
const SELO_GRAD = [['neboderi i mnogo prometa', 'grad'], ['polja, livade i domaće životinje', 'selo'], ['mnogo trgovina, kina i kazališta', 'grad'], ['manje stanovnika i više prirode', 'selo'],
  ['tramvaji i gužve na cestama', 'grad'], ['farme i voćnjaci', 'selo'], ['bolnice i fakulteti', 'grad'], ['tišina i kuće s vrtovima', 'selo']];
const STRANE_DA_NE = [['Je li zapad suprotan istoku?', true], ['Zalazi li Sunce na sjeveru?', false], ['Pokazuje li igla kompasa prema sjeveru?', true],
  ['Je li lijeva ruka ona kojom većina ljudi piše?', false], ['Je li orijentir nešto što se lako uoči i ne pomiče se?', true], ['Je li plan mjesta crtež gledan odozgo?', true],
  ['Ima li selo obično više stanovnika od grada?', false], ['Je li poštar zanimanje?', true], ['Može li drvo kraj škole biti orijentir?', true], ['Je li kino ustanova u kojoj se liječimo?', false]];
function zavicajDodatak() {
  const q = [];
  q.push(...obaSmjera(ZANIMANJA, { pitajB: (a) => `Što radi ${a}?`, pitajA: (b) => `Tko ${b}?`, tezina: 1 }));
  q.push(...SELO_GRAD.map(([o, m]) => izbor(`Gdje su češći ${o}: u selu ili u gradu?`, `u ${m === 'grad' ? 'gradu' : 'selu'}`, [`u ${m === 'grad' ? 'selu' : 'gradu'}`], 1)));
  q.push(...STRANE_DA_NE.map(([p, t]) => tocnoNetocno(p, t, 1)));
  return q;
}

// ── biljke i životinje (2. razred) ──
const DOM_DIV = [['krava', 'domaća'], ['kokoš', 'domaća'], ['zec kunić', 'domaća'], ['magarac', 'domaća'], ['puran', 'domaća'], ['guska', 'domaća'], ['ovca', 'domaća'],
  ['lisica', 'divlja'], ['divlja svinja', 'divlja'], ['jelen', 'divlja'], ['vjeverica', 'divlja'], ['kuna', 'divlja'], ['jazavac', 'divlja'], ['divlja patka', 'divlja'], ['ris', 'divlja']];
const JESTIVI_DIO = [['mrkva', 'korijen'], ['rotkvica', 'korijen'], ['salata', 'list'], ['špinat', 'list'], ['kupus', 'list'], ['jabuka', 'plod'], ['rajčica', 'plod'], ['cvjetača', 'cvijet'], ['brokula', 'cvijet']];
const ZIMA = [['jež', 'spava zimskim snom'], ['medvjed', 'spava zimskim snom'], ['puh', 'spava zimskim snom'], ['šišmiš', 'spava zimskim snom'],
  ['roda', 'odlazi u toplije krajeve'], ['lastavica', 'odlazi u toplije krajeve'], ['vrabac', 'ostaje i traži hranu'], ['sjenica', 'ostaje i traži hranu'], ['srna', 'ostaje i traži hranu']];
function biljkeZivotinje2Dodatak() {
  const q = [];
  q.push(...DOM_DIV.map(([z, v]) => izbor(`Je li ${z} domaća ili divlja životinja?`, v, [v === 'domaća' ? 'divlja' : 'domaća'], 1)));
  q.push(...obaSmjera(JESTIVI_DIO, { pitajB: (a) => `Koji dio biljke jedemo kad jedemo: ${a}?`, tezina: 2 }));
  q.push(...obaSmjera(ZIMA, { pitajB: (a) => `Što radi ${a} zimi?`, tezina: 2 }));
  q.push(...daNe([['Spava li jež zimskim snom?', true], ['Odlazi li vrabac zimi u toplije krajeve?', false], ['Jedemo li list salate?', true], ['Jedemo li korijen jabuke?', false],
    ['Daje li kokoš jaja?', true], ['Je li jelen domaća životinja?', false], ['Treba li biljka zrak?', true], ['Rastu li biljke iz sjemenki?', true]], 1));
  return q;
}

// ── ekologija (1. razred) ──
const OTPAD_2 = [['prazna kutija od mlijeka', 'plastika i metal'], ['stari časopis', 'papir'], ['razbijena staklena čaša', 'staklo'], ['ljuska od oraha', 'biootpad'],
  ['vrećica od čipsa', 'plastika i metal'], ['kutija od cipela', 'papir'], ['limenka soka', 'plastika i metal'], ['ostatci salate', 'biootpad'], ['staklenka od krastavaca', 'staklo'], ['letak iz trgovine', 'papir']];
const STEDNJA = [['Kako štedimo struju?', 'gasimo svjetlo kad izađemo iz sobe', ['ostavljamo televizor upaljen', 'otvaramo hladnjak cijeli dan', 'palimo svjetla danju']],
  ['Kako štedimo papir?', 'pišemo na objema stranama', ['bacamo napola prazne bilježnice', 'crtamo samo jednu crtu na list', 'trgamo knjige']],
  ['Kako smanjujemo smeće?', 'nosimo bocu za vodu koju punimo više puta', ['kupujemo mnogo plastičnih boca', 'bacamo hranu', 'uzimamo nove vrećice svaki put']],
  ['Što možemo učiniti sa starom odjećom koja nam je mala?', 'pokloniti je nekome kome treba', ['baciti je u rijeku', 'zapaliti je', 'zakopati je u park']],
  ['Kako čuvamo životinje u prirodi?', 'ne uznemirujemo ih i ne uzimamo im mladunce', ['gađamo ih kamenjem', 'uzimamo ptiće iz gnijezda', 'vičemo u šumi']],
  ['Što radimo sa smećem na izletu?', 'nosimo ga sa sobom do koša', ['ostavimo ga na livadi', 'bacimo ga u potok', 'zakopamo ga pod kamen']]];
function ekologijaDodatak() {
  const q = [];
  q.push(...OTPAD_2.map(([o, v]) => izbor(`U koji spremnik bacamo: ${o}?`, v, ['papir', 'plastika i metal', 'staklo', 'biootpad'].filter((x) => x !== v), 2)));
  q.push(...izTablice(STEDNJA, 1));
  q.push(...daNe([['Smijemo li bacati smeće kroz prozor automobila?', false], ['Je li dobro ići u školu pješice ako je blizu?', true], ['Treba li čuvati šume?', true],
    ['Je li u redu ostaviti slavinu da curi?', false], ['Možemo li staklo reciklirati?', true], ['Treba li hraniti ptice zimi?', true], ['Smijemo li gaziti cvjetne gredice u parku?', false],
    ['Zagađuje li dim iz tvornica zrak?', true], ['Je li biciklom bolje za zrak nego automobilom?', true], ['Treba li baterije baciti u običan koš?', false]], 1));
  return q;
}

// ── sigurnost (1. razred) ──
const SITUACIJE_2 = [
  ['Netko ti na igralištu kaže da te mama čeka u njegovu autu. Što ćeš učiniti?', 'ne poći s njim i reći odrasloj osobi od povjerenja', ['poći s njim', 'ući u auto', 'otići s njim kupiti sladoled']],
  ['Lopta ti je otkotrljala na cestu. Što ćeš učiniti?', 'zamoliti odraslu osobu da je dohvati', ['potrčati za njom', 'skočiti na cestu', 'baciti drugu loptu']],
  ['Vidiš kabel iz kojega izlaze iskre. Što ćeš učiniti?', 'udaljiti se i reći odrasloj osobi', ['dotaknuti ga', 'polijevati ga vodom', 'skakati preko njega']],
  ['Kod kuće si sam i netko zvoni na vrata. Što ćeš učiniti?', 'ne otvarati vrata i nazvati roditelje', ['otvoriti širom', 'pustiti nepoznatog unutra', 'izaći van']],
  ['Prijatelj te nagovara da se popnete na krov garaže. Što ćeš učiniti?', 'odbiti, jer je opasno', ['popeti se prvi', 'skočiti s krova', 'gurati prijatelja']],
  ['Na plaži se odvojiš od roditelja. Što ćeš učiniti?', 'ostati na mjestu i potražiti spasioca ili prodavača', ['otići u more', 'sakriti se u grm', 'otići s nepoznatima']],
  ['Kako se ponašaš u autobusu?', 'sjedim ili se čvrsto držim i ne guram se', ['trčim po autobusu', 'naginjem se kroz prozor', 'smetam vozaču']],
  ['Što trebaš znati napamet za slučaj da se izgubiš?', 'svoje ime, prezime i adresu', ['ime omiljenog crtića', 'boju svojeg ruksaka', 'broj prijatelja iz razreda']],
];
const ZNAKOVI = [['Prometni znak u obliku osmerokuta s natpisom STOP znači:', 'obavezno zaustavljanje', ['slobodan prolaz', 'parkiralište', 'bolnica']],
  ['Plavi znak s pješakom na zebri označava:', 'pješački prijelaz', ['zabranu prolaza pješacima', 'autobusno stajalište', 'igralište']],
  ['Crveni trokut s djecom upozorava vozače na:', 'djecu na cesti, blizu škole', ['zoološki vrt', 'trgovinu igračaka', 'kraj ceste']],
  ['Plavi okrugli znak s biciklom označava:', 'biciklističku stazu', ['zabranu vožnje bicikla', 'popravak bicikla', 'prodaju bicikla']]];
function sigurnostDodatak() {
  const q = [...izTablice(SITUACIJE_2, 1)];
  q.push(...ZNAKOVI.map(([p, t, k]) => izbor(`${p.replace(/:$/, '')} — što to znači?`, t, k, 2)));
  q.push(...daNe([['Smiješ li se igrati s upaljačem?', false], ['Treba li se u autu vezati pojasom?', true], ['Smiješ li ući u lift sam s nepoznatom osobom?', false],
    ['Treba li reći odraslima kad se negdje ozlijediš?', true], ['Smiješ li se naginjati kroz prozor?', false], ['Treba li hodati pločnikom?', true],
    ['Smiješ li sam ići na kupanje u rijeku?', false], ['Treba li se na igralištu čekati red za tobogan?', true], ['Smiješ li prići nepoznatom psu bez pitanja vlasnika?', false],
    ['Je li 112 broj za hitne slučajeve?', true]], 1));
  return q;
}

// ── tijelo (1. razred) ──
const OSJETILA = [['Kojim osjetilom čuješ školsko zvono?', 'sluhom', ['vidom', 'njuhom', 'okusom']], ['Kojim osjetilom vidiš duginu boju?', 'vidom', ['sluhom', 'njuhom', 'opipom']],
  ['Kojim osjetilom osjetiš miris kolača?', 'njuhom', ['vidom', 'sluhom', 'opipom']], ['Kojim osjetilom osjetiš da je limun kiseo?', 'okusom', ['sluhom', 'vidom', 'njuhom']],
  ['Kojim osjetilom osjetiš da je mačja dlaka mekana?', 'opipom', ['sluhom', 'vidom', 'okusom']], ['Kojim osjetilom čuješ pjev ptica?', 'sluhom', ['okusom', 'opipom', 'vidom']],
  ['Kojim osjetilom osjetiš da je čaj vruć dok držiš šalicu?', 'opipom', ['sluhom', 'vidom', 'njuhom']], ['Kojim osjetilom osjetiš miris cvijeća?', 'njuhom', ['okusom', 'sluhom', 'vidom']],
  ['Kojim osjetilom vidiš semafor?', 'vidom', ['njuhom', 'okusom', 'sluhom']], ['Kojim osjetilom osjetiš da je sladoled sladak?', 'okusom', ['vidom', 'sluhom', 'opipom']]];
const POLOZAJ = [['Gdje su nam oči?', 'na licu, iznad nosa', ['na leđima', 'na koljenima', 'na tjemenu']], ['Gdje je pupak?', 'na trbuhu', ['na leđima', 'na čelu', 'na stopalu']],
  ['Što je između glave i ramena?', 'vrat', ['koljeno', 'lakat', 'peta']], ['Što je između nadlaktice i podlaktice?', 'lakat', ['koljeno', 'gležanj', 'vrat']],
  ['Što je između natkoljenice i potkoljenice?', 'koljeno', ['lakat', 'rame', 'zapešće']], ['Na kojem su dijelu tijela prsti?', 'na šakama i stopalima', ['na glavi', 'na trbuhu', 'na leđima']]];
function tijeloDodatak() {
  const q = [...izTablice(OSJETILA, 1), ...izTablice(POLOZAJ, 1)];
  q.push(...daNe([['Mirišemo li nosom?', true], ['Osjetimo li okus jezikom?', true], ['Čujemo li očima?', false], ['Je li koljeno na ruci?', false], ['Štiti li lubanja mozak?', true],
    ['Kuca li srce u prsima?', true], ['Treba li nakon kihanja oprati ruke?', true], ['Je li dobro gledati izravno u Sunce?', false]], 1));
  return q;
}

// ── godišnja doba i vrijeme (2. razred) ──
const VRIJEME_DOBA = [['Kad najčešće pada snijeg?', 'zimi', ['ljeti', 'u proljeće', 'u jesen']], ['Kad cvjetaju voćke?', 'u proljeće', ['zimi', 'u jesen', 'ljeti']],
  ['Kad su dani najdulji i najtopliji?', 'ljeti', ['zimi', 'u jesen', 'u proljeće']], ['Kad lišće mijenja boju i opada?', 'u jesen', ['u proljeće', 'ljeti', 'zimi']],
  ['Kad su noći najdulje?', 'zimi', ['ljeti', 'u proljeće', 'u jesen']], ['Kad se ptice selice vraćaju?', 'u proljeće', ['u jesen', 'zimi', 'ljeti']],
  ['Kad beremo grožđe?', 'u jesen', ['zimi', 'u proljeće', 'u ožujku']], ['Kad se kupamo u moru?', 'ljeti', ['zimi', 'u studenom', 'u veljači']]];
const BLAGDANI = [['Božić', 'prosinac'], ['Nova godina', 'siječanj'], ['Valentinovo', 'veljača'], ['Praznik rada', 'svibanj'], ['Dan državnosti', 'svibanj'], ['Svi sveti', 'studeni']];
function dobaVrijemeDodatak() {
  const q = [...izTablice(VRIJEME_DOBA, 1)];
  q.push(...BLAGDANI.map(([b, m]) => izbor(`U kojem je mjesecu ${b}?`, m, uzmi(['siječanj', 'veljača', 'travanj', 'svibanj', 'srpanj', 'kolovoz', 'studeni', 'prosinac'].filter((x) => x !== m), 3), 2)));
  q.push(...daNe([['Dolazi li proljeće poslije zime?', true], ['Ima li veljača više dana od siječnja?', false], ['Je li subota dan vikenda?', true], ['Je li srijeda prvi dan u tjednu?', false],
    ['Je li prosinac posljednji mjesec u godini?', true], ['Počinje li školska godina u rujnu?', true], ['Pada li Božić ljeti?', false], ['Je li jutro prije podneva?', true]], 1));
  return q;
}

// ── tvrdnje Da/Ne iz tablica (sva uparivanja) ──
const SLUZBE = [['112', 'hitne službe'], ['193', 'vatrogasci'], ['192', 'policija'], ['194', 'hitna medicinska pomoć']];
const zdravljeTvrdnje = () => [
  ...sveTvrdnje(NAMIRNICE, (a, b) => `Je li dobro jesti ili piti ovo ${b}: ${a}?`, { lazni: 1 }),
  ...sveTvrdnje(SLUZBE, (a, b) => `Javljaju li se na broj ${a} ${b}?`.replace('Javljaju li se na broj 192 policija', 'Javlja li se na broj 192 policija').replace(/Javljaju li se na broj (\d+) hitna medicinska pomoć/, 'Javlja li se na broj $1 hitna medicinska pomoć').replace(/Javljaju li se na broj (\d+) policija/, 'Javlja li se na broj $1 policija'), { lazni: 2 }),
];
const vodaTvrdnje2 = () => sveTvrdnje(PADALINE, (a, b) => `Je li ${a} ${b}?`, { lazni: 2 });
const zavicajTvrdnje2 = () => sveTvrdnje(ZANIMANJA, (a, b) => `Je li točno da ${a} ${b}?`, { lazni: 2, tezina: 1 });
const bz2Tvrdnje = () => [
  ...sveTvrdnje(ZIMA, (a, b) => `Je li točno da ${a} zimi ${b.replace(/^zimi /, '')}?`, { lazni: 1 }),
  ...sveTvrdnje(JESTIVI_DIO, (a, b) => `Kad jedemo biljku ${a}, jedemo li njezin ${b}?`, { lazni: 1 }),
];
const sigurnostTvrdnje = () => sveTvrdnje(SLUZBE, (a, b) => `Je li ${a} broj na koji zovemo: ${b}?`, { lazni: 2, tezina: 1 });

module.exports = {
  genZdravljeSigurnost2: () => [...zdravljeSigurnost2Dodatak(), ...zdravljeTvrdnje()], genVodaTlo: () => [...vodaTloDodatak(), ...vodaTvrdnje2()],
  genZavicaj: () => [...zavicajDodatak(), ...zavicajTvrdnje2()], genBiljkeZivotinje: () => [...biljkeZivotinje2Dodatak(), ...bz2Tvrdnje()],
  genEkologija: ekologijaDodatak, genSigurnost: () => [...sigurnostDodatak(), ...sigurnostTvrdnje()], genTijelo: tijeloDodatak, genDobaVrijeme: dobaVrijemeDodatak,
};
