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
    .replace(/“[^”]*”|"[^"]*"|'[^']*'/g, '"x"')
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

module.exports = { normalizeStem, questionFamilyKey, orderWithoutAdjacentFamilies };
