<template>
  <div class="shell upute">
    <h1 class="page-title">Kako se <span>igra</span></h1>

    <nav class="upute-sadrzaj" aria-label="Sadržaj uputa">
      <a href="#djeca">Za djecu</a>
      <a href="#zadatci">Vrste zadataka</a>
      <a href="#roditelji">Za roditelje</a>
      <a href="#pitanja">Česta pitanja</a>
    </nav>

    <!-- ── Za djecu ─────────────────────────────────────────────── -->
    <section id="djeca">
      <h2>🧒 Za djecu</h2>
      <ol class="upute-koraci">
        <li><strong>Prijavi se</strong> svojim korisničkim imenom. Tada Mudrolina pamti što si već riješio i daje ti nova pitanja.</li>
        <li><strong>Odaberi razred</strong> gore na početnoj stranici.</li>
        <li><strong>Riješi dnevni izazov ⭐</strong> — 10 pitanja iz svih predmeta. Možeš ga riješiti jednom na dan.</li>
        <li>Ili <strong>odaberi predmet</strong>, pa <strong>temu</strong>, i vježbaj samo nju.</li>
        <li>Nakon svakog odgovora vidiš je li točno i <strong>zašto</strong>. Pročitaj objašnjenje — tako najviše naučiš.</li>
        <li>Klikni <strong>„Sljedeće pitanje →”</strong>, a na kraju <strong>„Pogledaj rezultat 🏆”</strong>.</li>
      </ol>

      <div class="upute-kartice">
        <div class="upute-kartica">
          <div class="upute-ikona">🔊</div>
          <p><strong>Poslušaj pitanje.</strong> Ako ne znaš pročitati pitanje, klikni zvučnik pa ti ga Mudrolina pročita naglas.</p>
        </div>
        <div class="upute-kartica">
          <div class="upute-ikona">⭐</div>
          <p><strong>Bodovi.</strong> Svaki točan odgovor donosi 10 bodova.</p>
        </div>
        <div class="upute-kartica">
          <div class="upute-ikona">🔥</div>
          <p><strong>Plamen gore</strong> broji kvizove zaredom u kojima je sve točno. <strong>Plamen na dnevnom izazovu</strong> broji dane zaredom u kojima si ga riješio.</p>
        </div>
        <div class="upute-kartica">
          <div class="upute-ikona">🔄</div>
          <p><strong>Miješano ponavljanje</strong> daje pitanja iz više tema odjednom. Tako najbolje provjeriš što pamtiš.</p>
        </div>
      </div>
      <p class="upute-savjet">Nije važno biti brz. Važno je razmisliti i pročitati objašnjenje kad pogriješiš.</p>
    </section>

    <!-- ── Vrste zadataka ───────────────────────────────────────── -->
    <section id="zadatci">
      <h2>✏️ Vrste zadataka</h2>
      <table class="upute-tablica">
        <thead><tr><th>Zadatak</th><th>Što radiš</th></tr></thead>
        <tbody>
          <tr><td>Odaberi odgovor</td><td>Klikni jedan od ponuđenih odgovora.</td></tr>
          <tr><td>Upiši odgovor</td><td>Upiši broj ili riječ pa klikni <strong>„Provjeri”</strong>.</td></tr>
          <tr><td>Da ili ne</td><td>Na pitanje odgovori s <strong>Da</strong> ili <strong>Ne</strong>. Ako je zadana tvrdnja, odluči je li <strong>Točno</strong> ili <strong>Netočno</strong>.</td></tr>
          <tr><td>Spoji parove</td><td>Klikni nešto u lijevom stupcu, pa ono što mu pripada u desnom, ili ga povuci do para. Svaki par dobije svoju boju i crtu. Kad sve spojiš, klikni <strong>„Provjeri”</strong>.</td></tr>
          <tr><td>Poredaj</td><td>Povuci rečenicu na pravo mjesto ili je pomakni strelicama <strong>↑</strong> i <strong>↓</strong>, pa klikni <strong>„Provjeri redoslijed”</strong>.</td></tr>
          <tr><td>Robot na mreži</td><td>Pogledaj gdje je robot 🤖 i kamo treba stići. Strelice ga pomiču za jedno polje.</td></tr>
          <tr><td>Tekst, tablica ili grafikon</td><td>Najprije pročitaj tekst ili pogledaj podatke, pa odgovori na pitanje.</td></tr>
        </tbody>
      </table>
      <p class="upute-savjet">Boduje se <strong>prvi</strong> odgovor. Ako pogriješiš, točan odgovor i objašnjenje vidiš odmah.</p>
    </section>

    <!-- ── Za roditelje ─────────────────────────────────────────── -->
    <section id="roditelji">
      <h2>👪 Za roditelje</h2>
      <ul>
        <li><strong>Registracija:</strong> račun otvara roditelj ili skrbnik i daje privolu za obradu podataka.
          Ne upisujte pravo ime i prezime — dovoljan je nadimak. Više u <router-link to="/privatnost">obavijesti o privatnosti</router-link>.</li>
        <li><strong>Gradivo:</strong> pitanja prate kurikul za 1.–4. razred (Hrvatski jezik, Matematika, Priroda i društvo, Informatika).
          Uz to su tu teme „Ja i drugi” (osjećaji, lijepo ponašanje, prava djeteta), „Promet i bicikl” i „Novac i kupovina”.</li>
        <li><strong>Obrađeno gradivo:</strong> u <router-link to="/profile">profilu</router-link> označite teme koje je dijete već učilo u školi.
          Miješano ponavljanje i dnevni izazov tada uzimaju samo njih.</li>
        <li><strong>Napredak:</strong> klikom na ⭐ i 🔥 gore vidite točne i netočne odgovore.</li>
        <li><strong>Nova pitanja:</strong> pitanja koja je dijete vidjelo u zadnjih 30 dana nude se tek kad drugih nema.
          Kad dijete prođe postojeće zadatke, Mudrolina sama stvara nove. Ono što dijete zaboravlja dolazi ranije na ponavljanje.</li>
        <li><strong>Koliko vježbati:</strong> bolje kratko i svaki dan nego dugo jednom tjedno. Dnevni izazov traje nekoliko minuta.</li>
        <li><strong>Podatci:</strong> u profilu možete preuzeti sve podatke ili trajno obrisati račun.</li>
      </ul>
    </section>

    <!-- ── Česta pitanja ────────────────────────────────────────── -->
    <section id="pitanja">
      <h2>❓ Česta pitanja</h2>
      <details>
        <summary>Mogu li igrati bez prijave?</summary>
        <p>Možeš, kao gost. Ali tada Mudrolina ne pamti što si riješio, pa se pitanja mogu ponavljati, a dnevni izazov nije dostupan.</p>
      </details>
      <details>
        <summary>Dnevni izazov kaže „Novi te čeka sutra”.</summary>
        <p>Današnji izazov je riješen. Novi dolazi nakon ponoći. Do tada možeš vježbati bilo koju temu.</p>
      </details>
      <details>
        <summary>Zašto je odgovor netočan, a mislim da je dobar?</summary>
        <p>Pročitaj objašnjenje ispod odgovora. Kod upisa provjeri piše li se riječ velikim ili malim slovom i jesi li upisao broj bez slova.
          Ako i dalje misliš da je pitanje krivo, javi roditelju ili učitelju.</p>
      </details>
      <details>
        <summary>Zaboravio sam lozinku.</summary>
        <p>Javi se roditelju ili osobi koja je postavila Mudrolinu.</p>
      </details>
      <details>
        <summary>Zvučnik 🔊 se ne prikazuje.</summary>
        <p>Preglednik nema hrvatski glas. Na Android tabletima i Chromebookovima on obično postoji; na računalu pokušajte s preglednikom Edge ili Chrome.</p>
      </details>
    </section>
  </div>
