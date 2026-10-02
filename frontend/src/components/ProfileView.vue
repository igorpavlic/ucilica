<template>
  <div class="shell">
    <router-link to="/home" class="back-link">← Natrag</router-link>

    <div class="profile-card" v-if="user">
      <div class="profile-avatar">{{ user.avatar }}</div>
      <h2 class="profile-name">{{ user.displayName }}</h2>
      <p class="profile-username">@{{ user.username }}</p>

      <div class="profile-stats">
        <div class="profile-stat">
          <span class="stat-value">{{ user.totalScore }}</span>
          <span class="stat-label">Bodovi</span>
        </div>
        <div class="profile-stat">
          <span class="stat-value">{{ user.streak }}</span>
          <span class="stat-label">Niz</span>
        </div>
        <div class="profile-stat">
          <span class="stat-value">{{ user.grade }}.</span>
          <span class="stat-label">Razred</span>
        </div>
      </div>

      <!-- Razred picker -->
      <div class="grade-section">
        <label class="section-label">Promijeni razred</label>
        <div class="grade-grid">
          <button
            v-for="g in razredi"
            :key="g"
            class="grade-btn"
            :class="{ active: user.grade === g, saving: savingGrade === g }"
            @click="changeGrade(g)"
          >
            {{ g }}.
          </button>
        </div>
      </div>

      <!-- Obrađeno gradivo: miješano ponavljanje uzima samo ove teme -->
      <div class="covered-section">
        <label class="section-label">Obrađeno gradivo ({{ user.grade }}. razred)</label>
        <p class="covered-help">
          Označi teme koje su već obrađene u školi. Miješano ponavljanje tada uzima samo njih.
          Ako ništa nije označeno, uzimaju se teme koje je dijete već vježbalo.
        </p>
        <div v-for="t in obradjeno" :key="t._id" class="covered-row">
          <label>
            <input type="checkbox" v-model="t.oznaceno" />
            <span>{{ t.icon }} {{ t.name }}</span>
            <small class="covered-meta">{{ t.predmet }}<template v-if="t.vjezbano"> · vježbano</template></small>
          </label>
        </div>
        <button class="btn btn-secondary mt-md" :disabled="spremamObradjeno" @click="spremiObradjeno">
          {{ spremamObradjeno ? 'Spremam…' : 'Spremi obrađeno gradivo' }}
        </button>
        <p v-if="obradjenoPoruka" class="covered-help">{{ obradjenoPoruka }}</p>
      </div>

      <!-- Avatar picker -->
      <div class="avatar-section">
        <label class="section-label">Promijeni avatar</label>
        <div class="avatar-grid">
          <span
            v-for="av in avatars"
            :key="av"
            class="avatar-option"
            :class="{ selected: user.avatar === av }"
            @click="changeAvatar(av)"
          >{{ av }}</span>
        </div>
      </div>

      <!-- Quick links -->
      <div class="profile-links">
        <router-link to="/answers?filter=correct" class="profile-link correct">
          ✅ Pregledaj točne odgovore
        </router-link>
        <router-link to="/answers?filter=wrong" class="profile-link wrong">
          ❌ Pregledaj netočne odgovore
        </router-link>
      </div>

      <!-- Prava iz GDPR-a: pristup/prenosivost i brisanje (za roditelja) -->
      <div class="profil-privatnost">
        <h3>Podatci i privatnost</h3>
        <p class="profil-privatnost-opis">
          Za roditelje: što Mudrolina čuva piše u <router-link to="/privatnost">obavijesti o privatnosti</router-link>.
        </p>
        <button class="btn btn-secondary" :disabled="izvozim" @click="preuzmiPodatke">
          {{ izvozim ? 'Pripremam…' : '⬇️ Preuzmi moje podatke' }}
        </button>
        <details class="brisanje">
          <summary>🗑️ Obriši račun</summary>
          <p>Brisanje je trajno: nestaju račun, svi odgovori i napredak. Za potvrdu upiši lozinku.</p>
          <input class="form-input" type="password" v-model="lozinkaZaBrisanje" placeholder="Lozinka" autocomplete="current-password">
          <button class="btn btn-danger" :disabled="!lozinkaZaBrisanje || brisem" @click="obrisiRacun">
            {{ brisem ? 'Brišem…' : 'Trajno obriši račun' }}
          </button>
        </details>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>Moraš biti prijavljen za profil.</p>
      <router-link to="/login" class="btn btn-primary mt-md">Prijava</router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '../composables/useApi'
import { useAuth } from '../composables/useAuth'

const emit = defineEmits(['error'])
const { get, patch, put, del } = useApi()
const { user, updateUser, logout } = useAuth()
const router = useRouter()

const izvozim = ref(false)
const brisem = ref(false)
const lozinkaZaBrisanje = ref('')

