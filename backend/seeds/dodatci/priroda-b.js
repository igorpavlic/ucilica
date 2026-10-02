/**
 * dodatci/priroda-b.js — Priroda i društvo, 3. i 4. razred: tlo, voda i zrak,
 * biljke i životinje (prehrana, skupine, ekosustavi, prilagodbe), uvjeti
 * života, ljudsko tijelo.
 */
const { izbor, tocnoNetocno, poredaj, obaSmjera, sveTvrdnje, spajanja, izTablice, daNe, uzmi, jedan } = require('./pomocno');
const { _tablice: { DRVECE, DIO_BILJKE, STANJA } } = require('./priroda-a');

// ═══ 3. razred: tlo, voda, zrak ═══
const PROMJENE = [['Rublje se suši na vjetru.', 'isparavanje'], ['Sladoled se topi u ruci.', 'taljenje'], ['Lokva se zimi zaledi.', 'smrzavanje'],
  ['Ogledalo u kupaonici zamagli se nakon tuširanja.', 'kondenzacija'], ['Snijeg na krovu se otopi.', 'taljenje'], ['Voda u loncu ključa i nestaje.', 'isparavanje'],
  ['Kockice leda nastaju u zamrzivaču.', 'smrzavanje'], ['Na hladnoj boci iz hladnjaka pojave se kapljice.', 'kondenzacija'], ['Mokra kosa se osuši na suncu.', 'isparavanje'],
  ['Ledenica se ljeti otopi.', 'taljenje']];
const INSTRUMENTI = [['termometar', 'temperaturu zraka'], ['vjetrokaz', 'smjer vjetra'], ['kišomjer', 'količinu oborina'], ['barometar', 'tlak zraka'], ['kompas', 'strane svijeta']];
const TLO_SASTAV = [['pijesak', 'dobro propušta vodu'], ['glina', 'slabo propušta vodu i zadržava je'], ['humus', 'tamni sloj bogat hranjivim tvarima'], ['kamenje', 'tvrdi dijelovi tla koji ne upijaju vodu']];
const ZRAK_ONECISCENJE = [['ispušni plinovi automobila', true], ['dim iz tvorničkih dimnjaka', true], ['paljenje smeća', true], ['sadnja drveća', false],
  ['vožnja biciklom', false], ['paljenje lišća u vrtu', true], ['javni prijevoz umjesto automobila', false], ['šumski požari', true]];
const TVZ_DA_NE = [['Treba li biljkama zrak?', true], ['Je li vjetar zrak u pokretu?', true], ['Može li zrak gurati jedrenjak?', true], ['Ima li pijeska u tlu?', true],
  ['Propušta li glina vodu bolje od pijeska?', false], ['Otapa li se šećer u toploj vodi?', true], ['Ključa li voda na 50 °C?', false], ['Zauzima li zrak prostor u balonu?', true],
  ['Je li kondenzacija prijelaz vodene pare u kapljice vode?', true], ['Je li tlo nastalo za jedan dan?', false], ['Pomažu li gujavice tlu?', true], ['Može li se onečišćena voda očistiti samo od sebe za jedan dan?', false]];
function tloVodaZrakDodatak() {
  const q = [];
  q.push(...PROMJENE.map(([p, n]) => izbor(`Kako zovemo promjenu u primjeru: ${p.replace(/\.$/, '')}?`, n, ['isparavanje', 'taljenje', 'smrzavanje', 'kondenzacija'].filter((x) => x !== n), 2)));
  q.push(...obaSmjera(INSTRUMENTI, { pitajB: (a) => `Što mjerimo ili određujemo instrumentom koji se zove ${a}?`, pitajA: (b) => `Kojim instrumentom mjerimo ili određujemo ${b}?`, tezina: 2 }));
  q.push(...obaSmjera(TLO_SASTAV, { pitajB: (a) => `Koja tvrdnja opisuje ${a} u tlu?`, pitajA: (b) => `Koji dio tla opisuje tvrdnja: ${b}?`, tezina: 2 }));
  q.push(...ZRAK_ONECISCENJE.map(([o, d]) => tocnoNetocno(`Onečišćuje li zrak: ${o}?`, d, 2)));
  q.push(...STANJA.map(([v, s]) => izbor(`Kojem agregatnom stanju vode pripada primjer: ${v}?`, s === 'kruto' ? 'čvrsto' : s, ['čvrsto', 'tekuće', 'plinovito'].filter((x) => x !== (s === 'kruto' ? 'čvrsto' : s)), 2)));
  q.push(...TVZ_DA_NE.map(([p, t]) => tocnoNetocno(p, t, 2)));
  q.push(poredaj('Poredaj slojeve tla od površine prema dubini.', ['humus', 'sloj zemlje sa sitnim kamenčićima', 'stijena'], 3));
  return q;
}

