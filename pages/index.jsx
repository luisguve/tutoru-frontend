import Head from 'next/head'
import Link from "next/link"

import EstructuraPagina from '../components/EstructuraPagina'
import ListaEjercicios from '../components/categorias/ListaEjercicios'
import utilStyles from '../styles/utils.module.css'
import { getCategorias } from "../lib/contenidos"
import { cargarInformacionSitio, cargarNavItems } from "../lib/metadata"

export async function getStaticProps() {
  const portadas = await getCategorias()
  const navItems = await cargarNavItems()
  const informacionSitio = await cargarInformacionSitio()
  return {
    props: {
      portadas,
      navItems,
      informacionSitio,
    }
  }
}

export default function Home(props) {
  const { portadas, navItems, informacionSitio } = props

  const listaPortadas = portadas.map((datos) => {
    const {
      Titulo_url,
      Titulo_normal,
      thumbnail,
      ejercicios
    } = datos

    const thumbnailClass = ejercicios.planteamientos.length ? "float-start" : "d-flex justify-content-center"

    return (
      <li className="mb-2 clearfix" key={Titulo_url}>
        <Link href={`/${Titulo_url}`}>
          <a>
            <h3 className="text-center">{Titulo_normal} ({ejercicios.q} ejercicios)</h3>
          </a>
        </Link>
        <div className={thumbnailClass.concat(" me-1")}>
          <Link href={`/${Titulo_url}`}>
            <a>
              <img src={`http://localhost:1337${thumbnail.url}`} alt={thumbnail.alt} />
            </a>
          </Link>
        </div>
        <ListaEjercicios irSolucion={false} muestras={ejercicios.planteamientos} />
      </li>
    )
  })
  return (
    <EstructuraPagina
      isHome={true}
      navItems={navItems}
      titulo={informacionSitio.Titulo_sitio}
      subtitulo={informacionSitio.Subtitulo_sitio}
    >
      <Head>
        <title>{informacionSitio.Titulo_sitio}</title>
      </Head>
      <section className="p-1">
        <h2 className="text-center">
          {informacionSitio.Titulo_home}
        </h2>
        <p>
          {informacionSitio.Descripcion}
        </p>
        <ul className={utilStyles.list}>
          {listaPortadas}
        </ul>
      </section>
    </EstructuraPagina>
  )
}
