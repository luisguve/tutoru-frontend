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
      addToast("Obteniendo IDs de ejercicios comprados", { appearance: 'info' })
      setLoading(true)
      try {
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

      } catch (err) {
        console.log(err)
        addToast("No se pudieron obtener los IDs de los ejercicios comprados", { appearance: 'error' })
      }
      setLoading(false)
    }
    if (token) {
      getEjercicios(token)
    }
  }, [token])
  return (
     <EjerciciosContext.Provider value={{ IDsEjercicios, loadingIDsEjercicios }}>
       {children}
     </EjerciciosContext.Provider>
  )
}

export default EjerciciosContext