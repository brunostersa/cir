// CIR Gráfica = linha premium. Carbono = linha de baixo custo (empresa parceira).
export const CIRGRAFICA_PHONE = '556232021150'
export const CARBONO_PHONE = '5562992801269'

export const TIPO_PRODUTO_OPTIONS = [
  { value: 'panfleto_folder', label: 'Panfleto / Folder' },
  { value: 'agenda_caderno', label: 'Agenda / Caderno / Calendário' },
  { value: 'adesivo_tag_cartao', label: 'Adesivos / Tag / Cartão' },
  { value: 'sacola', label: 'Sacola' },
  { value: 'caixa', label: 'Caixas cartão' },
  { value: 'livro_revista', label: 'Livros / Revistas / Catálogo' },
  { value: 'papelaria', label: 'Papelaria' },
  { value: 'outros', label: 'Outros' },
]

export const QUANTIDADE_OPTIONS = [
  { value: 'ate_99', label: 'Até 100 unidades', hint: 'Pedidos pontuais, testes ou uso pessoal' },
  { value: '100_499', label: '101 a 500 unidades', hint: 'Pequenos lotes para empresas e eventos' },
  { value: '500_999', label: '501 a 1.000 unidades', hint: 'Produção intermediária, bom custo-benefício' },
  { value: '1000_mais', label: 'Mais de 1.000 unidades', hint: 'Grandes volumes, melhor preço por unidade' },
]

export const ARTE_OPTIONS = [
  { value: 'nao_tenho', label: 'Não tenho nada' },
  { value: 'so_logo', label: 'Só tenho o logo' },
  { value: 'preciso_ajustes', label: 'Tenho a arte, mas preciso de ajustes' },
  { value: 'tenho_tudo', label: 'Tenho tudo pronto' },
]

export const ACABAMENTO_OPTIONS = [
  { value: 'comercial', label: 'Comercial', hint: 'Impressão direta, sem acabamento' },
  { value: 'intermediario', label: 'Intermediário', hint: 'Corte, dobra, BOPP' },
  { value: 'premium', label: 'Premium', hint: 'Relevo, hot stamping, verniz localizado' },
]

// Produtos que não fazem sentido oferecer certos acabamentos (mapa de exceções —
// por padrão todo produto oferece todos os níveis; liste aqui só as exclusões).
// Ex: panfleto/folder não costuma levar hot stamping/relevo (nível Premium).
const ACABAMENTO_EXCLUIDO_POR_PRODUTO = {
  panfleto_folder: ['premium'],
}

// Retorna as opções de acabamento válidas pro produto escolhido, preservando o
// nível/posição original (1, 2, 3) mesmo quando alguma opção é filtrada — assim
// "Intermediário" sempre mostra a mesma proporção de barras, com ou sem Premium.
export function getAcabamentoOptions(tipoProduto) {
  const excluidos = ACABAMENTO_EXCLUIDO_POR_PRODUTO[tipoProduto] || []
  return ACABAMENTO_OPTIONS
    .map((o, i) => ({ ...o, level: i + 1 }))
    .filter((o) => !excluidos.includes(o.value))
}

export const PRAZO_OPTIONS = [
  { value: 'urgente', label: 'Produção urgente' },
  { value: 'ate_3_dias', label: 'Até 3 dias' },
  { value: 'ate_7_dias', label: 'Até 7 dias' },
  { value: 'sem_data', label: 'Sem prazo definido' },
]

function labelFor(options, value) {
  return options.find((o) => o.value === value)?.label || value
}

// Regra combinada com a Renata (CIR Gráfica):
// - menos de 100 un: sempre Carbono, independente do acabamento
// - 100 un ou mais + acabamento comercial: Carbono
// - 100 un ou mais + acabamento intermediário ou premium: CIR Gráfica
export function resolveDestino({ quantidade, acabamento }) {
  const abaixoDe100 = quantidade === 'ate_99'
  if (abaixoDe100) return { destino: 'carbono', phone: CARBONO_PHONE }
  if (acabamento === 'comercial') return { destino: 'carbono', phone: CARBONO_PHONE }
  return { destino: 'cirgrafica', phone: CIRGRAFICA_PHONE }
}

export function getQuizSummaryItems(quiz) {
  const items = [
    { label: 'Produto', value: labelFor(TIPO_PRODUTO_OPTIONS, quiz.tipo_produto) },
    { label: 'Quantidade', value: labelFor(QUANTIDADE_OPTIONS, quiz.quantidade) },
    { label: 'Arte', value: labelFor(ARTE_OPTIONS, quiz.arte_pronta) },
    { label: 'Acabamento', value: labelFor(ACABAMENTO_OPTIONS, quiz.acabamento) },
    { label: 'Prazo', value: labelFor(PRAZO_OPTIONS, quiz.prazo) },
  ]
  if (quiz.investimento) items.push({ label: 'Investimento/un', value: `R$ ${quiz.investimento}` })
  return items
}

export function buildQuizSummary(quiz) {
  return getQuizSummaryItems(quiz).map((i) => `${i.label}: ${i.value}`).join('\n')
}
