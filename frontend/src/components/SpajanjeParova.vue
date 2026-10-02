<template>
  <!--
    Spajanje parova: klik lijevo pa klik desno, ili povlačenje od lijevog do
    desnog člana. Svaka veza dobiva svoju boju i zakrivljenu crtu; broj u
    kružiću ostaje, pa se veza vidi i bez razlikovanja boja.
  -->
  <div class="match-wrap">
    <div ref="platno" class="match-cols">
      <svg class="match-crte" aria-hidden="true">
        <g v-for="c in crte" :key="c.kljuc" :class="['match-crta', c.stanje]">
          <path :d="c.d" :stroke="c.boja" />
          <circle :cx="c.x1" :cy="c.y1" r="4.5" :fill="c.boja" />
          <circle :cx="c.x2" :cy="c.y2" r="4.5" :fill="c.boja" />
        </g>
        <path v-if="privremena" class="match-crta privremena" :d="privremena.d" :stroke="privremena.boja" />
      </svg>

      <div class="match-col">
        <button
          v-for="l in pitanje.lijevo"
          :key="'l' + l.id"
          class="match-item match-lijevi"
          :data-l="l.id"
          :class="{
            selected: odabranLijevi === l.id,
            linked: veze[l.id] !== undefined,
            ok: answered && vezaTocna(l.id),
            no: answered && veze[l.id] !== undefined && !vezaTocna(l.id)
          }"
          :style="bojaRuba(l.id)"
          :disabled="answered"
          @pointerdown="pocniVuci($event, l.id)"
          @pointermove="vuci"
          @pointerup="pustiVuci"
          @pointercancel="prekiniVuci"
          @click="klikLijevi(l.id)"
        >
          <span class="match-tekst">{{ l.tekst }}</span>
          <span v-if="veze[l.id] !== undefined" class="match-veza" :style="{ background: bojaVeze(l.id) }">{{ oznakaVeze(l.id) }}</span>
        </button>
      </div>

      <div class="match-col">
        <button
          v-for="d in pitanje.desno"
          :key="'d' + d.id"
          class="match-item"
          :data-d="d.id"
          :class="{
            linked: vezanDesni(d.id),
            dim: !answered && odabranLijevi !== null && vezanDesni(d.id),
            ok: answered && vezaTocna(lijeviZaDesni(d.id)),
            no: answered && !vezaTocna(lijeviZaDesni(d.id))
          }"
          :style="bojaRuba(lijeviZaDesni(d.id))"
          :disabled="answered"
          @click="spoji(d.id)"
        >
          <span v-if="vezanDesni(d.id)" class="match-veza" :style="{ background: bojaVeze(lijeviZaDesni(d.id)) }">{{ oznakaVeze(lijeviZaDesni(d.id)) }}</span>
          <span class="match-tekst">{{ d.tekst }}</span>
        </button>
      </div>
    </div>

    <p v-if="!answered" class="match-uputa">
      {{ odabranLijevi === null ? 'Klikni riječ lijevo pa njezin par desno ili je povuci do para.' : 'Sada klikni par desno.' }}
    </p>

    <button
      v-if="!answered"
      class="btn-check match-check"
      :disabled="!sveSpojeno || provjeravam"
      @click="$emit('provjeri')"
    >{{ sveSpojeno ? 'Provjeri' : `Spoji još ${preostalo}` }}</button>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuizStore } from '../stores/quiz'

const props = defineProps({
  pitanje: { type: Object, required: true },
  provjeravam: { type: Boolean, default: false }
})
defineEmits(['provjeri'])

const store = useQuizStore()
const { veze, odabranLijevi, answered, vezeTocne } = storeToRefs(store)
const { odaberiLijevi, postaviLijevi, spoji, razvezi } = store

// Pet jasno različitih boja (najviše 5 parova). Redoslijed: narančasta,
// plava, zelena, ljubičasta, ružičasta — susjedne se dobro razlikuju.
const BOJE = ['#E8590C', '#1C7ED6', '#2F9E44', '#9C36B5', '#D6336C']

const platno = ref(null)
const crte = ref([])
const privremena = ref(null)

const redVeza = computed(() => {
  const m = {}
  Object.keys(veze.value).forEach((l, i) => { m[l] = i })
  return m
})
const ukupno = computed(() => props.pitanje.lijevo?.length || 0)
const preostalo = computed(() => ukupno.value - Object.keys(veze.value).length)
const sveSpojeno = computed(() => ukupno.value > 0 && preostalo.value === 0)

