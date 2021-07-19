import { useContext, useState, useEffect } from "react"
import { useToasts } from "react-toast-notifications"
import { loadStripe } from "@stripe/stripe-js"

import AuthContext from "../context/AuthContext"
import CarritoContext from "../context/CarritoContext"
import { limpiarSesion as limparEjerciciosComprados } from "../context/EjerciciosContext"
import styles from "../styles/Carrito.module.css"
import { STRIPE_PK, API_URL } from "../lib/urls"

const stripePromise = loadStripe(STRIPE_PK)

// Este hook retorna los articulos en el carrito como una lista, junto con
// el precio total a pagar
const useInformacion = () => {
  const { articulos } = useContext(CarritoContext)
  const [informacion, setInformacion] = useState(null)
  useEffect(() => {
    const total = articulos.reduce((suma, articulo) => suma + articulo.precio, 0)
    setInformacion({
      articulos,
      total
    })
  }, [articulos])

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

  const { informacion } = useInformacion()
  const { quitar } = useContext(CarritoContext)

  const mostrarArticulos = editable => {
    if (!informacion) {
      return null
    }
    const botonQuitar = articulo => {
      return editable ? <>| <button onClick={() => quitar(articulo)}>quitar</button></>
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
        {/* Ventana de confirmacion: */}
        {/* En esta ventana se pueden quitar los articulos */}
        <Confirmacion
          ocultar={!paso1}
          informacion={informacion}
          lista={mostrarArticulos(true)}
          volver={cerrarCarrito}
          siguiente={irPaso2}
        />
        {/* Ventana de checkout: */}
        {/* Se selecciona el metodo de pago y se redirige al checkout */}
        <Checkout
          ocultar={!paso2}
          informacion={informacion}
          lista={mostrarArticulos(false)}
          volver={irPaso1}
        />
      </div>
      <button className={styles.Icono} onClick={irPaso1}>
        Ver carrito {
          (informacion && informacion.articulos.length) ? `(${informacion.articulos.length})`: null
        }
      </button>
    </>
  )
}

// Ventana de confirmacion
// En esta ventana se pueden quitar los articulos
const Confirmacion = props => {
  const { user, loadingUser } = useContext(AuthContext)
  const { limpiar } = useContext(CarritoContext)
  const { ocultar, informacion, lista, siguiente, volver } = props
  return (
    <div className={styles.Ventana} data-ocultar={ocultar}>
      {
      (!user && !loadingUser) ?
        <p>Inicia sesion para comprar ejercicios</p>
        :
        loadingUser ?
          <p>Cargando usuario</p>
          :
          informacion && informacion.articulos.length ?
            <>
              {lista}
              <h4>Total a pagar: ${informacion.total}</h4>
              <button onClick={() => limpiar()}>Limpiar carrito</button>
              <button onClick={siguiente}>Siguiente</button>
            </>
            :
            <p>Los ejercicios que agregues aparecerán aqui</p>
      }
      <button onClick={volver}>Volver</button>
    </div>
  )
}

// Ventana de checkout
// En esta ventana no se pueden quitar los articulos
// El usuario selecciona el metodo de pago y se redirige al checkout
const Checkout = props => {
  const { ocultar, informacion, lista, volver } = props
  const { addToast } = useToasts()

  const { token, loadingToken, loadToken } = useContext(AuthContext)
  const { articulosIDs, limpiar: limpiarCarrito } = useContext(CarritoContext)
  // Opcion de pago por defecto: tarjeta de credito
  const [checkedCC, setCheckedCC] = useState(true)
  const [metodo, setMetodo] = useState("CC")

  const pagar = async () => {
    if (!token) {
      loadToken()
      return
    }
    try {
      const stripe = await stripePromise

      const orderUrl = `${API_URL}/orders`
      const orderOptions = {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          ejercicios: articulosIDs
        })
      }

      addToast("Creando orden de compra", { appearance: "info" })
      const res = await fetch(orderUrl, orderOptions)
      const { id } = await res.json()

      if (id) {
        addToast("Redireccionando a stripe", { appearance: "success" })
        limpiarCarrito()
        limparEjerciciosComprados()
        await stripe.redirectToCheckout({
          sessionId: id
        })
      } else {
        throw "No id"
      }
    } catch (err) {
      console.log(err)
      addToast("Algo salio mal. Ver consola", { appearance: "error" })
    }
  }
  return (
    <div className={styles.Ventana} data-ocultar={ocultar}>
      {
        informacion && informacion.articulos.length ?
        <>
          {lista}
          <h4>Total a pagar: ${informacion.total}</h4>
          <p>Elegir metodo de pago</p>
          <label>
            <input
              type="radio"
              name="metodo"
              value="CC"
              checked={checkedCC ? "checked" : ""}
              onChange={e => setMetodo(e.target.value)}
            />
            Tarjeta de credito
          </label>
          {
            loadingToken ?
              <button>Cargando...</button>
            :
              <button onClick={pagar}>Completar compra</button>
          }
        </>
        :
        <p>Los ejercicios que agregues aparecerán aqui</p>
      }
      <button onClick={volver}>Volver</button>
    </div>
  )
}
