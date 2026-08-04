import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Favicon from '../components/Favicon'
import { logLead } from '../lib/logLead'
import { formatPhoneInput } from '../lib/phone'
import { getNameError, getPhoneError } from '../lib/leadValidation'
import {
  TIPO_PRODUTO_OPTIONS,
  QUANTIDADE_OPTIONS,
  ARTE_OPTIONS,
  ACABAMENTO_OPTIONS,
  PRAZO_OPTIONS,
  INVESTIMENTO_OPTIONS,
  getAcabamentoOptions,
  getQuizSummaryItems,
  getInvestimentoLabel,
  resolveDestino,
} from '../lib/leadRouting'
import {
  IconFolder, IconCalendar, IconTag, IconBag, IconBox, IconBook, IconEnvelope, IconSpark,
  IconLogoMark, IconFileCheck, IconFileBlank, IconEdit, IconBolt, IconClock, IconInfinity,
  IconCheck, LevelBars,
} from '../components/QuizIcons'

const STEPS = ['tipo_produto', 'quantidade', 'arte_pronta', 'acabamento', 'prazo', 'investimento', 'contato', 'resumo']

const STEP_COPY = {
  tipo_produto: 'Qual o tipo de produto você precisa?',
  quantidade: 'Qual a quantidade estimada?',
  arte_pronta: 'Você já tem a arte pronta para impressão?',
  acabamento: 'Qual o nível de acabamento desejado?',
  prazo: 'Qual o prazo desejado?',
  investimento: 'Qual o valor estimado total para sua demanda?',
  contato: 'Como podemos te chamar?',
  resumo: 'Seu projeto',
}

// Mensagens consultivas — reforçam que o sistema está montando uma recomendação
// pro cliente, não só coletando dados.
const STEP_CONSULT = {
  tipo_produto: 'Em menos de 1 minuto você recebe uma recomendação personalizada.',
  quantidade: 'Isso nos ajuda a montar o processo de produção mais econômico pra você.',
  arte_pronta: 'Sem problema se ainda não estiver pronta — te orientamos em cada etapa.',
  acabamento: 'Vamos indicar a melhor configuração pra elevar o resultado do seu material.',
  prazo: 'Assim já conseguimos verificar disponibilidade na produção.',
  investimento: 'Isso ajuda a montar uma proposta dentro do seu orçamento.',
  contato: 'Estamos montando a melhor opção pra sua necessidade — só falta seu contato.',
  resumo: 'Confira se ficou tudo certo antes de enviarmos pro nosso time.',
}

const TIPO_ICONS = {
  panfleto_folder: IconFolder,
  agenda_caderno: IconCalendar,
  adesivo_tag_cartao: IconTag,
  sacola: IconBag,
  caixa: IconBox,
  livro_revista: IconBook,
  papelaria: IconEnvelope,
  outros: IconSpark,
}

const ARTE_ICONS = {
  nao_tenho: IconFileBlank,
  so_logo: IconLogoMark,
  preciso_ajustes: IconEdit,
  tenho_tudo: IconFileCheck,
}

const PRAZO_ICONS = {
  urgente: IconBolt,
  ate_3_dias: IconClock,
  ate_7_dias: IconCalendar,
  sem_data: IconInfinity,
}

function WhatsAppGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

const EMPTY_QUIZ = {
  tipo_produto: '',
  quantidade: '',
  arte_pronta: '',
  acabamento: '',
  prazo: '',
  investimento: '',
  investimento_outro: '',
}

