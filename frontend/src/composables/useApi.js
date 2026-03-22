import { ref } from 'vue'

const API_BASE = '/api'

export function useApi() {
  const loading = ref(false)
  const error = ref('')

  const token = () => localStorage.getItem('ucilica_token') || ''

  async function request(path, opts = {}, retries = 3) {
    loading.value = true
    error.value = ''
    try {
      const headers = { 'Content-Type': 'application/json' }
      const t = token()
      if (t) headers['Authorization'] = `Bearer ${t}`

      const res = await fetch(API_BASE + path, { ...opts, headers })

      // Safely parse JSON — handle empty or non-JSON responses
      const text = await res.text()
      let data
      try {
        data = text ? JSON.parse(text) : {}
      } catch {
        throw new Error(res.ok ? 'Neispravan odgovor servera' : `Greška ${res.status}: ${res.statusText}`)
      }

      if (!res.ok) throw new Error(data.error || `Greška ${res.status}`)
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

  return { loading, error, get, post, patch }
}
