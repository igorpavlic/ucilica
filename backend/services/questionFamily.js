/**
 * Pedagoška "obitelj" pitanja.
 *
 * Dva pitanja mogu imati različite brojeve/riječi/slike, a ipak tražiti potpuno
 * isti misaoni postupak. U kvizu ih zato tretiramo kao istu obitelj kako dijete
 * ne bi dobilo npr. sedam puta "Koja riječ imenuje...?" samo s drugim pojmom.
 */
function normalizeStem(text = '') {
  return String(text)
    .toLowerCase()
    // sadržaj pod navodnicima je primjer, ne novi tip zadatka
    // uključuje hrvatske navodnike „…” i «…» koji su prije ostajali nenormalizirani
    .replace(/„[^“”"]*[“”"]|“[^”]*”|«[^»]*»|"[^"]*"|'[^']*'/g, '"x"')
    // brojevi i decimalni zapisi su parametri predloška
    .replace(/\b\d+(?:[.,]\d+)?\b/g, 'n')
    // nizovi emoji-ja/slikovnih znakova također su parametri
    .replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}]/gu, 'e')
    // standardiziraj praznine i tipografske varijante
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function questionFamilyKey(question = {}) {
  // Zapisana obitelj (predložak iz tablice ili prepoznati zajednički dio
  // teksta) ima prednost: „…grad Vukovar?” i „…grad Pula?” ista su obitelj,
  // iako imena nisu pod navodnicima.
  if (question.obitelj) return `o:${question.obitelj}`;
  const stem = normalizeStem(question.question || '');
  // Vizual ne ulazi u ključ: "Što je na slici?" s 20 različitih slika
  // i dalje je ista vrsta zadatka i ne treba se ponavljati u istoj rundi.
  return stem;
}

function orderWithoutAdjacentFamilies(questions = []) {
  const remaining = [...questions];
  const out = [];
  let last = null;

  while (remaining.length) {
    let index = remaining.findIndex((q) => questionFamilyKey(q) !== last);
    if (index < 0) index = 0;
    const [q] = remaining.splice(index, 1);
    out.push(q);
    last = questionFamilyKey(q);
  }
  return out;
}

/**
 * Prepoznaje predložak pitanja u skupu: riječi koje se u skupu javljaju rijetko
 * (imena, pojmovi iz tablice: „Vukovar”, „šaran”) zamjenjuju se s „_”, a
 * česte riječi predloška („u kojem se kraju Hrvatske nalazi grad”) ostaju.
 * Vraća obitelj za svako pitanje, istim redom.
 */
// riječi i znakovi računa (+, −, ×, =) ostaju, interpunkcija otpada
const tokeniPitanja = (t) => normalizeStem(t).split(/\s+/).map((w) => w.replace(/^[.,?!:;„“”"'()]+|[.,?!:;„“”"'()]+$/g, '')).filter(Boolean);
function prepoznajObitelji(pitanja = [], { prag = 3 } = {}) {
  // Sve iza prve dvotočke podatak je zadatka („Koji kraj opisuje: hladne zime?”,
  // „Dopuni: 8 kg = ___ g.”), pa ostaje samo uvod i znak „_”.
  const uvod = (t) => { const i = t.indexOf(': '); return i > 0 ? `${t.slice(0, i)}: _` : t; };
  const tokeni = pitanja.map((q) => tokeniPitanja(uvod(String(q.question || '').replace(/:\s*$/, ': ')).trim()));
  const ucestalost = new Map();
  for (const t of tokeni) for (const w of new Set(t)) ucestalost.set(w, (ucestalost.get(w) || 0) + 1);
  return tokeni.map((t, i) => {
    const maska = t.map((w) => ((ucestalost.get(w) || 0) >= prag ? w : '_'));
    const ostalo = maska.filter((w) => w !== '_').length;
    // Predložak od samo „je li _” ili „smiješ li _” preopćenit je: takva su
    // pitanja različita (o različitim stvarima), pa ostaju zasebne obitelji.
    if (ostalo <= 2 || ostalo / maska.length < 0.4) return normalizeStem(pitanja[i].question || '');
    return maska.join(' ').replace(/(_ )+_/g, '_');
  });
}

/** Upiši `obitelj` pitanjima koja je nemaju (prepoznavanjem predloška u skupu). */
function oznaciObitelji(pitanja = [], opcije) {
  const obitelji = prepoznajObitelji(pitanja, opcije);
  return pitanja.map((q, i) => (q.obitelj ? q : { ...q, obitelj: obitelji[i] }));
}

module.exports = { normalizeStem, questionFamilyKey, orderWithoutAdjacentFamilies, prepoznajObitelji, oznaciObitelji };
