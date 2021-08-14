import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import utilStyles from '../styles/utils.module.css'
import styles from '../styles/Estructura.module.css'

import Footer from "./Footer"
import Header from "./header"

import { titulo } from "../lib/metadata"

export default function Layout({ children, isHome, categoria, navItems }) {
  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            titulo
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={titulo} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Header isHome={isHome} navItems={navItems} />
      <main className={styles.container}>
        <Breadcrumb isHome={isHome} categoria={categoria} />
        {children}
      </main>
      <Footer />
    </div>
  )
}

const Breadcrumb = ({categoria, isHome}) => {
  if (categoria) {
    return (
      <div className={styles.backToHome}>
        <Link href={`/${categoria.Titulo_url}`}>
          <a>← Volver a {categoria.Titulo_normal}</a>
        </Link>
      </div>
    )
  }
  if (!isHome) {
    return (
      <div className={styles.backToHome}>
        <Link href="/">
          <a>← Inicio</a>
        </Link>
      </div>
    )
  }
  return null
}