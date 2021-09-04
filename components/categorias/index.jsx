import Head from "next/head"
import Link from "next/link"

import { titulo } from "../../lib/metadata"

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
  } = props

  const cabecera = contenido.resumen ?
  `${tituloCabecera}: ${contenido.resumen.q} ejercicios` :
  `${tituloCabecera}`

  // Categoria o ejercicio?
  const componente = esCategoria ?
  <PaginaCategoria
    subcategorias={indice.hijos}
    muestras={contenido.resumen.muestras}
  />
  :
  <Ejercicio
    contenido={contenido.ejercicio}
    enSeccion={false}
  />

  return (
    <EstructuraPagina navItems={navItems} breadCrumb={breadCrumb}>
      <Head>
        <title>{titulo} | {metaSubtitulo}</title>
      </Head>
      {componente}
    </EstructuraPagina>
  )
}
