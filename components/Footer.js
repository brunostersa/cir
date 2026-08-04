import Link from 'next/link'
import WhatsAppLink from './WhatsAppLink'

const WA_MESSAGE = 'Olá! vim pelo site gostaria de mais informações!'

export default function Footer() {
  return (
    <footer className="cf-root">
      {/* CTA — mesma tonalidade clara usada em cir-section--light no resto do site */}
      <div className="cf-cta">
        <span className="cir-s-tag cf-cta-tag">Vamos conversar?</span>
        <h2 className="cf-cta-title">Pronto para elevar sua próxima impressão?</h2>
        <p className="cf-cta-sub">Atendimento 100% online, com entrega em mais de 478 cidades do Brasil.</p>
        <WhatsAppLink message={WA_MESSAGE} source="footer_cta" className="cir-btn cir-btn--fill">
          Solicitar Orçamento
        </WhatsAppLink>
      </div>

      {/* Corpo escuro */}
      <div className="cf-body">
        <div className="cf-grid">
          <div className="cf-col cf-brand">
            <img src="/logo-cir.svg" alt="CIR Gráfica" className="cf-logo" />
            <p className="cf-tagline">Qualidade para ser sentida.</p>
            <address className="cf-address">
              Av. Vereador José Monteiro, N1814<br />
              Setor Negrão de Lima — Goiânia, GO
            </address>
          </div>

          <div className="cf-col">
            <h3 className="cf-col-title">Explorar</h3>
            <ul className="cf-list">
              <li><Link href="/" className="cf-link">Início</Link></li>
              <li><Link href="/servicos" className="cf-link">Serviços Gráficos</Link></li>
              <li><Link href="/acabamentos" className="cf-link">Acabamentos Gráficos</Link></li>
              <li><Link href="/portfolio" className="cf-link">Portfólio</Link></li>
              <li><Link href="/consultoria" className="cf-link">Consultoria Técnica</Link></li>
            </ul>
          </div>

          <div className="cf-col">
            <h3 className="cf-col-title">Contato</h3>
            <ul className="cf-list">
              <li><a href="tel:+556232021150" className="cf-link">(62) 3202-1150</a></li>
              <li><a href="mailto:atendimento@cirgrafica.com.br" className="cf-link">atendimento@cirgrafica.com.br</a></li>
              <li>
                <WhatsAppLink message={WA_MESSAGE} source="footer_contato" className="cf-link cf-link--accent">
                  Orçamento Rápido →
                </WhatsAppLink>
              </li>
              <li>
                <a href="https://www.cirgrafica.com.br" target="_blank" rel="noopener noreferrer" className="cf-link">
                  Site Institucional ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="cf-bottom">
          <span className="cf-copy">© {new Date().getFullYear()} CIR Gráfica e Editora Ltda. Todos os direitos reservados.</span>
          <span className="cf-copy">
            Desenvolvido por{' '}
            <a href="https://customerhub.com.br/" target="_blank" rel="noopener noreferrer" className="cf-credit-link">
              Customer Hub
            </a>
          </span>
        </div>
      </div>

      <style jsx global>{`
        .cf-root {
          margin-top: 6rem;
        }

        /* ── CTA (claro) ─────────────────────────────────────── */
        .cf-cta {
          background: var(--cir-l-bg);
          padding: 5rem var(--cir-gutter);
          text-align: center;
        }
        .cf-cta-tag {
          color: var(--cir-l-fg2) !important;
        }
        .cf-cta-title {
          font-family: var(--cir-serif);
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 700;
          color: var(--cir-l-fg);
          max-width: 34ch;
          margin: 0 auto .8rem;
          line-height: 1.2;
        }
        .cf-cta-sub {
          font-family: var(--cir-sans);
          font-size: .92rem;
          color: var(--cir-l-fg2);
          margin-bottom: 2rem;
        }

        /* ── Corpo (escuro) ──────────────────────────────────── */
        .cf-body {
          background: var(--cir-bg2);
          border-top: 1px solid var(--cir-line);
          padding: 4rem var(--cir-gutter) 2rem;
        }
        .cf-grid {
          max-width: var(--cir-max);
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
          gap: 1px;
          background: var(--cir-line);
          border: 1px solid var(--cir-line);
          margin-bottom: 2.5rem;
        }
        .cf-col {
          background: var(--cir-bg2);
          padding: 2.2rem 2rem;
        }
        .cf-logo {
          height: 24px;
          filter: brightness(0) invert(1);
          margin-bottom: 1rem;
        }
        .cf-tagline {
          font-family: var(--cir-serif);
          font-style: italic;
          font-size: .92rem;
          color: var(--cir-gold);
          margin-bottom: 1.2rem;
        }
        .cf-address {
          font-family: var(--cir-sans);
          font-style: normal;
          font-size: .8rem;
          line-height: 1.8;
          color: var(--cir-fg2);
        }
        .cf-col-title {
          font-family: var(--cir-sans);
          font-size: .68rem;
          font-weight: 600;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: var(--cir-fg2);
          margin-bottom: 1.3rem;
        }
        .cf-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: .8rem;
        }
        .cf-link {
          font-family: var(--cir-sans);
          font-size: .85rem;
          color: var(--cir-fg);
          text-decoration: none;
          transition: color .2s;
          display: inline-block;
        }
        .cf-link:hover { color: var(--cir-accent) }
        .cf-link--accent { color: var(--cir-accent); font-weight: 600 }
        .cf-link--accent:hover { opacity: .8; color: var(--cir-accent) }

        /* ── Bottom bar ──────────────────────────────────────── */
        .cf-bottom {
          max-width: var(--cir-max);
          margin: 0 auto;
          padding-top: 1.5rem;
          border-top: 1px solid var(--cir-line);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .cf-copy {
          font-family: var(--cir-sans);
          font-size: .74rem;
          color: var(--cir-fg2);
        }
        .cf-credit-link {
          color: var(--cir-fg2);
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color .2s;
        }
        .cf-credit-link:hover { color: var(--cir-accent) }

        @media (max-width: 900px) {
          .cf-grid { grid-template-columns: 1fr 1fr }
          .cf-brand { grid-column: span 2 }
        }

        @media (max-width: 640px) {
          .cf-cta { padding: 3.5rem var(--cir-gutter) }
          .cf-body { padding: 3rem var(--cir-gutter) 1.5rem }
          .cf-grid { grid-template-columns: 1fr }
          .cf-brand { grid-column: span 1 }
          .cf-col { padding: 1.8rem 1.6rem }
          .cf-bottom { flex-direction: column; align-items: flex-start; gap: .5rem }
        }
      `}</style>
    </footer>
  )
}
