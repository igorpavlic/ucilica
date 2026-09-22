# Učilica – kompletna analiza koda, pitanja, kurikuluma i vrednovanja

Datum revizije: 22. 9. 2026.

## 1. Sažetak

Pregledan je cijeli projekt za 1.–4. razred: generatori pitanja, spremanje pitanja u bazu, prikaz kviza, provjera odgovora, bodovanje, adaptivni odabir težine i FSRS ponavljanje vještina.

Najveći tehnički problem bio je stvaran i mjerljiv: položaj točnog odgovora bio je izrazito predvidljiv. U staroj funkciji `sh()` nije se koristila stvarna nasumična permutacija, nego deterministička formula. Ako je generator sastavio odgovore redom `[točan, netočan, netočan, netočan]`, ta je formula vrlo često premještala točan odgovor na četvrto mjesto.

Audit prije izmjene, 40 generiranja svih pitanja s četiri ponuđena odgovora:

| Razred | Pitanja u uzorku | 1. mjesto | 2. mjesto | 3. mjesto | 4. mjesto |
|---|---:|---:|---:|---:|---:|
| 1. | 39 120 | 11,1 % | 7,8 % | 5,7 % | **75,4 %** |
| 2. | 24 413 | 4,6 % | 2,3 % | 2,6 % | **90,5 %** |
| 3. | 12 680 | 13,6 % | 5,0 % | 2,5 % | **78,9 %** |
| 4. | 8 480 | 18,4 % | 7,1 % | 4,2 % | **70,3 %** |

Nakon izmjene zajedničkoga `fix()`/`sh()` sloja i ponavljanja istoga audita:

| Razred | Pitanja u uzorku | 1. mjesto | 2. mjesto | 3. mjesto | 4. mjesto |
|---|---:|---:|---:|---:|---:|
| 1. | 39 063 | 25,1 % | 25,3 % | 24,7 % | 24,9 % |
| 2. | 24 193 | 24,9 % | 25,1 % | 25,1 % | 24,9 % |
| 3. | 8 398 | 25,5 % | 24,8 % | 24,2 % | 25,5 % |
| 4. | 8 180 | 25,0 % | 25,5 % | 25,0 % | 24,4 % |

Dodatno je uvedeno **nasumično preslagivanje ponuđenih odgovora za svaku pojedinu kviz-sesiju na backendu**. Zbog toga ni već postojeća pitanja u MongoDB-u više ne odaju točan odgovor položajem. Redoslijed se čuva uz pokušaj i backend ga pravilno mapira natrag na izvorni `correctIndex`.

## 2. Što je promijenjeno u kodu

### 2.1. Položaj točnog odgovora

Promijenjeni su:

- `backend/seeds/gen-hrvatski.js`
  - `sh()` sada koristi Fisher–Yates algoritam.
  - `fix()` nakon deduplikacije promiješa **svaki** skup ponuđenih odgovora i ponovno izračuna `correctIndex`.
- `backend/modules/quiz/quiz.service.js`
  - za svaku novu sesiju nastaje zaseban `answerOrder` za svako choice pitanje;
  - klijent dobiva odgovore tim novim redom;
  - server sprema raspored u `quiz_attempts.answer_orders`;
  - provjera odgovora prevodi indeks s ekrana natrag u izvorni indeks;
  - stari pokušaji bez `answer_orders` i dalje rade zbog fallbacka.
- `backend/test/provjeri-pedagogiju.js`
  - dodan automatski test raspodjele točnog odgovora;
  - test pada ako bilo koja od četiri pozicije na većem uzorku ode ispod 20 % ili iznad 30 %.

To je važnije od samoga shufflea prilikom seeda: čak i kada je pitanje u bazi spremljeno s točnim odgovorom na prvome mjestu, dijete ga u dvije različite sesije može vidjeti na različitim mjestima.

## 3. Analiza sadržaja po razredima

### 1. razred

Generatori su sadržajno najstabilniji dio projekta. Zadržane su osnovne teme: slova i glasovi, riječi i rečenice, brojevi do 20, zbrajanje/oduzimanje, usporedbe, osnovni geometrijski pojmovi, godišnja doba, tijelo, obitelj, sigurnost i okoliš.

Ključna izmjena za cijeli 1. razred je uklanjanje pozicijskoga uzorka odgovora. Postojeći mehanički testovi dodatno provjeravaju gramatičko slaganje, rod, broj, duplikate odgovora, preduga pitanja, nepotpune rečenice i neupisive emoji odgovore.

