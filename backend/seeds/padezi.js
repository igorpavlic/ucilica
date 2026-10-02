/**
 * padezi.js — prepoznavanje pogrešnog padeža iza prijedloga u tekstu pitanja.
 *
 * Povod: „Koji dan dolazi nakon: četvrtak?” i „Tko radi u "polje"?”.
 * Iza „nakon, prije, poslije, do, od, iz, bez” ide genitiv, a iza „u, na”
 * za mjesto lokativ. Dvotočka iza prijedloga i citat u nominativu to skrivaju.
 *
 * Koriste ga test (test/provjeri-pitanja.js) i popravak baze
 * (tools/popravi-pitanja.js), da obje strane gledaju isto pravilo.
 */
const HR = require('./hr-gramatika');

// Citati u hrvatskim navodnicima su tuđi tekst („Upotrijebiti do: 5. 1.”).
const bezCitata = (t) => String(t || '').replace(/„[^“”]*[“”]/g, ' ');
const NOM_VREMENA = Object.entries(HR.VREMENSKE).filter(([n, [g]]) => n !== g).map(([n]) => n);
const RE_NOM = new RegExp(`(?<!\\p{L})(nakon|prije|poslije|do|od|iz|bez)\\s+"?(${NOM_VREMENA.join('|')})(?!\\p{L})`, 'iu');
const RE_DVOTOCKA = /(?<!\p{L})(nakon|prije|poslije|do|od|iz|bez|u|na|za)\s*:\s/iu;
const RE_LOKATIV_CITAT = /(?<!\p{L})(u|na)\s+"[^"]+"\s*\?/u;

/** true ako tekst ima prijedlog s pogrešnim padežom */
function pogresanPadez(tekst) {
  const t = bezCitata(tekst);
  return RE_DVOTOCKA.test(t) || RE_NOM.test(t) || RE_LOKATIV_CITAT.test(t);
}

/** Je li „Točno/Netočno” ponuđeno uz pitanje (treba Da/Ne) */
const tocnoUzPitanje = (q) => q?.type === 'choice' && Array.isArray(q.answers) && q.answers.length === 2
  && q.answers.includes('Točno') && /\?\s*$/.test(String(q.question || ''));

module.exports = { pogresanPadez, tocnoUzPitanje };
