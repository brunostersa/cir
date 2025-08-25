import '../styles/globals.css'
import Head from 'next/head'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="google-site-verification" content="ip0QC2xuodmc80u5Y291yiARaLWbF_-b9lWVHlrowFw" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}