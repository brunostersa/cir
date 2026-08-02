import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Favicon from '../../components/Favicon'
import WhatsAppLink from '../../components/WhatsAppLink'
import acabamentos from '../../data/acabamentos.json'
import servicos from '../../data/servicos.json'
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
  const servicosRelacionados = servicos.filter(svc =>
    (svc.acabamentosRecomendados || []).includes(params.id)
  );

  return {
    props: {
      acabamento,
      outrosAcabamentos,
      servicosRelacionados
    }
  };
}

export default function AcabamentoPage({ acabamento, outrosAcabamentos, servicosRelacionados }) {
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

      <nav className="cp-breadcrumb" aria-label="Breadcrumb">
        <div className="cp-breadcrumb-inner">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/acabamentos">Acabamentos</Link>
          <span>/</span>
          <span aria-current="page">{acabamento.nome}</span>
        </div>
      </nav>

      {/* Hero */}
      <div className="cp-hero cp-hero--sub">
        <h1 className="cp-h1 cir-reveal">{acabamento.nome}</h1>
        <p className="cp-intro cir-reveal cir-reveal--d1">{acabamento.tagline}</p>
      </div>

      {/* Imagem destaque */}
      <figure className="cp-figure">
        <img src={acabamento.img} alt={`Exemplo de ${acabamento.nome}`} />
        <figcaption>{acabamento.nome} — CIR Gráfica</figcaption>
      </figure>

      <article>
        {/* O que é */}
        <div className="cir-section cir-section--light">
          <span className="cir-s-tag cir-reveal">O que é</span>
          <h2 className="cp-h2 cir-reveal cir-reveal--d1">O que é {acabamento.nome}?</h2>
          <p className="cp-body cir-reveal cir-reveal--d1">{acabamento.descricaoCompleta}</p>
        </div>

        <hr className="cir-divider" />

        {/* Benefícios */}
        <div className="cir-section">
          <span className="cir-s-tag cir-reveal">Vantagens</span>
          <h2 className="cp-h2 cir-reveal cir-reveal--d1">Benefícios do {acabamento.nome}</h2>
          <ul className="cp-check-list cir-reveal cir-reveal--d1">
            {acabamento.beneficios.map((b, i) => (
              <li key={i} className="cp-check-item">{b}</li>
            ))}
          </ul>
        </div>

        {/* Aplicações */}
        <div className="cir-section cir-section--light">
          <span className="cir-s-tag cir-reveal">Onde usar</span>
          <h2 className="cp-h2 cir-reveal cir-reveal--d1">Para Que Serve {acabamento.nome}?</h2>
          <p className="cp-body cir-reveal cir-reveal--d1">{acabamento.ideal}</p>
          <ul className="cp-arrow-list cir-reveal cir-reveal--d1">
            {acabamento.aplicacoes.map((app, i) => (
              <li key={i} className="cp-arrow-item">{app}</li>
            ))}
          </ul>
        </div>

        <hr className="cir-divider" />

        {/* Como funciona + Comparativo */}
        <div className="cir-section">
          <span className="cir-s-tag cir-reveal">Processo técnico</span>
          <h2 className="cp-h2 cir-reveal cir-reveal--d1">Como Funciona {acabamento.nome}?</h2>
          <blockquote className="cp-blockquote cir-reveal cir-reveal--d1">
            <p>{acabamento.processoTecnico}</p>
          </blockquote>

          <h2 className="cp-h2 cir-reveal cir-reveal--d1" style={{ marginTop: '3rem' }}>{acabamento.nome} vs Outros Acabamentos</h2>
          <blockquote className="cp-blockquote cir-reveal cir-reveal--d1">
            <p>{acabamento.comparativas}</p>
          </blockquote>
        </div>

        {/* Custo e prazo */}
        <div className="cir-section cir-section--light">
          <span className="cir-s-tag cir-reveal">Investimento</span>
          <h2 className="cp-h2 cir-reveal cir-reveal--d1">Custo e Prazo de Entrega</h2>
          <div className="cp-info-grid cir-reveal cir-reveal--d1">
            <div className="cp-info-card">
              <h3>Quanto Custa?</h3>
              <p>{acabamento.custo}</p>
            </div>
            <div className="cp-info-card">
              <h3>Qual é o Prazo?</h3>
              <p>{acabamento.prazo}</p>
            </div>
          </div>
        </div>

        {/* Serviços relacionados */}
        {servicosRelacionados.length > 0 && (
          <>
            <hr className="cir-divider" />
            <div className="cir-section">
              <span className="cir-s-tag cir-reveal">Link cruzado</span>
              <h2 className="cp-h2 cir-reveal cir-reveal--d1">Serviços que Usam {acabamento.nome}</h2>
              <p className="cp-body cir-reveal cir-reveal--d1">Este acabamento é aplicado nos seguintes serviços:</p>
              <div className="cp-item-grid cir-reveal cir-reveal--d1">
                {servicosRelacionados.map(svc => (
                  <Link key={svc.id} href={`/servicos/${svc.id}`} className="cp-item-card">
                    <img className="cp-item-img" src={svc.img} alt={svc.nome} />
                    <div className="cp-item-body">
                      <span className="cp-item-tag">{svc.tagline}</span>
                      <h3 className="cp-item-title">{svc.nome}</h3>
                      <span className="cp-item-link">Conhecer serviço →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

        {/* FAQ */}
        <div className="cir-section cir-section--light">
          <span className="cir-s-tag cir-reveal">Dúvidas frequentes</span>
          <h2 className="cp-h2 cir-reveal cir-reveal--d1">Perguntas Frequentes sobre {acabamento.nome}</h2>
          <div className="cp-faq-details cir-reveal cir-reveal--d1">
            {acabamento.faq.map((q, i) => (
              <details key={i}>
                <summary>{q.pergunta}</summary>
                <p>{q.resposta}</p>
              </details>
            ))}
          </div>
        </div>
      </article>

      {/* CTA */}
      <div className="cp-cta">
        <h2>Transforme sua Marca com {acabamento.nome}</h2>
        <p>Solicite um orçamento sem compromisso e descubra como este acabamento pode elevar o valor percebido de seus materiais gráficos.</p>
        <div className="cp-cta-btns">
          <WhatsAppLink message={`Olá! Gostaria de um orçamento para ${acabamento.nome}`} source={`acabamento_${acabamento.id}`} className="btn-primary">
            Solicitar Orçamento
          </WhatsAppLink>
        </div>
      </div>

      {/* Outros acabamentos */}
      {outrosAcabamentos.length > 0 && (
        <div className="cir-section cir-section--light">
          <span className="cir-s-tag cir-reveal">Continue explorando</span>
          <h2 className="cp-h2 cir-reveal cir-reveal--d1">Outros Acabamentos</h2>
          <div className="cp-item-grid cir-reveal cir-reveal--d1">
            {outrosAcabamentos.map(ac => (
              <Link key={ac.id} href={`/acabamentos/${ac.id}`} className="cp-item-card">
                <img className="cp-item-img" src={ac.img} alt={ac.nome} />
                <div className="cp-item-body">
                  <span className="cp-item-tag">{ac.tagline}</span>
                  <h3 className="cp-item-title">{ac.nome}</h3>
                  <span className="cp-item-link">Saiba mais →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
