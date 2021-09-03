import path from "path"
import { getCategoriaPaths, getCategoriaProps } from "../../lib/categoriaSetup"

import Categoria from "../../components/categorias"

const categoria = __dirname.split(path.sep).pop()

export async function getStaticPaths() {
  console.log(categoria)
  const {paths} = await getCategoriaPaths({categoria})
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const {props} = await getCategoriaProps({ params, categoria })
  return {props}
}

/**
* Se desea mantener el minimo codigo posible en este componente ya que sera
* copiado el mismo en las otras categorias.
*/
export default function Pagina(props) {
  return <Categoria props={props} />
}