Preporuka za sljedeću sadržajnu iteraciju: više zadataka s kratkim kontekstom i promatranjem, a manje izoliranih činjenica. To je posebno važno za Prirodu i društvo, čiji kurikulum naglašava iskustveno i istraživačko učenje.

### 2. razred – Hrvatski jezik

Izvorno je dio pitanja bio postavljen kao formalno gramatičko kategoriziranje koje je bilo iznad ili sa strane naglaska ishoda A.2.5. Kurikulum u 2. razredu traži uporabu i objašnjavanje riječi u komunikacijskoj situaciji te prepoznavanje oglednih i čestih imenica s konkretnim značenjem.

Promjene:

- tema **„Imenice i rod”** prikazuje se kao **„Imenice”**;
- uklonjeno je sustavno ispitivanje gramatičkoga roda imenica u 2. razredu;
- pitanja su prebačena prema prepoznavanju riječi koje imenuju osobu, životinju, predmet, mjesto i pojavu;
- tema **„Glagoli”** preoblikovana je prema riječima i značenju u kontekstu;
- `Footballer` je zamijenjen s `nogometaš`;
- pitanje sa slike **„Što radi pilot?”** više nema neprecizan odgovor „leti”, nego **„upravlja zrakoplovom”**;
- zanimanja i radnje formulirani su na hrvatskom i u jednostavnijem, konkretnom kontekstu.

### 2. razred – Matematika

Promjene:

- novac je prebačen s **kuna/kn na euro/€**;
- dodan je gramatički oblik imenice `euro` za generiranje tekstualnih zadataka;
- prometni znak STOP više nije klasificiran kao šesterokut, nego kao **osmerokut**;
- geometrijsko pitanje s emoji tijelima više ne pita „Koji je dio tijela na slici?”, nego „Koje je geometrijsko tijelo prikazano simbolom?”.

### 2. razred – Priroda i društvo

Promjene:

- „para, magla” kao plinovito stanje vode zamijenjeno je s **„vodena para”**; magla nije vodena para nego sitne kapljice vode u zraku;
- „Što sve živi u tlu?” preoblikovano je u **„Što tlo može sadržavati?”**;
- pitanje o biciklu koje je imalo nesklad između osnove i odgovora preoblikovano je tako da pita za najsigurniji put kada postoji biciklistička staza;
- `koza → mlijeko i sir` promijenjeno je u **`koza → mlijeko`** jer životinja daje mlijeko, a sir je prerađevina;
- pogrešna copy/paste osnova „Koliko novca prikazuje [boja] na slici?” za boje zemljovida zamijenjena je s **„Što na zemljovidu najčešće prikazuje [boja] boja?”**;
- pitanja o sigurnosti pojednostavljena su kada su odgovori Da/Ne.

## 4. 3. razred

### Hrvatski jezik

Kurikulum A.3.5 naglašava imenice, glagole i pridjeve u funkcionalnoj uporabi. B.3.2 u književnosti uključuje ritam, rimu, usporedbu, ponavljanje i pjesničke slike.

Promjene:

- uklonjen je `prilog` kao nepotreban distraktor u zadatcima osnovnih vrsta riječi;
- uklonjena su pitanja o subjektu i predikatu – ti se sintaktički pojmovi sustavno obrađuju kasnije;
- uklonjeno je formalno stupnjevanje pridjeva (`komparativ`, `superlativ`) iz 3. razreda;
- personifikacija i hiperbola uklonjene su iz 3. razreda;
- zadržana je i jasnije formulirana **usporedba**, koja je eksplicitno navedena u B.3.2;
- ispravljene su copy/paste osnove pitanja iz književnosti/PID-a.

### Matematika

Promjene:

- tema **„Brojevi do 1000”** preimenovana je u **„Brojevi do 10 000”** i generator je prilagođen ishodu A.3.1;
- zbrajanje i oduzimanje ostaju do 1000 gdje to odgovara ishodu;
- uklonjena su pitanja koja traže mjerenje/određivanje kutova u stupnjevima;
- geometrija 3. razreda sada se oslanja na pravac, dužinu, polupravac, usporednost/okomitost i primjerena mjerenja.

## 5. 4. razred

### Hrvatski jezik

Promjene:

