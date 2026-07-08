import WhatsAppLink from './WhatsAppLink'

const WA_MESSAGE = 'Olá! vim pelo site gostaria de mais informações!'

export default function Footer() {
  return (
    <footer className="cir-footer">
      <div className="cir-footer__brand">
        <img src="/logo-cir.svg" alt="CIR Gráfica" />
        <span className="cir-footer__copy">
          Goiânia, GO · (62) 3202-1150 · atendimento@cirgrafica.com.br
        </span>
        <span className="cir-footer__copy" style={{ opacity: .45, fontSize: '.7rem' }}>
          Av. Vereador José Monteiro, N1814 — Setor Negrão de Lima
        </span>
        <span className="cir-footer__tagline">Qualidade para ser sentida.</span>
      </div>

      <div className="cir-footer__links">
        <WhatsAppLink message={WA_MESSAGE} source="footer_orcamento" className="cir-footer__link">
          Orçamento Rápido
        </WhatsAppLink>
        <a href="/portfolio" className="cir-footer__link">Baixar Portfólio</a>
        <a href="/consultoria" className="cir-footer__link">Consultoria Técnica</a>
        <a
          href="https://www.cirgrafica.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="cir-footer__link"
        >
          cirgrafica.com.br
        </a>
        <span className="cir-footer__copy" style={{ marginTop: '.8rem', opacity: .35, fontSize: '.65rem' }}>
          © {new Date().getFullYear()} CIR Gráfica e Editora Ltda.
        </span>
      </div>
    </footer>
  )
}
