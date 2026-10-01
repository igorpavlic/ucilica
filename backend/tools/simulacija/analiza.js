#!/usr/bin/env node
/**
 * Analiza simuliranoga pilota: uspoređuje krakove i stari/novi postupak kalibracije.
 *   node tools/simulacija/analiza.js sim-elo.json sim-kvote.json > rezultati.json
 */
const fs = require('fs');
const path = require('path');
const T = require(path.join(__dirname, '..', '..', 'services', 'tezina'));

const [fElo, fKvote] = process.argv.slice(2);
const elo = JSON.parse(fs.readFileSync(fElo, 'utf8'));
const kvote = fKvote ? JSON.parse(fs.readFileSync(fKvote, 'utf8')) : null;

// ── statistika ────────────────────────────────────────────────────
const mean = (a) => a.reduce((x, y) => x + y, 0) / (a.length || 1);
const sd = (a) => { const m = mean(a); return Math.sqrt(mean(a.map((x) => (x - m) ** 2))); };
const pearson = (x, y) => { const mx = mean(x), my = mean(y); let n = 0, dx = 0, dy = 0; for (let i = 0; i < x.length; i++) { n += (x[i] - mx) * (y[i] - my); dx += (x[i] - mx) ** 2; dy += (y[i] - my) ** 2; } return n / Math.sqrt(dx * dy || 1); };
const rang = (a) => { const s = a.map((v, i) => [v, i]).sort((p, q) => p[0] - q[0]); const r = Array(a.length); let i = 0; while (i < s.length) { let j = i; while (j + 1 < s.length && s[j + 1][0] === s[i][0]) j++; for (let k = i; k <= j; k++) r[s[k][1]] = (i + j) / 2; i = j + 1; } return r; };
const spearman = (x, y) => pearson(rang(x), rang(y));
const kvantil = (a, q) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(q * s.length))]; };
const r3 = (x) => Math.round(x * 1000) / 1000;

// ── 1. kalibracija: isti zapis odgovora kroz stari i novi postupak ─
function replay(sim, { stari }) {
  const pit = new Map(sim.pitanja.map((q) => [q.id, q]));
  const dijete = new Map(); // u|predmet → {rating, n}
  const item = new Map();   // ključ → {rating, n}
  const tpl = new Map();
  const zapisi = [];
  for (const o of sim.odgovori) {
    const q = pit.get(o.q); if (!q) continue;
    const dk = `${o.u}|${q.predmet}`;
    const d = dijete.get(dk) || { rating: T.POCETNA, n: 0 };
    const ik = stari ? `q:${o.q}` : (q.itemKey ? `k:${q.itemKey}` : `q:${o.q}`);
    const zi = item.get(ik);
    const zt = q.templateId ? tpl.get(q.templateId) : null;
    const polazna = stari ? (zi ? zi.rating : T.POCETNA) : (zi ? zi.rating : T.efektivnaOcjena({ item: null, template: zt, difficulty: q.difficulty }));
    const s = stari
      ? (() => { const prag = 3000 + ((q.difficulty || 1) - 1) * 2000; const om = Math.min((o.ms || 0) / prag, 3); return o.tocno ? 1 - 0.4 * (om / 3) : 0.2 * (om / 3); })()
      : (o.tocno ? 1 : 0);
    const e = T.ocekivano(d.rating, polazna);
    const kD = T.kFaktor(d.n), kP = T.kFaktor(zi?.n ?? 0, { pitanje: true });
    zapisi.push({ kljuc: ik, template_id: q.templateId, ocjenaDjeteta: d.rating, tocno: o.tocno, q: o.q });
    const prije = d.rating;
    d.rating = d.rating + kD * (s - e); d.n++; dijete.set(dk, d);
    item.set(ik, { rating: polazna - kP * (s - e), n: (zi?.n ?? 0) + 1, q: o.q });
    if (!stari && q.templateId) {
      const tp = zt ? zt.rating : T.priorZaTezinu(q.difficulty);
      tpl.set(q.templateId, { rating: tp - T.kFaktor(zt?.odgovora ?? 0, { pitanje: true }) * (s - T.ocekivano(prije, tp)), odgovora: (zt?.odgovora ?? 0) + 1 });
    }
  }
  return { dijete, item, tpl, zapisi };
}

