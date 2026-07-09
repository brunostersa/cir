import { supabaseAdmin } from '../../../lib/supabaseAdmin'

const ALLOWED_COLUMNS = ['created_at','customer_name','customer_phone','estado','source','utm_source']

export default async function handler(req, res) {
  if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase not configured' })

  const {
    page = '1',
    per_page = '25',
    source,
    estado,
    utm_source,
    date_from,
    date_to,
    search,
    order_by = 'created_at',
    order_dir = 'desc',
    mode,
  } = req.query

  const col = ALLOWED_COLUMNS.includes(order_by) ? order_by : 'created_at'
  const asc = order_dir === 'asc'

  let query = supabaseAdmin.from('leads').select('*', { count: 'exact' })

  if (source)     query = query.eq('source', source)
  if (estado)     query = query.eq('estado', estado)
  if (utm_source) query = query.eq('utm_source', utm_source)
  // BRT = UTC-3: início do dia BRT = 03:00 UTC; fim do dia BRT = 03:00 UTC do dia seguinte
  if (date_from)  query = query.gte('created_at', date_from + 'T03:00:00+00:00')
  if (date_to) {
    const end = new Date(date_to + 'T03:00:00+00:00')
    end.setDate(end.getDate() + 1)
    query = query.lt('created_at', end.toISOString())
  }
  if (search) {
    const s = search.replace(/'/g, "''")
    query = query.or(`customer_name.ilike.%${s}%,customer_phone.ilike.%${s}%,customer_email.ilike.%${s}%`)
  }

  query = query.order(col, { ascending: asc })
  if (col !== 'created_at') query = query.order('created_at', { ascending: false })

  if (mode === 'chart') {
    query = query.limit(5000)
  } else {
    const p  = Math.max(1, parseInt(page))
    const pp = Math.min(100, Math.max(1, parseInt(per_page)))
    query = query.range((p - 1) * pp, p * pp - 1)
  }

  const { data, error, count } = await query
  if (error) return res.status(500).json({ error: error.message })

  res.setHeader('Cache-Control', 'no-store')
  return res.status(200).json({ data, count, page: parseInt(page), per_page: parseInt(per_page) })
}