// ═══ 3. razred: biljke i životinje ═══
const PREHRANA = [['krava', 'biljožder'], ['ovca', 'biljožder'], ['konj', 'biljožder'], ['jelen', 'biljožder'], ['puž', 'biljožder'], ['gusjenica', 'biljožder'], ['koza', 'biljožder'],
  ['vuk', 'mesožder'], ['ris', 'mesožder'], ['orao', 'mesožder'], ['roda', 'mesožder'], ['morski pas', 'mesožder'], ['vidra', 'mesožder'], ['pauk', 'mesožder'],
  ['čovjek', 'svežder'], ['medvjed', 'svežder'], ['divlja svinja', 'svežder'], ['vrana', 'svežder'], ['kokoš', 'svežder'], ['štakor', 'svežder']];
const LANCI = [['trava', 'zec', 'lisica'], ['list', 'gusjenica', 'sjenica'], ['žito', 'miš', 'sova'], ['alge', 'riba', 'čaplja'], ['djetelina', 'puž', 'jež'], ['žir', 'vjeverica', 'kuna']];
const VRSTE_BILJAKA = [['hrast', 'stablo'], ['bor', 'stablo'], ['lipa', 'stablo'], ['jabuka', 'stablo'], ['lijeska', 'grm'], ['ruža', 'grm'], ['malina', 'grm'], ['kupina', 'grm'],
  ['ribiz', 'grm'], ['tratinčica', 'zeljasta biljka'], ['maslačak', 'zeljasta biljka'], ['djetelina', 'zeljasta biljka'], ['visibaba', 'zeljasta biljka'], ['pšenica', 'zeljasta biljka']];
const RAZVOJ = [['Poredaj razvoj žabe.', ['jaje (mrijest)', 'punoglavac', 'mlada žaba', 'odrasla žaba']], ['Poredaj razvoj leptira.', ['jaje', 'gusjenica', 'kukuljica', 'leptir']],
  ['Poredaj razvoj biljke graha.', ['sjemenka', 'klica', 'mlada biljka', 'biljka s cvjetovima i mahunama']], ['Poredaj razvoj kokoši.', ['jaje', 'pile', 'mlada kokoš', 'odrasla kokoš']]];
const SUMA_DA_NE = [['Jedu li biljožderi samo biljke?', true], ['Je li lisica biljožder?', false], ['Može li hranidbeni lanac početi biljkom?', true], ['Ima li grm jedno deblo kao stablo?', false],
  ['Ima li stablo drvenastu stabljiku koja se zove deblo?', true], ['Je li gusjenica mladi oblik leptira?', true], ['Je li punoglavac mladi oblik žabe?', true], ['Hrane li se mesožderi drugim životinjama?', true],
  ['Treba li biljci svjetlost da stvara hranu?', true], ['Hrani li se vjeverica žirevima i orasima?', true]];
