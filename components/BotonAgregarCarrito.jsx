import { useContext, useState, useEffect } from "react"

import AuthContext from "../context/AuthContext"
import CarritoContext from "../context/CarritoContext"

export default function BotonComprar({ ejercicio }) {
  const { user, loadingUser } = useContext(AuthContext)
  const { articulosIDs, agregar, quitar } = useContext(CarritoContext)
  const [agregado, setAgregado] = useState(() => articulosIDs.includes(ejercicio.id))
  const handleAgregarCarrito = () => {
    agregar(ejercicio)
    setAgregado(true)
  }
  const handleQuitarCarrito = () => {
    quitar(ejercicio)
    setAgregado(false)
  }
  if (!user) {
    return <p>Inicia sesion para comprar este ejercicio</p>
  }
  // Este hook cambia el valor del estado "agregado" a false si se ha quitado
  // este ejercicio desde el carrito de compras.
  useEffect(() => {
    if (!articulosIDs.includes(ejercicio.id)) {
      setAgregado(false)
    }
  }, [articulosIDs])
  return (
    agregado ?
      <button onClick={handleQuitarCarrito}>Quitar del carrito</button>
      :
      <button onClick={handleAgregarCarrito}>Agregar al carrito</button>
  )
}