function kalibracija(sim) {
  const pit = new Map(sim.pitanja.map((q) => [q.id, q]));
  const djeca = new Map(sim.djeca.map((d) => [d.id, d]));
  const out = {};
  for (const [ime, stari] of [['stari', true], ['novi', false]]) {
    const { dijete, item, tpl } = replay(sim, { stari });
    // težina pitanja: ocjena ↔ pravi b, po broju odgovora
    const red = [];
    const svaPitanja = sim.pitanja.filter((q) => !q.kvar);
    for (const q of svaPitanja) {
      const ik = stari ? `q:${q.id}` : (q.itemKey ? `k:${q.itemKey}` : `q:${q.id}`);
      const z = item.get(ik);
      const n = z?.n ?? 0;
      const ocj = stari ? (z ? z.rating : T.POCETNA) : T.efektivnaOcjena({ item: z ? { rating: z.rating, odgovora: z.n } : null, template: q.templateId ? tpl.get(q.templateId) : null, difficulty: q.difficulty });
      red.push({ n, ocj, b: q.b, grade: q.grade, predmet: q.predmet });
    }
    const pojasevi = [[0, 0], [1, 4], [5, 14], [15, 29], [30, 1e9]].map(([lo, hi]) => {
      const x = red.filter((r) => r.n >= lo && r.n <= hi);
      // Spearman po razredu i predmetu (b je na ljestvici razreda), pa prosjek vagan brojem
      const grupe = {};
      for (const r of x) (grupe[`${r.grade}|${r.predmet}`] ||= []).push(r);
      let s = 0, w = 0;
      for (const g of Object.values(grupe)) if (g.length >= 8) { s += spearman(g.map((r) => r.ocj), g.map((r) => r.b)) * g.length; w += g.length; }
      return { pojas: hi >= 1e9 ? `${lo}+` : lo === hi ? `${lo}` : `${lo}–${hi}`, pitanja: x.length, spearman: w ? r3(s / w) : null };
    });
    // sposobnost djece: ocjena ↔ θ; pristranost prema brzini čitanja
    const xs = [], ths = [], cit = [];
    for (const [k, v] of dijete) {
      const [u, predmet] = k.split('|'); const d = djeca.get(u); if (!d || v.n < 20) continue;
      xs.push(v.rating); ths.push(d.theta[predmet]); cit.push(d.citanje);
    }
    // ostatak ocjene nakon uklanjanja θ (linearna regresija) ↔ čitanje
    const b1 = pearson(xs, ths) * sd(xs) / sd(ths), b0 = mean(xs) - b1 * mean(ths);
    const ost = xs.map((x, i) => x - (b0 + b1 * ths[i]));
    // isto za „idealnu” ocjenu: što bi pokazao samo točan/netočan s pravim λ — referenca je novi postupak
    // po kvintilima brzine čitanja: prosječni ostatak ocjene (Elo bodovi)
    const parovi = ost.map((o, i) => ({ o, c: cit[i] })).sort((a, b) => a.c - b.c);
    const q5 = Math.floor(parovi.length / 5);
    const poCitanju = [0, 1, 2, 3, 4].map((k) => Math.round(mean(parovi.slice(k * q5, k === 4 ? undefined : (k + 1) * q5).map((x) => x.o))));
    out[ime] = { pojasevi, poCitanju, djeca: { n: xs.length, rTheta: r3(pearson(xs, ths)), rOstatakCitanje: r3(pearson(ost, cit)) } };
  }
  // Čista mjera učinka kazne za vrijeme: ISTI odgovori kroz oba postupka.
  // Δ = ocjena(stari) − ocjena(novi) po djetetu i predmetu; veza Δ s brzinom
  // čitanja pokazuje koliko sam postupak (a ne znanje) kažnjava sporije čitače.
  const s1 = replay(sim, { stari: true }).dijete, s2 = replay(sim, { stari: false }).dijete;
  const dd = [];
  for (const [k, v] of s1) { const w = s2.get(k); if (!w || v.n < 20) continue; const d = djeca.get(k.split('|')[0]); dd.push({ delta: v.rating - w.rating, c: d.citanje }); }
  dd.sort((a, b) => a.c - b.c);
  const q5 = Math.floor(dd.length / 5);
  out.razlika = {
    rDeltaCitanje: r3(pearson(dd.map((x) => x.delta), dd.map((x) => x.c))),
    poCitanju: [0, 1, 2, 3, 4].map((k) => Math.round(mean(dd.slice(k * q5, k === 4 ? undefined : (k + 1) * q5).map((x) => x.delta))))
  };
  return out;
}

