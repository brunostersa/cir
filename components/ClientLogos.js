import { useEffect, useRef, useState } from 'react'

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

// Carrossel com 3 colunas visíveis (responsivo até mobile) que avança sozinho
// e volta pro início ao chegar no fim — pausa no hover/toque.
export default function ClientLogos({ light = false, title = 'Marcas que confiam na CIR' }) {
  const track = useRef(null)
  const [paused, setPaused] = useState(false)

  const scrollByCard = (dir) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('.cl-card')
    const gap = 16
    const step = card ? card.offsetWidth + gap : 220

    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    if (dir > 0 && atEnd) {
      el.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      el.scrollBy({ left: dir * step, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => scrollByCard(1), 2800)
    return () => clearInterval(t)
  }, [paused])

  return (
    <div
      className={`cir-section cl-section ${light ? 'cir-section--light' : ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <span className="cir-s-tag">Clientes</span>
      <h2 className="cp-h2">{title}</h2>

      <div className="cl-carousel">
        <div className="cl-track" ref={track}>
          {CLIENTS.map((c, i) => (
            <div key={c.slug} className="cl-card cir-reveal" style={{ animationDelay: `${i * 0.04}s` }}>
              <img src={`/logos-clientes/${c.slug}.png`} alt={c.name} loading="lazy" />
            </div>
          ))}
        </div>

        <div className="cl-nav">
          <button type="button" className="cl-arrow" onClick={() => scrollByCard(-1)} aria-label="Anterior">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button type="button" className="cl-arrow" onClick={() => scrollByCard(1)} aria-label="Próximo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <style jsx global>{`
        .cl-section { padding-top: 4rem; padding-bottom: 4rem }
        .cl-carousel { position: relative; margin-top: 3rem }
        .cl-track {
          display: flex; gap: 1rem; overflow-x: auto; scroll-snap-type: x mandatory;
          scrollbar-width: none; -ms-overflow-style: none; padding-bottom: .5rem;
        }
        .cl-track::-webkit-scrollbar { display: none }
        .cl-card {
          flex: 0 0 calc(33.333% - .7rem); scroll-snap-align: start; height: 110px;
          background: #fff; border: 1px solid var(--cir-line); display: flex; align-items: center;
          justify-content: center; padding: 1.2rem 1.6rem; transition: transform .3s, border-color .3s;
        }
        .cir-section--light .cl-card { border-color: var(--cir-l-line) }
        .cl-card:hover { transform: translateY(-3px); border-color: var(--cir-accent) }
        .cl-card img { max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain }
        .cl-nav { display: flex; justify-content: flex-end; gap: .5rem; margin-top: 1rem }
        .cl-arrow {
          width: 38px; height: 38px; border: 1px solid rgba(255,255,255,.12); background: transparent;
          color: var(--cir-fg2); cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: border-color .2s, color .2s; padding: 0;
        }
        .cir-section--light .cl-arrow { border-color: var(--cir-l-line); color: var(--cir-l-fg2) }
        .cl-arrow:hover { border-color: var(--cir-accent); color: var(--cir-accent) }
        .cl-arrow svg { width: 14px; height: 14px }
        @media (max-width: 640px) {
          .cl-card { flex: 0 0 calc(33.333% - .5rem); height: 78px; padding: .7rem .8rem }
          .cl-track { gap: .5rem }
        }
      `}</style>
    </div>
  )
}