function biljkeZivotinje3Dodatak() {
  const q = [];
  q.push(...PREHRANA.map(([z, p]) => izbor(`Kako se hrani ${z}: je li biljožder, mesožder ili svežder?`, p, ['biljožder', 'mesožder', 'svežder'].filter((x) => x !== p), 2)));
  for (const [a, b, c] of LANCI) {
    q.push(izbor(`U hranidbenom lancu ${a} – ___ – ${c} nedostaje jedno biće. Koje?`, b, uzmi(LANCI.map((l) => l[1]).filter((x) => x !== b), 3), 2));
    q.push(izbor(`Koje biće dolazi na kraj hranidbenog lanca ${a} – ${b} – ___?`, c, uzmi(LANCI.map((l) => l[2]).filter((x) => x !== c), 3), 2));
    q.push(poredaj(`Poredaj hranidbeni lanac koji počinje biljkom: ${uzmi([a, b, c], 3).join(', ')}.`, [a, b, c], 2));
  }
  q.push(...VRSTE_BILJAKA.map(([b, v]) => izbor(`Je li ${b} stablo, grm ili zeljasta biljka?`, v, ['stablo', 'grm', 'zeljasta biljka'].filter((x) => x !== v), 2)));
  q.push(...RAZVOJ.map(([p, items]) => poredaj(p, items, 2)));
  q.push(...obaSmjera(DIO_BILJKE, { pitajB: (a) => `Koju zadaću u biljci ima ${a}?`, tezina: 2 }));
  q.push(...SUMA_DA_NE.map(([p, t]) => tocnoNetocno(p, t, 2)));
  return q;
}

// ═══ 4. razred: biljke i životinje ═══
const SKUPINE = [['lisica', 'sisavci'], ['šišmiš', 'sisavci'], ['dupin', 'sisavci'], ['kit', 'sisavci'], ['jež', 'sisavci'], ['medvjed', 'sisavci'],
  ['vrabac', 'ptice'], ['sova', 'ptice'], ['pingvin', 'ptice'], ['galeb', 'ptice'], ['roda', 'ptice'],
  ['šaran', 'ribe'], ['pastrva', 'ribe'], ['morski pas', 'ribe'], ['srdela', 'ribe'],
  ['zmija', 'gmazovi'], ['gušter', 'gmazovi'], ['kornjača', 'gmazovi'], ['krokodil', 'gmazovi'],
  ['žaba', 'vodozemci'], ['daždevnjak', 'vodozemci'], ['vodenjak', 'vodozemci'],
  ['pčela', 'kukci'], ['mrav', 'kukci'], ['bubamara', 'kukci'], ['leptir', 'kukci']];
const OBILJEZJA = [['sisavci', 'mladunce hrane mlijekom'], ['ptice', 'imaju perje i kljun, legu jaja'], ['ribe', 'dišu škrgama i imaju peraje'], ['gmazovi', 'koža im je prekrivena ljuskama, legu jaja na kopnu'],
  ['vodozemci', 'mladi žive u vodi, a odrasli i na kopnu'], ['kukci', 'imaju šest nogu i tijelo od tri dijela']];
const EKOSUSTAVI = [['srna', 'šuma'], ['djetlić', 'šuma'], ['vjeverica', 'šuma'], ['skakavac', 'livada'], ['leptir', 'livada'], ['poljski miš', 'livada'],
  ['šaran', 'rijeka'], ['vidra', 'rijeka'], ['hobotnica', 'more'], ['morski jež', 'more'], ['dupin', 'more'], ['žaba', 'bara'], ['lopoč', 'bara'], ['trska', 'bara']];
const PRILAGODBE = [['patka', 'ima kožice među prstima za plivanje'], ['djetlić', 'ima jak kljun za kljucanje kore'], ['krtica', 'ima snažne prednje noge za kopanje'],
  ['kaktus', 'u debeloj stabljici čuva vodu'], ['riba', 'ima škrge za disanje u vodi'], ['sova', 'ima velike oči i vidi u mraku'], ['zec', 'ima duge uši i brze noge'],
  ['kameleon', 'mijenja boju kože'], ['deva', 'može dugo izdržati bez vode']];
const BZ4_DA_NE = [['Je li šišmiš ptica?', false], ['Je li kit sisavac?', true], ['Dišu li ribe škrgama?', true], ['Imaju li kukci osam nogu?', false], ['Je li žaba vodozemac?', true],
  ['Je li kornjača gmaz?', true], ['Legu li ptice jaja?', true], ['Je li dupin riba?', false], ['Živi li hobotnica u rijeci?', false], ['Je li pauk kukac?', false]];
