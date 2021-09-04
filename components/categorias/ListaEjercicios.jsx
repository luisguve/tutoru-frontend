import Ejercicio from "./Ejercicio"

/**
* Este componente muestra los ejercicios que recibe como muestras.
* 
* El parametro irSolucion establece si en vez del boton de compra,
* directamente se muestra el Link a la solucion del ejercicio.
*/
const ListaEjercicios = ({ muestras, irSolucion }) => {

  const grupo = muestras.map(e => {
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

  return <ul>{grupo}</ul>
}

export default ListaEjercicios