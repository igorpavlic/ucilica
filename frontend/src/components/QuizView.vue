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
      <!-- Progress -->
      <div class="progress-row">
        <span>{{ $route.query.topicIcon }} {{ $route.query.topicName }}</span>
        <span>{{ currentQ + 1 }} / {{ questions.length }}</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: ((currentQ + 1) / questions.length * 100) + '%' }"></div>
      </div>

      <!-- Question card -->
      <div class="question-card" :key="currentQ">
        <div v-if="questions[currentQ].visual" class="question-visual">
          {{ questions[currentQ].visual }}
        </div>

        <div class="question-text">{{ questions[currentQ].question }}</div>

        <div v-if="questions[currentQ].hint" class="question-hint">
          {{ questions[currentQ].hint }}
        </div>

        <!-- Choice answers -->
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
            @click="checkChoice(i)"
          >{{ ans }}</button>
        </div>

        <!-- Input answer -->
        <div v-if="questions[currentQ].type === 'input'" class="input-group">
          <input
            class="form-input"
            v-model="inputAnswer"
            :class="{ correct: answered && isCorrect, wrong: answered && !isCorrect }"
            :disabled="answered"
            :placeholder="questions[currentQ].placeholder || 'Upiši odgovor...'"
            @keyup.enter="checkInput"
          >
          <button
            v-if="!answered"
            class="btn-check"
            @click="checkInput"
          >Provjeri</button>
        </div>
      </div>

      <!-- Feedback -->
      <div v-if="answered" class="feedback-bar" :class="isCorrect ? 'correct' : 'wrong'">
        <span>{{ isCorrect ? '✓' : '✗' }}</span>
        <span v-if="isCorrect">{{ correctMessages[Math.floor(Math.random() * correctMessages.length)] }}</span>
        <span v-else>Točan odgovor: {{ correctAnswerText }}</span>
      </div>

      <!-- Next button -->
      <button v-if="answered" class="btn-next" @click="nextQuestion">
        {{ currentQ < questions.length - 1 ? 'Sljedeće pitanje →' : 'Pogledaj rezultat 🏆' }}
      </button>
    </div>

    <!-- Exhausted — sva pitanja viđena u zadnjih 10 rundi -->
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
import { ref, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useApi } from '../composables/useApi'
import { useAuth } from '../composables/useAuth'

const props = defineProps({ topicId: String })
const emit = defineEmits(['error', 'stars'])
const router = useRouter()
const route = useRoute()
const { get, post } = useApi()
const { user, isLoggedIn, addGuestScore, updateUser } = useAuth()
const triggerStars = inject('triggerStars')

const questions = ref([])
const loadingQuiz = ref(true)
const exhausted = ref(false)
const exhaustedMsg = ref('')
const currentQ = ref(0)
const selectedIdx = ref(null)
const answered = ref(false)
const isCorrect = ref(false)
const correctIdx = ref(null)
const correctAnswerText = ref('')
const inputAnswer = ref('')
const correctCount = ref(0)
const quizAnswers = ref([])
let questionStartTime = Date.now()

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
    const data = await get(`/quiz/${props.topicId}?count=7`)
    if (data.exhausted) {
      exhausted.value = true
      exhaustedMsg.value = data.message || 'Sva pitanja su odigrana. Vrati se kasnije!'
    } else {
      questions.value = data.questions
    }
    questionStartTime = Date.now()
  } catch (e) {
    emit('error', e.message)
  } finally {
    loadingQuiz.value = false
  }
})

async function checkChoice(idx) {
  if (answered.value) return
  selectedIdx.value = idx
  try {
    const data = await post('/quiz/check', {
      questionId: questions.value[currentQ.value]._id,
      answer: idx
    })
    answered.value = true
    isCorrect.value = data.isCorrect
    correctIdx.value = data.correctIndex
    correctAnswerText.value = data.correctAnswer
    recordAnswer(data.isCorrect, String(idx))
  } catch (e) {
    emit('error', e.message)
  }
}

async function checkInput() {
  if (answered.value || !inputAnswer.value.trim()) return
  try {
    const data = await post('/quiz/check', {
      questionId: questions.value[currentQ.value]._id,
      answer: inputAnswer.value.trim()
    })
    answered.value = true
    isCorrect.value = data.isCorrect
    correctAnswerText.value = data.correctAnswer
    recordAnswer(data.isCorrect, inputAnswer.value.trim())
  } catch (e) {
    emit('error', e.message)
  }
}

function recordAnswer(wasCorrect, userAnswer) {
  const timeTaken = Date.now() - questionStartTime
  quizAnswers.value.push({
    questionId: questions.value[currentQ.value]._id,
    wasCorrect,
    userAnswer,
    timeTaken
  })
  if (wasCorrect) {
    correctCount.value++
    if (isLoggedIn.value) {
      updateUser({ totalScore: (user.value.totalScore || 0) + 10 })
    } else {
      addGuestScore(10)
    }
    triggerStars()
  }
}

async function nextQuestion() {
  if (currentQ.value < questions.value.length - 1) {
    currentQ.value++
    answered.value = false
    selectedIdx.value = null
    isCorrect.value = false
    correctIdx.value = null
    correctAnswerText.value = ''
    inputAnswer.value = ''
    questionStartTime = Date.now()
  } else {
    // Submit results
    if (isLoggedIn.value) {
      try {
        const data = await post('/quiz/submit', {
          topicId: props.topicId,
          answers: quizAnswers.value
        })
        updateUser({
          totalScore: data.user.totalScore,
          streak: data.user.streak
        })
      } catch (e) {
        console.warn('Submit error:', e)
      }
    }

    // Navigate to results
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
}
</script>
