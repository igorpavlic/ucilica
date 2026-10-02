# Mudrolina

> Ranije **Učilica** — preimenovano jer na hrvatskom tržištu već postoje edukativni
> proizvodi tog imena. Tehničke oznake (`ucilica_token`, zadana baza `ucilica`,
> ime repozitorija) namjerno su ostale iste, da se korisnici ne odjave i baza ne promijeni.

Interaktivna aplikacija za vježbanje gradiva hrvatske osnovne škole, razredi 1–4.
Tri predmeta, ~6 200 proceduralno generiranih pitanja, gramatički ispravan hrvatski.

## Tehnologije

| Sloj | Tehnologija |
|---|---|
| Frontend | Vue 3 (Vite, SFC, Pinia, Vue Router) |
| Backend | Node.js, Express 5 |
| Baza | MongoDB (native driver) |
| Autentikacija | JWT + bcrypt |
| Sigurnost | Helmet, rate limiting, sesije kviza |

## Pokretanje

```bash
npm install && npm run install:all

cp backend/.env.example backend/.env      # popuni JWT_SECRET i MONGODB_URI
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"

npm test          # kontrola kvalitete pitanja — ne dira bazu
npm run seed:all  # napuni bazu za sva 4 razreda (prvo pokrene testove)
npm run dev       # backend :3000 + frontend :5173
```

## Struktura

```
ucilica/
├── backend/
│   ├── server.js                    Express, helmet, CORS, rate limit, SPA fallback
│   ├── .env.example                 predložak konfiguracije
│   ├── db/mongo.js                  MongoDB singleton + svi indeksi (uklj. TTL sesija)
│   ├── middleware/
│   │   ├── auth.js                  JWT: auth, optionalAuth, adminOnly
│   │   └── rateLimiter.js           tri razine ograničenja
│   ├── modules/quiz/                modularni sloj kviza
│   │   ├── quiz.routes.js           rute
│   │   ├── quiz.controller.js       HTTP sloj
│   │   ├── quiz.service.js          poslovna logika, sesije, evaluacija
│   │   ├── quiz.repository.js       pristup bazi
│   │   └── quiz.validators.js       express-validator
│   ├── routes/                      auth, subjects, progress, quiz (proxy)
│   ├── services/
│   │   ├── questionGenerator.js     generiranje u hodu + adaptivni odabir
│   │   ├── gikEngine.js             GIK metapodaci i kvote težine
│   │   └── vjestine.js              FSRS — ponavljanje po krivulji zaboravljanja
│   ├── tools/
│   │   └── hrlex-izvuci.js          proširenje rječnika iz hrLex 1.3
│   ├── seeds/
│   │   ├── hr-gramatika.js          slaganje broja, roda i padeža
│   │   ├── hr-imenice.js            rječnik — 120 imenica, 10 kategorija
│   │   ├── gen-engine.js            motor: kombinatorika, predlošci, distraktori
│   │   ├── gen-hrvatski.js          generatori 1. r. + zajednički pomoćnici
│   │   ├── gen-matematika.js        generatori 1. r.
│   │   ├── gen-priroda.js           generatori 1. r.
│   │   ├── seed.js                  punjenje 1. razreda
│   │   ├── seed-r2.js               generatori + punjenje 2. razreda
│   │   ├── seed-r3.js               3. razred
│   │   ├── seed-r4.js               4. razred
│   │   └── fix-emoji-inputs.js      jednokratna migracija starih zapisa
│   └── test/
│       ├── provjeri-pitanja.js      13 provjera nad svim generiranim pitanjima
│       └── provjeri-tijek.js        tijek kviza s lažnom bazom, bez MongoDB-a
└── frontend/
    ├── vite.config.js               proxy /api → :3000
    └── src/
        ├── main.js                  Vue + Pinia + Router
        ├── App.vue                  ljuska, topbar, greške, zvjezdice
        ├── stores/                  auth.js, quiz.js (Pinia)
        ├── composables/             useApi.js, useAuth.js
        ├── components/              Login, Register, Home, Topics, Quiz, Results,
        │                            Profile, AnswerHistory
        └── assets/main.css          dizajn, 3 prijelomne točke
```

## Hrvatska gramatika u generatorima

Za razliku od engleskoga, hrvatski traži slaganje broja, roda i padeža. Zato svi
generatori idu kroz `seeds/hr-gramatika.js` umjesto da lijepe imenicu iza broja.

**Slaganje broja i imenice** — kategoriju daje ugrađeni `Intl.PluralRules("hr")`,
oblik dolazi iz tablice:

| Broj | Kategorija | Oblik | Primjer |
|---|---|---|---|
| 1, 21, 101 | `one` | nominativ jednine | 1 jabuka |
| 2–4, 22–24 | `few` | paukal | 2 jabuke |
| 0, 5–20, 25+ | `other` | genitiv množine | 5 jabuka |

