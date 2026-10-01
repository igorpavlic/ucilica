/**
 * Nepoznati broj — MAT OŠ B.3.1 i B.4.1.
 *
 * B.3.1: rješava zadatke s jednim nepoznatim članom koristeći se slovom kao
 *        oznakom za broj (uključuje zamjenu slova zadanim brojem).
 * B.4.1: određuje vrijednost nepoznate veličine u jednakostima ili
 *        nejednakostima; razlikuje jednakost od nejednakosti.
 *        Sustavne jednadžbe se ne uče — jedna računska operacija, nepoznanica
 *        se računa iz veze među računskim operacijama.
 *
 * Brojevi se biraju pri svakom pozivu, pa ponovno generiranje nakon
 * iscrpljivanja teme daje nove zadatke. Ometači u izboru su tipične pogreške:
 * kriva računska operacija (zbroj umjesto razlike) i pogreška za jedan.
 *
 * Slova: b, c, x, y — ne „a”, „i”, „o”, „u”, „s”, „k”, koja su u hrvatskom
 * i riječi („Koliko je a ako je a + 5…”).
 */
const HR = require('./hr-gramatika');

const cijeli = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const jedan = (arr) => arr[Math.floor(Math.random() * arr.length)];
const promijesaj = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const izbor = (pitanje, tocno, krivi, tezina, extra = {}) => {
  const ostali = [...new Set(krivi.map(String))].filter((k) => k !== String(tocno) && !/^-/.test(k)).slice(0, 3);
  const answers = promijesaj([String(tocno), ...ostali]);
  return { type: 'choice', difficulty: tezina, question: pitanje, answers, correctIndex: answers.indexOf(String(tocno)), ...extra };
};
const upis = (pitanje, odgovor, tezina, extra = {}) =>
  ({ type: 'input', difficulty: tezina, question: pitanje, correctAnswer: String(odgovor), ...extra });
const tocnoNetocno = (pitanje, tocno, tezina, extra = {}) =>
  ({ type: 'true-false', difficulty: tezina, question: pitanje, correct: !!tocno, ...extra });
const SLOVA = ['b', 'c', 'x', 'y'];
const ometaci = (t, zbrojKrivo) => [zbrojKrivo, t + 1, t - 1, t + 10, t - 10];

/** Raspon brojeva po razredu. */
const RASPON = {
  3: { zbr: () => { const zb = cijeli(4, 99) * 10 + cijeli(0, 9); const p = cijeli(Math.ceil(zb * 0.2), Math.floor(zb * 0.8)); return [p, zb - p, zb]; },
       mn: () => { const p = cijeli(2, 10), d = cijeli(2, 10); return [p, d, p * d]; } },
  4: { zbr: () => { const zb = cijeli(120, 999) * 10; const p = cijeli(Math.ceil(zb * 0.2 / 10), Math.floor(zb * 0.8 / 10)) * 10 + cijeli(0, 9); return [p, zb - p, zb]; },
       mn: () => { const p = cijeli(12, 250), d = cijeli(2, 9); return [p, d, p * d]; } },
};

/**
 * Obitelji jednakosti s jednim nepoznatim članom. Svaka vraća zadatak u
 * zapisu s kvadratićem (□) ili slovom.
 */
