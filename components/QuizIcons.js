// Ícones minimalistas em traço único, no mesmo espírito "ficha técnica de produção"
// do design system (--cir-serif é uma monoespaçada de datilografia).
const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' }

export function IconFolder(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6h6l6 5v7H4z" />
    </svg>
  )
}

export function IconCalendar(props) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="5" width="16" height="15" />
      <path d="M4 9.5h16M8 3v4M16 3v4" />
    </svg>
  )
}

export function IconTag(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4h6a2 2 0 012 2v6l-9 9-8-8z" />
      <circle cx="15.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconBag(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 8h12l1 12H5z" />
      <path d="M9 8V6a3 3 0 016 0v2" />
    </svg>
  )
}

export function IconBox(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8l8-4 8 4-8 4z" />
      <path d="M4 8v9l8 4 8-4V8" />
      <path d="M12 12v9" />
    </svg>
  )
}

export function IconBook(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 6c-1.6-1-4-1.4-6-1v13c2 0 4.4.4 6 1.4M12 6c1.6-1 4-1.4 6-1v13c-2 0-4.4.4-6 1.4V6z" />
    </svg>
  )
}

export function IconEnvelope(props) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="6" width="16" height="12" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  )
}

export function IconSpark(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M18 18l-3-3M6 18l3-3M18 6l-3 3" />
    </svg>
  )
}

export function IconLogoMark(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="12" cy="12" r="8" strokeDasharray="2 3" />
    </svg>
  )
}

export function IconFileCheck(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M9 13l2 2 4-4" />
    </svg>
  )
}

export function IconFileBlank(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3h8l4 4v14H6z" strokeDasharray="3 3" />
    </svg>
  )
}

export function IconEdit(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20l1-4.2L15.2 5.6a1.5 1.5 0 012.1 0l1.1 1.1a1.5 1.5 0 010 2.1L8.2 19 4 20z" />
      <path d="M13.5 7.3l3.2 3.2" />
    </svg>
  )
}

export function IconSparkles(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4l1.8 4.2L18 10l-4.2 1.8L12 16l-1.8-4.2L6 10l4.2-1.8z" />
      <path d="M18 15l.8 1.9L20.7 18l-1.9.8L18 20.7l-.8-1.9L15.3 18l1.9-.8z" />
    </svg>
  )
}

export function IconInfinity(props) {
  return (
    <svg {...base} {...props}>
      <path d="M7 9a3 3 0 000 6c1.7 0 2.6-1.2 3.6-2.6C11.6 10.9 12.8 9 14.5 9a3 3 0 010 6c-1.7 0-2.6-1.2-3.6-2.6" />
    </svg>
  )
}

export function IconBolt(props) {
  return (
    <svg {...base} {...props}>
      <path d="M13 2 5 14h5l-1 8 8-12h-5z" />
    </svg>
  )
}

export function IconClock(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}

export function IconCheck(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M8 12.5l2.6 2.6L16.5 9" />
    </svg>
  )
}

// Indicador de nível (acabamento): barras crescentes, como passes de produção.
export function LevelBars({ level, max = 3 }) {
  return (
    <span className="qz-levelbars" aria-hidden="true">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={`qz-levelbar ${i < level ? 'qz-levelbar--on' : ''}`} style={{ height: `${8 + i * 6}px` }} />
      ))}
    </span>
  )
}
