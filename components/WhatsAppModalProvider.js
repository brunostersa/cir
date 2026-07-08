import { createContext, useContext, useState } from 'react'
import { logLead } from '../lib/logLead'
import { formatPhoneInput } from '../lib/phone'
import { getNameError, getPhoneError } from '../lib/leadValidation'

const PHONE = '556232021150'

const WhatsAppModalContext = createContext(null)

export function useWhatsAppModal() {
  return useContext(WhatsAppModalContext)
}

export function WhatsAppModalProvider({ children }) {
  const [pending, setPending] = useState(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [attempted, setAttempted] = useState(false)

  const openModal = (details) => setPending(details)
  const closeModal = () => {
    setPending(null)
    setName('')
    setPhone('')
    setAttempted(false)
  }

  const digits = phone.replace(/\D/g, '')
  const nameError = getNameError(name)
  const phoneError = getPhoneError(phone)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (nameError || phoneError) {
      setAttempted(true)
      return
    }
    if (!pending) return

    const finalMessage = `Olá! Meu nome é ${name.trim()}. ${pending.message}`

    logLead({
      phone: PHONE,
      message: finalMessage,
      source: pending.source,
      cidade: pending.cidade,
      estado: pending.estado,
      customer_name: name.trim(),
      customer_phone: digits,
    })

    window.open(`https://api.whatsapp.com/send?phone=${PHONE}&text=${encodeURIComponent(finalMessage)}`, '_blank', 'noopener,noreferrer')
    closeModal()
  }

  return (
    <WhatsAppModalContext.Provider value={{ openModal }}>
      {children}

      {pending && (
        <div className="wam-overlay" onClick={closeModal}>
          <div className="wam-modal" onClick={(e) => e.stopPropagation()}>
            <button className="wam-close" onClick={closeModal} aria-label="Fechar">×</button>
            <span className="wam-tag">Falar via WhatsApp</span>
            <h3 className="wam-title">Como podemos te chamar?</h3>
            <p className="wam-body">
              Deixe seu nome e WhatsApp para direcionarmos ao atendimento
            </p>
            <form onSubmit={handleSubmit} noValidate>
              <label className="wam-label" htmlFor="wam-name">Nome</label>
              <input
                id="wam-name"
                className={`wam-input ${attempted && nameError ? 'wam-input--error' : ''}`}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                autoComplete="name"
              />
              {attempted && nameError && <p className="wam-field-error">{nameError}</p>}

              <label className="wam-label" htmlFor="wam-phone">WhatsApp</label>
              <input
                id="wam-phone"
                className={`wam-input ${attempted && phoneError ? 'wam-input--error' : ''}`}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                placeholder="(XX) 99999-9999"
                maxLength={15}
                autoComplete="tel"
              />
              {attempted && phoneError && <p className="wam-field-error">{phoneError}</p>}

              <button type="submit" className="wam-submit">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Continuar para o WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .wam-overlay {
          position: fixed;
          inset: 0;
          z-index: 400;
          background: rgba(12,11,9,.75);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .wam-modal {
          position: relative;
          width: 100%;
          max-width: 400px;
          background: var(--cir-l-bg, #f4f0e8);
          border: 1px solid var(--cir-l-line, rgba(0,0,0,.1));
          padding: 2.2rem 1.8rem 1.8rem;
        }
        .wam-close {
          position: absolute;
          top: .8rem;
          right: .8rem;
          width: 32px;
          height: 32px;
          background: transparent;
          border: none;
          color: var(--cir-l-fg2, #6a6460);
          font-size: 1.4rem;
          line-height: 1;
          cursor: pointer;
        }
        .wam-close:hover { color: var(--cir-l-fg, #1a1814) }
        .wam-tag {
          display: block;
          font-family: var(--cir-sans, sans-serif);
          font-size: .62rem;
          font-weight: 600;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: #25d366;
          margin-bottom: .7rem;
        }
        .wam-title {
          font-family: var(--cir-serif, serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--cir-l-fg, #1a1814);
          margin-bottom: .7rem;
        }
        .wam-body {
          font-family: var(--cir-sans, sans-serif);
          font-size: .82rem;
          font-weight: 400;
          line-height: 1.6;
          color: var(--cir-l-fg2, #6a6460);
          margin-bottom: 1.4rem;
        }
        .wam-label {
          display: block;
          font-family: var(--cir-sans, sans-serif);
          font-size: .62rem;
          font-weight: 600;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: var(--cir-l-fg2, #6a6460);
          margin-bottom: .4rem;
        }
        .wam-input {
          width: 100%;
          font-family: var(--cir-sans, sans-serif);
          font-size: .88rem;
          color: var(--cir-l-fg, #1a1814);
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--cir-l-line, rgba(0,0,0,.1));
          padding: .6rem .1rem;
          margin-bottom: .3rem;
          outline: none;
        }
        .wam-input::placeholder { color: var(--cir-l-fg2, #6a6460) }
        .wam-input:focus { border-bottom-color: var(--cir-accent, #e8613a) }
        .wam-input--error { border-bottom-color: var(--cir-accent, #e8613a) }
        .wam-field-error {
          font-family: var(--cir-sans, sans-serif);
          font-size: .7rem;
          color: var(--cir-accent, #e8613a);
          margin-bottom: .9rem;
        }
        .wam-submit {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: .6rem;
          font-family: var(--cir-sans, sans-serif);
          font-size: .74rem;
          font-weight: 600;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: #fff;
          background: #25d366;
          border: none;
          padding: 1rem 1.4rem;
          cursor: pointer;
          transition: opacity .2s, transform .15s;
          margin-top: .8rem;
        }
        .wam-submit svg { width: 18px; height: 18px; fill: #fff; flex-shrink: 0 }
        .wam-submit:hover { opacity: .88 }
        .wam-submit:active { transform: scale(.98) }
      `}</style>
    </WhatsAppModalContext.Provider>
  )
}
