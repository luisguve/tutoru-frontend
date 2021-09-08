import { useContext, useState } from "react"
import Link from "next/link"

import authContext from "../context/AuthContext"

const Footer = () => {
  const { user, loginUser: login } = useContext(authContext)

  const [email, setEmail] = useState("")

  const handleInput = e => {
    setEmail(e.target.value)
  }
  const handleSubmit = e => {
    e.preventDefault()
    login(email)
  }

  return (
    <footer className="py-3">
      {user ?
        (<h6 className="user-info">
          <Link href="/cuenta"><a>Iniciaste como {user.email}</a></Link>
        </h6>)
        :
        (
          <>
          <h2>Inicia sesion:</h2>
          <form onSubmit={handleSubmit}>
            <label>
              correo:
              <input
                type="email"
                placeholder="tu dirección de correo"
                value={email}
                onChange={handleInput}
                style={{marginLeft: 10}}
              />
            </label>
            <button type="submit">
              Ingresar
            </button>
          </form>
          </>
        )
      }
      <h6>Tutor universitario - copyright 2021</h6>
    </footer>
  )
}

export default Footer