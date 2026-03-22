/**
 * seed.js - Punjenje baze za 1. razred
 * 
 * Pokretanje:  node seeds/seed.js  (iz backend/ mape)
 * 
 * Za novi razred: kopiraj u seed-2-razred.js, promijeni GRADE i sadržaj.
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { MongoClient } = require('mongodb');

const GRADE = 1;

// ============================================================
//  PREDMETI
// ============================================================
const subjects = [
  {
    name: 'Hrvatski jezik',
    slug: 'hrvatski',
    icon: '📖',
    color: '#FF6B6B',
    description: 'Slova, čitanje, pisanje, rečenice',
    order: 1,
    isActive: true
  },
  {
    name: 'Matematika',
    slug: 'matematika',
    icon: '🔢',
    color: '#60A5FA',
    description: 'Brojevi, zbrajanje, oduzimanje',
    order: 2,
    isActive: true
  },
  {
    name: 'Priroda i društvo',
    slug: 'priroda',
    icon: '🌿',
    color: '#34D399',
    description: 'Životinje, biljke, godišnja doba',
    order: 3,
    isActive: true
  }
];

// ============================================================
//  TEME I PITANJA
// ============================================================
const topicsAndQuestions = {

  // ─────────────── HRVATSKI JEZIK ───────────────
  hrvatski: [
    {
      topic: { name: 'Velika i mala slova', slug: 'slova', icon: '🔤', order: 1 },
      questions: [
        { type: 'choice', question: 'Koje je veliko slovo od "a"?', answers: ['A', 'B', 'D', 'E'], correctIndex: 0 },
        { type: 'choice', question: 'Koje je malo slovo od "M"?', answers: ['n', 'w', 'm', 'p'], correctIndex: 2 },
        { type: 'choice', question: 'Koje je veliko slovo od "š"?', answers: ['S', 'Š', 'Ž', 'Č'], correctIndex: 1 },
        { type: 'choice', question: 'Koliko slova ima hrvatska abeceda?', answers: ['26', '30', '28', '32'], correctIndex: 1, hint: 'Ima više slova nego engleska!' },
        { type: 'choice', question: 'Koje slovo dolazi nakon "B"?', answers: ['D', 'C', 'A', 'E'], correctIndex: 1 },
        { type: 'choice', question: 'Koje je veliko slovo od "č"?', answers: ['C', 'Ć', 'Č', 'Š'], correctIndex: 2 },
        { type: 'choice', question: 'Koje od ovih NIJE hrvatsko slovo?', answers: ['Đ', 'Ž', 'Q', 'Š'], correctIndex: 2 },
        { type: 'choice', question: 'Rečenica uvijek počinje...', answers: ['malim slovom', 'velikim slovom', 'brojem', 'točkom'], correctIndex: 1 },
        { type: 'choice', question: 'Koje je malo slovo od "G"?', answers: ['d', 'g', 'q', 'b'], correctIndex: 1 },
        { type: 'choice', question: 'Koje je veliko slovo od "nj"?', answers: ['N', 'NJ', 'Nj', 'J'], correctIndex: 2, hint: 'Nj je dvoslov!' },
        { type: 'input', question: 'Napiši veliko slovo od "d":', correctAnswer: 'D', placeholder: 'Upiši slovo...' },
        { type: 'input', question: 'Napiši malo slovo od "G":', correctAnswer: 'g', placeholder: 'Upiši slovo...' },
        { type: 'input', question: 'Napiši veliko slovo od "ž":', correctAnswer: 'Ž', placeholder: 'Upiši slovo...' },
      ]
    },
    {
      topic: { name: 'Samoglasnici i suglasnici', slug: 'samoglasnici', icon: '🗣️', order: 2 },
      questions: [
        { type: 'choice', question: 'Koji od ovih glasova je samoglasnik?', answers: ['B', 'A', 'K', 'M'], correctIndex: 1, hint: 'Samoglasnici su: A, E, I, O, U' },
        { type: 'choice', question: 'Koliko samoglasnika ima u hrvatskom?', answers: ['3', '4', '5', '6'], correctIndex: 2 },
        { type: 'choice', question: 'Koji glas NIJE samoglasnik?', answers: ['A', 'E', 'K', 'O'], correctIndex: 2 },
        { type: 'choice', question: 'Koliko samoglasnika ima u riječi "kuća"?', visual: '🏠', answers: ['1', '2', '3', '4'], correctIndex: 1 },
        { type: 'choice', question: 'Koji samoglasnik je u riječi "rak"?', visual: '🦀', answers: ['e', 'a', 'o', 'u'], correctIndex: 1 },
        { type: 'choice', question: '"M" je...', answers: ['samoglasnik', 'suglasnik', 'broj', 'rečenica'], correctIndex: 1 },
        { type: 'choice', question: 'Koliko samoglasnika ima u "olovo"?', answers: ['2', '3', '4', '1'], correctIndex: 1 },
        { type: 'choice', question: '"I" je...', answers: ['suglasnik', 'samoglasnik', 'dvoglas', 'slog'], correctIndex: 1 },
        { type: 'choice', question: 'Koji je samoglasnik u riječi "pas"?', visual: '🐕', answers: ['p', 's', 'a', 'nema ga'], correctIndex: 2 },
        { type: 'input', question: 'Napiši sve samoglasnike (bez razmaka):', correctAnswer: 'AEIOU', placeholder: 'npr. AEIOU' },
      ]
    },
    {
      topic: { name: 'Slaganje riječi', slug: 'rijeci', icon: '📝', order: 3 },
      questions: [
        { type: 'choice', question: 'Što je na slici?', visual: '🌞', answers: ['mjesec', 'sunce', 'zvijezda', 'oblak'], correctIndex: 1 },
        { type: 'choice', question: 'Što je na slici?', visual: '🐱', answers: ['pas', 'ptica', 'mačka', 'riba'], correctIndex: 2 },
        { type: 'choice', question: 'Što je na slici?', visual: '🌳', answers: ['cvijet', 'drvo', 'trava', 'grm'], correctIndex: 1 },
        { type: 'choice', question: 'Koja riječ se rimuje s "dom"?', visual: '🏠', answers: ['kuća', 'grom', 'grad', 'sat'], correctIndex: 1 },
        { type: 'choice', question: 'Koja riječ se rimuje s "sat"?', visual: '⏰', answers: ['brat', 'dan', 'noć', 'put'], correctIndex: 0 },
        { type: 'choice', question: 'Koliko slogova ima "mama"?', answers: ['1', '2', '3', '4'], correctIndex: 1, hint: 'Pljeskaj: ma-ma' },
        { type: 'choice', question: 'Koliko slogova ima "škola"?', visual: '🏫', answers: ['1', '2', '3', '4'], correctIndex: 1 },
        { type: 'choice', question: 'Koliko slogova ima "automobil"?', visual: '🚗', answers: ['2', '3', '4', '5'], correctIndex: 2 },
        { type: 'input', question: 'Što je na slici?', visual: '🍎', correctAnswer: 'jabuka', placeholder: 'Napiši...' },
        { type: 'input', question: 'Što je na slici?', visual: '🐕', correctAnswer: 'pas', placeholder: 'Napiši...' },
        { type: 'input', question: 'Što je na slici?', visual: '🌞', correctAnswer: 'sunce', placeholder: 'Napiši...' },
      ]
    },
    {
      topic: { name: 'Rečenice', slug: 'recenice', icon: '💬', order: 4 },
      questions: [
        { type: 'choice', question: 'Koja rečenica je pravilno napisana?', answers: ['pas trči.', 'Pas trči.', 'pas Trči.', 'pas trči'], correctIndex: 1, hint: 'Veliko slovo + točka.' },
        { type: 'choice', question: 'Čime završava izjavna rečenica?', answers: ['upitnikom ?', 'točkom .', 'uskličnikom !', 'zarezom ,'], correctIndex: 1 },
        { type: 'choice', question: 'Čime završava upitna rečenica?', answers: ['točkom .', 'zarezom ,', 'upitnikom ?', 'uskličnikom !'], correctIndex: 2 },
        { type: 'choice', question: '"Kako se zoveš?" je...', answers: ['izjavna', 'upitna', 'usklična', 'nije rečenica'], correctIndex: 1 },
        { type: 'choice', question: '"Bravo!" je...', answers: ['izjavna', 'upitna', 'usklična', 'nije rečenica'], correctIndex: 2 },
        { type: 'choice', question: 'Koja je pravilno napisana?', answers: ['volim čokoladu', 'Volim čokoladu.', 'volim čokoladu.', 'Volim Čokoladu.'], correctIndex: 1 },
        { type: 'choice', question: 'Koje ime je pravilno napisano?', answers: ['zagreb', 'Zagreb', 'ZAGREB', 'zaGreb'], correctIndex: 1, hint: 'Veliko početno slovo.' },
        { type: 'choice', question: '"Sunce sija." je...', answers: ['upitna', 'usklična', 'izjavna', 'nije rečenica'], correctIndex: 2 },
        { type: 'choice', question: 'Ime i prezime pišemo...', answers: ['malim slovima', 'velikim početnim slovom', 'samo velikim', 'svejedno'], correctIndex: 1 },
        { type: 'choice', question: 'Koliko rečenica: "Pada kiša. Otvorit ću kišobran."', answers: ['1', '2', '3', '4'], correctIndex: 1 },
      ]
    }
  ],

  // ─────────────── MATEMATIKA ───────────────
  matematika: [
    {
      topic: { name: 'Brojevi do 20', slug: 'brojevi', icon: '🔢', order: 1 },
      questions: [
        { type: 'choice', question: 'Koji broj dolazi nakon 7?', visual: '7 → ?', answers: ['6', '8', '9', '5'], correctIndex: 1 },
        { type: 'choice', question: 'Koji broj dolazi prije 5?', visual: '? → 5', answers: ['6', '3', '4', '7'], correctIndex: 2 },
        { type: 'choice', question: 'Koji broj je najveći?', answers: ['12', '8', '19', '15'], correctIndex: 2 },
        { type: 'choice', question: 'Koji broj je najmanji?', answers: ['11', '3', '7', '15'], correctIndex: 1 },
        { type: 'choice', question: 'Koliko jabuka vidiš?', visual: '🍎🍎🍎🍎🍎', answers: ['3', '4', '5', '6'], correctIndex: 2 },
        { type: 'choice', question: 'Poredaj od najmanjeg: 3, 1, 5, 2', answers: ['1, 2, 3, 5', '5, 3, 2, 1', '2, 1, 3, 5', '1, 3, 2, 5'], correctIndex: 0 },
        { type: 'choice', question: 'Koji broj dolazi nakon 15?', answers: ['14', '17', '16', '13'], correctIndex: 2 },
        { type: 'choice', question: 'Koji broj je između 8 i 10?', answers: ['7', '11', '9', '6'], correctIndex: 2 },
        { type: 'choice', question: 'Koliko zvjezdica?', visual: '⭐⭐⭐⭐⭐⭐⭐', answers: ['5', '6', '7', '8'], correctIndex: 2 },
        { type: 'input', question: 'Koji broj dolazi nakon 13?', visual: '13 → ?', correctAnswer: '14', placeholder: 'Upiši broj...' },
        { type: 'input', question: 'Koji broj dolazi prije 10?', visual: '? → 10', correctAnswer: '9', placeholder: 'Upiši broj...' },
        { type: 'input', question: 'Koji broj dolazi nakon 19?', visual: '19 → ?', correctAnswer: '20', placeholder: 'Upiši broj...' },
      ]
    },
    {
      topic: { name: 'Zbrajanje do 10', slug: 'zbrajanje', icon: '➕', order: 2 },
      questions: [
        { type: 'choice', question: '2 + 3 = ?', visual: '🍎🍎 + 🍏🍏🍏', answers: ['4', '5', '6', '3'], correctIndex: 1 },
        { type: 'choice', question: '4 + 1 = ?', visual: '🔵🔵🔵🔵 + 🔵', answers: ['3', '4', '5', '6'], correctIndex: 2 },
        { type: 'choice', question: '3 + 3 = ?', visual: '🌟🌟🌟 + 🌟🌟🌟', answers: ['5', '6', '7', '9'], correctIndex: 1 },
        { type: 'choice', question: '5 + 2 = ?', visual: '🍎🍎🍎🍎🍎 + 🍏🍏', answers: ['6', '8', '7', '5'], correctIndex: 2 },
        { type: 'choice', question: '1 + 6 = ?', answers: ['5', '6', '7', '8'], correctIndex: 2 },
        { type: 'choice', question: '4 + 4 = ?', answers: ['6', '7', '8', '9'], correctIndex: 2 },
        { type: 'choice', question: '3 + 5 = ?', answers: ['7', '8', '9', '6'], correctIndex: 1 },
        { type: 'choice', question: '6 + 4 = ?', answers: ['8', '9', '10', '11'], correctIndex: 2 },
        { type: 'choice', question: '2 + 6 = ?', answers: ['7', '8', '9', '6'], correctIndex: 1 },
        { type: 'input', question: '5 + 5 = ?', visual: '✋ + ✋', correctAnswer: '10', placeholder: 'Rezultat...' },
        { type: 'input', question: '3 + 4 = ?', correctAnswer: '7', placeholder: 'Rezultat...' },
        { type: 'input', question: '1 + 8 = ?', correctAnswer: '9', placeholder: 'Rezultat...' },
        { type: 'input', question: '7 + 2 = ?', correctAnswer: '9', placeholder: 'Rezultat...' },
      ]
    },
    {
      topic: { name: 'Oduzimanje do 10', slug: 'oduzimanje', icon: '➖', order: 3 },
      questions: [
        { type: 'choice', question: '5 - 2 = ?', visual: '🔵🔵🔵🔵🔵', answers: ['2', '3', '4', '1'], correctIndex: 1, hint: 'Imaš 5, oduzmi 2.' },
        { type: 'choice', question: '7 - 3 = ?', answers: ['3', '4', '5', '2'], correctIndex: 1 },
        { type: 'choice', question: '8 - 4 = ?', answers: ['3', '5', '4', '2'], correctIndex: 2 },
        { type: 'choice', question: '6 - 1 = ?', answers: ['4', '6', '5', '7'], correctIndex: 2 },
        { type: 'choice', question: '10 - 5 = ?', visual: '🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎', answers: ['4', '5', '6', '3'], correctIndex: 1 },
        { type: 'choice', question: '9 - 6 = ?', answers: ['2', '4', '3', '5'], correctIndex: 2 },
        { type: 'choice', question: '4 - 4 = ?', answers: ['1', '4', '0', '2'], correctIndex: 2 },
        { type: 'choice', question: '10 - 3 = ?', answers: ['6', '7', '8', '5'], correctIndex: 1 },
        { type: 'input', question: '8 - 5 = ?', correctAnswer: '3', placeholder: 'Rezultat...' },
        { type: 'input', question: '6 - 2 = ?', correctAnswer: '4', placeholder: 'Rezultat...' },
        { type: 'input', question: '9 - 4 = ?', correctAnswer: '5', placeholder: 'Rezultat...' },
        { type: 'input', question: '10 - 7 = ?', correctAnswer: '3', placeholder: 'Rezultat...' },
      ]
    },
    {
      topic: { name: 'Veće, manje, jednako', slug: 'usporedivanje', icon: '⚖️', order: 4 },
      questions: [
        { type: 'choice', question: '5 __ 3', visual: '5 ? 3', answers: ['<', '>', '='], correctIndex: 1 },
        { type: 'choice', question: '2 __ 8', visual: '2 ? 8', answers: ['<', '>', '='], correctIndex: 0 },
        { type: 'choice', question: '4 __ 4', visual: '4 ? 4', answers: ['<', '>', '='], correctIndex: 2 },
        { type: 'choice', question: '10 __ 7', visual: '10 ? 7', answers: ['<', '>', '='], correctIndex: 1 },
        { type: 'choice', question: '1 __ 9', visual: '1 ? 9', answers: ['<', '>', '='], correctIndex: 0 },
        { type: 'choice', question: '6 __ 6', visual: '6 ? 6', answers: ['<', '>', '='], correctIndex: 2 },
        { type: 'choice', question: 'Što znači ">"?', answers: ['manje od', 'veće od', 'jednako', 'plus'], correctIndex: 1 },
        { type: 'choice', question: 'Veći broj: 15 ili 12?', answers: ['12', '15', 'jednaki su', 'ne znam'], correctIndex: 1 },
        { type: 'choice', question: '3 + 2 __ 5', answers: ['<', '>', '='], correctIndex: 2 },
        { type: 'choice', question: '8 __ 3 + 6', answers: ['<', '>', '='], correctIndex: 0, hint: '3 + 6 = 9' },
      ]
    }
  ],

  // ─────────────── PRIRODA I DRUŠTVO ───────────────
  priroda: [
    {
      topic: { name: 'Godišnja doba', slug: 'godisnja-doba', icon: '🍂', order: 1 },
      questions: [
        { type: 'choice', question: 'Koliko godišnjih doba ima?', visual: '🌸☀️🍂❄️', answers: ['2', '3', '4', '5'], correctIndex: 2 },
        { type: 'choice', question: 'Kad pada snijeg?', visual: '❄️', answers: ['ljeti', 'u proljeće', 'zimi', 'u jesen'], correctIndex: 2 },
        { type: 'choice', question: 'Kada lišće mijenja boju?', visual: '🍂🍁', answers: ['u proljeće', 'ljeti', 'u jesen', 'zimi'], correctIndex: 2 },
        { type: 'choice', question: 'Kada cvjeta cvijeće?', visual: '🌸🌷', answers: ['u proljeće', 'zimi', 'u jesen', 'ljeti'], correctIndex: 0 },
        { type: 'choice', question: 'Najvrelije godišnje doba?', visual: '☀️', answers: ['zima', 'jesen', 'proljeće', 'ljeto'], correctIndex: 3 },
        { type: 'choice', question: 'Što dolazi nakon zime?', answers: ['ljeto', 'jesen', 'proljeće', 'opet zima'], correctIndex: 2 },
        { type: 'choice', question: 'Kada idemo na plažu?', visual: '🏖️', answers: ['zimi', 'u jesen', 'ljeti', 'u proljeće'], correctIndex: 2 },
        { type: 'choice', question: 'Što dolazi nakon ljeta?', answers: ['zima', 'proljeće', 'jesen', 'ljeto'], correctIndex: 2 },
        { type: 'choice', question: 'Kada se ptice selice vraćaju?', visual: '🐦', answers: ['u jesen', 'zimi', 'u proljeće', 'ljeti'], correctIndex: 2 },
        { type: 'input', question: 'Najhladnije godišnje doba?', correctAnswer: 'zima', placeholder: 'Napiši...' },
      ]
    },
    {
      topic: { name: 'Životinje', slug: 'zivotinje', icon: '🐾', order: 2 },
      questions: [
        { type: 'choice', question: 'Koja životinja daje mlijeko?', visual: '🥛', answers: ['kokoš', 'krava', 'riba', 'ptica'], correctIndex: 1 },
        { type: 'choice', question: 'Koja živi u vodi?', visual: '🌊', answers: ['mačka', 'konj', 'riba', 'ptica'], correctIndex: 2 },
        { type: 'choice', question: 'Koja je ovo životinja?', visual: '🐝', answers: ['muha', 'pčela', 'leptir', 'osa'], correctIndex: 1 },
        { type: 'choice', question: 'Što daje kokoš?', visual: '🐔', answers: ['mlijeko', 'vunu', 'jaja', 'med'], correctIndex: 2 },
        { type: 'choice', question: 'Koja životinja laje?', answers: ['mačka', 'konj', 'krava', 'pas'], correctIndex: 3 },
        { type: 'choice', question: 'Koja je ovo životinja?', visual: '🦋', answers: ['pčela', 'leptir', 'muha', 'pauk'], correctIndex: 1 },
        { type: 'choice', question: 'Koja je domaća životinja?', answers: ['lav', 'slon', 'pas', 'tigar'], correctIndex: 2, hint: 'Žive s ljudima.' },
        { type: 'choice', question: 'Koja daje med?', visual: '🍯', answers: ['krava', 'pčela', 'mačka', 'kokoš'], correctIndex: 1 },
        { type: 'choice', question: 'Koja ima perje?', answers: ['mačka', 'riba', 'kokoš', 'pas'], correctIndex: 2 },
        { type: 'choice', question: 'Koja NIJE domaća?', answers: ['krava', 'ovca', 'lav', 'kokoš'], correctIndex: 2 },
        { type: 'input', question: 'Koja je ovo životinja?', visual: '🐈', correctAnswer: 'mačka', placeholder: 'Napiši...' },
        { type: 'input', question: 'Koja je ovo životinja?', visual: '🐴', correctAnswer: 'konj', placeholder: 'Napiši...' },
      ]
    },
    {
      topic: { name: 'Moje tijelo', slug: 'tijelo', icon: '🧍', order: 3 },
      questions: [
        { type: 'choice', question: 'Koliko ruku ima čovjek?', visual: '🤲', answers: ['1', '2', '3', '4'], correctIndex: 1 },
        { type: 'choice', question: 'Čime vidimo?', visual: '👁️', answers: ['ušima', 'nosom', 'očima', 'rukama'], correctIndex: 2 },
        { type: 'choice', question: 'Čime čujemo?', visual: '👂', answers: ['očima', 'ušima', 'nosom', 'ustima'], correctIndex: 1 },
        { type: 'choice', question: 'Koliko prstiju na jednoj ruci?', visual: '✋', answers: ['3', '4', '5', '10'], correctIndex: 2 },
        { type: 'choice', question: 'Čime osjećamo mirise?', visual: '👃', answers: ['očima', 'ušima', 'nosom', 'ustima'], correctIndex: 2 },
        { type: 'choice', question: 'Koliko nogu ima čovjek?', visual: '🦵🦵', answers: ['1', '2', '3', '4'], correctIndex: 1 },
        { type: 'choice', question: 'Osjetilo okusa?', answers: ['oči', 'uši', 'nos', 'jezik'], correctIndex: 3 },
        { type: 'choice', question: 'Koliko osjetila ima čovjek?', answers: ['3', '4', '5', '6'], correctIndex: 2, hint: 'Vid, sluh, njuh, okus, opip' },
        { type: 'choice', question: 'Koliko prstiju ukupno na rukama?', answers: ['5', '8', '10', '20'], correctIndex: 2 },
        { type: 'choice', question: 'Čime osjećamo hladno/toplo?', answers: ['očima', 'ušima', 'kožom', 'nosom'], correctIndex: 2 },
      ]
    },
    {
      topic: { name: 'Obitelj i dom', slug: 'obitelj', icon: '👨‍👩‍👧', order: 4 },
      questions: [
        { type: 'choice', question: 'Tko je majčin muž?', visual: '👨‍👩‍👧', answers: ['djed', 'brat', 'otac', 'ujak'], correctIndex: 2 },
        { type: 'choice', question: 'Tko je očeva majka?', answers: ['mama', 'teta', 'sestra', 'baka'], correctIndex: 3 },
        { type: 'choice', question: 'Tko je majčin brat?', answers: ['otac', 'djed', 'ujak', 'brat'], correctIndex: 2 },
        { type: 'choice', question: 'Gdje živimo?', visual: '🏠', answers: ['u školi', 'u dućanu', 'kod kuće', 'u parku'], correctIndex: 2 },
        { type: 'choice', question: 'Gdje učimo?', visual: '🏫', answers: ['bolnica', 'škola', 'vrtić', 'dućan'], correctIndex: 1 },
        { type: 'choice', question: 'Tko nas uči u školi?', visual: '👩‍🏫', answers: ['doktor', 'učiteljica', 'vatrogasac', 'policajac'], correctIndex: 1 },
        { type: 'choice', question: 'Što je obitelj?', answers: ['prijatelji', 'susjedi', 'mama, tata i djeca', 'učenici'], correctIndex: 2 },
        { type: 'choice', question: 'Tko je očev otac?', answers: ['baka', 'ujak', 'djed', 'stric'], correctIndex: 2 },
        { type: 'choice', question: 'Tko nas liječi?', visual: '🏥', answers: ['učiteljica', 'vatrogasac', 'liječnik', 'policajac'], correctIndex: 2 },
        { type: 'choice', question: 'Pozdrav kad dođemo u školu?', answers: ['Doviđenja!', 'Laku noć!', 'Dobar dan!', 'Zbogom!'], correctIndex: 2 },
      ]
    }
  ]
};


// ============================================================
//  SEED FUNKCIJA
// ============================================================
async function seed() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    console.log(`✅ Spojen na MongoDB: ${db.databaseName}`);

    // Obriši postojeće za ovaj razred
    console.log(`\n🗑️  Brišem podatke za ${GRADE}. razred...`);
    await db.collection('questions').deleteMany({ grade: GRADE });
    await db.collection('topics').deleteMany({ grade: GRADE });
    await db.collection('subjects').deleteMany({ grade: GRADE });

    console.log(`📝 Seedam ${GRADE}. razred...\n`);
    let totalQuestions = 0;

    for (const subjectData of subjects) {
      // Umetni predmet
      const subjectDoc = { ...subjectData, grade: GRADE, createdAt: new Date() };
      const subjectResult = await db.collection('subjects').insertOne(subjectDoc);
      const subjectId = subjectResult.insertedId;
      console.log(`  📚 ${subjectData.icon} ${subjectData.name} (ID: ${subjectId})`);

      const subjectTopics = topicsAndQuestions[subjectData.slug];
      if (!subjectTopics) continue;

      for (const topicData of subjectTopics) {
        // Umetni temu
        const topicDoc = {
          ...topicData.topic,
          subject_id: subjectId,
          grade: GRADE,
          isActive: true,
          createdAt: new Date()
        };
        const topicResult = await db.collection('topics').insertOne(topicDoc);
        const topicId = topicResult.insertedId;

        // Umetni pitanja
        const questionDocs = topicData.questions.map(q => ({
          ...q,
          topic_id: topicId,
          subject_id: subjectId,
          grade: GRADE,
          difficulty: q.difficulty || 1,
          isActive: true,
          visual: q.visual || '',
          hint: q.hint || '',
          answers: q.answers || [],
          correctAnswer: q.correctAnswer || '',
          placeholder: q.placeholder || 'Upiši odgovor...',
          createdAt: new Date()
        }));

        if (questionDocs.length > 0) {
          await db.collection('questions').insertMany(questionDocs);
        }
        totalQuestions += questionDocs.length;

        console.log(`    📎 ${topicData.topic.icon} ${topicData.topic.name}: ${questionDocs.length} pitanja`);
      }
    }

    // Kreiraj indekse
    console.log('\n📊 Kreiram indekse...');
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    await db.collection('subjects').createIndex({ slug: 1, grade: 1 }, { unique: true });
    await db.collection('subjects').createIndex({ grade: 1, order: 1 });
    await db.collection('topics').createIndex({ subject_id: 1, slug: 1 }, { unique: true });
    await db.collection('topics').createIndex({ grade: 1, subject_id: 1, order: 1 });
    await db.collection('questions').createIndex({ topic_id: 1, isActive: 1 });
    await db.collection('questions').createIndex({ subject_id: 1, grade: 1 });
    await db.collection('progress').createIndex({ user_id: 1, topic_id: 1 });
    await db.collection('progress').createIndex({ user_id: 1, completedAt: -1 });

    console.log(`\n✅ SEED ZAVRŠEN!`);
    console.log(`   Razred: ${GRADE}`);
    console.log(`   Predmeta: ${subjects.length}`);
    console.log(`   Ukupno pitanja: ${totalQuestions}`);
    console.log('');

    // Statistika
    for (const s of subjects) {
      const count = await db.collection('questions').countDocuments({ grade: GRADE, subject_id: (await db.collection('subjects').findOne({ slug: s.slug, grade: GRADE }))._id });
      console.log(`   ${s.icon} ${s.name}: ${count} pitanja`);
    }

  } catch (err) {
    console.error('❌ Greška:', err);
  } finally {
    await client.close();
    process.exit(0);
  }
}

seed();
