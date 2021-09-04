import Ejercicio from "./Ejercicio"

/**
* Este componente muestra los ejercicios que recibe como contenido.
* 
* Los ejercicios listados son agrupados por categoria.
* 
* El parametro irSolucion establece si en vez del boton de compra,
* directamente se muestra el Link a la solucion del ejercicio.
*/
const ListaEjercicios = ({ muestras, irSolucion }) => {

  const clasificados = muestras.reduce((grupos, e) => {
    // Establece el nombre de la categoria para títulos
    const categoriaActual = e.categoria.Titulo_normal

    if (!grupos[categoriaActual]) {
      grupos[categoriaActual] = []
    }

    grupos[categoriaActual].push(e)
    return grupos
  }, {})

  const ejerciciosClasificados = []

  for (const categoria in clasificados) {
    const grupo = clasificados[categoria].map(e => {
      return (
        <li key={e.slug}>
          <Ejercicio
            contenido={e}
            enSeccion={true}
            irSolucion={irSolucion}
          />
        </li>
      )
    })
    const contenedorGrupo = (
      <div className="mt-2" key={categoria}>
        <h3 className="text-center">{categoria}: {grupo.length} ejercicios</h3>
        <ul>
          {grupo}
        </ul>
      </div>
    )
    ejerciciosClasificados.push(contenedorGrupo)
  }

  return ejerciciosClasificados
}

export default ListaEjercicios