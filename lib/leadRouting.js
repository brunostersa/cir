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
  { value: 'ate_99', label: 'Até 99 unidades' },
  { value: '100_499', label: '100 a 499 unidades' },
  { value: '500_999', label: '500 a 999 unidades' },
  { value: '1000_mais', label: '1.000 unidades ou mais' },
]

export const ARTE_OPTIONS = [
  { value: 'so_logo', label: 'Só o logo' },
  { value: 'tenho_tudo', label: 'Tenho tudo, meu designer criou' },
  { value: 'nao_tenho', label: 'Não tenho nada' },
]

export const ACABAMENTO_OPTIONS = [
  { value: 'comercial', label: 'Comercial', hint: 'Impressão direta, sem acabamento' },
  { value: 'intermediario', label: 'Intermediário', hint: 'Corte, dobra, BOPP' },
  { value: 'premium', label: 'Premium', hint: 'Relevo, hot stamping, verniz localizado' },
]

export const PRAZO_OPTIONS = [
  { value: 'urgente', label: 'Material urgente' },
  { value: 'sem_data', label: 'Não tenho data definida' },
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

export function buildQuizSummary(quiz) {
  const lines = [
    `Produto: ${labelFor(TIPO_PRODUTO_OPTIONS, quiz.tipo_produto)}`,
    `Quantidade: ${labelFor(QUANTIDADE_OPTIONS, quiz.quantidade)}`,
    `Arte: ${labelFor(ARTE_OPTIONS, quiz.arte_pronta)}`,
    `Acabamento: ${labelFor(ACABAMENTO_OPTIONS, quiz.acabamento)}`,
    `Prazo: ${labelFor(PRAZO_OPTIONS, quiz.prazo)}`,
  ]
  if (quiz.investimento) lines.push(`Investimento/un: ${quiz.investimento}`)
  return lines.join('\n')
}
