import { ref, computed } from 'vue'
import { useApi } from './useApi'

// Global reactive state (singleton across components)
const user = ref(null)
const guestScore = ref(0)
const initialized = ref(false)

export function useAuth() {
  const api = useApi()

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
    initialized.value = false  // ← reset da initAuth radi ponovo
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

  return {
    user, guestScore, isLoggedIn, displayName, avatar, totalScore, streak, grade,
    login, register, logout, enterAsGuest, initAuth, addGuestScore, updateUser,
    loading: api.loading, error: api.error, initialized
  }
}
