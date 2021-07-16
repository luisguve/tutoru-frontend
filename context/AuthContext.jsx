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
  const router = useRouter()

  const { addToast } = useToasts()

  const loginUser = async email => {
    try {
      await magic.auth.loginWithMagicLink({ email })
      setUser({ email })
      addToast("Logged in as " + email, { appearance: 'success' })
      router.push("/")
    } catch (err) {
      setUser(null)
    }
  }

  const logoutUser = async () => {
    try {
      await magic.user.logout()
      setUser(null)
      addToast("Logged out", { appearance: 'success' })
      router.push("/")
    } catch (err) {}
  }

  const checkIsLoggedIn = async () => {
    try {
      addToast("Verificando sesión", { appearance: 'info' })
      const isLoggedIn = await magic.user.isLoggedIn()

      if (isLoggedIn) {
        setLoadingUser(true)
        addToast("Recuperando sesión", { appearance: 'info' })
        const { email } = await magic.user.getMetadata()
        addToast("Sesión iniciada como " + email, { appearance: 'success' })
        setUser({ email })
        setLoadingUser(false)

        const newToken = await getToken()
        setToken(newToken)
      } else {
        addToast("Inicia sesión para comprar", { appearance: 'info' })
      }
    } catch (err) {
      console.log(err)
      addToast("No se pudo obtener informacion sobre la sesión", { appearance: 'error' })
    }
    setLoadingUser(false)
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
  }

  useEffect(() => {
    magic = new Magic(MAGIC_PUBLIC_KEY)
    checkIsLoggedIn()
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loadingUser, loginUser, logoutUser }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContext