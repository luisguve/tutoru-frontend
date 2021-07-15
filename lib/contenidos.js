import fs from "fs"
import path from "path"
import matter from "gray-matter"
import remark from 'remark'
import html from 'remark-html'

import ejercicios from "./ejercicios"

import { API_URL } from "./urls"

const categorias = {
  "termodinamica": "Termodinámica",
  "fenomenos_de_transporte": "Fenómenos de transporte",
  "mecanica_de_fluidos": "Mecánica de fluidos"
}

const postsDirectory = path.join(process.cwd(), 'posts')
const procesadorMD = remark().use(html)

export async function getEjercicios(categoria) {
  // const ejercicios_res = await fetch(`${API_URL}/ejercicios/?categoria=${categoria}`)
  // const ejercicios = await ejercicios_res.json()

  const ejerciciosCategoria = categoria ? ejercicios.filter(e => e.categoria === categoria) : ejercicios

  const result = []

  for (var i = 0; i < ejerciciosCategoria.length; i++) {
    const e = ejerciciosCategoria[i]

    const { descripcion, descripcion_corta, categoria } = e
    // Procesa el markdown de la descripcion con remark
    const mdDesc = await procesadorMD.process(descripcion)
    const mdDescCorta = await procesadorMD.process(descripcion_corta)

    const resEj = JSON.parse(JSON.stringify(e))

    resEj.descripcion = mdDesc.toString().trim()
    resEj.descripcionCorta = mdDescCorta.toString().trim()

    resEj.categoriaFormato = categorias[categoria]

    result.push(resEj)
  }
  return result
}

export /*async*/ function getEjerciciosIds(categoria) {
  // const ejercicios_res = await fetch(`${API_URL}/ejercicios/`)
  // const ejercicios = await ejercicios_res.json()

  const ejerciciosCategoria = ejercicios.filter(e => e.categoria === categoria)
  return ejerciciosCategoria.map(e => ({
      params: {
        slug: e.slug
      }
    })
  )
}

export async function getEjercicio(slug) {  
  // const ejercicio_res = await fetch(`${API_URL}/ejercicios/?slug=${slug}`)
  // const found = await ejercicio_res.json()
  // const ejercicio = found[0]

  const ejercicio = ejercicios.find(e => e.slug === slug)

  const { categoria, descripcion } = ejercicio

  ejercicio.categoriaFormato = categorias[categoria]

  const mdDesc = await procesadorMD.process(descripcion)
  ejercicio.descripcion = mdDesc.toString().trim()

  return ejercicio
}

export function getAllPostIds() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map(fileName => {
    // Remove ".md" from file name to get id
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data
  }
}