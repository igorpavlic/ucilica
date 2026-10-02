# Nove teme — istraživanje i generatori

Nastavak dokumenta `ISTRAZIVANJE-PODRUCJA.md` (§5.2). Ondje je predloženo da
se deset područja spoji u četiri nove teme. Ovdje je za svaku temu opisano:
- na kojem se ishodu temelji;
- koje su činjenice provjerene;
- koje zadatke generator daje;
- što još treba provjeriti.

| Tema | Predmet | Razredi | Slug | Generator |
|---|---|---|---|---|
| Algoritmi i logika | **Informatika** (novi predmet) | 1.–4. | `algoritmi-N` | `seeds/gen-informatika.js` |
| Računalo i sigurnost | **Informatika** | 1.–4. | `digitalni-svijet-N` | `seeds/gen-informatika.js` |
| Ja i drugi | Priroda i društvo | 1.–4. | `ja-i-drugi-N` | `seeds/gen-ja-i-drugi.js` |
| Promet i bicikl | Priroda i društvo | 3.–4. | `promet-3`, `promet-4` | `seeds/gen-promet.js` |
| Novac i kupovina | Matematika | 3.–4. | `novac-3`, `novac-4` | `seeds/gen-novac.js` |

Sve teme su navedene u `seeds/nove-teme.js`. Iz te datoteke ih preuzimaju:
- seed skripte;
- generiranje pitanja u hodu;
- `npm run topics:add`;
- testovi.

Na postojećoj bazi naredba `cd backend && npm run topics:add` dodaje predmet
Informatika i sve nove teme. Postojeća pitanja i napredak djece ostaju netaknuti.

---

## 1. Informatika (1.–4. razred)

### Uporište

**Izborna Informatika.** U razrednoj nastavi postoji od šk. god. 2020./21. i ima 70 sati godišnje. Kurikul je objavljen u NN 22/2018 i ima četiri domene:
- A — informacije i digitalna tehnologija;
- B — računalno razmišljanje i programiranje;
- C — digitalna pismenost i komunikacija;
- D — e-društvo.

**Informacijske i digitalne kompetencije (IDK).** To je predmet u eksperimentalnoj cjelodnevnoj školi: obvezan je od 1. do 8. razreda i ima 35 sati godišnje. Sadržaj mu se preklapa s domenama A–D, pa ista pitanja služe i učenicima tih škola.

**Ishodi korišteni u generatoru** (u zagradama su oni koji se ne mogu potvrditi):

| Razred | Ishodi |
|---|---|
| 1. | A.1.1 prepoznaje digitalnu tehnologiju · A.1.2 razlikuje oblike digitalnih sadržaja i uređaje · B.1.1 rješava jednostavan logički zadatak · B.1.2 slijedi i prikazuje slijed koraka · C.1.1 · D.1.1 pažljivo rukuje opremom i čuva osobne podatke · D.1.2 primjenjuje zdrave navike |
| 2. | A.2.1 objašnjava ulogu programa · B.2.1 analizira niz uputa i ispravlja pogrešan redoslijed · D.2.1 prepoznaje poslove koji koriste IKT · (sigurnost u 2. r.: samo domena D) |
| 3. | A.3.1 koristi se simbolima za prikazivanje podataka · B.3.1 program sa slijedom, ponavljanjem i odlukom · B.3.2 sortiranje podataka · (C i D: samo domena) |
| 4. | A.4.1 računalne mreže · A.4.2 čovjek i stroj · B.4.1 vizualno programiranje · B.4.2 složeniji logički zadatci · D.4.1 zdravlje i sigurnost pri radu · D.4.2 poslovi koji traže IKT |

**Zašto kviz ima smisla i bez računala.** Dvije meta-analize pokazuju da su aktivnosti bez računala (*unplugged*) za računalno razmišljanje korisne kao i programiranje, a kod učenika razredne nastave čak i više. To su upravo zadatci tipa „poredaj”, „pronađi grešku”, „nastavi uzorak” i „put po mreži”. Isti oblik zadataka ima i natjecanje **Dabar** (Bebras), u kategorijama MikroDabar (1.–2. r.) i MiliDabar (3.–4. r.).

### Zadatci

