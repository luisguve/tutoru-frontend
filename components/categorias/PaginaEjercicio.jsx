import Head from "next/head"

import { siteTitle } from "../../lib/metadata"
import EstructuraPagina from "../EstructuraPagina"
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
  const { titulo, id, descripcion, categoria } = contenido

  return (
    <EstructuraPagina categoria={categoria}>
      <Head>
        <title>{siteTitle} | {categoria.Titulo_normal} | {titulo}</title>
      </Head>
      <h1>{categoria.Titulo_normal}</h1>
      <Ejercicio
        contenido={contenido}
        enSeccion={false}
      />
    </EstructuraPagina>
  )
}
