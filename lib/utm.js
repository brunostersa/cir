const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
const STORAGE_KEY = 'cir_utms'
// This site's lead form lives on a separate page (/orcamento) from the
// landing page a visitor actually arrives on (a city SEO page, home, etc.).
// document.referrer read AT SUBMIT TIME is always the last internal page
// (the city page → /orcamento hop), never the real entry source (Google,
// Instagram) — that's what was making ~97% of leads look "Direto" even
// though this site runs an active SEO program. Capturing document.referrer
// once, on the FIRST page of the session, and persisting it the same way
// UTMs already are, preserves the real entry referrer through the rest of
// the session's internal navigation.
const ENTRY_REFERRER_KEY = 'cir_entry_referrer'

// Plataformas de anúncio anexam seu próprio click-id em vez de (ou junto com)
// utm_* quando o auto-tagging está ligado — ex: Google Ads auto-tagging só
// adiciona `gclid`, sem utm_source nenhum. Sem isso, esse tráfego pago cairia
// com utm_source vazio e ficaria indistinguível de orgânico/direto.
const CLICK_ID_SOURCES = [
  { params: ['gclid', 'gbraid', 'wbraid'], utm_source: 'google', utm_medium: 'cpc' },
  { params: ['fbclid'], utm_source: 'facebook', utm_medium: 'paid_social' },
  { params: ['msclkid'], utm_source: 'bing', utm_medium: 'cpc' },
  { params: ['ttclid'], utm_source: 'tiktok', utm_medium: 'paid_social' },
]

// First-touch attribution: whichever UTM/click-id landed first in this
// session wins and is never overwritten. Without this, a later link clicked
// in the same session — even one with only a partial querystring (say, just
// utm_campaign from a retargeting link with no utm_source/medium) — would
// silently replace the original attribution, discarding the channel that
// actually brought this person in for a possibly-incomplete later touch.
export function captureUtms() {
  if (typeof window === 'undefined') return
  if (sessionStorage.getItem(STORAGE_KEY)) return // first touch already captured this session

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

// Only writes on the FIRST call of the session — every later call (each
// in-app route change fires this too, via _app.js) must not overwrite it
// with document.referrer at that point, which would just be the previous
// internal page. An explicit empty-string sentinel (not just skipping the
// write) distinguishes "already checked, genuinely no referrer" (typed URL,
// browser privacy stripping it) from "never checked yet" — both look like
// sessionStorage.getItem returning nothing, but they're different for
// getEntryReferrer()'s persistOnce below going forward in the session.
export function captureEntryReferrer() {
  if (typeof window === 'undefined') return
  if (sessionStorage.getItem(ENTRY_REFERRER_KEY) !== null) return
  sessionStorage.setItem(ENTRY_REFERRER_KEY, document.referrer || '')
}

export function getEntryReferrer() {
  if (typeof window === 'undefined') return null
  try {
    return sessionStorage.getItem(ENTRY_REFERRER_KEY) || null
  } catch (e) {
    return null
  }
}
