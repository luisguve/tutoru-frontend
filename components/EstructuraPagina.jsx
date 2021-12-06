import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import styles from '../styles/Estructura.module.css'

import Footer from "./Footer"
import Header from "./header"

export default function EstructuraPagina(props) {
  const {
    children,
    isHome,
    breadCrumb,
    navItems,
    titulo,
    subtitulo,
    header,
    esReproduccionCurso
  } = props
  let containerClassname = styles.container
  if (esReproduccionCurso) {
    containerClassname += ` ${styles["container-rep"]}`
  } else {
    containerClassname += " px-2"
  }
  return (
    <div className="min-vh-100 d-flex flex-column justify-content-between">
      <div className="contenido">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Learn how to build a personal website using Next.js"
          />
          <meta name="og:title" content={header} />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <Header isHome={isHome} navItems={navItems} titulo={titulo} header={header} subtitulo={subtitulo} />
        <div className="container-lg px-0 px-md-2">
          <Breadcrumb isHome={isHome} elements={breadCrumb} />
          <main className={containerClassname}>
            {children}
          </main>
        </div>
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
      <div className="mt-3 mt-md-5">
        {links}
      </div>
    )
  }
  if (!isHome) {
    return (
      <div className="mt-3 mt-md-5 px-2 px-md-0">
        <Link href="/">
          <a>← Inicio</a>
        </Link>
      </div>
    )
  }
  return null
}