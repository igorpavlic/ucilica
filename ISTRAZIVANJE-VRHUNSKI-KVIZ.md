# Vrhunski kviz za razrednu nastavu (1.–4. razred): analiza i istraživanje

*Listopad 2026. Dokument ima dva dijela. Prvi je analiza prijavljene greške u kodu Mudroline („isto pitanje dvaput zaredom, provjera ne radi”). Drugi je istraživanje kako napraviti vrhunski kviz koji prati nastavu, s usporedbom onoga što Mudrolina već ima.*

---

## Dio A: analiza prijave „Poredaj korake za pranje ruku”

### Što je prijavljeno
Dijete je na 2. od 7 pitanja u temi „Algoritmi i logika” dobilo zadatak „Poredaj korake za „pranje ruku” pravim redom.”. To je pitanje već vidjelo neposredno prije, u istom obliku. Uz to, provjera „ne radi”.

### Kako je provjereno
Aplikacija je pokrenuta lokalno: MongoDB u memoriji, baza napunjena za 1. i 2. razred, backend i Vite. Zatim su provedena tri testa:
- kroz API su odigrani kvizovi kao gost, kao prijavljeno dijete i kao dijete koje kviz napusti;
- u Chromiumu je kviz kliknut do kraja: redoslijed je slagan strelicama, mišem i dodirom (touch);
- simulirani su istek sesije i dijeljena IP adresa.

### Nalazi (uzroci)

| # | Uzrok | Posljedica za dijete | Dokaz |
|---|---|---|---|
| 1 | **Pitanja iz napuštenog kviza ne bilježe se kao viđena.** „Viđeno” se čitalo samo iz `progress`, a zapis nastaje tek pri predaji cijelog kviza. | Dijete otvori kviz, zapne ili izađe, otvori ponovo i dobije ista pitanja, često na istom mjestu. | Prijavljeno dijete: nakon napuštenog kviza ponovljeno je **3, 5 i 6 od 7** pitanja. |
| 2 | **Gost uopće nema povijest.** `nedavnoVidjeno` bez korisnika vraća prazan skup. | Svaki novi kviz ima ista pitanja (npr. „Razvrstavamo životinje…” uvijek na prvom mjestu). | Tri uzastopna gostujuća kviza počinju istim pitanjem. |
| 3 | **Sesija je živjela samo 6 sati** (TTL indeks na `quiz_attempts`). | Kviz ostavljen otvoren preko noći ili na tabletu: svaka „Provjeri” vraća 404 „Kviz sesija nije pronađena”. Poruka nestaje nakon 4 s, dijete ne može dalje, izađe i ponovo dobije isto pitanje (uzrok 1). **To je najvjerojatniji uzrok „provjera ne radi”.** | Brisanjem sesije usred kviza: gumb ne radi, a poruka u traci nestaje. |
| 4 | **Globalni limit od 200 zahtjeva u 15 minuta po IP adresi**, i za provjeru odgovora. | Razred u školi dijeli jednu javnu IP adresu, a jedan kviz je oko 10 zahtjeva. Nakon nekoliko minuta svaka provjera vraća 429. | `middleware/rateLimiter.js`, `server.js` (`app.use('/api', apiLimiter)`). |
| 5 | **Ista zadaća u bazi pod dvije formulacije.** Starija verzija generatora upisala je „Poredaj korake za „…””, a nova upisuje „Poredaj korake algoritma za „…””. Obitelj pitanja i ključ prikaza razlikuju se zbog jedne riječi. | Oba pitanja mogu doći u isti kviz, jedno za drugim, s istim koracima. Dijete to vidi kao isto pitanje dvaput. | Tekst na snimci zaslona postoji samo u commitu `2612c36`. Trenutni generator ima „algoritma” i napomenu (hint), a ona na snimci nedostaje. |
| 6 | **Miješanje koraka ponekad vrati točan redoslijed** (uz 3 koraka u 1 od 6 slučajeva). | Zadatak je „riješen” bez ijednog poteza. | API: kviz s već poredanim koracima. |
| 7 | **Nakon pogrešnog redoslijeda dijete ne vidi gdje je pogriješilo.** Prikazuje se samo dugi niz „A → B → C → D”. | Slaba povratna informacija (vidi B.1.5). | Snimka zaslona. |

