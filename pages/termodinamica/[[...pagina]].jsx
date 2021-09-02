import { useRouter } from "next/router"
import Head from "next/head"
import Link from "next/link"

import {
  getIndiceCategoria,
  getPagina,
  construirIndice,
  getEjercicios,
  buildBreadCrumb,
  getResumenCategoria,
} from "../../lib/contenidos"
import EstructuraPagina from "../../components/EstructuraPagina"
import PaginaCategoria from "../../components/categorias/PaginaCategoria"
import PaginaEjercicio from "../../components/categorias/PaginaEjercicio"

import { titulo, cargarNavItems } from "../../lib/metadata"

const categoria = "termodinamica"

export async function getStaticPaths() {
  const raiz = await getIndiceCategoria(categoria)

  const indice = raiz.hijos.reduce((indice, h) => {
    const subNivel = construirIndice({
      parentUrl: [],
      raiz: h
    })
    return [...indice, ...subNivel]
  }, [{params: {pagina: []}}])

  return {
    paths: [...indice],
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const ruta = params.pagina || [categoria]
  // const contenido = await getPagina(params.pagina)
  const navItems = await cargarNavItems()
  // Indice para construir el breadcrumb y el contenido de cada seccion
  const indice = await getIndiceCategoria(categoria)
  // Resumen con la cantidad de ejercicios de la seccion
  const resumen = await getResumenCategoria(indice.Titulo_url)

  // Si hay ejercicios en la categoria, se deben buscar
  if (indice.ejercicios) {
    resumen.muestras.push(await getEjercicios(indice.Titulo_url))
  }
  const cargarSubcategorias = async (c) => {
    const resumen = await getResumenCategoria(c.Titulo_url)
    let subcategoriasAnidadas = null
    if (c.hijos.length) {
      subcategoriasAnidadas = await Promise.all(c.hijos.map(c => cargarSubcategorias(c)))
    }
    return { resumen, presentacion: c, subcategoriasAnidadas }
  }

  let subcategorias = null
  if (indice.hijos.length) {
    subcategorias = await Promise.all(indice.hijos.map(c => cargarSubcategorias(c)))
  }
  return {
    props: {
      contenido: {
        titulo: "Termodinámica",
        resumen,
        subcategorias,
      },
      indice,
      ruta,
      navItems,
    }
  }
}

/*
* Se desea mantener el minimo codigo posible en este componente ya que sera
* copiado el mismo en las otras categorias.
*/
export default function Pagina(props) {
  const router = useRouter()
  const { contenido, indice, ruta, navItems } = props

  const {breadCrumb, tituloCabecera, metaSubtitulo} = buildBreadCrumb(indice, ruta)

  const listaEjercicios = contenido.resumen.muestras.map(e => {
    return (
      <div key={e.slug}>
        <Link href={`${router.asPath}/${e.slug}`}>
          <a>
            <h5>{e.titulo}</h5>
          </a>
        </Link>
        <div dangerouslySetInnerHTML={{ __html: e.descripcion_corta}}></div>
      </div>
    )
  })

  const subcategoriaRecursiva = (subcategorias) => {
    if (!subcategorias) return null
    return subcategorias.map(s => {
      const { resumen, presentacion: pres, subcategoriasAnidadas } = s
      let subcategorias = null
      if (subcategoriasAnidadas) {
        subcategorias = subcategoriaRecursiva(subcategoriasAnidadas)
      }
      return (<div key={pres.Titulo_url}>
       <h4>
         <Link href={router.asPath + "/" + pres.Titulo_url}>
           <a className="ms-1">{pres.Titulo_normal} {
             !subcategorias && `(${pres.ejercicios.length})`
           }</a>
         </Link>
         {
           subcategorias && <div className="ms-4">{subcategorias}</div>
         }
       </h4>
      </div>)
    })
  }

  let { subcategorias } = contenido
  if (subcategorias) {
    subcategorias = subcategoriaRecursiva(subcategorias)
  }

  return (
    <EstructuraPagina navItems={navItems} breadCrumb={breadCrumb}>
      <Head>
        <title>{titulo} | {metaSubtitulo}</title>
      </Head>
      <h3 className="text-center">{tituloCabecera}: {contenido.resumen.muestras.length} ejercicios</h3>
      <div className="mt-4">
        {subcategorias}
      </div>
      <div className="mt-4">
        {listaEjercicios}
      </div>
    </EstructuraPagina>
  )
  if (contenido.subniveles) {
    return (
      <EstructuraPagina navItems={navItems}>
        <PaginaCategoria contenido={contenido.subniveles} />
      </EstructuraPagina>
    )
  }
  return (
    <EstructuraPagina navItems={navItems}>
      <PaginaEjercicio contenido={contenido} />
    </EstructuraPagina>
  )
}
