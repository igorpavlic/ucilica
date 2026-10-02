/**
 * dodatci/drustvo.js — Priroda i društvo (društveni dio), 3. i 4. razred:
 * zavičaj i karta, gospodarske djelatnosti, kulturna baština, krajevi
 * Hrvatske, Hrvatska — moja domovina.
 */
const { izbor, tocnoNetocno, obaSmjera, sveTvrdnje, uObitelj, spajanja, izTablice, daNe, uzmi } = require('./pomocno');

const KRAJEVI = ['nizinski', 'brežuljkasti', 'gorski', 'primorski'];
const KRAJ_PRIPADNOST = 'kraj-pripadnost';
const KRAJ_TVRDNJA = 'kraj-pripadnost-da-ne';

// ═══ 4. razred: krajevi Hrvatske ═══
const GRADOVI = [['Vukovar', 'nizinski'], ['Vinkovci', 'nizinski'], ['Đakovo', 'nizinski'], ['Koprivnica', 'nizinski'], ['Sisak', 'nizinski'], ['Virovitica', 'nizinski'],
  ['Krapina', 'brežuljkasti'], ['Zabok', 'brežuljkasti'], ['Varaždinske Toplice', 'brežuljkasti'], ['Ogulin', 'gorski'], ['Otočac', 'gorski'], ['Čabar', 'gorski'],
  ['Pula', 'primorski'], ['Rovinj', 'primorski'], ['Šibenik', 'primorski'], ['Makarska', 'primorski'], ['Senj', 'primorski'], ['Opatija', 'primorski']];
const REGIJE = [['Slavonija', 'nizinski'], ['Baranja', 'nizinski'], ['Podravina', 'nizinski'], ['Posavina', 'nizinski'], ['Hrvatsko zagorje', 'brežuljkasti'],
  ['Lika', 'gorski'], ['Gorski kotar', 'gorski'], ['Istra', 'primorski'], ['Dalmacija', 'primorski'], ['Kvarner', 'primorski']];
const OBILJEZJA = [['velike plodne ravnice', 'nizinski'], ['polja pšenice, kukuruza i suncokreta', 'nizinski'], ['velike rijeke Sava, Drava i Dunav', 'nizinski'],
  ['niska brda s vinogradima i dvorcima', 'brežuljkasti'], ['brežuljci, klijeti i toplice', 'brežuljkasti'], ['visoke planine i guste šume', 'gorski'],
  ['hladne zime s mnogo snijega', 'gorski'], ['drvna industrija i nacionalni parkovi Risnjak i Plitvička jezera', 'gorski'], ['more, otoci i turizam', 'primorski'],
  ['masline, vinova loza i smokve', 'primorski'], ['vruća suha ljeta i blage kišovite zime', 'primorski'], ['ribarstvo i brodogradnja', 'primorski']];
const RIJEKE = [['Sava', 'nizinski'], ['Drava', 'nizinski'], ['Dunav', 'nizinski'], ['Krapina', 'brežuljkasti'],
  ['Krka', 'primorski'], ['Cetina', 'primorski'], ['Neretva', 'primorski']];
const PLANINE = [['Risnjak', 'gorski'], ['Bjelolasica', 'gorski'], ['Učka', 'primorski'], ['Biokovo', 'primorski'], ['Medvednica', 'brežuljkasti'], ['Ivanščica', 'brežuljkasti']];
const KR_DA_NE = [['Je li Slavonija nizinski kraj?', true], ['Ima li u gorskom kraju mnogo snijega zimi?', true], ['Je li Istra gorski kraj?', false], ['Teče li Dunav kroz primorski kraj?', false],
  ['Uzgajaju li se masline u primorskom kraju?', true], ['Je li Hrvatsko zagorje brežuljkasti kraj?', true], ['Nalazi li se Gospić u nizinskom kraju?', false], ['Ima li nizinski kraj velike plodne ravnice?', true],
  ['Nalaze li se otoci u primorskom kraju?', true], ['Je li Lika primorski kraj?', false]];