// Izvoz svih podataka kao JSON datoteka (GDPR: pristup i prenosivost).
async function preuzmiPodatke () {
  izvozim.value = true
  try {
    const podatci = await get('/auth/me/izvoz')
    const blob = new Blob([JSON.stringify(podatci, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `mudrolina-${user.value.username}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  } catch (e) {
    emit('error', e.message)
  } finally {
    izvozim.value = false
  }
}

async function obrisiRacun () {
  if (!window.confirm('Sigurno trajno obrisati račun i sve podatke? Ovo se ne može poništiti.')) return
  brisem.value = true
  try {
    await del('/auth/me', { password: lozinkaZaBrisanje.value })
    logout()
    router.push('/login')
  } catch (e) {
    emit('error', e.message)
  } finally {
    brisem.value = false
    lozinkaZaBrisanje.value = ''
  }
}

const avatars = ['🧒','👦','👧','🧒🏻','👦🏽','👧🏼','🦸','🧙','🐱','🐶','🦊','🐼','🦄','🐸']
const savingGrade = ref(null)
// Nudimo samo razrede za koje u bazi postoji sadržaj
const razredi = ref([1, 2, 3, 4])

const obradjeno = ref([])
const spremamObradjeno = ref(false)
const obradjenoPoruka = ref('')

async function ucitajObradjeno () {
  if (!user.value) return
  try {
    const data = await get(`/progress/obradjeno?grade=${user.value.grade}`)
    obradjeno.value = data.teme || []
  } catch (e) { emit('error', e.message) }
}

async function spremiObradjeno () {
  spremamObradjeno.value = true
  obradjenoPoruka.value = ''
  try {
    const topicIds = obradjeno.value.filter((t) => t.oznaceno).map((t) => t._id)
    const data = await put('/progress/obradjeno', { grade: user.value.grade, topicIds })
    obradjenoPoruka.value = data.oznaceno
      ? `Spremljeno: ${data.oznaceno} tema.`
      : 'Oznake su uklonjene; ponavljanje uzima već vježbane teme.'
  } catch (e) {
    emit('error', e.message)
  } finally {
    spremamObradjeno.value = false
  }
}

onMounted(async () => {
  try {
    const { razredi: dostupni } = await get('/subjects/razredi')
    if (dostupni?.length) razredi.value = dostupni
  } catch { /* ostaje zadano 1-4 */ }
  await ucitajObradjeno()
})

async function changeGrade(g) {
  if (!user.value || user.value.grade === g) return
  savingGrade.value = g
  try {
    const data = await patch('/auth/me', { grade: g })
    updateUser(data.user)
    await ucitajObradjeno()
  } catch (e) {
    emit('error', e.message)
  } finally {
    savingGrade.value = null
  }
}

async function changeAvatar(av) {
  if (!user.value || user.value.avatar === av) return
  try {
    const data = await patch('/auth/me', { avatar: av })
    updateUser(data.user)
  } catch (e) {
    emit('error', e.message)
  }
}
</script>

<style scoped>
.covered-section { margin-top: var(--space-lg); text-align: left; }
.covered-help { font-size: 0.9rem; opacity: 0.8; margin: 4px 0 var(--space-sm); }
.covered-row label { display: flex; gap: 8px; align-items: baseline; padding: 6px 0; cursor: pointer; flex-wrap: wrap; }
.covered-meta { opacity: 0.65; }

.profile-card {
  background: var(--surface);
  border: 1.5px solid rgba(26, 22, 21, 0.06);
  border-radius: var(--r-xl);
  padding: var(--space-xl);
  text-align: center;
  margin-top: var(--space-lg);
  box-shadow: var(--shadow-md);
}

.profile-avatar {
  font-size: 4rem;
  margin-bottom: var(--space-sm);
}

.profile-name {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1.5rem;
  margin-bottom: 2px;
}

.profile-username {
  color: var(--text-tertiary);
  font-size: 0.9rem;
  margin-bottom: var(--space-lg);
}

.profile-stats {
  display: flex;
  justify-content: center;
  gap: var(--space-xl);
  margin-bottom: var(--space-xl);
  padding: var(--space-md) 0;
  border-top: 1px solid rgba(26, 22, 21, 0.06);
  border-bottom: 1px solid rgba(26, 22, 21, 0.06);
}

.profile-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--coral);
}

.stat-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.section-label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin-bottom: var(--space-sm);
  text-align: left;
}

.grade-section, .avatar-section {
  margin-bottom: var(--space-lg);
}

.grade-grid {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.grade-btn {
  width: 48px;
  height: 48px;
  border: 2px solid rgba(26, 22, 21, 0.08);
  border-radius: var(--r-md);
  background: var(--bg-warm);
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 150ms ease;
  color: var(--text-secondary);
}

.grade-btn:hover { border-color: var(--coral); }

.grade-btn.active {
  border-color: var(--coral);
  background: var(--coral);
  color: white;
  box-shadow: var(--shadow-glow-coral);
}

.grade-btn.saving {
  opacity: 0.6;
  pointer-events: none;
}

.profile-links {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-top: var(--space-lg);
}

.profile-link {
  display: block;
  padding: 12px 16px;
  border-radius: var(--r-md);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.92rem;
  transition: all 150ms ease;
}

.profile-link.correct {
  background: var(--correct-bg);
  color: #1a7a42;
}

.profile-link.correct:hover { box-shadow: var(--shadow-glow-correct); }

.profile-link.wrong {
  background: var(--wrong-bg);
  color: #b22d1e;
}

.profile-link.wrong:hover { box-shadow: var(--shadow-glow-wrong); }

.empty-state {
  text-align: center;
  padding: var(--space-2xl);
  color: var(--text-tertiary);
}
</style>
