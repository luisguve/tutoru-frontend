import { getEjercicios } from "../../lib/contenidos"
import PaginaCategoria from "../../components/categorias/PaginaCategoria"

export async function getStaticProps() {
  return {
    props: {
      contenido: await getEjercicios(categoria)
    }
  }
}

/*
* Se desea mantener el minimo codigo posible en este componente ya que sera
* copiado el mismo en las otras categorias.
*/
export default function Categoria({ contenido }) {
  return <PaginaCategoria label={categoriaTitulo} contenido={contenido} />
}

export const categoria = "termodinamica"
export const categoriaTitulo = "Termodinámica"