// Znanje o krajevima osim „koji grad je u kojem kraju”: klima, gospodarstvo, znamenitosti.
const KRAJ_ZNANJE = [
  ['Zašto je u nizinskom kraju razvijena poljoprivreda?', 'ima plodnoga tla i velikih ravnica', ['ima mnogo stijena', 'ondje je uvijek snijeg', 'ondje nema rijeka']],
  ['Zašto su u gorskom kraju ljeta svježa, a zime duge i snježne?', 'kraj je visoko iznad mora', ['kraj je uz more', 'ondje nema šuma', 'ondje su velike ravnice']],
  ['Koja je gospodarska djelatnost najvažnija u primorskom kraju?', 'turizam', ['rudarstvo', 'uzgoj riže', 'skijanje']],
  ['Koja je djelatnost važna u gorskom kraju zbog velikih šuma?', 'drvna industrija', ['ribarstvo', 'uzgoj maslina', 'brodogradnja']],
  ['Koji se park prirode nalazi na planini iznad Zagreba?', 'Park prirode Medvednica', ['Nacionalni park Kornati', 'Nacionalni park Mljet', 'Nacionalni park Brijuni']],
  ['Koji je nacionalni park u Gorskom kotaru?', 'Risnjak', ['Kornati', 'Mljet', 'Brijuni']],
  ['Koja je močvara u nizinskom kraju poznata po pticama?', 'Kopački rit', ['Plitvička jezera', 'Vransko jezero kod Cresa', 'Paklenica']],
  ['Kakva je klima u primorskom kraju?', 'vruća suha ljeta i blage kišovite zime', ['hladna ljeta i snježne zime', 'cijele godine snijeg', 'cijele godine hladno']],
  ['Kakva je klima u nizinskom kraju?', 'vruća ljeta i hladne zime', ['blage zime i suha ljeta uz more', 'cijele godine toplo', 'cijele godine hladno']],
  ['Što se najčešće uzgaja na brežuljcima Hrvatskog zagorja?', 'vinova loza', ['masline', 'riža', 'banane']],
  ['Koja voćka je tipična za primorski kraj?', 'maslina', ['šljiva', 'jabuka', 'kruška']],
  ['Koja rijeka čini dio granice Hrvatske na istoku, uz Vukovar?', 'Dunav', ['Krka', 'Cetina', 'Kupa']],
  ['Po čemu je poznat grad Varaždin?', 'po baroknim građevinama i Starom gradu', ['po rimskoj areni', 'po otocima', 'po skijalištima']],
  ['Koja je velika rimska građevina u Puli?', 'Arena (amfiteatar)', ['Dioklecijanova palača', 'Trakošćan', 'Eufrazijeva bazilika']],
  ['Kako se zovu kućice u vinogradima Hrvatskog zagorja?', 'klijeti', ['kažuni', 'brvnare', 'svjetionici']],
  ['Kako se zovu kamene kućice u Istri?', 'kažuni', ['klijeti', 'čardaci', 'kule']],
  ['Koji je planinski prijevoj važan za put iz unutrašnjosti prema moru?', 'Vratnik iznad Senja', ['Kopački rit', 'Arena', 'Krka']],
  ['Zašto se u gorskom kraju razvija zimski turizam?', 'ima snijega i planina', ['ima toplog mora', 'ima velikih ravnica', 'ima maslinika']],
];
function krajeviDodatak() {
  const q = [...izTablice(KRAJ_ZNANJE, 2)];
  // Sva pitanja „koji kraj?” (grad, područje, rijeka, planina) jedna su obitelj:
  // u kvizu najviše jedno takvo pitanje, ostalo su drugi oblici.
  q.push(...uObitelj(KRAJ_PRIPADNOST, [
    ...GRADOVI.map(([g, k]) => izbor(`U kojem se kraju Hrvatske nalazi grad ${g}?`, k, KRAJEVI.filter((x) => x !== k), 2)),
    ...REGIJE.map(([r, k]) => izbor(`Koji je kraj Hrvatske ${r}?`, k, KRAJEVI.filter((x) => x !== k), 2)),
    ...RIJEKE.map(([r, k]) => izbor(`Kroz koji kraj Hrvatske teče rijeka ${r}?`, k, KRAJEVI.filter((x) => x !== k), 3)),
    ...PLANINE.map(([p, k]) => izbor(`U kojem se kraju Hrvatske nalazi planina ${p}?`, k, KRAJEVI.filter((x) => x !== k), 3)),
  ]));
  q.push(...OBILJEZJA.map(([o, k]) => izbor(`Koji kraj Hrvatske opisuje: ${o}?`, k, KRAJEVI.filter((x) => x !== k), 2)));
  q.push(...spajanja(REGIJE, 'Spoji područje s krajem Hrvatske:', { koliko: 4, komada: 3 }));
  q.push(...KR_DA_NE.map(([p, t]) => tocnoNetocno(p, t, 2)));
  return q;
}

