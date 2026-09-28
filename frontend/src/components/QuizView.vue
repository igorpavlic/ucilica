<template>
  <div class="shell">
    <router-link
      :to="{ name: 'topics', params: { slug: $route.query.subjectSlug || 'unknown' }, query: { name: $route.query.subjectName, icon: '' } }"
      class="back-link"
    >← Natrag na teme</router-link>

    <div v-if="loadingQuiz" class="loading-overlay">
      <div class="spinner"></div>
      <div class="loading-text">Pripremam pitanja...</div>
    </div>

    <div v-else-if="questions.length" class="quiz-container">
      <div class="progress-row">
        <span>{{ $route.query.topicIcon }} {{ $route.query.topicName }}</span>
        <span>{{ currentQ + 1 }} / {{ questions.length }}</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: ((currentQ + 1) / questions.length * 100) + '%' }"></div>
      </div>

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

        <!-- Spajanje parova: klik lijevo pa klik desno. Bez povlačenja —
             na dodirnicima je pouzdanije, a mlađem djetetu lakše. -->
        <div v-if="questions[currentQ].type === 'match'" class="match-wrap">
          <div class="match-cols">
            <div class="match-col">
              <button
                v-for="l in questions[currentQ].lijevo"
                :key="'l' + l.id"
                class="match-item"
                :class="{
                  selected: odabranLijevi === l.id,
                  linked: veze[l.id] !== undefined,
                  ok: answered && vezaTocna(l.id),
                  no: answered && veze[l.id] !== undefined && !vezaTocna(l.id)
                }"
                :disabled="answered"
                @click="veze[l.id] !== undefined && !answered ? razvezi(l.id) : odaberiLijevi(l.id)"
              >
                <span class="match-tekst">{{ l.tekst }}</span>
                <span v-if="veze[l.id] !== undefined" class="match-veza">{{ oznakaVeze(l.id) }}</span>
              </button>
            </div>

            <div class="match-col">
              <button
                v-for="(d, di) in questions[currentQ].desno"
                :key="'d' + d.id"
                class="match-item"
                :class="{ linked: vezanDesni(d.id), dim: odabranLijevi !== null && vezanDesni(d.id) }"
                :disabled="answered"
                @click="spoji(d.id)"
              >
                <span v-if="vezanDesni(d.id)" class="match-veza">{{ oznakaDesnog(d.id) }}</span>
                <span class="match-tekst">{{ d.tekst }}</span>
              </button>
            </div>
          </div>

          <p v-if="!answered" class="match-uputa">
            {{ odabranLijevi === null ? 'Klikni riječ lijevo, pa njezin par desno.' : 'Sada klikni par desno.' }}
          </p>

          <button
            v-if="!answered"
            class="btn-check match-check"
            :disabled="!sveSpojeno"
            @click="handleMatch"
          >{{ sveSpojeno ? 'Provjeri' : `Spoji još ${preostaloVeza}` }}</button>
        </div>

        <div v-if="questions[currentQ].type === 'input'" class="input-group">
          <input
            v-model="inputAnswer"
            class="form-input"
            :class="{ correct: answered && isCorrect, wrong: answered && !isCorrect }"
            :disabled="answered"
            :placeholder="questions[currentQ].placeholder || 'Upiši odgovor...'"
            @keyup.enter="handleInput"
          >
          <button v-if="!answered" class="btn-check" @click="handleInput">Provjeri</button>
        </div>
      </div>

      <div v-if="answered" class="feedback-bar" :class="isCorrect ? 'correct' : 'wrong'">
        <span>{{ isCorrect ? '✓' : '✗' }}</span>
        <span v-if="isCorrect">{{ correctMessages[Math.floor(Math.random() * correctMessages.length)] }}</span>
        <span v-else-if="questions[currentQ].type === 'match'">
          Točno spojeno {{ tocnihVeza }} od {{ questions[currentQ].lijevo.length }}. {{ correctAnswerText }}
        </span>
        <span v-else>Točan odgovor: {{ correctAnswerText }}</span>
      </div>

      <button v-if="answered" class="btn-next" @click="nextQuestion">
        {{ hasNextQuestion() ? 'Sljedeće pitanje →' : 'Pogledaj rezultat 🏆' }}
      </button>
    </div>

    <div v-else-if="exhausted" class="quiz-container">
      <div class="question-card" style="text-align:center">
        <div class="question-visual">🔄</div>
        <div class="question-text">{{ exhaustedMsg }}</div>
        <p style="color:var(--text-tertiary);margin-top:12px;font-size:0.95rem">
          Odigraj druge teme pa se vrati ovdje za nova pitanja.
        </p>
        <button class="btn btn-primary mt-lg" @click="$router.back()">← Odaberi drugu temu</button>
      </div>
    </div>

    <div v-else class="loading-overlay">
      <div class="loading-text">Nema pitanja za ovu temu.</div>
      <button class="btn btn-secondary mt-md" @click="$router.back()">← Natrag</button>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuth } from '../composables/useAuth'
