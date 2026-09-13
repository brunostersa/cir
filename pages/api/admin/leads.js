import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { CLIENT_ID } from '../../../lib/client'

const ALLOWED_COLUMNS = ['created_at','customer_name','customer_phone','estado','source','utm_source','destino']

// PostgREST usa vírgula e parênteses como sintaxe de filtro; envolver o valor em aspas
// duplas (com \ e " escapados) trata o conteúdo como literal — ver docs do PostgREST
// sobre "Escaping reserved characters" no filtro .or().
function escapePostgrestValue(value) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

export default async function handler(req, res) {
  if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase not configured' })

  const {
    page = '1',
    per_page = '25',
    source,
    estado,
    utm_source,
    destino,
    date_from,
    date_to,
    search,
    order_by = 'created_at',
    order_dir = 'desc',
    mode,
  } = req.query

  const col = ALLOWED_COLUMNS.includes(order_by) ? order_by : 'created_at'
  const asc = order_dir === 'asc'

  // Builds a fresh query builder every time it's called, rather than reusing
  // one across multiple .range() calls — the Supabase JS client's documented
  // pattern is one .range()/await per builder instance, so paginating a loop
  // by re-deriving the same filtered-and-ordered query per page is the safe
  // way to page through results.
  function buildQuery() {
    let q = supabaseAdmin.from('leads').select('*', { count: 'exact' }).eq('client_id', CLIENT_ID)
    if (source)     q = q.eq('source', source)
    if (estado)     q = q.eq('estado', estado)
    if (utm_source) q = q.eq('utm_source', utm_source)
    if (destino)    q = q.eq('destino', destino)
    // BRT = UTC-3: início do dia BRT = 03:00 UTC; fim do dia BRT = 03:00 UTC do dia seguinte
    if (date_from)  q = q.gte('created_at', date_from + 'T03:00:00+00:00')
    if (date_to) {
      const end = new Date(date_to + 'T03:00:00+00:00')
      end.setDate(end.getDate() + 1)
      q = q.lt('created_at', end.toISOString())
    }
    if (search) {
      const s = escapePostgrestValue(search)
      q = q.or(`customer_name.ilike."%${s}%",customer_phone.ilike."%${s}%",customer_email.ilike."%${s}%"`)
    }
    q = q.order(col, { ascending: asc })
    if (col !== 'created_at') q = q.order('created_at', { ascending: false })
    q = q.order('id', { ascending: false })
    return q
  }

  if (mode === 'chart') {
    // Supabase's PostgREST caps any single response at db-max-rows (1000 by
    // default), regardless of the .limit() value requested — a .limit(5000)
    // call silently comes back with only the first 1000 rows, no error. This
    // client already has 1.197 leads (past the 1000 cutoff), so every chart,
    // KPI, and the CSV export were already silently computed over an
    // incomplete ~1000-row slice, not the real dataset. Page through with
    // .range() in a loop instead.
    const PAGE_SIZE = 1000
    const MAX_ROWS = 20000
    let allData = []
    for (let from = 0; from < MAX_ROWS; from += PAGE_SIZE) {
      const { data: pageData, error: pageError } = await buildQuery().range(from, from + PAGE_SIZE - 1)
      if (pageError) return res.status(500).json({ error: pageError.message })
      allData = allData.concat(pageData)
      if (pageData.length < PAGE_SIZE) break
    }
    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json({ data: allData, count: allData.length })
  }

  const p  = Math.max(1, parseInt(page))
  const pp = Math.min(100, Math.max(1, parseInt(per_page)))

  const { data, error, count } = await buildQuery().range((p - 1) * pp, p * pp - 1)
  if (error) return res.status(500).json({ error: error.message })

  res.setHeader('Cache-Control', 'no-store')
  return res.status(200).json({ data, count, page: parseInt(page), per_page: parseInt(per_page) })
}
