import { useRouter } from "next/router"
import Head from "next/head"
import Link from "next/link"
import { useContext, useState, useEffect } from "react"
import { useToasts } from "react-toast-notifications"

import { STRAPI } from "../lib/urls"
import AuthContext from "../context/AuthContext"
import EstructuraPagina from "../components/EstructuraPagina"

import { cargarInformacionSitio, cargarNavItems } from "../lib/metadata"

export async function getStaticProps() {
  const navItems = await cargarNavItems()
  const informacionSitio = await cargarInformacionSitio()
  return {
    props: {
      navItems,
      informacionSitio
    }
  }
}

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
          const orderUrl = `${STRAPI}/orders/confirm`
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

const breadCrumb = [
  {
    name: "inicio",
    url: "/"
  },
  {
    name: "Confirmación de compra",
    url: "/pago"
  }
]

export default function Pago({navItems, informacionSitio}) {

  const router = useRouter()
  const { confirmante } = router.query
  const { loadingUser, loadingToken } = useContext(AuthContext)
  const { order, loadingOrder } = useOrder(confirmante)

  const { Titulo_sitio } = informacionSitio

  return (
    <EstructuraPagina
      header="Confirmación de compra"
      navItems={navItems}
      breadCrumb={breadCrumb}
      titulo={Titulo_sitio}
    >
      <div>
        <Head>
          <title>Confirmación de compra</title>
        </Head>
        <h1>
          {
            !confirmante ?
              "Confirmante invalido"
            :
              loadingUser || loadingOrder || loadingToken ? "Confirmando pago..."
              :
              order ? "¡Compra exitosa!" : "El pago no pudo ser confirmado"
          }
        </h1>
        { order &&
          <>
            <h4 className="mt-5 mb-2">Resumen de la compra</h4>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Total</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">{order.id}</th>
                  <td>${order.total}</td>
                  <td>{(new Date(order.updated_at)).toLocaleDateString()}</td>
                  <td>{order.estado}</td>
                </tr>
              </tbody>
            </table>
            <p>Puedes ver las soluciones de los ejercicios que has comprado en <Link href="/cuenta"><a>tu cuenta</a></Link></p>
          </>
        }
      </div>
    </EstructuraPagina>
  )
}
