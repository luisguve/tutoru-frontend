import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import utilStyles from '../styles/utils.module.css'
import styles from '../styles/Estructura.module.css'

import Footer from "./Footer"
import Header from "./header"

import { titulo } from "../lib/metadata"

export default function Layout({ children, isHome, breadCrumb, navItems }) {
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
      <div className="container-lg">
        <Breadcrumb isHome={isHome} elements={breadCrumb} />
        <main className={styles.container}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}

const Breadcrumb = ({elements, isHome}) => {
  if (elements) {
    const links = elements.map((e, i) => {
      return (
        <span key={e.url + e.name}>
          {
            i < elements.length - 1 ?
            <Link href={e.url}>
              <a>{e.name}</a>
            </Link>
            :
            <strong>{e.name}</strong>
          }
          <span className="mx-1">{ i < elements.length - 1 && "»" }</span>
        </span>
      )
    })
    return (
      <div className={styles.backToHome}>
        {links}
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