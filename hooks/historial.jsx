import { useState, useEffect } from "react"

import { STRAPI } from "../lib/urls"

/**
* Este Hook pide a Strapi los ejercicios que ha adquirido el usuario
* y sus ordenes de compra, ambas de manera asincrona e independiente.
*/
export const useHistorialCompras = token => {
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
        setOrders(data.reverse())
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