Logika ocjenjivanja na serveru (`evaluateQuestion` za `ordering`) **je ispravna**. Točan redoslijed složen strelicama, mišem ili dodirom u svim je testovima ocijenjen kao točan. Kvar nije u usporedbi odgovora, nego u sesiji, limitu i ponavljanju.

### Što je popravljeno

**Ponavljanje pitanja (uzroci 1, 2 i 5)**
- `questionGenerator.nedavnoPrikazano` + `vidjenoIPrikazano`: pitanja iz zadnjih 5 nepredanih sesija vrijede kao „svježe viđena” i ne vraćaju se. To vrijedi i za temu i za miješano ponavljanje.
- Gost dobiva nasumičnu oznaku uređaja (`ucilica_gost` u pregledniku, zaglavlje `X-Gost-Id`). Oznaka nije osobni podatak i briše se sa sesijom. Obavijest o privatnosti je dopunjena.
- `kljucSadrzaja` + `bezDvostrukih`: u jednom kvizu nikad dvaput isti prikaz ni isti niz koraka ili parova, bez obzira na formulaciju. Isti sadržaj iz zadnja tri kviza ne smatra se novim.

**Provjera koja ne prolazi (uzroci 3 i 4)**
- Sesija sada traje **3 dana**. Postojeći TTL indeks ažurira se sam (`collMod`).
- Neuspjela provjera **ostaje vidljiva na kartici**. Ako je sesija istekla, nudi se gumb „Započni novi kviz”. Inače se ispisuje uputa da dijete ponovo pritisne „Provjeri”.
- Provjera odgovora ima vlastiti limit **po kviz-sesiji** (60 provjera u minuti), a ne po IP adresi. Globalni limit je 600 i može se podesiti preko `API_LIMIT_MAX`.

**Zadatak „poredaj” (uzroci 6 i 7)**
- Promiješani koraci nikad nisu već točan redoslijed.
- Nakon provjere svaki je korak označen ✓ ili ✗. Pravi redoslijed prikazuje se kao numerirani popis s brojem točno postavljenih koraka.

**Testovi:** `npm run test:sve` prolazi. U `test:tijek` je dodano šest provjera za gornje slučajeve. Ponovljena prava reprodukcija preko API-ja pokazuje **0 od 7** ponovljenih pitanja nakon napuštenog kviza, i za prijavljeno dijete i za gosta.

### Preporuka za produkcijsku bazu
Stara pitanja s tekstom „Poredaj korake za „…” pravim redom.” mogu se deaktivirati. Ne smetaju više jer ih `bezDvostrukih` drži odvojeno, ali su višak:
```js
db.questions.updateMany({ type: 'ordering', question: /^Poredaj korake za „/ }, { $set: { isActive: false } })
```

---

## Dio B: istraživanje

### 0. Sažetak u 10 točaka
1. **Dohvaćanje iz pamćenja i raspoređeno ponavljanje** su jedine dvije tehnike s ocjenom „visoka korisnost” u preglednom radu Dunlosky i sur. (2013). Mudrolina ih ima: kviz i FSRS.
2. **Miješanje tipova zadataka** (interleaving) posebno pomaže u matematici. U 4. razredu rezultat je bio 77 % naspram 38 % dan kasnije (Taylor & Rohrer, 2010). U 7. razredu bio je 61 % naspram 38 % nakon mjesec dana (Rohrer i sur., 2019).
3. **Pogrešno pitanje ne ponavljati odmah**, nego nakon 3–5 drugih pitanja u istoj sesiji, kao „blizanca” (isti predložak, drugi brojevi). Nakon toga ga treba predati FSRS-u (Butler, Karpicke & Roediger, 2007).
4. **Povratna informacija treba se odnositi na zadatak, ne na dijete.** Mlađima i slabijima treba dati neposrednu i objašnjavajuću povratnu informaciju (Hattie & Timperley, 2007; Shute, 2008).
5. **Netočne ponuđene odgovore graditi iz tipičnih dječjih pogrešaka** i uvijek ih popratiti ispravkom (Roediger & Marsh, 2005).
6. **U 1. i 2. razredu** potrebni su čitanje naglas uz svako pitanje, malo teksta, velike dodirne površine i alternativa povlačenju (WCAG 2.5.7).
7. **Svako pitanje treba službenu oznaku ishoda** (`MAT OŠ A.1.1`, `PID OŠ B.2.1`, `OŠ HJ A.1.1`, `B.2.1` za Informatiku) i mjesečni plan prema GIK-u, kako bi kviz „pratio razred”.
8. **Ovladanost mjeriti po ishodu** (po uzoru na IXL SmartScore i razine u Khan Academyju). Razina „usvojeno” traži točan odgovor i u miješanoj provjeri.
9. **Igrifikacija neka nagrađuje trud i napredak.** Niz dana treba imati zaštitu, a „srca” koja zaključavaju učenje ne smiju postojati (Deci, Koestner & Ryan, 1999; ICO Children’s Code).
10. **GDPR:** u Hrvatskoj je dobna granica za privolu 16 godina (čl. 19. ZPOU, NN 42/2018). Za djecu od 6 do 10 godina treba provjerljiva privola roditelja i najmanja moguća količina podataka.

