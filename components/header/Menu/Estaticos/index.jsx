import { useContext } from "react"

import BotonCarrito from "../../../BotonCarrito";
import AuthContext from "../../../../context/AuthContext";

import { CuentaMovil, CuentaDesktop } from "./Cuenta"

const BotonVerCarrito = () => (
  <li className="nav-item d-md-none">
    <BotonCarrito />
  </li>
)

const Estaticos = () => {
  const { user, loginUser: login } = useContext(AuthContext)
  return (
    <>
      {
        user ?
        <>
          <CuentaMovil />
          <CuentaDesktop />
        </>
        :
        <li className="nav-item d-flex align-items-center">
          <button className="btn btn-secondary mt-1 mb-2 my-lg-0">Iniciar sesión</button>
        </li>
      }
      <BotonVerCarrito />
    </>
  )
}

export default Estaticos