function biljkeZivotinje4Dodatak() {
  const q = [];
  q.push(...SKUPINE.map(([z, s]) => izbor(`U koju skupinu životinja pripada ${z}?`, s, uzmi(['sisavci', 'ptice', 'ribe', 'gmazovi', 'vodozemci', 'kukci'].filter((x) => x !== s), 3), 2)));
  q.push(...obaSmjera(OBILJEZJA, { pitajB: (a) => `Koje je obilježje skupine: ${a}?`, pitajA: (b) => `Koja skupina životinja: ${b}?`, tezina: 2 }));
  q.push(...EKOSUSTAVI.map(([z, e]) => izbor(`U kojem ekosustavu najčešće živi ${z}?`, e, uzmi(['šuma', 'livada', 'rijeka', 'more', 'bara'].filter((x) => x !== e), 3), 2)));
  q.push(...obaSmjera(PRILAGODBE, { pitajB: (a) => `Kojom se prilagodbom ističe ${a}?`, tezina: 2 }));
  q.push(...spajanja(SKUPINE.filter(([, s]) => s !== 'kukci'), 'Spoji životinju sa skupinom kojoj pripada:', { koliko: 4, komada: 3 }));
  q.push(...BZ4_DA_NE.map(([p, t]) => tocnoNetocno(p, t, 2)));
  return q;
}

// ═══ 4. razred: uvjeti života ═══
const PRILAGODBE_2 = [['listopadno drvo', 'u jesen odbacuje lišće'], ['jež', 'zimi spava zimskim snom'], ['vjeverica', 'u jesen sprema hranu za zimu'], ['roda', 'zimi odlazi u toplije krajeve'],
  ['zec', 'zimi dobiva gušće krzno'], ['bor', 'ima uske iglice koje zimi ne otpadaju'], ['medvjed', 'prije zime nakupi mnogo sala']];
const UVJETI = [['Bez čega biljka uvene?', 'bez vode', ['bez glazbe', 'bez vjetra', 'bez kamenja']], ['Što biljci daje Sunce?', 'svjetlost i toplinu', ['vodu', 'tlo', 'hranu iz trgovine']],
  ['Zašto živim bićima treba zrak?', 'za disanje', ['za igru', 'za spavanje', 'za plivanje']], ['Što je biljkama tlo?', 'oslonac i izvor vode i hranjivih tvari', ['samo ukras', 'mjesto za igru', 'izvor svjetlosti']],
  ['Što se dogodi s biljkom koja dugo stoji u mraku?', 'blijedi i slabo raste', ['brže raste', 'postane zelenija', 'procvjeta']],
  ['Zašto je toplina važna za život?', 'pri preniskoj temperaturi većina bića ne može živjeti', ['jer topi kamenje', 'jer stvara vjetar', 'nije važna']],
  ['Koji uvjet nedostaje biljci u zatvorenoj kutiji?', 'svjetlost', ['tlo', 'boja', 'zvuk']], ['Koji uvjet nedostaje ribi izvan vode?', 'voda s otopljenim zrakom', ['svjetlost', 'tlo', 'toplina']]];
const UZ_DA_NE = [['Treba li životinjama hrana?', true], ['Može li čovjek dugo živjeti bez vode?', false], ['Je li zrak potreban za gorenje?', true], ['Žive li biljke bez svjetlosti dugo i zdravo?', false],
  ['Je li Sunce izvor topline za Zemlju?', true], ['Pripada li kamen živoj prirodi?', false], ['Dišu li biljke?', true], ['Može li sjeme proklijati u suhom pijesku bez vode?', false]];
