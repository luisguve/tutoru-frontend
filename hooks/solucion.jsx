import { useState, useEffect, useContext } from "react"
import { useToasts } from "react-toast-notifications"

import AuthContext from "../context/AuthContext"
import EjerciciosContext from "../context/EjerciciosContext"
import { STRAPI } from "../lib/urls"

/**
* Este Hook verifica si el ejercicio esta en la lista de ejercicios que ha
* comprado el usuario, y si está, muestra el link para pide la solucion a
* ver la solucion o directamente la pide a Strapi, dependiendo del parametro
* enSeccion.
*/
export const useSolucion = (id, enSeccion, irSolucion) => {
  const [solucionDisponible, setSolucionDisponible] = useState(false)
  const [loadingSolucion, setLoadingSolucion] = useState(false)
  const [solucion, setSolucion] = useState(null)

  const { token } = useContext(AuthContext)
  const { IDsEjercicios } = useContext(EjerciciosContext)
  const { addToast } = useToasts()

  useEffect(() => {
    const fetchSolucion = async (id, token) => {
      try {
        addToast("Obteniendo solucion", { appearance: "info" })
        const solucionUrl = `${STRAPI}/solucion/${id}`
        const solucion_res = await fetch(solucionUrl, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        const data = await solucion_res.json()
        setSolucion(data)
        if (data.statusCode && data.statusCode !== 200) {
          addToast(data.message, { appearance: "error" })
        }
      } catch (err) {
        addToast(err.toString(), { appearance: "error" })
      }
      setLoadingSolucion(false)
    }

    if (irSolucion) {
      setSolucionDisponible(true)
      return
    }

    // Verifica si el usuario adquirió el ejercicio
    if (IDsEjercicios && IDsEjercicios.length) {
      if (IDsEjercicios.includes(id)) {
        // Descargar la solucion si estamos en la propia pagina del ejercicio
        // (single page)
        if (!enSeccion) {
          setLoadingSolucion(true)
          fetchSolucion(id, token)
        }
        setSolucionDisponible(true)
      }
    }
  }, [IDsEjercicios, id])

  return {
    solucionDisponible,
    solucion,
    loadingSolucion
  }
}
