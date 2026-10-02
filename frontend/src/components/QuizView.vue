<template>
  <div class="shell kviz-shell">
    <div v-if="loadingQuiz" class="loading-overlay">
      <div class="spinner"></div>
      <div class="loading-text">Pripremam pitanja...</div>
    </div>

    <div v-else-if="questions.length" ref="kontejner" class="quiz-container" :class="{ 'ima-plocu': answered }">
      <!-- Način bez ometanja (kao Duolingo): umjesto gornje trake samo izlaz, napredak i brojač -->
      <div class="kviz-zaglavlje">
        <router-link :to="natragRuta" class="kviz-zatvori" aria-label="Izađi iz kviza" title="Izađi iz kviza">✕</router-link>
        <div class="progress-track" role="progressbar" :aria-valuenow="currentQ + 1" aria-valuemin="1" :aria-valuemax="questions.length">
          <div class="progress-fill" :style="{ width: ((currentQ + 1) / questions.length * 100) + '%' }"></div>
        </div>
        <span class="kviz-brojac">{{ currentQ + 1 }}/{{ questions.length }}</span>
      </div>
      <p class="kviz-tema">{{ $route.query.topicIcon }} {{ $route.query.topicName }}</p>
      <p v-if="opseg" class="scope-note">{{ opisOpsega }}</p>

      <div class="question-card" :key="currentQ">
        <!--
          Vizual se razlaže na pojedinačne znakove: u flex spremniku je
          neprekinuti tekst JEDAN element, pa se flex-wrap nikad ne primijeni
          i niz emojija isteče izvan kartice. Svaki znak = vlastiti span.
          Kod brojanja se grupira po 5 — dijete tako pouzdano prebrojava.
        -->
        <div
          v-if="questions[currentQ].visual"
          class="question-visual"
          :class="{ 'is-counting': visualGroups.length > 1 }"
        >
          <template v-if="visualGroups.length > 1">
            <span v-for="(grupa, gi) in visualGroups" :key="gi" class="visual-group">
              <span v-for="(znak, zi) in grupa" :key="zi" class="visual-item">{{ znak }}</span>
            </span>
          </template>
          <template v-else>
            <span v-for="(znak, i) in visualChars" :key="i" class="visual-item">{{ znak }}</span>
          </template>
        </div>

        <!-- Mreža (robot i put): svako polje je ćelija, pa se redovi ne lome. -->
        <div v-if="questions[currentQ].mreza?.length" class="quiz-mreza" role="img" aria-label="Mreža polja s robotom">
          <div v-for="(red, ri) in questions[currentQ].mreza" :key="ri" class="quiz-mreza-red">
            <span v-for="(polje, pi) in red" :key="pi" class="quiz-mreza-polje">{{ polje }}</span>
          </div>
        </div>

        <p v-if="questions[currentQ].passage" class="reading-passage">{{ questions[currentQ].passage }}</p>
        <div v-if="questions[currentQ].chart?.length" class="quiz-chart" role="img" aria-label="Stupčasti grafikon s vrijednostima">
          <div v-for="row in questions[currentQ].chart" :key="row.label" class="quiz-chart-row">
            <span>{{ row.label }}</span>
            <div class="quiz-chart-track"><div class="quiz-chart-fill" :style="{ width: `${row.value / Math.max(...questions[currentQ].chart.map(r => r.value)) * 100}%` }"></div></div>
            <strong>{{ row.value }}</strong>
          </div>
        </div>

        <div class="question-row">
          <div class="question-text">{{ questions[currentQ].question }}</div>
          <!--
            Gumb za slušanje. Prikazuje se samo ako preglednik ima hrvatski
            glas — radije ništa nego zadatak pročitan engleskim glasom.
          -->
          <button
            v-if="govorDostupan"
            class="btn-slusaj"
            :class="{ govori: govoriSe }"
            type="button"
            :aria-label="govoriSe ? 'Zaustavi čitanje' : 'Pročitaj pitanje naglas'"
            :title="govoriSe ? 'Zaustavi čitanje' : 'Pročitaj pitanje naglas'"
            @click="procitajPitanje"
          >{{ govoriSe ? '⏹' : '🔊' }}</button>
        </div>

        <div v-if="questions[currentQ].hint" class="question-hint">
          {{ questions[currentQ].hint }}
        </div>

        <div v-if="questions[currentQ].type === 'choice'" class="answers-grid">
          <button
            v-for="(ans, i) in questions[currentQ].answers"
            :key="i"
            class="answer-btn"
            :class="{
              correct: answered && i === correctIdx,
              wrong: answered && selectedIdx === i && i !== correctIdx,
              disabled: answered
            }"
            @click="handleChoice(i)"
          >{{ ans }}</button>
        </div>

        <SpajanjeParova
          v-if="questions[currentQ].type === 'match'"
          :key="questions[currentQ]._id"
          :pitanje="questions[currentQ]"
          :provjeravam="provjeravam"
          @provjeri="handleMatch"
        />

        <div v-if="questions[currentQ].type === 'input'" class="input-group">
          <input
            v-model="inputAnswer"
            class="form-input"
            :class="{ correct: answered && isCorrect, wrong: answered && !isCorrect }"
            :disabled="answered"
            :placeholder="questions[currentQ].placeholder || 'Upiši odgovor...'"
            @keyup.enter="handleInput"
          >
          <button v-if="!answered" class="btn-check" :disabled="provjeravam" @click="handleInput">Provjeri</button>
        </div>

        <!-- Na pitanje („Smiješ li…?”) Da/Ne, na tvrdnju Točno/Netočno -->
        <div v-if="questions[currentQ].type === 'true-false'" class="answers-grid">
          <button v-for="(option, oi) in [true, false]" :key="String(option)" class="answer-btn"
            :class="{
              correct: answered && option === tocnaTF,
              wrong: answered && odabraniTF === option && option !== tocnaTF,
              disabled: answered
            }"
            :disabled="answered || provjeravam" @click="odaberiTF(option)">{{ oznakeDaNe(questions[currentQ].question)[oi] }}</button>
        </div>

        <template v-if="questions[currentQ].type === 'ordering'">
          <PoredajPovlacenjem :stavke="redoslijed" :onemoguceno="answered" @premjesti="premjestiStavku" />
          <button v-if="!answered" class="btn-check ordering-check" @click="handleStructured([...redoslijed])">Provjeri redoslijed</button>
        </template>

        <div class="prijava-red">
          <PrijaviPitanje :key="questions[currentQ]._id" :pitanje="questions[currentQ]" />
        </div>
      </div>

      <!-- Povratna ploča: izlazi s dna ekrana, pa objašnjenje i „Sljedeće” ne traže skrolanje -->
      <div v-if="answered" ref="ploca" class="povratna-ploca" :class="isCorrect ? 'tocno' : 'netocno'">
        <div class="povratna-unutra">
      <div v-if="objasnjenje" class="explanation-card">
        <strong>Zašto?</strong> {{ objasnjenje }}
        <button v-if="govorDostupan" type="button" class="btn-slusaj" aria-label="Pročitaj objašnjenje naglas" @click="reci(objasnjenje)">🔊</button>
      </div>

      <div class="feedback-bar" :class="isCorrect ? 'correct' : 'wrong'">
        <span>{{ isCorrect ? '✓' : '✗' }}</span>
        <span v-if="isCorrect">{{ correctMessages[Math.floor(Math.random() * correctMessages.length)] }}</span>
        <span v-else-if="questions[currentQ].type === 'match'">
          Točno spojeno {{ tocnihVeza }} od {{ questions[currentQ].lijevo.length }}. {{ correctAnswerText }}
        </span>
        <span v-else>Točan odgovor: {{ correctAnswerText }}</span>
      </div>

      <button class="btn-next" @click="nextQuestion">
        {{ hasNextQuestion() ? 'Sljedeće pitanje →' : 'Pogledaj rezultat 🏆' }}
      </button>
        </div>
      </div>
    </div>

    <div v-else-if="exhausted" class="quiz-container">
      <div class="question-card" style="text-align:center">
        <div class="question-visual">{{ jeDnevni(props.topicId) ? '⭐' : '🔄' }}</div>
        <div class="question-text">{{ exhaustedMsg }}</div>
        <p v-if="!jeDnevni(props.topicId)" style="color:var(--text-tertiary);margin-top:12px;font-size:0.95rem">
          Odigraj druge teme pa se vrati ovdje za nova pitanja.
        </p>
        <button class="btn btn-primary mt-lg" @click="$router.back()">{{ jeDnevni(props.topicId) ? '← Natrag na početnu' : '← Odaberi drugu temu' }}</button>
      </div>
    </div>

    <div v-else class="loading-overlay">
      <div class="loading-text">Nema pitanja za ovu temu.</div>
      <button class="btn btn-secondary mt-md" @click="$router.back()">← Natrag</button>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuth } from '../composables/useAuth'
