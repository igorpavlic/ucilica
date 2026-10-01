/**
 * Tlo, voda, zrak (3. r.) i Prirodni uvjeti života (4. r.) — proširenje.
 *
 * Činjenice se ne mogu „parametrizirati” brojevima kao u matematici, pa se
 * ista činjenica ispituje kroz više obitelji zadataka: svojstvo, primjer,
 * promjena stanja, pokus → zaključak, poredak, točno/netočno, razvrstavanje
 * (čuva / onečišćuje), spajanje. Svaki poziv bira drugi podskup i druge
 * ometače, a temperature za stanja vode biraju se nasumično.
 *
 * Sadržaj prema kurikulu Prirode i društva (NN 7/2019) i udžbeničkoj razradi:
 * 3. r. — svojstva vode, tri stanja, kruženje vode, sastav tla, humus,
 *         svojstva zraka, onečišćenje i čuvanje vode, zraka i tla;
 * 4. r. — uvjeti života (zrak, voda, toplina, svjetlost, tlo), pokus s
 *         grahom, ledište i vrelište, sastav zraka, živa i neživa priroda,
 *         prilagodbe živih bića uvjetima.
 * Pojam fotosinteze uči se u 5. razredu (Priroda), pa ga ovdje nema.
 */

const cijeli = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const promijesaj = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const uzmi = (arr, n) => promijesaj(arr).slice(0, n);
const veliko = (s) => s[0].toUpperCase() + s.slice(1);
const izbor = (pitanje, tocno, krivi, tezina, objasnjenje) => {
  const answers = promijesaj([tocno, ...uzmi([...new Set(krivi)].filter((k) => k !== tocno), 3)]);
  return { type: 'choice', difficulty: tezina, question: pitanje, answers, correctIndex: answers.indexOf(tocno), objasnjenje };
};
const tocnoNetocno = (pitanje, tocno, tezina, objasnjenje) =>
  ({ type: 'true-false', difficulty: tezina, question: pitanje, correct: tocno, objasnjenje });
const poredaj = (pitanje, items, tezina, objasnjenje) =>
  ({ type: 'ordering', difficulty: tezina, question: pitanje, items, objasnjenje });
const spoji = (pitanje, pairs, tezina, objasnjenje) =>
  ({ type: 'match', difficulty: tezina, question: pitanje, pairs, objasnjenje });

// ═══════════════════════════════════════════════════════════════════
// 3. razred — Tlo, voda, zrak
// ═══════════════════════════════════════════════════════════════════

const SVOJSTVA_VODE = ['nema boju', 'nema miris', 'nema okus', 'poprima oblik posude', 'otapa sol i šećer'];
const NISU_SVOJSTVA_VODE = ['ima stalan oblik', 'ima jak miris', 'uvijek je plave boje', 'ne može se zagrijati', 'slatkastog je okusa'];

const STANJE_PRIMJER = [
  ['led', 'čvrsto'], ['snijeg', 'čvrsto'], ['tuča', 'čvrsto'], ['inje', 'čvrsto'],
  ['kiša', 'tekuće'], ['rosa', 'tekuće'], ['voda u rijeci', 'tekuće'], ['voda u moru', 'tekuće'],
  ['vodena para u zraku', 'plinovito'],
];

const PROMJENE = [
  ['Voda u zamrzivaču postane led.', 'iz tekućeg u čvrsto', 'Hlađenjem se tekuća voda smrzne u led.'],
  ['Snjegović se na suncu otopi.', 'iz čvrstog u tekuće', 'Zagrijavanjem se snijeg i led tale u tekuću vodu.'],
  ['Mokra majica osuši se na suncu.', 'iz tekućeg u plinovito', 'Voda iz majice isparava i kao vodena para odlazi u zrak.'],
  ['Na hladnom poklopcu lonca pojave se kapljice vode.', 'iz plinovitog u tekuće', 'Vodena para se na hladnoj površini ohladi i pretvori u kapljice.'],
  ['Lokva nakon kiše nestane za sunčana dana.', 'iz tekućeg u plinovito', 'Sunce zagrijava vodu u lokvi i ona isparava.'],
  ['Led u čaši soka nakon nekog vremena nestane.', 'iz čvrstog u tekuće', 'Led se u toplom soku otopi i postane tekuća voda.'],
];
const SVE_PROMJENE = ['iz tekućeg u čvrsto', 'iz čvrstog u tekuće', 'iz tekućeg u plinovito', 'iz plinovitog u tekuće'];

