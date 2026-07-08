import WhatsAppLink from './WhatsAppLink'

const WA_MESSAGE = 'Olá! vim pelo site gostaria de mais informações!'

export default function Header() {
  return (
    <nav className="cir-nav">
      <a href="/" className="cir-nav__logo">
        <img src="/logo-cir.svg" alt="CIR Gráfica" />
      </a>
      <div className="cir-nav__right">
        <WhatsAppLink message={WA_MESSAGE} source="header_nav" className="cir-nav__link">
          WhatsApp
        </WhatsAppLink>
        <WhatsAppLink message={WA_MESSAGE} source="header_orcamento" className="cir-nav__cta">
          Orçamento Rápido
        </WhatsAppLink>
      </div>
    </nav>
  )
}
