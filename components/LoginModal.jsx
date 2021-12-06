import { useState, useContext } from "react"
import { useToasts } from "react-toast-notifications"

import LoginContext from "../context/LoginContext"
import AuthContext from "../context/AuthContext"
import styles from "../styles/Login.module.css"
import { STRAPI } from "../lib/urls"

const RegisterForm = () => {
  const { addToast } = useToasts()
  const { loginUser } = useContext(AuthContext)
  const [username, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")
  const [mostrar, setMostrar] = useState(false)
  const [loading, setLoading] = useState(false)
  const validInputs = () => {
    return username !== "" && email !== "" && password !== "" && password2 !== ""
  }
  const handleName = (e) => {
    setName(e.target.value)
  }
  const handleEmail = (e) => {
    setEmail(e.target.value)
  }
  const handlePassword = (e) => {
    setPassword(e.target.value)
  }
  const handlePassword2 = (e) => {
    setPassword2(e.target.value)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validInputs()) {
      return
    }
    setLoading(true)
    if (!(password === password2)) {
      addToast("Ambas contraseñas deben coincidir", {appearance: "warning"})
      return false
    }
    const url = `${STRAPI}/auth/local/register`
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        username,
        email,
        password
      })
    })
    .then(res => {
      if (!(res.status >= 200 && res.status < 300)) {
        console.log("error:", res.status)
        throw res
      }
      return res.json()
    })
    .then((data) => {
      setLoading(false)
      // Handle success.
      addToast('Registrado exitosamente', {appearance: "success"})
      loginUser({
        email: `${data.user.username} (${data.user.email})`,
        id: data.user.id,
        token: data.jwt
      })
    })
    .catch(error => {
      setLoading(false)
      // Handle error.
      console.log(error);
      addToast('No se pudo registrar este correo', {appearance: "error"})
    });
  }

  return (
    <div className="d-flex flex-column border rounded p-1 p-md-3">
      <h4 className="fs-5 text-center">Registrate</h4>
      <form className="d-flex flex-column" onSubmit={handleSubmit}>
        <label className="d-flex flex-column mb-2">
          Nombre completo
          <input className="form-control" type="text" value={username} onChange={handleName} required />
        </label>
        <label className="d-flex flex-column mb-2">
          Correo electrónico
          <input className="form-control" type="email" value={email} onChange={handleEmail} required />
        </label>
        <label className="d-flex flex-column mb-2">
          Contraseña
          <input className="form-control"
            type={mostrar ? "text" : "password"}
            value={password}
            onChange={handlePassword}
            required
          />
        </label>
        <label className="d-flex flex-column mb-2">
          Confirmar contraseña
          <input className="form-control"
            type={mostrar ? "text" : "password"}
            value={password2}
            onChange={handlePassword2}
            required
          />
        </label>
        <label className="d-flex">
          <input
            className="form-check me-1"
            type="checkbox"
            value={mostrar}
            onChange={() => setMostrar(!mostrar)}
          />
          Ver contraseña
        </label>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={(loading || !validInputs()) ? "disabled" : undefined}
        >{loading ? "Cargando..." : "Registrarse"}</button>
      </form>
    </div>
  )
}

const LoginForm = () => {
  const { addToast } = useToasts()
  const { loginUser } = useContext(AuthContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const validInputs = () => {
    return email !== "" && password !== ""
  }
  const handleEmail = (e) => {
    setEmail(e.target.value)
  }
  const handlePassword = (e) => {
    setPassword(e.target.value)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validInputs) {
      return
    }
    setLoading(true)
    const url = `${STRAPI}/auth/local`
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        identifier: email,
        password
      })
    })
    .then(async res => {
      const body = await res.json()
      if (!res.ok) {
        if (res.status === 400) {
          // Possibly the user has not confirmed his email
          if (body.message[0].messages[0].id === "Auth.form.error.confirmed") {
            addToast("Hemos enviado un link de confirmación a tu correo", {appearance: "warning"})
            throw "Auth.form.error.confirmed"
          }
        }
        throw body
      }
      return body
    })
    .then((data) => {
      setLoading(false)
      // Handle success.
      loginUser({
        email: `${data.user.username} (${data.user.email})`,
        id: data.user.id,
        token: data.jwt
      })
    })
    .catch(error => {
      setLoading(false)
      if (error === "Auth.form.error.confirmed") {
        // This error is already handled
        return
      }
      // Handle error.
      console.log(error);
      addToast('Correo o contraseña inválidos', {appearance: "error"})
    });
  }
  return (
    <div className="d-flex flex-column mt-3 border rounded p-1 p-md-3">
      <h4 className="fs-5 text-center">Inicia sesión</h4>
      <form className="d-flex flex-column" onSubmit={handleSubmit}>
        <label className="d-flex flex-column mb-2">
          Correo electrónico
          <input className="form-control" type="email" value={email} onChange={handleEmail} required />
        </label>
        <label className="d-flex flex-column mb-2">
          Contraseña
          <input className="form-control" type="password" value={password} onChange={handlePassword} required />
        </label>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={(loading || !validInputs()) ? "disabled" : undefined}
        >{loading ? "Cargando..." : "Iniciar sesión"}</button>
      </form>
    </div>
  )
}

const LoginModal = () => {
  const { isOpen, accion, closeModal } = useContext(LoginContext)
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
      {
        (accion === "inicio") ?
          <LoginForm />
        : <RegisterForm />
      }
    </div>
  </div>
}

export default LoginModal