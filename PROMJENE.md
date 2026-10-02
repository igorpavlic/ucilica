# Promjene u ovom paketu

Pregled svega što je popravljeno, s načinom provjere.

---

## −12. Manje ponavljanja u Informatici, mreža bez skrolanja, hamburger izbornik

**Prijava:** „Tko je drugi u redu?” vraća se nekoliko kvizova zaredom.

**Analiza** (simulacija: jedno dijete, 12 kvizova po 7 pitanja u istoj temi):
- Isto pitanje, točno ista instanca, nije se vraćalo: 30-dnevni prozor radi.
- Vraćao se **isti oblik pitanja** s drugim podatcima. Algoritmi 3. r. imali su oko 12 oblika, pa je dijete nakon dva kviza vidjelo gotovo sve.
- Kad su svi oblici bili „nedavno viđeni”, izbor je uzimao nasumično. Zato se isti oblik mogao vratiti već u sljedećem kvizu.

**Popravak:**
- **Izbor po starosti obitelji** (`questionGenerator.js`, `tezina.js`): najprije dolaze neviđene obitelji pitanja, zatim one koje je dijete vidjelo **najdavnije**. Vrijedi za sve teme.
- **Više oblika zadataka u Informatici:**
  - sortiranje: 9 oblika (najviši/najniži, „koliko je djece više od…”, brojevi uzlazno i silazno, broj u sredini, životinje po težini…), po pozivu 3;
  - AKO–INAČE: 6 oblika (paran/neparan, temperatura, robot i zid, razina u igri…), po pozivu 2;
  - petlje: 4 nova oblika (skokovi, okreti pri crtanju lika, jabuke u košari, koliko ponavljanja);
  - nizovi oblika (▲ ■ ● ★) i nizovi brojeva;
  - šifra: „Koje slovo označava znak…?”;
  - još 13 pitanja o zdravlju i sigurnosti.
- **Rezultat simulacije** (isti tekst pitanja u 12 kvizova):

  | Tema | Prije | Poslije |
  |---|---:|---:|
  | algoritmi 3 | 40 | 24 |
  | algoritmi 4 | 32 | 18 |
  | računalo i sigurnost 3 | 61 | 51 |

  U temi „Računalo i sigurnost” pitanja su činjenice, pa se teže umnožavaju.
- Nova pitanja ulaze u bazu sama, čim dijete potroši neviđena pitanja teme.

**Mreža s robotom:**
- veličina polja ovisi o širini i visini zaslona i o broju redaka;
- kraći opis ispod mreže;
- kratki odgovori su u dva stupca;
- 5×5 stane bez skrolanja na 360×640.

**Hamburger:** na mobitelu, izvan kviza, gornja traka ima samo naziv, bodove i ☰.

## −11. Kviz bez ometanja na mobitelu, copyright

Uzor je zaslon lekcije u Duolingu: tijekom vježbe nema navigacije, na vrhu su samo izlaz i napredak, a „Provjeri/Nastavi” je na dnu.

- **Kviz bez gornje trake.** Umjesto nje je zaglavlje s ✕ (izlaz), trakom napretka i brojačem 3/7.
- **Povratna ploča** izlazi s dna ekrana (`position: fixed`) i sadrži:
  - objašnjenje;
  - poruku točno/netočno;
  - gumb „Sljedeće pitanje”.

  Visina ploče mjeri se (ResizeObserver) i dodaje se kao donji razmak sadržaja, pa ploča ništa ne prekrije. Na iPhoneu se poštuje sigurna zona (`viewport-fit=cover`, `env(safe-area-inset-bottom)`).
- **Novo pitanje** uvijek počinje na vrhu ekrana.
- **Mobitel (≤ 600 px)** ima manje razmake i slova (`clamp`).
- **Niski zasloni (≤ 700 px)** skrivaju naziv teme i napomenu o opsegu ponavljanja.
- **Podnožje** na svim stranicama osim kviza: „© 2026. From RIM · Mudrolina. Sva prava pridržana.”, uz poveznice Upute, Privatnost i Kontakt (contact@fromrim.com).
- **Provjereno u Chromiumu** na 390×740, 360×640 i 412×915 px:
  - pitanje s izborom, prometni znak i poredavanje stanu bez skrolanja;
  - jedino spajanje 4 para s otvorenom pločom na 360×640 treba 13 px skrolanja.

## −10. Prijava pitanja, ljepše strelice, objašnjeni algoritmi iz svakodnevice

- **Gumb „🚩 Prijavi pitanje”** ispod svakog pitanja otvara prozor s poljem „Razlog prijave” i gumbom „Pošalji”.
  - **Backend:** `POST /api/prijave`, `services/prijave.js`.
  - **Spremanje i slanje:** prijava se uvijek sprema u zbirku `prijave`. Ako je SMTP podešen (`SMTP_*`), šalje se i
    e-poštom na `PRIJAVE_EMAIL` (zadano contact@fromrim.com), s pitanjem, ponudama, točnim odgovorom, temom i ID-om.
  - **Zaštita od zloupotrebe:** najviše 5 prijava u 15 minuta s iste adrese, skriveno polje za robote, naslov
    poruke uvijek je jedan redak, a gumb ne šalje dvaput.
  - **Profil:** novo neobavezno polje „E-adresa roditelja”. Ako je upisana, ide u Reply-To, pa odgovor stiže
    roditelju. Djetetova e-adresa se ne traži.
  - **Privatnost:** prijave su dodane u izvoz i brisanje računa (`KORISNICKE_ZBIRKE`). Obavijest o privatnosti
    i upute su dopunjene.
- **Strelice za poredavanje:** okrugli gumbi s ikonama ˄ i ˅ i jasnim stanjem pri prelasku mišem i odabiru
  tipkovnicom. Strelica koja ne vodi nikamo se ne prikazuje. Nakon odgovora strelice nestaju.
- **Informatika, algoritmi iz svakodnevice:** pranje ruku i sadnja cvijeta ostaju, jer tako algoritme uče
  i Code.org („Real-Life Algorithms: Plant a Seed”) i hrvatski udžbenici informatike. Promjene:
  - takvi zadatci nose napomenu: „Algoritam je niz koraka… ima ga i svakodnevni posao, tim koracima uputili
    bismo robota”;
  - pitanje kaže „korake *algoritma* za…”;
  - dodano je 5 novih uputa za računalo i robota (fotografija tabletom, spremanje i ispis crteža,
    e-poruka, robot otvara vrata), pa su upute za uređaje u većini (7 od 12);
  - uklonjene su dvije upute koje ne govore ništa o računalu (obuvanje, slanje pisma).
- Testovi: prijava se sprema bez SMTP-a; sa SMTP-om ide na contact@fromrim.com uz Reply-To roditelja;
  naslov poruke je jedan redak.

## −9. Padeži, Da/Ne, povlačenje i šarene spojnice

**Prijavljeno:**
- „Koji dan dolazi nakon: četvrtak?” i „Tko radi u "polje"?”;
- „Točno/Netočno” uz pitanje „Smiješ li…?”;
- poredavanje bez povlačenja;
- spajanje bez crta.

**Što je ispravljeno:**
- **Padeži — analiza cijele banke.** Kod je pregledan prema obrascu prijedlog + dvotočka ili navodnik. Ispravljeno:
  - „nakon: četvrtak / zima” → „nakon četvrtka / zime” (R1, a dvostruka pitanja o godišnjim dobima su uklonjena);
  - „Tko radi u "polje"?” → „Tko radi na polju?”; svih 9 mjesta rada je u lokativu, a odgovori na „Gdje radi…?” su „u školi”, „na gradilištu”…;
  - „Nakon "siječanj"?” se prepisivao u „Koji mjesec ili dan dolazi nakon siječanj?” — sada je „Koji mjesec dolazi nakon siječnja?”.
    Pravilo „nakon + genitiv” uzima tablicu `VREMENSKE` (mjeseci, dani, godišnja doba, doba dana) u `hr-gramatika.js`;
  - „Koja dva godišnja doba dolaze nakon proljeće?” (s jednim točnim odgovorom) → „Koje godišnje doba dolazi nakon proljeća i ljeta?”;
  - „Umanjenica od "kuća"?” → „Koja je umanjenica riječi "kuća"?”; „suprotno od "x"” → „suprotno od riječi "x"”; „zadužen za "vid"” → „zadužen za vid”;
  - „vježbao/la” u opisu ponavljanja → „teme koje su već vježbane”.
