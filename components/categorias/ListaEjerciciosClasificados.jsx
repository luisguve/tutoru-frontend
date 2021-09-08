import ListaEjercicios from "./ListaEjercicios"

/**
* Este componente muestra los ejercicios que recibe como muestras.
* 
* Los ejercicios listados son agrupados por categoria.
* 
* El parametro irSolucion establece si en vez del boton de compra,
* directamente se muestra el Link a la solucion del ejercicio.
*/
const ListaEjerciciosClasificados = ({ muestras, irSolucion }) => {

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
    const grupo = <ListaEjercicios
      muestras={clasificados[categoria]}
      irSolucion={irSolucion}
    />
    // console.log(categoria)
    const contenedorGrupo = (
      <div className="mt-2" key={categoria}>
        <h3 className="text-center">{categoria}: {clasificados[categoria].length} ejercicios</h3>
        {grupo}
      </div>
    )
    ejerciciosClasificados.push(contenedorGrupo)
  }

  return ejerciciosClasificados
}

export default ListaEjerciciosClasificados