export default function Orcamento() {
  const router = useRouter()
  const [stepIndex, setStepIndex] = useState(0)
  const [quiz, setQuiz] = useState(EMPTY_QUIZ)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [done, setDone] = useState(false)
  const [waLink, setWaLink] = useState('')

  const source = typeof router.query.source === 'string' ? router.query.source : 'orcamento_page'
  const cidade = typeof router.query.cidade === 'string' ? router.query.cidade : null
  const estado = typeof router.query.estado === 'string' ? router.query.estado : null
  const ctaMessage = typeof router.query.message === 'string' ? router.query.message : 'Gostaria de um orçamento para meus materiais gráficos.'

  const step = STEPS[stepIndex]
  const goBack = () => setStepIndex((i) => Math.max(0, i - 1))
  const goNext = () => setStepIndex((i) => Math.min(STEPS.length - 1, i + 1))
  const selectOption = (field, value) => {
    setQuiz((q) => ({ ...q, [field]: value }))
    goNext()
  }

  const acabamentoOptions = getAcabamentoOptions(quiz.tipo_produto)

  const digits = phone.replace(/\D/g, '')
  const nameError = getNameError(name)
  const phoneError = getPhoneError(phone)

  // 'contato' valida, salva o lead no banco e monta o link do WhatsApp — assim,
  // mesmo que o cliente desista na tela de resumo, o lead já ficou registrado.
  // O clique final em 'resumo' só abre o link já pronto (handleConfirm).
  const handleContinueFromContact = (e) => {
    e.preventDefault()
    if (nameError || phoneError) {
      setAttempted(true)
      return
    }

    const { destino, phone: targetPhone } = resolveDestino(quiz)
    const summaryText = getQuizSummaryItems(quiz).map((i) => `${i.label}: ${i.value}`).join('\n')
    const finalMessage = `Olá! Meu nome é ${name.trim()}. ${ctaMessage}\n\n${summaryText}`
    const link = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(finalMessage)}`

    logLead({
      phone: targetPhone,
      message: finalMessage,
      source,
      cidade,
      estado,
      customer_name: name.trim(),
      customer_phone: digits,
      quiz_tipo_produto: quiz.tipo_produto,
      quiz_quantidade: quiz.quantidade,
      quiz_arte_pronta: quiz.arte_pronta,
      quiz_acabamento: quiz.acabamento,
      quiz_prazo: quiz.prazo,
      quiz_investimento: getInvestimentoLabel(quiz) || null,
      destino,
    })

    setWaLink(link)
    goNext()
  }

  const handleConfirm = () => {
    window.open(waLink, '_blank', 'noopener,noreferrer')
    setDone(true)
  }

  return (
    <div className="cir-root qz-root">
      <Favicon />
      <Head>
        <title>Solicite seu orçamento — CIR Gráfica</title>
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div className="qz-stickyhead">
        <div className="qz-topbar">
          <Link href="/" className="qz-brand">cirgráfica</Link>
          <button type="button" className="qz-close" onClick={() => router.push('/')} aria-label="Fechar">×</button>
        </div>
        {!done && (
          <div className="qz-progress">
            <div className="qz-progress-fill" style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }} />
          </div>
        )}
      </div>

      <main className="qz-main">
        {done ? (
          <div className="qz-panel qz-fadein">
            <IconCheck className="qz-done-icon" />
            <h1 className="qz-title">Recebemos suas respostas!</h1>
            <p className="qz-body">
              Abrimos seu WhatsApp em outra aba para você continuar a conversa com nosso time.
              Se não abriu automaticamente, use o botão abaixo.
            </p>
            <a className="qz-btn-primary" href={waLink} target="_blank" rel="noopener noreferrer">Abrir WhatsApp</a>
            <Link href="/" className="qz-link-secondary">Voltar para o site</Link>
          </div>
        ) : (
          <div className="qz-panel qz-fadein" key={stepIndex}>
            {stepIndex > 0 && (
              <button type="button" className="qz-back" onClick={goBack}>← Voltar</button>
            )}
            <span className="qz-tag">Solicite seu orçamento</span>
            <h1 className="qz-title">{STEP_COPY[step]}</h1>
            <p className="qz-consult">{STEP_CONSULT[step]}</p>

            {step === 'tipo_produto' && (
              <div className="qz-grid qz-grid--2col">
                {TIPO_PRODUTO_OPTIONS.map((o) => {
                  const Icon = TIPO_ICONS[o.value]
                  return (
                    <button key={o.value} type="button" className="qz-tile" onClick={() => selectOption('tipo_produto', o.value)}>
                      <Icon className="qz-tile-icon" />
                      <span>{o.label}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {step === 'quantidade' && (
              <div className="qz-tiers">
                {QUANTIDADE_OPTIONS.map((o, i) => (
                  <button key={o.value} type="button" className="qz-tier" onClick={() => selectOption('quantidade', o.value)}>
                    <LevelBars level={i + 1} max={QUANTIDADE_OPTIONS.length} />
                    <span className="qz-tier-text">
                      <span className="qz-tier-label">{o.label}</span>
                      <span className="qz-tier-hint">{o.hint}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}

            {step === 'arte_pronta' && (
              <div className="qz-list">
                {ARTE_OPTIONS.map((o) => {
                  const Icon = ARTE_ICONS[o.value]
                  return (
                    <button key={o.value} type="button" className="qz-list-item" onClick={() => selectOption('arte_pronta', o.value)}>
                      <Icon className="qz-list-icon" />
                      <span>{o.label}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {step === 'acabamento' && (
              <div className="qz-tiers">
                {acabamentoOptions.map((o) => (
                  <button key={o.value} type="button" className="qz-tier" onClick={() => selectOption('acabamento', o.value)}>
                    <LevelBars level={o.level} max={ACABAMENTO_OPTIONS.length} />
                    <span className="qz-tier-text">
                      <span className="qz-tier-label">{o.label}</span>
                      <span className="qz-tier-hint">{o.hint}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}

            {step === 'prazo' && (
              <div className="qz-grid qz-grid--2col">
                {PRAZO_OPTIONS.map((o) => {
                  const Icon = PRAZO_ICONS[o.value]
                  return (
                    <button key={o.value} type="button" className="qz-tile" onClick={() => selectOption('prazo', o.value)}>
                      <Icon className="qz-tile-icon" />
                      <span>{o.label}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {step === 'investimento' && (
              <div className="qz-invest">
                {quiz.investimento === 'outro' ? (
                  <>
                    <div className="qz-invest-field">
                      <span className="qz-invest-prefix">R$</span>
                      <input
                        className="qz-invest-input"
                        type="text"
                        inputMode="numeric"
                        value={quiz.investimento_outro}
                        onChange={(e) => setQuiz((q) => ({ ...q, investimento_outro: e.target.value }))}
                        placeholder="0,00"
                        autoFocus
                      />
                    </div>
                    <button type="button" className="qz-btn-primary" onClick={goNext}>Continuar</button>
                    <button type="button" className="qz-btn-skip" onClick={() => setQuiz((q) => ({ ...q, investimento: '' }))}>← Escolher uma faixa</button>
                  </>
                ) : (
                  <>
                    <div className="qz-tiers">
                      {INVESTIMENTO_OPTIONS.map((o, i) => (
                        <button key={o.value} type="button" className="qz-tier" onClick={() => selectOption('investimento', o.value)}>
                          <LevelBars level={i + 1} max={INVESTIMENTO_OPTIONS.length} />
                          <span className="qz-tier-text">
                            <span className="qz-tier-label">{o.label}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                    <button type="button" className="qz-btn-skip" onClick={() => setQuiz((q) => ({ ...q, investimento: 'outro' }))}>Prefiro informar um valor exato</button>
                    <button type="button" className="qz-btn-skip" onClick={goNext}>Prefiro não informar</button>
                  </>
                )}
              </div>
            )}

            {step === 'contato' && (
              <form onSubmit={handleContinueFromContact} noValidate className="qz-form">
                <p className="qz-body">Deixe seu nome e WhatsApp para direcionarmos ao atendimento certo</p>

                <label className="qz-label" htmlFor="qz-name">Nome</label>
                <input
                  id="qz-name"
                  className={`qz-input ${attempted && nameError ? 'qz-input--error' : ''}`}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  autoComplete="name"
                  autoFocus
                />
                {attempted && nameError && <p className="qz-field-error">{nameError}</p>}

                <label className="qz-label" htmlFor="qz-phone">WhatsApp</label>
                <input
                  id="qz-phone"
                  className={`qz-input ${attempted && phoneError ? 'qz-input--error' : ''}`}
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                  placeholder="(XX) 99999-9999"
                  maxLength={15}
                  autoComplete="tel"
                />
                {attempted && phoneError && <p className="qz-field-error">{phoneError}</p>}

                <button type="submit" className="qz-btn-primary">Ver resumo do meu pedido →</button>
              </form>
            )}

            {step === 'resumo' && (
              <div className="qz-summary">
                <ul className="qz-summary-list">
                  {getQuizSummaryItems(quiz).map((item) => (
                    <li key={item.label} className="qz-summary-item">
                      <span className="qz-summary-label">{item.label}</span>
                      <span className="qz-summary-value">{item.value}</span>
                    </li>
                  ))}
                </ul>
                <button type="button" className="qz-btn-primary qz-btn-primary--wa" onClick={handleConfirm}>
                  <WhatsAppGlyph style={{ width: 18, height: 18, fill: '#fff' }} />
                  Continuar para o WhatsApp
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <style jsx>{`
        .qz-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .qz-stickyhead {
          position: sticky;
          top: 0;
          z-index: 20;
          background: var(--cir-bg);
        }
        .qz-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem var(--cir-gutter);
        }
        .qz-brand {
          font-family: var(--cir-serif);
          font-weight: 700;
          font-size: 1rem;
          color: var(--cir-fg);
          text-decoration: none;
        }
        .qz-close {
          width: 36px;
          height: 36px;
          background: transparent;
          border: 1px solid var(--cir-line);
          color: var(--cir-fg2);
          font-size: 1.3rem;
          line-height: 1;
          cursor: pointer;
          transition: color .2s, border-color .2s;
        }
        .qz-close:hover { color: var(--cir-fg); border-color: var(--cir-fg2) }
        .qz-progress {
          height: 3px;
          background: var(--cir-line);
        }
        .qz-progress-fill {
          height: 100%;
          background: var(--cir-accent);
          transition: width .3s ease;
        }
        .qz-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem var(--cir-gutter) 4rem;
        }
        .qz-panel {
          width: 100%;
          max-width: 560px;
          position: relative;
        }
        .qz-fadein { animation: qz-fadein .4s ease both; }
        @keyframes qz-fadein {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: none; }
        }
        .qz-back {
          display: inline-block;
          background: transparent;
          border: none;
          font-family: var(--cir-sans);
          font-size: .72rem;
          font-weight: 600;
          letter-spacing: .06em;
          color: var(--cir-fg2);
          cursor: pointer;
          margin: -.6rem 0 .8rem;
          padding: .6rem 0;
        }
        .qz-back:hover { color: var(--cir-fg) }
        .qz-tag {
          display: block;
          font-family: var(--cir-sans);
          font-size: .68rem;
          font-weight: 400;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: var(--cir-fg2);
          margin-bottom: 1rem;
        }
        .qz-title {
          font-family: var(--cir-serif);
          font-size: clamp(1.5rem, 3vw, 2.1rem);
          font-weight: 700;
          line-height: 1.25;
          color: var(--cir-fg);
          margin-bottom: .6rem;
          letter-spacing: -.01em;
        }
        .qz-consult {
          font-family: var(--cir-sans);
          font-size: .84rem;
          font-style: italic;
          line-height: 1.6;
          color: var(--cir-accent);
          margin-bottom: 2rem;
        }
        .qz-body {
          font-family: var(--cir-sans);
          font-size: .92rem;
          line-height: 1.8;
          color: var(--cir-fg2);
          margin-bottom: 1.6rem;
        }

        /* icon tile grid */
        .qz-grid {
          display: grid;
          gap: 1px;
          background: var(--cir-line);
          border: 1px solid var(--cir-line);
        }
        .qz-grid--2col { grid-template-columns: repeat(2, 1fr); }
        .qz-tile {
          background: var(--cir-bg2);
          border: none;
          padding: 1.7rem 1.4rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
          text-align: left;
          font-family: var(--cir-sans);
          font-size: .86rem;
          font-weight: 500;
          color: var(--cir-fg);
          cursor: pointer;
          transition: background .15s, color .15s;
        }
        .qz-tile:hover { background: #17150f; color: var(--cir-accent); }
        .qz-tile-icon { width: 26px; height: 26px; color: var(--cir-accent); flex-shrink: 0; }

        /* arte pronta list */
        .qz-list { display: flex; flex-direction: column; }
        .qz-list-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          border-top: 1px solid var(--cir-line);
          padding: 1.2rem .2rem;
          font-family: var(--cir-sans);
          font-size: .9rem;
          font-weight: 500;
          color: var(--cir-fg);
          cursor: pointer;
          transition: color .15s;
        }
        .qz-list-item:last-child { border-bottom: 1px solid var(--cir-line); }
        .qz-list-item:hover { color: var(--cir-accent); }
        .qz-list-icon { width: 22px; height: 22px; color: var(--cir-fg2); flex-shrink: 0; }
        .qz-list-item:hover .qz-list-icon { color: var(--cir-accent); }

        /* acabamento tiers */
        .qz-tiers { display: flex; flex-direction: column; }
        .qz-tier {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          border-top: 1px solid var(--cir-line);
          padding: 1.4rem .2rem;
          cursor: pointer;
        }
        .qz-tier:last-child { border-bottom: 1px solid var(--cir-line); }
        .qz-tier-text { display: flex; flex-direction: column; gap: .25rem; }
        .qz-tier-label {
          font-family: var(--cir-serif);
          font-size: 1rem;
          font-weight: 700;
          color: var(--cir-fg);
          transition: color .15s;
        }
        .qz-tier-hint { font-family: var(--cir-sans); font-size: .78rem; color: var(--cir-fg2); }
        .qz-tier:hover .qz-tier-label { color: var(--cir-accent); }

        /* investimento */
        .qz-invest { display: flex; flex-direction: column; }
        .qz-invest-field {
          display: flex;
          align-items: baseline;
          gap: .6rem;
          border-bottom: 1px solid var(--cir-line);
          padding-bottom: .8rem;
          margin-bottom: 2rem;
        }
        .qz-invest-prefix { font-family: var(--cir-serif); font-size: 1.6rem; color: var(--cir-fg2); }
        .qz-invest-input {
          font-family: var(--cir-serif);
          font-size: clamp(1.6rem, 9vw, 2.2rem);
          font-weight: 700;
          color: var(--cir-fg);
          background: transparent;
          border: none;
          outline: none;
          width: 100%;
        }
        .qz-invest-input::placeholder { color: var(--cir-fg2); opacity: .4; }

        /* resumo final */
        .qz-summary { display: flex; flex-direction: column; }
        .qz-summary-list { list-style: none; display: flex; flex-direction: column; }
        .qz-summary-item {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 1rem;
          border-top: 1px solid var(--cir-line);
          padding: 1rem .2rem;
        }
        .qz-summary-item:last-child { border-bottom: 1px solid var(--cir-line); }
        .qz-summary-label {
          font-family: var(--cir-sans);
          font-size: .68rem;
          font-weight: 600;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--cir-fg2);
          flex-shrink: 0;
        }
        .qz-summary-value {
          font-family: var(--cir-serif);
          font-size: .95rem;
          font-weight: 700;
          color: var(--cir-fg);
          text-align: right;
        }

        /* contact form + shared buttons */
        .qz-form { display: flex; flex-direction: column; }
        .qz-label {
          display: block;
          font-family: var(--cir-sans);
          font-size: .62rem;
          font-weight: 600;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--cir-fg2);
          margin-bottom: .5rem;
        }
        .qz-input {
          width: 100%;
          font-family: var(--cir-sans);
          font-size: 1rem;
          color: var(--cir-fg);
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--cir-line);
          padding: .7rem .1rem;
          margin-bottom: .4rem;
          outline: none;
        }
        .qz-input::placeholder { color: var(--cir-fg2); }
        .qz-input:focus { border-bottom-color: var(--cir-accent); }
        .qz-input--error { border-bottom-color: var(--cir-accent); }
        .qz-field-error { font-family: var(--cir-sans); font-size: .74rem; color: var(--cir-accent); margin-bottom: 1rem; }

        .qz-btn-primary {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: .6rem;
          font-family: var(--cir-sans);
          font-size: .74rem;
          font-weight: 600;
          letter-spacing: .12em;
          text-transform: uppercase;
          text-decoration: none;
          color: #fff;
          background: var(--cir-accent);
          border: none;
          padding: 1.1rem 1.6rem;
          margin-top: 1.6rem;
          cursor: pointer;
          transition: opacity .2s;
        }
        .qz-btn-primary:hover { opacity: .87; }
        .qz-btn-primary--wa { background: #25d366; margin-top: 2rem; }
        .qz-btn-primary--wa svg { width: 18px; height: 18px; fill: #fff; }
        .qz-btn-skip {
          background: transparent;
          border: none;
          font-family: var(--cir-sans);
          font-size: .74rem;
          color: var(--cir-fg2);
          text-decoration: underline;
          cursor: pointer;
          margin-top: .5rem;
          padding: .6rem 0;
        }
        .qz-btn-skip:hover { color: var(--cir-fg); }
        .qz-link-secondary {
          display: inline-block;
          font-family: var(--cir-sans);
          font-size: .78rem;
          color: var(--cir-fg2);
          margin-top: 1rem;
          padding: .5rem 0;
          text-decoration: underline;
        }
        .qz-link-secondary:hover { color: var(--cir-fg); }

        .qz-done-icon { width: 48px; height: 48px; color: var(--cir-accent); margin-bottom: 1.6rem; }

        @media (max-width: 480px) {
          .qz-topbar { padding: 1.1rem var(--cir-gutter); }
          .qz-main { padding: 1.4rem var(--cir-gutter) 2.5rem; }
          .qz-title { margin-bottom: .4rem; }
          .qz-consult { margin-bottom: 1.4rem; }
          .qz-tile { padding: 1.1rem .9rem; gap: .6rem; }
          .qz-tile-icon { width: 22px; height: 22px; }
          .qz-tile span { font-size: .8rem; line-height: 1.35; }
          .qz-list-item, .qz-tier { padding: 1rem .2rem; }
        }
        @media (max-width: 340px) {
          .qz-grid--2col { grid-template-columns: 1fr; }
        }
      `}</style>
      <style jsx global>{`
        .qz-levelbars {
          display: flex;
          align-items: flex-end;
          gap: 3px;
          flex-shrink: 0;
        }
        .qz-levelbar {
          width: 5px;
          background: var(--cir-line);
        }
        .qz-levelbar--on { background: var(--cir-accent); }
      `}</style>
    </div>
  )
}
