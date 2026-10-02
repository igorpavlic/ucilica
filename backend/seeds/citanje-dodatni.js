/**
 * citanje-dodatni.js — dodatni izvorni tekstovi za čitanje s razumijevanjem.
 *
 * Napisani za Mudrolinu (ništa nije preuzeto). Uz postojeće tekstove u
 * citanje-tekstovi.js podižu banku čitanja na ~140 različitih pitanja po
 * razredu, pa dijete ni nakon 20 kvizova ne dobiva isto pitanje. Pitanja
 * imenuju lik ili temu teksta, da se tekst pitanja ne ponavlja među tekstovima.
 *
 * Izvoz je funkcija koja prima pomoćnike iz citanje-tekstovi.js (izbor, broj,
 * rijec, redoslijed, tocnoNetocno) — tako nema kružnog učitavanja modula.
 */
module.exports = ({ izbor, broj, rijec, redoslijed, tocnoNetocno }) => [
  // ── 2. razred ────────────────────────────────────────────────────
  {
    id: 'r2-snjegovic', razred: 2, tema: 'citanje-2', ishod: 'OŠ HJ A.2.3', vrsta: 'pripovjedni',
    naslov: 'Snjegović',
    tekst: 'U subotu je napadao snijeg. Mia i njezin brat Jan izašli su u dvorište. Najprije su napravili veliku kuglu za trbuh, a zatim manju za glavu. Jan je donio mrkvu za nos, a Mia dva kamenčića za oči. Na glavu su mu stavili staru kapu. Kad je izašlo sunce, snjegović se počeo topiti. Mia je bila tužna, ali Jan je rekao: „Sljedeći put napravit ćemo dva!”',
    pitanja: [
      izbor('podatak', 'Kojeg je dana napadao snijeg u priči o snjegoviću?', ['u subotu', 'u nedjelju', 'u ponedjeljak'], 'Prva rečenica: „U subotu je napadao snijeg.”', 1),
      izbor('podatak', 'Što je Jan donio za snjegovićev nos?', ['mrkvu', 'kamenčić', 'gumb'], 'U tekstu piše: „Jan je donio mrkvu za nos”.', 1),
      redoslijed('podatak', 'Poredaj kako su Mia i Jan gradili snjegovića.', ['Napravili su veliku kuglu za trbuh.', 'Napravili su manju kuglu za glavu.', 'Stavili su mu staru kapu.'], 'Najprije trbuh, zatim glava, a kapa se stavlja na gotovu glavu.'),
      izbor('zakljucak', 'Zašto se snjegović počeo topiti?', ['Izašlo je sunce i bilo je toplije.', 'Djeca su ga srušila loptom.', 'Pas ga je odnio u kuću.'], 'Snjegović se topi kad izađe sunce i snijeg zagrije.', 2),
      tocnoNetocno('podatak', 'Je li Mia bila vesela kad se snjegović topio?', false, 'U tekstu piše da je Mia bila tužna.'),
      izbor('tumacenje', 'Kako je Jan utješio sestru Miu?', ['Obećao je da će sljedeći put napraviti dva snjegovića.', 'Kupio joj je sladoled.', 'Rekao joj je da ide spavati.'], 'Jan je rekao: „Sljedeći put napravit ćemo dva!”', 2)
    ]
  },
  {
    id: 'r2-pozivnica', razred: 2, tema: 'citanje-2', ishod: 'OŠ HJ A.2.3', vrsta: 'pozivnica',
    naslov: 'Pozivnica',
    tekst: 'Draga Lana, pozivam te na svoj rođendan! Slavimo u nedjelju, 14. svibnja, od 16 do 19 sati. Proslava je u mojem dvorištu, u Ulici lipa 5. Igrat ćemo se lovice i jesti tortu od jagoda. Ako pada kiša, slavimo u dnevnom boravku. Molim te, javi mi do petka hoćeš li doći. Tvoja prijateljica Ema',
    pitanja: [
      izbor('podatak', 'Tko je napisao pozivnicu za rođendan?', ['Ema', 'Lana', 'Emina mama'], 'Pozivnicu je potpisala „Tvoja prijateljica Ema”.', 1),
      broj('podatak', 'U koliko sati počinje Emina proslava?', 16, 'U pozivnici piše: „od 16 do 19 sati”.', 1),
      broj('zakljucak', 'Koliko sati traje Emina proslava?', 3, 'Od 16 do 19 sati prođu 3 sata.', 3),
      izbor('podatak', 'Kakva će torta biti na Eminu rođendanu?', ['od jagoda', 'od čokolade', 'od banana'], 'Ema piše da će jesti „tortu od jagoda”.', 1),
      izbor('zakljucak', 'Gdje će se slaviti ako bude padala kiša?', ['u dnevnom boravku', 'u školskoj dvorani', 'u parku'], 'U pozivnici piše: „Ako pada kiša, slavimo u dnevnom boravku.”', 2),
      izbor('vrednovanje', 'Zašto Ema u pozivnici piše adresu?', ['Da Lana zna kamo treba doći.', 'Da Lana pošalje pismo.', 'Da se pozivnica čini duljom.'], 'Gost mora znati gdje je proslava, zato pozivnica sadrži adresu.', 2)
    ]
  },

  {
    id: 'r2-mali-vrt', razred: 2, tema: 'citanje-2', ishod: 'OŠ HJ A.2.3', vrsta: 'pripovjedni',
    naslov: 'Mali vrt',
    tekst: 'Baka Mara dala je Teu malu gredicu u vrtu. Teo je posadio rotkvice, salatu i jedan suncokret. Svako jutro zalijevao je gredicu kantom. Nakon tri tjedna iščupao je prvu rotkvicu. Bila je crvena i hrskava. Salatu su pojeli za ručak, a suncokret je narastao viši od Tea. „Iduće godine posadit ću i mrkvu”, rekao je Teo.',
    pitanja: [
      izbor('podatak', 'Tko je Teu dao gredicu u vrtu?', ['baka Mara', 'tata', 'učiteljica'], 'Prva rečenica: „Baka Mara dala je Teu malu gredicu”.', 1),
      izbor('podatak', 'Što je Teo posadio u svoju gredicu?', ['rotkvice, salatu i suncokret', 'mrkvu i krumpir', 'jagode i trešnje'], 'U tekstu piše da je posadio rotkvice, salatu i jedan suncokret.', 1),
      izbor('podatak', 'Kakva je bila prva Teova rotkvica?', ['crvena i hrskava', 'žuta i mekana', 'zelena i gorka'], 'U tekstu piše: „Bila je crvena i hrskava.”', 1),
      izbor('zakljucak', 'Zašto je Teov vrt dobro rastao?', ['Teo ga je svako jutro zalijevao.', 'Nitko ga nije dirao.', 'Padao je snijeg.'], 'Biljke trebaju vodu, a Teo je gredicu zalijevao svako jutro.', 2),
      tocnoNetocno('podatak', 'Je li suncokret narastao viši od Tea?', true, 'U tekstu piše da je suncokret narastao viši od Tea.'),
      izbor('zakljucak', 'Što će Teo posaditi iduće godine?', ['mrkvu', 'samo suncokret', 'ništa'], 'Teo kaže: „Iduće godine posadit ću i mrkvu.”', 1)
    ]
  },

  // ── 3. razred ────────────────────────────────────────────────────
  {
    id: 'r3-kornjaca', razred: 3, tema: 'citanje-3', ishod: 'OŠ HJ A.3.3', vrsta: 'pripovjedni',
    naslov: 'Kornjača Žuja',
    tekst: 'Razred 3. a dobio je kornjaču. Djeca su joj dala ime Žuja jer je imala žute mrlje na oklopu. Svaki tjedan dvoje učenika brinulo se o njoj. Mijenjali su vodu u terariju i davali joj salatu. Jednog jutra Žuja nije htjela jesti. Učiteljica je objasnila da kornjače kad zahladi usporavaju i manje jedu. U proljeće je Žuja opet bila gladna i živahna, a djeca su joj napravila veći terarij.',
    pitanja: [
      izbor('podatak', 'Zašto se kornjača zove Žuja?', ['Imala je žute mrlje na oklopu.', 'Voljela je žutu salatu.', 'Bila je cijela žuta.'], 'U tekstu piše da su joj dali ime Žuja „jer je imala žute mrlje na oklopu”.', 1),
      izbor('podatak', 'Čime su djeca hranila kornjaču Žuju?', ['salatom', 'kruhom', 'mesom'], 'Djeca su joj „davala salatu”.', 1),
      broj('podatak', 'Koliko se učenika svaki tjedan brinulo o Žuji?', 2, 'Svaki tjedan „dvoje učenika brinulo se o njoj”.', 1),
      izbor('tumacenje', 'Zašto Žuja jednog jutra nije htjela jesti?', ['Zahladilo je, a kornjače tada manje jedu.', 'Bila je ljuta na djecu.', 'Salata je bila pokvarena.'], 'Učiteljica je objasnila da kornjače kad zahladi usporavaju i manje jedu.', 2),
      izbor('zakljucak', 'Kakva je bila Žuja u proljeće?', ['gladna i živahna', 'pospana i tužna', 'bolesna i mirna'], 'U zadnjoj rečenici piše da je u proljeće bila „gladna i živahna”.', 1),
      izbor('vrednovanje', 'Što učimo iz priče o kornjači Žuji?', ['O kućnom ljubimcu treba se redovito brinuti.', 'Kornjače ne trebaju hranu.', 'Životinje ne smiju živjeti u školi.'], 'Djeca su redovito mijenjala vodu i hranila Žuju.', 3),
      tocnoNetocno('podatak', 'Jesu li djeca Žuji u proljeće napravila veći terarij?', true, 'Zadnja rečenica kaže da su joj napravili veći terarij.')
    ]
  },
  {
    id: 'r3-recept-palacinke', razred: 3, tema: 'citanje-3', ishod: 'OŠ HJ A.3.3', vrsta: 'uputa',
    naslov: 'Palačinke',
    tekst: 'Za desetak palačinki trebaju ti: 2 jaja, 3 decilitra mlijeka, 200 grama brašna i prstohvat soli. U zdjelu stavi jaja i mlijeko pa ih izmiješaj pjenjačom. Postupno dodaj brašno i sol i miješaj dok tijesto ne postane glatko. Odrasla osoba neka zagrije tavu i premaže je s malo ulja. U tavu ulij malo tijesta i rasporedi ga po dnu. Kad se rub zarumeni, palačinku okreni. Gotove palačinke namaži pekmezom ili ih pospi šećerom.',
    pitanja: [
      broj('podatak', 'Koliko jaja treba za palačinke?', 2, 'Na popisu sastojaka piše: „2 jaja”.', 1),
      izbor('podatak', 'Čime se miješaju jaja i mlijeko za palačinke?', ['pjenjačom', 'žlicom za juhu', 'nožem'], 'U uputi piše: „izmiješaj pjenjačom”.', 1),
      izbor('zakljucak', 'Zašto tavu treba zagrijati odrasla osoba?', ['Vruća tava i štednjak mogu opeći.', 'Djeca ne znaju gdje je tava.', 'Odrasli brže miješaju tijesto.'], 'Vruća tava je opasna, zato uputa traži pomoć odrasle osobe.', 2),
      izbor('podatak', 'Kada treba okrenuti palačinku?', ['kad se rub zarumeni', 'odmah kad ulijemo tijesto', 'nakon pola sata'], 'U uputi piše: „Kad se rub zarumeni, palačinku okreni.”', 2),
      redoslijed('podatak', 'Poredaj korake pripreme palačinki.', ['Izmiješaj jaja i mlijeko.', 'Dodaj brašno i sol.', 'Ulij tijesto u tavu.', 'Okreni palačinku.'], 'Koraci idu redom kojim su napisani u uputi.'),
      izbor('vrednovanje', 'Kakav je tekst o palačinkama?', ['recept, uputa za pripremu jela', 'pjesma o hrani', 'priča o kuharu'], 'Tekst redom navodi sastojke i korake pripreme, kao svaki recept.', 2),
      tocnoNetocno('podatak', 'Je li za palačinke potrebno 200 grama brašna?', true, 'Na popisu sastojaka piše 200 grama brašna.')
    ]
  },
  {
    id: 'r3-sova', razred: 3, tema: 'citanje-3', ishod: 'OŠ HJ A.3.3', vrsta: 'obavijesni',
    naslov: 'Sova',
    tekst: 'Sova je ptica koja je budna noću, a danju spava skrivena u krošnji ili u dupljama stabala. Ima velike oči koje dobro vide i u mraku. Glavu može okrenuti gotovo unatrag, pa ne mora okretati cijelo tijelo. Perje joj je mekano, zato leti gotovo bez zvuka. Hrani se miševima i drugim malim životinjama. Zbog toga je seljacima korisna: čuva im žito od miševa. U Hrvatskoj žive različite vrste sova, a sve su zaštićene.',
    pitanja: [
      izbor('podatak', 'Kada je sova budna?', ['noću', 'samo ujutro', 'cijeli dan'], 'Prva rečenica: sova je ptica „koja je budna noću”.', 1),
      izbor('podatak', 'Zašto sova leti gotovo bez zvuka?', ['Perje joj je mekano.', 'Ima vrlo malena krila.', 'Leti samo po danu.'], 'U tekstu piše: „Perje joj je mekano, zato leti gotovo bez zvuka.”', 2),
      izbor('podatak', 'Čime se hrani sova?', ['miševima i drugim malim životinjama', 'travom i lišćem', 'samo sjemenkama'], 'Sova se „hrani miševima i drugim malim životinjama”.', 1),
      izbor('zakljucak', 'Zašto je sova korisna seljacima?', ['Lovi miševe koji jedu žito.', 'Budi ih ujutro pjevanjem.', 'Čuva im kokoši od lisica.'], 'Tekst kaže da sova „čuva im žito od miševa”.', 2),
      tocnoNetocno('podatak', 'Smije li se sova u Hrvatskoj loviti?', false, 'U tekstu piše da su sve sove zaštićene.'),
      izbor('tumacenje', 'Zašto sova ne mora okretati cijelo tijelo da pogleda iza sebe?', ['Glavu može okrenuti gotovo unatrag.', 'Ima oči sa strane glave.', 'Uvijek leti unatrag.'], 'Sova „glavu može okrenuti gotovo unatrag”.', 2),
      izbor('vrednovanje', 'Koja je svrha teksta o sovi?', ['donijeti podatke o sovi', 'nasmijati čitatelja', 'nagovoriti na kupnju sove'], 'Tekst nabraja činjenice o sovi, zato je obavijesni tekst.', 2)
    ]
  },
  {
    id: 'r3-izgubljeni-kljuc', razred: 3, tema: 'citanje-3', ishod: 'OŠ HJ A.3.3', vrsta: 'pripovjedni',
    naslov: 'Izgubljeni ključ',
    tekst: 'Petar se vratio iz škole i stao pred vrata. Ključa nije bilo u džepu. Prekopao je ruksak, ali ključ nije našao. Sjetio se da je za vrijeme sata tjelesnog skidao jaknu. Nije paničario. Pozvonio je susjedi Marti, koja je imala rezervni ključ, i nazvao mamu s njezina telefona. Sutradan je ključ pronašao u svlačionici, ispod klupe. Od tada ga nosi na vrpci oko vrata.',
    pitanja: [
      izbor('podatak', 'Gdje je Petar najprije tražio ključ?', ['u džepu', 'u svlačionici', 'kod susjede'], 'Kad je stao pred vrata, ključa „nije bilo u džepu”.', 1),
      izbor('podatak', 'Kome je Petar pozvonio kad nije našao ključ?', ['susjedi Marti', 'učiteljici', 'baki'], 'Pozvonio je „susjedi Marti, koja je imala rezervni ključ”.', 1),
      izbor('tumacenje', 'Kako se Petar ponio kad je izgubio ključ?', ['smireno i snalažljivo', 'plakao je pred vratima', 'ljutio se na mamu'], 'U tekstu piše: „Nije paničario.” Potražio je pomoć susjede i nazvao mamu.', 2),
      izbor('podatak', 'Gdje je Petar pronašao izgubljeni ključ?', ['u svlačionici, ispod klupe', 'u ruksaku', 'na igralištu'], 'Sutradan ga je pronašao „u svlačionici, ispod klupe”.', 1),
      izbor('zakljucak', 'Zašto Petar sada nosi ključ na vrpci oko vrata?', ['Da ga više ne izgubi.', 'Jer mu se sviđa boja vrpce.', 'Jer mu je to rekla susjeda.'], 'Nakon gubitka ključa Petar želi biti siguran da ga neće ponovno izgubiti.', 2),
      redoslijed('podatak', 'Poredaj događaje iz priče o izgubljenom ključu.', ['Petar nije našao ključ u džepu.', 'Pozvonio je susjedi Marti.', 'Pronašao je ključ u svlačionici.', 'Počeo je nositi ključ na vrpci.'], 'Događaji idu redom kojim su ispričani u priči.'),
      tocnoNetocno('zakljucak', 'Je li Petar izgubio ključ na satu tjelesnog?', true, 'Sjetio se da je na satu tjelesnog skidao jaknu, a ključ je pronašao u svlačionici.')
    ]
  },
  {
    id: 'r3-raspored', razred: 3, tema: 'citanje-3', ishod: 'OŠ HJ C.3.1', vrsta: 'tablica',
    naslov: 'Raspored izvannastavnih aktivnosti',
    tekst: 'Ponedjeljak — nogomet — 14:00 — sportska dvorana\nUtorak — zbor — 13:30 — glazbena učionica\nSrijeda — likovna radionica — 14:00 — učionica 5\nČetvrtak — šah — 13:30 — knjižnica\nPetak — nogomet — 14:00 — sportska dvorana\nNapomena: Za likovnu radionicu ponesite stare novine i kist.',
    pitanja: [
      izbor('podatak', 'Kojim se danom u rasporedu održava šah?', ['u četvrtak', 'u utorak', 'u petak'], 'U retku za četvrtak piše „šah”.', 1),
      izbor('podatak', 'Gdje se održava zbor?', ['u glazbenoj učionici', 'u sportskoj dvorani', 'u knjižnici'], 'U retku za utorak piše „zbor — glazbena učionica”.', 1),
      broj('zakljucak', 'Koliko se puta tjedno održava nogomet?', 2, 'Nogomet je u ponedjeljak i u petak, dakle dvaput.', 2),
      izbor('podatak', 'Što treba ponijeti na likovnu radionicu?', ['stare novine i kist', 'loptu i tenisice', 'šahovsku ploču'], 'U napomeni piše: „ponesite stare novine i kist”.', 1),
      izbor('zakljucak', 'Ivan voli pjevati i igrati šah. Kojim danima ima aktivnosti?', ['u utorak i četvrtak', 'u ponedjeljak i petak', 'samo u srijedu'], 'Zbor je u utorak, a šah u četvrtak.', 3),
      izbor('vrednovanje', 'Zašto je raspored aktivnosti napisan u recima?', ['Tako se brzo vidi dan, aktivnost, sat i mjesto.', 'Da bude sličan pjesmi.', 'Da ga je teže čitati.'], 'Svaki redak sadrži sve podatke za jedan dan.', 2),
      tocnoNetocno('podatak', 'Počinje li likovna radionica u 14:00?', true, 'U retku za srijedu piše 14:00.')
    ]
  },
  {
    id: 'r3-maslina', razred: 3, tema: 'citanje-3', ishod: 'OŠ HJ A.3.3', vrsta: 'obavijesni',
    naslov: 'Maslina',
    tekst: 'Maslina je drvo koje raste u toplim krajevima uz more. Može živjeti stotinama godina, a neke masline u Hrvatskoj starije su od tisuću godina. Listovi su joj uski, odozgo tamnozeleni, a odozdo srebrnkasti. Plodovi masline beru se u jesen. Od njih se tiješti maslinovo ulje. Masline ne vole hladnoću, pa ih nema u gorskim krajevima. U Dalmaciji i Istri gotovo svaka obitelj ima barem nekoliko stabala.',
    pitanja: [
      izbor('podatak', 'U kojim krajevima raste maslina?', ['u toplim krajevima uz more', 'u hladnim gorskim krajevima', 'samo u gradovima'], 'Prva rečenica: maslina raste „u toplim krajevima uz more”.', 1),
      izbor('podatak', 'Kada se beru plodovi masline?', ['u jesen', 'u proljeće', 'ljeti'], 'U tekstu piše: „Plodovi masline beru se u jesen.”', 1),
      izbor('podatak', 'Što se dobiva od plodova masline?', ['maslinovo ulje', 'brašno', 'šećer'], 'Od plodova se „tiješti maslinovo ulje”.', 1),
      izbor('zakljucak', 'Zašto u gorskim krajevima nema maslina?', ['Masline ne podnose hladnoću.', 'U gorama nema vode.', 'Ljudi ih ne žele saditi.'], 'Tekst kaže da masline ne vole hladnoću, a u gorama je hladno.', 2),
      izbor('podatak', 'Kakvi su listovi masline s donje strane?', ['srebrnkasti', 'crveni', 'žuti'], 'Listovi su „odozdo srebrnkasti”.', 2),
      tocnoNetocno('podatak', 'Postoje li u Hrvatskoj masline starije od tisuću godina?', true, 'U tekstu piše da su neke masline u Hrvatskoj starije od tisuću godina.'),
      izbor('tumacenje', 'Što znači riječ „tiješti” u tekstu o maslini?', ['istiskivati sok ili ulje pritiskom', 'brati plodove sa stabla', 'saditi novo drvo'], 'Ulje se dobiva tako da se plodovi pritisnu i istisnu.', 3)
    ]
  },
  {
    id: 'r3-pismo-baki', razred: 3, tema: 'citanje-3', ishod: 'OŠ HJ A.3.3', vrsta: 'pismo',
    naslov: 'Pismo baki',
    tekst: 'Split, 3. listopada\nDraga bako,\nkako si? Ja sam dobro. U školi smo učili o biljkama pa sam na prozoru posadila grah. Već je izrastao deset centimetara! Tata me uči voziti bicikl bez pomoćnih kotača. Pala sam samo dvaput. Jedva čekam praznike i dolazak k tebi u Gorski kotar. Ponijet ću ti svoj grah da vidiš kako je narastao.\nVoli te tvoja Nika',
    pitanja: [
      izbor('podatak', 'Tko je napisao pismo baki?', ['Nika', 'baka', 'tata'], 'Pismo je potpisala „tvoja Nika”.', 1),
      izbor('podatak', 'Iz kojega je grada Nika poslala pismo?', ['iz Splita', 'iz Gorskog kotara', 'iz Zagreba'], 'Na početku pisma piše „Split, 3. listopada”.', 1),
      broj('podatak', 'Koliko je centimetara narastao Nikin grah?', 10, 'Nika piše: „Već je izrastao deset centimetara!”', 1),
      izbor('podatak', 'Što Niku uči tata?', ['voziti bicikl bez pomoćnih kotača', 'plivati', 'kuhati'], 'U pismu piše: „Tata me uči voziti bicikl bez pomoćnih kotača.”', 1),
      izbor('zakljucak', 'Gdje živi Nikina baka?', ['u Gorskom kotaru', 'u Splitu', 'u Istri'], 'Nika jedva čeka „dolazak k tebi u Gorski kotar”.', 2),
      izbor('tumacenje', 'Kako se Nika osjeća dok piše baki?', ['veselo i s nestrpljenjem čeka susret', 'tužno i usamljeno', 'ljutito'], 'Ponosna je na grah i „jedva čeka praznike”.', 2),
      izbor('vrednovanje', 'Zašto Nika na početku pisma piše mjesto i datum?', ['Da baka zna odakle je i kada pismo napisano.', 'Jer je to naslov priče.', 'Da pismo bude dulje.'], 'U pismu na početku pišemo mjesto i datum pisanja.', 2)
    ]
  },
  {
    id: 'r3-vjeverica', razred: 3, tema: 'citanje-3', ishod: 'OŠ HJ B.3.1', vrsta: 'pripovjedni',
    naslov: 'Zaboravna vjeverica',
    tekst: 'Vjeverica Riđa cijelu je jesen skupljala lješnjake i žireve. Skrivala ih je posvuda: ispod korijenja, u rupama, pod lišćem. Kad je pao prvi snijeg, Riđa je ogladnjela, ali nije se mogla sjetiti gdje je sakrila hranu. Tražila je i tražila. Pomogao joj je djetlić, koji je sve vidio s visoke grane. Na proljeće su iz zaboravljenih žireva izrasli mali hrastići. „Možda moja zaboravnost nije tako loša”, nasmijala se Riđa.',
    pitanja: [
      izbor('podatak', 'Što je vjeverica Riđa skupljala u jesen?', ['lješnjake i žireve', 'jabuke i kruške', 'sjemenke suncokreta'], 'Prva rečenica: Riđa je skupljala „lješnjake i žireve”.', 1),
      izbor('podatak', 'Tko je pomogao Riđi pronaći hranu?', ['djetlić', 'zec', 'sova'], 'U tekstu piše: „Pomogao joj je djetlić”.', 1),
      izbor('zakljucak', 'Kako je djetlić znao gdje je hrana?', ['Sve je vidio s visoke grane.', 'Sam ju je sakrio.', 'Riđa mu je napisala popis.'], 'Djetlić je „sve vidio s visoke grane”.', 2),
      izbor('tumacenje', 'Zašto Riđa misli da njezina zaboravnost nije loša?', ['Iz zaboravljenih žireva izrasli su hrastići.', 'Mogla je dulje spavati.', 'Djetlić joj je dao svoju hranu.'], 'Na proljeće su iz zaboravljenih žireva izrasli mali hrastići.', 3),
      redoslijed('podatak', 'Poredaj događaje iz priče o vjeverici Riđi.', ['Riđa je skrivala hranu.', 'Pao je prvi snijeg.', 'Djetlić joj je pomogao.', 'Izrasli su mali hrastići.'], 'Jesen, zima, pomoć djetlića, zatim proljeće.'),
      tocnoNetocno('podatak', 'Je li Riđa odmah našla svoju hranu?', false, 'U tekstu piše da se nije mogla sjetiti gdje je hrana i da je dugo tražila.'),
      izbor('vrednovanje', 'Kakva je priča o vjeverici Riđi?', ['izmišljena priča u kojoj životinje govore', 'stručni tekst o vjevericama', 'vijest iz novina'], 'Vjeverica se smije i govori, pa je priča izmišljena.', 2)
    ]
  },
  {
    id: 'r3-akcija-ciscenja', razred: 3, tema: 'citanje-3', ishod: 'OŠ HJ C.3.3', vrsta: 'obavijest',
    naslov: 'Očistimo naš park!',
    tekst: 'Dragi učenici i roditelji, u subotu, 22. travnja, obilježavamo Dan planeta Zemlje. Pozivamo vas na čišćenje gradskog parka. Okupljamo se u 10 sati kod fontane. Rukavice i vreće za smeće dobit ćete na mjestu okupljanja. Ponesite vodu i obucite staru odjeću. Akcija traje dva sata. Nakon čišćenja svi sudionici dobit će sadnicu cvijeta. Vaše Vijeće učenika',
    pitanja: [
      izbor('podatak', 'Što se obilježava 22. travnja?', ['Dan planeta Zemlje', 'Dan škole', 'Dan grada'], 'U obavijesti piše da u subotu, 22. travnja, „obilježavamo Dan planeta Zemlje”.', 1),
      izbor('podatak', 'Gdje se okupljaju sudionici čišćenja parka?', ['kod fontane', 'ispred škole', 'na igralištu'], 'U obavijesti piše: „Okupljamo se u 10 sati kod fontane.”', 1),
      broj('zakljucak', 'U koliko sati završava čišćenje parka?', 12, 'Počinje u 10 sati i traje dva sata: 10 + 2 = 12.', 2),
      izbor('podatak', 'Što sudionici dobivaju na mjestu okupljanja?', ['rukavice i vreće za smeće', 'sadnice cvijeća', 'boce vode'], 'Rukavice i vreće dobit će se na mjestu okupljanja.', 2),
      izbor('podatak', 'Što će svaki sudionik čišćenja dobiti na kraju?', ['sadnicu cvijeta', 'medalju', 'novu majicu'], 'Nakon čišćenja svi dobivaju sadnicu cvijeta.', 1),
      izbor('vrednovanje', 'Tko je napisao obavijest o čišćenju parka?', ['Vijeće učenika', 'gradonačelnik', 'učiteljica tjelesnog'], 'Obavijest je potpisalo „Vaše Vijeće učenika”.', 1),
      izbor('zakljucak', 'Zašto je dobro obući staru odjeću za čišćenje parka?', ['Odjeća se može zaprljati.', 'Jer je hladno.', 'Da svi izgledaju isto.'], 'Pri čišćenju se lako zaprljamo, pa je bolje obući staru odjeću.', 2)
    ]
  },
  {
    id: 'r3-nogometna-utakmica', razred: 3, tema: 'citanje-3', ishod: 'OŠ HJ B.3.1', vrsta: 'pripovjedni',
    naslov: 'Vratar',
    tekst: 'Dora je oduvijek željela igrati u napadu, ali trener ju je stavio na gol. Prvih nekoliko treninga bila je nezadovoljna. Lopta joj je prolazila kroz ruke, a dečki su se smijali. Dora nije odustala. Svaki dan nakon škole s tatom je vježbala hvatanje lopte. Na završnoj utakmici obranila je jedanaesterac u posljednjoj minuti i njezina je ekipa pobijedila. Sada nitko ne bi htio drugog vratara.',
    pitanja: [
      izbor('podatak', 'Na kojem je mjestu Dora željela igrati?', ['u napadu', 'na golu', 'u obrani'], 'Prva rečenica: Dora je željela „igrati u napadu”.', 1),
      izbor('podatak', 'S kim je Dora vježbala hvatanje lopte?', ['s tatom', 's trenerom', 's bratom'], 'Dora je „s tatom vježbala hvatanje lopte”.', 1),
      izbor('tumacenje', 'Koja osobina najbolje opisuje Doru?', ['upornost', 'lijenost', 'hvalisavost'], 'Iako joj nije išlo, Dora „nije odustala” i vježbala je svaki dan.', 2),
      izbor('podatak', 'Što je Dora obranila na završnoj utakmici?', ['jedanaesterac u posljednjoj minuti', 'loptu na treningu', 'gol na prvoj utakmici'], 'Na završnoj utakmici obranila je jedanaesterac u posljednjoj minuti.', 1),
      izbor('zakljucak', 'Zašto sada nitko ne bi htio drugog vratara?', ['Dora je postala odlična vratarica.', 'Dora je najviša u ekipi.', 'Trener nema drugih igrača.'], 'Vježbom je postala dobra i spasila ekipu.', 2),
      tocnoNetocno('podatak', 'Je li Dora na prvim treninzima bila zadovoljna?', false, 'U tekstu piše da je prvih treninga bila nezadovoljna.'),
      izbor('vrednovanje', 'Koja je poruka priče o vratarici Dori?', ['Vježbom i trudom možemo uspjeti.', 'Djevojčice ne trebaju igrati nogomet.', 'Treba odustati kad nešto ne ide.'], 'Dora je uporno vježbala i uspjela.', 3)
    ]
  },
  {
    id: 'r3-zagonetna-biljka', razred: 3, tema: 'citanje-3', ishod: 'OŠ HJ A.3.3', vrsta: 'obavijesni',
    naslov: 'Suncokret',
    tekst: 'Suncokret je visoka biljka s velikim žutim cvjetom. Može narasti viši od odrasla čovjeka. Mladi suncokreti tijekom dana okreću cvjetove prema suncu, zato je biljka dobila takvo ime. U sredini cvijeta nalazi se mnoštvo sjemenki. Od sjemenki se dobiva ulje, a pržene sjemenke rado grickamo. Pčele vole suncokretov cvijet jer u njemu nalaze mnogo nektara. U Slavoniji ljeti možete vidjeti cijela žuta polja suncokreta.',
    pitanja: [
      izbor('podatak', 'Koje je boje suncokretov cvijet?', ['žute', 'plave', 'crvene'], 'U prvoj rečenici piše da suncokret ima „velik žuti cvijet”.', 1),
      izbor('tumacenje', 'Zašto se suncokret tako zove?', ['Mladi suncokreti okreću cvjetove prema suncu.', 'Raste samo na suncu u pustinji.', 'Cvijet mu je okrugao kao kotač.'], 'Tekst objašnjava: okreću se prema suncu, „zato je biljka dobila takvo ime”.', 2),
      izbor('podatak', 'Što se dobiva od suncokretovih sjemenki?', ['ulje', 'brašno', 'med'], 'U tekstu piše: „Od sjemenki se dobiva ulje”.', 1),
      izbor('zakljucak', 'Zašto pčele dolaze na suncokret?', ['Nalaze u njemu mnogo nektara.', 'Grade u njemu košnice.', 'Skrivaju se od kiše.'], 'Pčele vole suncokret „jer u njemu nalaze mnogo nektara”.', 1),
      izbor('podatak', 'U kojem se kraju Hrvatske ljeti vide polja suncokreta?', ['u Slavoniji', 'u Gorskom kotaru', 'na otocima'], 'Zadnja rečenica spominje Slavoniju.', 1),
      tocnoNetocno('podatak', 'Može li suncokret narasti viši od odrasla čovjeka?', true, 'U tekstu piše da može narasti viši od odrasla čovjeka.'),
      izbor('vrednovanje', 'Gdje bi najvjerojatnije pronašao tekst o suncokretu?', ['u dječjoj enciklopediji o biljkama', 'u zbirci bajki', 'na kutiji igračke'], 'Tekst donosi činjenice o biljci, kao enciklopedija.', 2)
    ]
  },
  {
    id: 'r3-novi-ucenik', razred: 3, tema: 'citanje-3', ishod: 'OŠ HJ B.3.1', vrsta: 'pripovjedni',
    naslov: 'Novi učenik',
    tekst: 'U razred je došao novi učenik, Amir. Doselio se iz drugoga grada i nikoga nije poznavao. Na odmoru je sjedio sam na klupi. Lucija je to primijetila. Prišla mu je i pozvala ga da igraju graničara. Amir se najprije sramio, a zatim je pristao. Pokazalo se da odlično hvata loptu. Do kraja tjedna znao je imena svih učenika, a Lucija je dobila novog prijatelja.',
    pitanja: [
      izbor('podatak', 'Kako se zove novi učenik?', ['Amir', 'Lucija', 'Luka'], 'U prvoj rečenici piše: „novi učenik, Amir”.', 1),
      izbor('zakljucak', 'Zašto je Amir na odmoru sjedio sam?', ['Nikoga nije poznavao.', 'Bio je kažnjen.', 'Nije volio igre.'], 'Amir se doselio i „nikoga nije poznavao”.', 2),
      izbor('podatak', 'Koju je igru Lucija predložila Amiru?', ['graničara', 'skrivača', 'šah'], 'Lucija ga je pozvala „da igraju graničara”.', 1),
      izbor('tumacenje', 'Kakva je Lucija?', ['pažljiva i prijateljska', 'sramežljiva i šutljiva', 'hvalisava'], 'Primijetila je da je Amir sam i pozvala ga u igru.', 2),
      tocnoNetocno('podatak', 'Je li Amir odmah bez srama pristao igrati?', false, 'U tekstu piše da se „najprije sramio, a zatim je pristao”.'),
      izbor('vrednovanje', 'Koja je poruka priče o novom učeniku Amiru?', ['Prihvatimo nove učenike i uključimo ih u igru.', 'S novima se ne treba družiti.', 'Na odmoru treba sjediti sam.'], 'Lucijin poziv pomogao je Amiru da se uklopi.', 3)
    ]
  },
  {
    id: 'r3-vrijeme', razred: 3, tema: 'citanje-3', ishod: 'OŠ HJ C.3.1', vrsta: 'prognoza',
    naslov: 'Vremenska prognoza za vikend',
    tekst: 'U subotu ujutro bit će sunčano, a temperatura zraka oko 18 °C. Poslijepodne se očekuje naoblačenje i kiša, osobito u gorskim krajevima. Puhat će umjeren sjeverni vjetar. U nedjelju će ponovno biti sunčano i toplije, do 24 °C. Na moru more mirno, a temperatura mora oko 20 °C. Ako idete na izlet u subotu, ponesite kišobran.',
    pitanja: [
      izbor('podatak', 'Kakvo će vrijeme biti u subotu ujutro?', ['sunčano', 'kišovito', 'snježno'], 'Prva rečenica kaže da će u subotu ujutro biti sunčano.', 1),
      broj('podatak', 'Kolika će biti najviša temperatura zraka u nedjelju?', 24, 'U nedjelju će biti „do 24 °C”.', 1),
      izbor('zakljucak', 'Koji je dan vikenda bolji za cjelodnevni izlet?', ['nedjelja', 'subota', 'oba su jednako loša'], 'U subotu poslijepodne pada kiša, a nedjelja je sunčana i toplija.', 2),
      izbor('podatak', 'Gdje će poslijepodnevna kiša biti najjača?', ['u gorskim krajevima', 'na moru', 'u svim gradovima jednako'], 'Kiša se očekuje „osobito u gorskim krajevima”.', 2),
      broj('zakljucak', 'Za koliko će stupnjeva u nedjelju biti toplije nego u subotu ujutro?', 6, '24 − 18 = 6.', 3),
      izbor('vrednovanje', 'Čemu služi vremenska prognoza?', ['da se možemo pripremiti za vrijeme koje dolazi', 'da nas zabavi pričom', 'da nas nagovori na kupnju kišobrana'], 'Prognoza najavljuje vrijeme kako bismo planirali i pripremili se.', 2)
    ]
  },

  {
    id: 'r3-zubar', razred: 3, tema: 'citanje-3', ishod: 'OŠ HJ A.3.3', vrsta: 'pripovjedni',
    naslov: 'Posjet stomatologinji',
    tekst: 'Ena se bojala odlaska stomatologinji. Cijelo jutro nije htjela doručkovati. U čekaonici je vidjela dječaka koji je izašao nasmiješen i s naljepnicom na majici. Stomatologinja Iva pokazala joj je sve instrumente i objasnila čemu služe. Pregledala joj je zube i rekla da ima samo jedan mali karijes. Popravak je trajao deset minuta i nije boljelo. Na izlasku je i Ena dobila naljepnicu. Kod kuće je odmah oprala zube, iako je bilo tek podne.',
    pitanja: [
      izbor('podatak', 'Čega se Ena bojala?', ['odlaska stomatologinji', 'pasa', 'mraka'], 'Prva rečenica: „Ena se bojala odlaska stomatologinji.”', 1),
      izbor('zakljucak', 'Zašto Ena ujutro nije htjela doručkovati?', ['Bila je uplašena zbog posjeta stomatologinji.', 'Nije voljela kruh.', 'Već je jela u školi.'], 'Strah od posjeta oduzeo joj je volju za jelom.', 2),
      izbor('podatak', 'Kako je stomatologinja Iva umirila Enu?', ['pokazala joj je instrumente i objasnila čemu služe', 'dala joj je bombon', 'pustila joj je crtić'], 'U tekstu piše da joj je pokazala sve instrumente i objasnila čemu služe.', 2),
      broj('podatak', 'Koliko je minuta trajao popravak Enina zuba?', 10, 'Popravak je „trajao deset minuta”.', 1),
      tocnoNetocno('podatak', 'Je li Eni popravak zuba bio bolan?', false, 'U tekstu piše da nije boljelo.'),
      izbor('tumacenje', 'Što pokazuje Enino pranje zuba u podne?', ['Odlučila je bolje brinuti o zubima.', 'Zaboravila je da je podne.', 'Htjela je naljutiti mamu.'], 'Nakon posjeta Ena želi čuvati zube, pa ih pere i u podne.', 3),
      izbor('vrednovanje', 'Koja je poruka priče o Eni?', ['Strah je često veći kad ne znamo što nas čeka.', 'Zube ne treba prati.', 'Stomatologa se treba bojati.'], 'Kad je Ena saznala što je čeka, strah je nestao.', 3)
    ]
  },
  {
    id: 'r3-obavijest-sajam', razred: 3, tema: 'citanje-3', ishod: 'OŠ HJ C.3.3', vrsta: 'obavijest',
    naslov: 'Školski sajam',
    tekst: 'U četvrtak, 7. prosinca, od 16 do 18 sati u školskoj dvorani održava se božićni sajam. Učenici će prodavati ukrase, čestitke i kolače koje su sami izradili. Cijene su od 1 do 5 eura. Sav prikupljeni novac bit će doniran skloništu za napuštene životinje. Roditelji i bake i djedovi su dobrodošli. Ako želite donijeti kolače, javite se razrednici do utorka.',
    pitanja: [
      izbor('podatak', 'Gdje se održava božićni sajam?', ['u školskoj dvorani', 'na gradskom trgu', 'u knjižnici'], 'U obavijesti piše: „u školskoj dvorani”.', 1),
      broj('zakljucak', 'Koliko sati traje božićni sajam?', 2, 'Od 16 do 18 sati prođu 2 sata.', 2),
      izbor('podatak', 'Što će učenici prodavati na sajmu?', ['ukrase, čestitke i kolače', 'igračke i knjige', 'voće i povrće'], 'Učenici će prodavati ukrase, čestitke i kolače.', 1),
      izbor('podatak', 'Kome će biti doniran novac sa sajma?', ['skloništu za napuštene životinje', 'školskoj knjižnici', 'gradskom kazalištu'], 'Novac će biti doniran skloništu za napuštene životinje.', 1),
      broj('podatak', 'Koliko eura stoji najskuplja stvar na sajmu?', 5, 'Cijene su „od 1 do 5 eura”.', 2),
      izbor('podatak', 'Do kada se treba javiti razrednici za donošenje kolača?', ['do utorka', 'do petka', 'do nedjelje'], 'U obavijesti piše: „javite se razrednici do utorka”.', 1),
      izbor('vrednovanje', 'Zašto je sajam dobra ideja?', ['Učenici pomažu životinjama svojim radom.', 'Učenici ne moraju ići u školu.', 'Ukrasi su besplatni.'], 'Zarađeni novac ide skloništu za životinje.', 2)
    ]
  },

  // ── 4. razred ────────────────────────────────────────────────────
  {
    id: 'r4-nikola-tesla', razred: 4, tema: 'citanje-4', ishod: 'OŠ HJ A.4.3', vrsta: 'biografija',
    naslov: 'Nikola Tesla',
    tekst: 'Nikola Tesla rođen je 1856. godine u Smiljanu, malom selu u Lici. Kao dječak volio je čitati i promatrati prirodu. Studirao je tehniku u Grazu, a kasnije je otišao u Ameriku. Ondje je radio na izumima povezanima s elektricitetom. Njegov izmjenični sustav prijenosa struje i danas omogućuje da električna energija stigne do naših domova. Zbog brojnih izuma nazivaju ga „čovjekom koji je izumio dvadeseto stoljeće”. Umro je 1943. godine u New Yorku. U Smiljanu danas postoji Memorijalni centar posvećen njemu.',
    pitanja: [
      izbor('podatak', 'U kojem je selu rođen Nikola Tesla?', ['u Smiljanu', 'u Grazu', 'u New Yorku'], 'Prva rečenica: rođen je „u Smiljanu, malom selu u Lici”.', 1),
      broj('podatak', 'Koje je godine rođen Nikola Tesla?', 1856, 'U tekstu piše: „rođen je 1856. godine”.', 1),
      broj('zakljucak', 'Koliko je godina Nikola Tesla živio?', 87, 'Rođen je 1856., a umro 1943.: 1943 − 1856 = 87.', 3),
      izbor('podatak', 'S čime su bili povezani Teslini izumi?', ['s elektricitetom', 's medicinom', 's poljoprivredom'], 'U Americi je radio „na izumima povezanima s elektricitetom”.', 1),
      izbor('tumacenje', 'Zašto Teslu nazivaju „čovjekom koji je izumio dvadeseto stoljeće”?', ['Njegovi su izumi promijenili način na koji ljudi žive.', 'Rođen je točno početkom dvadesetog stoljeća.', 'Napisao je knjigu o stoljećima.'], 'Tekst navodi da ga tako nazivaju zbog brojnih izuma koji se i danas koriste.', 3),
      redoslijed('podatak', 'Poredaj događaje iz Teslina života.', ['rođen je u Smiljanu', 'studirao je u Grazu', 'radio je na izumima u Americi', 'umro je u New Yorku'], 'Događaji idu redom kojim ih tekst navodi.'),
      izbor('vrednovanje', 'Kakav je tekst o Nikoli Tesli?', ['životopis stvarne osobe', 'bajka', 'reklama'], 'Tekst redom opisuje život stvarnog izumitelja.', 2)
    ]
  },
  {
    id: 'r4-dupini', razred: 4, tema: 'citanje-4', ishod: 'OŠ HJ A.4.3', vrsta: 'obavijesni',
    naslov: 'Dobri dupin',
    tekst: 'U Jadranskom moru živi dobri dupin. Iako živi u moru, dupin nije riba nego sisavac: diše plućima, a mladunce hrani mlijekom. Zato mora izranjati na površinu da bi udahnuo zrak. Dupini žive u skupinama i sporazumijevaju se zviždanjem i kliktanjem. Zvukove koriste i da bi u mutnoj vodi pronašli hranu. Najveća opasnost za njih su ribarske mreže i onečišćenje mora. Dobri dupin u Hrvatskoj je strogo zaštićen.',
    pitanja: [
      izbor('podatak', 'Zašto dupin nije riba?', ['Diše plućima i mladunce hrani mlijekom.', 'Živi samo u rijekama.', 'Nema peraje.'], 'Tekst kaže da je dupin sisavac jer „diše plućima, a mladunce hrani mlijekom”.', 2),
      izbor('zakljucak', 'Zašto dupin mora izranjati na površinu?', ['da udahne zrak', 'da se zagrije na suncu', 'da lovi ptice'], 'Dupin diše plućima, pa mora izroniti da udahne zrak.', 2),
      izbor('podatak', 'Kako se dupini međusobno sporazumijevaju?', ['zviždanjem i kliktanjem', 'mahanjem perajama', 'promjenom boje kože'], 'U tekstu piše: „sporazumijevaju se zviždanjem i kliktanjem”.', 1),
      izbor('podatak', 'Što je najveća opasnost za dupine?', ['ribarske mreže i onečišćenje mora', 'morski psi', 'hladna voda'], 'Tekst navodi ribarske mreže i onečišćenje mora.', 1),
      izbor('tumacenje', 'Čemu dupinima služe zvukovi osim sporazumijevanja?', ['pronalaženju hrane u mutnoj vodi', 'zagrijavanju tijela', 'tjeranju turista'], 'Zvukove koriste „da bi u mutnoj vodi pronašli hranu”.', 2),
      tocnoNetocno('podatak', 'Je li dobri dupin u Hrvatskoj zaštićen?', true, 'Zadnja rečenica kaže da je strogo zaštićen.'),
      izbor('vrednovanje', 'Što bi čitatelj trebao zapamtiti iz teksta o dupinu?', ['Dupin je zaštićeni sisavac kojega treba čuvati.', 'Dupini su opasni za ljude.', 'Dupine treba hraniti s broda.'], 'Tekst naglašava da je dupin sisavac i da je ugrožen i zaštićen.', 3)
    ]
  },
  {
    id: 'r4-izlet-brijuni', razred: 4, tema: 'citanje-4', ishod: 'OŠ HJ A.4.3', vrsta: 'dnevnik',
    naslov: 'Iz Marinina dnevnika',
    tekst: 'Utorak, 16. svibnja. Danas smo s razredom bili na Brijunima! Iz Fažane smo brodom plovili petnaestak minuta. Na otoku smo se vozili turističkim vlakićem i vidjeli zebre, lame i slonicu Lanku. Vodič nam je pokazao otiske dinosaurskih stopala u stijeni. Nisam mogla vjerovati da su ondje prije mnogo milijuna godina hodali dinosauri! Na povratku je puhao vjetar pa je brod jako ljuljao. Leo je pozelenio, ali je izdržao. Bio je to najbolji izlet ove godine.',
    pitanja: [
      izbor('podatak', 'Gdje je razred bio na izletu?', ['na Brijunima', 'na Plitvicama', 'u Zagrebu'], 'Marina piše: „Danas smo s razredom bili na Brijunima!”', 1),
      izbor('podatak', 'Odakle je brod za Brijune isplovio?', ['iz Fažane', 'iz Pule', 'iz Rijeke'], 'U dnevniku piše: „Iz Fažane smo brodom plovili petnaestak minuta.”', 1),
      izbor('podatak', 'Što je vodič pokazao učenicima na Brijunima?', ['otiske dinosaurskih stopala', 'staru kulu', 'ribarsku mrežu'], 'Vodič je pokazao „otiske dinosaurskih stopala u stijeni”.', 1),
      izbor('tumacenje', 'Što znači da je Leo „pozelenio”?', ['Bilo mu je mučno od ljuljanja broda.', 'Obukao je zelenu jaknu.', 'Bio je ljubomoran.'], 'Brod je jako ljuljao; „pozelenjeti” znači osjećati mučninu.', 3),
      izbor('zakljucak', 'Kako se Marina osjećala nakon izleta?', ['oduševljeno', 'dosadno', 'razočarano'], 'Napisala je da je to bio najbolji izlet ove godine.', 2),
      izbor('vrednovanje', 'Po čemu se vidi da je tekst o Brijunima dnevnički zapis?', ['Počinje datumom, a autorica piše o svojem danu i osjećajima.', 'Ima naslov i rimu.', 'Napisan je kao recept.'], 'Dnevnik ima datum i osobne doživljaje pisca.', 3),
      tocnoNetocno('podatak', 'Jesu li se učenici po otoku vozili turističkim vlakićem?', true, 'U dnevniku piše da su se vozili turističkim vlakićem.')
    ]
  },
  {
    id: 'r4-voda-pitka', razred: 4, tema: 'citanje-4', ishod: 'OŠ HJ A.4.3', vrsta: 'obavijesni',
    naslov: 'Čuvajmo pitku vodu',
    tekst: 'Na Zemlji ima mnogo vode, ali većina je slana morska voda. Pitke vode ima vrlo malo. Hrvatska je bogata pitkom vodom i jedna je od zemalja Europe s najviše izvora po stanovniku. Ipak, vodu treba čuvati. Kad pereš zube, zatvori slavinu. Tuširanje troši manje vode od kupanja u kadi. Pokvarena slavina iz koje kaplje može u jednom danu potrošiti cijelu kantu vode. Ulje i lijekove nikad ne bacaj u sudoper ni u zahod jer onečišćuju vodu.',
    pitanja: [
      izbor('podatak', 'Kakva je većina vode na Zemlji?', ['slana morska voda', 'pitka voda iz izvora', 'led u hladnjaku'], 'Prva rečenica kaže da je većina vode slana morska voda.', 1),
      izbor('podatak', 'Što treba učiniti dok pereš zube?', ['zatvoriti slavinu', 'otvoriti dvije slavine', 'puniti kadu'], 'U tekstu piše: „Kad pereš zube, zatvori slavinu.”', 1),
      izbor('zakljucak', 'Zašto je važno popraviti slavinu iz koje kaplje?', ['Inače se uzalud troši mnogo vode.', 'Da slavina bude ljepša.', 'Da voda bude toplija.'], 'Pokvarena slavina u danu potroši cijelu kantu vode.', 2),
      izbor('podatak', 'Što troši manje vode: tuširanje ili kupanje u kadi?', ['tuširanje', 'kupanje u kadi', 'jednako troše'], 'U tekstu piše: „Tuširanje troši manje vode od kupanja u kadi.”', 1),
      izbor('podatak', 'Što se nikad ne smije baciti u sudoper ili zahod?', ['ulje i lijekove', 'vodu od pranja povrća', 'pjenu od sapuna'], 'Ulje i lijekove ne bacamo u sudoper jer onečišćuju vodu.', 2),
      tocnoNetocno('podatak', 'Je li Hrvatska siromašna pitkom vodom?', false, 'Tekst kaže da je Hrvatska bogata pitkom vodom.'),
      izbor('vrednovanje', 'Koja je glavna svrha teksta o pitkoj vodi?', ['potaknuti nas da štedimo i čuvamo vodu', 'opisati morske životinje', 'ispričati priču o slavini'], 'Tekst daje savjete kako čuvati vodu.', 2)
    ]
  },
  {
    id: 'r4-zagonetka-u-knjiznici', razred: 4, tema: 'citanje-4', ishod: 'OŠ HJ B.4.1', vrsta: 'pripovjedni',
    naslov: 'Tajna stare knjige',
    tekst: 'Lovro je u školskoj knjižnici posudio staru knjigu o gusarima. Između stranica pronašao je presavijen papir s crtežom otoka i velikim slovom X. Cijeli tjedan s prijateljicom Sarom pokušavao je odgonetnuti gdje je taj otok. Usporedili su crtež sa zemljovidom Jadrana i zaključili da nalikuje Visu. Knjižničarka im je, smiješeći se, otkrila da je crtež napravio bivši učenik, danas njihov učitelj zemljopisa. Učitelj je pristao održati sat o otoku Visu, a Lovro i Sara pripremili su plakat.',
    pitanja: [
      izbor('podatak', 'Što je Lovro pronašao u staroj knjizi o gusarima?', ['papir s crtežom otoka i slovom X', 'staru kovanicu', 'pismo knjižničarke'], 'Između stranica pronašao je presavijen papir s crtežom otoka i slovom X.', 1),
      izbor('podatak', 'S kim je Lovro pokušavao odgonetnuti tajnu crteža?', ['sa Sarom', 's knjižničarkom', 's mamom'], 'Tajnu je odgonetavao „s prijateljicom Sarom”.', 1),
      izbor('zakljucak', 'Kako su Lovro i Sara otkrili koji je otok na crtežu?', ['Usporedili su crtež sa zemljovidom Jadrana.', 'Pitali su gusare.', 'Otišli su brodom na Vis.'], 'Usporedili su crtež sa zemljovidom i zaključili da nalikuje Visu.', 2),
      izbor('podatak', 'Tko je napravio crtež otoka?', ['bivši učenik, sada njihov učitelj zemljopisa', 'pravi gusar', 'Lovrov djed'], 'Knjižničarka je otkrila da je crtež napravio bivši učenik, danas njihov učitelj zemljopisa.', 2),
      izbor('tumacenje', 'Zašto se knjižničarka smiješila?', ['Znala je tajnu crteža i zabavila ju je njihova potraga.', 'Bila je ljuta na Lovru.', 'Knjiga je bila oštećena.'], 'Ona je znala tko je napravio crtež, pa joj je potraga bila simpatična.', 3),
      redoslijed('podatak', 'Poredaj događaje iz priče o staroj knjizi.', ['Lovro je posudio knjigu.', 'Pronašao je crtež otoka.', 'Usporedili su crtež sa zemljovidom.', 'Pripremili su plakat o Visu.'], 'Događaji idu redom kojim su ispričani.'),
      izbor('vrednovanje', 'Što priča o staroj knjizi pokazuje o čitanju?', ['Knjige mogu potaknuti znatiželju i istraživanje.', 'Stare knjige ne treba posuđivati.', 'U knjižnici se ništa ne može naučiti.'], 'Knjiga je potaknula Lovru i Saru na istraživanje.', 3)
    ]
  },
  {
    id: 'r4-pravila-bazena', razred: 4, tema: 'citanje-4', ishod: 'OŠ HJ C.4.1', vrsta: 'pravila',
    naslov: 'Kućni red gradskog bazena',
    tekst: 'Bazen je otvoren svaki dan od 7 do 21 sat. Prije ulaska u bazen obavezno se istuširaj. Djeca mlađa od 10 godina smiju u bazen samo u pratnji odrasle osobe. Skakanje s ruba dopušteno je samo u dubokom dijelu bazena. Trčanje oko bazena zabranjeno je jer je pod sklizak. Hranu i piće ne unosi u prostor bazena. Ako primijetiš da netko treba pomoć, odmah pozovi spasioca.',
    pitanja: [
      broj('podatak', 'Do koliko je sati otvoren gradski bazen?', 21, 'U kućnom redu piše: „od 7 do 21 sat”.', 1),
      izbor('podatak', 'Što treba učiniti prije ulaska u bazen?', ['istuširati se', 'pojesti užinu', 'skočiti s ruba'], 'Kućni red kaže: „Prije ulaska u bazen obavezno se istuširaj.”', 1),
      izbor('zakljucak', 'Smije li osmogodišnji Toni sam u bazen?', ['Ne, mora biti uz njega odrasla osoba.', 'Da, smije bez ikoga.', 'Smije samo u duboki dio.'], 'Djeca mlađa od 10 godina smiju samo u pratnji odrasle osobe.', 2),
      izbor('podatak', 'Zašto je zabranjeno trčati oko bazena?', ['Pod je sklizak.', 'Trčanje je preglasno.', 'Spasilac ne voli trčanje.'], 'Trčanje je zabranjeno „jer je pod sklizak”.', 1),
      izbor('podatak', 'Gdje je dopušteno skakati s ruba bazena?', ['samo u dubokom dijelu', 'svugdje', 'samo u plitkom dijelu'], 'Skakanje je dopušteno samo u dubokom dijelu bazena.', 1),
      izbor('podatak', 'Koga treba pozvati ako netko u bazenu treba pomoć?', ['spasioca', 'blagajnicu', 'prijatelje'], 'U kućnom redu piše: „odmah pozovi spasioca”.', 1),
      izbor('vrednovanje', 'Zašto bazen ima kućni red?', ['da bi svi bili sigurni i bazen ostao čist', 'da bude manje posjetitelja', 'da se djeca ne zabavljaju'], 'Pravila štite sigurnost i čistoću.', 2)
    ]
  },
  {
    id: 'r4-zadnji-list', razred: 4, tema: 'citanje-4', ishod: 'OŠ HJ B.4.1', vrsta: 'pripovjedni',
    naslov: 'Djed i sat',
    tekst: 'Djed Stjepan imao je stari zidni sat koji je otkucavao svaki sat. Unuk Fran smatrao je da je sat dosadan i preglasan. Jednoga dana sat je stao. U kući je odjednom postalo neobično tiho. Djed je bio tužan jer mu je taj sat ostavio njegov otac. Fran je potajno odnio sat urari u susjednu ulicu i sav svoj džeparac dao za popravak. Kad je sat ponovno otkucao podne, djed je zaplakao od sreće, a Fran je shvatio da mu je nedostajao taj zvuk.',
    pitanja: [
      izbor('podatak', 'Što je Fran u početku mislio o djedovu satu?', ['da je dosadan i preglasan', 'da je najljepši u gradu', 'da je nov i moderan'], 'Fran je smatrao „da je sat dosadan i preglasan”.', 1),
      izbor('podatak', 'Zašto je djedu sat bio važan?', ['Ostavio mu ga je njegov otac.', 'Bio je jako skup.', 'Kupio ga je na putovanju.'], 'Djed je bio tužan „jer mu je taj sat ostavio njegov otac”.', 2),
      izbor('podatak', 'Čime je Fran platio popravak sata?', ['svojim džeparcem', 'djedovim novcem', 'nije platio ništa'], 'Fran je „sav svoj džeparac dao za popravak”.', 1),
      izbor('tumacenje', 'Zašto je djed zaplakao kad je sat otkucao podne?', ['Bio je sretan što sat opet radi.', 'Sat je otkucao prekasno.', 'Uplašio se zvuka.'], 'U tekstu piše da je djed zaplakao „od sreće”.', 2),
      izbor('tumacenje', 'Kako se promijenio Fran tijekom priče?', ['Shvatio je da mu nedostaje zvuk sata koji je smatrao dosadnim.', 'Postao je urar.', 'Počeo je mrziti satove.'], 'Na kraju je „shvatio da mu je nedostajao taj zvuk”.', 3),
      izbor('zakljucak', 'Zašto je Fran sat potajno odnio na popravak?', ['Htio je iznenaditi djeda.', 'Htio je sat prodati.', 'Djed mu je to zabranio.'], 'Učinio je to tajno da bi djeda razveselio iznenađenjem.', 3),
      izbor('vrednovanje', 'Koja je poruka priče o djedovu satu?', ['Ponekad tek kad nešto izgubimo shvatimo koliko nam vrijedi.', 'Stari predmeti trebaju se baciti.', 'Satovi su preglasni.'], 'Fran je cijenio sat tek kad je utihnuo.', 3)
    ]
  },
  {
    id: 'r4-mobitel-anketa', razred: 4, tema: 'citanje-4', ishod: 'OŠ HJ C.4.1', vrsta: 'tablica',
    naslov: 'Anketa: Koliko vremena provodiš pred zaslonom?',
    tekst: 'Učenici 4. razreda ispunili su anketu. Pitanje: Koliko vremena dnevno provodiš pred zaslonom (mobitel, televizor, računalo)?\nmanje od 1 sata — 6 učenika\n1 do 2 sata — 11 učenika\n2 do 3 sata — 5 učenika\nviše od 3 sata — 2 učenika\nStručnjaci savjetuju da djeca ove dobi pred zaslonom provode najviše jedan do dva sata dnevno, a ostatak slobodnog vremena u igri, kretanju i druženju.',
    pitanja: [
      broj('zakljucak', 'Koliko je učenika ukupno ispunilo anketu o zaslonima?', 24, '6 + 11 + 5 + 2 = 24.', 2),
      izbor('podatak', 'Koji je odgovor u anketi o zaslonima najčešći?', ['1 do 2 sata', 'manje od 1 sata', 'više od 3 sata'], 'Najviše učenika, njih 11, odabralo je 1 do 2 sata.', 1),
      broj('podatak', 'Koliko učenika provodi više od 3 sata dnevno pred zaslonom?', 2, 'U tablici piše: „više od 3 sata — 2 učenika”.', 1),
      broj('zakljucak', 'Koliko učenika provodi pred zaslonom dulje od dva sata?', 7, '5 učenika (2 do 3 sata) i 2 učenika (više od 3 sata): 5 + 2 = 7.', 3),
      izbor('podatak', 'Što stručnjaci savjetuju o vremenu pred zaslonom?', ['najviše jedan do dva sata dnevno', 'najmanje pet sati dnevno', 'samo vikendom'], 'Stručnjaci savjetuju najviše jedan do dva sata dnevno.', 1),
      izbor('vrednovanje', 'Zašto je rezultat ankete napisan kao popis s brojevima?', ['Da se odgovori lako usporede.', 'Da zvuči kao pjesma.', 'Da tekst bude dulji.'], 'Brojevi uz svaki odgovor omogućuju brzu usporedbu.', 2)
    ]
  },
  {
    id: 'r4-legenda-velebit', razred: 4, tema: 'citanje-4', ishod: 'OŠ HJ B.4.1', vrsta: 'legenda',
    naslov: 'Vila Velebita',
    tekst: 'Stari ljudi pod Velebitom pričaju da na vrhovima planine živi vila. Kad pastiri zalutaju u magli, ona im zapjeva, pa oni po njezinu glasu pronađu put kući. Jednom je pohlepni lovac htio uhvatiti vilu i prodati je na sajmu. Cijelu je noć lutao planinom, ali vilu nije našao. Ujutro se našao na istom mjestu s kojega je krenuo, umoran i praznih ruku. Od tada, kažu, nitko više nije pokušao uhvatiti vilu, a pastiri i danas slušaju vjetar u stijenama kao da pjeva.',
    pitanja: [
      izbor('podatak', 'Gdje prema priči živi vila?', ['na vrhovima Velebita', 'u moru', 'u gradu'], 'Prva rečenica: „na vrhovima planine živi vila”.', 1),
      izbor('podatak', 'Kako vila pomaže pastirima koji zalutaju?', ['Zapjeva, pa po glasu nađu put.', 'Donese im hranu.', 'Pretvori se u ovcu.'], 'Vila im zapjeva, a oni po njezinu glasu pronađu put kući.', 1),
      izbor('tumacenje', 'Kakav je lovac u priči o vili Velebita?', ['pohlepan', 'velikodušan', 'plašljiv'], 'U tekstu piše „pohlepni lovac” koji je htio prodati vilu.', 2),
      izbor('zakljucak', 'Zašto lovac nije uhvatio vilu?', ['Lutao je cijelu noć i vratio se na isto mjesto.', 'Vila mu je pobjegla na brodu.', 'Zaspao je kod kuće.'], 'Lovac je lutao planinom i ujutro bio na mjestu s kojega je krenuo.', 2),
      izbor('vrednovanje', 'Kojoj vrsti pripada priča o vili Velebita?', ['legendi', 'obavijesti', 'receptu'], 'To je narodna priča vezana uz stvarno mjesto (Velebit) s čudesnim bićem.', 3),
      izbor('tumacenje', 'Kako pastiri danas tumače zvuk vjetra u stijenama Velebita?', ['kao da vila pjeva', 'kao lovčev rog', 'kao zvono crkve'], 'Pastiri slušaju vjetar „kao da pjeva”.', 2),
      tocnoNetocno('podatak', 'Je li lovac na kraju uhvatio vilu?', false, 'Lovac se vratio „umoran i praznih ruku”.')
    ]
  },
  {
    id: 'r4-solarni', razred: 4, tema: 'citanje-4', ishod: 'OŠ HJ A.4.3', vrsta: 'obavijesni',
    naslov: 'Sunčana elektrana na školi',
    tekst: 'Na krovu naše škole prošle su godine postavljeni sunčani paneli. Oni pretvaraju sunčevu svjetlost u električnu energiju. Za sunčanih dana paneli proizvedu više struje nego što škola potroši, a višak se šalje u električnu mrežu. Zimi i za oblačnih dana proizvode manje. Zahvaljujući panelima škola plaća manji račun za struju, a zrak je čišći jer se manje struje dobiva iz elektrana koje spaljuju ugljen. U predvorju škole nalazi se zaslon na kojem se vidi koliko je struje proizvedeno taj dan.',
    pitanja: [
      izbor('podatak', 'Gdje su postavljeni sunčani paneli?', ['na krovu škole', 'u školskom dvorištu', 'na igralištu'], 'Prva rečenica: „Na krovu naše škole … postavljeni sunčani paneli.”', 1),
      izbor('podatak', 'U što paneli pretvaraju sunčevu svjetlost?', ['u električnu energiju', 'u toplu vodu', 'u plin'], 'Paneli „pretvaraju sunčevu svjetlost u električnu energiju”.', 1),
      izbor('zakljucak', 'Kada paneli proizvode najviše struje?', ['za sunčanih ljetnih dana', 'noću', 'za oblačnih zimskih dana'], 'Za sunčanih dana proizvode više, a zimi i kad je oblačno manje.', 2),
      izbor('podatak', 'Što se događa s viškom struje iz školskih panela?', ['šalje se u električnu mrežu', 'baca se', 'sprema se u školsku torbu'], 'Višak „se šalje u električnu mrežu”.', 2),
      izbor('tumacenje', 'Zašto paneli pomažu da zrak bude čišći?', ['Manje se struje proizvodi spaljivanjem ugljena.', 'Paneli usisavaju prašinu.', 'Paneli hlade zrak.'], 'Tekst objašnjava da se manje struje dobiva iz elektrana koje spaljuju ugljen.', 3),
      izbor('podatak', 'Gdje se u školi vidi koliko je struje proizvedeno?', ['na zaslonu u predvorju', 'u dnevniku', 'na školskoj ploči'], 'U predvorju se nalazi zaslon s tim podatkom.', 1),
      izbor('vrednovanje', 'Koje su dvije koristi sunčanih panela navedene u tekstu?', ['manji račun za struju i čišći zrak', 'ljepši krov i manje buke', 'više svjetla u učionici i toplije klupe'], 'Tekst navodi manji račun i čišći zrak.', 3)
    ]
  },
  {
    id: 'r4-pas-vodic', razred: 4, tema: 'citanje-4', ishod: 'OŠ HJ A.4.3', vrsta: 'obavijesni',
    naslov: 'Pas vodič',
    tekst: 'Pas vodič pomaže slijepim i slabovidnim osobama da se sigurno kreću. Školovanje psa traje oko dvije godine. Pas uči zaobilaziti prepreke, zaustaviti se pred stubama i rubom pločnika te pronaći vrata ili pješački prijelaz. Dok nosi posebnu ormu, pas vodič radi. Tada ga ne smijemo maziti, zvati ni hraniti jer bi mu to odvuklo pažnju. Ako želiš pomoći slijepoj osobi, najprije je pitaj treba li joj pomoć. Psi vodiči smiju ući u trgovine, autobuse i restorane.',
    pitanja: [
      izbor('podatak', 'Kome pomaže pas vodič?', ['slijepim i slabovidnim osobama', 'lovcima', 'policiji pri potrazi'], 'Prva rečenica: pas vodič pomaže slijepim i slabovidnim osobama.', 1),
      broj('podatak', 'Koliko godina traje školovanje psa vodiča?', 2, 'U tekstu piše: „Školovanje psa traje oko dvije godine.”', 1),
      izbor('zakljucak', 'Zašto psa vodiča u ormi ne smijemo maziti?', ['Radi, a maženje bi mu odvuklo pažnju.', 'Pas bi se naljutio.', 'Orma je prljava.'], 'Dok nosi ormu, pas radi i ne smijemo ga ometati.', 2),
      izbor('podatak', 'Gdje se pas vodič zaustavlja?', ['pred stubama i rubom pločnika', 'pred svakim drvetom', 'kod svake trgovine'], 'Pas uči „zaustaviti se pred stubama i rubom pločnika”.', 2),
      izbor('podatak', 'Što treba učiniti ako želiš pomoći slijepoj osobi?', ['najprije je pitati treba li joj pomoć', 'uhvatiti je za ruku bez pitanja', 'nahraniti njezina psa'], 'Tekst savjetuje da najprije pitaš treba li joj pomoć.', 2),
      tocnoNetocno('podatak', 'Smiju li psi vodiči u autobus?', true, 'Zadnja rečenica kaže da smiju u trgovine, autobuse i restorane.'),
      izbor('vrednovanje', 'Čemu služi tekst o psu vodiču?', ['da nas pouči o psima vodičima i kako se ponašati uz njih', 'da ispriča bajku', 'da reklamira hranu za pse'], 'Tekst donosi podatke i pravila ponašanja.', 2)
    ]
  },
  {
    id: 'r4-dan-u-staroj-skoli', razred: 4, tema: 'citanje-4', ishod: 'OŠ HJ A.4.3', vrsta: 'pripovjedni',
    naslov: 'Pradjedova škola',
    tekst: 'Prabaka Ruža ispričala je Ivi kako je izgledala škola kad je ona bila djevojčica. U školu je pješačila pet kilometara, i po snijegu. Svi razredi, od prvog do četvrtog, sjedili su u istoj učionici s jednom učiteljicom. Pisali su na malim pločicama kredom, jer su bilježnice bile skupe. Zimi je svaki učenik donosio cjepanicu drva za peć. Iva je bila iznenađena. „A ja se žalim kad moram nositi tešku torbu do autobusa!” rekla je i nasmijala se.',
    pitanja: [
      broj('podatak', 'Koliko je kilometara prabaka Ruža pješačila do škole?', 5, 'Prabaka je „u školu pješačila pet kilometara”.', 1),
      izbor('podatak', 'Na čemu su pisali učenici u prabakinoj školi?', ['na malim pločicama kredom', 'u debelim bilježnicama', 'na računalu'], 'Pisali su „na malim pločicama kredom”.', 1),
      izbor('zakljucak', 'Zašto su zimi učenici donosili drva u školu?', ['Da bi se učionica grijala na peć.', 'Da naprave klupe.', 'Da ih prodaju.'], 'Svaki je učenik donosio cjepanicu „za peć”.', 2),
      izbor('podatak', 'Koji su razredi sjedili u istoj učionici u prabakinoj školi?', ['svi razredi, od prvog do četvrtog', 'samo prvi razred', 'samo treći i četvrti razred'], 'Svi razredi, od prvog do četvrtog, sjedili su u istoj učionici.', 2),
      izbor('tumacenje', 'Zašto se Iva nasmijala na kraju priče?', ['Shvatila je da su njezine teškoće male prema prabakinima.', 'Prabaka je ispričala šalu.', 'Zaboravila je torbu.'], 'Iva uspoređuje svoju tešku torbu s prabakinim pješačenjem po snijegu.', 3),
      izbor('vrednovanje', 'Što nam priča o prabakinoj školi pokazuje?', ['kako se škola promijenila kroz vrijeme', 'kako se peče kruh', 'kako se igra nogomet'], 'Priča uspoređuje školu nekad i danas.', 2),
      tocnoNetocno('podatak', 'Jesu li bilježnice u prabakino vrijeme bile skupe?', true, 'U tekstu piše da su pisali na pločicama „jer su bilježnice bile skupe”.')
    ]
  },
  {
    id: 'r4-volonteri', razred: 4, tema: 'citanje-4', ishod: 'OŠ HJ C.4.1', vrsta: 'vijest',
    naslov: 'Učenici skupili 300 knjiga',
    tekst: 'Učenici Osnovne škole Matije Gupca tijekom studenoga skupljali su knjige za dječji odjel bolnice. U akciji je sudjelovalo 120 učenika, a skupljeno je 300 slikovnica i knjiga za djecu. Knjige su učenici sami razvrstali po dobi čitatelja. Prošlog petka predstavnici učeničkog vijeća odnijeli su knjige u bolnicu. Medicinska sestra Vesna zahvalila je učenicima i rekla da će knjige pomoći djeci da lakše provedu dane u bolnici.',
    pitanja: [
      broj('podatak', 'Koliko je knjiga skupljeno za dječji odjel bolnice?', 300, 'U tekstu piše da je skupljeno 300 slikovnica i knjiga.', 1),
      broj('podatak', 'Koliko je učenika sudjelovalo u skupljanju knjiga?', 120, 'U akciji je „sudjelovalo 120 učenika”.', 1),
      izbor('podatak', 'Kome su učenici skupljali knjige?', ['djeci na dječjem odjelu bolnice', 'školskoj knjižnici', 'starijim osobama'], 'Knjige su skupljane „za dječji odjel bolnice”.', 1),
      izbor('podatak', 'Kako su učenici razvrstali skupljene knjige?', ['po dobi čitatelja', 'po boji korica', 'po težini'], 'Učenici su knjige „razvrstali po dobi čitatelja”.', 2),
      izbor('zakljucak', 'Zašto će knjige pomoći djeci u bolnici?', ['Lakše će provoditi dane u bolnici.', 'Brže će naučiti matematiku.', 'Neće morati uzimati lijekove.'], 'Medicinska sestra kaže da će knjige pomoći djeci da lakše provedu dane u bolnici.', 2),
      izbor('vrednovanje', 'Kakav je tekst o skupljanju knjiga?', ['vijest o stvarnom događaju', 'bajka', 'pjesma'], 'Tekst izvještava tko je, što, kada i gdje učinio, kao vijest.', 2)
    ]
  },
  {
    id: 'r4-pismo-iz-tabora', razred: 4, tema: 'citanje-4', ishod: 'OŠ HJ A.4.3', vrsta: 'pismo',
    naslov: 'Pismo iz ljetnog tabora',
    tekst: 'Mrkopalj, 12. srpnja\nDragi mama i tata,\nu taboru je odlično! Spavamo u drvenim kućicama, po šestero u svakoj. Svako jutro u sedam sati imamo tjelovježbu na livadi. Jučer smo planinarili do vrha Bjelolasice i vidjeli srnu. Naučila sam paliti logorsku vatru uz pomoć voditelja i snalaziti se kompasom. Hrana je dobra, ali mi nedostaju tatine palačinke. Vraćam se u subotu, pa me čekajte na kolodvoru u 15 sati.\nVaša Klara',
    pitanja: [
      izbor('podatak', 'Gdje se nalazi Klarin ljetni tabor?', ['u Mrkoplju', 'u Zagrebu', 'na moru'], 'Na početku pisma piše „Mrkopalj, 12. srpnja”.', 1),
      broj('podatak', 'Koliko djece spava u jednoj drvenoj kućici?', 6, 'Klara piše da spavaju „po šestero u svakoj”.', 1),
      izbor('podatak', 'Što je Klara vidjela na planinarenju do Bjelolasice?', ['srnu', 'medvjeda', 'vuka'], 'U pismu piše: „vidjeli srnu”.', 1),
      izbor('podatak', 'Što je Klara naučila u taboru?', ['paliti logorsku vatru i snalaziti se kompasom', 'plivati i roniti', 'svirati gitaru'], 'Naučila je paliti logorsku vatru uz pomoć voditelja i snalaziti se kompasom.', 2),
      izbor('zakljucak', 'Što Klari nedostaje u taboru?', ['tatine palačinke', 'njezin bicikl', 'školski prijatelji'], 'Klara piše: „nedostaju mi tatine palačinke”.', 1),
      izbor('podatak', 'Kada i gdje roditelji trebaju dočekati Klaru?', ['u subotu u 15 sati na kolodvoru', 'u nedjelju ujutro ispred škole', 'u petak u podne u taboru'], 'Klara piše da se vraća u subotu i da je čekaju na kolodvoru u 15 sati.', 2),
      izbor('tumacenje', 'Kako se Klara osjeća u taboru?', ['zadovoljno, iako joj pomalo nedostaje dom', 'tužno i želi odmah kući', 'ljutito na voditelje'], 'Piše da je „odlično”, ali spominje da joj nedostaju tatine palačinke.', 3)
    ]
  },
  {
    id: 'r4-recikliranje-vijest', razred: 4, tema: 'citanje-4', ishod: 'OŠ HJ C.4.1', vrsta: 'vijest',
    naslov: 'Razred koji ne baca',
    tekst: 'Učenici 4. c razreda tijekom ožujka vagali su otpad iz svoje učionice. Prvog tjedna skupili su 6 kilograma otpada, od toga 4 kilograma papira. Zatim su uveli tri kutije: za papir, za plastiku i za ostali otpad. Na poleđini papira počeli su pisati bilješke, a bočice za vodu donosili su od kuće. Posljednjeg tjedna u ožujku skupili su samo 2 kilograma otpada. Ravnateljica je predložila da cijela škola preuzme njihov plan.',
    pitanja: [
      broj('podatak', 'Koliko je kilograma otpada razred skupio prvog tjedna?', 6, 'Prvog tjedna skupili su 6 kilograma otpada.', 1),
      broj('zakljucak', 'Za koliko se kilograma smanjio otpad od prvog do posljednjeg tjedna?', 4, '6 − 2 = 4.', 2),
      izbor('podatak', 'Kojeg je otpada prvog tjedna bilo najviše?', ['papira', 'plastike', 'stakla'], 'Od 6 kilograma čak su 4 kilograma bila papir.', 2),
      izbor('podatak', 'Za što su bile tri kutije u učionici?', ['za papir, za plastiku i za ostali otpad', 'za igračke, knjige i odjeću', 'za kolače, sokove i voće'], 'Uveli su kutije za papir, za plastiku i za ostali otpad.', 1),
      izbor('zakljucak', 'Kako su učenici smanjili papirnati otpad?', ['pisali su bilješke na poleđini papira', 'bacali su papir kroz prozor', 'prestali su pisati'], 'Na poleđini papira počeli su pisati bilješke.', 2),
      izbor('podatak', 'Što je predložila ravnateljica?', ['da cijela škola preuzme plan 4. c razreda', 'da se kutije uklone', 'da učenici prestanu vagati otpad'], 'Ravnateljica je predložila da cijela škola preuzme njihov plan.', 1),
      izbor('vrednovanje', 'Koja je glavna poruka vijesti o 4. c razredu?', ['Malim promjenama možemo mnogo smanjiti otpad.', 'Vaganje otpada je dosadno.', 'Papir ne treba reciklirati.'], 'Razred je jednostavnim navikama smanjio otpad s 6 na 2 kilograma.', 3)
    ]
  },
  {
    id: 'r4-svjetionik', razred: 4, tema: 'citanje-4', ishod: 'OŠ HJ B.4.1', vrsta: 'pripovjedni',
    naslov: 'Svjetioničarev unuk',
    tekst: 'Marin je ljeto proveo kod djeda, svjetioničara na malom otoku. Djed mu je objasnio da svjetlo svjetionika pomaže brodovima da noću ne udare u hridi. Jedne večeri počela je oluja i nestalo je struje. Djed je s Marinom brzo upalio rezervni agregat, a Marin je svjetiljkom osvjetljavao put po skliskim stubama. Svjetlo je opet zasjalo. Ujutro je u luku uplovio ribarski brod. Ribar je zahvalio djedu, a djed je rekao: „Hvala mojem pomoćniku.” Marin je bio ponosan kao nikad prije.',
    pitanja: [
      izbor('podatak', 'Čime se bavi Marinov djed?', ['on je svjetioničar', 'on je ribar', 'on je kapetan broda'], 'U prvoj rečenici piše da je djed svjetioničar na malom otoku.', 1),
      izbor('podatak', 'Čemu služi svjetlo svjetionika?', ['pomaže brodovima da noću ne udare u hridi', 'osvjetljava plažu za kupače', 'grije kuću svjetioničara'], 'Djed objašnjava da svjetlo pomaže brodovima da ne udare u hridi.', 1),
      izbor('podatak', 'Što se dogodilo za oluje?', ['nestalo je struje', 'srušio se svjetionik', 'potonuo je brod'], 'U tekstu piše: „počela je oluja i nestalo je struje”.', 1),
      izbor('podatak', 'Kako je Marin pomogao djedu?', ['svjetiljkom je osvjetljavao put po skliskim stubama', 'popravio je agregat sam', 'pozvao je policiju'], 'Marin je svjetiljkom osvjetljavao put po stubama.', 2),
      izbor('zakljucak', 'Zašto je ribar zahvalio djedu?', ['Svjetlo svjetionika pomoglo mu je da se sigurno vrati.', 'Djed mu je prodao ribu.', 'Djed mu je posudio brod.'], 'Ribarski brod uplovio je u luku nakon oluje zahvaljujući svjetlu.', 2),
      izbor('tumacenje', 'Zašto je Marin bio ponosan?', ['Djed je istaknuo njegovu pomoć.', 'Dobio je novi bicikl.', 'Ulovio je veliku ribu.'], 'Djed je rekao: „Hvala mojem pomoćniku.”', 2),
      izbor('vrednovanje', 'Što priča o svjetioničarevu unuku pokazuje?', ['I djeca mogu pomoći u važnom poslu.', 'Oluje su zabavne.', 'Svjetionici nisu potrebni.'], 'Marinova pomoć bila je važna da svjetlo opet zasja.', 3)
    ]
  },
];
