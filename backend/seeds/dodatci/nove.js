/**
 * dodatci/nove.js — dodatna pitanja za nove teme: Ja i drugi (1.–4.),
 * Računalo i sigurnost (1.–4.), Promet i bicikl (3.–4.).
 */
const { izbor, tocnoNetocno, poredaj, obaSmjera, sveTvrdnje, spajanja, izTablice, uzmi } = require('./pomocno');

// ═══ Ja i drugi ═══
const OSJECAJI = ['veselo', 'tužno', 'ljuto', 'uplašeno', 'ponosno', 'zabrinuto', 'iznenađeno', 'razočarano', 'sramežljivo'];
const SITUACIJE_OSJ = [
  ['Dobio si psića za rođendan.', 'veselo'], ['Izgubio si omiljenu igračku.', 'tužno'], ['Netko ti je prolio sok po crtežu i nasmijao se.', 'ljuto'],
  ['U mraku ne možeš pronaći prekidač za svjetlo.', 'uplašeno'], ['Naučio si plivati bez pomagala.', 'ponosno'], ['Mama kasni po tebe u školu, a već je mrak.', 'zabrinuto'],
  ['Baka te neočekivano dočeka ispred škole.', 'iznenađeno'], ['Nisi izabran u ekipu, a jako si želio igrati.', 'razočarano'], ['Moraš pjevati sam pred cijelom školom.', 'sramežljivo'],
  ['Tvoja je pjesma pobijedila na školskom natjecanju.', 'ponosno'], ['Kućni ljubimac ti se razbolio.', 'zabrinuto'], ['Prijatelj ti je pokvario igračku i nije se ispričao.', 'ljuto'],
  ['Na izletu ste vidjeli srnu iz blizine.', 'iznenađeno'], ['Djed ti je otišao živjeti daleko.', 'tužno'], ['Tijekom oluje grmi vrlo glasno.', 'uplašeno'],
  ['Završila je škola i počinju praznici.', 'veselo'], ['Obećani posjet zoološkom vrtu je otkazan.', 'razočarano'], ['Riješio si težak zadatak sam.', 'ponosno'],
];
const PONASANJE = [
  ['Prijatelj ti je posudio olovku. Što ćeš reći?', 'hvala', ['ništa', 'odlazi', 'daj još']],
  ['Kako ćeš zamoliti sestru da ti doda kruh?', 'Molim te, dodaj mi kruh.', ['Kruh, odmah!', 'Daj to!', 'Ništa ne kažem.']],
  ['Slučajno si nekome stao na nogu. Što ćeš reći?', 'Oprosti!', ['Hvala!', 'Bravo!', 'Laku noć!']],
  ['Ulaziš u učionicu u kojoj je nastava. Što ćeš učiniti?', 'pokucati i pozdraviti', ['ući vičući', 'zalupiti vratima', 'ući bez riječi i trčati']],
  ['Odrasla osoba razgovara, a ti nešto trebaš. Što ćeš učiniti?', 'pričekati da završi i reći „oprostite”', ['vući je za rukav', 'vikati', 'prekinuti je']],
  ['Prijatelj ti priča nešto važno. Kako ćeš ga slušati?', 'pažljivo, gledajući ga', ['okrenut leđima', 'pjevajući', 'gledajući u mobitel']],
  ['Kako ćeš se ponašati za stolom kod prijatelja?', 'pristojno, ne govorim punih usta', ['bacam hranu', 'vičem', 'ližem tanjur']],
  ['Prijatelj je izgubio u igri. Što ćeš reći?', 'Dobro si igrao, idući put možda pobijediš.', ['Ha-ha, izgubio si!', 'Ti ništa ne znaš.', 'Ne igram više s tobom.']],
];
const POMOC = [
  ['Učiteljica nosi mnogo knjiga. Kako možeš pomoći?', 'ponudim da ponesem dio knjiga', ['prođem pokraj nje', 'smijem se', 'zatvorim joj vrata']],
  ['Mlađi brat ne može dohvatiti igračku na polici. Što ćeš učiniti?', 'dohvatit ću mu je', ['sakriti je više', 'reći mu da ode', 'uzeti je za sebe']],
  ['Prijatelj je bolestan i nije bio u školi. Kako mu možeš pomoći?', 'javiti mu što je za zadaću', ['ništa mu ne reći', 'rugati mu se', 'uzeti mu mjesto']],
  ['Novi susjed ne zna gdje je škola. Što ćeš učiniti?', 'pokazati mu put', ['poslati ga krivim putem', 'pobjeći', 'ne odgovoriti']],
  ['Prijateljici je ispala torba i sve se rasulo. Što ćeš učiniti?', 'pomoći joj skupiti stvari', ['smijati se', 'otići', 'uzeti nešto za sebe']],
];
const PRAVA = [['pravo na obrazovanje', 'svako dijete smije ići u školu'], ['pravo na igru i odmor', 'dijete ima slobodno vrijeme za igru'], ['pravo na zdravstvenu zaštitu', 'bolesno dijete ima pravo na liječnika'],
  ['pravo na ime i državljanstvo', 'svako dijete ima ime i pripada nekoj državi'], ['pravo na vlastito mišljenje', 'dijete smije reći što misli'], ['pravo na zaštitu od nasilja', 'nitko ne smije tući ni ponižavati dijete'],
  ['pravo na obitelj', 'dijete ima pravo živjeti uz roditelje ili skrbnike'], ['pravo na privatnost', 'nitko ne smije čitati djetetov dnevnik bez dopuštenja']];
