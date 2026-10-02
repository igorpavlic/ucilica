/**
 * provjeri-lokalno.js — nijedan generator ni tekst za čitanje ne smije imati
 * pojam koji dijete ne može znati: daleku državu, strani grad, stranu valutu ili
 * nemetričku mjeru (seeds/lokalno.js). Strane životinje, biljke i bajke su
 * dopuštene.
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
  }
}
const IZNIMKE_TEKSTA = /^(graz\w*|new york\w*)$/i; // Teslin život: studij u Grazu, smrt u New Yorku (podatak je u tekstu)
for (const t of TEKSTOVI) {
  for (const m of `${t.naslov} ${t.tekst}`.matchAll(new RegExp(STRANO.source, 'giu'))) {
    if (!IZNIMKE_TEKSTA.test(m[0])) lose.push(`tekst ${t.id}: „${m[0]}”`);
  }
}
const jedinstveno = [...new Set(lose)];
if (jedinstveno.length) {
  log(`✗ Pojmovi koje dijete ne zna (daleke države, strani gradovi, valute, mjere) — ${jedinstveno.length}`);
  jedinstveno.slice(0, 15).forEach((x) => log('   ', x));
  process.exit(1);
}
log('OK: nema dalekih država, stranih gradova, valuta ni nemetričkih mjera.');
