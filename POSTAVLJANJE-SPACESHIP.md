# Postavljanje Mudroline na Spaceship (mudrolina.com)

Spaceship Web Hosting (cPanel) + **Setup Node.js App** + baza **MongoDB Atlas** (besplatno).
Mudrolina je jedna Node aplikacija: `backend/server.js` poslužuje API i gotov frontend
(`frontend/dist`), pa je dovoljna jedna aplikacija na domeni.

```
~/mudrolina/                ← repozitorij (izvan public_html)
├── backend/                ← Application root, startup file server.js, .env
└── frontend/dist/          ← izgrađen frontend (npm run build)
```

---

## 1. Baza: MongoDB Atlas (≈10 min)

1. Otvori <https://www.mongodb.com/cloud/atlas/register> i napravi račun.
2. **Create cluster** → **M0 (Free)** → provider AWS → regija **Frankfurt (eu-central-1)** → *Create*.
3. **Database Access** → *Add New Database User*:
   - Username: `mudrolina`
   - Password: *Autogenerate* → **kopiraj lozinku** (bez znakova @ : / ako je pišeš ručno)
   - Role: *Read and write to any database* → *Add User*.
4. **Network Access** → *Add IP Address*:
   - upiši IP svog hostinga (cPanel → desni stupac *General Information* → **Shared IP Address**),
   - ili privremeno *Allow access from anywhere* (`0.0.0.0/0`) dok ne proradi, pa kasnije suzi.
5. **Database → Connect → Drivers** → kopiraj adresu i dodaj ime baze `mudrolina` iza `/`:
   ```
   mongodb+srv://mudrolina:LOZINKA@cluster0.xxxxx.mongodb.net/mudrolina?retryWrites=true&w=majority
   ```

## 2. E-pošta za prijave pitanja (Spacemail, ≈5 min, neobavezno)

1. Spaceship → **Spacemail** → napravi sandučić, npr. `mudrolina@mudrolina.com`, i zapiši lozinku.
2. Postavke za slanje (SMTP): `mail.spacemail.com`, port **465**, SSL.
   Prijave se šalju na **contact@fromrim.com**.

Bez ovoga Mudrolina radi, a prijave se samo spremaju u bazu (zbirka `prijave`).

## 3. Kod na poslužitelj

**Varijanta A — Git i Terminal u cPanelu (preporučeno, lakše ažuriranje)**

1. cPanel → **Terminal** (ili SSH).
2. ```
   cd ~
   git clone https://github.com/igorpavlic/ucilica.git mudrolina
   ```
   (Privatan repozitorij: cPanel → *Git™ Version Control* → *Create* → Clone URL, uz pristupni token.)

**Varijanta B — bez Terminala (zip)**

Na svom računalu:
```
git clone https://github.com/igorpavlic/ucilica.git mudrolina
cd mudrolina/frontend && npm ci && npm run build && cd ..
```
Zapakiraj mapu `mudrolina` **bez** `node_modules` (u `backend/` i `frontend/`), u cPanelu
*File Manager* → home mapa → *Upload* → *Extract*. Korak 6 (build) tada preskoči.

## 4. Datoteka s postavkama `~/mudrolina/backend/.env`

cPanel → *File Manager* → `mudrolina/backend` → **+ File** → `.env` → *Edit*
(uključi *Settings → Show Hidden Files* da je vidiš):

```
NODE_ENV=production
JWT_SECRET=ovdje-dugacak-nasumican-niz-od-barem-64-znaka
MONGODB_URI=mongodb+srv://mudrolina:LOZINKA@cluster0.xxxxx.mongodb.net/mudrolina?retryWrites=true&w=majority
CORS_ORIGIN=https://mudrolina.com
TRUST_PROXY=1

PRIJAVE_EMAIL=contact@fromrim.com
SMTP_HOST=mail.spacemail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=mudrolina@mudrolina.com
SMTP_PASS=lozinka-sanducica
MAIL_FROM="Mudrolina <mudrolina@mudrolina.com>"
```

