const TZ = 'America/Sao_Paulo'

function dayKey(date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
}

function weekKey(date) {
  // ISO week key based on the Monday of that week, in TZ-local terms
  const local = new Date(new Intl.DateTimeFormat('en-US', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date))
  const day = (local.getUTCDay() + 6) % 7 // 0 = Monday
  local.setUTCDate(local.getUTCDate() - day)
  return dayKey(local)
}

function monthKey(date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit' }).format(date)
}

function buildBuckets(leads, keyFn, count, step) {
  const counts = new Map()
  for (const lead of leads) {
    const key = keyFn(new Date(lead.created_at))
    counts.set(key, (counts.get(key) || 0) + 1)
  }

  const buckets = []
  const now = new Date()
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now)
    if (step === 'day') d.setDate(d.getDate() - i)
    if (step === 'week') d.setDate(d.getDate() - i * 7)
    if (step === 'month') d.setMonth(d.getMonth() - i)
    const key = keyFn(d)
    buckets.push({ key, count: counts.get(key) || 0 })
  }
  return buckets
}

function topCounts(leads, field, limit = 8) {
  const counts = new Map()
  for (const lead of leads) {
    const value = lead[field] || '—'
    counts.set(value, (counts.get(value) || 0) + 1)
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function computeLeadStats(leads) {
  const now = new Date()
  const todayKey = dayKey(now)
  const thisWeekKey = weekKey(now)
  const thisMonthKey = monthKey(now)

  const total = leads.length
  const today = leads.filter(l => dayKey(new Date(l.created_at)) === todayKey).length
  const thisWeek = leads.filter(l => weekKey(new Date(l.created_at)) === thisWeekKey).length
  const thisMonth = leads.filter(l => monthKey(new Date(l.created_at)) === thisMonthKey).length

  return {
    total,
    today,
    thisWeek,
    thisMonth,
    daily: buildBuckets(leads, dayKey, 14, 'day'),
    weekly: buildBuckets(leads, weekKey, 12, 'week'),
    monthly: buildBuckets(leads, monthKey, 12, 'month'),
    topSources: topCounts(leads, 'source'),
    topCidades: topCounts(leads, 'cidade'),
    topEstados: topCounts(leads, 'estado'),
    topUtmSources: topCounts(leads, 'utm_source'),
    topUtmCampaigns: topCounts(leads, 'utm_campaign'),
    recent: leads.slice(0, 20),
  }
}