const DUZNOSTI = [
  ['Koja je dužnost učenika u školi?', 'poštovati pravila i druge učenike', ['dolaziti kad želi', 'ometati nastavu', 'uništavati klupe']],
  ['Koja je dužnost djeteta kod kuće?', 'pomagati u kućanskim poslovima prema svojoj dobi', ['ne raditi ništa', 'razbacivati stvari', 'vikati na ukućane']],
  ['Što je dužnost svakoga prema prirodi?', 'čuvati je i ne onečišćavati', ['bacati smeće', 'lomiti grane', 'paliti vatru u šumi']],
  ['Što znači poštovati tuđe pravo?', 'ne smetati drugima da koriste svoja prava', ['raditi samo ono što ja hoću', 'uzimati tuđe stvari', 'smijati se drugima']],
  ['Kome se djeca mogu obratiti kad su im prava povrijeđena?', 'roditeljima, učiteljima ili pravobraniteljici za djecu', ['nikome', 'samo prijateljima iz igre', 'nepoznatima na internetu']],
  ['Koji je dokument zaštitio prava djece u cijelom svijetu?', 'Konvencija o pravima djeteta', ['školski raspored', 'vozni red', 'kuharica']],
];
const SUKOB = [
  ['Ti i prijatelj želite istu loptu. Kako ćete riješiti problem?', 'dogovorit ćemo se da je koristimo naizmjence', ['otet ću je', 'gurnut ću ga', 'bacit ću je preko ograde']],
  ['Netko te namjerno vrijeđa. Što je najbolje učiniti?', 'mirno reći da prestane i reći odrasloj osobi', ['udariti ga', 'vrijeđati ga još gore', 'plakati i šutjeti zauvijek']],
  ['Što je dobro učiniti prije nego što odgovoriš kad si jako ljut?', 'duboko udahnuti i izbrojiti do deset', ['odmah vikati', 'baciti nešto', 'zalupiti vratima']],
  ['Kako se kaže što osjećaš, a da ne vrijeđaš drugoga?', 'Ljut sam jer si mi uzeo bojice bez pitanja.', ['Ti si glup!', 'Nikad više ne pričam s tobom!', 'Mrzim te!']],
  ['Što je kompromis?', 'dogovor u kojem svatko malo popusti', ['pobjeda samo jednoga', 'svađa bez kraja', 'kazna za oboje']],
];
const JID_DA_NE_12 = [['Pomažemo li prijatelju kad je tužan?', true], ['Je li u redu smijati se nekome tko je pao?', false], ['Kažemo li „hvala” kad nešto dobijemo?', true],
  ['Je li u redu uzeti tuđu stvar bez pitanja?', false], ['Smijemo li reći kako se osjećamo?', true], ['Je li dobro podijeliti igračke s drugima?', true], ['Je li u redu vikati na druge?', false],
  ['Pozdravljamo li kad uđemo u trgovinu?', true], ['Je li dobro ispričati se kad pogriješimo?', true], ['Je li u redu udariti nekoga kad smo ljuti?', false]];
