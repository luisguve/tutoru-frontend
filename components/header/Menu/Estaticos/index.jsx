import { useContext } from "react"

import BotonCarrito from "../../../BotonCarrito";
import AuthContext from "../../../../context/AuthContext";
import LoginContext from "../../../../context/LoginContext";

import { CuentaMovil, CuentaDesktop } from "./Cuenta"

const BotonVerCarrito = () => (
  <li className="nav-item d-md-none">
    <BotonCarrito />
  </li>
)

const Estaticos = () => {
  const { user, loginUser: login } = useContext(AuthContext)
  const { openModal, closeModal } = useContext(LoginContext)
  const iniciar = () => {
    openModal("inicio")
  }
  const registrar = () => {
    openModal("registro")
  }
  return (
    <>
      {
        user ?
        <>
          <CuentaMovil />
          <CuentaDesktop />
        </>
        :
        <>
          <li className="nav-item d-flex align-items-center">
            <button
              className="btn btn-primary mt-1 mb-2 my-lg-0"
              onClick={iniciar}
            >
              Iniciar sesión
            </button>
          </li>
          <li className="nav-item d-flex align-items-center ms-lg-2">
            <button
              className="btn btn-secondary mt-1 mb-2 my-lg-0"
              onClick={registrar}
            >
              Registrarse
            </button>
          </li>
        </>
      }      
      <BotonVerCarrito />
    </>
  )
}

export default Estaticos
