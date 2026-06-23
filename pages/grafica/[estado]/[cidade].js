import { useRouter } from 'next/router'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ImageCarousel from '../../../components/ImageCarousel'
import ProductsCarousel from '../../../components/ProductsCarousel'
import AcabamentosSection from '../../../components/AcabamentosSection'
import Favicon from '../../../components/Favicon'
import cidades from '../../../cidades.json'
import { galleryImages } from '../../../data/gallery'
import Head from 'next/head'
import { normalizeText } from '../../../utils/normalize'

export async function getStaticPaths() {
  const paths = cidades.map(c => ({
    params: { 
      estado: c.estado.toLowerCase(),
      cidade: normalizeText(c.cidade)
    }
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const cidadeData = cidades.find(c => 
    c.estado.toLowerCase() === params.estado && 
    normalizeText(c.cidade) === params.cidade
  );
  
  if (!cidadeData) {
    return {
      notFound: true
    };
  }

  // 🔗 pega cidades próximas do mesmo estado
  const cidadesProximas = cidades
    .filter(c => c.estado === cidadeData.estado && c.cidade !== cidadeData.cidade)
    .slice(0, 5);

  return {
    props: {
      cidade: cidadeData.cidade,
      estado: cidadeData.estado,
      cidadesProximas
    }
  };
}

export default function GraficaCidade({ cidade, estado, cidadesProximas }) {
  const pageTitle = `Gráfica em ${cidade} – Embalagens, Sacolas e Brindes | CIR Gráfica`;
  const pageDescription = `Gráfica em ${cidade}, ${estado}. Embalagens e sacolas personalizadas, brindes personalizados com qualidade e entrega rápida. Solicite seu orçamento agora.`;
  const canonicalUrl = `https://cidades.cirgrafica.com.br/grafica/${estado.toLowerCase()}/${normalizeText(cidade)}`;

  // ✅ Schema.org JSON-LD LocalBusiness + FAQ
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "CIR Gráfica",
    "description": `CIR Gráfica em ${cidade}, referência em embalagens e sacolas personalizadas, brindes personalizados.`,
    "url": canonicalUrl,
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
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.6",
      "reviewCount": "134"
    }
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Vocês fazem entrega de materiais em ${cidade}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Sim! Fazemos entrega de materiais em toda a cidade de ${cidade} e região metropolitana.`
        }
      },
      {
        "@type": "Question",
        "name": `Qual o prazo médio de produção?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `O prazo varia conforme o tipo de projeto, pois cada material exige um tempo de produção diferente.`
        }
      },
      {
        "@type": "Question",
        "name": `Vocês oferecem design também?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Podemos indicar designers parceiros de confiança e ajudar a orientar no desenvolvimento da arte.`
        }
      }
    ]
  };
  

  return (
    <div className="cir-root">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`gráfica ${cidade}, embalagens personalizadas ${cidade}, sacolas personalizadas ${cidade}, brindes ${cidade}, gráfica rápida ${cidade}, comunicação visual ${cidade}`} />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }} />
      </Head>


      <Favicon />
      <Header />

      {/* Hero / Intro */}
      <div className="cp-hero">
        <h1 className="cp-h1">
          Gráfica em <em>{cidade}</em> – Atendimento online com qualidade e excelência nos detalhes.
        </h1>
        <p className="cp-intro cir-reveal cir-reveal--d2">
          Há mais de <strong>20 anos</strong>, a CIR Gráfica atende empresas em <strong>{cidade}</strong> com qualidade reconhecida em todo o Brasil.
          Nosso atendimento é online e rápido: você solicita, nós refinamos, validamos e entregamos na sua cidade.
          Do cartão de visita ao catálogo empresarial, unimos tecnologia, acabamento impecável e agilidade para fazer sua marca ser sentida.
        </p>
      </div>

      {/* Imagem */}
      <img
        src="/grafica.jpeg"
        alt={`embalagens e sacolas personalizadas em ${cidade}`}
        className="cp-hero-img"
      />

      {/* Quem somos */}
      <div className="cir-section cir-section--light">
        <span className="cir-s-tag cir-reveal">Sobre a CIR Gráfica</span>
        <h2 className="cp-h2 cir-reveal cir-reveal--d1">Gráfica Online Confiável em {cidade}</h2>
        <p className="cp-body">
          Desde 1999, a <strong>CIR Gráfica</strong> atende empresas em {cidade} com <strong>soluções digitais simplificadas</strong>.
          Você faz o pedido online, nós cuidamos da produção e entrega. Sem burocracia, sem telefonemas, apenas
          <strong> qualidade garantida</strong> com atendimento rápido via WhatsApp, email e chat.
          Especialistas em <strong>embalagens personalizadas</strong>, <strong>sacolas</strong>, <strong>cartões</strong> e muito mais.
        </p>
      </div>

      <hr className="cir-divider" />

      {/* Serviços */}
      <div className="cir-section">
        <span className="cir-s-tag cir-reveal">Serviços</span>
        <h2 className="cp-h2 cir-reveal cir-reveal--d1">Orçamento Online para Qualquer Serviço de Gráfica</h2>
        <p className="cp-body">
          Solicite seu orçamento online em minutos. Envie seus materiais, especificações e prazos através do nosso formulário.
          Nossa equipe avalia e retorna com a melhor proposta em até 2 horas. Sem obrigação, sem surpresas. Confira todos os serviços disponíveis:
        </p>

        <div className="cp-services-grid cir-reveal cir-reveal--d1">
          <div className="cp-service">
            <h3>Materiais Institucionais</h3>
            <p>Cartões de visita, papel timbrado, pastas e folders institucionais para fortalecer a identidade da sua marca.</p>
            <ul>
              <li>Cartões de visita personalizados</li>
              <li>Papel timbrado e envelopes</li>
              <li>Pastas executivas</li>
              <li>Folders institucionais</li>
            </ul>
          </div>
          <div className="cp-service">
            <h3>Materiais Promocionais</h3>
            <p>Flyers, banners, adesivos e catálogos para divulgar seus produtos e serviços com impacto.</p>
            <ul>
              <li>Flyers e panfletos</li>
              <li>Banners e faixas</li>
              <li>Adesivos personalizados</li>
              <li>Catálogos promocionais</li>
            </ul>
          </div>
          <div className="cp-service">
            <h3>Impressão Digital e Offset</h3>
            <p>Soluções rápidas para pequenas tiragens e produções offset para grandes volumes.</p>
            <ul>
              <li>Impressão digital rápida</li>
              <li>Produção offset</li>
              <li>Pequenas e grandes tiragens</li>
              <li>Acabamento profissional</li>
            </ul>
          </div>
          <div className="cp-service">
            <h3>Impressão Editorial</h3>
            <p>Revistas, livros e apostilas com acabamento impecável.</p>
            <ul>
              <li>Revistas e jornais</li>
              <li>Livros e manuais</li>
              <li>Apostilas educacionais</li>
              <li>Publicações corporativas</li>
            </ul>
          </div>
          <div className="cp-service">
            <h3>Moda e Etiquetas</h3>
            <p>Tags e etiquetas que valorizam as peças e contam a história da sua marca.</p>
            <ul>
              <li>Tags personalizadas</li>
              <li>Etiquetas de roupas</li>
              <li>Identificação de produtos</li>
              <li>Materiais têxteis</li>
            </ul>
          </div>
          <div className="cp-service">
            <h3>Embalagens e Sacolas</h3>
            <p>Caixas e sacolas personalizadas para criar experiências únicas na entrega.</p>
            <ul>
              <li>Caixas personalizadas</li>
              <li>Sacolas promocionais</li>
              <li>Envelopes personalizados</li>
              <li>Displays promocionais</li>
            </ul>
          </div>
        </div>

        <div className="cp-note">
          <p className="cp-body">
            <strong>Com uma estrutura moderna e equipamentos de última geração</strong>, realizamos desde pequenas impressões digitais
            até grandes produções offset, garantindo a melhor relação custo-benefício. Cada projeto recebe atenção aos detalhes
            para assegurar um acabamento impecável e uma experiência visual diferenciada. Nossa equipe está preparada para
            oferecer suporte completo, desde a escolha dos materiais até a finalização, proporcionando resultados que fazem a diferença.
          </p>
        </div>
      </div>

      {/* Galeria */}
      <div className="cir-section cir-section--light">
        <ImageCarousel
          images={galleryImages}
          title={`Materiais que podem ser solicitados em ${cidade}`}
          autoPlay={true}
          interval={5000}
        />
      </div>

      <ProductsCarousel />

      <AcabamentosSection />

      <hr className="cir-divider" />

      {/* Como funciona */}
      <div className="cir-section">
        <span className="cir-s-tag cir-reveal">Como funciona</span>
        <h2 className="cp-h2 cir-reveal cir-reveal--d1">Como Funciona o Atendimento Online</h2>
        <div className="cp-steps cir-reveal cir-reveal--d1">
          <div className="cp-step">
            <span className="cp-step-num">01</span>
            <p className="cp-body"><strong>Solicite seu orçamento</strong> diretamente pelo formulário, WhatsApp ou email sem sair de casa.</p>
          </div>
          <div className="cp-step">
            <span className="cp-step-num">02</span>
            <p className="cp-body"><strong>Converse com nossos especialistas</strong> online. Orientamos na escolha de materiais, cores, acabamentos e prazos.</p>
          </div>
          <div className="cp-step">
            <span className="cp-step-num">03</span>
            <p className="cp-body"><strong>Confirme e acompanhe</strong> sua produção em tempo real. Você recebe sua encomenda em {cidade} com segurança.</p>
          </div>
        </div>
      </div>

      <hr className="cir-divider" />

      {/* Depoimentos */}
      <div className="cir-section cir-section--light">
        <span className="cir-s-tag cir-reveal">Depoimentos</span>
        <h2 className="cp-h2 cir-reveal cir-reveal--d1">O que nossos clientes dizem</h2>
        <div className="cp-blockquote">
          <p>"Excelente atendimento, prazo cumprido e impressão impecável. Recomendo a CIR Gráfica!"</p>
        </div>
        <p className="cp-rating">Nota média: <strong>4.6/5</strong> (mais de 130 avaliações)</p>
      </div>

      <hr className="cir-divider" />

      {/* FAQ */}
      <div className="cir-section">
        <span className="cir-s-tag cir-reveal">Dúvidas frequentes</span>
        <h2 className="cp-h2 cir-reveal cir-reveal--d1">Dúvidas Sobre Nosso Atendimento Online</h2>
        <ul className="cp-faq">
          <li><strong>Como faço para solicitar um orçamento online?</strong> Preencha o formulário no site ou envie sua solicitação por WhatsApp. Nós retornamos em até 2 horas.</li>
          <li><strong>Vocês entregam em {cidade}?</strong> Sim! Entregamos em toda a cidade e região, fazemos seu atendimento online, refinamos seu material, validamos e enviamos para qualquer lugar do Brasil.</li>
          <li><strong>Qual o prazo de produção?</strong> Varia conforme o material: alguns itens saem em 24h, outros em 3-5 dias. Você escolhe o prazo que mais convém.</li>
          <li><strong>Posso acompanhar meu pedido?</strong> Sim! Enviamos atualizações por email e WhatsApp durante toda a produção.</li>
          <li><strong>Vocês oferecem design também?</strong> Sim, indicamos designers parceiros ou você envia o arquivo pronto. Nossa equipe revisa tudo antes de produzir.</li>
        </ul>
      </div>

      <hr className="cir-divider" />

      {/* Cidades próximas */}
      <div className="cir-section cir-section--light">
        <span className="cir-s-tag cir-reveal">Atendemos também em</span>
        <h2 className="cp-h2 cir-reveal cir-reveal--d1">Cidades próximas</h2>
        <div className="cp-nearby">
          {cidadesProximas.map((c, i) => (
            <a key={i} href={`/grafica/${c.estado.toLowerCase()}/${normalizeText(c.cidade)}`}>
              Gráfica em {c.cidade} →
            </a>
          ))}
        </div>
      </div>

      {/* CTA final */}
      <div className="cp-cta">
        <h2>Solicite Seu Orçamento 100% Online</h2>
        <p>Resposta em até 2 horas. Sem compromisso, sem telefonemas. Apenas gráfica de qualidade entregue em {cidade}.</p>
        <div className="cp-cta-btns">
          <a href="https://api.whatsapp.com/send?phone=556232021150&text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20para%20meu%20projeto%20de%20gr%C3%A1fica." target="_blank" rel="noopener noreferrer" className="btn-primary">
            WhatsApp Agora
          </a>
          <a href="https://www.cirgrafica.com.br/orcamento-rapido/" target="_blank" rel="noopener noreferrer" className="btn-secondary">
            Formulário Online
          </a>
        </div>
      </div>

      <Footer />

      <a href="https://api.whatsapp.com/send?phone=556232021150&text=Ol%C3%A1!%20vim%20pelo%20site%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es!" target="_blank" rel="noopener noreferrer" className="cir-wa-fab" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