import { useQuizStore } from '../stores/quiz'
import { jeMijesano, jeDnevni, razredIz } from '../composables/mijesano'
import { useGovor } from '../composables/useGovor'
import { oznakeDaNe } from '../composables/daNe'
import SpajanjeParova from './SpajanjeParova.vue'
import PoredajPovlacenjem from './PoredajPovlacenjem.vue'
import PrijaviPitanje from './PrijaviPitanje.vue'

const props = defineProps({ topicId: String })
const emit = defineEmits(['error'])
const router = useRouter()
const route = useRoute()
const { isLoggedIn, addGuestScore, updateUser } = useAuth()
const triggerStars = inject('triggerStars')
const quizStore = useQuizStore()

const {
  questions,
  loadingQuiz,
  exhausted,
  exhaustedMsg,
  opseg,
  currentQ,
  selectedIdx,
  answered,
  isCorrect,
  correctIdx,
  correctAnswerText,
  objasnjenje,
  redoslijed,
  inputAnswer,
  tocnihVeza,
  provjeravam,
  correctCount
} = storeToRefs(quizStore)

// Kamo vodi ✕: miješano ponavljanje i dnevni izazov → početna, tema → popis tema predmeta
const natragRuta = computed(() => jeMijesano(props.topicId)
  ? { path: '/home', query: { grade: razredIz(props.topicId) } }
  : { name: 'topics', params: { slug: route.query.subjectSlug || 'unknown' }, query: { name: route.query.subjectName, icon: '', grade: route.query.grade } })

