<template>
  <div class="shell">
    <router-link to="/home" class="back-link">← Natrag</router-link>

    <div class="section-header">
      <span class="emoji">{{ filter === 'correct' ? '✅' : '❌' }}</span>
      <h2>{{ filter === 'correct' ? 'Točni odgovori' : 'Netočni odgovori' }}</h2>
    </div>

    <!-- Filter toggle -->
    <div class="filter-toggle">
      <button
        class="filter-btn"
        :class="{ active: filter === 'correct' }"
        @click="switchFilter('correct')"
      >✅ Točni</button>
      <button
        class="filter-btn"
        :class="{ active: filter === 'wrong' }"
        @click="switchFilter('wrong')"
      >❌ Netočni</button>
    </div>

    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <div class="loading-text">Učitavanje...</div>
    </div>

    <div v-else-if="answers.length === 0" class="empty-state">
      <span class="empty-emoji">{{ filter === 'correct' ? '🎯' : '📚' }}</span>
      <p>{{ filter === 'correct' ? 'Još nemaš točnih odgovora.' : 'Nemaš netočnih odgovora — svaka čast!' }}</p>
    </div>

    <div v-else class="answer-list">
      <div
        v-for="(item, i) in answers"
        :key="i"
        class="answer-card"
        :class="item.wasCorrect ? 'correct' : 'wrong'"
      >
        <!-- Subject/topic tag -->
        <div class="answer-meta">
          <span v-if="item.subject" class="meta-tag">{{ item.subject.icon }} {{ item.subject.name }}</span>
          <span v-if="item.topic" class="meta-tag">{{ item.topic.icon }} {{ item.topic.name }}</span>
        </div>

        <!-- Visual if exists -->
        <div v-if="item.visual" class="answer-visual">{{ item.visual }}</div>

        <!-- Question text -->
        <div class="answer-question">{{ item.question }}</div>

        <!-- For wrong answers: show what user answered vs correct -->
        <div v-if="!item.wasCorrect" class="answer-comparison">
          <div class="answer-row wrong-row">
            <span class="answer-label">Tvoj odgovor:</span>
            <span class="answer-value">{{ formatUserAnswer(item) }}</span>
          </div>
          <div class="answer-row correct-row">
            <span class="answer-label">Točan odgovor:</span>
            <span class="answer-value">{{ item.correctAnswer }}</span>
          </div>
        </div>

        <!-- For correct answers: show the answer -->
        <div v-else class="answer-comparison">
          <div class="answer-row correct-row">
            <span class="answer-label">Odgovor:</span>
            <span class="answer-value">{{ item.correctAnswer }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '../composables/useApi'

const route = useRoute()
const router = useRouter()
const { get, loading } = useApi()

const filter = ref(route.query.filter || 'correct')
const answers = ref([])

async function loadAnswers() {
  try {
    const data = await get(`/progress/answers?filter=${filter.value}&limit=50`)
    answers.value = data.answers
  } catch (e) {
    console.error('Load answers error:', e)
  }
}

function switchFilter(f) {
  filter.value = f
  router.replace({ query: { filter: f } })
  loadAnswers()
}

// Reagiraj kad se query promijeni izvana (klik iz topbara)
watch(() => route.query.filter, (newFilter) => {
  if (newFilter && newFilter !== filter.value) {
    filter.value = newFilter
    loadAnswers()
  }
})

function formatUserAnswer(item) {
  if (item.type === 'choice' && item.answers.length > 0) {
    const idx = parseInt(item.userAnswer)
    if (!isNaN(idx) && item.answers[idx]) {
      return item.answers[idx]
    }
  }
  return item.userAnswer
}

onMounted(loadAnswers)
</script>

<style scoped>
.filter-toggle {
  display: flex;
  gap: 8px;
  margin-bottom: var(--space-lg);
}

.filter-btn {
  flex: 1;
  padding: 10px 16px;
  border: 2px solid rgba(26, 22, 21, 0.08);
  border-radius: var(--r-md);
  background: var(--bg-warm);
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;
  color: var(--text-secondary);
}

.filter-btn.active {
  border-color: var(--coral);
  background: var(--coral-light);
  color: var(--coral-dark);
}

.filter-btn:hover:not(.active) {
  border-color: rgba(26, 22, 21, 0.15);
}

.empty-state {
  text-align: center;
  padding: var(--space-2xl) var(--space-lg);
  color: var(--text-tertiary);
}

.empty-emoji {
  font-size: 3rem;
  display: block;
  margin-bottom: var(--space-md);
}

.answer-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding-bottom: var(--space-2xl);
}

.answer-card {
  background: var(--surface);
  border: 1.5px solid rgba(26, 22, 21, 0.06);
  border-radius: var(--r-lg);
  padding: var(--space-lg);
  border-left: 4px solid var(--text-tertiary);
}

.answer-card.correct {
  border-left-color: var(--correct);
}

.answer-card.wrong {
  border-left-color: var(--wrong);
}

.answer-meta {
  display: flex;
  gap: 8px;
  margin-bottom: var(--space-sm);
  flex-wrap: wrap;
}

.meta-tag {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-tertiary);
  background: var(--bg-warm);
  padding: 2px 10px;
  border-radius: var(--r-full);
}

.answer-visual {
  font-size: 1.5rem;
  margin-bottom: var(--space-sm);
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.answer-question {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 1.05rem;
  margin-bottom: var(--space-md);
  line-height: 1.4;
}

.answer-comparison {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.answer-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 8px 12px;
  border-radius: var(--r-sm);
  font-size: 0.9rem;
}

.answer-label {
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;
}

.answer-value {
  font-weight: 700;
}

.wrong-row {
  background: var(--wrong-bg);
  color: #b22d1e;
}

.correct-row {
  background: var(--correct-bg);
  color: #1a7a42;
}

@media (max-width: 600px) {
  .answer-card { padding: var(--space-md); }
  .answer-question { font-size: 0.95rem; }
}
</style>