const KRUZENJE = [
  'Sunce zagrijava vodu u morima, rijekama i jezerima.',
  'Voda isparava i kao vodena para diže se u zrak.',
  'Vodena para se u visini hladi i stvara oblake.',
  'Iz oblaka voda pada kao kiša ili snijeg.',
  'Voda otječe u rijeke i mora ili ponire u tlo.',
];

const POKUSI_3 = [
  {
    opis: 'U jednu posudu stavimo pijesak, a u drugu glinu, pa ih polijemo jednakom količinom vode. Kroz pijesak voda brzo proteče, a glina je zadrži.',
    tocno: 'Pijesak propušta vodu bolje od gline.',
    krivo: ['Glina propušta vodu bolje od pijeska.', 'Voda ne prolazi kroz tlo.', 'Pijesak i glina jednako propuštaju vodu.'],
    obj: 'Pijesak ima krupnija zrnca i veće šupljine, pa voda kroz njega brže prolazi.',
  },
  {
    opis: 'U čašu vode ubacimo grudu suhe zemlje. Iz zemlje se dižu mjehurići.',
    tocno: 'U tlu ima zraka.',
    krivo: ['U tlu ima soli.', 'Voda se zagrijala.', 'Zemlja se otopila u vodi.'],
    obj: 'Mjehurići su zrak koji je bio u šupljinama tla, a voda ga je istisnula.',
  },
  {
    opis: 'Praznu čašu okrenemo naopako i ravno uronimo u posudu s vodom. Voda ne uđe do dna čaše.',
    tocno: 'Zrak zauzima prostor.',
    krivo: ['Čaša upija vodu.', 'Voda se smrznula.', 'Zrak je teži od vode.'],
    obj: 'U čaši je zrak; on zauzima prostor i ne pušta vodu do dna.',
  },
  {
    opis: 'U čašu vode stavimo žličicu soli i promiješamo. Nakon nekog vremena sol se više ne vidi.',
    tocno: 'Sol se otopila u vodi.',
    krivo: ['Sol je isparila.', 'Sol se pretvorila u led.', 'Sol je izašla iz čaše.'],
    obj: 'Voda otapa sol: sol je i dalje u vodi, zato je voda slana.',
  },
  {
    opis: 'Zimi ostavimo staklenu bocu punu vode na balkonu. Ujutro je voda u njoj led, a boca je napukla.',
    tocno: 'Voda se smrzavanjem širi.',
    krivo: ['Led je lakši od stakla.', 'Voda se smrzavanjem skuplja.', 'Boca se zagrijala.'],
    obj: 'Led zauzima više prostora od tekuće vode, pa može razbiti zatvorenu posudu.',
  },
];