const JID_DA_NE_34 = [['Ima li svako dijete pravo na obrazovanje?', true], ['Smije li netko čitati tvoj dnevnik bez dopuštenja?', false], ['Uz prava imamo li i dužnosti?', true],
  ['Je li u redu isključiti nekoga iz igre zbog boje kože?', false], ['Je li volontiranje pomaganje drugima bez plaće?', true], ['Treba li poštovati ljude koji imaju drukčije običaje?', true],
  ['Smije li odrasla osoba tući dijete?', false], ['Može li razgovor pomoći u rješavanju svađe?', true], ['Je li ruganje zbog izgleda u redu ako je „samo šala”?', false],
  ['Smiju li djeca sudjelovati u odlukama koje se njih tiču?', true]];
const osjPitanje = ([s, o]) => izbor(`${s} Kako se vjerojatno osjećaš?`, o, uzmi(OSJECAJI.filter((x) => x !== o), 3), 1);
function jaIDrugi12() {
  return [...SITUACIJE_OSJ.map(osjPitanje), ...izTablice(PONASANJE, 1), ...izTablice(POMOC, 1), ...JID_DA_NE_12.map(([p, t]) => tocnoNetocno(p, t, 1)),
    ...izTablice(SUKOB.slice(0, 3), 2)];
}
function jaIDrugi34() {
  return [...SITUACIJE_OSJ.map(osjPitanje), ...izTablice(SUKOB, 2), ...izTablice(DUZNOSTI, 2), ...izTablice(POMOC, 1),
    ...obaSmjera(PRAVA, { pitajB: (a) => `Koji primjer pokazuje ${a}?`, pitajA: (b) => `Koje se pravo djeteta vidi u primjeru: ${b}?`, tezina: 2 }),
    ...spajanja(PRAVA, 'Spoji pravo djeteta s primjerom:', { koliko: 4, komada: 2 }), ...JID_DA_NE_34.map(([p, t]) => tocnoNetocno(p, t, 2))];
}

// ═══ Računalo i sigurnost ═══
const UREDJAJI = [['pametni telefon', true], ['tablet', true], ['prijenosno računalo', true], ['pametni sat', true], ['digitalni fotoaparat', true], ['igraća konzola', true],
  ['e-čitač knjiga', true], ['olovka', false], ['kišobran', false], ['drvena žlica', false], ['bilježnica', false], ['lopta', false], ['papirnata karta', false], ['ravnalo', false]];
const ULAZ_IZLAZ = [['tipkovnica', 'ulazni'], ['miš', 'ulazni'], ['mikrofon', 'ulazni'], ['kamera', 'ulazni'], ['skener', 'ulazni'], ['dodirna ploča (touchpad)', 'ulazni'],
  ['zaslon', 'izlazni'], ['pisač', 'izlazni'], ['zvučnici', 'izlazni'], ['slušalice', 'izlazni'], ['projektor', 'izlazni']];
const TIPKE = [['Enter', 'potvrđuje unos ili prelazi u novi red'], ['razmaknica', 'stavlja razmak između riječi'], ['Backspace', 'briše znak lijevo od pokazivača'],
  ['Shift', 'uz slovo piše veliko slovo'], ['Caps Lock', 'uključuje pisanje svih velikih slova'], ['Delete', 'briše znak desno od pokazivača']];
