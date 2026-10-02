<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <div class="brand">📚 Mudrolina</div>
        <p>Napravi svoj profil!</p>
      </div>

      <div class="form-group">
        <label>Korisničko ime</label>
        <input class="form-input" v-model="form.username" placeholder="npr. zeleni_zmaj">
        <small class="form-hint">Ne upisuj pravo ime i prezime — dovoljan je nadimak.</small>
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
          <!-- Zasad samo razredna nastava (1.–4.); za 5.–8. još nema sadržaja. -->
          <option v-for="g in 4" :key="g" :value="g">{{ g }}. razred</option>
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

      <!--
        Djeca mlađa od 16 godina ne mogu sama dati privolu (ZPOU čl. 19),
        pa registraciju potvrđuje roditelj ili skrbnik.
      -->
      <label class="privola">
        <input type="checkbox" v-model="form.privolaRoditelja">
        <span>
          Kao roditelj ili skrbnik potvrđujem da je pročitana
          <router-link to="/privatnost" target="_blank">obavijest o privatnosti</router-link>
          i dajem privolu za obradu podataka djeteta.
        </span>
      </label>

      <button
        class="btn btn-primary mt-md"
        :disabled="!form.username || !form.password || !form.privolaRoditelja || loading"
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
  avatar: '🧒',
  privolaRoditelja: false
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
