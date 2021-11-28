import { useContext, useState } from "react"
import { useToasts } from "react-toast-notifications"
import Link from "next/link"

import AuthContext from "../../context/AuthContext"
import EjerciciosContext from "../../context/EjerciciosContext"
import BotonAgregarCarrito from "../BotonAgregarCarrito"
import utilStyles from "../../styles/utils.module.css"
import { useSolucion } from "../../hooks/solucion"

/**
* Este componente muestra la descripcion del ejercicio y un boton de compra
* o un link a su solucion si el usuario ha comprado el ejercicio
* o su precio junto con un link a login si el usuario no ha iniciado sesion.
* 
* Muestra la solucion al ejercicio o un link a su solucion dependiendo de la
* prop enSeccion y de si el usuario tiene acceso a este ejercicio, o 
* directamente de la prop irSolucion.
*/
const Ejercicio = ({ contenido, enSeccion, irSolucion }) => {

  const {
    id,
    slug,
    precio,
    titulo,
    categoria,
    descripcion,
    arbolCategorias,
    descripcion_corta,
  } = contenido

  const {
    solucionDisponible,
    solucion: data,
    loadingSolucion
  } = useSolucion(id, enSeccion, irSolucion)

  const { loadingIDsEjercicios } = useContext(EjerciciosContext)
  const { user } = useContext(AuthContext)

  const baseURL = arbolCategorias.join("/")
  const ejercicioURL = `/${baseURL}/${slug}`

  return (
    <>
      {
        enSeccion ? // Estamos en la pagina de la categoria (list)
          <>
            <Link href={ejercicioURL}><a>{titulo}</a></Link>
            <div className={utilStyles.ejercicioContent} dangerouslySetInnerHTML={{ __html: descripcion_corta}}></div>
          </>
        : // Estamos en la pagina del ejercicio (single page)
          <>
            <h2 className="text-center mb-3">{titulo}</h2>
            <div className={utilStyles.ejercicioContent} dangerouslySetInnerHTML={{ __html: descripcion}}></div>
          </>
      }
      {
        (!user) ? // No hay sesion activa
          <>
            <strong>${precio}</strong>
            {
              !enSeccion &&
              <div>
                <Link href="/login">
                  <a>Inicia sesión para comprar este ejercicio</a>
                </Link>
              </div>
            }
          </>
        :
          loadingIDsEjercicios && !solucionDisponible ?
            // El usuario esta cargando
            <>
              <strong>${precio}</strong> 
              <p>Cargando usuario...</p>
            </>
          :
            solucionDisponible ?
              // El usuario adquirió este ejercicio
              enSeccion ?
                // Estamos en la seccion (list)
                <>
                  <Link href={`${ejercicioURL}#solucion`}>
                    <a>Ver solución</a>
                  </Link>
                </>
              :
                // Estamos en la propia pagina del ejercicio
                loadingSolucion ?
                  <h3 className="text-center my-5">Cargando solucion...</h3>
                :
                  data &&
                  <>
                    <h3 id="solucion" className="text-center mt-5 mb-3">Solucion</h3>
                    <div dangerouslySetInnerHTML={{ __html: data.solucion}}></div>
                  </>
            :
              // El usuario no tiene acceso a la solucion de este ejercicio
              <>
                <p><strong>${precio}</strong></p>
                <div><BotonAgregarCarrito ejercicio={contenido} /></div>
              </>
      }
    </>
  )
}

export default Ejercicio