import { useQuizStore } from '../stores/quiz'
import { useGovor } from '../composables/useGovor'

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
  currentQ,
  selectedIdx,
  answered,
  isCorrect,
  correctIdx,
  correctAnswerText,
  inputAnswer,
  veze,
  odabranLijevi,
  tocnihVeza,
  correctCount
} = storeToRefs(quizStore)

// Čitanje pitanja naglas — za 1. razred, gdje dijete još ne čita tečno.
const { dostupno: govorDostupan, govoriSe, reci, prekini } = useGovor()

function procitajPitanje () {
  if (govoriSe.value) { prekini(); return }
  const q = questions.value?.[currentQ.value]
  if (!q) return
  // Uz tekst pitanja čitaju se i ponuđeni odgovori — inače dijete čuje
  // zadatak, ali ne i iz čega bira.
  const dijelovi = [q.question]
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
  odaberiLijevi,
  spoji,
  razvezi,
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

// ── spajanje parova ──────────────────────────────────────────────
const brojVeza = computed(() => Object.keys(veze.value).length)
const ukupnoParova = computed(() => questions.value[currentQ.value]?.lijevo?.length || 0)
const sveSpojeno = computed(() => ukupnoParova.value > 0 && brojVeza.value === ukupnoParova.value)
const preostaloVeza = computed(() => ukupnoParova.value - brojVeza.value)

/** Brojčana oznaka veze — dijete vidi što je s čim spojeno bez crtanja linija */
const redosljedVeza = computed(() => {
  const m = {}
  Object.keys(veze.value).forEach((l, i) => { m[l] = i + 1 })
  return m
})
const oznakaVeze = (lijeviId) => redosljedVeza.value[lijeviId]
const vezanDesni = (desniId) => Object.values(veze.value).includes(desniId)
const oznakaDesnog = (desniId) => {
  const l = Object.keys(veze.value).find(k => veze.value[k] === desniId)
  return l === undefined ? '' : redosljedVeza.value[l]
}
/** Nakon provjere: je li baš ta veza bila točna (lijevi id === desni id) */
const vezaTocna = (lijeviId) => String(veze.value[lijeviId]) === String(lijeviId)

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

  if (isLoggedIn.value) {
    try {
      const data = await submitQuiz(props.topicId)
      updateUser({
        totalScore: data.user.totalScore,
        streak: data.user.streak
      })
    } catch (error) {
      emit('error', error.message)
      return
    }
  }

  router.push({
    name: 'results',
    query: {
      correct: correctCount.value,
      total: questions.value.length,
      topicId: props.topicId,
      topicName: route.query.topicName,
      topicIcon: route.query.topicIcon,
      subjectSlug: route.query.subjectSlug,
      subjectName: route.query.subjectName
    }
  })
}
</script>
