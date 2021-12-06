import { useState, useEffect, useContext } from "react"
import { useToasts } from "react-toast-notifications"

import AuthContext from "../context/AuthContext"
import ArticulosContext from "../context/ArticulosContext"
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
  const { IDsEjercicios } = useContext(ArticulosContext)
  const { addToast } = useToasts()

  useEffect(() => {
    const fetchSolucion = async (id, token) => {
      setLoadingSolucion(true)
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

/*
datosCursoUsuario:
{
  "clasesCompletadas": null || [1,2,9], // En caso de que el usuario este tomando este curso
  "estudiantes": 1,
  "reviews": null || [
    {
      "id": 1,
      "review": 1,
      "usuario": 3,
      "comentario": "Este curso es muy recomendable",
      "calificacion": 5,
      "created_by": 1,
      "updated_by": 1,
      "created_at": "2021-12-01T13:42:06.510Z",
      "updated_at": "2021-12-01T13:42:06.562Z"
    }
  ],
  rating: 5 || 0,
  "preguntas": null || [
    {
      "id": 1,
      "contenido": "Pregunta acerca de este curso",
      "curso": 1,
      "autor": 3,
      "respuestas": []
    }
  ]
}*/
/**
* Este Hook obtiene de Strapi los reviews de todos los usuarios para el curso
* con el id recibido como parámetro.
* Igualmente verifica si el curso está en la lista de cursos que ha
* comprado el usuario, y si está, retorna la informacion del usuario
* asociada con el curso.
*/
export const useCurso = id => {
  const [datosCursoUsuario, setDatosCursoUsuario] = useState(null)
  const [loadingCurso, setLoadingCurso] = useState(false)

  const { token } = useContext(AuthContext)
  const { IDsCursos } = useContext(ArticulosContext)
  const { addToast } = useToasts()

  useEffect(() => {
    const fetchCurso = async (id, token) => {
      setLoadingCurso(true)
      try {
        addToast("Obteniendo informacion de curso", { appearance: "info" })
        const cursoUrl = `${STRAPI}/masterclass/usuario-curso/${id}`
        const options = {}
        if (token) {
          options.headers = {
            "Authorization": `Bearer ${token}`
          }
        }
        const curso_res = await fetch(cursoUrl, options)
        const data = await curso_res.json()
        setDatosCursoUsuario(data)
        if (data.statusCode && data.statusCode !== 200) {
          addToast(data.message, { appearance: "error" })
        }
      } catch (err) {
        console.log(err)
        addToast(err.toString(), { appearance: "error" })
      }
      setLoadingCurso(false)
    }
    fetchCurso(id, token)
  }, [id])

  return {
    datosCursoUsuario,
    loadingCurso
  }
}

export const useCursoComprado = id => {
  const [cursoComprado, setCursoComprado] = useState(false)
  const { IDsCursos } = useContext(ArticulosContext)

  useEffect(() => {
    // Verifica si el usuario adquirió el curso
    if (IDsCursos && IDsCursos.length) {
      if (IDsCursos.includes("curso--".concat(id))) {
        setCursoComprado(true)
        return
      }
    }
    setCursoComprado(false)
  }, [IDsCursos, id])

  return cursoComprado
}

export const useClasesCompletadas = id => {
  const [clasesCompletadas, setClasesCompletadas] = useState([])
  const { token } = useContext(AuthContext)

  // Obtener las clases completadas
  useEffect(() => {
    const fetchCurso = async (id, token) => {
      try {
        const url = `${STRAPI}/masterclass/usuario-curso/${id}/clases-completadas`
        const options = {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
        const curso_res = await fetch(url, options)
        const data = await curso_res.json()
        setClasesCompletadas(data.clasesCompletadas)
      } catch (err) {
        console.log(err)
      }
    }
    if (token) {
      fetchCurso(id, token)
    }
  }, [id, token])
  return {
    clasesCompletadas
  }
}
