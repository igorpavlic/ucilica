/**
 * dodatci/hrvatski-2.js — drugi skup dodatnih pitanja za Hrvatski jezik
 * (teme koje ni nakon prvoga skupa nisu imale ~150 različitih tekstova).
 */
const { izbor, tocnoNetocno, obaSmjera, izTablice, daNe, uzmi } = require('./pomocno');

// ── 2. razred: riječi i značenje ──
const DOVRSI_RADNJU = [
  ['Djeca ___ loptu na igralištu.', 'šutiraju'], ['Baka ___ čarape od vune.', 'plete'], ['Pekar ___ kruh rano ujutro.', 'peče'], ['Ptice ___ gnijezdo na grani.', 'grade'],
  ['Tata ___ travu u dvorištu.', 'kosi'], ['Mama ___ rublje u perilici.', 'pere'], ['Luka ___ zube prije spavanja.', 'pere'], ['Učenici ___ pjesmu napamet.', 'uče'],
  ['Pas ___ kost u vrtu.', 'zakopava'], ['Ivana ___ pismo prijateljici.', 'piše'], ['Djed ___ drva za zimu.', 'cijepa'], ['Mačka ___ mlijeko iz zdjelice.', 'pije'],
  ['Brat ___ bicikl po parku.', 'vozi'], ['Sestra ___ cvijeće u vazu.', 'stavlja'], ['Vatrogasci ___ požar.', 'gase'], ['Liječnica ___ bolesno dijete.', 'pregledava'],
  ['Kuhar ___ juhu u loncu.', 'miješa'], ['Žaba ___ u bazen.', 'skače'], ['Vjetar ___ lišće s drveća.', 'otpuhuje'], ['Sunce ___ cijeli dan.', 'sja'],
];
const SLICNO_2 = [['brzo', 'hitro'], ['lijep', 'krasan'], ['velik', 'golem'], ['malen', 'sitan'], ['veseo', 'radostan'], ['tužan', 'žalostan'], ['razgovarati', 'pričati'],
  ['početi', 'započeti'], ['plašiti se', 'bojati se'], ['dom', 'kuća'], ['drug', 'prijatelj'], ['jesti', 'objedovati']];
function glagoli2Dodatak2() {
  const q = [];
  const sve = [...new Set(DOVRSI_RADNJU.map((x) => x[1]))];
  for (const [r, c] of DOVRSI_RADNJU) q.push(izbor(`Koja riječ kaže što se radi u rečenici: ${r}`.replace(/\.$/, '?'), c, uzmi(sve.filter((x) => x !== c), 3), 2));
  q.push(...obaSmjera(SLICNO_2, { pitajB: (a) => `Koja riječ znači isto ili gotovo isto kao riječ ${a}?`, tezina: 2 }));
  return q;
}

// ── 3. razred: gramatika i pravopis ──
const IJE_2 = [['lijevo', 'ljevo'], ['dijeliti', 'djeliti'], ['bijeg', 'bjeg'], ['riječ', 'rječ'], ['sijeno', 'sjeno'], ['vijenac', 'vjenac'], ['pjevati', 'pijevati'], ['vjeverica', 'vijeverica'],
  ['mjera', 'mijera'], ['sjesti', 'sijesti'], ['cijena', 'cjena'], ['tijesto', 'tjesto']];
const CC_3 = [['mo_', 'ć', 'moć'], ['bra_a', 'ć', 'braća'], ['_ešalj', 'č', 'češalj'], ['ko_ija', 'č', 'kočija'], ['lon_ić', 'č', 'lončić'], ['kolači_', 'ć', 'kolačić'],
  ['pe_at', 'č', 'pečat'], ['_aj', 'č', 'čaj'], ['ple_ka', 'ć', 'plećka'], ['tre_i', 'ć', 'treći']];
// [riječ, piše li se velikim slovom, „kad je riječ o …”]
const VELIKO_3 = [['Dinara', true, 'imenu planine'], ['Krk', true, 'imenu otoka'], ['Osijek', true, 'imenu grada'], ['Uskrs', true, 'imenu blagdana'], ['Luka', true, 'imenu osobe'],
  ['srijeda', false, 'danu u tjednu'], ['svibanj', false, 'mjesecu'], ['jesen', false, 'godišnjem dobu'], ['otok', false, 'otoku općenito'], ['planina', false, 'planini općenito']];
