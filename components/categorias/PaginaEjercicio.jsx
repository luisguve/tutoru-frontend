import Head from "next/head"

import { siteTitle } from "../../lib/metadata"
import SeccionEjercicios from "../SeccionEjercicios"
import Ejercicio from "./Ejercicio"

/*
* Este componente muestra el ejercicio completo a traves del componente
* Ejercicio.
* 
* Tambien muestra su solucion si el usuario ha comprado este ejercicio.
* 
* Muestra un texto de carga cuando la solucion al ejercicio esta siendo
* descargada.
*/
export default function PaginaEjercicio({ contenido }) {
  const { titulo, id, descripcion, categoria, categoriaFormato } = contenido

  return (
    <SeccionEjercicios categoria={categoria} categoriaFormato={categoriaFormato}>
      <Head>
        <title>{siteTitle} | {categoriaFormato} | {titulo}</title>
      </Head>
      <h1>{categoriaFormato}</h1>
      <Ejercicio
        contenido={contenido}
        enSeccion={false}
      />
    </SeccionEjercicios>
  )
}
