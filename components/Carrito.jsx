import { useContext, useState, useEffect } from "react"
import { useToasts } from "react-toast-notifications"

import AuthContext from "../context/AuthContext"
import CarritoContext from "../context/CarritoContext"
import styles from "../styles/Carrito.module.css"

// Este hook retorna los articulos en el carrito como una lista, junto con
// el precio total a pagar
const useInformacion = () => {
  const { articulos: data } = useContext(CarritoContext)
  const [informacion, setInformacion] = useState(null)
  useEffect(() => {
    const total = data.reduce((suma, articulo) => suma + articulo.precio, 0)
    setInformacion({
      articulos: data,
      total
    })
  }, [data])

  return {
    informacion
  }
}

export default function Carrito() {
  const [paso1, setPaso1] = useState(false)
  const [paso2, setPaso2] = useState(false)

  const cerrarCarrito = () => {
    setPaso1(false)
  }
  const irPaso1 = () => {
    setPaso1(true)
    setPaso2(false)
  }
  const irPaso2 = () => {
    setPaso2(true)
    setPaso1(false)
  }
  const { addToast } = useToasts()

  const { user, loadingUser, token, loadingToken } = useContext(AuthContext)
  const { informacion } = useInformacion()
  const { limpiar, quitar } = useContext(CarritoContext)

  const mostrarArticulos = editar => {
    if (!informacion) {
      return null
    }
    const botonQuitar = articulo => {
      return editar ? <>| <button onClick={() => quitar(articulo)}>quitar</button></>
      : null
    }
    return informacion.articulos.map(articulo => {
      return (
        <div key={articulo.slug}>
          <h5>{articulo.precio} | {articulo.titulo} {botonQuitar(articulo)} </h5>
        </div>
      )
    })
  }

  return (
    <>
      <div className={styles.Contenedor__Ventana}>
        {/* En esta ventana se pueden quitar los articulos */}
        <div className={styles.Ventana} data-ocultar={!paso1}>
          {
          (!user && !loadingUser) ?
            <p>Inicia sesion para comprar ejercicios</p>
            :
            loadingUser ?
              <p>Cargando usuario</p>
              :
              informacion && informacion.articulos.length ?
                <>
                  {mostrarArticulos(true)}
                  <h4>Total a pagar: ${informacion.total}</h4>
                  <button onClick={() => limpiar()}>Limpiar carrito</button>
                  <button onClick={irPaso2}>Siguiente</button>
                </>
                :
                <p>Los ejercicios que agregues aparecerán aqui</p>
          }
          <button onClick={cerrarCarrito}>Volver</button>
        </div>
        {/* Ventana de checkout: */}
        {/* Se selecciona el metodo de pago y se redirige al checkout */}
        <div className={styles.Ventana} data-ocultar={!paso2}>
          {
            informacion && informacion.articulos.length ?
            <>
              {mostrarArticulos(false)}
              <h4>Total a pagar: ${informacion.total}</h4>
              <p>Elegir metodo de pago</p>
              <select></select>
            </>
            :
            <p>Los ejercicios que agregues aparecerán aqui</p>
          }
          <button onClick={irPaso1}>Volver</button>
        </div>
      </div>
      <button className={styles.Icono} onClick={irPaso1}>
        Ver carrito {
          (informacion && informacion.articulos.length) ? `(${informacion.articulos.length})`: null
        }
      </button>
    </>
  )
}
