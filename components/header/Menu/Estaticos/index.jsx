import BotonCarrito from "../../../BotonCarrito";

import { CuentaMovil, CuentaDesktop } from "./Cuenta"

const BotonVerCarrito = () => (
  <li className="nav-item d-md-none">
    <BotonCarrito />
  </li>
)

const Estaticos = () => {
  return (
    <>
      <CuentaMovil />
      <CuentaDesktop />
      <BotonVerCarrito />
    </>
  )
}

export default Estaticos
