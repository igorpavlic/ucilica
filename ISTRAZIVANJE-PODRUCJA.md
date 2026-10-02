# Nova područja i ime aplikacije — istraživanje

Datum: 2. 10. 2026. · razredi 1.–4.

Izvori su prikupljeni pretraživanjem; proxy ne pušta izravno čitanje
kurikula na mzom.gov.hr ni narodne-novine.nn.hr, pa su oznake ishoda
navedene prema sažecima i treba ih prije unosa u `gikEngine.js` provjeriti u
izvornom dokumentu.

---

## 0. Ime: „Pametnica” je također zauzeta

| Nositelj | Što je | Od kada | Sličnost |
|---|---|---|---|
| **Pametnica** (Irena Orlović, urednica u Harfi) | web-aplikacija s 1000+ radnih listova i edukativnih igara za rani razvoj djece od 3. godine; nagrada Moj Zaba Start | 2012. | **velika** — edukativna aplikacija za djecu |
| **pametnica.hr** / PAMETNICA d.o.o. | interaktivni ekrani i softver za škole i urede | „30 godina” na tržištu; d.o.o. od 2008. | velika — obrazovna tehnologija za škole; **domena `pametnica.hr` zauzeta** |
| **Pametnica** (pametnica.ba) | centar za produženi boravak i edukaciju djece u BiH | — | srednja |

**Zaključak:** „Pametnica” ima isti problem kao „Učilica” — postoji hrvatska
edukativna aplikacija za djecu tog imena, a domena `.hr` pripada drugoj tvrtki
iz obrazovne tehnologije. Ne preporučuje se.

Pretraga „Znalica” i „Vježbalica” nije pronašla aplikaciju za djecu tog imena
(što ne znači da žig ne postoji). Prije odluke za svako ime provjeriti:
TMview / DZIV (razredi 9, 28, 41), domenu `.hr`, Google Play i App Store.

---

## 1. Važna napomena o popisu područja

Popis područja koji je poslan gotovo se doslovno poklapa s popisom dodatnih
sadržaja proizvoda **Učilica (ucilica.tv)**: prometna kultura, „sportska kuća”,
„kuća zdravlja”, vježba tipkanja, emocionalna inteligencija, vjerska kultura…
Sami nazivi područja su opći pojmovi i nisu zaštićeni, ali:

- **sadržaj mora biti izvoran** — ne preuzimati pitanja, tekstove, slike ni
  redoslijed iz Učilice;
- **uporište je hrvatski kurikul** (predmeti i međupredmetne teme, NN 7/2019 i
  10/2019), ne tuđi proizvod — tako i izgleda drugačije i lakše se brani;
- dobro je pokazati razliku: Učilica nudi 40 000 fiksnih pitanja za 1.–8. r.;
  ova aplikacija nudi parametrizirane zadatke, ponavljanje po krivulji
  zaboravljanja, objašnjenja i dnevni izazov za 1.–4. r.

---

## 2. Kurikularna osnova — sedam međupredmetnih tema

Većina traženih područja nije poseban predmet nego **međupredmetna tema**
(provodi se kroz sve predmete). Oznaka očekivanja: kratica teme + domena +
ciklus + broj (npr. `osr A.1.1`). Prvi ciklus = 1. i 2. razred, drugi = 3.–5.

| Tema | Kratica | Domene | NN |
|---|---|---|---|
| Osobni i socijalni razvoj | `osr` | A Ja · B Ja i drugi · C Ja i društvo | 7/2019 |
| Zdravlje | `zdr` | A tjelesno zdravlje · B mentalno i socijalno · C pomoć i samozaštita | 10/2019 |
| Građanski odgoj i obrazovanje | `goo` | A ljudska prava · B demokracija · C društvena zajednica | 10/2019 |
| Održivi razvoj | `odr` | A povezanost · B djelovanje · C dobrobit | 7/2019 |
| Poduzetništvo | `pod` | A promišljanje · B djelovanje · C ekonomska i financijska pismenost | 7/2019 |
| Učiti kako učiti | `uku` | A strategije · B upravljanje učenjem · C emocije i motivacija · D okruženje | 7/2019 |
| Uporaba IKT | `ikt` | A funkcionalna i odgovorna uporaba · B komunikacija · C istraživanje · D stvaralaštvo | 7/2019 |

