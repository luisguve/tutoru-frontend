import { useRouter } from "next/router"

import Subcategorias from "./Subcategorias"
import ListaEjercicios from "./ListaEjercicios"

/**
* Este componente muestra una lista de ejercicios dentro de una categoria asi como su
* indice con subcategorias.
*/
export default function PaginaCategoria(props) {
  const {
    titulo,
    subcategorias,
    resumen
  } = props
  const router = useRouter()

  return (
    <section>
      <h3>{titulo}: {resumen.q} ejercicios</h3>
      {
        (subcategorias.length > 0) &&
        <div className="my-4">
          <Subcategorias parentUrl={router.asPath} subcategorias={subcategorias} />
        </div>
      }
      <ListaEjercicios
        irSolucion={false}
        muestras={resumen.muestras}
      />
    </section>
  )
}