`JWT_SECRET` — bilo koji dugi nasumični niz; generator: <https://www.random.org/strings/>
ili u Terminalu (nakon koraka 5) `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
**Nikad ga ne mijenjaj nakon pokretanja** — svi bi se igrači odjavili.

## 5. cPanel → Setup Node.js App → CREATE APPLICATION

| Polje | Vrijednost |
|---|---|
| **Node.js version** | najviša ponuđena **22.x** (ili 20.x — mora biti barem **20.19**; 10.x neće raditi) |
| **Application mode** | Production |
| **Application root** | `mudrolina/backend` |
| **Application URL** | `mudrolina.com`, drugo polje **prazno** |
| **Application startup file** | `server.js` |
| Environment variables | ništa (sve je u `.env`) |

→ **CREATE**. Pričekaj da se aplikacija pojavi (do 5 minuta).

Na vrhu stranice aplikacije piše naredba za ulazak u njezino okruženje, npr.:
```
source /home/KORISNIK/nodevenv/mudrolina/backend/22/bin/activate && cd /home/KORISNIK/mudrolina/backend
```
**Kopiraj je** — treba za korake 6–8.

## 6. Paketi i frontend (Terminal)

```
source /home/KORISNIK/nodevenv/mudrolina/backend/22/bin/activate && cd /home/KORISNIK/mudrolina/backend
npm ci --omit=dev          # ili u cPanelu gumb "Run NPM Install"
cd ../frontend
npm ci && npm run build    # napravi frontend/dist
cd ../backend
```

## 7. Provjera baze i punjenje pitanja

```
npm run provjeri:bazu
```
- `✓ Baza radi` → nastavi.
- `✗ Nema veze` → provjeri lozinku u `MONGODB_URI` i *Network Access* u Atlasu. Ako je sve
  ispravno, a i dalje ne radi, hosting vjerojatno zatvara odlazni port **27017**: otvori
  ticket Spaceshipu („please allow outbound TCP 27017 to MongoDB Atlas *.mongodb.net”).

Punjenje (jednom, traje par minuta):
```
npm run seed:all
```

## 8. Pokretanje

1. Setup Node.js App → kod aplikacije **RESTART**.
2. cPanel → **SSL/TLS Status** → označi `mudrolina.com` i `www.mudrolina.com` → **Run AutoSSL**.
3. cPanel → **Domains** → uključi **Force HTTPS Redirect** za mudrolina.com.
4. Provjera u pregledniku:
   - <https://mudrolina.com/api/health> → `{"ok":true,"baza":"ok"}`
   - <https://mudrolina.com> → početna stranica, registracija, jedan kviz.

## 9. Ažuriranje (nova verzija s GitHuba)

```
source …/activate && cd ~/mudrolina/backend
git pull
npm ci --omit=dev
cd ../frontend && npm ci && npm run build && cd ../backend
npm run topics:add                        # nove teme, ako ih ima (ne briše napredak)
npm run popravi:pitanja -- --primijeni    # ispravci teksta starih pitanja
```
pa **RESTART** u Setup Node.js App.

**Ne pokreći `seed:all` na bazi s igračima** — briše i ponovno stvara sva pitanja.

## Česte greške

| Simptom | Uzrok i rješenje |
|---|---|
| „Incomplete response” / 503 | aplikacija se ruši pri startu: u mapi `backend` pogledaj `stderr.log`; najčešće nedostaje `JWT_SECRET` ili `MONGODB_URI` u `.env` |
| `SyntaxError` ili „Unexpected token” | odabrana stara verzija Node.js — postavi 22.x i RESTART |
| stranica je bijela, API radi | nije napravljen `frontend/dist` — korak 6 |
| prijava ne stiže e-poštom | provjeri `SMTP_*`; prijave su ipak spremljene u bazu |
| igrači se odjavljuju | promijenjen `JWT_SECRET` |