Uz to: predmeti **Tjelesna i zdravstvena kultura** (NN 27/2019), **Katolički
vjeronauk** (NN 10/2019, izborni), **Informatika** (NN 22/2018, izborna od
1. razreda od 2020./2021.) i **Kurikulum zdravstvenog odgoja** (NN 17/2013,
četiri modula).

---

## 3. Područja jedno po jedno

Za svako: **uporište** · **što je primjereno 1.–4. r.** · **vrsta zadataka u
aplikaciji** · **rizici** · **napor** (M mali / S srednji / V velik).

### 3.1. Snalaženje na tipkovnici

- **Uporište:** `ikt A.1.1` (uz pomoć učitelja odabire digitalnu tehnologiju za
  jednostavne zadatke) i izborna Informatika (domena *Digitalna pismenost i
  komunikacija*).
- **Dob:** dlan stane na tipkovnicu i prsti mogu pratiti položaj tek oko 7.–8.
  godine. Za 1.–2. r. samo **pronalaženje tipki** (slovo, razmak, Enter,
  Backspace, velika slova), za 3.–4. r. **osnovni red** (ASDF–JKLČ) i kratke
  riječi. Okvirni cilj: 8–9 g. oko 5–10 riječi u minuti, 9–10 g. 10–15.
- **Prilika:** postoje engleske igre (BBC Dance Mat Typing, KidzType), ali nije
  pronađena dječja vježba za **hrvatski raspored** sa Č, Ć, Ž, Š, Đ. To je
  stvarna praznina.
- **Zadatci:** novi tip `tipkanje` — prikaži slovo / slog / riječ, mjeri
  točnost (ne brzinu u ocjeni, kao i dosad); prikaz tipkovnice s istaknutom
  tipkom i prstom; riječi iz postojećeg rječnika `hr-imenice.js`.
- **Rizik:** na tabletu nema fizičke tipkovnice — modul prikazati samo kad je
  otkrivena tipkovnica. Ne ocjenjivati brzinu (isto načelo kao u ostatku).
- **Napor:** S (novi tip zadatka na frontendu, generator je jednostavan).

### 3.2. Prometna kultura

- **Uporište:** PID (sigurnost, put do škole — `PID OŠ C.1.2`, već postoji tema
  `sigurnost`), `zdr C.1.1` (oprez u svakodnevnom životu), `osr C.1.1`
  (prepoznaje opasne situacije).
- **Sadržaj po dobi:** pješak, nogostup, pješački prijelaz, semafor za pješake,
  vidljivost (reflektirajući prsluk — MUP ga dijeli prvašićima u akciji
  „Poštujte naše znakove”), autosjedalica i pojas, prijevoz autobusom; u
  3.–4. r. bicikl i osnovni prometni znakovi.
- **Činjenice iz zakona (za ključeve odgovora):** biciklom na cesti od 14 g.,
  iznimno od 9 g. uz pratnju osobe od 16+ ili s potvrdom o osposobljavanju;
  kaciga obavezna za vozače bicikla mlađe od 16 g.; dijete niže od 150 cm vozi
  se u sustavu za vezanje primjerenom visini i ne na prednjem sjedalu (od 3 g.).
- **Zadatci:** situacija → što učiniti (izbor), prepoznaj znak (opis znaka, ne
  slika dok nema SVG-a), točno/netočno, **poredak** (koraci prelaska ceste),
  plan raskrižja kao u `planMjesta()`.
- **Postoji javno:** Prometna Učilica (MUP/CARNET) — ne kopirati; može se
  uputiti roditelje na nju.
- **Rizik:** zakonske dobne granice se mijenjaju — staviti ih u jednu
  konstantu s datumom provjere.
- **Napor:** M–S (ručno pisani zadatci, više obitelji kao u `gen-pid-uvjeti.js`).

### 3.3. Sport

- **Uporište:** TZK (NN 27/2019): domena A kineziološka znanja (npr. `OŠ TZK
  A.1.1` prirodni načini gibanja), D zdravstveni i odgojni učinci (`OŠ TZK D.1.1`
  higijena pri vježbanju); `osr B` (suradnja), fair play.
- **Sadržaj:** prirodni oblici kretanja (hodanje, trčanje, skakanje, bacanje,
  penjanje), pravila momčadskih igara na razini razredne nastave (koliko
  igrača, što je gol/koš/aut), oprema i sigurnost, zagrijavanje, voda i odmor,
  **fair play** (HOO i Hrvatski školski sportski savez vode „Tjedan fair playa”
  i „Fair play karton”), olimpijski krugovi i vrijednosti.