// ═══ 4. razred: Hrvatska — moja domovina ═══
const DOMOVINA = [
  ['Tko je napisao riječi hrvatske himne?', 'Antun Mihanović', ['Ivan Gundulić', 'Vladimir Nazor', 'August Šenoa']],
  ['Kada se slavi Dan državnosti?', '30. svibnja', ['25. prosinca', '1. siječnja', '5. kolovoza']],
  ['Koji se blagdan slavi 5. kolovoza?', 'Dan pobjede i domovinske zahvalnosti', ['Dan državnosti', 'Nova godina', 'Praznik rada']],
  ['Koji grad posebno pamtimo 18. studenoga, na Dan sjećanja na žrtve Domovinskog rata?', 'Vukovar', ['Zadar', 'Split', 'Osijek']],
  ['Koja je službena valuta u Hrvatskoj od 2023. godine?', 'euro', ['kuna', 'dinar', 'dolar']],
  ['Kako se zove skupština koja donosi zakone u Hrvatskoj?', 'Hrvatski sabor', ['Vlada', 'općinsko vijeće', 'školski odbor']],
  ['Kako se zove najviši pravni akt (temeljni zakon) Republike Hrvatske?', 'Ustav', ['pravilnik', 'kućni red', 'zakon o prometu']],
  ['Koji je službeni jezik u Republici Hrvatskoj?', 'hrvatski jezik', ['engleski jezik', 'talijanski jezik', 'njemački jezik']],
  ['Kojim pismom službeno pišemo hrvatski jezik?', 'latinicom', ['ćirilicom', 'grčkim pismom', 'arapskim pismom']],
  ['Na koliko je županija podijeljena Hrvatska, uz Grad Zagreb?', '20 županija i Grad Zagreb', ['5 županija', '100 županija', '2 županije']],
  ['Koja je najviša planina u Hrvatskoj?', 'Dinara', ['Učka', 'Medvednica', 'Papuk']],
  ['Koja je najduža rijeka koja teče kroz Hrvatsku?', 'Sava', ['Krka', 'Cetina', 'Korana']],
  ['Koje je najveće prirodno jezero u Hrvatskoj?', 'Vransko jezero', ['Plitvička jezera', 'Jarun', 'Bundek']],
  ['Koliko nacionalnih parkova ima Hrvatska?', '8', ['2', '15', '30']],
  ['Koji je najstariji nacionalni park u Hrvatskoj?', 'Plitvička jezera', ['Kornati', 'Brijuni', 'Mljet']],
  ['Koja su dva najveća hrvatska otoka?', 'Krk i Cres', ['Vis i Lastovo', 'Hvar i Mljet', 'Pag i Rab']],
  ['Kako se zove more uz hrvatsku obalu?', 'Jadransko more', ['Crno more', 'Sjeverno more', 'Baltičko more']],
  ['Koliko otoka, otočića i hridi ima Hrvatska?', 'više od tisuću', ['točno deset', 'pedesetak', 'nijedan']],
  ['Gdje se nalazi Dioklecijanova palača?', 'u Splitu', ['u Zagrebu', 'u Osijeku', 'u Karlovcu']],
  ['Koji je grad poznat po zidinama i nazivu „biser Jadrana”?', 'Dubrovnik', ['Vukovar', 'Varaždin', 'Sisak']],
  ['U kojem se gradu nalazi Eufrazijeva bazilika?', 'u Poreču', ['u Slavonskom Brodu', 'u Bjelovaru', 'u Kninu']],
  ['Koja je organizacija Hrvatsku upisala na popis svjetske baštine (npr. Plitvice)?', 'UNESCO', ['FIFA', 'NATO', 'UNICEF']],
  ['Kojoj se savezničkoj organizaciji Hrvatska pridružila 2009. godine?', 'NATO', ['UNESCO', 'OPEC', 'FIFA']],
  ['Kako se zove osoba koju građani biraju za šefa države?', 'predsjednik ili predsjednica Republike', ['gradonačelnik', 'ravnatelj', 'župan']],
];
const ZUPANIJE = [['Osječko-baranjska', 'Osijek'], ['Splitsko-dalmatinska', 'Split'], ['Primorsko-goranska', 'Rijeka'], ['Zadarska', 'Zadar'], ['Šibensko-kninska', 'Šibenik'],
  ['Dubrovačko-neretvanska', 'Dubrovnik'], ['Ličko-senjska', 'Gospić'], ['Karlovačka', 'Karlovac'], ['Sisačko-moslavačka', 'Sisak'], ['Vukovarsko-srijemska', 'Vukovar'],
  ['Brodsko-posavska', 'Slavonski Brod'], ['Požeško-slavonska', 'Požega'], ['Virovitičko-podravska', 'Virovitica'], ['Koprivničko-križevačka', 'Koprivnica'],
  ['Bjelovarsko-bilogorska', 'Bjelovar'], ['Varaždinska', 'Varaždin'], ['Međimurska', 'Čakovec'], ['Krapinsko-zagorska', 'Krapina'], ['Istarska', 'Pazin']];
