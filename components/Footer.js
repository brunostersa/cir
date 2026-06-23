const WA = 'https://api.whatsapp.com/send?phone=556232021150&text=Ol%C3%A1!%20vim%20pelo%20site%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es!'

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
        <a href={WA} target="_blank" rel="noopener noreferrer" className="cir-footer__link">
          WhatsApp
        </a>
        <a
          href="https://www.cirgrafica.com.br/orcamento-rapido/"
          target="_blank"
          rel="noopener noreferrer"
          className="cir-footer__link"
        >
          Orçamento online
        </a>
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
