import { useState, useContext } from "react"

import LoginContext from "../context/LoginContext"
import AuthContext from "../context/AuthContext"
import styles from "../styles/Login.module.css"

const LoginForm = () => {
  const { loginUser } = useContext(AuthContext)

  const [email, setEmail] = useState("")
  const [disabled, setDisabled] = useState("")

  const handleInput = e => {
    setEmail(e.target.value)
  }
  const handleSubmit = async e => {
    e.preventDefault()
    setDisabled("disabled")
    await loginUser(email)
    setDisabled("")
  }
  return (
    <form className="d-flex flex-column" onSubmit={handleSubmit}>
      <label for="correo" className="form-label mt-2">correo:</label>
      <input
        type="email"
        id="correo"
        placeholder="tu dirección de correo"
        value={email}
        onChange={handleInput}
        className="mb-3 form-control"
      />
      <button type="submit" className={disabled.concat(" btn btn-primary")}>
        { disabled ? "Espera" : "Ingresar" }
      </button>
    </form>
  )
}

const LoginModal = () => {
  const { isOpen, closeModal } = useContext(LoginContext)
  if (!isOpen) {
    return null
  }
  const close = () => {
    closeModal()
  }
  return <div className={styles.container}>
    <div className={styles.content}>
      <button
        className={(styles.closeBtn).concat(" btn btn-secondary px-2 py-0")}
        onClick={close}
      >X</button>
      <h2 className="text-center">Inicia sesion:</h2>
      <LoginForm />
    </div>
  </div>
}

export default LoginModal