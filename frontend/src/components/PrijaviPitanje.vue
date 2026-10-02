<template>
  <!-- Prijava pogrešnog ili nejasnog pitanja: prozor s razlogom i gumbom Pošalji -->
  <button type="button" class="prijavi-gumb" @click="otvori">🚩 Prijavi pitanje</button>

  <Teleport to="body">
    <div v-if="otvoreno" class="prijava-pozadina" @click.self="zatvori">
      <div class="prijava-prozor" role="dialog" aria-modal="true" aria-labelledby="prijava-naslov" @keydown.esc="zatvori">
        <h2 id="prijava-naslov">🚩 Prijavi pitanje</h2>
        <p class="prijava-pitanje">„{{ pitanje.question }}”</p>

        <template v-if="!gotovo">
          <label for="prijava-razlog">Razlog prijave</label>
          <textarea id="prijava-razlog" ref="polje" v-model="razlog" class="form-input" rows="4" maxlength="1000"
            placeholder="Opiši što nije u redu. Na primjer: dva odgovora su točna, ima pravopisnu grešku, ne razumijem pitanje…"></textarea>
          <!-- Skriveno polje za robote (čovjek ga ne vidi i ne popunjava) -->
          <input v-model="web" class="prijava-zamka" tabindex="-1" autocomplete="off" aria-hidden="true">
          <p class="prijava-napomena">
            <template v-if="emailRoditelja">Odgovor stiže na e-adresu roditelja: <strong>{{ emailRoditelja }}</strong>.</template>
            <template v-else-if="prijavljen">Ako želite odgovor, upišite e-adresu roditelja u <router-link to="/profile" @click="zatvori">profilu</router-link>.</template>
            <template v-else>Prijava je anonimna. Ne upisuj ime, adresu ni broj telefona.</template>
          </p>
          <p v-if="greska" class="prijava-greska">{{ greska }}</p>
          <div class="prijava-gumbi">
            <button type="button" class="btn btn-secondary" @click="zatvori">Odustani</button>
            <button type="button" class="btn btn-primary" :disabled="saljem || razlog.trim().length < 5" @click="posalji">
              {{ saljem ? 'Šaljem…' : 'Pošalji' }}
            </button>
          </div>
        </template>

        <template v-else>
          <p class="prijava-hvala">Hvala! Prijava je zaprimljena i pitanje ćemo provjeriti.</p>
          <div class="prijava-gumbi">
            <button type="button" class="btn btn-primary" @click="zatvori">Zatvori</button>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { useApi } from '../composables/useApi'
import { useAuth } from '../composables/useAuth'

const props = defineProps({ pitanje: { type: Object, required: true } })

const { postJednom } = useApi()
const { user, isLoggedIn } = useAuth()
const prijavljen = computed(() => !!isLoggedIn.value)
const emailRoditelja = computed(() => user.value?.emailRoditelja || '')

const otvoreno = ref(false)
const razlog = ref('')
const web = ref('')
const saljem = ref(false)
const gotovo = ref(false)
const greska = ref('')
const polje = ref(null)

async function otvori () {
  otvoreno.value = true
  gotovo.value = false
  greska.value = ''
  await nextTick()
  polje.value?.focus()
}

function zatvori () {
  otvoreno.value = false
  if (gotovo.value) razlog.value = ''
}

async function posalji () {
  saljem.value = true
  greska.value = ''
  try {
    await postJednom('/prijave', { questionId: props.pitanje._id, razlog: razlog.value.trim(), web: web.value })
    gotovo.value = true
  } catch (e) {
    greska.value = e.message
  } finally {
    saljem.value = false
  }
}
</script>