const TN_3 = [
  ['Poprima li voda oblik posude u koju je ulijemo?', true, 'Voda je tekućina i nema stalan oblik.'],
  ['Ima li čista voda miris?', false, 'Čista voda nema boju, miris ni okus.'],
  ['Otapa li se pijesak u vodi?', false, 'Pijesak se ne otapa: nakon miješanja padne na dno.'],
  ['Je li led voda u čvrstom stanju?', true, 'Led, snijeg i tuča voda su u čvrstom stanju.'],
  ['Zauzima li zrak prostor?', true, 'Zrak ispunjava i „praznu” čašu, balon i šupljine u tlu.'],
  ['Ima li čist zrak boju?', false, 'Čist zrak je bezbojan i proziran.'],
  ['Nastaje li humus od razgrađenih ostataka biljaka i životinja?', true, 'Lišće i ostatke razgrađuju sitna živa bića u tlu, i tako nastaje humus.'],
  ['Je li vjetar zrak u pokretu?', true, 'Vjetar nastaje kad se zrak giba.'],
  ['Diže li se topli zrak prema gore?', true, 'Topli zrak je lakši od hladnoga, pa se diže.'],
  ['Ima li u tlu vode i zraka?', true, 'Tlo čine čestice pijeska, gline i humusa, a između njih su voda i zrak.'],
  ['Može li se vodena para vidjeti golim okom?', false, 'Vodena para je nevidljiva; bijeli „oblačić” iznad lonca su sitne kapljice.'],
  ['Je li kiša voda u tekućem stanju?', true, 'Kiša su kapljice tekuće vode.'],
];

// Sve ponude su u istom obliku (glagolska imenica), da točan odgovor ne
// odskače gramatički od ometača.
const CUVANJE = {
  vodu: {
    cuva: ['zatvaranje slavine dok peremo zube', 'tuširanje umjesto kupanja u kadi', 'skupljanje smeća s obale rijeke', 'odnošenje starog jestivog ulja u reciklažno dvorište'],
    steti: ['bacanje smeća u rijeku', 'izlijevanje ulja u odvod', 'ispuštanje otpadnih voda iz tvornice u rijeku', 'pranje automobila uz potok'],
  },
  zrak: {
    cuva: ['odlazak u školu pješice ili biciklom', 'sadnja drveća', 'vožnja javnim prijevozom', 'odvoženje smeća umjesto paljenja'],
    steti: ['paljenje smeća', 'vožnja automobila s gustim ispušnim plinovima', 'ispuštanje dima iz tvorničkih dimnjaka', 'paljenje lišća u vrtu'],
  },
  tlo: {
    cuva: ['odvajanje otpada za recikliranje', 'kompostiranje ostataka voća i povrća', 'odlaganje starih baterija u poseban spremnik', 'nošenje smeća s izleta kući'],
    steti: ['bacanje baterija u prirodu', 'odlaganje smeća u šumi', 'prolijevanje boje i ulja po zemlji', 'pretjerano prskanje polja otrovima'],
  },
};

const CINJENICE_3 = [
  ['Što pokreće kruženje vode u prirodi?', 'Sunčeva toplina', ['vjetar s mora', 'Mjesečeva svjetlost', 'rad ljudi'], 'Sunce zagrijava vodu i ona isparava; bez toga nema ni oblaka ni kiše.'],
  ['Od čega nastaju oblaci?', 'od sitnih kapljica vode', ['od dima', 'od prašine', 'od pijeska'], 'Vodena para se u visini ohladi i stvori sitne kapljice — oblak.'],
  ['Kako nastaje humus?', 'razgradnjom ostataka biljaka i životinja', ['taljenjem kamena', 'od kišnice', 'miješanjem pijeska i soli'], 'Otpalo lišće i ostatke razgrađuju sitna živa bića u tlu.'],
  ['Zašto je humus važan za biljke?', 'sadrži hranjive tvari', ['čini tlo tvrdim', 'ne propušta zrak', 'tjera vodu iz tla'], 'Iz humusa biljke korijenom uzimaju hranjive tvari.'],
  ['Kako zovemo zrak u pokretu?', 'vjetar', ['magla', 'oblak', 'rosa'], 'Vjetar je zrak koji se giba.'],
  ['Koji plin iz zraka trebamo za disanje?', 'kisik', ['ugljikov dioksid', 'dušik', 'vodena para'], 'Udisanjem uzimamo kisik iz zraka.'],
  ['Što čini tlo?', 'pijesak, glina, humus, voda i zrak', ['samo kamenje', 'samo pijesak', 'samo voda'], 'Tlo je mješavina čvrstih čestica (pijeska, gline, humusa) te vode i zraka.'],
];

