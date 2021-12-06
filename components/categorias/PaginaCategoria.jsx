import { useRouter } from "next/router"

import Subcategorias from "./Subcategorias"
import ListaEjercicios from "./ListaEjercicios"
import { ListaCursosCards } from "../ListaCursos"

/**
* Este componente muestra una lista de ejercicios dentro de una categoria asi como su
* indice con subcategorias.
*/
export default function PaginaCategoria(props) {
  const {
    titulo,
    idCategoria,
    subcategorias,
    resumen
  } = props
  const router = useRouter()

  let tituloResumen = titulo
  if (resumen.q > 0) {
    const label = resumen.q > 1 ? "ejercicios" : "ejercicio"
    tituloResumen += `: ${resumen.q} ${label}`
  }
  if (resumen.cursos.length > 0) {
    const label = resumen.cursos.length > 1 ? "cursos" : "curso"
    if (resumen.q > 0) {
      tituloResumen += `, ${resumen.cursos.length} ${label}`
    } else {
      tituloResumen += `: ${resumen.cursos.length} ${label}`
    }
  }

  return (
    <section>
      <h2 className="text-center mt-4 mt-lg-1 mb-2 mb-lg-5">{tituloResumen}</h2>
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
      {
        (resumen.cursos.length > 0) &&
        <ListaCursosCards categoria={idCategoria} cursos={resumen.cursos} />
      }
    </section>
  )
}
