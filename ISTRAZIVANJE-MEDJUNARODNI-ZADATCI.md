# Međunarodni oblici zadataka za 1.–4. razred — istraživanje i prilagodba za Mudrolinu

Cilj: koristiti oblike zadataka koji su se u drugim zemljama i na međunarodnim natjecanjima pokazali dobrima za djecu od 6 do 10 godina. Sadržaj pritom ostaje u hrvatskom okviru:
- hrvatski jezik, pravopis i abeceda (č, ć, dž, đ, lj, nj);
- hrvatska imena i mjesta, euro, metričke mjere;
- domaće životinje i biljke, hrvatska književnost;
- bez vezanja uz strana mjesta i pojmove.

## 1. Izvori

| Izvor | Što donosi | Uzrast |
|---|---|---|
| [Klokan bez granica (HMD)](https://matematika.hr/wp-content/uploads/2026/04/LEKT-KLOKAN-P-2026-zadaci.pdf); [arhiva Klokana (DMS)](https://dms.rs/wp-content/uploads/2026/06/2-hrvatski-2026.pdf) | logika položaja, brojanje, prostorno zaključivanje, rast uzorka, „unatrag” zadatci | Pčelice (2. r.), Leptirići (3. r.) |
| [Dabar (Bebras) u Hrvatskoj](https://dnevnik.hr/vijesti/tech/hrvatska-postala-punopravna-clanica-dabra-medjunarodne-organizacije-koja-promice-informatiku-medju-uciteljima-i-ucenicima---481865.html); [Bebras — vrste zadataka](https://amt.edu.au/wp-content/uploads/2024/02/2015-Bebras-Solution-Guide.pdf) | slijedovi, uzorci, kodiranje, stabla odlučivanja, grafovi (najkraći put) | MikroDabar (1.–2.), MiliDabar (3.–4.) |
| [Singapurska matematika — model dijelova i cjeline](https://www-fourier.univ-grenoble-alpes.fr/~M1maths/fichiers/1718Guebey_Mailley_Singapore_Maths.pdf); [rastav broja (number bonds)](https://classicalu.com/wp-content/uploads/Singapore-Math-Lesson-7-Temp.pdf) | rastav broja, trake dijelova i cjeline, usporedba, zadatci u dva koraka | 1.–4. r. |
| [Njemačka — Zahlenmauern](https://www.schule-bw.de/faecher-und-schularten/mathematisch-naturwissenschaftliche-faecher/mathematik/projekte/sinus-grundschule/gute-aufgaben/docs/Zahlenmauern.pdf), [Rechendreiecke](https://www.schule-bw.de/faecher-und-schularten/mathematisch-naturwissenschaftliche-faecher/mathematik/unterrichtsmaterialien/grundschule/sinus-grundschule/gute-aufgaben/docs/Rechendreiecke.pdf), [Rechenhäuser](https://www.material-schmiede.de/mathe/mathe-1-klasse/rechenhaeuser-z20) | zid brojeva, kućica brojeva, „dobri zadatci” s više putova | 1.–3. r. |
| [TIMSS 4. razred — prirodoslovlje](https://elvis.bc.edu/publications/timss/2015-methods/pdf/T15_MP_Exh_13-2_Science_Items_G4.pdf) | živi svijet, tvari i sile, Zemlja; znanje, primjena, zaključivanje | 4. r. |
| [Sachunterricht 3.–4.](https://www.dstenerife.eu/wp-content/uploads/2016/04/Themenliste-Sachkunde_2010.pdf); [pliva ili tone, magnetizam](https://www.friedrich-verlag.de/friedrich-plus/grundschule/grundschulmagazin/konnen-enten-aus-knetmasse-auch-schwimmen-16289) | istraživanje: pliva/tone, magnet, materijali, vrijeme | 2.–4. r. |
| [PIRLS — procesi razumijevanja](https://pirls2021.org/frameworks/home/reading-assessment-framework/processes-of-comprehension) | pronalaženje podatka (20 %), jednostavan zaključak (30 %), tumačenje (30 %), vrednovanje (20 %) | 4. r. |
| [KS2 Reading — vrste pitanja](https://www.tes.com/teaching-resource/ks2-reading-sats-style-question-stems-question-types-12170768) | pronađi i prepiši, točno/netočno, značenje riječi, redoslijed događaja | 2.–4. r. |
| [Kurikulum PID (MZO)](https://mzom.gov.hr/UserDocsImages/dokumenti/Publikacije/Predmetni/Kurikulum%20nastavnog%20predmeta%20Priroda%20i%20drustvo%20za%20osnovne%20skole.pdf); [MAT 4. r. — ishodi](https://os-plorini-sali.skole.hr/wp-content/uploads/sites/2532/2024/09/Matematika-4.pdf) | usklađivanje s hrvatskim ishodima (npr. PID OŠ A.3.1, MAT OŠ A.4.1, E.4.1) | 1.–4. r. |

Napomena: dio izvornih PDF-ova nije bio dostupan iz razvojne okoline (mrežna pravila). Oblici zadataka zato su preuzeti iz opisa izvora i poznatih primjera, a ne iz preslika pojedinih zadataka. Nijedan zadatak nije prepisan.

## 2. Što je preuzeto i kako je prilagođeno

### Matematika (`seeds/dodatci/medjunarodno.js`)

| Oblik | Porijeklo | Prilagodba | Tema u Mudrolini |
|---|---|---|---|
| Rastav broja, kućica brojeva | Singapur, Njemačka (Zahlenhaus) | „Broj 9 rastavi na 4 i ___.” Do 20. | zbrajanje, oduzimanje (1. r.) |
| Vaga u ravnoteži | Singapur, Klokan | kocke na vagi; do 20, do 80, do 200 | zbrajanje (1. r.), zbrajanje do 100, nepoznati broj (3. r.) |
| Stroj za brojeve | njemački i engleski udžbenici | pravilo (+3, −2, ×5…), naprijed i unatrag | oduzimanje (1. r.), do 100, množenje |
| Zid brojeva | Njemačka (Zahlenmauer) | tri oblika (vrh, srednji red, donji red); do 100, 1000, 10 000 | zbrajanje do 100, do 1000, pisano zbrajanje |
| Čarobni kvadrat | međunarodno, Klokan | 3 × 3, zbroj 15 (+10, +20) | brojevi do 100 |
| Zadatci u dva koraka | Singapur (model usporedbe) | „Mia ima 23 olovke, a Marko 17 manje…” | oduzimanje do 100, do 1000 |
| Položaj u redu, rast uzorka, zamišljeni broj, logika redoslijeda | Klokan bez granica | hrvatska imena; komparativ po rodu („viši/viša nego”) | nizovi, mjerenje 3. r., množenje, nepoznati 4. r. |
| Kalendar | TIMSS | dani u tjednu, svibanj | mjerenje 3. r. |
| Kombinacije | Klokan, TIMSS | majice i suknje, kruh i namaz u pekarnici | množenje 3. r., podatci 4. r. |
| Zbroj i razlika | Singapur (dvije trake) | veći broj iz zbroja i razlike | nepoznati 4. r. |
| Kovanice i novčanice | — | samo euro (1 €, 2 €, 5 €, 10 €) | mjerenje i novac 2. r. |

### Hrvatski jezik

| Oblik | Porijeklo | Hrvatsko pravilo |
|---|---|---|
| Abecedni red | jezični kurikuli, KS1/KS2 | hrvatska abeceda od 30 slova: c < č < ć, d < dž < đ, l < lj, n < nj |
| Slova i glasovi | fonološka svjesnost | dž, lj i nj su jedan glas, ali dva znaka (ljubav: 5 glasova, 6 znakova) |
| Umanjenice i uvećanice | slavenski kurikuli | kućica/kućerina, psić/psina, ručica/ručerda… |
| Srodne riječi | jezični kurikuli | isti korijen: šuma – šumar – šumski |
| Zagonetke, poslovice | narodna književnost | hrvatske narodne zagonetke i poslovice |
| Pitanja uz tekst | PIRLS, KS2 | već usklađeno (procesi: podatak, zaključak, tumačenje, vrednovanje) |

### Priroda i društvo

| Oblik | Porijeklo | Primjer |
|---|---|---|
| Pliva ili tone | Sachunterricht, TIMSS | drvena žlica, čep od pluta, ključ, spajalica |
| Magnet | Sachunterricht, TIMSS | željezo i čelik da; drvo, staklo, papir, guma ne |
| Materijali i svojstva | TIMSS | proziran, savitljiv, upija vodu, slabo vodi toplinu |
| Pošten pokus | TIMSS (zaključivanje) | mijenja se samo jedna stvar (šećer u toploj i hladnoj vodi) |
| Sjena | TIMSS, Sachunterricht | najkraća u podne; Sunce na istoku, sjena na zapad |

### Informatika (Dabar)

| Oblik | Primjer |
|---|---|
| Binarni zapis | upaljena žarulja = 1, ugašena = 0 |
| Stablo odlučivanja | „Ima li perje?” → ptica; „Ima li šest nogu?” → kukac… |
| Najkraći put | kuća – pekarnica – škola ili kuća – park – škola (minute) |
| Šifra s pomakom | pomak po hrvatskoj abecedi (MAMA → NBNB) |

## 3. Hrvatski okvir: što je uklonjeno ili zamijenjeno

`seeds/lokalno.js` u svakom generiranju:
1. **Mijenja tropsko voće domaćim** u računskim pričama: banana → šljiva, naranča → mandarina, sa svim padežima. Ako se ponude podudare, pitanje se izbacuje.
2. **Izbacuje pitanja vezana uz strana mjesta i pojmove:**
   - egzotične životinje i biljke (slon, lav, pingvin, krokodil, deva, kameleon, kaktus…);
   - pustinje, strane gradove i države, dolare i inče;
   - strane bajke i autore.

**Iznimke** (gradivo o Hrvatskoj):
- susjedne i druge države te kontinenti u temi „Hrvatska — moja domovina”;
- „hrvatski Andersen” u tekstu o Ivani Brlić-Mažuranić;
- zebre i slonica na Brijunima (hrvatski nacionalni park).

**Zamjene u vlastitim tablicama:**

| Bilo | Sada |
|---|---|
| slon, žirafa, tigar, krokodil | medvjed, konj, jablan, poskok |
| pingvin, kit | lastavica, divlja svinja |
| kameleon, deva, kaktus | hobotnica, čovječja ribica, smilje |
| banana, naranča (voće u zadatcima) | šljiva, marelica, smokva, trešnja, mandarina |
| Crvenkapica, Snjeguljica, Pepeljuga… | Šuma Striborova, Regoč, Kako je Potjeh tražio istinu, Šegrt Hlapić, Lutonjica Toporko, Bratac Jaglenac i sestrica Rutvica |
| Pinokio, Mali princ, Heidi, Alisa, Tom Sawyer, Ivica i Marica, Ružno pače | Veli Jože, Regoč, Grga Čvarak, Konjic sedlenjak, Zlatni danci, Alkar, Duh u močvari, Divlji konj, Koko i duhovi, Kad bi drveće hodalo, Zaljubljen do ušiju |
| pridjevi od stranih država | koprivnički, bjelovarski, gospićki, krčki, kninski, rovinjski, porečki, đakovački, vinkovački, krapinski, lički, baranjski |
| Tesla: Graz, New York | Smiljan, Memorijalni centar |
| predstava „Mačak u čizmama” | predstava „Šegrt Hlapić” |

**Postojeća baza:** pri pokretanju servera `services/obitelji.js → iskljuciStrano()` isključi (`isActive: false`) takva pitanja. Generator teme poslije daje zamjenska. Napredak djece ostaje.

**Test:** `npm run test:lokalno` (dio `test:sve`) ruši provjeru ako bilo koji generator ili tekst za čitanje spomene strani pojam izvan iznimaka.

## 4. Za učitelja ili učiteljicu (prije objave)

- Provjeriti autore lektire i naslove (`seeds/dodatci/hrvatski.js`, `DJELA`) prema popisu lektire škole.
- Magnet: navedeni su samo predmeti od željeza (čavao, spajalica, matica, pločica). Pribor za jelo od nehrđajućeg čelika često ga ne privlači, pa nije uključen.
- Teme „Pliva ili tone” i „Magnet” vezane su uz istraživanje svojstava tvari (PID OŠ A.3.1). U 2. razredu ostaju samo kao zaključivanje iz iskustva.
