import { createContext, useState, useEffect } from "react"
import { useRouter } from "next/router"
import { useToasts } from 'react-toast-notifications';

import { STRAPI } from "../lib/urls"

const AuthContext = createContext()

export const AuthProvider = props => {

  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [token, setToken] = useState(null)
  const router = useRouter()

  const { addToast } = useToasts()

  const loginUser = ({email, id, token}) => {
    setUser({ email, id })
    guardarSesion(email, id)
    guardarToken(token)
    setToken(token)
  }

  const logoutUser = async () => {
    limpiarToken()
    limpiarSesion()
    console.log("Cerraste sesion")
    // addToast("Cerraste sesión", { appearance: 'info' })
    setToken(null)
    setUser(null)
  }

  /**
  * Try to get user data from local storage
  */
  const checkIsLoggedIn = () => {
    const { data: sesionData } = obtenerSesion()
    let sesionRecuperada = false
    if (sesionData) {
      const { email, id } = sesionData
      setUser({ email, id })
      sesionRecuperada = true
    }
    const { data: tokenData } = obtenerToken()
    let tokenRecuperado = false
    if (tokenData) {
      const { token, createdAt } = tokenData
      const diferenciaMs = Date.now() - createdAt
      const diferenciaHoras = Math.floor(diferenciaMs/1000/60/60)
      if (diferenciaHoras > 24) {
        // Elimina el token.
        limpiarToken()
      } else {
        // Guarda el token en el contexto
        setToken(token)
        tokenRecuperado = true
      }
    }
    if (!sesionRecuperada || !tokenRecuperado) {
      limpiarToken()
      limpiarSesion()
      setToken(null)
      setUser(null)
    }
  }

  useEffect(() => {
    checkIsLoggedIn()
    setLoadingUser(false)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loadingUser, loginUser, logoutUser }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContext

const obtenerSesion = () => {
  if (typeof(Storage) !== undefined) {
    return {
      data: JSON.parse(localStorage.getItem("data"))
    }
  }
  return {}
}
const guardarSesion = (email, id) => {
  if (typeof(Storage) !== undefined) {
    const data = JSON.parse(localStorage.getItem("data"))
    localStorage.setItem("data", JSON.stringify({
      ...data,
      email,
      id
    }))
  }
}
const limpiarSesion = () => {
  if (typeof(Storage) !== undefined) {
    localStorage.removeItem("data")
  }
}

const obtenerToken = () => {
  if (typeof(Storage) !== undefined) {
    return {
      data: JSON.parse(sessionStorage.getItem("data"))
    }
  }
  return {}
}
const guardarToken = token => {
  if (typeof(Storage) !== undefined) {
    sessionStorage.setItem("data", JSON.stringify({
      token,
      createdAt: Date.now()
    }))
  }
}
const limpiarToken = () => {
  if (typeof(Storage) !== undefined) {
    sessionStorage.removeItem("data")
  }
}