- zadatci vrsta riječi usmjereni su na imenice, glagole i pridjeve;
- popravljena je formulacija pitanja o glagolskim vremenima;
- zadatci s posvojnim pridjevima sada traže konkretno oblikovanje posvojnoga pridjeva;
- popravljeno je veliko/malo početno slovo u primjerima `hrvatski`, `zagrebački`, `europski`, nasuprot posvojnim pridjevima od vlastitih imena;
- pravopis je prilagođen A.4.4;
- književnost je usmjerena na bajku, basnu, pjesmu, igrokaz, biografiju, dječji roman i pripovijetku;
- personifikacija i onomatopeja ostaju u 4. razredu jer ih B.4.2 izričito navodi;
- hiperbola je uklonjena kao distraktor/pojam koji pripada kasnijoj nastavi.

### Matematika

Najveći sadržajni pomaci napravljeni su ovdje.

- U 4. razredu kutovi se prepoznaju, uspoređuju i crtaju kao pravi, šiljasti i tupi. **Broj stupnjeva nije potreban u tim pitanjima.**
- Uklonjena su pitanja poput 90°, 180° i 360°.
- Tema „Opseg i površina” preusmjerena je na **mjerenje i uspoređivanje površine jediničnim kvadratima**.
- Uklonjeno je rutinsko primjenjivanje formula za površinu pravokutnika/kvadrata koje pripada kasnijoj razini.
- U temi kvadra i kocke uklonjen je račun volumena formulom; ostaju lice/brid/vrh i prepoznavanje geometrijskih tijela.

### Priroda i društvo

- uklonjena su dvosmislena pitanja koja su svaku pojedinu rijeku pokušavala svrstati u samo jedan „hrvatski kraj”; takav model nije geografski dovoljno precizan za automatsko jednoznačno bodovanje;
- popravljena su pitanja o prehrani i kalciju;
- ispravljene su copy/paste osnove pitanja kod skupina životinja.

## 6. Pedagoška analiza pitanja

Za zadatke višestrukoga izbora primijenjena su sljedeća pravila:

1. osnova pitanja mora sama po sebi biti razumljiva;
2. smije postojati jedan nedvojbeno točan odgovor;
3. distraktori moraju pripadati istoj logičkoj kategoriji kao točan odgovor;
4. distraktori trebaju predstavljati realne pogreške učenika, a ne nasumične besmislice;
5. točan odgovor ne smije se isticati duljinom, stilom ili stalnim položajem;
6. gramatički oblik osnove i svih odgovora mora biti usklađen;
7. treba izbjegavati nejasne formulacije poput „što sve”, „ovo”, „koji dio” bez jasnoga referenta;
8. gdje je moguće, sadržaj treba vezati uz kontekst, opažanje ili jednostavnu primjenu, a ne samo reprodukciju činjenice.

NCVVO-ov priručnik o zadatcima višestrukoga izbora preporučuje upravo razvoj i recenziju osnove, ponuđenih odgovora, različitih kognitivnih razina te analizu kvalitete zadataka nakon provedbe. Za ovu aplikaciju to znači da automatski generator treba tretirati kao alat za proizvodnju kandidata za pitanja, a ne kao zamjenu za sadržajnu recenziju.

## 7. Vrednovanje i bodovanje

Aplikacija je po načinu rada prvenstveno **alat za vježbu i formativno vrednovanje**, a ne službeno ocjenjivanje učenika.

Pravilnik razlikuje vrednovanje za učenje, vrednovanje kao učenje i vrednovanje naučenoga. Prva dva pristupa ne završavaju školskom ocjenom, nego kvalitativnom povratnom informacijom. Zbog toga je zadržan rezultat „točno/ukupno” i interni bodovi, ali poruke rezultata više ne zvuče kao prikrivena školska ocjena.

Promijenjene su završne poruke:

- `Savršeno!` → `Sve točno!`
- `Odlično!` → `Dobro napreduješ!`
- `Dobro!` → `Još malo vježbe!`
- poruke sada opisuju rezultat i sljedeći korak, umjesto da etiketiraju sposobnost djeteta.

### Brzina odgovora

Prije revizije točan odgovor mogao je u FSRS modelu postati `Easy`, `Good` ili `Hard` ovisno o vremenu odgovora (npr. vrlo brz odgovor = Easy, spor točan odgovor = Hard). To nije ulazilo u izravni rezultat kviza, ali je skriveno utjecalo na raspored ponavljanja.

To je uklonjeno. Za učenike 1.–4. razreda brzina čitanja, tipkanja ili motorike ne smije se koristiti kao posredna mjera znanja bez jasne pedagoške svrhe.

Novi model:

- pojedini točan odgovor → `Good`;
- pojedini netočan odgovor → `Again`;
- ako je za istu vještinu u kvizu sve točno → `Good`;
- ako je dio točan, a dio netočan → `Hard`;
- ako nije točno ništa → `Again`.

