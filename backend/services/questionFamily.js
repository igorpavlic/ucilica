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
/**
 * Isti zadatak različito sročen („Koje malo slovo odgovara velikom slovu A?” i
 * „Koje je malo slovo za veliko slovo K?”) dijete doživljava kao isto pitanje.
 * Ovi uzorci takva pitanja svrstavaju u jednu temu, prije prepoznavanja predloška.
 */
const TEME = [
  [/\b(malo|veliko)( tiskano)? slovo\b.*\b(odgovara|za)\b.*\b(malom|velikom|malo|veliko)\b/i, 'tema:veliko-malo-slovo'],
  [/(u abecedi dolazi|dolazi (neposredno )?(prije|poslije|nakon) slova)/i, 'tema:redoslijed-abecede'],
  [/^(koji broj nedostaje|koliko je [bcxyz] ako je|koji broj treba upisati umjesto)/i, 'tema:nepoznati-broj'],
  [/^(kako se zove trokut|kakav je to trokut prema)/i, 'tema:vrste-trokuta'],
  [/^od kuće do škole ima/i, 'tema:put-do-skole'],
  [/zbroj duljina svih (njezinih )?bridova/i, 'tema:zbroj-bridova'],
  [/^(rimuju li se|koja se riječ rimuje)/i, 'tema:rima'],
  [/^ako je danas/i, 'tema:dani-u-tjednu'],
  [/^koji mjesec dolazi/i, 'tema:mjeseci'],
  [/^(koja je znamenka (jedinica|desetica|stotica|tisućica)|koliko (tisućica|stotica|desetica|jedinica) ima broj)/i, 'tema:mjesna-vrijednost'],
  [/(kojem sustavu organa|kojem sustavu pripada)/i, 'tema:organ-sustav'],
  [/^(koji je organ (zadužen za|osjetila)|kojim osjetilom)/i, 'tema:osjetila'],
  [/\b(sjeverno|južno|istočno|zapadno|sjeveroistočno|sjeverozapadno|jugoistočno|jugozapadno) od\b|u kojem se smjeru od|kojim smjerom ideš/i, 'tema:smjer-na-planu'],
  [/strana svijeta (nalazi )?između|strana svijeta suprotna/i, 'tema:strane-svijeta'],
  [/^ako je [bcxyz] = /i, 'tema:vrijednost-izraza'],
  [/^koja riječ ne pripada skupini/i, 'tema:uljez-vrsta-rijeci'],
  [/^je li riječ \S+ (imenica|glagol|pridjev)\?/i, 'tema:je-li-vrsta-rijeci'],
  [/^odgovara li (kazališni )?pojam/i, 'tema:pojam-i-opis'],
  [/^(koja riječ nastaje kad složiš slogove|koja riječ nastaje od slogova)/i, 'tema:slaganje-slogova'],
  [/opseg jedne njezine plohe/i, 'tema:opseg-plohe'],
];
const temaPitanja = (t) => TEME.find(([re]) => re.test(String(t || '')))?.[1];

function prepoznajObitelji(pitanja = [], { udio = 0.5 } = {}) {
  // Sve iza prve dvotočke podatak je zadatka („Koji kraj opisuje: hladne zime?”,
  // „Dopuni: 8 kg = ___ g.”), pa ostaje samo uvod i znak „_”.
  const uvod = (t) => { const i = t.indexOf(': '); return i > 0 ? `${t.slice(0, i)}: _` : t; };
  // Brojevi, nepoznanice (c, x, □), znakovi računa i riječ iza broja
  // („31892 paketa”, „1 paket”) uvijek su podatak.
  const PODATAK = /^(n|[bcxyz]|[+\-−×÷·:=<>□○_]+|___)$/u;
  const tokeni = pitanja.map((q) => {
    const t = tokeniPitanja(uvod(String(q.question || '').replace(/:\s*$/, ': ')).trim());
    return t.map((w, k) => (PODATAK.test(w) || (k > 0 && t[k - 1] === 'n') ? '_' : w));
  });
  // Predložak se traži među pitanjima istoga početka (prve tri riječi): riječ
  // pripada predlošku ako je ima barem pola tih pitanja („rimuju li se riječi
  // _ i _”), a ne ako je samo česta u temi („krava” u više tablica).
  const pocetak = (t) => t.filter((w) => w !== '_').slice(0, 3).join(' ');
  const skupine = new Map();
  tokeni.forEach((t, i) => { const k = pocetak(t); if (!skupine.has(k)) skupine.set(k, []); skupine.get(k).push(i); });
  const out = new Array(pitanja.length);
  for (const clanovi of skupine.values()) {
    const ucestalost = new Map();
    for (const i of clanovi) for (const w of new Set(tokeni[i])) ucestalost.set(w, (ucestalost.get(w) || 0) + 1);
    for (const i of clanovi) {
      const tema = temaPitanja(pitanja[i].question);
      if (tema) { out[i] = tema; continue; }
      const maska = clanovi.length < 2 ? tokeni[i] : tokeni[i].map((w) => (w !== '_' && ucestalost.get(w) >= Math.max(2, clanovi.length * udio) ? w : '_'));
      const ostalo = maska.filter((w) => w !== '_').length;
      // Predložak od samo „je li _” ili „smiješ li _” preopćenit je: takva su
      // pitanja različita (o različitim stvarima), pa ostaju zasebne obitelji.
      out[i] = (clanovi.length < 2 || ostalo <= 2 || ostalo / maska.length < 0.4)
        ? normalizeStem(pitanja[i].question || '')
        : maska.join(' ').replace(/(_ )+_/g, '_');
    }
  }
  return out;
}

/** Upiši `obitelj` pitanjima koja je nemaju (prepoznavanjem predloška u skupu). */
function oznaciObitelji(pitanja = [], opcije) {
  const obitelji = prepoznajObitelji(pitanja, opcije);
  return pitanja.map((q, i) => (q.obitelj ? q : { ...q, obitelj: obitelji[i] }));
}

/** Obitelj koju je zadao autor (tablica, pojedino pitanje, tema) — ne prepoznaje se ponovno. */
const zadanaObitelj = (o) => /^(tablica:|pitanje:|kraj-|tema:)/.test(String(o || ''));

module.exports = { zadanaObitelj, temaPitanja, normalizeStem, questionFamilyKey, orderWithoutAdjacentFamilies, prepoznajObitelji, oznaciObitelji };
