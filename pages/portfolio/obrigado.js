import Head from 'next/head'
import Favicon from '../../components/Favicon'

const DOWNLOAD_URL = 'https://drive.google.com/file/d/1eKM4FgUveL4AwXBPqCSz44LdKpFAKRze/view'

export default function PortfolioObrigado() {
  return (
    <div className="cir-root">
      <Head>
        <title>Tudo certo! — CIR Gráfica</title>
        <meta name="robots" content="noindex" />
      </Head>

      <Favicon />

      <div className="po-wrap">
        <span className="po-tag">Obrigado!</span>
        <h1 className="po-h1">Tudo certo!</h1>
        <p className="po-body">Agora é só baixar o arquivo e inspirar-se.</p>
        <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className="po-btn">
          Baixar agora
        </a>
        <a href="/" className="po-back">Voltar para o início</a>
      </div>

      <style jsx global>{`
        .po-wrap {
          min-height: 100vh;
          background: var(--cir-bg);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding: 2rem var(--cir-gutter);
          max-width: calc(var(--cir-max) + var(--cir-gutter) * 2);
          margin: 0 auto;
        }
        .po-tag { font-family: var(--cir-sans); font-size: .72rem; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--cir-accent); margin-bottom: 1.2rem }
        .po-h1 { font-family: var(--cir-serif); font-size: clamp(2.4rem, 5vw, 4.5rem); font-weight: 700; color: var(--cir-fg); letter-spacing: -.02em; margin-bottom: 1.2rem }
        .po-body { font-family: var(--cir-sans); font-size: 1rem; font-weight: 400; color: var(--cir-fg2); margin-bottom: 2.4rem }
        .po-btn {
          font-family: var(--cir-sans); font-size: .74rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase;
          color: #fff; background: var(--cir-accent); text-decoration: none; padding: 1rem 2.2rem; display: inline-block;
          transition: opacity .2s; margin-bottom: 1.4rem;
        }
        .po-btn:hover { opacity: .85 }
        .po-back { font-family: var(--cir-sans); font-size: .72rem; color: var(--cir-fg2); text-decoration: underline; display: block }
        .po-back:hover { color: var(--cir-fg) }
      `}</style>
    </div>
  )
}
