import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useApi } from '../composables/useApi'

export const useAuthStore = defineStore('auth', () => {
  const api = useApi()

  const user = ref(null)
  const guestScore = ref(0)
  const initialized = ref(false)

  const isLoggedIn = computed(() => !!user.value)
  const displayName = computed(() => user.value?.displayName || 'Gost')
  const avatar = computed(() => user.value?.avatar || '👋')
  const totalScore = computed(() => user.value?.totalScore ?? guestScore.value)
  const streak = computed(() => user.value?.streak ?? 0)
  const grade = computed(() => user.value?.grade ?? 1)

  async function login(username, password) {
    const data = await api.post('/auth/login', { username, password })
    localStorage.setItem('ucilica_token', data.token)
    user.value = data.user
    initialized.value = true
    return data
  }

  async function register(form) {
    const data = await api.post('/auth/register', form)
    localStorage.setItem('ucilica_token', data.token)
    user.value = data.user
    initialized.value = true
    return data
  }

  function logout() {
    localStorage.removeItem('ucilica_token')
    user.value = null
    guestScore.value = 0
    initialized.value = false
  }

  function enterAsGuest() {
    localStorage.removeItem('ucilica_token')
    user.value = null
    initialized.value = true
  }

  async function initAuth() {
    if (initialized.value) return
    const token = localStorage.getItem('ucilica_token')
    if (token) {
      try {
        const data = await api.get('/auth/me')
        user.value = data.user
      } catch {
        localStorage.removeItem('ucilica_token')
        user.value = null
      }
    }
    initialized.value = true
  }

  function addGuestScore(points) {
    guestScore.value += points
  }

  function updateUser(updates) {
    if (user.value) {
      Object.assign(user.value, updates)
    }
  }

  async function refreshUser() {
    if (!localStorage.getItem('ucilica_token')) return null
    const data = await api.get('/auth/me')
    user.value = data.user
    return data.user
  }

  return {
    user,
    guestScore,
    initialized,
    isLoggedIn,
    displayName,
    avatar,
    totalScore,
    streak,
    grade,
    login,
    register,
    logout,
    enterAsGuest,
    initAuth,
    addGuestScore,
    updateUser,
    refreshUser,
    loading: api.loading,
    error: api.error
  }
})
