import Head from 'next/head'
import Link from "next/link"

import EstructuraPagina from '../components/EstructuraPagina'
import utilStyles from '../styles/utils.module.css'
import { getCategorias } from "../lib/contenidos"
import { titulo, cargarNavItems } from "../lib/metadata"

export async function getStaticProps() {
  const portadas = await getCategorias()
  const navItems = await cargarNavItems()
  return {
    props: {
      portadas,
      navItems
    }
  }
}

export default function Home({ portadas, navItems }) {
  const listaPortadas = portadas.map((datos) => {
    const {
      Titulo_url,
      Titulo_normal,
      thumbnail,
      ejercicios
    } = datos
    const listaEjercicios = ejercicios.planteamientos.map(p => {
      return (
        <div key={p.slug}>
          <Link href={`/${Titulo_url}/${p.slug}`}>
            <a>
              <h5>{p.titulo}</h5>
            </a>
          </Link>
          <div dangerouslySetInnerHTML={{ __html: p.descripcion_corta}}></div>
        </div>
      )
    })
    return (
      <li className={utilStyles.listItem} key={Titulo_url}>
        <div>
          <Link href={`/${Titulo_url}`}>
            <a>
              <h3>{Titulo_normal} ({ejercicios.q} ejercicios)</h3>
              <img src={`http://localhost:1337${thumbnail.url}`} alt={thumbnail.alt} />
            </a>
          </Link>
        </div>
        <div>
          {listaEjercicios}
        </div>
      </li>
    )
  })
  return (
    <EstructuraPagina isHome={true} navItems={navItems}>
      <Head>
        <title>{titulo}</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Ejercicios de ingenieria</h2>
        <ul className={utilStyles.list}>
          {listaPortadas}
        </ul>
      </section>
    </EstructuraPagina>
  )
}
