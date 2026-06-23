import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ProductsCarousel from '../../../components/ProductsCarousel'
import AcabamentosSection from '../../../components/AcabamentosSection'
import Favicon from '../../../components/Favicon'
import cidades from '../../../cidades.json'
import Head from 'next/head'
import { normalizeText } from '../../../utils/normalize'

export async function getStaticPaths() {
  const estados = [...new Set(cidades.map(c => c.estado))]
  const paths = estados.map(estado => ({
    params: { estado: estado.toLowerCase() }
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const cidadesDoEstado = cidades.filter(c => c.estado.toLowerCase() === params.estado);
  const estado = cidadesDoEstado[0]?.estado;
  
  if (!estado) {
    return {
      notFound: true
    };
  }
  
  return {
    props: {
      estado,
      cidades: cidadesDoEstado
    }
  };
}

export default function GraficaEstado({ estado, cidades }) {
  const pageTitle = `Gráfica em ${estado} - Embalagens e Sacolas Personalizadas | CIR Gráfica`;
  const pageDescription = `Serviços de gráfica em ${estado}. Embalagens e sacolas personalizadas, brindes personalizados e comunicação visual em todas as cidades do estado. CIR Gráfica - Qualidade e confiança.`;
  const canonicalUrl = `https://cidades.cirgrafica.com.br/grafica/estado/${estado.toLowerCase()}`;
  
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "CIR Gráfica",
    "description": `Serviços de gráfica e embalagens personalizadas em ${estado}`,
            "url": "https://cidades.cirgrafica.com.br",
    "telephone": "+556232021150",
    "email": "atendimento@cirgrafica.com.br",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. Vereador José Monteiro, N1814",
      "addressLocality": "Goiânia",
      "addressRegion": "GO",
      "postalCode": "74630-010",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -16.6864,
      "longitude": -49.2653
    },
    "openingHours": "Mo-Fr 08:00-18:00",
    "priceRange": "$$",
    "serviceArea": {
      "@type": "State",
      "name": estado,
      "addressCountry": "BR"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Serviços de Gráfica",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Embalagens e Sacolas"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Banners e Comunicação Visual"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Brindes Personalizados"
          }
        }
      ]
    }
  };

  return (
    <div className="cir-root">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`gráfica ${estado}, embalagens personalizadas ${estado}, sacolas personalizadas ${estado}, brindes personalizados ${estado}, comunicação visual ${estado}`} />
        <meta name="author" content="CIR Gráfica" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content="https://www.cirgrafica.com.br/og-image.jpg" />
        <meta property="og:site_name" content="CIR Gráfica" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content="https://www.cirgrafica.com.br/og-image.jpg" />
        <meta name="geo.region" content={`BR-${estado}`} />
        <meta name="geo.placename" content={estado} />
        <meta name="geo.position" content="-16.6864;-49.2653" />
        <meta name="ICBM" content="-16.6864, -49.2653" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      </Head>

      <Favicon />
      <Header />

      {/* Hero */}
      <div className="cp-hero">
        <h1 className="cp-h1">Gráfica em <em>{estado}</em></h1>
        <p className="cp-intro cir-reveal cir-reveal--d2">
          Serviços de gráfica e embalagens personalizadas em todas as cidades de {estado}.
          Escolha sua cidade para ver nossos serviços específicos.
        </p>
      </div>

      {/* Grid de cidades */}
      <div className="cir-section cir-section--light">
        <span className="cir-s-tag cir-reveal">Cidades atendidas</span>
        <h2 className="cp-h2 cir-reveal cir-reveal--d1">{cidades.length} cidades em {estado}</h2>
        <div className="ep-cities-grid cir-reveal cir-reveal--d1">
          {cidades.map((cidade, index) => (
            <a
              key={index}
              href={`/grafica/${cidade.estado.toLowerCase()}/${normalizeText(cidade.cidade)}`}
              className="ep-city-link"
            >
              <span>{cidade.cidade}</span>
              <span className="ep-city-arrow">→</span>
            </a>
          ))}
        </div>
      </div>

      <hr className="cir-divider" />

      {/* Serviços */}
      <div className="cir-section">
        <span className="cir-s-tag cir-reveal">Serviços</span>
        <h2 className="cp-h2 cir-reveal cir-reveal--d1">Tudo que você pode solicitar</h2>
        <div className="cp-services-grid cir-reveal cir-reveal--d1">
          <div className="cp-service">
            <h3>Materiais Institucionais</h3>
            <p>Cartões de visita, papel timbrado, pastas e folders institucionais para fortalecer a identidade da sua marca.</p>
            <ul><li>Cartões de visita</li><li>Papel timbrado</li><li>Pastas executivas</li><li>Folders institucionais</li></ul>
          </div>
          <div className="cp-service">
            <h3>Materiais Promocionais</h3>
            <p>Flyers, banners, adesivos e catálogos para divulgar seus produtos e serviços com impacto.</p>
            <ul><li>Flyers e panfletos</li><li>Banners e faixas</li><li>Adesivos personalizados</li><li>Catálogos promocionais</li></ul>
          </div>
          <div className="cp-service">
            <h3>Impressão Digital e Offset</h3>
            <p>Soluções rápidas para pequenas tiragens e produções offset para grandes volumes com acabamento impecável.</p>
            <ul><li>Impressão digital rápida</li><li>Produção offset</li><li>Pequenas e grandes tiragens</li><li>Acabamento profissional</li></ul>
          </div>
          <div className="cp-service">
            <h3>Impressão Editorial</h3>
            <p>Revistas, livros e apostilas com acabamento impecável para projetos editoriais de qualidade.</p>
            <ul><li>Revistas e jornais</li><li>Livros e manuais</li><li>Apostilas educacionais</li><li>Publicações corporativas</li></ul>
          </div>
          <div className="cp-service">
            <h3>Moda e Etiquetas</h3>
            <p>Tags e etiquetas que valorizam as peças e contam a história da sua marca no setor da moda.</p>
            <ul><li>Tags personalizadas</li><li>Etiquetas de roupas</li><li>Identificação de produtos</li><li>Materiais têxteis</li></ul>
          </div>
          <div className="cp-service">
            <h3>Embalagens e Sacolas</h3>
            <p>Caixas e sacolas personalizadas para criar experiências únicas na entrega e destacar sua marca.</p>
            <ul><li>Caixas personalizadas</li><li>Sacolas promocionais</li><li>Envelopes personalizados</li><li>Displays promocionais</li></ul>
          </div>
        </div>
      </div>

      <ProductsCarousel />

      <AcabamentosSection />

      <hr className="cir-divider" />

      {/* Contato */}
      <div className="cir-section cir-section--light">
        <span className="cir-s-tag cir-reveal">Contato</span>
        <h2 className="cp-h2 cir-reveal cir-reveal--d1">Informações de Contato</h2>
        <div className="ep-contact-grid">
          <div>
            <p className="cp-body"><strong>CIR Gráfica</strong></p>
            <p className="cp-body">Av. Vereador José Monteiro, N1814</p>
            <p className="cp-body">Goiânia - GO, 74630-010</p>
            <p className="cp-body">(62) 3202-1150</p>
            <p className="cp-body">atendimento@cirgrafica.com.br</p>
          </div>
          <div>
            <p className="cp-body"><strong>Horário de Funcionamento</strong></p>
            <p className="cp-body">Segunda a Sexta: 08:00 – 18:00</p>
            <p className="cp-body">Sábado: 08:00 – 12:00</p>
            <p className="cp-body">Domingo: Fechado</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="cp-cta">
        <h2>Precisa de serviços de gráfica em {estado}?</h2>
        <p>Entre em contato conosco e solicite seu orçamento gratuito!</p>
        <div className="cp-cta-btns">
          <a href="https://www.cirgrafica.com.br/orcamento-rapido/" target="_blank" rel="noopener noreferrer" className="btn-primary">Solicitar Orçamento</a>
          <a href="https://www.cirgrafica.com.br/portfolio-de-cases/" target="_blank" rel="noopener noreferrer" className="btn-secondary">Ver Portfólio</a>
        </div>
      </div>

      <Footer />

      <style jsx global>{`
        .ep-cities-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; margin-top: 3rem; background: var(--cir-l-line) }
        .ep-city-link { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.2rem; background: var(--cir-l-bg); text-decoration: none; font-family: var(--cir-sans); font-size: .8rem; font-weight: 300; color: var(--cir-l-fg2); transition: background .2s, color .2s }
        .ep-city-link:hover { background: var(--cir-l-bg2); color: var(--cir-accent) }
        .ep-city-arrow { opacity: .3; font-size: .7rem }
        .ep-city-link:hover .ep-city-arrow { opacity: 1 }
        .ep-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; margin-top: 2rem }
        .ep-contact-grid .cp-body { margin-bottom: .4rem }
        @media (max-width: 768px) {
          .ep-cities-grid { grid-template-columns: repeat(2, 1fr) }
          .ep-contact-grid { grid-template-columns: 1fr; gap: 2rem }
        }
      `}</style>

      <a href="https://api.whatsapp.com/send?phone=556232021150&text=Ol%C3%A1!%20vim%20pelo%20site%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es!" target="_blank" rel="noopener noreferrer" className="cir-wa-fab" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    </div>
  );
} 