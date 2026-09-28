<template>
  <div class="shell">
    <!--
      Izbornik razreda stoji ovdje, a ne samo u profilu: dijete i roditelj
      očekuju ga na prvom zaslonu. Nude se samo razredi za koje postoji
      sadržaj — inače bi odabir 5. razreda dao prazan zaslon.
    -->
    <div v-if="razredi.length > 1" class="grade-switch">
      <span class="grade-switch-label">Razred</span>
      <div class="grade-switch-btns">
        <button
          v-for="g in razredi"
          :key="g"
          class="grade-chip"
          :class="{ active: g === aktivniRazred, saving: spremam === g }"
          :disabled="spremam !== null"
          @click="promijeniRazred(g)"
        >{{ g }}.</button>
      </div>
    </div>

    <h1 class="page-title">Odaberi <span>predmet</span></h1>
    <button v-if="subjects.length" class="btn btn-secondary review-button" @click="startReview">
      🔄 Miješano ponavljanje gradiva {{ aktivniRazred }}. razreda
    </button>

    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <div class="loading-text">Učitavanje predmeta...</div>
    </div>

    <div v-else-if="subjects.length" class="subject-grid">
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

    <!-- Prazna baza je čest slučaj nakon svježe instalacije — reci što učiniti -->
    <div v-else class="prazno-stanje">
      <div class="prazno-emoji">📭</div>
      <p class="prazno-naslov">Za {{ aktivniRazred }}. razred još nema sadržaja.</p>
      <p class="prazno-tekst">
        Napuni bazu naredbom <code>npm run seed:all</code> iz korijena projekta.
      </p>
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
const { get, patch, loading } = useApi()
const { grade, isLoggedIn, updateUser } = useAuth()

const subjects = ref([])
const razredi = ref([])
const aktivniRazred = ref(grade.value || 1)
const spremam = ref(null)

async function ucitajPredmete (g) {
  const data = await get(`/subjects?grade=${g}`)
  subjects.value = data.subjects || []
}

onMounted(async () => {
  try {
    // Razredi sa sadržajem — gost i prijavljeni dobivaju isti popis
    const { razredi: dostupni } = await get('/subjects/razredi')
    razredi.value = dostupni || []

    // Ako korisnikov razred nema sadržaja, prebaci na prvi koji ga ima
    if (razredi.value.length && !razredi.value.includes(aktivniRazred.value)) {
      aktivniRazred.value = razredi.value[0]
    }

    await ucitajPredmete(aktivniRazred.value)
  } catch (e) {
    emit('error', e.message)
  }
})

async function promijeniRazred (g) {
  if (g === aktivniRazred.value || spremam.value !== null) return
  spremam.value = g
  const prethodni = aktivniRazred.value
  try {
    aktivniRazred.value = g
    await ucitajPredmete(g)
    // Prijavljenom korisniku zapamti izbor; gost ga zadrži samo do osvježenja
    if (isLoggedIn.value) {
      const data = await patch('/auth/me', { grade: g })
      updateUser(data.user)
    }
  } catch (e) {
    aktivniRazred.value = prethodni
    emit('error', e.message)
  } finally {
    spremam.value = null
  }
}

function goToTopics (subj) {
  router.push({
    name: 'topics',
    params: { slug: subj.slug },
    query: { name: subj.name, icon: subj.icon, grade: aktivniRazred.value }
  })
}

function startReview () {
  router.push({ name: 'quiz', params: { topicId: `review-${aktivniRazred.value}` },
    query: { topicName: 'Miješano ponavljanje', topicIcon: '🔄', subjectSlug: '', subjectName: '' } })
}
</script>