function genTloVodaZrakDodatak() {
  const q = [];

  // Svojstva vode — prepoznavanje istinitog i lažnog svojstva
  for (const s of uzmi(SVOJSTVA_VODE, 3)) {
    q.push(izbor('Koje od navedenog je svojstvo vode?', s, NISU_SVOJSTVA_VODE, 1,
      `Voda ${s}. Čista voda nema boju, miris ni okus, poprima oblik posude i otapa neke tvari.`));
  }
  for (const n of uzmi(NISU_SVOJSTVA_VODE, 2)) {
    q.push(izbor('Što od navedenog NIJE svojstvo vode?', n, SVOJSTVA_VODE, 2,
      `Tvrdnja „${n}” nije točna. Voda nema boju, miris ni okus i poprima oblik posude.`));
  }

  // Stanje vode u primjeru
  for (const [p, s] of uzmi(STANJE_PRIMJER, 4)) {
    q.push(izbor(`U kojem je stanju voda u primjeru „${p}”?`, s, ['čvrsto', 'tekuće', 'plinovito'], 1,
      s === 'čvrsto' ? `${p[0].toUpperCase() + p.slice(1)} je smrznuta voda — čvrsto stanje.`
        : s === 'tekuće' ? `${p[0].toUpperCase() + p.slice(1)} — voda teče i poprima oblik, pa je u tekućem stanju.`
          : 'Vodena para je plin: nevidljiva je i širi se zrakom.'));
  }

  // Promjena stanja u svakodnevnoj situaciji
  for (const [opis, t, obj] of uzmi(PROMJENE, 4)) {
    q.push(izbor(`${opis} Kako se promijenilo stanje vode?`, t, SVE_PROMJENE, 2, obj));
  }

  // Kruženje vode — poredak (tri polazišta)
  q.push(poredaj('Poredaj kruženje vode u prirodi, počevši od Sunčeva zagrijavanja.', KRUZENJE.slice(0, 4), 2,
    'Sunce zagrije vodu → voda ispari → para se u visini ohladi u oblake → iz oblaka pada kiša ili snijeg.'));
  q.push(poredaj('Poredaj svih pet koraka kruženja vode, počevši od Sunčeva zagrijavanja.', KRUZENJE, 3,
    'Nakon padalina voda otječe u rijeke i mora ili ponire u tlo, a Sunce je opet zagrijava — krug se nastavlja.'));
  q.push(poredaj('Poredaj kruženje vode u prirodi, počevši od kiše.', [KRUZENJE[3], KRUZENJE[4], KRUZENJE[0], KRUZENJE[1]], 3,
    'Kiša pada, voda otječe u rijeke i mora, Sunce je zagrijava i ona opet isparava.'));

  // Pokusi → zaključak
  for (const p of uzmi(POKUSI_3, 3)) {
    q.push(izbor(`${p.opis} Što zaključujemo?`, p.tocno, p.krivo, 3, p.obj));
  }

  // Točno / netočno
  for (const [pit, t, obj] of uzmi(TN_3, 6)) q.push(tocnoNetocno(pit, t, 1, obj));

  // Čuvanje i onečišćenje — razvrstavanje
  for (const [sto, { cuva, steti }] of uzmi(Object.entries(CUVANJE), 2)) {
    const c = uzmi(cuva, 1)[0], s = uzmi(steti, 1)[0];
    const zamj = sto === 'vodu' ? 'je' : 'ga';
    q.push(izbor(`Što od navedenog čuva ${sto}?`, c, steti, 1, `${veliko(c)} čuva ${sto}; ostale radnje ${zamj} onečišćuju.`));
    q.push(izbor(`Što od navedenog onečišćuje ${sto}?`, s, cuva, 1, `${veliko(s)} onečišćuje ${sto}; ostale radnje ${zamj} čuvaju.`));
  }

  // Činjenice
  for (const [pit, t, k, obj] of uzmi(CINJENICE_3, 4)) q.push(izbor(pit, t, k, 2, obj));

  return q;
}

