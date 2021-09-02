import matter from "gray-matter"
import remark from 'remark'
import html from 'remark-html'

import indiceCategorias from "./categorias"
import { API_URL } from "./urls"

const procesadorMD = remark().use(html)

/**
* Obtiene los planteamientos de los ejercicios de la categoria pasada desde inicio
* hasta limite.
*/
export async function getEjercicios(categoria, inicio = 0, limite = 15) {
  const url = `${API_URL}/ejercicios/?categoria.Titulo_url=${categoria}&_limit=${limite}&_start=${inicio}`
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
* Obtiene los IDs de los ejercicios para construir los URLs.
*/
export async function getEjerciciosIds(categoria) {
  const ejercicios_res = await fetch(`${API_URL}/ejercicios?categoria.Titulo_url=${categoria}`)
  const ejerciciosCategoria = await ejercicios_res.json()

  return ejerciciosCategoria.map(e => ({
      params: {
        ejercicio: e.slug
      }
    })
  )
}

/**
* Obtiene el ejercicio con el slug pasado.
*/
export async function getEjercicio(slug) {
  const ejercicio_res = await fetch(`${API_URL}/ejercicios/?slug=${slug}`)
  const found = await ejercicio_res.json()
  const ejercicio = found[0]

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

export const indiceCategoriaActual = (indice, ruta) => {
  const pagina = ruta[ruta.length - 1]

  if (indice.Titulo_url === pagina) {
    // Estamos en la raiz de la seccion
    return indice
  }

  // No estamos en la raiz de la seccion

  // Navega recursivamente por el indice siguiendo la ruta de la pagina
  const eachHijo = (coll) => {
    for (let i = 0; i < coll.length; i++) {
      const categoria = coll[i]

      if (ruta.includes(categoria.Titulo_url)) {
        // Ruta correcta
        if (categoria.Titulo_url === pagina) {
          // Indice de categoria encontrado
          return categoria
        }
        // Seguir buscando en las subcategorias
        return eachHijo(categoria.hijos)
      }
    }
    // Indice no encontrado
    return null
  }
  return eachHijo(indice.hijos)
}

/**
* Construye el breadcrumb de acuerdo a la ruta y el indice que recibe.
*/
export const buildBreadCrumb = (indice, ruta) => {
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
  const eachHijo = (coll) => {
    for (let i = 0; i < coll.length; i++) {
      const hijo = coll[i]

      if (ruta.includes(hijo.Titulo_url)) {
        // Ruta correcta
        metaSubtitulo += ` - ${hijo.Aria_label || hijo.Titulo_normal}`

        const newUrl = paginas.reduce(
          (base, {url}) => `${base}/${url}`, "/" + indice.Titulo_url
        ) + "/" + hijo.Titulo_url

        paginas.push({
          name: hijo.Aria_label || hijo.Titulo_normal,
          url: newUrl,
        })
        tituloCabecera = hijo.Aria_label || hijo.Titulo_normal
        eachHijo(hijo.hijos)
        break
      }
    }
  }
  eachHijo(indice.hijos)

  breadCrumb.push(...paginas)

  return {
    breadCrumb,
    metaSubtitulo,
    tituloCabecera
  }
}
