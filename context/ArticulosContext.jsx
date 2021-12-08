import { createContext, useContext, useState, useEffect } from "react"
import { useToasts } from "react-toast-notifications"

import AuthContext from "./AuthContext"
import { STRAPI } from "../lib/urls"

const ArticulosContext = createContext()

export function ArticulosProvider({children}) {
  const [loadingIDsArticulos, setLoading] = useState(false)
  const [IDsArticulos, setIDsArticulos] = useState({ejercicios: null, cursos: null})
  const { addToast } = useToasts()

  const { user, token } = useContext(AuthContext)
  // Obtiene los IDs de los cursos y ejercicios que ha adquirido este usuario
  const getArticulos = async token => {
    const { data: IDs } = obtenerSesion()
    if (IDs) {
      setIDsArticulos(IDs)
      if (!IDs || (!IDs.ejercicios.length && !IDs.cursos.length)) {
        console.log("Ningún articulo comprado")
        // addToast("Ningún articulo comprado", { appearance: 'info' })
      }
    }
    // Proceder a pedir los IDs de articulos comprados
    try {
      console.log("Obteniendo IDs de articulos comprados")
      // addToast("Obteniendo IDs de articulos comprados", { appearance: 'info' })
      setLoading(true)

      const articulosUrl = `${STRAPI}/user-data/comprados-ids`
      const ejercicios_res = await fetch(articulosUrl, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      const articulos = await ejercicios_res.json()

      if (
        (!articulos.ejercicios || !articulos.ejercicios.length) &&
        (!articulos.cursos || !articulos.cursos.length)
      ) {
        console.log("Ningun articulo comprado")
        // addToast("Ningun articulo comprado", { appearance: 'info' })
      } else {
        let texto = `${articulos.ejercicios.length} ejercicios comprados`
        if (articulos.ejercicios.length === 1) {
          texto = "1 ejercicio comprado"
        }
        switch(articulos.cursos.length) {
          case 0: break;
          case 1:
          texto += " y 1 curso comprado"
          break;
          default:
          texto += ` y ${articulos.cursos.length} cursos comprados`
        }
        console.log(texto)
        // addToast(texto, { appearance: 'info' })
      }
      // Agregar un prefijo a los IDs de los cursos
      articulos.cursos = articulos.cursos.map(ID => "curso--" + ID)

      setIDsArticulos(articulos)
      guardarSesion(articulos)
    } catch (err) {
      console.log("No se pudieron obtener los IDs de los articulos comprados")
      console.log(err)
      // addToast("No se pudieron obtener los IDs de los articulos comprados", { appearance: 'error' })
    }
    setLoading(false)
  }
  useEffect(() => {
    if (user && token) {
      // Intenta obtener los IDs de los ejercicios del local storage.
      // Igualmente pide de todas maneras los IDs de articulos comprados.
      getArticulos(token)
    }
  }, [user, token])
  return (
    <ArticulosContext.Provider value={{
      IDsEjercicios: IDsArticulos.ejercicios,
      IDsCursos: IDsArticulos.cursos,
      loadingIDsArticulos,
      limpiar: limpiarSesion
    }}>
      {children}
    </ArticulosContext.Provider>
  )
}

export default ArticulosContext

const obtenerSesion = () => {
  if (typeof(Storage) !== undefined) {
    const data = JSON.parse(localStorage.getItem("data"))
    if (data) {
      return {
        data: data.articulosIDs
      }
    }
  }
  return {}
}
const guardarSesion = IDs => {
  if (typeof(Storage) !== undefined) {
    const data = JSON.parse(localStorage.getItem("data"))
    localStorage.setItem("data", JSON.stringify({
      ...data,
      articulosIDs: IDs
    }))
  }
}
export const limpiarSesion = () => {
  if (typeof(Storage) !== undefined) {
    const data = JSON.parse(localStorage.getItem("data"))
    delete data.articulosIDs
    localStorage.setItem("data", JSON.stringify(data))
  }
}
