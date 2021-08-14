import Head from "next/head"

import { siteTitle } from "../../lib/metadata"
import EstructuraPagina from "../EstructuraPagina"
import ListaEjercicios from "./ListaEjercicios"
import utilStyles from "../../styles/utils.module.css"

/*
* Este componente muestra una lista de ejercicios dentro de una categoria.
*/
export default function PaginaCategoria({ contenido }) {
  // Obtiene el titulo de la categoria del primer contenido
  const { categoria: { Titulo_normal } } = contenido[0]
  return (
    <EstructuraPagina>
      <Head>
        <title>{siteTitle} | {Titulo_normal}</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <ListaEjercicios
          irSolucion={false}
          contenido={contenido}
        />
      </section>
    </EstructuraPagina>
  )
}