</template>

<style scoped>
.upute { max-width: 780px; }
.upute section { margin: 1.75rem 0; scroll-margin-top: 80px; }
.upute h2 { font-size: 1.3rem; margin: 0 0 .75rem; color: var(--text-primary); }
.upute p, .upute li { color: var(--text-secondary); line-height: 1.6; }
.upute li { margin-bottom: .4rem; }
.upute p a, .upute li a { color: var(--coral-dark); font-weight: 600; }
.upute-sadrzaj { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: 1rem; }
.upute-sadrzaj a {
  padding: .35rem .8rem; border-radius: var(--r-full); background: var(--bg-warm);
  color: var(--text-secondary); text-decoration: none; font-size: .9rem;
}
.upute-sadrzaj a:hover { background: var(--coral-light); color: var(--text-primary); }
.upute-koraci { padding-left: 1.3rem; }
.upute-kartice { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: .75rem; margin: 1rem 0; }
.upute-kartica { background: var(--surface); border: 1px solid var(--bg-warm); border-radius: var(--r-md); padding: .9rem; }
.upute-kartica p { margin: 0; font-size: .95rem; }
.upute-ikona { font-size: 1.6rem; margin-bottom: .3rem; }
.upute-savjet { background: var(--amber-light); border-radius: var(--r-md); padding: .7rem 1rem; }
.upute-tablica { width: 100%; border-collapse: collapse; font-size: .95rem; }
.upute-tablica th, .upute-tablica td { text-align: left; padding: .5rem; border-bottom: 1px solid var(--bg-warm); vertical-align: top; }
.upute-tablica th { color: var(--text-primary); }
.upute-tablica td:first-child { white-space: nowrap; font-weight: 600; color: var(--text-primary); }
details { border: 1px solid var(--bg-warm); border-radius: var(--r-md); padding: .6rem .9rem; margin-bottom: .5rem; background: var(--surface); }
summary { cursor: pointer; font-weight: 600; color: var(--text-primary); }
details p { margin: .5rem 0 0; }
@media (max-width: 480px) {
  .upute-tablica td:first-child { white-space: normal; }
}
</style>
