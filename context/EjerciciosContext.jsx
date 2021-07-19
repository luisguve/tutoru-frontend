import { createContext, useContext, useState, useEffect } from "react"
import { useToasts } from "react-toast-notifications"

import AuthContext from "./AuthContext"
import { API_URL } from "../lib/urls"

const EjerciciosContext = createContext()

export function EjerciciosProvider({children}) {
  const [loadingIDsEjercicios, setLoading] = useState(false)
  const [IDsEjercicios, setIDsEjercicios] = useState(null)
  const { addToast } = useToasts()

  const { token } = useContext(AuthContext)
  useEffect(() => {
    // Obtiene los IDs de los ejercicios que ha adquirido este usuario
    const getEjercicios = async token => {
      try {
        addToast("Obteniendo IDs de ejercicios comprados", { appearance: 'info' })
        setLoading(true)

        const ejerciciosUrl = `${API_URL}/ejercicios/comprados-ids`
        const ejercicios_res = await fetch(ejerciciosUrl, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        const ejercicios = await ejercicios_res.json()

        if (!ejercicios || !ejercicios.length) {
          addToast("Ningún ejercicio comprado", { appearance: 'info' })
        } else {
          let texto = `${ejercicios.length} ejercicios comprados`
          if (ejercicios.length === 1) {
            texto = "1 ejercicio comprado"
          }
          addToast(texto, { appearance: 'info' })
        }

        setIDsEjercicios(ejercicios)
        guardarSesion(ejercicios)

      } catch (err) {
        console.log(err)
        addToast("No se pudieron obtener los IDs de los ejercicios comprados", { appearance: 'error' })
      }
      setLoading(false)
    }
    if (token) {
      // Intenta obtener los IDs de los ejercicios del local storage
      const { data: ejerciciosData } = obtenerSesion()
      let idsRecuperados = false
      if (ejerciciosData) {
        const { IDs } = ejerciciosData
        setIDsEjercicios(IDs)
        idsRecuperados = true
        if (!IDs || !IDs.length) {
          addToast("Ningún ejercicio comprado", { appearance: 'info' })
        }
      } else {
        getEjercicios(token)
      }
    }
  }, [token])
  return (
     <EjerciciosContext.Provider value={{ IDsEjercicios, loadingIDsEjercicios }}>
       {children}
     </EjerciciosContext.Provider>
  )
}

export default EjerciciosContext

const obtenerSesion = () => {
  if (typeof(Storage) !== undefined) {
    const data = JSON.parse(localStorage.getItem("data"))
    if (data) {
      return {
        data: data.ejerciciosIDs
      }
    }
  }
  return null
}
const guardarSesion = IDs => {
  if (typeof(Storage) !== undefined) {
    const data = JSON.parse(localStorage.getItem("data"))
    localStorage.setItem("data", JSON.stringify({
      ...data,
      ejerciciosIDs: {
        IDs
      }
    }))
  }
}
const limpiarSesion = () => {
  if (typeof(Storage) !== undefined) {
    const data = JSON.parse(localStorage.getItem("data"))
    delete data.ejerciciosIDs
    localStorage.setItem("data", JSON.stringify(data))
  }
}
