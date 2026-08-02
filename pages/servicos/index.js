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
    <div className="cir-root">
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

      <nav className="cp-breadcrumb" aria-label="Breadcrumb">
        <div className="cp-breadcrumb-inner">
          <Link href="/">Home</Link>
          <span>/</span>
          <span aria-current="page">Serviços</span>
        </div>
      </nav>

      {/* Hero */}
      <div className="cp-hero cp-hero--sub">
        <h1 className="cp-h1 cir-reveal">Serviços <em>Gráficos</em></h1>
        <p className="cp-intro cir-reveal cir-reveal--d1">
          Impressão, embalagem, sinalização e tudo que sua marca precisa. Soluções profissionais para cada
          etapa do seu projeto.
        </p>
      </div>

      {/* Orçamento online */}
      <div className="cir-section cir-section--light">
        <span className="cir-s-tag cir-reveal">Como funciona</span>
        <h2 className="cp-h2 cir-reveal cir-reveal--d1">Orçamento Online para Qualquer Serviço de Gráfica</h2>
        <p className="cp-body cir-reveal cir-reveal--d1">
          Precisa de um orçamento? É simples e rápido. Envie suas especificações, materiais desejados e prazos
          através do formulário online ou WhatsApp. Nossa equipe analisa tudo e retorna com uma proposta dentro
          de 2 horas.
        </p>
        <div className="cir-reveal cir-reveal--d1" style={{ marginTop: '1.5rem' }}>
          <WhatsAppLink
            message="Olá! Gostaria de um orçamento para um serviço gráfico"
            source="servicos_intro"
            className="cir-btn cir-btn--fill"
          >
            Solicitar Orçamento
          </WhatsAppLink>
        </div>
      </div>

      <hr className="cir-divider" />

      {/* Grid de Serviços */}
      <div className="cir-section">
        <span className="cir-s-tag cir-reveal">Catálogo</span>
        <h2 className="cp-h2 cir-reveal cir-reveal--d1">Veja Nossos Serviços</h2>
        <p className="cp-body cir-reveal cir-reveal--d1">Clique em cada um para conhecer detalhes, processo e indicações.</p>

        <div className="cp-item-grid cir-reveal cir-reveal--d1">
          {servicos.map((svc) => (
            <Link key={svc.id} href={`/servicos/${svc.id}`} className="cp-item-card">
              <img className="cp-item-img" src={svc.img} alt={`${svc.nome} - CIR Gráfica`} />
              <div className="cp-item-body">
                <span className="cp-item-tag">{svc.tagline}</span>
                <h3 className="cp-item-title">{svc.nome}</h3>
                <p className="cp-item-desc">{svc.descricaoCurta}</p>
                <span className="cp-item-link">Conhecer serviço →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="cp-cta">
        <h2>Não sabe qual serviço escolher?</h2>
        <p>Conversar com nossos especialistas é grátis. Eles ajudam você a encontrar a melhor solução para seu projeto.</p>
        <div className="cp-cta-btns">
          <WhatsAppLink message="Olá! Não sei qual serviço escolher, pode me ajudar?" source="servicos_hub_cta" className="btn-primary">
            Fale com um Especialista
          </WhatsAppLink>
        </div>
      </div>

      <Footer />
    </div>
  );
}
