import { useContext } from "react"
import useRouter from "next/router"
import { loadStripe } from "@stripe/stripe-js"
import { useToasts } from "react-toast-notifications"

import AuthContext from "../context/AuthContext"
import { STRIPE_PK, API_URL } from "../lib/urls"

const stripePromise = loadStripe(STRIPE_PK)

export default function BotonComprar({ ejercicio }) {
  const { user, getToken } = useContext(AuthContext)
  const { addToast } = useToasts()

  if (!user) {
    return <p>Inicia sesion para comprar este ejercicio</p>
  }

  const ejercicios = [ejercicio]

  const handleCompra = async () => {
    try {
      const stripe = await stripePromise
      const token = await getToken()

      const orderUrl = `${API_URL}/orders`
      const orderOptions = {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          ejercicios: ejercicios.map( e => ({id: e.id}) )
        })
      }

      addToast("Creando orden de compra", { appearance: "info" })
      const res = await fetch(orderUrl, orderOptions)
      const { id } = await res.json()

      addToast("Redireccionando a stripe", { appearance: "success" })
      await stripe.redirectToCheckout({
        sessionId: id
      })
    } catch (err) {
      console.log(err)
      addToast("Algo salio mal. Ver consola", { appearance: "error" })
    }
  }

  return (
    <button onClick={handleCompra}>Comprar</button>
  )
}