const POJMOVI_NET = [['mrežni preglednik', 'program kojim otvaramo mrežne stranice'], ['tražilica', 'stranica u kojoj upisujemo riječi da pronađemo podatke'],
  ['poveznica', 'tekst ili slika na koju kliknemo da otvorimo drugu stranicu'], ['e-pošta', 'slanje pisama preko interneta'], ['privitak', 'datoteka poslana uz poruku'],
  ['korisničko ime', 'ime kojim se prijavljujemo u aplikaciju'], ['lozinka', 'tajna riječ koja štiti naš račun'], ['odjava', 'izlazak iz svojeg računa'],
  ['datoteka', 'spremljeni rad na računalu, npr. crtež ili tekst'], ['mapa', 'mjesto u koje spremamo više datoteka zajedno']];
const NAREDBE = [['Spremi', 'sprema rad da ga ne izgubimo'], ['Otvori', 'otvara spremljenu datoteku'], ['Kopiraj', 'pravi kopiju označenoga'], ['Zalijepi', 'umeće kopirano na novo mjesto'],
  ['Izreži', 'uklanja označeno da ga premjestimo'], ['Ispis', 'šalje dokument na pisač'], ['Poništi', 'vraća posljednju radnju']];
const RAC_DA_NE = [['Treba li lozinka imati slova, brojke i znakove?', true], ['Je li lozinka 123456 sigurna?', false], ['Smiješ li dati lozinku nepoznatoj osobi koja kaže da je iz igrice?', false],
  ['Treba li svoj rad redovito spremati?', true], ['Može li virus oštetiti računalo?', true], ['Smiješ li preuzimati programe s nepoznatih stranica bez pitanja odraslih?', false],
  ['Je li pisač ulazni uređaj?', false], ['Je li mikrofon ulazni uređaj?', true], ['Treba li se odjaviti s tuđega računala?', true], ['Može li netko na internetu lagati o tome tko je?', true],
  ['Je li pristojno pisati poruke samo velikim slovima?', false], ['Treba li provjeriti podatak u više izvora?', true]];
const LOZINKE = () => {
  const jake = ['Plavi#Konj27', 'Sunce!Kiša48', 'Zeleni&Most19', 'Tri*Mačke55', 'Brzi$Puž63', 'Ljetni%Val81'];
  const slabe = ['lozinka', '123456', 'ana2015', 'qwerty', 'aaaaaa', 'mojpas', '111111', 'ivan'];
  const tko = ['Mia', 'Luka', 'Ema', 'Toni', 'Sara', 'Filip'];
  return jake.map((j, i) => izbor(`${tko[i]} bira lozinku za školski račun. Koja je najsigurnija?`, j, uzmi(slabe, 3), 2,
    'Sigurna lozinka je duga i ima velika i mala slova, brojke i posebne znakove.'));
};
function digitalni12() {
  const q = [];
  q.push(...UREDJAJI.map(([u, d]) => tocnoNetocno(`Je li ${u} digitalni uređaj?`, d, 1)));
  q.push(...obaSmjera(TIPKE.slice(0, 4), { pitajB: (a) => `Što radi tipka ${a}?`, pitajA: (b) => `Koja tipka ${b}?`, tezina: 2 }));
  q.push(...RAC_DA_NE.slice(0, 9).map(([p, t]) => tocnoNetocno(p, t, 1)));
  q.push(...izTablice([
    ['Što trebaš učiniti kad završiš s radom na tabletu?', 'isključiti ga ili spremiti na sigurno mjesto', ['baciti ga na krevet', 'ostaviti ga na podu', 'staviti ga u vodu']],
    ['Čime pomičemo strelicu na zaslonu računala?', 'mišem', ['zvučnikom', 'pisačem', 'kamerom']],
    ['Čime pišemo slova u računalo?', 'tipkovnicom', ['zaslonom', 'zvučnikom', 'pisačem']],
    ['Na čemu vidimo slike i tekst na računalu?', 'na zaslonu', ['na tipkovnici', 'na mišu', 'na mikrofonu']],
    ['Kako se zove uređaj koji ispisuje tekst na papir?', 'pisač', ['skener', 'miš', 'mikrofon']],
    ['Što radimo kad nam se na zaslonu pojavi nešto što nas plaši?', 'zatvorimo i kažemo odraslima', ['nastavimo gledati', 'pošaljemo prijateljima', 'šutimo']],
  ], 1));
  return q;
}
function digitalni34() {
  const q = [];
  q.push(...ULAZ_IZLAZ.map(([u, v]) => izbor(`Je li ${u} ulazni ili izlazni uređaj?`, v, [v === 'ulazni' ? 'izlazni' : 'ulazni'], 2,
    v === 'ulazni' ? 'Njime unosimo podatke u računalo.' : 'Njime računalo pokazuje ili pušta rezultat.')));
  q.push(...obaSmjera(TIPKE, { pitajB: (a) => `Čemu služi tipka ${a}?`, pitajA: (b) => `Koja tipka ${b}?`, tezina: 2 }));
  q.push(...obaSmjera(POJMOVI_NET, { pitajB: (a) => `Što je ${a}?`, pitajA: (b) => `Kako zovemo: ${b}?`, tezina: 2 }));
  q.push(...obaSmjera(NAREDBE, { pitajB: (a) => `Što radi naredba ${a}?`, pitajA: (b) => `Koja naredba ${b}?`, tezina: 2 }));
  q.push(...RAC_DA_NE.map(([p, t]) => tocnoNetocno(p, t, 2)), ...LOZINKE());
  return q;
}