- **Novi test** „Prijedlog s pogrešnim padežom” (`seeds/padezi.js`): ista provjera služi testu i popravku baze.
- **Da/Ne.** Na pitanje („…li…?”) gumbi su „Da” i „Ne”, na tvrdnju „Točno” i „Netočno”. Isto pravilo vrijedi na backendu (`oznakeDaNe`), u kvizu i u povijesti odgovora.
  - Odabrani gumb i točan odgovor sada se označe bojom.
  - Svih 92 pitanja tipa točno/netočno u banci su pitanja, pa sada imaju Da/Ne.
  - Novi test: izbor „Točno/Netočno” uz pitanje.
- **Poredaj povlačenjem** (`PoredajPovlacenjem.vue`). Radi mišem, prstom i olovkom preko Pointer Events, bez nove biblioteke.
  - Strelice ↑↓ ostaju, jer svaka radnja povlačenjem mora imati zamjenu jednim dodirom (WCAG 2.2, kriterij 2.5.7).
  - Čitaču zaslona javlja se „… je sada na 2. mjestu od 4”.
- **Spajanje s crtama** (`SpajanjeParova.vue`). Svaki par dobiva svoju boju (5 boja) i zakrivljenu crtu; broj u kružiću ostaje za djecu koja slabije razlikuju boje.
  - Par se spaja klikom ili povlačenjem od lijevog do desnog člana. Dok se povlači, vidi se isprekidana crta.
  - Nakon provjere točne crte su zelene, a pogrešne crvene i isprekidane.
- **Povijest odgovora** prikazuje točan odgovor i za tipove točno/netočno, poredaj i spajanje (prije je bio prazan).
- Informatika: kod „Koji je prvi korak…” ometači su samo koraci iste upute.
- **`npm run popravi:pitanja`** ispisuje pitanja u bazi koja imaju stari tekst; `-- --primijeni` ih isključi (`isActive: false`) i generira ispravljena. Napredak djece ostaje.

**Provjera:**
- `npm run test:sve` prolazi, pokrenut tri puta.
- Kviz s lažnim API-jem isproban je u Chromiumu na širinama 900 i 390 px: spajanje klikom i povlačenjem, provjera, poredavanje povlačenjem, Da/Ne.

## −8. Nove teme: Informatika, Ja i drugi, Promet i bicikl, Novac i kupovina

- **Novi predmet Informatika** (1.–4. r.), dvije teme po razredu, prema kurikulu NN 22/2018:
  - „Algoritmi i logika”: slijed koraka, robot na mreži, pronađi pogrešnu naredbu, uzorci,
    šifre, sortiranje, AKO–INAČE, petlje i varijable;
  - „Računalo i sigurnost”: uređaji, programi, zdravlje, osobni podatci, lozinke, prijevare.
- **Ja i drugi** (PID, 1.–4. r.): osjećaji, smirivanje, pomoć drugima, lijepo ponašanje,
  prava i dužnosti djeteta, ja-poruke, rješavanje sukoba.
- **Promet i bicikl** (PID, 3.–4. r.): znakovi, semafor, pješak, biciklist i oprema bicikla.
  Pravila prema ZSPC-u (izmjene 2024.): dob 9 godina uz potvrdu, kaciga do 16, e-romobil od 14.
- **Novac i kupovina** (MAT, 3.–4. r.): parametrizirani računi s cijelim eurima, štednja,
  cjenik, račun iz trgovine, najmanje novčanica, potreba ili želja, rok trajanja.
- Registar `seeds/nove-teme.js` puni seed skripte, `GENERATORS`, `npm run topics:add`
  (stvara i predmet Informatika) i testove.
- **Novi prikaz `mreza`** (robot 🤖, cilj ⭐, stijene 🪨) u `QuizView.vue`. Mreža ulazi u `itemKey`.
- Test „natuknica” dopušta strelice kad su to naredbe robotu.
- Upute i README navode nove teme. Istraživanje je u `ISTRAZIVANJE-NOVE-TEME.md`.

**Provjera:**
- `npm run test:sve` prolazi, ponovljeno više puta jer su generatori nasumični.
- Recenzija učitelja: 0 ODBIJ i 0 DORADI za nove teme.
- Simulacija (240 djece × 18 kvizova): nijedan kviz bez novih pitanja.

## −7. Ime Mudrolina, razredi 1.–4., istraživanje Informatike

- **Preimenovano u Mudrolina** u sučelju, obavijesti o privatnosti, uputama, opisima
  paketa i README-u; izvoz podataka sada je `mudrolina-<korisnik>.json`. Namjerno
  nepromijenjeno: ključ `ucilica_token` (korisnici ostaju prijavljeni), zadana baza
  `ucilica`, imena paketa i repozitorija.
- **Razred pri registraciji i u profilu: samo 1.–4.** (`MAX_RAZRED` u `routes/auth.js`,
  `quiz.validators.js`, izbornik u `RegisterView.vue`). Gradivo 5.–8. još ne postoji.
- `ISTRAZIVANJE-PODRUCJA.md` §3.1: „Snalaženje na tipkovnici” zamijenjeno
  istraživanjem **Informatike za 1.–4. r.** (domene A–D, ishodi po razredu, predmet
  *Informacijske i digitalne kompetencije*, unplugged zadatci, Dabar); prijedlog nove
  teme „Informatika”.

## −6. Objava: trust proxy, 30 dana bez ponavljanja, dnevni izazov, privatnost djece

- **`trust proxy`** (`server.js`, `TRUST_PROXY`, zadano 1 u produkciji) — iza Caddyja ili
  Rendera rate limiter inače vidi jedan IP za sve.
- **Nedavno viđeno = 30 dana** (`UCILICA_VIDJENO_DANA`), najmanje zadnjih 10 kvizova;
  vrijedi za teme i miješano ponavljanje. Kad ni generator ne dostaje, dopuna pitanjima
  koja dijete najdulje nije vidjelo (nikad iz zadnja 3 kviza) umjesto praznog kviza.
- **Dnevni izazov** (`services/dnevni.js`, `GET /api/quiz/dnevni/:grade`,
  `GET /api/progress/dnevni`): 10 pitanja dnevno iz cijelog razreda, niz dana zaredom,
  dan po zagrebačkom vremenu. Kartica na početnoj, niz na ekranu rezultata.
- **Privatnost** (`services/privatnost.js`, `/privatnost`): privola roditelja pri
  registraciji (ZPOU čl. 19), izvoz podataka i brisanje računa u profilu, savjet da se ne
  upisuje pravo ime.
- Novi indeksi na `progress` (tema/razred + datum, dnevni izazov).
- `provjeri-tijek.js`: +14 provjera (dani po zagrebačkom vremenu, niz, jedan izazov
  dnevno, prozor od 30 dana, izvoz bez lozinke, brisanje svih zapisa).

**Prije objave:** upisati voditelja obrade i kontakt u obavijest o privatnosti.
Postojeći računi nemaju zapis privole — zatražiti je od roditelja.

---

## −5. Čitanje, medijska kultura i simulirana recenzija učitelja

- **6 novih tekstova** (`citanje-tekstovi.js`): Pčele, Plakat, Hranilica (3. r.);
  Ivana Brlić-Mažuranić, Vozni red, Utrka (4. r.). Ukupno 17 tekstova.
- **Medijska kultura** (`gen-mediji.js`): stari fond s kraticama zamijenjen;
  C.4.1–C.4.3, činjenica/mišljenje, sigurnost na internetu. Ishod teme → C.4.2.
- **`tools/recenzija-ucitelj.js`** (`npm run recenzija`): kontrolni popis K1–K9
  prema Haladyna i sur. (2002), NCVVO i PIRLS. Izvještaj: `RECENZIJA-UCITELJ.md`.
- Recenzija je pronašla: točan odgovor osjetno najdulji u 36–64 % pitanja
  čitanja, književnosti i medija → ometači prepisani u 46 pitanja (0–19 %); **zaplet definiran
  kao najnapetiji dio** (to je vrhunac) → ispravljeno, dodan vrhunac;
  pitanje koje u odgovoru ponavlja vlastitu osnovu.
- Simulacija: sesije bez novih pitanja 7 → 2 (elo), 4 → 1 (kvote).

---

## −4. Kutovi (4. r.), Zavičaj i karta, Kulturna baština (3. r.)

