<template>
  <!-- Error toast -->
  <Teleport to="body">
    <div v-if="errorMsg" class="error-toast" @click="errorMsg = ''">
      {{ errorMsg }} ✕
    </div>
  </Teleport>

  <!-- Celebration stars -->
  <Teleport to="body">
    <div v-if="showStars" class="stars-overlay">
      <span
        v-for="s in 20"
        :key="s"
        class="star"
        :style="{
          left: Math.random() * 100 + '%',
          animationDelay: Math.random() * 0.6 + 's',
          fontSize: (1.2 + Math.random() * 1.8) + 'rem'
        }"
      >{{ ['⭐','🌟','✨','💫','🎉','🎊'][Math.floor(Math.random() * 6)] }}</span>
    </div>
  </Teleport>

  <!-- Top bar (visible when not on auth pages) -->
  <header v-if="showTopbar" class="topbar">
    <div class="topbar-inner">
      <router-link to="/home" class="topbar-brand" style="text-decoration:none">
        📚 Mudrolina
      </router-link>

      <!-- Mobitel: samo bodovi i hamburger; sve ostalo je u izborniku -->
      <div class="topbar-kratko">
        <span class="stat-chip"><span class="icon">⭐</span>{{ totalScore }}</span>
        <button type="button" class="topbar-izbornik-gumb" :aria-expanded="izbornik" aria-controls="topbar-izbornik"
          :aria-label="izbornik ? 'Zatvori izbornik' : 'Otvori izbornik'" @click="izbornik = !izbornik">{{ izbornik ? '✕' : '☰' }}</button>
      </div>

      <div id="topbar-izbornik" class="topbar-stats" :class="{ otvoreno: izbornik }" @click="izbornik = false">
        <!-- Klik na ime → profil (odabir razreda) -->
        <router-link to="/profile" class="stat-chip clickable" style="text-decoration:none">
          <span class="icon">{{ avatar }}</span>
          {{ displayName }}
        </router-link>
        <!-- Klik na bodove → točni odgovori -->
        <router-link v-if="isLoggedIn" to="/answers?filter=correct" class="stat-chip clickable" style="text-decoration:none">
          <span class="icon">⭐</span>
          {{ totalScore }}
        </router-link>
        <div v-else class="stat-chip">
          <span class="icon">⭐</span>
          {{ totalScore }}
        </div>
        <!-- Klik na streak → netočni odgovori -->
        <router-link v-if="isLoggedIn" to="/answers?filter=wrong" class="stat-chip clickable" style="text-decoration:none">
          <span class="icon">🔥</span>
          {{ streak }}
        </router-link>
        <router-link to="/upute" class="topbar-upute" title="Upute" aria-label="Upute">
          <span aria-hidden="true">❓</span><span class="topbar-upute-tekst">Upute</span>
        </router-link>
        <button v-if="isLoggedIn" class="btn-logout" @click="handleLogout">Odjava</button>
        <router-link v-else to="/login" class="btn-logout" style="text-decoration:none">Prijava</router-link>
      </div>
    </div>
  </header>

  <!-- Initial loading (only before first auth check) -->
  <div v-if="appLoading" class="loading-overlay">
    <div class="spinner"></div>
    <div class="loading-text">Učitavanje...</div>
  </div>

  <!-- Router view — always rendered once initialized -->
  <router-view
    v-else
    @error="handleError"
    @stars="triggerStars"
  />

  <footer v-if="!fokus && !appLoading" class="podnozje">
    <span>© {{ godine }} From RIM · Mudrolina. Sva prava pridržana.</span>
    <nav aria-label="Podnožje">
      <router-link to="/upute">Upute</router-link>
      <router-link to="/privatnost">Privatnost</router-link>
      <a href="mailto:contact@fromrim.com">Kontakt</a>
    </nav>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted, provide, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from './composables/useAuth'

const router = useRouter()
const route = useRoute()
const errorMsg = ref('')
const showStars = ref(false)
const appLoading = ref(true)

const {
  user, isLoggedIn, displayName, avatar, totalScore, streak,
  initAuth, logout, guestScore
} = useAuth()

const authPages = ['login', 'register']
// Kviz je način bez ometanja: bez gornje trake i podnožja (vlastito zaglavlje s ✕ i napretkom)
const fokus = computed(() => route.name === 'quiz')
const showTopbar = computed(() => !authPages.includes(route.name) && !fokus.value)
// Hamburger izbornik (mobitel): zatvara se pri promjeni stranice i tipkom Esc
const izbornik = ref(false)
watch(() => route.fullPath, () => { izbornik.value = false })
if (typeof window !== 'undefined') window.addEventListener('keydown', (e) => { if (e.key === 'Escape') izbornik.value = false })

const GODINA_POCETKA = 2026
const godine = computed(() => {
  const sada = new Date().getFullYear()
  return sada > GODINA_POCETKA ? `${GODINA_POCETKA}.–${sada}.` : `${GODINA_POCETKA}.`
})

function handleLogout() {
  logout()
  router.push('/login')
}

function handleError(msg) {
  errorMsg.value = msg
  setTimeout(() => { errorMsg.value = '' }, 4000)
}

function triggerStars() {
  showStars.value = true
  setTimeout(() => { showStars.value = false }, 2000)
}

// Provide global helpers to child components
provide('triggerStars', triggerStars)
provide('handleError', handleError)

onMounted(async () => {
  await initAuth()
  appLoading.value = false

  // If on root/login and logged in, go home
  if (route.path === '/' || route.path === '/login') {
    if (isLoggedIn.value) {
      router.replace('/home')
    }
  }
})
</script>
