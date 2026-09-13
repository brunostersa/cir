import { supabase } from '../../lib/supabaseClient'
import { recordAttempt } from '../../lib/rateLimit'
import { getNameError, getPhoneError } from '../../lib/leadValidation'
import { CLIENT_ID } from '../../lib/client'

const RATE_LIMIT = { limit: 10, windowMs: 10 * 60 * 1000 } // 10 envios / 10 min por IP

function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for']
  if (fwd) return fwd.split(',')[0].trim()
  return req.socket?.remoteAddress || 'unknown'
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!supabase) {
    console.error('Failed to save lead: SUPABASE_URL/SUPABASE_ANON_KEY not configured')
    return res.status(500).json({ error: 'Lead storage not configured' })
  }

  const { allowed, retryAfterMs } = recordAttempt(`lead:${getClientIp(req)}`, RATE_LIMIT)
  if (!allowed) {
    res.setHeader('Retry-After', Math.ceil(retryAfterMs / 1000).toString())
    return res.status(429).json({ error: 'Too many requests' })
  }

  const {
    phone, message, source, cidade, estado, page_url, referrer, customer_name, customer_phone,
    customer_email, customer_company,
    utm_source, utm_medium, utm_campaign, utm_term, utm_content,
    quiz_tipo_produto, quiz_quantidade, quiz_arte_pronta, quiz_acabamento, quiz_prazo, quiz_investimento, destino,
  } = req.body || {}

  if (!phone || !message || !source) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  if (customer_name && getNameError(customer_name)) {
    return res.status(400).json({ error: getNameError(customer_name) })
  }
  if (customer_phone && getPhoneError(customer_phone)) {
    return res.status(400).json({ error: getPhoneError(customer_phone) })
  }

  const { error } = await supabase.from('leads').insert({
    client_id: CLIENT_ID,
    phone,
    message,
    source,
    cidade: cidade || null,
    estado: estado || null,
    page_url: page_url || req.headers.referer || null,
    // req.headers.referer is the HTTP Referer of THIS API request, which for
    // a fetch/sendBeacon call fired from /orcamento is always /orcamento
    // itself — never the page the visitor actually arrived from. document.referrer
    // (captured client-side in logLead.js/portfolio.js, before this request
    // is made) is the only field that can carry real origin (Google,
    // Instagram, a city landing page). `referrer === ''` is a genuine "no
    // referrer" signal from the client (typed URL, browser stripped it) —
    // distinct from the field being entirely absent (older cached bundle
    // mid-deploy that hasn't shipped this fix yet), which is the only case
    // that should still fall back to the old (less accurate) header behavior.
    referrer: referrer !== undefined ? (referrer || null) : (req.headers.referer || null),
    user_agent: req.headers['user-agent'] || null,
    customer_name: customer_name || null,
    customer_phone: customer_phone || null,
    customer_email: customer_email || null,
    customer_company: customer_company || null,
    utm_source: utm_source || null,
    utm_medium: utm_medium || null,
    utm_campaign: utm_campaign || null,
    utm_term: utm_term || null,
    utm_content: utm_content || null,
    quiz_tipo_produto: quiz_tipo_produto || null,
    quiz_quantidade: quiz_quantidade || null,
    quiz_arte_pronta: quiz_arte_pronta || null,
    quiz_acabamento: quiz_acabamento || null,
    quiz_prazo: quiz_prazo || null,
    quiz_investimento: quiz_investimento || null,
    destino: destino || null,
  })

  if (error) {
    console.error('Failed to save lead:', error.message)
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({ ok: true })
}
