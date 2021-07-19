import { createContext, useEffect, useState } from "react"

const CarritoContext = createContext()

export const CarritoProvider = props => {
  const [articulos, setArticulos] = useState([])
  const [articulosIDs, setArticulosIDs] = useState([])

  const agregar = articulo => {
    const nuevosArticulos = [...articulos, articulo]
    setArticulos(nuevosArticulos)
    const nuevosIDs = [...articulosIDs, {id: articulo.id}]
    setArticulosIDs(nuevosIDs)
    guardarSesion(nuevosArticulos, nuevosIDs)
  }

  const quitar = articulo => {
    const nuevosArticulos = articulos.filter(a => a.id !== articulo.id)
    setArticulos(nuevosArticulos)
    const nuevosIDs = articulosIDs.filter(a => a.id !== articulo.id)
    setArticulosIDs(nuevosIDs)
    guardarSesion(nuevosArticulos, nuevosIDs)
  }

  const limpiar = () => {
    setArticulos([])
    setArticulosIDs([])
    guardarSesion([], [])
  }

  useEffect(() => {
    const { data: carritoData } = obtenerSesion()
    if (carritoData) {
      const { articulos, articulosIDs } = carritoData
      if (articulos) {
        setArticulos(articulos)
      }
      if (articulosIDs) {
        setArticulosIDs(articulosIDs)
      }
    }
  }, [])

  return (
    <CarritoContext.Provider value={{articulos, articulosIDs , agregar, quitar, limpiar}}>
      {props.children}
    </CarritoContext.Provider>
  )
}

export default CarritoContext

const obtenerSesion = () => {
  if (typeof(Storage) !== undefined) {
    const data = JSON.parse(localStorage.getItem("data"))
    if (data) {
      return {
        data: data.carrito
      }
    }
  }
  return null
}
const guardarSesion = (articulos, articulosIDs) => {
  if (typeof(Storage) !== undefined) {
    const data = JSON.parse(localStorage.getItem("data"))
    localStorage.setItem("data", JSON.stringify({
      ...data,
      carrito: {
        articulos,
        articulosIDs
      }
    }))
  }
}
const limpiarSesion = () => {
  if (typeof(Storage) !== undefined) {
    const data = JSON.parse(localStorage.getItem("data"))
    delete data.carrito
    localStorage.setItem("data", JSON.stringify(data))
  }
}
