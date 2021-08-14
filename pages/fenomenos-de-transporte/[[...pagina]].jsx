import { getIndiceCategoria, getPagina } from "../../lib/contenidos"
import PaginaCategoria from "../../components/categorias/PaginaCategoria"
import PaginaEjercicio from "../../components/categorias/PaginaEjercicio"

import { cargarNavItems } from "../../lib/metadata"

const categoria = "fenomenos-de-transporte"

export async function getStaticProps({ params }) {
  // const contenido = await getPagina(params.paginas)
  const navItems = await cargarNavItems()
  console.log("params:", params)
  return {
    props: {
      contenido: "hello " + params.pagina || "",
      navItems
    }
  }
}

export async function getStaticPaths() {
  const raiz = await getIndiceCategoria(categoria)
  const indice = raiz.hijos.reduce((indice, h) => {
    const subNivel = construirIndice({
      parentUrl: [],
      raiz: h
    })
    return [...indice, ...subNivel]
  }, [{params: {pagina: []}}])
  console.log(JSON.stringify(indice))
  return {
    paths: [...indice],
    fallback: false
  }
}

/*
* Se desea mantener el minimo codigo posible en este componente ya que sera
* copiado el mismo en las otras categorias.
*/
export default function Pagina({ contenido, navItems }) {
  return <h1>{contenido}</h1>
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

const construirIndice = ({parentUrl, raiz}) => {
  const result = []
  const pagina = [...parentUrl, raiz.Titulo_url]
  const urlPagina = {
    params: { pagina }
  }
  result.push(urlPagina)
  raiz.hijos.map(h => {
    const subNivel =  construirIndice({
      parentUrl: pagina,
      raiz: h
    })
    result.push(...subNivel)
  })
  return result
}
