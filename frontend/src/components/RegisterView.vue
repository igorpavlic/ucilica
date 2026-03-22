<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <div class="brand">📚 Učilica</div>
        <p>Napravi svoj profil!</p>
      </div>

      <div class="form-group">
        <label>Korisničko ime</label>
        <input class="form-input" v-model="form.username" placeholder="npr. marko123">
      </div>

      <div class="form-group">
        <label>Ime za prikaz</label>
        <input class="form-input" v-model="form.displayName" placeholder="npr. Marko">
      </div>

      <div class="form-group">
        <label>Lozinka</label>
        <input class="form-input" type="password" v-model="form.password" placeholder="Barem 4 znaka">
      </div>

      <div class="form-group">
        <label>Razred</label>
        <select class="form-input" v-model.number="form.grade">
          <option v-for="g in 8" :key="g" :value="g">{{ g }}. razred</option>
        </select>
      </div>

      <div class="form-group">
        <label>Odaberi avatar</label>
        <div class="avatar-grid">
          <span
            v-for="av in avatars"
            :key="av"
            class="avatar-option"
            :class="{ selected: form.avatar === av }"
            @click="form.avatar = av"
          >{{ av }}</span>
        </div>
      </div>

      <button
        class="btn btn-primary mt-md"
        :disabled="!form.username || !form.password || loading"
        @click="handleRegister"
      >
        {{ loading ? 'Registracija...' : 'Registriraj se 🎉' }}
      </button>

      <div class="auth-footer">
        Već imaš račun?
        <router-link to="/login">Prijavi se!</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const emit = defineEmits(['error'])
const router = useRouter()
const { register, loading } = useAuth()

const avatars = ['🧒','👦','👧','🧒🏻','👦🏽','👧🏼','🦸','🧙','🐱','🐶','🦊','🐼','🦄','🐸']

const form = reactive({
  username: '',
  password: '',
  displayName: '',
  grade: 1,
  avatar: '🧒'
})

async function handleRegister() {
  if (!form.username || !form.password) return
  try {
    await register({ ...form })
    router.push('/home')
  } catch (e) {
    emit('error', e.message)
  }
}
</script>