Vrijeme se može i dalje tehnički bilježiti, ali ne utječe na procjenu vještine.

### Pitanja spajanja

Aplikacija već daje korisnu kvalitativnu povratnu informaciju „Točno spojeno X od N”. Za ukupni `correctCount` pitanje je još uvijek potpuno točno tek kada su svi parovi točni. To je prihvatljivo za jednostavan rezultat kviza, ali ako se sustav ikada bude koristio za ozbiljnije sumativno vrednovanje, preporuka je uvesti bodovanje po paru i unaprijed definiranu specifikaciju bodova.

## 8. Automatski testovi nakon revizije

Pokrenuto je:

- sintaktička provjera svih backend `.js` datoteka – **prolazi**;
- `backend/test/provjeri-pitanja.js` – oko **6 000 generiranih pitanja**, sve postojeće provjere prolaze;
- `backend/test/provjeri-pedagogiju.js` – semantičke regresije + provjera randomizacije + statistička provjera pozicije odgovora – **prolazi**;
- test položaja nakon izmjena daje približno **25 % / 25 % / 25 % / 25 %**.

`npm run test:tijek` nije se mogao izvršiti u ovom radnom okruženju jer lokalni `node_modules` nema instaliran `mongodb`, a pokušaj `npm ci` završio je transportnim timeoutom. To nije pad aplikacijskog testa nego nedostajuća ovisnost u ovom izvršnom okruženju. Sam `provjeri-tijek.js` je ažuriran za novi session-level raspored odgovora i novu FSRS logiku te prolazi `node --check`.

## 9. Važna napomena o bazi

Postoje dva sloja popravka:

**A. Session-level shuffle** radi odmah nakon deploya backend koda i ne traži reseed. Stara pitanja u bazi više neće uvijek prikazivati točan odgovor na istom mjestu.

**B. Sadržajne izmjene pitanja** (pilot, euro, geometrija, kurikularno usklađivanje itd.) ulaze u bazu tek nakon ponovnoga seeda/generiranja pitanja.

Prije seeda napraviti backup MongoDB-a. Nakon toga iz `backend/` mape, uz ispravno podešen `.env` i instalirane ovisnosti:

```bash
npm ci
npm run test:sve
npm run seed:all
```

Budući da `seed:all` briše i ponovno stvara pitanja/teme/predmete po razredima, prvo provjeriti koristi li produkcija stabilne ID-eve tema u drugim kolekcijama ili integracijama.

## 10. Preostali rizici i preporučena druga faza

### Neujednačena veličina fonda pitanja

Broj pitanja po temama jako varira. Neke matematičke teme imaju oko 200 pitanja, dok pojedine teme Hrvatskoga ili PID-a imaju samo 8–20. To znači da će neke teme brzo iscrpiti „neviđena pitanja u zadnjih 10 kvizova”.

Ne preporučuje se umjetno napuniti fond lošim parafrazama samo radi broja. Bolje je svaku malu temu proširiti kvalitetnim zadatcima na 3 razine kognitivnoga zahtjeva: prepoznavanje, primjena, kratko zaključivanje.

### GIK metadata

Mapiranja na ishode su poboljšana, ali `curriculumAlignment: high` je i dalje previše kategorična oznaka za automatski generirano pitanje. Prije produkcijske oznake „visoko usklađeno” preporučuje se ručna recenzija učitelja razredne nastave/predmetnog stručnjaka i verzioniranje odobrenja.

### Sadržajna recenzija

Automatski testovi mogu uloviti strukturalne i poznate semantičke pogreške, ali ne mogu zamijeniti stručnu recenziju svih činjenica, lokalnih geografskih formulacija, jezičnih nijansi i dobne primjerenosti. Za produkciju je preporučen proces: generator → automatski testovi → sadržajna recenzija → odobrena banka pitanja.

## 11. Glavni izvori korišteni za reviziju

- Narodne novine, **Kurikulum Hrvatskoga jezika** (NN 10/2019): https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_10_215.html
- Narodne novine, **Kurikulum Matematike** (NN 7/2019): https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_7_146.html
- Narodne novine, **Kurikulum Prirode i društva** (NN 7/2019): https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_7_147.html
- Narodne novine, **Pravilnik o vrednovanju** – izmjene NN 82/2019: https://narodne-novine.nn.hr/clanci/sluzbeni/2019_09_82_1709.html
- NCVVO, **Priručnik za izradu zadataka višestrukoga izbora**: https://www.ncvvo.hr/wp-content/uploads/2017/10/Prirucnik-za-izradu-zadataka-visestrukog-izbora-iz-povijesti-finale-web.pdf
- Ministarstvo financija RH, **euro je službena novčana jedinica od 1. 1. 2023.**: https://mfin.gov.hr/vijesti/od-1-sijecnja-2023-euro-je-sluzbena-novcana-jedinica-i-zakonsko-sredstvo-placanja-u-republici-hrvatskoj/3388

