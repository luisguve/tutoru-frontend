import { useRouter } from "next/router"
import Head from "next/head"
import Link from "next/link"
import { useContext } from "react"

import AuthContext from "../context/AuthContext"
import EstructuraPagina from "../components/EstructuraPagina"
import { useOrder } from "../hooks/order"

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
        <>
          {
            !confirmante ?
              <h1>Confirmante invalido</h1>
            :
              loadingOrder ? <h1>Confirmando pago...</h1>
              :
              order ? <h1>¡Compra exitosa!</h1> : (
                <div>
                  <h1>El pago no pudo ser confirmado</h1>
                  <p>ID de pago: {confirmante}</p>
                </div>
              )
          }
        </>
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
            <p>Puedes ver un resumen de los artículos que has comprado en <Link href="/cuenta"><a>tu cuenta</a></Link></p>
          </>
        }
      </div>
    </EstructuraPagina>
  )
}
