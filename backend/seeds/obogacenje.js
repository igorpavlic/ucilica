/** Ručno napisani kratki zadatci; nema preuzimanja tuđih zbirki. */
function genPodatci3() {
  const q = [];
  const podaci = [
    { naslov: 'Omiljeno voće', oznake: ['jabuka', 'kruška', 'šljiva', 'breskva'], vrijednosti: [8, 5, 3, 6] },
    { naslov: 'Posuđene knjige', oznake: ['ponedjeljak', 'utorak', 'srijeda', 'četvrtak'], vrijednosti: [4, 7, 5, 9] }
  ];
  for (const t of podaci) {
    const max = Math.max(...t.vrijednosti), min = Math.min(...t.vrijednosti);
    const najveci = t.oznake[t.vrijednosti.indexOf(max)];
    const chart = t.oznake.map((label, i) => ({ label, value: t.vrijednosti[i] }));
    q.push({ type: 'choice', difficulty: 2, question: `${t.naslov}: Koja oznaka ima najveći broj?`, chart,
      answers: t.oznake, correctIndex: t.oznake.indexOf(najveci), objasnjenje: `${najveci} ima ${max}, više od ostalih.` });
    q.push({ type: 'input', difficulty: 2, question: `${t.naslov}: Kolika je razlika između najvećeg i najmanjeg broja?`, chart,
      correctAnswer: String(max - min), objasnjenje: `${max} − ${min} = ${max - min}.` });
    q.push({ type: 'input', difficulty: 3, question: `${t.naslov}: Koliko je ukupno zabilježeno?`, chart,
      correctAnswer: String(t.vrijednosti.reduce((a, b) => a + b, 0)),
      objasnjenje: `Zbroji sve stupce: ${t.vrijednosti.join(' + ')} = ${t.vrijednosti.reduce((a, b) => a + b, 0)}.` });
  }
  return q;
}

function genNepoznati3() {
  const q = [];
  for (const [a, b] of [[16, 27], [35, 18], [48, 25], [71, 12], [124, 36], [235, 42]]) {
    q.push({ type: 'input', difficulty: 2, question: `Koji broj nedostaje: ${a} + □ = ${a + b}?`,
      correctAnswer: String(b), objasnjenje: `Od ${a + b} oduzmi ${a}: ${a + b} − ${a} = ${b}.` });
    q.push({ type: 'input', difficulty: 2, question: `Koji broj nedostaje: □ − ${b} = ${a}?`,
      correctAnswer: String(a + b), objasnjenje: `Zbroji ${a} i ${b}: ${a} + ${b} = ${a + b}.` });
  }
  return q;
}

function genPodatci4() {
  const q = genPodatci3().map(x => ({ ...x, difficulty: 2 }));
  const t = [120, 85, 145, 90];
  const chart = ['siječanj', 'veljača', 'ožujak', 'travanj'].map((label, i) => ({ label, value: t[i] }));
  q.push({ type: 'input', difficulty: 3, question: 'Broj posjetitelja: Koliko je više posjetitelja bilo u ožujku nego u veljači?', chart,
    correctAnswer: '60', objasnjenje: '145 − 85 = 60.' });
  q.push({ type: 'input', difficulty: 3, question: 'Broj posjetitelja: Koliko je ukupno posjetitelja bilo u prva dva mjeseca?', chart,
    correctAnswer: '205', objasnjenje: '120 + 85 = 205.' });
  return q;
}

function genNepoznati4() {
  const q = genNepoznati3().slice(-6).map(x => ({ ...x, difficulty: 2 }));
  for (const [a, b] of [[12, 7], [18, 5], [24, 4], [32, 3]]) {
    q.push({ type: 'input', difficulty: 3, question: `Koji broj nedostaje: ${a} × □ = ${a * b}?`,
      correctAnswer: String(b), objasnjenje: `${a * b} ÷ ${a} = ${b}.` });
    q.push({ type: 'input', difficulty: 3, question: `Koji broj nedostaje: □ ÷ ${b} = ${a}?`,
      correctAnswer: String(a * b), objasnjenje: `${a} × ${b} = ${a * b}.` });
  }
  return q;
}

