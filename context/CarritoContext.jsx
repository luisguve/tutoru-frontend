import { createContext, useEffect, useContext, useState } from "react"

import AuthContext from "./AuthContext"
import ArticulosContext from "./ArticulosContext"

import styles from "../styles/Carrito.module.scss"

const CarritoContext = createContext()

export const CarritoProvider = props => {
  const { user } = useContext(AuthContext)
  const {
    IDsEjercicios: ejerciciosComprados,
    IDsCursos: cursosComprados
  } = useContext(ArticulosContext)

  const [articulos, setArticulos] = useState(() => {
    if (user) {
      const { data: carritoData } = obtenerSesion()
      if (carritoData) {
        const { articulos } = carritoData
        if (articulos) {
          return articulos
        }
      }
    }
    return []
  })
  const [articulosIDs, setArticulosIDs] = useState(() => {
    if (user) {
      const { data: carritoData } = obtenerSesion()
      if (carritoData) {
        const { articulosIDs } = carritoData
        if (articulosIDs) {
          return articulosIDs
        }
      }
    }
    return []
  })

  const [paso1, setPaso1] = useState(false)
  const [paso2, setPaso2] = useState(false)
  const [classContenedorCarrito, setClass] = useState(styles.Contenedor__Carrito)

  const agregar = art => {
    const articulo = JSON.parse(JSON.stringify(art))
    let prefijo = ""
    // Coloca un prefijo para diferenciar los ejercicios de los cursos.
    if (articulo.videos) {
      prefijo = "curso--"
    }
    articulo.id = prefijo.concat(articulo.id)
    for (let i = articulosIDs.length - 1; i >= 0; i--) {
      if (articulosIDs[i].id === prefijo.concat(articulo.id)) return
    }
    const nuevosArticulos = [...articulos, articulo]
    setArticulos(nuevosArticulos)
    const nuevosIDs = [...articulosIDs, {id: articulo.id}]
    setArticulosIDs(nuevosIDs)
    guardarSesion(nuevosArticulos, nuevosIDs)
  }

  const quitar = articulo => {
    let articuloID = articulo.id
    // Coloca un prefijo para diferenciar los ejercicios de los cursos.
    if (
      articulo.videos && !articulo.id.toString().startsWith("curso--")
    ) {
      articuloID = "curso--".concat(articulo.id)
    }
    const nuevosArticulos = articulos.filter(a => a.id != articuloID)
    setArticulos(nuevosArticulos)
    const nuevosIDs = articulosIDs.filter(a => a.id != articuloID)
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
    // Elimina los articulos que ha comprado el usuario del carrito de compras.
    if (ejerciciosComprados) {
      articulosIDs.map(a => {
        if (ejerciciosComprados.includes(c => c.id === a.id)) {
          quitar(a)
        }
      })
    }
    if (cursosComprados) {
      articulosIDs.map(a => {
        if (cursosComprados.includes(a.id)) {
          quitar(a)
        }
      })
    }
  }, [ejerciciosComprados, cursosComprados])

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
