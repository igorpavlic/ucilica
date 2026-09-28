# Otvoreni kod za Učilicu — što se isplati, a što ne

Pregled je napravljen 24. 9. 2026. Svaka je stavka provjerena na npm-u,
PyPI-ju ili GitHubu: postoji li paket, koja mu je licencija, kad je zadnji
put objavljen i radi li uopće s hrvatskim. Nekoliko ih je i isprobano,
pa su ovdje i rezultati tih pokušaja, a ne samo obećanja iz dokumentacije.

Zaključci su svrstani u **ugrađeno**, **vrijedi**, **možda** i **ne**.

---

## Ugrađeno u ovoj iteraciji

### 1. Brojanje slogova bez knjižnice — `seeds/slogovi.js`

**Problem:** brojevi slogova stajali su u ručnim tablicama
(`[["mama",2],["jabuka",3], …]`). Zadatak je postojao samo za riječi koje
je netko unaprijed upisao.

**Što je isprobano:** `hyphen` (v1.14.1, ISC, 4,6 KB gzip s hrvatskim
uzorcima) i `hyphenopoly` (v6.1.0, MIT). Oba imaju hrvatske uzorke i oba
rade — **ali za prijelom retka, ne za slogove.** TeX-ovi uzorci namjerno
ne razdvajaju dva samoglasnika ni početni samoglasnik:

```
hyphen("oko")   → "oko"     a treba o-ko
hyphen("auto")  → "auto"    a treba a-u-to
hyphen("ulica") → "uli-ca"  a treba u-li-ca
```

**Rješenje:** hrvatsko pravilo ne treba rječnik — koliko samoglasnika,
toliko slogova, uz slogotvorno *r* (prst, vrt, Hrvatska). To je ~40 redaka
bez ijedne ovisnosti.

Usput je otkrilo **dvije greške u postojećim tablicama**: `auto` je pisalo
2 sloga (točno je 3, a-u-to), `automobil` 4 (točno je 5). Hrvatski nema
dvoglasa.

Provjereno: 30/32 slaganja s postojećim tablicama (obje razlike su greške
u tablici), 22/22 na rubnim slučajevima, 22/22 na rastavljanju.

### 2. Čitanje pitanja naglas — Web Speech API

**Zašto je ovo najveći dobitak:** dijete u 1. razredu često još ne čita
tečno. Zadatak iz matematike koji ne može pročitati mjeri brzinu čitanja,
ne matematiku.

**Cijena: nula bajtova.** Ugrađeno u preglednik.

Provjereno koji hrvatski glasovi stvarno postoje:

| Platforma | Glas | Radi bez interneta |
|---|---|---|
| Android, ChromeOS | Google `hr-hr-x-hra` / `hr-hr-x-hrb` | **da** |
| Windows | Microsoft Matej | da |
| macOS, iOS | Lana | da |
| Edge | Gabrijela / Srecko (Natural) | ne — traži mrežu |
| Chrome na stolnom Linuxu | — | nema ga |

Školski tableti (Android, ChromeOS) dobivaju kvalitetan glas koji radi i
bez mreže. Gdje hrvatskoga glasa nema, gumb se **ne prikazuje** — radije
ništa nego zadatak pročitan engleskim glasom.

Izgovor je pripremljen: `3 + 4 = ?` čita se „tri plus četiri jednako",
a ne „tri plus četiri jednako upitnik".

**Offline sinteza je provjerena i odbačena:**

| Rješenje | Nalaz |
|---|---|
| Piper | **nema hrvatski glas** (ima `sr_RS` i `sl_SI`) |
| Coqui / XTTS-v2 | hrvatskoga nema među 17 jezika; težine su nekomercijalne |
| MMS-TTS `facebook/mms-tts-hrv` | hrvatski postoji, ali CC-BY-NC-4.0 |
| Mimic3, MaryTTS | mrtvi projekti, bez hrvatskoga |
| eSpeak NG | hrvatski ima, ali zvuči robotski; GPL-3.0 |
| Supertonic-3 | 31 jezik uključujući hrvatski, MIT kod — ali repozitorij se arhivira, a kvaliteta hrvatskoga nije provjerena |

### 3. Mjerena težina pitanja (Elo) — `services/tezina.js`

**Rupa koju FSRS strukturno ne može popuniti.** FSRS odgovara na „kada će
dijete zaboraviti ovu vještinu". Ne odgovara na „koliko je ovo pitanje
teško". Kod pitanja pisanih rukom težinu procijeni autor. Naša su
generirana, pa iz istog predloška izlaze zadatci vrlo različite težine, a
`difficulty` koji im generator upiše je pretpostavka.