- **Zadatci:** spoji sport s opremom/igralištem, situacija fair playa → što je
  pošteno, poredak zagrijavanje → igra → istezanje, prebroji igrače (spoj s
  matematikom).
- **Rizik:** pitanja o **sportašima i rezultatima** brzo zastarijevaju i nisu
  kurikularna — izbjegavati ili označiti datumom.
- **Napor:** M.

### 3.4. Odrastanje

- **Uporište:** `zdr A.1.1–A.2.x` (rast i razvoj), PID 4. r. (*Moje tijelo se
  mijenja*, `PID OŠ B.4.2`, već postoji tema `ljudsko-tijelo`), `osr A`
  (slika o sebi), modul *Spolna/rodna ravnopravnost i odgovorno spolno
  ponašanje* Kurikuluma zdravstvenog odgoja.
- **Primjereno 1.–4. r.:** rast (visina, zubi), san, higijena, osjećaji pri
  promjenama (polazak u školu, brat/sestra), **sigurnost tijela**: moje tijelo
  pripada meni, siguran i nesiguran dodir, tajne koje se ne čuvaju, kome se
  obratiti. U 4. r. tek uvod u promjene u pubertetu kako ga daje udžbenik PID-a.
- **Kome se obratiti:** roditelju, učiteljici, stručnoj službi škole;
  **Hrabri telefon za djecu 116 111** (besplatno, anonimno; za roditelje
  0800 0800).
- **Zadatci:** samo situacije „što možeš učiniti / kome reći” s objašnjenjem;
  **bez bodovanja „netočno”** u modulu sigurnosti tijela (povratna informacija
  „Bolje je reći odrasloj osobi kojoj vjeruješ, jer…”).
- **Rizik:** najosjetljivije područje. Sadržaj mora pregledati školski
  psiholog/pedagog i biti usklađen s modulom zdravstvenog odgoja; roditelj
  mora moći modul isključiti. Ne objavljivati bez stručne recenzije.
- **Napor:** S (sadržaj), V (recenzija).

### 3.5. Zdravstveni odgoj

- **Uporište:** `zdr` (sve tri domene) i **Kurikulum zdravstvenog odgoja**
  (2013.): moduli *Živjeti zdravo* (prehrana, higijena, kretanje — u 1. i
  2. r. po 6 sati), *Prevencija ovisnosti* (1. r.: lijekovi u okolini,
  računalne igre; 2. r.: odgovornost za zdravlje), *Prevencija nasilničkog
  ponašanja* (1. r.: kako se ponašamo prema djeci, odraslima i životinjama),
  *Spolna/rodna ravnopravnost*.
- **Sadržaj:** tanjur zdrave prehrane, voda umjesto zaslađenih pića, pranje
  ruku i zubi, san, ekrani (koliko i kada), lijekovi samo od odrasle osobe,
  prva pomoć na razini djeteta (pozovi odraslog, **112**), bolest i liječnik.
- **Zadatci:** razvrstaj namirnice (spajanje), poredak pranja ruku/zubi,
  situacija → postupak, „koliko čaša vode” (parametrizirano s matematikom).
- **Već postoji:** `tijelo`, `zdravlje-sigurnost-2`, `ljudsko-tijelo` — novo
  područje treba ih proširiti, ne udvostručiti.
- **Napor:** M.

### 3.6. Lijepo ponašanje

- **Uporište:** `osr B.1.1` (prepoznaje i uvažava potrebe i osjećaje drugih),
  `osr B.1.2` (komunikacijske kompetencije), `goo C` (razredna zajednica),
  modul *Prevencija nasilničkog ponašanja*.
- **Sadržaj:** pozdrav, molim–hvala–oprosti, čekanje reda, slušanje drugoga,
  ponašanje u razredu, za stolom, u prijevozu, kazalištu (dio već u
  `gen-mediji.js`), na igralištu; pristojna poruka i ponašanje na internetu.
- **Zadatci:** situacija → što reći / učiniti; dovrši rečenicu (spoj s HJ);
  koja poruka je pristojna.
- **Rizik:** izbjegavati moraliziranje i zastarjeli bonton; naglasak na
  **poštovanju**, ne na formalnim pravilima.
- **Napor:** M.

### 3.7. Učenje (učiti kako učiti)

