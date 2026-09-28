/**
 * slogovi.js — brojanje i rastavljanje slogova u hrvatskim riječima
 *
 * Dosad su brojevi slogova stajali u ručnim tablicama:
 *   [["ja",1],["mama",2],["jabuka",3],["televizor",4], …]
 * To radi samo za riječi koje netko unaprijed upiše. Čim generator uzme
 * imenicu iz rječnika koja nije na popisu, zadatka o slogovima nema.
 *
 * ── Zašto se ne koristi knjižnica za prijelom riječi ──────────────────
 *
 * Postoje gotove knjižnice s hrvatskim uzorcima (npm `hyphen`, `hyphenopoly`).
 * Ali TeX-ovi uzorci za prijelom NISU isto što i slogovi: oni označavaju
 * samo mjesta gdje je sigurno prelomiti redak, pa namjerno ne razdvajaju
 * dva samoglasnika ni početni samoglasnik.
 *
 *   hyphen("oko")   → "oko"    (a treba o-ko)
 *   hyphen("auto")  → "auto"   (a treba a-u-to)
 *   hyphen("ulica") → "uli-ca" (a treba u-li-ca)
 *
 * Za brojanje slogova to daje krive rezultate. U hrvatskome je pravilo
 * jednostavno i ne treba mu rječnik: koliko u riječi ima samoglasnika,
 * toliko je slogova — uz jedan dodatak, slogotvorno "r".
 *
 * ── Slogotvorno r ─────────────────────────────────────────────────────
 *
 * "r" se ponaša kao samoglasnik kad s obje strane nema samoglasnika:
 *   prst, vrt, krv, smrt  → 1 slog
 *   sr-ce, cr-ven, pr-vi  → 2 sloga
 *   Hr-vat-ska            → 3 sloga
 * Ali ne i kad je uz samoglasnik:
 *   tra-va, vri-je-me, ru-ka → "r" je običan suglasnik
 *
 * Provjereno na svim riječima koje su dosad stajale u ručnim tablicama —
 * vidi test/provjeri-pitanja.js.
 */

const SAMOGLASNICI = new Set(['a', 'e', 'i', 'o', 'u']);

const jeSamoglasnik = (z) => SAMOGLASNICI.has(z);

/** Samo slova; broj, razmak i interpunkcija ispadaju. */
const ocisti = (rijec) =>
  String(rijec || '')
    .toLowerCase()
    .replace(/[^a-zčćžšđ]/g, '');

/**
 * Je li "r" na položaju i slogotvorno — to jest, je li ono jezgra sloga.
 * Uvjet: ni slovo prije ni slovo poslije nije samoglasnik.
 */
function slogotvornoR(slova, i) {
  if (slova[i] !== 'r') return false;
  const prije = i > 0 ? slova[i - 1] : null;
  const poslije = i < slova.length - 1 ? slova[i + 1] : null;
  if (prije && jeSamoglasnik(prije)) return false;
  if (poslije && jeSamoglasnik(poslije)) return false;
  // "r" posve sam ili na kraju iza samoglasnika nije jezgra
  return slova.length > 1;
}

/** Položaji jezgri slogova u riječi. */
function jezgre(rijec) {
  const slova = [...ocisti(rijec)];
  const izlaz = [];
  for (let i = 0; i < slova.length; i++) {
    if (jeSamoglasnik(slova[i]) || slogotvornoR(slova, i)) izlaz.push(i);
  }
  return izlaz;
}

/**
 * Broj slogova. Riječ bez ijedne jezgre (npr. kratica) broji se kao jedan slog
 * jer se i takva izgovara kao cjelina.
 */
function brojSlogova(rijec) {
  const n = jezgre(rijec).length;
  return n || (ocisti(rijec) ? 1 : 0);
}

/** Zvonačnici — suglasnici koji mogu stajati kao drugi član početnoga skupa. */
const ZVONACNICI = new Set(['l', 'lj', 'r', 'n', 'nj', 'm', 'v', 'j']);
/** Prvi član skupa koji dopušta gotovo svaki drugi suglasnik (st-, šk-, zd-, žm-). */
const SIKTAVCI = new Set(['s', 'š', 'z', 'ž']);

