import { useRef } from 'react'

const WA = 'https://api.whatsapp.com/send?phone=556232021150&text=Ol%C3%A1!%20vim%20pelo%20site%20e%20gostaria%20de%20solicitar%20um%20or%C3%A7amento'

const PRODUCTS = [
  {
    tag: 'MAIS VENDIDO',
    name: 'Agenda Executiva Premium',
    desc: 'Capa dura, miolo costurado, personalização total da capa e lombada.',
    price: 'a partir de R$ 48,90/un',
    img: '/conceituais/materiais-graficos-impressao5.jpeg',
    alt: 'Agenda executiva premium com capa dura personalizada',
  },
  {
    tag: 'CORPORATIVO',
    name: 'Caderno Corporativo',
    desc: 'Capa personalizada com laminação especial, miolo pautado ou pontilhado.',
    price: 'a partir de R$ 24,50/un',
    img: '/conceituais/materiais-graficos-impressao3.jpeg',
    alt: 'Caderno corporativo com acabamento premium',
  },
  {
    tag: 'PREMIUM',
    name: 'Catálogo de Lançamento',
    desc: 'Papel especial, acabamentos premium e projeto exclusivo para cada cliente.',
    price: 'a partir de R$ 12,80/un',
    img: '/conceituais/materiais-graficos-impressao27.jpeg',
    alt: 'Catálogo de lançamento com acabamento especial',
  },
  {
    tag: 'COMPLETO',
    name: 'Press Kit Corporativo',
    desc: 'Pasta, folhetos, cartões e brindes encartados com identidade unificada.',
    price: 'a partir de R$ 38,70/un',
    img: '/conceituais/materiais-graficos-impressao14.jpeg',
    alt: 'Press kit corporativo completo com identidade visual',
  },
  {
    tag: 'TOP ACABAMENTO',
    name: 'Cartão de Visita Premium',
    desc: 'Papel 500g, acabamentos exclusivos — hot stamping, relevo seco, corte especial.',
    price: 'a partir de R$ 0,95/un',
    img: '/conceituais/materiais-graficos-impressao34.jpeg',
    alt: 'Cartão de visita premium em papel 500g com hot stamping',
  },
  {
    tag: 'INSTITUCIONAL',
    name: 'Folder Institucional',
    desc: 'Couché 170g, dobra personalizada, impressão offset com cores vibrantes.',
    price: 'a partir de R$ 1,80/un',
    img: '/conceituais/materiais-graficos-impressao22.jpeg',
    alt: 'Folder institucional impresso em offset',
  },
  {
    tag: 'EMBALAGEM',
    name: 'Caixas & Sacolas',
    desc: 'Embalagens personalizadas que transformam a entrega em experiência de marca.',
    price: 'consulte-nos',
    img: '/conceituais/materiais-graficos-impressao13.jpeg',
    alt: 'Caixas e sacolas personalizadas com acabamento especial',
  },
  {
    tag: 'BRINDE',
    name: 'Brindes Corporativos',
    desc: 'Peças com relevo, hot stamping e laminação especial para presentes memoráveis.',
    price: 'consulte-nos',
    img: '/conceituais/materiais-graficos-impressao20.jpeg',
    alt: 'Brindes corporativos com acabamento premium',
  },
]

