import { useContext, useState, useEffect } from "react"
import Link from "next/link"
import Head from "next/head"

import { STRAPI } from "../lib/urls"
import AuthContext from "../context/AuthContext"
import EstructuraPagina from "../components/EstructuraPagina"
import ListaEjerciciosClasificados from "../components/categorias/ListaEjerciciosClasificados"

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

/**
* Este Hook pide a Strapi los ejercicios que ha adquirido el usuario
* y sus ordenes de compra, ambas de manera asincrona e independiente.
*/
const useHistorialCompras = token => {
  const [orders, setOrders] = useState(null)
  const [loadingOrders, setLoadingOrders] = useState(false)

  const [ejercicios, setEjercicios] = useState(null)
  const [loadingEjercicios, setLoadingEjercicios] = useState(false)

  useEffect(() => {
    const fetchOrders = async token => {
      try {
        setLoadingOrders(true)
        const ordersUrl = `${STRAPI}/orders`
        const orders_res = await fetch(ordersUrl, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        const data = await orders_res.json()
        setOrders(data)
      } catch (err) {
        console.log(err)
        setOrders(null)
      }
      setLoadingOrders(false)
    }
    const fetchEjercicios = async token => {
      try {
        setLoadingEjercicios(true)
        const ejerciciosUrl = `${STRAPI}/ejercicios/comprados`
        const ejercicios_res = await fetch(ejerciciosUrl, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        const data = await ejercicios_res.json()
        setEjercicios(data)
      } catch (err) {
        console.log(err)
        setEjercicios(null)
      }
      setLoadingEjercicios(false)
    }
    if (token) {
      fetchEjercicios(token)
      fetchOrders(token)
    }
  }, [token])

  return {
    orders, loadingOrders,
    ejercicios, loadingEjercicios
  }
}

export default function Cuenta({ navItems, informacionSitio }) {
  const { user, loadingUser, token, logoutUser } = useContext(AuthContext)

  const {
    orders, loadingOrders,
    ejercicios, loadingEjercicios
  } = useHistorialCompras(token)

  const { Titulo_sitio } = informacionSitio

  if (!user && !loadingUser) {
    return (
      <EstructuraPagina navItems={navItems} titulo={Titulo_sitio}>
      <Head><title>{Titulo_sitio} | Mi cuenta</title></Head>
      <h2 className="text-center">Inicia sesión para ver tu cuenta</h2>
      </EstructuraPagina>
    )
  }
  return (
    <EstructuraPagina navItems={navItems} titulo={Titulo_sitio}>
      <Head><title>{Titulo_sitio} | Mi cuenta</title></Head>
      <div>
        {
          loadingUser ?
          <h4 className="text-center">
            Cargando usuario...
          </h4>
          :
          <h4 className="text-center">
            Iniciaste sesión como {user.email}
          </h4>
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
              <h2 className="text-center">Tus ejercicios</h2>
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
        <button onClick={() => logoutUser()}>logout</button>
      </div>
    </EstructuraPagina>
  )
}