import { createContext, useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Magic } from "magic-sdk"
import { useToasts } from 'react-toast-notifications';

import { API_URL, MAGIC_PUBLIC_KEY } from "../lib/urls"

const AuthContext = createContext()

let magic
export const AuthProvider = props => {

  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loadingUser, setLoadingUser] = useState(false)
  const [loadingToken, setLoadingToken] = useState(false)
  const router = useRouter()

  const { addToast } = useToasts()

  const loginUser = async email => {
    try {
      await magic.auth.loginWithMagicLink({ email })
      setUser({ email })
      addToast("Logged in as " + email, { appearance: 'success' })
      guardarSesion(email)
      loadToken()
      router.push("/")
    } catch (err) {
      setUser(null)
    }
  }

  const logoutUser = async () => {
    try {
      await magic.user.logout()
      setUser(null)
      limpiarSesion()
      limpiarToken()
      addToast("Cerraste sesion", { appearance: 'info' })
      router.push("/")
    } catch (err) {}
  }

  const checkIsLoggedIn = async () => {
    const { data: sesionData } = obtenerSesion()
    let sesionRecuperada = false
    if (sesionData) {
      const { email } = sesionData
      setUser({ email })
      sesionRecuperada = true
    }
    let tokenRecuperado = false
    const { data: tokenData } = obtenerToken()
    if (tokenData) {
      const { token, createdAt } = tokenData
      const diferenciaMs = Date.now() - createdAt
      const diferenciaHoras = Math.floor(diferenciaMs/1000/60/60)
      if (diferenciaHoras > 24) {
        // Elimina el token.
        limpiarToken()
      } else {
        // Guarda el token en el contexto
        tokenRecuperado = true
        setToken(token)
      }
    }
    try {
      addToast("Verificando sesión", { appearance: 'info' })
      const isLoggedIn = await magic.user.isLoggedIn()

      if (isLoggedIn) {
        addToast("Sesión activa", { appearance: "success" })
        // Carga la sesion de usuario si no ha sido recuperada del localStorage.
        if (!sesionRecuperada) {
          await loadSession()
        }
        if (!tokenRecuperado) {
          await loadToken()
        }
      } else {
        addToast("Inicia sesión para comprar", { appearance: 'info' })
        limpiarSesion()
        limpiarToken()
        setUser(null)
        setToken(null)
      }
    } catch (err) {
      console.log(err)
      addToast("No se pudo obtener informacion sobre la sesión", { appearance: 'error' })
    }
    setLoadingUser(false)
  }

  const loadSession = async () => {
    setLoadingUser(true)
    addToast("Recuperando sesión", { appearance: 'info' })
    const { email } = await magic.user.getMetadata()
    addToast("Sesión iniciada como " + email, { appearance: 'success' })
    setUser({ email })
    setLoadingUser(false)
    guardarSesion(email)
  }
  const loadToken = async () => {
    setLoadingToken(true)
    const newToken = await getToken()
    setToken(newToken)
    setLoadingToken(false)
    guardarToken(newToken)
  }

  const getToken = async () => {
    try {
      addToast("Obteniendo token de acceso", { appearance: 'info' })
      const newToken = await magic.user.getIdToken({ lifespan: 86400 /*24h*/ })
      addToast("Token obtenida", { appearance: 'success' })
      return newToken
    } catch (err) {
      console.log(err)
      addToast("No se pudo obtener token", { appearance: 'warning' })
    }
    return null
  }

  useEffect(() => {
    magic = new Magic(MAGIC_PUBLIC_KEY)
    checkIsLoggedIn()
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loadingUser, loginUser, logoutUser, loadingToken, loadToken }}>
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
const guardarSesion = email => {
  if (typeof(Storage) !== undefined) {
    localStorage.setItem("data", JSON.stringify({
      email
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
