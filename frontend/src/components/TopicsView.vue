<template>
  <div class="shell">
    <router-link to="/home" class="back-link">← Natrag na predmete</router-link>

    <div class="section-header">
      <span class="emoji">{{ $route.query.icon || '📘' }}</span>
      <h2>{{ $route.query.name || 'Teme' }}</h2>
    </div>

    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <div class="loading-text">Učitavanje tema...</div>
    </div>

    <div v-else class="topic-grid">
      <div
        v-for="topic in topics"
        :key="topic._id"
        class="topic-card"
        @click="startQuiz(topic)"
      >
        <span class="emoji">{{ topic.icon }}</span>
        <div class="name">{{ topic.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useApi } from '../composables/useApi'
import { useAuth } from '../composables/useAuth'

const props = defineProps({ slug: String })
const emit = defineEmits(['error'])
const router = useRouter()
const route = useRoute()
const { get, loading } = useApi()
const { grade } = useAuth()

const topics = ref([])

onMounted(async () => {
  try {
    const data = await get(`/subjects/${props.slug}/topics?grade=${grade.value}`)
    topics.value = data.topics
  } catch (e) {
    emit('error', e.message)
  }
})

function startQuiz(topic) {
  router.push({
    name: 'quiz',
    params: { topicId: topic._id },
    query: {
      topicName: topic.name,
      topicIcon: topic.icon,
      subjectName: route.query.name,
      subjectSlug: props.slug
    }
  })
}
</script>
