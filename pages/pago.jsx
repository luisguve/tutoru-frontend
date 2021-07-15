import { useRouter } from "next/router"
import Head from "next/head"
import { useContext, useState, useEffect } from "react"
import { useToasts } from "react-toast-notifications"

import { API_URL } from "../lib/urls"
import AuthContext from "../context/AuthContext"

const useOrder = (user, getToken, confirmante, addToast) => {
  const [order, setOrder] = useState(null)
  const [loadingOrder, setLoading] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      if (user) {
        try {
          setLoading(true)
          const token = await getToken()
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

  const { user, loadingUser, getToken } = useContext(AuthContext)

  const { order, loadingOrder } = useOrder(user, getToken, confirmante, addToast)

  return (
    <div>
      <Head>
        <title>Confirmación de compra</title>
      </Head>
      <h1>
        {
          loadingUser || loadingOrder ? "Confirmando pago"
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