// ═══ Promet i bicikl ═══
const ZNAKOVI = [['trokut s crvenim rubom i jelenom', 'divljač na cesti'], ['trokut s crvenim rubom i pješakom', 'pješaci na cesti'], ['trokut s crvenim rubom i vlakom', 'prijelaz preko pruge'],
  ['crveni krug s bijelom vodoravnom crtom', 'zabrana prometa u jednom smjeru'], ['crveni krug s precrtanim pješakom', 'zabrana prometa pješacima'], ['plavi krug sa strelicom ravno', 'obavezan smjer ravno'],
  ['plavi pravokutnik sa slovom P', 'parkiralište'], ['plavi pravokutnik s bijelim slovom H', 'bolnica'], ['osmerokut s natpisom STOP', 'obavezno zaustavljanje'],
  ['obrnuti trokut s crvenim rubom', 'raskrižje s cestom s prednošću prolaska']];
const BICIKL = [['zvonce', 'upozorava druge sudionike u prometu'], ['kočnice', 'zaustavljaju bicikl'], ['prednje bijelo svjetlo', 'osvjetljava put i čini bicikl vidljivim sprijeda'],
  ['stražnje crveno svjetlo', 'čini bicikl vidljivim straga'], ['katadiopteri (reflektori)', 'odbijaju svjetlo automobila'], ['kaciga', 'štiti glavu pri padu'], ['blatobran', 'štiti od prskanja blata']];
const PROMET_DA_NE = [['Smije li biciklist voziti s dvoje djece na jednom sjedalu?', false], ['Treba li bicikl imati ispravne kočnice?', true], ['Smije li biciklist slušati glazbu na slušalicama u vožnji?', false],
  ['Treba li biciklist poštivati semafor?', true], ['Smije li biciklist voziti nogostupom gdje hodaju pješaci?', false], ['Treba li pješak prelaziti cestu na zeleno svjetlo?', true],
  ['Smiješ li prijeći prugu kad se spušta rampa?', false], ['Je li dobro noću nositi reflektirajući prsluk?', true], ['Upozorava li trokut s crvenim rubom na opasnost?', true],
  ['Zabranjuje li plavi krug neku radnju?', false], ['Smije li biciklist voziti jednom rukom dok pokazuje skretanje?', true], ['Treba li na pješačkom prijelazu ipak pogledati lijevo i desno?', true]];
