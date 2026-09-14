import { useEffect, useRef, useState } from 'react'

// Últimos posts do @cirgrafica no Instagram — atualizado manualmente a
// partir do HTML da página do perfil (as URLs de imagem do CDN do Instagram
// expiram em poucos dias, então isto precisa ser atualizado com alguma
// frequência; ver README de manutenção abaixo do componente).
const POSTS = [
  {
    href: 'https://www.instagram.com/cirgrafica/p/DcCFwhpIIyV/',
    img: 'https://instagram.fgyn3-1.fna.fbcdn.net/v/t51.82787-15/774282113_18332092945256660_5892179650226442345_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=101&ig_cache_key=Mzk2Mzc1NTY0MzQ3NDAyNjA5OA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuNzIwLnNkci5yZWd1bGFyX3Bob3RvLkMzIn0%3D&_nc_ohc=IJGlCeEQanAQ7kNvwGRT3vT&_nc_oc=AdpEZyaFsMgsMyquQxOqygRJbf4gJ0PbCkdUtuCZ6zze27BJ_XiDas0teEFpIkCIQOHIildE59Ti0YK-H-2s4W0N&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fgyn3-1.fna&_nc_gid=RiR1GP7iQshR_VP4POADYQ&_nc_ss=7a22e&oh=00_AQJhAFprcEt1Hj0ogC9Fh9iM70hyIav5hAh484yq-u1oHg&oe=6AACD326',
    alt: 'Post da Cirgráfica no Instagram, 14 de agosto de 2026',
  },
  {
    href: 'https://www.instagram.com/cirgrafica/p/DalThTmIE_s/',
    img: 'https://instagram.fgyn3-1.fna.fbcdn.net/v/t51.82787-15/742396044_18327168610256660_4729603735285996151_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=MzkzNzYzODA3NDYyNzQzMjg4NQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTYwMC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=RsechiiAbdEQ7kNvwF6kKrO&_nc_oc=AdouYKrp4NlxTG6bKydabrYrCA8davDdzkMcjwYgqYyLJvlqfjqy5M_v5S5BBrKntrgKQNJmVlmu-2-wSAY1oBxm&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fgyn3-1.fna&_nc_gid=RiR1GP7iQshR_VP4POADYQ&_nc_ss=7a22e&oh=00_AQKnGvK6k2TtGEE97jUIH8Am9EVSQU8x1TTh5Us_4eM0Lg&oe=6AACEF68',
    alt: 'Post da Cirgráfica no Instagram, 9 de julho de 2026',
  },
  {
    href: 'https://www.instagram.com/cirgrafica/p/DaSuSp0nF3f/',
    img: 'https://instagram.fgyn3-1.fna.fbcdn.net/v/t51.82787-15/730598571_18326197702256660_8789029608805133253_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=106&ig_cache_key=MzkzMjQwNDUzMzgyNDEzODY2MA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTIxMC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=h2glmNSqho4Q7kNvwG1SC13&_nc_oc=AdqN1V2sxJcIQtcTNROAdUtopJDMYGVTP1ZEjVZWymoZFPAhkaeZLy_jJyyLzanxAT-VSzipOIIvujisqbap8Qi6&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fgyn3-1.fna&_nc_gid=RiR1GP7iQshR_VP4POADYQ&_nc_ss=7a22e&oh=00_AQKV_1JlYnM3Eaif40JjXsGKvRsTj4bC39quvVyIQvriFA&oe=6AAD0772',
    alt: 'Post da Cirgráfica no Instagram, 2 de julho de 2026',
  },
  {
    href: 'https://www.instagram.com/cirgrafica/p/DZ-NjHgnAFF/',
    img: 'https://instagram.fgyn3-1.fna.fbcdn.net/v/t51.82787-15/730339406_18325086136256660_2114714581876536170_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=108&ig_cache_key=MzkyNjYzNTE2MDk1NDA4NTk3Nw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTA4MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=vR_zKJv7I2cQ7kNvwEY6Wgc&_nc_oc=Adou_EYKBGfV3XE77sH3zhtX3u7hF1-AdffKzoDdZ7vFD_mK7nlQ5FmUiB8Jn5FsCMNZABW8JhINtH2XTyoCPDpg&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fgyn3-1.fna&_nc_gid=RiR1GP7iQshR_VP4POADYQ&_nc_ss=7a22e&oh=00_AQJOJf6JDWq1zicL-_HXQX-1D_NKLEV3Lm4mEVfw3r7amA&oe=6AACD0EB',
    alt: 'Post da Cirgráfica no Instagram, 24 de junho de 2026',
  },
  {
    href: 'https://www.instagram.com/cirgrafica/reel/DZncJvCOYs1/',
    img: 'https://instagram.fgyn3-1.fna.fbcdn.net/v/t51.71878-15/723110754_1602222255241701_8474063476320333109_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=101&ig_cache_key=MzkyMDIyNTgxNDkzMDA5ODk5NzEyNzc1OTUyNDc4NzMzNjk%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNMSVBTLnhwaWRzLjY0MC5zZHIudmlkZW9fbmZyYW1lX2NvdmVyX2ZyYW1lLkMzIn0%3D&_nc_ohc=30f5G_67JXAQ7kNvwHVrpTw&_nc_oc=AdoeDVhlpuZhcMqmLkfsc-tEnIfdn40XRq2SlC9MU5zce81asaQWqGxsyJ4bZtarQJvcoD2xVM3r6RJGPUlGlTgb&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fgyn3-1.fna&_nc_gid=RiR1GP7iQshR_VP4POADYQ&_nc_ss=7a22e&oh=00_AQJVCiXsfgwlD6giq2e4Z_jQqZDLYERVGvSL6BJqNMQjpg&oe=6AAD06C4',
    alt: 'Reel da Cirgráfica no Instagram — experiência de unboxing',
    isReel: true,
  },
  {
    href: 'https://www.instagram.com/cirgrafica/p/DZYHduIoLNA/',
    img: 'https://instagram.fgyn3-1.fna.fbcdn.net/v/t51.82787-15/720623676_18323160961256660_5560753076212862234_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=103&ig_cache_key=MzkxNTkxMTg1MjU5MzEzNDM3OQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuNzIwLnNkci52aWRlb19kZWZhdWx0X2NvdmVyX2ZyYW1lLkMzIn0%3D&_nc_ohc=yUOiRY22MZMQ7kNvwFZbk79&_nc_oc=AdqQREYb1F7clMiN_l3_jwTTLr5NqfbtVidLYjHpkJXwkk0pWbxPC-ObG3p_Jx8LxFhbIIK-Sm5aH1Z8uSG8t8jH&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fgyn3-1.fna&_nc_gid=RiR1GP7iQshR_VP4POADYQ&_nc_ss=7a22e&oh=00_AQJRMv56KGJtHNgu_K1fGxhI2rNEl4ec_KRp49V7iYTo2A&oe=6AACE28D',
    alt: 'Post da Cirgráfica no Instagram — envelope com verniz local',
  },
  {
    href: 'https://www.instagram.com/cirgrafica/reel/DZGIRhtOwmD/',
    img: 'https://instagram.fgyn3-1.fna.fbcdn.net/v/t51.71878-15/713624313_1727152655372452_9061313609704231740_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=111&ig_cache_key=MzkxMDg0OTcxNTIxMzM3MTc3OTE2NjgwNDk3Mjc3Njk4NDc%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNMSVBTLnhwaWRzLjY0MC5zZHIudmlkZW9fbmZyYW1lX2NvdmVyX2ZyYW1lLkMzIn0%3D&_nc_ohc=OyLTqOv3_iIQ7kNvwG9efCy&_nc_oc=Ados2NsU22VXhIPDo7xn_gOvX15tdtDJVmT2L5XN4KyEmWZLn_fR26lnkWTUqbHVwaCT83bXKLiUnaVAh9mrGUp7&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fgyn3-1.fna&_nc_gid=RiR1GP7iQshR_VP4POADYQ&_nc_ss=7a22e&oh=00_AQKXkbZ1oczrzKXmXJeiIkS6qgsCXUVAuE4x13drYEyG3w&oe=6AAD077D',
    alt: 'Reel da Cirgráfica no Instagram — embalagens e unboxing',
    isReel: true,
  },
  {
    href: 'https://www.instagram.com/cirgrafica/reel/DYfhgPnOTNv/',
    img: 'https://instagram.fgyn3-1.fna.fbcdn.net/v/t51.71878-15/701385541_1624252888880072_3782019925280115921_n.jpg?stp=dst-jpegr_e15_tt6&_nc_cat=102&ig_cache_key=Mzg5OTk4MzE1MzY0ODQ0ODM2NzIxNDMwMDQxMDI5MzY5MzM%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNMSVBTLnhwaWRzLjY0MC5oZHIudmlkZW9fbmZyYW1lX2NvdmVyX2ZyYW1lLkMzIn0%3D&_nc_ohc=N8mNK5vTVi4Q7kNvwESnrkj&_nc_oc=AdoUfiDwc4b03GxLBhQqKBPZAW6Xc-T2L4RmGEbcWljamBV863xnVbLIZuI4SRACDilr83vgsk5nnXeDNZHK7_cb&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=instagram.fgyn3-1.fna&_nc_gid=RiR1GP7iQshR_VP4POADYQ&_nc_ss=7a22e&oh=00_AQJlMHocdre-FCI4UO_qX5V1DHchr0L5o2iPePP75wdHwg&oe=6AACFFD2',
    alt: 'Reel da Cirgráfica no Instagram — acabamento em hot stamping',
    isReel: true,
  },
  {
    href: 'https://www.instagram.com/cirgrafica/p/DYXskiQkTqt/',
    img: 'https://instagram.fgyn3-1.fna.fbcdn.net/v/t39.30808-6/696735097_122259951260575857_675025410436113852_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=100&ig_cache_key=Mzg5Nzc4MDAxMzQ3OTU5NzU0OA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMjA0OC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=5U-KXeav2NMQ7kNvwHgdv4s&_nc_oc=AdqlHTv_2DbpoKHIn3pQKDmlIE1mAZ71p2NZJ_-vfp1z2ZN5WRFSmB2Ny0Eu452vG-UTpyZlbTAlzWbJqme6TD_l&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fgyn3-1.fna&_nc_gid=RiR1GP7iQshR_VP4POADYQ&_nc_ss=7a22e&oh=00_AQI_eT8ijSxTNrV6IeEO9odL687wCHR7RmGzTMryCjmcqA&oe=6AAD02A4',
    alt: 'Post da Cirgráfica no Instagram, 15 de maio de 2026',
  },
  {
    href: 'https://www.instagram.com/cirgrafica/reel/DYNfLLBOjV7/',
    img: 'https://instagram.fgyn3-1.fna.fbcdn.net/v/t51.71878-15/689464909_1898913330801540_4892127593074824340_n.jpg?stp=dst-jpegr_e15_tt6&_nc_cat=103&ig_cache_key=Mzg5NDkwNjM1OTkzMzE4NzQ1MTE5MjAyMDU2MzE5NjkxMTc%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNMSVBTLnhwaWRzLjY0MC5oZHIudmlkZW9fbmZyYW1lX2NvdmVyX2ZyYW1lLkMzIn0%3D&_nc_ohc=j5Ns_1eM7o0Q7kNvwFG__SP&_nc_oc=AdqTQeoF-KjKfZvG86Hrs4wJUbC1khkUka6aM64EP41-BaO3f2j7keYC6htZxgMOE0u0yJatwLZ-PcYtVsacl_8f&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=instagram.fgyn3-1.fna&_nc_gid=RiR1GP7iQshR_VP4POADYQ&_nc_ss=7a22e&oh=00_AQI-zXSC4Iz9s5KI4Y_viVMkRCF7cFq6uPDd5qNM4sKxpw&oe=6AACEE0A',
    alt: 'Reel da Cirgráfica no Instagram — produção em alta escala',
    isReel: true,
  },
  {
    href: 'https://www.instagram.com/cirgrafica/p/DYFx8AIkxTp/',
    img: 'https://instagram.fgyn3-1.fna.fbcdn.net/v/t39.30808-6/691921158_122259414848575857_7638821634420475900_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=106&ig_cache_key=Mzg5MjczNzA2MjI2OTU3NTk5NA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMjA0OC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=0M6edVfdSPwQ7kNvwGFRu8W&_nc_oc=AdqhPWri5NBosTGevne6Xdq5uXWprZ9qhSLVkLiCWMV79kWJA2f1TplyBW5zzomKb8K0kzrrdff1qti-YBAeYu3_&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fgyn3-1.fna&_nc_gid=RiR1GP7iQshR_VP4POADYQ&_nc_ss=7a22e&oh=00_AQKR_pOq-fhMSYOcqFudLGdpXgvTkPHG6VvR-B8NkXVeCA&oe=6AACD5FD',
    alt: 'Post da Cirgráfica no Instagram, 8 de maio de 2026',
  },
  {
    href: 'https://www.instagram.com/cirgrafica/p/DYAoVCAjI7M/',
    img: 'https://instagram.fgyn3-1.fna.fbcdn.net/v/t39.30808-6/687027038_122259121580575857_515974378051723377_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=100&ig_cache_key=Mzg5MTI4NzQyNjA0ODIwMjcxMw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTM2NS5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=LzYED-SwKoEQ7kNvwFmZ3ya&_nc_oc=AdrtMax2nvJvEB1jdDQ9F_PcTfNhrRNHXWcmN-gCtMDV_YNLNEoi19IXjWKL8ThPi-zgnamAZkKANyXNXDr75JBj&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fgyn3-1.fna&_nc_gid=hILjlLJfFoHvkdrBlIzqPw&_nc_ss=7a22e&oh=00_AQJReh_1XdUvhs_jyFga96IexslB3AfSYhubya_6QbfP8A&oe=6AACFFEE',
    alt: 'Post da Cirgráfica no Instagram, 6 de maio de 2026',
  },
]

