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
  const pageTitle = `${acabamento.nome} | Guia Completo de Acabamentos Gráficos`;
  const pageDescription = acabamento.descricaoCompleta;
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
    <div className="cir-root">
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

      {/* Hero */}
      <div className="cp-hero">
        <h1 className="cp-h1">{acabamento.nome}</h1>
        <p className="cp-intro cir-reveal cir-reveal--d2">{acabamento.tagline}</p>
      </div>

      {/* Conteúdo Principal */}
      <div className="cir-section">
        <article className="ac-article cir-reveal cir-reveal--d1">
          <div className="ac-intro-box">
            <img src={acabamento.img} alt={acabamento.nome} className="ac-hero-img" />
          </div>

          {/* O que é */}
          <div className="ac-content-section">
            <h2>O que é {acabamento.nome}?</h2>
            <p>{acabamento.descricaoCompleta}</p>
          </div>

          {/* Benefícios */}
          <div className="ac-content-section">
            <h2>Principais Benefícios</h2>
            <ul className="ac-list">
              {acabamento.beneficios.map((b, i) => (
                <li key={i}>
                  <span className="ac-list-icon">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Aplicações */}
          <div className="ac-content-section">
            <h2>Ideal Para</h2>
            <p style={{ marginBottom: '1rem' }}>{acabamento.ideal}</p>
            <ul className="ac-list">
              {acabamento.aplicacoes.map((app, i) => (
                <li key={i}>
                  <span className="ac-list-icon">→</span>
                  {app}
                </li>
              ))}
            </ul>
          </div>

          {/* Processo Técnico */}
          <div className="ac-content-section" style={{ background: '#f4f0e8', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <h2 style={{ color: '#1a1814' }}>Processo Técnico</h2>
            <p style={{ color: '#6a6460' }}>{acabamento.processoTecnico}</p>
          </div>

          {/* Comparativas */}
          <div className="ac-content-section">
            <h2>Como se Compara com Outros Acabamentos?</h2>
            <p>{acabamento.comparativas}</p>
          </div>

          {/* Custo e Prazo */}
          <div className="ac-grid-2">
            <div className="ac-info-box">
              <h3>Custo</h3>
              <p>{acabamento.custo}</p>
            </div>
            <div className="ac-info-box">
              <h3>Prazo de Entrega</h3>
              <p>{acabamento.prazo}</p>
            </div>
          </div>

          {/* FAQ */}
          <div className="ac-content-section">
            <h2>Perguntas Frequentes</h2>
            <div className="ac-faq">
              {acabamento.faq.map((q, i) => (
                <div key={i} className="ac-faq-item">
                  <h3>{q.pergunta}</h3>
                  <p>{q.resposta}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="ac-cta-box">
            <h2>Pronto para transformar sua marca com {acabamento.nome}?</h2>
            <p>Solicite um orçamento sem compromisso e veja como este acabamento pode elevar o valor percebido de seus materiais.</p>
            <a href="https://wa.me/556232021150" target="_blank" rel="noopener noreferrer" className="ac-cta-btn">
              💬 Solicitar Orçamento
            </a>
          </div>
        </article>
      </div>

      {/* Outros Acabamentos */}
      {outrosAcabamentos.length > 0 && (
        <div className="cir-section cir-section--light">
          <h2 className="cp-h2 cir-reveal cir-reveal--d1">Outros Acabamentos Disponíveis</h2>
          <div className="ac-grid-3 cir-reveal cir-reveal--d1">
            {outrosAcabamentos.map(ac => (
              <Link key={ac.id} href={`/acabamentos/${ac.id}`} className="ac-card">
                <img src={ac.img} alt={ac.nome} className="ac-card-img" />
                <div className="ac-card-content">
                  <h3>{ac.nome}</h3>
                  <p>{ac.tagline}</p>
                  <span className="ac-card-arrow">Saiba mais →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <WhatsAppLink />
      <Footer />

      <style jsx>{`
        /* ── Base ──────────────────────────── */
        .ac-article {
          max-width: 900px;
          margin: 0 auto;
          color: var(--cir-l-fg);
        }

        .ac-intro-box {
          margin-bottom: 3rem;
          border-radius: 8px;
          overflow: hidden;
        }

        .ac-hero-img {
          width: 100%;
          height: auto;
          display: block;
          filter: saturate(0.9);
        }

        /* ── Seções de Conteúdo ────────────── */
        .ac-content-section {
          margin-bottom: 2.5rem;
        }

        .ac-content-section h2 {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--cir-l-fg);
        }

        .ac-content-section p {
          font-size: 1rem;
          line-height: 1.8;
          color: var(--cir-l-fg2);
          margin-bottom: 1rem;
        }

        /* ── Listas ────────────────────────── */
        .ac-list {
          list-style: none;
          padding: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .ac-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          color: var(--cir-l-fg);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .ac-list-icon {
          color: var(--cir-accent);
          font-weight: 600;
          flex-shrink: 0;
          font-size: 1.1rem;
        }

        /* ── Grid 2 Colunas ────────────────── */
        .ac-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .ac-info-box {
          background: var(--cir-bg2);
          border: 1px solid var(--cir-line);
          padding: 1.5rem;
          border-radius: 8px;
        }

        .ac-info-box h3 {
          color: var(--cir-gold);
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .ac-info-box p {
          color: var(--cir-fg2);
          font-size: 0.95rem;
          margin: 0;
        }

        /* ── FAQ ───────────────────────────── */
        .ac-faq {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .ac-faq-item {
          border-left: 3px solid var(--cir-accent);
          padding-left: 1.5rem;
          background: var(--cir-bg2);
          padding: 1rem;
          padding-left: 1.5rem;
          border-radius: 4px;
        }

        .ac-faq-item h3 {
          color: var(--cir-fg);
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .ac-faq-item p {
          color: var(--cir-fg2);
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
        }

        /* ── CTA Box ───────────────────────── */
        .ac-cta-box {
          background: rgba(232, 97, 58, 0.08);
          border: 2px solid var(--cir-accent);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          margin-top: 3rem;
        }

        .ac-cta-box h2 {
          color: var(--cir-fg);
          font-size: 1.4rem;
          margin-bottom: 1rem;
        }

        .ac-cta-box p {
          color: var(--cir-fg2);
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
        }

        .ac-cta-btn {
          display: inline-block;
          background: var(--cir-accent);
          color: white;
          padding: 0.9rem 2rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: opacity 0.3s;
        }

        .ac-cta-btn:hover {
          opacity: 0.85;
        }

        /* ── Card Grid ─────────────────────── */
        .ac-grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .ac-card {
          display: block;
          text-decoration: none;
          background: var(--cir-bg2);
          border: 1px solid var(--cir-line);
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.3s, border-color 0.3s;
        }

        .ac-card:hover {
          transform: translateY(-4px);
          border-color: var(--cir-gold);
        }

        .ac-card-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
          filter: saturate(0.8);
        }

        .ac-card-content {
          padding: 1.5rem;
        }

        .ac-card h3 {
          color: var(--cir-gold);
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .ac-card p {
          color: var(--cir-fg2);
          font-size: 0.85rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .ac-card-arrow {
          color: var(--cir-accent);
          font-weight: 600;
          font-size: 0.9rem;
        }

        /* ── Responsive ────────────────────── */
        @media (max-width: 900px) {
          .ac-grid-2 {
            grid-template-columns: 1fr;
          }

          .ac-content-section h2 {
            font-size: 1.2rem;
          }
        }

        @media (max-width: 768px) {
          .ac-article {
            padding: 0;
          }

          .ac-content-section {
            margin-bottom: 2rem;
          }

          .ac-content-section h2 {
            font-size: 1.1rem;
            margin-bottom: 0.8rem;
          }

          .ac-content-section p {
            font-size: 0.95rem;
            line-height: 1.7;
          }

          .ac-list {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .ac-list li {
            font-size: 0.9rem;
          }

          .ac-cta-box {
            padding: 1.5rem;
            margin-top: 2rem;
          }

          .ac-cta-box h2 {
            font-size: 1.1rem;
            margin-bottom: 0.75rem;
          }

          .ac-cta-box p {
            font-size: 0.9rem;
          }

          .ac-cta-btn {
            padding: 0.75rem 1.5rem;
            font-size: 0.9rem;
          }

          .ac-faq-item {
            padding: 1rem;
          }

          .ac-card {
            border-radius: 6px;
          }

          .ac-card-img {
            height: 150px;
          }

          .ac-card-content {
            padding: 1rem;
          }
        }

        @media (max-width: 480px) {
          .ac-content-section h2 {
            font-size: 1rem;
          }

          .ac-list {
            gap: 0.5rem;
          }

          .ac-list li {
            font-size: 0.85rem;
            gap: 0.5rem;
          }

          .ac-grid-3 {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .ac-cta-box {
            padding: 1.25rem;
          }

          .ac-cta-box h2 {
            font-size: 1rem;
          }

          .ac-cta-btn {
            display: block;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
