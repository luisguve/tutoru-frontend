import { useRouter } from "next/router"
import Head from "next/head"
import Link from "next/link"

import { titulo } from "../../lib/metadata"

import EstructuraPagina from "../EstructuraPagina"
import PaginaCategoria from "./PaginaCategoria"
import PaginaEjercicio from "./PaginaEjercicio"

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

  const subcategoriaRecursiva = ({parentUrl, subcategorias}) => {
    return subcategorias.map(s => {

      const { hijos } = s

      let subcategorias = null
      if (hijos.length) {
        subcategorias = subcategoriaRecursiva({
          parentUrl: `${parentUrl}/${s.Titulo_url}`,
          subcategorias: hijos
        })
      }

      return (<div key={s.Titulo_url}>
       <h4>
         <Link href={`${parentUrl}/${s.Titulo_url}`}>
           <a className="ms-1">{s.Aria_label || s.Titulo_normal} {
             !subcategorias && `(${s.ejercicios.length})`
           }</a>
         </Link>
         {
           subcategorias && <div className="ms-4">{subcategorias}</div>
         }
       </h4>
      </div>)
    })
  }

  let subcategorias = null
  if (esCategoria && indice.hijos.length) {
    subcategorias = subcategoriaRecursiva({
      parentUrl: router.asPath,
      subcategorias: indice.hijos
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
      <div className="mt-4">
        {subcategorias}
      </div>
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
