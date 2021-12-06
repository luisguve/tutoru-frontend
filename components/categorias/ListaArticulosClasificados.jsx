import Link from "next/link"

import ListaEjercicios from "./ListaEjercicios"

/**
* Este componente muestra los ejercicios que recibe como muestras,
* asi como los cursos.
* 
* Los ejercicios y los cursos listados ason agrupados por categoria.
* 
* El parametro irSolucion establece si en vez del boton de compra,
* directamente se muestra el Link a la solucion del ejercicio.
*/
const ListaArticulosClasificados = ({ muestras, cursos, irSolucion }) => {

  const ejerciciosClasificados = muestras.reduce((grupos, e) => {
    // Establece el nombre de la categoria para títulos
    const categoriaActual = e.categoria.Titulo_normal

    if (!grupos[categoriaActual]) {
      grupos[categoriaActual] = []
    }

    grupos[categoriaActual].push(e)
    return grupos
  }, {})

  const cursosClasificados = cursos.reduce((grupos, c) => {
    // Establece el nombre de la categoria para títulos
    const categoriaActual = c.categoria.Titulo_normal

    if (!grupos[categoriaActual]) {
      grupos[categoriaActual] = []
    }

    grupos[categoriaActual].push(c)
    return grupos
  }, {})

  const articulosClasificados = []

  for (const categoria in ejerciciosClasificados) {
    const grupoEjercicios = <ListaEjercicios
      muestras={ejerciciosClasificados[categoria]}
      irSolucion={irSolucion}
    />
    let grupoCursos = null
    const totalEjs = ejerciciosClasificados[categoria].length
    let totalCursos = 0
    if (cursosClasificados[categoria]) {
      grupoCursos = <ListaCursos
        cursos={cursosClasificados[categoria]}
      />
      totalCursos = cursosClasificados[categoria].length
      // Estos cursos vienen con ejercicios y ya estan siendo listados
      delete cursosClasificados[categoria]
    }
    const contenedorGrupo = (
      <div className="mt-2" key={categoria}>
        <h3 className="text-center">
          {categoria}: {totalEjs} ejercicio{totalEjs > 1 ? "s" : ""}
          {totalCursos ? `, ${totalCursos} curso`+ (totalCursos > 1 ? "s" : "") : ""}
        </h3>
        {grupoEjercicios}
        {grupoCursos}
      </div>
    )
    articulosClasificados.push(contenedorGrupo)
  }
  // Listar los cursos que vienen sin ejercicios
  for (const categoria in cursosClasificados) {
    const grupoCursos = <ListaCursos
      cursos={cursosClasificados[categoria]}
    />
    const totalCursos = cursosClasificados[categoria].length
    const contenedorGrupo = (
      <div className="mt-2" key={categoria}>
        <h3 className="text-center">
          {`${categoria}: ${totalCursos} curso`+ (totalCursos > 1 ? "s" : "")}
        </h3>
        {grupoCursos}
      </div>
    )
    articulosClasificados.push(contenedorGrupo)
  }

  return articulosClasificados
}

const ListaCursos = ({ cursos }) => {
  const listaCursos = cursos.map(c => {
    return (
      <li className="mt-2" key={`${c.id}-${c.titulo}`}>
        <Link href={`/${c.categoria.Titulo_url}/cursos/${c.slug}`}>
          <a>Curso: {c.titulo}</a>
        </Link>
        <p className="mb-0">{c.descripcion}</p>
        <Link href={`/${c.categoria.Titulo_url}/cursos/${c.slug}/ver`}>
          <a>Ver curso</a>
        </Link>
      </li>
    )
  })
  return <ul className="list-unstyled mb-0">{listaCursos}</ul>
}

export default ListaArticulosClasificados
