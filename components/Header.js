const WA = 'https://api.whatsapp.com/send?phone=556232021150&text=Ol%C3%A1!%20vim%20pelo%20site%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es!'

export default function Header() {
  return (
    <nav className="cir-nav">
      <a href="/" className="cir-nav__logo">
        <img src="/logo-cir.svg" alt="CIR Gráfica" />
      </a>
      <div className="cir-nav__right">
        <a href={WA} target="_blank" rel="noopener noreferrer" className="cir-nav__link">
          WhatsApp
        </a>
        <a
          href="https://www.cirgrafica.com.br/orcamento-rapido/"
          target="_blank"
          rel="noopener noreferrer"
          className="cir-nav__cta"
        >
          Orçamento Rápido
        </a>
      </div>
    </nav>
  )
}