---

Zaključak: najveći problem koji se vidio na priloženoj slici nije bio slučajnost nego sistemska pristranost generatora. Ona je uklonjena i na razini generatora i na razini svake kviz-sesije. Istodobno su uklonjeni brojni sadržajno pogrešni, dvosmisleni ili kurikularno prerani zadatci te je vrednovanje pomaknuto prema jasnijoj formativnoj povratnoj informaciji primjerenoj učenicima 1.–4. razreda.

# Dodatni audit: ponavljanje predložaka pitanja

Naknadnim testiranjem otkriveno je da sama zabrana ponavljanja istog ID-a pitanja nije dovoljna. Velik broj čestica bio je generiran iz istoga jezičnog predloška, pa je učenik mogao dobiti nekoliko uzastopnih pitanja koja provjeravaju potpuno isti postupak, samo s drugim pojmom ili brojem.

Najizraženiji primjer bio je generator imenica za 2. razred: 70 čestica imalo je potpuno isti stem "Koja riječ imenuje biće, predmet ili pojavu?". Sličan obrazac postojao je i u drugim temama (vrste riječi, pravopis, površina, životinje, računske operacije).

Zato je uveden pojam "obitelji pitanja". Sustav iz teksta pitanja uklanja parametre predloška (brojeve, sadržaj u navodnicima, slikovne znakove) i prepoznaje njegovu osnovnu strukturu. Pri sastavljanju kviza prednost imaju različite obitelji. Za standardni kviz od sedam pitanja sada se, u svim 59 generatora, može odabrati sedam različitih obrazaca. Dodatno se obitelji iz nedavnih kvizova stavljaju u drugi plan.

Ovo je pedagoški važnije od samoga broja pitanja u bazi. Stotinu čestica nastalih zamjenom jedne riječi ne čini stotinu kvalitetno različitih zadataka. Raznolikost mora uključivati različite kognitivne radnje: prepoznavanje, razvrstavanje, primjenu u kontekstu, povezivanje, dovršavanje, uspoređivanje i kratko zaključivanje.

## Treća revizija — ručni primjeri i puni ponovni audit

Nakon dodatnih stvarnih primjera iz aplikacije uvedena je stroža revizija sadržaja. Vizualni zadaci zbrajanja s ikonama više se ne koriste kada rezultat ovisi o zasebno generiranoj slici i zasebno spremljenom odgovoru. Time se uklanja mogućnost da korisnik prebroji, primjerice, 16 simbola, a aplikacija kao točan odgovor očekuje drugi broj.

U fondu 2. razreda uklonjeni su sažeti zadaci poput „Kutovi osmerokuta?” i „Simetrija J?”. Osim nejasne formulacije, takvi zadaci nisu dobar izbor za ciljane ishode tog fonda. Zamijenjeni su jasnim zadacima o trokutu, kvadratu, pravokutniku, dužini i osnovnim geometrijskim tijelima.

Novčani zadaci sada razlikuju iznos od apoena. Kada se ispituje povrat novca, navodi se konkretna kovanica ili novčanica kojom se plaća, npr. „Predmet stoji 7 €. Plaćaš novčanicom od 10 €. Koliko dobiješ natrag?”. Time dijete ne mora nagađati od kojih je kovanica sastavljen neodređeni iznos plaćanja.

Problematične obitelji iz prethodnog audita nisu samo jezično preimenovane. Dio je zamijenjen zadacima drugog kognitivnog oblika (dovršavanje jednakosti, odabir točne tvrdnje, primjena u kratkom kontekstu, povezivanje, usporedba, rad na brojevnoj crti), a redundantni klonovi koji nisu donosili novu vrijednost uklonjeni su iz aktivnog fonda.

Završna automatizirana klasifikacija sadrži 3.889 aktivnih pitanja: 3.889 DOBRO, 0 TREBA PREFORMULIRATI i 0 UKLONITI. Smanjenje ukupnog broja u odnosu na prvotni fond namjerno je: kvaliteta i raznolikost imaju prednost pred umjetnim zadržavanjem tisuća gotovo jednakih varijanti.
