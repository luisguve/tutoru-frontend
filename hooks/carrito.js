import { useContext, useState, useEffect } from "react"

import CarritoContext from "../context/CarritoContext"

// Este hook retorna los articulos en el carrito como una lista, junto con
// el precio total a pagar
export const useInformacion = () => {
  const { articulos } = useContext(CarritoContext)
  const [informacion, setInformacion] = useState(null)
  useEffect(() => {
    const total = articulos.reduce((suma, articulo) => suma + articulo.precio, 0)
    setInformacion({
      articulos,
      total: total.toFixed(2)
    })
  }, [articulos])

  return {
    informacion
  }
}
