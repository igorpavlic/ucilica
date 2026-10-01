/**
 * Medijska kultura — 4. razred (Hrvatski jezik, domena C: Kultura i mediji).
 *
 * OŠ HJ C.4.1 — izdvaja važne podatke koristeći se različitim izvorima
 *               primjerenima dobi (rječnik, pravopis, enciklopedija…).
 * OŠ HJ C.4.2 — razlikuje elektroničke medije primjerene dobi i interesima
 *               (televizija, radio, internet, film; sigurnost na internetu).
 * OŠ HJ C.4.3 — razlikuje i opisuje kulturne događaje koje posjećuje.
 *
 * Uz to: svrha medijske poruke (oglas, vijest, obavijest) i razlikovanje
 * činjenice od mišljenja — preduvjet za kritičko čitanje medija.
 *
 * Svaki poziv bira druge primjere i druge ometače iz ručno pisanih skupova.
 */

const promijesaj = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const uzmi = (arr, n) => promijesaj(arr).slice(0, n);
const izbor = (pitanje, tocno, krivi, tezina, objasnjenje, ishod) => {
  const answers = promijesaj([tocno, ...uzmi([...new Set(krivi)].filter((k) => k !== tocno), 3)]);
  return { type: 'choice', difficulty: tezina, question: pitanje, answers, correctIndex: answers.indexOf(tocno), objasnjenje, ishod };
};
const tocnoNetocno = (pitanje, tocno, tezina, objasnjenje, ishod) =>
  ({ type: 'true-false', difficulty: tezina, question: pitanje, correct: tocno, objasnjenje, ishod });
const spoji = (pitanje, pairs, tezina, objasnjenje, ishod) =>
  ({ type: 'match', difficulty: tezina, question: pitanje, pairs, objasnjenje, ishod });

const C1 = 'OŠ HJ C.4.1', C2 = 'OŠ HJ C.4.2', C3 = 'OŠ HJ C.4.3';

// ── Tiskani i elektronički mediji ───────────────────────────────────
const TISKANI = ['novine', 'dječji časopis', 'knjiga', 'plakat', 'strip'];
const ELEKTRONICKI = ['televizija', 'radio', 'mrežna stranica', 'film u kinu', 'emisija na radiju'];

// ── Svrha poruke ────────────────────────────────────────────────────
const SVRHE = [
  ['„Nove tenisice Brzić — u njima ćeš trčati brže od svih! Samo ovaj tjedan 20 % jeftinije!”', 'oglas', 'Oglas hvali proizvod i nagovara na kupnju.'],
  ['„Jučer je u našem gradu otvoreno novo dječje igralište s penjalicom i vrtuljkom.”', 'vijest', 'Vijest obavještava o stvarnom događaju koji se dogodio.'],
  ['„Učenici, u četvrtak nema nastave tjelesne kulture jer se dvorana uređuje.”', 'obavijest', 'Obavijest daje važan podatak onima kojima je namijenjena.'],
  ['„Sok od naranče Sunčica — jer tvoja obitelj zaslužuje najbolje!”', 'oglas', 'Oglas ne donosi provjerljive podatke, nego potiče na kupnju.'],
  ['„U subotu su učenici naše škole osvojili prvo mjesto na županijskom kvizu znanja.”', 'vijest', 'Vijest izvještava o događaju: tko, što, kada.'],
  ['„Knjižnica će od ponedjeljka raditi od 8 do 16 sati.”', 'obavijest', 'Obavijest kratko priopćava važnu promjenu.'],
];
const VRSTE_PORUKE = ['oglas', 'vijest', 'obavijest'];

// ── Činjenica i mišljenje ───────────────────────────────────────────
const CINJENICE = [
  'Zagreb je glavni grad Republike Hrvatske.',
  'Tjedan ima sedam dana.',
  'Voda se smrzava pri 0 °C.',
  'Školska knjižnica radi od ponedjeljka do petka.',
  'Jadransko more je slano.',
  'Lav je životinja.',
];
const MISLJENJA = [
  'Nogomet je najzabavniji sport na svijetu.',
  'Crtani filmovi su ljepši od igranih.',
  'Ljeto je najbolje godišnje doba.',
  'Matematika je najzanimljiviji predmet.',
  'Pizza je ukusnija od tjestenine.',
  'Mačke su draže ljubimci od pasa.',
];

// ── Izvori podataka (C.4.1) ─────────────────────────────────────────
const IZVORI = [
  ['značenje nepoznate riječi', 'rječnik'],
  ['kako se pravilno piše neka riječ', 'pravopis'],
  ['gdje se nalazi neki grad', 'zemljovid'],
  ['podatke o nekoj životinji', 'dječja enciklopedija'],
  ['kakvo će vrijeme biti sutra', 'vremenska prognoza'],
];

const GDJE = { rječnik: 'u rječniku', pravopis: 'u pravopisu', zemljovid: 'na zemljovidu', 'dječja enciklopedija': 'u dječjoj enciklopediji', 'vremenska prognoza': 'u vremenskoj prognozi' };

// ── Kulturni događaji (C.4.3) ───────────────────────────────────────
const DOGADAJI = [
  ['kazalište', 'gledamo predstavu'],
  ['kino', 'gledamo film na velikom platnu'],
  ['koncertna dvorana', 'slušamo glazbu uživo'],
  ['galerija', 'razgledavamo izložbu slika'],
  ['knjižnica', 'susrećemo pisca na književnom susretu'],
];

