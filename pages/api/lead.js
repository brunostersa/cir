import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!supabase) {
    console.error('Failed to save lead: SUPABASE_URL/SUPABASE_ANON_KEY not configured')
    return res.status(500).json({ error: 'Lead storage not configured' })
  }

  const {
    phone, message, source, cidade, estado, page_url, customer_name, customer_phone,
    customer_email, customer_company,
    utm_source, utm_medium, utm_campaign, utm_term, utm_content,
  } = req.body || {}

  if (!phone || !message || !source) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const { error } = await supabase.from('leads').insert({
    phone,
    message,
    source,
    cidade: cidade || null,
    estado: estado || null,
    page_url: page_url || req.headers.referer || null,
    referrer: req.headers.referer || null,
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
  })

  if (error) {
    console.error('Failed to save lead:', error.message)
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({ ok: true })
}
