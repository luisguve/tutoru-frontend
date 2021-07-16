import { useContext, useState, useEffect } from "react"
import { useToasts } from "react-toast-notifications"
import Link from "next/link"

import AuthContext from "../../context/AuthContext"
import EjerciciosContext from "../../context/EjerciciosContext"
import BotonComprar from "../BotonComprar"
import { API_URL } from "../../lib/urls"

/*
* Este Hook verifica si el ejercicio esta en la lista de ejercicios que ha
* comprado el usuario, y si está, muestra el link para pide la solucion a
* ver la solucion o directamente la pide a Strapi, dependiendo del parametro
* enSeccion.
*/
const useSolucion = (id, enSeccion, irSolucion) => {
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
        const solucionUrl = `${API_URL}/solucion/${id}`
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

/*
* Este componente muestra la descripcion del ejercicio y un boton de compra
* o un link a su solucion si el usuario ha comprado el ejercicio
* o su precio junto con un link a login si el usuario no ha iniciado sesion.
* 
* Muestra la solucion al ejercicio o un link a su solucion dependiendo de la
* prop enSeccion y de si el usuario tiene acceso a este ejercicio, o 
* directamente de la prop irSolucion.
*/
const Ejercicio = ({ contenido, enSeccion, irSolucion }) => {

  const { id, slug, titulo, categoria, descripcion, descripcion_corta, precio } = contenido

  const {
    solucionDisponible,
    solucion: data,
    loadingSolucion
  } = useSolucion(id, enSeccion, irSolucion)

  const { loadingIDsEjercicios } = useContext(EjerciciosContext)
  const { user, loadingUser } = useContext(AuthContext)

  const ejercicioURL = `/${categoria}/${slug}`

  return (
    <div>
      {
        enSeccion ? // Estamos en la pagina de la categoria (list)
          <div>
            <Link href={ejercicioURL}><a>{titulo}</a></Link>
            <div dangerouslySetInnerHTML={{ __html: descripcion_corta}}></div>
          </div>
        : // Estamos en la pagina del ejercicio (single page)
          <div>
            <h2>{titulo}</h2>
            <div dangerouslySetInnerHTML={{ __html: descripcion}}></div>
          </div>
      }
      <div>
        {
          (!user && !loadingUser) ? // No hay sesion activa
            <div>
              <strong>${precio}</strong>
              {
                !enSeccion &&
                <div>
                  <Link href="/login">
                    <a>Inicia sesión para comprar este ejercicio</a>
                  </Link>
                </div>
              }
            </div>
          :
            (loadingUser || loadingIDsEjercicios) && !solucionDisponible ?
              // El usuario esta cargando
              <div>
                <strong>${precio}</strong> 
                <p>Cargando usuario...</p>
              </div>
            :
              solucionDisponible ?
                // El usuario adquirió este ejercicio
                enSeccion ?
                  // Estamos en la seccion (list)
                  <div>
                    <Link href={`${ejercicioURL}#solucion`}>
                      <a>Ver solución</a>
                    </Link>
                  </div>
                :
                  // Estamos en la propia pagina del ejercicio
                  loadingSolucion ?
                    <h3 style={{textAlign: "center"}}>Cargando solucion...</h3>
                  :
                    data &&
                    <>
                      <h3 id="solucion" style={{textAlign: "center"}}>Solucion</h3>
                      <div dangerouslySetInnerHTML={{ __html: data.solucion}}></div>
                    </>
              :
                // El usuario no tiene acceso a la solucion de este ejercicio
                <div>
                  <p><strong>${precio}</strong></p>
                  <div><BotonComprar ejercicio={contenido} /></div>
                </div>
        }
      </div>
    </div>
  )
}

export default Ejercicio