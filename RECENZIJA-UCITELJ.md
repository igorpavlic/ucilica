# Simulirana recenzija učitelja

Datum: 1. 10. 2026.

**Ovo nije recenzija stvarnog učitelja.** To je prvi prolaz koji radi ono što
bi učitelj razredne nastave radio s kontrolnim popisom u ruci, kako bi
stvarni recenzent dobio kraći popis i manje očitih grešaka. Sva pitanja i dalje
nose `reviewStatus: 'unreviewed'` u metapodatcima.

Alat: `npm run recenzija` (sažetak) i `npm run recenzija:detalji` (popis zadataka).

---

## 1. Kontrolni popis

| Kod | Što učitelj provjerava | Težina | Izvor |
|---|---|---|---|
| K1 | Je li točan odgovor **osjetno** najdulji (≥ 1,25 × i ≥ 4 znaka)? Na razini teme: udio > 20 % je trag. | napomena / tema ⚠ | Haladyna, Downing i Rodriguez (2002) |
| K2 | Imaju li samo ometači apsolutne izraze („samo”, „uvijek”, „nikad”)? | doradi | isto |
| K3 | Ponavlja li se riječ iz pitanja samo u točnom odgovoru? | napomena | isto |
| K4 | Odskače li točan odgovor oblikom (točka, veliko slovo)? | doradi | NCVVO, smjernice za ometače |
| K5 | Je li negacija u pitanju istaknuta (NE, NIJE)? | napomena | Haladyna i sur. |
| K6 | Postoji li ponuda „sve navedeno / ništa od navedenog”? | doradi | isto |
| K7 | Je li pitanje označeno kao zaključak/tumačenje, a odgovor je doslovno u tekstu? | doradi | PIRLS, procesi razumijevanja |
| K8 | Ima li objašnjenje? | napomena | Van der Kleij i sur. (2015) |
| K9 | Jesu li dvije ponude jednake? | odbij | — |
| T | Duljina teksta i rečenice primjerena razredu (2. r. ≤ 110 riječi, 3. ≤ 160, 4. ≤ 200; rečenica ≤ 14 / 16 / 18 riječi) | napomena | PIRLS (500–800 riječi za ispit; za vježbu u aplikaciji znatno kraće) |

Zadatci kojima je oblik upravo predmet znanja (veliko slovo, točka, pravopis,
posvojni pridjev) izuzeti su iz K4 i K9: ondje se ponude **namjerno**
razlikuju samo po tome. Prvi prolaz bez te iznimke dao je 30 lažnih
„odbijanja” samo u temi „Slova”.

---

## 2. Što je recenzija pronašla i što je učinjeno

### 2.1. Duljina točnog odgovora odavala je odgovor u čitanju

Mjereno na 30 generiranja svake teme, isto mjerilo prije i poslije
(„osjetno najdulji” = točan odgovor ≥ 1,25 × i ≥ 4 znaka dulji od svakog ometača):

| Tema | Jedini najdulji — prije | poslije | Osjetno najdulji — prije | poslije |
|---|---:|---:|---:|---:|
| R3 Čitanje s razumijevanjem | 70 % | 42 % | 55 % | **0 %** |
| R4 Čitanje s razumijevanjem | 64 % | 42 % | 50 % | **8 %** |
| R3 Književni tekstovi | 53 % | 22 % | 36 % | **0 %** |
| R4 Književnost | 60 % | 40 % | 43 % | **19 %** |
| R3 Kulturna baština | 42 % | 33 % | 39 % | **19 %** |
| R4 Medijska kultura | 71 % | 30 % | 64 % | **10 %** |

S tri ponude slučajno je ~33 % „jedini najdulji”. Dijete koje bira najdulji
odgovor ne čitajući tekst dobilo bi prije u čitanju 3. razreda 70 % točno —
zadatak je mjerio lukavost, ne razumijevanje. Sada je to na razini slučaja,
a razlika koju dijete može primijetiti („osjetno”) gotovo je nestala.

