import { useState, useEffect, useContext } from "react"
import { useToasts } from "react-toast-notifications"

import AuthContext from "../context/AuthContext"
import { limpiarSesion } from "../context/ArticulosContext"
import { STRAPI } from "../lib/urls"

/**
* Este hook verifica si el confirmante es valido y por lo tanto la orden de compra
* se completó exitosamente.
* De ser asi, limpia los ejercicios IDS del localStorage para que en el proximo reload
* se carguen nuevamente.
*/
export const useOrder = (confirmante) => {
  const [order, setOrder] = useState(null)
  const [loadingOrder, setLoading] = useState(true)

  const { token } = useContext(AuthContext)
  const { addToast } = useToasts()

  useEffect(() => {
    const fetchOrder = async () => {
      if (token && confirmante) {
        try {
          setLoading(true)
          addToast("Confirmando pago", {appearance: "info"})
          const orderUrl = `${STRAPI}/orders/confirm`
          const options = {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-type": "application/json"
            },
            body: JSON.stringify({
              checkout_session: confirmante
            })
          }
          const order_res = await fetch(orderUrl, options)
          const data = await order_res.json()
          if (!order_res.ok) {
            throw data
          }
          addToast("¡Pago confirmado!", {appearance: "success"})
          limpiarSesion()
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
