import {
  getIndiceCategoria,
  getEjercicio,
  construirIndice,
  getEjercicios,
  buildBreadCrumb,
  getResumenCategoria,
  indiceCategoriaActual,
} from "./contenidos"
import { cargarNavItems } from "./metadata"

export async function getCategoriaProps({ params, categoria }) {

  const ruta = params.pagina || [categoria]

  const navItems = await cargarNavItems()

  // Indice para construir el breadcrumb y el contenido de cada seccion
  const indice = await getIndiceCategoria(categoria)

  // Indice de la categoria actual
  const { categoriaActual, esCategoria } = indiceCategoriaActual(indice, ruta)

  // Si estamos en una categoria, se obtiene su resumen.
  let resumen = null

  // Sino, estamos en una pagina de ejercicio. Se obtiene su contenido.
  let ejercicio = null

  if (esCategoria) {
    resumen = await getResumenCategoria(categoriaActual.Titulo_url)
    // Si hay ejercicios en la categoria, se deben buscar
    if (categoriaActual.ejercicios.length) {
      let ejercicios = await getEjercicios(categoriaActual.Titulo_url)
      // Excluir los ejercicios de muestra
      if (resumen.muestras.length) {
        ejercicios = ejercicios.filter(e => {
          return !resumen.muestras.find(m => m.slug === e.slug)
        })
      }
      resumen.muestras.push(...ejercicios)
    }
  } else {
    const slug = ruta[ruta.length -1]
    ejercicio = await getEjercicio(categoriaActual.Titulo_url, slug)
  }

  // Elementos del componente breadcrumb
  const {
    breadCrumb,
    tituloCabecera,
    metaSubtitulo,
  } = await buildBreadCrumb(indice, ruta)

  return {
    props: {
      contenido: {
        resumen,
        ejercicio,
      },
      indice: categoriaActual,
      esCategoria,
      navItems,
      breadCrumb,
      tituloCabecera,
      metaSubtitulo,
    }
  }
}

export async function getCategoriaPaths({categoria}) {
  const raiz = await getIndiceCategoria(categoria)

  const base = [
    {params: {pagina: []}},
    // Indexar las paginas de los ejercicios pertenencientes a la seccion raiz
    ...(raiz.ejercicios.map(e => ({params: { pagina: [e] } }))
    )
  ]

  const indice = raiz.hijos.reduce((indice, h) => {
    const subNivel = construirIndice({
      parentUrl: [],
      raiz: h
    })
    return [...indice, ...subNivel]
  }, base)

  return {
    paths: indice
  }
}