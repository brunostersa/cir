// One-time batch job: generates varied copy for each city page to avoid
// near-duplicate content across the 478 static /grafica/[estado]/[cidade] pages.
// Usage: node scripts/generate-city-content.js
// Requires ANTHROPIC_API_KEY in .env.local.
require('dotenv').config({ path: '.env.local' })

const fs = require('fs')
const path = require('path')
const Anthropic = require('@anthropic-ai/sdk')
const cidades = require('../cidades.json')
const { normalizeText } = require('../utils/normalize')

const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'cityContent.json')
const MODEL = 'claude-haiku-4-5'

const SYSTEM_PROMPT = `Você escreve variações de texto para páginas de SEO local da CIR Gráfica, uma gráfica online brasileira.

Fatos que devem permanecer verdadeiros em toda variação (não invente números diferentes):
- Fundada em 1999, mais de 25 anos de mercado.
- Atendimento 100% online: pedido, orçamento e produção sem burocracia, via WhatsApp, e-mail ou formulário.
- Especialidade: embalagens personalizadas, sacolas, cartões de visita, materiais institucionais e promocionais, brindes personalizados.
- Resposta ao orçamento em até 2 horas.
- Entrega para todo o Brasil.
- Nota média 4.6/5 com mais de 130 avaliações.

Escreva 6 textos curtos para a cidade indicada, cada um com a MESMA função do texto de referência abaixo, mas com frases, estrutura e vocabulário diferentes — para que a página não pareça um template repetido em cada cidade. Não reutilize as frases feitas do texto de referência. Varie a ordem das informações e o tom (mantendo profissional e direto, sem exagero). Mencione o nome da cidade de forma natural em "intro", "about" e "note".

Textos de referência (função e tamanho aproximado de cada campo — não copie, reescreva):
1. metaDescription (~155 caracteres, meta description de SEO): "Gráfica em {cidade}, {estado}. Embalagens e sacolas personalizadas, brindes personalizados com qualidade e entrega rápida. Solicite seu orçamento agora."
2. intro (parágrafo de abertura, ~3 frases): "Há mais de 20 anos, a CIR Gráfica atende empresas em {cidade} com qualidade reconhecida em todo o Brasil. Nosso atendimento é online e rápido: você solicita, nós refinamos, validamos e entregamos na sua cidade. Do cartão de visita ao catálogo empresarial, unimos tecnologia, acabamento impecável e agilidade para fazer sua marca ser sentida."
3. about (parágrafo "quem somos", ~4 frases): "Desde 1999, a CIR Gráfica atende empresas em {cidade} com soluções digitais simplificadas. Você faz o pedido online, nós cuidamos da produção e entrega. Sem burocracia, sem telefonemas, apenas qualidade garantida com atendimento rápido via WhatsApp, email e chat. Especialistas em embalagens personalizadas, sacolas, cartões e muito mais."
4. servicesIntro (parágrafo antes da lista de serviços, ~2 frases): "Solicite seu orçamento online em minutos. Envie seus materiais, especificações e prazos através do nosso formulário. Nossa equipe avalia e retorna com a melhor proposta em até 2 horas. Sem obrigação, sem surpresas. Confira todos os serviços disponíveis:"
5. note (parágrafo de fechamento da seção de serviços, ~3 frases): "Com uma estrutura moderna e equipamentos de última geração, realizamos desde pequenas impressões digitais até grandes produções offset, garantindo a melhor relação custo-benefício. Cada projeto recebe atenção aos detalhes para assegurar um acabamento impecável e uma experiência visual diferenciada. Nossa equipe está preparada para oferecer suporte completo, desde a escolha dos materiais até a finalização, proporcionando resultados que fazem a diferença."
6. testimonial (depoimento fictício de cliente, 1 frase entre aspas, tom de cliente satisfeito): "Excelente atendimento, prazo cumprido e impressão impecável. Recomendo a CIR Gráfica!"

Responda apenas com o JSON pedido, sem comentários adicionais.`

const CONTENT_SCHEMA = {
  type: 'object',
  properties: {
    metaDescription: { type: 'string' },
    intro: { type: 'string' },
    about: { type: 'string' },
    servicesIntro: { type: 'string' },
    note: { type: 'string' },
    testimonial: { type: 'string' },
  },
  required: ['metaDescription', 'intro', 'about', 'servicesIntro', 'note', 'testimonial'],
  additionalProperties: false,
}

function cityKey(c) {
  return `${c.estado.toLowerCase()}_${normalizeText(c.cidade)}`
}

function buildRequests() {
  const limit = process.env.CITY_LIMIT ? parseInt(process.env.CITY_LIMIT, 10) : cidades.length
  return cidades.slice(0, limit).map((c) => ({
    custom_id: cityKey(c),
    params: {
      model: MODEL,
      max_tokens: 1500,
      temperature: 1,
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: `Cidade: ${c.cidade}\nEstado: ${c.estado}` }],
      output_config: { format: { type: 'json_schema', schema: CONTENT_SCHEMA } },
    },
  }))
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY não configurada. Adicione em .env.local e rode novamente.')
    process.exit(1)
  }

  const client = new Anthropic()
  const requests = buildRequests()
  console.log(`Enviando batch com ${requests.length} requests (modelo: ${MODEL})...`)

  const batch = await client.messages.batches.create({ requests })
  console.log(`Batch criado: ${batch.id} (status: ${batch.processing_status})`)

  let current = batch
  while (current.processing_status !== 'ended') {
    await new Promise((r) => setTimeout(r, 30000))
    current = await client.messages.batches.retrieve(batch.id)
    const rc = current.request_counts
    console.log(`  status: ${current.processing_status} — succeeded: ${rc.succeeded}, processing: ${rc.processing}, errored: ${rc.errored}, expired: ${rc.expired}`)
  }

  console.log('Batch concluído. Coletando resultados...')

  const output = {}
  const errors = []

  for await (const result of await client.messages.batches.results(batch.id)) {
    if (result.result.type === 'succeeded') {
      const block = result.result.message.content.find((b) => b.type === 'text')
      try {
        output[result.custom_id] = JSON.parse(block.text)
      } catch (e) {
        errors.push({ custom_id: result.custom_id, error: `JSON parse failed: ${e.message}` })
      }
    } else {
      errors.push({ custom_id: result.custom_id, error: result.result.type })
    }
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2))
  console.log(`Escrito ${Object.keys(output).length}/${cidades.length} entradas em ${OUTPUT_PATH}`)

  if (errors.length) {
    console.error(`${errors.length} erro(s):`)
    console.error(JSON.stringify(errors, null, 2))
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
