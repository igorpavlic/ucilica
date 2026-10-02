/**
 * Oznake za zadatak točno/netočno. Na pitanje („Smiješ li…?”, „Je li…?”)
 * odgovara se s „Da” ili „Ne”; „Točno” i „Netočno” vrijede samo za tvrdnju
 * („Zimi pada snijeg.”). Isto pravilo ima backend (quiz.service.js, oznakeDaNe).
 */
export function oznakeDaNe (pitanje) {
  return /\?\s*$/.test(String(pitanje || '')) ? ['Da', 'Ne'] : ['Točno', 'Netočno']
}
