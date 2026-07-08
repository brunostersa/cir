import { useState, useEffect } from 'react'

const ImageCarousel = ({ images, title, autoPlay = true, interval = 5000 }) => {
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(autoPlay)

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setCurrent(i => (i + 1) % images.length), interval)
    return () => clearInterval(t)
  }, [playing, interval, images.length])

  const go = (i) => { setCurrent((i + images.length) % images.length); setPlaying(false) }

  return (
    <div className="ic-wrap">
      {title && <h2 className="ic-title">{title}</h2>}

      <div className="ic-stage">
        <img
          key={current}
          src={images[current].src}
          alt={images[current].alt}
          className="ic-img"
        />
        <div className="ic-overlay">
          <h3 className="ic-slide-title">{images[current].title}</h3>
          <p className="ic-slide-desc">{images[current].description}</p>
        </div>

        <button className="ic-nav ic-nav--prev" onClick={() => go(current - 1)} aria-label="Anterior">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button className="ic-nav ic-nav--next" onClick={() => go(current + 1)} aria-label="Próxima">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5l7 7-7 7"/></svg>
        </button>

        <div className="ic-dots">
          {images.map((_, i) => (
            <button key={i} className={`ic-dot ${i === current ? 'active' : ''}`} onClick={() => go(i)} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>

        <span className="ic-counter">{current + 1} / {images.length}</span>
      </div>

      <div className="ic-thumbs">
        {images.map((img, i) => (
          <button key={i} className={`ic-thumb ${i === current ? 'active' : ''}`} onClick={() => go(i)}>
            <img src={img.src} alt={img.alt} />
          </button>
        ))}
      </div>

      <style jsx>{`
        .ic-wrap { width: 100% }
        .ic-title { font-family: var(--cir-serif); font-size: clamp(1.4rem, 2.2vw, 2.2rem); font-weight: 700; color: inherit; margin-bottom: 2.5rem; line-height: 1.15 }
        .ic-stage { position: relative; overflow: hidden; height: 480px }
        .ic-img { width: 100%; height: 100%; object-fit: cover; filter: brightness(.75) saturate(.55); display: block }
        .ic-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,.65) 0%, transparent 55%); display: flex; flex-direction: column; justify-content: flex-end; padding: 2.5rem }
        .ic-slide-title { font-family: var(--cir-serif); font-size: 1.3rem; font-weight: 700; color: #fff; margin-bottom: .4rem }
        .ic-slide-desc { font-family: var(--cir-sans); font-size: .78rem; font-weight: 400; color: rgba(255,255,255,.75); line-height: 1.6 }
        .ic-nav { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(12,11,9,.6); border: 1px solid rgba(255,255,255,.12); color: #fff; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background .2s; padding: 0 }
        .ic-nav svg { width: 18px; height: 18px }
        .ic-nav:hover { background: rgba(232,97,58,.85) }
        .ic-nav--prev { left: 1.5rem }
        .ic-nav--next { right: 1.5rem }
        .ic-dots { position: absolute; bottom: 1.5rem; right: 2.5rem; display: flex; gap: 6px }
        .ic-dot { width: 20px; height: 2px; background: rgba(255,255,255,.25); border: none; cursor: pointer; padding: 0; transition: background .3s, width .3s }
        .ic-dot.active { background: #fff; width: 32px }
        .ic-counter { position: absolute; top: 1.5rem; left: 2rem; font-family: var(--cir-sans); font-size: .62rem; font-weight: 400; letter-spacing: .14em; color: rgba(255,255,255,.4) }
        .ic-thumbs { display: flex; gap: 2px; margin-top: 2px; overflow-x: auto }
        .ic-thumb { flex-shrink: 0; width: 72px; height: 52px; overflow: hidden; border: none; cursor: pointer; padding: 0; opacity: .45; transition: opacity .3s }
        .ic-thumb.active, .ic-thumb:hover { opacity: 1 }
        .ic-thumb img { width: 100%; height: 100%; object-fit: cover; filter: saturate(.4) }
        .ic-thumb.active img, .ic-thumb:hover img { filter: saturate(.8) }
        @media (max-width: 768px) { .ic-stage { height: 300px } .ic-thumbs { display: none } }
      `}</style>
    </div>
  )
}

export default ImageCarousel
