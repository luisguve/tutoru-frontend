import { createContext, useEffect, useContext, useState } from "react"

import AuthContext from "./AuthContext"

const LoginContext = createContext()

export const LoginProvider = props => {
  const { user } = useContext(AuthContext)
  const [status, setStatus] = useState({isOpen: false})
  useEffect(() => {
    if (user) {
      setStatus({isOpen: false})
    }
  }, [user])

  const openModal = (accion) => {
    setStatus({
      isOpen: true,
      accion
    })
  }
  const closeModal = () => {
    setStatus({
      isOpen: false
    })
  }

  return <LoginContext.Provider value={{
    isOpen: status.isOpen,
    accion: status.accion,
    openModal,
    closeModal
  }}>
    {props.children}
  </LoginContext.Provider>
}

export default LoginContext