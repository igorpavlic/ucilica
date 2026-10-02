/**
 * provjeri-lokalno.js — pitanja ostaju u hrvatskom okviru: nijedan generator ne
 * smije dati pitanje vezano uz strana mjesta i pojmove (seeds/lokalno.js), a
 * tekstovi za čitanje ne smiju ih imati u tekstu.
 */
const log = console.log; console.log = () => {};
const { GENERATORS } = require('../services/questionGenerator');
const { straniPojam, STRANO } = require('../seeds/lokalno');
const { TEKSTOVI } = require('../seeds/citanje-tekstovi');

const lose = [];
for (const [slug, gen] of Object.entries(GENERATORS)) {
  for (let i = 0; i < 3; i++) for (const q of gen()) {
    const p = straniPojam(q, gen.name);
    if (p) lose.push(`${slug}: „${p}” u „${q.question.slice(0, 70)}”`);
    if (/\$\d/.test(JSON.stringify(q))) lose.push(`${slug}: neispravna zamjena u „${q.question.slice(0, 70)}”`);
  }
}
const IZNIMKE_TEKSTA = /^(andersen\w*|zebr\w*|slon\w*)$/i; // „hrvatski Andersen”, Brijuni (zebre, slonica Lanka)
for (const t of TEKSTOVI) {
  for (const m of `${t.naslov} ${t.tekst}`.matchAll(new RegExp(STRANO.source, 'giu'))) {
    if (!IZNIMKE_TEKSTA.test(m[0])) lose.push(`tekst ${t.id}: „${m[0]}”`);
  }
}
const jedinstveno = [...new Set(lose)];
if (jedinstveno.length) {
  log(`✗ Pitanja vezana uz strana mjesta i pojmove — ${jedinstveno.length}`);
  jedinstveno.slice(0, 15).forEach((x) => log('   ', x));
  process.exit(1);
}
log('OK: nijedno pitanje nije vezano uz strana mjesta i pojmove.');
