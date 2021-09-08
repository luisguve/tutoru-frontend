import { createContext, useEffect, useContext, useState } from "react"

import AuthContext from "./AuthContext"

const LoginContext = createContext()

export const LoginProvider = props => {
  const { user } = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    if (user) {
      setIsOpen(false)
    }
  }, [user])

  const openModal = () => {
    setIsOpen(true)
  }
  const closeModal = () => {
    setIsOpen(false)
  }

  return <LoginContext.Provider value={{isOpen, openModal, closeModal}}>
    {props.children}
  </LoginContext.Provider>
}

export default LoginContext