function gramatikaPravopisDodatak2() {
  const q = [];
  for (const [dobro, krivo] of IJE_2) q.push(izbor(`Koja je riječ pravilno napisana: ${uzmi([dobro, krivo], 2).join(' ili ')}?`, dobro, [krivo], 2));
  for (const [zapis, glas, rijec] of CC_3) q.push(izbor(`Koje slovo treba upisati u riječ ${zapis}?`, glas, [glas === 'č' ? 'ć' : 'č'], 2, `Pravilno se piše: ${rijec}.`));
  for (const [r, v, kad] of VELIKO_3) q.push(tocnoNetocno(`Pišemo li riječ ${r.toLowerCase()} velikim početnim slovom kad je riječ o ${kad}?`, v, 2,
    v ? 'Vlastita imena pišemo velikim početnim slovom.' : 'To nije vlastito ime, pa ga pišemo malim slovom.'));
  return q;
}

// ── 3. razred: književni tekst ──
const BAJKE = [['Crvenkapica', 'vuk prerušen u baku'], ['Snjeguljica i sedam patuljaka', 'otrovana jabuka'], ['Pepeljuga', 'staklena cipelica'], ['Ivica i Marica', 'kućica od medenjaka'],
  ['Tri praščića', 'kuća od opeke'], ['Trnoružica', 'ubod vretenom i dugi san'], ['Ružno pače', 'pače koje izraste u labuda'], ['Pinokio', 'nos koji raste od laži'],
  ['Mačak u čizmama', 'lukavi mačak koji pomaže gospodaru'], ['Zlatokosa i tri medvjeda', 'tri zdjelice kaše']];
const BASNE = [['Lisica i gavran', 'Ne vjeruj laskavcima.'], ['Kornjača i zec', 'Upornost pobjeđuje brzinu.'], ['Cvrčak i mrav', 'Tko radi na vrijeme, ne gladuje zimi.'],
  ['Lav i miš', 'I mali može pomoći velikome.'], ['Vuk i janje', 'Silnik uvijek nađe izgovor.'], ['Pastir i vuk', 'Lažljivcu se ne vjeruje ni kad govori istinu.']];
const USPOREDBE_2 = [['spor kao puž', true], ['lukav kao lisica', true], ['ponosan kao paun', true], ['Mačka spava.', false], ['visok kao toranj', true], ['Ptica leti.', false],
  ['okretan poput vjeverice', true], ['mudar kao sova', true], ['Pada snijeg.', false], ['tvrd kao kamen', true]];
function knjizevniTekstDodatak2() {
  const q = [];
  q.push(...obaSmjera(BAJKE, { pitajB: (a) => `Što se pojavljuje u bajci ${a}?`, pitajA: (b) => `U kojoj se bajci pojavljuje ${b}?`, tezina: 2 }));
  q.push(...obaSmjera(BASNE, { pitajB: (a) => `Koja je pouka basne ${a}?`, pitajA: (b) => `Koja basna ima pouku: ${b}`.replace(/\.$/, '?'), tezina: 3 }));
  q.push(...USPOREDBE_2.map(([izraz, jest]) => tocnoNetocno(`Krije li se usporedba u ${izraz.endsWith('.') ? `rečenici „${izraz}”` : `izrazu „${izraz}”`}?`, jest, 2,
    jest ? 'Nešto se uspoređuje riječju „kao” ili „poput”.' : 'Ništa se ne uspoređuje.')));
  q.push(...daNe([['Ima li basna obično pouku?', true], ['Događaju li se u bajkama čarolije?', true], ['Govore li životinje u basnama?', true],
    ['Je li brzalica pjesma za uspavljivanje?', false], ['Ima li pjesma stihove i kitice?', true], ['Je li ilustrator osoba koja piše priču?', false]], 2));
  return q;
}

// ── 3. razred: jezično izražavanje ──
const SLICNO_3B = [['brzo', 'žurno'], ['šetati', 'hodati polako'], ['vikati', 'derati se'], ['ljut', 'srdit'], ['umoran', 'iscrpljen'], ['čudan', 'neobičan'],
  ['najprije', 'prvo'], ['odmah', 'smjesta'], ['razgovor', 'dijalog'], ['priča', 'pripovijest']];
