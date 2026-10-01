<template>
  <div class="results-page">
    <div class="results-card">
      <span class="results-emoji">{{ resultEmoji }}</span>
      <div class="results-title">{{ resultTitle }}</div>
      <div class="results-score">{{ correct }} / {{ total }}</div>
      <div class="results-message">{{ resultMessage }}</div>

      <div class="results-actions">
        <button class="btn btn-primary" @click="retry">
          Pokušaj ponovo 🔄
        </button>
        <button class="btn btn-secondary" @click="goTopics">
          Odaberi temu 📚
        </button>
        <button class="btn btn-secondary" @click="$router.push({ path: '/home', query: { grade: $route.query.grade } })">
          Početna 🏠
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import confetti from 'canvas-confetti'

const router = useRouter()
const route = useRoute()
const triggerStars = inject('triggerStars')

const correct = computed(() => parseInt(route.query.correct) || 0)
const total = computed(() => Math.max(1, parseInt(route.query.total) || 1))
const pct = computed(() => correct.value / total.value)

const resultEmoji = computed(() => {
  if (pct.value === 1) return '🏆'
  if (pct.value >= 0.7) return '🌟'
  if (pct.value >= 0.4) return '💪'
  return '📚'
})

const resultTitle = computed(() => {
  if (pct.value === 1) return 'Sve točno!'
  if (pct.value >= 0.7) return 'Dobro napreduješ!'
  if (pct.value >= 0.4) return 'Još malo vježbe!'
  return 'Pokušaj ponovno!'
})

const resultMessage = computed(() => {
  if (pct.value === 1) return 'Svi su zadatci točni. 🎉'
  if (pct.value >= 0.7) return 'Većinu zadataka rješavaš točno. Nastavi vježbati ono što je bilo teško. 🌈'
  if (pct.value >= 0.4) return 'Dio zadataka već znaš. Ponovi netočne pa pokušaj ponovno. 💪'
  return 'Pogledaj točne odgovore, ponovi gradivo i pokušaj ponovno. 📖'
})

/**
 * Slavlje na kraju runde.
 *
 * canvas-confetti (ISC, bez ovisnosti, ~7 KB gzip) crta po <canvas>-u i sam
 * se počisti. Jačina ovisi o rezultatu — sve točno dobiva više od 70 %,
 * inače nagrada gubi značenje.
 *
 * Tko je u sustavu isključio animacije (prefers-reduced-motion) ne dobiva
 * ništa: zvjezdice i konfeti nekoj djeci smetaju, a i to je pristupačnost.
 */
function slavi () {
  const mirno = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (mirno) return

  const jako = pct.value === 1
  confetti({
    particleCount: jako ? 140 : 70,
    spread: jako ? 100 : 65,
    startVelocity: jako ? 45 : 32,
    origin: { y: 0.65 },
    disableForReducedMotion: true
  })
  if (jako) {
    // drugi val iz kutova samo kad je sve točno
    setTimeout(() => {
      confetti({ particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, disableForReducedMotion: true })
      confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, disableForReducedMotion: true })
    }, 220)
  }
}

onMounted(() => {
  if (pct.value >= 0.7) { triggerStars(); slavi() }
})

function retry() {
  router.push({
    name: 'quiz',
    params: { topicId: route.query.topicId },
    query: {
      topicName: route.query.topicName,
      topicIcon: route.query.topicIcon,
      subjectSlug: route.query.subjectSlug,
      subjectName: route.query.subjectName,
      grade: route.query.grade
    }
  })
}

function goTopics() {
  if (String(route.query.topicId).startsWith('review-')) { router.push({ path: '/home', query: { grade: route.query.grade } }); return }
  router.push({
    name: 'topics',
    params: { slug: route.query.subjectSlug || 'unknown' },
    query: {
      name: route.query.subjectName,
      icon: '',
      grade: route.query.grade
    }
  })
}
</script>
