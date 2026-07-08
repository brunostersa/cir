import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Favicon from '../components/Favicon'
import ImageCarousel from '../components/ImageCarousel'
import WhatsAppLink from '../components/WhatsAppLink'
import { galleryImages } from '../data/gallery'
import { formatPhoneInput } from '../lib/phone'
import { getStoredUtms } from '../lib/utm'

const SPECIALTIES = [
  'Promocional', 'Moda', 'Publicações e Editorial',
  'Embalagens e Sacolas', 'Institucional', 'Digital',
]

function getNameError(name) {
  if (!name.trim()) return 'Digite seu nome'
  if (name.trim().length < 2) return 'Nome muito curto'
  return ''
}

function getEmailError(email) {
  if (!email.trim()) return 'Digite seu e-mail'
  if (!/\S+@\S+\.\S+/.test(email)) return 'E-mail inválido'
  return ''
}

function getPhoneError(phone) {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return 'Digite seu WhatsApp'
  if (digits.length < 10) return 'Telefone incompleto — inclua o DDD'
  return ''
}

export default function Portfolio() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const [error, setError] = useState('')

  const digits = phone.replace(/\D/g, '')
  const nameError = getNameError(name)
  const emailError = getEmailError(email)
  const phoneError = getPhoneError(phone)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (nameError || emailError || phoneError) {
      setAttempted(true)
      return
    }
    setSubmitting(true)
    setError('')

    const utms = getStoredUtms()

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: '556232021150',
          message: `Baixou o guia de cases do site. Nome: ${name.trim()}, Empresa: ${company.trim() || '—'}`,
          source: 'portfolio_download',
          customer_name: name.trim(),
          customer_phone: digits,
          customer_email: email.trim(),
          customer_company: company.trim(),
          page_url: window.location.href,
          ...utms,
        }),
      })
      if (!res.ok) throw new Error('Falha ao enviar')
      router.push('/portfolio/obrigado')
    } catch (err) {
      setError('Não foi possível enviar agora. Tente novamente em instantes.')
      setSubmitting(false)
    }
  }

  return (
    <div className="cir-root">
      <Head>
        <title>Baixe um Guia de Cases — CIR Gráfica</title>
        <meta name="description" content="Baixe gratuitamente um guia de cases de sucesso em materiais gráficos, embalagens e sacolas personalizadas da CIR Gráfica." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://cidades.cirgrafica.com.br/portfolio" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cidades.cirgrafica.com.br/portfolio" />
        <meta property="og:title" content="Baixe um Guia de Cases — CIR Gráfica" />
        <meta property="og:description" content="Baixe gratuitamente um guia de cases de sucesso em materiais gráficos, embalagens e sacolas personalizadas da CIR Gráfica." />
        <meta property="og:image" content="https://www.cirgrafica.com.br/og-image.jpg" />
        <meta property="og:site_name" content="CIR Gráfica" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Baixe um Guia de Cases — CIR Gráfica" />
        <meta property="twitter:description" content="Baixe gratuitamente um guia de cases de sucesso em materiais gráficos, embalagens e sacolas personalizadas da CIR Gráfica." />
        <meta property="twitter:image" content="https://www.cirgrafica.com.br/og-image.jpg" />
      </Head>

      <Favicon />
      <Header />

      <div className="pf-hero">
        <div className="pf-hero-text">
          <span className="pf-tag cir-reveal">📍 Goiânia, Brasília e regiões próximas</span>
          <h1 className="pf-h1 cir-reveal cir-reveal--d1">Te ajudamos nas demandas de alto nível.</h1>
          <ul className="pf-bullets cir-reveal cir-reveal--d2">
            <li>Materiais Gráficos, Impressões, Embalagens e Sacolas</li>
            <li>Há 20 anos oferecendo os melhores recursos na área gráfica</li>
            <li>Equipe especialista e preocupada com cada detalhe do seu projeto</li>
          </ul>
        </div>

        <div className="pf-card cir-reveal cir-reveal--d2">
          <h2 className="pf-card-title">Baixe um guia de cases para inspirar sua marca</h2>
          <form onSubmit={handleSubmit} noValidate>
            <input className={`pf-input ${attempted && nameError ? 'pf-input--error' : ''}`} type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            {attempted && nameError && <p className="pf-field-error">{nameError}</p>}

            <input className={`pf-input ${attempted && emailError ? 'pf-input--error' : ''}`} type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            {attempted && emailError && <p className="pf-field-error">{emailError}</p>}

            <input className={`pf-input ${attempted && phoneError ? 'pf-input--error' : ''}`} type="tel" placeholder="Whatsapp" value={phone} onChange={(e) => setPhone(formatPhoneInput(e.target.value))} autoComplete="tel" maxLength={15} />
            {attempted && phoneError && <p className="pf-field-error">{phoneError}</p>}

            <input className="pf-input" type="text" placeholder="Empresa" value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" />

            <button type="submit" className="pf-submit" disabled={submitting}>
              {submitting ? 'Enviando...' : 'Baixe e Inspire-se'}
            </button>
            {error && <p className="pf-error">{error}</p>}
          </form>
          <WhatsAppLink
            message="Olá! vim pelo site e gostaria de agendar uma visita com um especialista."
            source="portfolio_agendar_visita"
            className="pf-alt-link"
          >
            Ou se preferir, agende uma visita com nossos especialistas
          </WhatsAppLink>
        </div>
      </div>

      <div className="cir-section cir-section--light">
        <span className="cir-s-tag cir-reveal">Especialistas em demandas flexíveis</span>
        <h2 className="cp-h2 cir-reveal cir-reveal--d1">Criamos materiais variados e personalizados com alto nível de qualidade.</h2>
        <div className="pf-specialties cir-reveal cir-reveal--d1">
          {SPECIALTIES.map((s, i) => (
            <div key={i} className="pf-specialty">{s}</div>
          ))}
        </div>
      </div>

      <div className="cir-section">
        <ImageCarousel
          images={galleryImages}
          title="Confira alguns trabalhos impressos"
          autoPlay={true}
          interval={5000}
        />
      </div>

      <div className="cir-section cir-section--light">
        <span className="cir-s-tag cir-reveal">Depoimentos</span>
        <h2 className="cp-h2 cir-reveal cir-reveal--d1">Depoimentos de clientes</h2>
        <div className="cp-blockquote cir-reveal cir-reveal--d1">
          <p>"Agradeço pelo excelente atendimento, pela qualidade do material e das impressões e pelo compromisso com o prazo de entrega. Nota mil pra CIR Gráfica! Adorei e super recomendo."</p>
        </div>
        <p className="cp-rating">Nota média: <strong>4.6/5</strong> (mais de 130 avaliações)</p>
      </div>

      <Footer />

      <style jsx global>{`
        .pf-hero {
          display: grid;
          grid-template-columns: 1.1fr .9fr;
          gap: 4rem;
          align-items: center;
          padding: 10rem var(--cir-gutter) 6rem;
          max-width: calc(var(--cir-max) + var(--cir-gutter) * 2);
          margin: 0 auto;
        }
        .pf-tag { display: block; font-family: var(--cir-sans); font-size: .72rem; font-weight: 400; letter-spacing: .06em; color: var(--cir-fg2); margin-bottom: 1.5rem }
        .pf-h1 { font-family: var(--cir-serif); font-size: clamp(2rem, 3.6vw, 3.4rem); font-weight: 700; line-height: 1.15; color: var(--cir-fg); letter-spacing: -.02em; margin-bottom: 2rem }
        .pf-bullets { display: flex; flex-direction: column; gap: 1rem }
        .pf-bullets li { font-family: var(--cir-sans); font-size: .88rem; font-weight: 400; line-height: 1.6; color: var(--cir-fg2); padding-left: 1.6rem; position: relative }
        .pf-bullets li::before { content: '○'; position: absolute; left: 0; color: var(--cir-accent) }
        .pf-card { background: var(--cir-l-bg); border: 1px solid var(--cir-l-line); padding: 2.4rem; }
        .pf-card-title { font-family: var(--cir-serif); font-size: 1.2rem; font-weight: 700; color: var(--cir-l-fg); line-height: 1.35; margin-bottom: 1.6rem }
        .pf-input {
          display: block; width: 100%; font-family: var(--cir-sans); font-size: .85rem; color: var(--cir-l-fg);
          background: transparent; border: none; border-bottom: 1px solid var(--cir-l-line);
          padding: .7rem .1rem; margin-bottom: .3rem; outline: none;
        }
        .pf-input::placeholder { color: var(--cir-l-fg2) }
        .pf-input:focus { border-bottom-color: var(--cir-accent) }
        .pf-input--error { border-bottom-color: var(--cir-accent) }
        .pf-field-error { color: var(--cir-accent); font-size: .7rem; margin-bottom: .9rem }
        .pf-submit {
          width: 100%; font-family: var(--cir-sans); font-size: .74rem; font-weight: 600; letter-spacing: .1em;
          text-transform: uppercase; color: #fff; background: var(--cir-accent); border: none;
          padding: 1rem 1.4rem; cursor: pointer; transition: opacity .2s; margin-top: .8rem;
        }
        .pf-submit:disabled { opacity: .6; cursor: wait }
        .pf-submit:not(:disabled):hover { opacity: .85 }
        .pf-error { color: var(--cir-accent); font-size: .74rem; margin-top: .8rem }
        .pf-alt-link {
          display: block; text-align: center; font-family: var(--cir-sans); font-size: .72rem;
          color: var(--cir-l-fg2); text-decoration: underline; margin-top: 1.4rem; background: none; border: none; cursor: pointer;
        }
        .pf-alt-link:hover { color: var(--cir-l-fg) }
        .pf-specialties {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--cir-l-line); margin-top: 3rem;
        }
        .pf-specialty {
          background: var(--cir-l-bg); padding: 1.6rem; text-align: center; font-family: var(--cir-sans);
          font-size: .78rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--cir-l-fg);
        }
        @media (max-width: 900px) {
          .pf-hero { grid-template-columns: 1fr; gap: 2.5rem; padding-top: 8rem }
          .pf-specialties { grid-template-columns: repeat(2, 1fr) }
        }
      `}</style>
    </div>
  )
}