const PONASANJE_2 = [
  ['Učiteljica ti je pomogla riješiti zadatak. Što ćeš reći?', 'Hvala vam!', ['Konačno!', 'Bok!', 'Nazdravlje!']],
  ['Kasniš na sat. Što ćeš reći kad uđeš u razred?', 'Oprostite što kasnim.', ['Evo me!', 'Što me gledate?', 'Laku noć!']],
  ['Prijatelj ima rođendan. Što ćeš mu reći?', 'Sretan rođendan!', ['Sretan put!', 'Dobar tek!', 'Oprosti!']],
  ['Ulaziš u trgovinu u podne. Kako ćeš pozdraviti prodavača?', 'Dobar dan!', ['Laku noć!', 'Bok, frende!', 'Dobro jutro!']],
  ['Odlaziš na spavanje. Što ćeš reći roditeljima?', 'Laku noć!', ['Dobro jutro!', 'Dobar tek!', 'Doviđenja!']],
  ['Kako ćeš pristojno zamoliti prijatelja da ti doda loptu?', 'Molim te, dodaj mi loptu.', ['Daj loptu, brzo!', 'Lopta!', 'Hej, ti!']],
];
const VEZNE_2 = [
  ['Pala je kiša, ___ smo ostali kod kuće.', 'pa', ['ali', 'ili', 'nego']],
  ['Volim čitati ___ crtati.', 'i', ['ali', 'jer', 'nego']],
  ['Nisam išao van ___ sam bio bolestan.', 'jer', ['i', 'ali', 'ili']],
  ['___ ručka igrali smo se u parku.', 'Nakon', ['Prije nego', 'Zato', 'Ili']],
];
function jezicnoIzrazavanjeDodatak2() {
  const q = [];
  q.push(...obaSmjera(SLICNO_3B, { pitajB: (a) => `Kojom riječi ili izrazom možemo zamijeniti riječ ${a}?`, tezina: 2 }));
  q.push(...izTablice(PONASANJE_2, 1), ...izTablice(VEZNE_2.map(([r, ...x]) => [`Koja riječ dolazi na crtu: ${r}`.replace(/\.$/, '?'), ...x]), 2));
  return q;
}

// ── 4. razred: književnost ──
const SREDSTVA_2 = [['Drveće pleše na vjetru.', 'personifikacija'], ['Mijau, mijau, zove maca.', 'onomatopeja'], ['Kosa joj je zlatna kao žito.', 'usporedba'],
  ['Cvijeće se budi u proljeće.', 'personifikacija'], ['Zuj-zuj, leti bumbar.', 'onomatopeja'], ['Brz je poput strijele.', 'usporedba'], ['Zvijezde namiguju s neba.', 'personifikacija'],
  ['Pljus! Pade kamen u vodu.', 'onomatopeja']];
const OSOBINE = [['Lik uvijek pomaže drugima i dijeli sve što ima.', 'dobrota'], ['Lik se ne boji ući u mračnu šumu da spasi prijatelja.', 'hrabrost'],
  ['Lik svakodnevno vježba dok ne uspije.', 'upornost'], ['Lik se hvali da je najbolji u svemu.', 'hvalisavost'], ['Lik uzima tuđe stvari bez pitanja.', 'nepoštenje'],
  ['Lik priznaje grešku i ispriča se.', 'poštenje'], ['Lik ne želi ništa raditi i cijeli dan leži.', 'lijenost'], ['Lik se brine o bolesnoj životinji.', 'brižnost']];
function knjizevnost4Dodatak2() {
  const q = [];
  q.push(...SREDSTVA_2.map(([stih, s]) => izbor(`Koje se pjesničko sredstvo krije u stihu: ${stih.replace(/[.!]$/, '')}?`, s, ['personifikacija', 'onomatopeja', 'usporedba'].filter((x) => x !== s), 3)));
  q.push(...obaSmjera(OSOBINE, { pitajB: (a) => `Koju osobinu pokazuje ovaj opis: ${a.replace(/\.$/, '')}?`, tezina: 2 }));
  q.push(...daNe([['Je li fabula redoslijed događaja u priči?', true], ['Ima li roman obično više likova od basne?', true], ['Je li onomatopeja oponašanje zvukova riječima?', true],
    ['Je li personifikacija isto što i usporedba?', false], ['Može li sporedni lik pomagati glavnom liku?', true], ['Je li rasplet najnapetiji dio priče?', false],
    ['Završavaju li bajke često sretno?', true], ['Je li lirska pjesma dulja od romana?', false]], 2));
  return q;
}