**Bilo:** 12, 29 i 10 zadataka. Uz to: „S,J,I,Z”, „gore,dolje,L,D” i
„omjer karta/stvarnost” kao ponude; „jednakokračan” uz „jednakostranični”
(različit oblik odaje odgovor); „Čemu služi muzej?” s ponudama „škola”,
„tvornica” uz „čuvanje i izlaganje predmeta”; „U koje godišnje doba radimo
ovo: Božić?” s objašnjenjem o godišnjem dobu umjesto o blagdanu.

**Sada:**

| Tema | Modul | Što je novo | Različitih zadataka u 2 000 poziva |
|---|---|---|---:|
| Kutovi | `gen-kutovi.js` | vrsta kuta prema satu i predmetima iz okoline, trokut prema zadanim duljinama stranica (uvijek postoji), krakovi, zablude (dulji krakovi ≠ veći kut, dva prava kuta) | 1 783 |
| Zavičaj i karta | `gen-zavicaj-bastina.js` | nasumični **plan mjesta 3 × 3**: što je S/I/JZ… od škole, u kojem je smjeru zgrada, kojim smjerom ideš; okretanje (desno/lijevo/iza); sporedne strane i kratice; kompas, Sunce u podne, tumač znakova, boje zemljovida | 24 056 |
| Kulturna baština | `gen-zavicaj-bastina.js` | prirodna / kulturna, materijalna / nematerijalna, vrste izvora o prošlosti, gdje se što čuva (spajanje), **vremenska crta** s vjerodostojnim godinama, desetljeće i stoljeće | 6 206 |

- Bez mjerenja kuta u stupnjevima (nije gradivo 4. r.) i bez oduzimanja
  četveroznamenkastih godina (3. r. oduzima do 1000) — pita se poredak.
- Godine događaja imaju vjerodostojan raspon (željeznica od 1862., dom
  zdravlja nakon 1950.), da „knjižnica 1677.” ne bude starija od crkve.
- Kurikul: sporedne strane svijeta i vremenska crta su 3. r. PID;
  C.4.2 — trokuti prema duljinama stranica i pravokutni trokut.

**Provjera:** `npm run test:sve` prolazi; 2 000 poziva bez nevaljanih zadataka.
Simulirani pilot:

| Krak | Početak (prije −2) | Prije (−3) | Sada |
|---|---:|---:|---:|
| elo | 133 (3,1 %) | 11 | **7 (0,16 %)** |
| kvote | 164 (3,8 %) | 14 | **4 (0,09 %)** |

Preostalo (1–3 sesije po temi): `citanje-3/4`, `medijska-kultura`,
`biljke-zivotinje-3`, `hrvatska-domovina`.

**Uvođenje:** `npm run seed:3 && npm run seed:4`.

---

## −3. PID 3.–4.: Tlo, voda, zrak i Uvjeti života — više obitelji nad istim činjenicama

**Bilo:** 11 i 13 zadataka; u simulaciji najčešće iscrpljene teme nakon
podataka i nepoznatog broja (14/15 i 11/18 sesija bez novih pitanja).
Uz to: „minerali,voda,zrak,humus”, poredak kruženja vode kao skraćenice
(„ispar.→oblak→…”), „CO₂” u 3. razredu, „fotosinteza” u 4. (pojam iz 5. r.),
„Čime počinje kruženje vode?” (krug nema početak), „neophodna za organizme”
kao opis samo vode, „0°C” bez razmaka.

**Sada:** `seeds/gen-pid-uvjeti.js`, poziva se iz `reviewQuestions`
(prije dodjele `itemKey`). Ista činjenica ispituje se kroz više obitelji:

| 3. r. — Tlo, voda, zrak | 4. r. — Uvjeti života |
|---|---|
| svojstvo vode / što NIJE svojstvo | pokus s grahom: koji je uvjet oduzet |
| stanje vode u primjeru (led, rosa, inje…) | hoće li biljka rasti (točno/netočno) |
| promjena stanja u svakodnevnoj situaciji | što smije biti različito u pokusu (jedna varijabla) |
| kruženje vode — poredak (3 polazišta) | stanje vode pri nasumičnoj temperaturi |
| pokus → zaključak (pijesak/glina, zrak u tlu, čaša, sol, smrzavanje) | prilagodbe — spajanje i izbor |
| čuva / onečišćuje vodu, zrak, tlo | uvjet ↔ uloga — spajanje |
| točno/netočno, činjenice | što NIJE uvjet, sastav zraka, živa i neživa priroda |

- Ponude u „čuva / onečišćuje” su sve glagolske imenice, da točan odgovor ne
  odskače oblikom (NCVVO: ometači istog gramatičkog oblika).
- Ometači su česte zablude: „Mjesec svijetli sam”, „vodena para se vidi”,
  „voda se smrzavanjem skuplja”, „glina propušta vodu bolje od pijeska”.
- Sve nove stavke imaju objašnjenje.

**Provjera:** `npm run test:sve` prolazi; 2 000 poziva bez nevaljanih zadataka
(245 i 683 različita zadatka). Simulirani pilot:

| Krak | Prije (−2) | Poslije |
|---|---:|---:|
| elo | 33 (0,8 %) | **11 (0,25 %)** |
| kvote | 55 (1,3 %) | **14 (0,3 %)** |

Preostalo: `citanje-3/4` (novi tekstovi), `geometrija-kutovi`, `zavicaj-karta`,
`kulturna-bastina` — po 1–8 sesija.

**Uvođenje:** `npm run seed:3 && npm run seed:4`.

---

## −2. Podatci i nepoznati broj — parametrizirani generatori (iscrpljivanje tema)

**Bilo:** `podatci-3` (6 zadataka), `podatci-4` (8) i `nepoznati-3` (12) bili su
statični popisi. Simulirani pilot: 133 od 4 320 sesija (elo) i 164 (kvote) bez
novih pitanja; 77–102 od toga otpada na ove četiri teme. `nepoznati-3/4` padali su
i na `provjeri-raznolikost` (2 i 4 obitelji pitanja).

**Sada:** `seeds/gen-podatci.js` i `seeds/gen-nepoznati.js`. Konteksti su pisani
ručno, brojevi se biraju pri svakom pozivu — kad se tema iscrpi,
`generateAndStore` dobiva nove zadatke s novim `itemKey`, umjesto istih 6.

| Tema | Ishod | Po pozivu | Obitelji | Što dijete radi |
|---|---|---:|---:|---|
| `podatci-3` | E.3.1 | 42 | ~27 | grafikon **i** tablica: najveći/najmanji, očitaj, razlika, zbroj, dopuna, prag, poredaj, točna tvrdnja, par sa zadanim zbrojem |
| `podatci-4` | E.4.1, E.4.2 | 56 | ~37 | isto s većim brojevima + prebrojavanje s popisa odgovora, crtice, vjerojatnost (siguran/moguć/nemoguć, vjerojatnije, jednako vjerojatno) |
| `nepoznati-3` | B.3.1 | 52 | ~20 | □ i **slovo** kao oznaka broja, sve četiri operacije, zamjena slova brojem, provjera rješenja, priča → jednakost |
| `nepoznati-4` | B.4.1 | 49 | ~23 | isto do 10 000 + **nejednakosti** (najveći/najmanji broj, koji broj zadovoljava), razlikovanje jednakosti i nejednakosti |

- Ometači su tipične pogreške (zbroj umjesto razlike, ±1, ±10), ne slučajni brojevi.
- Svaki zadatak ima `objasnjenje` i `ishod`.
- Slova `b, c, x, y` — ne „a”, „i”, „u”, „s”, „k” koja su i riječi.
- Imenice u pričama idu kroz `hr-gramatika` (1 naljepnicu / 3 naljepnice / 5 naljepnica).
- `itemKeyZa` sada uključuje grafikon kad postoji: isti tekst uz druge podatke
  drugi je zadatak. Ključevi pitanja bez grafikona nisu promijenjeni.
- `test:raznolikost` dodan u `test:sve` — prije nije bio pokretan, pa pad nije bio vidljiv.

**Provjera:**
- `npm run test:sve` prolazi (3 uzastopna pokretanja s različitim slučajnim brojevima).
- 2 000 poziva svakog generatora (398 000 zadataka): 0 nevaljanih (NaN, negativan
  ili prazan ključ, dupli ponuđeni odgovori, ključ izvan ponude, > 200 znakova).
