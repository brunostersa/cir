const CLIENTS = [
  { slug: 'gav-resorts', name: 'GAV Resorts' },
  { slug: 'sallo-jeans', name: 'Sallo Jeans' },
  { slug: 'flamboyant-urbanismo', name: 'Flamboyant Urbanismo' },
  { slug: 'tulipia', name: 'Tulípia' },
  { slug: 'abelha-rainha', name: 'Abelha Rainha' },
  { slug: 'olfati', name: 'Olfati' },
  { slug: 'colegio-agostiniano', name: 'Colégio Agostiniano Nossa Senhora de Fátima' },
  { slug: 'ipog', name: 'IPOG' },
  { slug: 'sicoob', name: 'Sicoob' },
  { slug: 'rio-quente-resorts', name: 'Rio Quente Resorts' },
]

export default function ClientLogos({ light = false, title = 'Marcas que confiam na CIR' }) {
  return (
    <div className={`cir-section cl-section ${light ? 'cir-section--light' : ''}`}>
      <span className="cir-s-tag">Clientes</span>
      <h2 className="cp-h2">{title}</h2>
      <div className="cl-grid">
        {CLIENTS.map((c, i) => (
          <div key={c.slug} className="cl-card cir-reveal" style={{ animationDelay: `${i * 0.05}s` }}>
            <img src={`/logos-clientes/${c.slug}.png`} alt={c.name} loading="lazy" />
          </div>
        ))}
      </div>

      <style jsx global>{`
        .cl-section { padding-top: 4rem; padding-bottom: 4rem }
        .cl-grid { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 3rem }
        .cl-card { flex: 1 1 200px; max-width: 220px; height: 110px; background: #fff; border: 1px solid var(--cir-line); display: flex; align-items: center; justify-content: center; padding: 1.2rem 1.6rem; transition: transform .3s, border-color .3s }
        .cir-section--light .cl-card { border-color: var(--cir-l-line) }
        .cl-card:hover { transform: translateY(-3px); border-color: var(--cir-accent) }
        .cl-card img { max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain }
        @media (max-width: 640px) { .cl-card { flex: 1 1 45%; height: 90px; padding: .9rem 1.1rem } }
      `}</style>
    </div>
  )
}
