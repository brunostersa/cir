import { getStoredUtms } from './utm'
import { trackEvent } from './gtag'

export function logLead({
  phone, message, source, cidade, estado, customer_name, customer_phone,
  quiz_tipo_produto, quiz_quantidade, quiz_arte_pronta, quiz_acabamento, quiz_prazo, quiz_investimento, destino,
}) {
  if (typeof window === 'undefined') return

  const utms = getStoredUtms()

  // Sinal de conversão pro GTM (GA4/Google Ads), independente do pipeline
  // próprio de armazenamento do lead abaixo.
  trackEvent('generate_lead', { lead_source: source, ...utms })

  const payload = JSON.stringify({
    phone,
    message,
    source,
    cidade,
    estado,
    customer_name,
    customer_phone,
    quiz_tipo_produto,
    quiz_quantidade,
    quiz_arte_pronta,
    quiz_acabamento,
    quiz_prazo,
    quiz_investimento,
    destino,
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
