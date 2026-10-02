/**
 * Ja i drugi — 1.–4. razred (Priroda i društvo, domena C „Pojedinac i
 * društvo”, i međupredmetne teme Osobni i socijalni razvoj te Građanski odgoj).
 *
 * Spaja četiri područja iz ISTRAZIVANJE-PODRUCJA.md: lijepo ponašanje, humane
 * vrednote, emocionalnu inteligenciju i dječja prava.
 *
 * Ishodi (MPT, ciklus 1 = 1.–2. r., ciklus 2 = 3.–5. r.):
 *   osr A.x.2 upravlja emocijama i ponašanjem
 *   osr B.x.1 prepoznaje i uvažava potrebe i osjećaje drugih
 *   osr B.x.2 razvija komunikacijske kompetencije
 *   osr B.x.3 razvija strategije rješavanja sukoba
 *   goo A     ponaša se u skladu s dječjim i ljudskim pravima
 *
 * Situacije su pisane u drugom licu prezenta („Prijatelj ti se seli…”), pa
 * nema rodnih oblika. Osjećaji su prilozi (veselo, tužno…), isti za svakoga.
 * Kod osjećaja se pita „vjerojatno”: ometači su osjećaji koji u toj situaciji
 * ne odgovaraju, a bliski osjećaji (npr. tužno uz razočarano) se ne nude.
 */
const { uzmi, jedan, izbor, tocnoNetocno, spoji, poredaj } = require('./gen-pomocno');

const osr = (razred, kod) => `osr ${kod.replace('x', razred <= 2 ? '1' : '2')}`;
const goo = (razred) => `goo A.${razred <= 2 ? 1 : 2}.1`;

// ── Osjećaji ────────────────────────────────────────────────────────
// [osjećaj, od razreda, situacije: [tekst, bliski osjećaji koji se ne nude]]
const OSJECAJI = [
  ['veselo', 1, [
    ['Sutra ideš na izlet koji jedva čekaš.', []],
    ['Prijatelji te pozovu da se igraš s njima.', []],
    ['Napokon je pao prvi snijeg i izlaziš se sanjkati.', ['iznenađeno']],
  ]],
  ['tužno', 1, [
    ['Tvoj najbolji prijatelj seli se u drugi grad.', ['zabrinuto', 'razočarano']],
    ['Prijatelj ti kaže da se više ne želi družiti s tobom.', ['ljuto', 'razočarano', 'posramljeno']],
  ]],
  ['ljuto', 1, [
    ['Netko ti bez pitanja uzme bojice i polomi ih.', ['tužno', 'razočarano']],
    ['Brat ti namjerno sruši kulu od kocaka.', ['tužno', 'razočarano']],
  ]],
  ['uplašeno', 1, [
    ['Noću čuješ čudan zvuk iza vrata.', ['iznenađeno', 'zabrinuto']],
    ['U parku ti se približava velik pas koji glasno laje.', ['iznenađeno', 'zabrinuto']],
  ]],
  ['iznenađeno', 2, [
    ['Otvoriš vrata, a svi prijatelji uzviknu „Iznenađenje!”', ['veselo']],
    ['Pogledaš kroz prozor, a usred proljeća pada snijeg.', ['uplašeno', 'veselo']],
  ]],
  ['ponosno', 3, [
    ['Nakon dugog vježbanja napokon voziš bicikl bez pomoći.', ['veselo']],
    ['Učiteljica pohvali tvoj crtež pred cijelim razredom.', ['veselo', 'posramljeno']],
  ]],
  ['zabrinuto', 3, [
    ['Sutra pišeš ispit, a neke zadatke još ne razumiješ.', ['uplašeno']],
    ['Baka je u bolnici, a ti čekaš vijesti o njoj.', ['tužno', 'uplašeno']],
  ]],
  ['razočarano', 3, [
    ['Pada kiša, pa je dugo čekani izlet otkazan.', ['tužno', 'ljuto']],
    ['Utakmica koju jedva čekaš otkazana je.', ['tužno', 'ljuto']],
  ]],
  ['posramljeno', 4, [
    ['Pred cijelim razredom ti ispadne torba i sve iz nje se rasprši po podu.', ['uplašeno', 'iznenađeno']],
    ['Na priredbi pred roditeljima zaboraviš riječi pjesme.', ['uplašeno', 'tužno', 'zabrinuto']],
  ]],
  ['ljubomorno', 4, [
    ['Roditelji se cijeli dan bave novom bebom, a s tobom manje nego prije.', ['tužno', 'zabrinuto']],
  ]],
];
const LICA = [
  ['😀', 'veselo', 'Usta se smiješe, a oči su vedre.'], ['😢', 'tužno', 'Niz obraz teče suza, a kutovi usta su spušteni.'],
  ['😠', 'ljuto', 'Obrve su namrštene i spuštene prema nosu.'], ['😨', 'uplašeno', 'Oči su široko otvorene, a lice je problijedjelo.'],
  ['😲', 'iznenađeno', 'Oči i usta su širom otvoreni.'],
];

