import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

import profilePic from "../../../../public/profilepic2.png"

export const CuentaMovil = () => (
  <li className="nav-item d-lg-none">
    <Link href="/cuenta">
      <a className="nav-link">
        Mi cuenta
      </a>
    </Link>
  </li>
)

export const CuentaDesktop = () => {
  const [ariaExpanded, setAriaExpanded] = useState(false)
  const [showClass, setShowClass] = useState("")
  const showMenu = (e) => {
    setAriaExpanded(true)
    setShowClass("show")
  }
  const hideMenu = (e) => {
    setAriaExpanded(false)
    setShowClass("")
  }
  return (
    <li
      className={showClass.concat(" nav-item dropdown")}
      onMouseEnter={showMenu}
      onMouseLeave={hideMenu}
    >
      <a
        href="#"
        id="cuentaDropdown"
        role="button"
        data-bs-toggle="dropdown"
        className={showClass.concat(" nav-link p-0 d-none d-lg-block")}
        aria-expanded={ariaExpanded}
      >
        <Image alt="perfil" width="40" height="40" src={profilePic} />
      </a>
      <ul
        aria-labelledby="cuentaDropdown"
        className={showClass.concat(" dropdown-menu")}
      >
        <li><a className="dropdown-item" href="/cuenta">Mi cuenta</a></li>
        <li><a className="dropdown-item" href="#">Salir</a></li>
      </ul>
    </li>
  )
}