| Vrsta | Razred | Parametrizirano | Ishod |
|---|---|---|---|
| Poredaj korake (pranje ruku, sadnja, slanje pisma…) | 1.–2. | izbor rutine | B.1.2 / B.2.1 |
| Prvi korak, sljedeći korak, korak koji nedostaje, zamijenjeni koraci | 1.–2. | da | B.1.2 / B.2.1 |
| **Robot na mreži**: koje strelice vode do zvjezdice, kod kojeg voća stane, najmanji broj koraka | 1.–4. | da: mreža 3×3 do 5×5, stijene | B.1.2 / B.2.1 / B.3.1 / B.4.1 |
| **Pronađi pogrešnu naredbu** (provjereno da je popravak jednoznačan) | 2.–4. | da | B.2.1 |
| Kraći zapis s ponavljanjem (`→ → → ↓ ↓` = `3 × →, 2 × ↓`) | 3.–4. | da | B.3.1 / B.4.1 |
| Uzorci boja (AB, ABC, AAB, ABBC, ABACB…) | 1.–4. | da | B.1.1 / B.4.2 |
| Što ne pripada skupini | 1.–2. | da | B.1.1 |
| Šifra: simbol → slovo, zapiši i pročitaj riječ | 3.–4. | da | A.3.1 |
| Sortiranje: imena abecednim redom (hrvatska abeceda), djeca po visini iz grafikona | 3.–4. | da | B.3.2 |
| AKO … ONDA … INAČE (vrijeme, semafor, broj veći od granice, uključujući jednakost) | 3.–4. | da | B.3.1 / B.4.1 |
| PONOVI n PUTA, ugniježđena petlja, varijabla „bodovi”, ulazna vrijednost | 3.–4. | da | B.3.1 / B.4.1 |
| Digitalni uređaji, dijelovi računala, ulazni i izlazni uređaji, programi | 1.–4. | izbor iz skupa | A |
| Osobni podatci, zdrave navike, sigurnost, lozinka, prijevara, pristojna poruka | 1.–4. | izbor iz skupa | D, C |
| Internet, čovjek i stroj, zanimanja | 4. | ne | A.4.1, A.4.2, D.4.2 |

**Novi prikaz `mreza`.** To je polje redaka s emojijima (🤖 ⭐ 🪨 ⬜ i voće). Prikazuje se kao kvadratna mreža u `QuizView.vue`. Mreža ulazi u `itemKey`, pa je drugi raspored drugi zadatak.

**Tipkovnica** je ostala neobavezni dodatak za kasnije (§3.1 u `ISTRAZIVANJE-PODRUCJA.md`).

---

## 2. Ja i drugi (1.–4. razred)

### Uporište

- **PID, domena C (Pojedinac i društvo):** C.1.1 zaključuje o sebi i svojoj ulozi u zajednici.
- **Međupredmetna tema Osobni i socijalni razvoj** (NN 7/2019): osr A.x.2 upravlja emocijama i ponašanjem, B.x.1 uvažava osjećaje drugih, B.x.2 komunikacija, B.x.3 rješavanje sukoba.
- **Građanski odgoj** (NN 10/2019): goo A — dječja prava.
- **Konvencija o pravima djeteta:** usvojena 20. 11. 1989.; Hrvatska je stranka od 8. 10. 1991. UNICEF Hrvatska ima i inačicu prilagođenu djeci.

Oznake međupredmetnih tema za 2. ciklus (3.–5. r.) stoje u kodu kao `osr B.2.1` itd. Za te teme upisan je `needsReview`, jer kurikulski dokument nije bio dostupan za provjeru.

### Kako su pisani zadatci

**Drugo lice prezenta.** Na primjer: „Prijatelj ti se seli u drugi grad. Kako se vjerojatno osjećaš?”. Tako nema rodnih oblika (*sretan/sretna*). Osjećaji su prilozi (*veselo, tužno, posramljeno*) i isti su za svakoga.

**Bliski osjećaji se ne nude kao ometači.** Primjer: uz „otkazan izlet” točan je odgovor *razočarano*, a *tužno* i *ljuto* nisu ponuđeni. Zato je odgovor jednoznačan, a pitanje kaže „vjerojatno”.

