import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'

const WA = 'https://api.whatsapp.com/send?phone=556232021150&text=Ol%C3%A1!%20vim%20pelo%20site%20e%20quero%20saber%20sobre%20a%20Consultoria%20Gr%C3%A1fica%20CIR'

const HERO_SLIDES = [
  { src: '/conceituais/materiais-graficos-impressao34.jpeg', alt: 'Embalagens premium com hot stamping produzidas pela CIR Gráfica' },
  { src: '/conceituais/materiais-graficos-impressao33.jpeg', alt: 'Materiais gráficos com acabamento especial verniz localizado' },
  { src: '/conceituais/materiais-graficos-impressao27.jpeg', alt: 'Catálogos e revistas impressos com qualidade editorial' },
  { src: '/conceituais/materiais-graficos-impressao13.jpeg', alt: 'Linha completa de papelaria corporativa impressa pela CIR' },
  { src: '/conceituais/materiais-graficos-impressao22.jpeg', alt: 'Brindes e folders com relevo seco produzidos em Goiânia' },
]

const VAGAS_TOTAL = 5
const VAGAS_OCUPADAS = 3

const STEPS = [
  { num: '01', label: 'Análise de arquivo', body: 'Verificamos sangria, fechamento, cores CMYK, resolução e faca de corte. Identificamos erros antes de ir para a máquina.' },
  { num: '02', label: 'Material ideal', body: 'Indicamos gramatura, tipo de papel e acabamento certo para o seu processo — relevo, hot stamping, verniz localizado.' },
  { num: '03', label: 'Plano técnico', body: 'Você sai com especificações técnicas, orçamento otimizado e próximos passos em documento claro.' },
  { num: '04', label: 'Produção garantida', body: 'Com tudo validado, produzimos com segurança. Sem reimpressão, sem desperdício, sem surpresa no lote final.' },
]

const GALLERY = [
  '/conceituais/materiais-graficos-impressao13.jpeg',
  '/conceituais/materiais-graficos-impressao33.jpeg',
  '/conceituais/materiais-graficos-impressao27.jpeg',
  '/conceituais/materiais-graficos-impressao17.jpeg',
  '/conceituais/materiais-graficos-impressao32.jpeg',
  '/conceituais/materiais-graficos-impressao20.jpeg',
]

const FAQS = [
  { q: 'A consultoria é realmente gratuita?', a: 'Sim, sem nenhum custo. Clientes bem orientados tomam decisões melhores — e projetos bem especificados geram menos retrabalho pra todos.' },
  { q: 'Preciso ter arquivo pronto para participar?', a: 'Não. Você pode vir com o briefing, uma ideia ou materiais de referência. Analisamos o que você tem e ajudamos a estruturar o que falta.' },
  { q: 'Preciso estar em Goiânia?', a: 'Não. A consultoria acontece por videochamada. Produzimos em Goiânia e entregamos para qualquer cidade do Brasil.' },
  { q: 'Quais materiais vocês produzem?', a: 'Foco em materiais com especificação técnica apurada: sacolas, caixas cartonadas, embalagens, brindes corporativos, papelaria premium e peças com acabamento especial.' },
  { q: 'Quanto tempo da consultoria até a entrega?', a: 'A consultoria dura 30 minutos. Após aprovação, a produção leva entre 7 e 15 dias úteis dependendo do acabamento. Frete expresso disponível.' },
  { q: 'O que acontece se houver algum problema?', a: 'Garantia total de conformidade. Se o produto não atender ao especificado na consultoria, refazemos sem custo adicional.' },
]