**Kako je ispravljeno:** točni odgovori nisu dirani (osim jednoga koji je skraćen). U 46 pitanja ometači su prepisani
tako da budu jednako dugi, jednako uvjerljivi i i dalje jasno netočni prema
tekstu, npr.:

| Pitanje | Prije | Poslije |
|---|---|---|
| Gdje je hrana za Mrvu? | **u ormariću ispod sudopera** · u hladnjaku · na stolu | **u ormariću ispod sudopera** · u hladnjaku pokraj ručka · na stolu u dnevnoj sobi |
| Što jež radi kad osjeti opasnost? | **sklupča se u bodljikavu kuglu** · popne se na drvo · glasno zviždi | **sklupča se u bodljikavu kuglu** · brzo se popne na najbliže drvo · glasno zviždi da pozove druge |
| Što je stih? | **jedan redak pjesme** · cijela pjesma · naslov · autor | **jedan redak pjesme** · skupina od nekoliko redaka · riječ koja se rimuje s drugom · ime osobe koja je napisala pjesmu |

Pri tome je pazila i na K2: novi ometači ne smiju imati „samo”, „uvijek” i
slično, jer bi tada trag samo promijenio oblik.

### 2.2. Sadržajna greška: zaplet ≠ najnapetiji dio

Stari zadatak u 3. razredu: *„Što je zaplet u priči?” → najnapetiji dio.*
To je **vrhunac**. Školska podjela pripovjednog teksta je uvod → zaplet
(nastaje problem ili sukob) → vrhunac (najnapetiji dio) → rasplet (problem se
riješi). Ispravljeno; dodan je zadatak o vrhuncu, a sva četiri zadatka imaju
iste četiri ponude (opisi dijelova), pa se razlikuju samo po znanju.

### 2.3. Ostali ispravci

- „Što nam pomaže pratiti događaje u priči? → redoslijed događaja” — odgovor
  ponavlja pitanje (K3). Zamijenjeno: „Koje riječi pomažu pratiti redoslijed
  događaja?” → *najprije, zatim, na kraju*.
- Medijska kultura: stari fond imao je ponude „crtani/lutkarski”,
  „udžbenik mat.”, „TV emisija” uz rečenice — zamijenjen (vidi 3.).
- Ishod medijske kulture bio je `C.4.1` s opisom koji ne odgovara kurikulu;
  sada `C.4.2` (elektronički mediji) uz sporedne `C.4.1` i `C.4.3`.

### 2.4. Što učitelj (simulirani) prihvaća uz napomenu

- **Stručni nazivi** („personifikacija” uz „rima”, „onomatopeja”) — duljina
  pripada nazivu, ne odaje odgovor onome tko pojam ne zna. Prihvaćeno.
- **Brojčani odgovori** (R4 Pisano množenje, 26 %) — umnožak je prirodno
  duži broj od ometača; to nije jezični trag. Prihvaćeno.
- **Jednosložni odgovori** („nutricionistica” uz „učiteljica”) — ne mogu se
  izjednačiti bez gubitka smisla. Prihvaćeno.

### 2.5. Ostavljeno stvarnom učitelju (DORADI)

20 zadataka u starim generatorima 1. i 2. razreda (ekologija, zdravlje,
zavičaj, voda i tlo, geometrija) ima ometače oblika „samo X” uz uključiv točan
odgovor (K2). Primjer: *„Što je biljkama potrebno za život?”* → točno „voda,
svjetlost, tlo i zrak”, ometači „samo vodu / samo sunce / samo tlo”. Dijete
nauči da „samo” znači „netočno”. Popis: `npm run recenzija:detalji`.

---

## 3. Novi sadržaj u ovom krugu i njegova recenzija

### 3.1. Tekstovi za čitanje (6 novih, ukupno 17)