const NP = [['Plitvička jezera', 'jezera povezana slapovima'], ['Krka', 'rijeka sa slapovima Skradinski buk'], ['Kornati', 'skupina otoka'], ['Brijuni', 'otoci uz Istru sa safari parkom'],
  ['Mljet', 'otok sa slanim jezerima'], ['Paklenica', 'kanjoni na Velebitu'], ['Risnjak', 'gorje u Gorskom kotaru'], ['Sjeverni Velebit', 'planinski vrhovi i krš']];
const DOM_DA_NE = [['Je li Zagreb glavni grad Hrvatske?', true], ['Je li Hrvatska članica Europske unije?', true], ['Ima li hrvatska zastava zelenu boju?', false],
  ['Je li šahovnica dio hrvatskoga grba?', true], ['Graniči li Hrvatska s Italijom kopnom?', false], ['Plaćamo li u Hrvatskoj eurima?', true],
  ['Je li Dan državnosti blagdan Republike Hrvatske?', true], ['Nalazi li se Hrvatska u Aziji?', false], ['Zasjeda li Hrvatski sabor u Zagrebu?', true],
  ['Ima li Hrvatska izlaz na more?', true], ['Je li Lijepa naša domovino hrvatska himna?', true], ['Je li Osijek glavni grad Hrvatske?', false]];
function domovinaDodatak() {
  const q = [...izTablice(DOMOVINA, 2)];
  q.push(...obaSmjera(ZUPANIJE, { pitajB: (a) => `Koji je grad sjedište županije: ${a}?`, pitajA: (b) => `Kojoj je županiji sjedište ${b}?`, tezina: 3 }));
  q.push(...obaSmjera(NP, { pitajB: (a) => `Što je posebno u nacionalnom parku ${a}?`, pitajA: (b) => `Koji nacionalni park ima ovo obilježje: ${b}?`, tezina: 3 }));
  q.push(...DOM_DA_NE.map(([p, t]) => tocnoNetocno(p, t, 2)));
  return q;
}

// ═══ 3. razred: gospodarske djelatnosti ═══
const DJELATNOSTI = ['poljoprivreda', 'ribarstvo', 'šumarstvo', 'industrija', 'obrt', 'trgovina', 'promet', 'turizam', 'građevinarstvo'];
const ZANIMANJE_DJ = [['ratar', 'poljoprivreda'], ['stočar', 'poljoprivreda'], ['vinogradar', 'poljoprivreda'], ['voćar', 'poljoprivreda'], ['ribar', 'ribarstvo'],
  ['šumar', 'šumarstvo'], ['drvosječa', 'šumarstvo'], ['radnik u tvornici', 'industrija'], ['postolar', 'obrt'], ['frizer', 'obrt'], ['stolar', 'obrt'], ['krojač', 'obrt'],
  ['prodavač', 'trgovina'], ['blagajnica u trgovini', 'trgovina'], ['vozač kamiona', 'promet'], ['strojovođa', 'promet'], ['pilot', 'promet'], ['turistički vodič', 'turizam'],
  ['recepcionar u hotelu', 'turizam'], ['zidar', 'građevinarstvo'], ['tesar', 'građevinarstvo']];