**Rječnik osjećaja raste po razredima:**
- 1. r.: veselo, tužno, ljuto, uplašeno;
- 2. r.: dodaje se iznenađeno;
- 3. r.: ponosno, zabrinuto, razočarano;
- 4. r.: posramljeno, ljubomorno, pomiješani osjećaji.

To prati istraživanja o razvoju rječnika emocija od 4. do 11. godine (izvori u `ISTRAZIVANJE-PODRUCJA.md`).

### Zadatci

- Osjećaj u situaciji; lice na slici (emoji, 1.–2. r.).
- Kako se smiriti kad te obuzme ljutnja.
- Kako pomoći drugome: novi učenik, zaboravljena užina, zadirkivanje (odgovor: reći odrasloj osobi).
- Čarobne riječi (spajanje i izbor); pristojno ponašanje i različitost (točno/netočno).
- Prava djeteta (od 2. r.): pravo ili želja; spajanje prava s primjerom (3.–4. r.).
- Dužnosti učenika, ja-poruka umjesto vrijeđanja, koraci mirnog rješavanja svađe, volontiranje.
- 4. r.: Konvencija, jednaka prava sve djece, Hrabri telefon 116 111, Crveni križ.

**Ograničenje:** ova je tema najmanja. U 50 poziva generator daje 37 različitih zadataka u 1. razredu i 72 u 4. razredu, jer se teme bez brojeva ne mogu parametrizirati kao matematika. Kad dijete prođe sve, aplikacija nudi ona koja je najdulje nije vidjelo. Više situacija dodaje se jednostavno, upisom u tablice `OSJECAJI` i `POMOC`.

---

## 3. Promet i bicikl (3.–4. razred)

U 1. i 2. razredu promet je već obrađen u postojećim temama („Sigurnost i promet”, „Zdravlje i sigurnost”).

### Provjerena pravila

Prema Zakonu o sigurnosti prometa na cestama, izmjene na snazi od 21. 12. 2024.:

| Pravilo | U zadatku |
|---|---|
| Dijete s navršenih **9 godina** koje je u školi osposobljeno i ima potvrdu smije samostalno voziti bicikl na cesti. Ostala djeca od 9 godina voze samo uz osobu od najmanje 16 godina. | „Smije li dijete od 7 godina samo voziti bicikl po cesti?” — ne. „S koliko godina…” — od 9. |
| Biciklist mlađi od **16 godina** na cesti mora nositi zaštitnu kacigu. | točno/netočno |
| Osobno prijevozno sredstvo (električni romobil) smije voziti osoba od **14 godina**. | „dijete od 10 godina” — ne |

Biciklistički ispit polaže se u osnovnoj školi. Program je zajednički MZO-u i MUP-u, a HAK izdaje priručnik „Biciklom sigurno u promet”.

**Ostale činjenice** (prometni znakovi i ponašanje u prometu):
- trokut upozorava na opasnost, crveni krug zabranjuje, plavi krug naređuje, plavi kvadrat obavještava;
- STOP traži potpuno zaustavljanje;
- pješak bez nogostupa hoda lijevom stranom, prema vozilima;
- biciklist vozi desnom stranom; kad skreće, ispruži ruku na tu stranu;
- preko pješačkog prijelaza biciklist gura bicikl;
- prednje svjetlo bicikla je bijelo, stražnje crveno;
- ne prelazi se ispred autobusa koji stoji;
- iz automobila se izlazi na strani nogostupa;
- brojevi: 112, 192 (policija), 193 (vatrogasci), 194 (hitna pomoć).

**Namjerno izostavljeno:** prednost na raskrižju (pretežak sadržaj za 3. razred) i točne dobne granice za autosjedalicu (nisu provjerene).

**Parametrizirano:** ostatak puta do škole i put biciklista (brzina × vrijeme).

---

## 4. Novac i kupovina (3.–4. razred)

U 2. razredu novac je obrađen u postojećoj temi „Mjerenje i novac”.

### Uporište

- Matematika (računanje s novcem).
- Međupredmetna tema Poduzetništvo, domena C — ekonomska i financijska pismenost.
- Nacionalni strateški okvir financijske pismenosti 2021.–2026.

**Oznaka ishoda MAT za novac u 3. i 4. razredu nije provjerena.** U kodu stoji `needsReview`.