- **Uporište:** `uku A.1.1` (informacije iz različitih izvora), `uku B.1.1`
  (uz podršku određuje cilj i pristup učenju), `uku C.1.1` (objašnjava
  vrijednost učenja), `uku D.1.1` (uređuje prostor za učenje).
- **Sadržaj:** mjesto za učenje (svjetlo, red, bez ekrana), stanke, ponavljanje
  nakon nekoliko dana (aplikacija to već radi — FSRS), pitati kad nešto ne
  razumiješ, provjeri sam sebe, pogreška je dio učenja.
- **Posebna prilika:** **metakognicija u samoj aplikaciji** — nakon kviza
  pitanje „Koliko si bio siguran?” i usporedba s rezultatom; kratki savjeti o
  učenju u objašnjenjima. To je jače od kviza „o učenju”.
- **Zadatci:** situacija → koji je bolji način učenja; poredak (pročitaj →
  podcrtaj → prepričaj → provjeri).
- **Napor:** M (sadržaj), S (samoprocjena sigurnosti).

### 3.8. Humane vrednote

- **Uporište:** `goo` (ljudska i dječja prava), `osr B`; program **Hrvatskog
  Crvenog križa „Humane vrednote”** (sporazum HCK i Ministarstva iz 2001.;
  tri dijela: odgoj za humanost, zdravstveni odgoj, razvoj socijalne
  osjetljivosti — tolerancija, empatija, stereotipi i predrasude).
- **Sadržaj:** pomoć drugome, solidarnost, različitost (djeca s teškoćama,
  druge kulture), dijeljenje, volontiranje na dječjoj razini, Crveni križ i
  njegov znak.
- **Zadatci:** situacija → kako pomoći; što je pošteno; spoji vrednotu s
  primjerom (empatija ↔ „pitam prijatelja kako se osjeća”).
- **Napor:** M. Može se tražiti suradnja s HCK-om (materijali, recenzija).

### 3.9. Emocionalna inteligencija

- **Uporište:** `osr A.1.2` (upravlja emocijama i ponašanjem), `osr B.1.1`,
  `zdr B` (mentalno zdravlje), `uku C` (emocije i motivacija u učenju).
- **Što kaže istraživanje:** sreću djeca prepoznaju rano; tugu, ljutnju i
  strah bolje između 6. i 9. g.; iznenađenje i gađenje kasnije (6–10 g.).
  Rječnik emocija raste s čitanjem i razgovorom i predviđa razumijevanje
  emocija. Programi socijalno-emocionalnog učenja (meta-analiza Durlak i sur.
  2011., 213 programa, 270 034 učenika) poboljšavaju i ponašanje i školski
  uspjeh (+11 percentila).
- **Sadržaj po dobi:** 1.–2. r. osnovne emocije (sreća, tuga, ljutnja, strah),
  situacija → kako se osjeća lik, što pomaže kad sam ljut (duboko disanje,
  brojanje, reći riječima); 3.–4. r. složenije (ljubomora, sram, ponos,
  razočaranje), **pomiješani osjećaji**, kako se drugi osjeća, kako pomoći.
- **Zadatci:** kratka priča → osjećaj lika (uz postojeće tekstove za čitanje);
  rječnik emocija (spoji riječ s opisom); strategije smirivanja (izbor).
  Emoji lica samo kao pomoć, ne kao jedini podražaj.
- **Rizik:** ne „dijagnosticirati” dijete; nema točnog odgovora na pitanje
  „Kako se TI osjećaš?” — takva pitanja bez bodova.
- **Napor:** S.

### 3.10. Religijska kultura

- **Uporište:** **Katolički vjeronauk** (NN 10/2019), izborni predmet — u
  osnovnoj školi bez alternativnog predmeta; npr. `OŠ KV A.1.1`. U RH se
  izvode i drugi konfesionalni vjeronauci (pravoslavni, islamski, židovski…).
- **Pravno i etički:** odabir vjeronauka pripada **roditeljima**; aplikacija za
  sve učenike ne smije podrazumijevati jednu vjeru.
- **Preporuka:** dvije razine:
  1. **Religijska kultura** (svima): blagdani i običaji u Hrvatskoj kao
     kulturna baština (Božić, Uskrs, Sveti Nikola…), poštovanje različitih
     vjera — uz postojeću temu `kulturna-bastina`;
  2. **Vjeronauk** kao **dodatni modul koji roditelj uključuje** u profilu,
     sadržaj strogo prema kurikulu, s recenzijom vjeroučitelja.