// ── 2. izbor pitanja: ostvarena uspješnost po djetetu ──────────────
function izbor(sim) {
  const djeca = new Map(sim.djeca.map((d) => [d.i, d]));
  const poDj = new Map();
  for (const s of sim.sesije) {
    if (s.review) continue;
    if (!poDj.has(s.dijete)) poDj.set(s.dijete, []);
    poDj.get(s.dijete).push(s);
  }
  const red = [];
  for (const [i, arr] of poDj) {
    const kasne = arr.filter((s) => s.s >= 6); // nakon zagrijavanja
    if (!kasne.length) continue;
    const d = djeca.get(i);
    red.push({ i, theta: mean(Object.values(d.theta)), uspjeh: mean(kasne.map((s) => s.uspjeh)), ocekivano: mean(kasne.map((s) => s.ocekivano)) });
  }
  const sortirano = [...red].sort((a, b) => a.theta - b.theta);
  const q = Math.floor(sortirano.length / 5);
  const kvintili = [0, 1, 2, 3, 4].map((k) => {
    const g = sortirano.slice(k * q, k === 4 ? undefined : (k + 1) * q);
    return { kvintil: k + 1, uspjeh: r3(mean(g.map((x) => x.uspjeh))), ocekivano: r3(mean(g.map((x) => x.ocekivano))) };
  });
  return {
    djece: red.length,
    prosjek: r3(mean(red.map((x) => x.uspjeh))),
    uCiljnomPojasu: r3(red.filter((x) => x.ocekivano >= 0.6 && x.ocekivano <= 0.85).length / red.length),
    p10: r3(kvantil(red.map((x) => x.ocekivano), 0.1)), p90: r3(kvantil(red.map((x) => x.ocekivano), 0.9)),
    kvintili
  };
}

// ── 3. otkrivanje neispravnih pitanja ─────────────────────────────
function otkrivanje(sim) {
  const { zapisi } = replay(sim, { stari: false });
  const pit = new Map(sim.pitanja.map((q) => [q.id, q]));
  const poKljucu = new Map();
  for (const z of zapisi) { const q = pit.get(z.q); if (!poKljucu.has(z.kljuc)) poKljucu.set(z.kljuc, q); }
  const rez = {};
  for (const min of [20, 30, 50]) {
    const an = T.analizaPitanja(zapisi, { minOdgovora: min });
    const oznaceno = an.filter((x) => x.oznake.includes('sumnjiv-kljuc') || x.oznake.includes('ne-razlikuje'));
    const ocijenjeno = an.length;
    const kvarovi = an.filter((x) => poKljucu.get(x.kljuc)?.kvar);
    const pogodak = oznaceno.filter((x) => poKljucu.get(x.kljuc)?.kvar);
    const krivi = an.filter((x) => poKljucu.get(x.kljuc)?.kvar === 'krivi-kljuc');
    rez[min] = {
      pitanjaSDovoljnoOdgovora: ocijenjeno,
      udioBanke: r3(ocijenjeno / sim.pitanja.length),
      kvarovaMeduNjima: kvarovi.length,
      oznaceno: oznaceno.length,
      odziv: kvarovi.length ? r3(pogodak.length / kvarovi.length) : null,
      preciznost: oznaceno.length ? r3(pogodak.length / oznaceno.length) : null,
      odzivKriviKljuc: krivi.length ? r3(krivi.filter((x) => x.oznake.includes('sumnjiv-kljuc') || x.oznake.includes('ne-razlikuje')).length / krivi.length) : null,
      samoSumnjivKljuc: (() => {
        const o = an.filter((x) => x.oznake.includes('sumnjiv-kljuc'));
        return { oznaceno: o.length, preciznost: o.length ? r3(o.filter((x) => poKljucu.get(x.kljuc)?.kvar === 'krivi-kljuc').length / o.length) : null,
          odzivKriviKljuc: krivi.length ? r3(krivi.filter((x) => x.oznake.includes('sumnjiv-kljuc')).length / krivi.length) : null };
      })()
    };
  }
  // koliko odgovora po pitanju je pilot prikupio
  const brojac = new Map(); for (const z of zapisi) brojac.set(z.kljuc, (brojac.get(z.kljuc) || 0) + 1);
  const n = [...brojac.values()];
  rez.odgovoraPoPitanju = { medijan: kvantil(n, 0.5), p90: kvantil(n, 0.9), bezIjednog: sim.pitanja.length - n.length };
  return rez;
}

