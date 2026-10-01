# Kako napraviti najbolji kviz za 1.–4. razred — istraživanje i plan

Datum: 28. 9. 2026.

Ovaj dokument nastavlja `ANALIZA-KURIKULUM-PEDAGOGIJA.md` i
`ANALIZA-OPEN-SOURCE.md`. Tamo je popravljeno ono što je bilo **krivo**
(položaj točnog odgovora, gramatika, kurikularno preuranjena pitanja).
Ovdje je pitanje drugačije: **što nedostaje** da Učilica bude najbolji kviz
za hrvatske učenike razredne nastave, i **odakle** uzeti kvalitetna pitanja.

> Napomena o izvorima: iz ovog okruženja mrežni proxy ne pušta izravan
> pristup `ncvvo.hr`, `skole.hr`, `ucitelji.hr`, `matematika.hr` ni
> `edutorij.carnet.hr`. Podatci su prikupljeni pretraživanjem, a ne čitanjem
> samih PDF-ova. Brojke s NCVVO-a treba prije uporabe provjeriti u izvornom
> vodiču (poveznice su na kraju).

---

## 1. Stanje koda danas (izmjereno)

Svi testovi prolaze nakon `npm ci` u `backend/`
(`provjeri-pitanja`, `provjeri-pedagogiju`, `provjeri-raznolikost`,
`provjeri-tijek`). Bez instaliranih ovisnosti `provjeri-pitanja` javlja
„PALO" samo zato što `seed-r2/3/4.js` ne mogu učitati `dotenv` — nije greška
u pitanjima.

**Fond: 3 869 pitanja** — 2 277 izbor, 1 533 upis, 59 spajanje.

| Razred | Hrvatski | Matematika | Priroda i društvo |
|---|---:|---:|---:|
| 1. | 433 | 432 | 679 |
| 2. | 322 | 693 | 228 |
| 3. | **135** | 382 | **91** |
| 4. | **113** | 234 | **127** |

Fond je obrnuto razmjeran težini gradiva: 1. razred ima najviše pitanja, a
3. i 4. razred iz Hrvatskoga i PID-a najmanje — upravo gdje je NCVVO izmjerio
najslabije rezultate (vidi 2.2).

Najmanje teme (broj pitanja / broj različitih obitelji pitanja):

| Tema | Pitanja | Obitelji |
|---|---:|---:|
| R4 Hrvatski — Medijska kultura | 8 | 8 |
| R3 PID — Kulturna baština | 10 | 7 |
| R3 PID — Tlo, voda, zrak | 11 | 9 |
| R4 Mat — Kvadar i kocka | 11 | 8 |
| R3 PID — Zavičaj i karta | 12 | 9 |
| R4 Mat — Kutovi i likovi | 12 | 10 |
| R4 PID — Prirodni uvjeti života | 13 | 7 |
| R4 Hrvatski — Književnost | 25 | 8 |

Uz kviz od 7 pitanja i filtar „neviđeno u zadnjih 10 kvizova", teme s 8–13
pitanja iscrpe se nakon **dva** kviza.

### Što kod već radi dobro (i to je potvrđeno istraživanjima)

| U kodu | Istraživanje |
|---|---|
| FSRS ponavljanje po vještini (`vjestine.js`) | učinak razmaknutog dohvaćanja; Agarwal i sur. 2021 — pregled 50 studija u školama, korist u svim dobnim skupinama uključujući osnovnu školu |
| Elo težina pitanja (`tezina.js`) | Math Garden (Klinkenberg i sur. 2011): 3 648 djece, 3,5 M zadataka; ciljna vjerojatnost uspjeha ≈ 0,75 |
| Serverska evaluacija, miješanje po sesiji | standard u testiranju |
| Čitanje naglas (`useGovor.js`) | uklanja utjecaj tečnosti čitanja na matematiku u 1.–2. razredu |
| Obitelji pitanja (`questionFamily.js`) | raznolikost kognitivnih radnji, ne samo zamjena riječi |

---

## 2. Vanjsko vrednovanje u Hrvatskoj — ono prema čemu treba ciljati

### 2.1. Nacionalni ispiti u 4. razredu (NCVVO)

Od 2023./2024. ispite pišu **svi** učenici 4. razreda iz tri predmeta — upravo
tri predmeta koja Učilica pokriva. NCVVO svake godine objavljuje *Vodič kroz
sadržaj i strukturu nacionalnih ispita u četvrtome razredu* s primjerima
zadataka.