### 1. Znanost o učenju

**1.1 Dohvaćanje iz pamćenja**
- Roediger i Karpicke (2006): ponovljeno testiranje dalo je bitno bolje zadržavanje nakon 2 dana i nakon 1 tjedna nego ponovljeno čitanje. https://psychology.ecu.edu/wp-content/pv-uploads/sites/216/2019/03/Roediger-Karpicke-2006.pdf
- Dunlosky i sur. (2013) ocjenu „visoka korisnost” daju samo vježbanju kroz testiranje i raspoređenom vježbanju. https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html
- Za Mudrolinu: kratke i česte sesije (5–10 minuta) bolje su od rijetkih dugih.

**1.2 Raspoređeno ponavljanje**
- Kang (2016) pokazuje da raspoređeno ponavljanje poboljšava pamćenje i primjenu, osobito kad se ponavlja kroz testiranje. https://journals.sagepub.com/doi/10.1177/2372732215624708
- Djeluje i u prvim razredima. https://escholarship.org/content/qt3js5421r/qt3js5421r.pdf
- FSRS: https://github.com/open-spaced-repetition/r-fsrs
- Za Mudrolinu: FSRS kod generiranih pitanja treba pratiti **vještinu ili predložak**, ne pojedini primjerak. Mudrolina to već radi (`gik.skillId`).

**1.3 Miješanje tipova zadataka**
- Taylor & Rohrer (2010), 4. razred: 77 % naspram 38 %. https://www.learningscientists.org/blog/2021/10/28-1
- Rohrer i sur., randomizirano istraživanje u 54 razreda: 61 % naspram 38 % nakon mjesec dana. https://ies.ed.gov/use-work/awards/efficacy-study-interleaved-mathematics-practice
- Kornell & Bjork (2008). https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/07/Kornell_Bjork_2008_PsychScience.pdf
- Za Mudrolinu: novu vještinu uvesti kratkim blokom (3–5 pitanja), a u ponavljanju miješati vještine iste domene.

**1.4 Poželjne poteškoće.** Teže vježbanje daje bolje dugoročno učenje, ali samo dok je zadatak djetetu savladiv. Duolingo cilja srednju vjerojatnost točnog odgovora. https://blog.duolingo.com/learning-how-to-help-you-learn-introducing-birdbrain (Mudrolina: Elo s ciljem od oko 75 %.)

**1.5 Povratna informacija**
- Hattie & Timperley (2007): najjače djeluje povratna informacija o zadatku i postupku, a pohvala je među najslabijima. https://www.uky.edu/~gmswan3/575/Hattie_Timperly_2007.pdf
- Shute (2008): mlađima i slabijima treba neposredna i objašnjavajuća povratna informacija.
- Butler, Karpicke & Roediger (2007): razmak prije ponovnog pokušaja poboljšava zadržavanje. https://profiles.wustl.edu/en/publications/the-effect-of-type-and-timing-of-feedback-on-learning-from-multip/
- Metcalfe (2017): pogreške su korisne ako slijedi ispravak. https://www.learningscientists.org/blog/2019/10/17-1
- Za Mudrolinu:
  - odmah prikazati točno ili netočno i jednu rečenicu objašnjenja, pročitanu naglas;
  - pogrešku vratiti nakon 3–5 pitanja;
  - pokazati **gdje** je pogreška. To je sada napravljeno za zadatke s redoslijedom.