const PROIZVOD_DJ = [['pšenica i kukuruz', 'poljoprivreda'], ['mlijeko i jaja s farme', 'poljoprivreda'], ['ulovljena srdela', 'ribarstvo'], ['drvo za ogrjev', 'šumarstvo'],
  ['automobili iz tvornice', 'industrija'], ['popravljene cipele', 'obrt'], ['prodaja voća na tržnici', 'trgovina'], ['prijevoz putnika vlakom', 'promet'],
  ['smještaj gostiju u kampu', 'turizam'], ['izgradnja mosta', 'građevinarstvo']];
const KRAJ_DJ = [['U kojem kraju Hrvatske je najrazvijenija poljoprivreda (ratarstvo)?', 'u nizinskom', ['u gorskom', 'na otocima', 'u planinama']],
  ['U kojem je kraju najvažniji turizam na moru?', 'u primorskom', ['u nizinskom', 'u brežuljkastom', 'u gorskom']],
  ['U kojem je kraju važno šumarstvo i drvna industrija?', 'u gorskom', ['u primorskom', 'u nizinskom', 'nigdje']],
  ['Gdje se razvija ribarstvo?', 'uz more, rijeke i ribnjake', ['u pustinji', 'na planinskim vrhovima', 'u rudnicima']],
  ['Zašto su djelatnosti povezane?', 'jedne trebaju proizvode i usluge drugih', ['nisu povezane', 'jer sve rade isto', 'jer rade samo nedjeljom']],
  ['Koja djelatnost od sirovina proizvodi proizvode u tvornicama?', 'industrija', ['turizam', 'trgovina', 'ribarstvo']],
  ['Što je sirovina?', 'tvar iz prirode od koje se nešto proizvodi', ['gotov proizvod iz trgovine', 'vrsta prijevoza', 'zanimanje']],
  ['Od koje se sirovine izrađuje papir?', 'od drva', ['od pijeska', 'od mlijeka', 'od nafte']],
  ['Od koje se sirovine izrađuje staklo?', 'od pijeska', ['od drva', 'od vune', 'od žita']],
  ['Od koje se sirovine izrađuje kruh?', 'od brašna (žita)', ['od drva', 'od pijeska', 'od gline']]];
const GD_DA_NE = [['Je li turizam gospodarska djelatnost?', true], ['Bavi li se ribar šumarstvom?', false], ['Je li trgovina kupnja i prodaja robe?', true], ['Proizvodi li industrija stvari u tvornicama?', true],
  ['Je li obrtnik osoba koja ručno izrađuje ili popravlja stvari?', true], ['Pripada li prijevoz robe vlakom poljoprivredi?', false], ['Ovise li gospodarske djelatnosti o prirodnim uvjetima kraja?', true]];
function gospodarskeDodatak() {
  const q = [];
  q.push(...ZANIMANJE_DJ.map(([z, d]) => izbor(`Kojoj djelatnosti pripada zanimanje: ${z}?`, d, uzmi(DJELATNOSTI.filter((x) => x !== d), 3), 2)));
  q.push(...PROIZVOD_DJ.map(([p, d]) => izbor(`Koja djelatnost daje ovo: ${p}?`, d, uzmi(DJELATNOSTI.filter((x) => x !== d), 3), 2)));
  q.push(...izTablice(KRAJ_DJ, 2));
  q.push(...GD_DA_NE.map(([p, t]) => tocnoNetocno(p, t, 2)));
  q.push(...spajanja(ZANIMANJE_DJ, 'Spoji zanimanje s djelatnošću:', { koliko: 4, komada: 3 }));
  return q;
}

// ═══ 3. razred: kulturna baština ═══
const BASTINA = [['stari grad Dubrovnik', 'materijalna'], ['Dioklecijanova palača', 'materijalna'], ['stara crkvica na brdu', 'materijalna'], ['narodna nošnja iz muzeja', 'materijalna'],
  ['Trakošćan', 'materijalna'], ['Arena u Puli', 'materijalna'], ['stari mlin na rijeci', 'materijalna'], ['Bašćanska ploča', 'materijalna'],
  ['klapsko pjevanje', 'nematerijalna'], ['bećarac', 'nematerijalna'], ['Sinjska alka', 'nematerijalna'], ['čipkarstvo', 'nematerijalna'], ['licitarsko srce (umijeće izrade)', 'nematerijalna'],
  ['zvončari', 'nematerijalna'], ['Festa svetoga Vlaha', 'nematerijalna'], ['narodna pjesma koju pjeva baka', 'nematerijalna']];
