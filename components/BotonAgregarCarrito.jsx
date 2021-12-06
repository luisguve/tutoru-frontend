import { useContext, useState, useEffect } from "react"

import AuthContext from "../context/AuthContext"
import CarritoContext from "../context/CarritoContext"

export default function BotonComprar({ articulo }) {
  const { user } = useContext(AuthContext)
  const { articulosIDs, agregar, quitar } = useContext(CarritoContext)
  // Coloca un prefijo para diferenciar los ejercicios de los cursos.
  let prefijo = ""
  if (articulo.videos) {
    prefijo = "curso--"
  }
  const [agregado, setAgregado] = useState(() => {
    for (let i = articulosIDs.length - 1; i >= 0; i--) {
      if (articulosIDs[i].id === prefijo.concat(articulo.id)) return true
    }
  })
  const handleAgregarCarrito = () => {
    agregar(articulo)
    setAgregado(true)
  }
  const handleQuitarCarrito = () => {
    quitar(articulo)
    setAgregado(false)
  }
  // Este hook cambia el valor del estado "agregado" a false si se ha quitado
  // este articulo desde el carrito de compras.
  useEffect(() => {
    let agg = false
    for (let i = articulosIDs.length - 1; i >= 0; i--) {
      if (articulosIDs[i].id === prefijo.concat(articulo.id)) {
        agg = true
        break
      }
    }
    setAgregado(agg)
  }, [articulosIDs])
  if (!user) {
    return <p>Inicia sesion para comprar este articulo</p>
  }
  return (
    agregado ?
      <button
        className="btn btn-success"
        onClick={handleQuitarCarrito}
      >Quitar del carrito</button>
      :
      <button
        className="btn btn-success"
        onClick={handleAgregarCarrito}
      >Agregar al carrito</button>
  )
}