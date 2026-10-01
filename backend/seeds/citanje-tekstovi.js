/**
 * citanje-tekstovi.js — izvorni kratki tekstovi za čitanje s razumijevanjem (2.–4. razred)
 *
 * Svi tekstovi napisani su za Učilicu; ništa nije preuzeto iz čitanki ni zbirki.
 * Činjenični tekstovi (Plitvička jezera, jež) provjereni su prema javno dostupnim
 * podatcima; prije objave ipak ih treba pregledati učitelj razredne nastave.
 *
 * Svako pitanje nosi `proces` — misaoni postupak koji provjerava. Podjela slijedi
 * procese razumijevanja iz okvira PIRLS 2026 (kao urednički kontrolni popis, ne
 * kao hrvatski standard):
 *   podatak     — pronalazi izravno navedenu informaciju
 *   zakljucak   — izvodi jednostavan zaključak koji nije doslovno napisan
 *   tumacenje   — povezuje dijelove teksta i tumači značenje
 *   vrednovanje — procjenjuje svrhu, vrstu, jezik ili pouzdanost teksta
 *
 * Svako pitanje ima objašnjenje koje upućuje na dokaz u tekstu.
 * Ishod se zapisuje po pitanju (`ishod`), ne samo po temi.
 */

/** Deterministička rotacija ponuđenih odgovora: točan odgovor nije uvijek prvi. */
function rotiraj(odgovori, kljuc) {
  const h = [...kljuc].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const s = h % odgovori.length;
  const out = odgovori.slice(s).concat(odgovori.slice(0, s));
  return { answers: out, correctIndex: out.indexOf(odgovori[0]) };
}

// Pomoćnici: prvi odgovor u nizu je točan.
const izbor = (proces, question, odgovori, objasnjenje, difficulty = 2) =>
  ({ type: 'choice', proces, question, ...rotiraj(odgovori, question), objasnjenje, difficulty });
const broj = (proces, question, odgovor, objasnjenje, difficulty = 2) =>
  ({ type: 'input', proces, question: `${question} Odgovori brojkom.`, correctAnswer: String(odgovor), konstrukt: 'broj', objasnjenje, difficulty });
const rijec = (proces, question, odgovor, objasnjenje, prihvatljivi = [], difficulty = 2) =>
  ({ type: 'input', proces, question: `${question} Napiši jednu riječ.`, correctAnswer: odgovor, konstrukt: 'rijec', ...(prihvatljivi.length ? { prihvatljivi } : {}), objasnjenje, difficulty });
const redoslijed = (proces, question, items, objasnjenje, difficulty = 3) =>
  ({ type: 'ordering', proces, question, items, objasnjenje, difficulty });
const tocnoNetocno = (proces, question, correct, objasnjenje, difficulty = 1) =>
  ({ type: 'true-false', proces, question, correct, objasnjenje, difficulty });