- Simulirani pilot, isti seed:

| Krak | Prije | Poslije | Ove 4 teme |
|---|---:|---:|---:|
| elo | 133 / 4 320 (3,1 %) | **33 (0,8 %)** | 77 → **0** |
| kvote | 164 / 4 320 (3,8 %) | **55 (1,3 %)** | 119 → **0** |

Preostalo iscrpljivanje: `uvjeti-zivota`, `tlo-voda-zrak`, `citanje-3/4` —
činjenični i tekstovni sadržaj koji se ne može parametrizirati brojevima;
vidi `ISTRAZIVANJE-KVIZ.md`, odjeljak 8.

**Uvođenje:** `npm run seed:3 && npm run seed:4` (ili `seed:all`).

---

## −1. Tekstovi, objašnjenja, predlošci, obrađeno gradivo, dvoznamenkasto, kalibracija + simulirani pilot

- **Tekstovi za čitanje** — `seeds/citanje-tekstovi.js`: 11 izvornih tekstova (2.–4.), 66 pitanja s `proces`
  (podatak/zaključak/tumačenje/vrednovanje), objašnjenjem-dokazom i ishodom po pitanju (`ishod` → `gik.outcome`).
  Učitelj ih treba pregledati prije objave.
- **Objašnjenja** — `services/objasnjenja.js`: postupak ili pravilo izvedeno iz zadatka, upisuje se samo ako se
  slaže s ključem; `objasnjenjeIzvor`, `objasnjenjeVrsta`. Pokrivenost 1,5 % → ~66 % (MAT 94 %, HJ 66 %, PID 21 %).
  Ostatak: `npm run objasnjenja:praznine` → CSV radni popis (~945 predložaka).
- **templateId / itemKey** — stabilna oznaka predloška i sadržajni ključ zadatka, spremaju se uz pitanje.
- **Obrađeno gradivo** — `services/obradjeno.js`, `GET/PUT /api/progress/obradjeno`, odjeljak u profilu;
  miješano ponavljanje: označeno → vježbano → sve; slojeviti uzorak i ravnoteža predmeta.
- **Dvoznamenkasto množenje/dijeljenje** — 62 zadatka u 9 predložaka (`pmd2:*`) u `pisano-mnoz-dijel`.
- **Kalibracija** — `tezina.js`: bez kazne za sporost; ocjene po `itemKey` + `template_ratings`; izbor po
  izmjerenoj težini (cilj ~75 %) nakon 15 odgovora u predmetu; zapis `responses`; `analizaPitanja` za pregled.
- **Simulirani pilot** — `tools/simulacija/` (`npm run sim:pilot`). Popravci koje je otkrio: duplikati pri
  iscrpljivanju banke (generiranje sada preskače postojeći `itemKey`), redoslijed predmeta u ponavljanju.
- Sitno: „podsjeća na kuglu”, biljožder/mesožder/svežder u pitanju, uklonjeno „Je li ova hrana zdrava?”.
- Uvođenje: `npm run seed:all`; nove kolekcije `responses`, `template_ratings`; `item_ratings` sada po `kljuc`.

---

## 0. Provedba analize od 1. listopada 2026. (P0 + dio P1)

Izvor: *Učilica — detaljna analiza koda, kurikuluma i pitanja* (presjek 3 940 pitanja).
Svih 93 zapisa s posebnom oznakom dorade riješeno je u generatorima; 13 zadataka o
stranama svijeta premješteno je iz 2. u 3. razred, kako analiza predlaže.

### Ključevi i formulacije (P0)
- `seed-r4.js` — „Koliko stotica ima tisuća?" → **10**, „Koliko tisuća ima deset tisuća?" → **10**,
  „Koliko tisuća ima milijun?" → **1 000**; ometači su tipične zamjene mjesnih vrijednosti, uz objašnjenje.
- `seed-r3.js` — „Koje su glavne strane svijeta?" (brojčani ključ) → „Koliko je glavnih strana svijeta?";
  „Koliko agregatnih stanja…?" (ključ nazivi) → „Koja su tri agregatna stanja vode?";
  „jadransko more… Napiši jednu riječ." → „Napiši obje riječi."
- `seed-r2.js` — „Ana ___ knjigu." i ostali otvoreni upisi sada nude tri riječi od kojih samo jedna pristaje.
- Negramatični predlošci: „Koliko stranica ima kruga?" (stari kratki oblik + dorada) i
  „Kako se zove kut koji je manji je od…" — zamijenjeni pravilnim rečenicama; krug se opisuje, ne broji kao 0.

### Ocjenjivanje i sesije (P0)
| Problem | Sada |
|---|---|
| Isti ID odgovora bodovan više puta | Predaja s ponovljenim pitanjem → 400 |
| Djelomična predaja = 100 % | Nazivnik je broj pitanja sesije; `progress.complete`, `answeredQuestions` |
| Prvi pokušaj nije spremljen | `checkAnswer` sprema prvi odgovor u `quiz_attempts.checks`; predaja boduje prvi pokušaj, bilježi `pokusaja` i `kasnijeTocno` |
| Istodobne predaje | Atomsko `claimAttempt` (`completedAt: null` u uvjetu); pri grešci prije upisa sesija se otpušta |
| Match: isti ID lijevo i desno | Desni članovi nose nasumične sesijske oznake (`match_tokens`); server vraća `vezeTocne` po vezi |
| `checkAnswer` bez vlasnika | `optionalAuth` + ista provjera vlasnika kao kod predaje (gost: `user_id: null`) |
| `tocan('A','a','slovo')` = točno | Zadatci o velikom/malom slovu i dvoslovima imaju `konstrukt: 'velikoSlovo'` |
| `'27 770'` ≠ `'27770'` | Brojčani ključ uspoređuje se matematički; jedinica se prihvaća samo ako je navedena u pitanju |
| Dvostruki klik šalje dvije provjere | Brava `provjeravam` u storeu i onemogućeni gumbi |
| Razred se gubi u navigaciji | `grade` se nosi kroz teme → kviz → rezultate → početnu |

### Kurikulum i metapodatci (P1)
- `gikEngine` više ne tvrdi `curriculumAlignment: 'high'`: `topic-level` (poznata tema) ili `none`,
  uz `reviewStatus: 'unreviewed'`, `needsReview`, `limitation`, `secondaryOutcomes`.
  Nepoznata tema ne dobiva izmišljeni ishod „GIK" ni zadani predmet.
- Ispravljeni ishodi: zbrajanje/oduzimanje do 100 → A.2.3; množenje/dijeljenje → A.2.4;
  pisano zbr./oduz. → A.4.2; pisano množ./dijelj. → A.4.3; nepoznati-3/4 → B.3.1/B.4.1;
  oduzimanje (1.) → A.1.4; citanje-2 → A.2.5 (uz ograničenje: rječnik, ne čitanje teksta);
  recenice-2 → A.2.4; zavicaj-karta → B.3.4; biljke-zivotinje-3 → B.3.2.
- FSRS ključ: `gik.skillId` (`R2:zbrajanje-100`) umjesto širokog ishoda; stara pitanja padaju na `gik.outcome`.
- `questionFamily` normalizira i „…" / «…» navodnike — obitelji sada odgovaraju predlošcima.
- 2. razred: novac do 100 € (bez 120 € / 102 €), bez pretvorbi km/kg/L; zavičaj = orijentiri, put, plan mjesta.

