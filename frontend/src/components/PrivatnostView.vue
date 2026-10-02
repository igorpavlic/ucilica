<template>
  <div class="shell privatnost">
    <h1 class="page-title">Obavijest o <span>privatnosti</span></h1>
    <p class="privatnost-verzija">Verzija od 2. 10. 2026. · za roditelje i skrbnike</p>

    <!--
      Napomena za onoga tko postavlja Mudrolinu: u odjeljku „Tko obrađuje podatke”
      upiši svoje ime ili naziv i e-adresu za kontakt. Bez toga obavijest nije potpuna.
    -->
    <section>
      <h2>Ukratko</h2>
      <ul>
        <li>Mudrolina čuva samo ono što treba za vježbu: korisničko ime, nadimak, avatar, razred i odgovore u kvizovima.</li>
        <li>Ne tražimo ime i prezime, broj mobitela, adresu ni fotografiju. E-adresu roditelja upisujete samo ako želite odgovor na prijavu pogrešnog pitanja.</li>
        <li>Nema oglasa, nema praćenja preko drugih stranica, ništa ne prodajemo i ne dijelimo.</li>
        <li>U svakom trenutku možete preuzeti sve podatke ili trajno obrisati račun u <router-link to="/profile">profilu</router-link>.</li>
      </ul>
    </section>

    <section>
      <h2>Tko obrađuje podatke</h2>
      <p>Voditelj obrade je osoba ili ustanova koja je postavila ovu Mudrolinu: <strong>From RIM, contact@fromrim.com</strong>.</p>
    </section>

    <section>
      <h2>Koje podatke čuvamo i zašto</h2>
      <table class="privatnost-tablica">
        <thead><tr><th>Podatak</th><th>Zašto</th></tr></thead>
        <tbody>
          <tr><td>korisničko ime i lozinka (šifrirana, bcrypt)</td><td>prijava</td></tr>
          <tr><td>nadimak i avatar</td><td>prikaz u aplikaciji</td></tr>
          <tr><td>razred</td><td>izbor gradiva</td></tr>
          <tr><td>odgovori u kvizovima, točnost, vrijeme odgovora</td><td>da dijete ne dobiva ista pitanja, da se ponavlja ono što zaboravlja i da zadatci budu primjerene težine</td></tr>
          <tr><td>dani kad je riješen dnevni izazov</td><td>niz dana zaredom</td></tr>
          <tr><td>datum i verzija privole</td><td>dokaz da je roditelj dao privolu</td></tr>
          <tr><td>e-adresa roditelja (neobavezno, upisuje se u profilu)</td><td>samo za odgovor na prijavu pitanja; ne šaljemo obavijesti ni reklame</td></tr>
          <tr><td>prijave pitanja (tekst razloga, pitanje, korisničko ime)</td><td>ispravak pogrešnih pitanja; prijava se šalje e-poštom osobi koja održava pitanja</td></tr>
        </tbody>
      </table>
      <p>Odgovori se koriste i zbirno, bez imena, za procjenu težine pitanja i otkrivanje loše postavljenih zadataka.</p>
    </section>

    <section>
      <h2>Pravna osnova</h2>
      <p>
        Privola roditelja ili skrbnika (Opća uredba o zaštiti podataka, čl. 6. st. 1. t. a i čl. 8.).
        Djeca u Hrvatskoj sama daju privolu za ovakve usluge tek od 16. godine
        (Zakon o provedbi Opće uredbe o zaštiti podataka, čl. 19.), pa registraciju potvrđuje roditelj.
        Privolu možete povući u svakom trenutku brisanjem računa.
      </p>
    </section>

    <section>
      <h2>Gdje i koliko dugo</h2>
      <p>
        Podatci se čuvaju na poslužitelju u Europskoj uniji, dok račun postoji.
        Nedovršene kviz-sesije brišu se automatski nakon 6 sati.
        Brisanjem računa trajno se brišu korisnik i svi njegovi odgovori.
      </p>
    </section>

    <section>
      <h2>Vaša prava</h2>
      <ul>
        <li><strong>pristup i prenosivost</strong> — „Preuzmi moje podatke” u profilu (JSON datoteka);</li>
        <li><strong>ispravak</strong> — nadimak, avatar i razred mijenjate u profilu;</li>
        <li><strong>brisanje</strong> — „Obriši račun” u profilu;</li>
        <li><strong>pritužba</strong> — Agenciji za zaštitu osobnih podataka (azop.hr).</li>
      </ul>
    </section>

    <section>
      <h2>Savjet za korisničko ime</h2>
      <p>Ne upisujte pravo ime i prezime djeteta. Dovoljan je nadimak, npr. „zeleni_zmaj”.</p>
    </section>
  </div>
</template>

<style scoped>
.privatnost { max-width: 760px; }
.privatnost section { margin: 1.25rem 0; }
.privatnost h2 { font-size: 1.15rem; margin: 0 0 .5rem; color: var(--text-primary); }
.privatnost p, .privatnost li { color: var(--text-secondary); line-height: 1.6; }
.privatnost-verzija { color: var(--text-tertiary); margin-top: -.5rem; }
.privatnost-tablica { width: 100%; border-collapse: collapse; font-size: .95rem; }
.privatnost-tablica th, .privatnost-tablica td { text-align: left; padding: .45rem .5rem; border-bottom: 1px solid var(--bg-warm); vertical-align: top; }
.privatnost-tablica th { color: var(--text-primary); }
</style>
