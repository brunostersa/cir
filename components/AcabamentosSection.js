import { useState } from 'react'

const ACABAMENTOS = [
  {
    id: 'fosca',
    name: 'Laminação Fosca',
    tagline: 'Elegância discreta e toque aveludado',
    desc: 'A laminação fosca cobre toda a superfície com uma película mate que elimina reflexos e oferece sensação tátil sofisticada. Protege contra arranhões e umidade — ideal para materiais de alto padrão que transmitem seriedade e refinamento.',
    benefits: ['Proteção contra arranhões', 'Aspecto sofisticado', 'Elimina reflexos', 'Toque aveludado'],
    ideal: 'Cartões de visita, catálogos premium, capas de agendas e folders institucionais.',
    img: '/conceituais/materiais-graficos-impressao33.jpeg',
  },
  {
    id: 'uv',
    name: 'Verniz UV',
    tagline: 'Brilho intenso onde a peça mais importa',
    desc: 'O verniz UV pode ser aplicado de forma total ou localizada — realçando apenas os elementos que merecem destaque. O contraste entre a área envernizada e o fundo cria profundidade visual única. Combinado com laminação fosca, produz um efeito premium inconfundível.',
    benefits: ['Brilho seletivo ou total', 'Contraste visual marcante', 'Proteção da superfície', 'Combina com laminação fosca'],
    ideal: 'Logos em cartões, títulos em catálogos, capas de press kits e materiais de apresentação.',
    img: '/conceituais/materiais-graficos-impressao11.jpeg',
  },
  {
    id: 'hot',
    name: 'Hot Stamping',
    tagline: 'Metalização que comunica luxo',
    desc: 'O hot stamping aplica folhas metálicas — ouro, prata, cobre ou cores especiais — por pressão e calor. O resultado é um brilho metálico real, impossível de replicar por impressão convencional. Transforma qualquer peça em objeto de valor e atribui percepção premium imediata.',
    benefits: ['Ouro, prata, cobre e mais', 'Brilho metálico real', 'Alta percepção de valor', 'Resistência ao desgaste'],
    ideal: 'Logomarcas em cartões e capas, embalagens de luxo, agendas executivas e convites especiais.',
    img: '/conceituais/materiais-graficos-impressao34.jpeg',
  },
  {
    id: 'relevo',
    name: 'Relevo Seco',
    tagline: 'Dimensão tátil sem tinta',
    desc: 'O relevo seco (embossing) cria uma impressão tridimensional na superfície do papel sem uso de tinta. A peça ganha textura e profundidade perceptível ao toque — uma experiência sensorial que valoriza a marca em silêncio e comunica excelência técnica antes mesmo de ser lida.',
    benefits: ['Dimensão tátil real', 'Sem tinta ou foil', 'Alto impacto sensorial', 'Combina com hot stamping'],
    ideal: 'Logomarcas em papelaria executiva, tampas de caixas, certificados e convites de alto padrão.',
    img: '/conceituais/materiais-graficos-impressao19.jpeg',
  },
  {
    id: 'corte',
    name: 'Corte Especial',
    tagline: 'Formatos que quebram o padrão',
    desc: 'A faca de corte personalizada permite criar peças em formatos não convencionais — cantos arredondados, recortes internos, formas orgânicas ou geométricas complexas. O resultado é uma peça que literalmente se destaca em qualquer contexto de apresentação.',
    benefits: ['Formatos personalizados', 'Cantos arredondados', 'Recortes internos', 'Diferenciação imediata'],
    ideal: 'Cartões de visita diferenciados, etiquetas, displays de mesa, embalagens e materiais de PDV.',
    img: '/conceituais/materiais-graficos-impressao7.jpeg',
  },
  {
    id: 'encad',
    name: 'Encadernação Premium',
    tagline: 'Acabamento que dura e impressiona',
    desc: 'Da costura à capa dura, cada método de encadernação serve a um propósito — e indicamos o ideal para o seu projeto. Wire-o para praticidade, costura para sofisticação, capa dura para durabilidade máxima. Miolo pautado, pontilhado, quadriculado ou em branco.',
    benefits: ['Wire-o, costura ou capa dura', 'Miolo personalizado', 'Alta durabilidade', 'Acabamento profissional'],
    ideal: 'Agendas executivas, cadernos corporativos, portfólios, catálogos e materiais de consulta permanente.',
    img: '/conceituais/materiais-graficos-impressao5.jpeg',
  },
]