### Odluke o sadržaju

- **Cijeli euri.** Decimalni brojevi dolaze tek u 5. razredu. Centi se pojavljuju samo kao pretvorba € ↔ centi (3. r.).
- **Stvarne novčanice:** 5, 10, 20, 50, 100 i 200 €. Kovanice: 1, 2, 5, 10, 20, 50 centi te 1 € i 2 €.
- **Realne cijene:** olovka 1–3 €, knjiga 8–18 €, lopta 10–25 €. U 4. razredu iznosi su veći, ali i dalje stvarni.
- **Imenice iz rječnika `hr-imenice.js`.** Slaganje s brojem je zato ispravno: „za 4 olovke”, „za 12 ravnala”, „Paket od 8 sokova”.

### Zadatci

**3. razred:**
- ukupna cijena;
- koliko se dobije natrag;
- cijena više komada i cijena jednog komada;
- štednja;
- koji par stvari stane u iznos — jedinstveno rješenje, uz cjenik;
- potreba ili želja;
- zašto čuvamo račun;
- svrha reklame;
- euri u centima;
- koja novčanica ili kovanica ne postoji.

**4. razred, dodatno:**
- štednja uz već uštedjeni iznos;
- paket ili komad po komad;
- **račun iz trgovine** (ukupno, vraćeno);
- najmanji broj novčanica i kovanica;
- džeparac;
- „upola cijene”;
- **rok trajanja.**

**Rok trajanja.** „Upotrijebiti do” odnosi se na sigurnost hrane, a „najbolje upotrijebiti do” na kvalitetu. Datumi u zadatku su parametrizirani.

---

## 5. Kvaliteta

| Tema | Zadataka po pozivu | Različitih zadataka u 50 poziva |
|---|---:|---:|
| algoritmi 1 / 2 / 3 / 4 | 16 / 19 / 17 / 21 | 413 / 696 / 723 / 837 |
| računalo i sigurnost 1 / 2 / 3 / 4 | 9 / 14 / 15 / 19 | 56 / 76 / 98 / 105 |
| ja i drugi 1 / 2 / 3 / 4 | 12 / 13 / 16 / 21 | 37 / 49 / 63 / 72 |
| promet 3 / 4 | 18 / 21 | 87 / 109 |
| novac 3 / 4 | 14 / 19 | 331 / 619 |

**Provjere:**
- **`npm run test:sve` prolazi.** Pokreće sve provjere jasnoće, slaganja broja i imenice, položaja točnog odgovora i raznolikosti (7 različitih obrazaca u kvizu).
- **Promjena testa.** Strelica „→” sada smije stajati u pitanju kad su to naredbe robotu. Kao prečac pitanja („skijanje → doba?”) i dalje je zabranjena.
- **Simulirana recenzija učitelja** (`npm run recenzija`): 0 ODBIJ i 0 DORADI.
  - Prvi prolaz našao je dvije stvari, obje ispravljene: veliko slovo samo u jakoj lozinki (K4) i preduge točne odgovore u nekoliko pitanja.
  - Udio pitanja u kojima je točan odgovor osjetno najdulji spušten je na 1,2 % (mjereno u 30 poziva svih novih generatora).
- **Simulacija** (240 djece, 18 kvizova): 4320 kvizova, nijedan bez novih pitanja; nove teme su uključene.

## 6. Što ostaje

1. **Provjeriti oznake ishoda** označene s `needsReview`:
   - informatika C i D za 2.–3. r.;
   - MPT za 2. ciklus;
   - PID za promet;
   - MAT za novac.
2. **Proširiti „Ja i drugi”** novim situacijama. To je najmanja banka.
3. **Prilagoditi zadatke Dabra** (CC BY-SA, uz navođenje izvora) kao ručno pisane zadatke za Informatiku.
4. **Pregled s učiteljicom razredne nastave**, posebno osjećaja (je li odgovor jednoznačan) i prometnih pravila.

## 7. Izvori

