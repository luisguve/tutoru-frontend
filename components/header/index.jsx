import { useEffect } from "react"

import styles from "../../styles/Header.module.scss"
import { titulo } from "../../lib/metadata"

import Menu from "./Menu"

export default function Header(props) {
  const { isHome, navItems } = props
  return (
    <>
      <header className={styles.Header}>
        {isHome ? (
          <HeaderInicio />
        ) : (
          <HeaderPagina />
        )}
      </header>
      <Navbar navItems={navItems} />
    </>
  )
}

const HeaderInicio = () => {
  return (
    <div className={styles.Header__Inicio}>
      <Contenido />
    </div>
  )
}
const HeaderPagina = () => {
  return (
    <div className={styles.Header__Pagina}>
      <Contenido />
    </div>
  )
}

const Contenido = () => {
  return (
    <div className={styles.Contenido}>
      <h1>{titulo}</h1>
    </div>
  )
}

const Navbar = ({ navItems }) => {

  useEffect(() => {
    // close all inner dropdowns when parent is closed
    if (window.innerWidth < 992) {

      document.querySelectorAll('.navbar .dropdown').forEach(function(everydropdown){
        everydropdown.addEventListener('hidden.bs.dropdown', function () {
          // after dropdown is hidden, then find all submenus
          this.querySelectorAll('.submenu').forEach(function(everysubmenu){
            // hide every submenu as well
            everysubmenu.classList.add("oculto")
          })
        })
      })
    }
  }, [])

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">{titulo}</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main_nav"  aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="main_nav">
          <Menu navItems={navItems} />
        </div>
      </div>
    </nav>
  )
}