// Visina povratne ploče → donji razmak sadržaja, da ploča ništa ne prekrije
const kontejner = ref(null)
const ploca = ref(null)
let promatracPloce = null
watch(ploca, (el) => {
  promatracPloce?.disconnect()
  if (!el || typeof ResizeObserver === 'undefined') return
  promatracPloce = new ResizeObserver(() => {
    kontejner.value?.style.setProperty('--ploca-h', `${el.offsetHeight}px`)
  })
  promatracPloce.observe(el)
})
// Novo pitanje počinje na vrhu ekrana
watch(currentQ, () => window.scrollTo(0, 0))

const opisOpsega = computed(() => {
  const o = opseg.value
  if (!o) return ''
  if (o.nacin === 'oznaceno') return `Ponavljanje iz ${o.brojTema} označenih obrađenih tema.`
  if (o.nacin === 'vjezbano') return `Ponavljanje iz ${o.brojTema} tema koje su već vježbane.`
  return 'Ponavljanje iz cijeloga razreda — obrađeno gradivo nije označeno, pa se mogu pojaviti i teme koje još niste učili.'
})

// Čitanje pitanja naglas — za 1. razred, gdje dijete još ne čita tečno.
const { dostupno: govorDostupan, govoriSe, reci, prekini } = useGovor()

function procitajPitanje () {
  if (govoriSe.value) { prekini(); return }
  const q = questions.value?.[currentQ.value]
  if (!q) return
  // Uz tekst pitanja čitaju se i ponuđeni odgovori — inače dijete čuje
  // zadatak, ali ne i iz čega bira.
  const dijelovi = [q.passage, q.question].filter(Boolean)
  if (q.type === 'choice' && Array.isArray(q.answers)) {
    dijelovi.push(q.answers.map((a, i) => `${i + 1}. ${a}`).join('. '))
  }
  reci(dijelovi.join('. '))
}

const {
  loadQuiz,
  checkChoice,
  checkInput,
  checkMatch,
  checkStructured,
  premjestiStavku,
  advanceQuestion,
  hasNextQuestion,
  submitQuiz,
  resetSession
} = quizStore

/**
 * Razlaganje vizuala na pojedinačne znakove (grapheme clusters).
 * Intl.Segmenter drži emoji sa spojnicama i modifikatorima na okupu
 * (npr. 👨‍👩‍👧 je jedan znak, ne tri).
 */