**Informatika**
- Kurikul nastavnog predmeta Informatika (NN 22/2018): https://narodne-novine.nn.hr/clanci/sluzbeni/2018_03_22_436.html
- Kurikul Informatika (MZOM, PDF): https://mzom.gov.hr/UserDocsImages/dokumenti/Publikacije/Predmetni/Kurikulum%20nastavnog%20predmeta%20Informatika%20za%20osnovne%20skole%20i%20gimnazije.pdf
- GIK Informatika, 2. razred (ishodi A.2.1, B.2.1, D.2.1): https://i-nastava.gov.hr/UserDocsImages//dokumenti/GIK-Informatika//Informatika_GIK_2_razred_OS.pdf
- GIK Informatika, 4. razred (A.4.1, A.4.2, B.4.2, D.4.1, D.4.2): https://i-nastava.gov.hr/UserDocsImages//dokumenti/GIK-Informatika//Informatika_GIK_4_razred_OS.pdf
- GIK Informatika, 1. razred: https://i-nastava.gov.hr/UserDocsImages//dokumenti/GIK-Informatika//Informatika_GIK_1_razred_OS.pdf
- Eksperimentalni kurikul *Informacijske i digitalne kompetencije*: https://mzo.gov.hr/UserDocsImages/dokumenti/Obrazovanje/OsnovneSkole/Eksperimentalni-kurikulum-nastavnog-predmeta-Informacijske-i-digitalne-kompetencije-za-osnovne-skole.pdf
- Meta-analiza: unplugged i programiranje (2022): https://link.springer.com/doi/10.1007/s10639-022-10915-x
- Meta-analiza: unplugged aktivnosti (2023): https://link.springer.com/10.1186/s40594-023-00434-7
- Dabar, kategorije MikroDabar i MiliDabar: https://os-mejasi-st.skole.hr/dabar-natjecanje-2024-16-zlatnih-diploma-za-os-mejasi/

**Ja i drugi**
- Osobni i socijalni razvoj (NN 7/2019): https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_7_153.html
- Građanski odgoj i obrazovanje (NN 10/2019): https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_10_217.html
- Kurikul Priroda i društvo: https://mzom.gov.hr/UserDocsImages/dokumenti/Publikacije/Predmetni/Kurikulum%20nastavnog%20predmeta%20Priroda%20i%20drustvo%20za%20osnovne%20skole.pdf
- UNICEF Hrvatska, Konvencija o pravima djeteta: https://www.unicef.org/croatia/konvencija-o-pravima-djeteta
- Konvencija na jeziku prilagođenom djeci: https://www.unicef.org/croatia/izvjesca/bro%C5%A1ura-o-konvenciji-o-pravima-djeteta-na-jeziku-prilago%C4%91enom-djeci
- Hrabri telefon za djecu: https://djeca.hrabritelefon.hr/

**Promet**
- Zakon o sigurnosti prometa na cestama (pročišćeni tekst): https://www.zakon.hr/z/78/zakon-o-sigurnosti-prometa-na-cestama
- Djeca i bicikl, ispit (pregled): https://www.rog-joma.hr/hr/blog/dozvola-voznja-bicikla-djeca/
- Što biciklistima propisuje zakon (NPSCP): https://npscp.hr/usluge/sto-biciklistima-propisuje-zakon-o-sigurnosti-prometa-na-cestama-i-kolike-su-kazne
- MUP, kaciga: https://mup.gov.hr/promet-281589/12-propisuje-li-zakon-izgled-kacige-koja-se-mora-nositi-tijekom-voznje-na-mopedu-ili-biciklu/281760
- Program osposobljavanja za bicikl (priručnik): https://os-vnazora-novabukovica.skole.hr/wp-content/uploads/sites/1472/2025/03/program-osposobljavanja-za-bicikle-prirucnik-prilog-v6.pdf

**Novac**
- Nacionalni strateški okvir financijske pismenosti 2021.–2026.: https://narodne-novine.nn.hr/clanci/sluzbeni/2021_06_68_1316.html
- Poduzetništvo (NN 7/2019): https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_7_157.html
- Oznake roka trajanja (EFSA): https://www.efsa.europa.eu/cnr/safe2eat/food-date-labelling
- „Upotrijebiti do” i „najbolje upotrijebiti do” (Dnevnik.hr): https://dnevnik.hr/vijesti/hrvatska/promjena-oznake-upotrijebiti-do---692354.html
