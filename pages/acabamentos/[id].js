import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ProductsCarousel from '../../components/ProductsCarousel'
import Favicon from '../../components/Favicon'
import WhatsAppLink from '../../components/WhatsAppLink'
import acabamentos from '../../data/acabamentos.json'
import Head from 'next/head'
import Link from 'next/link'

export async function getStaticPaths() {
  const paths = acabamentos.map(ac => ({
    params: { id: ac.id }
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const acabamento = acabamentos.find(ac => ac.id === params.id);

  if (!acabamento) {
    return { notFound: true };
  }

  const outrosAcabamentos = acabamentos.filter(ac => ac.id !== params.id).slice(0, 3);

  return {
    props: {
      acabamento,
      outrosAcabamentos
    }
  };
}

export default function AcabamentoPage({ acabamento, outrosAcabamentos }) {
  // SEO Otimizado para Google
  const pageTitle = `${acabamento.nome}: Guia Completo 2024 | CIR Gráfica`;
  const pageDescription = `${acabamento.nome} - Tudo o que você precisa saber: como funciona, benefícios, custo, prazo e aplicações. Guia completo com FAQ. CIR Gráfica.`;
  const canonicalUrl = `https://cidades.cirgrafica.com.br/acabamentos/${acabamento.id}`;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${acabamento.nome}: Guia Completo`,
    "description": pageDescription,
    "articleBody": acabamento.descricaoCompleta,
    "image": `https://cidades.cirgrafica.com.br${acabamento.img}`,
    "author": {
      "@type": "Organization",
      "name": "CIR Gráfica"
    },
    "publisher": {
      "@type": "Organization",
      "name": "CIR Gráfica",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.cirgrafica.com.br/logo.png"
      }
    },
    "datePublished": "2024-01-01",
    "url": canonicalUrl,
    "keywords": acabamento.palavrasChave.join(", ")
  };

  return (
    <div className="cir-root ac-light-page">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={acabamento.palavrasChave.join(", ")} />
        <meta name="author" content="CIR Gráfica" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={`https://cidades.cirgrafica.com.br${acabamento.img}`} />
        <meta property="og:site_name" content="CIR Gráfica" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content={`https://cidades.cirgrafica.com.br${acabamento.img}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      </Head>

      <Favicon />
      <Header />

      {/* Breadcrumbs */}
      <nav className="ac-breadcrumb" aria-label="Breadcrumb">
        <div className="ac-breadcrumb-inner">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/acabamentos">Acabamentos</Link>
          <span>/</span>
          <span aria-current="page">{acabamento.nome}</span>
        </div>
      </nav>

      {/* Hero - H1 otimizado para SEO */}
      <section className="ac-hero">
        <div className="ac-hero-content">
          <h1>{acabamento.nome}</h1>
          <p className="ac-hero-subtitle">{acabamento.tagline}</p>
        </div>
      </section>

      {/* Imagem destaque com legenda */}
      <section className="ac-image-section">
        <figure className="ac-figure">
          <img src={acabamento.img} alt={`Exemplo de ${acabamento.nome}`} />
          <figcaption>{acabamento.nome} - CIR Gráfica</figcaption>
        </figure>
      </section>

      {/* Conteúdo Principal */}
      <article className="ac-main-content">
        {/* O que é - H2 otimizado */}
        <section className="ac-section">
          <h2>O que é {acabamento.nome}?</h2>
          <p className="ac-lead">{acabamento.descricaoCompleta}</p>
        </section>

        {/* Benefícios - H2 otimizado */}
        <section className="ac-section">
          <h2>Benefícios do {acabamento.nome}</h2>
          <div className="ac-benefits-grid">
            {acabamento.beneficios.map((b, i) => (
              <div key={i} className="ac-benefit-item">
                <span className="ac-check">✓</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Aplicações - H2 otimizado */}
        <section className="ac-section">
          <h2>Para Que Serve {acabamento.nome}?</h2>
          <p className="ac-intro">{acabamento.ideal}</p>
          <div className="ac-apps-list">
            {acabamento.aplicacoes.map((app, i) => (
              <div key={i} className="ac-app-item">
                <span className="ac-arrow">→</span>
                <span>{app}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Como Funciona - H2 otimizado */}
        <section className="ac-section">
          <h2>Como Funciona {acabamento.nome}?</h2>
          <div className="ac-tech-box">
            <p>{acabamento.processoTecnico}</p>
          </div>
        </section>

        {/* Comparativas */}
        <section className="ac-section">
          <h2>{acabamento.nome} vs Outros Acabamentos</h2>
          <div className="ac-compare-box">
            <p>{acabamento.comparativas}</p>
          </div>
        </section>

        {/* Custo e Prazo - Grid 2 colunas */}
        <section className="ac-section">
          <h2>Custo e Prazo de Entrega</h2>
          <div className="ac-info-grid">
            <div className="ac-info-card">
              <h3>Quanto Custa?</h3>
              <p>{acabamento.custo}</p>
            </div>
            <div className="ac-info-card">
              <h3>Qual é o Prazo?</h3>
              <p>{acabamento.prazo}</p>
            </div>
          </div>
        </section>

        {/* FAQ - H2 otimizado */}
        <section className="ac-section">
          <h2>Perguntas Frequentes sobre {acabamento.nome}</h2>
          <div className="ac-faq-list">
            {acabamento.faq.map((q, i) => (
              <details key={i} className="ac-faq-item">
                <summary>{q.pergunta}</summary>
                <p>{q.resposta}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="ac-cta">
          <h2>Transforme sua Marca com {acabamento.nome}</h2>
          <p>Solicite um orçamento sem compromisso e descubra como este acabamento pode elevar o valor percebido de seus materiais gráficos.</p>
          <a href="https://wa.me/556232021150" target="_blank" rel="noopener noreferrer" className="ac-btn">
            💬 Solicitar Orçamento
          </a>
        </section>
      </article>

      {/* Outros Acabamentos */}
      {outrosAcabamentos.length > 0 && (
        <section className="ac-others">
          <h2>Explore Outros Acabamentos</h2>
          <div className="ac-cards-grid">
            {outrosAcabamentos.map(ac => (
              <Link key={ac.id} href={`/acabamentos/${ac.id}`} className="ac-card">
                <img src={ac.img} alt={ac.nome} />
                <div className="ac-card-info">
                  <h3>{ac.nome}</h3>
                  <p>{ac.tagline}</p>
                  <span className="ac-link">Saiba mais →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <WhatsAppLink />
      <Footer />

      <style jsx>{`
        /* ── Page Light ────────────────────── */
        .ac-light-page {
          background: #ffffff;
          color: #2a2420;
        }

        /* ── Breadcrumbs ───────────────────── */
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
          flex-wrap: wrap;
        }

        .ac-breadcrumb a {
          color: #e8613a;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .ac-breadcrumb a:hover {
          opacity: 0.7;
        }

        .ac-breadcrumb span {
          color: #6a6460;
        }

        .ac-breadcrumb [aria-current="page"] {
          color: #2a2420;
          font-weight: 600;
        }

        /* ── Hero ──────────────────────────── */
        .ac-hero {
          background: linear-gradient(135deg, #f4f0e8 0%, #ece7dd 100%);
          padding: 5rem 2rem 4rem;
          text-align: center;
        }

        .ac-hero-content h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1814;
          margin-bottom: 0.5rem;
          font-family: 'Courier Prime', monospace;
        }

        .ac-hero-subtitle {
          font-size: 1.2rem;
          color: #6a6460;
          margin: 0;
        }

        /* ── Image Section ─────────────────── */
        .ac-image-section {
          padding: 2rem;
          background: white;
          text-align: center;
        }

        .ac-figure {
          margin: 0;
          max-width: 600px;
          margin: 0 auto;
        }

        .ac-figure img {
          width: 100%;
          max-height: 400px;
          object-fit: cover;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .ac-figure figcaption {
          margin-top: 0.8rem;
          font-size: 0.9rem;
          color: #6a6460;
          font-style: italic;
        }

        /* ── Main Content ──────────────────── */
        .ac-main-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .ac-section {
          margin-bottom: 3rem;
        }

        .ac-section h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1814;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 3px solid #e8613a;
          display: inline-block;
        }

        .ac-section h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a1814;
          margin: 1rem 0 0.5rem 0;
        }

        .ac-section p {
          font-size: 1rem;
          line-height: 1.8;
          color: #2a2420;
          margin-bottom: 1rem;
        }

        .ac-lead {
          font-size: 1.05rem;
          line-height: 1.85;
          color: #3a3430;
          font-weight: 500;
          margin-bottom: 1.5rem;
        }

        /* ── Benefits Grid ─────────────────── */
        .ac-benefits-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: 1rem;
        }

        .ac-benefit-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #f9f7f2;
          border-radius: 6px;
          border-left: 3px solid #e8613a;
        }

        .ac-check {
          color: #e8613a;
          font-weight: 700;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .ac-benefit-item span:last-child {
          color: #2a2420;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        /* ── Applications List ─────────────── */
        .ac-intro {
          font-size: 1rem;
          color: #3a3430;
          margin-bottom: 1.5rem;
        }

        .ac-apps-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .ac-app-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0;
          color: #2a2420;
        }

        .ac-arrow {
          color: #e8613a;
          font-weight: 600;
        }

        /* ── Tech Box ──────────────────────── */
        .ac-tech-box {
          background: #f4f0e8;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #e8613a;
        }

        .ac-tech-box p {
          margin: 0;
          color: #2a2420;
        }

        /* ── Compare Box ───────────────────── */
        .ac-compare-box {
          background: #ece7dd;
          padding: 1.5rem;
          border-radius: 8px;
          border: 2px solid #e8613a;
        }

        .ac-compare-box p {
          margin: 0;
          color: #2a2420;
        }

        /* ── Info Grid ─────────────────────── */
        .ac-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .ac-info-card {
          background: #f9f7f2;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e8d4c4;
        }

        .ac-info-card h3 {
          color: #e8613a;
          margin-top: 0;
        }

        .ac-info-card p {
          color: #2a2420;
        }

        /* ── FAQ ───────────────────────────── */
        .ac-faq-list {
          margin-top: 1rem;
        }

        .ac-faq-item {
          background: #f9f7f2;
          border: 1px solid #e8d4c4;
          border-radius: 6px;
          margin-bottom: 0.75rem;
          overflow: hidden;
        }

        .ac-faq-item summary {
          padding: 1rem;
          cursor: pointer;
          font-weight: 600;
          color: #1a1814;
          user-select: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ac-faq-item summary:hover {
          background: #ece7dd;
        }

        .ac-faq-item p {
          padding: 0 1rem 1rem 1rem;
          margin: 0;
          color: #2a2420;
          background: #ffffff;
        }

        /* ── CTA ───────────────────────────── */
        .ac-cta {
          background: linear-gradient(135deg, #e8613a15 0%, #ece7dd 100%);
          border: 2px solid #e8613a;
          border-radius: 12px;
          padding: 2.5rem;
          text-align: center;
          margin-top: 3rem;
        }

        .ac-cta h2 {
          color: #1a1814;
          border: none;
          display: block;
        }

        .ac-cta p {
          font-size: 1rem;
          color: #2a2420;
          margin-bottom: 1.5rem;
        }

        .ac-btn {
          display: inline-block;
          background: #e8613a;
          color: white;
          padding: 0.95rem 2.5rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.3s;
          font-size: 1rem;
        }

        .ac-btn:hover {
          background: #d14f2e;
        }

        /* ── Others Section ────────────────── */
        .ac-others {
          background: #f9f7f2;
          padding: 3rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .ac-others h2 {
          text-align: center;
          margin-bottom: 2rem;
        }

        .ac-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .ac-card {
          display: block;
          text-decoration: none;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e8d4c4;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .ac-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.12);
        }

        .ac-card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }

        .ac-card-info {
          padding: 1.5rem;
        }

        .ac-card h3 {
          color: #1a1814;
          font-size: 1.1rem;
          margin: 0 0 0.5rem 0;
        }

        .ac-card p {
          color: #6a6460;
          font-size: 0.9rem;
          margin: 0 0 1rem 0;
          line-height: 1.5;
        }

        .ac-link {
          color: #e8613a;
          font-weight: 600;
          font-size: 0.95rem;
        }

        /* ── Responsive ────────────────────── */
        @media (max-width: 900px) {
          .ac-benefits-grid,
          .ac-apps-list,
          .ac-info-grid {
            grid-template-columns: 1fr;
          }

          .ac-hero-content h1 {
            font-size: 2rem;
          }
        }

        @media (max-width: 768px) {
          .ac-hero {
            padding: 2.5rem 1rem;
          }

          .ac-hero-content h1 {
            font-size: 1.75rem;
          }

          .ac-main-content {
            padding: 1.5rem;
          }

          .ac-section h2 {
            font-size: 1.3rem;
          }

          .ac-cta {
            padding: 1.5rem;
          }

          .ac-cta h2 {
            font-size: 1.2rem;
          }

          .ac-btn {
            display: block;
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .ac-hero-content h1 {
            font-size: 1.4rem;
          }

          .ac-hero-subtitle {
            font-size: 1rem;
          }

          .ac-section h2 {
            font-size: 1.1rem;
          }

          .ac-section p {
            font-size: 0.95rem;
          }

          .ac-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
