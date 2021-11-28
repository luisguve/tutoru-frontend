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
    esReproduccionCurso,
    esPresentacionCurso,
    navItems,
    breadCrumb,
    tituloCabecera,
    metaSubtitulo,
    informacionSitio: { Titulo_sitio: titulo },
  } = props

  // Categoria, reproduccion de curso, presentacion de curso o ejercicio?
  let componente = null
  if (esCategoria) {
    componente = 
    <PaginaCategoria
      titulo={indice.Titulo_normal}
      subcategorias={indice.hijos}
      resumen={contenido.resumen}
    />
  } else if (esReproduccionCurso) {
    componente = <PaginaReproduccionCurso />
  } else if (esPresentacionCurso) {
    componente = <PaginaPresentacionCurso />
  } else {
    componente =
    <Ejercicio
      contenido={contenido.ejercicio}
      enSeccion={false}
    />
  }

  return (
    <EstructuraPagina navItems={navItems} breadCrumb={breadCrumb} titulo={titulo} header={indice.Titulo_normal}>
      <Head>
        <title>{titulo} | {metaSubtitulo}</title>
      </Head>
      {componente}
    </EstructuraPagina>
  )
}

const PaginaReproduccionCurso = () => {
  return <h1>ver curso</h1>
}

const PaginaPresentacionCurso = () => {
  return <h1>pres de curso</h1>
}