// Carrossel de fundo escuro que reaproveita o mesmo padrão de rolagem
// automática do ClientLogos.js (auto-scroll, pausa no hover/toque, setas,
// volta ao início) — só troca o conteúdo do card (foto de post + ícone de
// link do Instagram) e o alvo do clique (abre o post real, não interno).
export default function InstagramFeed({ title = 'Últimas postagens no Instagram', handle = '@cirgrafica' }) {
  const track = useRef(null)
  const [paused, setPaused] = useState(false)

  const scrollByCard = (dir) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('.ig-card')
    const gap = 16
    const step = card ? card.offsetWidth + gap : 220

    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    if (dir > 0 && atEnd) {
      el.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      el.scrollBy({ left: dir * step, behavior: 'smooth' })
    }
  }

  // Continuous, gentle auto-scroll (a slow drift, not a snap-per-card jump
  // like the arrows use) — rAF-driven so it stays smooth regardless of
  // frame rate, pauses on hover/touch, and loops back to the start smoothly
  // once it reaches the end.
  useEffect(() => {
    if (paused) return
    const el = track.current
    if (!el) return

    const PIXELS_PER_SECOND = 28
    let raf
    let last = performance.now()

    const tick = (now) => {
      const dt = (now - last) / 1000
      last = now
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
      if (atEnd) {
        el.scrollLeft = 0
      } else {
        el.scrollLeft += PIXELS_PER_SECOND * dt
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [paused])

  return (
    <div
      className="cir-section ig-section"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <span className="cir-s-tag">Instagram</span>
      <div className="ig-head">
        <h2 className="cp-h2">{title}</h2>
        <a
          href={`https://www.instagram.com/${handle.replace('@', '')}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="ig-handle-link"
        >
          {handle}
        </a>
      </div>

      <div className="ig-carousel">
        <div className="ig-track" ref={track}>
          {POSTS.map((p, i) => (
            <div
              key={p.href}
              className="ig-card cir-reveal"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <img src={p.img} alt={p.alt} loading="lazy" />
              <span className="ig-badge" aria-hidden="true">
                {p.isReel ? (
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.942 7.464c-.062-1.36-.306-2.143-.511-2.671a5.366 5.366 0 0 0-1.272-1.952 5.364 5.364 0 0 0-1.951-1.27c-.53-.207-1.312-.45-2.673-.513-1.2-.054-1.557-.066-4.535-.066s-3.336.012-4.536.066c-1.36.062-2.143.306-2.672.511-.769.3-1.371.692-1.951 1.272s-.973 1.182-1.27 1.951c-.207.53-.45 1.312-.513 2.673C1.004 8.665.992 9.022.992 12s.012 3.336.066 4.536c.062 1.36.306 2.143.511 2.671.298.77.69 1.373 1.272 1.952.58.581 1.182.974 1.951 1.27.53.207 1.311.45 2.673.513 1.199.054 1.557.066 4.535.066s3.336-.012 4.536-.066c1.36-.062 2.143-.306 2.671-.511a5.368 5.368 0 0 0 1.953-1.273c.58-.58.972-1.181 1.27-1.95.206-.53.45-1.312.512-2.673.054-1.2.066-1.557.066-4.535s-.012-3.336-.066-4.536Zm-7.085 6.055-5.25 3c-1.167.667-2.619-.175-2.619-1.519V9c0-1.344 1.452-2.186 2.619-1.52l5.25 3c1.175.672 1.175 2.368 0 3.04Z" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><path d="M17.5 6.5h.01" /></svg>
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="ig-nav">
          <button type="button" className="ig-arrow" onClick={() => scrollByCard(-1)} aria-label="Anterior">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button type="button" className="ig-arrow" onClick={() => scrollByCard(1)} aria-label="Próximo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <style jsx global>{`
        .ig-section { padding-top: 4rem; padding-bottom: 4rem }
        .ig-head { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; flex-wrap: wrap }
        .ig-handle-link { font-family: var(--cir-sans); font-size: .82rem; color: var(--cir-accent); text-decoration: none; border-bottom: 1px solid transparent; transition: border-color .2s }
        .ig-handle-link:hover { border-color: var(--cir-accent) }
        .ig-carousel { position: relative; margin-top: 3rem }
        .ig-track {
          display: flex; gap: 1rem; overflow-x: auto;
          scrollbar-width: none; -ms-overflow-style: none; padding-bottom: .5rem;
        }
        .ig-track::-webkit-scrollbar { display: none }
        .ig-card {
          position: relative; flex: 0 0 calc(20% - .8rem);
          aspect-ratio: 4 / 5; overflow: hidden; display: block; background: #111;
          transition: transform .3s;
        }
        .ig-card:hover { transform: translateY(-3px) }
        .ig-card img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .4s }
        .ig-card:hover img { transform: scale(1.04) }
        .ig-badge {
          position: absolute; top: .6rem; right: .6rem; width: 26px; height: 26px;
          display: flex; align-items: center; justify-content: center; color: #fff;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,.5));
        }
        .ig-badge svg { width: 18px; height: 18px }
        .ig-nav { display: flex; justify-content: flex-end; gap: .5rem; margin-top: 1rem }
        .ig-arrow {
          width: 38px; height: 38px; border: 1px solid rgba(255,255,255,.2); background: transparent;
          color: rgba(255,255,255,.7); cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: border-color .2s, color .2s; padding: 0;
        }
        .ig-arrow:hover { border-color: var(--cir-accent); color: var(--cir-accent) }
        .ig-arrow svg { width: 14px; height: 14px }
        @media (max-width: 900px) {
          .ig-card { flex: 0 0 calc(33.333% - .67rem) }
        }
        @media (max-width: 640px) {
          .ig-card { flex: 0 0 calc(58% - .6rem) }
          .ig-track { gap: .8rem }
        }
      `}</style>
    </div>
  )
}

// ── Manutenção ──────────────────────────────────────────────────────────
// As URLs de imagem acima vêm direto do CDN do Instagram (cdninstagram.com)
// e expiram — geralmente em poucos dias. Quando as fotos começarem a
// quebrar no site, repetir o processo:
// 1. Abrir instagram.com/cirgrafica no navegador (logado ou não)
// 2. Copiar o HTML da grade de posts (Inspecionar elemento > copiar o
//    contêiner que lista os posts)
// 3. Extrair os pares href (link do post) + src (URL da imagem) de cada
//    <a>...<img> do grid, ignorando posts de outras contas que só marcam
//    @cirgrafica
// 4. Atualizar o array POSTS acima com os novos pares
