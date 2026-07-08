import { useState } from 'react'
import Head from 'next/head'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { computeLeadStats } from '../../lib/leadStats'
import BarChart from '../../components/BarChart'

const MONTH_LABELS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function formatDayLabel(key) {
  const [, m, d] = key.split('-')
  return `${d}/${m}`
}

function formatWeekLabel(key) {
  const [, m, d] = key.split('-')
  return `${d}/${m}`
}

function formatMonthLabel(key) {
  const [y, m] = key.split('-')
  return `${MONTH_LABELS[parseInt(m, 10) - 1]}/${y.slice(2)}`
}

export async function getServerSideProps() {
  if (!supabaseAdmin) {
    return { props: { error: 'SUPABASE_SERVICE_ROLE_KEY não configurada no .env.local.', stats: null } }
  }

  const { data, error } = await supabaseAdmin
    .from('leads')
    .select('created_at, source, cidade, estado, message, page_url, customer_name, customer_phone, customer_email, customer_company, utm_source, utm_medium, utm_campaign')
    .order('created_at', { ascending: false })
    .limit(5000)

  if (error) {
    return { props: { error: error.message, stats: null } }
  }

  const stats = computeLeadStats(data)
  return { props: { stats, error: null } }
}

export default function LeadsDashboard({ stats, error }) {
  const [view, setView] = useState('day')

  if (error) {
    return (
      <div className="db-page">
        <p className="db-error">Erro ao carregar leads: {error}</p>
        <style jsx global>{globalStyles}</style>
      </div>
    )
  }

  const viewData = { day: stats.daily, week: stats.weekly, month: stats.monthly }[view]
  const formatLabel = { day: formatDayLabel, week: formatWeekLabel, month: formatMonthLabel }[view]

  return (
    <div className="db-page">
      <Head>
        <title>Dashboard de Leads — CIR Gráfica</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <header className="db-header">
        <h1>Dashboard de Leads</h1>
        <span>CIR Gráfica · atualizado em tempo real</span>
      </header>

      <div className="db-kpis">
        <div className="db-kpi">
          <p className="db-kpi-label">Total de leads</p>
          <p className="db-kpi-val">{stats.total}</p>
        </div>
        <div className="db-kpi">
          <p className="db-kpi-label">Hoje</p>
          <p className="db-kpi-val">{stats.today}</p>
        </div>
        <div className="db-kpi">
          <p className="db-kpi-label">Esta semana</p>
          <p className="db-kpi-val">{stats.thisWeek}</p>
        </div>
        <div className="db-kpi">
          <p className="db-kpi-label">Este mês</p>
          <p className="db-kpi-val">{stats.thisMonth}</p>
        </div>
      </div>

      <div className="db-section">
        <div className="db-section-head">
          <p className="db-section-title">Leads ao longo do tempo</p>
          <div className="db-toggle">
            <button className={view === 'day' ? 'active' : ''} onClick={() => setView('day')}>Dia</button>
            <button className={view === 'week' ? 'active' : ''} onClick={() => setView('week')}>Semana</button>
            <button className={view === 'month' ? 'active' : ''} onClick={() => setView('month')}>Mês</button>
          </div>
        </div>
        <BarChart data={viewData} formatLabel={formatLabel} />
      </div>

      <div className="db-two-col">
        <div className="db-section">
          <p className="db-section-title">Por origem</p>
          <ul className="db-list">
            {stats.topSources.map((s, i) => (
              <li key={i}><span>{s.label}</span><strong>{s.count}</strong></li>
            ))}
          </ul>
        </div>
        <div className="db-section">
          <p className="db-section-title">Por estado</p>
          <ul className="db-list">
            {stats.topEstados.map((s, i) => (
              <li key={i}><span>{s.label}</span><strong>{s.count}</strong></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="db-two-col">
        <div className="db-section">
          <p className="db-section-title">UTM · Origem (utm_source)</p>
          <ul className="db-list">
            {stats.topUtmSources.map((s, i) => (
              <li key={i}><span>{s.label}</span><strong>{s.count}</strong></li>
            ))}
          </ul>
        </div>
        <div className="db-section">
          <p className="db-section-title">UTM · Campanha (utm_campaign)</p>
          <ul className="db-list">
            {stats.topUtmCampaigns.map((s, i) => (
              <li key={i}><span>{s.label}</span><strong>{s.count}</strong></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="db-section">
        <p className="db-section-title">Leads recentes</p>
        <table className="db-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Nome</th>
              <th>WhatsApp</th>
              <th>E-mail</th>
              <th>Empresa</th>
              <th>Origem</th>
              <th>Cidade</th>
              <th>Estado</th>
              <th>UTM</th>
              <th>Mensagem</th>
            </tr>
          </thead>
          <tbody>
            {stats.recent.map((l, i) => (
              <tr key={i}>
                <td>{new Date(l.created_at).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</td>
                <td>{l.customer_name || '—'}</td>
                <td>{l.customer_phone || '—'}</td>
                <td>{l.customer_email || '—'}</td>
                <td>{l.customer_company || '—'}</td>
                <td>{l.source}</td>
                <td>{l.cidade || '—'}</td>
                <td>{l.estado || '—'}</td>
                <td>{[l.utm_source, l.utm_campaign].filter(Boolean).join(' / ') || '—'}</td>
                <td className="db-table-msg">{l.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx global>{globalStyles}</style>
    </div>
  )
}

const globalStyles = `
  .db-page {
    background: var(--cir-bg);
    color: var(--cir-fg);
    font-family: var(--cir-sans);
    min-height: 100vh;
    padding: 2.5rem 3vw 5rem;
  }
  .db-error { color: var(--cir-accent); font-size: .9rem; }
  .db-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: .5rem;
    border-bottom: 1px solid var(--cir-line);
    padding-bottom: 1.2rem;
    margin-bottom: 2rem;
  }
  .db-header h1 {
    font-family: var(--cir-serif);
    font-size: 1.4rem;
    font-weight: 700;
  }
  .db-header span {
    font-size: .72rem;
    color: var(--cir-fg2);
  }
  .db-kpis {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--cir-line);
    margin-bottom: 2.5rem;
  }
  .db-kpi { background: var(--cir-bg2); padding: 1.2rem 1.4rem; }
  .db-kpi-label { font-size: .62rem; letter-spacing: .1em; text-transform: uppercase; color: var(--cir-fg2); margin-bottom: .5rem; }
  .db-kpi-val { font-family: var(--cir-serif); font-size: 1.8rem; font-weight: 700; color: var(--cir-gold); }
  .db-section { margin-bottom: 2.5rem; }
  .db-section-head { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: .5rem; }
  .db-section-title {
    font-size: .68rem;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--cir-fg2);
    border-bottom: 1px solid var(--cir-line);
    padding-bottom: .5rem;
    flex: 1;
  }
  .db-toggle { display: flex; gap: .3rem; }
  .db-toggle button {
    font-family: var(--cir-sans);
    font-size: .65rem;
    letter-spacing: .06em;
    text-transform: uppercase;
    background: transparent;
    border: 1px solid var(--cir-line);
    color: var(--cir-fg2);
    padding: .4rem .9rem;
    cursor: pointer;
  }
  .db-toggle button.active { background: var(--cir-accent); border-color: var(--cir-accent); color: #fff; }
  .db-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; }
  .db-list { display: flex; flex-direction: column; }
  .db-list li { display: flex; justify-content: space-between; padding: .6rem 0; border-bottom: 1px solid var(--cir-line); font-size: .78rem; }
  .db-list li span { color: var(--cir-fg2); }
  .db-list li strong { color: var(--cir-gold); font-family: var(--cir-serif); }
  .db-table { width: 100%; border-collapse: collapse; font-size: .74rem; }
  .db-table th { text-align: left; font-size: .62rem; letter-spacing: .08em; text-transform: uppercase; color: var(--cir-fg2); padding: .6rem .6rem; border-bottom: 1px solid var(--cir-line); }
  .db-table td { padding: .6rem; border-bottom: 1px solid var(--cir-line); color: var(--cir-fg); white-space: nowrap; }
  .db-table-msg { white-space: normal; max-width: 320px; color: var(--cir-fg2) !important; }
  @media (max-width: 900px) {
    .db-kpis { grid-template-columns: repeat(2, 1fr); }
    .db-two-col { grid-template-columns: 1fr; }
    .db-table { display: block; overflow-x: auto; }
  }
`