const SMIRIVANJE_DOBRO = ['duboko udahneš i polako izdahneš', 'polako izbrojiš do deset', 'kažeš odrasloj osobi što osjećaš', 'odeš na mirno mjesto da se smiriš'];
const SMIRIVANJE_LOSE = ['udariš onoga tko te naljutio', 'bacaš stvari po podu dok ne prođe', 'vičeš na sve koji su oko tebe', 'razbiješ igračku da se ispušeš'];

// [situacija, dobar postupak, loši postupci]
const POMOC = [
  ['Novi učenik sjedi sam pod odmorom.', 'pozoveš ga da se igra s vama', ['praviš se da ga ne vidiš', 'smiješ mu se s drugima', 'kažeš mu da ode odande']],
  ['Prijatelj je zaboravio užinu.', 'podijeliš svoju užinu s njim', ['pojedeš svoju užinu pred njim', 'smiješ mu se jer je zaboravio', 'kažeš svima da je zaboravio']],
  ['Prijateljica je pala na igralištu i plače.', 'pitaš je treba li pomoć', ['nastaviš se igrati dalje', 'smiješ se jer je pala', 'kažeš joj da prestane plakati']],
  ['Učenik iz klupe ne razumije zadatak.', 'objasniš mu kako ga ti rješavaš', ['daš mu da prepiše rezultat', 'kažeš mu da je spor', 'praviš se da ne čuješ']],
  ['Vidiš da nekoga u razredu stalno zadirkuju.', 'kažeš to učiteljici ili učitelju', ['smiješ se zajedno s ostalima', 'pridružiš se zadirkivanju', 'snimaš to mobitelom']],
  ['Susjeda nosi teške vrećice uz stepenice.', 'ponudiš joj da pomogneš nositi', ['brzo prođeš pokraj nje', 'čekaš da ona tebi ponudi', 'gledaš u mobitel dok prolaziš']],
];

const CAROBNE = [
  ['kad nešto tražiš', 'molim'], ['kad nešto dobiješ', 'hvala'], ['kad nekoga slučajno gurneš', 'oprosti'],
  ['kad ujutro uđeš u razred', 'dobro jutro'], ['kad odlaziš iz posjeta', 'doviđenja'],
];

const PONASANJE = [
  ['Ustupamo li mjesto u autobusu starijoj osobi?', true, 'Starijima je teže stajati u vožnji, pa im ustupamo mjesto.', 2],
  ['Je li pristojno razgovarati punih usta?', false, 'Prvo progutamo zalogaj, a onda govorimo.', 1],
  ['Kucamo li prije ulaska u tuđu sobu?', true, 'Kucanjem pitamo smijemo li ući.', 1],
  ['Je li u redu prekidati nekoga dok govori?', false, 'Saslušamo do kraja, a zatim kažemo svoje.', 1],
  ['Pozdravljamo li susjede kad ih sretnemo?', true, 'Pozdrav pokazuje poštovanje prema drugima.', 1],
  ['Je li u redu rugati se nekome zato što drugačije izgleda ili govori?', false, 'Svi smo različiti i svi zaslužujemo poštovanje.', 2],
  ['Je li u redu nekoga isključiti iz igre zato što je nov u razredu?', false, 'Novom učeniku je lakše kad ga prihvatimo u igru.', 2],
  ['Je li u redu pokazati tugu i reći drugima kako se osjećaš?', true, 'Svi osjećaji su u redu. Kad ih kažemo, drugi nam mogu pomoći.', 2],
];

