import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
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
    <div>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`gráfica ${estado}, embalagens personalizadas ${estado}, sacolas personalizadas ${estado}, brindes personalizados ${estado}, comunicação visual ${estado}`} />
        <meta name="author" content="CIR Gráfica" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content="https://www.cirgrafica.com.br/og-image.jpg" />
        <meta property="og:site_name" content="CIR Gráfica" />
        <meta property="og:locale" content="pt_BR" />
        
        {/* Twitter Card */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content="https://www.cirgrafica.com.br/og-image.jpg" />
        
        {/* Geo Meta Tags */}
        <meta name="geo.region" content={`BR-${estado}`} />
        <meta name="geo.placename" content={estado} />
        <meta name="geo.position" content="-16.6864;-49.2653" />
        <meta name="ICBM" content="-16.6864, -49.2653" />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      </Head>
      
      <Favicon />
      <Header />
      
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Gráfica em {estado}</h1>
        <p className="text-xl text-gray-600 mb-8">
          Serviços de gráfica e embalagens personalizadas em todas as cidades de {estado}. 
          Escolha sua cidade para ver nossos serviços específicos.
        </p>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {cidades.map((cidade, index) => (
            <a 
              key={index} 
              href={`/grafica/${cidade.estado.toLowerCase()}/${normalizeText(cidade.cidade)}`} 
              className="block p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-md transition duration-300"
            >
              <h3 className="font-semibold text-gray-900 mb-1">{cidade.cidade}</h3>
              <p className="text-sm text-gray-600">Ver serviços →</p>
            </a>
          ))}
        </div>

                  {/* Serviços */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition duration-300">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Materiais Institucionais</h3>
              <p className="text-gray-600 mb-4">
                Cartões de visita, papel timbrado, pastas e folders institucionais 
                para fortalecer a identidade da sua marca.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Cartões de visita</li>
                <li>• Papel timbrado</li>
                <li>• Pastas executivas</li>
                <li>• Folders institucionais</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition duration-300">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Materiais Promocionais</h3>
              <p className="text-gray-600 mb-4">
                Flyers, banners, adesivos e catálogos para divulgar seus produtos 
                e serviços com impacto.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Flyers e panfletos</li>
                <li>• Banners e faixas</li>
                <li>• Adesivos personalizados</li>
                <li>• Catálogos promocionais</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition duration-300">
              <div className="text-4xl mb-4">🖨️</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Impressão Digital e Offset</h3>
              <p className="text-gray-600 mb-4">
                Soluções rápidas para pequenas tiragens e produções offset para 
                grandes volumes com acabamento impecável.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Impressão digital rápida</li>
                <li>• Produção offset</li>
                <li>• Pequenas e grandes tiragens</li>
                <li>• Acabamento profissional</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition duration-300">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Impressão Editorial</h3>
              <p className="text-gray-600 mb-4">
                Revistas, livros e apostilas com acabamento impecável para 
                projetos editoriais de qualidade.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Revistas e jornais</li>
                <li>• Livros e manuais</li>
                <li>• Apostilas educacionais</li>
                <li>• Publicações corporativas</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition duration-300">
              <div className="text-4xl mb-4">👗</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Moda e Etiquetas</h3>
              <p className="text-gray-600 mb-4">
                Tags e etiquetas que valorizam as peças e contam a história 
                da sua marca no setor da moda.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Tags personalizadas</li>
                <li>• Etiquetas de roupas</li>
                <li>• Identificação de produtos</li>
                <li>• Materiais têxteis</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition duration-300">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Embalagens e Sacolas</h3>
              <p className="text-gray-600 mb-4">
                Caixas e sacolas personalizadas para criar experiências únicas 
                na entrega e destacar sua marca.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Caixas personalizadas</li>
                <li>• Sacolas promocionais</li>
                <li>• Envelopes personalizados</li>
                <li>• Displays promocionais</li>
              </ul>
            </div>
          </div>

        {/* Informações de Contato */}
        <div className="bg-gray-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Informações de Contato</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">CIR Gráfica</h3>
              <p className="text-gray-600 mb-2">Av. Vereador José Monteiro, N1814</p>
              <p className="text-gray-600 mb-2">Goiânia - GO, 74630-010</p>
              <p className="text-gray-600 mb-2">📞 (62) 3202-1150</p>
              <p className="text-gray-600">📧 atendimento@cirgrafica.com.br</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Horário de Funcionamento</h3>
              <p className="text-gray-600 mb-2">Segunda a Sexta: 08:00 - 18:00</p>
              <p className="text-gray-600 mb-2">Sábado: 08:00 - 12:00</p>
              <p className="text-gray-600">Domingo: Fechado</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-blue-600 text-white p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">
            Precisa de serviços de gráfica em {estado}?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Entre em contato conosco e solicite seu orçamento gratuito!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://www.cirgrafica.com.br/orcamento-rapido/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg transition duration-300 hover:bg-gray-100"
            >
              💬 Solicitar Orçamento
            </a>
            <a 
              href="https://www.cirgrafica.com.br/portfolio-de-cases/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg transition duration-300 hover:bg-white hover:text-blue-600"
            >
              📁 Ver Portfólio
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 