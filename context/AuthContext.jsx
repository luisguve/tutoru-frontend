import { createContext, useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Magic } from "magic-sdk"
import { useToasts } from 'react-toast-notifications';

import { MAGIC_PUBLIC_KEY } from "../lib/urls"

const AuthContext = createContext()

let magic
export const AuthProvider = props => {

  const [user, setUser] = useState(null)
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
      addToast("Checking if is logged in", { appearance: 'info' })
      setLoadingUser(true)
      const isLoggedIn = await magic.user.isLoggedIn()

      if (isLoggedIn) {
        addToast("Is logged in. Now getting metadata", { appearance: 'info' })
        const { email } = await magic.user.getMetadata()
        addToast("Metadata gotten: " + email, { appearance: 'success' })
        setUser({ email })
      } else {
        addToast("Apparently not logged in", { appearance: 'info' })
      }
    } catch (err) {
      addToast("Could not check if is logged in", { appearance: 'error' })
    }
    setLoadingUser(false)
  }

  const getToken = async () => {
    try {
      addToast("Getting token", { appearance: 'info' })
      const token = await magic.user.getIdToken({lifespan: 86400 /*24h*/})
      addToast("Token gotten", { appearance: 'success' })
      return token
    } catch (err) {
      addToast("Failed to get token: " + err.toString(), { appearance: 'error' })
    }
  }

  useEffect(() => {
    magic = new Magic(MAGIC_PUBLIC_KEY)
    checkIsLoggedIn()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loadingUser, loginUser, logoutUser, getToken }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContext