import { useContext, useState } from "react"
import { useRouter } from "next/router"
import { useToasts } from "react-toast-notifications"
import { loadStripe } from "@stripe/stripe-js"

import AuthContext from "../context/AuthContext"
import CarritoContext from "../context/CarritoContext"
import { useInformacion } from "../hooks/carrito"
import { limpiarSesion as limparArticulosComprados } from "../context/ArticulosContext"
import styles from "../styles/Carrito.module.scss"
import { STRIPE_PK, STRAPI } from "../lib/urls"
import BotonCarrito from "./BotonCarrito"

const stripePromise = loadStripe(STRIPE_PK)

export default function Carrito() {
  const {
    quitar,
    paso1,
    setPaso1,
    paso2,
    setPaso2,
    classContenedorCarrito,
    setClass,
  } = useContext(CarritoContext)
  const router = useRouter()
  const cerrarCarrito = () => {
    setPaso1(false)
    setPaso2(false)
    setClass(styles.Contenedor__Carrito)
  }
  const irPaso1 = () => {
    setPaso1(true)
    setPaso2(false)
    const className = `${styles.Contenedor__Carrito} ${styles.abierto}`
    setClass(className)
  }
  const irPaso2 = () => {
    setPaso2(true)
    setPaso1(false)
  }
  const { informacion } = useInformacion()

  const mostrarArticulos = editable => {
    if (!informacion) {
      return null
    }
    const botonQuitar = articulo => {
      return editable ?
        <button
          className="btn btn-outline-danger py-0"
          onClick={() => quitar(articulo)}
        >Quitar</button>
      : null
    }
    return informacion.articulos.map(articulo => {
      // Coloca el nombre de la categoria si el articulo no es un curso
      const label = articulo.videos ?
        articulo.titulo
      : articulo.categoria.Titulo_normal + ` - ${articulo.titulo}`
      return (
        <div
          className="w-100 d-flex justify-content-between align-items-center mb-1"
          key={articulo.slug}
        >
          <span>${articulo.precio}</span>
          <span className="mx-2 mx-lg-4">{label}</span>
          <span>{botonQuitar(articulo)}</span>
        </div>
      )
    })
  }

  // No mostrar el icono si estamos en la pagina de reproduccion de un curso
  if (router.asPath.endsWith("/ver")) {
    return null
  }

  return (
    <>
      <div className={classContenedorCarrito}>
        <div className={styles.Contenedor__Ventana}>
          <button
            className={styles.closeBtn.concat(" btn btn-secondary px-2 py-0")}
            onClick={cerrarCarrito}
          >X</button>
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
      </div>
      <span className="d-none d-md-inline"><BotonCarrito /></span>
    </>
  )
}

// Paso 1: ventana de confirmacion
// En esta ventana se pueden quitar los articulos
const Confirmacion = props => {
  const { user } = useContext(AuthContext)
  const { limpiar } = useContext(CarritoContext)
  const { ocultar, informacion, lista, siguiente, volver } = props
  return (
    <div className={styles.Ventana} data-ocultar={ocultar}>
      {
      (!user) ?
        <p className="text-center">Inicia sesion para comprar ejercicios</p>
        :
        informacion && informacion.articulos.length ?
          <>
            {lista}
            <h4 className="text-center">Total a pagar: ${informacion.total}</h4>
            <div className="d-flex flex-column w-75 mt-2">
              <button
                className="btn btn-outline-primary"
                onClick={() => limpiar()}
              >Limpiar carrito</button>
              <button
                className="btn btn-primary my-2"
                onClick={siguiente}
              >Siguiente</button>
            </div>
          </>
          :
          <p className="text-center">Los ejercicios que agregues aparecerán aqui</p>
      }
      <button className="btn btn-secondary w-75 mb-2" onClick={volver}>Volver</button>
    </div>
  )
}

// Paso 2: ventana de checkout
// En esta ventana no se pueden quitar los articulos
// El usuario selecciona el metodo de pago y se redirige al checkout
const Checkout = props => {
  const { ocultar, informacion, lista, volver } = props
  const { addToast } = useToasts()

  const { token } = useContext(AuthContext)
  const { articulosIDs, limpiar: limpiarCarrito } = useContext(CarritoContext)
  // Opcion de pago por defecto: tarjeta de credito
  const [checkedCC, setCheckedCC] = useState(true)
  const [metodo, setMetodo] = useState("CC")

  const [disabled, setDisabled] = useState("")

  const pagar = async () => {
    setDisabled("disabled")
    try {
      const ejerciciosIDs = []
      const cursosIDs = []
      const prefijoCurso = "curso--"
      articulosIDs.map(({ id }) => {
        if (id.startsWith(prefijoCurso)) {
          cursosIDs.push(id.replace(prefijoCurso, ""))
        } else {
          ejerciciosIDs.push(id)
        }
      })
      const stripe = await stripePromise

      const orderUrl = `${STRAPI}/orders`
      const orderOptions = {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          ejercicios: ejerciciosIDs,
          cursos: cursosIDs
        })
      }

      addToast("Creando orden de compra", { appearance: "info" })
      const res = await fetch(orderUrl, orderOptions)
      const data = await res.json()
      if (!res.ok) {
        throw data
      }
      const { id } = data
      if (id) {
        addToast("Redireccionando a stripe", { appearance: "success" })
        limpiarCarrito()
        limparArticulosComprados()
        await stripe.redirectToCheckout({
          sessionId: id
        })
      } else {
        throw "No id"
      }
    } catch (err) {
      console.log(err)
      addToast("Algo salio mal. Ver consola", { appearance: "error" })
    } finally {
      setDisabled("")
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
            <button
              className={disabled.concat(" btn btn-primary w-75 my-2")}
              onClick={pagar}
            >{disabled ? "Espera..." : "Completar compra"}</button>
          }
        </>
        :
        <p>Los ejercicios que agregues aparecerán aqui</p>
      }
      <button className="btn btn-secondary w-75" onClick={volver}>Volver</button>
    </div>
  )
}