Oblici se ne mogu izvesti algoritamski — *olovka → olovaka*, *kruška → krušaka*
imaju nepostojano a. Zato tablica. Za širenje preko trenutnih ~42 imenice postoji
[hrLex 1.3](https://www.clarin.si/repository/xmlui/handle/11356/1232)
(6,4 M oblika, CC BY-SA 4.0); dovoljno je izvući potrebne leme u isti oblik tablice.

**Padež** — imenica u ulozi objekta traži akuzativ kad je broj u kategoriji `one`:

```js
HR.brojIme(1, 'naranca')        // "1 naranča"  — subjekt
HR.brojIme(1, 'naranca', 'A')   // "1 naranču"  — objekt
```

**Rod** — ne smije se pogađati iz nastavka. *Luka, Noa, Roko, Karlo, Marko, Bruno*
su muška imena na -a/-o, pa `IMENA` drži rod eksplicitno. Odatle idu particip
(`dobio` / `dobila`), zamjenica (`mu` / `joj`) i posvojni pridjev (`Lukin`, `Markov`).

**Slaganje glagola** — paukal traži množinu: *1 jabuka **je***, *2 jabuke **su***,
*5 jabuka **je***. Pokriva `HR.biti(n)` i `HR.glagolBroj(n, jd, mn)`.

**Semantika** — imenice nose oznaku `jestivo`, pa predlošci s *pojede* / *popije*
biraju samo iz jestivih. Oznaka `predmet` odvaja stvari koje dijete može skupljati
od strukturnih imenica (red, kutija, stablo, dijete).

**Živo i neživo** — muški rod razlikuje akuzativ prema živosti: *vidim stol*, ali
*vidim psa*. Životinje i ljudi nose `zivo: true`; `npm test` to i provjerava.

Rječnik je u `seeds/hr-imenice.js`, 120 imenica u deset kategorija
(škola, hrana, igračke, priroda, životinje, kućanstvo, promet, ljudi, mjere,
strukturne). Kategorija služi da predložak izabere tematski prikladnu imenicu.

Dodavanje nove imenice:

```js
// seeds/hr-imenice.js, u odgovarajuću skupinu
bicikl: { o: ['bicikl', 'bicikla', 'bicikala'], rod: 'm' },
```

`npm test` odmah provjerava dosljednost: poklapa li se ključ s nominativom,
završava li genitiv jednine ispravno, ima li životinja u muškom rodu `zivo`.

**Proširenje preko hrLex-a.** `tools/hrlex-izvuci.js` iz
[hrLex 1.3](https://www.clarin.si/repository/xmlui/handle/11356/1232)
izvlači sve potrebne oblike po MSD oznakama:

```bash
curl -L -o hrLex_v1.3.gz \
  "https://www.clarin.si/repository/xmlui/bitstream/handle/11356/1232/hrLex_v1.3.gz"
node tools/hrlex-izvuci.js hrLex_v1.3.gz
```

Skripta bira češći oblik kad hrLex nudi dublete (*olovaka* / *olovki*),
prepoznaje živost iz akuzativa i preskače vlastite imenice.
hrLex je CC BY-SA 4.0 — izvedeni rječnik nasljeđuje tu licencu, pa ga drži u
zasebnom repozitoriju; kod aplikacije time nije zahvaćen.

## Tipovi pitanja

| Tip | Kako izgleda | Gdje se koristi |
|---|---|---|
| `choice` | četiri ponuđena odgovora | svugdje |
| `input` | dijete upisuje odgovor | računanje, pravopis |
| `match` | spoji lijevi stupac s desnim | životinje, vrste riječi, organi, krajevi |

**Spajanje parova** (`match`) je za 1. i 2. razred prirodnije od tipkanja.
Interakcija je klik-pa-klik, ne povlačenje — na dodirnicima pouzdanije.
Veze se označavaju brojevima umjesto crtanjem linija, pa raspored radi na
svakoj širini zaslona.

Server šalje dva promiješana stupca bez veze među njima; točan raspored ostaje
na serveru. Ocjenjuje se po tekstu, ne po indeksu, pa se priznaje svako
značenjski ispravno spajanje. Generator pazi da desni članovi budu različiti —
uz dva „ženski" zadatak bi bio dvosmislen.

```js
// seeds/gen-engine.js
spajanje(PAROVI, 'Spoji životinju s glasanjem:', { koliko: 4, komada: 10 })
```

## Ponavljanje po krivulji zaboravljanja

Prati se **vještina**, ne pojedino pitanje. Vještina je ishod iz kurikula koji
svako pitanje nosi u `gik.outcome` (npr. `MAT OŠ A.1.4`).

Nakon kviza svaka dodirnuta vještina dobiva FSRS ocjenu:

| Odgovor | Ocjena |
|---|---|
| netočno | Again |
| točno, brzo | Easy |
| točno, uobičajeno | Good |
| točno, sporo | Hard |

Prag brzine raste s težinom pitanja — na teškom zadatku 10 s nije sporo.
Ako je ijedan odgovor iz iste vještine bio netočan, cijela vještina ide na
Again: promašaj je jači signal od pogotka.

`createSession` zatim daje prednost pitanjima čija je vještina dospjela za
ponavljanje, pa tek onda primjenjuje kvote težine.

Stanje se čuva u `skill_states` i vidljivo je na `GET /api/progress/vjestine`
(najslabije prvo) — osnova za roditeljski pregled.

Koristi [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) (MIT).

## Testovi

```bash
npm test              # provjeri-pitanja.js — kvaliteta svih ~6 200 pitanja
cd backend && npm run test:tijek   # provjeri-tijek.js — tijek kviza
cd backend && npm run test:sve     # oboje
```

`provjeri-pitanja.js` pada ako generator proizvede:
nedosljedan unos u rječniku imenica · slaganje broja i imenice izvan tablice ·
kose crte tipa `Dobio/la` · žensko ime uz muški particip i obratno ·
jedenje nejestivog · choice bez valjanog `correctIndex` ·
duplicirane ponuđene odgovore · match s krivim brojem parova ili ponovljenim
članom · input pitanje čiji je odgovor emoji · prazan odgovor ·
neriješeno `_c` polje · prazno ili predugačko pitanje · dvostruke razmake.

`provjeri-tijek.js` podmeće lažnu bazu i prolazi
`createSession → checkAnswer → submitQuiz`, uključujući provjeru da pitanja
poslana klijentu **ne** sadrže točan odgovor (ni `pairs` kod spajanja), da je
odgovor na pitanje izvan sesije odbijen s 403, da je dvostruka predaja odbijena
s 409, da FSRS upisuje rok ponavljanja i da spajanje parova ispravno broji veze.

`seed:all` pokreće oboje prije punjenja baze.

## REST API

```
POST   /api/auth/register      { username, password, displayName, avatar, grade (1–4), privolaRoditelja: true }
POST   /api/auth/login         { username, password }
GET    /api/auth/me            🔒
PATCH  /api/auth/me            🔒 { displayName?, avatar?, grade? }
GET    /api/auth/me/izvoz      🔒   → svi podatci djeteta kao JSON (GDPR čl. 15, 20)
DELETE /api/auth/me            🔒 { password }  → trajno briše račun i sve zapise (GDPR čl. 17)

GET    /api/subjects?grade=1
GET    /api/subjects/:slug/topics?grade=1

GET    /api/quiz/:topicId?count=7     → attemptId + pitanja bez odgovora
GET    /api/quiz/review/:grade?count=7 → miješano ponavljanje razreda
GET    /api/quiz/dnevni/:grade 🔒     → dnevni izazov (10 pitanja; { odigrano: true } ako je danas riješen)
POST   /api/quiz/check                { attemptId, questionId, answer }
POST   /api/quiz/submit        🔒     { attemptId, topicId | reviewGrade, answers[] }

GET    /api/progress           🔒
GET    /api/progress/answers   🔒 ?filter=correct|wrong
GET    /api/progress/vjestine  🔒 ?grade=2   → stanje po vještinama, najslabije prvo
GET    /api/progress/dnevni    🔒   → { odigranoDanas, niz, najduljiNiz, ukupnoDana }
```

## Svaki dan nova pitanja

- **Nedavno viđeno** = pitanja iz kvizova u zadnjih 30 dana (`UCILICA_VIDJENO_DANA`),
  a uvijek barem iz zadnjih 10 kvizova teme. Takva se pitanja ne nude.
- Kad neviđenih ponestane, generator teme stvara nove zadatke (novi brojevi,
  rasporedi, podatci) i preskače one koji već postoje (`itemKey`).
- Ako ni to ne dostaje (mala ručno pisana tema), kviz se dopunjuje pitanjima koja
  dijete **najdulje** nije vidjelo — nikad onima iz zadnja tri kviza.
- **Dnevni izazov**: jedan kviz dnevno, 10 pitanja iz cijelog (obrađenog) gradiva
  razreda, najprije vještine dospjele za ponavljanje. Dan se računa po
  zagrebačkom vremenu; niz dana zaredom računa se iz `progress` (`dnevni`, `dan`).
- Za sve ovo dijete mora biti **prijavljeno** — gost nema povijest.

## Privatnost (djeca)

- Registraciju potvrđuje roditelj ili skrbnik (`privolaRoditelja`); uz korisnika se
  sprema `privola: { daje, verzijaObavijesti, datum }`. U RH dijete samo daje
  privolu tek od 16. godine (ZPOU, NN 42/2018, čl. 19).
- Ne traže se ime i prezime, e-adresa ni drugi kontakt.
- Obavijest o privatnosti: `/privatnost` (frontend). **Prije objave upiši voditelja
  obrade i kontakt** u `frontend/src/components/PrivatnostView.vue`.
- U profilu: „Preuzmi moje podatke” (JSON) i „Obriši račun” (uz lozinku).
  Brisanje obuhvaća `users` i sve zbirke iz `services/privatnost.js → KORISNICKE_ZBIRKE`.

## Produkcija iza proxyja

`TRUST_PROXY` (zadano 1 kad je `NODE_ENV=production`): broj reverse proxyja ispred
aplikacije (Caddy, nginx, Render). Bez toga ograničenje broja zahtjeva vidi samo IP
proxyja i svi korisnici dijele isto ograničenje. Postavi `TRUST_PROXY=0` ako je Node
izravno na internetu.

## Kolekcije

| Kolekcija | Sadržaj |
|---|---|
| `users` | korisnici (bcrypt, JWT) |
| `subjects` | predmeti po razredima |
| `topics` | teme (ref → subject) |
| `questions` | pitanja (choice/input) + `gik` metapodaci |
| `progress` | povijest kvizova |
| `quiz_attempts` | aktivne sesije, TTL 6 h |
| `skill_states` | FSRS stanje po vještini i korisniku |

## Sigurnost

- Lozinke: bcrypt, 12 rundi
- JWT, zadano 7 dana; server odbija start bez `JWT_SECRET`
- Helmet, rate limiting (API 200/15 min, auth 10/15 min, generiranje 5/h)
- Evaluacija odgovora isključivo na serveru; klijent nikad ne dobiva točan odgovor
- Sesije kviza: odgovor se prihvaća samo za pitanje koje je dio te sesije
- `express-validator` na svim rutama
- U produkciji suzi `CORS_ORIGIN` s `*` na vlastitu domenu

## Adaptivnost

`questionGenerator.js` čita uspješnost na temi iz zadnjih 5 rundi i preko
`gikEngine.decideDifficultyTarget()` određuje kvote težine:

| Uspješnost | Razina | Lako / Srednje / Teško |
|---|---|---|
| ≥ 85 % i niz ≥ 2 | napredna | 1 / 2 / 4 |
| ≥ 65 % | uravnotežena | 2 / 3 / 2 |
| < 65 % | podrška | 4 / 2 / 1 |

Pitanja se biraju iz šireg uzorka neviđenih (`count × 6`) pa raspoređuju po
kvotama. Svako spremljeno pitanje nosi `gik` metapodatke s ishodom iz kurikula
(npr. `MAT OŠ A.1.4`).

## Gradivo po razredima

| Razred | Hrvatski | Matematika | Priroda i društvo |
|---|---|---|---|
| 1. | slova, glasovi, riječi, rečenice | brojevi do 20, +/− do 10, geometrija, nizovi | godišnja doba, životinje, tijelo, obitelj, sigurnost, ekologija |
| 2. | imenice i rod, glagoli, rečenice, čitanje | brojevi do 100, +/−, ×/÷, geometrija, mjerenje | zavičaj, godišnja doba, biljke i životinje, voda i tlo, zdravlje |
| 3. | vrste riječi, pravopis, književnost, izražavanje | brojevi do 1000, ×/÷, geometrija i mjerenje | zavičaj i karta, tlo/voda/zrak, biljke i životinje, gospodarstvo, baština |
| 4. | vrste riječi, pravopis, književnost, mediji | brojevi do milijun, pisano ×/÷, kutovi, opseg i površina, kvadar i kocka | uvjeti života, krajevi RH, ljudsko tijelo, domovina, biljke i životinje |
# Dopuna sadržaja 3. i 4. razreda

Nove teme (čitanje s razumijevanjem, podatci i grafovi, nepoznati broj) mogu se
dodati u postojeću bazu naredbom `cd backend && npm run topics:add`. Skripta
ne briše postojeća pitanja ni napredak te preskače teme koje već imaju pitanja.
Na praznoj bazi koristi se uobičajeni `npm run seed:all`. Taj postupak briše i
ponovno stvara pitanja za sve razrede; nemojte ga koristiti za nadogradnju baze
s postojećim rezultatima.

Za uredničku analizu distraktora nakon prikupljanja odgovora pokrenite
`cd backend && npm run analyze:distractors`. Izvještaj daje podatke tek za
pitanja s najmanje 20 odabira; slabiji distraktor samo označi za ručni pregled.
