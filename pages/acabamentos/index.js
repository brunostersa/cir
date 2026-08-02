import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Favicon from '../../components/Favicon'
import WhatsAppLink from '../../components/WhatsAppLink'
import acabamentos from '../../data/acabamentos.json'
import Head from 'next/head'
import Link from 'next/link'

export async function getStaticProps() {
  return {
    props: {
      acabamentos
    }
  };
}

export default function AcabamentosHub({ acabamentos }) {
  const pageTitle = 'Acabamentos Gráficos: Preços, Prazos e Como Escolher | CIR';
  const pageDescription = 'Conheça os melhores acabamentos gráficos: laminação fosca, verniz UV, hot stamping, relevo seco, corte especial e encadernação. Guia completo com preços e prazos.';
  const canonicalUrl = 'https://cidades.cirgrafica.com.br/acabamentos';

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Acabamentos Gráficos",
    "description": pageDescription,
    "url": canonicalUrl,
    "publisher": {
      "@type": "Organization",
      "name": "CIR Gráfica"
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": acabamentos.map((ac, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": ac.nome,
        "url": `${canonicalUrl}/${ac.id}`
      }))
    }
  };

  return (
    <div className="cir-root">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="acabamentos gráficos, laminação fosca, verniz UV, hot stamping, relevo seco, corte especial, encadernação" />
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
          <span aria-current="page">Acabamentos</span>
        </div>
      </nav>

      {/* Hero */}
      <div className="cp-hero cp-hero--sub">
        <h1 className="cp-h1 cir-reveal">Acabamentos <em>Gráficos</em></h1>
        <p className="cp-intro cir-reveal cir-reveal--d1">
          A melhor forma de transformar um impresso comum em uma peça que impressiona.
          Conheça as técnicas profissionais que elevam o valor percebido de seus materiais.
        </p>
      </div>

      {/* O que são */}
      <div className="cir-section cir-section--light">
        <span className="cir-s-tag cir-reveal">Guia técnico</span>
        <h2 className="cp-h2 cir-reveal cir-reveal--d1">O Que São Acabamentos Gráficos?</h2>
        <p className="cp-body cir-reveal cir-reveal--d1">
          Acabamentos gráficos são técnicas aplicadas após a impressão que transformam um simples impresso em uma
          peça de impacto visual. Cada acabamento oferece diferentes benefícios: proteção, brilho, textura tátil,
          ou formatos únicos. Juntos, comunicam qualidade, refinamento e atenção aos detalhes.
        </p>
        <p className="cp-body cir-reveal cir-reveal--d1">
          A escolha correta do acabamento pode aumentar em até 3x o valor percebido do produto e criar uma
          experiência memorável para quem recebe seus materiais.
        </p>
      </div>

      <hr className="cir-divider" />

      {/* Grid de Acabamentos */}
      <div className="cir-section">
        <span className="cir-s-tag cir-reveal">Catálogo</span>
        <h2 className="cp-h2 cir-reveal cir-reveal--d1">Os 6 Principais Acabamentos</h2>
        <p className="cp-body cir-reveal cir-reveal--d1">Clique em cada um para conhecer detalhes, preços, prazos e aplicações.</p>

        <div className="cp-item-grid cir-reveal cir-reveal--d1">
          {acabamentos.map((ac) => (
            <Link key={ac.id} href={`/acabamentos/${ac.id}`} className="cp-item-card">
              <img className="cp-item-img" src={ac.img} alt={`${ac.nome} - CIR Gráfica`} />
              <div className="cp-item-body">
                <span className="cp-item-tag">{ac.tagline}</span>
                <h3 className="cp-item-title">{ac.nome}</h3>
                <p className="cp-item-desc">{ac.descricaoCurta}</p>
                <span className="cp-item-link">Ver guia completo →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <hr className="cir-divider" />

      {/* Comparativo */}
      <div className="cir-section cir-section--light">
        <span className="cir-s-tag cir-reveal">Comparativo</span>
        <h2 className="cp-h2 cir-reveal cir-reveal--d1">Escolher o Acabamento Certo</h2>

        <div className="ac-compare-table cir-reveal cir-reveal--d1">
          <div className="ac-compare-header">
            <div>Acabamento</div>
            <div>Custo</div>
            <div className="ac-compare-col-impact">Impacto</div>
            <div>Prazo</div>
            <div>Ideal Para</div>
          </div>

          <Link href="/acabamentos/laminacao-fosca" className="ac-compare-row">
            <div className="ac-compare-name">Laminação Fosca</div>
            <div className="ac-compare-cost">Médio</div>
            <div className="ac-compare-impact">★★★★</div>
            <div className="ac-compare-speed">Rápido</div>
            <div className="ac-compare-ideal">Cartões, capas, corporativo</div>
          </Link>

          <Link href="/acabamentos/verniz-uv" className="ac-compare-row">
            <div className="ac-compare-name">Verniz UV</div>
            <div className="ac-compare-cost ac-cost-high">Médio-Alto</div>
            <div className="ac-compare-impact">★★★★★</div>
            <div className="ac-compare-speed">Médio</div>
            <div className="ac-compare-ideal">Logos, destaques, premium</div>
          </Link>

          <Link href="/acabamentos/hot-stamping" className="ac-compare-row ac-compare-row-luxury">
            <div className="ac-compare-name">Hot Stamping</div>
            <div className="ac-compare-cost ac-cost-luxury">Alto</div>
            <div className="ac-compare-impact">★★★★★</div>
            <div className="ac-compare-speed">Longo</div>
            <div className="ac-compare-ideal">Luxo, convites, marcas</div>
          </Link>

          <Link href="/acabamentos/relevo-seco" className="ac-compare-row">
            <div className="ac-compare-name">Relevo Seco</div>
            <div className="ac-compare-cost ac-cost-high">Médio-Alto</div>
            <div className="ac-compare-impact">★★★★</div>
            <div className="ac-compare-speed">Médio</div>
            <div className="ac-compare-ideal">Executivo, certificados</div>
          </Link>

          <Link href="/acabamentos/corte-especial" className="ac-compare-row">
            <div className="ac-compare-name">Corte Especial</div>
            <div className="ac-compare-cost">Médio</div>
            <div className="ac-compare-impact">★★★★★</div>
            <div className="ac-compare-speed">Rápido</div>
            <div className="ac-compare-ideal">Cartões, etiquetas, PDV</div>
          </Link>

          <Link href="/acabamentos/encadernacao-premium" className="ac-compare-row">
            <div className="ac-compare-name">Encadernação Premium</div>
            <div className="ac-compare-cost ac-cost-high">Médio-Alto</div>
            <div className="ac-compare-impact">★★★★</div>
            <div className="ac-compare-speed">Longo</div>
            <div className="ac-compare-ideal">Catálogos, agendas, portfólio</div>
          </Link>
        </div>

        <div className="ac-compare-legend cir-reveal cir-reveal--d1">
          <span><strong>Custo</strong> baseado em volume padrão</span>
          <span><strong>Impacto</strong> percepção visual e diferenciação</span>
          <span><strong>Prazo</strong> tempo de produção aproximado</span>
        </div>
      </div>

      {/* CTA */}
      <div className="cp-cta">
        <h2>Transforme Seus Materiais Gráficos</h2>
        <p>Não sabe qual acabamento escolher? Converse com nossos especialistas.</p>
        <div className="cp-cta-btns">
          <WhatsAppLink message="Olá! Gostaria de saber mais sobre os acabamentos gráficos" source="acabamentos_hub_cta" className="btn-primary">
            Solicitar Consultoria
          </WhatsAppLink>
        </div>
      </div>

      <Footer />

      <style jsx global>{`
        .ac-compare-table {
          margin-top: 2rem;
        }

        .ac-compare-header {
          display: grid;
          grid-template-columns: 2fr 1.1fr 1.1fr 1.1fr 1.8fr;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid var(--cir-accent);
          font-family: var(--cir-sans);
          font-size: .66rem;
          font-weight: 600;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: var(--cir-l-fg2);
        }

        .ac-compare-row {
          display: grid;
          grid-template-columns: 2fr 1.1fr 1.1fr 1.1fr 1.8fr;
          gap: 1rem;
          padding: 1.1rem 0;
          border-bottom: 1px solid var(--cir-l-line);
          align-items: center;
          text-decoration: none;
          color: inherit;
          transition: padding-left .2s, background .2s;
        }

        .ac-compare-row:hover {
          padding-left: .6rem;
          background: var(--cir-l-bg2);
        }

        .ac-compare-row-luxury {
          border-left: 2px solid var(--cir-accent);
        }

        .ac-compare-name {
          font-family: var(--cir-serif);
          font-weight: 700;
          color: var(--cir-l-fg);
          font-size: .92rem;
        }

        .ac-compare-cost {
          font-family: var(--cir-sans);
          font-size: .8rem;
          color: var(--cir-l-fg2);
        }

        .ac-cost-high { color: var(--cir-gold); font-weight: 600 }
        .ac-cost-luxury { color: var(--cir-accent); font-weight: 700 }

        .ac-compare-impact {
          font-size: .8rem;
          letter-spacing: .08em;
          color: var(--cir-gold);
        }

        .ac-compare-speed {
          font-family: var(--cir-sans);
          font-size: .8rem;
          color: var(--cir-l-fg2);
        }

        .ac-compare-ideal {
          font-family: var(--cir-sans);
          font-size: .8rem;
          color: var(--cir-l-fg2);
          line-height: 1.4;
        }

        .ac-compare-legend {
          display: flex;
          gap: 2rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
          font-family: var(--cir-sans);
          font-size: .72rem;
          color: var(--cir-l-fg2);
        }

        .ac-compare-legend strong {
          color: var(--cir-l-fg);
          font-weight: 600;
        }

        @media (max-width: 1024px) {
          .ac-compare-header, .ac-compare-row {
            grid-template-columns: 2fr 1fr 1.5fr 1.5fr;
          }
          .ac-compare-col-impact, .ac-compare-impact {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .ac-compare-header {
            display: none;
          }
          .ac-compare-row {
            grid-template-columns: 1fr;
            gap: .3rem;
            padding: 1rem 0;
          }
          .ac-compare-ideal {
            font-size: .74rem;
          }
        }
      `}</style>
    </div>
  );
}
