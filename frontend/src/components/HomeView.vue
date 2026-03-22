<template>
  <div class="shell">
    <h1 class="page-title">Odaberi <span>predmet</span></h1>

    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <div class="loading-text">Učitavanje predmeta...</div>
    </div>

    <div v-else class="subject-grid">
      <div
        v-for="subj in subjects"
        :key="subj._id"
        class="subject-card"
        @click="goToTopics(subj)"
      >
        <span class="subject-icon">{{ subj.icon }}</span>
        <div class="subject-name">{{ subj.name }}</div>
        <div class="subject-desc">{{ subj.description }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '../composables/useApi'
import { useAuth } from '../composables/useAuth'

const emit = defineEmits(['error'])
const router = useRouter()
const { get, loading } = useApi()
const { grade } = useAuth()

const subjects = ref([])

onMounted(async () => {
  try {
    const data = await get(`/subjects?grade=${grade.value}`)
    subjects.value = data.subjects
  } catch (e) {
    emit('error', e.message)
  }
})

function goToTopics(subj) {
  router.push({
    name: 'topics',
    params: { slug: subj.slug },
    query: { name: subj.name, icon: subj.icon }
  })
}
</script>
