import Header from '../components/Header'
import Footer from '../components/Footer'
import ImageCarousel from '../components/ImageCarousel'
import Favicon from '../components/Favicon'
import cidades from '../cidades.json'
import { normalizeText } from '../utils/normalize'
import { galleryImages } from '../data/gallery'
import Head from 'next/head'

export default function Home() {
  // Agrupar cidades por estado
  const cidadesPorEstado = cidades.reduce((acc, cidade) => {
    if (!acc[cidade.estado]) {
      acc[cidade.estado] = [];
    }
    acc[cidade.estado].push(cidade);
    return acc;
  }, {});

  // Definir principais cidades (primeiras 5 de cada estado)
  const principaisCidades = Object.keys(cidadesPorEstado).reduce((acc, estado) => {
    acc[estado] = cidadesPorEstado[estado].slice(0, 5);
    return acc;
  }, {});

  return (
    <div>
      <Head>
        <title>CIR Gráfica - Serviços de Impressão Gráfica, Embalagens e Sacolas Personalizadas</title>
        <meta name="description" content="CIR Gráfica oferece serviços de embalagens e sacolas personalizadas, brindes personalizados e comunicação visual em todo o Brasil. Qualidade profissional com entrega rápida." />
        <meta name="keywords" content="gráfica, embalagens personalizadas, sacolas personalizadas, brindes personalizados, comunicação visual, CIR Gráfica" />
        <meta name="author" content="CIR Gráfica" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://cidades.cirgrafica.com.br" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cidades.cirgrafica.com.br" />
        <meta property="og:title" content="CIR Gráfica - Embalagens, Impressos gráficos e Sacolas Personalizadas" />
        <meta property="og:description" content="Serviços de gráfica em todo o Brasil. Embalagens e sacolas personalizadas, brindes personalizados e comunicação visual." />
        <meta property="og:image" content="https://www.cirgrafica.com.br/og-image.jpg" />
        
        {/* Twitter Card */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://cidades.cirgrafica.com.br" />
        <meta property="twitter:title" content="CIR Gráfica - Embalagens, Impressões Peronalizadas e Sacolas Personalizadas" />
        <meta property="twitter:description" content="Serviços de gráfica em todo o Brasil. Embalagens e sacolas personalizadas, brindes personalizados e comunicação visual." />
        <meta property="twitter:image" content="https://www.cirgrafica.com.br/og-image.jpg" />
      </Head>

      <Favicon />
      <Header />
      
      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 leading-tight">
              <span className="text-blue-600">Serviço Completo de Gráfica</span> com Atendimento em Todo o Brasil
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
              Embalagens personalizadas, impressões gráficas, sacolas, brindes corporativos e soluções de comunicação visual.
              Qualidade profissional, entrega rápida e atendimento especializado em 374 cidades.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a 
                href="https://www.cirgrafica.com.br/portfolio-de-cases/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl transition duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg"
              >
                📁 Baixe nosso portfólio
              </a>
              <a 
                href="https://www.cirgrafica.com.br/orcamento-rapido/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-xl transition duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg"
              >
                💬 Solicite um orçamento
              </a>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="max-w-6xl mx-auto p-6">

        {/* Estados e Principais Cidades */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Serviços de Gráfica por Estado
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.keys(cidadesPorEstado).map((estado) => (
              <div key={estado} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-blue-600 text-white p-4">
                  <h3 className="text-xl font-bold">{estado}</h3>
                  <p className="text-blue-100 text-sm">
                    {cidadesPorEstado[estado].length} cidades atendidas
                  </p>
                </div>
                
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Principais cidades:</h4>
                  <div className="space-y-2">
                    {principaisCidades[estado].map((cidade, index) => (
                      <a 
                        key={index}
                        href={`/grafica/${estado.toLowerCase()}/${normalizeText(cidade.cidade)}`}
                        className="block text-blue-600 hover:text-blue-800 hover:underline transition duration-200"
                      >
                        • Gráfica em {cidade.cidade}
                      </a>
                    ))}
                  </div>
                  
                  {cidadesPorEstado[estado].length > 5 && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <a 
                        href={`/grafica/estado/${estado.toLowerCase()}`}
                        className="text-sm text-gray-600 hover:text-blue-600 hover:underline"
                      >
                        Ver todas as {cidadesPorEstado[estado].length} cidades de {estado} →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Galeria de Trabalhos */}
        <div className="mb-16">
          <ImageCarousel 
            images={galleryImages} 
            title="Materiais que podem ser solicitados"
            autoPlay={true}
            interval={4000}
          />
        </div>

        {/* Serviços */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Nossos Serviços
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        </div>

        {/* Por que escolher a CIR */}
        <div className="bg-gray-50 p-8 rounded-lg mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Por que escolher a CIR Gráfica?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2 text-gray-900">Entrega Rápida</h3>
              <p className="text-sm text-gray-600">Prazos otimizados para sua necessidade</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold mb-2 text-gray-900">Qualidade Garantida</h3>
              <p className="text-sm text-gray-600">Materiais de primeira linha</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-semibold mb-2 text-gray-900">Melhor Preço</h3>
              <p className="text-sm text-gray-600">Orçamentos competitivos</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-semibold mb-2 text-gray-900">Atendimento Personalizado</h3>
              <p className="text-sm text-gray-600">Suporte especializado</p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center bg-blue-600 text-white p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">
            Precisa de serviços de gráfica?
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
        </div>
      </main>
      
      <Footer />
    </div>
  )
}