const TEKSTOVI = [
  // ── 2. razred ────────────────────────────────────────────────────
  {
    id: 'r2-izgubljena-kapa', razred: 2, tema: 'citanje-2', ishod: 'OŠ HJ A.2.3', vrsta: 'pripovjedni',
    naslov: 'Izgubljena kapa',
    tekst: 'Luka je u ponedjeljak došao u školu s novom plavom kapom. Za vrijeme odmora igrao se u dvorištu i stavio kapu na klupu. Kad je zazvonilo, otrčao je u razred. Tek kod kuće sjetio se kape. Sutradan ju je pronašao u školskoj kutiji za izgubljene stvari. Odlučio je da će kapu odsad spremati u ruksak.',
    pitanja: [
      izbor('podatak', 'Koje je boje bila Lukina kapa?', ['plave', 'crvene', 'zelene'], 'U prvoj rečenici piše da je Luka došao „s novom plavom kapom”.', 1),
      izbor('podatak', 'Gdje je Luka ostavio kapu?', ['na klupi u dvorištu', 'u razredu', 'u ruksaku'], 'Za vrijeme odmora „stavio je kapu na klupu” u dvorištu.', 1),
      izbor('zakljucak', 'Zašto je Luka zaboravio kapu?', ['Žurio je u razred kad je zazvonilo.', 'Kapa mu se nije sviđala.', 'Netko mu ju je sakrio.'], 'Kad je zazvonilo, Luka je otrčao u razred. Žurio je, pa je kapa ostala na klupi.'),
      redoslijed('podatak', 'Poredaj događaje iz priče od prvoga do posljednjega.', ['Luka je stavio kapu na klupu.', 'Luka je otrčao u razred.', 'Luka je pronašao kapu u kutiji za izgubljene stvari.'], 'Najprije je ostavio kapu, zatim otrčao u razred, a sutradan ju je pronašao.'),
      tocnoNetocno('podatak', 'Je li Luka pronašao kapu isti dan?', false, 'U tekstu piše da ju je pronašao „sutradan”.'),
      izbor('tumacenje', 'Što je Luka naučio iz ovoga događaja?', ['Svoje stvari treba spremiti na sigurno mjesto.', 'Kape ne treba nositi u školu.', 'Za vrijeme odmora ne treba se igrati.'], 'Na kraju Luka odlučuje kapu spremati u ruksak, dakle na sigurno mjesto.', 3)
    ]
  },
  {
    id: 'r2-obavijest-knjiznica', razred: 2, tema: 'citanje-2', ishod: 'OŠ HJ A.2.3', vrsta: 'obavijest',
    naslov: 'Obavijest',
    tekst: 'Dragi učenici, u petak idemo u posjet gradskoj knjižnici. Polazimo ispred škole u 9 sati. Ponesite mali ruksak, bocu vode i užinu. Knjižničarka će nam pročitati priču i pokazati kako se posuđuju knjige. U školu se vraćamo u 12 sati. Vaša učiteljica Ana',
    pitanja: [
      izbor('podatak', 'Kamo idu učenici?', ['u gradsku knjižnicu', 'u kino', 'u park'], 'U drugoj rečenici piše: „idemo u posjet gradskoj knjižnici”.', 1),
      broj('podatak', 'U koliko sati učenici polaze ispred škole?', 9, 'U obavijesti piše: „Polazimo ispred škole u 9 sati.”', 1),
      izbor('podatak', 'Što učenici trebaju ponijeti?', ['ruksak, bocu vode i užinu', 'knjige i bilježnice', 'kišobran i kapu'], 'Učiteljica piše: „Ponesite mali ruksak, bocu vode i užinu.”'),
      izbor('zakljucak', 'Koliko će sati učenici biti izvan škole?', ['3 sata', '2 sata', '5 sati'], 'Polaze u 9, a vraćaju se u 12 sati. Od 9 do 12 su 3 sata.', 3),
      izbor('podatak', 'Tko je napisao obavijest?', ['učiteljica Ana', 'knjižničarka', 'ravnatelj'], 'Obavijest je potpisala „Vaša učiteljica Ana”.', 1),
      izbor('vrednovanje', 'Čemu služi ovaj tekst?', ['Obavještava učenike o posjetu knjižnici.', 'Priča izmišljenu priču.', 'Opisuje kako izgleda knjižnica.'], 'Obavijest donosi važne podatke: kamo idemo, kada polazimo i što ponijeti.', 3)
    ]
  },
  {
    id: 'r2-uputa-grah', razred: 2, tema: 'citanje-2', ishod: 'OŠ HJ A.2.3', vrsta: 'uputa',
    naslov: 'Kako posaditi grah u čaši',
    tekst: 'Na dno čaše stavi malo vate. Vatu polij s malo vode da bude vlažna. Na vatu stavi tri zrna graha. Čašu stavi na svijetlo mjesto, blizu prozora. Svaki dan provjeri je li vata još vlažna. Za nekoliko dana iz zrna će izrasti korijen i mala stabljika.',
    pitanja: [
      izbor('podatak', 'Što se stavlja na dno čaše?', ['vata', 'zemlja', 'kamenčići'], 'Prva rečenica upute kaže: „Na dno čaše stavi malo vate.”', 1),
      broj('podatak', 'Koliko zrna graha treba staviti na vatu?', 3, 'U uputi piše: „Na vatu stavi tri zrna graha.”', 1),
      redoslijed('podatak', 'Poredaj korake upute.', ['Stavi vatu u čašu.', 'Polij vatu vodom.', 'Stavi zrna graha na vatu.', 'Stavi čašu blizu prozora.'], 'Koraci idu redom kojim su napisani u uputi.'),
      izbor('zakljucak', 'Zašto svaki dan treba provjeriti vatu?', ['Zrnu treba vlaga da proklija.', 'Da vata ne odleti.', 'Da čaša ostane čista.'], 'Uputa traži da vata bude vlažna. Bez vode zrno ne bi proklijalo.', 3),
      izbor('vrednovanje', 'Zašto je važno slijediti korake ovim redom?', ['Svaki korak priprema sljedeći.', 'Da uputa bude duža.', 'Da prebrojimo zrna.'], 'Grah se ne može staviti na vatu prije nego što je vata u čaši i navlažena.', 3)
    ]
  },
  {
    id: 'r2-nova-prijateljica', razred: 2, tema: 'citanje-2', ishod: 'OŠ HJ A.2.3', vrsta: 'pripovjedni',
    naslov: 'Nova prijateljica',
    tekst: 'Ema je bila nova u razredu. Prvi dan sjedila je sama i gledala kroz prozor. Na odmoru joj je prišla Iva i pitala je želi li se igrati lovice. Ema se nasmiješila i kimnula. Do kraja odmora dvije su djevojčice trčale i smijale se. Kad je zazvonilo, Ema je rekla: „Sutra opet!”',
    pitanja: [
      izbor('zakljucak', 'Kako se Ema vjerojatno osjećala prvi dan prije odmora?', ['usamljeno', 'ljutito', 'pospano'], 'Sjedila je sama i gledala kroz prozor. To pokazuje da se osjećala usamljeno.'),
      izbor('podatak', 'Što je Iva pitala Emu?', ['želi li se igrati lovice', 'gdje živi', 'kako se zove'], 'Iva ju je „pitala želi li se igrati lovice”.', 1),
      tocnoNetocno('podatak', 'Je li Ema prva prišla Ivi?', false, 'U tekstu piše da je Iva prišla Emi.'),
      izbor('tumacenje', 'Kako se Emino raspoloženje promijenilo tijekom dana?', ['Od usamljenosti do veselja.', 'Od veselja do tuge.', 'Nije se promijenilo.'], 'Na početku je sjedila sama, a na kraju je trčala i smijala se s Ivom.', 3),
      izbor('zakljucak', 'Što Ema želi reći riječima „Sutra opet!”?', ['Želi se opet igrati s Ivom.', 'Želi ići kući.', 'Ne voli lovicu.'], 'Ema je uživala u igri pa je želi ponoviti sljedeći dan.'),
      izbor('vrednovanje', 'Koji bi naslov još mogao odgovarati ovoj priči?', ['Prvi dan s prijateljicom', 'Kišni dan', 'Izgubljena lopta'], 'Priča govori o tome kako je Ema prvi dan stekla prijateljicu.', 3)
    ]
  },

  // ── 3. razred ────────────────────────────────────────────────────
  {
    id: 'r3-jez', razred: 3, tema: 'citanje-3', ishod: 'OŠ HJ A.3.3', vrsta: 'obavijesni',
    naslov: 'Jež',
    tekst: 'Jež je mala životinja koja živi u vrtovima, parkovima i na rubovima šuma. Danju uglavnom spava u gnijezdu od lišća, a noću izlazi tražiti hranu. Jede kukce i puževe, pa je koristan vrtlarima. Kad osjeti opasnost, jež se sklupča u bodljikavu kuglu. Zimi jež spava zimskim snom. Prije toga mora pojesti dovoljno hrane jer tijekom zime gotovo ništa ne jede. Ako zimi vidite ježa koji luta, možda je bolestan ili gladan i treba mu pomoć stručnjaka.',
    pitanja: [
      izbor('podatak', 'Kada jež izlazi tražiti hranu?', ['noću', 'ujutro', 'u podne'], 'Druga rečenica kaže: „noću izlazi tražiti hranu”.', 1),
      izbor('podatak', 'Što jež radi kad osjeti opasnost?', ['sklupča se u bodljikavu kuglu', 'popne se na drvo', 'glasno zviždi'], 'U tekstu piše: „jež se sklupča u bodljikavu kuglu”.', 1),
      izbor('zakljucak', 'Zašto je jež koristan vrtlarima?', ['Jede kukce i puževe koji oštećuju biljke.', 'Kopa rupe u vrtu.', 'Pomaže zalijevati biljke.'], 'Tekst kaže da jede kukce i puževe. Oni jedu vrtne biljke, pa jež vrtlaru pomaže.'),
      izbor('zakljucak', 'Zašto jež prije zime mora pojesti mnogo hrane?', ['Tijekom zimskog sna gotovo ništa ne jede.', 'Zimi brže raste.', 'Zimi je hrana nezdrava.'], 'Tekst objašnjava: „tijekom zime gotovo ništa ne jede”. Zalihe mu trebaju za cijelu zimu.'),
      rijec('podatak', 'U kojem godišnjem dobu jež spava zimskim snom?', 'zima', 'U tekstu piše: „Zimi jež spava zimskim snom.”', ['zimi', 'zimu']),
      izbor('tumacenje', 'Što trebaš učiniti ako zimi vidiš ježa koji luta?', ['Reći odrasloj osobi da se potraži pomoć stručnjaka.', 'Odnijeti ga kući kao ljubimca.', 'Otjerati ga natrag u šumu.'], 'Tekst kaže da je takav jež možda bolestan ili gladan i da mu treba pomoć stručnjaka.', 3),
      izbor('vrednovanje', 'Kakav je ovo tekst?', ['Obavijesni tekst koji donosi podatke o ježu.', 'Bajka s izmišljenim likovima.', 'Pjesma u kiticama.'], 'Tekst ne priča izmišljenu priču. Donosi podatke o tome gdje jež živi, čime se hrani i kako preživljava zimu.', 3)
    ]
  },
  {
    id: 'r3-stari-bicikl', razred: 3, tema: 'citanje-3', ishod: 'OŠ HJ A.3.3', vrsta: 'pripovjedni',
    naslov: 'Stari bicikl',
    tekst: 'Marko je u djedovoj šupi pronašao stari zahrđali bicikl. Kotači su bili ispuhani, a lanac je škripao. „Može li se ovo popraviti?” upitao je djeda. Djed se nasmijao i donio kutiju s alatom. Cijelo su poslijepodne čistili hrđu, podmazivali lanac i pumpali gume. Kad su završili, Marko je sjeo na bicikl i provozao se oko kuće. „Vozi se kao nov!” viknuo je. Djed je zadovoljno brisao ruke o stari ručnik.',
    pitanja: [
      izbor('podatak', 'Gdje je Marko pronašao bicikl?', ['u djedovoj šupi', 'u školi', 'u parku'], 'Prva rečenica: „Marko je u djedovoj šupi pronašao stari zahrđali bicikl.”', 1),
      izbor('podatak', 'Što nije bilo u redu s biciklom?', ['Kotači su bili ispuhani, a lanac je škripao.', 'Nije imao sjedalo.', 'Bio je prevelik za Marka.'], 'Druga rečenica opisuje kvarove: ispuhane kotače i lanac koji škripi.', 1),
      redoslijed('podatak', 'Poredaj događaje iz priče.', ['Marko je pronašao bicikl.', 'Djed je donio kutiju s alatom.', 'Očistili su hrđu i podmazali lanac.', 'Marko se provozao oko kuće.'], 'Događaji su poredani onako kako se zbivaju u tekstu.'),
      izbor('zakljucak', 'Kako se djed osjećao na kraju?', ['zadovoljno', 'tužno', 'ljutito'], 'U posljednjoj rečenici piše da je djed „zadovoljno” brisao ruke.', 1),
      izbor('tumacenje', 'Što priča pokazuje o starim stvarima?', ['Stare stvari često se mogu popraviti i ponovno koristiti.', 'Stare stvari treba odmah baciti.', 'Alat je opasan za djecu.'], 'Marko i djed popravili su zahrđali bicikl, pa ga Marko opet može voziti.', 3),
      izbor('vrednovanje', 'Zašto su neke rečenice u priči napisane u navodnicima?', ['To su riječi koje likovi izgovaraju.', 'To su naslovi poglavlja.', 'To su najvažnije rečenice.'], 'U navodnicima su Markove riječi, primjerice „Vozi se kao nov!”.', 2)
    ]
  },
  {
    id: 'r3-poruka', razred: 3, tema: 'citanje-3', ishod: 'OŠ HJ A.3.3', vrsta: 'poruka',
    naslov: 'Poruka na hladnjaku',
    tekst: 'Dragi Petre, mama i ja otišle smo u trgovinu. Vratit ćemo se oko 18 sati. Ručak je u hladnjaku, samo ga zagrij. Ne zaboravi nahraniti Mrvu, hrana je u ormariću ispod sudopera. Ako netko zazvoni, nemoj otvarati vrata nepoznatima. Ako nešto trebaš, nazovi me. Tvoja sestra Lea',
    pitanja: [
      izbor('podatak', 'Tko je napisao poruku?', ['Lea', 'mama', 'Petar'], 'Poruka je potpisana: „Tvoja sestra Lea”.', 1),
      broj('podatak', 'Oko kojega će se sata mama i Lea vratiti?', 18, 'U poruci piše: „Vratit ćemo se oko 18 sati.”', 1),
      izbor('podatak', 'Gdje je hrana za Mrvu?', ['u ormariću ispod sudopera', 'u hladnjaku', 'na stolu'], 'Lea piše da je hrana „u ormariću ispod sudopera”.'),
      izbor('zakljucak', 'Tko je najvjerojatnije Mrva?', ['kućni ljubimac', 'Petrova prijateljica', 'susjeda'], 'Mrvu treba nahraniti posebnom hranom iz ormarića, pa je to najvjerojatnije kućni ljubimac.', 3),
      tocnoNetocno('podatak', 'Je li ručak na štednjaku?', false, 'U poruci piše da je ručak u hladnjaku.'),
      izbor('vrednovanje', 'Koja uputa u poruci brine o Petrovoj sigurnosti?', ['Ne otvaraj vrata nepoznatima.', 'Zagrij ručak.', 'Nahrani Mrvu.'], 'Zabrana otvaranja vrata nepoznatima štiti Petra dok je sam kod kuće.', 2)
    ]
  },

  // ── 4. razred ────────────────────────────────────────────────────
  {
    id: 'r4-plitvice', razred: 4, tema: 'citanje-4', ishod: 'OŠ HJ A.4.3', vrsta: 'obavijesni',
    naslov: 'Plitvička jezera',
    tekst: 'Nacionalni park Plitvička jezera najstariji je i najveći nacionalni park u Hrvatskoj. Proglašen je 1949. godine. Šesnaest većih jezera povezano je slapovima. Jezera su odvojena sedrenim pregradama. One nastaju kad se tvari otopljene u vodi talože na mahovini i algama. Pregrade s vremenom rastu, pa se izgled jezera polako mijenja. Zbog te iznimne prirodne pojave Plitvička jezera 1979. godine upisana su na UNESCO-ov Popis svjetske baštine. Posjetitelji smiju hodati samo po označenim stazama i drvenim mostovima, a kupanje u jezerima nije dopušteno.',
    pitanja: [
      broj('podatak', 'Koje je godine proglašen Nacionalni park Plitvička jezera?', 1949, 'Druga rečenica: „Proglašen je 1949. godine.”', 1),
      izbor('podatak', 'Koliko je većih jezera povezano slapovima?', ['šesnaest', 'dvanaest', 'dvadeset'], 'U tekstu piše: „Šesnaest većih jezera povezano je slapovima.”', 1),
      izbor('tumacenje', 'Kako nastaju sedrene pregrade?', ['Tvari otopljene u vodi talože se na mahovini i algama.', 'Ljudi grade kamene zidove.', 'Vjetar nanosi pijesak.'], 'Tekst objašnjava da pregrade nastaju taloženjem tvari iz vode na mahovini i algama.'),
      izbor('zakljucak', 'Zašto se izgled jezera polako mijenja?', ['Sedrene pregrade s vremenom rastu.', 'Posjetitelji mijenjaju staze.', 'Svake godine iskopa se novo jezero.'], 'Rečenica „Pregrade s vremenom rastu, pa se izgled jezera polako mijenja” daje uzrok i posljedicu.'),
      izbor('zakljucak', 'Zašto je kupanje u jezerima vjerojatno zabranjeno?', ['Da se zaštite osjetljive sedrene pregrade i voda.', 'Jer je voda uvijek ledena.', 'Jer u jezerima nema ribe.'], 'Tekst ne navodi razlog izravno, ali opisuje sedru kao iznimnu i osjetljivu pojavu koju treba čuvati.', 3),
      izbor('vrednovanje', 'Koja rečenica iznosi činjenicu, a ne mišljenje?', ['Park je proglašen 1949. godine.', 'Plitvice su najljepše mjesto na svijetu.', 'Svatko bi trebao posjetiti Plitvice.'], 'Godinu proglašenja možemo provjeriti u izvorima. „Najljepše” i „trebao bi” izražavaju nečije mišljenje.', 3)
    ]
  },
  {
    id: 'r4-pravila-knjiznice', razred: 4, tema: 'citanje-4', ishod: 'OŠ HJ A.4.3', vrsta: 'pravila',
    naslov: 'Pravila školske knjižnice',
    tekst: 'Knjižnica je otvorena od ponedjeljka do petka, od 8 do 14 sati. Učenik odjednom smije posuditi najviše dvije knjige. Knjige se vraćaju u roku od 15 dana. Ako ti treba više vremena, posudbu možeš produljiti jednom, za još 15 dana. Enciklopedije i rječnici ne posuđuju se kući, nego se čitaju u knjižnici. Oštećenu ili izgubljenu knjigu treba zamijeniti novom.',
    pitanja: [
      broj('podatak', 'Koliko knjiga učenik smije posuditi odjednom?', 2, 'Pravilo kaže: „najviše dvije knjige”.', 1),
      broj('zakljucak', 'Ana je posudila knjigu i jednom produljila posudbu. Koliko je dana najviše smije zadržati?', 30, 'Prvih 15 dana i još jednom 15 dana: 15 + 15 = 30.', 3),
      izbor('podatak', 'Što se ne posuđuje kući?', ['enciklopedije i rječnici', 'slikovnice', 'knjige za lektiru'], 'U pravilima piše da se enciklopedije i rječnici čitaju u knjižnici.'),
      izbor('zakljucak', 'Marko želi posuditi knjigu u subotu. Što će se dogoditi?', ['Neće je moći posuditi jer je knjižnica zatvorena.', 'Moći će posuditi tri knjige.', 'Dobit će knjigu na 30 dana.'], 'Knjižnica radi samo od ponedjeljka do petka.', 2),
      izbor('tumacenje', 'Zašto knjižnica vjerojatno ograničava broj knjiga koje učenik smije posuditi?', ['Da knjige budu dostupne svim učenicima.', 'Da učenici manje čitaju.', 'Da knjige brže propadnu.'], 'Pravilo to ne kaže izravno. Kad nitko ne uzme previše knjiga, ostane ih dovoljno za druge.', 3),
      izbor('vrednovanje', 'Kako je ovaj tekst složen?', ['Svaka rečenica donosi jedno pravilo.', 'Prati događaje jednoga dana.', 'Napisan je u kiticama kao pjesma.'], 'Svaka rečenica opisuje drugo pravilo: radno vrijeme, broj knjiga, rok, produljenje, zabranu i naknadu štete.', 3)
    ]
  },
  {
    id: 'r4-stari-hrast', razred: 4, tema: 'knjizevnost-4', ishod: 'OŠ HJ B.4.1', vrsta: 'pripovjedni',
    naslov: 'Stari hrast',
    tekst: 'Na rubu sela stajao je stari hrast. Svako proljeće budio se polako, kao da se proteže nakon dugog sna. Djeca su se ljeti skrivala u njegovoj sjeni, a on im je šuštanjem lišća pričao priče o vjetrovima i olujama. Jedne jeseni došli su ljudi s pilama. Htjeli su ga srušiti i ondje napraviti parkiralište. Djeca su skupila potpise cijeloga sela i odnijela ih načelniku. Hrast je ostao. Te je noći, kažu, lišće šuštalo tiše nego ikad, kao da zahvaljuje.',
    pitanja: [
      izbor('tumacenje', 'Koja rečenica pokazuje da pisac hrastu daje ljudske osobine?', ['„On im je šuštanjem lišća pričao priče.”', '„Na rubu sela stajao je stari hrast.”', '„Jedne jeseni došli su ljudi s pilama.”'], 'Pričati priče mogu ljudi. Kad pisac to pripiše hrastu, daje mu ljudsku osobinu (personifikacija).', 3),
      izbor('podatak', 'Zašto su ljudi htjeli srušiti hrast?', ['da ondje naprave parkiralište', 'jer je hrast bio bolestan', 'da dobiju drva za zimu'], 'U tekstu piše da su ondje htjeli napraviti parkiralište.', 1),
      izbor('podatak', 'Što su djeca učinila?', ['skupila su potpise sela i odnijela ih načelniku', 'popela su se na hrast', 'sakrila su pile'], 'Djeca su „skupila potpise cijeloga sela i odnijela ih načelniku”.', 1),
      izbor('zakljucak', 'Zašto je hrast ostao?', ['Djeca i selo zauzeli su se za njega.', 'Ljudi nisu imali pile.', 'Došla je zima.'], 'Odmah nakon što su djeca predala potpise piše: „Hrast je ostao.”'),
      izbor('tumacenje', 'Što izražava posljednja rečenica?', ['zahvalnost hrasta djeci', 'strah od oluje', 'tugu zbog jeseni'], 'Lišće šušti „kao da zahvaljuje”.', 2),
      izbor('vrednovanje', 'Koja je glavna poruka priče?', ['Zajedničkim trudom možemo zaštititi prirodu.', 'Drveće treba rušiti zbog parkirališta.', 'Djeca se ne trebaju igrati vani.'], 'Djeca su zajedno sa selom spasila hrast.', 3)
    ]
  },
  {
    id: 'r4-oglas-vijest', razred: 4, tema: 'medijska-kultura', ishod: 'OŠ HJ C.4.1', vrsta: 'medijski',
    naslov: 'Oglas i vijest',
    tekst: 'TEKST A (oglas): SUPERGRIZ – NAJBOLJE GRICKALICE NA SVIJETU! Svi tvoji prijatelji već ih jedu. Kupi dvije vrećice, a treću dobivaš besplatno! Samo ovaj tjedan! TEKST B (vijest iz školskih novina): U utorak je u našoj školi održano predavanje o prehrani. Nutricionistica je učenicima objasnila da grickalice sadrže mnogo soli i masnoće te da ih je bolje jesti rijetko. Nakon predavanja učenici 4. b razreda pripremili su voćne ražnjiće.',
    pitanja: [
      izbor('vrednovanje', 'Koja je svrha teksta A?', ['nagovoriti čitatelja na kupnju', 'obavijestiti o događaju u školi', 'ispričati priču'], 'Oglas nudi besplatnu vrećicu i žuri kupca. Njegova je svrha prodati grickalice.', 2),
      izbor('vrednovanje', 'Koja se tvrdnja ne može provjeriti?', ['„Svi tvoji prijatelji već ih jedu.”', '„U utorak je održano predavanje o prehrani.”', '„Učenici su pripremili voćne ražnjiće.”'], 'Ne možemo znati jedu li baš svi prijatelji te grickalice. Ostale tvrdnje opisuju stvarne događaje.', 3),
      izbor('podatak', 'Tko je održao predavanje?', ['nutricionistica', 'učiteljica', 'ravnatelj'], 'U tekstu B piše: „Nutricionistica je učenicima objasnila…”', 1),
      izbor('zakljucak', 'Zašto oglas kaže „Samo ovaj tjedan!”?', ['Da se kupac požuri i ne razmišlja dugo.', 'Da obavijesti o radnom vremenu trgovine.', 'Da opiše okus grickalica.'], 'Kratki rok potiče kupca da kupi odmah. To je čest način nagovaranja u oglasima.', 3),
      izbor('vrednovanje', 'Kojem tekstu više možeš vjerovati kad želiš saznati jesu li grickalice zdrave?', ['Tekstu B, jer prenosi objašnjenje stručnjakinje.', 'Tekstu A, jer je napisan velikim slovima.', 'Tekstu A, jer nudi besplatnu vrećicu.'], 'Tekst B prenosi stručno objašnjenje. Tekst A želi prodati proizvod, pa ga hvali.', 3),
      izbor('tumacenje', 'Što su učenici 4. b razreda učinili nakon predavanja?', ['Primijenili su naučeno i pripremili voćne ražnjiće.', 'Kupili su grickalice.', 'Napisali su oglas.'], 'U zadnjoj rečenici piše da su pripremili voćne ražnjiće, a to je zdraviji izbor od grickalica.', 2)
    ]
  }
];

/** Pitanja jednoga teksta, s tekstom kao `passage` i ishodom po pitanju. */
function pitanjaTeksta(t) {
  return t.pitanja.map((p, i) => ({
    ...p,
    passage: `${t.naslov}\n\n${t.tekst}`,
    tekstId: t.id,
    ishod: t.ishod,
    // stabilna oznaka predloška: tekst + redni broj pitanja
    templateId: `tekst:${t.id}:${i + 1}`
  }));
}

/** Sva pitanja za temu (slug). */
function pitanjaZaTemu(slug) {
  return TEKSTOVI.filter((t) => t.tema === slug).flatMap(pitanjaTeksta);
}

module.exports = { TEKSTOVI, pitanjaTeksta, pitanjaZaTemu };
