import Head from 'next/head'
import { useEffect, useRef, useState, useCallback } from 'react'
import {
  TIPO_PRODUTO_OPTIONS, QUANTIDADE_OPTIONS, ARTE_OPTIONS, ACABAMENTO_OPTIONS, PRAZO_OPTIONS,
} from '../../lib/leadRouting'

// ── Constants ────────────────────────────────────────────────────────────
const SRC_LABELS = {
  'orcamento-rapido': 'Orçamento Rápido',
  'portfolio_download': 'LP Portfólio',
  'whatsapp-site': 'WhatsApp Site',
  'cidades-cir': 'Cidades CIR',
  'header_orcamento': 'Header',
  'footer_orcamento': 'Footer',
  'footer_projeto': 'Footer',
  'hero_orcamento': 'Hero',
  'fab_cidade': 'WhatsApp Flutuante (Cidade)',
  'fab_estado': 'WhatsApp Flutuante (Estado)',
  'fab_home': 'WhatsApp Flutuante (Home)',
  'sticky_mobile': 'Barra Fixa Mobile',
  'lead_popup': 'Popup de Saída',
  'cta_final_cidade': 'CTA Final (Cidade)',
  'cta_final_cidade_formulario': 'CTA Final (Cidade, formulário)',
  'cta_final_estado_orcamento': 'CTA Final (Estado)',
  'cta_final_home_orcamento': 'CTA Final (Home)',
  'consultoria_fab': 'Consultoria (Flutuante)',
  'consultoria_hero': 'Consultoria (Hero)',
  'consultoria_cta_final': 'Consultoria (CTA Final)',
  'consultoria_includes': 'Consultoria (Inclusos)',
  'consultoria_nav': 'Consultoria (Menu)',
  'consultoria_sticky': 'Consultoria (Barra Fixa)',
  'products_carousel_card': 'Carrossel de Produtos',
  'products_carousel_orcamento': 'Carrossel de Produtos (CTA)',
  'portfolio_agendar_visita': 'Portfólio (Agendar Visita)',
  'acabamentos_hub_cta': 'Acabamentos (CTA)',
  'servicos_hub_cta': 'Serviços (CTA)',
  'servicos_intro': 'Serviços (Intro)',
  '404_page': 'Página 404',
}
const SRC_COLORS = {
  'orcamento-rapido': '#e8613a',
  'portfolio_download': '#5d9c6e',
  'whatsapp-site': '#4a90e2',
  'cidades-cir': '#9b6ba8',
}
const SRC_FALLBACK_PALETTE = [
  '#e8613a', '#5d9c6e', '#4a90e2', '#9b6ba8', '#c8813a', '#4a7c8c',
  '#a5673f', '#6b8e5a', '#9c5555', '#5a6b8c', '#b85c8a', '#7a9e6a',
]
function colorForSrc(s, i) { return SRC_COLORS[s] || SRC_FALLBACK_PALETTE[i % SRC_FALLBACK_PALETTE.length] }
function labelForSrc(s) { return SRC_LABELS[s] || s }
const DESTINO_LABELS = { cirgrafica: 'CIR Gráfica', carbono: 'Carbono' }
const DESTINO_COLORS = { cirgrafica: '#5d9c6e', carbono: '#c8813a' }
const SORT_COLS = ['customer_name','customer_phone','estado','source','utm_source','destino','created_at']
const PER_PAGE_OPTS = [25, 50, 100]

function labelFromOptions(options, value) {
  return options.find((o) => o.value === value)?.label || value || null
}