const bojaVeze = (l) => (l === undefined || redVeza.value[l] === undefined ? null : BOJE[redVeza.value[l] % BOJE.length])
const sljedecaBoja = () => BOJE[Object.keys(veze.value).length % BOJE.length]
const oznakaVeze = (l) => (redVeza.value[l] ?? 0) + 1
const vezanDesni = (d) => Object.values(veze.value).map(String).includes(String(d))
const lijeviZaDesni = (d) => Object.keys(veze.value).find((k) => String(veze.value[k]) === String(d))
const vezaTocna = (l) => vezeTocne.value[l] === true
function bojaRuba (l) {
  if (answered.value) return null
  const b = bojaVeze(l)
  return b ? { borderColor: b, background: `${b}14` } : null
}

// ── Crte ─────────────────────────────────────────────────────────────
const krivulja = (x1, y1, x2, y2) => {
  const k = Math.max(18, Math.abs(x2 - x1) / 2)
  return `M ${x1} ${y1} C ${x1 + k} ${y1}, ${x2 - k} ${y2}, ${x2} ${y2}`
}
const nadi = (sel) => platno.value?.querySelector(sel)

function izracunajCrte () {
  if (!platno.value) return
  const p = platno.value.getBoundingClientRect()
  const nove = []
  for (const [l, d] of Object.entries(veze.value)) {
    const el = nadi(`[data-l="${CSS.escape(String(l))}"]`)
    const ed = nadi(`[data-d="${CSS.escape(String(d))}"]`)
    if (!el || !ed) continue
    const a = el.getBoundingClientRect(), b = ed.getBoundingClientRect()
    const x1 = a.right - p.left, y1 = a.top + a.height / 2 - p.top
    const x2 = b.left - p.left, y2 = b.top + b.height / 2 - p.top
    const stanje = answered.value ? (vezaTocna(l) ? 'ok' : 'no') : ''
    nove.push({ kljuc: `${l}-${d}`, d: krivulja(x1, y1, x2, y2), x1, y1, x2, y2, boja: bojaVeze(l), stanje })
  }
  crte.value = nove
}

watch([veze, answered, vezeTocne, () => props.pitanje], () => nextTick(izracunajCrte), { deep: true })
let promatrac = null
onMounted(() => {
  nextTick(izracunajCrte)
  window.addEventListener('resize', izracunajCrte)
  if (typeof ResizeObserver !== 'undefined') {
    promatrac = new ResizeObserver(izracunajCrte)
    promatrac.observe(platno.value)
  }
  document.fonts?.ready?.then(izracunajCrte)
})
onUnmounted(() => {
  window.removeEventListener('resize', izracunajCrte)
  promatrac?.disconnect()
})

// ── Povlačenje od lijevog do desnog člana ─────────────────────────────
let vucenje = null
let potisniKlik = false

function pocniVuci (e, id) {
  if (answered.value || (e.pointerType === 'mouse' && e.button !== 0)) return
  e.currentTarget.setPointerCapture?.(e.pointerId)
  vucenje = { id, x: e.clientX, y: e.clientY, pomaknuto: false, el: e.currentTarget }
}

function vuci (e) {
  if (!vucenje) return
  if (!vucenje.pomaknuto && Math.hypot(e.clientX - vucenje.x, e.clientY - vucenje.y) < 8) return
  if (!vucenje.pomaknuto) {
    vucenje.pomaknuto = true
    if (veze.value[vucenje.id] !== undefined) razvezi(vucenje.id)
    postaviLijevi(vucenje.id)
  }
  const p = platno.value.getBoundingClientRect()
  const a = vucenje.el.getBoundingClientRect()
  const x1 = a.right - p.left, y1 = a.top + a.height / 2 - p.top
  privremena.value = { d: krivulja(x1, y1, e.clientX - p.left, e.clientY - p.top), boja: sljedecaBoja() }
}

function pustiVuci (e) {
  if (!vucenje) return
  if (vucenje.pomaknuto) {
    potisniKlik = true
    const cilj = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-d]')
    const desni = cilj && platno.value.contains(cilj)
      ? props.pitanje.desno.find((x) => String(x.id) === cilj.dataset.d) : null
    if (desni) spoji(desni.id)
    else odabranLijevi.value = null
    // Klik nakon povlačenja ne smije poništiti vezu; ako ga preglednik ne
    // pošalje (dodir), oznaka se sama briše.
    setTimeout(() => { potisniKlik = false }, 80)
  }
  vucenje = null
  privremena.value = null
}

function prekiniVuci () {
  if (vucenje?.pomaknuto) odabranLijevi.value = null
  vucenje = null
  privremena.value = null
}

function klikLijevi (id) {
  if (potisniKlik) { potisniKlik = false; return }
  if (veze.value[id] !== undefined && !answered.value) razvezi(id)
  else odaberiLijevi(id)
}
</script>
