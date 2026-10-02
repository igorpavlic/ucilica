/**
 * Promet i bicikl — 3. i 4. razred (Priroda i društvo, domena C „Pojedinac i
 * društvo”; MPT Zdravlje C — pomoć i samozaštita; Osobni i socijalni razvoj C).
 * U 1. i 2. razredu promet ostaje u temama „Sigurnost i promet” i
 * „Zdravlje i sigurnost”.
 *
 * Pravila prema Zakonu o sigurnosti prometa na cestama (izmjene na snazi od
 * 21. 12. 2024.):
 *   - dijete s navršenih 9 godina koje je u školi osposobljeno za upravljanje
 *     biciklom i ima potvrdu smije samostalno voziti bicikl na cesti; ostala
 *     djeca od 9 godina samo u pratnji osobe od najmanje 16 godina;
 *   - biciklist mlađi od 16 godina na cesti mora nositi zaštitnu kacigu;
 *   - osobna prijevozna sredstva (električni romobil) smije voziti osoba od 14 godina.
 * Biciklistički ispit polaže se u osnovnoj školi (program MZO i MUP-a, priručnik
 * HAK-a „Biciklom sigurno u promet”).
 *
 * Činjenice su ručno provjerene; zadatci s udaljenostima i vremenom su
 * parametrizirani, pa svaki poziv daje nove primjere.
 */
const HR = require('./hr-gramatika');
const { uzmi, jedan, cijeli, izbor, tocnoNetocno, spoji, poredaj, upisBroja } = require('./gen-pomocno');

const PID = 'PID OŠ C (promet)';
const ZDR = 'zdr C.2.1 (samozaštita)';

// ── Prometni znakovi ────────────────────────────────────────────────
const VRSTE_ZNAKOVA = [
  ['trokut s crvenim rubom', 'upozorava na opasnost'],
  ['krug s crvenim rubom', 'zabranjuje neku radnju'],
  ['plavi krug', 'naređuje što treba učiniti'],
  ['plavi kvadrat ili pravokutnik', 'daje korisnu obavijest'],
];
const ZNAKOVI = [
  ['plavi kvadrat na kojem pješak prelazi preko zebre', 'pješački prijelaz', 'obavijest'],
  ['trokut s crvenim rubom na kojem trče dvoje djece', 'djeca na cesti', 'opasnost'],
  ['plavi krug s bijelim biciklom', 'biciklistička staza', 'naredba'],
  ['krug s crvenim rubom i biciklom u sredini', 'zabrana za bicikle', 'zabrana'],
  ['trokut s crvenim rubom i semaforom', 'nailazak na semafor', 'opasnost'],
];

// ── Semafor ─────────────────────────────────────────────────────────
const SEMAFOR_VOZILA = [['crveno svjetlo', 'stani'], ['žuto svjetlo', 'pripremi se za zaustavljanje'], ['zeleno svjetlo', 'smiješ krenuti']];

// ── Pravila: [pitanje, točno?, objašnjenje, od razreda] ─────────────
const PRAVILA = [
  ['Moraju li biciklisti mlađi od 16 godina na cesti nositi zaštitnu kacigu?', true, 'Zakon propisuje kacigu za bicikliste mlađe od 16 godina. Kaciga štiti glavu pri padu.', 3],
  ['Smije li dijete od 7 godina samo voziti bicikl po cesti?', false, 'Samostalno na cestu smije tek dijete od 9 godina koje je u školi položilo biciklistički ispit.', 3],
  ['Smije li biciklist voziti pustivši upravljač iz obiju ruku?', false, 'Bez ruku na upravljaču biciklist ne može kočiti ni skrenuti na vrijeme.', 3],
  ['Smije li biciklist voziti preko pješačkog prijelaza?', false, 'Biciklist siđe s bicikla i gura ga preko pješačkog prijelaza kao pješak.', 3],
  ['Smije li se biciklist držati za drugo vozilo u vožnji?', false, 'Vozilo ga može povući i oboriti.', 3],
  ['Treba li prije vožnje provjeriti rade li kočnice?', true, 'Bez ispravnih kočnica bicikl se ne može na vrijeme zaustaviti.', 3],
  ['Treba li biciklist voziti biciklističkom stazom kad ona postoji?', true, 'Biciklistička staza odvaja bicikliste od automobila, pa je vožnja sigurnija.', 3],
  ['Smije li dijete od 10 godina voziti električni romobil po cesti?', false, 'Električni romobil smije voziti osoba od navršenih 14 godina.', 4],
  ['Smije li se preko ceste prijeći ispred autobusa koji stoji na stajalištu?', false, 'Iza autobusa te vozači ne vide. Pričekaj da autobus ode, pa prijeđi na pješačkom prijelazu.', 3],
  ['Treba li se u automobilu vezati i kad je vožnja kratka?', true, 'Nesreća se može dogoditi i na kratkoj vožnji. Pojas štiti pri naglom kočenju.', 3],
  ['Izlazimo li iz automobila na strani nogostupa?', true, 'Na strani nogostupa nema vozila koja prolaze uz automobil.', 3],
  ['Smijemo li se igrati loptom na kolniku?', false, 'Kolnik je za vozila. Za igru su igralište i park.', 3],
];

