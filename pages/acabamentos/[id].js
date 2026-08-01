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
        .ac-article {
          max-width: 900px;
          margin: 0 auto;
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
        }

        .ac-content-section {
          margin-bottom: 2.5rem;
        }

        .ac-content-section h2 {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1a1814;
        }

        .ac-content-section p {
          font-size: 1rem;
          line-height: 1.8;
          color: #6a6460;
          margin-bottom: 1rem;
        }

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
          color: #1a1814;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .ac-list-icon {
          color: #e8613a;
          font-weight: 600;
          flex-shrink: 0;
          font-size: 1.1rem;
        }

        .ac-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .ac-info-box {
          background: #ece7dd;
          padding: 1.5rem;
          border-radius: 8px;
        }

        .ac-info-box h3 {
          color: #e8613a;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .ac-info-box p {
          color: #6a6460;
          font-size: 0.95rem;
          margin: 0;
        }

        .ac-faq {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .ac-faq-item {
          border-left: 3px solid #e8613a;
          padding-left: 1.5rem;
        }

        .ac-faq-item h3 {
          color: #1a1814;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .ac-faq-item p {
          color: #6a6460;
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
        }

        .ac-cta-box {
          background: linear-gradient(135deg, #e8613a22 0%, #ece7dd 100%);
          border: 2px solid #e8613a;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          margin-top: 3rem;
        }

        .ac-cta-box h2 {
          color: #1a1814;
          font-size: 1.4rem;
          margin-bottom: 1rem;
        }

        .ac-cta-box p {
          color: #6a6460;
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
        }

        .ac-cta-btn {
          display: inline-block;
          background: #e8613a;
          color: white;
          padding: 0.9rem 2rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.3s;
        }

        .ac-cta-btn:hover {
          background: #d14f2e;
        }

        .ac-grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .ac-card {
          display: block;
          text-decoration: none;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
          border: 1px solid #ece7dd;
        }

        .ac-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }

        .ac-card-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }

        .ac-card-content {
          padding: 1.5rem;
        }

        .ac-card h3 {
          color: #1a1814;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .ac-card p {
          color: #6a6460;
          font-size: 0.85rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .ac-card-arrow {
          color: #e8613a;
          font-weight: 600;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .ac-list {
            grid-template-columns: 1fr;
          }

          .ac-grid-2 {
            grid-template-columns: 1fr;
          }

          .ac-content-section h2 {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}
