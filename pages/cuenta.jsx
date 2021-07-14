import { useContext, useState, useEffect } from "react"
import Link from "next/link"
import Head from "next/head"

import { API_URL } from "../lib/urls"
import AuthContext from "../context/AuthContext"
import SeccionEjercicios, { siteTitle } from "../components/SeccionEjercicios"

/*
* Este es un Hook que pide a Strapi los ejercicios que ha adquirido el usuario
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
        const ordersUrl = `${API_URL}/orders`
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
        const ejerciciosUrl = `${API_URL}/ejercicios/comprados`
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

export default function Cuenta() {
  const { user, loadingUser, token, logoutUser } = useContext(AuthContext)

  const {
    orders, loadingOrders,
    ejercicios, loadingEjercicios
  } = useHistorialCompras(token)

  if (!user && !loadingUser) {
    return (
      <SeccionEjercicios>
      <Head><title>{siteTitle} | Mi cuenta</title></Head>
      <h2 style={{textAlign: "center"}}>Inicia sesión para ver tu cuenta</h2>
      </SeccionEjercicios>
    )
  }
  return (
    <SeccionEjercicios>
      <Head><title>{siteTitle} | Mi cuenta</title></Head>
      <div>
        {
          loadingUser ?
          <h3 style={{textAlign: "center"}}>
            Cargando usuario...
          </h3>
          :
          <h2 style={{textAlign: "center"}}>
            Iniciaste sesión como {user.email}
          </h2>
        }
        {
          loadingEjercicios ?
          <h3 style={{textAlign: "center"}}>
            Cargando ejercicios...
          </h3>
          :
          (!ejercicios || !ejercicios.length) ?
            <h3 style={{textAlign: "center"}}>
              Los ejercicios que compres aparecerán aquí
            </h3>
          :
            <ul>
              {
                ejercicios.map(e => (
                  <li key={e.titulo}>
                    <Link href={`/${e.categoria}/${e.slug}`}>
                      <a>{e.titulo}</a>
                    </Link>
                  </li>
                )
              )}
            </ul>
        }
        {
          loadingOrders ?
          <h3 style={{textAlign: "center"}}>
            Cargando ordenes de compra...
          </h3>
          :
          (!orders || !orders.length) ?
            <h3 style={{textAlign: "center"}}>
              Tus órdenes de compra aparecerán aquí
            </h3>
          :
            <ul>
              {
                orders.map(o => (
                  <li key={o.id}>
                    <div>
                      <span>Total: {o.total}</span> - 
                      <span>Fecha: {o.updated_at}</span> - 
                      <span>Estado: {o.estado}</span> - 
                      <span>ID: {o.id}</span>
                    </div>
                  </li>
                )
              )}
            </ul>
        }
        <button onClick={() => logoutUser()}>logout</button>
      </div>
    </SeccionEjercicios>
  )
}