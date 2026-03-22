<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <div class="brand">📚 Učilica</div>
        <p>Prijavi se i nastavi učiti!</p>
      </div>

      <div class="form-group">
        <label>Korisničko ime</label>
        <input
          class="form-input"
          v-model="username"
          placeholder="npr. marko123"
          @keyup.enter="handleLogin"
          autofocus
        >
      </div>

      <div class="form-group">
        <label>Lozinka</label>
        <input
          class="form-input"
          type="password"
          v-model="password"
          placeholder="••••"
          @keyup.enter="handleLogin"
        >
      </div>

      <button
        class="btn btn-primary mt-md"
        :disabled="!username || !password || loading"
        @click="handleLogin"
      >
        {{ loading ? 'Prijavljivanje...' : 'Prijavi se' }}
      </button>

      <button
        class="btn btn-secondary mt-sm"
        @click="handleGuest"
      >
        Nastavi kao gost 👋
      </button>

      <div class="auth-footer">
        Nemaš račun?
        <router-link to="/register">Registriraj se!</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const emit = defineEmits(['error'])
const router = useRouter()
const { login, enterAsGuest, loading } = useAuth()

const username = ref('')
const password = ref('')

async function handleLogin() {
  if (!username.value || !password.value) return
  try {
    await login(username.value, password.value)
    router.push('/home')
  } catch (e) {
    emit('error', e.message)
  }
}

function handleGuest() {
  enterAsGuest()
  router.push('/home')
}
</script>
