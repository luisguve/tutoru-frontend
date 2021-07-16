import Head from "next/head"

import SeccionEjercicios, { siteTitle } from '../../components/SeccionEjercicios'
import Ejercicio from '../../components/categorias/Ejercicio'
import { getEjerciciosIds, getEjercicio } from '../../lib/contenidos'
import utilStyles from "../../styles/utils.module.css"

/*
* Este componente muestra el ejercicio completo junto con su solucion si
* el usuario ha comprado este ejercicio. Muestra un texto de carga cuando la
* solucion al ejercicio esta siendo descargada.
*/
export default function PaginaEjercicio({ ejercicio }) {
  const { titulo, id, descripcion, categoria, categoriaFormato } = ejercicio

  return (
    <SeccionEjercicios categoria={categoria} categoriaFormato={categoriaFormato}>
      <Head>
        <title>{siteTitle} | {categoriaFormato} | {titulo}</title>
      </Head>
      <h1>{categoriaFormato}</h1>
      <Ejercicio contenido={ejercicio} enSeccion={false} />
    </SeccionEjercicios>
  )
}

export async function getStaticProps({ params }) {
  const ejercicio = await getEjercicio(params.slug)
  return {
    props: {
      ejercicio
    }
  }
}

export async function getStaticPaths() {
  const paths = getEjerciciosIds("termodinamica")
  return {
    paths,
    fallback: false
  }
}
