import WhatsAppLink from './WhatsAppLink'

const WA_MESSAGE = 'Olá! vim pelo site gostaria de mais informações!'

export default function Header() {
  return (
    <nav className="cir-nav">
      <a href="/" className="cir-nav__logo">
        <img src="/logo-cir.svg" alt="CIR Gráfica" />
      </a>
      <div className="cir-nav__right">
        <a href="/portfolio" className="cir-nav__link">Portfólio</a>
        <a href="/consultoria" className="cir-nav__link">Consultoria</a>
        <WhatsAppLink message={WA_MESSAGE} source="header_orcamento" className="cir-nav__cta">
          Orçamento Rápido
        </WhatsAppLink>
      </div>
    </nav>
  )
}
