/**
 * objasnjenja.js — objašnjenja za generirana pitanja
 *
 * Analiza od 1. 10. 2026.: 98,5 % pitanja nema objašnjenja. „Točan odgovor je 10”
 * popravlja ishod, ali „1 000 = 10 × 100, zato ima 10 stotica” gradi razumijevanje.
 *
 * Ovaj modul NE piše rečenicu „Točan odgovor je …”. Objašnjenje se stvara samo
 * kad se iz samog zadatka može pokazati POSTUPAK (račun, usporedba, mjesna
 * vrijednost, glasovna analiza) ili primijeniti PRAVILO (veliko slovo, vrsta
 * rečenice, apoeni). Ako to nije moguće — činjenice iz prirode i društva,
 * pravopisne iznimke — pitanje ostaje bez objašnjenja i vodi se kao praznina
 * koju treba popuniti autorski.
 *
 * Svako objašnjenje se prije upisa PROVJERAVA: izračunani rezultat mora biti
 * jednak ključu pitanja. Ako nije, objašnjenje se ne upisuje (i to je signal da
 * ključ ili predložak treba pregledati — vidi `provjeriKljuc`).
 *
 * Vrste: 'postupak' (koraci računa/analize), 'pravilo' (jezično ili
 * matematičko pravilo primijenjeno na zadatak).
 */

const { rastavi } = require('../seeds/slogovi');

// ── pomoćnici ──────────────────────────────────────────────────────

const ABECEDA = ['a', 'b', 'c', 'č', 'ć', 'd', 'dž', 'đ', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'lj', 'm', 'n', 'nj', 'o', 'p', 'r', 's', 'š', 't', 'u', 'v', 'z', 'ž'];
const SAMOGLASNICI = ['a', 'e', 'i', 'o', 'u'];

/** "12 450" / "12.450" → 12450 u tekstu, da se izrazi mogu čitati. */
function spojiBrojeve(t) {
  return String(t).replace(/\b(\d{1,3})((?:[ . ]\d{3})+)\b(?!\.\d)/g, (m, a, b) => a + b.replace(/[ . ]/g, ''));
}

/** Zapis broja kako ga dijete vidi: 12 450 (razmak između skupina). */
function fmt(n) {
  if (!Number.isFinite(n)) return String(n);
  const s = String(Math.abs(n));
  const g = s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : s;
  return (n < 0 ? '−' : '') + g;
}

/** Pravilan oblik imenice uz broj: 1 znak, 2 znaka, 5 znakova. */
function uzBroj(n, [jd, pauk, mn]) {
  const d = n % 10, s = n % 100;
  if (d === 1 && s !== 11) return `${n} ${jd}`;
  if (d >= 2 && d <= 4 && (s < 12 || s > 14)) return `${n} ${pauk}`;
  return `${n} ${mn}`;
}
const ZNAK_I = ['znak', 'znaka', 'znakova'];
const ZNAMENKA_I = ['znamenku', 'znamenke', 'znamenaka'];