export default function ProductsCarousel() {
  const track = useRef(null)

  const scroll = (dir) => {
    if (!track.current) return
    const card = track.current.querySelector('.pc-card')
    const gap = 16
    const step = card ? (card.offsetWidth + gap) * 2 : 640
    track.current.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <section className="cir-section pc-section">
      <div className="pc-header cir-reveal">
        <div>
          <span className="cir-s-tag">Nossos Produtos</span>
          <h2 className="cp-h2 pc-h2">O produto certo<br />para cada projeto.</h2>
        </div>
        <div className="pc-controls">
          <a href={WA} target="_blank" rel="noopener noreferrer" className="cir-btn cir-btn--outline pc-orcamento">
            Solicitar orçamento
          </a>
          <div className="pc-nav">
            <button className="pc-arrow" onClick={() => scroll(-1)} aria-label="Anterior">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button className="pc-arrow" onClick={() => scroll(1)} aria-label="Próximo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="pc-track" ref={track}>
        {PRODUCTS.map((p, i) => (
          <a
            key={i}
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            className="pc-card cir-reveal"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <div className="pc-img-wrap">
              <img src={p.img} alt={p.alt} className="pc-img" loading="lazy" />
              <span className="pc-badge">{p.tag}</span>
            </div>
            <div className="pc-body">
              <h3 className="pc-name">{p.name}</h3>
              <p className="pc-desc">{p.desc}</p>
              <div className="pc-footer">
                <span className="pc-price">{p.price}</span>
                <span className="pc-cta-link">Solicitar →</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <style jsx global>{`
        .pc-section { overflow: hidden; padding-bottom: 5rem }
        .pc-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 3rem; gap: 2rem }
        .pc-h2 { margin-bottom: 0 !important }
        .pc-controls { display: flex; align-items: center; gap: 1.5rem; flex-shrink: 0 }
        .pc-orcamento { font-size: .72rem !important; padding: .65rem 1.4rem !important; white-space: nowrap }
        .pc-nav { display: flex; gap: .5rem }
        .pc-arrow { width: 42px; height: 42px; border: 1px solid rgba(255,255,255,.12); background: transparent; color: var(--cir-fg2); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: border-color .2s, color .2s }
        .pc-arrow:hover { border-color: var(--cir-accent); color: var(--cir-accent) }
        .pc-arrow svg { width: 16px; height: 16px }
        .pc-track { display: flex; gap: 1rem; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 1.5rem; scrollbar-width: none; -ms-overflow-style: none; margin: 0 calc(var(--cir-gutter) * -1); padding-left: var(--cir-gutter); padding-right: var(--cir-gutter) }
        .pc-track::-webkit-scrollbar { display: none }
        .pc-card { flex: 0 0 calc(33.333% - .7rem); min-width: 260px; scroll-snap-align: start; text-decoration: none; display: flex; flex-direction: column; border: 1px solid rgba(255,255,255,.06); transition: border-color .3s, transform .3s }
        .pc-card:hover { border-color: rgba(232,97,58,.35); transform: translateY(-3px) }
        .pc-img-wrap { position: relative; height: 220px; overflow: hidden }
        .pc-img { width: 100%; height: 100%; object-fit: cover; filter: brightness(.78) saturate(.55); transition: filter .5s, transform .5s }
        .pc-card:hover .pc-img { filter: brightness(.88) saturate(.75); transform: scale(1.04) }
        .pc-badge { position: absolute; top: 1rem; left: 1rem; font-family: var(--cir-sans); font-size: .57rem; font-weight: 600; letter-spacing: .14em; color: var(--cir-bg); background: var(--cir-gold); padding: .22rem .6rem }
        .pc-body { padding: 1.4rem 1.5rem; display: flex; flex-direction: column; flex: 1; background: rgba(255,255,255,.018) }
        .pc-name { font-family: var(--cir-serif); font-size: 1rem; font-weight: 700; color: var(--cir-fg); line-height: 1.2; margin-bottom: .5rem }
        .pc-desc { font-family: var(--cir-sans); font-size: .78rem; font-weight: 300; color: var(--cir-fg2); line-height: 1.65; margin-bottom: 1.2rem; flex: 1 }
        .pc-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,.06); padding-top: 1rem }
        .pc-price { font-family: var(--cir-sans); font-size: .68rem; font-weight: 400; color: var(--cir-gold); letter-spacing: .03em }
        .pc-cta-link { font-family: var(--cir-sans); font-size: .68rem; font-weight: 600; letter-spacing: .1em; color: var(--cir-accent); transition: letter-spacing .25s }
        .pc-card:hover .pc-cta-link { letter-spacing: .18em }
        @media (max-width: 1024px) { .pc-card { flex: 0 0 calc(50% - .5rem) } }
        @media (max-width: 640px) {
          .pc-card { flex: 0 0 80vw }
          .pc-header { flex-direction: column; align-items: flex-start; gap: 1.5rem }
          .pc-controls { width: 100%; justify-content: space-between }
          .pc-orcamento { display: none }
        }
      `}</style>
    </section>
  )
}