// „0°C” → „0 °C” (pravopis: razmak između broja i oznake jedinice).
const razmakStupnjeva = (q) => (Array.isArray(q.answers) && q.answers.some((a) => /\d°C/.test(a))
  ? { ...q, answers: q.answers.map((a) => String(a).replace(/(\d)°C/, '$1 °C')) } : q);

/** Uklanja zastarjele ili preteške stavke iz starog fonda 3. razreda. */
function ocistiTloVodaZrak(qs) {
  return qs.map(razmakStupnjeva).filter((q) => {
    const t = q.question || '';
    // Skraćeni zapis „ispar.→oblak” zamijenjen je pravim poretkom (ordering).
    if (/kruženje vode/.test(t) && (q.answers || []).some((a) => /→/.test(a))) return false;
    // Sastav zraka (dušik) uči se u 4. razredu.
    if (/Kojeg plina ima najviše u zraku/.test(t)) return false;
    // „Što je tlo?” i pitanje o kisiku zamijenjeni su čitljivijim inačicama.
    if (t === 'Što je tlo?' || t === 'Koji plin iz zraka trebamo za disanje?') return false;
    return true;
  });
}

// ═══════════════════════════════════════════════════════════════════
// 4. razred — Prirodni uvjeti života
// ═══════════════════════════════════════════════════════════════════

const UVJETI = ['zrak', 'voda', 'toplina', 'svjetlost', 'tlo'];
const NISU_UVJETI = ['glazba', 'boja cvijeta', 'zvuk', 'oblik lista', 'igračke'];

// Pokus s grahom: svakoj biljci oduzima se jedan uvjet.
const GRAH = [
  ['stavljena je u mračan ormar', 'svjetlost', 'U ormaru nema svjetlosti; biljka postaje blijeda i slaba.'],
  ['uopće se ne zalijeva', 'voda', 'Bez vode biljka vene i suši se.'],
  ['stoji u hladnjaku', 'toplina', 'U hladnjaku je prehladno; biljka ne raste.'],
  ['posijana je među kamenčiće, bez zemlje', 'tlo', 'Bez tla korijen nema odakle uzimati hranjive tvari.'],
  ['zatvorena je u staklenku iz koje je istisnut zrak', 'zrak', 'Bez zraka biljka ne može živjeti.'],
];

const PRILAGODBE = [
  ['kaktus', 'čuva vodu u debeloj stabljici'],
  ['jež', 'zimi spava zavučen u lišće'],
  ['lastavica', 'zimi odlazi u toplije krajeve'],
  ['riba', 'diše škrgama u vodi'],
  ['krtica', 'snažnim nogama kopa hodnike u tlu'],
  ['polarni medvjed', 'ima bijelo krzno i debeo sloj sala'],
];

const TN_4 = [
  ['Trebaju li i biljke i životinje zrak?', true, 'Sva živa bića trebaju zrak.'],
  ['Mogu li životinje dugo živjeti bez vode?', false, 'Voda je uvjet života za sva živa bića.'],
  ['Daje li Sunce Zemlji svjetlost i toplinu?', true, 'Sunce je glavni izvor svjetlosti i topline na Zemlji.'],
  ['Je li toplina uvjet života?', true, 'Uvjeti života su zrak, voda, toplina, svjetlost i tlo.'],
  ['Svijetli li Mjesec vlastitom svjetlošću?', false, 'Mjesec samo odbija Sunčevu svjetlost.'],
  ['Raste li grah bolje u mraku nego na svjetlu?', false, 'Biljka u mraku postaje blijeda i slaba; treba joj svjetlost.'],
  ['Upija li biljka korijenom vodu iz tla?', true, 'Korijen iz tla upija vodu i u njoj otopljene hranjive tvari.'],
  ['Pripada li kamen živoj prirodi?', false, 'Kamen ne raste, ne hrani se i ne razmnožava — dio je nežive prirode.'],
  ['Pripadaju li voda i zrak neživoj prirodi?', true, 'Voda, zrak, tlo i Sunce čine neživu prirodu, a bez njih nema života.'],
  ['Udišemo li kisik iz zraka?', true, 'Pri disanju iz zraka uzimamo kisik.'],
];