const brojevi = (t) => (spojiBrojeve(t).match(/\d+/g) || []).map(Number);
const kljucOd = (q) => {
  if (q.type === 'choice') return q._c ?? q.answers?.[q.correctIndex];
  if (q.type === 'true-false') return q.correct;
  return q.correctAnswer;
};
const kaoBroj = (v) => {
  const s = spojiBrojeve(String(v ?? '')).trim().replace(/\s*€$/, '');
  return /^-?\d+$/.test(s) ? Number(s) : null;
};
const navodno = (t) => (String(t).match(/["„“]([^"„“”]+)["”“]/) || [])[1];

/** Glasovi riječi s dvoslovima kao jednim glasom (lj, nj, dž). */
function glasovi(rijec) {
  const w = String(rijec).toLowerCase();
  const out = [];
  for (let i = 0; i < w.length; i++) {
    const dva = w.slice(i, i + 2);
    if (['lj', 'nj', 'dž'].includes(dva)) { out.push(dva); i++; } else if (/\p{L}/u.test(w[i])) out.push(w[i]);
  }
  return out;
}

// ── aritmetika ─────────────────────────────────────────────────────

const OP = { '+': (a, b) => a + b, '-': (a, b) => a - b, '−': (a, b) => a - b, '×': (a, b) => a * b, '÷': (a, b) => a / b, ':': (a, b) => a / b };
const ZNAK = { '+': '+', '-': '−', '−': '−', '×': '×', '÷': '÷', ':': '÷' };

/** Postupak za a op b = r, prilagođen veličini brojeva. */
function postupak(a, op, b) {
  const r = OP[op](a, b);
  if (!Number.isFinite(r)) return null;
  const z = ZNAK[op];
  if (z === '+') {
    if (a < 10 && b < 10 && r > 10) {
      const do10 = 10 - a;
      return `Do 10 nedostaje ${do10}: ${a} + ${do10} = 10. Ostaje još ${b - do10}: 10 + ${b - do10} = ${r}.`;
    }
    if (b === 0 || a === 0) return `Dodamo li nulu, broj se ne mijenja: ${fmt(a)} + ${fmt(b)} = ${fmt(r)}.`;
    if (a < 100 && b < 100 && a % 10 === 0 && b % 10 === 0) return `${a / 10} desetica i ${b / 10} desetica čine ${r / 10} desetica: ${a} + ${b} = ${r}.`;
    if (a < 100 && b < 100 && a >= 10 && b >= 10) {
      const d = Math.floor(a / 10) * 10 + Math.floor(b / 10) * 10, j = (a % 10) + (b % 10);
      return `Zbroji desetice pa jedinice: ${Math.floor(a / 10) * 10} + ${Math.floor(b / 10) * 10} = ${d}, ${a % 10} + ${b % 10} = ${j}. Zatim ${d} + ${j} = ${r}.`;
    }
    if (r >= 1000) return `Zbrajaj pisano: potpiši jedinice ispod jedinica, desetice ispod desetica i kreni od jedinica. Kad zbroj na nekom mjestu prijeđe 9, prenesi jedan na sljedeće mjesto. ${fmt(a)} + ${fmt(b)} = ${fmt(r)}.`;
    return `${fmt(a)} + ${fmt(b)} = ${fmt(r)}. Provjera oduzimanjem: ${fmt(r)} − ${fmt(b)} = ${fmt(a)}.`;
  }
  if (z === '−') {
    if (b === 0) return `Oduzmemo li nulu, broj se ne mijenja: ${fmt(a)} − 0 = ${fmt(a)}.`;
    if (a === b) return `Kad od broja oduzmemo isti broj, ostaje 0: ${fmt(a)} − ${fmt(b)} = 0.`;
    if (a > 10 && a < 20 && b < 10 && a - b < 10) {
      const do10 = a - 10;
      return `Najprije do 10: ${a} − ${do10} = 10. Ostaje oduzeti još ${b - do10}: 10 − ${b - do10} = ${r}.`;
    }
    if (a < 100 && b >= 10) {
      const d = Math.floor(b / 10) * 10;
      return `Oduzmi najprije desetice, pa jedinice: ${a} − ${d} = ${a - d}, zatim ${a - d} − ${b % 10} = ${r}. Provjera: ${r} + ${b} = ${a}.`;
    }
    if (a >= 1000) return `Oduzimaj pisano od jedinica. Kad je gornja znamenka manja od donje, posudi jednu jedinicu sljedećega mjesta. ${fmt(a)} − ${fmt(b)} = ${fmt(r)}. Provjera: ${fmt(r)} + ${fmt(b)} = ${fmt(a)}.`;
    return `${fmt(a)} − ${fmt(b)} = ${fmt(r)}. Provjera zbrajanjem: ${fmt(r)} + ${fmt(b)} = ${fmt(a)}.`;
  }
  if (z === '×') {
    if (a <= 1 || b <= 1) return b === 0 || a === 0 ? `Kad množimo nulom, umnožak je 0: ${a} × ${b} = 0.` : `Množenje s 1 ne mijenja broj: ${a} × ${b} = ${r}.`;
    if (a <= 5 && b <= 10) return `${a} × ${b} znači ${a} puta po ${b}: ${Array(a).fill(b).join(' + ')} = ${r}.`;
    if (a >= 10 && b >= 10 && a < 100 && b < 100 && b % 10 !== 0) {
      const p1 = a * (b % 10), p2 = a * (b - b % 10);
      return `Rastavi drugi faktor: ${b} = ${b - b % 10} + ${b % 10}. ${a} × ${b % 10} = ${fmt(p1)}, ${a} × ${b - b % 10} = ${fmt(p2)}. Zbroji djelomične umnoške: ${fmt(p1)} + ${fmt(p2)} = ${fmt(r)}.`;
    }
    if (a >= 10 && b < 10) {
      const d = a - a % 10;
      return `Rastavi ${a} = ${d} + ${a % 10}. ${d} × ${b} = ${fmt(d * b)}, ${a % 10} × ${b} = ${a % 10 * b}. Zbroji: ${fmt(d * b)} + ${a % 10 * b} = ${fmt(r)}.`;
    }
    return `${a} × ${b} = ${fmt(r)}. Provjera dijeljenjem: ${fmt(r)} ÷ ${b} = ${a}.`;
  }
  if (z === '÷') {
    if (!Number.isInteger(r)) return null;
    return `Tražimo broj koji pomnožen s ${b} daje ${fmt(a)}: ${r} × ${b} = ${fmt(a)}, zato je ${fmt(a)} ÷ ${b} = ${r}.`;
  }
  return null;
}

/** Nepoznati član u a op b = c (jedan od a, b, c je null). */
function nepoznati(a, op, b, c) {
  const z = ZNAK[op];
  if (c == null) return { v: OP[op](a, b), t: postupak(a, op, b) };
  if (z === '+') {
    if (b == null) return { v: c - a, t: `Nepoznati pribrojnik dobijemo oduzimanjem: ${fmt(c)} − ${fmt(a)} = ${fmt(c - a)}. Provjera: ${fmt(a)} + ${fmt(c - a)} = ${fmt(c)}.` };
    return { v: c - b, t: `Nepoznati pribrojnik dobijemo oduzimanjem: ${fmt(c)} − ${fmt(b)} = ${fmt(c - b)}. Provjera: ${fmt(c - b)} + ${fmt(b)} = ${fmt(c)}.` };
  }
  if (z === '−') {
    if (b == null) return { v: a - c, t: `Oduzimamo onoliko koliko je razlika od ${fmt(a)} do ${fmt(c)}: ${fmt(a)} − ${fmt(c)} = ${fmt(a - c)}. Provjera: ${fmt(a)} − ${fmt(a - c)} = ${fmt(c)}.` };
    return { v: c + b, t: `Nepoznati umanjenik dobijemo zbrajanjem: ${fmt(c)} + ${fmt(b)} = ${fmt(c + b)}. Provjera: ${fmt(c + b)} − ${fmt(b)} = ${fmt(c)}.` };
  }
  if (z === '×') {
    const poznat = a == null ? b : a;
    return { v: c / poznat, t: `Nepoznati faktor dobijemo dijeljenjem: ${fmt(c)} ÷ ${poznat} = ${fmt(c / poznat)}. Provjera: ${poznat} × ${fmt(c / poznat)} = ${fmt(c)}.` };
  }
  if (z === '÷') {
    if (a == null) return { v: c * b, t: `Nepoznati djeljenik dobijemo množenjem: ${fmt(c)} × ${b} = ${fmt(c * b)}. Provjera: ${fmt(c * b)} ÷ ${b} = ${fmt(c)}.` };
    return { v: a / c, t: `Nepoznati djelitelj: ${fmt(a)} ÷ ${fmt(c)} = ${fmt(a / c)}. Provjera: ${fmt(a)} ÷ ${fmt(a / c)} = ${fmt(c)}.` };
  }
  return null;
}

/** Izraz s praznim mjestom u tekstu pitanja: "a + ___ = c", "□ − 5 = 7", "a × b = ?". */
function izrazUTekstu(tekst) {
  const t = spojiBrojeve(tekst).replace(/\s*€/g, '').replace(/_{2,}|□/g, 'X');
  const m = t.match(/(\d+|X)\s*([+\-−×÷:])\s*(\d+|X)\s*=\s*(\d+|X|\?)/);
  if (!m) return null;
  const v = (s) => (s === 'X' || s === '?' ? null : Number(s));
  const [a, b, c] = [v(m[1]), v(m[3]), v(m[4])];
  if ([a, b, c].filter((x) => x == null).length !== 1) return null;
  return nepoznati(a, m[2], b, c);
}

/** Jednostavni izrazi bez znaka jednakosti: "Koliko je 7 + 5?", "Koji je rezultat zbrajanja 45 + 27?". */
function goliIzraz(tekst) {
  const t = spojiBrojeve(tekst).replace(/\s*€/g, '');
  const m = t.match(/(\d+)\s*([+\-−×÷])\s*(\d+)(?!\s*[=\d])/);
  if (!m) return null;
  return { v: OP[m[2]](+m[1], +m[3]), t: postupak(+m[1], m[2], +m[3]) };
}

/** Riječima zadani računi. */
const VERBALNO = [
  [/zbroj brojeva (\d+) i (\d+)/, (a, b) => [a, '+', b]],
  [/razliku brojeva (\d+) i (\d+)/, (a, b) => [a, '-', b]],
  [/umnožak brojeva (\d+) i (\d+)/, (a, b) => [a, '×', b]],
  [/količnik brojeva (\d+) i (\d+)/, (a, b) => [a, '÷', b]],
  [/Broju (\d+) dodaj (\d+)/, (a, b) => [a, '+', b]],
  [/Od broja (\d+) oduzmi (\d+)/, (a, b) => [a, '-', b]],
  [/Koliko puta broj (\d+) stane u broj (\d+)/, (d, t) => [t, '÷', d]]
];

function verbalno(tekst) {
  const t = spojiBrojeve(tekst);
  for (const [re, f] of VERBALNO) {
    const m = t.match(re);
    if (m) { const [a, op, b] = f(+m[1], +m[2]); return { v: OP[op](a, b), t: postupak(a, op, b) }; }
  }
  let m = t.match(/Koji broj treba dodati broju (\d+) da dobiješ (\d+)/);
  if (m) return nepoznati(+m[1], '+', null, +m[2]);
  m = t.match(/Koliko treba oduzeti od (\d+) da dobiješ (\d+)/);
  if (m) return nepoznati(+m[1], '-', null, +m[2]);
  m = t.match(/broj (\d+) zbrojiš sam sa sobom (\d+) puta/);
  if (m) { const b = +m[1], a = +m[2]; return { v: a * b, t: `Zbrajamo ${b} ukupno ${a} puta: ${Array(a).fill(b).join(' + ')} = ${a * b}. To je isto što i ${a} × ${b}.` }; }
  return null;
}

/** Tekstualni zadatak: dva broja, ključ je rezultat jedne operacije; ključne riječi biraju operaciju. */
function prica(tekst, kljuc) {
  const k = kaoBroj(kljuc);
  if (k == null) return null;
  const nums = brojevi(tekst.replace(/\b(1|2|3|4)\. b\b/, ''));
  if (nums.length !== 2) return null;
  const [a, b] = nums;
  const t = tekst.toLowerCase();
  const kandidati = [];
  const dodaj = (op, x, y, razlog) => { if (OP[op](x, y) === k) kandidati.push({ op, x, y, razlog }); };
  if (/(dodaj|još|ukupno|zajedno|doleti|donese|dobiješ|dobije|na drugoj)/.test(t)) dodaj('+', a, b, 'Količina se povećava, pa zbrajamo.');
  if (/(ostane|ostalo|potroši|pojedemo|posudimo|maknemo|odleti|izađe|uvene|natrag|otpremljeno|više .* nego)/.test(t)) dodaj('-', Math.max(a, b), Math.min(a, b), 'Dio se oduzima od cjeline, pa oduzimamo.');
  if (/( po |svakom|svakoj|redova|tanjura|skupin)/.test(t) && !/(podijeli|rasporedi|jednako)/.test(t)) dodaj('×', a, b, 'Isti broj ponavlja se više puta, pa množimo.');
  if (/(podijeli|rasporedi|jednako|skupine po)/.test(t)) { dodaj('÷', a, b, 'Dijelimo na jednake dijelove, pa dijelimo.'); dodaj('÷', b, a, 'Dijelimo na jednake dijelove, pa dijelimo.'); }
  if (kandidati.length !== 1) return null;
  const { op, x, y, razlog } = kandidati[0];
  return { v: k, t: `${razlog} ${postupak(x, op, y)}` };
}

// ── usporedba i mjesna vrijednost ─────────────────────────────────

const MJESTA = ['jedinica', 'desetica', 'stotica', 'tisućica', 'desetica tisućica', 'stotica tisućica', 'milijuna'];

function usporedi(a, b) {
  if (a === b) return `Brojevi ${fmt(a)} i ${fmt(b)} su jednaki.`;
  const [v, m] = a > b ? [a, b] : [b, a];
  if (v <= 20) return `Na brojevnoj crti ${v} je desno od ${m}, pa je ${v} veći od ${m}.`;
  const sv = String(v), sm = String(m);
  if (sv.length !== sm.length) return `${fmt(v)} ima više znamenaka (${sv.length}) od ${fmt(m)} (${sm.length}), pa je ${fmt(v)} veći.`;
  for (let i = 0; i < sv.length; i++) {
    if (sv[i] !== sm[i]) {
      const mjesto = MJESTA[sv.length - 1 - i];
      return `Oba broja imaju ${uzBroj(sv.length, ZNAMENKA_I).replace('znamenku', 'znamenka')}. Uspoređujemo slijeva: na mjestu ${mjesto} ${sv[i]} > ${sm[i]}, pa je ${fmt(v)} veći od ${fmt(m)}.`;
    }
  }
  return null;
}

function znakUsporedbe(a, b) { return a < b ? '<' : a > b ? '>' : '='; }

/** Vrijednost strane u usporedbi: broj ili jednostavan izraz. */
function strana(s) {
  const t = spojiBrojeve(s).trim();
  if (/^\d+$/.test(t)) return { v: +t, opis: t };
  const m = t.match(/^(\d+)\s*([+\-−×÷])\s*(\d+)$/);
  if (m) { const v = OP[m[2]](+m[1], +m[3]); return { v, opis: `${m[1]} ${ZNAK[m[2]]} ${m[3]} = ${v}` }; }
  return null;
}

// ── pravila ────────────────────────────────────────────────────────

const VRSTA_RIJECI = {
  imenica: 'imenuje biće, predmet, mjesto ili pojavu',
  glagol: 'izriče radnju, stanje ili zbivanje',
  pridjev: 'izriče osobinu ili svojstvo',
  broj: 'izriče količinu ili redoslijed',
  zamjenica: 'zamjenjuje imenicu'
};

const JEDINICE = { 'm>cm': 100, 'km>m': 1000, 'kg>g': 1000, 'L>dL': 10, 'L>mL': 1000, 'h>min': 60, 'min>s': 60, 'dan>h': 24, 'tjedan>dana': 7, 'dm>cm': 10, 'm>dm': 10 };

const SAT = { '🕐': 1, '🕑': 2, '🕒': 3, '🕓': 4, '🕔': 5, '🕕': 6, '🕖': 7, '🕗': 8, '🕘': 9, '🕙': 10, '🕚': 11, '🕛': 12 };

const UPITNE = /^(tko|što|sto|gdje|kada|kad|kako|zašto|koliko|koji|koja|koje|čiji|je li|ide li|ima li|hoćeš li|možeš li|\p{L}+ li)\b/iu;

function vrstaRecenice(r) {
  const s = r.trim();
  if (s.endsWith('?')) return { vrsta: 'upitna', znak: 'upitnik', zasto: 'postavlja pitanje' };
  if (s.endsWith('!')) return { vrsta: 'usklična', znak: 'uskličnik', zasto: 'izražava jak osjećaj, poziv ili zapovijed' };
  if (s.endsWith('.')) return { vrsta: 'izjavna', znak: 'točka', zasto: 'nešto izjavljuje' };
  return null;
}

function brojVidljivih(vizual) {
  if (!vizual) return 0;
  const seg = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('hr', { granularity: 'grapheme' }) : null;
  const z = seg ? [...seg.segment(vizual)].map((s) => s.segment) : [...vizual];
  return z.filter((x) => x.trim()).length;
}

// ── glavna funkcija ───────────────────────────────────────────────

/**
 * Vrati { tekst, vrsta, pravilo } ili null.
 * `pravilo` je naziv grane koja je objašnjenje izvela (za statistiku i pregled).
 */
function objasni(q) {
  if (!q || !q.question) return null;
  const t = q.question;
  const kljuc = kljucOd(q);
  const k = kaoBroj(kljuc);
  const izlaz = (tekst, vrsta, pravilo) => (tekst ? { tekst, vrsta, pravilo } : null);
  const brojcano = (r, pravilo) => (r && r.t && k != null && Math.abs(r.v - k) < 1e-9 ? izlaz(r.t, 'postupak', pravilo) : null);

  let m;

  // 1) Računi s jednakošću ili praznim mjestom
  if (k != null) {
    const r = brojcano(izrazUTekstu(t), 'izraz-jednakost') || brojcano(verbalno(t), 'racun-rijecima')
      || brojcano(goliIzraz(t), 'izraz') || brojcano(prica(t, kljuc), 'tekstualni-zadatak');
    if (r) return r;
  }

  // 2) Choice: točna jednakost / izraz među ponuđenima
  if (q.type === 'choice' && typeof kljuc === 'string') {
    m = spojiBrojeve(kljuc).match(/^(\d+)\s*([+\-−×÷])\s*(\d+)(?:\s*=\s*(\d+))?$/);
    if (m) {
      const v = OP[m[2]](+m[1], +m[3]);
      if (m[4] == null || +m[4] === v) {
        const cilj = brojevi(t).pop();
        if (/(rezultat|vrijednost|daje|jednak)/.test(t) && (cilj === v || m[4] != null)) {
          return izlaz(`${postupak(+m[1], m[2], +m[3])} Ostale ponude ne daju ${fmt(v)}.`, 'postupak', 'odabir-izraza');
        }
      }
    }
    if (/^(\d+ \+ )+\d+$/.test(kljuc) && (m = t.match(/računu (\d+) × (\d+)/))) {
      return izlaz(`${m[1]} × ${m[2]} znači ${m[1]} puta po ${m[2]}, pa se ${m[2]} zbraja ${m[1]} puta: ${kljuc}.`, 'pravilo', 'mnozenje-kao-zbrajanje');
    }
    if ((m = t.match(/provjerava da je (\d+) ÷ (\d+) = (\d+)/))) {
      return izlaz(`Dijeljenje provjeravamo množenjem: ${m[3]} × ${m[2]} = ${m[1]}.`, 'pravilo', 'provjera-dijeljenja');
    }
    if ((m = t.match(/Je li (zbroj|razlika) (\d+) ([+\-]) (\d+) (?:veći|veća), (?:manji|manja) ili (?:jednak|jednaka) broju (\d+)/))) {
      const v = OP[m[3]](+m[2], +m[4]), c = +m[5];
      const rel = v < c ? 'manj' : v > c ? 'već' : 'jednak';
      if (String(kljuc).startsWith(rel)) {
        return izlaz(`${m[2]} ${ZNAK[m[3]]} ${m[4]} = ${v}. Broj ${v} je ${v < c ? 'manji od' : v > c ? 'veći od' : 'jednak broju'} ${c}.`, 'postupak', 'usporedba-rezultata');
      }
    }
  }

  // 3) Usporedbe brojeva
  if ((m = spojiBrojeve(t).match(/Koji je broj (veći|manji): (\d+) ili (\d+)/)) || (m = spojiBrojeve(t).match(/Upiši (veći|manji) od brojeva (\d+) i (\d+)/))) {
    const a = +m[2], b = +m[3], tr = m[1] === 'veći' ? Math.max(a, b) : Math.min(a, b);
    if (k === tr) return izlaz(usporedi(a, b), 'postupak', 'usporedba');
  }
  if ((m = spojiBrojeve(t).match(/Jesu li brojevi (\d+) i (\d+) jednaki/))) {
    return izlaz(usporedi(+m[1], +m[2]), 'postupak', 'usporedba');
  }
  if ((m = spojiBrojeve(t).match(/točnu usporedbu brojeva (\d+) i (\d+)/))) {
    const a = +m[1], b = +m[2];
    if (String(kljuc).includes(znakUsporedbe(a, b))) return izlaz(`${usporedi(a, b)} Zato je ${a} ${znakUsporedbe(a, b)} ${b}.`, 'postupak', 'usporedba');
  }
  if (/○|kružića|__ \d|ide između/.test(t)) {
    const tt = spojiBrojeve(t).replace(/^.*?:\s*/, '').replace(/^Koji znak ide između brojeva\s*/, '').replace(/\?$/, '');
    const dijelovi = tt.split(/\s*(?:○|__)\s*/);
    if (dijelovi.length === 2) {
      const L = strana(dijelovi[0]), D = strana(dijelovi[1]);
      if (L && D && String(kljuc).trim().startsWith(znakUsporedbe(L.v, D.v))) {
        const racun = [L, D].filter((s) => s.opis.includes('=')).map((s) => s.opis).join(', ');
        return izlaz(`${racun ? racun + '. ' : ''}${usporedi(L.v, D.v)} Zato ide znak ${znakUsporedbe(L.v, D.v)}.`, 'postupak', 'znak-usporedbe');
      }
    }
  }
  if ((m = spojiBrojeve(t).match(/Koji je od ovih brojeva (najveći|najmanji): ([\d, ]+)\?/))) {
    const nums = m[2].split(/,\s*/).map(Number);
    const tr = m[1] === 'najveći' ? Math.max(...nums) : Math.min(...nums);
    if (k === tr) return izlaz(`Poredaj brojeve od najmanjeg do najvećeg: ${[...nums].sort((a, b) => a - b).join(', ')}. ${m[1] === 'najveći' ? 'Posljednji' : 'Prvi'} je ${tr}.`, 'postupak', 'poredak');
  }

  // 4) Brojevni niz, prethodnik, sljedbenik
  if ((m = spojiBrojeve(t).match(/(?:dolazi NAKON broja|sljedbenik broja) (\d+)/i)) && k === +m[1] + 1) return izlaz(`Sljedbenik je za 1 veći: ${m[1]} + 1 = ${k}.`, 'pravilo', 'sljedbenik');
  if ((m = spojiBrojeve(t).match(/(?:dolazi PRIJE broja|prethodnik broja) (\d+)/i)) && k === +m[1] - 1) return izlaz(`Prethodnik je za 1 manji: ${m[1]} − 1 = ${k}.`, 'pravilo', 'prethodnik');
  if ((m = spojiBrojeve(t).match(/između brojeva (\d+) i (\d+)/)) && k != null && k > Math.min(+m[1], +m[2]) && k < Math.max(+m[1], +m[2])) return izlaz(`Brojimo: ${Math.min(+m[1], +m[2])}, ${k}, ${Math.max(+m[1], +m[2])}. Broj ${k} je između njih.`, 'postupak', 'izmedu');
  if ((m = spojiBrojeve(t).match(/(\d+), (\d+), (\d+), ___/))) {
    const [a, b, c] = [+m[1], +m[2], +m[3]];
    if (b - a === c - b && k === c + (c - b)) return izlaz(`Svaki je sljedeći broj ${c - b >= 0 ? 'veći' : 'manji'} za ${Math.abs(c - b)}: ${c} ${c - b >= 0 ? '+' : '−'} ${Math.abs(c - b)} = ${k}.`, 'postupak', 'niz');
  }
  if ((m = spojiBrojeve(t).match(/(\d+), ___, (\d+), (\d+)/))) {
    const [a, c, d] = [+m[1], +m[2], +m[3]]; const korak = d - c;
    if (k === a + korak && a + 2 * korak === c) return izlaz(`Korak niza je ${korak}: ${a} + ${korak} = ${k}, ${k} + ${korak} = ${c}.`, 'postupak', 'niz');
  }

  // 5) Mjesna vrijednost, zaokruživanje, znamenke, parnost
  if ((m = spojiBrojeve(t).match(/Koliko (desetica|jedinica|stotica|tisućica) ima broj (\d+)/))) {
    const n = +m[2], idx = { jedinica: 0, desetica: 1, stotica: 2, tisućica: 3 }[m[1]];
    const s = String(n); const z = Number(s[s.length - 1 - idx] || 0);
    if (k === z) return izlaz(`U broju ${fmt(n)} znamenka na mjestu ${m[1]} je ${z}.`, 'pravilo', 'mjesna-vrijednost');
    if (k === Math.floor(n / 10 ** idx)) return izlaz(`${fmt(n)} = ${k} × ${fmt(10 ** idx)}${n % 10 ** idx ? ` + ${n % 10 ** idx}` : ''}, pa broj ima ${k} ${m[1]}.`, 'postupak', 'mjesna-vrijednost');
  }
  if ((m = spojiBrojeve(t).match(/Koja je znamenka (jedinica|desetica|stotica|tisućica) u broju (\d+)/))) {
    const s = m[2], idx = { jedinica: 0, desetica: 1, stotica: 2, tisućica: 3 }[m[1]];
    const z = Number(s[s.length - 1 - idx]);
    if (k === z) return izlaz(`Brojimo mjesta zdesna: jedinice, desetice, stotice, tisućice. Na mjestu ${m[1]} u broju ${fmt(+s)} stoji ${z}.`, 'pravilo', 'mjesna-vrijednost');
  }
  if ((m = spojiBrojeve(t).match(/broj ima (\d+) desetica i (\d+) jedinica/))) {
    if (k === +m[1] * 10 + +m[2]) return izlaz(`${m[1]} desetica je ${+m[1] * 10}, i još ${m[2]} jedinica: ${+m[1] * 10} + ${m[2]} = ${k}.`, 'postupak', 'mjesna-vrijednost');
  }
  if ((m = spojiBrojeve(t).match(/Koliko je (\d+) zaokruženo na (stotice|tisućice|desetice)/))) {
    const n = +m[1], d = { desetice: 10, stotice: 100, tisućice: 1000 }[m[2]];
    const r = Math.round(n / d) * d; const z = Math.floor((n % d) / (d / 10));
    if (k === r) return izlaz(`Gledamo znamenku desno od mjesta na koje zaokružujemo: ${z}. ${z >= 5 ? `${z} ≥ 5, pa zaokružujemo naviše` : `${z} < 5, pa zaokružujemo naniže`}: ${fmt(r)}.`, 'pravilo', 'zaokruzivanje');
  }
  if ((m = spojiBrojeve(t).match(/Koliko znamenaka ima broj (\d+)/))) {
    if (k === m[1].length) return izlaz(`Broj ${fmt(+m[1])} zapisan je znamenkama ${m[1].split('').join(', ')} — ukupno ${k}.`, 'postupak', 'znamenke');
  }
  if ((m = spojiBrojeve(t).match(/Kakav je broj (\d+)/)) && /paran|neparan/.test(String(kljuc))) {
    const n = +m[1], j = n % 10, par = n % 2 === 0;
    if (String(kljuc).startsWith(par ? 'paran' : 'neparan')) return izlaz(`Gledamo znamenku jedinica: ${j}. ${par ? `${j} je djeljiv s 2, pa je broj paran.` : `${j} nije djeljiv s 2, pa je broj neparan.`}`, 'pravilo', 'parnost');
  }
  if (/tisućica, stotica, desetica i jedinica/.test(t) && (m = spojiBrojeve(t).match(/broj (\d+)/))) {
    const s = m[1]; const dij = s.split('').map((z, i) => Number(z) * 10 ** (s.length - 1 - i)).filter(Boolean);
    return izlaz(`Svaka znamenka vrijedi prema svom mjestu: ${dij.map(fmt).join(' + ')} = ${fmt(+s)}.`, 'pravilo', 'rastav');
  }

  // 6) Prebrojavanje prikaza (1. razred)
  if (q.visual && k != null) {
    const n = brojVidljivih(q.visual);
    if (n > 0) {
      if (/Prebroji prikazane|Koji broj odgovara prikazanoj/.test(t) && k === n) return izlaz(`Brojimo jedan po jedan (ili u skupinama po pet): na slici je ${uzBroj(n, ZNAK_I)}.`, 'postupak', 'brojenje');
      if (/nedostaje do ukupno 10/.test(t) && k === 10 - n) return izlaz(`Na slici je ${uzBroj(n, ZNAK_I)}. ${n} + ${10 - n} = 10, pa nedostaje ${10 - n}.`, 'postupak', 'brojenje');
      if (/dodali još jedan/.test(t) && k === n + 1) return izlaz(`Na slici je ${uzBroj(n, ZNAK_I)}. Jedan više: ${n} + 1 = ${n + 1}.`, 'postupak', 'brojenje');
      if (/maknuli jedan/.test(t) && k === n - 1) return izlaz(`Na slici je ${uzBroj(n, ZNAK_I)}. Jedan manje: ${n} − 1 = ${n - 1}.`, 'postupak', 'brojenje');
      if (/za jedan veći od njihove količine/.test(t) && k === n + 1) return izlaz(`Na slici je ${uzBroj(n, ZNAK_I)}. Broj za jedan veći je ${n + 1}.`, 'postupak', 'brojenje');
    }
  }
  if (q.visual && q.type === 'choice') {
    const n = brojVidljivih(q.visual);
    if (/više od 5 znakova/.test(t) && n) return izlaz(`Na slici je ${uzBroj(n, ZNAK_I)}. ${n} je ${n > 5 ? 'više' : 'manje ili jednako'} od 5.`, 'postupak', 'brojenje');
    if ((m = t.match(/jednaka broju (\d+)/)) && n) return izlaz(`Na slici je ${uzBroj(n, ZNAK_I)}, ${n === +m[1] ? 'isto' : 'a ne'} ${m[1]}.`, 'postupak', 'brojenje');
    if ((m = t.match(/manja, veća ili jednaka broju (\d+)/)) && n) return izlaz(`Na slici je ${uzBroj(n, ZNAK_I)}. ${n} je ${n < +m[1] ? 'manje od' : n > +m[1] ? 'više od' : 'jednako'} ${m[1]}.`, 'postupak', 'brojenje');
    if (/brojna riječ/.test(t) && n) return izlaz(`Na slici je ${uzBroj(n, ZNAK_I)}, a broj ${n} izgovaramo „${kljuc}”.`, 'postupak', 'brojenje');
  }
  if (/Koliko je sati|Koliko sati/.test(t) && SAT[q.visual] && k === SAT[q.visual]) {
    return izlaz(`Velika kazaljka je na 12, a mala pokazuje ${k}, pa je točno ${k} sati.`, 'pravilo', 'sat');
  }

  // 7) Mjerne jedinice, novac, geometrija
  if ((m = t.match(/Koliko je to (\w+)\? Izraz glasi (\d+) (\w+)\./)) || (m = t.match(/Dopuni: (\d+) (\w+) = ___ (\w+)\./))) {
    const [n, iz, u] = m[0].startsWith('Dopuni') ? [+m[1], m[2], m[3]] : [+m[2], m[3], m[1]];
    const f = JEDINICE[`${iz}>${u}`];
    if (f && k === n * f) return izlaz(`1 ${iz} = ${f} ${u}${n !== 1 ? `, pa je ${n} ${iz} = ${n} × ${f} = ${n * f} ${u}` : ''}.`, 'pravilo', 'jedinice');
  }
  if (/stvarni apoen|stvarne apoene/.test(t)) return izlaz('Eurske kovanice od 1 € i 2 €, a novčanice od 5, 10, 20, 50, 100, 200 i 500 €. Apoena od 3, 4, 6, 7, 8, 9 ili 15 € nema.', 'pravilo', 'apoeni');
  if ((m = t.match(/Koja dva apoena mogu zajedno dati (\d+) €/)) && (m = [m[1], ...(String(kljuc).match(/(\d+) € i (\d+) €/) || []).slice(1)]) && m.length === 3 && +m[1] + +m[2] === +m[0]) {
    return izlaz(`${m[1]} € + ${m[2]} € = ${m[0]} €, a ${m[1]} € i ${m[2]} € postoje kao kovanice ili novčanice.`, 'postupak', 'apoeni');
  }
  if ((m = t.match(/Koji je iznos veći/)) && typeof kljuc === 'string') return izlaz(`Uspoređujemo brojeve eura: ${(q.answers || []).join(' i ')}. Veći je ${kljuc}.`, 'postupak', 'usporedba');
  if ((m = t.match(/Pravokutnik ima stranice (\d+) cm i (\d+) cm/)) && k === 2 * (+m[1] + +m[2])) return izlaz(`Pravokutnik ima dvije stranice od ${m[1]} cm i dvije od ${m[2]} cm: ${m[1]} + ${m[2]} + ${m[1]} + ${m[2]} = ${k} cm.`, 'postupak', 'opseg');
  if ((m = t.match(/Kvadrat ima četiri stranice duljine (\d+) cm/)) && k === 4 * +m[1]) return izlaz(`Kvadrat ima četiri jednake stranice: 4 × ${m[1]} cm = ${k} cm.`, 'postupak', 'opseg');
  if ((m = t.match(/zauzima (\d+) × (\d+) polja/)) && k === +m[1] * +m[2]) return izlaz(`${m[1]} redaka po ${m[2]} polja: ${m[1]} × ${m[2]} = ${k} polja.`, 'postupak', 'povrsina');
  if ((m = t.match(/Lik A prekriva (\d+) \S+ mreže, a lik B (\d+)/)) && /veću površinu/.test(t)) return izlaz(`Lik koji prekriva više jediničnih polja ima veću površinu: ${m[1]} ${+m[1] > +m[2] ? '>' : '<'} ${m[2]}.`, 'postupak', 'povrsina');
  const LIKOVI = { trokut: 3, kvadrat: 4, pravokutnik: 4 };
  if ((m = t.match(/Koliko (stranica|kutova|vrhova) ima (trokut|kvadrat|pravokutnik)\?/)) && k === LIKOVI[m[2]]) return izlaz(`${m[2][0].toUpperCase() + m[2].slice(1)} ima ${k} stranice, ${k} vrha i ${k} kuta. Kod mnogokuta broj stranica, vrhova i kutova je jednak.`, 'pravilo', 'likovi');
  if ((m = t.match(/Koliko (ploha|bridova|vrhova) ima kocka/))) {
    const v = { ploha: 6, bridova: 12, vrhova: 8 }[m[1]];
    if (k === v) return izlaz('Kocka ima 6 ploha (kvadrata), 12 bridova i 8 vrhova.', 'pravilo', 'tijela');
  }

  if (/Što znači znak/.test(t) || (/znak usporedbe odgovara brojevima (\d+) i (\d+)/.test(t))) {
    const z = String(kljuc).trim()[0];
    const op = { '<': 'manje od: šiljak pokazuje prema manjem broju', '>': 'veće od: otvor je okrenut prema većem broju', '=': 'jednako: s obje strane je ista vrijednost' }[z];
    if (op) return izlaz(`Znak ${z} znači ${op}.`, 'pravilo', 'znak-usporedbe');
  }

  // 8) Slova i glasovi
  if ((m = t.match(/(?:malo|veliko)(?: tiskano)? slovo odgovara (?:velikom|malom) slovu (\p{L})/u)) || (m = t.match(/U paru (\p{L}) – ___ nedostaje/u))) {
    const s = m[1];
    if (String(kljuc).toLowerCase() === s.toLowerCase()) return izlaz(`${s.toUpperCase()} i ${s.toLowerCase()} isto su slovo: ${s.toUpperCase()} je veliko, a ${s.toLowerCase()} malo tiskano slovo.`, 'pravilo', 'veliko-malo');
  }
  if ((m = t.match(/dvoslov "(\p{L}+)" piše velikim početnim slovom/u))) return izlaz(`Dvoslov ${m[1]} je jedno slovo napisano dvama znakovima. Velikim pišemo samo prvi znak: ${kljuc}.`, 'pravilo', 'dvoslov');
  if (/Koje je od ovih slova malo slovo/.test(t) && typeof kljuc === 'string') return izlaz(`${kljuc} je malo slovo. Ostale ponude su velika slova.`, 'pravilo', 'veliko-malo');
  if ((m = t.match(/Kojim slovom počinje riječ "([^"]+)"/))) { const g = glasovi(m[1]); if (g[0] === String(kljuc).toLowerCase()) return izlaz(`Izgovori polako: ${g.join('-')}. Prvi glas je ${g[0]}.`, 'postupak', 'glasovna-analiza'); }
  if ((m = t.match(/zadnje slovo u riječi "([^"]+)"/))) { const g = glasovi(m[1]); if (g[g.length - 1] === String(kljuc).toLowerCase()) return izlaz(`Izgovori polako: ${g.join('-')}. Zadnji glas je ${g[g.length - 1]}.`, 'postupak', 'glasovna-analiza'); }
  if ((m = t.match(/Koje slovo nedostaje u riječi "([^"]+)"/))) return izlaz(`Kad na prazno mjesto stavimo ${kljuc}, dobijemo riječ „${m[1].replace('_', kljuc)}”.`, 'postupak', 'glasovna-analiza');
  if ((m = t.match(/u abecedi dolazi (nakon|prije) slova "([^"]+)"/))) {
    const i = ABECEDA.indexOf(m[2].toLowerCase()); const j = m[1] === 'nakon' ? i + 1 : i - 1;
    const vel = m[2] === m[2].toUpperCase();
    const pis = (x) => (vel ? x[0].toUpperCase() + x.slice(1) : x);
    if (i >= 0 && ABECEDA[j] === String(kljuc).toLowerCase()) return izlaz(`U abecedi redom: ${ABECEDA.slice(Math.max(0, Math.min(i, j) - 1), Math.max(i, j) + 2).map(pis).join(', ')}. ${m[1] === 'nakon' ? 'Nakon' : 'Prije'} ${m[2]} dolazi ${pis(ABECEDA[j])}.`, 'postupak', 'abeceda');
  }
  if (/NIJE u hrvatskoj abecedi/.test(t)) return izlaz('Slova q, w, x i y nisu u hrvatskoj abecedi. Pojavljuju se samo u stranim riječima i imenima.', 'pravilo', 'abeceda');
  if ((m = t.match(/glas "?(\p{L})"? samoglasnik ili suglasnik/u)) || (m = t.match(/(?:skupinu pripada|tvrdnja o) glas[u]? (\p{L})/u))) {
    const g = m[1], sam = SAMOGLASNICI.includes(g.toLowerCase());
    return izlaz(`Samoglasnici su a, e, i, o, u. ${g} ${sam ? 'je među njima, pa je samoglasnik' : 'nije među njima, pa je suglasnik'}.`, 'pravilo', 'samoglasnici');
  }
  if (/Koji glas je (samoglasnik|suglasnik)\?/.test(t) && typeof kljuc === 'string') {
    return izlaz(`Samoglasnici su a, e, i, o, u. Od ponuđenih je ${kljuc} ${SAMOGLASNICI.includes(kljuc.toLowerCase()) ? 'samoglasnik' : 'suglasnik'}.`, 'pravilo', 'samoglasnici');
  }
  if ((m = t.match(/Koliko (samoglasnika|suglasnika|glasova) ima riječ "([^"]+)"/))) {
    const g = glasovi(m[2]);
    const izbor = m[1] === 'samoglasnika' ? g.filter((x) => SAMOGLASNICI.includes(x)) : m[1] === 'suglasnika' ? g.filter((x) => !SAMOGLASNICI.includes(x)) : g;
    if (k === izbor.length) return izlaz(`Rastavi riječ na glasove: ${g.join('-')}. ${m[1][0].toUpperCase() + m[1].slice(1)}: ${izbor.join(', ')} — ukupno ${k}.${/lj|nj|dž/.test(m[2]) && m[1] !== 'samoglasnika' ? ' Dvoslov (lj, nj, dž) je jedan glas.' : ''}`, 'postupak', 'glasovna-analiza');
  }
  if ((m = t.match(/Koji se samoglasnik nalazi u riječi "([^"]+)"/))) return izlaz(`Rastavi riječ na glasove: ${glasovi(m[1]).join('-')}. Samoglasnik u njoj je ${kljuc}.`, 'postupak', 'glasovna-analiza');
  if ((m = t.match(/Koliko slogova ima riječ "([^"]+)"/))) {
    const s = rastavi(m[1]);
    if (Array.isArray(s) && k === s.length) return izlaz(`Izgovori riječ i pljesni na svaki slog: ${s.join('-')}. To je ${k} ${k === 1 ? 'slog' : k < 5 ? 'sloga' : 'slogova'}.`, 'postupak', 'slogovi');
  }
  if ((m = t.match(/Koja riječ nastaje od slogova "([^"]+)"/))) return izlaz(`Spojimo slogove redom: ${m[1].split(/[-\s]+/).join(' + ')} = ${kljuc}.`, 'postupak', 'slogovi');
  if ((m = t.match(/rimuje s riječi "([^"]+)"/))) {
    const a = m[1], b = String(kljuc); let n = 0;
    while (n < Math.min(a.length, b.length) && a[a.length - 1 - n] === b[b.length - 1 - n]) n++;
    if (n >= 2) return izlaz(`Riječi „${a}” i „${b}” završavaju istim glasovima „-${a.slice(-n)}”, pa se rimuju.`, 'postupak', 'rima');
  }
  if ((m = t.match(/počinje istim slovom kao riječ "([^"]+)"/))) return izlaz(`„${m[1]}” i „${kljuc}” počinju glasom ${glasovi(m[1])[0]}.`, 'postupak', 'glasovna-analiza');

  // 9) Riječi i značenje
  if ((m = t.match(/(?:znači suprotno od riječi|suprotno značenje od(?: riječi)?) "([^"]+)"/))) return izlaz(`„${m[1]}” i „${kljuc}” čine par suprotnosti. Provjera: ako nešto nije ${m[1]}, može biti ${kljuc}.`, 'pravilo', 'suprotnice');
  if ((m = t.match(/U paru ["„]([^"„“”]+?) — ([^"„“”]+)["”“] riječi imaju kakav odnos/)) && /suprotno/.test(String(kljuc))) return izlaz(`„${m[1]}” i „${m[2]}” znače suprotno, kao „gore” i „dolje”.`, 'pravilo', 'suprotnice');
  if ((m = t.match(/slično značenje kao "([^"]+)"/))) return izlaz(`„${m[1]}” i „${kljuc}” znače gotovo isto, pa jednu riječ možemo zamijeniti drugom u rečenici.`, 'pravilo', 'bliskoznacnice');
  if ((m = t.match(/umanjenica (?:riječi |od )"([^"]+)"/i))) return izlaz(`Umanjenica imenuje nešto malo ili drago: ${m[1]} → ${kljuc}. Često završava na -ica, -ić ili -čica.`, 'pravilo', 'umanjenice');
  if ((m = t.match(/uvećanica riječi "([^"]+)"/))) return izlaz(`Uvećanica imenuje nešto veliko: ${m[1]} → ${kljuc}. Često završava na -ina ili -etina.`, 'pravilo', 'uvecanice');
  if ((m = t.match(/(?:vrsti riječi pripada|vrsta riječi) "([^"]+)"/)) && VRSTA_RIJECI[String(kljuc)]) return izlaz(`Riječ „${m[1]}” ${VRSTA_RIJECI[kljuc]}, pa je ${kljuc}.`, 'pravilo', 'vrste-rijeci');
  if ((m = t.match(/vrijeme izriče glagolski oblik "([^"]+)"/))) {
    const opis = { sadašnje: 'radnja se događa sada', prošlo: 'radnja se već dogodila', buduće: 'radnja će se tek dogoditi' };
    const kk = Object.keys(opis).find((x) => String(kljuc).toLowerCase().startsWith(x.slice(0, 4)));
    if (kk) return izlaz(`U obliku „${m[1]}” ${opis[kk]}, pa je to ${kk} vrijeme.`, 'pravilo', 'glagolska-vremena');
  }
  if ((m = t.match(/Riječ "([^"]+)" označava jedno ili više/))) return izlaz(`„${m[1]}” ${kljuc === 'više' ? 'je u množini i označava više bića ili stvari' : 'je u jednini i označava jedno biće ili stvar'}.`, 'pravilo', 'jednina-mnozina');
  if ((m = t.match(/pridjev izveden od imena "([^"]+)"/))) return izlaz(`Pridjev izveden od imena mjesta ili države piše se malim početnim slovom: ${m[1]} → ${kljuc}.`, 'pravilo', 'pridjevi-od-imena');
  if ((m = t.match(/posvojni pridjev nastaje od riječi "([^"]+)"/))) return izlaz(`Posvojni pridjev odgovara na pitanje „čiji?”: ${m[1]} → ${kljuc}. Posvojni pridjev od osobnog imena piše se velikim početnim slovom.`, 'pravilo', 'posvojni-pridjevi');

  // 10) Rečenice
  if ((m = t.match(/(?:Pročitaj rečenicu|ovu rečenicu|ovom rečenicom radi|primjer|prepoznati ovu rečenicu):? ?["„]([^"„“”]+)["”“]/))) {
    const v = vrstaRecenice(m[1]);
    const kl = String(kljuc).toLowerCase();
    const zasto = { upitna: 'postavlja', usklična: 'izražava', izjavna: 'izjavljuje' }[v?.vrsta];
    if (v && (kl.startsWith(v.vrsta.slice(0, 4)) || kl.includes(v.znak) || kl.includes(zasto))) {
      return izlaz(`Rečenica završava znakom ${v.znak} i ${v.zasto}, pa je ${v.vrsta}.`, 'pravilo', 'vrsta-recenice');
    }
  }
  if (/rečenični znak dolazi na prazno mjesto/.test(t)) {
    const r = navodno(t) || '';
    const z = String(kljuc);
    if (z.includes('?')) return izlaz(`Rečenica ${UPITNE.test(r) ? `počinje upitnom riječju („${r.split(' ')[0]}”) i ` : ''}postavlja pitanje, pa završava upitnikom.`, 'pravilo', 'recenicni-znak');
    if (z.includes('!')) return izlaz('Rečenica izražava jak osjećaj, poziv ili zapovijed, pa završava uskličnikom.', 'pravilo', 'recenicni-znak');
    if (z.includes('.')) return izlaz('Rečenica nešto izjavljuje, pa završava točkom.', 'pravilo', 'recenicni-znak');
  }
  if ((m = t.match(/Koliko riječi ima (?:ova )?rečenica[?:]? ?["„]([^"„“”]+)["”“]/))) {
    const r = m[1].replace(/[.,!?]/g, '').trim().split(/\s+/);
    if (k === r.length) return izlaz(`Brojimo riječi između razmaka: ${r.join(' | ')} — ukupno ${k}.`, 'postupak', 'brojenje-rijeci');
  }
  if (/Koja rečenica počinje velikim slovom/.test(t)) return izlaz('Svaka rečenica počinje velikim početnim slovom.', 'pravilo', 'veliko-slovo');
  if (/Koja rečenica ima znak na kraju/.test(t)) return izlaz('Na kraju rečenice uvijek stoji rečenični znak: točka, upitnik ili uskličnik.', 'pravilo', 'recenicni-znak');
  if (/Napiši ovu rečenicu pravilno/.test(t)) return izlaz(`Rečenica počinje velikim početnim slovom i završava rečeničnim znakom: „${kljuc}”.`, 'pravilo', 'veliko-slovo');
  if ((/Koji je zapis pravilan|Kako se pravilno piše|Napiši pravilno/.test(t)) && typeof kljuc === 'string' && /^\p{Lu}/u.test(kljuc)) {
    const rijeci = kljuc.split(' ');
    const vise = rijeci.length > 1 && rijeci.slice(1).every((w) => /^\p{Ll}/u.test(w));
    return izlaz(vise ? `„${kljuc}” je ime, pa ga pišemo velikim početnim slovom. U imenu od više riječi velikim slovom piše se prva riječ, a ostale malim (osim ako su i one imena).` : `„${kljuc}” je ime, a imena ljudi, mjesta, rijeka, država i blagdana pišu se velikim početnim slovom.`, 'pravilo', 'veliko-slovo');
  }

  // 11) Priroda i društvo — samo pravila koja se mogu izreći bez novih tvrdnji
  if ((m = t.match(/kratica za stranu svijeta "([^"]+)"/))) return izlaz(`Kratica strane svijeta je njezino prvo slovo, napisano velikim slovom: ${m[1]} → ${kljuc}.`, 'pravilo', 'strane-svijeta');
  if ((m = t.match(/označava kratica "([^"]+)"/))) return izlaz(`Kratica je prvo slovo naziva strane svijeta: ${m[1]} → ${kljuc}.`, 'pravilo', 'strane-svijeta');
  if (/suprotna strani/.test(t)) return izlaz('Sjever je nasuprot jugu, a istok nasuprot zapadu.', 'pravilo', 'strane-svijeta');
  if (/temperatur[ia].*voda (se )?(smrzava|ključa)/.test(t)) return izlaz('Pri uobičajenom tlaku zraka voda se smrzava pri 0 °C, a ključa pri 100 °C.', 'pravilo', 'voda');

  return null;
}

// ── objašnjenja po skupinama ───────────────────────────────────────
/**
 * Obilježje skupine kojoj pripada točan odgovor. Upotrebljava se samo kad
 * pitanje traži razvrstavanje u tu skupinu. Ovo je slabija vrsta objašnjenja
 * ('skupina'): kaže po čemu prepoznajemo skupinu, ne zašto baš ovaj primjer.
 */
const ZNACAJKE = {
  'proljeće': 'U proljeće dani postaju dulji i topliji, a priroda se budi: biljke listaju i cvjetaju.',
  'ljeto': 'Ljeto je najtopliji dio godine, a dani su najdulji.',
  'jesen': 'U jesen dani postaju kraći i hladniji, lišće žuti i opada, a beru se mnogi plodovi.',
  'zima': 'Zima je najhladniji dio godine, dani su najkraći, a u mnogim krajevima pada snijeg.',
  'jutro': 'Jutro je početak dana: Sunce izlazi, a mi se budimo i spremamo za školu.',
  'prijepodne': 'Prijepodne je dio dana između jutra i podneva.',
  'poslijepodne': 'Poslijepodne je dio dana između podneva i večeri.',
  'večer': 'Navečer Sunce zalazi i pripremamo se za spavanje.',
  'noć': 'Noću je mrak i većina ljudi spava.',
  'domaća': 'Domaće životinje čovjek uzgaja i brine se o njima.',
  'divlja': 'Divlje životinje žive slobodno u prirodi i same pronalaze hranu.',
  'biljožder': 'Biljožder se hrani biljkama.', 'biljojed': 'Biljojed se hrani biljkama.',
  'mesožder': 'Mesožder se hrani drugim životinjama.', 'mesojed': 'Mesojed se hrani drugim životinjama.',
  'svežder': 'Svežder jede i biljnu i životinjsku hranu.', 'svejed': 'Svejed jede i biljnu i životinjsku hranu.',
  'sisavac': 'Sisavci mladunce hrane mlijekom, a većina ima dlaku.', 'sisavci': 'Sisavci mladunce hrane mlijekom, a većina ima dlaku.',
  'ptica': 'Ptice imaju perje, kljun i krila te legu jaja.', 'ptice': 'Ptice imaju perje, kljun i krila te legu jaja.',
  'riba': 'Ribe žive u vodi, dišu škrgama i imaju peraje.', 'ribe': 'Ribe žive u vodi, dišu škrgama i imaju peraje.',
  'gmaz': 'Gmazovi imaju kožu prekrivenu ljuskama ili pločama i legu jaja na kopnu.', 'gmazovi': 'Gmazovi imaju kožu prekrivenu ljuskama ili pločama i legu jaja na kopnu.',
  'vodozemac': 'Vodozemci se razvijaju u vodi, a odrasli žive u vodi i na kopnu.', 'vodozemci': 'Vodozemci se razvijaju u vodi, a odrasli žive u vodi i na kopnu.',
  'kukac': 'Kukci imaju šest nogu, a tijelo im se sastoji od tri dijela.', 'kukci': 'Kukci imaju šest nogu, a tijelo im se sastoji od tri dijela.',
  'probavni': 'Probavni sustav razgrađuje hranu kako bi tijelo dobilo hranjive tvari.',
  'dišni': 'Dišni sustav unosi kisik u tijelo i izbacuje ugljikov dioksid.',
  'krvožilni': 'Krvožilni sustav (srce i krvne žile) raznosi krv po cijelom tijelu.',
  'živčani': 'Živčani sustav (mozak, leđna moždina i živci) upravlja radom tijela.',
  'koštani': 'Koštani sustav daje tijelu oblik i štiti unutarnje organe.',
  'mišićni': 'Mišićni sustav omogućuje kretanje tijela.',
  'primorski': 'Primorski kraj nalazi se uz more.',
  'nizinski': 'Nizinski kraj je ravan i nizak, s plodnim tlom i velikim rijekama.',
  'gorski': 'Gorski kraj je visok i šumovit, s planinama i hladnijim zimama.',
  'brežuljkasti': 'Brežuljkasti kraj ima blage uzvisine — brežuljke.',
  'poljoprivreda': 'Poljoprivreda se bavi uzgojem biljaka i životinja.',
  'ribarstvo': 'Ribarstvo se bavi lovom i uzgojem riba.',
  'šumarstvo': 'Šumarstvo se brine o šumama i njihovu iskorištavanju.',
  'turizam': 'Turizam obuhvaća putovanja, odmor i usluge za posjetitelje.',
  'industrija': 'Industrija proizvodi robu u tvornicama.',
  'trgovina': 'Trgovina se bavi kupnjom i prodajom robe.',
  'obrt': 'Obrt je izrada ili popravak proizvoda u manjim radionicama.',
  'promet': 'Promet obuhvaća prijevoz ljudi i robe.',
  'građevinarstvo': 'Građevinarstvo se bavi gradnjom zgrada, cesta i mostova.',
  'bajka': 'Bajka je priča s čudesnim bićima i događajima.',
  'basna': 'Basna je kratka poučna priča u kojoj često govore životinje.',
  'pjesma': 'Pjesma je napisana u stihovima, koji se slažu u kitice.',
  'igrokaz': 'Igrokaz je tekst za izvođenje: likovi razgovaraju, a izvodi se na pozornici.',
  'personifikacija': 'Personifikacija pripisuje ljudske osobine životinjama, biljkama ili stvarima.',
  'onomatopeja': 'Onomatopeja je riječ koja oponaša zvuk.',
  'krug': 'Krug je omeđen zakrivljenom crtom i nema ravnih stranica ni vrhova.',
  'trokut': 'Trokut ima tri stranice i tri vrha.',
  'kvadrat': 'Kvadrat ima četiri jednake stranice i četiri prava kuta.',
  'pravokutnik': 'Pravokutnik ima četiri prava kuta, a nasuprotne stranice su mu jednake.',
  'kugla': 'Kugla je okrugla sa svih strana i nema bridova ni vrhova.',
  'valjak': 'Valjak ima dvije jednake kružne osnovke i zakrivljeni plašt.',
  'kocka': 'Kocka ima šest jednakih ploha u obliku kvadrata.',
  'kvadar': 'Kvadar ima šest ploha u obliku pravokutnika.',
  'stožac': 'Stožac ima jednu kružnu osnovku i vrh.',
  'piramida': 'Piramida ima osnovku u obliku mnogokuta, a bočne plohe su trokuti koji se sastaju u vrhu.',
  'imenica': 'Imenice imenuju bića, predmete, mjesta i pojave.',
  'glagol': 'Glagoli izriču radnju, stanje ili zbivanje.',
  'pridjev': 'Pridjevi izriču osobinu ili svojstvo.',
  'samoglasnici': 'Samoglasnici su a, e, i, o, u.', 'suglasnici': 'Suglasnici su svi glasovi osim a, e, i, o, u.'
};

/** Je li pitanje razvrstavanje (traži skupinu, doba, vrstu…), a ne npr. Da/Ne. */
const RAZVRSTAVANJE = /(kojem|koje|kojoj|kakva|kakav|koji|u koje|kojim).*(doba|dobu|skupin|sustav|djelatnost|vrst|kraj|lik|tijel|oblik|životinja|prehran|biljk)|biljojed|biljožder|domaća|divlja/i;

/**
 * Dopuni objašnjenja po skupinama unutar jednoga generatora: obilježje skupine
 * i, kad postoje, drugi primjeri iste skupine iz istoga predloška.
 */
function dodajSkupinska(qs) {
  const primjeri = new Map(); // templateId|kljuc → Set(primjer)
  const primjerOd = (q) => navodno(q.question) || (q.visual && q.visual.length <= 8 ? q.visual : null);
  for (const q of qs) {
    const kl = kljucOd(q); if (typeof kl !== 'string') continue;
    const p = primjerOd(q); if (!p) continue;
    const id = `${q.templateId}|${kl}`;
    if (!primjeri.has(id)) primjeri.set(id, new Set());
    primjeri.get(id).add(p);
  }
  return qs.map((q) => {
    if (q.objasnjenje) return q;
    const kl = kljucOd(q);
    if (typeof kl !== 'string') return q;
    const z = ZNACAJKE[kl.toLowerCase()];
    if (!z || !RAZVRSTAVANJE.test(q.question)) return q;
    const ovaj = primjerOd(q);
    const drugi = [...(primjeri.get(`${q.templateId}|${kl}`) || [])].filter((x) => x !== ovaj).slice(0, 3);
    const tekst = drugi.length >= 2 ? `${z} U istu skupinu pripadaju i: ${drugi.join(', ')}.` : z;
    return { ...q, objasnjenje: tekst, objasnjenjeIzvor: 'pravilo:skupina', objasnjenjeVrsta: 'skupina' };
  });
}

/**
 * Dodaj objašnjenje ako ga pitanje nema. Ručno napisano objašnjenje ima prednost.
 * Vraća novo pitanje s `objasnjenje` i `objasnjenjeIzvor`.
 */
function dodajObjasnjenje(q) {
  if (q.objasnjenje) return { ...q, objasnjenjeIzvor: q.objasnjenjeIzvor || 'autor' };
  let o = null;
  try { o = objasni(q); } catch { o = null; }
  if (!o) return q;
  return { ...q, objasnjenje: o.tekst, objasnjenjeIzvor: `pravilo:${o.pravilo}`, objasnjenjeVrsta: o.vrsta };
}

module.exports = { objasni, dodajObjasnjenje, dodajSkupinska, ZNACAJKE, postupak, nepoznati, usporedi, glasovi, spojiBrojeve };