const KB_PITANJA = [
  ['Gdje se čuvaju stari predmeti, nošnje i alati?', 'u muzeju', ['u trgovini', 'u pekari', 'na igralištu']],
  ['Kako zovemo ljude koji izrađuju ili popravljaju predmete ručno, po starim zanatima?', 'obrtnici', ['piloti', 'glumci', 'vozači']],
  ['Što je kulturna baština?', 'sve vrijedno što smo naslijedili od predaka', ['samo nove zgrade', 'samo igračke', 'samo ono što je kupljeno u trgovini']],
  ['Zašto čuvamo kulturnu baštinu?', 'da je prenesemo budućim naraštajima', ['da je bacimo', 'da je zaboravimo', 'da je prodamo u inozemstvo']],
  ['Što je narodna nošnja?', 'tradicionalna odjeća nekoga kraja', ['školska uniforma', 'sportski dres', 'zimska jakna iz trgovine']],
  ['Što su zvončari?', 'maškare s Kastavštine koje zvonima tjeraju zimu', ['vrsta kolača', 'ribari s Jadrana', 'stari automobili']],
  ['Koja je ploča jedan od najstarijih spomenika hrvatskoga jezika i glagoljice?', 'Bašćanska ploča', ['Plitvička ploča', 'Zagrebačka ploča', 'Pulska ploča']],
  ['Kojim su pismom pisali stari Hrvati u Bašćanskoj ploči?', 'glagoljicom', ['ćirilicom', 'japanskim pismom', 'grčkim pismom']],
  ['Kako se zove viteška igra koja se svake godine održava u Sinju?', 'Sinjska alka', ['Splitsko ljeto', 'Dubrovačke ljetne igre', 'Vinkovačke jeseni']],
  ['Koji se ukras od medenoga tijesta izrađuje u Hrvatskom zagorju?', 'licitarsko srce', ['pršut', 'paška čipka', 'maraskino']],
];
const KB_DA_NE = [['Je li klapsko pjevanje nematerijalna baština?', true], ['Je li Arena u Puli materijalna baština?', true], ['Treba li stare spomenike čuvati?', true],
  ['Smijemo li pisati po starim zidinama?', false], ['Je li paška čipka dio hrvatske tradicije?', true], ['Može li se narodni ples dotaknuti rukom kao predmet?', false]];
function kulturnaDodatak() {
  const q = [];
  q.push(...BASTINA.map(([b, v]) => izbor(`Je li ${b} materijalna ili nematerijalna baština?`, v, [v === 'materijalna' ? 'nematerijalna' : 'materijalna'], 2,
    v === 'materijalna' ? 'Materijalnu baštinu možemo dotaknuti: građevine i predmete.' : 'Nematerijalna baština su pjesme, plesovi, običaji i umijeća.')));
  q.push(...izTablice(KB_PITANJA, 2));
  q.push(...KB_DA_NE.map(([p, t]) => tocnoNetocno(p, t, 2)));
  return q;
}

// ═══ 3. razred: zavičaj i karta ═══
const KARTA = [
  ['Kojom se bojom na zemljovidu prikazuju nizine?', 'zelenom', ['smeđom', 'plavom', 'crvenom']],
  ['Kojom se bojom na zemljovidu prikazuju visoke planine?', 'tamnosmeđom', ['zelenom', 'plavom', 'žutom']],
  ['Kojom se bojom na zemljovidu prikazuju mora, rijeke i jezera?', 'plavom', ['zelenom', 'smeđom', 'crvenom']],
  ['Kako zovemo popis znakova i boja na zemljovidu?', 'tumač znakova (legenda)', ['naslov', 'kompas', 'mjerilo']],
  ['Što nam pokazuje mjerilo na zemljovidu?', 'koliko je zemljovid umanjen', ['strane svijeta', 'nadmorsku visinu', 'broj stanovnika']],
  ['Gdje je sjever na većini zemljovida?', 'na gornjem rubu', ['na donjem rubu', 'lijevo', 'desno']],
  ['Koja je strana svijeta između sjevera i istoka?', 'sjeveroistok', ['jugozapad', 'jugoistok', 'sjeverozapad']],
  ['Koja je strana svijeta između juga i zapada?', 'jugozapad', ['sjeveroistok', 'jugoistok', 'sjeverozapad']],
  ['Kako se zove umanjeni prikaz Zemlje u obliku kugle?', 'globus', ['plan', 'kompas', 'atlas']],
  ['Kako zovemo knjigu s mnogo zemljovida?', 'atlas', ['rječnik', 'enciklopedija', 'čitanka']],
];
function zavicajKartaDodatak() {
  const q = [...izTablice(KARTA, 2)];
  q.push(...daNe([['Prikazuje li plan manje područje od zemljovida?', true], ['Je li jug na gornjem rubu zemljovida?', false], ['Pokazuje li kompas strane svijeta?', true],
    ['Prikazuje li se more na zemljovidu zelenom bojom?', false]], 2));
  return q;
}