const VRSTE_FILMA = [
  ['dokumentarni film', 'prikazuje stvarne ljude, životinje i događaje'],
  ['animirani film', 'likovi su nacrtani ili oblikovani i pokrenuti'],
  ['igrani film', 'glumci glume izmišljenu priču'],
];

const SIGURNOST = [
  ['Smiješ li prijatelju iz razreda reći svoju lozinku za igricu?', false, 'Lozinka je tajna; zna je samo vlasnik (i roditelj).'],
  ['Smiješ li na internetu objaviti svoju kućnu adresu?', false, 'Adresa je osobni podatak; nepoznati ljudi ne smiju je znati.'],
  ['Trebaš li reći roditelju ako ti nepoznata osoba piše poruke?', true, 'Odrasla osoba od povjerenja pomoći će ti procijeniti je li poruka opasna.'],
  ['Je li poruka „Osvojio si novi mobitel, samo upiši svoje podatke!” vjerojatno prijevara?', true, 'Nagrade koje traže osobne podatke najčešće su prijevara.'],
  ['Je li sve što piše na internetu sigurno točno?', false, 'Na internetu svatko može objaviti bilo što; podatke provjeravamo u pouzdanim izvorima.'],
  ['Smiješ li bez pitanja objaviti fotografiju prijatelja?', false, 'Za objavu tuđe fotografije treba pitati tu osobu (i roditelje).'],
];

const PONASANJE = [
  ['Smijemo li za vrijeme kazališne predstave glasno razgovarati?', false, 'Razgovor ometa glumce i ostale gledatelje.'],
  ['Pljeskamo li glumcima na kraju predstave?', true, 'Pljeskom zahvaljujemo izvođačima.'],
  ['Treba li u kinu isključiti zvuk mobitela?', true, 'Zvonjava ometa druge gledatelje.'],
  ['Smijemo li u galeriji dodirivati slike?', false, 'Dodirivanjem se slike mogu oštetiti; razgledavamo ih očima.'],
];

function genMedijiDodatak() {
  const q = [];

  // Tiskani / elektronički
  for (const e of uzmi(ELEKTRONICKI, 2)) q.push(izbor('Koji je od navedenih medija elektronički?', e, TISKANI, 1, `${e[0].toUpperCase() + e.slice(1)} prenosi poruku slikom ili zvukom preko uređaja; ostalo je tiskano na papiru.`, C2));
  for (const t of uzmi(TISKANI, 2)) q.push(izbor('Koji je od navedenih medija tiskani?', t, ELEKTRONICKI, 1, `Tiskani mediji otisnuti su na papiru (${t}); ostali navedeni prenose poruku preko uređaja.`, C2));

  // Svrha poruke
  for (const [tekst, vrsta, obj] of uzmi(SVRHE, 3)) q.push(izbor(`Pročitaj poruku: ${tekst} Kakva je to poruka?`, vrsta, VRSTE_PORUKE, 2, obj, C2));

  // Činjenica i mišljenje
  for (let i = 0; i < 2; i++) {
    const m = uzmi(MISLJENJA, 1)[0];
    q.push(izbor('Koja rečenica iznosi mišljenje, a ne činjenicu?', m, CINJENICE, 2, 'Mišljenje se ne može provjeriti — netko se s njim slaže, a netko ne. Činjenice se mogu provjeriti.', C1));
    const c = uzmi(CINJENICE, 1)[0];
    q.push(izbor('Koja rečenica iznosi činjenicu koju možemo provjeriti?', c, MISLJENJA, 2, 'Činjenicu možemo provjeriti u pouzdanom izvoru; ostale rečenice izražavaju nečije mišljenje.', C1));
  }

  // Izvori
  q.push(spoji('Spoji ono što želiš saznati s izvorom u kojem ćeš to najlakše pronaći:', uzmi(IZVORI, 4), 2, 'Svaki izvor služi drugoj svrsi: rječnik za značenje, pravopis za pisanje, zemljovid za mjesto…', C1));
  for (const [sto, izvor] of uzmi(IZVORI, 2)) q.push(izbor(`Gdje ćeš najlakše pronaći ${sto}?`, GDJE[izvor],
    Object.values(GDJE), 2, `Za to služi ${izvor}.`, C1));

  // Vrste filma
  for (const [vrsta, opis] of uzmi(VRSTE_FILMA, 2)) q.push(izbor(`Kako se zove film u kojem ${opis}?`, vrsta, VRSTE_FILMA.map((x) => x[0]), 2, `To je ${vrsta}.`, C2));

  // Kulturni događaji
  q.push(spoji('Spoji mjesto s onim što ondje radimo:', uzmi(DOGADAJI, 4), 1, 'Kazalište, kino, koncert, izložba i književni susret različiti su kulturni događaji.', C3));

  // Sigurnost i ponašanje
  for (const [p, t, obj] of uzmi(SIGURNOST, 3)) q.push(tocnoNetocno(p, t, 1, obj, C2));
  for (const [p, t, obj] of uzmi(PONASANJE, 2)) q.push(tocnoNetocno(p, t, 1, obj, C3));

  return q;
}

/** Stari fond: kratice i ponude različitih vrsta („crtani/lutkarski”, „udžbenik mat.”) — zamijenjen. */
function ocistiMedije(qs) {
  return qs.filter((q) => q.passage); // zadržava samo pitanja uz tekst (oglas i vijest)
}

module.exports = { genMedijiDodatak, ocistiMedije };
