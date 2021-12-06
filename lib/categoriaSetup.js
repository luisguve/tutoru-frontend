import {
  getIndiceCategoria,
  getEjercicio,
  construirIndice,
  getEjercicios,
  buildBreadCrumb,
  getResumenCategoria,
  getResumenCurso,
  indiceCategoriaActual,
} from "./contenidos"
import { cargarNavItems, cargarInformacionSitio } from "./metadata"

export async function getCategoriaProps({ params, categoria }) {

  const ruta = params.pagina || [categoria]

  const navItems = await cargarNavItems()
  const informacionSitio = await cargarInformacionSitio()

  // Indice para construir el breadcrumb y el contenido de cada seccion
  const indice = await getIndiceCategoria(categoria)

  // Indice de la categoria actual
  const { categoriaActual, esCategoria } = indiceCategoriaActual(indice, ruta)

  // Ver si estamos en una categoria y obtener su resumen.
  let resumen = null
  // Sino, ver si estamos en la pagina de reproduccion de un curso
  // o en la pagina de presentación de un curso y obtener su título.
  let slugCurso
  // Sino, estamos en una pagina de ejercicio. Se obtiene su contenido.
  let ejercicio = null

  let esReproduccionCurso = false
  let esPresentacionCurso = false
  if (ruta.includes("cursos") && ruta.includes("ver")) {
    esReproduccionCurso = true
  } else if (ruta.includes("cursos")) {
    esPresentacionCurso = true
  }
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
  } else if (esReproduccionCurso || esPresentacionCurso) {
    if (esReproduccionCurso) {
      // ruta: [{categoria}, cursos, {slug}, ver]
      slugCurso = ruta[ruta.length - 2]
    } else {
      // ruta: [{categoria}, cursos, {slug}]
      slugCurso = ruta[ruta.length - 1]
    }
    resumen = await getResumenCurso(slugCurso)
  } else {
    // Página de ejercicio
    const slug = ruta[ruta.length -1]
    ejercicio = await getEjercicio(categoriaActual.Titulo_url, slug)
  }

  // Elementos del componente breadcrumb
  let breadCrumb, tituloCabecera, metaSubtitulo
  if (esReproduccionCurso || esPresentacionCurso) {
    breadCrumb = [
      {
        name: "inicio",
        url: "/",
      },
      {
        name: indice.Titulo_normal,
        url: "/" + indice.Titulo_url
      },
      {
        name: `Curso: ${resumen.titulo}`,
        url: "/" + indice.Titulo_url + "/cursos/" + slugCurso
      }
    ]
    if (esReproduccionCurso) {
      breadCrumb.push({
        name: "Reproducir",
        url: "/" + indice.Titulo_url + "/cursos/" + slugCurso + "/ver"
      })
    }
    metaSubtitulo = indice.Aria_label || indice.Titulo_normal
    tituloCabecera = indice.Aria_label || indice.Titulo_normal
  } else {
    const data = await buildBreadCrumb(indice, ruta)
    breadCrumb = data.breadCrumb
    tituloCabecera = data.tituloCabecera
    metaSubtitulo = data.metaSubtitulo
  }

  return {
    props: {
      contenido: {
        resumen,
        ejercicio,
      },
      indice: categoriaActual,
      esCategoria,
      esReproduccionCurso,
      esPresentacionCurso,
      navItems,
      informacionSitio,
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
    // Indexar las paginas de los ejercicios pertenecientes a la seccion raiz
    ...(raiz.ejercicios.map(e => ({params: { pagina: [e] } }))),
    // Indexar las paginas de los cursos pertenecientes a la seccion raiz
    ...(raiz.cursos.map(c => ({params: { pagina: ["cursos", c.slug] } }))),
    // Indexar las paginas de reproducción de los cursos
    ...(raiz.cursos.map(c => ({params: { pagina: ["cursos", c.slug, "ver"] } })))
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