export default function AcabamentosSection() {
  const [active, setActive] = useState(0)
  const ac = ACABAMENTOS[active]

  return (
    <section className="cir-section cir-section--light ac-section">
      <div className="ac-header cir-reveal">
        <span className="cir-s-tag">Acabamentos & Variações</span>
        <h2 className="cp-h2 ac-h2">O detalhe que eleva<br />o valor percebido.</h2>
        <p className="cp-body ac-intro">
          Cada acabamento transforma um impresso comum em uma peça que impressiona —
          antes mesmo de ser lida.
        </p>
      </div>

      <div className="ac-tabs cir-reveal cir-reveal--d1">
        {ACABAMENTOS.map((a, i) => (
          <button
            key={a.id}
            className={`ac-tab ${i === active ? 'active' : ''}`}
            onClick={() => setActive(i)}
          >
            {a.name}
          </button>
        ))}
      </div>

      <div className="ac-panel" key={ac.id}>
        <div className="ac-content">
          <p className="ac-tagline">{ac.tagline}</p>
          <p className="ac-desc">{ac.desc}</p>
          <ul className="ac-benefits">
            {ac.benefits.map((b, i) => (
              <li key={i} className="ac-benefit">
                <span className="ac-check">→</span>
                {b}
              </li>
            ))}
          </ul>
          <div className="ac-ideal">
            <span className="ac-ideal-label">Ideal para</span>
            <p className="ac-ideal-text">{ac.ideal}</p>
          </div>
        </div>
        <div className="ac-img-wrap">
          <img src={ac.img} alt={ac.name} className="ac-img" />
          <div className="ac-img-label">{ac.name}</div>
        </div>
      </div>

      <style jsx global>{`
        .ac-section { }
        .ac-header { margin-bottom: 3rem }
        .ac-h2 { color: var(--cir-l-fg) !important; margin-bottom: 1rem !important }
        .ac-intro { max-width: 520px; color: var(--cir-l-fg2) !important }
        .ac-tabs { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: 3rem; border-bottom: 1px solid var(--cir-l-line); padding-bottom: 0 }
        .ac-tab { font-family: var(--cir-sans); font-size: .72rem; font-weight: 400; letter-spacing: .08em; color: var(--cir-l-fg2); background: transparent; border: none; cursor: pointer; padding: .75rem 1.2rem; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: color .2s, border-color .2s }
        .ac-tab:hover { color: var(--cir-l-fg) }
        .ac-tab.active { color: var(--cir-accent); border-bottom-color: var(--cir-accent); font-weight: 600 }
        .ac-panel { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; animation: ac-fade .35s ease }
        .ac-tagline { font-family: var(--cir-sans); font-size: .72rem; font-weight: 600; letter-spacing: .14em; color: var(--cir-accent); margin-bottom: 1.2rem }
        .ac-desc { font-family: var(--cir-sans); font-size: .9rem; font-weight: 300; line-height: 1.85; color: var(--cir-l-fg2); margin-bottom: 2rem }
        .ac-benefits { list-style: none; padding: 0; margin: 0 0 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: .6rem }
        .ac-benefit { font-family: var(--cir-sans); font-size: .78rem; font-weight: 400; color: var(--cir-l-fg); display: flex; align-items: center; gap: .5rem }
        .ac-check { color: var(--cir-accent); font-size: .85rem; flex-shrink: 0 }
        .ac-ideal { border-top: 1px solid var(--cir-l-line); padding-top: 1.5rem }
        .ac-ideal-label { font-family: var(--cir-sans); font-size: .62rem; font-weight: 600; letter-spacing: .14em; color: var(--cir-l-fg2); display: block; margin-bottom: .4rem }
        .ac-ideal-text { font-family: var(--cir-sans); font-size: .8rem; font-weight: 300; color: var(--cir-l-fg); line-height: 1.6 }
        .ac-img-wrap { position: relative; overflow: hidden }
        .ac-img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; filter: saturate(.7) }
        .ac-img-label { position: absolute; bottom: 0; left: 0; right: 0; padding: 1.2rem 1.5rem; background: linear-gradient(to top, rgba(0,0,0,.6) 0%, transparent 100%); font-family: var(--cir-serif); font-size: .9rem; font-weight: 700; color: #fff }
        @keyframes ac-fade { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
        @media (max-width: 900px) {
          .ac-panel { grid-template-columns: 1fr; gap: 2.5rem }
          .ac-img-wrap { order: -1 }
          .ac-benefits { grid-template-columns: 1fr }
        }
        @media (max-width: 600px) {
          .ac-tabs { gap: .3rem }
          .ac-tab { font-size: .65rem; padding: .6rem .8rem }
        }
      `}</style>
    </section>
  )
}
