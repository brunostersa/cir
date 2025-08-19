import { useRouter } from 'next/router'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ImageCarousel from '../../../components/ImageCarousel'
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
    <div>
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

      <main className="max-w-4xl mx-auto p-6">

        {/* ✅ H1 */}
        <h1 className="text-4xl font-bold mb-6 text-gray-900">
          Gráfica em <span className="text-blue-600">{cidade}</span> – Qualidade para ser Sentida
        </h1>

        {/* ✅ Introdução */}
        <p className="text-lg text-gray-700 mb-6">
          Há mais de <strong>20 anos</strong>, a CIR Gráfica entrega <strong>impressão de qualidade</strong> em {cidade} e em todo o Brasil. 
          Nossa filosofia é simples: “<em>Qualidade para ser sentida</em>”. Do cartão de visita ao catálogo empresarial, oferecemos soluções 
          que unem tecnologia, acabamento impecável e atendimento personalizado.
        </p>

        {/* ✅ Imagem Padrão */}
        <img 
          src="/grafica.jpeg" 
          alt={`embalagens e sacolas personalizadas em ${cidade}`} 
          className="w-full h-auto rounded-lg shadow mb-8"
        />

        {/* ✅ Quem Somos */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-4">Nossa História em Impressão e Qualidade</h2>
          <p className="text-gray-700 leading-relaxed">
            Fundada em 1999, a <strong>CIR Gráfica</strong> começou como um pequeno negócio familiar e se tornou referência nacional. 
            Com uma trajetória marcada pela dedicação, crescemos lado a lado com nossos clientes, sempre trazendo 
                         inovação para os serviços de <strong>embalagens e sacolas personalizadas</strong>, <strong>offset</strong> e <strong>comunicação visual</strong>.
          </p>
        </section>

                 {/* ✅ Serviços */}
         <section className="mb-10">
           <h2 className="text-3xl font-bold mb-4">Serviços de Impressão em {cidade} com Qualidade e Agilidade</h2>
           <p className="text-gray-700 mb-6 leading-relaxed">
             Na CIR Gráfica, oferecemos uma ampla gama de serviços de impressão em {cidade}, unindo tecnologia de ponta, 
             atendimento personalizado e prazos flexíveis para atender todas as necessidades da sua empresa.
           </p>
           
           <div className="grid md:grid-cols-2 gap-6">
             <div className="bg-blue-50 p-6 rounded-lg">
               <h3 className="text-xl font-semibold mb-4 text-gray-900">✅ Materiais Institucionais</h3>
               <p className="text-gray-700 mb-3">Cartões de visita, papel timbrado, pastas e folders institucionais para fortalecer a identidade da sua marca.</p>
               <ul className="text-sm text-gray-600 space-y-1">
                 <li>• Cartões de visita personalizados</li>
                 <li>• Papel timbrado e envelopes</li>
                 <li>• Pastas executivas</li>
                 <li>• Folders institucionais</li>
               </ul>
             </div>

             <div className="bg-green-50 p-6 rounded-lg">
               <h3 className="text-xl font-semibold mb-4 text-gray-900">✅ Materiais Promocionais</h3>
               <p className="text-gray-700 mb-3">Flyers, banners, adesivos e catálogos para divulgar seus produtos e serviços com impacto.</p>
               <ul className="text-sm text-gray-600 space-y-1">
                 <li>• Flyers e panfletos</li>
                 <li>• Banners e faixas</li>
                 <li>• Adesivos personalizados</li>
                 <li>• Catálogos promocionais</li>
               </ul>
             </div>

             <div className="bg-yellow-50 p-6 rounded-lg">
               <h3 className="text-xl font-semibold mb-4 text-gray-900">✅ Impressão Digital e Offset</h3>
               <p className="text-gray-700 mb-3">Soluções rápidas para pequenas tiragens e produções offset para grandes volumes.</p>
               <ul className="text-sm text-gray-600 space-y-1">
                 <li>• Impressão digital rápida</li>
                 <li>• Produção offset</li>
                 <li>• Pequenas e grandes tiragens</li>
                 <li>• Acabamento profissional</li>
               </ul>
             </div>

             <div className="bg-purple-50 p-6 rounded-lg">
               <h3 className="text-xl font-semibold mb-4 text-gray-900">✅ Impressão Editorial</h3>
               <p className="text-gray-700 mb-3">Revistas, livros e apostilas com acabamento impecável.</p>
               <ul className="text-sm text-gray-600 space-y-1">
                 <li>• Revistas e jornais</li>
                 <li>• Livros e manuais</li>
                 <li>• Apostilas educacionais</li>
                 <li>• Publicações corporativas</li>
               </ul>
             </div>

             <div className="bg-pink-50 p-6 rounded-lg">
               <h3 className="text-xl font-semibold mb-4 text-gray-900">✅ Moda e Etiquetas</h3>
               <p className="text-gray-700 mb-3">Tags e etiquetas que valorizam as peças e contam a história da sua marca.</p>
               <ul className="text-sm text-gray-600 space-y-1">
                 <li>• Tags personalizadas</li>
                 <li>• Etiquetas de roupas</li>
                 <li>• Identificação de produtos</li>
                 <li>• Materiais têxteis</li>
               </ul>
             </div>

             <div className="bg-orange-50 p-6 rounded-lg">
               <h3 className="text-xl font-semibold mb-4 text-gray-900">✅ Embalagens e Sacolas</h3>
               <p className="text-gray-700 mb-3">Caixas e sacolas personalizadas para criar experiências únicas na entrega.</p>
               <ul className="text-sm text-gray-600 space-y-1">
                 <li>• Caixas personalizadas</li>
                 <li>• Sacolas promocionais</li>
                 <li>• Envelopes personalizados</li>
                 <li>• Displays promocionais</li>
               </ul>
             </div>
           </div>

           <div className="mt-8 bg-gray-50 p-6 rounded-lg">
             <p className="text-gray-700 leading-relaxed">
               <strong>Com uma estrutura moderna e equipamentos de última geração</strong>, realizamos desde pequenas impressões digitais 
               até grandes produções offset, garantindo a melhor relação custo-benefício. Cada projeto recebe atenção aos detalhes 
               para assegurar um acabamento impecável e uma experiência visual diferenciada. Nossa equipe está preparada para 
               oferecer suporte completo, desde a escolha dos materiais até a finalização, proporcionando resultados que fazem a diferença.
             </p>
           </div>
         </section>

         {/* ✅ Galeria de Trabalhos */}
         <section className="mb-10">
           <ImageCarousel 
             images={galleryImages} 
             title={`Materiais que podem ser solicitados em ${cidade}`}
             autoPlay={true}
             interval={5000}
           />
         </section>

        {/* ✅ Facilidade e Suporte */}
        <section className="bg-blue-50 p-6 rounded-lg mb-10">
          <h2 className="text-2xl font-bold mb-4">Facilidade e Suporte Completo</h2>
          <p className="text-gray-700">
            Mesmo que você não entenda de impressão, a <strong>CIR Gráfica</strong> torna tudo simples. 
            Nosso time orienta na escolha do papel, acabamento, cores e até na preparação dos arquivos. 
            Além disso, temos <strong>orçamento online</strong> e atendimento rápido para que você 
            economize tempo e receba exatamente o que precisa.
          </p>
        </section>

        {/* ✅ Depoimentos */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-4">O que nossos clientes dizem</h2>
          <blockquote className="border-l-4 border-blue-600 pl-4 text-gray-700 italic">
            “Excelente atendimento, prazo cumprido e impressão impecável. Recomendo a CIR Gráfica!”
          </blockquote>
          <p className="mt-2 text-gray-600">⭐ Nota média: <strong>4.6/5</strong> (mais de 130 avaliações)</p>
        </section>

        {/* ✅ FAQ */}
        <section className="bg-gray-50 p-6 rounded-lg mb-10">
        <h2 className="text-2xl font-bold mb-4">Perguntas Frequentes</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Vocês entregam em {cidade}?</strong> Sim! Entregamos em toda a cidade e região.</li>
          <li><strong>Qual o prazo médio?</strong> O prazo varia conforme o tipo de projeto, mas sempre buscamos entregar com agilidade.</li>
          <li><strong>Vocês oferecem design também?</strong> Trabalhamos em parceria com designers e podemos indicar profissionais de confiança para criar a arte do seu material.</li>
          <li><strong>Posso pedir orçamento pelo WhatsApp?</strong> Sim! <a className="text-blue-600 hover:underline" target="_blank" href="https://api.whatsapp.com/send?phone=556232021150&text=Ol%C3%A1!%20vim%20pelo%20site%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es!">Clique aqui</a> para ser atendido</li>
        </ul>
      </section>

        {/* ✅ Links internos */}
        <section className="bg-blue-50 p-6 rounded-lg mb-10">
          <h3 className="text-xl font-semibold mb-4">📍 Atendemos também em cidades próximas:</h3>
          <ul className="list-disc ml-6">
            {cidadesProximas.map((c, i) => (
              <li key={i}>
                <a href={`/grafica/${c.estado.toLowerCase()}/${normalizeText(c.cidade)}`} className="text-blue-600 hover:underline">
                  Gráfica em {c.cidade}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* ✅ CTA */}
        <div className="text-center bg-blue-600 text-white p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Precisa de serviços de gráfica em {cidade}?</h2>
          <p className="text-lg mb-6">Solicite um orçamento rápido e veja por que somos referência em qualidade.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://www.cirgrafica.com.br/portfolio-de-cases/" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100">
              📁 Baixe nosso portfólio de cases
            </a>
            <a href="https://www.cirgrafica.com.br/orcamento-rapido/" target="_blank" rel="noopener noreferrer" className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600">
              💬 Solicite um orçamento rápido
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