function genCitanje3() {
  const tekst = 'Maja je u petak posudila knjigu o pticama. U subotu je s bakom u parku promatrala sjenice i zapisala njihove boje. U nedjelju je vratila knjigu u školsku knjižnicu.';
  return [
    { type: 'choice', difficulty: 2, question: `S kim je Maja promatrala ptice?`, answers: ['s bakom', 's učiteljem', 's bratom'], correctIndex: 0, objasnjenje: 'U tekstu piše da je bila s bakom.' },
    { type: 'choice', difficulty: 2, question: `Što je Maja zapisala?`, answers: ['boje ptica', 'nazive ulica', 'broj knjiga'], correctIndex: 0, objasnjenje: 'Zapisala je boje sjenica.' },
    { type: 'ordering', difficulty: 3, question: 'Poredaj događaje iz priče o Maji od prvoga do posljednjega.', items: ['Posudila je knjigu.', 'Promatrala je ptice.', 'Vratila je knjigu.'], objasnjenje: 'Najprije je posudila knjigu, potom promatrala ptice, a na kraju vratila knjigu.' },
    { type: 'true-false', difficulty: 2, question: 'Je li Maja posudila knjigu u subotu?', correct: false, objasnjenje: 'Knjigu je posudila u petak.' },
    { type: 'choice', difficulty: 2, question: 'Gdje je Maja promatrala sjenice?', answers: ['u parku', 'u školi', 'u knjižnici'], correctIndex: 0, objasnjenje: 'U subotu je s bakom bila u parku.' },
    { type: 'choice', difficulty: 2, question: 'Kada je Maja vratila knjigu?', answers: ['u petak', 'u subotu', 'u nedjelju'], correctIndex: 2, objasnjenje: 'Zadnja rečenica govori o nedjelji.' },
    { type: 'true-false', difficulty: 2, question: 'Je li Maja zapisala boje sjenica?', correct: true, objasnjenje: 'U tekstu piše da je zapisala njihove boje.' },
    { type: 'choice', difficulty: 3, question: 'Zašto joj je knjiga o pticama mogla pomoći?', answers: ['Proučavala je ptice.', 'Učila je kuhati.', 'Tražila je autobus.'], correctIndex: 0, objasnjenje: 'Knjiga i promatranje bave se pticama.' }
  ].map(q => ({ ...q, passage: tekst }));
}

function genCitanje4() {
  const tekst = 'Učenici su u ponedjeljak zasadili grah u dvije posude. Prvu su stavili na prozor i redovito zalijevali. Drugu su ostavili u tamnom ormaru, ali su je jednako zalijevali. Nakon tjedan dana biljka uz prozor bila je zelena, a ona u ormaru blijeda.';
  return [
    { type: 'choice', difficulty: 3, question: `Što su učenici promijenili između dvije posude?`, answers: ['količinu svjetlosti', 'vrstu sjemena', 'učestalost zalijevanja'], correctIndex: 0, objasnjenje: 'Obje su posude jednako zalijevali, ali samo je jedna bila na svjetlu.' },
    { type: 'choice', difficulty: 3, question: `Koji zaključak podupire opažanje?`, answers: ['Svjetlost utječe na izgled biljke.', 'Grah ne treba vodu.', 'Posude su bile prazne.'], correctIndex: 0, objasnjenje: 'Razlika u svjetlosti povezana je s različitim izgledom biljaka.' },
    { type: 'true-false', difficulty: 2, question: 'Jesu li obje biljke dobivale vodu?', correct: true, objasnjenje: 'U tekstu piše da su obje posude jednako zalijevali.' },
    { type: 'ordering', difficulty: 3, question: 'Poredaj korake pokusa s grahom od prvoga do posljednjega.', items: ['Zasadili su grah.', 'Posude su stavili na različita mjesta.', 'Usporedili su izgled biljaka.'], objasnjenje: 'Sadnja prethodi promjeni uvjeta, a opažanje slijedi nakon tjedan dana.' },
    { type: 'choice', difficulty: 2, question: 'Gdje je bila biljka koja je ostala zelena?', answers: ['na prozoru', 'u ormaru', 'u hodniku'], correctIndex: 0, objasnjenje: 'Biljka na prozoru dobivala je svjetlost.' },
    { type: 'choice', difficulty: 2, question: 'Koliko je vremena prošlo prije usporedbe?', answers: ['jedan dan', 'jedan tjedan', 'jedan mjesec'], correctIndex: 1, objasnjenje: 'Tekst kaže: nakon tjedan dana.' },
    { type: 'true-false', difficulty: 2, question: 'Je li biljka u ormaru bila zelena?', correct: false, objasnjenje: 'Biljka u ormaru bila je blijeda.' },
    { type: 'choice', difficulty: 3, question: 'Zašto je važno da su obje posude jednako zalijevane?', answers: ['Tako je svjetlost glavna promjena u pokusu.', 'Tako biljke ne trebaju tlo.', 'Tako posude postaju jednake boje.'], correctIndex: 0, objasnjenje: 'Jednako zalijevanje olakšava usporedbu utjecaja svjetlosti.' }
  ].map(q => ({ ...q, passage: tekst }));
}

module.exports = { genPodatci3, genNepoznati3, genPodatci4, genNepoznati4, genCitanje3, genCitanje4 };
