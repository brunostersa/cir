import { useEffect, useRef, useState } from 'react'
import { logLead } from '../lib/logLead'
import { formatPhoneInput } from '../lib/phone'
import { getNameError, getPhoneError } from '../lib/leadValidation'

const STORAGE_KEY = 'cir_popup_shown'
const ARM_DELAY_MS = 6000
const FALLBACK_DELAY_MS = 25000
const FALLBACK_SCROLL_RATIO = 0.6
const PHONE = '556232021150'

export default function LeadPopup({ cidade, estado }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [attempted, setAttempted] = useState(false)
  const shownRef = useRef(false)

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return

    const trigger = () => {
      if (shownRef.current) return
      shownRef.current = true
      sessionStorage.setItem(STORAGE_KEY, '1')
      setOpen(true)
    }

    let armed = false
    const armTimer = setTimeout(() => { armed = true }, ARM_DELAY_MS)

    const onMouseLeave = (e) => {
      if (armed && e.clientY <= 0) trigger()
    }

    const onScroll = () => {
      const ratio = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight
      if (ratio >= FALLBACK_SCROLL_RATIO) trigger()
    }

    const fallbackTimer = setTimeout(trigger, FALLBACK_DELAY_MS)

    document.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      clearTimeout(armTimer)
      clearTimeout(fallbackTimer)
      document.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const digits = phone.replace(/\D/g, '')
  const nameError = getNameError(name)
  const phoneError = getPhoneError(phone)

  const close = () => {
    setOpen(false)
    setName('')
    setPhone('')
    setAttempted(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (nameError || phoneError) {
      setAttempted(true)
      return
    }

    const finalMessage = `Olá! Meu nome é ${name.trim()}. Quero aproveitar o orçamento gratuito para meu projeto de gráfica em ${cidade}.`

    logLead({
      phone: PHONE,
      message: finalMessage,
      source: 'lead_popup',
      cidade,
      estado,
      customer_name: name.trim(),
      customer_phone: digits,
    })

    window.open(`https://api.whatsapp.com/send?phone=${PHONE}&text=${encodeURIComponent(finalMessage)}`, '_blank', 'noopener,noreferrer')
    close()
  }

  if (!open) return null

  return (
    <>
      <div className="lp-overlay" onClick={close}>
        <div className="lp-modal" onClick={(e) => e.stopPropagation()}>
          <button className="lp-close" onClick={close} aria-label="Fechar">×</button>
          <span className="lp-tag">Antes de você sair</span>
          <h3 className="lp-title">Receba seu orçamento em {cidade} agora</h3>
          <p className="lp-body">
            Fale com um especialista pelo WhatsApp e receba uma proposta para o seu projeto de gráfica
            em até <strong>2 horas</strong>. Sem compromisso.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <label className="lp-label" htmlFor="lp-name">Nome</label>
            <input
              id="lp-name"
              className={`lp-input ${attempted && nameError ? 'lp-input--error' : ''}`}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              autoComplete="name"
            />
            {attempted && nameError && <p className="lp-field-error">{nameError}</p>}

            <label className="lp-label" htmlFor="lp-phone">WhatsApp</label>
            <input
              id="lp-phone"
              className={`lp-input ${attempted && phoneError ? 'lp-input--error' : ''}`}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
              placeholder="(XX) 99999-9999"
              maxLength={15}
              autoComplete="tel"
            />
            {attempted && phoneError && <p className="lp-field-error">{phoneError}</p>}

            <button type="submit" className="lp-cta">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Quero meu orçamento agora
            </button>
            <button type="button" className="lp-dismiss" onClick={close}>Agora não</button>
          </form>
        </div>
      </div>

      <style jsx global>{`
        .lp-overlay {
          position: fixed;
          inset: 0;
          z-index: 300;
          background: rgba(12,11,9,.75);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: lp-fade .25s ease;
        }
        .lp-modal {
          position: relative;
          width: 100%;
          max-width: 420px;
          background: var(--cir-l-bg);
          border: 1px solid var(--cir-l-line);
          padding: 2.4rem 2rem 2rem;
          text-align: center;
          animation: lp-rise .3s cubic-bezier(.2,.7,.2,1);
        }
        .lp-close {
          position: absolute;
          top: .8rem;
          right: .8rem;
          width: 32px;
          height: 32px;
          background: transparent;
          border: none;
          color: var(--cir-l-fg2);
          font-size: 1.4rem;
          line-height: 1;
          cursor: pointer;
        }
        .lp-close:hover { color: var(--cir-l-fg) }
        .lp-tag {
          display: block;
          font-family: var(--cir-sans);
          font-size: .62rem;
          font-weight: 600;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--cir-accent);
          margin-bottom: .8rem;
        }
        .lp-title {
          font-family: var(--cir-serif);
          font-size: 1.4rem;
          font-weight: 700;
          line-height: 1.25;
          color: var(--cir-l-fg);
          margin-bottom: 1rem;
        }
        .lp-body {
          font-family: var(--cir-sans);
          font-size: .85rem;
          font-weight: 400;
          line-height: 1.7;
          color: var(--cir-l-fg2);
          margin-bottom: 1.6rem;
        }
        .lp-label {
          display: block;
          text-align: left;
          font-family: var(--cir-sans);
          font-size: .62rem;
          font-weight: 600;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: var(--cir-l-fg2);
          margin-bottom: .4rem;
        }
        .lp-input {
          width: 100%;
          font-family: var(--cir-sans);
          font-size: .88rem;
          color: var(--cir-l-fg);
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--cir-l-line);
          padding: .6rem .1rem;
          margin-bottom: .3rem;
          outline: none;
          text-align: left;
        }
        .lp-input::placeholder { color: var(--cir-l-fg2) }
        .lp-input:focus { border-bottom-color: var(--cir-accent) }
        .lp-input--error { border-bottom-color: var(--cir-accent) }
        .lp-field-error {
          font-family: var(--cir-sans);
          font-size: .7rem;
          color: var(--cir-accent);
          margin-bottom: .9rem;
          text-align: left;
        }
        .lp-cta {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: .6rem;
          font-family: var(--cir-sans);
          font-size: .74rem;
          font-weight: 600;
          letter-spacing: .1em;
          text-transform: uppercase;
          text-decoration: none;
          color: #fff;
          background: #25d366;
          border: none;
          padding: 1rem 1.4rem;
          margin-top: .8rem;
          margin-bottom: .9rem;
          cursor: pointer;
          transition: opacity .2s, transform .15s;
        }
        .lp-cta svg { width: 18px; height: 18px; fill: #fff; flex-shrink: 0 }
        .lp-cta:hover { opacity: .88 }
        .lp-cta:active { transform: scale(.98) }
        .lp-dismiss {
          background: transparent;
          border: none;
          font-family: var(--cir-sans);
          font-size: .68rem;
          letter-spacing: .04em;
          color: var(--cir-l-fg2);
          text-decoration: underline;
          cursor: pointer;
        }
        .lp-dismiss:hover { color: var(--cir-l-fg) }
        @keyframes lp-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes lp-rise { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: none } }
      `}</style>
    </>
  )
}