function jednakosti(razred, slovo) {
  const [p, d, zb] = RASPON[razred].zbr();
  const [m1, m2, um] = RASPON[razred].mn();
  const ishod = razred === 3 ? 'MAT OŠ B.3.1' : 'MAT OŠ B.4.1';
  const s = slovo;
  return {
    drugiPribrojnik: () => upis(`Koji broj nedostaje: ${p} + □ = ${zb}?`, d, 1,
      { ishod, objasnjenje: `Nepoznati pribrojnik je razlika zbroja i poznatog pribrojnika: ${zb} − ${p} = ${d}.` }),
    prviPribrojnik: () => upis(`Koliko je ${s} ako je ${s} + ${d} = ${zb}?`, p, 2,
      { ishod, objasnjenje: `${s} = ${zb} − ${d} = ${p}. Provjera: ${p} + ${d} = ${zb}.` }),
    umanjitelj: () => upis(`Koliko je ${s} ako je ${zb} − ${s} = ${p}?`, d, 3,
      { ishod, objasnjenje: `Od umanjenika oduzmi razliku: ${zb} − ${p} = ${d}. Provjera: ${zb} − ${d} = ${p}.` }),
    umanjenik: () => upis(`Koliko je ${s} ako je ${s} − ${d} = ${p}?`, zb, 2,
      { ishod, objasnjenje: `Umanjenik je zbroj razlike i umanjitelja: ${p} + ${d} = ${zb}.` }),
    faktor: () => upis(`Koji broj nedostaje: ${m1} · □ = ${um}?`, m2, 2,
      { ishod, objasnjenje: `Nepoznati faktor dobiješ dijeljenjem: ${um} : ${m1} = ${m2}.` }),
    djeljenik: () => upis(`Koliko je ${s} ako je ${s} : ${m2} = ${m1}?`, um, 3,
      { ishod, objasnjenje: `Djeljenik je umnožak količnika i djelitelja: ${m1} · ${m2} = ${um}.` }),
    djelitelj: () => upis(`Koliko je ${s} ako je ${um} : ${s} = ${m1}?`, m2, 3,
      { ishod, objasnjenje: `${um} : ${m1} = ${m2}. Provjera: ${um} : ${m2} = ${m1}.` }),
    izborPribrojnik: () => izbor(`Koji broj treba upisati umjesto ${s} da jednakost bude točna: ${s} + ${p} = ${zb}?`, d, ometaci(d, zb + p), 2,
      { ishod, objasnjenje: `${zb} − ${p} = ${d}. Broj ${zb + p} ne može biti pribrojnik jer je veći od zbroja ${zb}.` }),
    izborUmanjitelj: () => izbor(`Koji broj treba upisati umjesto ${s} da jednakost bude točna: ${zb} − ${s} = ${d}?`, p, ometaci(p, zb + d), 3,
      { ishod, objasnjenje: `${zb} − ${d} = ${p}. Provjera: ${zb} − ${p} = ${d}.` }),
    provjera: () => {
      const tocno = Math.random() < 0.5, ponudeno = tocno ? d : d + jedan([1, -1, 10]);
      return tocnoNetocno(`Je li broj ${ponudeno} rješenje jednakosti ${p} + ${s} = ${zb}?`, tocno, 2,
        { ishod, objasnjenje: `Uvrsti broj umjesto ${s}: ${p} + ${ponudeno} = ${p + ponudeno}${tocno ? '' : `, a ne ${zb}`}.` });
    },
    zamjena: () => {
      const v = cijeli(2, razred === 3 ? 9 : 25), k = cijeli(razred === 3 ? 11 : 120, razred === 3 ? 89 : 950);
      return jedan([
        () => upis(`Ako je ${s} = ${v}, koliko je ${s} + ${k}?`, v + k, 1, { ishod, objasnjenje: `Umjesto ${s} piši ${v}: ${v} + ${k} = ${v + k}.` }),
        () => upis(`Ako je ${s} = ${v}, koliko je ${k} − ${s}?`, k - v, 2, { ishod, objasnjenje: `Umjesto ${s} piši ${v}: ${k} − ${v} = ${k - v}.` }),
        () => upis(`Ako je ${s} = ${m2}, koliko je ${m1} · ${s}?`, um, 2, { ishod, objasnjenje: `Umjesto ${s} piši ${m2}: ${m1} · ${m2} = ${um}.` }),
      ])();
    },
  };
}

// Priče s jednim nepoznatim brojem. Imenice idu kroz hr-gramatika, pa
// „1 naljepnica / 3 naljepnice / 5 naljepnica” stoji kako treba.
const PREDMETI = ['naljepnica', 'slicica', 'bojica', 'kamencic', 'knjiga', 'loptica'];

function prica(razred) {
  const [p, d, zb] = razred === 3
    ? (() => { const zb = cijeli(25, 300); const p = cijeli(5, zb - 5); return [p, zb - p, zb]; })()
    // Priča traži stvarne količine: tisuće naljepnica u kutiji nisu uvjerljive.
    : (() => { const zb = cijeli(200, 999); const p = cijeli(40, zb - 40); return [p, zb - p, zb]; })();
  const kljuc = jedan(PREDMETI);
  const gm = HR.IMENICE[kljuc].o[2]; // genitiv množine
  const B = (n, padez = 'N') => HR.brojIme(n, kljuc, padez);
  return jedan([
    () => ({
      tekst: `U kutiji je bilo nekoliko ${gm}. Učiteljica je dodala još ${B(d, 'A')}. Sada ${HR.biti(zb)} u kutiji ${B(zb)}.`,
      pitanje: `Koliko je ${gm} bilo u kutiji na početku?`, rj: p, jedn: `x + ${d} = ${zb}`,
      krive: [`${d} + ${zb} = x`, `x − ${d} = ${zb}`, `${zb} + x = ${d}`],
      obj: `x + ${d} = ${zb}, pa je x = ${zb} − ${d} = ${p}.`,
    }),
    () => ({
      tekst: `Zbirka je imala ${B(zb, 'A')}. Nekoliko ih je poklonjeno prijateljima. Sada ${HR.biti(p)} u zbirci ${B(p)}.`,
      pitanje: `Koliko je ${gm} poklonjeno?`, rj: d, jedn: `${zb} − x = ${p}`,
      krive: [`${zb} + x = ${p}`, `x − ${zb} = ${p}`, `${p} − ${zb} = x`],
      obj: `${zb} − x = ${p}, pa je x = ${zb} − ${p} = ${d}.`,
    }),
    () => ({
      tekst: `S prve police učenici su premjestili ${B(d, 'A')} na drugu policu. Na prvoj polici sada ${HR.biti(p)} ${B(p)}.`,
      pitanje: `Koliko je ${gm} bilo na prvoj polici na početku?`, rj: zb, jedn: `x − ${d} = ${p}`,
      krive: [`x + ${d} = ${p}`, `${d} − x = ${p}`, `${p} − ${d} = x`],
      obj: `x − ${d} = ${p}, pa je x = ${p} + ${d} = ${zb}.`,
    }),
  ])();
}