const CINJENICE_4 = [
  ['Koji su uvjeti života?', 'zrak, voda, toplina, svjetlost i tlo', ['zrak, voda i igračke', 'samo voda i hrana', 'tlo, kamen i vjetar'], 'Pet uvjeta života: zrak, voda, toplina, svjetlost i tlo.'],
  ['Što nam daje Sunce?', 'svjetlost i toplinu', ['samo vodu', 'zrak i tlo', 'kišu i snijeg'], 'Sunce je izvor svjetlosti i topline.'],
  ['Kojeg plina ima najviše u zraku?', 'dušika', ['kisika', 'ugljikova dioksida', 'vodene pare'], 'Zrak je većinom dušik; kisika ima oko petine.'],
  ['Koji plin izdišemo više nego što ga udišemo?', 'ugljikov dioksid', ['kisik', 'dušik', 'vodenu paru'], 'Uzimamo kisik, a izdišemo više ugljikova dioksida.'],
  ['Koji plin biljke otpuštaju u zrak kad su na svjetlu?', 'kisik', ['dušik', 'ugljikov dioksid', 'dim'], 'Zelene biljke na svjetlu otpuštaju kisik — zato su važne za zrak.'],
  ['Zašto se biljka na prozoru okreće prema staklu?', 'treba joj svjetlost', ['traži toplinu radijatora', 'bježi od vode', 'želi više zemlje'], 'Biljke rastu prema izvoru svjetlosti.'],
  ['Na kojoj se temperaturi čista voda smrzava?', '0 °C', ['10 °C', '100 °C', '−10 °C'], 'Ledište vode je 0 °C.'],
  ['Na kojoj temperaturi čista voda ključa?', '100 °C', ['50 °C', '0 °C', '200 °C'], 'Vrelište vode je 100 °C.'],
];

function stanjePriTemperaturi() {
  // Izbjegava se točno 0 °C i 100 °C — na tim točkama voda mijenja stanje.
  const raspon = [[-25, -2, 'čvrstom'], [3, 95, 'tekućem'], [105, 120, 'plinovitom']];
  return uzmi(raspon, 2).map(([od, do_, s]) => {
    const t = cijeli(od, do_);
    const zapis = t < 0 ? `−${-t}` : String(t);
    return izbor(`Termometar pokazuje ${zapis} °C. U kojem je stanju čista voda na toj temperaturi?`, s,
      ['čvrstom', 'tekućem', 'plinovitom'], 2,
      `Ispod 0 °C voda je led, između 0 °C i 100 °C tekuća, a iznad 100 °C vodena para. ${zapis} °C → ${s}.`);
  });
}

