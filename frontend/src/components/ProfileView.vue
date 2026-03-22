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
            v-for="g in 8"
            :key="g"
            class="grade-btn"
            :class="{ active: user.grade === g, saving: savingGrade === g }"
            @click="changeGrade(g)"
          >
            {{ g }}.
          </button>
        </div>
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
    </div>

    <div v-else class="empty-state">
      <p>Moraš biti prijavljen za profil.</p>
      <router-link to="/login" class="btn btn-primary mt-md">Prijava</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useApi } from '../composables/useApi'
import { useAuth } from '../composables/useAuth'

const emit = defineEmits(['error'])
const { patch } = useApi()
const { user, updateUser } = useAuth()

const avatars = ['🧒','👦','👧','🧒🏻','👦🏽','👧🏼','🦸','🧙','🐱','🐶','🦊','🐼','🦄','🐸']
const savingGrade = ref(null)

async function changeGrade(g) {
  if (!user.value || user.value.grade === g) return
  savingGrade.value = g
  try {
    const data = await patch('/auth/me', { grade: g })
    updateUser(data.user)
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