// ── 4. razred: medijska kultura ──
const KNJIZNICA = [['osoba koja radi u knjižnici', 'knjižničar'], ['kartica kojom se posuđuju knjige', 'članska iskaznica'], ['knjiga s objašnjenjima riječi', 'rječnik'],
  ['knjiga s mnogo podataka o svemu, poredanih abecedno', 'enciklopedija'], ['knjiga sa zemljovidima', 'atlas'], ['tiskani medij koji izlazi svaki mjesec', 'časopis'],
  ['vrijeme do kojeg treba vratiti knjigu', 'rok posudbe'], ['popis knjiga koje knjižnica ima', 'katalog']];
const KAZALISTE = [['podignuti dio dvorane na kojem glume glumci', 'pozornica'], ['dio dvorane u kojem sjedi publika', 'gledalište'], ['tkanina koja se otvara na početku predstave', 'zastor'],
  ['predstava u kojoj glume lutke', 'lutkarska predstava'], ['predstava u kojoj se pjeva', 'opera'], ['predstava u kojoj se priča pokretom i plesom', 'balet'],
  ['osoba koja izvodi ulogu', 'glumac'], ['ljudi koji gledaju predstavu', 'publika']];
const EMISIJE = [['Želiš doznati što se danas dogodilo u svijetu.', 'vijesti'], ['Želiš znati hoće li sutra padati kiša.', 'vremensku prognozu'],
  ['Želiš gledati utakmicu uživo.', 'sportski prijenos'], ['Želiš naučiti kako žive pingvini.', 'dokumentarnu emisiju'], ['Želiš se nasmijati likovima iz crtića.', 'crtani film'],
  ['Želiš slušati pjesme.', 'glazbenu emisiju']];
const CINJENICA_2 = [['Hrvatska ima izlaz na more.', true], ['Ljeto je bolje od zime.', false], ['Mjesec kruži oko Zemlje.', true], ['Najbolji sladoled je od čokolade.', false],
  ['Godina ima dvanaest mjeseci.', true], ['Psi su ljepši od mačaka.', false], ['Dunav je rijeka.', true], ['Ta je knjiga dosadna.', false]];
function medijskaKulturaDodatak2() {
  const q = [];
  q.push(...obaSmjera(KNJIZNICA, { pitajB: (a) => `Koji pojam iz knjižnice odgovara opisu: ${a}?`, pitajA: (b) => `Što je u knjižnici ${b}?`, tezina: 2 }));
  q.push(...obaSmjera(KAZALISTE, { pitajB: (a) => `Koji kazališni pojam odgovara opisu: ${a}?`, pitajA: (b) => `Što je u kazalištu ${b}?`, tezina: 2 }));
  q.push(...obaSmjera(EMISIJE, { pitajB: (a) => `${a} Što ćeš gledati ili slušati?`, tezina: 1 }));
  q.push(...CINJENICA_2.map(([r, c]) => izbor(`Je li „${r}” činjenica ili mišljenje?`, c ? 'činjenica' : 'mišljenje', [c ? 'mišljenje' : 'činjenica'], 2,
    c ? 'To se može provjeriti u pouzdanim izvorima.' : 'To je nečije mišljenje; netko drugi može misliti drukčije.')));
  q.push(...daNe([['Treba li ograničiti vrijeme provedeno pred zaslonom?', true], ['Smiješ li prijatelju poslati tuđu fotografiju bez dopuštenja?', false],
    ['Može li reklama pretjerivati da bi proizvod izgledao bolje?', true], ['Treba li pri pisanju sastavka navesti odakle smo uzeli podatke?', true],
    ['Je li enciklopedija dobar izvor podataka za školski plakat?', true], ['Smiješ li u kazalištu za vrijeme predstave koristiti mobitel?', false]], 2));
  return q;
}

module.exports = {
  genGlagoli2: glagoli2Dodatak2, genGramatikaPravopis: gramatikaPravopisDodatak2, genKnjizevniTekst: knjizevniTekstDodatak2,
  genJezicnoIzrazavanje: jezicnoIzrazavanjeDodatak2, genKnjizevnost4: knjizevnost4Dodatak2, genMedijskaKultura: medijskaKulturaDodatak2,
};