### Provjera
- `npm run test:sve` — sve prolazi; `provjeri-tijek.js` proširen s 31 novom provjerom
  (duplikati, djelomična i istodobna predaja, prvi pokušaj, vlasnik sesije, ključevi,
  upitna riječ ↔ oblik ključa, „jedna riječ" ↔ ključ, novac/pretvorbe 2. razreda, ishodi).
- `audit.js` iz analize: 3 904 pitanja (seed 20261001), raspodjela točnog položaja 400/356/398/382.
- Frontend: `vite build` prolazi. Integracijski test s pravim MongoDB-om nije pokrenut.

### Uvođenje
1. `npm run seed:all` — ponovno generira banku (ključevi, ishodi, `skillId`). Seed briše pitanja i teme
   po razredu, pa stari zapisi u `progress` ostaju vezani uz stare `topic_id`.
2. `skill_states` sa starim ključevima (npr. `MAT OŠ A.2.4` koji je značio zbrajanje) treba obrisati
   ili zanemariti — novi ključevi su `R{razred}:{tema}`.

### Nije obuhvaćeno (P1/P2 — traži stručni sadržaj ili pilot)
Stvarni tekstovi za čitanje (2.–4.), `templateId`/mikrovještine po predlošku, oznaka „obrađeno gradivo"
za miješano ponavljanje, ciljano pisano množenje s dvoznamenkastim množiteljem, kalibracija Elo težine
i njezino uključivanje u izbor pitanja, objašnjenja za ~98 % pitanja, pregled učitelja i pilot s djecom.

---

## 1. Hrvatska gramatika — glavni popravak

**Bilo:** od 212 parova „broj + imenica" u generiranim pitanjima, **153 (72 %)
gramatički netočno.**

```
✗ Ana ima 6 jabuke. Dobije još 3.
✗ Nina ubere 1 bojice. Mama ubere 2.
✗ U prvom redu 3, u drugom 5 igračke.
```

Uzrok: rječnici `ITEMS_F` / `ITEMS_M` držali su nominativ množine
(`["jabuke", "olovke", …]`) i lijepili ga iza svakog broja.

**Sada:** novi `backend/seeds/hr-gramatika.js` — tablica od 42 imenice s tri
oblika (N jd, paukal, G mn), rodom, oznakom `jestivo` i `predmet`, te 39 imena
s eksplicitnim rodom. Kategoriju broja daje ugrađeni `Intl.PluralRules("hr")`.

```
✓ Ana ima 6 jabuka. Dobije još 3 jabuke.
✓ Nina ubere 1 bojicu. Mama ubere 2 bojice.
✓ U prvom redu su 3 igračke, a u drugom 5 igračaka.
```

Pokriveno:

- **Slaganje broja i imenice** — 1 jabuka / 2 jabuke / 5 jabuka, uz iznimke
  na 11–14 i 21, 101
- **Padež** — `brojIme(1, 'naranca', 'A')` → „1 naranču" za objekt
- **Rod** — particip (`dobio` / `dobila`), zamjenica (`mu` / `joj`),
  posvojni pridjev (`Lukin`, `Markov`); *Luka, Noa, Roko, Karlo* prepoznati
  kao muška imena na -a/-o
- **Slaganje glagola** — *1 jabuka je*, *2 jabuke su*, *5 jabuka je*
- **Semantika** — `jestivo` sprječava „pojeo 3 markera"; `predmet` odvaja
  stvari koje dijete skuplja od strukturnih imenica (red, kutija, stablo)

`gen-engine.js` — `storyProb()` prepisan: 29 predložaka prima gramatički
kontekst umjesto gotovog niza. Nestale su sve kose crte `Dobio/la` i `mu/joj`.

**Provjera:** `npm test` → „Slaganje broja i imenice ✓" (0 od 6 207 pitanja).

---

## 2. Duplicirani ponuđeni odgovori

**Bilo:** 23 pitanja s ponovljenim izborom — dijete je vidjelo isto slovo dvaput.

```
✗ Slovo nakon "V"?  →  ["U", "Ž", "Ž", "Z"]
✗ Slovo prije "B"?  →  ["C", "Z", "A", "A"]
```

Nastajalo na rubovima abecede gdje su se `abc[i-1]` i fiksni distraktor `"Ž"`
poklapali.

**Sada:** dva popravka.

1. `fix()` u `gen-hrvatski.js` sada centralno deduplicira odgovore, ponovno
   izračuna `correctIndex` i odbaci pitanje ako nakon čišćenja ostane manje od
   dva izbora. Štiti sve generatore, ne samo ovaj.
2. Nova `distraktoriSlova()` bira tri različita slova iz abecede, prvenstveno
   iz okoline točnog odgovora.

**Provjera:** `npm test` → „Choice s dupliciranim odgovorima ✓".

---

## 3. Vizual za prebrojavanje izlazi izvan kartice

**Bilo:** kod pitanja „Prebroji koliko ih ima" zadnja zvjezdica bila je odrezana.
Zadatak koji traži brojanje, a ne pokazuje sve elemente, nije rješiv.

Uzrok: `.question-visual` ima `flex-wrap: wrap`, ali vizual se ispisivao kao
jedna interpolacija `{{ visual }}`. Neprekinuti tekst je u flex spremniku **jedan**
element, pa se prelamanje nikad nije primijenilo.

**Sada:**

- `QuizView.vue` razlaže vizual na pojedinačne znakove preko `Intl.Segmenter`
  (emoji sa spojnicama, npr. 👨‍👩‍👧, ostaju jedan znak) i svaki renderira kao
  vlastiti `<span>` — tek tada `flex-wrap` radi
- Kod 6+ jednakih znakova grupira po 5, pa dijete prepoznaje skupine umjesto da
  broji jedan po jedan
- `main.css`: `font-size: clamp(1.6rem, 7vw, 2.5rem)` — pri mnogo elemenata font
  se sam smanjuje umjesto da sadržaj isteče; prilagodbe i na 600 px i 380 px

**Provjera:** 7 zvjezdica → 2 skupine (5 + 2); 20 → 4 skupine; miješani vizual
(`🍎🍎🍎 + 🍏🍏`) se ne grupira nego ostaje niz pojedinačnih znakova.

---

## 4. `seed.js` brisao bazu pri importu

**Bilo:** `backend/seeds/seed.js` završavao je golim pozivom `seed();`. Svaki
`require` te datoteke spojio bi se na bazu, obrisao podatke 1. razreda i pozvao
`process.exit(0)`. `seed-r2/r3/r4.js` bili su zaštićeni, `seed.js` nije.

**Sada:** `if (require.main === module) { seed(); }` — kao i ostali.

**Provjera:** `node -e 'require("./seeds/seed.js")'` se vrati bez ijednog upita
prema bazi.

---

## 5. Emoji kao odgovor na input pitanje

**Bilo:** `fix-emoji-inputs.js` je jednokratna migracija baze, ali
`questionGenerator.js` pri generiranju u hodu upisivao je ista pitanja natrag
bez provjere. Dijete je dobivalo „Napiši emoji." i moralo utipkati 🎁.

**Sada:** filtar u `generateAndStore()` odbacuje svako `input` pitanje čiji je
odgovor sastavljen samo od emojija — bug se više ne može vratiti kroz
generiranje. Migracija ostaje za već postojeće zapise.

**Provjera:** `npm test` → „Input pitanja s emoji odgovorom ✓".

---

## 6. Adaptivnost — `difficulty` se konačno koristi

**Bilo:** svako pitanje nosi `difficulty`, ali se pri odabiru nigdje nije čitao.
Dijete koje savršeno zbraja dobivalo je iste zadatke kao ono koje muku muči.
`gikEngine.js` je imao gotove funkcije (`decideDifficultyTarget`,
`pickBalancedQuestions`, `inferDifficultyBand`) koje nitko nije pozivao.

**Sada:** `getQuizQuestions()` čita uspješnost na temi iz zadnjih 5 rundi
(nova `getTopicStats()`), traži širi uzorak neviđenih pitanja (`count × 6`) i
raspoređuje ga po kvotama:

| Uspješnost | Razina | Lako / Srednje / Teško |
|---|---|---|
| ≥ 85 % i niz ≥ 2 | napredna | 1 / 2 / 4 |
| ≥ 65 % | uravnotežena | 2 / 3 / 2 |
| < 65 % | podrška | 4 / 2 / 1 |

---

## 7. GIK metapodaci na pitanjima

`gikEngine.js` ima 59 tema s ishodima iz kurikula, ali ga ništa nije uvozilo.
Sada i generiranje u hodu i sve četiri seed skripte dodaju `gik` na svako
pitanje:

```json
{ "outcome": "MAT OŠ A.1.4", "outcomeText": "zbraja u skupu brojeva do 20",
  "domain": "Računske operacije", "difficultyBand": "medium" }
```

Time je otvoren put prema praćenju po vještinama (vidi „Što dalje").

---

## 8. Mrtav kod

`modules/quiz/quiz.generator.js` obrisan — 47 redaka nedovršenog generatora koji
je proizvodio polje `options` (shema ga ne poznaje, ostatak koda koristi
`answers`). Nitko ga nije uvozio.

---

## 9. Testovi

Novi `backend/test/`, spojen na `npm test`:

**`provjeri-pitanja.js`** — 13 provjera nad svih ~6 200 generiranih pitanja.
Izlazni kod 1 ruši CI. Provjere slaganja grade se iz same tablice imenica, pa
dodavanje nove imenice automatski proširuje pokrivenost.

**`provjeri-tijek.js`** — podmeće lažnu bazu i prolazi cijeli tijek kviza bez
MongoDB-a. Uz osnovni put provjerava i da:

- pitanja poslana klijentu **ne** sadrže `correctIndex`, `correctAnswer` ni `gik`
- odgovor na pitanje izvan sesije vraća 403
- ponovna predaja iste sesije vraća 409
- bodovi i niz se ispravno ažuriraju

`npm run seed:all` pokreće oboje prije nego dotakne bazu.

---

## 10. Sitnije

- `backend/.env.example` — server odbija start bez `JWT_SECRET` i `MONGODB_URI`,
  a predloška nije bilo
- `package.json` (oba) — dodani `test`, `test:tijek`, `test:sve`, `seed:3`,
  `seed:4`; `seed:all` sada prvo testira
- README prepisan: nova struktura, pravila hrvatske gramatike, testovi,
  tablica adaptivnosti

---

## Provjereno

```
npm test                          → 16/16 ✓   (6 260 pitanja)
cd backend && npm run test:tijek  → 31/31 ✓
```

Test je provjeren i s namjerno ubačenim greškama („Ana ima 5 jabuke",
duplicirani odgovori) — uredno pada.

**Nije provjereno u ovom okruženju:** `npm run build` na frontendu. Sandbox
blokira `vue-demi` (ovisnost Pinie), pa Vite nije mogao instalirati. Umjesto
toga provjereno: sintaksa `<script setup>` kroz `node --check`, balans tagova u
templateu, da su svi identifikatori iz templatea definirani, balans vitičastih
zagrada u CSS-u i logika razlaganja znakova u Nodeu. Pokreni build lokalno prije
deploya.

---

# Drugi krug — plan iz analize

## 11. Rječnik proširen na 120 imenica

Bilo 42, sada **120** u deset kategorija (škola, hrana, igračke, priroda,
životinje, kućanstvo, promet, ljudi, mjere, strukturne). Podaci su odvojeni u
`seeds/hr-imenice.js`, logika ostaje u `hr-gramatika.js`.

Kategorija služi da predložak izabere tematski prikladnu imenicu — zadatak o
livadi više ne dobiva olovke.

**Živo i neživo.** Muški rod razlikuje akuzativ prema živosti: *vidim stol*, ali
*vidim psa*. Prije se to nije razlikovalo. Sada životinje i ljudi nose
`zivo: true`, a `akuzativJd()` to poštuje.

**Nove provjere.** Rječnik je pisan rukom, pa ga stroj provjerava: poklapa li se
ključ s nominativom, završava li genitiv jednine ženskog roda na -e, akuzativ na
-u, ima li životinja u muškom rodu oznaku `zivo`. Provjereno s namjerno
ubačenim greškama — uredno pada.

### hrLex nije bilo moguće preuzeti ovdje

`tools/hrlex-izvuci.js` je napisan i provjeren na umjetnom uzorku, ali sam
leksikon nisam mogao dohvatiti: mrežni proxy ovog okruženja odbija clarin.si i
nlp.ffzg.hr s 403 (organizacijska zabrana, ne kvar). Skriptu pokreni lokalno:

```bash
curl -L -o hrLex_v1.3.gz \
  "https://www.clarin.si/repository/xmlui/bitstream/handle/11356/1232/hrLex_v1.3.gz"
node tools/hrlex-izvuci.js hrLex_v1.3.gz
```

Skripta čita MSD oznake (`Ncfsn`, `Ncfsg`, `Ncfpg`, `Ncfsa`), bira češći oblik
kad postoje dublete (*olovaka* / *olovki*), prepoznaje živost iz akuzativa i
preskače vlastite imenice. Provjereno: iz uzorka je ispravno izvukla i
`pas → psa` (živo) i `stol → stol` (neživo).

---

## 12. Ponavljanje po krivulji zaboravljanja (FSRS)

Dosad: „viđeno u zadnjih 10 rundi" — binarno, bez razlike između pogotka iz
prve i trećeg pokušaja, bez pojma kada je nešto vrijeme ponoviti.

Sada se prati **vještina**, ne pitanje. Vještina je GIK ishod koji svako pitanje
već nosi (`gik.outcome`, npr. `MAT OŠ A.1.4`).

Ocjena se izvodi iz točnosti i vremena, uz prag koji raste s težinom pitanja —
na teškom zadatku 10 s nije sporo. Ako je ijedan odgovor iz iste vještine bio
netočan, cijela vještina ide na `Again`: promašaj je jači signal od pogotka.

`createSession` daje prednost pitanjima čija je vještina dospjela, pa tek onda
primjenjuje kvote težine. Zapis vještina je u `try/catch` — ako zakaže, rezultat
kviza je već spremljen i kviz se ne ruši.

Nova kolekcija `skill_states` s indeksima. Novi krajnji resurs
`GET /api/progress/vjestine` vraća stanje po vještinama, najslabije prvo —
osnova za roditeljski pregled.

Koristi [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) 5.4.2, MIT,
bez ovisnosti.

---

## 13. Novi tip pitanja: spajanje parova

Dotad samo `choice` i `input`. Za 1. i 2. razred je spajanje prirodnije od
tipkanja.

Interakcija je klik-pa-klik, ne povlačenje — na dodirnicima pouzdanije i mlađem
djetetu lakše. Veze se označavaju brojevima umjesto crtanjem linija, pa raspored
radi na svakoj širini zaslona. Ponovni klik na spojeni član razvezuje.

70 pitanja kroz sve razrede: životinja → glasanje i dom (1. r.), imenica → rod
i životinja → proizvod (2. r.), riječ → vrsta riječi (3. r.), organ → sustav,
osjetilo → organ i grad → kraj (4. r.).

Dva nalaza usput:

- **`sh()` je determinističan** (`j = (i*7+3) % (i+1)`) — namjerno, za stabilan
  redoslijed distraktora. Ali `pickN` to nasljeđuje, pa je uvijek vraćao isti
  podskup: od 18 traženih pitanja nastajala su 2. Dodan `shR` / `pickNR` za
  slučajeve kad treba stvarna nasumičnost.
- **Dvosmisleni zadaci.** Kod „imenica → rod" desni stupac je imao „ženski"
  dvaput — dijete ne može znati koji je pravi par. Generator sada bira samo
  različite desne članove, a ocjenjivanje uspoređuje **tekst** umjesto indeksa,
  pa se priznaje svako značenjski ispravno spajanje.

Usput popravljeno: `module.exports` u `routes/progress.js` stajao je na liniji
109, a ruta `/answers` registrirala se poslije njega. Radilo je jer se router
mutira, ali je krhko — export je premješten na kraj.

---

## Tri prijave iz zadnjeg pokretanja

**1. `Cannot find module 'ts-fsrs'`**

Nije greška u kodu — `ts-fsrs` je nova ovisnost (ponavljanje po krivulji
zaboravljanja) i zapisana je u `backend/package.json`, ali `node_modules` je
star. Rješenje:

```
cd backend
npm install
```

**2. `npm run seed` napunio samo 1. razred**

`seed` je pokazivao na `seeds/seed.js`, a to je skripta samo za 1. razred.
Sada `npm run seed` pokreće **sva četiri razreda**; pojedinačni razred je
`npm run seed:1` … `seed:4`.

Usput: sve četiri skripte zvale su `process.exit(0)` i kad bi uhvatile grešku,
pa bi lanac `&&` u `seed:all` tiho nastavio preko pada. Dodana zastavica
`pogreska` i `process.exit(pogreska ? 1 : 0)`. Svaka skripta briše samo svoj
razred (`deleteMany({ grade: GRADE })`), pa ulančavanje ne gazi prethodne.

**3. U aplikaciji nema izbora razreda**

Izbornik je postojao samo u profilu, iza sličice u zaglavlju, i nudio je
razrede 1–8 iako sadržaja ima za 1–4.

- nova ruta `GET /api/subjects/razredi` vraća razrede za koje u bazi postoji
  aktivan predmet;
- `HomeView.vue` ima izbornik razreda na vrhu, prije popisa predmeta; prijavljenom
  korisniku se izbor pamti (`PATCH /auth/me`), gostu traje do osvježenja;
- ako razred korisnika nema sadržaja, zaslon se prebaci na prvi koji ga ima;
- prazna baza više ne daje prazan zaslon nego uputu da se pokrene `npm run seed`;
- `ProfileView.vue` više ne nudi razrede kojih nema.

---

## Jasnoća pitanja

**Prijava:** „nije bilo jasno da se treba staviti znak za završetak rečenice."

Zadatak je glasio:

```
Popravi rečenicu: "pada kiša"
```

Očekivalo se `Pada kiša.` Dijete koje upiše `Pada kiša` dobije netočno — a
nigdje nije pisalo da treba i točku. To nije pogreška u pravopisu nego u
pogađanju što se traži.

### Izvori

Pravila su uzeta iz smjernica za sastavljanje zadataka, ne izmišljena:

| Izvor | Što kaže |
|---|---|
| [NCVVO, Smjernice za izradu ispitnih zadataka (2020)](https://www.ncvvo.hr/wp-content/uploads/2020/04/NCVVO_Smjernice-za-izradu-ispitnih-zadataka_PRVI-DIO_04_2020.pdf) | „Osnovu zadatka treba oblikovati u upitnome obliku." „Ometači ne smiju biti djelomično točni niti previše slični točnomu odgovoru." |
| [Haladyna, Downing & Rodriguez (2002)](https://site.ufvjm.edu.br/fammuc/files/2016/05/item-writing-guidelines.pdf) | Pitanje ispred nedovršene rečenice; tri ponuđena odgovora su dovoljna; ometači iz tipičnih dječjih pogrešaka. |
| [TIMSS 2019 Item Writing Guidelines](https://timssandpirls.bc.edu/timss2019/pdf/T19-item-writing-guidelines.pdf) | Naznačiti očekivanu razinu detalja odgovora; količina čitanja na najmanju mjeru. |
| [Čubrić, M., Pravopisni zadatci](https://hrcak.srce.hr/file/253904) | Upisivanje samo znaka, izvan rečenice, djetetu je neprirodno — „mogućnost zabune razrješuje se kontekstom". |
| [Profil Klett, Metodologija izrade zadataka](https://www.profil-klett.hr/sites/default/files/datoteke/metodologija_izrade_zadataka_corr_pk_2020-clanak.pdf) | Uputa počinje glagolom koji opisuje radnju; ponuđeni odgovori istog reda i podjednake duljine. |
| [Deque — čitači zaslona i interpunkcija](https://www.deque.com/blog/dont-screen-readers-read-whats-screen-part-1-punctuation-typographic-symbols/) | Samostalan interpunkcijski znak čitač zaslona ne izgovara pouzdano. |

Sve je skupljeno u novi `backend/seeds/jasnoca.js`, s izvorima u zaglavlju.

### Što je popravljeno

**1. Zadatak s upisom sada kaže u kojem se obliku odgovara.**

```
✗ Popravi rečenicu: "pada kiša"
✓ Napiši ovu rečenicu pravilno: "pada kiša" Napiši cijelu rečenicu —
  velikim početnim slovom i s rečeničnim znakom na kraju.

✗ Doba snijega?
✓ U koje godišnje doba pada snijeg? Napiši jednu riječ.
```

Oblik se izvodi iz samog odgovora (`dopuniFormat`), pa vrijedi za sva 2426
zadatka s upisom bez ručnog prepisivanja generatora. Čisti računski zadaci
(`Koliko je 7 + 0?`) se preskaču — ondje nema dvojbe.

**2. Ocjena je stroga samo u onome što zadatak i uči.**

Prije se uspoređivao cijeli niz znakova, pa je `Pada kiša` bilo netočno i
kad zadatak uopće nije bio o interpunkciji. Sada svako pitanje nosi
`konstrukt` — što se njime zapravo provjerava:

| konstrukt | točka na kraju | veliko slovo | dijakritici |
|---|---|---|---|
| `recenica` | traži se | traži se | traže se |
| `rijec`, `broj`, `slovo` | ne kažnjava se | ne kažnjava se | traže se |

Tako `zima.`, `Zima` i `zima` prolaze na pitanju o godišnjem dobu, a
`proljece` i dalje ne prolazi — dijakritici su uvijek dio odgovora.

**3. Gumb sa znakom nosi i ime znaka.**

```
✗ [ . ]  [ ? ]  [ ! ]
✓ [ . točka ]  [ ? upitnik ]  [ ! uskličnik ]
✓ [ < manje ]  [ > veće ]  [ = jednako ]
```

Točka na gumbu je nekoliko piksela zaslona, a čitač zaslona je uopće ne
pročita.

**4. Pitanje je cijela rečenica, ne natuknica.** Prepisano 541 obrazaca
kroz sva četiri razreda:

```
✗ Prostorija?                  ✓ Koja je prostorija na slici?
✗ Plinovito stanje=            ✓ Kako se zove voda u plinovitom stanju?
✗ Sustav za "srce":            ✓ Kojem sustavu organa pripada "srce"?
✗ "skijanje" → doba?           ✓ U koje godišnje doba radimo ovo: "skijanje"?
✗ Nakon ljeta dolazi...        ✓ Koje godišnje doba dolazi nakon ljeta?
✗ Slovo nakon "A"?             ✓ Koje slovo u abecedi dolazi nakon slova "A"?
✗ Bicikl:?                     ✓ Što obavezno nosimo na biciklu?
```

**5. Ponude koje se razlikuju jedva vidljivo.** Zadatak „Koja rečenica je
ispravno napisana?" nudio je četiri gotovo iste rečenice — razlika je bila
samo u veličini prvoga slova i točki na kraju. To je bilo traženje razlike,
ne provjera znanja. Sada se provjerava jedno po jedno pravilo, s dvije
ponude i uputom što pogledati.

**6. Pitanja s više točnih odgovora.**

```
✗ Slovo nedostaje: "_uka"?   → "r"   (ali muka, luka, buka su jednako dobre)
✓ Koje slovo nedostaje u riječi "_uća"? [slika kuće]

✗ Kako se pravilno piše "rijeka"?     (rijeka je voda, Rijeka je grad)
✓ Kako se pravilno piše ime koje označava veliku luku u Kvarneru?
```

**7. Sadržajne pogreške.** U rimama je stajalo `yoga` — slovo *y* nije u
hrvatskoj abecedi, a isti generator dijete upravo to uči. Uz to `puća`
(nije riječ) i `plata` (hrvatski je *plaća*). Zamijenjeni s `duga`, `vruća`
i `vrata`. Popravljeno i `Koji organ dišu?` → `Kojim organom dišemo?`

### Šest novih provjera u `npm test`

Da se ovo ne vrati:

| Provjera | Hvata |
|---|---|
| Pitanje nije cijela rečenica | natuknice, strelice, nedovršene rečenice |
| Upis bez opisa oblika odgovora | **upravo prijavljenu grešku** |
| Upis traži znak bez nabrajanja mogućih | „napiši znak" bez popisa znakova |
| Gol znak kao ponuđeni odgovor | gumb koji je samo `.` |
| Ponude razlikuju se samo točkom | četiri gotovo iste rečenice |
| Upitnik umjesto crte za prazno mjesto | `1, ?, 3, 4` |

I trinaest novih tvrdnji u `npm run test:tijek` koje provjeravaju samo
ocjenjivanje: `Pada kiša` pada na pravopisnom zadatku, `zima.` prolazi na
sadržajnom, `proljece` ne prolazi nigdje.

Ukupno: **22 provjere nad 6266 pitanja** i **47 tvrdnji o tijeku kviza**.

---

## Što dalje

Redoslijed po omjeru koristi i truda:

1. **Pokrenuti `tools/hrlex-izvuci.js` lokalno** i proširiti rječnik s 120 na
   nekoliko stotina imenica. Skripta je gotova; ovdje je samo preuzimanje bilo
   blokirano.

2. **Roditeljski pregled.** Podaci već postoje — `GET /api/progress/vjestine`
   vraća stanje po vještinama. Nedostaje zaslon: što dijete zna, gdje zapinje,
   koliko je vježbalo.

3. **Još tipova pitanja.** Spajanje je uvedeno; sljedeće bi bilo slaganje
   redoslijeda (dani, mjeseci, brojevi po veličini, slijed radnji u priči).

4. **Kalibrirati FSRS pragove na stvarnim podacima.** Sadašnji pragovi brzine
   (3 s + 2 s po razini težine) su razumna početna procjena, ne mjerenje.
   Kad se skupi dovoljno rundi, vrijedi ih provjeriti.

## 2026-09-22 — druga analiza: ponavljanje istog obrasca pitanja

Otkriven je sistemski problem koji prethodni audit nije dovoljno pokrio: baza je sadržavala mnogo pitanja koja su tehnički različita, ali pedagoški ista jer se mijenja samo broj, riječ ili slika. Primjer iz 2. razreda imao je 70 čestica s identičnim pitanjem "Koja riječ imenuje biće, predmet ili pojavu?".

Promjene:
- uveden `services/questionFamily.js` koji prepoznaje obitelj/predložak pitanja neovisno o umetnutim brojevima, riječima u navodnicima i slikovnim znakovima;
- selektor kviza sada prvo bira različite obitelji pitanja, a istu obitelj dopušta tek kao krajnji fallback;
- obitelji viđene u nedavnim kvizovima dobivaju niži prioritet;
- ista obitelj ne dolazi uzastopno ako ju je moguće razdvojiti drugim tipom zadatka;
- generator Imenica za 2. razred potpuno je prerađen u više načina rada: prepoznavanje, razvrstavanje, rad u rečenici, kontekst, skupovi riječi, dovršavanje i povezivanje;
- prošireni su generatori s premalo različitih obrazaca: R1 Riječi, R3 Vrste riječi, R3 Gramatika i pravopis, R3 Gospodarske djelatnosti, R4 Vrste riječi, R4 Pravopis, R4 Površina, R4 Uvjeti života te R4 Biljke i životinje;
- ispravljena je greška u R2 Brojevi do 100: "Koji dan u tjednu dolazi nakon dana 9?" sada je ispravno "Koji broj dolazi nakon broja 9?";
- ispravljen je copy/paste tekst u R4 Uvjeti života: opis Sunca/Vode/Zraka/Tla više se ne pita kao "Koja je skupina životinja...?".

Nova automatska provjera: `backend/test/provjeri-raznolikost.js`.
Rezultat: 59 generatora; svaki standardni kviz od 7 pitanja može koristiti 7 različitih obrazaca pitanja.

## 2026-09-22 — sadržajni audit i treća revizija pitanja

- Uklonjene su nepouzdane vizualne jednadžbe tipa „Koliko je ukupno?” kod kojih je broj nacrtanih simbola mogao odstupati od spremljenog odgovora.
- U 2. razredu uklonjeni su zadaci o osmerokutu/peterokutu/šesterokutu i simetriji slova iz fonda geometrije; zamijenjeni su zadacima o trokutu, kvadratu, pravokutniku, dužini te kocki/kvadru/piramidi.
- Novčani zadaci sada kod plaćanja izričito navode stvarnu kovanicu ili novčanicu (npr. „plati novčanicom od 10 €”), umjesto neodređenog ukupnog iznosa poput „plati 7 €”.
- Binarna pitanja „zdrava/nezdrava hrana” zamijenjena su zadacima o raznolikoj prehrani, vodi, higijeni, odmoru i sigurnosti.
- Uklonjene ili preoblikovane su dvosmislene tvrdnje o staništu i prehrani životinja.
- Ispravljeni su neprirodni i gramatički pogrešni predlošci u geometriji, površini, vodi/tlu i tekstualnim zadacima.
- Veliki brojevi u 4. razredu više se ne stavljaju u nevjerodostojne kontekste (deseci tisuća djece, bombona, olovaka i sl.).
- Dodan je review sloj `backend/services/pedagogyReview.js` koji filtrira poznate loše obrasce i pretvara višak kloniranih predložaka u različite oblike zadataka.
- Završni sadržajni audit generiranog fonda: 3.889 pitanja, 3.889 označeno DOBRO, 0 za preformuliranje i 0 za uklanjanje prema pravilima audita.
- Test raznolikosti: svih 59 generatora može složiti standardni kviz od 7 pitanja sa 7 različitih obitelji pitanja.

---

## Otvoreni kod i korisničko iskustvo (24. 9. 2026.)

Puna analiza je u `ANALIZA-OPEN-SOURCE.md`. Ovdje samo što je ugrađeno.

### Regresije koje su provjere uhvatile

Novi `services/pedagogyReview.js` unio je tri greške koje je testni paket
odmah prijavio:

```
✗ 5 skupine po 3 predmeta        →  ✓ 5 skupina po 3 predmeta
✗ 18871 paketa                   →  ✓ 18871 paket
✗ Broj 8 možemo rastaviti na:    →  ✓ Na koja dva broja možemo rastaviti broj 8?
✗ ponuda ["<", ">"] bez imena    →  ✓ ["< manje", "> veće"]
```

U rječnik su dodane imenice `predmet` i `komad`, koje su zadatci rabili, a
rječnik ih nije imao.

### seeds/slogovi.js — broj slogova se računa

Brojevi slogova stajali su u ručnim tablicama, pa je zadatak postojao samo
za unaprijed upisane riječi. Sada ih računa pravilo (samoglasnici +
slogotvorno *r*), bez ijedne ovisnosti.

Knjižnice za prijelom riječi (`hyphen`, `hyphenopoly`) imaju hrvatske
uzorke i isprobane su — ali daju mjesta za prijelom retka, ne slogove:
`oko` → `oko`, `auto` → `auto`, `ulica` → `uli-ca`. Za brojanje su krive.

Usput su nađene **dvije greške u postojećim tablicama**: `auto` je pisalo
2 sloga (a-u-to je 3), `automobil` 4 (a-u-to-mo-bil je 5). Hrvatski nema
dvoglasa.

### Čitanje pitanja naglas

`frontend/src/composables/useGovor.js` — dijete u 1. razredu često još ne
čita tečno, pa zadatak iz matematike mjeri brzinu čitanja umjesto
matematike. Gumb 🔊 čita pitanje i ponuđene odgovore.

Cijena: **nula bajtova**, ugrađeno u preglednik. Android i ChromeOS imaju
hrvatski glas koji radi i bez mreže. Gdje hrvatskoga glasa nema, gumb se
ne prikazuje — radije ništa nego engleski glas.

Izgovor je pripremljen: `3 + 4 = ?` čita se „tri plus četiri jednako".

### services/tezina.js — mjerena težina pitanja (Elo)

FSRS zna KADA ponoviti, ali ne i KOLIKO je pitanje teško. Kod generiranih
pitanja iz istoga predloška izlaze zadatci vrlo različite težine, a
`difficulty` koji im generator upiše je pretpostavka, ne mjerenje.

Ocjena djeteta i ocjena pitanja pomiču se nakon svakog odgovora, kao kod
šahista. Brzina ulazi u ocjenu: točan odgovor vrijedi 0,6–1,0 ovisno o
oklijevanju, netočan 0,0–0,2.

Postupak: Klinkenberg, Straatemeier & van der Maas (2011), *Computers &
Education* 57(2) — motor iza nizozemskoga Math Gardena.

Nove kolekcije: `item_ratings` (po pitanju), `user_ratings` (po djetetu i
predmetu). Ne ruši predaju kviza ako zapne.

### Konfeti na kraju runde

`canvas-confetti` (ISC, bez ovisnosti, ~7 KB gzip). Jače kad je sve točno.
Poštuje `prefers-reduced-motion`.

Uklonjena je i rodna kosa crta iz poruke o rezultatu: „Riješio/la si sve
zadatke točno" → „Svi su zadatci točni".

### Frontend se prvi put uspješno buildao

`frontend/package-lock.json` imao je dva unosa (`pinia`, `vue-demi`) koji
su pokazivali na interni registar `packages.applied-caas-gateway1.internal.api.openai.org`
i putanju `/artifactory/api/npm/npm-public/`. S takvim lockfileom `npm ci`
ne prolazi nigdje izvan toga okruženja. Preusmjereni su na
`registry.npmjs.org`, nakon čega build prolazi:

```
dist/assets/index-*.css   26,73 kB │ gzip:  5,47 kB
dist/assets/index-*.js   142,41 kB │ gzip: 53,38 kB
```

### Provjereno

```
npm test               → 24/24 ✓   (stabilno kroz 8 pokretanja)
npm run test:tijek     → 61/61 ✓   (13 novih tvrdnji o Elo ocjeni)
npm run test:pedagogija → ✓
provjeri-raznolikost   → ✓
npm run build (frontend) → ✓
```
