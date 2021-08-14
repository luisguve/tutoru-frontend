import matter from "gray-matter"
import remark from 'remark'
import html from 'remark-html'

import ejercicios from "./ejercicios"
import indiceCategorias from "./categorias"
import fenomenosDeTransporte from "./fenomenos-de-transporte"
import termodinamica from "./termodinamica"

const categoriasIndices = {
  "fenomenos-de-transporte": fenomenosDeTransporte,
  "termodinamica": termodinamica
}

import { API_URL } from "./urls"

const procesadorMD = remark().use(html)

export async function getEjercicios(categoria, inicio = 0, limite = 15) {
  const url = `${API_URL}/ejercicios/?categoria.Titulo_url=${categoria}&_limit=${limite}&_start=${inicio}`
  // const ejercicios_res = await fetch(url)
  // const ejercicios = await ejercicios_res.json()

  let ejerciciosCategoria = categoria ? ejercicios.filter(e => e.categoria.Titulo_url === categoria) : ejercicios
  // Eliminar lo siguiente si se hace la llamada a la api
  if (ejerciciosCategoria.length >= inicio) {
    ejerciciosCategoria = ejerciciosCategoria.slice(inicio, limite)
  }

  const result = []

  for (var i = 0; i < ejerciciosCategoria.length; i++) {
    const e = ejerciciosCategoria[i]

    const { descripcion, descripcion_corta } = e
    // Procesa el markdown de la descripcion con remark
    const mdDesc = await procesadorMD.process(descripcion)
    const mdDescCorta = await procesadorMD.process(descripcion_corta)

    const resEj = JSON.parse(JSON.stringify(e))

    resEj.descripcion = mdDesc.toString().trim()
    resEj.descripcion_corta = mdDescCorta.toString().trim()

    result.push(resEj)
  }
  return result
}

export async function getEjerciciosIds(categoria) {
  // const ejercicios_res = await fetch(`${API_URL}/ejercicios?categoria.Titulo_url=${categoria}`)
  // const ejercicios = await ejercicios_res.json()

  const ejerciciosCategoria = ejercicios.filter(e => e.categoria.Titulo_url === categoria)
  return ejerciciosCategoria.map(e => ({
      params: {
        ejercicio: e.slug
      }
    })
  )
}

export async function getEjercicio(slug) {
  // const ejercicio_res = await fetch(`${API_URL}/ejercicios/?slug=${slug}`)
  // const found = await ejercicio_res.json()
  // const ejercicio = found[0]

  const ejercicio = ejercicios.find(e => e.slug === slug)

  const { descripcion } = ejercicio

  const mdDesc = await procesadorMD.process(descripcion)
  ejercicio.descripcion = mdDesc.toString().trim()

  return ejercicio
}

/*
* Retorna las portadas de las categorias junto con los dos primeros ejercicios.
*/
export async function getCategorias(inicio, limite) {
  /*
  const categorias_res = await fetch(`${API_URL}/categorias`)
  const categorias = await categorias_res.json()
  */
  const categorias = await indiceCategorias.all()
  const result = []
  for (var i = categorias.length - 1; i >= 0; i--) {
    const c = categorias[i]
    const planteamientos = await getEjercicios(c.Titulo_url, inicio, limite)
    const categoria = {
      Titulo_url: c.Titulo_url,
      Titulo_normal: c.Titulo_normal,
      thumbnail: {
        url: c.Thumbnail.url,
        alt: `${c.Titulo_normal} PDF`
      },
      ejercicios: {
        q: c.ejercicios,
        planteamientos
      }
    }
    result.push(categoria)
  }
  return result
}

/*
* Obtiene la estructura de la categoria
*/
export async function getIndiceCategoria(nombre) {
  //const categoria_res = await fetch(`${API_URL}/categorias/${nombre}`)
  //const categoria = await categoria_res.json()
  //return categoriasIndices[nombre]
  const result = await indiceCategorias.getByName(nombre)
}
