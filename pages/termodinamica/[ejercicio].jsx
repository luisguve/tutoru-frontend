import { getEjerciciosIds, getEjercicio } from "../../lib/contenidos"
import PaginaEjercicio from "../../components/categorias/PaginaEjercicio"
import { categoria } from "."

export async function getStaticProps({ params }) {
  const contenido = await getEjercicio(params.ejercicio)
  return {
    props: {
      contenido
    }
  }
}

export async function getStaticPaths() {
  const paths = await getEjerciciosIds(categoria)
  return {
    paths,
    fallback: false
  }
}

/*
* Se desea mantener el minimo codigo posible en este componente ya que sera
* copiado el mismo en las otras categorias.
*/
export default function Ejercicio({ contenido }) {
  return <PaginaEjercicio contenido={contenido} />
}
