import { useRouter } from "next/router"
import Head from "next/head"
import { useContext, useState, useEffect } from "react"
import { useToasts } from "react-toast-notifications"

import { API_URL } from "../lib/urls"
import AuthContext from "../context/AuthContext"

const useOrder = (user, confirmante, addToast) => {
  const [order, setOrder] = useState(null)
  const [loadingOrder, setLoading] = useState(false)
  const { token, loadingToken, loadToken } = useContext(AuthContext)

  useEffect(() => {
    const fetchOrder = async () => {
      // Carga el token si no esta disponible
      let intentos = 0
      while (!token && !loadingToken) {
        if (intentos === 5) {
          addToast("No se pudo verificar el pago. Contacte con soporte", {appearance: "error"})
          return
        }
        try {
          await loadToken()
        } catch(err) {
          console.log(err)
        }
        intentos++
      }
      if (user) {
        try {
          setLoading(true)
          addToast("Confirmado pago", {appearance: "info"})
          const orderUrl = `${API_URL}/orders/confirm`
          const order_res = await fetch(orderUrl, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-type": "application/json"
            },
            body: JSON.stringify({
              checkout_session: confirmante
            })
          })
          const data = await order_res.json()
          addToast("¡Pago confirmado!", {appearance: "success"})
          setOrder(data)
        } catch (err) {
          console.log(err)
          addToast("Error confirmando orden", {appearance: "error"})
          setOrder(null)
        }
        setLoading(false)
      }
    }
    fetchOrder()
  }, [user, confirmante])

  return {order, loadingOrder}
}

export default function Pago() {

  const router = useRouter()

  const { confirmante } = router.query
  
  const { addToast } = useToasts()

  const { user, loadingUser, loadingToken } = useContext(AuthContext)

  const { order, loadingOrder } = useOrder(user, confirmante, addToast)

  return (
    <div>
      <Head>
        <title>Confirmación de compra</title>
      </Head>
      <h1>
        {
          loadingUser || loadingOrder || loadingToken ? "Confirmando pago"
                  :
          order ? "¡Compra exitosa!" : "El pago no pudo ser confirmado"
        }
      </h1>
      { order &&
        <div>
          <p>Total: {order.total}</p>
          <p>Fecha: {order.updated_at}</p>
          <p>Estado: {order.estado}</p>
          <p>ID: {order.id}</p>
        </div>
      }
    </div>
  )
}
