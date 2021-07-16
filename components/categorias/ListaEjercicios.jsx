import Ejercicio from "./Ejercicio"
import categorias from "../../lib/categorias"

/*
* Este componente muestra los ejercicios que recibe en children.
* 
* Los ejercicios listados son agrupados por categoria.
* 
* El parametro irSolucion establece si en vez del boton de compra,
* directamente se muestra el Link a la solucion del ejercicio.
*/
const ListaEjercicios = ({ contenido: ejercicios, irSolucion }) => {

  const clasificados = ejercicios.reduce((grupos, e) => {
    // Establece el nombre de la categoria para títulos
    const categoriaActual = categorias[e.categoria]

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
      <div key={categoria}>
        <h3 style={{textAlign: "center"}}>
          {categoria}
        </h3>
        <ul>
          {grupo}
        </ul>
      </div>
    )
    ejerciciosClasificados.push(contenedorGrupo)
  }

  return <>{ejerciciosClasificados}</>
}

export default ListaEjercicios