// ── tvrdnje Da/Ne iz tablica (sva uparivanja) ──
const U_KRAJU = { nizinski: 'nizinskom', brežuljkasti: 'brežuljkastom', gorski: 'gorskom', primorski: 'primorskom' };
const DATIV_DJ = { poljoprivreda: 'poljoprivredi', ribarstvo: 'ribarstvu', šumarstvo: 'šumarstvu', industrija: 'industriji', obrt: 'obrtu',
  trgovina: 'trgovini', promet: 'prometu', turizam: 'turizmu', građevinarstvo: 'građevinarstvu' };
const genitivZupanije = (z) => z.replace(/a$/, 'e');
function krajeviTvrdnje() {
  const objasni = (a, b) => `${a}: ${b} kraj.`;
  return [
    ...sveTvrdnje(GRADOVI, (a, b) => `Nalazi li se grad ${a} u ${U_KRAJU[b]} kraju?`, { obitelj: KRAJ_TVRDNJA, objasni }),
    ...sveTvrdnje(REGIJE, (a, b) => `Pripada li ${a} ${U_KRAJU[b]} kraju Hrvatske?`, { obitelj: KRAJ_TVRDNJA, objasni }),
    ...sveTvrdnje(RIJEKE, (a, b) => `Teče li rijeka ${a} kroz ${b} kraj?`, { obitelj: KRAJ_TVRDNJA, objasni, lazni: 1 }),
    ...sveTvrdnje(OBILJEZJA, (a, b) => `Opisuje li ${b} kraj ovo: ${a}?`, { objasni: (a, b) => `To opisuje ${b} kraj.`, lazni: 1 }),
  ];
}
function domovinaTvrdnje() {
  return [
    ...sveTvrdnje(ZUPANIJE, (a, b) => `Je li ${b} sjedište ${genitivZupanije(a)} županije?`, { objasni: (a, b) => `Sjedište ${genitivZupanije(a)} županije je ${b}.` }),
    ...sveTvrdnje(NP, (a, b) => `Pripada li nacionalnom parku ${a} ovo obilježje: ${b}?`, { objasni: (a, b) => `${a}: ${b}.`, lazni: 1 }),
  ];
}
function gospodarskeTvrdnje() {
  return [
    ...sveTvrdnje(ZANIMANJE_DJ, (a, b) => `Pripada li zanimanje ${a} ${DATIV_DJ[b]}?`, { objasni: (a, b) => `${a}: ${b}.` }),
    ...sveTvrdnje(PROIZVOD_DJ, (a, b) => `Daje li ${b} ovo: ${a}?`, { objasni: (a, b) => `To daje ${b}.` }),
  ];
}
function kulturnaTvrdnje() {
  return sveTvrdnje(BASTINA, (a, b) => `Pripada li ${a} ${b === 'materijalna' ? 'materijalnoj' : 'nematerijalnoj'} kulturnoj baštini?`, { lazni: 1,
    objasni: (a, b) => (b === 'materijalna' ? 'Materijalnu baštinu možemo dotaknuti.' : 'Nematerijalna baština su pjesme, plesovi, običaji i umijeća.') });
}

module.exports = {
  genKrajeviHR: () => [...krajeviDodatak(), ...krajeviTvrdnje()], genHrvatskaDomovina: () => [...domovinaDodatak(), ...domovinaTvrdnje()],
  genGospodarskeDjelatnosti: () => [...gospodarskeDodatak(), ...gospodarskeTvrdnje()],
  genKulturnaBastina: () => [...kulturnaDodatak(), ...kulturnaTvrdnje()], genZavicajKarta: zavicajKartaDodatak,
};