- **Napor:** S (1), V (2 — recenzija, više konfesija).

### 3.11. Interdisciplinarnost

- **Uporište:** kurikul potiče **tematsko poučavanje** i integrirane dane u
  razrednoj nastavi; međupredmetne teme su po definiciji interdisciplinarne.
- **Što to znači u aplikaciji:** zadatak koji traži dva predmeta odjednom:
  - tekst iz PID-a + pitanje iz matematike (već postoji u `vozni-red`,
    `podatci`);
  - **tematski tjedni**: „Jesen”, „Voda”, „Promet”, „Moj zavičaj” — kviz
    sastavljen iz više predmeta oko jedne teme (proširenje miješanog
    ponavljanja filtrom po oznaci `tags`).
- **Zadatci:** postojeći generatori uz oznaku teme; novi „projektni” zadatci
  (npr. planiranje izleta: vrijeme, novac, karta).
- **Napor:** M (oznake i filtar), S (novi zadatci).

### 3.12. Građanski odgoj

- **Uporište:** `goo`; za prvi i drugi ciklus: **dječja prava** (navodi ih
  svojim riječima, primjenjuje u svakodnevici, prepoznaje kršenje i zaštitu),
  pripadnost razrednoj i školskoj zajednici, **odgovoran odnos prema imovini i
  financijama**.
- **Sadržaj:** Konvencija o pravima djeteta na dječjoj razini (pravo na
  obrazovanje, igru, zaštitu, mišljenje), pravila razreda i zašto postoje,
  glasanje u razredu, predsjednik razreda, Vijeće učenika, pravobraniteljica
  za djecu, simboli RH (postoji `hrvatska-domovina`).
- **Zadatci:** situacija → koje se pravo krši / štiti; kako donijeti pravilo
  razreda (poredak); glasanje (spoj s podatcima — prebroji glasove).
- **Napor:** M.

### 3.13. Potrošačka prava

- **Uporište:** `pod C.1.3` (funkcija novca, novac povezan s radom, novcem
  zadovoljavamo potrebe), `goo` (odgovoran odnos prema financijama),
  **Nacionalni strateški okvir financijske pismenosti potrošača 2021.–2026.**,
  Zakon o zaštiti potrošača (pravo na obrazovanje potrošača); matematika —
  novac u eurima (već postoji `mjerenje-novac`).
- **Sadržaj primjeren 1.–4. r.:** potreba i želja, cijena i ostatak, štednja
  (kasica), **račun** — zašto ga čuvamo, **reklama želi prodati** (postoji u
  `gen-mediji.js`), rok trajanja na proizvodu, oštećen proizvod → roditelj
  ga može vratiti/reklamirati uz račun, usporedba cijena.
- **Zadatci:** parametrizirani (cijena, platio, ostatak; koja je kupnja
  jeftinija po komadu — 4. r.), potreba ili želja (razvrstavanje), pročitaj
  deklaraciju (tekst + rok trajanja).
- **Napor:** M — dobar kandidat za generator kao `gen-podatci.js`.

### 3.14. Ekologija

- **Uporište:** `odr A.1.1` (prepoznaje svoje mjesto i povezanost s drugima),
  `odr B.1.1` (važnost dobronamjernog djelovanja prema ljudima i prirodi),
  `odr C.1.1` (primjeri dobrog odnosa prema prirodi); PID (postoje
  `ekologija`, `tlo-voda-zrak`, `uvjeti-zivota`).
- **Sadržaj:** razvrstavanje otpada (papir, plastika i metal, staklo,
  biootpad, miješani), štednja vode i energije, ponovna uporaba, zaštićena
  priroda u Hrvatskoj (nacionalni parkovi), životinje i biljke zavičaja.
- **Zadatci:** razvrstaj otpad u spremnik (spajanje / izbor, parametrizirano
  iz skupa predmeta), čuva / onečišćuje (postoji), poredak recikliranja.
- **Rizik:** boje spremnika razlikuju se po gradovima — pitati o vrsti otpada,
  ne o boji; ili navesti da je boja primjer.
- **Napor:** M.

### 3.15. Igra „Brojevno polje”

