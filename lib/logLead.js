import { getStoredUtms } from './utm'

export function logLead({ phone, message, source, cidade, estado, customer_name, customer_phone }) {
  if (typeof window === 'undefined') return

  const utms = getStoredUtms()

  const payload = JSON.stringify({
    phone,
    message,
    source,
    cidade,
    estado,
    customer_name,
    customer_phone,
    page_url: window.location.href,
    utm_source: utms.utm_source,
    utm_medium: utms.utm_medium,
    utm_campaign: utms.utm_campaign,
    utm_term: utms.utm_term,
    utm_content: utms.utm_content,
  })

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/lead', new Blob([payload], { type: 'application/json' }))
    } else {
      fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      })
    }
  } catch (e) {
    // never block the WhatsApp redirect on a logging failure
  }
}