const SUDIONICI = [['Tko su sudionici u prometu?', 'pješaci, biciklisti i vozači', ['samo vozači', 'samo policajci', 'samo pješaci']],
  ['Tko upravlja prometom na raskrižju kad semafor ne radi?', 'prometni policajac', ['prodavač', 'učitelj', 'vozač autobusa']],
  ['Kako se zove mjesto gdje se križaju ceste?', 'raskrižje', ['pločnik', 'parkiralište', 'tunel']],
  ['Što znači žuto trepćuće svjetlo na semaforu?', 'pojačaj oprez, semafor ne radi uobičajeno', ['slobodan prolaz bez gledanja', 'obavezno stani i čekaj sat vremena', 'parkiraj']],
  ['Kada smijemo voziti bicikl po cesti bez pratnje odrasle osobe?', 'kad navršimo propisanu dob i položimo biciklistički ispit', ['čim naučimo okretati pedale', 'nikad', 'samo noću']]];
function promet() {
  const q = [];
  q.push(...obaSmjera(ZNAKOVI, { pitajB: (a) => `Što znači prometni znak: ${a}?`, pitajA: (b) => `Kako izgleda prometni znak koji označava: ${b}?`, tezina: 2 }));
  q.push(...obaSmjera(BICIKL, { pitajB: (a) => `Čemu na biciklu služi: ${a}?`, pitajA: (b) => `Koji dio opreme bicikla ${b}?`, tezina: 2 }));
  q.push(...PROMET_DA_NE.map(([p, t]) => tocnoNetocno(p, t, 2)), ...izTablice(SUDIONICI, 2));
  q.push(poredaj('Poredaj što radiš prije nego što kreneš biciklom.', ['Stavim kacigu.', 'Provjerim kočnice i svjetla.', 'Pogledam oko sebe.', 'Krenem uz desni rub ceste.'], 2));
  return q;
}

// ── dodatne tablice i tvrdnje Da/Ne (sva uparivanja) ──
const OSJ_PRIDJEV = { veselo: 'veselo', tužno: 'tužno', ljuto: 'ljuto', uplašeno: 'uplašeno', ponosno: 'ponosno', zabrinuto: 'zabrinuto', iznenađeno: 'iznenađeno', razočarano: 'razočarano', sramežljivo: 'sramežljivo' };
const RIJECI_PRILIKE = [['kad nešto dobiješ', 'hvala'], ['kad nešto tražiš', 'molim'], ['kad nekoga slučajno gurneš', 'oprosti'], ['kad ujutro sretneš susjeda', 'dobro jutro'],
  ['kad odlaziš iz posjeta', 'doviđenja'], ['kad netko kihne', 'nazdravlje'], ['prije jela', 'dobar tek'], ['kad netko ima rođendan', 'sretan rođendan'],
  ['kad ideš spavati', 'laku noć'], ['kad netko kreće na put', 'sretan put']];
const UREDJAJ_SLUZI = [['mikrofon', 'snimanje glasa'], ['kamera', 'snimanje slike i videa'], ['zvučnici', 'puštanje zvuka'], ['slušalice', 'slušanje bez ometanja drugih'],
  ['pisač', 'ispisivanje na papir'], ['punjač', 'punjenje baterije'], ['tipkovnica', 'pisanje slova i brojeva'], ['miš', 'pomicanje strelice na zaslonu'], ['zaslon', 'prikazivanje slike i teksta']];
const ZDRAVO_UZ_ZASLON = [['Je li dobro nakon igranja na tabletu izaći van i igrati se?', true], ['Trebaš li tablet koristiti dok jedeš ručak s obitelji?', false],
  ['Je li u redu da roditelji odrede koliko dugo smiješ igrati igrice?', true], ['Smiješ li uzeti mamin mobitel i kupiti nešto u igrici?', false],
  ['Trebaš li prekinuti igru ako te boli glava ili oči?', true], ['Je li dobro gledati crtiće cijeli dan?', false], ['Treba li uređaj puniti samo uz pomoć odrasle osobe?', true],
  ['Smiješ li fotografirati druge bez njihova dopuštenja?', false]];
