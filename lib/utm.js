const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
const STORAGE_KEY = 'cir_utms'

// Plataformas de anúncio anexam seu próprio click-id em vez de (ou junto com)
// utm_* quando o auto-tagging está ligado — ex: Google Ads auto-tagging só
// adiciona `gclid`, sem utm_source nenhum. Sem isso, esse tráfego pago cairia
// com utm_source vazio e ficaria indistinguível de orgânico/direto.
const CLICK_ID_SOURCES = [
  { params: ['gclid', 'gbraid', 'wbraid'], utm_source: 'google', utm_medium: 'cpc' },
  { params: ['fbclid'], utm_source: 'facebook', utm_medium: 'paid_social' },
  { params: ['msclkid'], utm_source: 'bing', utm_medium: 'cpc' },
]

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

  if (!found.utm_source) {
    const match = CLICK_ID_SOURCES.find(({ params: clickParams }) => clickParams.some((p) => params.has(p)))
    if (match) {
      found.utm_source = match.utm_source
      found.utm_medium = match.utm_medium
      hasAny = true
    }
  }

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
