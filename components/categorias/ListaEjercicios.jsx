import Ejercicio from "./Ejercicio"

const ListaEjercicios = ({ children: ejercicios }) => {

  const lista = ejercicios.map(e => {
    return (
      <li key={e.slug}>
        <Ejercicio contenido={e} enSeccion={true} />
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