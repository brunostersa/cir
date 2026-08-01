import WhatsAppLink from './WhatsAppLink'
import Link from 'next/link'

const WA_MESSAGE = 'Olá! vim pelo site gostaria de mais informações!'

export default function Footer() {
  return (
    <footer className="cir-footer">
      <div className="cir-footer__content">
        {/* Brand & Contact */}
        <div className="cir-footer__section cir-footer__brand">
          <img src="/logo-cir.svg" alt="CIR Gráfica" className="cir-footer__logo" />
          <p className="cir-footer__tagline">Qualidade para ser sentida.</p>
          <div className="cir-footer__contact">
            <div className="cir-footer__info">
              <span className="cir-footer__label">Telefone</span>
              <a href="tel:+556232021150" className="cir-footer__value">(62) 3202-1150</a>
            </div>
            <div className="cir-footer__info">
              <span className="cir-footer__label">Email</span>
              <a href="mailto:atendimento@cirgrafica.com.br" className="cir-footer__value">atendimento@cirgrafica.com.br</a>
            </div>
            <div className="cir-footer__info">
              <span className="cir-footer__label">Localização</span>
              <span className="cir-footer__value">Goiânia, GO</span>
            </div>
          </div>
        </div>

        {/* Projeto */}
        <div className="cir-footer__section">
          <h3 className="cir-footer__section-title">Projeto</h3>
          <ul className="cir-footer__list">
            <li>
              <Link href="/acabamentos" className="cir-footer__link">
                Acabamentos Gráficos
              </Link>
            </li>
            <li>
              <Link href="/portfolio" className="cir-footer__link">
                Portfólio
              </Link>
            </li>
            <li>
              <Link href="/consultoria" className="cir-footer__link">
                Consultoria Técnica
              </Link>
            </li>
            <li>
              <WhatsAppLink message={WA_MESSAGE} source="footer_projeto" className="cir-footer__link">
                Orçamento Rápido
              </WhatsAppLink>
            </li>
          </ul>
        </div>

        {/* Links Úteis */}
        <div className="cir-footer__section">
          <h3 className="cir-footer__section-title">Links</h3>
          <ul className="cir-footer__list">
            <li>
              <a
                href="https://www.cirgrafica.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="cir-footer__link"
              >
                Site Institucional
              </a>
            </li>
            <li>
              <a
                href="/"
                className="cir-footer__link"
              >
                Início
              </a>
            </li>
          </ul>
        </div>

        {/* Créditos */}
        <div className="cir-footer__section">
          <h3 className="cir-footer__section-title">Créditos</h3>
          <div className="cir-footer__credits">
            <p className="cir-footer__credit-item">
              <strong>Desenvolvido por</strong><br />
              <a
                href="https://customerhub.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="cir-footer__link"
              >
                Customer Hub
              </a>
            </p>
            <p className="cir-footer__credit-item">
              <strong>Design & Estratégia</strong><br />
              Bruno Stersa
            </p>
          </div>
        </div>
      </div>

      <div className="cir-footer__bottom">
        <span className="cir-footer__copy">
          © {new Date().getFullYear()} CIR Gráfica e Editora Ltda. Todos os direitos reservados.
        </span>
      </div>

      <style jsx global>{`
        .cir-footer {
          background: #1a1814;
          color: #ebe8e0;
          padding: 3rem 2rem 1.5rem;
          margin-top: 6rem;
          border-top: 1px solid #2a2420;
        }

        .cir-footer__content {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 3rem;
          margin-bottom: 2rem;
        }

        .cir-footer__section {
          display: flex;
          flex-direction: column;
        }

        .cir-footer__brand {
          grid-column: span 1;
        }

        .cir-footer__logo {
          width: 140px;
          height: auto;
          margin-bottom: 1rem;
        }

        .cir-footer__tagline {
          font-size: 0.95rem;
          font-weight: 600;
          color: #e8613a;
          margin-bottom: 1.5rem;
          font-style: italic;
        }

        .cir-footer__contact {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cir-footer__info {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .cir-footer__label {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #a89a8f;
          text-transform: uppercase;
        }

        .cir-footer__value {
          font-size: 0.9rem;
          color: #ebe8e0;
          text-decoration: none;
          transition: color 0.2s;
        }

        .cir-footer__value:hover {
          color: #e8613a;
        }

        .cir-footer__section-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1.2rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border-bottom: 2px solid #e8613a;
          padding-bottom: 0.5rem;
        }

        .cir-footer__list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .cir-footer__link {
          font-size: 0.85rem;
          color: #d4cfc8;
          text-decoration: none;
          transition: all 0.2s;
          display: inline-block;
        }

        .cir-footer__link:hover {
          color: #e8613a;
          transform: translateX(4px);
        }

        .cir-footer__credits {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .cir-footer__credit-item {
          font-size: 0.8rem;
          line-height: 1.6;
          margin: 0;
          color: #d4cfc8;
        }

        .cir-footer__credit-item strong {
          color: #ffffff;
          font-weight: 700;
        }

        .cir-footer__credit-item a {
          color: #e8613a;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }

        .cir-footer__credit-item a:hover {
          color: #f07a4d;
        }

        .cir-footer__bottom {
          max-width: 1400px;
          margin: 0 auto;
          padding-top: 1.5rem;
          border-top: 1px solid #2a2420;
          text-align: center;
        }

        .cir-footer__copy {
          font-size: 0.75rem;
          color: #8a8178;
          line-height: 1.6;
        }

        @media (max-width: 1200px) {
          .cir-footer__content {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }

          .cir-footer__brand {
            grid-column: span 2;
          }
        }

        @media (max-width: 768px) {
          .cir-footer {
            padding: 2rem 1rem 1rem;
            margin-top: 4rem;
          }

          .cir-footer__content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .cir-footer__brand {
            grid-column: span 1;
            border-bottom: 1px solid #2a2420;
            padding-bottom: 1.5rem;
          }

          .cir-footer__section-title {
            font-size: 0.85rem;
          }

          .cir-footer__list {
            gap: 0.5rem;
          }

          .cir-footer__link {
            font-size: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          .cir-footer {
            padding: 1.5rem 0.75rem 1rem;
          }

          .cir-footer__content {
            gap: 1.5rem;
          }

          .cir-footer__logo {
            width: 100px;
          }

          .cir-footer__section-title {
            font-size: 0.75rem;
            margin-bottom: 0.8rem;
          }

          .cir-footer__credit-item {
            font-size: 0.75rem;
          }

          .cir-footer__copy {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </footer>
  )
}
