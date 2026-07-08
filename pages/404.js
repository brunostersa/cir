import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Favicon from '../components/Favicon'
import WhatsAppLink from '../components/WhatsAppLink'

export default function NotFound() {
  return (
    <div className="cir-root">
      <Head>
        <title>Página não encontrada — CIR Gráfica</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Favicon />
      <Header />

      <div className="nf-wrap">
        <span className="nf-code">404</span>
        <h1 className="nf-h1">Página não encontrada.</h1>
        <p className="nf-body">
          O endereço que você acessou não existe ou foi movido.<br />
          Volte para a página inicial ou escolha um estado para continuar.
        </p>
        <div className="nf-actions">
          <a href="/" className="cir-btn cir-btn--fill">Ir para o início</a>
          <WhatsAppLink message="Olá! vim pelo site gostaria de mais informações!" source="404_page" className="cir-btn cir-btn--outline">
            Falar pelo WhatsApp
          </WhatsAppLink>
        </div>
      </div>

      <Footer />

      <style jsx global>{`
        .nf-wrap {
          min-height: 70vh;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding: 10rem var(--cir-gutter) 8rem;
          max-width: calc(var(--cir-max) + var(--cir-gutter) * 2);
          margin: 0 auto;
        }
        .nf-code {
          font-family: var(--cir-serif);
          font-size: clamp(6rem, 12vw, 14rem);
          font-weight: 700;
          color: rgba(255,255,255,.04);
          line-height: 1;
          letter-spacing: -.04em;
          display: block;
          margin-bottom: -1rem;
        }
        .nf-h1 {
          font-family: var(--cir-serif);
          font-size: clamp(2rem, 3.5vw, 4rem);
          font-weight: 700;
          color: var(--cir-fg);
          line-height: 1.1;
          letter-spacing: -.02em;
          margin-bottom: 1.5rem;
        }
        .nf-body {
          font-family: var(--cir-sans);
          font-size: .9rem;
          font-weight: 400;
          line-height: 1.9;
          color: var(--cir-fg2);
          max-width: 480px;
          margin-bottom: 3rem;
        }
        .nf-actions {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  )
}