// ── Dječja prava ────────────────────────────────────────────────────
const PRAVA = [
  ['pravo na obrazovanje', 'ide u školu i uči'], ['pravo na igru i odmor', 'igra se s prijateljima'],
  ['pravo na zdravstvenu zaštitu', 'ide liječniku kad je bolesno'], ['pravo na vlastito mišljenje', 'smije reći što misli'],
  ['pravo na zaštitu od nasilja', 'nitko ga ne smije ozlijediti'], ['pravo na ime', 'ima svoje ime i prezime'],
];
const PRAVO_KRATKO = ['ići u školu i učiti', 'igrati se i odmarati', 'dobiti liječničku pomoć', 'reći svoje mišljenje', 'biti zaštićeno od nasilja'];
const ZELJE = ['imati najnoviji mobitel', 'dobivati džeparac svaki dan', 'ići spavati kad poželi', 'jesti slatkiše za ručak'];
const DUZNOSTI = ['redovito pisati zadaću', 'poštovati druge učenike', 'čuvati školske stvari', 'pažljivo slušati na nastavi'];
const NISU_DUZNOSTI = ['birati što će se učiti na satu', 'odlučivati kad počinje nastava', 'ocjenjivati svoje učitelje', 'zabranjivati drugima igru'];

const JA_PORUKE = ['Ljutim se kad mi uzmeš olovku bez pitanja.', 'Tužno mi je kad me ne pozovete u igru.', 'Smeta mi kad me prekidaš dok govorim.'];
const TI_PORUKE = ['Ti si zločest i bezobrazan, ne pričam s tobom!', 'Odlazi od mene i ne vraćaj se više ovamo!', 'Vrati mi to odmah ili ćeš zažaliti!', 'Više nisi moj prijatelj i gotovo!'];

