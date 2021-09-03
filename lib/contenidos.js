import matter from "gray-matter"
import remark from 'remark'
import html from 'remark-html'

import indiceCategorias from "./categorias"
import { API_URL } from "./urls"

const procesadorMD = remark().use(html)

/**
* Obtiene los planteamientos de los ejercicios de la categoria recibida.
*/
export async function getEjercicios(categoria) {
  const url = `${API_URL}/ejercicios/?categoria=${categoria}`

  const ejercicios_res = await fetch(url)
  const ejerciciosCategoria = await ejercicios_res.json()

  const result = await Promise.all(ejerciciosCategoria.map(async e => {
    const { descripcion, descripcion_corta } = e
    // Procesa el markdown de la descripcion con remark
    const mdDesc = await procesadorMD.process(descripcion)
    const mdDescCorta = await procesadorMD.process(descripcion_corta)

    const resEj = JSON.parse(JSON.stringify(e))

    resEj.descripcion = mdDesc.toString().trim()
    resEj.descripcion_corta = mdDescCorta.toString().trim()

    return resEj
  }))

  return result
}

/**
* Obtiene el ejercicio de la categoria dada con el slug recibido.
*/
export async function getEjercicio(categoria, slug) {
  const url = `${API_URL}/ejercicios/${slug}?categoria=${categoria}`

  const ejercicio_res = await fetch(url)
  const ejercicio = await ejercicio_res.json()

  const { descripcion } = ejercicio

  const mdDesc = await procesadorMD.process(descripcion)
  ejercicio.descripcion = mdDesc.toString().trim()

  return ejercicio
}

/**
* Retorna el resumen de la categoria.
*/
export async function getResumenCategoria(categoria) {
  const url = `${API_URL}/categorias/${categoria}/resumen`
  const resumen_res = await fetch(url)
  const resumen = await resumen_res.json()

  if (resumen.muestras.length) {
    resumen.muestras = await Promise.all(resumen.muestras.map(async e => {
      const { descripcion, descripcion_corta } = e
      // Procesa el markdown de la descripcion con remark
      const mdDesc = await procesadorMD.process(descripcion)
      const mdDescCorta = await procesadorMD.process(descripcion_corta)

      const resEj = JSON.parse(JSON.stringify(e))

      resEj.descripcion = mdDesc.toString().trim()
      resEj.descripcion_corta = mdDescCorta.toString().trim()

      return resEj
    }))
  }

  return resumen
}

/**
* Retorna las portadas de las categorias raiz junto con sus ejercicios de muestra.
*/
export async function getCategorias() {
  const categorias = await indiceCategorias.root()

  const result = Promise.all(categorias.map(async (c) => {

    const resumen = await getResumenCategoria(c.Titulo_url)

    const categoria = {
      Titulo_url: c.Titulo_url,
      Titulo_normal: c.Titulo_normal,
      thumbnail: {
        url: c.Thumbnail.url,
        alt: `${c.Titulo_normal} PDF`
      },
      ejercicios: {
        q: resumen.q,
        planteamientos: resumen.muestras
      }
    }
    return categoria
  }))
  return result
}

/**
* Obtiene la estructura de la categoria
*/
export async function getIndiceCategoria(nombre) {
  return await indiceCategorias.getByName(nombre)
}

export const construirIndice = ({parentUrl, raiz}) => {
  const result = []
  const pagina = [...parentUrl, raiz.Titulo_url]
  const urlPagina = {
    params: { pagina }
  }
  result.push(urlPagina)
  raiz.ejercicios.map(e => {
    result.push({
      params: {
        pagina: [...pagina, e]
      }
    })
  })
  raiz.hijos.map(h => {
    const subNivel =  construirIndice({
      parentUrl: pagina,
      raiz: h
    })
    result.push(...subNivel)
  })
  return result
}

