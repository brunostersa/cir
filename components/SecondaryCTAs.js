// Bloco de 2 caminhos secundários (portfólio / consultoria), usado nas páginas
// que hoje só oferecem o caminho de orçamento via WhatsApp.
export default function SecondaryCTAs() {
  return (
    <div className="cp-secondary-ctas cir-reveal cir-reveal--d1">
      <a href="/portfolio" className="cp-sc-card">
        <span className="cp-sc-tag">Antes de decidir</span>
        <h3 className="cp-sc-title">Veja nosso portfólio</h3>
        <p className="cp-sc-text">Exemplos reais de materiais que já produzimos, prontos pra baixar.</p>
        <span className="cp-sc-link">Baixar portfólio →</span>
      </a>
      <a href="/consultoria" className="cp-sc-card">
        <span className="cp-sc-tag">Para quem já teve retrabalho</span>
        <h3 className="cp-sc-title">Consultoria técnica gratuita</h3>
        <p className="cp-sc-text">30 min online pra revisar arquivo, material e acabamento antes de ir pra máquina.</p>
        <span className="cp-sc-link">Conhecer consultoria →</span>
      </a>
    </div>
  )
}
