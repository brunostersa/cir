import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Favicon from '../../components/Favicon'
import WhatsAppLink from '../../components/WhatsAppLink'
import servicos from '../../data/servicos.json'
import Head from 'next/head'
import Link from 'next/link'

export async function getStaticProps() {
  return {
    props: {
      servicos
    }
  };
}

export default function ServicosHub({ servicos }) {
  const pageTitle = 'Serviços Gráficos: Impressão, Embalagem e Sinalização | CIR Gráfica';
  const pageDescription = 'Conheça todos os serviços da CIR: impressão offset, digital, sob demanda, embalagens, materiais corporativos e sinalização. Qualidade profissional para cada necessidade.';
  const canonicalUrl = 'https://cidades.cirgrafica.com.br/servicos';

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Serviços Gráficos",
    "description": pageDescription,
    "url": canonicalUrl,
    "publisher": {
      "@type": "Organization",
      "name": "CIR Gráfica"
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": servicos.map((svc, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": svc.nome,
        "url": `${canonicalUrl}/${svc.id}`
      }))
    }
  };

  return (
    <div className="cir-root svc-hub-page">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="serviços gráficos, impressão offset, impressão digital, embalagens, sinalização, materiais corporativos" />
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
      <nav className="svc-breadcrumb" aria-label="Breadcrumb">
        <div className="svc-breadcrumb-inner">
          <Link href="/">Home</Link>
          <span>/</span>
          <span aria-current="page">Serviços</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="svc-hub-hero">
        <div className="svc-hub-hero-content">
          <h1>Serviços Gráficos</h1>
          <p>Impressão, embalagem, sinalização e tudo que sua marca precisa</p>
          <p className="svc-hub-hero-subtitle">Soluções profissionais para cada etapa do seu projeto</p>
        </div>
      </section>

      {/* Intro */}
      <section className="svc-hub-intro">
        <div className="svc-intro-content">
          <h2>Orçamento Online para Qualquer Serviço de Gráfica</h2>
          <p>
            Precisa de um orçamento? É simples e rápido. Envie suas especificações, materiais desejados e prazos através do formulário online ou WhatsApp.
            Nossa equipe analisa tudo e retorna com uma proposta dentro de 2 horas.
          </p>
          <div className="svc-intro-cta">
            <WhatsAppLink
              message="Olá! Gostaria de um orçamento para um serviço gráfico"
              source="servicos_intro"
              className="svc-intro-btn"
            >
              💬 Solicitar Orçamento
            </WhatsAppLink>
          </div>
        </div>
      </section>

      {/* Grid de Serviços */}
      <section className="svc-hub-grid">
        <div className="svc-hub-grid-header">
          <h2>Veja Nossos Serviços</h2>
          <p>Clique em cada um para conhecer detalhes, processo e indicações</p>
        </div>

        <div className="svc-hub-cards">
          {servicos.map((svc) => (
            <Link key={svc.id} href={`/servicos/${svc.id}`} className="svc-hub-card">
              <div className="svc-hub-card-image">
                <img src={svc.img} alt={`${svc.nome} - CIR Gráfica`} />
              </div>
              <div className="svc-hub-card-content">
                <h3>{svc.nome}</h3>
                <p className="svc-hub-card-tagline">{svc.tagline}</p>
                <p className="svc-hub-card-desc">{svc.descricaoCurta}</p>
                <div className="svc-hub-card-footer">
                  <span className="svc-hub-card-link">Conhecer serviço →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="svc-hub-cta">
        <h2>Não sabe qual serviço escolher?</h2>
        <p>Conversar com nossos especialistas é grátis! Eles ajudam você a encontrar a melhor solução para seu projeto.</p>
        <a href="https://wa.me/556232021150" target="_blank" rel="noopener noreferrer" className="svc-hub-btn">
          💬 Fale com um Especialista
        </a>
      </section>

      <Footer />

      <style jsx>{`
        /* ── Page Light ────────────────────── */
        .svc-hub-page {
          background: #ffffff;
          color: #2a2420;
        }

        /* ── Breadcrumb ────────────────────── */
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
        }

        .svc-breadcrumb a {
          color: #e8613a;
          text-decoration: none;
        }

        .svc-breadcrumb a:hover {
          opacity: 0.7;
        }

        .svc-breadcrumb span {
          color: #6a6460;
        }

        /* ── Hero ──────────────────────────── */
        .svc-hub-hero {
          background: linear-gradient(135deg, #f4f0e8 0%, #ece7dd 100%);
          padding: 5rem 2rem;
          text-align: center;
        }

        .svc-hub-hero-content h1 {
          font-size: 3rem;
          font-weight: 700;
          color: #1a1814;
          margin-bottom: 0.5rem;
          font-family: 'Courier Prime', monospace;
        }

        .svc-hub-hero-content > p:first-of-type {
          font-size: 1.3rem;
          color: #6a6460;
          margin: 0.5rem 0 1rem 0;
        }

        .svc-hub-hero-subtitle {
          font-size: 1rem;
          color: #2a2420;
          max-width: 600px;
          margin: 0 auto;
        }

        /* ── Intro ─────────────────────────── */
        .svc-hub-intro {
          max-width: 900px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }

        .svc-intro-content h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1814;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 3px solid #e8613a;
          display: inline-block;
        }

        .svc-intro-content p {
          font-size: 1rem;
          line-height: 1.8;
          color: #2a2420;
          margin-bottom: 1rem;
        }

        .svc-intro-cta {
          margin-top: 2rem;
          text-align: center;
        }

        .svc-intro-btn {
          display: inline-block;
          background: #e8613a;
          color: white;
          padding: 1rem 2.5rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.3s;
          font-size: 1rem;
          border: none;
          cursor: pointer;
        }

        .svc-intro-btn:hover {
          background: #d14f2e;
        }

        /* ── Grid ──────────────────────────── */
        .svc-hub-grid {
          padding: 3rem 2rem;
          background: #f9f7f2;
        }

        .svc-hub-grid-header {
          max-width: 1200px;
          margin: 0 auto 2rem;
          text-align: center;
        }

        .svc-hub-grid-header h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1814;
          margin-bottom: 0.5rem;
        }

        .svc-hub-grid-header p {
          font-size: 1rem;
          color: #6a6460;
        }

        .svc-hub-cards {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .svc-hub-card {
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

        .svc-hub-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.15);
        }

        .svc-hub-card-image {
          width: 100%;
          height: 240px;
          overflow: hidden;
        }

        .svc-hub-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .svc-hub-card:hover .svc-hub-card-image img {
          transform: scale(1.05);
        }

        .svc-hub-card-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .svc-hub-card h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1a1814;
          margin-bottom: 0.5rem;
        }

        .svc-hub-card-tagline {
          color: #e8613a;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .svc-hub-card-desc {
          color: #2a2420;
          font-size: 0.9rem;
          line-height: 1.6;
          flex: 1;
        }

        .svc-hub-card-footer {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e8d4c4;
        }

        .svc-hub-card-link {
          color: #e8613a;
          font-weight: 600;
          font-size: 0.9rem;
        }

        /* ── CTA ───────────────────────────── */
        .svc-hub-cta {
          background: linear-gradient(135deg, #e8613a15 0%, #ece7dd 100%);
          border: 2px solid #e8613a;
          border-radius: 12px;
          padding: 3rem 2rem;
          text-align: center;
          max-width: 800px;
          margin: 4rem auto;
        }

        .svc-hub-cta h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1a1814;
          margin-bottom: 0.5rem;
        }

        .svc-hub-cta p {
          color: #2a2420;
          font-size: 1rem;
          margin-bottom: 1.5rem;
        }

        .svc-hub-btn {
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

        .svc-hub-btn:hover {
          background: #d14f2e;
        }

        /* ── Responsive ────────────────────── */
        @media (max-width: 900px) {
          .svc-hub-hero-content h1 {
            font-size: 2rem;
          }
        }

        @media (max-width: 768px) {
          .svc-hub-hero {
            padding: 2.5rem 1rem;
          }

          .svc-hub-hero-content h1 {
            font-size: 1.5rem;
          }

          .svc-hub-grid {
            padding: 2rem 1rem;
          }

          .svc-hub-cards {
            gap: 1.5rem;
          }

          .svc-hub-cta {
            margin: 2rem 1rem;
            padding: 2rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .svc-hub-hero-content h1 {
            font-size: 1.3rem;
          }

          .svc-hub-cards {
            grid-template-columns: 1fr;
          }

          .svc-hub-btn {
            display: block;
            width: 100%;
          }

          .svc-intro-btn {
            display: block;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