/**
* Retorna el indice de la categoria que indica el parametro ruta.
* Retorna null si no se encuentra el indice que corresponde a ruta o
* en su defecto, si la ruta es de la pagina de un ejercicio.
*/
export const indiceCategoriaActual = (indice, ruta) => {
  const pagina = ruta[ruta.length - 1]

  if (indice.Titulo_url === pagina) {
    // Estamos en la raiz de la seccion
    return {
      categoriaActual: indice,
      esCategoria: true,
    }
  }

  // No estamos en la raiz de la seccion

  // Navega recursivamente por el indice siguiendo la ruta de la pagina
  let categoriaActual = indice
  const eachHijo = (coll) => {
    for (let i = 0; i < coll.length; i++) {
      const categoria = coll[i]

      if (ruta.includes(categoria.Titulo_url)) {
        categoriaActual = categoria
        // Ruta correcta
        if (categoria.Titulo_url === pagina) {
          // Indice de categoria encontrado
          return {
            categoriaActual: categoria,
            esCategoria: true,
          }
        }
        // Seguir buscando en las subcategorias
        return eachHijo(categoria.hijos)
      }
    }
    // Indice no encontrado
    return {
      categoriaActual,
      esCategoria: false
    }
  }
  return eachHijo(indice.hijos)
}

/**
* Construye el breadcrumb de acuerdo a la ruta y el indice recibido.
*/
export const buildBreadCrumb = async (indice, ruta) => {
  const inicio = {
    name: "inicio",
    url: "/",
  }
  const raiz = {
    name: indice.Titulo_normal,
    url: "/" + indice.Titulo_url
  }
  const breadCrumb = [inicio, raiz]

  let metaSubtitulo = indice.Aria_label || indice.Titulo_normal
  let tituloCabecera = indice.Aria_label || indice.Titulo_normal

  const pagina = ruta[ruta.length - 1]

  if (indice.Titulo_url === pagina) {
    // Estamos en la raiz de la seccion
    return {
      breadCrumb,
      metaSubtitulo,
      tituloCabecera,
    }
  }

  // No estamos en la raiz de la seccion
  const paginas = []

  // Navega recursivamente por el indice siguiendo la ruta de la pagina
  let categoriaActual = indice
  const eachHijo = async (coll) => {
    let encontrado = false
    for (let i = 0; i < coll.length; i++) {
      const categoria = coll[i]

      if (ruta.includes(categoria.Titulo_url)) {
        // Ruta correcta
        categoriaActual = categoria
        metaSubtitulo += ` - ${categoria.Aria_label || categoria.Titulo_normal}`
        tituloCabecera = categoria.Aria_label || categoria.Titulo_normal

        const newUrl = paginas.reduce(
          (base, {url}) => `${base}/${url}`, "/" + indice.Titulo_url
        ) + `/${categoria.Titulo_url}`

        paginas.push({
          name: categoria.Aria_label || categoria.Titulo_normal,
          url: newUrl,
        })

        // Navegar por las subcategorias hasta dar con la ultima pagina
        await eachHijo(categoria.hijos)
        // No seguir en este nivel
        encontrado = true
        break
      }
    }

    if (!encontrado) {
      // En este punto la pagina no fue encontrada en este nivel del indice, lo cual
      // puede significar que estamos en la pagina de un ejercicio, ya que estas
      // paginas no están indexadas.

      // Veamos si estamos en la pagina de un ejercicio, lo cual es cierto si el
      // numero de paginas a ser introducidas en el breadcrumb es diferente a la
      // cantidad de paginas dentro del array ruta.
      if (paginas.length !== ruta.length) {
        // Esta es la pagina de un ejercicio.
        // Se procede a recuperar el titulo del ejercicio e indexar la pagina.
        const ejercicio = await getEjercicio(categoriaActual.Titulo_url, pagina)
        tituloCabecera = ejercicio.titulo
        const newUrl = paginas.reduce(
          (base, {url}) => `${base}/${url}`, `/${indice.Titulo_url}`
        ) + `/${pagina}`
        paginas.push({
          name: ejercicio.titulo,
          url: `${newUrl}`
        })
      }
    }
  }
  await eachHijo(indice.hijos)

  breadCrumb.push(...paginas)

  return {
    breadCrumb,
    metaSubtitulo,
    tituloCabecera
  }
}
