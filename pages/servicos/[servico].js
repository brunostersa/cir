import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Favicon from '../../components/Favicon'
import WhatsAppLink from '../../components/WhatsAppLink'
import servicos from '../../data/servicos.json'
import acabamentos from '../../data/acabamentos.json'
import Head from 'next/head'
import Link from 'next/link'

export async function getStaticPaths() {
  const paths = servicos.map(svc => ({
    params: { servico: svc.id }
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const servico = servicos.find(svc => svc.id === params.servico);

  if (!servico) {
    return { notFound: true };
  }

  const outrosServicos = servicos.filter(svc => svc.id !== params.servico).slice(0, 3);
  const acabamentosRecomendados = acabamentos.filter(ac =>
    (servico.acabamentosRecomendados || []).includes(ac.id)
  );

  return {
    props: {
      servico,
      outrosServicos,
      acabamentosRecomendados
    }
  };
}

export default function ServicoPage({ servico, outrosServicos, acabamentosRecomendados }) {
  const pageTitle = `${servico.nome}: Guia Completo 2024 | CIR Gráfica`;
  const pageDescription = `${servico.nome} - Tudo o que você precisa saber: como funciona, benefícios, custo, prazo e aplicações. Guia completo com FAQ. CIR Gráfica.`;
  const canonicalUrl = `https://cidades.cirgrafica.com.br/servicos/${servico.id}`;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": servico.nome,
    "description": pageDescription,
    "provider": {
      "@type": "Organization",
      "name": "CIR Gráfica"
    },
    "areaServed": "BR",
    "url": canonicalUrl,
    "image": `https://cidades.cirgrafica.com.br${servico.img}`
  };

  return (
    <div className="cir-root svc-light-page">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={servico.palavrasChave.join(", ")} />
        <meta name="author" content="CIR Gráfica" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={`https://cidades.cirgrafica.com.br${servico.img}`} />
        <meta property="og:site_name" content="CIR Gráfica" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content={`https://cidades.cirgrafica.com.br${servico.img}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      </Head>

      <Favicon />
      <Header />

      {/* Breadcrumbs */}
      <nav className="svc-breadcrumb" aria-label="Breadcrumb">
        <div className="svc-breadcrumb-inner">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/servicos">Serviços</Link>
          <span>/</span>
          <span aria-current="page">{servico.nome}</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="svc-hero">
        <div className="svc-hero-content">
          <h1>{servico.nome}</h1>
          <p className="svc-hero-subtitle">{servico.tagline}</p>
        </div>
      </section>

      {/* Imagem destaque */}
      <section className="svc-image-section">
        <figure className="svc-figure">
          <img src={servico.img} alt={`Exemplo de ${servico.nome}`} />
          <figcaption>{servico.nome} - CIR Gráfica</figcaption>
        </figure>
      </section>

      {/* Conteúdo Principal */}
      <article className="svc-main-content">
        <section className="svc-section">
          <h2>O que é {servico.nome}?</h2>
          <p className="svc-lead">{servico.descricaoCompleta}</p>
        </section>

        <section className="svc-section">
          <h2>Benefícios do {servico.nome}</h2>
          <div className="svc-benefits-grid">
            {servico.beneficios.map((b, i) => (
              <div key={i} className="svc-benefit-item">
                <span className="svc-check">✓</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="svc-section">
          <h2>Para Que Serve {servico.nome}?</h2>
          <p className="svc-intro">{servico.ideal}</p>
          <div className="svc-apps-list">
            {servico.aplicacoes.map((app, i) => (
              <div key={i} className="svc-app-item">
                <span className="svc-arrow">→</span>
                <span>{app}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="svc-section">
          <h2>Como Funciona {servico.nome}?</h2>
          <div className="svc-tech-box">
            <p>{servico.processoTecnico}</p>
          </div>
        </section>

        <section className="svc-section">
          <h2>{servico.nome} vs Outros Serviços</h2>
          <div className="svc-compare-box">
            <p>{servico.comparativas}</p>
          </div>
        </section>

        <section className="svc-section">
          <h2>Custo e Prazo de Entrega</h2>
          <div className="svc-info-grid">
            <div className="svc-info-card">
              <h3>Quanto Custa?</h3>
              <p>{servico.custo}</p>
            </div>
            <div className="svc-info-card">
              <h3>Qual é o Prazo?</h3>
              <p>{servico.prazo}</p>
            </div>
          </div>
        </section>

        {/* Acabamentos Recomendados - LINK CRUZADO */}
        {acabamentosRecomendados.length > 0 && (
          <section className="svc-section">
            <h2>Acabamentos Recomendados para {servico.nome}</h2>
            <p className="svc-intro">Eleve ainda mais o resultado combinando este serviço com os acabamentos abaixo:</p>
            <div className="svc-related-grid">
              {acabamentosRecomendados.map(ac => (
                <Link key={ac.id} href={`/acabamentos/${ac.id}`} className="svc-related-card">
                  <img src={ac.img} alt={ac.nome} />
                  <div className="svc-related-info">
                    <h3>{ac.nome}</h3>
                    <p>{ac.tagline}</p>
                    <span className="svc-related-link">Conhecer acabamento →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="svc-section">
          <h2>Perguntas Frequentes sobre {servico.nome}</h2>
          <div className="svc-faq-list">
            {servico.faq.map((q, i) => (
              <details key={i} className="svc-faq-item">
                <summary>{q.pergunta}</summary>
                <p>{q.resposta}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="svc-cta">
          <h2>Solicite um Orçamento para {servico.nome}</h2>
          <p>Envie suas especificações e receba uma proposta personalizada em até 2 horas.</p>
          <WhatsAppLink
            message={`Olá! Gostaria de um orçamento para ${servico.nome}`}
            source={`servico_${servico.id}`}
            className="svc-btn"
          >
            💬 Solicitar Orçamento
          </WhatsAppLink>
        </section>
      </article>

      {/* Outros Serviços */}
      {outrosServicos.length > 0 && (
        <section className="svc-others">
          <h2>Explore Outros Serviços</h2>
          <div className="svc-cards-grid">
            {outrosServicos.map(svc => (
              <Link key={svc.id} href={`/servicos/${svc.id}`} className="svc-card">
                <img src={svc.img} alt={svc.nome} />
                <div className="svc-card-info">
                  <h3>{svc.nome}</h3>
                  <p>{svc.tagline}</p>
                  <span className="svc-link">Saiba mais →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />

      <style jsx>{`
        /* ── Page Light ────────────────────── */
        .svc-light-page {
          background: #ffffff;
          color: #2a2420;
        }

        /* ── Breadcrumbs ───────────────────── */
        .svc-breadcrumb {
          background: #f9f7f2;
          border-bottom: 1px solid #e8d4c4;
          margin-top: 80px;
        }

        .svc-breadcrumb-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0.75rem 2rem;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .svc-breadcrumb a {
          color: #e8613a;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .svc-breadcrumb a:hover {
          opacity: 0.7;
        }

        .svc-breadcrumb span {
          color: #6a6460;
        }

        .svc-breadcrumb [aria-current="page"] {
          color: #2a2420;
          font-weight: 600;
        }

        /* ── Hero ──────────────────────────── */
        .svc-hero {
          background: linear-gradient(135deg, #f4f0e8 0%, #ece7dd 100%);
          padding: 5rem 2rem 4rem;
          text-align: center;
        }

        .svc-hero-content h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1814;
          margin-bottom: 0.5rem;
          font-family: 'Courier Prime', monospace;
        }

        .svc-hero-subtitle {
          font-size: 1.2rem;
          color: #6a6460;
          margin: 0;
        }

        /* ── Image Section ─────────────────── */
        .svc-image-section {
          padding: 2rem;
          background: white;
          text-align: center;
        }

        .svc-figure {
          margin: 0;
          max-width: 600px;
          margin: 0 auto;
        }

        .svc-figure img {
          width: 100%;
          max-height: 400px;
          object-fit: cover;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .svc-figure figcaption {
          margin-top: 0.8rem;
          font-size: 0.9rem;
          color: #6a6460;
          font-style: italic;
        }

        /* ── Main Content ──────────────────── */
        .svc-main-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .svc-section {
          margin-bottom: 3rem;
        }

        .svc-section h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1814;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 3px solid #e8613a;
          display: inline-block;
        }

        .svc-section h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a1814;
          margin: 1rem 0 0.5rem 0;
        }

        .svc-section p {
          font-size: 1rem;
          line-height: 1.8;
          color: #2a2420;
          margin-bottom: 1rem;
        }

        .svc-lead {
          font-size: 1.05rem;
          line-height: 1.85;
          color: #3a3430;
          font-weight: 500;
          margin-bottom: 1.5rem;
        }

        /* ── Benefits Grid ─────────────────── */
        .svc-benefits-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: 1rem;
        }

        .svc-benefit-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #f9f7f2;
          border-radius: 6px;
          border-left: 3px solid #e8613a;
        }

        .svc-check {
          color: #e8613a;
          font-weight: 700;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .svc-benefit-item span:last-child {
          color: #2a2420;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        /* ── Applications List ─────────────── */
        .svc-intro {
          font-size: 1rem;
          color: #3a3430;
          margin-bottom: 1.5rem;
        }

        .svc-apps-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .svc-app-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0;
          color: #2a2420;
        }

        .svc-arrow {
          color: #e8613a;
          font-weight: 600;
        }

        /* ── Tech Box ──────────────────────── */
        .svc-tech-box {
          background: #f4f0e8;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #e8613a;
        }

        .svc-tech-box p {
          margin: 0;
          color: #2a2420;
        }

        /* ── Compare Box ───────────────────── */
        .svc-compare-box {
          background: #ece7dd;
          padding: 1.5rem;
          border-radius: 8px;
          border: 2px solid #e8613a;
        }

        .svc-compare-box p {
          margin: 0;
          color: #2a2420;
        }

        /* ── Info Grid ─────────────────────── */
        .svc-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .svc-info-card {
          background: #f9f7f2;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e8d4c4;
        }

        .svc-info-card h3 {
          color: #e8613a;
          margin-top: 0;
        }

        .svc-info-card p {
          color: #2a2420;
        }

        /* ── Related (Acabamentos) Grid ────── */
        .svc-related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .svc-related-card {
          display: block;
          text-decoration: none;
          background: #f9f7f2;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e8d4c4;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .svc-related-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(232, 97, 58, 0.15);
          border-color: #e8613a;
        }

        .svc-related-card img {
          width: 100%;
          height: 160px;
          object-fit: cover;
          display: block;
        }

        .svc-related-info {
          padding: 1.2rem;
        }

        .svc-related-info h3 {
          color: #1a1814;
          font-size: 1rem;
          margin: 0 0 0.4rem 0;
        }

        .svc-related-info p {
          color: #6a6460;
          font-size: 0.85rem;
          margin: 0 0 0.8rem 0;
          line-height: 1.4;
        }

        .svc-related-link {
          color: #e8613a;
          font-weight: 600;
          font-size: 0.85rem;
        }

        /* ── FAQ ───────────────────────────── */
        .svc-faq-list {
          margin-top: 1rem;
        }

        .svc-faq-item {
          background: #f9f7f2;
          border: 1px solid #e8d4c4;
          border-radius: 6px;
          margin-bottom: 0.75rem;
          overflow: hidden;
        }

        .svc-faq-item summary {
          padding: 1rem;
          cursor: pointer;
          font-weight: 600;
          color: #1a1814;
          user-select: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .svc-faq-item summary:hover {
          background: #ece7dd;
        }

        .svc-faq-item p {
          padding: 0 1rem 1rem 1rem;
          margin: 0;
          color: #2a2420;
          background: #ffffff;
        }

        /* ── CTA ───────────────────────────── */
        .svc-cta {
          background: linear-gradient(135deg, #e8613a15 0%, #ece7dd 100%);
          border: 2px solid #e8613a;
          border-radius: 12px;
          padding: 2.5rem;
          text-align: center;
          margin-top: 3rem;
        }

        .svc-cta h2 {
          color: #1a1814;
          border: none;
          display: block;
        }

        .svc-cta p {
          font-size: 1rem;
          color: #2a2420;
          margin-bottom: 1.5rem;
        }

        .svc-btn {
          display: inline-block;
          background: #e8613a;
          color: white;
          padding: 0.95rem 2.5rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.3s;
          font-size: 1rem;
          border: none;
          cursor: pointer;
        }

        .svc-btn:hover {
          background: #d14f2e;
        }

        /* ── Others Section ────────────────── */
        .svc-others {
          background: #f9f7f2;
          padding: 3rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .svc-others h2 {
          text-align: center;
          margin-bottom: 2rem;
        }

        .svc-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .svc-card {
          display: block;
          text-decoration: none;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e8d4c4;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .svc-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.12);
        }

        .svc-card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }

        .svc-card-info {
          padding: 1.5rem;
        }

        .svc-card h3 {
          color: #1a1814;
          font-size: 1.1rem;
          margin: 0 0 0.5rem 0;
        }

        .svc-card p {
          color: #6a6460;
          font-size: 0.9rem;
          margin: 0 0 1rem 0;
          line-height: 1.5;
        }

        .svc-link {
          color: #e8613a;
          font-weight: 600;
          font-size: 0.95rem;
        }

        /* ── Responsive ────────────────────── */
        @media (max-width: 900px) {
          .svc-benefits-grid,
          .svc-apps-list,
          .svc-info-grid {
            grid-template-columns: 1fr;
          }

          .svc-hero-content h1 {
            font-size: 2rem;
          }
        }

        @media (max-width: 768px) {
          .svc-hero {
            padding: 2.5rem 1rem;
          }

          .svc-hero-content h1 {
            font-size: 1.75rem;
          }

          .svc-main-content {
            padding: 1.5rem;
          }

          .svc-section h2 {
            font-size: 1.3rem;
          }

          .svc-cta {
            padding: 1.5rem;
          }

          .svc-cta h2 {
            font-size: 1.2rem;
          }

          .svc-btn {
            display: block;
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .svc-hero-content h1 {
            font-size: 1.4rem;
          }

          .svc-hero-subtitle {
            font-size: 1rem;
          }

          .svc-section h2 {
            font-size: 1.1rem;
          }

          .svc-section p {
            font-size: 0.95rem;
          }

          .svc-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
