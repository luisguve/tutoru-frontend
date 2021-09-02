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
  indiceCategoriaActual,
} from "../../lib/contenidos"
import EstructuraPagina from "../../components/EstructuraPagina"
import PaginaCategoria from "../../components/categorias/PaginaCategoria"
import PaginaEjercicio from "../../components/categorias/PaginaEjercicio"

import { titulo, cargarNavItems } from "../../lib/metadata"

const categoria = "fenomenos-de-transporte"

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
  // Indice de la categoria actual
  const categoriaActual = indiceCategoriaActual(indice, ruta)
  // Resumen con la cantidad de ejercicios de la categoria actual
  const resumen = await getResumenCategoria(categoriaActual.Titulo_url)

  // Si hay ejercicios en la categoria, se deben buscar
  if (categoriaActual.ejercicios.length) {
    resumen.muestras.push(await getEjercicios(indice.Titulo_url))
  }

  // Construir los elementos del componente breadcrumb
  const {
    breadCrumb,
    tituloCabecera,
    metaSubtitulo,
  } = buildBreadCrumb(indice, ruta)

  return {
    props: {
      contenido: {
        resumen,
      },
      indice: categoriaActual,
      navItems,
      breadCrumb,
      tituloCabecera,
      metaSubtitulo,
    }
  }
}

/*
* Se desea mantener el minimo codigo posible en este componente ya que sera
* copiado el mismo en las otras categorias.
*/
export default function Pagina(props) {
  const router = useRouter()
  const {
    contenido,
    indice,
    navItems,
    breadCrumb,
    tituloCabecera,
    metaSubtitulo,
  } = props

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

  const subcategoriaRecursiva = ({parentUrl, subcategorias}) => {
    return subcategorias.map(s => {

      const { hijos } = s

      let subcategorias = null
      if (hijos.length) {
        subcategorias = subcategoriaRecursiva({
          parentUrl: `${parentUrl}/${s.Titulo_url}`,
          subcategorias: hijos
        })
      }

      return (<div key={s.Titulo_url}>
       <h4>
         <Link href={`${parentUrl}/${s.Titulo_url}`}>
           <a className="ms-1">{s.Titulo_normal} {
             !subcategorias && `(${s.ejercicios.length})`
           }</a>
         </Link>
         {
           subcategorias && <div className="ms-4">{subcategorias}</div>
         }
       </h4>
      </div>)
    })
  }

  let subcategorias = null
  if (indice && indice.hijos.length) {
    subcategorias = subcategoriaRecursiva({
      parentUrl: router.asPath,
      subcategorias: indice.hijos
    })
  }

  return (
    <EstructuraPagina navItems={navItems} breadCrumb={breadCrumb}>
      <Head>
        <title>{titulo} | {metaSubtitulo}</title>
      </Head>

      <h3 className="text-center">{tituloCabecera}: {contenido.resumen.q} ejercicios</h3>
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
