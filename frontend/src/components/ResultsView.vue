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
        <button class="btn btn-secondary" @click="$router.push('/home')">
          Početna 🏠
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const triggerStars = inject('triggerStars')

const correct = computed(() => parseInt(route.query.correct) || 0)
const total = computed(() => parseInt(route.query.total) || 1)
const pct = computed(() => correct.value / total.value)

const resultEmoji = computed(() => {
  if (pct.value === 1) return '🏆'
  if (pct.value >= 0.7) return '🌟'
  if (pct.value >= 0.4) return '💪'
  return '📚'
})

const resultTitle = computed(() => {
  if (pct.value === 1) return 'Savršeno!'
  if (pct.value >= 0.7) return 'Odlično!'
  if (pct.value >= 0.4) return 'Dobro!'
  return 'Vježbaj dalje!'
})

const resultMessage = computed(() => {
  if (pct.value === 1) return 'Sve točno! Ti si pravi šampion! 🎉'
  if (pct.value >= 0.7) return 'Super rezultat! Samo nastavi tako! 🌈'
  if (pct.value >= 0.4) return 'Dobar pokušaj! Pokušaj ponovo! 💪'
  return 'Ne brini, vježbom se uči! 📖'
})

onMounted(() => {
  if (pct.value >= 0.7) triggerStars()
})

function retry() {
  router.push({
    name: 'quiz',
    params: { topicId: route.query.topicId },
    query: {
      topicName: route.query.topicName,
      topicIcon: route.query.topicIcon,
      subjectSlug: route.query.subjectSlug,
      subjectName: route.query.subjectName
    }
  })
}

function goTopics() {
  router.push({
    name: 'topics',
    params: { slug: route.query.subjectSlug || 'unknown' },
    query: {
      name: route.query.subjectName,
      icon: ''
    }
  })
}
</script>
