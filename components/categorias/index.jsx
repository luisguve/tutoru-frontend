import Head from "next/head"
import Link from "next/link"

import EstructuraPagina from "../EstructuraPagina"
import Subcategorias from "./Subcategorias"
import PaginaCategoria from "./PaginaCategoria"
import Ejercicio from "./Ejercicio"

/**
* Componente compartido entre las diferentes categorias y paginas de ejercicios.
*/
export default function Categoria({props}) {
  const {
    contenido,
    indice,
    esCategoria,
    navItems,
    breadCrumb,
    tituloCabecera,
    metaSubtitulo,
    informacionSitio: { Titulo_sitio: titulo },
  } = props

  // Categoria o ejercicio?
  const componente = esCategoria ?
  <PaginaCategoria
    titulo={indice.Titulo_normal}
    subcategorias={indice.hijos}
    resumen={contenido.resumen}
  />
  :
  <Ejercicio
    contenido={contenido.ejercicio}
    enSeccion={false}
  />

  return (
    <EstructuraPagina navItems={navItems} breadCrumb={breadCrumb} titulo={titulo} header={indice.Titulo_normal}>
      <Head>
        <title>{titulo} | {metaSubtitulo}</title>
      </Head>
      {componente}
    </EstructuraPagina>
  )
}
