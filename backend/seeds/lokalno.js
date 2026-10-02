/**
 * lokalno.js — pitanja ostaju u svijetu koji dijete od 6 do 10 godina poznaje.
 *
 * Mjerilo je logičko: što dijete zna iz slikovnica, crtića, bajki, zoološkog
 * vrta i svakodnevice? Zato su DOPUŠTENI:
 *   - strane životinje i biljke (slon, žirafa, klokan, pingvin, kaktus, banana…);
 *   - bajke i dječja književnost (Crvenkapica, Pepeljuga, Pinokio, Mali princ…);
 *   - pojmovi iz dječje kulture (Indijanci, kauboji, piramide, pustinja, Afrika).
 *
 * Isključuju se samo pojmovi koje dijete te dobi ne može znati ni zamisliti, a
 * koji pitanje vežu uz drugu zemlju umjesto uz Hrvatsku:
 *   - daleke države i strani gradovi (Novi Zeland, Kanada, New York, Graz…);
 *   - strane valute (u zadatcima s novcem računa se u eurima);
 *   - nemetričke mjere (inč, milja, galon, Fahrenheit).
 *
 * Pregled (pedagogyReview) takva pitanja izbacuje, test ih prijavljuje, a pri
 * pokretanju servera isključuju se iz postojeće baze (services/obitelji.js).
 */

const STRANO = new RegExp([
  // daleke države koje dijete ne zna smjestiti
  'novi zeland\\w*', 'novog zelanda', 'kanad\\w*', 'argentin\\w*', 'urugvaj\\w*', 'paragvaj\\w*', 'kolumbij\\w*', 'venezuel\\w*',
  'norveš\\w*', 'švedsk\\w*', 'finsk\\w*', 'nizozem\\w*', 'belgij\\w*', 'luksemburg\\w*', 'portugal\\w*', 'rumunjsk\\w*', 'kazahstan\\w*', 'mongolij\\w*',
  // strani gradovi
  'new york\\w*', 'london\\w*', 'graz\\w*', 'berlin\\w*', 'madrid\\w*', 'moskv\\w*', 'tokij\\w*', 'tokio', 'peking\\w*', 'sydney\\w*', 'toronto\\w*',
  'chicag\\w*', 'los angeles\\w*', 'washington\\w*', 'amsterdam\\w*', 'stockholm\\w*', 'oslo',
  // strane valute
  'dolar\\w*', 'funt[aeiu]', 'funti', 'jena', 'jenu', 'rupij\\w*', 'franak', 'franaka', 'franka',
  // nemetričke mjere
  'inč\\w*', 'milj[aeiu]', 'milja', 'galon\\w*', 'unc[aeiu]', 'jard\\w*', 'fahrenheit\\w*',
].map((r) => `(?<![\\p{L}])${r}(?![\\p{L}])`).join('|'), 'iu');

// Gradivo koje izravno govori o drugim zemljama i smije ih spomenuti.
const DOPUSTENO = {
  genHrvatskaDomovina: /^(dolar|kanad|argentin|new york|london|berlin)/i, // Hrvati u svijetu, euro umjesto stare valute
  genCitanje4: /^(graz|new york)/i, // tekst o Tesli: podatak je u tekstu koji dijete čita
};

const tekstPitanja = (q) => [q.question, ...(q.answers || []), q.correctAnswer || '', ...(q.pairs || []).flat(), ...(q.items || [])].join(' | ');

/** Prvi pojam koji dijete ne može znati (ili null), uz iznimke za generator. */
function straniPojam(q, generator = '') {
  const t = tekstPitanja(q);
  const re = new RegExp(STRANO.source, 'giu');
  for (const m of t.matchAll(re)) {
    if (DOPUSTENO[generator]?.test(m[0])) continue;
    return m[0];
  }
  return null;
}

module.exports = { STRANO, DOPUSTENO, straniPojam };