function genUvjetiZivotaDodatak() {
  const q = [];

  // Pokus s grahom — tri obitelji nad istim pokusom
  for (const [opis, uvjet, obj] of uzmi(GRAH, 3)) {
    q.push(izbor(`U pokusu s grahom jedna biljka ${opis}. Koji joj je uvjet života oduzet?`, uvjet, UVJETI, 2, obj));
  }
  for (const [opis, , obj] of uzmi(GRAH, 2)) {
    q.push(tocnoNetocno(`Biljka graha ${opis}. Hoće li rasti jednako dobro kao biljka koja ima sve uvjete?`, false, 2, obj));
  }
  for (const [, uvjet] of uzmi(GRAH, 2)) {
    q.push(izbor(`Učenici žele provjeriti treba li grahu ${uvjet === 'tlo' ? 'tlo' : uvjet}. Što smije biti različito između dviju posuda?`,
      `samo ${uvjet}`, [uvjet === 'voda' ? 'voda i svjetlost' : `${uvjet} i količina vode`, 'ništa', 'vrsta sjemena i posuda'], 3,
      'U dobrom pokusu mijenja se samo jedan uvjet, a sve ostalo ostaje jednako — tako znamo što je uzrok promjene.'));
  }

  // Što nije uvjet života
  for (const n of uzmi(NISU_UVJETI, 2)) {
    q.push(izbor('Što od navedenog NIJE uvjet života?', n, UVJETI, 1, `Uvjeti života su zrak, voda, toplina, svjetlost i tlo; „${n}” nije među njima.`));
  }

  // Stanje vode pri zadanoj temperaturi (parametrizirano)
  q.push(...stanjePriTemperaturi());

  // Prilagodbe — spajanje
  q.push(spoji('Spoji živo biće s načinom na koji se prilagodilo uvjetima života:', uzmi(PRILAGODBE, 4), 3,
    'Svako živo biće ima osobine koje mu pomažu preživjeti tamo gdje živi.'));
  for (const [bice, p] of uzmi(PRILAGODBE, 2)) {
    q.push(izbor(`Kako se ${bice} prilagodio uvjetima u kojima živi?`,
      p, PRILAGODBE.map((x) => x[1]), 2, `${veliko(bice)} ${p}.`));
  }

  // Uloga uvjeta — spajanje
  q.push(spoji('Spoji uvjet života s njegovom ulogom:', uzmi([
    ['Sunce', 'daje svjetlost i toplinu'],
    ['voda', 'bez nje biljka uvene'],
    ['zrak', 'iz njega uzimamo kisik'],
    ['tlo', 'iz njega korijen upija hranjive tvari'],
  ], 4), 2, 'Svaki uvjet života ima svoju ulogu, a živa bića trebaju sve njih.'));

  // Točno / netočno i činjenice
  for (const [pit, t, obj] of uzmi(TN_4, 5)) q.push(tocnoNetocno(pit, t, 1, obj));
  for (const [pit, t, k, obj] of uzmi(CINJENICE_4, 5)) q.push(izbor(pit, t, k, 2, obj));

  return q;
}

/** Uklanja stavke koje traže pojam fotosinteze (5. r.) ili su nejasne. */
function ocistiUvjetiZivota(qs) {
  return qs.filter((q) => {
    const t = q.question || '';
    if (/fotosint/i.test(t)) return false;
    // Kruženje vode nema početak; poredak se uči u 3. razredu.
    if (/Čime počinje kruženje vode/.test(t)) return false;
    // Duplikati činjenica koje dodatak postavlja jasnije
    if (/Na kojoj (se )?temperaturi voda/.test(t)) return false;
    // „neophodna za organizme” vrijedi za sve uvjete, pa ne određuje vodu.
    if (/neophodna za organizme/.test(t)) return false;
    return true;
  });
}

// Rod uz „prilagodio”: lastavica, riba i krtica su ženskog roda.
const ZENSKI = new Set(['lastavica', 'riba', 'krtica']);
function ispraviRod(qs) {
  return qs.map((q) => {
    const m = (q.question || '').match(/^Kako se (.+) prilagodio uvjetima/);
    if (m && ZENSKI.has(m[1])) return { ...q, question: q.question.replace('prilagodio', 'prilagodila') };
    return q;
  });
}

function prosiri(generatorName, qs) {
  if (generatorName === 'genTloVodaZrak') return [...ocistiTloVodaZrak(qs), ...genTloVodaZrakDodatak()];
  if (generatorName === 'genUvjetiZivota') return [...ocistiUvjetiZivota(qs), ...ispraviRod(genUvjetiZivotaDodatak())];
  return qs;
}

module.exports = { prosiri, genTloVodaZrakDodatak, genUvjetiZivotaDodatak };
