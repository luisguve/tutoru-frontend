import { useContext, useState, useEffect } from "react"
import Link from "next/link"
import Head from "next/head"

import { API_URL } from "../../lib/urls"
import AuthContext from "../context/AuthContext"
import SeccionEjercicios, { siteTitle } from "../components/SeccionEjercicios"

const useOrders = (user, getToken) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          setLoading(true)
          const token = await getToken()
          const ordersUrl = `${API_URL}/orders`
          const orders_res = await fetch(ordersUrl, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })
          const data = await orders_res.json()
          setOrders(data)
        } catch (err) {
          setOrders([])
        }
        setLoading(false)
      }
    }
    fetchOrders()
  }, [user])

  return {orders, loading}
}

export default function Cuenta() {
  const { user, logoutUser: logout, getToken } = useContext(AuthContext)

  const {orders, loading} = useOrders(user, getToken)

  if (!user) {
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
        <h2 style={{textAlign: "center"}}>Logged in as {user.email}</h2>
        <button onClick={() => logout()}>logout</button>
      </div>
    </SeccionEjercicios>
  )
}