function genJaIDrugi(razred) {
  const q = [];
  const dostupni = OSJECAJI.filter(([, od]) => od <= razred);
  const imena = dostupni.map(([o]) => o);

  // Osjećaj u situaciji
  for (const [osjecaj, , situacije] of uzmi(dostupni, razred <= 2 ? 3 : 4)) {
    const [tekst, bliski] = jedan(situacije);
    q.push(izbor(`${tekst} Kako se vjerojatno osjećaš?`, osjecaj, imena.filter((x) => !bliski.includes(x)),
      razred <= 2 ? 1 : 2,
      `U takvoj situaciji većina ljudi osjeća se ${osjecaj}. Kad prepoznaš svoj osjećaj, lakše ga možeš reći drugima.`,
      osr(razred, 'A.x.2')));
  }
  // Lice (1. i 2. r.)
  if (razred <= 2) {
    for (const [lice, osjecaj, opis] of uzmi(LICA.slice(0, razred === 1 ? 4 : 5), 2)) {
      q.push(izbor('Kako se osjeća lice na slici?', osjecaj, LICA.map((l) => l[1]), 1,
        `${opis} Tako izgleda lice kad se netko osjeća ${osjecaj}.`, osr(razred, 'B.x.1'), { visual: lice }));
    }
  }
  // Smirivanje
  q.push(izbor('Kad te obuzme ljutnja, što ti može pomoći da se smiriš?', jedan(SMIRIVANJE_DOBRO), SMIRIVANJE_LOSE, 1,
    'Disanje, brojanje i razgovor smiruju tijelo i misli. Udaranje i vikanje ozlijede druge i ne pomažu.', osr(razred, 'A.x.2')));
  // Pomoć drugima
  for (const [sit, dobro, lose] of uzmi(POMOC, razred <= 2 ? 2 : 3)) {
    q.push(izbor(`${sit} Što je najbolje učiniti?`, dobro, lose, 1,
      'Kad se staviš u tuđu kožu, lakše vidiš kako drugome pomoći.', osr(razred, 'B.x.1')));
  }
  // Čarobne riječi
  if (razred <= 2) {
    q.push(spoji('Spoji situaciju s riječima koje tada kažemo:', uzmi(CAROBNE, 4), 1,
      'Molim, hvala, oprosti i pozdrav su riječi koje pokazuju poštovanje.', osr(razred, 'B.x.2')));
    const [kad, rijec] = jedan(CAROBNE);
    q.push(izbor(`Što kažeš ${kad}?`, rijec, CAROBNE.map((c) => c[1]), 1, `${kad[0].toUpperCase() + kad.slice(1)} kažemo „${rijec}”.`, osr(razred, 'B.x.2')));
  }
  // Pristojno ponašanje i različitost
  for (const [p, t, obj, tez] of uzmi(PONASANJE.filter((x) => razred >= 2 || x[3] === 1), 2)) {
    q.push(tocnoNetocno(p, t, tez, obj, osr(razred, 'B.x.2')));
  }
  // Dječja prava
  if (razred >= 2) {
    q.push(izbor('Koje je od ovoga pravo svakoga djeteta?', jedan(PRAVO_KRATKO), ZELJE, 2,
      'Prava djeteta su ono što svakom djetetu treba da bi raslo zdravo i sigurno. Mobitel, džeparac i slatkiši su želje, a ne prava.', goo(razred)));
  }
  if (razred >= 3) {
    q.push(spoji('Spoji pravo djeteta s primjerom:', uzmi(PRAVA, 4), 2,
      'Prava djeteta zapisana su u Konvenciji o pravima djeteta i vrijede za svu djecu.', goo(razred)));
    q.push(izbor('Uz prava dijete ima i dužnosti. Koja je dužnost učenika?', jedan(DUZNOSTI), NISU_DUZNOSTI, 2,
      'Dužnosti su ono što sami činimo da bi zajednica dobro radila. O satu i nastavi odlučuju učitelji i škola.', goo(razred)));
    q.push(izbor('Koja rečenica mirno kaže kako se osjećaš, a ne vrijeđa drugoga?', jedan(JA_PORUKE), TI_PORUKE, 2,
      'Takva rečenica govori o tvom osjećaju („ljutim se”, „tužno mi je”, „smeta mi”) i ne napada drugoga.', osr(razred, 'B.x.2')));
    q.push(poredaj('Poredaj korake kojima mirno rješavamo svađu.',
      ['Smirimo se.', 'Razgovaramo i saslušamo jedno drugo.', 'Dogovorimo rješenje koje je pošteno za oboje.'], 2,
      'Dok smo ljuti, teško se dogovaramo. Zato se najprije smirimo, pa razgovaramo, a na kraju se dogovorimo.', osr(razred, 'B.x.3')));
    q.push(izbor('Kako zovemo pomaganje drugima bez plaće?', 'volontiranje', ['zarađivanje', 'natjecanje', 'posuđivanje'], 2,
      'Volonteri pomažu drugima jer to žele, a ne zbog novca.', goo(razred)));
  }
  if (razred === 4) {
    q.push(izbor('Kako se zove dokument kojim su se države dogovorile o pravima djece?', 'Konvencija o pravima djeteta',
      ['Kućni red škole', 'Pravilnik o ocjenjivanju', 'Školski raspored sati'], 2,
      'Konvenciju o pravima djeteta prihvatili su Ujedinjeni narodi 1989. godine. Hrvatska je stranka Konvencije od 1991.', goo(razred)));
    q.push(tocnoNetocno('Imaju li sva djeca ista prava, bez obzira na to gdje žive i kojim jezikom govore?', true, 2,
      'Prava djeteta vrijede za svako dijete, bez iznimke.', goo(razred)));
    q.push(tocnoNetocno('Može li dijete besplatno nazvati Hrabri telefon na broj 116 111 kad treba razgovor ili pomoć?', true, 2,
      'Hrabri telefon je besplatna linija za djecu. Ondje te saslušaju i savjetuju.', osr(razred, 'C.x.1')));
    q.push(tocnoNetocno('Može li netko u isto vrijeme osjećati i radost i tugu?', true, 3,
      'Da. Na primjer, veselimo se novoj školi, a tužni smo što ostavljamo stare prijatelje.', osr(razred, 'A.x.2')));
    q.push(izbor('Koja organizacija pomaže ljudima u nevolji, a znak joj je crveni križ na bijeloj podlozi?', 'Hrvatski Crveni križ',
      ['Hrvatski autoklub', 'Hrvatska pošta', 'Hrvatski olimpijski odbor'], 2,
      'Crveni križ pomaže ljudima u nevolji: pri poplavama, potresima i bolesti, a uči i prvu pomoć.', goo(razred)));
  }
  return q;
}

function genJaIDrugi1() { return genJaIDrugi(1); }
function genJaIDrugi2() { return genJaIDrugi(2); }
function genJaIDrugi3() { return genJaIDrugi(3); }
function genJaIDrugi4() { return genJaIDrugi(4); }

module.exports = { genJaIDrugi1, genJaIDrugi2, genJaIDrugi3, genJaIDrugi4 };