| Tekst | Razred | Vrsta | Ishod | Recenzija |
|---|---|---|---|---|
| Pčele | 3. | obavijesni | A.3.3 | činjenice provjerene (matica, radilice, trutovi, oprašivanje) |
| Plakat — lutkarska predstava | 3. | nekontinuirani | C.3.3 | „Mačak u čizmama” je narodna bajka (slobodna); račun 11 h + 45 min u dosegu 3. r. |
| Hranilica | 3. | pripovjedni | B.3.1 | bez činjeničnih tvrdnji; poruka jasna iz teksta |
| Ivana Brlić-Mažuranić | 4. | biografija | A.4.3 | provjereno: Ogulin 1874., djed Ivan Mažuranić, Hlapić 1913., Priče iz davnine 1916., prva žena u JAZU, Zagreb 1938. |
| Vozni red — linija 7 | 4. | tablica | C.4.1 | izmišljena linija (nema stvarnih podataka koje bi trebalo održavati) |
| Utrka | 4. | pripovjedni | B.4.1 | osobine lika izvode se iz postupaka, ne iz pridjeva u tekstu |

Svako pitanje nosi proces (podatak / zaključak / tumačenje / vrednovanje) i
objašnjenje koje upućuje na dokaz u tekstu. Najdulji tekst ima 83 riječi
(granica za 4. r. je 200), a najdulja prosječna rečenica 10,9 riječi (izmjereno).

### 3.2. Medijska kultura (8 → do 625 različitih zadataka)

`seeds/gen-mediji.js` — tiskani i elektronički mediji, svrha poruke (oglas /
vijest / obavijest), **činjenica ili mišljenje**, izvori podataka (rječnik,
pravopis, zemljovid, enciklopedija — spajanje), vrste filma, kulturni događaji
(C.4.3), sigurnost na internetu i ponašanje u kazalištu, kinu i galeriji.

Kurikul (NN 10/2019): C.4.1 izdvaja podatke iz izvora; C.4.2 razlikuje
elektroničke medije; C.4.3 opisuje kulturne događaje.

---

## 4. Učinak na iscrpljivanje (simulirani pilot)

| Krak | Početak dana | Sada |
|---|---:|---:|
| elo | 133 / 4 320 (3,1 %) | **2 (0,05 %)** |
| kvote | 164 / 4 320 (3,8 %) | **1 (0,02 %)** |

---

## 5. Što simulacija učitelja ne može

- procijeniti razumije li **dijete od 8 godina** riječ „nutricionistica”,
  „sedra” ili „biografija” bez pomoći;
- osjetiti je li priča **zanimljiva** ili je li poruka nametnuta;
- provjeriti **regionalne** nazive i običaje (zvončari, bećarac) s gledišta
  djeteta iz drugog kraja;
- zamijeniti **pilot s djecom**: koji ometač stvarno biraju (vidi
  `tools/analyze-distractors.js` nakon prvih odgovora).

Preporuka: stvarni učitelj pregledava 17 tekstova i medijsku kulturu
(~2 sata), a zatim popis iz `npm run recenzija:detalji`. Tek nakon toga
`reviewStatus` prelazi u `reviewed`.

## Izvori

- Haladyna, Downing i Rodriguez (2002), *A Review of Multiple-Choice Item-Writing Guidelines for Classroom Assessment*: https://eric.ed.gov/?id=EJ660246
- PIRLS 2026, okvir čitanja: https://timssandpirls.bc.edu/pirls2026/frameworks/downloads/P26_Ch1_Reading-Assessment.pdf
- Kurikul Hrvatskoga jezika, NN 10/2019: https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_10_215.html
- Kriteriji vrednovanja HJ, 3. r. (C.3.1–C.3.3): https://www.os-kamenica.com/wp-content/uploads/2025/10/KRITERIJI-vrednovanja-3_razred.pdf
- Kriteriji vrednovanja, 4. r. (C.4.1–C.4.3): https://os-braca-radic-koprivnica.skole.hr/wp-content/uploads/sites/1585/2024/09/Kriteriji-vrednovanja-4-razred.pdf
- Dijelovi pripovjednog teksta (uvod, zaplet, vrhunac, rasplet), Edutorij: https://edutorij-admin-api.carnet.hr/storage/extracted/2260081/html/609_pripovjedni_tekstovi.html
- Van der Kleij i sur. (2015), povratna informacija: https://journals.sagepub.com/doi/abs/10.3102/0034654314564881
