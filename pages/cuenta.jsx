import { useContext, useState, useEffect } from "react"
import Link from "next/link"
import Head from "next/head"

import { STRAPI } from "../lib/urls"
import AuthContext from "../context/AuthContext"
import EstructuraPagina from "../components/EstructuraPagina"
import ListaEjerciciosClasificados from "../components/categorias/ListaEjerciciosClasificados"
import { useHistorialCompras } from "../hooks/historial"
import { cargarInformacionSitio, cargarNavItems } from "../lib/metadata"

export async function getStaticProps() {
  const navItems = await cargarNavItems()
  const informacionSitio = await cargarInformacionSitio()
  return {
    props: {
      navItems,
      informacionSitio,
    }
  }
}

const breadCrumb = [
  {
    name: "inicio",
    url: "/"
  },
  {
    name: "Mi Cuenta",
    url: "/cuenta"
  }
]

export default function Cuenta({ navItems, informacionSitio }) {
  const { user, token, logoutUser } = useContext(AuthContext)

  const {
    orders, loadingOrders,
    ejercicios, loadingEjercicios
  } = useHistorialCompras(token)

  const { Titulo_sitio } = informacionSitio

  if (!user) {
    return (
      <EstructuraPagina
        navItems={navItems}
        titulo={Titulo_sitio}
        header="Mi Cuenta"
        breadCrumb={breadCrumb}
      >
      <Head><title>{Titulo_sitio} | Mi cuenta</title></Head>
      <h2 className="text-center">Inicia sesión para ver tu cuenta</h2>
      </EstructuraPagina>
    )
  }
  return (
    <EstructuraPagina
      navItems={navItems}
      titulo={Titulo_sitio}
      header="Mi Cuenta"
      breadCrumb={breadCrumb}
    >
      <Head><title>{Titulo_sitio} | Mi cuenta</title></Head>
      <div>
        {
          <>
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-secondary px-2 py-0"
                onClick={() => logoutUser()}
              >salir</button>
            </div>
            <h5 className="text-center">Iniciaste sesión como {user.email}</h5>
          </>
        }
        {
          loadingEjercicios ?
          <h4 className="text-center">
            Cargando tus ejercicios...
          </h4>
          :
          (!ejercicios || !ejercicios.length) ?
            <h4 className="text-center">
              Los ejercicios que compres aparecerán aquí
            </h4>
          :
            <div className="my-5">
              <h2 className="text-center mb-3">Tus ejercicios</h2>
              <ListaEjerciciosClasificados irSolucion={true} muestras={ejercicios} />
            </div>
        }
        {
          loadingOrders ?
          <h4 className="text-center">
            Cargando tus ordenes de compra...
          </h4>
          :
          (!orders || !orders.length) ?
            <h4 className="text-center">
              Tus órdenes de compra aparecerán aquí
            </h4>
          :
            <div className="my-5">
              <h2 className="text-center">Tu historial de compras</h2>
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
                {
                  orders.map(o => (
                    <tr key={o.id}>
                      <th scope="row">{o.id}</th>
                      <td>${o.total}</td>
                      <td>{(new Date(o.updated_at)).toLocaleDateString()}</td>
                      <td>{o.estado}</td>
                    </tr>
                  )
                )}
                </tbody>
              </table>
            </div>
        }
      </div>
    </EstructuraPagina>
  )
}