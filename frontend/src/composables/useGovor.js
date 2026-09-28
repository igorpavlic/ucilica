/**
 * useGovor.js — čitanje pitanja naglas (Web Speech API)
 *
 * Zašto: dijete u 1. razredu često još ne čita tečno. Zadatak koji ne može
 * pročitati ne mjeri znanje iz matematike nego brzinu čitanja. Gumb za
 * slušanje uklanja tu prepreku, a starijem djetetu ne smeta jer ga ne mora
 * dirati.
 *
 * Zašto baš Web Speech API, a ne knjižnica:
 *   - Ne dodaje nijedan bajt u paket i ugrađen je u preglednik.
 *   - Android i ChromeOS (dakle školski tableti) imaju ugrađen hrvatski glas
 *     koji radi BEZ interneta (Google hr-hr-x-hra / hr-hr-x-hrb).
 *   - Windows ima Microsoft Matej, macOS i iOS glas Lana.
 *   - Provjereno u istraživanju: Piper, Coqui i Mimic3 nemaju hrvatski glas,
 *     a eSpeak NG ga ima, ali zvuči robotski i pod GPL-3.0 je.
 *
 * Gdje hrvatskoga glasa nema (npr. Chrome na stolnom Linuxu), gumb se
 * jednostavno ne prikazuje — radije ništa nego čitanje engleskim glasom,
 * koje bi dijete zbunilo.
 */
import { ref, onMounted, onUnmounted } from 'vue'

/** Postoji li API uopće */
const podrzano = typeof window !== 'undefined' && 'speechSynthesis' in window

export function useGovor () {
  const glas = ref(null)          // odabrani hrvatski glas
  const govoriSe = ref(false)
  const dostupno = ref(false)

  /**
   * Odaberi najbolji hrvatski glas.
   * Prednost ima glas koji radi bez interneta (`localService`) — u školi
   * mreža zna biti loša, a glas koji se učitava preko mreže tada zastane.
   */
  function odaberiGlas () {
    if (!podrzano) return
    const svi = window.speechSynthesis.getVoices() || []
    const hrvatski = svi.filter(v => /^hr(-|_|$)/i.test(v.lang || ''))
    if (!hrvatski.length) { dostupno.value = false; return }
    glas.value = hrvatski.find(v => v.localService) || hrvatski[0]
    dostupno.value = true
  }

  // getVoices() je asinkron: prvi poziv zna vratiti prazan niz dok
  // preglednik ne učita popis glasova.
  function nasluhu () { odaberiGlas() }

  onMounted(() => {
    if (!podrzano) return
    odaberiGlas()
    window.speechSynthesis.addEventListener('voiceschanged', nasluhu)
  })

  onUnmounted(() => {
    if (!podrzano) return
    window.speechSynthesis.removeEventListener('voiceschanged', nasluhu)
    window.speechSynthesis.cancel()
  })

  /**
   * Pročitaj tekst. Drugi poziv prekida prvi — dijete koje dvaput pritisne
   * gumb ne sluša dva glasa odjednom.
   *
   * Brzina je namjerno ispod uobičajene: 0,85 je tempo kojim učiteljica
   * čita zadatak razredu.
   */
  function reci (tekst, { brzina = 0.85 } = {}) {
    if (!podrzano || !dostupno.value || !tekst) return
    window.speechSynthesis.cancel()

    const izgovor = new SpeechSynthesisUtterance(pripremi(tekst))
    izgovor.voice = glas.value
    izgovor.lang = glas.value?.lang || 'hr-HR'
    izgovor.rate = brzina
    izgovor.pitch = 1
    izgovor.onstart = () => { govoriSe.value = true }
    izgovor.onend = () => { govoriSe.value = false }
    izgovor.onerror = () => { govoriSe.value = false }

    window.speechSynthesis.speak(izgovor)
  }

  function prekini () {
    if (!podrzano) return
    window.speechSynthesis.cancel()
    govoriSe.value = false
  }

  return { dostupno, govoriSe, reci, prekini }
}

/**
 * Priprema teksta za izgovor.
 *
 * Sintetizator čita znakove doslovno, pa bi "3 + 4 = ?" izgovorio kao
 * "tri plus četiri jednako upitnik". Zato se znakovi zamjenjuju riječima,
 * a crta za prazno mjesto postaje kratka stanka.
 */
function pripremi (tekst) {
  return String(tekst)
    .replace(/_{2,}/g, ' … ')              // prazno mjesto → stanka
    .replace(/\s*\+\s*/g, ' plus ')
    .replace(/\s+[−–—-]\s+/g, ' minus ')   // samo samostalna crta, ne spojnica
    .replace(/\s*×\s*/g, ' puta ')
    .replace(/\s*÷\s*/g, ' podijeljeno s ')
    .replace(/\s*=\s*/g, ' jednako ')
    .replace(/\s*<\s*/g, ' je manje od ')
    .replace(/\s*>\s*/g, ' je veće od ')
    .replace(/\s*○\s*/g, ' kružić ')
    .replace(/\s*€/g, ' eura')
    .replace(/(\d)\s*°/g, '$1 stupnjeva')
    .replace(/„|"|"/g, '')                 // navodnici se ne izgovaraju
    .replace(/\s{2,}/g, ' ')
    .trim()
}
