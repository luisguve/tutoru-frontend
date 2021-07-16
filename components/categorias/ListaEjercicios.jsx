import Ejercicio from "./Ejercicio"

/*
* Este componente muestra los ejercicios que recibe en children.
* El parametro irSolucion establece si en vez del boton de compra,
* directamente se muestra el Link a la solucion del ejercicio.
*/
const ListaEjercicios = ({ children: ejercicios, irSolucion }) => {

  const lista = ejercicios.map(e => {
    return (
      <li key={e.slug}>
        <Ejercicio contenido={e} enSeccion={true} irSolucion={irSolucion} />
      </li>
    )
  })

  return (
    <ul>
      {lista}
    </ul>
  )
}

export default ListaEjercicios