import Link from 'next/link'
import servicos from '../data/servicos.json'

export default function ServicosGrid({ light = false, className = '' }) {
  return (
    <div
      className={`cp-services-grid ${className}`}
      style={light ? { background: 'var(--cir-l-line)' } : undefined}
    >
      {servicos.map((s) => (
        <Link
          key={s.id}
          href={`/servicos/${s.id}`}
          className="cp-service"
          style={light ? { background: 'var(--cir-l-bg)' } : undefined}
        >
          <h3 style={light ? { color: 'var(--cir-accent)' } : undefined}>{s.nome}</h3>
          <p style={light ? { color: 'var(--cir-l-fg2)' } : undefined}>{s.descricaoCurta}</p>
          <ul>
            {s.aplicacoes.slice(0, 4).map((item, j) => (
              <li key={j} style={light ? { color: 'var(--cir-l-fg2)' } : undefined}>{item}</li>
            ))}
          </ul>
          <span className="cp-service-link">Saiba mais →</span>
        </Link>
      ))}
    </div>
  )
}