- **Što je:** u didaktici razredne nastave „brojevno polje” je mreža brojeva
  (npr. 1–100 u deset redaka po deset — *tablica stotice*) ili brojevna crta s
  poljima. Na mreži se vide pravilnosti: +1 desno, +10 dolje, isti broj
  jedinica u stupcu — temelj mjesne vrijednosti (`MAT OŠ A.1.1`, `A.2.1`,
  `B.x.x` uzorci).
- **Igre koje se mogu napraviti (parametrizirano, beskonačno varijanti):**
  1. **Koji broj nedostaje** — dio mreže 3 × 3 sa skrivenim brojem;
  2. **Pomakni se** — „kreni od 34, dvaput dolje, jednom lijevo” → 53;
  3. **Tajanstveni broj** — tragovi („veći od 40, u stupcu s 7, paran…”);
  4. **Slagalica** — komad mreže treba smjestiti na pravo mjesto;
  5. 1. r. do 20 (dva reda), 2. r. do 100, 3.–4. r. do 1000 (koraci 10/100).
- **Novi tip prikaza:** mreža (`grid`) — mali Vue element kao postojeći
  grafikon; odgovor upisom ili klikom na polje.
- **Napor:** S (prikaz) + M (generator). Velika vrijednost: igra, ne kviz.

---

## 4. Sažetak i preporučeni redoslijed

| # | Područje | Uporište | Postoji u aplikaciji | Napor | Rizik | Prioritet |
|---|---|---|---|---|---|---|
| 1 | Igra brojevno polje | MAT A.1.1, A.2.1 | — | S | nizak | **1** |
| 2 | Ekologija | odr, PID | djelomično | M | nizak | **1** |
| 3 | Potrošačka prava | pod C, goo, MAT | novac, reklame | M | nizak | **1** |
| 4 | Prometna kultura | PID, zdr C, osr C | `sigurnost` | M | nizak | **1** |
| 5 | Zdravstveni odgoj | zdr, ZO kurikul | djelomično | M | nizak | 2 |
| 6 | Sport | TZK | — | M | nizak | 2 |
| 7 | Lijepo ponašanje | osr B, goo | — | M | nizak | 2 |
| 8 | Građanski odgoj | goo | `hrvatska-domovina` | M | nizak | 2 |
| 9 | Humane vrednote | goo, osr, HCK | — | M | nizak | 2 |
| 10 | Učenje | uku | FSRS, objašnjenja | M/S | nizak | 2 |
| 11 | Interdisciplinarnost | tematska nastava | podatci, vozni red | M | nizak | 2 |
| 12 | Emocionalna inteligencija | osr A/B, zdr B | — | S | srednji | 3 |
| 13 | Snalaženje na tipkovnici | ikt, Informatika | — | S | srednji (tablet) | 3 |
| 14 | Odrastanje | zdr, PID 4, ZO | `ljudsko-tijelo` | S/V | **visok** | 4 — samo uz stručnu recenziju |
| 15 | Religijska kultura / vjeronauk | KV (izborni) | blagdani | S/V | **visok** | 4 — kultura svima, vjeronauk kao modul koji uključuje roditelj |

### Tehničke posljedice

- **Novi predmet ili kategorija** „Za život” (ili po području) s istim
  `subjects`/`topics` modelom; ishodi s kraticama međupredmetnih tema
  (`osr A.1.2`) u `gikEngine.js`.
- **Moduli koje roditelj uključuje** (vjeronauk, odrastanje): polje u profilu,
  filtar u `createSession` i miješanom ponavljanju.
- **Pitanja bez točnog odgovora** (osjećaji, samoprocjena): tip koji se ne
  boduje i ne ulazi u FSRS.
- **Novi prikazi:** `grid` (brojevno polje), `tipkovnica`.
- **Recenzija:** `tools/recenzija-ucitelj.js` vrijedi i za nova područja; za
  osjetljiva područja dodati obaveznu ljudsku recenziju prije objave.

---

## 5. Izvori

**Ime**
- Pametnica (aplikacija, Školski portal): https://www.skolskiportal.hr/sadrzaj/pljesak-molim/pametnica-hrvatska-aplikacija-koja-razvija-djecju-inteligenciju/
- Pametnica (Netokracija): https://www.netokracija.com/pametnica-aplikacija-razvoj-djece-101582
- Pametnica (tportal): https://www.tportal.hr/tehno/clanak/pametnica-zeli-vase-dijete-uciniti-pametnijim-20150330
- pametnica.hr — interaktivni ekrani: https://pametnica.hr/
- PAMETNICA d.o.o.: https://www.companywall.hr/tvrtka/pametnica-doo/MMxKC6uY
- Učilica (sadržaj proizvoda): https://www.ucilica.tv/ucilica

