const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
const STORAGE_KEY = 'cir_utms'

export function captureUtms() {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams(window.location.search)
  const found = {}
  let hasAny = false

  UTM_KEYS.forEach((key) => {
    const value = params.get(key)
    if (value) {
      found[key] = value
      hasAny = true
    }
  })

  if (hasAny) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found))
  }
}

export function getStoredUtms() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (e) {
    return {}
  }
}