const segmenter = typeof Intl !== 'undefined' && Intl.Segmenter
  ? new Intl.Segmenter('hr', { granularity: 'grapheme' })
  : null

function razloziZnakove (tekst) {
  if (!tekst) return []
  const sirovi = segmenter
    ? [...segmenter.segment(tekst)].map(s => s.segment)
    : [...tekst]
  return sirovi.filter(z => z.trim().length > 0)
}

const visualChars = computed(() => razloziZnakove(questions.value[currentQ.value]?.visual))

/**
 * Za zadatke prebrojavanja (6+ jednakih znakova) grupiraj po 5.
 * Dijete tada ne broji jedan po jedan nego prepoznaje skupine.
 */
const visualGroups = computed(() => {
  const znakovi = visualChars.value
  if (znakovi.length < 6) return []
  const jedinstveni = new Set(znakovi)
  if (jedinstveni.size > 1) return []
  const grupe = []
  for (let i = 0; i < znakovi.length; i += 5) grupe.push(znakovi.slice(i, i + 5))
  return grupe
})

// ── točno/netočno: koji je gumb odabran i koji je točan ──────────
const odabraniTF = ref(null)
const tocnaTF = computed(() => ['Točno', 'Da'].includes(correctAnswerText.value))
watch(currentQ, () => { odabraniTF.value = null })
function odaberiTF (option) {
  odabraniTF.value = option
  handleStructured(option)
}

async function handleMatch () {
  try {
    const result = await checkMatch()
    if (result?.isCorrect) {
      if (!isLoggedIn.value) addGuestScore(10)
      triggerStars?.()
    }
  } catch (error) {
    emit('error', error.message)
  }
}

async function handleStructured (answer) {
  try {
    const result = await checkStructured(answer)
    if (result?.isCorrect) {
      if (!isLoggedIn.value) addGuestScore(10)
      triggerStars?.()
    }
  } catch (error) {
    emit('error', error.message)
  }
}

const correctMessages = [
  'Bravo! Odlično! 🌟',
  'Super! Točno! 🎉',
  'Svaka čast! 💪',
  'Fantastično! 🏆',
  'Izvrsno! 🚀',
  'Ti si zvijezda! ⭐'
]

onMounted(async () => {
  try {
    await loadQuiz(props.topicId, 7)
  } catch (error) {
    emit('error', error.message)
  }
})

onUnmounted(() => {
  promatracPloce?.disconnect()
  resetSession()
})

async function handleChoice(index) {
  try {
    const result = await checkChoice(index)
    if (result?.isCorrect) {
      if (isLoggedIn.value) {
        triggerStars?.()
      } else {
        addGuestScore(10)
        triggerStars?.()
      }
    }
  } catch (error) {
    emit('error', error.message)
  }
}

async function handleInput() {
  try {
    const result = await checkInput()
    if (result?.isCorrect) {
      if (isLoggedIn.value) {
        triggerStars?.()
      } else {
        addGuestScore(10)
        triggerStars?.()
      }
    }
  } catch (error) {
    emit('error', error.message)
  }
}

async function nextQuestion() {
  if (hasNextQuestion()) {
    advanceQuestion()
    return
  }

  // Rezultat prikazuje server (prvi pokušaji, cijela sesija); gost vidi lokalni zbroj.
  let correct = correctCount.value
  let total = questions.value.length
  let niz = null
  if (isLoggedIn.value) {
    try {
      const data = await submitQuiz(props.topicId)
      updateUser({
        totalScore: data.user.totalScore,
        streak: data.user.streak
      })
      correct = data.progress?.correctAnswers ?? correct
      total = data.progress?.totalQuestions ?? total
      niz = data.dnevni?.niz ?? null
    } catch (error) {
      emit('error', error.message)
      return
    }
  }

  router.push({
    name: 'results',
    query: {
      correct,
      total,
      grade: jeMijesano(props.topicId) ? razredIz(props.topicId) : route.query.grade,
      ...(niz != null ? { niz } : {}),
      topicId: props.topicId,
      topicName: route.query.topicName,
      topicIcon: route.query.topicIcon,
      subjectSlug: route.query.subjectSlug,
      subjectName: route.query.subjectName
    }
  })
}
</script>