function pricaZadatci(razred) {
  const ishod = razred === 3 ? 'MAT OŠ B.3.1' : 'MAT OŠ B.4.1';
  const pr = prica(razred);
  return [
    upis(`${pr.tekst} ${pr.pitanje}`, pr.rj, 3, { ishod, objasnjenje: pr.obj }),
    izbor(`${pr.tekst} Koja jednakost odgovara zadatku?`, pr.jedn, pr.krive, 3, { ishod, objasnjenje: `Nepoznati broj označimo s x: ${pr.jedn}.` }),
  ];
}

// ── 4. razred: nejednakosti ─────────────────────────────────────────

function nejednakosti(s) {
  const ishod = 'MAT OŠ B.4.1';
  const q = [];
  const a = cijeli(3, 40), gr = a + cijeli(5, 30);
  // s + a < gr → najveći s = gr − a − 1
  q.push(upis(`Koji je najveći prirodni broj ${s} za koji vrijedi ${s} + ${a} < ${gr}?`, gr - a - 1, 3,
    { ishod, objasnjenje: `${s} + ${a} = ${gr} kad je ${s} = ${gr - a}. Mora biti manje, pa je najveći ${gr - a - 1}.` }));
  const b = cijeli(3, 40), dg = b + cijeli(5, 40);
  // s − b > dg → najmanji s = dg + b + 1
  q.push(upis(`Koji je najmanji prirodni broj ${s} za koji vrijedi ${s} − ${b} > ${dg}?`, dg + b + 1, 3,
    { ishod, objasnjenje: `${s} − ${b} = ${dg} kad je ${s} = ${dg + b}. Mora biti veće, pa je najmanji ${dg + b + 1}.` }));
  // Odaberi broj koji zadovoljava: točno jedan od ponuđenih.
  const f = cijeli(3, 9), granica = f * cijeli(4, 12) + cijeli(1, f - 1);
  const najveci = Math.floor((granica - 1) / f);
  const tocan = cijeli(Math.max(1, najveci - 3), najveci);
  q.push(izbor(`Koji broj zadovoljava nejednakost ${f} · ${s} < ${granica}?`, tocan,
    [najveci + 1, najveci + 2, najveci + 4], 3,
    { ishod, objasnjenje: `${f} · ${tocan} = ${f * tocan} < ${granica}, a već ${f} · ${najveci + 1} = ${f * (najveci + 1)} nije manje od ${granica}.` }));
  // Točno/netočno
  const t = cijeli(5, 60), g = t + cijeli(-6, 6) * 2 + 1; // nikad jednako
  q.push(tocnoNetocno(`Zadovoljava li broj ${t} nejednakost ${s} + 15 > ${g + 15}?`, t > g, 2,
    { ishod, objasnjenje: `${t} + 15 = ${t + 15}, a to je ${t > g ? 'veće' : 'manje'} od ${g + 15}.` }));
  // Razlikovanje jednakosti i nejednakosti
  const [x1, x2] = [cijeli(4, 30), cijeli(4, 30)];
  const nej = `${s} + ${x1} < ${x1 + x2}`;
  q.push(izbor('Koji je zapis nejednakost?', nej,
    [`${s} + ${x1} = ${x1 + x2}`, `${x1} + ${x2} = ${x1 + x2}`, `${x1 * 2} − ${x1} = ${x1}`], 1,
    { ishod, objasnjenje: 'Nejednakost ima znak < ili >, a jednakost znak =.' }));
  return q;
}

// ── Javni generatori ────────────────────────────────────────────────

const OBITELJI = ['drugiPribrojnik', 'prviPribrojnik', 'umanjitelj', 'umanjenik', 'faktor', 'djeljenik', 'djelitelj', 'izborPribrojnik', 'izborUmanjitelj', 'provjera', 'zamjena'];

function skupi(razred, krugova, slovo) {
  const q = [];
  for (let i = 0; i < krugova; i++) {
    const obitelji = jednakosti(razred, slovo);
    for (const ime of OBITELJI) q.push(obitelji[ime]());
  }
  return q;
}

// Jedno slovo po banci: „x + 5 = 9” i „y + 5 = 9” ista su vrsta zadatka,
// a obitelj pitanja razlikuje ih samo po tekstu.
function genNepoznati3() {
  const q = skupi(3, 4, jedan(SLOVA));
  for (let i = 0; i < 4; i++) q.push(...pricaZadatci(3));
  return q;
}

function genNepoznati4() {
  const slovo = jedan(SLOVA);
  const q = skupi(4, 3, slovo);
  for (let i = 0; i < 3; i++) q.push(...pricaZadatci(4));
  q.push(...nejednakosti(slovo), ...nejednakosti(slovo));
  return q;
}

module.exports = { genNepoznati3, genNepoznati4 };
