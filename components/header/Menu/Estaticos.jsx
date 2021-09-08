import Link from "next/link"
import Image from "next/image"

import BotonCarrito from "../../BotonCarrito";
import profilePic from "../../../public/profilepic2.png"

const CuentaMovil = () => (
  <li className="nav-item d-lg-none">
    <Link href="/cuenta">
      <a className="nav-link">
        Mi cuenta
      </a>
    </Link>
  </li>
)
const CuentaDesktop = () => (
  <li className="nav-item">
    <Image alt="perfil" width="40" height="40" src={profilePic} />
  </li>
)
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
