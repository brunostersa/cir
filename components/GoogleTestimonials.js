import { testimonials, googleReviewsUrl, googleRating } from '../data/testimonials'

function initials(name) {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

function Stars({ count }) {
  return (
    <div className="cp-t-stars" aria-label={`${count} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill={i < count ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1">
          <path d="M10 1.5l2.59 5.25 5.8.84-4.2 4.09.99 5.77L10 14.77l-5.18 2.68.99-5.77-4.2-4.09 5.8-.84L10 1.5z" />
        </svg>
      ))}
    </div>
  )
}

export default function GoogleTestimonials() {
  return (
    <div className="cp-testimonials">
      <div className="cp-t-head">
        <div>
          <span className="cir-s-tag cir-reveal">Depoimentos</span>
          <h2 className="cp-h2 cir-reveal cir-reveal--d1">O que dizem no Google</h2>
        </div>
        <a href={googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="cp-google-badge">
          <svg viewBox="0 0 48 48" width="20" height="20">
            <path fill="#FFC107" d="M43.6 20.5H42V20.4H24v7.2h11.3c-1.6 4.7-6.1 8.1-11.3 8.1-6.9 0-12.5-5.6-12.5-12.5S17.1 10.7 24 10.7c3.2 0 6 1.2 8.2 3.1l5.1-5.1C34.4 5.6 29.5 3.5 24 3.5 12.7 3.5 3.5 12.7 3.5 24S12.7 44.5 24 44.5c11 0 20.5-8 20.5-20.5 0-1.4-.1-2.4-.4-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l5.9 4.3C13.7 15.1 18.5 12 24 12c3.2 0 6 1.2 8.2 3.1l5.1-5.1C34.4 6.6 29.5 4.5 24 4.5c-7.4 0-13.8 4.1-17 10.2z"/>
            <path fill="#4CAF50" d="M24 44.5c5.4 0 10.2-1.9 13.9-5.2l-5.7-4.9c-2 1.5-4.6 2.5-8.2 2.5-5.6 0-10.3-3.5-11.9-8.6l-5.9 4.5C9.9 40.1 16.4 44.5 24 44.5z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20.4H24v7.2h11.3c-.7 2.2-2.2 4.1-4.1 5.4l5.7 4.9c-.4.4 6.6-4.8 6.6-14.5 0-1.4-.1-2.4-.4-3.5z"/>
          </svg>
          <span>{googleRating.value}/5 · {googleRating.count}+ avaliações</span>
        </a>
      </div>

      <div className="cp-testimonials-grid cir-reveal cir-reveal--d1">
        {testimonials.map((t, i) => (
          <div className="cp-t-card" key={i}>
            <Stars count={t.rating} />
            <p className="cp-t-text">"{t.text}"</p>
            <div className="cp-t-author">
              <span className="cp-t-avatar">{initials(t.name)}</span>
              <div>
                <p className="cp-t-name">{t.name}</p>
                {t.role && <p className="cp-t-role">{t.role}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