function uvjetiZivotaDodatak() {
  const q = [];
  q.push(...obaSmjera(PRILAGODBE_2, { pitajB: (a) => `Kako se ${a} prilagođava zimi?`, pitajA: (b) => `Koje živo biće ${b}?`, tezina: 2 }));
  q.push(...obaSmjera([...PRILAGODBE.slice(0, 5)], { pitajA: (b) => `Koje živo biće ${b}?`, tezina: 2 }));
  q.push(...izTablice(UVJETI, 2));
  q.push(...UZ_DA_NE.map(([p, t]) => tocnoNetocno(p, t, 2)));
  return q;
}

// ═══ 4. razred: ljudsko tijelo ═══
const ORGANI = [['srce', 'pumpa krv kroz tijelo'], ['pluća', 'služe za disanje'], ['želudac', 'probavlja hranu'], ['mozak', 'upravlja radom cijeloga tijela'],
  ['kosti', 'daju tijelu oslonac i oblik'], ['mišići', 'omogućuju pokrete'], ['bubrezi', 'čiste krv i stvaraju mokraću'], ['crijeva', 'upijaju hranjive tvari iz hrane'],
  ['koža', 'štiti tijelo i osjeća dodir'], ['jetra', 'pomaže probavi i čisti krv']];
const SUSTAVI = [['koštani sustav', 'kosti'], ['mišićni sustav', 'mišići'], ['krvožilni sustav', 'srce i krvne žile'], ['dišni sustav', 'nos, dušnik i pluća'],
  ['probavni sustav', 'usta, želudac i crijeva'], ['živčani sustav', 'mozak, leđna moždina i živci'], ['mokraćni sustav', 'bubrezi i mokraćni mjehur']];
const KOSTUR = [['lubanja', 'štiti mozak'], ['rebra', 'štite srce i pluća'], ['kralježnica', 'drži tijelo uspravnim'], ['zdjelica', 'nosi trup i štiti trbušne organe']];
const NAVIKE_4 = [['Kako najbolje čuvamo kralježnicu?', 'pravilno sjedimo i nosimo ruksak na oba ramena', ['nosimo težak ruksak na jednom ramenu', 'stalno sjedimo pogrbljeno', 'ne krećemo se']],
  ['Što jača srce i pluća?', 'redovito trčanje, plivanje i igra', ['dugo sjedenje', 'gledanje televizije', 'spavanje danju']],
  ['Zašto ne smijemo dugo slušati preglasnu glazbu?', 'oštećuje sluh', ['oštećuje kosu', 'jača sluh', 'nema posljedica']],
  ['Što pomaže zdravlju kostiju?', 'mlijeko i mliječni proizvodi te kretanje', ['samo slatkiši', 'gazirani sokovi', 'sjedenje']],
  ['Zašto pri čitanju trebamo dovoljno svjetla?', 'da ne naprežemo oči', ['da brže čitamo', 'da knjiga ne pobjegne', 'nije važno']],
  ['Koliko puta dnevno je dobro jesti manje obroke?', '5', ['1', '2', '10']]];
const LT_DA_NE = [['Je li srce mišić?', true], ['Dišemo li želucem?', false], ['Štiti li lubanja mozak?', true], ['Ima li odrasli čovjek 32 trajna zuba?', true],
  ['Imaju li djeca 20 mliječnih zuba?', true], ['Upravlja li mozak tijelom?', true], ['Čiste li bubrezi krv?', true], ['Jesu li kosti mekane kao mišići?', false],
  ['Je li koža najveći organ ljudskoga tijela?', true], ['Može li čovjek živjeti bez srca?', false]];
function ljudskoTijeloDodatak() {
  const q = [];
  q.push(...obaSmjera(ORGANI, { pitajB: (a) => `Koja je zadaća organa: ${a}?`, pitajA: (b) => `Koji organ ${b}?`, tezina: 2 }));
  q.push(...obaSmjera(SUSTAVI, { pitajB: (a) => `Koji organi čine ${a}?`, pitajA: (b) => `Kojem sustavu pripadaju: ${b}?`, tezina: 3 }));
  q.push(...obaSmjera(KOSTUR, { pitajB: (a) => `Čemu služi ${a}?`, pitajA: (b) => `Koji dio kostura ${b}?`, tezina: 2 }));
  q.push(...izTablice(NAVIKE_4, 2));
  q.push(...LT_DA_NE.map(([p, t]) => tocnoNetocno(p, t, 2)));
  return q;
}

