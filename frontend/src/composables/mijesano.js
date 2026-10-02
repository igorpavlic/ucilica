/**
 * Kvizovi koji nisu vezani uz jednu temu: miješano ponavljanje (`review-2`) i
 * dnevni izazov (`dnevni-2`). Broj iza crtice je razred.
 */
export const jeMijesano = (topicId) => /^(review|dnevni)-\d+$/.test(String(topicId))
export const jeDnevni = (topicId) => String(topicId).startsWith('dnevni-')
export const razredIz = (topicId) => String(topicId).split('-')[1]

// „1 dan, 21 dan” — ostalo „dana” (2 dana, 5 dana, 11 dana).
const PR = new Intl.PluralRules('hr')
export const daniRijecju = (n) => `${n} ${PR.select(n) === 'one' ? 'dan' : 'dana'}`