**1.6 Riješeni primjeri koji postupno nestaju.** Za početnike su bolji od samostalnog rješavanja, a za naprednije su suvišni (efekt obrata stručnosti). https://openlearning.mit.edu/mit-faculty/research-based-learning-findings/worked-and-faded-examples

**1.7 Učenje do ovladanosti.** Prosječni učinak je +0,52 SD, a jači je kod slabijih učenika (Kulik i sur., 1990). https://journals.sagepub.com/doi/10.3102/00346543060002265

### 2. Oblikovanje pitanja za mlađu djecu

**2.1 Pravila za pisanje pitanja s višestrukim izborom** (Haladyna i sur., 2002). https://bookdown.org/stefanmosjos/manualesitems/_book/haladyna-2002.html
- Jedna ideja po pitanju.
- Pitanje postavljeno potvrdno; ako se negacija ne može izbjeći, istaknuti je.
- Ponuđeni odgovori slične duljine.
- Brojčane odgovore poredati uzlazno.
- Ne koristiti „sve navedeno”.
- Za djecu su dovoljna 3 ponuđena odgovora.
- Položaj točnog odgovora ravnomjerno raspoređen.

**2.2 Netočni odgovori iz tipičnih pogrešaka.** Takvi odgovori kviz pretvaraju u dijagnostički alat. https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2020.537531/pdf
Svaki netočni odgovor treba nositi oznaku pogreške. Primjeri:
- **MAT:** zamjena operacije, „manji od većeg”, izostavljen prijelaz desetice, zamjena < i >;
- **HJ:** ije/je, č/ć, veliko početno slovo;
- **PID:** „kit je riba”, zamjena strana svijeta;
- **INF:** zamjena ulaznih i izlaznih uređaja, „lozinku smijem reći prijatelju”.

Uvijek treba prikazati točan odgovor (Roediger & Marsh, 2005). https://scholars.duke.edu/publication/677292

**2.3 Izbjegavanje ponavljanja**
- Isti primjerak se ne ponavlja u sesiji, osim kao namjerni ponovni pokušaj.
- Isti predložak ne više od dva puta zaredom, ista vrsta pitanja ne više od tri puta zaredom.
- Prikazano mora biti zapamćeno **čim se prikaže, a ne tek nakon predaje**. To je ključna pouka iz Dijela A.

**2.4 Čitanje naglas (TTS) u 1. i 2. razredu**
- Najviše pomaže kod pitanja koja su matematički laka, a teška za čitanje. https://ici.umn.edu/products/294 · https://nceo.umn.edu/publications/OnlinePubs/Tech67/default.htm
- Pitanje i ponuđeni odgovori trebaju se čitati automatski, osim u zadacima koji provjeravaju čitanje.
- Rečenice do 8–10 riječi.

**2.5 Redanje i povlačenje na dodirnom zaslonu**
- Djeca mlađa od 5 godina loše povlače. https://research.tue.nl/en/publications/children-may-expect-drag-and-drop-instead-of-point-and-click/
- Dodirne površine od najmanje 48 dp. https://lisa-anthony.com/wp-content/uploads/2013/04/anthony-et-al-jpuc2013.pdf
- WCAG 2.5.7 traži alternativu povlačenju: https://kb.daisy.org/publishing/docs/wcag/dragging-movements.html
- Ništa se ne ocjenjuje prije „Provjeri”. Treba dati djelomične bodove i označiti samo pogrešno postavljene stavke.

### 3. Kako to rade vodeći proizvodi