function fmtPhone(p) {
  if (!p) return '—'
  const d = p.replace(/\D/g, '')
  if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`
  return p
}
function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', year:'2-digit', hour:'2-digit', minute:'2-digit' })
}
function getHash() {
  if (typeof window === 'undefined') return {}
  try { return Object.fromEntries(new URLSearchParams(window.location.hash.slice(1))) } catch { return {} }
}
function setHash(obj) {
  const p = new URLSearchParams(Object.fromEntries(Object.entries(obj).filter(([,v])=>v)))
  history.replaceState(null,'','#'+p.toString())
}
function simpleMovingAverage(values, window = 7) {
  const result = []
  let sum = 0
  for (let i = 0; i < values.length; i++) {
    sum += values[i]
    if (i < window - 1) {
      result.push(null)
    } else {
      if (i >= window) sum -= values[i - window]
      result.push(sum / window)
    }
  }
  return result
}
function getSparklineData(data, field, limit = 30) {
  const counts = {}
  data.forEach(r => {
    if (r[field] == null) return
    const key = r[field]
    counts[key] = (counts[key] || 0) + 1
  })
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit)
  return sorted.map(([label, count]) => ({ label, count }))
}

// ── Component ────────────────────────────────────────────────────────────
export default function LeadsDashboard() {
  const [filters, setFilters] = useState({ date_from:'', date_to:'', source:'', estado:'', utm_source:'', destino:'', search:'' })
  const [orderBy, setOrderBy]   = useState('created_at')
  const [orderDir, setOrderDir] = useState('desc')
  const [perPage, setPerPage]   = useState(25)
  const [page, setPage]         = useState(1)

  const [tableData, setTableData]   = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [chartRows, setChartRows]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [lastUpdate, setLastUpdate] = useState('')

  const [estados, setEstados]   = useState([])
  const [utmSrcs, setUtmSrcs]   = useState([])
  const [sources, setSources]   = useState([])

  const [dayWindow, setDayWindow] = useState(15)
  const [detailLead, setDetailLead] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [viewChart, setViewChart] = useState({}) // { chartName: 'table' || 'chart' }

  const searchTimer = useRef(null)
  const chartMesRef = useRef(null)
  const chartEsRef  = useRef(null)
  const chartDayRef = useRef(null)
  const chartDestinoRef = useRef(null)
  const chartTipoRef = useRef(null)
  const chartAcabRef = useRef(null)
  const chartMesInst = useRef(null)
  const chartEsInst  = useRef(null)
  const chartDayInst = useRef(null)
  const chartDestinoInst = useRef(null)
  const chartTipoInst = useRef(null)
  const chartAcabInst = useRef(null)

  // restore from hash on mount
  useEffect(() => {
    const h = getHash()
    setFilters({
      date_from:   h.date_from   || '',
      date_to:     h.date_to     || '',
      source:      h.source      || '',
      estado:      h.estado      || '',
      utm_source:  h.utm_source  || '',
      destino:     h.destino     || '',
      search:      h.search      || '',
    })
    if (h.order_by)  setOrderBy(h.order_by)
    if (h.order_dir) setOrderDir(h.order_dir)
    if (h.per_page)  setPerPage(parseInt(h.per_page)||25)
    if (h.page)      setPage(parseInt(h.page)||1)
  }, [])

  const api = useCallback(async (params={}) => {
    const qs = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([,v])=>v!=null&&v!=='')))
    const r = await fetch('/api/admin/leads?' + qs, { credentials:'include' })
    if (!r.ok) throw new Error(r.status)
    return r.json()
  }, [])

  const loadAll = useCallback(async (f=filters, ob=orderBy, od=orderDir, pp=perPage, pg=page) => {
    setLoading(true)
    setHash({ ...f, order_by:ob!=='created_at'?ob:'', order_dir:od!=='desc'?od:'', per_page:pp!==25?pp:'', page:pg>1?pg:'' })
    try {
      const [chart, table] = await Promise.all([
        api({ ...f, mode:'chart' }),
        api({ ...f, order_by:ob, order_dir:od, per_page:pp, page:pg }),
      ])
      setChartRows(chart.data||[])
      setTableData(table.data||[])
      setTotalCount(table.count||0)
      setEstados([...new Set((chart.data||[]).map(r=>r.estado).filter(Boolean))].sort())
      setUtmSrcs([...new Set((chart.data||[]).map(r=>r.utm_source).filter(Boolean))].sort())
      setSources([...new Set((chart.data||[]).map(r=>r.source).filter(Boolean))].sort((a,b)=>labelForSrc(a).localeCompare(labelForSrc(b))))
      setLastUpdate(new Date().toLocaleTimeString('pt-BR'))
    } finally {
      setLoading(false)
    }
  }, [api, filters, orderBy, orderDir, perPage, page])

  const loadTable = useCallback(async (f=filters, ob=orderBy, od=orderDir, pp=perPage, pg=page) => {
    setLoading(true)
    setHash({ ...f, order_by:ob!=='created_at'?ob:'', order_dir:od!=='desc'?od:'', per_page:pp!==25?pp:'', page:pg>1?pg:'' })
    try {
      const table = await api({ ...f, order_by:ob, order_dir:od, per_page:pp, page:pg })
      setTableData(table.data||[])
      setTotalCount(table.count||0)
    } finally {
      setLoading(false)
    }
  }, [api, filters, orderBy, orderDir, perPage, page])

  // initial load
  useEffect(() => {
    const h = getHash()
    const f = { date_from:h.date_from||'', date_to:h.date_to||'', source:h.source||'', estado:h.estado||'', utm_source:h.utm_source||'', destino:h.destino||'', search:h.search||'' }
    const ob = h.order_by||'created_at', od = h.order_dir||'desc'
    const pp = parseInt(h.per_page)||25, pg = parseInt(h.page)||1
    loadAll(f, ob, od, pp, pg)
  }, []) // eslint-disable-line

  // draw charts
  useEffect(() => {
    if (!chartRows.length || typeof window === 'undefined') return
    import('chart.js').then(({ Chart, registerables }) => {
      Chart.register(...registerables)
      const isDark = isDarkMode
      const grid = isDark ? '#2a2a28' : '#e2e0d8'
      const muted = '#898781', prim = isDark?'#fff':'#0b0b0b'

      // monthly stacked with previous month overlay
      const months = {}
      chartRows.forEach(r => {
        const m=(r.created_at||'').slice(0,7); if(!m) return
        if(!months[m]) months[m]={}
        const s=r.source||'outro'; months[m][s]=(months[m][s]||0)+1
      })
      const mKeys = Object.keys(months).sort()
      const now = new Date()
      const currentMonth = now.toISOString().slice(0,7)
      const fmtM = m => {
        const[y,mo]=m.split('-')
        const label = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'][+mo-1]+'/'+y.slice(2)
        return m === currentMonth ? label + '*' : label
      }
      // origens presentes nos dados carregados, ordenadas por volume total (maior primeiro) —
      // dinâmico para nunca ficar desatualizado conforme novos `source=` surgem no site
      const srcTotals = {}
      chartRows.forEach(r => { const s = r.source || 'outro'; srcTotals[s] = (srcTotals[s]||0)+1 })
      const srcs = Object.keys(srcTotals).sort((a,b)=>srcTotals[b]-srcTotals[a])

      if (chartMesInst.current) chartMesInst.current.destroy()
      if (chartMesRef.current) {
        chartMesInst.current = new Chart(chartMesRef.current, {
          type:'bar',
          data:{ labels:mKeys.map(fmtM), datasets:srcs.map((s,i)=>({
            label:labelForSrc(s), data:mKeys.map(m=>months[m][s]||0),
            backgroundColor:colorForSrc(s,i), borderRadius:0, borderSkipped:false, stack:'a'
          }))},
          options:{
            responsive:true, maintainAspectRatio:false,
            plugins:{ legend:{display:false}, tooltip:{mode:'index', callbacks:{label:c=>` ${c.dataset.label}: ${c.parsed.y}`}} },
            scales:{
              x:{ stacked:true, ticks:{color:muted,font:{size:9},autoSkip:mKeys.length>18,maxRotation:45}, grid:{color:grid} },
              y:{ stacked:true, ticks:{color:muted,font:{size:10}}, grid:{color:grid}, border:{dash:[2,2]} }
            }
          }
        })
      }

      // by estado
      const eCounts={}
      chartRows.forEach(r=>{ if(r.estado) eCounts[r.estado]=(eCounts[r.estado]||0)+1 })
      const top=Object.entries(eCounts).sort((a,b)=>b[1]-a[1]).slice(0,12)

      if (chartEsInst.current) chartEsInst.current.destroy()
      if (chartEsRef.current) {
        chartEsInst.current = new Chart(chartEsRef.current, {
          type:'bar',
          data:{ labels:top.map(e=>e[0]), datasets:[{
            data:top.map(e=>e[1]),
            backgroundColor:top.map((_,i)=>i===0?'#c8813a':i<4?'#5d9c6e':'#c8813a44'),
            borderRadius:3, borderSkipped:false
          }]},
          options:{
            indexAxis:'y', responsive:true, maintainAspectRatio:false,
            plugins:{ legend:{display:false}, tooltip:{callbacks:{label:c=>` ${c.parsed.x} leads`}} },
            scales:{
              x:{ ticks:{color:muted,font:{size:10}}, grid:{color:grid}, border:{dash:[2,2]} },
              y:{ ticks:{color:prim,font:{size:11}}, grid:{display:false} }
            }
          }
        })
      }

      // por tipo de produto
      const tCounts = {}
      chartRows.forEach(r => { if (r.quiz_tipo_produto) tCounts[r.quiz_tipo_produto] = (tCounts[r.quiz_tipo_produto]||0)+1 })
      const topTipo = Object.entries(tCounts).sort((a,b)=>b[1]-a[1]).slice(0,8)

      if (chartTipoInst.current) chartTipoInst.current.destroy()
      if (chartTipoRef.current) {
        chartTipoInst.current = new Chart(chartTipoRef.current, {
          type:'bar',
          data:{ labels:topTipo.map(([k])=>labelFromOptions(TIPO_PRODUTO_OPTIONS,k)||k), datasets:[{
            data:topTipo.map(([,v])=>v),
            backgroundColor:'#7c5dbf',
            borderRadius:3, borderSkipped:false
          }]},
          options:{
            indexAxis:'y', responsive:true, maintainAspectRatio:false,
            plugins:{ legend:{display:false}, tooltip:{callbacks:{label:c=>` ${c.parsed.x} leads`}} },
            scales:{
              x:{ ticks:{color:muted,font:{size:10}}, grid:{color:grid}, border:{dash:[2,2]} },
              y:{ ticks:{color:prim,font:{size:10}}, grid:{display:false} }
            }
          }
        })
      }

      // acabamento × destino (empilhado)
      const acabOrder = ACABAMENTO_OPTIONS.map(o=>o.value)
      const destKeys = ['cirgrafica','carbono']
      const acabDestino = {}
      chartRows.forEach(r => {
        if (!r.quiz_acabamento) return
        const d = r.destino || 'outro'
        if (!acabDestino[r.quiz_acabamento]) acabDestino[r.quiz_acabamento] = {}
        acabDestino[r.quiz_acabamento][d] = (acabDestino[r.quiz_acabamento][d]||0)+1
      })
      const acabLabels = acabOrder.filter(a => acabDestino[a])

      if (chartAcabInst.current) chartAcabInst.current.destroy()
      if (chartAcabRef.current && acabLabels.length) {
        chartAcabInst.current = new Chart(chartAcabRef.current, {
          type:'bar',
          data:{
            labels:acabLabels.map(a=>labelFromOptions(ACABAMENTO_OPTIONS,a)||a),
            datasets:destKeys.map(d=>({
              label:DESTINO_LABELS[d]||d,
              data:acabLabels.map(a=>acabDestino[a][d]||0),
              backgroundColor:DESTINO_COLORS[d]||'#888', borderRadius:0, borderSkipped:false, stack:'a'
            }))
          },
          options:{
            responsive:true, maintainAspectRatio:false,
            plugins:{ legend:{position:'bottom', labels:{color:muted,font:{size:10},boxWidth:10}}, tooltip:{mode:'index', callbacks:{label:c=>` ${c.dataset.label}: ${c.parsed.y}`}} },
            scales:{
              x:{ stacked:true, ticks:{color:muted,font:{size:10}}, grid:{color:grid} },
              y:{ stacked:true, ticks:{color:muted,font:{size:10}}, grid:{color:grid}, border:{dash:[2,2]} }
            }
          }
        })
      }
    }).catch(err => console.error('Failed to load Chart.js:', err))
  }, [chartRows, isDarkMode])

  // daily chart with trend line
  useEffect(() => {
    if (!chartRows.length || typeof window === 'undefined') return
    import('chart.js').then(({ Chart, registerables }) => {
      Chart.register(...registerables)
      const isDark = isDarkMode
      const grid = isDark ? '#2a2a28' : '#e2e0d8'
      const muted = '#898781'

      const today = new Date(); today.setHours(0,0,0,0)
      const days = Array.from({length: dayWindow}, (_, i) => {
        const d = new Date(today); d.setDate(d.getDate() - (dayWindow - 1 - i))
        return d.toISOString().slice(0,10)
      })
      const toBRTDate = iso => { const d = new Date(iso); d.setHours(d.getHours() - 3); return d.toISOString().slice(0,10) }
      const dayCounts = {}
      chartRows.forEach(r => {
        if (!r.created_at) return
        const d = toBRTDate(r.created_at)
        dayCounts[d] = (dayCounts[d]||0) + 1
      })
      const vals = days.map(d => dayCounts[d]||0)
      const trend = simpleMovingAverage(vals, 7)
      const fmtDay = d => { const[,m,day]=d.split('-'); return `${day}/${m}` }
      const maxVal = Math.max(...vals, 1)

      if (chartDayInst.current) chartDayInst.current.destroy()
      if (chartDayRef.current) {
        chartDayInst.current = new Chart(chartDayRef.current, {
          type: 'bar',
          data: {
            labels: days.map(fmtDay),
            datasets: [{
              label: 'Leads',
              data: vals,
              backgroundColor: vals.map(v => v === maxVal ? '#e8613a' : '#e8613a55'),
              borderRadius: 3,
              borderSkipped: false,
            }, {
              label: 'Tendência (7d)',
              data: trend,
              type: 'line',
              borderColor: '#e8613a',
              borderWidth: 2,
              fill: false,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 0,
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend:{display:true, labels:{color:muted,font:{size:10},boxWidth:10}}, tooltip:{callbacks:{label:c=>`${c.dataset.label}: ${c.parsed.y?.toFixed(0)||0}`}} },
            scales: {
              x: { ticks:{color:muted,font:{size:9}}, grid:{color:grid} },
              y: { ticks:{color:muted,font:{size:10},precision:0}, grid:{color:grid}, border:{dash:[2,2]} }
            }
          }
        })
      }
    }).catch(err => console.error('Failed to load Chart.js:', err))
  }, [chartRows, dayWindow, isDarkMode])

  // ── Handlers ────────────────────────────────────────────────────────────
  function handleFilterChange(key, val) {
    const f = { ...filters, [key]: val }
    setFilters(f)
    if (key === 'search') {
      clearTimeout(searchTimer.current)
      searchTimer.current = setTimeout(() => { setPage(1); loadAll(f, orderBy, orderDir, perPage, 1) }, 500)
    }
  }

  function applyFilters() {
    setPage(1)
    loadAll(filters, orderBy, orderDir, perPage, 1)
  }

  function clearFilters() {
    const f = { date_from:'', date_to:'', source:'', estado:'', utm_source:'', destino:'', search:'' }
    setFilters(f); setPage(1)
    loadAll(f, orderBy, orderDir, perPage, 1)
  }

  function removeChip(key) {
    const f = { ...filters, [key]: '' }
    setFilters(f); setPage(1)
    loadAll(f, orderBy, orderDir, perPage, 1)
  }

  function handleSort(col) {
    const nd = orderBy===col ? (orderDir==='desc'?'asc':'desc') : (col==='created_at'?'desc':'asc')
    setOrderBy(col); setOrderDir(nd); setPage(1)
    loadTable(filters, col, nd, perPage, 1)
  }

  function handlePerPage(pp) {
    setPerPage(pp); setPage(1)
    loadTable(filters, orderBy, orderDir, pp, 1)
  }

  function goPage(p) {
    setPage(p)
    loadTable(filters, orderBy, orderDir, perPage, p)
  }

  function jumpTo(e) {
    if (e.key !== 'Enter' && e.type !== 'click') return
    const v = parseInt(e.target.closest('.pag-jump').querySelector('input').value)
    if (v >= 1) goPage(v)
  }

  async function exportCSV() {
    const res = await api({ ...filters, mode:'chart' })
    const rows = res.data||[]
    if (!rows.length) return
    const cols = [
      'id','created_at','customer_name','customer_phone','customer_email','estado','source','destino',
      'quiz_tipo_produto','quiz_quantidade','quiz_arte_pronta','quiz_acabamento','quiz_prazo','quiz_investimento',
      'utm_source','utm_medium','utm_campaign','page_url',
    ]
    const csv  = [cols.join(','), ...rows.map(r=>cols.map(c=>`"${(r[c]||'').toString().replace(/"/g,'""')}"`).join(','))].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob(['﻿'+csv],{type:'text/csv;charset=utf-8'}))
    a.download = `cir-leads-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
  }

  // ── Derived ──────────────────────────────────────────────────────────────
  const now = new Date()
  const thisMon = now.toISOString().slice(0,7)
  const prevD   = new Date(now.getFullYear(), now.getMonth()-1, 1)
  const prevMon = prevD.toISOString().slice(0,7)
  const thisMC  = chartRows.filter(r=>(r.created_at||'').startsWith(thisMon)).length
  const prevMC  = chartRows.filter(r=>(r.created_at||'').startsWith(prevMon)).length
  const delta   = prevMC > 0 ? Math.round((thisMC-prevMC)/prevMC*100) : null
  const eCounts = {}; chartRows.forEach(r=>{ if(r.estado) eCounts[r.estado]=(eCounts[r.estado]||0)+1 })
  const oCounts = {}; chartRows.forEach(r=>{ const s=r.source||'outro'; oCounts[s]=(oCounts[s]||0)+1 })
  const topEstados = Object.entries(eCounts).sort((a,b)=>b[1]-a[1]).slice(0,5)
  const topOrigens = Object.entries(oCounts).sort((a,b)=>b[1]-a[1]).slice(0,5)
  const allOrigens = Object.entries(oCounts).sort((a,b)=>b[1]-a[1])
  const topE = Object.entries(eCounts).sort((a,b)=>b[1]-a[1])[0]
  const topO = Object.entries(oCounts).sort((a,b)=>b[1]-a[1])[0]
  const totalPages = Math.ceil(totalCount/perPage)

  // destino: quantos leads foram roteados pra cada empresa (só leads que passaram pelo quiz têm destino)
  const destinoCounts = {}
  chartRows.forEach(r => { const d = r.destino || 'sem_quiz'; destinoCounts[d] = (destinoCounts[d]||0)+1 })
  const destinoTotal = chartRows.length || 1
  const destinoBreakdown = Object.entries(destinoCounts)
    .sort((a,b)=>b[1]-a[1])
    .map(([key,count]) => ({ key, count, pct: Math.round(count/destinoTotal*100) }))

  // active chips
  const chipMap = {
    date_from: filters.date_from ? `De: ${filters.date_from.slice(0,7)}` : '',
    date_to:   filters.date_to   ? `Até: ${filters.date_to.slice(0,7)}` : '',
    source:    filters.source    ? `Origem: ${SRC_LABELS[filters.source]||filters.source}` : '',
    estado:    filters.estado    ? `Estado: ${filters.estado}` : '',
    utm_source:filters.utm_source? `UTM: ${filters.utm_source}` : '',
    destino:   filters.destino   ? `Destino: ${DESTINO_LABELS[filters.destino]||filters.destino}` : '',
    search:    filters.search    ? `Busca: "${filters.search}"` : '',
  }
  const activeChips = Object.entries(chipMap).filter(([,v])=>v)

  // pagination window
  function pagWindow() {
    let s=Math.max(1,page-2), e=Math.min(totalPages,s+4); s=Math.max(1,e-4)
    return Array.from({length:e-s+1},(_,i)=>s+i)
  }

  return (
    <div className="db-page">
      <Head>
        <title>Leads — CIR Gráfica</title>
        <meta name="robots" content="noindex,nofollow"/>
      </Head>

      {/* Topbar */}
      <header className="db-topbar">
        <div className="db-topbar-left">
          <h1>Dashboard de Leads</h1>
          {loading && <span className="db-spin"/>}
          {lastUpdate && !loading && <span className="db-sub">atualizado {lastUpdate}</span>}
        </div>
        <div className="db-topbar-right">
          <button className="db-btn db-btn-sm" onClick={()=>setIsDarkMode(!isDarkMode)} title={isDarkMode?'Modo claro':'Modo escuro'}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button className="db-btn db-btn-sm" onClick={exportCSV}>↓ CSV</button>
          <button className="db-btn db-btn-sm" onClick={()=>loadAll()}>↻ Atualizar</button>
        </div>
      </header>

      <div className="db-body">

        {/* Filters */}
        <div className="db-filters">
          <div className="db-filter-row">
            <div className="db-fg">
              <label>De</label>
              <input type="month" value={filters.date_from} onChange={e=>handleFilterChange('date_from',e.target.value)} onKeyDown={e=>e.key==='Enter'&&applyFilters()}/>
            </div>
            <div className="db-fg">
              <label>Até</label>
              <input type="month" value={filters.date_to} onChange={e=>handleFilterChange('date_to',e.target.value)} onKeyDown={e=>e.key==='Enter'&&applyFilters()}/>
            </div>
            <div className="db-fg">
              <label>Origem</label>
              <select value={filters.source} onChange={e=>handleFilterChange('source',e.target.value)}>
                <option value="">Todas</option>
                {sources.map(s=><option key={s} value={s}>{labelForSrc(s)}</option>)}
              </select>
            </div>
            <div className="db-fg">
              <label>Estado</label>
              <select value={filters.estado} onChange={e=>handleFilterChange('estado',e.target.value)}>
                <option value="">Todos</option>
                {estados.map(e=><option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div className="db-fg">
              <label>UTM Source</label>
              <select value={filters.utm_source} onChange={e=>handleFilterChange('utm_source',e.target.value)}>
                <option value="">Todos</option>
                {utmSrcs.map(u=><option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="db-fg">
              <label>Destino</label>
              <select value={filters.destino} onChange={e=>handleFilterChange('destino',e.target.value)}>
                <option value="">Todos</option>
                {Object.entries(DESTINO_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="db-fg db-fg-search">
              <label>Buscar</label>
              <input type="text" placeholder="Nome, telefone, e-mail…" value={filters.search} onChange={e=>handleFilterChange('search',e.target.value)} onKeyDown={e=>e.key==='Enter'&&applyFilters()}/>
            </div>
            <button className="db-btn db-btn-primary" onClick={applyFilters}>Filtrar</button>
            {activeChips.length>0 && <button className="db-btn db-btn-ghost" onClick={clearFilters}>Limpar</button>}
          </div>

          {activeChips.length>0 && (
            <div className="db-chips">
              {activeChips.map(([k,v])=>(
                <span key={k} className="db-chip">{v}<span className="db-chip-x" onClick={()=>removeChip(k)}>×</span></span>
              ))}
            </div>
          )}
        </div>

        {/* KPIs */}
        <div className="db-kpis">
          <div className="db-kpi">
            <p className="db-kpi-label">Total filtrado</p>
            <p className="db-kpi-val">{(totalCount||chartRows.length).toLocaleString('pt-BR')}</p>
            <p className="db-kpi-sub">{chartRows.length} carregados</p>
          </div>
          <div className="db-kpi">
            <p className="db-kpi-label">Este mês</p>
            <p className="db-kpi-val">{thisMC}</p>
            <p className="db-kpi-sub db-kpi-sub-delta">
              {delta!==null
                ? <span className={delta>=0?'pos':'neg'}>{delta>0?'+':''}{delta}%</span>
                : null}
              {delta!==null ? ' vs mês ant.' : 'Mês atual'}
            </p>
          </div>
          <div className="db-kpi">
            <p className="db-kpi-label">Mês anterior</p>
            <p className="db-kpi-val">{prevMC}</p>
            <p className="db-kpi-sub">{prevD.toLocaleString('pt-BR',{month:'long',year:'numeric'})}</p>
          </div>
          <div className="db-kpi">
            <p className="db-kpi-label">Top estado</p>
            <p className="db-kpi-val">{topE?topE[0]:'—'}</p>
            <p className="db-kpi-sub">{topE?`${topE[1]} leads`:''}</p>
          </div>
          <div className="db-kpi">
            <p className="db-kpi-label">Top origem</p>
            <p className="db-kpi-val">{topO?(SRC_LABELS[topO[0]]||topO[0]).split(' ')[0]:'—'}</p>
            <p className="db-kpi-sub">{topO?`${topO[1]} leads`:''}</p>
          </div>
        </div>

        {/* Daily chart — destaque */}
        <div className="db-charts-hero">
          <div className="db-chart-card" style={{gridColumn:'1 / -1'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.5rem'}}>
              <p className="db-chart-title" style={{margin:0}}>Leads por dia</p>
              <div className="db-day-toggle">
                {[7,15,30].map(n=>(
                  <button key={n} className={`db-day-btn${dayWindow===n?' active':''}`} onClick={()=>setDayWindow(n)}>{n}d</button>
                ))}
              </div>
            </div>
            <div style={{position:'relative',height:'200px'}}>
              <canvas ref={chartDayRef}/>
            </div>
          </div>

          {/* Quick stats ao lado do daily chart */}
          <div className="db-chart-card">
            <p className="db-chart-title">Top origem hoje</p>
            <div className="db-stat-list">
              {topOrigens.map(([src,count],i)=>{
                const total = chartRows.length || 1
                const pct = Math.round(count/total*100)
                return (
                  <div key={src} className="db-stat-row">
                    <span className="db-stat-label">
                      <span className="db-stat-sq" style={{background:colorForSrc(src,i)}}/>
                      {labelForSrc(src).split(' ')[0]}
                    </span>
                    <span className="db-stat-val">{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="db-chart-card">
            <p className="db-chart-title">Top estado hoje</p>
            <div className="db-stat-list">
              {topEstados.map(([estado,count])=>{
                const total = chartRows.length || 1
                const pct = Math.round(count/total*100)
                return (
                  <div key={estado} className="db-stat-row">
                    <span className="db-stat-label">{estado}</span>
                    <span className="db-stat-val">{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Charts secondary row */}
        <div className="db-charts">
          <div className="db-chart-card">
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.5rem'}}>
              <p className="db-chart-title" style={{margin:0}}>Evolução mensal por origem</p>
              <span style={{fontSize:'.65rem',color:'var(--cir-fg2)'}}>* = mês em andamento</span>
            </div>
            <div className="db-legend">
              {allOrigens.map(([k],i)=>(
                <span key={k} className="db-leg"><span className="db-leg-sq" style={{background:colorForSrc(k,i)}}/>{labelForSrc(k)}</span>
              ))}
            </div>
            <div style={{position:'relative',height:'200px'}}>
              <canvas ref={chartMesRef}/>
            </div>
          </div>
          <div className="db-chart-card">
            <p className="db-chart-title">Top estados</p>
            <div style={{position:'relative',height:'230px'}}>
              <canvas ref={chartEsRef}/>
            </div>
          </div>
        </div>

        {/* Quiz: destino, tipo de produto, acabamento */}
        <div className="db-charts db-charts-3col">
          <div className="db-destino-card">
            <p className="db-chart-title">Leads por destino</p>
            <div className="db-destino-list">
              {destinoBreakdown.map(d => (
                <div key={d.key} className="db-destino-row">
                  <span className="db-destino-label">
                    {d.key === 'sem_quiz'
                      ? <span className="td-muted">Sem quiz (dado antigo)</span>
                      : <span className="db-badge" style={{borderColor:(DESTINO_COLORS[d.key]||'#888')+'55', color:DESTINO_COLORS[d.key]||'#888'}}>{DESTINO_LABELS[d.key]||d.key}</span>}
                  </span>
                  <span className="db-destino-count">{d.count.toLocaleString('pt-BR')}</span>
                  <span className="db-destino-pct">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="db-chart-card">
            <p className="db-chart-title">Leads por tipo de produto</p>
            <div style={{position:'relative',height:'200px'}}>
              <canvas ref={chartTipoRef}/>
            </div>
          </div>
          <div className="db-chart-card">
            <p className="db-chart-title">Acabamento × destino</p>
            <div style={{position:'relative',height:'200px'}}>
              <canvas ref={chartAcabRef}/>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="db-table-card">
          <div className="db-table-toolbar">
            <span className="db-result-count">{totalCount.toLocaleString('pt-BR')} leads encontrados</span>
            <div className="db-per-page">
              Exibir
              <select value={perPage} onChange={e=>handlePerPage(parseInt(e.target.value))}>
                {PER_PAGE_OPTS.map(n=><option key={n} value={n}>{n}</option>)}
              </select>
              por página
            </div>
          </div>

          <div className="db-tbl-wrap">
            <table>
              <thead>
                <tr>
                  {[
                    ['customer_name','Nome'],
                    ['customer_phone','Telefone'],
                    ['estado','Estado'],
                    ['source','Origem'],
                    ['destino','Destino'],
                    ['utm_source','UTM Source'],
                    ['created_at','Data'],
                  ].map(([col,label])=>(
                    <th key={col} onClick={()=>handleSort(col)} className={orderBy===col?`sort-${orderDir}`:''}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && !tableData.length ? (
                  <tr><td colSpan={7}><div className="db-empty db-loading-text">Carregando…</div></td></tr>
                ) : !tableData.length ? (
                  <tr><td colSpan={7}><div className="db-empty">Nenhum lead encontrado.</div></td></tr>
                ) : tableData.map(r=>(
                  <tr key={r.id} className="db-row-clickable" onClick={()=>setDetailLead(r)}>
                    <td className="td-name" title={r.customer_name||''}>{r.customer_name||<span className="td-muted">—</span>}</td>
                    <td className="td-phone">{fmtPhone(r.customer_phone)}</td>
                    <td>{r.estado||<span className="td-muted">—</span>}</td>
                    <td><span className={`db-badge b-${r.source?.split('-')[0]||'x'}`}>{SRC_LABELS[r.source]||r.source||'—'}</span></td>
                    <td>{r.destino
                      ? <span className="db-badge" style={{borderColor:(DESTINO_COLORS[r.destino]||'#888')+'55', color:DESTINO_COLORS[r.destino]||'#888'}}>{DESTINO_LABELS[r.destino]||r.destino}</span>
                      : <span className="td-muted">sem quiz</span>}
                    </td>
                    <td>{r.utm_source?<span className="db-badge">{r.utm_source}</span>:<span className="td-muted">—</span>}</td>
                    <td className="td-muted">{fmtDate(r.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="db-pag">
              <span className="db-pag-info">
                {((page-1)*perPage+1).toLocaleString('pt-BR')}–{Math.min(page*perPage,totalCount).toLocaleString('pt-BR')} de {totalCount.toLocaleString('pt-BR')}
              </span>
              <div className="db-pag-btns">
                <button className="db-pag-btn" disabled={page===1} onClick={()=>goPage(1)}>«</button>
                <button className="db-pag-btn" disabled={page===1} onClick={()=>goPage(page-1)}>‹</button>
                {page>3 && <><button className="db-pag-btn" onClick={()=>goPage(1)}>1</button><span className="db-pag-ellipsis">…</span></>}
                {pagWindow().map(p=>(
                  <button key={p} className={`db-pag-btn${p===page?' active':''}`} onClick={()=>goPage(p)}>{p}</button>
                ))}
                {page<totalPages-2 && <><span className="db-pag-ellipsis">…</span><button className="db-pag-btn" onClick={()=>goPage(totalPages)}>{totalPages}</button></>}
                <button className="db-pag-btn" disabled={page===totalPages} onClick={()=>goPage(page+1)}>›</button>
                <button className="db-pag-btn" disabled={page===totalPages} onClick={()=>goPage(totalPages)}>»</button>
              </div>
              <div className="pag-jump">
                <span>Ir para</span>
                <input type="number" min="1" max={totalPages} defaultValue="" onKeyDown={jumpTo}/>
                <button className="db-btn db-btn-sm" onClick={e=>{ e.target.closest('.pag-jump').querySelector('input').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})) }}>Ir</button>
              </div>
            </div>
          )}
        </div>

      </div>

      {detailLead && (
        <div className="db-detail-overlay" onClick={()=>setDetailLead(null)}>
          <div className="db-detail-panel" onClick={e=>e.stopPropagation()}>
            <button className="db-detail-close" onClick={()=>setDetailLead(null)} aria-label="Fechar">×</button>

            <span className="db-detail-tag">Lead</span>
            <h2 className="db-detail-title">{detailLead.customer_name || 'Sem nome'}</h2>
            <p className="db-detail-sub">{fmtPhone(detailLead.customer_phone)} · {fmtDate(detailLead.created_at)}</p>

            {detailLead.destino && (
              <span
                className="db-badge db-detail-destino"
                style={{borderColor:(DESTINO_COLORS[detailLead.destino]||'#888')+'55', color:DESTINO_COLORS[detailLead.destino]||'#888'}}
              >
                → {DESTINO_LABELS[detailLead.destino] || detailLead.destino}
              </span>
            )}

            {detailLead.quiz_tipo_produto && (
              <div className="db-detail-section">
                <p className="db-detail-section-title">Respostas do quiz</p>
                <dl className="db-detail-grid">
                  <dt>Produto</dt><dd>{labelFromOptions(TIPO_PRODUTO_OPTIONS, detailLead.quiz_tipo_produto) || '—'}</dd>
                  <dt>Quantidade</dt><dd>{labelFromOptions(QUANTIDADE_OPTIONS, detailLead.quiz_quantidade) || '—'}</dd>
                  <dt>Arte</dt><dd>{labelFromOptions(ARTE_OPTIONS, detailLead.quiz_arte_pronta) || '—'}</dd>
                  <dt>Acabamento</dt><dd>{labelFromOptions(ACABAMENTO_OPTIONS, detailLead.quiz_acabamento) || '—'}</dd>
                  <dt>Prazo</dt><dd>{labelFromOptions(PRAZO_OPTIONS, detailLead.quiz_prazo) || '—'}</dd>
                  <dt>Investimento/un.</dt><dd>{detailLead.quiz_investimento || '—'}</dd>
                </dl>
              </div>
            )}

            <div className="db-detail-section">
              <p className="db-detail-section-title">Contato</p>
              <dl className="db-detail-grid">
                <dt>E-mail</dt><dd>{detailLead.customer_email || '—'}</dd>
                <dt>Empresa</dt><dd>{detailLead.customer_company || '—'}</dd>
                <dt>Estado</dt><dd>{detailLead.estado || '—'}</dd>
                <dt>Cidade</dt><dd>{detailLead.cidade || '—'}</dd>
              </dl>
            </div>

            <div className="db-detail-section">
              <p className="db-detail-section-title">Origem</p>
              <dl className="db-detail-grid">
                <dt>Source</dt><dd>{detailLead.source || '—'}</dd>
                <dt>UTM Source</dt><dd>{detailLead.utm_source || '—'}</dd>
                <dt>UTM Medium</dt><dd>{detailLead.utm_medium || '—'}</dd>
                <dt>UTM Campaign</dt><dd>{detailLead.utm_campaign || '—'}</dd>
                <dt>Página</dt><dd className="db-detail-break">{detailLead.page_url || '—'}</dd>
                <dt>Referrer</dt><dd className="db-detail-break">{detailLead.referrer || '—'}</dd>
              </dl>
            </div>

            <div className="db-detail-section">
              <p className="db-detail-section-title">Mensagem enviada</p>
              <pre className="db-detail-message">{detailLead.message || '—'}</pre>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .db-page { background: var(--cir-bg); color: var(--cir-fg); font-family: var(--cir-sans); min-height: 100vh; }

        /* topbar */
        .db-topbar { display:flex; align-items:center; justify-content:space-between; padding:.75rem 2rem; border-bottom:1px solid var(--cir-line); background:var(--cir-bg); position:sticky; top:0; z-index:50; gap:.75rem; flex-wrap:wrap; }
        .db-topbar h1 { font-family:var(--cir-serif); font-size:1.1rem; font-weight:700; }
        .db-topbar-left { display:flex; align-items:center; gap:.75rem; }
        .db-topbar-right { display:flex; align-items:center; gap:.5rem; }
        .db-sub { font-size:.65rem; color:var(--cir-fg2); }
        .db-spin { width:14px; height:14px; border:2px solid var(--cir-line); border-top-color:var(--cir-accent); border-radius:50%; animation:spin .6s linear infinite; display:inline-block; }
        @keyframes spin { to { transform:rotate(360deg) } }

        /* layout */
        .db-body { max-width:1280px; margin:0 auto; padding:1.25rem 2rem 3rem; }

        /* buttons */
        .db-btn { display:inline-flex; align-items:center; gap:5px; height:30px; padding:0 .85rem; border:1px solid var(--cir-line); border-radius:2px; background:transparent; color:var(--cir-fg2); font-family:var(--cir-sans); font-size:.7rem; letter-spacing:.06em; text-transform:uppercase; cursor:pointer; transition:background .15s,color .15s; white-space:nowrap; }
        .db-btn:hover { background:var(--cir-bg2); color:var(--cir-fg); }
        .db-btn-sm { height:26px; font-size:.65rem; }
        .db-btn-primary { background:var(--cir-accent); color:#fff; border-color:var(--cir-accent); }
        .db-btn-primary:hover { opacity:.88; color:#fff; }
        .db-btn-ghost { color:var(--cir-fg2); }

        /* filters */
        .db-filters { background:var(--cir-bg2); border:1px solid var(--cir-line); padding:.85rem 1rem; margin-bottom:1rem; }
        .db-filter-row { display:flex; flex-wrap:wrap; gap:.5rem; align-items:flex-end; }
        .db-fg { display:flex; flex-direction:column; gap:.2rem; }
        .db-fg label { font-size:.6rem; color:var(--cir-fg2); text-transform:uppercase; letter-spacing:.08em; }
        .db-fg select, .db-fg input { padding:.35rem .6rem; border:1px solid var(--cir-line); background:var(--cir-bg); color:var(--cir-fg); font-family:var(--cir-sans); font-size:.75rem; height:30px; outline:none; }
        .db-fg select:focus, .db-fg input:focus { border-color:var(--cir-accent); }
        .db-fg-search input { width:210px; }
        .db-chips { display:flex; flex-wrap:wrap; gap:.35rem; margin-top:.6rem; }
        .db-chip { display:inline-flex; align-items:center; gap:4px; font-size:.65rem; padding:2px 8px; background:var(--cir-bg); border:1px solid var(--cir-line); color:var(--cir-fg2); }
        .db-chip-x { cursor:pointer; opacity:.6; font-size:.85rem; margin-left:2px; }
        .db-chip-x:hover { opacity:1; color:var(--cir-accent); }

        /* kpis */
        .db-kpis { display:grid; grid-template-columns:repeat(5,1fr); gap:1px; background:var(--cir-line); margin-bottom:1rem; }
        .db-kpi { background:var(--cir-bg2); padding:.9rem 1rem; }
        .db-kpi-label { font-size:.58rem; letter-spacing:.1em; text-transform:uppercase; color:var(--cir-fg2); margin-bottom:5px; }
        .db-kpi-val { font-family:var(--cir-serif); font-size:1.6rem; font-weight:700; color:var(--cir-gold); line-height:1; margin-bottom:3px; }
        .db-kpi-sub { font-size:.65rem; color:var(--cir-fg2); }
        .db-kpi-sub-delta .pos { color:#4caf7d; }
        .db-kpi-sub-delta .neg { color:#e34948; }

        /* charts */
        .db-charts-hero { display:grid; grid-template-columns:2fr 1fr 1fr; gap:1px; background:var(--cir-line); margin-bottom:1rem; }
        .db-charts { display:grid; grid-template-columns:3fr 2fr; gap:1px; background:var(--cir-line); margin-bottom:1rem; }
        .db-chart-card { background:var(--cir-bg2); padding:1rem 1.1rem; }
        .db-chart-title { font-size:.6rem; font-weight:600; color:var(--cir-fg2); text-transform:uppercase; letter-spacing:.1em; margin-bottom:.5rem; }

        /* stat list */
        .db-stat-list { display:flex; flex-direction:column; }
        .db-stat-row { display:flex; align-items:center; justify-content:space-between; padding:.5rem 0; border-top:1px solid var(--cir-line); font-size:.75rem; }
        .db-stat-row:first-child { border-top:none; }
        .db-stat-label { display:flex; align-items:center; gap:.4rem; }
        .db-stat-sq { width:6px; height:6px; flex-shrink:0; border-radius:1px; }
        .db-stat-val { font-weight:600; color:var(--cir-gold); font-variant-numeric:tabular-nums; }
        .db-legend { display:flex; flex-wrap:wrap; gap:10px; margin-bottom:.5rem; }
        .db-leg { display:flex; align-items:center; gap:4px; font-size:.65rem; color:var(--cir-fg2); }
        .db-leg-sq { width:8px; height:8px; flex-shrink:0; }

        /* table */
        .db-table-card { border:1px solid var(--cir-line); background:var(--cir-bg2); }
        .db-table-toolbar { display:flex; align-items:center; justify-content:space-between; padding:.6rem 1rem; border-bottom:1px solid var(--cir-line); flex-wrap:wrap; gap:.5rem; }
        .db-result-count { font-size:.65rem; color:var(--cir-fg2); text-transform:uppercase; letter-spacing:.08em; }
        .db-per-page { display:flex; align-items:center; gap:.4rem; font-size:.65rem; color:var(--cir-fg2); }
        .db-per-page select { height:24px; padding:0 .4rem; border:1px solid var(--cir-line); background:var(--cir-bg); color:var(--cir-fg); font-size:.7rem; }
        .db-tbl-wrap { overflow-x:auto; }
        table { width:100%; border-collapse:collapse; font-size:.74rem; }
        thead th { padding:.55rem 1rem; text-align:left; font-size:.6rem; font-weight:600; color:var(--cir-fg2); text-transform:uppercase; letter-spacing:.08em; border-bottom:1px solid var(--cir-line); background:var(--cir-bg); cursor:pointer; user-select:none; white-space:nowrap; }
        thead th:hover { color:var(--cir-fg); }
        thead th.sort-asc::after { content:' ↑'; color:var(--cir-accent); }
        thead th.sort-desc::after { content:' ↓'; color:var(--cir-accent); }
        tbody td { padding:.6rem 1rem; border-bottom:1px solid var(--cir-line); color:var(--cir-fg); vertical-align:middle; }
        tbody tr:last-child td { border-bottom:none; }
        tbody tr:hover td { background:var(--cir-bg); }
        .td-name { font-weight:400; max-width:150px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .td-phone { font-variant-numeric:tabular-nums; white-space:nowrap; }
        .td-muted { color:var(--cir-fg2) !important; font-size:.7rem; }
        .db-empty { text-align:center; padding:2.5rem; color:var(--cir-fg2); font-size:.78rem; }

        /* badges */
        .db-badge { display:inline-block; font-size:.62rem; padding:2px 6px; border:1px solid var(--cir-line); background:var(--cir-bg); color:var(--cir-fg2); white-space:nowrap; }
        .b-orcamento { border-color:var(--cir-accent)55; color:var(--cir-accent); }
        .b-portfolio  { border-color:#5d9c6e55; color:#5d9c6e; }
        .b-whatsapp   { border-color:#3a7cbf55; color:#3a7cbf; }
        .b-cidades    { border-color:#7c5dbf55; color:#7c5dbf; }

        /* pagination */
        .db-pag { display:flex; align-items:center; justify-content:space-between; padding:.6rem 1rem; border-top:1px solid var(--cir-line); flex-wrap:wrap; gap:.5rem; }
        .db-pag-info { font-size:.65rem; color:var(--cir-fg2); }
        .db-pag-btns { display:flex; align-items:center; gap:.25rem; }
        .db-pag-btn { min-width:28px; height:26px; padding:0 .4rem; border:1px solid var(--cir-line); background:transparent; color:var(--cir-fg2); font-family:var(--cir-sans); font-size:.7rem; cursor:pointer; }
        .db-pag-btn:hover:not(:disabled):not(.active) { background:var(--cir-bg); color:var(--cir-fg); }
        .db-pag-btn.active { background:var(--cir-accent); color:#fff; border-color:var(--cir-accent); }
        .db-pag-btn:disabled { opacity:.3; cursor:default; }
        .db-pag-ellipsis { font-size:.7rem; color:var(--cir-fg2); padding:0 .2rem; }
        .pag-jump { display:flex; align-items:center; gap:.35rem; font-size:.65rem; color:var(--cir-fg2); }
        .pag-jump input { width:46px; height:26px; padding:0 .4rem; border:1px solid var(--cir-line); background:var(--cir-bg); color:var(--cir-fg); font-size:.7rem; text-align:center; }

        .db-chart-full { background:var(--cir-bg2); padding:1rem 1.1rem; border:none; }
        .db-day-toggle { display:flex; gap:2px; }
        .db-day-btn { height:22px; padding:0 .55rem; border:1px solid var(--cir-line); background:transparent; color:var(--cir-fg2); font-family:var(--cir-sans); font-size:.6rem; letter-spacing:.06em; text-transform:uppercase; cursor:pointer; }
        .db-day-btn.active { background:var(--cir-accent); color:#fff; border-color:var(--cir-accent); }
        .db-day-btn:hover:not(.active) { background:var(--cir-bg); color:var(--cir-fg); }

        @media(max-width:1000px) { .db-charts-hero{grid-template-columns:1fr} .db-charts{grid-template-columns:1fr} .db-charts-3col{grid-template-columns:1fr} .db-kpis{grid-template-columns:repeat(3,1fr)} }
        @media(max-width:640px)  { .db-charts-hero{grid-template-columns:1fr} .db-kpis{grid-template-columns:repeat(2,1fr)} .db-body{padding:.75rem .75rem 2rem} }

        .db-charts-3col { grid-template-columns:repeat(3,1fr); margin-top:1px; }

        /* destino breakdown */
        .db-destino-card { background:var(--cir-bg2); padding:1rem 1.1rem; }
        .db-destino-list { display:flex; flex-direction:column; }
        .db-destino-row { display:flex; align-items:center; gap:.6rem; padding:.55rem 0; border-top:1px solid var(--cir-line); font-size:.78rem; }
        .db-destino-row:first-child { border-top:none; }
        .db-destino-label { flex:1; min-width:0; }
        .db-destino-count { flex-shrink:0; font-variant-numeric:tabular-nums; color:var(--cir-fg2); }
        .db-destino-pct { flex-shrink:0; width:2.6rem; text-align:right; font-variant-numeric:tabular-nums; color:var(--cir-fg2); }

        /* linhas da tabela clicáveis */
        .db-row-clickable { cursor:pointer; }

        /* painel de detalhes do lead */
        .db-detail-overlay { position:fixed; inset:0; z-index:300; background:rgba(0,0,0,.55); display:flex; justify-content:flex-end; }
        .db-detail-panel { position:relative; width:100%; max-width:420px; height:100%; overflow-y:auto; background:var(--cir-bg); border-left:1px solid var(--cir-line); padding:2rem 1.6rem 3rem; }
        .db-detail-close { position:absolute; top:1rem; right:1rem; width:32px; height:32px; background:transparent; border:1px solid var(--cir-line); color:var(--cir-fg2); font-size:1.3rem; line-height:1; cursor:pointer; }
        .db-detail-close:hover { color:var(--cir-fg); border-color:var(--cir-fg2); }
        .db-detail-tag { display:block; font-size:.62rem; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--cir-fg2); margin-bottom:.6rem; }
        .db-detail-title { font-family:var(--cir-serif); font-size:1.3rem; font-weight:700; color:var(--cir-fg); margin-bottom:.3rem; }
        .db-detail-sub { font-size:.75rem; color:var(--cir-fg2); margin-bottom:.8rem; }
        .db-detail-destino { margin-bottom:1rem; }
        .db-detail-section { margin-top:1.4rem; padding-top:1.2rem; border-top:1px solid var(--cir-line); }
        .db-detail-section-title { font-size:.62rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--cir-accent); margin-bottom:.7rem; }
        .db-detail-grid { display:grid; grid-template-columns:110px 1fr; row-gap:.55rem; column-gap:.6rem; }
        .db-detail-grid dt { font-size:.68rem; color:var(--cir-fg2); }
        .db-detail-grid dd { font-size:.78rem; color:var(--cir-fg); }
        .db-detail-break { word-break:break-all; }
        .db-detail-message { white-space:pre-wrap; font-family:var(--cir-sans); font-size:.78rem; line-height:1.7; color:var(--cir-fg); background:var(--cir-bg2); padding:.8rem; border:1px solid var(--cir-line); }
      `}</style>
    </div>
  )
}