// ── 4. opseg miješanog ponavljanja: stari postupak vs novi ─────────
function opseg(sim) {
  // novi: iz zapisa sesija
  const poNacinu = {};
  for (const p of sim.ponavljanje) {
    const g = (poNacinu[p.nacin] ||= { sesija: 0, pitanja: 0, izvan: 0, predmeti: {} });
    g.sesija++; g.pitanja += p.ukupno; g.izvan += p.izvanObradjenog;
    for (const pr of p.predmeti) g.predmeti[pr] = (g.predmeti[pr] || 0) + 1;
  }
  for (const g of Object.values(poNacinu)) {
    g.udioIzvanObradjenog = r3(g.izvan / g.pitanja);
    g.udioPredmeta = Object.fromEntries(Object.entries(g.predmeti).map(([k, v]) => [k, r3(v / g.pitanja)]));
  }
  // prosječan broj različitih predmeta u jednoj sesiji ponavljanja
  for (const [nacin, g] of Object.entries(poNacinu)) {
    const ses = sim.ponavljanje.filter((p) => p.nacin === nacin);
    g.predmetaPoSesiji = r3(mean(ses.map((p) => new Set(p.predmeti).size)));
  }
  // stari: uzorak 120 iz cijeloga razreda, različite teme (preslika starog koda)
  let st = 7;
  const rnd = () => { st = (Math.imul(st, 1664525) + 1013904223) >>> 0; return st / 4294967296; };
  const djeca = sim.djeca;
  const banka = sim.pitanja;
  const temeObradjene = (d) => {
    const po = {};
    for (const q of banka.filter((x) => x.grade === d.grade)) (po[q.predmet] ||= new Set()).add(q.tema);
    // isto pravilo kao u pokreni.js: prvih ⌈udio⌉ tema po predmetu (redoslijed tema u metapodatcima)
    return po;
  };
  const redTema = {};
  for (const q of banka) { const k = `${q.grade}|${q.predmet}`; (redTema[k] ||= []); if (!redTema[k].includes(q.tema)) redTema[k].push(q.tema); }
  let izvan = 0, ukupno = 0; const predmeti = {};
  for (const d of djeca) {
    const obr = new Set();
    for (const pr of ['hrvatski', 'matematika', 'priroda']) {
      const arr = redTema[`${d.grade}|${pr}`] || [];
      arr.slice(0, Math.max(1, Math.round(arr.length * d.godina))).forEach((t) => obr.add(t));
    }
    for (let k = 0; k < 3; k++) {
      const razred = banka.filter((q) => q.grade === d.grade);
      const uzorak = [];
      for (let i = 0; i < 120; i++) uzorak.push(razred[Math.floor(rnd() * razred.length)]);
      const teme = new Set(); const odabrano = [];
      for (const q of uzorak) { if (teme.has(q.tema)) continue; teme.add(q.tema); odabrano.push(q); if (odabrano.length >= 7) break; }
      for (const q of odabrano) { ukupno++; if (!obr.has(q.tema)) izvan++; predmeti[q.predmet] = (predmeti[q.predmet] || 0) + 1; }
    }
  }
  const udioPredmeta = Object.fromEntries(Object.entries(predmeti).map(([k, v]) => [k, r3(v / ukupno)]));
  return { stari: { pitanja: ukupno, udioIzvanObradjenog: r3(izvan / ukupno), predmeti, udioPredmeta }, novi: poNacinu };
}

