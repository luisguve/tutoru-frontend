import { useRouter } from "next/router"

import Subcategorias from "./Subcategorias"
import ListaEjercicios from "./ListaEjercicios"

/**
* Este componente muestra una lista de ejercicios dentro de una categoria asi como su
* indice con subcategorias.
*/
export default function PaginaCategoria(props) {
  const {
    subcategorias,
    muestras
  } = props
  const router = useRouter()
/*
  const listaEjercicios = muestras.map(e => {
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
  })*/

  return (
    <section>
      {
        (subcategorias.length > 0) &&
        <div className="mt-4">
          <Subcategorias parentUrl={router.asPath} subcategorias={subcategorias} />
        </div>
      }
      <ListaEjercicios
        irSolucion={false}
        muestras={muestras}
      />
    </section>
  )
}
