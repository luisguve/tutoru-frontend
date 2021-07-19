import { createContext, useState } from "react"

const CarritoContext = createContext()

export const CarritoProvider = props => {
  const [articulos, setArticulos] = useState([])
  const [articulosIDs, setArticulosIDs] = useState([])

  const agregar = articulo => {
    setArticulos([...articulos, articulo])
    setArticulosIDs([...articulosIDs, {id: articulo.id}])
  }

  const quitar = articulo => {
    setArticulos(articulos.filter(a => a.id !== articulo.id))
    setArticulosIDs(articulosIDs.filter(a => a.id !== articulo.id))
  }

  const limpiar = () => {
    setArticulos([])
    setArticulosIDs([])
  }

  return (
    <CarritoContext.Provider value={{articulos, articulosIDs , agregar, quitar, limpiar}}>
      {props.children}
    </CarritoContext.Provider>
  )
}

export default CarritoContext