// ── 5. objašnjenja, tekstovi, dvoznamenkasto ───────────────────────
function sadrzaj(sim) {
  const p = sim.pitanja;
  const poPredmetu = {};
  for (const q of p) { const g = (poPredmetu[q.predmet] ||= { ukupno: 0, s: 0, vrste: {} }); g.ukupno++; if (q.objasnjenje) { g.s++; g.vrste[q.objasnjenjeVrsta] = (g.vrste[q.objasnjenjeVrsta] || 0) + 1; } }
  const vrste = {}; for (const q of p) if (q.objasnjenje) vrste[q.objasnjenjeVrsta] = (vrste[q.objasnjenjeVrsta] || 0) + 1;
  const poRazredu = {}; for (const q of p) { const g = (poRazredu[q.grade] ||= { ukupno: 0, s: 0 }); g.ukupno++; if (q.objasnjenje) g.s++; }
  const tekst = {}; for (const q of p.filter((x) => x.proces)) { const k = `${q.grade}|${q.proces}`; tekst[k] = (tekst[k] || 0) + 1; }
  const pmd = {}; for (const q of p.filter((x) => String(x.templateId).startsWith('pmd2:'))) pmd[q.templateId] = (pmd[q.templateId] || 0) + 1;
  const odg = new Map(); for (const o of sim.odgovori) odg.set(o.q, (odg.get(o.q) || 0) + 1);
  const izlozeno = (f) => p.filter(f).reduce((a, q) => a + (odg.get(q.id) || 0), 0);
  const predlozaka = new Set(p.map((q) => q.templateId)).size;
  const bezObjPredlosci = new Set(p.filter((q) => !q.objasnjenje).map((q) => q.templateId)).size;
  return {
    ukupno: p.length, sObjasnjenjem: p.filter((q) => q.objasnjenje).length, poPredmetu, poRazredu, vrste,
    izlozenost: { ...sim.izlozenost, udio: r3(sim.izlozenost.pogresnihSObjasnjenjem / sim.izlozenost.pogresnih) },
    predlozaka, bezObjPredlosci,
    tekstoviPoProcesu: tekst, odgovoraNaTekstove: izlozeno((q) => q.passage),
    dvoznamenkasto: pmd, odgovoraNaDvoznamenkasto: izlozeno((q) => String(q.templateId).startsWith('pmd2:'))
  };
}

const rezultat = {
  postavke: { razlicitihZadataka: new Set(elo.pitanja.map((q) => q.itemKey)).size, djece: elo.djece, sesija: elo.sesija, seed: elo.seed, odgovora: elo.odgovori.length, pitanja: elo.pitanja.length,
    kvarova: elo.pitanja.filter((q) => q.kvar).length,
    sesijaBezNovihPitanja: (elo.iscrpljeno || []).length,
    iscrpljenePoTemi: Object.entries((elo.iscrpljeno || []).reduce((a, x) => { const k = x.tema || 'miješano ponavljanje'; a[k] = (a[k] || 0) + 1; return a; }, {}))
      .sort((a, b) => b[1] - a[1]).slice(0, 12).map(([tema, n]) => ({ tema, n, pitanjaUTemi: elo.pitanja.filter((q) => q.tema === tema).length })) },
  kalibracija: kalibracija(elo),
  izbor: { elo: izbor(elo), ...(kvote ? { kvote: izbor(kvote) } : {}) },
  otkrivanje: otkrivanje(elo),
  opseg: opseg(elo),
  sadrzaj: sadrzaj(elo)
};
process.stdout.write(JSON.stringify(rezultat, null, 2));
