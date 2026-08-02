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
  const pageTitle = `${servico.nome}: Guia Completo | CIR Gráfica`;
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
    <div className="cir-root">
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

      <nav className="cp-breadcrumb" aria-label="Breadcrumb">
        <div className="cp-breadcrumb-inner">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/servicos">Serviços</Link>
          <span>/</span>
          <span aria-current="page">{servico.nome}</span>
        </div>
      </nav>

      {/* Hero */}
      <div className="cp-hero cp-hero--sub">
        <h1 className="cp-h1 cir-reveal">{servico.nome}</h1>
        <p className="cp-intro cir-reveal cir-reveal--d1">{servico.tagline}</p>
      </div>

      {/* Imagem destaque */}
      <figure className="cp-figure">
        <img src={servico.img} alt={`Exemplo de ${servico.nome}`} />
        <figcaption>{servico.nome} — CIR Gráfica</figcaption>
      </figure>

      <article>
        {/* O que é */}
        <div className="cir-section cir-section--light">
          <span className="cir-s-tag cir-reveal">O que é</span>
          <h2 className="cp-h2 cir-reveal cir-reveal--d1">O que é {servico.nome}?</h2>
          <p className="cp-body cir-reveal cir-reveal--d1">{servico.descricaoCompleta}</p>
        </div>

        <hr className="cir-divider" />

        {/* Benefícios */}
        <div className="cir-section">
          <span className="cir-s-tag cir-reveal">Vantagens</span>
          <h2 className="cp-h2 cir-reveal cir-reveal--d1">Benefícios do {servico.nome}</h2>
          <ul className="cp-check-list cir-reveal cir-reveal--d1">
            {servico.beneficios.map((b, i) => (
              <li key={i} className="cp-check-item">{b}</li>
            ))}
          </ul>
        </div>

        {/* Aplicações */}
        <div className="cir-section cir-section--light">
          <span className="cir-s-tag cir-reveal">Onde usar</span>
          <h2 className="cp-h2 cir-reveal cir-reveal--d1">Para Que Serve {servico.nome}?</h2>
          <p className="cp-body cir-reveal cir-reveal--d1">{servico.ideal}</p>
          <ul className="cp-arrow-list cir-reveal cir-reveal--d1">
            {servico.aplicacoes.map((app, i) => (
              <li key={i} className="cp-arrow-item">{app}</li>
            ))}
          </ul>
        </div>

        <hr className="cir-divider" />

        {/* Como funciona + Comparativo */}
        <div className="cir-section">
          <span className="cir-s-tag cir-reveal">Processo técnico</span>
          <h2 className="cp-h2 cir-reveal cir-reveal--d1">Como Funciona {servico.nome}?</h2>
          <blockquote className="cp-blockquote cir-reveal cir-reveal--d1">
            <p>{servico.processoTecnico}</p>
          </blockquote>

          <h2 className="cp-h2 cir-reveal cir-reveal--d1" style={{ marginTop: '3rem' }}>{servico.nome} vs Outros Serviços</h2>
          <blockquote className="cp-blockquote cir-reveal cir-reveal--d1">
            <p>{servico.comparativas}</p>
          </blockquote>
        </div>

        {/* Custo e prazo */}
        <div className="cir-section cir-section--light">
          <span className="cir-s-tag cir-reveal">Investimento</span>
          <h2 className="cp-h2 cir-reveal cir-reveal--d1">Custo e Prazo de Entrega</h2>
          <div className="cp-info-grid cir-reveal cir-reveal--d1">
            <div className="cp-info-card">
              <h3>Quanto Custa?</h3>
              <p>{servico.custo}</p>
            </div>
            <div className="cp-info-card">
              <h3>Qual é o Prazo?</h3>
              <p>{servico.prazo}</p>
            </div>
          </div>
        </div>

        {/* Acabamentos recomendados */}
        {acabamentosRecomendados.length > 0 && (
          <>
            <hr className="cir-divider" />
            <div className="cir-section">
              <span className="cir-s-tag cir-reveal">Link cruzado</span>
              <h2 className="cp-h2 cir-reveal cir-reveal--d1">Acabamentos Recomendados para {servico.nome}</h2>
              <p className="cp-body cir-reveal cir-reveal--d1">Eleve ainda mais o resultado combinando este serviço com os acabamentos abaixo:</p>
              <div className="cp-item-grid cir-reveal cir-reveal--d1">
                {acabamentosRecomendados.map(ac => (
                  <Link key={ac.id} href={`/acabamentos/${ac.id}`} className="cp-item-card">
                    <img className="cp-item-img" src={ac.img} alt={ac.nome} />
                    <div className="cp-item-body">
                      <span className="cp-item-tag">{ac.tagline}</span>
                      <h3 className="cp-item-title">{ac.nome}</h3>
                      <span className="cp-item-link">Conhecer acabamento →</span>
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
          <h2 className="cp-h2 cir-reveal cir-reveal--d1">Perguntas Frequentes sobre {servico.nome}</h2>
          <div className="cp-faq-details cir-reveal cir-reveal--d1">
            {servico.faq.map((q, i) => (
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
        <h2>Solicite um Orçamento para {servico.nome}</h2>
        <p>Envie suas especificações e receba uma proposta personalizada em até 2 horas.</p>
        <div className="cp-cta-btns">
          <WhatsAppLink message={`Olá! Gostaria de um orçamento para ${servico.nome}`} source={`servico_${servico.id}`} className="btn-primary">
            Solicitar Orçamento
          </WhatsAppLink>
        </div>
      </div>

      {/* Outros serviços */}
      {outrosServicos.length > 0 && (
        <div className="cir-section cir-section--light">
          <span className="cir-s-tag cir-reveal">Continue explorando</span>
          <h2 className="cp-h2 cir-reveal cir-reveal--d1">Outros Serviços</h2>
          <div className="cp-item-grid cir-reveal cir-reveal--d1">
            {outrosServicos.map(svc => (
              <Link key={svc.id} href={`/servicos/${svc.id}`} className="cp-item-card">
                <img className="cp-item-img" src={svc.img} alt={svc.nome} />
                <div className="cp-item-body">
                  <span className="cp-item-tag">{svc.tagline}</span>
                  <h3 className="cp-item-title">{svc.nome}</h3>
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