**Kurikul**
- Međupredmetne teme (MZOM): https://mzom.gov.hr/istaknute-teme/odgoj-i-obrazovanje/nacionalni-kurikulum/medjupredmetne-teme/3852
- Osobni i socijalni razvoj (NN 7/2019): https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_7_153.html
- Zdravlje (NN 10/2019): https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_10_212.html
- Građanski odgoj i obrazovanje (NN 10/2019): https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_10_217.html
- Održivi razvoj (NN 7/2019): https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_7_152.html
- Poduzetništvo (NN 7/2019): https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_7_157.html
- Učiti kako učiti (NN 7/2019): https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_7_154.html
- Uporaba IKT (NN 7/2019): https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_7_150.html
- Tjelesna i zdravstvena kultura (NN 27/2019): https://narodne-novine.nn.hr/clanci/sluzbeni/2019_03_27_558.html
- Katolički vjeronauk (NN 10/2019): https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_10_216.html
- Informatika (NN 22/2018): https://narodne-novine.nn.hr/clanci/sluzbeni/2018_03_22_436.html
- Izborna informatika u razrednoj nastavi: https://mzom.gov.hr/vijesti/izborna-informatika-od-iduce-skolske-godine-za-ucenike-razredne-nastave/3726
- Kurikulum zdravstvenog odgoja (NN 17/2013): https://narodne-novine.nn.hr/clanci/sluzbeni/2013_02_17_291.html
- Nacionalni strateški okvir financijske pismenosti 2021.–2026.: https://narodne-novine.nn.hr/clanci/sluzbeni/2021_06_68_1316.html

**Područja**
- MUP, „Poštujte naše znakove”: https://mup.gov.hr/policijske-uprave/akcija-postujte-nase-znakove-edukativno-predavanje-ucenicima-prvih-razreda/241164
- Pravobraniteljica za djecu, djeca i bicikl: https://dijete.hr/hr/stajalite-i-preporuke-pravobraniteljice-o-sigurnosti-djece-u-vonji-biciklom/
- Zakon o sigurnosti prometa na cestama, izmjene (IUS-INFO): https://www.iusinfo.hr/aktualno/u-sredistu/nove-izmjene-zakona-o-sigurnosti-prometa-na-cestama-51693
- Prometna Učilica (MUP/CARNET): https://ucilica.skole.hr/o-prometnoj
- Hrvatski školski sportski savez, Fair play karton: https://skolski-sport.hr/projekti/fair-play-karton/
- Tjedan fair playa: https://skolski-sport.hr/projekti/tjedan-fair-playa-u-mojoj-skoli
- HCK, Humane vrednote: https://www.hck.hr/edukacije-publikacije/edukacije-hrvatskog-crvenog-kriza/za-volontere/humane-vrednote-unutar-kurikuluma-za-medjupredmetnu-provedbu-gradjanskog-odgoja-i-obrazovanja/5475
- Hrabri telefon za djecu (116 111): https://djeca.hrabritelefon.hr/
- Durlak i sur. (2011), meta-analiza SEL: https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-8624.2010.01564.x
- Prepoznavanje emocija na licu u djetinjstvu: https://link.springer.com/article/10.1007/s10339-022-01086-1
- Rječnik emocija 4–11 g.: https://link.springer.com/article/10.1007/s42761-021-00040-2
- Dob za učenje tipkanja: https://funtech.co.uk/latest/what-age-should-a-child-learn-to-type
- BBC Dance Mat Typing (pregled): https://www.commonsensemedia.org/website-reviews/dance-mat-typing
- Tablica stotice — igre: https://denisegaskins.com/2008/09/22/things-to-do-hundred-chart/
- Edukativne igre u nastavi matematike (Poučak): https://hrcak.srce.hr/file/279568
- Zakon o elektroničkim medijima (oglašavanje i maloljetnici): https://www.zakon.hr/z/196/zakon-o-elektronickim-medijima
- Vjeronauk u školama (Eurydice): https://eurydice.eacea.ec.europa.eu/hr/eurypedia/croatia/poucavanje-i-ucenje-u-osnovnoj-skoli