/**
 * Može li skup od dva suglasnika stajati na početku hrvatske riječi?
 *   sk (skok), st (stol), pl (plav), tr (trava), vr (vrata)
 *   a ne: tsk, jč, vts
 */
function moguciPocetak(skup) {
  if (skup.length <= 1) return true;
  if (skup.length > 2) return false;
  const [prvi, drugi] = skup;
  return ZVONACNICI.has(drugi) || SIKTAVCI.has(prvi);
}

/**
 * Koliko suglasnika iz skupa između dviju jezgri pripada sljedećem slogu.
 *
 * Školsko pravilo, provjereno na primjerima iz udžbenika:
 *   1 suglasnik  → ide sljedećem slogu        ma-ma, ško-la, pti-ca
 *   2 suglasnika → dijele se                  sun-ce, o-lov-ka, zdrav-lje, zvjez-di-ca
 *   3 i više     → zadnja dva idu sljedećem   Hr-vat-ska  ("sk" može početi riječ)
 *                  slogu ako mogu početi riječ; inače samo zadnji
 *
 * Dvoslov (lj, nj, dž) je pritom jedan suglasnik: pro-lje-će, u-či-te-lji-ca.
 */
function uSljedeciSlog(skup) {
  if (skup.length <= 1) return skup.length;
  if (skup.length === 2) return 1;
  return moguciPocetak(skup.slice(-2)) ? 2 : 1;
}

/**
 * Rastavljanje na slogove.
 *
 * Pravilo: sljedeći slog uzima onoliko suglasnika koliko ih može stajati
 * na početku hrvatske riječi. "Hrvatska" → Hr-vat-ska jer "sk" može početi
 * riječ (skok), a "tsk" ne može. Ako između dviju jezgri nema suglasnika,
 * granica je odmah iza prve — hrvatski nema dvoglasa, pa je a-u-to.
 *
 * Dvoslovi dž, lj i nj broje se kao jedan suglasnik: u-či-te-lji-ca.
 *
 * Za brojanje se koristi brojSlogova(); rastavljanje je pomoć pri prikazu
 * i ne pokriva svaki rubni slučaj hrvatskoga sloga.
 */
const DVOSLOVI = ['dž', 'lj', 'nj'];

/** Niz "jedinica": dvoslov je jedna jedinica, ostalo pojedinačna slova. */
function jedinice(slova) {
  const izlaz = [];
  for (let i = 0; i < slova.length; i++) {
    const par = slova[i] + (slova[i + 1] || '');
    if (DVOSLOVI.includes(par)) { izlaz.push({ tekst: par, od: i }); i++; }
    else izlaz.push({ tekst: slova[i], od: i });
  }
  return izlaz;
}

function rastavi(rijec) {
  const slova = [...ocisti(rijec)];
  if (!slova.length) return [];

  const jed = jedinice(slova);
  const jezgraIdx = jed
    .map((u, i) => (jeSamoglasnik(u.tekst) || slogotvornoR(slova, u.od) ? i : -1))
    .filter((i) => i >= 0);
  if (jezgraIdx.length <= 1) return [slova.join('')];

  const granice = [];
  for (let k = 0; k < jezgraIdx.length - 1; k++) {
    const a = jezgraIdx[k];
    const b = jezgraIdx[k + 1];
    const skup = jed.slice(a + 1, b).map((u) => u.tekst);

    granice.push(jed[b - uSljedeciSlog(skup)].od);
  }

  const dijelovi = [];
  let od = 0;
  for (const g of granice) { dijelovi.push(slova.slice(od, g).join('')); od = g; }
  dijelovi.push(slova.slice(od).join(''));
  return dijelovi.filter(Boolean);
}

module.exports = { brojSlogova, rastavi, jezgre, SAMOGLASNICI };
