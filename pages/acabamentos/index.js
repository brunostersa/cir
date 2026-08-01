import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Favicon from '../../components/Favicon'
import WhatsAppLink from '../../components/WhatsAppLink'
import acabamentos from '../../data/acabamentos.json'
import Head from 'next/head'
import Link from 'next/link'

export async function getStaticProps() {
  return {
    props: {
      acabamentos
    }
  };
}

export default function AcabamentosHub({ acabamentos }) {
  const pageTitle = 'Acabamentos Gráficos: Guia Completo de Técnicas Profissionais | CIR Gráfica';
  const pageDescription = 'Conheça os melhores acabamentos gráficos: laminação fosca, verniz UV, hot stamping, relevo seco, corte especial e encadernação. Guia completo com preços e prazos.';
  const canonicalUrl = 'https://cidades.cirgrafica.com.br/acabamentos';

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Acabamentos Gráficos",
    "description": pageDescription,
    "url": canonicalUrl,
    "publisher": {
      "@type": "Organization",
      "name": "CIR Gráfica"
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": acabamentos.map((ac, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": ac.nome,
        "url": `${canonicalUrl}/${ac.id}`
      }))
    }
  };

  return (
    <div className="cir-root ac-hub-page">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="acabamentos gráficos, laminação fosca, verniz UV, hot stamping, relevo seco, corte especial, encadernação" />
        <meta name="author" content="CIR Gráfica" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:site_name" content="CIR Gráfica" />
        <meta property="og:locale" content="pt_BR" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      </Head>

      <Favicon />
      <Header />

      {/* Breadcrumb */}
      <nav className="ac-breadcrumb" aria-label="Breadcrumb">
        <div className="ac-breadcrumb-inner">
          <Link href="/">Home</Link>
          <span>/</span>
          <span aria-current="page">Acabamentos</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="ac-hub-hero">
        <div className="ac-hub-hero-content">
          <h1>Acabamentos Gráficos</h1>
          <p>A melhor forma de transformar um impresso comum em uma peça que impressiona</p>
          <p className="ac-hub-hero-subtitle">Conheça as técnicas profissionais que elevam o valor percebido de seus materiais</p>
        </div>
      </section>

      {/* Intro */}
      <section className="ac-hub-intro">
        <div className="ac-intro-content">
          <h2>O Que São Acabamentos Gráficos?</h2>
          <p>
            Acabamentos gráficos são técnicas aplicadas após a impressão que transformam um simples impresso em uma peça de impacto visual.
            Cada acabamento oferece diferentes benefícios: proteção, brilho, textura tátil, ou formatos únicos. Juntos, comunicam qualidade,
            refinamento e atenção aos detalhes.
          </p>
          <p>
            A escolha correta do acabamento pode aumentar em até 3x o valor percebido do produto e criar uma experiência memorável para
            quem recebe seus materiais.
          </p>
        </div>
      </section>

      {/* Grid de Acabamentos */}
      <section className="ac-hub-grid">
        <div className="ac-hub-grid-header">
          <h2>Os 6 Principais Acabamentos</h2>
          <p>Clique em cada um para conhecer detalhes, preços, prazos e aplicações</p>
        </div>

        <div className="ac-hub-cards">
          {acabamentos.map((ac) => (
            <Link key={ac.id} href={`/acabamentos/${ac.id}`} className="ac-hub-card">
              <div className="ac-hub-card-image">
                <img src={ac.img} alt={`${ac.nome} - CIR Gráfica`} />
              </div>
              <div className="ac-hub-card-content">
                <h3>{ac.nome}</h3>
                <p className="ac-hub-card-tagline">{ac.tagline}</p>
                <p className="ac-hub-card-desc">{ac.descricaoCurta}</p>
                <div className="ac-hub-card-footer">
                  <span className="ac-hub-card-link">Ver guia completo →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Comparativo Inteligente */}
      <section className="ac-hub-compare">
        <h2>Escolher o Acabamento Certo</h2>
        <div className="ac-compare-table">
          <div className="ac-compare-header">
            <div className="ac-compare-col-1">Acabamento</div>
            <div className="ac-compare-col-2">Custo</div>
            <div className="ac-compare-col-3">Impacto</div>
            <div className="ac-compare-col-4">Prazo</div>
            <div className="ac-compare-col-5">Ideal Para</div>
          </div>

          <Link href="/acabamentos/laminacao-fosca" className="ac-compare-row">
            <div className="ac-compare-name">Laminação Fosca</div>
            <div className="ac-compare-cost ac-cost-medium">Médio</div>
            <div className="ac-compare-impact">⭐⭐⭐⭐</div>
            <div className="ac-compare-speed">Rápido</div>
            <div className="ac-compare-ideal">Cartões, capas, corporativo</div>
          </Link>

          <Link href="/acabamentos/verniz-uv" className="ac-compare-row">
            <div className="ac-compare-name">Verniz UV</div>
            <div className="ac-compare-cost ac-cost-medium-high">Médio-Alto</div>
            <div className="ac-compare-impact">⭐⭐⭐⭐⭐</div>
            <div className="ac-compare-speed">Médio</div>
            <div className="ac-compare-ideal">Logos, destaques, premium</div>
          </Link>

          <Link href="/acabamentos/hot-stamping" className="ac-compare-row ac-compare-row-luxury">
            <div className="ac-compare-name">🌟 Hot Stamping</div>
            <div className="ac-compare-cost ac-cost-high">Alto</div>
            <div className="ac-compare-impact">⭐⭐⭐⭐⭐</div>
            <div className="ac-compare-speed">Longo</div>
            <div className="ac-compare-ideal">Luxo, convites, marcas</div>
          </Link>

          <Link href="/acabamentos/relevo-seco" className="ac-compare-row">
            <div className="ac-compare-name">Relevo Seco</div>
            <div className="ac-compare-cost ac-cost-medium-high">Médio-Alto</div>
            <div className="ac-compare-impact">⭐⭐⭐⭐</div>
            <div className="ac-compare-speed">Médio</div>
            <div className="ac-compare-ideal">Executivo, certificados</div>
          </Link>

          <Link href="/acabamentos/corte-especial" className="ac-compare-row">
            <div className="ac-compare-name">Corte Especial</div>
            <div className="ac-compare-cost ac-cost-medium">Médio</div>
            <div className="ac-compare-impact">⭐⭐⭐⭐⭐</div>
            <div className="ac-compare-speed">Rápido</div>
            <div className="ac-compare-ideal">Cartões, etiquetas, PDV</div>
          </Link>

          <Link href="/acabamentos/encadernacao-premium" className="ac-compare-row">
            <div className="ac-compare-name">Encadernação Premium</div>
            <div className="ac-compare-cost ac-cost-medium-high">Médio-Alto</div>
            <div className="ac-compare-impact">⭐⭐⭐⭐</div>
            <div className="ac-compare-speed">Longo</div>
            <div className="ac-compare-ideal">Catálogos, agendas, portfólio</div>
          </Link>
        </div>

        <div className="ac-compare-legend">
          <span><strong>Custo:</strong> baseado em volume padrão</span>
          <span><strong>Impacto:</strong> percepção visual e diferenciação</span>
          <span><strong>Prazo:</strong> tempo de produção aproximado</span>
        </div>
      </section>

      {/* CTA */}
      <section className="ac-hub-cta">
        <h2>Transforme Seus Materiais Gráficos</h2>
        <p>Não sabe qual acabamento escolher? Converse com nossos especialistas!</p>
        <a href="https://wa.me/556232021150" target="_blank" rel="noopener noreferrer" className="ac-hub-btn">
          💬 Solicitar Consultoria
        </a>
      </section>

      <WhatsAppLink />
      <Footer />

      <style jsx>{`
        /* ── Page Light ────────────────────── */
        .ac-hub-page {
          background: #ffffff;
          color: #2a2420;
        }

        /* ── Breadcrumb ────────────────────── */
        .ac-breadcrumb {
          background: #f9f7f2;
          border-bottom: 1px solid #e8d4c4;
          margin-top: 80px;
        }

        .ac-breadcrumb-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0.75rem 2rem;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ac-breadcrumb a {
          color: #e8613a;
          text-decoration: none;
        }

        .ac-breadcrumb a:hover {
          opacity: 0.7;
        }

        .ac-breadcrumb span {
          color: #6a6460;
        }

        /* ── Hero ──────────────────────────── */
        .ac-hub-hero {
          background: linear-gradient(135deg, #f4f0e8 0%, #ece7dd 100%);
          padding: 5rem 2rem;
          text-align: center;
        }

        .ac-hub-hero-content h1 {
          font-size: 3rem;
          font-weight: 700;
          color: #1a1814;
          margin-bottom: 0.5rem;
          font-family: 'Courier Prime', monospace;
        }

        .ac-hub-hero-content > p:first-of-type {
          font-size: 1.3rem;
          color: #6a6460;
          margin: 0.5rem 0 1rem 0;
        }

        .ac-hub-hero-subtitle {
          font-size: 1rem;
          color: #2a2420;
          max-width: 600px;
          margin: 0 auto;
        }

        /* ── Intro ─────────────────────────── */
        .ac-hub-intro {
          max-width: 900px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }

        .ac-intro-content h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1814;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 3px solid #e8613a;
          display: inline-block;
        }

        .ac-intro-content p {
          font-size: 1rem;
          line-height: 1.8;
          color: #2a2420;
          margin-bottom: 1rem;
        }

        /* ── Grid ──────────────────────────── */
        .ac-hub-grid {
          padding: 3rem 2rem;
          background: #f9f7f2;
        }

        .ac-hub-grid-header {
          max-width: 1200px;
          margin: 0 auto 2rem;
          text-align: center;
        }

        .ac-hub-grid-header h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1814;
          margin-bottom: 0.5rem;
        }

        .ac-hub-grid-header p {
          font-size: 1rem;
          color: #6a6460;
        }

        .ac-hub-cards {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .ac-hub-card {
          display: block;
          text-decoration: none;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e8d4c4;
          transition: transform 0.3s, box-shadow 0.3s;
          display: flex;
          flex-direction: column;
        }

        .ac-hub-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.15);
        }

        .ac-hub-card-image {
          width: 100%;
          height: 240px;
          overflow: hidden;
        }

        .ac-hub-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .ac-hub-card:hover .ac-hub-card-image img {
          transform: scale(1.05);
        }

        .ac-hub-card-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .ac-hub-card h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1a1814;
          margin-bottom: 0.5rem;
        }

        .ac-hub-card-tagline {
          color: #e8613a;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .ac-hub-card-desc {
          color: #2a2420;
          font-size: 0.9rem;
          line-height: 1.6;
          flex: 1;
        }

        .ac-hub-card-footer {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e8d4c4;
        }

        .ac-hub-card-link {
          color: #e8613a;
          font-weight: 600;
          font-size: 0.9rem;
        }

        /* ── Compare Table ─────────────────── */
        .ac-hub-compare {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }

        .ac-hub-compare h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1a1814;
          margin-bottom: 2rem;
          text-align: center;
          padding-bottom: 0.5rem;
          border-bottom: 3px solid #e8613a;
          display: inline-block;
        }

        .ac-compare-table {
          margin-top: 2rem;
          border-collapse: collapse;
          width: 100%;
        }

        .ac-compare-header {
          display: grid;
          grid-template-columns: 2fr 1.2fr 1.2fr 1.2fr 1.8fr;
          gap: 1rem;
          background: linear-gradient(135deg, #1a1814 0%, #2a2420 100%);
          padding: 1.2rem;
          border-radius: 12px 12px 0 0;
          font-weight: 700;
          color: white;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
        }

        .ac-compare-row {
          display: grid;
          grid-template-columns: 2fr 1.2fr 1.2fr 1.2fr 1.8fr;
          gap: 1rem;
          padding: 1.2rem;
          border-bottom: 1px solid #e8d4c4;
          align-items: center;
          text-decoration: none;
          color: #2a2420;
          transition: all 0.3s;
          background: white;
        }

        .ac-compare-row:hover {
          background: #f9f7f2;
          transform: translateX(4px);
          box-shadow: -4px 0 12px rgba(232, 97, 58, 0.1);
        }

        .ac-compare-row-luxury {
          background: linear-gradient(90deg, #f9f7f2 0%, #fef9f5 100%);
          border-left: 4px solid #e8613a;
        }

        .ac-compare-row-luxury:hover {
          background: linear-gradient(90deg, #f4f0e8 0%, #fef1e6 100%);
          box-shadow: -4px 0 16px rgba(232, 97, 58, 0.2);
        }

        .ac-compare-name {
          font-weight: 700;
          color: #1a1814;
          font-size: 0.95rem;
        }

        .ac-compare-cost {
          font-weight: 600;
          text-align: center;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          font-size: 0.85rem;
        }

        .ac-cost-medium {
          background: #d4edda;
          color: #155724;
        }

        .ac-cost-medium-high {
          background: #fff3cd;
          color: #856404;
        }

        .ac-cost-high {
          background: #f8d7da;
          color: #721c24;
          font-weight: 700;
        }

        .ac-compare-impact {
          text-align: center;
          font-size: 0.9rem;
          letter-spacing: 0.1em;
        }

        .ac-compare-speed {
          text-align: center;
          color: #6a6460;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .ac-compare-ideal {
          color: #6a6460;
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .ac-compare-col-1,
        .ac-compare-col-2,
        .ac-compare-col-3,
        .ac-compare-col-4,
        .ac-compare-col-5 {
          display: block;
        }

        .ac-compare-legend {
          display: flex;
          gap: 2rem;
          margin-top: 2rem;
          padding: 1.5rem;
          background: #f9f7f2;
          border-radius: 8px;
          font-size: 0.85rem;
          color: #6a6460;
          justify-content: center;
          flex-wrap: wrap;
        }

        .ac-compare-legend span {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* ── CTA ───────────────────────────── */
        .ac-hub-cta {
          background: linear-gradient(135deg, #e8613a15 0%, #ece7dd 100%);
          border: 2px solid #e8613a;
          border-radius: 12px;
          padding: 3rem 2rem;
          text-align: center;
          max-width: 800px;
          margin: 4rem auto;
        }

        .ac-hub-cta h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1a1814;
          margin-bottom: 0.5rem;
        }

        .ac-hub-cta p {
          color: #2a2420;
          font-size: 1rem;
          margin-bottom: 1.5rem;
        }

        .ac-hub-btn {
          display: inline-block;
          background: #e8613a;
          color: white;
          padding: 1rem 2.5rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.3s;
          font-size: 1rem;
        }

        .ac-hub-btn:hover {
          background: #d14f2e;
        }

        /* ── Responsive ────────────────────── */
        @media (max-width: 1024px) {
          .ac-compare-header,
          .ac-compare-row {
            grid-template-columns: 2fr 1.2fr 1.5fr 1.5fr;
            gap: 0.8rem;
            padding: 1rem;
          }

          .ac-compare-col-3,
          .ac-compare-impact {
            display: none !important;
          }
        }

        @media (max-width: 900px) {
          .ac-hub-hero-content h1 {
            font-size: 2rem;
          }

          .ac-compare-legend {
            flex-direction: column;
            gap: 1rem;
          }
        }

        @media (max-width: 768px) {
          .ac-hub-hero {
            padding: 2.5rem 1rem;
          }

          .ac-hub-hero-content h1 {
            font-size: 1.5rem;
          }

          .ac-hub-grid {
            padding: 2rem 1rem;
          }

          .ac-hub-cards {
            gap: 1.5rem;
          }

          .ac-compare-table {
            border-radius: 8px;
            overflow: hidden;
          }

          .ac-compare-header {
            grid-template-columns: 1.5fr 2fr;
            gap: 0.5rem;
            padding: 0.8rem;
            font-size: 0.75rem;
            border-radius: 8px 8px 0 0;
          }

          .ac-compare-row {
            grid-template-columns: 1.5fr 2fr;
            gap: 0.5rem;
            padding: 0.8rem;
            font-size: 0.8rem;
            border-bottom: 1px solid #e8d4c4;
          }

          .ac-compare-row:last-child {
            border-bottom: none;
          }

          .ac-compare-col-2,
          .ac-compare-cost,
          .ac-compare-col-3,
          .ac-compare-impact,
          .ac-compare-col-4,
          .ac-compare-speed {
            display: none !important;
          }

          .ac-compare-col-1 {
            grid-column: 1;
          }

          .ac-compare-col-5,
          .ac-compare-ideal {
            grid-column: 2;
          }

          .ac-compare-legend {
            font-size: 0.75rem;
            gap: 1rem;
          }

          .ac-hub-cta {
            margin: 2rem 1rem;
            padding: 2rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .ac-hub-hero-content h1 {
            font-size: 1.3rem;
          }

          .ac-hub-cards {
            grid-template-columns: 1fr;
          }

          .ac-compare-header {
            grid-template-columns: 1fr 1fr;
            gap: 0.3rem;
            padding: 0.6rem;
            font-size: 0.7rem;
          }

          .ac-compare-row {
            grid-template-columns: 1fr 1fr;
            gap: 0.4rem;
            padding: 0.8rem;
            font-size: 0.75rem;
          }

          .ac-compare-name {
            font-size: 0.9rem;
            font-weight: 700;
            grid-column: 1 / -1;
          }

          .ac-compare-ideal {
            grid-column: 1 / -1;
            font-size: 0.75rem;
          }

          .ac-compare-row-luxury {
            border-left: 2px solid #e8613a;
          }

          .ac-compare-legend {
            flex-direction: column;
            gap: 0.8rem;
            font-size: 0.7rem;
          }

          .ac-hub-btn {
            display: block;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
