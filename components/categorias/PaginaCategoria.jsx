import Head from "next/head"

import { siteTitle } from "../../lib/metadata"
import SeccionEjercicios from "../SeccionEjercicios"
import ListaEjercicios from "./ListaEjercicios"
import utilStyles from "../../styles/utils.module.css"

/*
* Este componente muestra una lista de ejercicios dentro de una categoria.
*/
export default function PaginaCategoria({ label, contenido }) {
  return (
    <SeccionEjercicios>
      <Head>
        <title>{siteTitle} | {label}</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <ListaEjercicios
          irSolucion={false}
          contenido={contenido}
        />
      </section>
    </SeccionEjercicios>
  )
}
