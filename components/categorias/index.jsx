import { useRouter } from "next/router"
import Head from "next/head"
import Link from "next/link"

import { titulo } from "../../lib/metadata"

import EstructuraPagina from "../EstructuraPagina"
import PaginaCategoria from "./PaginaCategoria"
import PaginaEjercicio from "./PaginaEjercicio"
import Subcategorias from "./Subcategorias"

export default function Categoria({props}) {
  const router = useRouter()
  const {
    contenido,
    indice,
    esCategoria,
    navItems,
    breadCrumb,
    tituloCabecera,
    metaSubtitulo,
  } = props

  let listaEjercicios

  if (contenido.resumen) {
    listaEjercicios = contenido.resumen.muestras.map(e => {
      return (
        <div key={e.slug}>
          <Link href={`${router.asPath}/${e.slug}`}>
            <a>
              <h5>{e.titulo}</h5>
            </a>
          </Link>
          <div dangerouslySetInnerHTML={{ __html: e.descripcion_corta}}></div>
        </div>
      )
    })
  }

  const cabecera = contenido.resumen ?
  `${tituloCabecera}: ${contenido.resumen.q} ejercicios` :
  `${tituloCabecera}`

  return (
    <EstructuraPagina navItems={navItems} breadCrumb={breadCrumb}>
      <Head>
        <title>{titulo} | {metaSubtitulo}</title>
      </Head>

      <h3 className="text-center">{cabecera}</h3>
      {
        (esCategoria && (indice.hijos.length > 0)) &&
        <div className="mt-4">
          <Subcategorias parentUrl={router.asPath} subcategorias={indice.hijos} />
        </div>
      }
      <div className="mt-4">
        {listaEjercicios}
        {
          contenido.ejercicio &&
          <div dangerouslySetInnerHTML={{ __html: contenido.ejercicio.descripcion_corta}}></div>
        }
      </div>
    </EstructuraPagina>
  )
  if (contenido.subniveles) {
    return (
      <EstructuraPagina navItems={navItems}>
        <PaginaCategoria contenido={contenido.subniveles} />
      </EstructuraPagina>
    )
  }
  return (
    <EstructuraPagina navItems={navItems}>
      <PaginaEjercicio contenido={contenido} />
    </EstructuraPagina>
  )
}
