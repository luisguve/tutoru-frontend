import { useRouter } from "next/router"
import Head from "next/head"
import { useContext, useState, useEffect } from "react"
import { useToasts } from "react-toast-notifications"

import { API_URL } from "../lib/urls"
import AuthContext from "../context/AuthContext"
import SeccionEjercicios from "../components/SeccionEjercicios"

const useOrder = (confirmante) => {
  const [order, setOrder] = useState(null)
  const [loadingOrder, setLoading] = useState(false)
  const { token } = useContext(AuthContext)

  const { addToast } = useToasts()

  useEffect(() => {
    const fetchOrder = async () => {
      if (token && confirmante) {
        try {
          setLoading(true)
          addToast("Confirmando pago", {appearance: "info"})
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
  }, [token, confirmante])

  return {order, loadingOrder}
}

export default function Pago() {

  const router = useRouter()

  const { confirmante } = router.query

  const { loadingUser, loadingToken } = useContext(AuthContext)

  const { order, loadingOrder } = useOrder(confirmante)

  return (
    <SeccionEjercicios>
      <div>
        <Head>
          <title>Confirmación de compra</title>
        </Head>
        <h1>
          {
            !confirmante ?
              "Confirmante invalido"
            :
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
    </SeccionEjercicios>
  )
}
