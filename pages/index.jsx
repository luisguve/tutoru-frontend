import Head from 'next/head'
import Link from "next/link"
import Image from "next/image"

import EstructuraPagina from '../components/EstructuraPagina'
import ListaEjercicios from '../components/categorias/ListaEjercicios'
import { ListaCursosCarrusel } from "../components/ListaCursos"
import utilStyles from '../styles/utils.module.css'
import { getCategorias } from "../lib/contenidos"
import { cargarInformacionSitio, cargarNavItems, covers } from "../lib/metadata"

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
      ejercicios,
      cursos
    } = datos

    const thumbnailClass = ejercicios.planteamientos.length ? "float-start" : "d-flex justify-content-center"
    let titulo = Titulo_normal
    if (ejercicios.q > 0) {
      const label = ejercicios.q > 1 ? "ejercicios" : "ejercicio"
      titulo += `: ${ejercicios.q} ${label}`
    }
    if (cursos.length > 0) {
      const label = cursos.length > 1 ? "cursos" : "curso"
      if (ejercicios.q > 0) {
        titulo += `, ${cursos.length} ${label}`
      } else {
        titulo += `: ${cursos.length} ${label}`
      }
    }

    return (
      <li className="mb-5" key={Titulo_url}>
        <div className="clearfix">
          <Link href={`/${Titulo_url}`}>
            <a>
              <h3 className="text-center">{titulo}</h3>
            </a>
          </Link>
          <div className={thumbnailClass.concat(" me-1")}>
            <Link href={`/${Titulo_url}`}>
              <a>
                <img src={covers[Titulo_url]} alt={`Portada ${Titulo_normal}`} />
              </a>
            </Link>
          </div>
          {
            (ejercicios.planteamientos.length > 0) && 
            <ListaEjercicios irSolucion={false} muestras={ejercicios.planteamientos} />
          }
        </div>
        {
          (cursos.length > 0) &&
          <ListaCursosCarrusel categoria={Titulo_url} cursos={cursos} />
        }
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
        <h2 className="text-center mt-5 mb-2">
          {informacionSitio.Titulo_home}
        </h2>
        <p>
          {informacionSitio.Descripcion}
        </p>
        <ul className={utilStyles.list.concat(" my-5")}>
          {listaPortadas}
        </ul>
      </section>
    </EstructuraPagina>
  )
}
