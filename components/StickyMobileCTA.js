import { useEffect, useState } from 'react'
import WhatsAppLink from './WhatsAppLink'

export default function StickyMobileCTA({ cidade, estado }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className={`smc-bar ${visible ? 'smc-bar--visible' : ''}`}>
        <span className="smc-text">Orçamento grátis em {cidade}</span>
        <WhatsAppLink
          message={`Olá! Gostaria de um orçamento para meu projeto de gráfica em ${cidade}.`}
          source="sticky_mobile"
          cidade={cidade}
          estado={estado}
          className="smc-btn"
        >
          Falar no WhatsApp
        </WhatsAppLink>
      </div>

      <style jsx global>{`
        .smc-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 240;
          display: none;
          align-items: center;
          justify-content: space-between;
          gap: .8rem;
          padding: .85rem 1.2rem;
          background: var(--cir-accent);
          transform: translateY(100%);
          transition: transform .3s cubic-bezier(.2,.7,.2,1);
        }
        .smc-bar--visible { transform: translateY(0) }
        .smc-text {
          font-family: var(--cir-sans);
          font-size: .72rem;
          font-weight: 600;
          letter-spacing: .02em;
          color: #fff;
          line-height: 1.3;
        }
        .smc-btn {
          font-family: var(--cir-sans);
          font-size: .68rem;
          font-weight: 600;
          letter-spacing: .08em;
          text-transform: uppercase;
          white-space: nowrap;
          background: #fff;
          color: var(--cir-accent);
          padding: .6rem 1rem;
          text-decoration: none;
          border-radius: 2px;
        }
        @media (max-width: 768px) {
          .smc-bar { display: flex }
        }
      `}</style>
    </>
  )
}
