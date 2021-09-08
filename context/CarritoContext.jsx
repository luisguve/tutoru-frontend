import { createContext, useEffect, useContext, useState } from "react"

import AuthContext from "./AuthContext"
import EjerciciosContext from "./EjerciciosContext"

import styles from "../styles/Carrito.module.scss"

const CarritoContext = createContext()

export const CarritoProvider = props => {
  const { user } = useContext(AuthContext)
  const { IDsEjercicios: comprados } = useContext(EjerciciosContext)
  const [articulos, setArticulos] = useState([])
  const [articulosIDs, setArticulosIDs] = useState([])

  const [paso1, setPaso1] = useState(false)
  const [paso2, setPaso2] = useState(false)
  const [classContenedorCarrito, setClass] = useState(styles.Contenedor__Carrito)

  const agregar = articulo => {
    for (let i = articulosIDs.length - 1; i >= 0; i--) {
      if (articulosIDs[i].id === articulo.id) return
    }
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
    if (user) {
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
    } else {
      setArticulos([])
      setArticulosIDs([])
    }
  }, [user])
  useEffect(() => {
    // Elimina los ejercicios que ha comprado el usuario del carrito de compras.
    if (comprados) {
      articulosIDs.map(a => {
        if (comprados.includes(c => c.id === a.id)) {
          quitar(a)
        }
      })
    }
  }, [comprados])

  return (
    <CarritoContext.Provider
      value={{
        articulos,
        articulosIDs,
        agregar,
        quitar,
        limpiar,
        paso1,
        paso2,
        setPaso1,
        setPaso2,
        classContenedorCarrito,
        setClass,
      }}
    >
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
  return {}
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