| Predmet | Struktura (prema vodiču, provjeriti) |
|---|---|
| Hrvatski jezik | 3 područja: **čitanje** (književni i informativni tekst), hrvatski jezik, pisanje; 35 zadataka, 52 boda, 2 × 75 min |
| Matematika | 30 zadataka, 60 min; **5 područja**: brojevi · algebra i funkcije · oblik i prostor · mjerenje · **podatci, statistika i vjerojatnost**; ~60 % zatvorenih zadataka (4 ponude), ~40 % otvorenih (kratki odgovor, crtanje, provjera jednakosti) |
| Priroda i društvo | 4 koncepta kurikula: organiziranost svijeta oko nas · promjene i odnosi · pojedinac i društvo · energija; + istraživački pristup |

### 2.2. Rezultati — gdje su djeca najslabija

- 2025.: prosječna riješenost **Hrvatskog jezika 48,7 %** (najniža od tri).
- 2024.: Matematika 62,1 %, PID 61,8 %.
- 2025.: sva tri ispita slabija nego 2024.; **PID pao za 16,2 postotna boda**.
- Međunarodno: Hrvatska je u **PIRLS 2021** (čitanje, 4. r.) 7. od 57 zemalja
  (557 bodova), u **TIMSS 2019** 509 (matematika) i 524 (prirodoslovlje).

Zaključak: najveći prostor za pomoć je **čitanje s razumijevanjem** i **PID u
3.–4. razredu** — baš dijelovi koji u Učilici imaju najmanji fond.

### 2.3. Što iz ovoga slijedi za Učilicu

1. **Matematika nema domenu E (Podatci, statistika i vjerojatnost)** ni u
   jednom razredu. `gikEngine.js` nema ni jedan ishod `MAT OŠ E.x.x`. Na
   nacionalnom ispitu to je jedno od pet područja. Domena B (algebra —
   nepoznati broj, jednakosti, nizovi) postoji samo u 1. razredu.
2. **Hrvatski nema čitanje s razumijevanjem za 3. i 4. razred** — a čitanje je
   pola nacionalnog ispita. `citanje-2` postoji samo u 2. razredu.
3. **Tipovi zadataka.** NCVVO koristi i tipove kojih u Učilici nema:
   točno/netočno (alternativni izbor), redoslijed (poredaj), dopunjavanje
   tablice, rad na slici/karti. Djeca koja su ih vidjela u vježbi ne gube
   vrijeme na razumijevanje forme na ispitu.

---

## 3. Banke pitanja — što se smije i isplati koristiti

Ključno razlikovati **inspiraciju** (oblik zadatka, tipične pogreške) od
**preuzimanja teksta** (autorsko pravo).

| Izvor | Razred | Što daje | Licenca / uporaba | Preporuka |
|---|---|---|---|---|
| **NCVVO — vodiči i primjeri NI 4. r.** | 4. | službeni oblik i razina zadataka, bodovne sheme | autorsko djelo; nije otvorena licenca | **predlošci**: vlastiti zadatci istog oblika; tražiti pisano dopuštenje za doslovno preuzimanje |
| **TIMSS objavljeni zadatci (2003–2011)** | 4. | stotine kalibriranih zadataka iz matematike i prirodoslovlja s postotkom riješenosti po zemljama, uključujući Hrvatsku od 2011. | © IEA; od 2015. traži se zahtjev za dopuštenje | **najbolji izvor distraktora** — riješenost po odgovoru pokazuje stvarne pogreške djece; zadatke prepisati vlastitim riječima |
| **NCVVO — Priručnik za unapređivanje nastave matematike (TIMSS)** | 4. | analiza zadataka na kojima su hrvatski učenici bili slabi | NCVVO | izravno upućuje gdje trebaju ciljana pitanja |
| **PIRLS** | 4. | okvir čitanja: 4 procesa razumijevanja (pronalaženje podatka, zaključivanje, tumačenje, procjena) | © IEA | koristiti **okvir** za čitanje s razumijevanjem, tekstove pisati sami |
| **Dabar (Bebras)** — ucitelji.hr | MikroDabar 1.–2., MiliDabar 3.–4. | računalno i logičko razmišljanje, zbirke po godinama 2016.– | **CC BY-SA 4.0** | **smije se prilagoditi** uz navođenje izvora i istu licencu za izvedene zadatke (drži ih u zasebnoj datoteci kao hrLex) |
| **Klokan bez granica** — HMD | Pčelica 2., Leptirić 3., Ecolier 4. | problemski zadatci na tri razine (3/4/5 bodova) | © HMD / Kangourou sans Frontières; zbirke se prodaju | samo inspiracija; tražiti dopuštenje HMD-a |
| **Eedi / NeurIPS 2020 Diagnostic Questions** | ~4.+ | pitanja čiji distraktori **nose poznatu zabludu** | istraživački skup, provjeriti uvjete | **metoda** za distraktore, ne sadržaj |
| **Edutorij / e-Škole DOS** | DOS su 5.–4. SŠ; za 1.–4. uglavnom izdavački materijali | — | izdavački sadržaji zatvoreni | ne kao izvor pitanja |
| **Wordwall, Kahoot zajednica** | 1.–4. | tisuće kvizova učitelja | nejasna prava, neujednačena kvaliteta | ne preuzimati; eventualno za popis tema koje učitelji vježbaju |
| **Izdavački radni listići** (Alfa, Profil Klett, ŠK, Artrea, A. Horvatek) | 1.–4. | usklađeni s udžbenicima | zatvoreno | ne preuzimati |

