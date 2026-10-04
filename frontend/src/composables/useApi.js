import { ref } from 'vue'

const API_BASE = '/api'

export function useApi() {
  const loading = ref(false)
  const error = ref('')

  const token = () => localStorage.getItem('ucilica_token') || ''

  // Nasumična oznaka uređaja za goste: server po njoj ne vraća pitanja iz
  // kviza koji je gost upravo napustio. Nije vezana ni uz kakve osobne podatke.
  const gostId = () => {
    try {
      let id = localStorage.getItem('ucilica_gost')
      if (!id) {
        id = (crypto.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`)
        localStorage.setItem('ucilica_gost', id)
      }
      return id
    } catch {
      return ''
    }
  }

  async function request(path, opts = {}, retries = 3) {
    loading.value = true
    error.value = ''
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(opts.headers || {})
      }
      const t = token()
      if (t) headers['Authorization'] = `Bearer ${t}`
      else {
        const g = gostId()
        if (g) headers['X-Gost-Id'] = g
      }

      const res = await fetch(API_BASE + path, { ...opts, headers })

      // Safely parse JSON — handle empty or non-JSON responses
      const text = await res.text()
      let data
      try {
        data = text ? JSON.parse(text) : {}
      } catch {
        throw new Error(res.ok ? 'Neispravan odgovor servera' : `Greška ${res.status}: ${res.statusText}`)
      }

      if (!res.ok) {
        const greska = new Error(data.error || `Greška ${res.status}`)
        greska.status = res.status
        throw greska
      }
      return data
    } catch (e) {
      // Retry on connection/parse errors (backend still starting)
      const retryable = e.message.includes('Failed to fetch')
        || e.message.includes('NetworkError')
        || e.message.includes('Neispravan odgovor')
        || e.message.includes('Greška 50')
      if (retries > 0 && retryable) {
        await new Promise(r => setTimeout(r, 1000))
        return request(path, opts, retries - 1)
      }
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const get = (path) => request(path)
  const post = (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) })
  const patch = (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) })
  const put = (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) })
  // Brisanje se ne ponavlja automatski: ponovni pokušaj nakon greške mogao bi
  // obrisati nešto drugo ili zbuniti korisnika porukom „nije pronađeno”.
  // Slanje koje se ne smije ponoviti samo od sebe (npr. prijava pitanja — inače dvije e-poruke)
  const postJednom = (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }, 0)
  const del = (path, body) => request(path, { method: 'DELETE', body: JSON.stringify(body || {}) }, 0)

  return { loading, error, get, post, postJednom, patch, put, del }
}
