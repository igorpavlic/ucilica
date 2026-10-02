/**
 * Provjera pedagoške raznolikosti kviza.
 * Svaka tema mora imati barem 7 različitih obitelji pitanja, a selektor za
 * standardni kviz od 7 pitanja mora moći izabrati 7 različitih obrazaca bez
 * uzastopnog ponavljanja istoga obrasca.
 */
const { questionFamilyKey } = require('../services/questionFamily');
const { pickBalancedQuestions } = require('../services/gikEngine');

const modules = [
  ['R1-HJ', require('../seeds/gen-hrvatski')],
  ['R1-MAT', require('../seeds/gen-matematika')],
  ['R1-PID', require('../seeds/gen-priroda')],
  ['R2', require('../seeds/seed-r2')],
  ['R3', require('../seeds/seed-r3')],
  ['R4', require('../seeds/seed-r4')],
  ['R1-nove', require('../seeds/nove-teme-r1')],
];

function shuffle(a) {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let fail = false;
let checked = 0;
for (const [group, mod] of modules) {
  for (const [name, fn] of Object.entries(mod)) {
    if (!name.startsWith('gen') || typeof fn !== 'function') continue;
    const questions = fn().map((q, i) => ({ ...q, _id: `${group}-${name}-${i}` }));
    const families = new Set(questions.map(questionFamilyKey));
    checked++;

    if (families.size < Math.min(7, questions.length)) {
      console.error(`FAIL ${group}/${name}: samo ${families.size} obitelji za ${questions.length} pitanja`);
      fail = true;
      continue;
    }

    for (let run = 0; run < 40; run++) {
      const selected = pickBalancedQuestions(shuffle(questions), Math.min(7, questions.length), { easy: 2, medium: 3, hard: 2 });
      const selectedFamilies = selected.map(questionFamilyKey);
      if (new Set(selectedFamilies).size !== selected.length) {
        console.error(`FAIL ${group}/${name}: kviz sadrži ponovljenu obitelj pitanja`);
        fail = true;
        break;
      }
      for (let i = 1; i < selectedFamilies.length; i++) {
        if (selectedFamilies[i] === selectedFamilies[i - 1]) {
          console.error(`FAIL ${group}/${name}: dva ista obrasca su uzastopna`);
          fail = true;
          break;
        }
      }
    }
  }
}

if (fail) process.exit(1);
console.log(`OK: ${checked} generatora; svaki standardni kviz od 7 pitanja koristi 7 različitih obrazaca.`);