// ── tvrdnje Da/Ne iz tablica (sva uparivanja) ──
const JEDNINA = { sisavci: 'sisavac', ptice: 'ptica', ribe: 'riba', gmazovi: 'gmaz', vodozemci: 'vodozemac', kukci: 'kukac' };
const GDJE = { šuma: 'u šumi', livada: 'na livadi', rijeka: 'u rijeci', more: 'u moru', bara: 'u bari' };
const STANJE_7 = { čvrsto: 'čvrstom', kruto: 'čvrstom', tekuće: 'tekućem', plinovito: 'plinovitom' };
function bz4Tvrdnje() {
  return [
    ...sveTvrdnje(SKUPINE, (a, b) => `Je li ${a} ${JEDINA_ILI(b)}?`, { objasni: (a, b) => `${a} pripada skupini: ${b}.` }),
    ...sveTvrdnje(EKOSUSTAVI, (a, b) => `Živi li ${a} najčešće ${GDJE[b]}?`, { objasni: (a, b) => `${a} najčešće živi ${GDJE[b]}.`, lazni: 1 }),
    ...sveTvrdnje(PRILAGODBE, (a, b) => `Je li točno da ${a} ${b}?`, { lazni: 1 }),
  ];
}
const JEDINA_ILI = (b) => JEDNINA[b];
function bz3Tvrdnje() {
  return [
    ...sveTvrdnje(PREHRANA, (a, b) => `Je li ${a} ${b}?`, { lazni: 1, objasni: (a, b) => `${a} je ${b}.` }),
    ...sveTvrdnje(VRSTE_BILJAKA, (a, b) => `Je li ${a} ${b}?`, { lazni: 1, objasni: (a, b) => `${a} je ${b}.` }),
  ];
}
function ltTvrdnje() {
  // tvrdnja mora slagati broj: jednina s jedninom, množina s množinom
  const MNOZINA = ['pluća', 'kosti', 'mišići', 'bubrezi', 'crijeva'];
  const r = (a, b) => `Je li točno da ${a} ${b}?`;
  return [
    ...sveTvrdnje(ORGANI.filter(([a]) => !MNOZINA.includes(a)), r, { lazni: 2 }),
    ...sveTvrdnje(ORGANI.filter(([a]) => MNOZINA.includes(a)), r, { lazni: 2 }),
    ...sveTvrdnje(KOSTUR.filter(([a]) => a !== 'rebra'), r, { lazni: 2 }),
  ];
}
function tvzTvrdnje() {
  return [
    ...sveTvrdnje(INSTRUMENTI, (a, b) => `Mjeri li ili određuje ${a} ${b}?`, { lazni: 2, objasni: (a, b) => `${a}: ${b}.` }),
    ...sveTvrdnje(PROMJENE, (a, b) => `Je li ${b} ono što se događa u primjeru: ${a.replace(/\.$/, '')}?`, { lazni: 1, objasni: (a, b) => `To je ${b}.` }),
    ...sveTvrdnje(STANJA, (a, b) => `Je li voda u primjeru „${a}” u ${STANJE_7[b]} stanju?`, { lazni: 1 }),
  ];
}
function uvjetiTvrdnje() {
  return sveTvrdnje(PRILAGODBE_2, (a, b) => `Je li točno da ${a} ${b}?`, { lazni: 2 });
}

module.exports = {
  genTloVodaZrak: () => [...tloVodaZrakDodatak(), ...tvzTvrdnje()], genBiljkeZivotinje3: () => [...biljkeZivotinje3Dodatak(), ...bz3Tvrdnje()],
  genBiljkeZivotinje4: () => [...biljkeZivotinje4Dodatak(), ...bz4Tvrdnje()],
  genUvjetiZivota: () => [...uvjetiZivotaDodatak(), ...uvjetiTvrdnje()], genLjudskoTijelo: () => [...ljudskoTijeloDodatak(), ...ltTvrdnje()],
};