### Zašto su TIMSS-ovi zadatci posebno vrijedni

Uz svaki objavljeni zadatak IEA objavljuje **postotak učenika po zemlji koji
je odabrao svaki odgovor**. To je izmjerena pogreška stvarne djece, ne
pretpostavka autora. Primjer primjene u generatoru:

```js
// distraktor nije nasumičan broj, nego tipična pogreška
// 52 − 27: dijete oduzme manju znamenku od veće u svakom stupcu → 35
const zabluda = zamijeniZnamenkeKodPosudbe(52, 27);   // 35
```

Takvi distraktori već djelomično postoje u `gen-engine.js`; TIMSS ih daje
sustavno i za prirodoslovlje.

---

## 4. Što kažu istraživanja — i koliko se Učilica s time slaže

| Nalaz | Veličina učinka | Učilica danas | Što promijeniti |
|---|---|---|---|
| **Objašnjenje uz povratnu informaciju** (Van der Kleij i sur. 2015, meta-analiza 40 studija) | objašnjenje d = 0,49 · točan odgovor 0,32 · samo „točno/netočno" 0,05 | prikazuje samo „Točan odgovor: X" | dodati polje `objasnjenje` — kratko, jedna rečenica, **zašto** (vidi 5.1) |
| **Miješano vježbanje** (Rohrer i sur. 2020, RCT, 787 učenika) | 61 % vs 38 %, d = 0,83 nakon mjesec dana | kviz je uvijek jedna tema; FSRS bira vještine samo unutar te teme | dodati **„Miješano ponavljanje"** preko svih tema razreda (vidi 5.2) |
| **Dohvaćanje uz povratnu informaciju** (Agarwal i sur. 2021) | većina učinaka srednja do velika | ✔ FSRS | — |
| **Tri ponude su dovoljne** (Rodriguez 2005, 80 godina istraživanja) | bez gubitka pouzdanosti | uvijek 4 | za 1. razred razmotriti 3 ponude: manje čitanja, a slab četvrti distraktor ionako ne mjeri ništa |
| **Igrifikacija** (Sailer i Homner 2020) | bodovi i značke sami — slab učinak; izazov, cilj, priča — jači | zvjezdice, konfeti | ne dodavati ljestvice među djecom; dodati **osobne ciljeve** („svladao si 3 od 5 vještina") |
| **Adaptivnost na 75 % uspjeha** (Math Garden) | održava motivaciju i preciznost | kvote lako/srednje/teško + Elo | ciljati pitanja čija Elo težina daje P(točno) ≈ 0,75 umjesto fiksnih kvota |

---

## 5. Preporuke po prioritetu

### 5.1. Objašnjenje uz netočan odgovor — najveći dobitak po uloženom radu

Pitanje dobiva neobavezno polje `objasnjenje`. Backend ga šalje tek u
odgovoru na `POST /api/quiz/check` (nikad unaprijed), a `QuizView.vue` ga
prikazuje ispod „Točan odgovor". Govor ga čita naglas.

Generatori ga mogu sastaviti iz istih parametara iz kojih sastave pitanje:

```
Pitanje:  Koliko je 7 + 8?
Objašnjenje:  7 + 3 = 10, pa još 5 → 15.

Pitanje:  Koja riječ je glagol? (trči / stol / crven / brzo)
Objašnjenje:  „Trči" kaže što netko radi — to je glagol.
```

Test u `provjeri-pitanja.js`: objašnjenje ne smije biti dulje od 140 znakova
niti sadržavati točan odgovor iz drugog pitanja.

### 5.2. Miješano ponavljanje

Nova ruta `GET /api/quiz/ponavljanje?grade=N` koja uzme vještine dospjele za
ponavljanje (`vjestine.dospjele`) **iz svih tema razreda**, po jedno do dva
pitanja iz svake, izmiješano. To je izravna primjena Rohrerova nalaza, a
infrastruktura (FSRS, obitelji pitanja) već postoji.

### 5.3. Popuniti rupe prema nacionalnom ispitu

| Nova tema | Razred | Ishod | Oblik zadataka |
|---|---|---|---|
| **Podatci i grafovi** | 2.–4. | MAT OŠ E.x.1 | očitaj stupčasti dijagram / tablicu; koji je stupac najviši; koliko više |
| **Nepoznati broj i jednakosti** | 2.–4. | MAT OŠ B.x.1 | `□ + 7 = 15`; točno/netočno za jednakost |
| **Čitanje s razumijevanjem** | 3.–4. | OŠ HJ A.3.2 / A.4.2 | kratki tekst (5–8 rečenica) + 3–4 pitanja po PIRLS procesima |
| **Vjerojatnost (siguran / moguć / nemoguć)** | 3.–4. | MAT OŠ E.x.2 | „Iz vrećice s crvenim kuglicama izvučeš plavu — je li to…" |

Za čitanje s razumijevanjem potrebna je jedna promjena modela: **zajednički
tekst za više pitanja** (`tekstId`), da ga dijete ne čita iznova za svako
pitanje.

### 5.4. Novi tipovi zadataka

| Tip | Zašto | Napor |
|---|---|---|
| `tocno-netocno` | najčešći oblik u PID-u na NI; najkraće čitanje za 1. razred | mali — poseban `choice` s dvije ponude i vlastitim prikazom |
| `poredaj` | redoslijed događaja u priči, faze razvoja biljke, brojevi po veličini | srednji — klik-pa-klik kao kod `match` |
| `slika-odabir` | odaberi područje na karti Hrvatske / dio tijela | veći — treba SVG s označenim područjima |

### 5.5. Proširiti male teme — ručno, ne generatorom

Teme iz tablice u odjeljku 1 ne treba napuhavati parafrazama. Cilj: **najmanje
30 pitanja u 10 obitelji** po temi, podijeljeno na prepoznavanje · primjenu ·
kratko zaključivanje. Za PID 3.–4. prirodni su izvori udžbenički sadržaj
kurikula i oblik zadataka iz vodiča NCVVO-a (npr. „Promotri kartu. Koji je
grad sjeverno od…").

### 5.6. Distraktori iz stvarnih pogrešaka

Učilica već bilježi svaki odgovor (`progress.answers`). Kad se skupi dovoljno
podataka, izračunati po pitanju **koji je netočni odgovor najčešći**, i:

- distraktor koji nitko ne bira (< 5 %) zamijeniti;
- najčešću pogrešku prenijeti u generator kao pravilo (vidi primjer u 3.);
- prikazati učitelju/roditelju „najčešća zabluda u ovoj vještini".

To je isti postupak koji NCVVO u priručniku za zadatke višestrukog izbora
naziva analizom kvalitete zadatka nakon provedbe.

---

## 6. Redoslijed rada

| # | Što | Zašto prvo |
|---|---|---|
| 1 | Polje `objasnjenje` + prikaz + govor | najveći izmjereni učinak, mali zahvat |
| 2 | Miješano ponavljanje po razredu | d = 0,83, infrastruktura već postoji |
| 3 | Matematika: podatci i grafovi, nepoznati broj | cijelo područje NI-ja nedostaje |
| 4 | Čitanje s razumijevanjem 3.–4. | najslabiji rezultat na NI (48,7 %) |
| 5 | Ručno proširenje PID 3.–4. i HJ 4. | PID na NI pao 16 p. b. |
| 6 | `tocno-netocno`, `poredaj` | forma zadataka s nacionalnog ispita |
| 7 | Analiza distraktora iz `progress` | treba prvo skupiti podatke |
| 8 | Prilagođeni Dabar zadatci (CC BY-SA) | nova vrijednost, zasebna licenca |

---

## 7. Izvori

**Hrvatska — vanjsko vrednovanje**
- NCVVO, Vodič kroz sadržaj i strukturu NI u 4. razredu: https://www.ncvvo.hr/wp-content/uploads/2023/10/Vodic-kroz-sadrzaj-i-strukturu-NI-4-razred.pdf
- NCVVO, Vodič za 2024./2025.: https://www.ncvvo.hr/vodic-kroz-sadrzaj-i-strukturu-nacionalnih-ispita-u-cetvrtome-i-osmome-razredu-u-skolskoj-godini-2024-2025/
- Portal za škole, Vodič za 2025./2026.: https://www.skole.hr/vodic-kroz-sadrzaj-i-strukturu-nacionalnih-ispita-u-cetvrtome-i-osmome-razredu-u-skolskoj-godini-2025-2026/
- Srednja.hr, rezultati NI 2025.: https://www.srednja.hr/novosti/stigli-rezultati-nacionalnih-ispita-u-2025-rezultati-cetvrtasa-se-srozali-evo-kakvo-je-stanje-kod-osmasa/
- Srednja.hr, struktura NI iz Matematike: https://www.srednja.hr/novosti/kako-ce-izgledati-nacionalni-ispit-iz-matematike-ispituje-se-pet-podrucja/
- NCVVO, TIMSS: https://www.ncvvo.hr/medunarodna-istrazivanja/timss/
- NCVVO, Priručnik za unapređivanje nastave matematike (TIMSS): https://www.ncvvo.hr/wp-content/uploads/2018/06/Prirucnik-TIMSS-matematika-FINALE-web.pdf
- NCVVO, PIRLS: https://www.ncvvo.hr/medunarodna-istrazivanja/pirls/
- NCVVO, PIRLS 2021 okvir istraživanja: https://www.ncvvo.hr/wp-content/uploads/2023/05/P21-Okvir-istrazivanja-finale.pdf

**Banke zadataka**
- NCES, TIMSS released questions: https://nces.ed.gov/timss/released-questions.asp
- TIMSS 2011, 4. razred, matematika: https://nces.ed.gov/timss/pdf/TIMSS2011_G4_Math.pdf
- TIMSS 2003, 4. razred, matematika: https://timssandpirls.bc.edu/PDF/T03_RELEASED_M4.pdf
- Dabar, Udruga Suradnici u učenju: https://ucitelji.hr/dabar/
- Dabar 2020, zbirka zadataka: https://ucitelji.hr/wp-content/uploads/2020/11/Dabar-2020-zbirka-zadataka.pdf
- Bebras zadatci za Moodle (licenca): https://github.com/bwinf/moodle-qtype_bebras
- Klokan bez granica, HMD: https://matematika.hr/klokan
- Eedi, Diagnostic Questions (NeurIPS 2020): https://arxiv.org/pdf/2007.12061
- e-Škole DOS (opseg: 5. r. OŠ – 4. r. SŠ): https://www.e-skole.hr/digitalni-obrazovni-sadrzaji/

**Istraživanja**
- Van der Kleij, Feskens, Eggen (2015), povratna informacija u računalnom okruženju, *Review of Educational Research*: https://journals.sagepub.com/doi/abs/10.3102/0034654314564881
- Rohrer i sur. (2020), RCT miješanog vježbanja matematike: https://gwern.net/doc/psychology/spaced-repetition/2019-rohrer.pdf
- Agarwal, Nunes, Blunt (2021), dohvaćanje u školama: https://link.springer.com/article/10.1007/s10648-021-09595-9
- Klinkenberg i sur. (2011), Math Garden: https://www.sciencedirect.com/science/article/abs/pii/S0360131511000418
- Rodriguez (2005), tri ponude su optimalne: https://onlinelibrary.wiley.com/doi/10.1111/j.1745-3992.2005.00006.x
- Sailer i Homner (2020) i kasnija meta-analiza igrifikacije: https://link.springer.com/article/10.1007/s11423-023-10337-7

---

## 8. Kako povećati bazu kvalitetnim pitanjima (1. 10. 2026.)

Problem nije broj pitanja nego **broj različitih zadataka koje dijete još nije
vidjelo**. Tema s 12 zadataka iscrpi se nakon dva kviza, a 100 parafraza istog
zadatka ne pomaže jer ih `questionFamily` s pravom tretira kao isti zadatak.

### 8.1. Četiri izvora i za što je koji dobar

| Izvor | Prikladno za | Kvaliteta | Trošak | Stanje u Učilici |
|---|---|---|---|---|
| **Model zadatka + parametri** (automatsko generiranje zadataka, AIG) | matematika, podatci, mjerenje, pravopisna pravila | jednaka ručnoj ako je model dobar | nizak; beskonačno varijanti | `gen-podatci.js`, `gen-nepoznati.js`, većina matematike |
| **Ručno pisani zadatci učitelja** | PID, književnost, čitanje, medijska kultura | najviša | visok | `citanje-tekstovi.js`, dio PID-a |
| **LLM nacrt + ljudska recenzija** | proširenje činjeničnih tema PID-a i HJ-a | nacrt nepouzdan, nakon recenzije dobar | srednji | nije uvedeno |
| **Otvorene zbirke** (Dabar, CC BY-SA) | logika, računalno razmišljanje | visoka, već kalibrirana | nizak | nije uvedeno |

### 8.2. Model zadatka (AIG) — što je napravljeno i zašto radi

Gierl i Lai opisuju AIG u tri dijela: **kognitivni model** (što učenik mora
znati i koje pogreške radi), **model zadatka** (predložak s varijablama) i
**provjera**. U studijama iz medicinske edukacije tako nastali zadatci imali
su psihometrijska svojstva usporediva s ručno pisanima, a sudionici su nakon
obuke izradili gotovo 9 500 zadataka.

Kako to izgleda u `gen-nepoznati.js`:

| Dio AIG-a | U kodu |
|---|---|
| Kognitivni model | B.3.1: nepoznati član se računa iz veze među operacijama; tipična pogreška je kriva operacija (zbroji umjesto oduzme) |
| Model zadatka | 11 obitelji (`drugiPribrojnik`, `umanjitelj`, `djelitelj`, `zamjena`, `provjera`…) + priče |
| Varijable | brojevi u rasponu razreda; slovo (`b, c, x, y`); imenica iz `hr-gramatika` |
| Ometači | iz kognitivnog modela: `zb + p` (kriva operacija), `±1`, `±10` |
| Provjera | `provjeri-pitanja`, `provjeri-raznolikost`, 2 000 poziva bez greške, simulacija |

Za podatke (E.3.1, E.4.1) dodatna je dimenzija **prikaz**: isti skup podataka
kao grafikon, tablica, crtice ili popis odgovora. To nisu parafraze nego
različite vještine čitanja podataka, što kurikul i traži.

**Rezultat:** iscrpljivanje u simulaciji palo je s 3,1 % na 0,8 % (elo), a na
četiri ciljane teme na nulu.

### 8.3. Gdje model zadatka ne pomaže

PID i književnost nose **činjenice i tekstove**. „Koja je rijeka u Panonskoj
Hrvatskoj?" nema brojeva koje se može mijenjati. Preostalo iscrpljivanje u
simulaciji upravo je tamo: `uvjeti-zivota`, `tlo-voda-zrak`, `citanje-3/4`.

Za te teme postoje dvije poluge:

1. **Više obitelji nad istim činjenicama.** Jedna činjenica („biljke trebaju
   svjetlost") daje prepoznavanje, točno/netočno, uzrok → posljedica, pokus
   (kao tekst o grahu u `genCitanje4`), razvrstavanje i poredak. Šest zadataka
   različitih obitelji umjesto jednog.
2. **Ručno pisanje uz LLM kao pomoćnika** — vidi 8.4.

### 8.4. LLM nacrt — samo uz recenziju

Što kažu istraživanja (2024.–2025.):

- Sustavni pregled za medicinsku edukaciju: GPT-4 je bio usporediv s ljudima u
  jasnoći i ometačima, slabiji modeli lošiji.
- Ljudski recenzenti ocijenili su **51–65 % LLM zadataka dobrima**, dakle
  trećina do polovica treba ispravak ili odbacivanje.
- Najčešća mana (57 %): bar jedan **neuvjerljiv ometač**; zatim nedostatak
  konteksta (17 %).
- Opći modeli ne proizvode pouzdano ometače koji zadovoljavaju stručnjake.

Za hrvatski jezik i djecu od 7 do 10 godina rizik je veći: gramatika slaganja,
regionalne činjenice, primjerenost dobi.

**Predloženi tijek** (ništa ne ide djetetu bez recenzije):

```
LLM nacrt (ishod, razred, 3 razine: prepoznavanje / primjena / zaključivanje)
  → automatske provjere: npm test (gramatika, jasnoća, duplikati, ključ)
  → recenzija učitelja razredne nastave (reviewStatus: 'reviewed')
  → objava s needsReview: false
  → pilot: Elo težina + analiza ometača (tools/analyze-distractors.js)
  → ometač koji bira < 5 % djece zamijeniti; zadatak s obrnutom
    diskriminacijom (bolja djeca griješe) povući
```

Infrastruktura za zadnja dva koraka već postoji (`tezina.js`,
`analyze-distractors.js`, `reviewStatus` u `gikEngine`).

### 8.5. Ciljevi po temi

| Mjera | Cilj | Kako se mjeri |
|---|---|---|
| Zadataka po temi | ≥ 30 (statična), neograničeno (parametrizirana) | `export-all-questions.js` |
| Obitelji po temi | ≥ 10 | `provjeri-raznolikost.js` (sada u `test:sve`) |
| Sesije bez novih pitanja | < 1 % | `npm run sim:pilot` |
| Pokrivenost objašnjenjem | 100 % novih zadataka | `objasnjenja:praznine` |
| Ishod po zadatku | 100 % | `gik.outcome` / `ishod` |

### 8.6. Sljedeće teme za proširenje (prema simulaciji)

| Tema | Iscrpljenih sesija (elo / kvote) | Pristup |
|---|---:|---|
| ~~R3 PID — Tlo, voda, zrak~~ | 14 / 15 → 0 / 0 | ✔ napravljeno (`gen-pid-uvjeti.js`) |
| ~~R4 PID — Uvjeti života~~ | 11 / 18 → 0 / 0 | ✔ napravljeno (`gen-pid-uvjeti.js`) |
| R3/R4 — Čitanje s razumijevanjem | 4 / 9 → 3 / 3 | novi tekstovi (ručno ili LLM + recenzija učitelja) |
| ~~R4 Mat — Kutovi~~ | 1 / 7 → 0 / 0 | ✔ napravljeno (`gen-kutovi.js`) |
| ~~R3 PID — Zavičaj i karta, Kulturna baština~~ | 2 / 9 → 0 / 0 | ✔ napravljeno (`gen-zavicaj-bastina.js`) |
| R4 HJ — Medijska kultura (8 zadataka) | 2 / 0 | ručno: vrste medija, oglas, poruka, sigurnost na internetu |

### Izvori (odjeljak 8)
- Automatic item generation — pregled: https://en.wikipedia.org/wiki/Automatic_item_generation
- Gierl i Lai, *The Role of Item Models in Automatic Item Generation*: https://www.researchgate.net/publication/239794821_The_Role_of_Item_Models_in_Automatic_Item_Generation
- Kvaliteta i valjanost AIG zadataka: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10700404/
- AIG u testovima napretka: https://link.springer.com/article/10.1007/s10639-023-12014-x
- LLM i MCQ, sustavni pregled: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12758716/
- AI naspram ljudskih MCQ-ova: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11806894/
- Mane LLM pitanja (IWF): https://public.websites.umich.edu/~kevynct/pubs/L_S_2024_WorkInProgress_Question_Generation_CRFinal2.pdf
- Kurikul Matematike, NN 7/2019 (B.3.1, B.4.1, E.3.1, E.4.1, E.4.2): https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_7_146.html
- GIK razredna nastava, 4. razred: https://i-nastava.gov.hr/UserDocsImages//dokumenti/2021-2022/GIK-RazrednaNastava//GIK%20-%20Razredna%20nastava%20-%204.%20razred.pdf
- Statistika i vjerojatnost u razrednoj nastavi (UFZG): https://repozitorij.unizg.hr/object/ufzg:3919/FILE0/download
