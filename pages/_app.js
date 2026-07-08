import '../styles/globals.css'
import '../styles/cir-ds.css'
import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { WhatsAppModalProvider } from '../components/WhatsAppModalProvider'
import { captureUtms } from '../lib/utm'

function initReveal() {
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) }
    }),
    { threshold: 0.08 }
  )
  document.querySelectorAll('.cir-reveal').forEach(el => obs.observe(el))
  return obs
}

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    captureUtms()
    let obs = initReveal()
    const onRouteChange = () => { captureUtms(); obs.disconnect(); obs = initReveal() }
    router.events.on('routeChangeComplete', onRouteChange)
    return () => { obs.disconnect(); router.events.off('routeChangeComplete', onRouteChange) }
  }, [router.events])

  return (
    <>
      <Head>
        <meta name="google-site-verification" content="ip0QC2xuodmc80u5Y291yiARaLWbF_-b9lWVHlrowFw" />
      </Head>
      <WhatsAppModalProvider>
        <Component {...pageProps} />
      </WhatsAppModalProvider>
    </>
  )
}