export default function Consultoria() {
  const [openFaq, setOpenFaq] = useState(null)
  const [scrollPct, setScrollPct] = useState(0)
  const [stickyVisible, setStickyVisible] = useState(false)
  const [slideIdx, setSlideIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setSlideIdx(i => (i + 1) % HERO_SLIDES.length), 4000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      setScrollPct(pct)
      setStickyVisible(window.scrollY > 600)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <Head>
        <title>Consultoria Gráfica Gratuita — CIR Gráfica</title>
        <meta name="description" content="30 minutos de consultoria técnica gratuita para garantir que seu material gráfico saia perfeito na primeira tiragem. CIR Gráfica, desde 1994." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Josefin+Sans:wght@300;400;600&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        :root {
          --bg:      #0c0b09;
          --bg2:     #111009;
          --fg:      #eae4d8;
          --fg2:     #7a7268;
          --accent:  #e8613a;
          --gold:    #c9a96e;
          --serif:   'Courier Prime', monospace;
          --sans:    'Josefin Sans', sans-serif;
          --gutter:  5vw;
          --max:     1200px;
          /* light palette */
          --l-bg:    #f4f0e8;
          --l-bg2:   #ece7dd;
          --l-fg:    #1a1814;
          --l-fg2:   #6a6460;
          --l-line:  rgba(0,0,0,.1);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }
        html { scroll-behavior: smooth }
        body { background: var(--bg); color: var(--fg); font-family: var(--sans); font-weight: 300; overflow-x: hidden; -webkit-font-smoothing: antialiased }

        /* Light section overrides */
        .is-light { background: var(--l-bg); color: var(--l-fg) }
        .is-light .s-tag { color: var(--l-fg2) }
        .is-light .s-title { color: var(--l-fg) }
        .is-light .s-body { color: var(--l-fg2) }
        .is-light .divider, .divider-light { border-color: var(--l-line) }
        .is-light .stat-num { color: var(--l-fg) }
        .is-light .stat-label { color: var(--l-fg2) }
        .is-light .stat { border-color: var(--l-line) }
        .is-light .step { background: var(--l-bg) }
        .is-light .step-label { color: var(--l-fg2) }
        .is-light .step-title { color: var(--l-fg) }
        .is-light .step-body { color: var(--l-fg2) }
        .is-light .steps-grid { background: var(--l-line) }
        .is-light .step-num { color: rgba(0,0,0,.04) }
        .is-light .include-row { border-color: var(--l-line) }
        .is-light .include-info h4 { color: var(--l-fg) }
        .is-light .include-info p { color: var(--l-fg2) }
        .is-light .include-idx { color: var(--l-fg2) }
        .is-light .include-val { color: rgba(0,0,0,.18) }
        .is-light .price-box { border-color: rgba(0,0,0,.12); background: var(--l-bg2) }
        .is-light .price-box-left p { color: var(--l-fg2) }
        .is-light .price-big { color: var(--l-fg) }
        .is-light .price-note { color: var(--l-fg2) }
        .is-light .vagas-text { color: var(--l-fg2) }
        .is-light .vagas-text strong { color: var(--l-fg) }
        .is-light .vaga { background: rgba(0,0,0,.1) }
        .is-light .faq-item { border-color: var(--l-line) }
        .is-light .faq-item:first-of-type { border-top-color: var(--l-line) }
        .is-light .faq-q { color: var(--l-fg) }
        .is-light .faq-icon { color: var(--l-fg2) }
        .is-light .faq-a { color: var(--l-fg2) }
        .is-light .btn-text { color: var(--l-fg2); border-color: rgba(0,0,0,.2) }
        .is-light .btn-text:hover { color: var(--l-fg); border-color: var(--l-fg) }

        /* Progress */
        .progress { position: fixed; top: 0; left: 0; width: 100%; height: 1px; background: var(--fg2); transform-origin: left; z-index: 300; opacity: .4 }

        /* Nav */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.5rem var(--gutter);
          border-bottom: 1px solid rgba(255,255,255,.04);
          background: rgba(12,11,9,.95);
          backdrop-filter: blur(12px);
        }
        .nav-logo { text-decoration: none; display: flex; align-items: center }
        .nav-right { display: flex; align-items: center; gap: 2.5rem }
        .nav-link { font-family: var(--sans); font-size: .72rem; font-weight: 400; letter-spacing: .14em; text-transform: uppercase; color: var(--fg2); text-decoration: none; transition: color .2s }
        .nav-link:hover { color: var(--fg) }
        .nav-cta { font-family: var(--sans); font-size: .72rem; font-weight: 400; letter-spacing: .14em; text-transform: uppercase; color: #fff; background: var(--accent); padding: .65rem 1.5rem; text-decoration: none; transition: opacity .2s }
        .nav-cta:hover { opacity: .85 }

        /* Hero */
        .hero { height: 100vh; max-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; overflow: hidden; }
        .hero-left {
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 10rem var(--gutter) 6rem;
          border-right: 1px solid rgba(255,255,255,.06);
          overflow: hidden;
        }
        .hero-right { position: relative; overflow: hidden; height: 100%; }
        .hero-tag { font-family: var(--sans); font-size: .66rem; font-weight: 400; letter-spacing: .22em; text-transform: uppercase; color: var(--fg2); margin-bottom: 2rem; opacity: .7 }
        .hero-h1 { font-family: var(--serif); font-size: clamp(2.8rem, 4.5vw, 5.2rem); font-weight: 700; line-height: 1.1; color: var(--fg); letter-spacing: -.02em }
        .hero-h1 em { font-style: italic; font-weight: 400; color: var(--gold); display: block; font-size: clamp(3rem, 5vw, 5.8rem); line-height: 1.05; letter-spacing: -.02em; margin-top: .1rem }
        .hero-sub { font-family: var(--sans); font-size: .78rem; font-weight: 300; line-height: 1.85; color: var(--fg2); margin-top: 1.8rem; max-width: 340px; opacity: .75 }
        .hero-actions { margin-top: 3rem; display: flex; align-items: center; gap: 2rem }
        .btn { font-family: var(--sans); font-size: .72rem; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; text-decoration: none; display: inline-block; transition: opacity .2s }
        .btn-fill { background: var(--accent); color: #fff; padding: 1rem 2.4rem }
        .btn-fill:hover { opacity: .85 }
        .btn-text { color: var(--fg2); border-bottom: 1px solid rgba(255,255,255,.15); padding-bottom: .15rem }
        .btn-text:hover { color: var(--fg); border-color: var(--fg) }

        .hero-right { position: relative; overflow: hidden }
        .hero-slide { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: brightness(.7) saturate(.6); opacity: 0; transition: opacity 1.2s cubic-bezier(.4,0,.2,1) }
        .hero-slide.active { opacity: 1 }
        .hero-dots { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; z-index: 2 }
        .hero-dot { width: 20px; height: 2px; background: rgba(255,255,255,.25); transition: background .4s, width .4s }
        .hero-dot.active { background: #fff; width: 32px }
        .hero-right-label {
          position: absolute; bottom: 2.5rem; right: 2.5rem;
          font-family: var(--sans); font-size: .62rem; font-weight: 400; letter-spacing: .16em; text-transform: uppercase;
          color: rgba(255,255,255,.35); writing-mode: vertical-rl;
        }

        /* Stats */
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 1px solid var(--l-line) }
        .stat { padding: 2.5rem var(--gutter); border-right: 1px solid var(--l-line) }
        .stat:last-child { border-right: none }
        .stat-num { font-family: var(--serif); font-size: 2.8rem; font-weight: 700; color: var(--fg); line-height: 1 }
        .stat-label { font-family: var(--sans); font-size: .7rem; font-weight: 300; letter-spacing: .12em; text-transform: uppercase; color: var(--fg2); margin-top: .6rem }

        /* Clients */
        .clients { background: #fff; padding: 3rem var(--gutter); border-bottom: 1px solid rgba(0,0,0,.08) }
        .clients-label { font-family: var(--sans); font-size: .65rem; font-weight: 400; letter-spacing: .2em; text-transform: uppercase; color: var(--l-fg2); text-align: center; margin-bottom: 2.5rem }
        .clients-logos { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 2rem 4rem }
        .clients-logos img { height: 64px; object-fit: contain; filter: grayscale(1) opacity(.55); transition: filter .3s }
        .clients-logos img:hover { filter: grayscale(0) opacity(.8) }

        /* Section */
        .section { padding: 7rem var(--gutter); max-width: calc(var(--max) + var(--gutter) * 2); margin: 0 auto }
        .s-tag { font-family: var(--sans); font-size: .68rem; font-weight: 400; letter-spacing: .2em; text-transform: uppercase; color: var(--fg2); margin-bottom: 1rem }
        .s-title { font-family: var(--serif); font-size: clamp(2rem, 3.5vw, 3.8rem); font-weight: 700; line-height: 1.12; color: var(--fg); letter-spacing: -.01em }
        .s-title em { font-style: italic; font-weight: 400; color: var(--gold) }
        .s-body { font-family: var(--sans); font-size: .95rem; font-weight: 300; line-height: 1.9; color: var(--fg2) }
        .divider { border: none; border-top: 1px solid rgba(255,255,255,.06); margin: 0 }

        /* Problem */
        .problem-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: start }
        .problem-left { position: sticky; top: 8rem }
        .problem-list { margin-top: 5rem; display: flex; flex-direction: column }
        .problem-row { display: grid; grid-template-columns: 2rem 1fr; gap: 1.5rem; padding: 1.8rem 0; border-top: 1px solid rgba(255,255,255,.06) }
        .problem-row:last-child { border-bottom: 1px solid rgba(255,255,255,.06) }
        .problem-x { font-family: var(--sans); font-size: .8rem; color: var(--accent); font-weight: 600; margin-top: .2rem }
        .problem-text { font-family: var(--sans); font-size: 1rem; font-weight: 300; line-height: 1.7; color: var(--fg2) }
        .problem-text strong { color: var(--fg); font-weight: 600; display: block; margin-bottom: .2rem; font-size: 1.05rem }

        /* Image break */
        .img-break { width: 100%; height: 60vh; overflow: hidden; position: relative }
        .img-break img { width: 100%; height: 100%; object-fit: cover; filter: brightness(.55) saturate(.5) }
        .img-break-caption { position: absolute; bottom: 2rem; left: var(--gutter); font-family: var(--sans); font-size: .65rem; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,.35) }

        /* Steps */
        .steps-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; margin-top: 5rem; background: rgba(255,255,255,.06) }
        .step { background: var(--bg); padding: 3.5rem; position: relative }
        .step-num { font-family: var(--serif); font-size: 5rem; font-weight: 700; color: rgba(255,255,255,.04); line-height: 1; position: absolute; top: 2rem; right: 2.5rem; letter-spacing: -.04em }
        .step-label-wrap { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem }
        .step-idx { font-family: var(--sans); font-size: .65rem; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: var(--accent) }
        .step-label { font-family: var(--sans); font-size: .72rem; font-weight: 400; letter-spacing: .12em; text-transform: uppercase; color: var(--fg2) }
        .step-title { font-family: var(--serif); font-size: 1.6rem; font-weight: 700; color: var(--fg); line-height: 1.2; margin-bottom: 1rem }
        .step-body { font-family: var(--sans); font-size: .9rem; font-weight: 300; line-height: 1.85; color: var(--fg2) }

        /* Gallery */
        .gallery { display: grid; grid-template-columns: repeat(6, 1fr); height: 440px; gap: 2px }
        .gallery-cell { overflow: hidden; position: relative }
        .gallery-cell img { width: 100%; height: 100%; object-fit: cover; filter: saturate(.55) brightness(.8); transition: filter .6s, transform .7s cubic-bezier(.2,.7,.2,1) }
        .gallery-cell:hover img { filter: saturate(.9) brightness(.95); transform: scale(1.05) }

        /* Includes */
        .includes-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: start }
        .includes-left { position: sticky; top: 8rem }
        .includes-list { margin-top: 5rem }
        .include-row { display: grid; grid-template-columns: 1.8rem 1fr auto; gap: 1.2rem; align-items: baseline; padding: 1.4rem 0; border-top: 1px solid rgba(255,255,255,.06) }
        .include-row:last-child { border-bottom: 1px solid rgba(255,255,255,.06) }
        .include-idx { font-family: var(--sans); font-size: .62rem; color: var(--fg2); font-weight: 400 }
        .include-info h4 { font-family: var(--sans); font-size: .9rem; font-weight: 400; color: var(--fg); margin-bottom: .3rem; letter-spacing: .02em }
        .include-info p { font-family: var(--sans); font-size: .82rem; font-weight: 300; color: var(--fg2); line-height: 1.6 }
        .include-val { font-family: var(--serif); font-size: 1.3rem; font-weight: 700; color: rgba(255,255,255,.18); text-decoration: line-through; text-decoration-thickness: 2px; white-space: nowrap }

        .price-box { margin-top: 3rem; padding: 2.5rem; border: 1px solid rgba(255,255,255,.08); display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem; flex-wrap: wrap }
        .price-box-left p { font-family: var(--sans); font-size: .7rem; font-weight: 300; color: var(--fg2); letter-spacing: .1em; text-transform: uppercase; margin-bottom: .5rem }
        .price-total-riscado { font-family: var(--sans); font-size: 1.1rem; font-weight: 600; color: var(--fg2); text-decoration: line-through; text-decoration-thickness: 2px; margin-bottom: .3rem }
        .is-light .price-total-riscado { color: var(--l-fg2) }
        .price-big { font-family: var(--serif); font-size: 4rem; font-weight: 700; color: var(--fg); line-height: 1 }
        .price-big span { color: var(--accent) }
        .price-note { font-family: var(--sans); font-size: .72rem; color: var(--fg2); margin-top: .4rem; font-weight: 300 }

        /* Vagas */
        .vagas-wrap { display: flex; flex-direction: column; align-items: flex-start; gap: 1.5rem }
        .vagas-bar { display: flex; gap: 6px }
        .vaga { width: 60px; height: 3px; background: rgba(255,255,255,.08) }
        .vaga.on { background: var(--accent) }
        .vagas-text { font-family: var(--sans); font-size: .82rem; font-weight: 300; color: var(--fg2); line-height: 1.8 }
        .vagas-text strong { color: var(--fg); font-weight: 400 }

        /* Testimonials */
        .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; margin-top: 5rem; background: rgba(255,255,255,.06) }
        .testimonial { background: var(--bg); padding: 3rem }
        .t-quote { font-family: var(--serif); font-size: 3.5rem; color: var(--accent); opacity: .25; line-height: .8; margin-bottom: 1rem }
        .t-text { font-family: var(--serif); font-size: 1rem; font-style: italic; font-weight: 400; line-height: 1.75; color: var(--fg2) }
        .t-author { font-family: var(--sans); font-size: .62rem; font-weight: 400; letter-spacing: .16em; text-transform: uppercase; color: var(--fg2); margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,.06) }

        /* FAQ */
        .faq-wrap { max-width: 760px }
        .faq-item { border-top: 1px solid rgba(255,255,255,.06) }
        .faq-item:last-child { border-bottom: 1px solid rgba(255,255,255,.06) }
        .faq-btn { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 2rem; padding: 1.8rem 0; background: none; border: none; cursor: pointer; text-align: left }
        .faq-q { font-family: var(--sans); font-size: .95rem; font-weight: 300; color: var(--fg); letter-spacing: .02em; line-height: 1.5 }
        .faq-icon { font-family: var(--sans); font-size: 1.4rem; color: var(--fg2); transition: transform .3s; flex-shrink: 0; line-height: 1 }
        .faq-icon.open { transform: rotate(45deg); color: var(--accent) }
        .faq-body { overflow: hidden; max-height: 0; transition: max-height .4s cubic-bezier(.4,0,.2,1) }
        .faq-body.open { max-height: 300px }
        .faq-a { padding-bottom: 1.8rem; font-family: var(--sans); font-size: .88rem; font-weight: 300; line-height: 1.9; color: var(--fg2) }

        /* CTA final */
        .cta-final { background: var(--bg2); border-top: 1px solid rgba(255,255,255,.06); }
        .cta-final-inner { padding: 8rem var(--gutter); display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center; max-width: calc(var(--max) + var(--gutter) * 2); margin: 0 auto }
        .cta-final h2 { font-family: var(--serif); font-size: clamp(2rem, 3.5vw, 3.8rem); font-weight: 700; line-height: 1.12; color: var(--fg); letter-spacing: -.01em }
        .cta-final h2 em { font-style: italic; font-weight: 400; color: var(--gold) }
        .cta-final-right { display: flex; flex-direction: column; gap: 2rem }
        .cta-final-right p { font-family: var(--sans); font-size: .95rem; font-weight: 300; line-height: 1.9; color: var(--fg2) }

        /* Footer */
        footer { border-top: 1px solid rgba(255,255,255,.06); padding: 2.5rem var(--gutter); display: flex; align-items: center; justify-content: space-between; gap: 2rem; flex-wrap: wrap }
        .footer-copy { font-family: var(--sans); font-size: .68rem; font-weight: 300; letter-spacing: .1em; color: var(--fg2) }
        .footer-tagline { font-family: var(--serif); font-size: .72rem; font-style: italic; color: var(--fg2) }

        /* Sticky mobile */
        .sticky { position: fixed; bottom: 0; left: 0; right: 0; z-index: 150; background: var(--accent); padding: 1rem var(--gutter); display: flex; align-items: center; justify-content: space-between; gap: 1rem; transform: translateY(100%); transition: transform .35s cubic-bezier(.2,.7,.2,1) }
        .sticky.show { transform: none }
        .sticky-text { font-family: var(--sans); font-size: .72rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--bg) }
        .sticky-text span { font-weight: 300; opacity: .75 }
        .sticky-btn { font-family: var(--sans); font-size: .68rem; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; background: var(--bg); color: var(--fg); padding: .7rem 1.4rem; text-decoration: none; white-space: nowrap }

        /* Reveal animation */
        .reveal { opacity: 0; transform: translateY(20px); transition: opacity .8s cubic-bezier(.2,.7,.2,1), transform .8s cubic-bezier(.2,.7,.2,1) }
        .reveal.in { opacity: 1; transform: none }
        .reveal-d1 { transition-delay: .08s }
        .reveal-d2 { transition-delay: .16s }
        .reveal-d3 { transition-delay: .24s }
        .reveal-d4 { transition-delay: .32s }

        @media (max-width: 960px) {
          :root { --gutter: 1.5rem }
          .hero { grid-template-columns: 1fr; min-height: auto }
          .hero-left { padding: 8rem var(--gutter) 4rem; border-right: none; border-bottom: 1px solid rgba(255,255,255,.06) }
          .hero-right { height: 55vw }
          .stats { grid-template-columns: 1fr 1fr }
          .stats .stat:nth-child(3) { grid-column: 1 / 3; border-right: none }
          .problem-wrap, .includes-wrap { grid-template-columns: 1fr }
          .problem-left, .includes-left { position: static }
          .problem-list, .includes-list { margin-top: 2.5rem }
          .steps-grid { grid-template-columns: 1fr }
          .gallery { grid-template-columns: repeat(3, 1fr); height: 280px }
          .testimonials-grid { grid-template-columns: 1fr }
          .cta-final-inner { grid-template-columns: 1fr; gap: 3rem; padding: 5rem var(--gutter) }
          footer { flex-direction: column; align-items: flex-start }
        }
        @media (min-width: 961px) { .sticky { display: none } }

        /* WhatsApp FAB */
        .wa-fab { position: fixed; bottom: 2rem; right: 2rem; z-index: 250; width: 56px; height: 56px; border-radius: 50%; background: #25d366; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(0,0,0,.35); text-decoration: none; transition: transform .25s, box-shadow .25s }
        .wa-fab:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(0,0,0,.45) }
        .wa-fab svg { width: 28px; height: 28px; fill: #fff }
      `}</style>

      {/* Progress bar */}
      <div className="progress" style={{ transform: `scaleX(${scrollPct})` }} />

      {/* Nav */}
      <nav>
        <a href="/" className="nav-logo">
          <img src="/logo-cir.svg" alt="CIR Gráfica" style={{ height: 22, filter: 'brightness(0) invert(1)', opacity: .85 }} />
        </a>
        <div className="nav-right">
          <a href="/" className="nav-link">Início</a>
          <a href={WA} target="_blank" rel="noopener noreferrer" className="nav-cta">Agendar consultoria</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-left">
          <p className="hero-tag reveal">CIR Gráfica · Desde 1994</p>
          <h1 className="hero-h1 reveal reveal-d1">
            Evite prejuízos em seus<br /><em>materiais gráficos.</em>
          </h1>
          <p className="hero-sub reveal reveal-d2">
            Consultoria técnica gratuita de 30 minutos para garantir que suas sacolas, caixas e brindes saiam perfeitos na primeira tiragem — sem reimpressão, sem desperdício.
          </p>
          <div className="hero-actions reveal reveal-d3">
            <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btn-fill">Agendar agora</a>
            <a href="#processo" className="btn btn-text">Ver como funciona</a>
          </div>
        </div>
        <div className="hero-right">
          {HERO_SLIDES.map((slide, i) => (
            <img key={i} src={slide.src} alt={slide.alt} className={`hero-slide ${slideIdx === i ? 'active' : ''}`} />
          ))}
          <div className="hero-dots">
            {HERO_SLIDES.map((_, i) => (
              <div key={i} className={`hero-dot ${slideIdx === i ? 'active' : ''}`} onClick={() => setSlideIdx(i)} style={{ cursor: 'pointer' }} />
            ))}
          </div>
          <span className="hero-right-label">Desde 1994</span>
        </div>
      </section>

      {/* Stats */}
      <div className="stats is-light reveal">
        <div className="stat">
          <div className="stat-num">30</div>
          <div className="stat-label">anos protegendo sua produção</div>
        </div>
        <div className="stat">
          <div className="stat-num">+5k</div>
          <div className="stat-label">materiais revisados sem retrabalho</div>
        </div>
        <div className="stat">
          <div className="stat-num">100%</div>
          <div className="stat-label">das consultorias evitaram reimpressão</div>
        </div>
      </div>

      {/* Clients */}
      <div className="clients reveal">
        <p className="clients-label">Empresas que confiam na CIR</p>
        <div className="clients-logos">
          {[
            'https://www.cirgrafica.com.br/wp-content/uploads/2024/09/clientes-cir-grafica-goiania2.jpg',
            'https://www.cirgrafica.com.br/wp-content/uploads/2024/09/Sem-Titulo-2_0002_Camada-4.jpg',
            'https://www.cirgrafica.com.br/wp-content/uploads/2024/09/Sem-Titulo-2_0004_Camada-2.jpg',
            'https://www.cirgrafica.com.br/wp-content/uploads/2024/09/Sem-Titulo-2_0003_Camada-3.jpg',
            'https://www.cirgrafica.com.br/wp-content/uploads/2024/09/Sem-Titulo-2_0001_Camada-5.jpg',
            'https://www.cirgrafica.com.br/wp-content/uploads/2024/09/clientes-cir-grafica-goiania1.jpg',
          ].map((src, i) => (
            <img key={i} src={src} alt="Cliente CIR Gráfica" />
          ))}
        </div>
      </div>

      {/* Problem */}
      <div className="section">
        <div className="problem-wrap">
          <div className="problem-left">
            <p className="s-tag reveal">O problema</p>
            <h2 className="s-title reveal reveal-d1">Você já sentiu o frio na barriga ao ver um lote chegar <em>com erro?</em></h2>
            <p className="s-body reveal reveal-d2" style={{ marginTop: '1.5rem', maxWidth: 360 }}>
              O erro gráfico não avisa. Ele acontece quando faca, gramatura, cor ou acabamento não foram especificados corretamente — e o prejuízo só aparece com o lote na mão.
            </p>
          </div>
          <ul className="problem-list reveal reveal-d1">
            {[
              ['Faca de corte errada', 'Caixa sai torta, inútil para venda'],
              ['Papel sem gramatura adequada', 'Quebra no acabamento — perda total do lote'],
              ['Prova que não bate com a máquina', 'Cor diferente do aprovado, reimpressão cara'],
              ['Acabamento mal especificado', 'Relevo fraco, hot stamping irregular, verniz inadequado'],
              ['Atraso crítico na entrega', 'Campanha atrasa, você perde vendas e paga reimpressão'],
            ].map(([title, sub], i) => (
              <li key={i} className="problem-row">
                <span className="problem-x">✕</span>
                <span className="problem-text"><strong>{title}</strong> — {sub}</span>
              </li>
            ))}
          </ul>
          <p className="s-body reveal" style={{ marginTop: '2.5rem', maxWidth: 400, borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: '2rem' }}>
            O resultado? Você perde o investimento inteiro. Atrasa sua campanha de marketing. Ainda precisa pagar pela reimpressão. <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>É um ciclo de desperdício que drena o orçamento de qualquer empresa.</strong>
          </p>
        </div>
      </div>

      <hr className="divider" />

      {/* Posicionamento */}
      <div className="section">
        <div className="problem-wrap">
          <div className="problem-left">
            <p className="s-tag reveal">Nossa diferença</p>
            <h2 className="s-title reveal reveal-d1">Não somos vendedores de papel. <em>Somos especialistas técnicos.</em></h2>
          </div>
          <div className="problem-list reveal reveal-d1" style={{ marginTop: '0' }}>
            {[
              ['Gramatura e tipo de papel', 'qual aguenta seu acabamento sem quebrar'],
              ['Facas de corte e dobra', 'para que a caixa saia perfeita, sem torção'],
              ['Processos de impressão', 'como a cor vai ficar na máquina, não só na tela'],
              ['Acabamentos especiais', 'relevo, hot stamping, verniz localizado — aplicados certo'],
              ['Variáveis de produção', 'temperatura, umidade e velocidade que afetam o resultado'],
            ].map(([title, sub], i) => (
              <li key={i} className="problem-row">
                <span className="problem-x" style={{ color: 'var(--gold)' }}>→</span>
                <span className="problem-text"><strong>{title}</strong> — {sub}</span>
              </li>
            ))}
            <p className="s-body" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,.06)' }}>
              Analisamos seu projeto <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>antes de ir para a máquina</strong> — garantindo que o que você aprovou no computador seja exatamente o que chegará na sua mesa.
            </p>
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* Image break */}
      <div className="img-break reveal">
        <img src="/conceituais/materiais-graficos-impressao28.jpeg" alt="" />
        <span className="img-break-caption">Produção própria · Goiânia, GO</span>
      </div>

      {/* Process */}
      <div id="processo" className="section is-light">
        <p className="s-tag reveal">Como funciona</p>
        <h2 className="s-title reveal reveal-d1">4 etapas. <em>Zero surpresa.</em></h2>
        <div className="steps-grid">
          {STEPS.map((s, i) => (
            <div key={i} className={`step reveal reveal-d${i % 3 + 1}`}>
              <span className="step-num">{s.num}</span>
              <div className="step-label-wrap">
                <span className="step-idx">{s.num}</span>
                <span className="step-label">{s.label}</span>
              </div>
              <p className="step-body">{s.body}</p>
            </div>
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* Gallery */}
      <div className="gallery reveal">
        {GALLERY.map((src, i) => (
          <div key={i} className="gallery-cell">
            <img src={src} alt="" />
          </div>
        ))}
      </div>

      <hr className="divider" />

      {/* What's included */}
      <div className="section is-light">
        <div className="includes-wrap">
          <div className="includes-left">
            <p className="s-tag reveal">O que está incluído</p>
            <h2 className="s-title reveal reveal-d1">Tudo que você recebe <em>em 30 minutos.</em></h2>
            <div className="price-box reveal reveal-d2">
              <div className="price-box-left">
                <p>Valor desta consultoria</p>
                <div className="price-total-riscado">R$ 900</div>
                <div className="price-big">Grátis<span>.</span></div>
                <p className="price-note">Vagas limitadas por mês</p>
              </div>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btn-fill">Agendar agora</a>
            </div>
          </div>
          <div className="includes-list">
            {[
              { title: 'Análise técnica do arquivo', desc: 'Verificamos sangria, fechamento, cores CMYK, resolução de imagens.', val: 'R$ 300' },
              { title: 'Seleção do material ideal', desc: 'Indicamos papel, gramatura e acabamento sem perder qualidade.', val: 'R$ 250' },
              { title: 'Checklist de acabamentos especiais', desc: 'Relevo, hot stamping, verniz localizado — o que valoriza sua marca.', val: 'R$ 200' },
              { title: 'Plano técnico pronto para produção', desc: 'Especificações, orçamento otimizado e próximos passos em documento claro.', val: 'R$ 150' },
            ].map((item, i) => (
              <div key={i} className={`include-row reveal reveal-d${i % 3 + 1}`}>
                <span className="include-idx">0{i + 1}</span>
                <div className="include-info">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
                <span className="include-val">{item.val}</span>
              </div>
            ))}

            {/* Vagas */}
            <div className="vagas-wrap reveal" style={{ marginTop: '3rem' }}>
              <div className="vagas-bar">
                {Array.from({ length: VAGAS_TOTAL }).map((_, i) => (
                  <div key={i} className={`vaga ${i < VAGAS_OCUPADAS ? 'on' : ''}`} />
                ))}
              </div>
              <p className="vagas-text">
                <strong>{VAGAS_OCUPADAS} de {VAGAS_TOTAL} vagas</strong> ocupadas este mês.<br />
                Restam {VAGAS_TOTAL - VAGAS_OCUPADAS} consultorias disponíveis.
              </p>
            </div>
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* Testimonials */}
      <div className="section">
        <p className="s-tag reveal">Depoimentos</p>
        <h2 className="s-title reveal reveal-d1">Empresas que <em>zeraram o retrabalho.</em></h2>
        <div className="testimonials-grid">
          {[
            { text: 'Antes de trabalhar com a CIR, perdemos um lote inteiro de caixas por erro de dobra. Custou R$ 8.000 em reimpressão. Depois da consultoria técnica, entendemos exatamente como especificar nossos projetos. Hoje nossa produção é impecável.', author: 'João S. — Gerente de Marketing, Cosméticos Premium' },
            { text: 'A CIR nos ajudou a entender que o papel errado era o motivo dos nossos brindes chegarem amassados. Zeramos as reclamações e eliminamos o retrabalho.', author: 'Fernanda O. — Diretora de Operações, Eventos Prime' },
            { text: 'Sempre achei que especificação técnica era coisa de designer. A CIR mostrou que é decisão de negócio. Nosso orçamento de embalagem caiu 20% sem perder qualidade.', author: 'Ricardo M. — CEO, Artesanal Co.' },
          ].map((t, i) => (
            <div key={i} className={`testimonial reveal reveal-d${i + 1}`}>
              <div className="t-quote">"</div>
              <p className="t-text">{t.text}</p>
              <div className="t-author">{t.author}</div>
            </div>
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* FAQ */}
      <div className="section is-light">
        <p className="s-tag reveal">Dúvidas frequentes</p>
        <h2 className="s-title reveal reveal-d1" style={{ marginBottom: '4rem' }}>Perguntas <em>comuns.</em></h2>
        <div className="faq-wrap">
          {FAQS.map((faq, i) => (
            <div key={i} className="faq-item reveal">
              <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="faq-q">{faq.q}</span>
                <span className={`faq-icon ${openFaq === i ? 'open' : ''}`}>+</span>
              </button>
              <div className={`faq-body ${openFaq === i ? 'open' : ''}`}>
                <p className="faq-a">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="cta-final">
        <div className="cta-final-inner">
          <h2 className="reveal">Restam {VAGAS_TOTAL - VAGAS_OCUPADAS} vagas <em>este mês.</em></h2>
          <div className="cta-final-right reveal reveal-d1">
            <p>Consultoria técnica gratuita — 30 min online. Analisamos arquivo, material e acabamento antes de ir para a máquina. Sem compromisso, sem custo.</p>
            <div>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btn-fill">Garantir minha vaga</a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <img src="/logo-cir.svg" alt="CIR Gráfica" style={{ height: 16, filter: 'brightness(0) invert(1)', opacity: .5 }} />
        <span className="footer-copy">Goiânia, GO — (62) 3202-1150 — cirgrafica.com.br</span>
        <span className="footer-copy" style={{ opacity: .4, fontSize: '.75rem' }}>CNPJ 00.000.000/0001-00 · CIR Gráfica e Editora Ltda.</span>
        <span className="footer-tagline">Qualidade para ser sentida.</span>
      </footer>

      {/* WhatsApp FAB */}
      <a href={WA} target="_blank" rel="noopener noreferrer" className="wa-fab" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Sticky mobile */}
      <div className={`sticky ${stickyVisible ? 'show' : ''}`}>
        <div className="sticky-text">
          Consultoria gratuita <span>· {VAGAS_TOTAL - VAGAS_OCUPADAS} vagas disponíveis</span>
        </div>
        <a href={WA} target="_blank" rel="noopener noreferrer" className="sticky-btn">Agendar</a>
      </div>
    </>
  )
}
