/**
 * citanje-tekstovi.js — izvorni kratki tekstovi za čitanje s razumijevanjem (2.–4. razred)
 *
 * Svi tekstovi napisani su za Mudrolinu; ništa nije preuzeto iz čitanki ni zbirki.
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
      izbor('podatak', 'Gdje je Luka ostavio kapu?', ['na klupi u dvorištu', 'u razrednom ormaru', 'u svojem ruksaku'], 'Za vrijeme odmora „stavio je kapu na klupu” u dvorištu.', 1),
      izbor('zakljucak', 'Zašto je Luka zaboravio kapu?', ['Žurio je u razred kad je zazvonilo.', 'Kapa mu se nije sviđala pa ju je bacio.', 'Netko mu je kapu sakrio u razredu.'], 'Kad je zazvonilo, Luka je otrčao u razred. Žurio je, pa je kapa ostala na klupi.'),
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
      izbor('podatak', 'Kamo idu učenici?', ['u gradsku knjižnicu', 'u gradsko kazalište', 'u gradski park'], 'U drugoj rečenici piše: „idemo u posjet gradskoj knjižnici”.', 1),
      broj('podatak', 'U koliko sati učenici polaze ispred škole?', 9, 'U obavijesti piše: „Polazimo ispred škole u 9 sati.”', 1),
      izbor('podatak', 'Što učenici trebaju ponijeti?', ['ruksak, bocu vode i užinu', 'knjige, bilježnice i pernicu', 'kišobran i kapu'], 'Učiteljica piše: „Ponesite mali ruksak, bocu vode i užinu.”'),
      izbor('zakljucak', 'Koliko će sati učenici biti izvan škole?', ['3 sata', '2 sata', '5 sati'], 'Polaze u 9, a vraćaju se u 12 sati. Od 9 do 12 su 3 sata.', 3),
      izbor('podatak', 'Tko je napisao obavijest?', ['učiteljica Ana', 'knjižničarka', 'ravnatelj'], 'Obavijest je potpisala „Vaša učiteljica Ana”.', 1),
      izbor('vrednovanje', 'Čemu služi ovaj tekst?', ['Obavještava učenike o posjetu knjižnici.', 'Priča izmišljenu priču.', 'Opisuje kako izgleda gradska knjižnica.'], 'Obavijest donosi važne podatke: kamo idemo, kada polazimo i što ponijeti.', 3)
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
      izbor('zakljucak', 'Zašto svaki dan treba provjeriti vatu?', ['Zrnu treba vlaga da proklija.', 'Da vata ne odleti s čaše.', 'Da čaša ostane čista i suha.'], 'Uputa traži da vata bude vlažna. Bez vode zrno ne bi proklijalo.', 3),
      izbor('vrednovanje', 'Zašto je važno slijediti korake ovim redom?', ['Svaki korak priprema sljedeći.', 'Da uputa bude dulja i zanimljivija.', 'Da lakše prebrojimo zrna graha.'], 'Grah se ne može staviti na vatu prije nego što je vata u čaši i navlažena.', 3)
    ]
  },
  {
    id: 'r2-nova-prijateljica', razred: 2, tema: 'citanje-2', ishod: 'OŠ HJ A.2.3', vrsta: 'pripovjedni',
    naslov: 'Nova prijateljica',
    tekst: 'Ema je bila nova u razredu. Prvi dan sjedila je sama i gledala kroz prozor. Na odmoru joj je prišla Iva i pitala je želi li se igrati lovice. Ema se nasmiješila i kimnula. Do kraja odmora dvije su djevojčice trčale i smijale se. Kad je zazvonilo, Ema je rekla: „Sutra opet!”',
    pitanja: [
      izbor('zakljucak', 'Kako se Ema vjerojatno osjećala prvi dan prije odmora?', ['usamljeno', 'ljutito', 'pospano'], 'Sjedila je sama i gledala kroz prozor. To pokazuje da se osjećala usamljeno.'),
      izbor('podatak', 'Što je Iva pitala Emu?', ['želi li se igrati lovice', 'gdje joj je nova kuća', 'kako se zove njezin pas'], 'Iva ju je „pitala želi li se igrati lovice”.', 1),
      tocnoNetocno('podatak', 'Je li Ema prva prišla Ivi?', false, 'U tekstu piše da je Iva prišla Emi.'),
      izbor('tumacenje', 'Kako se Emino raspoloženje promijenilo tijekom dana?', ['Od usamljenosti do veselja.', 'Od veselja do tuge i straha.', 'Cijeli je dan bila ista.'], 'Na početku je sjedila sama, a na kraju je trčala i smijala se s Ivom.', 3),
      izbor('zakljucak', 'Što Ema želi reći riječima „Sutra opet!”?', ['Želi se opet igrati s Ivom.', 'Želi što prije otići kući.', 'Ne voli igrati lovicu.'], 'Ema je uživala u igri pa je želi ponoviti sljedeći dan.'),
      izbor('vrednovanje', 'Koji bi naslov još mogao odgovarati ovoj priči?', ['Prvi dan s prijateljicom', 'Kišni dan u školi', 'Izgubljena lopta na odmoru'], 'Priča govori o tome kako je Ema prvi dan stekla prijateljicu.', 3)
    ]
  },

  // ── 3. razred ────────────────────────────────────────────────────
  {
    id: 'r3-jez', razred: 3, tema: 'citanje-3', ishod: 'OŠ HJ A.3.3', vrsta: 'obavijesni',
    naslov: 'Jež',
    tekst: 'Jež je mala životinja koja živi u vrtovima, parkovima i na rubovima šuma. Danju uglavnom spava u gnijezdu od lišća, a noću izlazi tražiti hranu. Jede kukce i puževe, pa je koristan vrtlarima. Kad osjeti opasnost, jež se sklupča u bodljikavu kuglu. Zimi jež spava zimskim snom. Prije toga mora pojesti dovoljno hrane jer tijekom zime gotovo ništa ne jede. Ako zimi vidite ježa koji luta, možda je bolestan ili gladan i treba mu pomoć stručnjaka.',
    pitanja: [
      izbor('podatak', 'Kada jež izlazi tražiti hranu?', ['noću', 'ujutro', 'u podne'], 'Druga rečenica kaže: „noću izlazi tražiti hranu”.', 1),
      izbor('podatak', 'Što jež radi kad osjeti opasnost?', ['sklupča se u bodljikavu kuglu', 'brzo se popne na najbliže drvo', 'glasno zviždi da pozove druge'], 'U tekstu piše: „jež se sklupča u bodljikavu kuglu”.', 1),
      izbor('zakljucak', 'Zašto je jež koristan vrtlarima?', ['Jede kukce i puževe koji oštećuju biljke.', 'Kopa duboke rupe po cijelom vrtu.', 'Pomaže vrtlarima zalijevati biljke.'], 'Tekst kaže da jede kukce i puževe. Oni jedu vrtne biljke, pa jež vrtlaru pomaže.'),
      izbor('zakljucak', 'Zašto jež prije zime mora pojesti mnogo hrane?', ['Tijekom zimskog sna gotovo ništa ne jede.', 'Zimi raste brže nego u ostalim dobima.', 'Zimi je hrana u vrtovima nezdrava za njega.'], 'Tekst objašnjava: „tijekom zime gotovo ništa ne jede”. Zalihe mu trebaju za cijelu zimu.'),
      rijec('podatak', 'U kojem godišnjem dobu jež spava zimskim snom?', 'zima', 'U tekstu piše: „Zimi jež spava zimskim snom.”', ['zimi', 'zimu']),
      izbor('tumacenje', 'Što trebaš učiniti ako zimi vidiš ježa koji luta?', ['Reći odrasloj osobi da se potraži pomoć stručnjaka.', 'Odnijeti ga kući i hraniti ga kao ljubimca.', 'Otjerati ga natrag u šumu da ondje prespava.'], 'Tekst kaže da je takav jež možda bolestan ili gladan i da mu treba pomoć stručnjaka.', 3),
      izbor('vrednovanje', 'Kakav je ovo tekst?', ['Obavijesni tekst koji donosi podatke o ježu.', 'Bajka u kojoj jež razgovara s ljudima.', 'Pjesma o ježu napisana u kiticama.'], 'Tekst ne priča izmišljenu priču. Donosi podatke o tome gdje jež živi, čime se hrani i kako preživljava zimu.', 3)
    ]
  },
  {
    id: 'r3-stari-bicikl', razred: 3, tema: 'citanje-3', ishod: 'OŠ HJ A.3.3', vrsta: 'pripovjedni',
    naslov: 'Stari bicikl',
    tekst: 'Marko je u djedovoj šupi pronašao stari zahrđali bicikl. Kotači su bili ispuhani, a lanac je škripao. „Može li se ovo popraviti?” upitao je djeda. Djed se nasmijao i donio kutiju s alatom. Cijelo su poslijepodne čistili hrđu, podmazivali lanac i pumpali gume. Kad su završili, Marko je sjeo na bicikl i provozao se oko kuće. „Vozi se kao nov!” viknuo je. Djed je zadovoljno brisao ruke o stari ručnik.',
    pitanja: [
      izbor('podatak', 'Gdje je Marko pronašao bicikl?', ['u djedovoj šupi', 'u školskom dvorištu', 'u gradskom parku'], 'Prva rečenica: „Marko je u djedovoj šupi pronašao stari zahrđali bicikl.”', 1),
      izbor('podatak', 'Što nije bilo u redu s biciklom?', ['Kotači su bili ispuhani, a lanac je škripao.', 'Nije imao sjedalo ni svjetlo za noć.', 'Bio je prevelik i pretežak za Marka.'], 'Druga rečenica opisuje kvarove: ispuhane kotače i lanac koji škripi.', 1),
      redoslijed('podatak', 'Poredaj događaje iz priče.', ['Marko je pronašao bicikl.', 'Djed je donio kutiju s alatom.', 'Očistili su hrđu i podmazali lanac.', 'Marko se provozao oko kuće.'], 'Događaji su poredani onako kako se zbivaju u tekstu.'),
      izbor('zakljucak', 'Kako se djed osjećao na kraju?', ['zadovoljno', 'tužno', 'zabrinuto'], 'U posljednjoj rečenici piše da je djed „zadovoljno” brisao ruke.', 1),
      izbor('tumacenje', 'Što priča pokazuje o starim stvarima?', ['Stare stvari često se mogu popraviti i ponovno koristiti.', 'Stare stvari treba odmah odnijeti na otpad.', 'Popravljanje bicikla posao je samo za odrasle.'], 'Marko i djed popravili su zahrđali bicikl, pa ga Marko opet može voziti.', 3),
      izbor('vrednovanje', 'Zašto su neke rečenice u priči napisane u navodnicima?', ['To su riječi koje likovi izgovaraju.', 'To su najvažnije rečenice u priči.', 'To su naslovi pojedinih poglavlja.'], 'U navodnicima su Markove riječi, primjerice „Vozi se kao nov!”.', 2)
    ]
  },
  {
    id: 'r3-poruka', razred: 3, tema: 'citanje-3', ishod: 'OŠ HJ A.3.3', vrsta: 'poruka',
    naslov: 'Poruka na hladnjaku',
    tekst: 'Dragi Petre, mama i ja otišle smo u trgovinu. Vratit ćemo se oko 18 sati. Ručak je u hladnjaku, samo ga zagrij. Ne zaboravi nahraniti Mrvu, hrana je u ormariću ispod sudopera. Ako netko zazvoni, nemoj otvarati vrata nepoznatima. Ako nešto trebaš, nazovi me. Tvoja sestra Lea',
    pitanja: [
      izbor('podatak', 'Tko je napisao poruku?', ['Lea', 'mama', 'Petar'], 'Poruka je potpisana: „Tvoja sestra Lea”.', 1),
      broj('podatak', 'Oko kojega će se sata mama i Lea vratiti?', 18, 'U poruci piše: „Vratit ćemo se oko 18 sati.”', 1),
      izbor('podatak', 'Gdje je hrana za Mrvu?', ['u ormariću ispod sudopera', 'u hladnjaku pokraj ručka', 'na stolu u dnevnoj sobi'], 'Lea piše da je hrana „u ormariću ispod sudopera”.'),
      izbor('zakljucak', 'Tko je najvjerojatnije Mrva?', ['kućni ljubimac', 'Petrova prijateljica', 'susjeda'], 'Mrvu treba nahraniti posebnom hranom iz ormarića, pa je to najvjerojatnije kućni ljubimac.', 3),
      tocnoNetocno('podatak', 'Je li ručak na štednjaku?', false, 'U poruci piše da je ručak u hladnjaku.'),
      izbor('vrednovanje', 'Koja uputa u poruci brine o Petrovoj sigurnosti?', ['Ne otvaraj vrata nepoznatima.', 'Nahrani Mrvu hranom iz ormarića.', 'Zagrij ručak koji je u hladnjaku.'], 'Zabrana otvaranja vrata nepoznatima štiti Petra dok je sam kod kuće.', 2)
    ]
  },

  {
    id: 'r3-pcele', razred: 3, tema: 'citanje-3', ishod: 'OŠ HJ A.3.3', vrsta: 'obavijesni',
    naslov: 'Pčele',
    tekst: 'Pčele žive zajedno u košnici. U jednoj košnici živi jedna matica, mnogo radilica i nešto trutova. Matica nese jaja. Radilice čiste košnicu, hrane mlade pčele i čuvaju ulaz. One i lete na cvjetove po nektar i pelud. Od nektara pčele stvaraju med. Dok lete s cvijeta na cvijet, pčele na dlačicama prenose pelud. Tako pomažu biljkama da stvore plodove. Zato kažemo da pčele oprašuju biljke. Bez pčela bi u voćnjacima bilo mnogo manje jabuka, krušaka i trešanja.',
    pitanja: [
      izbor('podatak', 'Tko u košnici nese jaja?', ['matica', 'radilica', 'trut'], 'U tekstu piše: „Matica nese jaja.”', 1),
      rijec('podatak', 'Što pčele stvaraju od nektara?', 'med', 'U tekstu piše: „Od nektara pčele stvaraju med.”', [], 1),
      tocnoNetocno('podatak', 'Živi li u jednoj košnici mnogo matica?', false, 'U tekstu piše da u košnici živi jedna matica.'),
      izbor('tumacenje', 'Što u ovom tekstu znači riječ „oprašuju”?', ['prenose pelud s cvijeta na cvijet', 'skupljaju prašinu po košnici', 'čiste cvjetove od lišća'], 'Rečenica prije objašnjava: pčele prenose pelud s cvijeta na cvijet, i zato kažemo da oprašuju.', 3),
      izbor('zakljucak', 'Zašto bi bez pčela bilo manje jabuka?', ['Nitko ne bi prenosio pelud s cvijeta na cvijet.', 'Pčele bi pojele sve jabuke s grana.', 'Jabuke ne bi imale dovoljno vode za rast.'], 'Tekst kaže da pčele prenošenjem peludi pomažu biljkama stvoriti plodove.', 2),
      izbor('vrednovanje', 'Koja bi slika najbolje pristajala uz ovaj tekst?', ['pčela na cvijetu jabuke', 'leptir na livadnom cvijeću', 'mačka na prozoru kuće'], 'Tekst govori o pčelama i tome kako oprašuju voćke.', 2)
    ]
  },
  {
    id: 'r3-plakat', razred: 3, tema: 'citanje-3', ishod: 'OŠ HJ C.3.3', vrsta: 'plakat',
    naslov: 'Plakat',
    tekst: 'LUTKARSKA PREDSTAVA „ŠEGRT HLAPIĆ”\nGradsko kazalište lutaka\nSubota, 14. studenoga, u 11 sati\nTrajanje: 45 minuta\nUlaznica: 5 eura (djeca do 6 godina ne plaćaju)\nUlaznice se kupuju na blagajni kazališta od 9 sati.',
    pitanja: [
      izbor('podatak', 'Gdje se održava predstava?', ['u Gradskom kazalištu lutaka', 'u školskoj sportskoj dvorani', 'u gradskoj knjižnici'], 'Drugi redak plakata: „Gradsko kazalište lutaka”.', 1),
      broj('podatak', 'Koliko eura stoji ulaznica?', 5, 'Na plakatu piše: „Ulaznica: 5 eura”.', 1),
      izbor('zakljucak', 'Tko od navedenih ne mora platiti ulaznicu?', ['Ivin brat koji ima 4 godine', 'Ivina sestra koja ima 8 godina', 'Ivina mama'], 'Djeca do 6 godina ne plaćaju; brat ima 4 godine.', 2),
      izbor('zakljucak', 'U koliko sati predstava završava?', ['u 11 sati i 45 minuta', 'u 12 sati i 45 minuta', 'u 11 sati i 15 minuta'], 'Počinje u 11 sati i traje 45 minuta: 11 sati + 45 minuta.', 3),
      izbor('vrednovanje', 'Čemu služi ovaj plakat?', ['obavještava o kulturnom događaju', 'priča bajku o mačku', 'objašnjava kako se izrađuju lutke'], 'Plakat donosi podatke o predstavi: što, gdje, kada i koliko stoji.', 2),
      tocnoNetocno('podatak', 'Mogu li se ulaznice kupiti na blagajni od 9 sati?', true, 'Zadnji redak: „Ulaznice se kupuju na blagajni kazališta od 9 sati.”')
    ]
  },
  {
    id: 'r3-hranilica', razred: 3, tema: 'citanje-3', ishod: 'OŠ HJ B.3.1', vrsta: 'pripovjedni',
    naslov: 'Hranilica',
    tekst: 'Pao je prvi snijeg. Nina je kroz prozor gledala vrapca koji je kljunom kopao po bijelom dvorištu. „Ne može pronaći hranu”, rekla je bratu Ivanu. Ivan je iz podruma donio staru drvenu kutiju. Zajedno su joj izrezali otvor, a tata je pomogao objesiti je na granu oraha. Nina je u nju nasula sjemenke suncokreta. Sutradan ujutro na hranilici je sjedila sjenica, a ubrzo su došla i dva vrapca. Nina i Ivan promatrali su ih iza zavjese, tiho da ih ne preplaše.',
    pitanja: [
      izbor('podatak', 'Što je Ivan donio iz podruma?', ['staru drvenu kutiju', 'kavez za male ptice', 'vreću sjemenki'], 'U tekstu piše da je Ivan „iz podruma donio staru drvenu kutiju”.', 1),
      izbor('zakljucak', 'Zašto su djeca napravila hranilicu?', ['Ptice zimi teško pronalaze hranu.', 'Željela su uhvatiti vrapca.', 'Tata im je to zadao za zadaću.'], 'Nina je vidjela vrapca kako uzalud traži hranu po snijegu.', 2),
      redoslijed('podatak', 'Poredaj događaje iz priče.', ['Nina je vidjela vrapca u snijegu.', 'Ivan je donio kutiju.', 'Tata je pomogao objesiti hranilicu.', 'Na hranilicu je sletjela sjenica.'], 'Događaji su poredani onako kako se zbivaju u priči.'),
      izbor('tumacenje', 'Zašto su djeca ptice promatrala tiho?', ['Nisu ih htjela preplašiti.', 'Spavala su.', 'Bila su ljuta na ptice.'], 'U zadnjoj rečenici piše: „tiho da ih ne preplaše”.', 1),
      izbor('tumacenje', 'Kakvi su Nina i Ivan?', ['brižni prema životinjama', 'nestrpljivi i ljuti na ptice', 'uplašeni od ptica'], 'Primijetili su da ptice nemaju hrane i pomogli im.', 2),
      izbor('vrednovanje', 'Koja je poruka ove priče?', ['Brinimo o životinjama kad im je teško.', 'Snijeg je opasan za djecu i odrasle.', 'Stare kutije treba odmah baciti u smeće.'], 'Djeca su zimi pomogla pticama koje nisu mogle pronaći hranu.', 3)
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
      izbor('tumacenje', 'Kako nastaju sedrene pregrade?', ['Tvari otopljene u vodi talože se na mahovini i algama.', 'Ljudi slažu kamene zidove između susjednih jezera.', 'Vjetar nanosi pijesak i zemlju u vodu.'], 'Tekst objašnjava da pregrade nastaju taloženjem tvari iz vode na mahovini i algama.'),
      izbor('zakljucak', 'Zašto se izgled jezera polako mijenja?', ['Sedrene pregrade s vremenom rastu.', 'Posjetitelji mijenjaju staze.', 'Svake godine iskopa se novo jezero.'], 'Rečenica „Pregrade s vremenom rastu, pa se izgled jezera polako mijenja” daje uzrok i posljedicu.'),
      izbor('zakljucak', 'Zašto je kupanje u jezerima vjerojatno zabranjeno?', ['Da se zaštite osjetljive sedrene pregrade i voda.', 'Jer je voda u jezerima pretopla za kupanje.', 'Jer se kupanje naplaćuje posebnom ulaznicom.'], 'Tekst ne navodi razlog izravno, ali opisuje sedru kao iznimnu i osjetljivu pojavu koju treba čuvati.', 3),
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
      izbor('podatak', 'Što se ne posuđuje kući?', ['enciklopedije i rječnici', 'slikovnice', 'knjige za školsku lektiru'], 'U pravilima piše da se enciklopedije i rječnici čitaju u knjižnici.'),
      izbor('zakljucak', 'Marko želi posuditi knjigu u subotu. Što će se dogoditi?', ['Neće je moći posuditi jer je knjižnica zatvorena.', 'Dobit će knjigu na posudbu od 30 dana.', 'Moći će posuditi tri knjige umjesto dvije.'], 'Knjižnica radi samo od ponedjeljka do petka.', 2),
      izbor('tumacenje', 'Zašto knjižnica vjerojatno ograničava broj knjiga koje učenik smije posuditi?', ['Da knjige budu dostupne svim učenicima.', 'Da učenici manje čitaju i više se igraju.', 'Da se knjige brže potroše i propadnu.'], 'Pravilo to ne kaže izravno. Kad nitko ne uzme previše knjiga, ostane ih dovoljno za druge.', 3),
      izbor('vrednovanje', 'Kako je ovaj tekst složen?', ['Svaka rečenica donosi jedno pravilo.', 'Prati događaje jednoga dana.', 'Napisan je u kiticama kao pjesma.'], 'Svaka rečenica opisuje drugo pravilo: radno vrijeme, broj knjiga, rok, produljenje, zabranu i naknadu štete.', 3)
    ]
  },
  {
    id: 'r4-ivana', razred: 4, tema: 'citanje-4', ishod: 'OŠ HJ A.4.3', vrsta: 'biografija',
    naslov: 'Ivana Brlić-Mažuranić',
    tekst: 'Ivana Brlić-Mažuranić rođena je 1874. godine u Ogulinu. Odrasla je u obitelji u kojoj se mnogo čitalo. Djed joj je bio pjesnik i ban Ivan Mažuranić. Pisati je počela još kao djevojčica. Kad je imala svoju djecu, pisala je i za njih. Godine 1913. objavljen je roman Čudnovate zgode šegrta Hlapića, a 1916. zbirka Priče iz davnine. Zbog ljepote njezinih bajki nazivaju je hrvatskim Andersenom. Bila je prva žena primljena u Jugoslavensku akademiju znanosti i umjetnosti. Umrla je 1938. godine u Zagrebu.',
    pitanja: [
      izbor('podatak', 'U kojem je gradu rođena Ivana Brlić-Mažuranić?', ['u Ogulinu', 'u Zagrebu', 'u Slavonskom Brodu'], 'Prva rečenica: „rođena je 1874. godine u Ogulinu”.', 1),
      izbor('podatak', 'Tko joj je bio djed?', ['pjesnik i ban Ivan Mažuranić', 'danski pisac Hans Christian Andersen', 'šegrt Hlapić'], 'U tekstu piše: „Djed joj je bio pjesnik i ban Ivan Mažuranić.”', 1),
      broj('zakljucak', 'Koliko je godina imala kad je objavljen roman o šegrtu Hlapiću?', 39, 'Rođena je 1874., a roman je objavljen 1913.: 1913 − 1874 = 39.', 3),
      redoslijed('podatak', 'Poredaj događaje iz njezina života.', ['rođena je u Ogulinu', 'objavljen je roman o Hlapiću', 'objavljene su Priče iz davnine', 'umrla je u Zagrebu'], 'Godine redom: 1874., 1913., 1916., 1938.'),
      izbor('tumacenje', 'Zašto je nazivaju hrvatskim Andersenom?', ['Pisala je lijepe bajke, kao i danski pisac Andersen.', 'Rođena je u Danskoj, u Andersenovu gradu.', 'Prevela je na hrvatski sve Andersenove knjige.'], 'Tekst kaže da je tako nazivaju „zbog ljepote njezinih bajki”; Andersen je slavni pisac bajki.', 3),
      izbor('vrednovanje', 'Kakav je ovo tekst?', ['životopis stvarne osobe', 'bajka s izmišljenim likovima', 'oglas za knjigu'], 'Tekst redom opisuje život stvarne spisateljice: rođenje, djela i smrt.', 2)
    ]
  },
  {
    id: 'r4-vozni-red', razred: 4, tema: 'citanje-4', ishod: 'OŠ HJ C.4.1', vrsta: 'tablica',
    naslov: 'Vozni red — linija 7 (Kolodvor – Zoološki vrt)',
    tekst: 'Stanica — 1. polazak — 2. polazak — 3. polazak\nKolodvor — 8:10 — 9:40 — 11:10\nGradski trg — 8:18 — 9:48 — 11:18\nKnjižnica — 8:25 — 9:55 — 11:25\nZoološki vrt — 8:40 — 10:10 — 11:40\nNapomena: Linija 7 ne vozi nedjeljom i blagdanom.',
    pitanja: [
      izbor('podatak', 'U koliko sati u Zoološki vrt stiže autobus koji s Kolodvora polazi u 9:40?', ['u 10:10', 'u 9:55', 'u 11:40'], 'U stupcu 2. polaska, u retku Zoološki vrt, piše 10:10.', 1),
      broj('zakljucak', 'Koliko minuta traje vožnja od Kolodvora do Zoološkog vrta?', 30, 'Npr. od 8:10 do 8:40 prođe 30 minuta; isto vrijedi za svaki polazak.', 2),
      izbor('zakljucak', 'Lana mora biti u Zoološkom vrtu najkasnije u 11 sati. Kada najkasnije mora ući u autobus na Gradskom trgu?', ['u 9:48', 'u 11:18', 'u 8:18'], 'Autobus s Gradskog trga u 9:48 stiže u 10:10; sljedeći stiže tek u 11:40.', 3),
      tocnoNetocno('podatak', 'Vozi li linija 7 nedjeljom?', false, 'U napomeni piše da linija 7 ne vozi nedjeljom i blagdanom.'),
      broj('zakljucak', 'Koliko minuta vozi autobus od Knjižnice do Zoološkog vrta?', 15, 'Od 8:25 do 8:40 prođe 15 minuta.', 2),
      izbor('vrednovanje', 'Zašto je vozni red napisan u stupcima, a ne u rečenicama?', ['Tako se vrijeme polaska brže pronađe.', 'Tako tekst zauzima više mjesta na papiru.', 'Tako se napomena na dnu ne vidi.'], 'U tablici se pogledom spoje redak (stanica) i stupac (polazak).', 2)
    ]
  },
  {
    id: 'r4-utrka', razred: 4, tema: 'citanje-4', ishod: 'OŠ HJ B.4.1', vrsta: 'pripovjedni',
    naslov: 'Utrka',
    tekst: 'Toma je cijelu jesen trenirao za školsku utrku. Svako jutro trčao je oko igrališta, i kad je padala kiša. Na dan utrke bio je najbrži od početka. Pred zadnjim zavojem začuo je jauk. Okrenuo se i vidio da je Leon pao i drži se za koljeno. Toma je zastao. Mogao je produžiti i pobijediti. Umjesto toga vratio se, pomogao Leonu ustati i zajedno s njim doveo ga do cilja. Stigli su posljednji. Kad je učitelj dijelio medalje, cijela je škola zapljeskala Tomi najglasnije.',
    pitanja: [
      izbor('podatak', 'Kako se Toma pripremao za utrku?', ['svako je jutro trčao oko igrališta', 'gledao je utrke na televiziji', 'vozio je bicikl po gradu'], 'Druga rečenica: „Svako jutro trčao je oko igrališta”.', 1),
      izbor('podatak', 'Što se dogodilo Leonu?', ['pao je i ozlijedio koljeno', 'izgubio je jednu tenisicu', 'zalutao je izvan staze'], 'Toma je vidio da je Leon pao i drži se za koljeno.', 1),
      izbor('tumacenje', 'Kakav je Toma?', ['uporan i spreman pomoći', 'lijen i nestrpljiv', 'hvalisav i zločest prema drugima'], 'Trenirao je i po kiši (uporan) i odustao od pobjede da pomogne Leonu.', 2),
      izbor('zakljucak', 'Zašto je škola Tomi zapljeskala najglasnije?', ['Pomogao je prijatelju umjesto da pobijedi.', 'Stigao je prvi na cilj i oborio rekord.', 'Bio je najviši i najjači učenik u razredu.'], 'Stigao je posljednji, ali je pomogao Leonu — to su svi cijenili.', 2),
      tocnoNetocno('podatak', 'Je li Toma pobijedio u utrci?', false, 'U tekstu piše: „Stigli su posljednji.”'),
      izbor('vrednovanje', 'Koja je glavna poruka priče?', ['Pomoći drugome vrijedi više od pobjede.', 'Trčanje po kiši je opasno.', 'Na utrci treba gledati samo naprijed.'], 'Toma je odabrao pomoći, a škola ga je zbog toga nagradila pljeskom.', 3)
    ]
  },
  {
    id: 'r4-stari-hrast', razred: 4, tema: 'knjizevnost-4', ishod: 'OŠ HJ B.4.1', vrsta: 'pripovjedni',
    naslov: 'Stari hrast',
    tekst: 'Na rubu sela stajao je stari hrast. Svako proljeće budio se polako, kao da se proteže nakon dugog sna. Djeca su se ljeti skrivala u njegovoj sjeni, a on im je šuštanjem lišća pričao priče o vjetrovima i olujama. Jedne jeseni došli su ljudi s pilama. Htjeli su ga srušiti i ondje napraviti parkiralište. Djeca su skupila potpise cijeloga sela i odnijela ih načelniku. Hrast je ostao. Te je noći, kažu, lišće šuštalo tiše nego ikad, kao da zahvaljuje.',
    pitanja: [
      izbor('tumacenje', 'Koja rečenica pokazuje da pisac hrastu daje ljudske osobine?', ['„On im je šuštanjem lišća pričao priče.”', '„Na rubu sela stajao je stari hrast.”', '„Jedne jeseni došli su ljudi s pilama.”'], 'Pričati priče mogu ljudi. Kad pisac to pripiše hrastu, daje mu ljudsku osobinu (personifikacija).', 3),
      izbor('podatak', 'Zašto su ljudi htjeli srušiti hrast?', ['da ondje naprave parkiralište', 'jer je hrast bio bolestan', 'da dobiju drva za zimu'], 'U tekstu piše da su ondje htjeli napraviti parkiralište.', 1),
      izbor('podatak', 'Što su djeca učinila?', ['skupila su potpise sela i odnijela ih načelniku', 'sakrila su pile ljudima koji su došli', 'popela su se na hrast i ondje ostala cijelu noć'], 'Djeca su „skupila potpise cijeloga sela i odnijela ih načelniku”.', 1),
      izbor('zakljucak', 'Zašto je hrast ostao?', ['Djeca i selo zauzeli su se za njega.', 'Ljudi nisu imali dovoljno oštre pile.', 'Došla je zima pa se nije moglo raditi.'], 'Odmah nakon što su djeca predala potpise piše: „Hrast je ostao.”'),
      izbor('tumacenje', 'Što izražava posljednja rečenica?', ['zahvalnost hrasta djeci', 'strah od jesenske oluje', 'tugu zbog opalog lišća'], 'Lišće šušti „kao da zahvaljuje”.', 2),
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
      izbor('tumacenje', 'Što su učenici 4. b razreda učinili nakon predavanja?', ['Pripremili su voćne ražnjiće.', 'Kupili su vrećice grickalica.', 'Napisali su oglas za grickalice.'], 'U zadnjoj rečenici piše da su pripremili voćne ražnjiće, a to je zdraviji izbor od grickalica.', 2)
    ]
  }
];

// Dodatni tekstovi (seeds/citanje-dodatni.js) koriste iste pomoćnike.
TEKSTOVI.push(...require('./citanje-dodatni')({ izbor, broj, rijec, redoslijed, tocnoNetocno }));

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