| Proizvod | Što preuzeti |
|---|---|
| **Duolingo** | Birdbrain cilja srednju težinu. Pogrešni zadaci vraćaju se **na kraju lekcije**, a ne odmah. „Srca” su zamijenjena „energijom” koja ne kažnjava pogreške. https://blog.duolingo.com/review-exercises-help-measure-learner-recall |
| **IXL SmartScore** | Ljestvica 0–100 s „Challenge Zone” iznad 90. Kritika: djeca kazne u toj zoni doživljavaju kao kažnjavanje. https://www.ixl.com/materials/SmartScore_Guide.pdf · https://www.boddlelearning.com/article/ixl-punishes-wrong-answers |
| **Khan Academy** | Razine Pokušano → Upoznato → Vješto → Usvojeno. „Usvojeno” se dobiva tek u miješanoj provjeri. https://support.khanacademy.org/hc/bg/articles/5548760867853 |
| **Prodigy** | Ulazni test počinje razred niže i ponavlja se dvaput godišnje. https://prodigygame.com/main-en/blog/prodigy-placement-test |
| **Matific** | Kratke epizode vezane uz kurikulum i spiralna progresija. https://www.matific.com/home/why-matific/validation |
| **Seesaw** | Roditelj vidi samo svoje dijete. |
| **e-Škole / Edutorij** | Pretežno od 5. do 8. razreda. **Razredna nastava je tržišna praznina.** https://www.carnet.hr/?p=750 |

**Strategija „pogreška → kasnije ponovo”:**
1. Odmah kratka povratna informacija s objašnjenjem.
2. Nakon 3–5 pitanja dolazi „blizanac”.
3. Ako ponovo pogriješi: riješeni primjer i lakši prethodni korak.
4. Na kraju sesije krug „Popravimo pogreške”.
5. FSRS ocjena *Again*.
6. U svaku sesiju ubaciti 1–2 pitanja starog gradiva.

### 4. Usklađivanje s hrvatskim kurikulumom

**Službeni izvori:**
- Matematika (NN 7/2019): https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_7_146.html
- Priroda i društvo: https://mzom.gov.hr/UserDocsImages/dokumenti/Publikacije/Predmetni/Kurikulum%20nastavnog%20predmeta%20Priroda%20i%20drustvo%20za%20osnovne%20skole.pdf
- Informatika (NN 22/2018; izborni predmet od 1. do 4. razreda): https://narodne-novine.nn.hr/clanci/sluzbeni/2018_03_22_436.html
- Hrvatski jezik (NN 7/2019): https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_7_139.html
- GIK-ovi: https://i-nastava.gov.hr/

**Oznake i domene:**

| Predmet | Primjer | Domene |
|---|---|---|
| MAT | `MAT OŠ A.1.1` | A Brojevi · B Algebra i funkcije · C Oblik i prostor · D Mjerenje · E Podatci |
| HJ | `OŠ HJ A.1.1` | A Jezik i komunikacija · B Književnost i stvaralaštvo · C Kultura i mediji |
| PID | `PID OŠ B.2.1` | A Organiziranost svijeta · B Promjene i odnosi · C Pojedinac i društvo · D Energija |
| INF | `B.2.1` | A Informacije i digitalna tehnologija · B Računalno razmišljanje · C Digitalna pismenost · D e-Društvo |

Ishodi imaju razine usvojenosti: zadovoljavajuća, dobra, vrlo dobra i iznimna. Ovladanost treba računati po vještini, a zatim je zbrojiti po ishodu.

**„Pratiti razred”:**
- zadani mjesečni plan prema GIK-u i udžbeničkim nizovima (npr. *Moj sretni broj*, *Nina i Tino*);
- jednim klikom „sada učimo X”;
- odnos sadržaja: oko 60 % aktualna tema, oko 30 % FSRS ponavljanje, oko 10 % izazov;
- ljetni način rada.

### 5. Igrifikacija, nadzorne ploče i privatnost
- **Nagrade:** Deci, Koestner i Ryan (1999) pokazuju da očekivane nagrade za sudjelovanje smanjuju unutarnju motivaciju. https://depts.washington.edu/techdocs/papers/deciExtrinsicRewardsAndIntrinsicMotivation99.pdf
  - Nagrađivati napredak i ovladanost, a neočekivane nagrade koristiti kao iznenađenje.
  - Bez javnih ljestvica poretka i bez mjerenja vremena kod mlađe djece.
- **Niz dana:** neka bude tjedni i s automatskom zaštitom, bez poruka „izgubit ćeš niz”. https://blog.duolingo.com/duolingo-streak-research/
- **Roditelj:** tjedni sažetak, usvojeni ishodi, tipične pogreške, prijedlog aktivnosti izvan zaslona.
- **Učitelj:** toplinska karta razred × ishod, zadavanje teme.
- **GDPR:**
  - račun otvara roditelj, a dijete koristi nadimak;
  - najmanja moguća količina podataka, hosting u EU, DPIA;
  - ugovor o obradi podataka (čl. 28.) sa školama;
  - zadane postavke prema ICO Children’s Codeu. https://childreninthedigitalworld.twobirds.com/home/croatia