function jidTvrdnje12() {
  return [
    ...sveTvrdnje(SITUACIJE_OSJ, (a, b) => `${a} Osjećaš li se vjerojatno ${OSJ_PRIDJEV[b]}?`, { lazni: 1, tezina: 1 }),
    ...obaSmjera(RIJECI_PRILIKE, { pitajB: (a) => `Što kažeš ${a}?`, tezina: 1 }),
    ...sveTvrdnje(RIJECI_PRILIKE, (a, b) => `Kažemo li „${b}” ${a}?`, { lazni: 1, tezina: 1 }),
  ];
}
function jidTvrdnje34() {
  return [
    ...sveTvrdnje(SITUACIJE_OSJ, (a, b) => `${a} Osjećaš li se vjerojatno ${OSJ_PRIDJEV[b]}?`, { lazni: 1, tezina: 1 }),
    ...sveTvrdnje(PRAVA, (a, b) => `Je li „${b}” primjer za ${a}?`, { lazni: 2 }),
  ];
}
function digTvrdnje12() {
  return [
    ...obaSmjera(UREDJAJ_SLUZI, { pitajB: (a) => `Čemu služi ${a}?`, pitajA: (b) => `Koji uređaj koristimo kad nam treba ovo: ${b}?`, tezina: 1 }),
    ...sveTvrdnje(UREDJAJ_SLUZI, (a, b) => `Služi li ${a} za ${b}?`.replace(/^Služi li (zvučnici|slušalice) /, 'Služe li $1 '), { lazni: 2, tezina: 1 }),
    ...ZDRAVO_UZ_ZASLON.map(([p, t]) => tocnoNetocno(p, t, 1)),
  ];
}
function digTvrdnje34() {
  return [
    ...sveTvrdnje(ULAZ_IZLAZ, (a, b) => `Je li ${a} ${b} uređaj?`.replace(/^Je li (zvučnici|slušalice) (\S+) uređaj\?$/, (m, x, y) => `Jesu li ${x} ${y.replace(/i$/, 'i')} uređaji?`), { lazni: 1 }),
    ...sveTvrdnje(TIPKE, (a, b) => `Je li točno da tipka ${a} ${b}?`, { lazni: 2 }),
    ...sveTvrdnje(NAREDBE, (a, b) => `Je li točno da naredba ${a} ${b}?`, { lazni: 2 }),
  ];
}
function prometTvrdnje() {
  return [
    ...sveTvrdnje(ZNAKOVI, (a, b) => `Znači li prometni znak „${a}” ovo: ${b}?`, { lazni: 2 }),
    ...sveTvrdnje(BICIKL.filter(([a]) => !['kočnice', 'katadiopteri (reflektori)'].includes(a)), (a, b) => `Je li točno da ${a} ${b}?`, { lazni: 2 }),
  ];
}

module.exports = {
  genJaIDrugi1: () => [...jaIDrugi12(), ...jidTvrdnje12()], genJaIDrugi2: () => [...jaIDrugi12(), ...jidTvrdnje12()],
  genJaIDrugi3: () => [...jaIDrugi34(), ...jidTvrdnje34()], genJaIDrugi4: () => [...jaIDrugi34(), ...jidTvrdnje34()],
  genDigitalniSvijet1: () => [...digitalni12(), ...digTvrdnje12()], genDigitalniSvijet2: () => [...digitalni12(), ...digTvrdnje12()],
  genDigitalniSvijet3: () => [...digitalni34(), ...digTvrdnje34()], genDigitalniSvijet4: () => [...digitalni34(), ...digTvrdnje34()],
  genPromet3: () => [...promet(), ...prometTvrdnje()], genPromet4: () => [...promet(), ...prometTvrdnje()],
};