Postupak je isti kojim se rangiraju šahisti, samo između djeteta i pitanja.
Opisan u Klinkenberg, Straatemeier & van der Maas (2011), *Computers &
Education* 57(2) — motor iza nizozemskoga Math Gardena.

Gotove knjižnice nisu uzete: `glicko2` (38 KB), `openskill` (194 KB + ramda)
i `arpad` (nema izdanja od 2020.) sve rade više nego što treba. Sam je
postupak dvadesetak redaka.

Brzina odgovora ulazi u ocjenu: točan odgovor vrijedi 0,6–1,0 ovisno o
tome koliko je dijete oklijevalo, netočan 0,0–0,2.

### 4. Konfeti — `canvas-confetti`

v1.9.4, ISC, **bez ijedne ovisnosti**, ~7 KB gzip. Poštuje
`prefers-reduced-motion` — dijete koje je u sustavu isključilo animacije
ne dobiva ni konfete ni zvjezdice.

---

## Vrijedi napraviti, ali nije u ovoj iteraciji

### hrLex 1.3 — zamjena za ručni rječnik imenica

CLARIN.SI, CC BY-SA 4.0, **6 427 709 oblika na 164 206 lema**, 52 MB gzip.
Skripta `tools/hrlex-izvuci.js` je gotova od ranije; preuzimanje je ovdje
blokirano proxyjem, lokalno nije.

Dvije stvari koje se lako previde:

- **Sadrži i frekvenciju** iz korpusa hrWaC. To znači da se filtriranjem
  po frekvenciji dobiva i popis riječi primjerenih djetetu — dva problema
  rješava jedna datoteka.
- **CC BY-SA na podatcima nije zarazna za kod.** Izvedeni rječnik drži se
  kao zaseban podatkovni prilog s navedenim izvorom; aplikacijski kod time
  nije zahvaćen.

Uz to: `krunose/hunspell-hr` ima u `tools/wordlist` **1 071 918 već
sklanjanih oblika** (12,8 MB sirovo, 2,45 MB gzip). Od toga je 220 375
malim slovima i do 8 znakova — gotov popis kandidata za dječju dob.

### Upozorenje: ne spajati `nspell` ni `typo-js` kao provjeru hrvatskoga

Isprobano i **oba su pokvarena za hrvatski**:

| riječ | pravi `hunspell` | `nspell` | `typo-js` |
|---|---|---|---|
| jabuke, škole, kuće, djeci, učiteljica | sve prihvaća | sve odbija | sve odbija |
| xyzzy | odbija | odbija | odbija |

Uzrok: `hr_HR.aff` deklarira `FLAG long`, a `hr_HR.dic` nosi troznamenkaste
brojčane zastavice i `po:` polja — JS izvedbe to krivo raščlane i tiho
ispuste širenje nastavaka. Spojeno kao provjera generiranih oblika,
**odbijalo bi točan izlaz.**

### PWA za školski tablet

`vite-plugin-pwa` v1.3.0 (MIT) je lagan dio posla. Teži je arhitektonski:
pitanja se danas generiraju na poslužitelju, a za rad bez mreže generator
mora u preglednik zajedno s hrvatskim podatcima.

Jedna stvar ovdje ide u prilog postojećem dizajnu: **FSRS je determinističan
s obzirom na zapisnik ponavljanja**, pa se odgovori skupljeni bez mreže mogu
poslije mirno reproducirati na poslužitelju i stanje će se poklopiti.

### Moodle GIFT kao format za razmjenu

Tekstualni format koji pokriva višestruki izbor, točno/netočno, kratki
odgovor, **spajanje** i brojčane zadatke — gotovo jedan na jedan s onim
što već imamo. Ako ikad zatreba da učitelji unesu svoja pitanja, to je
najjeftiniji put. Parser: `gift-pegjs` v1.0.2 (MIT).

### Fontovi — jedna zamka

Ako se ikad prijeđe s Google Fontsa na `@fontsource` pakete: **hrvatski
č ć ž š đ postoje samo u podskupu `latin-ext`, ne u `latin`.** Uvezeš li
zadani `400.css`, svi hrvatski dijakritici tiho padnu na drugi font —
vidljivo neslaganje baš na slovima koja su bitna.

Kandidati, svi OFL-1.1:

| Font | latin-ext woff2 | Bilješka |
|---|---|---|
| Atkinson Hyperlegible | 9,4 KB | najmanji, Braille Institute |
| Andika (SIL) | 81,4 KB | rađen za početno opismenjavanje, jednokatno *a* i *g* kao u rukopisu — za 1. i 2. razred |
| Lexend | 13,1 KB | uredan font, ali tvrdnje o čitljivosti počivaju na doktoratu samoga autora na ~20 djece, bez neovisne replikacije |

**OpenDyslexic ne preporučujem kao zadani.** Paket nema izdanja od 2019.,
licencija je nejasna, a dokazi su negativni: istraživanje iz 2017. na
disleksičnoj djeci nije našlo poboljšanje ni u brzini ni u točnosti
čitanja spram Ariala, djeca su čitala nešto sporije i **nijedno ga nije
preferiralo**. Ima smisla samo kao izbor koji korisnik sam uključi.

---

## Možda, ovisno o tome kamo projekt ide

| Što | Nalaz |
|---|---|
| **pyBKT** (MIT) | Bayesovo praćenje znanja. Nadopunjuje FSRS: BKT modelira „je li savladao vještinu", FSRS „kada će zaboraviti". Python + C++, pa ne u put zahtjeva — nego noćno, uz upis u Mongo |
| **OpenMoji** (CC BY-SA 4.0) | Rješava to da se emoji na svakoj platformi crta drukčije i zna razbiti raspored. Pojedinačni SVG 0,5–3,3 KB. Ne instalirati paket od 43 MB — prekopirati onih 100-200 znakova koji se stvarno koriste |
| **SortableJS** + `vue-draggable-plus` (MIT) | Za zadatke slaganja redoslijeda (dani, mjeseci, slijed radnji) — jedini tip zadatka iz kurikula koji još nedostaje. Radi i na dodir |
| **Chart.js** ili **uPlot** (MIT) | Za roditeljski pregled. uPlot je 22 KB gzip i brži; Chart.js ima bolje zadane postavke za stupce i kolutove |
| **Kolibri** (MIT) | Ne kao kod (Python/Django) nego kao uzor: građen je točno za školske tablete i lošu mrežu |

---

## Ne

| Što | Zašto ne |
|---|---|
| **Prepoznavanje govora za čitanje naglas** | Vosk **nema hrvatski model** (ni ijedan južnoslavenski), a paketi su 3–4 godine bez izdanja. Whisper large-v2 ima ~13,4 % pogrešaka na hrvatskom kod odrasloga čitanja — kod djece bitno gore. Ne postoji ništa što bi pouzdano ocijenilo šestogodišnje dijete. Ocjenjivač koji griješi uči dijete da ne zna, a zna |
| **Khan Academy, CK-12, EngageNY** | Sve CC BY-**NC**. Khanova stranica doslovno kaže da uklapanje u plaćenu ponudu nije nekomercijalno. Uz to SA nameće istu licenciju izvedenicama |
| **edutorij.carnet.hr / DOS** | Dvije prepreke: pokriva **5. razred OŠ do 4. razreda gimnazije** — dakle ne razrednu nastavu — i „otvoreno" ondje znači besplatno za gledanje, ne otvorenu licenciju |
| **e-Sfera** | Sva prava pridržana |
| **GSAP** | Nije otvoreni kod — vlastita licencija s ograničenjima i plaćenim slojem |
| **LibreLingo** | AGPL-3.0, uključujući mrežnu klauzulu |
| **`@dnd-kit`** | Samo za React |

### Zaključak o gotovim bankama pitanja

**Za hrvatske razrede 1.–4. otvoreno licencirane banke pitanja praktički
ne postoje.** Generiranje pitanja nije prečac oko prikupljanja sadržaja —
to je jedini prohodan put. To je neovisna potvrda arhitekture koja je već
odabrana.

---

## Usput popravljeno

`frontend/package-lock.json` imao je dva unosa (`pinia`, `vue-demi`) koji
su pokazivali na interni registar `packages.applied-caas-gateway1.internal.api.openai.org`
i na putanju `/artifactory/api/npm/npm-public/`. S takvim lockfileom
`npm ci` ne prolazi nigdje izvan toga okruženja. Preusmjereni su na
`registry.npmjs.org`.

Nakon toga se **frontend prvi put uspješno buildao** u ovoj seriji izmjena:

```
dist/assets/index-*.css   26,73 kB │ gzip:  5,47 kB
dist/assets/index-*.js   142,41 kB │ gzip: 53,38 kB
✓ built in 1.61s
```