### 6. Što Mudrolina već ima i što nedostaje

| Preporuka | Stanje u Mudrolini |
|---|---|
| Raspoređeno ponavljanje po vještini | ✅ FSRS po `gik.skillId` (`services/vjestine.js`) |
| Ciljana težina oko 75 % | ✅ Elo po predmetu (`services/tezina.js`) |
| Bez ponavljanja primjerka i predloška | ✅ obitelji, ključ prikaza, najviše 2 po obitelji · **popravljeno:** napušteni kviz, gost, ista zadaća pod drugim tekstom |
| Oznake ishoda | ✅ GIK metapodaci (`services/gikEngine.js`) |
| Opseg „obrađeno gradivo” | ✅ `services/obradjeno.js` |
| Alternativa povlačenju | ✅ strelice (WCAG 2.5.7) |
| Bez kazne za pogrešku | ✅ nema „srca” |
| Objašnjenje uz odgovor | ✅ `objasnjenje` · **novo:** ✓/✗ po koraku kod redoslijeda |
| Čitanje naglas | ⚠️ samo na gumb i samo s hrvatskim glasom; nema automatskog čitanja u 1. i 2. razredu |
| Pogrešku vratiti kasnije u sesiji („blizanac”) | ❌ nema; sljedeći je korak (P0) |
| Krug „Popravimo pogreške” na kraju | ❌ nema |
| Netočni odgovori označeni tipičnom pogreškom | ❌ nema (P1) |
| Razine ovladanosti po ishodu | ❌ nema (P1) |
| Mjesečni plan prema GIK-u | ⚠️ ručno „obrađeno”, bez kalendara (P2) |
| Nadzorne ploče za roditelja i učitelja | ⚠️ profil; nema pogleda razred × ishod (P2) |
| Tjedni niz s automatskom zaštitom | ⚠️ dnevni niz za dnevni izazov (P3) |
| Privola roditelja | ✅ registracija s privolom, izvoz i brisanje |

### 7. Preporuke po prioritetu

**P0, odmah**
1. Red ponavljanja pogrešaka u sesiji: pogreška → objašnjenje → „blizanac” nakon 3–5 pitanja → krug „Popravimo pogreške” na kraju → FSRS ocjena *Again*.
2. Automatsko čitanje naglas u 1. i 2. razredu, osim u zadacima koji provjeravaju čitanje. Za uređaje bez hrvatskog glasa unaprijed snimiti zvuk.
3. Djelomični bodovi i označavanje pogrešnog i kod spajanja parova (kod redoslijeda je napravljeno).

**P1, kvaliteta učenja**
4. Netočni odgovori s oznakom tipične pogreške i ciljana povratna informacija.
5. Razine ovladanosti po ishodu: Novo → Upoznato → Vješto → Usvojeno, gdje „Usvojeno” traži miješanu provjeru i FSRS stabilnost.
6. Riješeni primjeri nakon druge pogreške na istoj vještini.
7. Ulazni test koji počinje razred niže.

**P2, praćenje razreda**
8. Mjesečni plan prema GIK-u s izborom udžbeničkog niza (60/30/10).
9. Nadzorna ploča za roditelja (tjedni sažetak) i za učitelja (razred × ishod).
10. Ljetni način rada.

**P3, motivacija i propisi**
11. Tjedni niz sa zaštitom i neočekivane nagrade.
12. Kao glavnu mjeru pratiti **točnost odgođenog ponavljanja**, a ne točnost unutar sesije. A/B testovi razmaka i udjela miješanja.

### Napomene o pouzdanosti
- Stranica NN 7/2019 bila je nedostupna (503), pa su formulacije ishoda preuzete iz školskih kriterija vrednovanja. Puni popis treba izvući iz službenih tekstova.
- Duolingo ne objavljuje algoritam. Ponavljanje pogrešaka na kraju lekcije opisano je prema njihovom blogu i sekundarnim izvorima.
