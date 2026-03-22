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
        📚 Učilica
      </router-link>

      <div class="topbar-stats">
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
</template>

<script setup>
import { ref, computed, onMounted, provide } from 'vue'
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
const showTopbar = computed(() => !authPages.includes(route.name))

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
