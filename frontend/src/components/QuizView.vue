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
        <div v-if="questions[currentQ].visual" class="question-visual">
          {{ questions[currentQ].visual }}
        </div>

        <div class="question-text">{{ questions[currentQ].question }}</div>

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
import { inject, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuth } from '../composables/useAuth'
import { useQuizStore } from '../stores/quiz'

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
  correctCount
} = storeToRefs(quizStore)

const {
  loadQuiz,
  checkChoice,
  checkInput,
  advanceQuestion,
  hasNextQuestion,
  submitQuiz,
  resetSession
} = quizStore

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
