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
