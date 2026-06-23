import Header from '../components/Header'
import Footer from '../components/Footer'
import ImageCarousel from '../components/ImageCarousel'
import ProductsCarousel from '../components/ProductsCarousel'
import AcabamentosSection from '../components/AcabamentosSection'
import Favicon from '../components/Favicon'
import cidades from '../cidades.json'
import { normalizeText } from '../utils/normalize'
import { galleryImages } from '../data/gallery'
import Head from 'next/head'

export default function Home() {
  // Agrupar cidades por estado
  const cidadesPorEstado = cidades.reduce((acc, cidade) => {
    if (!acc[cidade.estado]) {
      acc[cidade.estado] = [];
    }
    acc[cidade.estado].push(cidade);
    return acc;
  }, {});

  // Definir principais cidades (primeiras 5 de cada estado)
  const principaisCidades = Object.keys(cidadesPorEstado).reduce((acc, estado) => {
    acc[estado] = cidadesPorEstado[estado].slice(0, 5);
    return acc;
  }, {});

  return (
    <div className="cir-root">
      <Head>
        <title>CIR Gráfica - Serviços de Impressão Gráfica, Embalagens e Sacolas Personalizadas</title>
        <meta name="description" content="CIR Gráfica oferece serviços de embalagens e sacolas personalizadas, brindes personalizados e comunicação visual em todo o Brasil. Qualidade profissional com entrega rápida." />
        <meta name="keywords" content="gráfica, embalagens personalizadas, sacolas personalizadas, brindes personalizados, comunicação visual, CIR Gráfica" />
        <meta name="author" content="CIR Gráfica" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://cidades.cirgrafica.com.br" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cidades.cirgrafica.com.br" />
        <meta property="og:title" content="CIR Gráfica - Embalagens, Impressos gráficos e Sacolas Personalizadas" />
        <meta property="og:description" content="Serviços de gráfica em todo o Brasil. Embalagens e sacolas personalizadas, brindes personalizados e comunicação visual." />
        <meta property="og:image" content="https://www.cirgrafica.com.br/og-image.jpg" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://cidades.cirgrafica.com.br" />
        <meta property="twitter:title" content="CIR Gráfica - Embalagens, Impressões Personalizadas e Sacolas Personalizadas" />
        <meta property="twitter:description" content="Serviços de gráfica em todo o Brasil. Embalagens e sacolas personalizadas, brindes personalizados e comunicação visual." />
        <meta property="twitter:image" content="https://www.cirgrafica.com.br/og-image.jpg" />
      </Head>

      <Favicon />
      <Header />

      {/* Hero */}
      <div className="cp-hero">
        <span className="cir-s-tag">Desde 1994 · Goiânia, GO</span>
        <h1 className="cp-h1 cp-h1--xl">
          Serviço Completo de Gráfica<br />
          <em>com Atendimento em Todo o Brasil</em>
        </h1>
        <p className="cp-intro">
          Embalagens personalizadas, impressões gráficas, sacolas, brindes corporativos e soluções de comunicação visual.
          Qualidade profissional, entrega rápida e atendimento especializado em 374 cidades.
        </p>
        <div className="hp-hero-btns">
          <a href="https://www.cirgrafica.com.br/portfolio-de-cases/" target="_blank" rel="noopener noreferrer" className="cir-btn cir-btn--fill">
            Baixe nosso portfólio
          </a>
          <a href="https://www.cirgrafica.com.br/orcamento-rapido/" target="_blank" rel="noopener noreferrer" className="cir-btn cir-btn--outline">
            Solicite um orçamento
          </a>
        </div>
      </div>

      {/* Estados */}
      <div className="cir-section cir-section--light">
        <span className="cir-s-tag">Cobertura nacional</span>
        <h2 className="cp-h2">Serviços de Gráfica por Estado</h2>
        <div className="hp-states-grid">
          {Object.keys(cidadesPorEstado).map((estado) => (
            <div key={estado} className="hp-state-card">
              <div className="hp-state-header">
                <h3>{estado}</h3>
                <span>{cidadesPorEstado[estado].length} cidades</span>
              </div>
              <div className="hp-state-cities">
                {principaisCidades[estado].map((cidade, index) => (
                  <a
                    key={index}
                    href={`/grafica/${estado.toLowerCase()}/${normalizeText(cidade.cidade)}`}
                    className="hp-state-city"
                  >
                    Gráfica em {cidade.cidade} →
                  </a>
                ))}
                {cidadesPorEstado[estado].length > 5 && (
                  <a href={`/grafica/estado/${estado.toLowerCase()}`} className="hp-state-more">
                    Ver todas as {cidadesPorEstado[estado].length} cidades →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Galeria */}
      <div className="cir-section">
        <ImageCarousel
          images={galleryImages}
          title="Materiais que podem ser solicitados"
          autoPlay={true}
          interval={4000}
        />
      </div>

      <AcabamentosSection />

      <ProductsCarousel />

      <hr className="cir-divider" />

      {/* Serviços */}
      <div className="cir-section cir-section--light">
        <span className="cir-s-tag">Serviços</span>
        <h2 className="cp-h2">Nossos Serviços</h2>
        <div className="cp-services-grid" style={{ background: 'var(--cir-l-line)' }}>
          {[
            { title: 'Materiais Institucionais', body: 'Cartões de visita, papel timbrado, pastas e folders institucionais para fortalecer a identidade da sua marca.', items: ['Cartões de visita', 'Papel timbrado', 'Pastas executivas', 'Folders institucionais'] },
            { title: 'Materiais Promocionais', body: 'Flyers, banners, adesivos e catálogos para divulgar seus produtos e serviços com impacto.', items: ['Flyers e panfletos', 'Banners e faixas', 'Adesivos personalizados', 'Catálogos promocionais'] },
            { title: 'Impressão Digital e Offset', body: 'Soluções rápidas para pequenas tiragens e produções offset para grandes volumes com acabamento impecável.', items: ['Impressão digital rápida', 'Produção offset', 'Pequenas e grandes tiragens', 'Acabamento profissional'] },
            { title: 'Impressão Editorial', body: 'Revistas, livros e apostilas com acabamento impecável para projetos editoriais de qualidade.', items: ['Revistas e jornais', 'Livros e manuais', 'Apostilas educacionais', 'Publicações corporativas'] },
            { title: 'Moda e Etiquetas', body: 'Tags e etiquetas que valorizam as peças e contam a história da sua marca no setor da moda.', items: ['Tags personalizadas', 'Etiquetas de roupas', 'Identificação de produtos', 'Materiais têxteis'] },
            { title: 'Embalagens e Sacolas', body: 'Caixas e sacolas personalizadas para criar experiências únicas na entrega e destacar sua marca.', items: ['Caixas personalizadas', 'Sacolas promocionais', 'Envelopes personalizados', 'Displays promocionais'] },
          ].map((s, i) => (
            <div key={i} className="cp-service" style={{ background: 'var(--cir-l-bg)' }}>
              <h3 style={{ color: 'var(--cir-accent)' }}>{s.title}</h3>
              <p style={{ color: 'var(--cir-l-fg2)' }}>{s.body}</p>
              <ul>{s.items.map((item, j) => <li key={j} style={{ color: 'var(--cir-l-fg2)' }}>{item}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>

      <hr className="cir-divider" />

      {/* Por que CIR */}
      <div className="cir-section">
        <span className="cir-s-tag">Por que a CIR</span>
        <h2 className="cp-h2">Por que escolher a CIR Gráfica?</h2>
        <div className="hp-reasons">
          {[
            { num: '30+', label: 'Anos de mercado', body: 'Experiência consolidada em produção gráfica de alto padrão' },
            { num: '+5k', label: 'Clientes atendidos', body: 'Empresas de todos os setores confiam na qualidade CIR' },
            { num: '100%', label: 'Online', body: 'Atendimento digital completo, do orçamento à entrega' },
            { num: '374', label: 'Cidades', body: 'Cobertura nacional com entrega para todo o Brasil' },
          ].map((r, i) => (
            <div key={i} className="hp-reason">
              <div className="hp-reason-num">{r.num}</div>
              <div className="hp-reason-label">{r.label}</div>
              <p className="cp-body">{r.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="cp-cta">
        <h2>Precisa de serviços de gráfica?</h2>
        <p>Entre em contato conosco e solicite seu orçamento gratuito!</p>
        <div className="cp-cta-btns">
          <a href="https://www.cirgrafica.com.br/orcamento-rapido/" target="_blank" rel="noopener noreferrer" className="btn-primary">Solicitar Orçamento</a>
          <a href="https://www.cirgrafica.com.br/portfolio-de-cases/" target="_blank" rel="noopener noreferrer" className="btn-secondary">Ver Portfólio</a>
        </div>
      </div>

      <Footer />

      <style jsx global>{`
        .hp-hero-btns { display: flex; gap: 1.5rem; margin-top: 3rem; flex-wrap: wrap }
        .hp-states-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; margin-top: 3rem; background: var(--cir-l-line) }
        .hp-state-card { background: var(--cir-l-bg); display: flex; flex-direction: column }
        .hp-state-header { padding: 1.2rem 1.5rem; border-bottom: 1px solid var(--cir-l-line); display: flex; align-items: baseline; justify-content: space-between }
        .hp-state-header h3 { font-family: var(--cir-sans); font-size: .72rem; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--cir-l-fg) }
        .hp-state-header span { font-family: var(--cir-sans); font-size: .65rem; font-weight: 300; color: var(--cir-l-fg2) }
        .hp-state-cities { padding: 1rem 1.5rem 1.5rem; display: flex; flex-direction: column; gap: .4rem }
        .hp-state-city { font-family: var(--cir-sans); font-size: .78rem; font-weight: 300; color: var(--cir-l-fg2); text-decoration: none; transition: color .2s }
        .hp-state-city:hover { color: var(--cir-accent) }
        .hp-state-more { font-family: var(--cir-sans); font-size: .7rem; font-weight: 400; letter-spacing: .08em; color: var(--cir-accent); text-decoration: none; margin-top: .6rem; opacity: .7; transition: opacity .2s }
        .hp-state-more:hover { opacity: 1 }
        .hp-reasons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; margin-top: 3rem; background: var(--cir-line) }
        .hp-reason { background: var(--cir-bg); padding: 3rem 2.5rem }
        .hp-reason-num { font-family: var(--cir-serif); font-size: 3rem; font-weight: 700; color: var(--cir-fg); line-height: 1; margin-bottom: .4rem }
        .hp-reason-label { font-family: var(--cir-sans); font-size: .65rem; font-weight: 400; letter-spacing: .14em; text-transform: uppercase; color: var(--cir-fg2); margin-bottom: 1rem }
        @media (max-width: 1024px) { .hp-states-grid { grid-template-columns: repeat(2, 1fr) } .hp-reasons { grid-template-columns: repeat(2, 1fr) } }
        @media (max-width: 768px) { .hp-states-grid { grid-template-columns: 1fr } .hp-reasons { grid-template-columns: 1fr 1fr } .hp-hero-btns { flex-direction: column } }
      `}</style>

      <a href="https://api.whatsapp.com/send?phone=556232021150&text=Ol%C3%A1!%20vim%20pelo%20site%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es!" target="_blank" rel="noopener noreferrer" className="cir-wa-fab" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    </div>
  )
}