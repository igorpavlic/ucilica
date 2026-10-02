<template>
  <!--
    Poredaj: povlačenje (miš, prst, olovka — Pointer Events) i strelice.
    Strelice ostaju jer svaka radnja povlačenjem mora imati i zamjenu
    jednim dodirom (WCAG 2.2, kriterij 2.5.7 Dragging Movements).
  -->
  <div ref="lista" class="ordering-list">
    <p v-if="!onemoguceno" class="ordering-uputa">Povuci rečenicu na pravo mjesto ili je pomakni strelicama.</p>
    <div
      v-for="(item, index) in stavke"
      :key="item"
      class="ordering-item"
      :class="{ povlaci: vuceIndex === index, onemoguceno }"
      :style="vuceIndex === index ? { transform: `translateY(${dy}px)` } : null"
      @pointerdown="pocni($event, index)"
      @pointermove="pomakni"
      @pointerup="zavrsi"
      @pointercancel="zavrsi"
    >
      <span v-if="!onemoguceno" class="ordering-hvat" aria-hidden="true">⠿</span>
      <span class="ordering-tekst">{{ index + 1 }}. {{ item }}</span>
      <div class="ordering-gumbi">
        <button type="button" :disabled="onemoguceno || index === 0" :aria-label="`Pomakni ${item} gore`"
          @pointerdown.stop @click="gumb(index, -1)">↑</button>
        <button type="button" :disabled="onemoguceno || index === stavke.length - 1" :aria-label="`Pomakni ${item} dolje`"
          @pointerdown.stop @click="gumb(index, 1)">↓</button>
      </div>
    </div>
    <p class="sr-only" aria-live="polite">{{ najava }}</p>
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'

const props = defineProps({
  stavke: { type: Array, required: true },
  onemoguceno: { type: Boolean, default: false }
})
const emit = defineEmits(['premjesti'])

const lista = ref(null)
const vuceIndex = ref(null)
const dy = ref(0)
const najava = ref('')
let hvat = 0          // razmak pokazivača od sredine stavke pri hvatanju
let pomaknuto = false

const sredina = (el) => { const r = el.getBoundingClientRect(); return r.top + r.height / 2 }

function pocni (e, index) {
  if (props.onemoguceno || (e.pointerType === 'mouse' && e.button !== 0)) return
  e.currentTarget.setPointerCapture?.(e.pointerId)
  vuceIndex.value = index
  dy.value = 0
  hvat = e.clientY - sredina(e.currentTarget)
  pomaknuto = false
}

function pomakni (e) {
  if (vuceIndex.value === null) return
  const redovi = [...lista.value.querySelectorAll('.ordering-item')]
  // Sredine mjesta u popisu (vučena stavka bez svog pomaka)
  const sredine = redovi.map((r, j) => sredina(r) - (j === vuceIndex.value ? dy.value : 0))
  const pokazivac = e.clientY - hvat
  let cilj = 0
  sredine.forEach((s, j) => { if (Math.abs(s - pokazivac) < Math.abs(sredine[cilj] - pokazivac)) cilj = j })
  if (cilj !== vuceIndex.value) {
    emit('premjesti', vuceIndex.value, cilj)
    vuceIndex.value = cilj
    pomaknuto = true
  }
  dy.value = pokazivac - sredine[cilj]
  if (Math.abs(dy.value) > 4) pomaknuto = true
}

function zavrsi () {
  if (vuceIndex.value === null) return
  if (pomaknuto) najavi(vuceIndex.value)
  vuceIndex.value = null
  dy.value = 0
}

function gumb (index, pomak) {
  emit('premjesti', index, index + pomak)
  najavi(index + pomak)
}

async function najavi (mjesto) {
  await nextTick()   // popis se osvježava tek nakon što roditelj primi promjenu
  const stavka = props.stavke[mjesto]
  if (stavka) najava.value = `„${stavka}” je sada na ${mjesto + 1}. mjestu od ${props.stavke.length}.`
}
</script>