const OPREMA_DA = ['ispravne kočnice', 'zvonce', 'prednje bijelo svjetlo', 'stražnje crveno svjetlo', 'crveni stražnji katadiopter'];
const OPREMA_NE = ['košaricu za stvari na upravljaču', 'bocu za vodu na okviru', 'ukrasne naljepnice na kotačima', 'zastavicu na dugačkom štapu', 'držač za mobitel na upravljaču'];

const BROJEVI_HITNIH = [['jedinstveni broj za hitne slučajeve', '112'], ['policija', '192'], ['vatrogasci', '193'], ['hitna medicinska pomoć', '194']];

function genPromet(razred) {
  const q = [];

  // Znakovi: oblik i boja → značenje
  q.push(spoji('Spoji oblik prometnog znaka s njegovim značenjem:', VRSTE_ZNAKOVA, 2,
    'Oblik i boja kažu vrstu znaka: trokut upozorava, crveni krug zabranjuje, plavi krug naređuje, plavi kvadrat obavještava.', PID));
  {
    const [opis, znacenje] = jedan(VRSTE_ZNAKOVA);
    q.push(izbor(`Što kaže prometni znak koji je ${opis}?`, znacenje, VRSTE_ZNAKOVA.map((v) => v[1]), 2,
      `Znak koji je ${opis} ${znacenje}.`, PID));
  }
  for (const [opis, ime] of uzmi(ZNAKOVI, 2)) {
    q.push(izbor(`Kako se zove prometni znak koji je ${opis}?`, ime, ZNAKOVI.map((z) => z[1]), 2,
      `To je znak „${ime}”. Prepoznaješ ga po obliku, boji i slici u sredini.`, PID));
  }

  q.push(izbor('Što vozač mora učiniti kod znaka STOP?', 'potpuno zaustaviti vozilo', ['usporiti i nastaviti bez stajanja', 'zatrubiti i nastaviti', 'ubrzati prije raskrižja'], 2,
    'Znak STOP (crveni osmerokut) traži potpuno zaustavljanje. Vozač kreće tek kad se uvjeri da je put slobodan.', PID));

  // Semafor i pješak
  q.push(spoji('Spoji svjetlo na semaforu za vozila s onim što znači:', SEMAFOR_VOZILA, 1,
    'Crveno: stani. Žuto: pripremi se za zaustavljanje. Zeleno: smiješ krenuti, ali prije toga pogledaj.', PID));
  q.push(poredaj('Poredaj korake prelaska ceste preko pješačkog prijelaza.',
    ['Stani na rubu nogostupa.', 'Pogledaj lijevo, desno i ponovno lijevo.', 'Pričekaj da se vozila zaustave.', 'Prijeđi cestu ravno i brzim korakom.'], 2,
    'Najprije stanemo i pogledamo na obje strane. Krenemo tek kad se vozila zaustave, i to ravno, ne dijagonalno.', ZDR));
  q.push(izbor('Kojom stranom ceste hoda pješak kad nema nogostupa?', 'lijevom stranom, prema vozilima', ['desnom stranom, kao i vozila', 'sredinom ceste', 'stranom na kojoj je hlad'], 2,
    'Kad hodaš lijevom stranom, vidiš vozila koja ti dolaze ususret i možeš se skloniti.', ZDR));
  q.push(izbor('Što je dobro odjenuti kad navečer hodaš uz cestu?', 'reflektirajući prsluk', ['tamnu jaknu i kapu', 'crnu trenirku i kapu', 'tamnoplavu kabanicu'], 2,
    'Vozači noću lakše vide svijetlu odjeću i prsluk koji odbija svjetlo.', ZDR));

  // Biciklist
  q.push(izbor('Kojom stranom ceste vozi biciklist?', 'desnom stranom, uz rub ceste', ['lijevom stranom, uz rub ceste', 'sredinom ceste', 'po nogostupu među pješacima'], 2,
    'Biciklist je vozač, pa vozi desnom stranom, što bliže desnom rubu ceste.', PID));
  {
    const smjer = jedan(['lijevo', 'desno']);
    q.push(izbor(`Kako biciklist pokazuje da će skrenuti ${smjer}?`, `ispruži ${smjer === 'lijevo' ? 'lijevu' : 'desnu'} ruku`,
      ['ispruži lijevu ruku', 'ispruži desnu ruku', 'zazvoni zvoncem', 'podigne obje ruke'], 2,
      `Prije skretanja biciklist se osvrne i ispruži ruku na stranu na koju skreće (${smjer}).`, PID));
  }
  {
    const da = jedan(OPREMA_DA);
    q.push(izbor('Što mora imati bicikl kojim se vozi po cesti?', da, OPREMA_NE, 2,
      'Propisana oprema bicikla: ispravne kočnice, zvonce, bijelo svjetlo sprijeda, crveno svjetlo i crveni katadiopter straga.', PID));
  }
  q.push(izbor('Koje boje je svjetlo na prednjoj strani bicikla?', 'bijelo', ['crveno', 'zeleno', 'plavo'], 2,
    'Sprijeda je bijelo svjetlo, a straga crveno, kao i na automobilu.', PID));
  for (const [p, t, obj] of uzmi(PRAVILA.filter((x) => x[3] <= razred), razred === 3 ? 3 : 4)) {
    q.push(tocnoNetocno(p, t, 2, obj, razred === 4 ? ZDR : PID));
  }

  // Hitni brojevi
  if (razred === 4) {
    q.push(spoji('Spoji službu s njezinim brojem telefona:', BROJEVI_HITNIH, 2,
      'Broj 112 vrijedi za sve hitne slučajeve u cijeloj Europskoj uniji.', ZDR));
    q.push(izbor('S koliko godina dijete koje je u školi položilo biciklistički ispit smije samo voziti bicikl po cesti?', 'od navršenih 9 godina',
      ['od navršenih 6 godina', 'od navršenih 7 godina', 'od navršenih 18 godina'], 3,
      'Djeca od 9 godina s potvrdom iz škole smiju samostalno na cestu. Bez potvrde voze samo uz osobu od najmanje 16 godina.', PID));
  } else {
    const [sluzba, broj] = jedan(BROJEVI_HITNIH.slice(1));
    q.push(izbor(`Koji je broj telefona za službu „${sluzba}”?`, broj, BROJEVI_HITNIH.map((b) => b[1]), 2,
      `Za službu „${sluzba}” zovemo ${broj}. Broj 112 vrijedi za sve hitne slučajeve.`, ZDR));
  }

  // Parametrizirano: put do škole i vožnja biciklom
  {
    const ime = jedan(Object.keys(HR.IMENA));
    const ukupno = razred === 3 ? cijeli(4, 9) * 100 : cijeli(12, 30) * 100;
    const prijedeno = cijeli(1, ukupno / 100 - 1) * 100 - (razred === 4 ? cijeli(0, 9) * 10 : 0);
    q.push(upisBroja(`Od kuće do škole ima ${ukupno} m. ${ime} je prošao dio puta, ${prijedeno} m. Koliko metara još treba prijeći?`
      .replace('prošao', HR.IMENA[ime] === 'z' ? 'prošla' : 'prošao'), ukupno - prijedeno, 2,
      `${ukupno} − ${prijedeno} = ${ukupno - prijedeno}.`, 'MAT OŠ A (računanje u prometu)'));
  }
  if (razred === 4) {
    const brzina = cijeli(8, 15), sati = cijeli(2, 4);
    q.push(upisBroja(`Biciklist vozi ${brzina} km na sat. Koliko kilometara prijeđe za ${sati} sata ako vozi jednako brzo?`, brzina * sati, 3,
      `Svaki sat prijeđe ${brzina} km: ${sati} · ${brzina} = ${brzina * sati} km.`, 'MAT OŠ A (računanje u prometu)'));
  }
  return q;
}

function genPromet3() { return genPromet(3); }
function genPromet4() { return genPromet(4); }

module.exports = { genPromet3, genPromet4 };
