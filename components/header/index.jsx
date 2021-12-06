import { useEffect } from "react"
import Link from "next/link"

import styles from "../../styles/Header.module.scss"

import Menu from "./Menu"

export default function Header(props) {
  const { isHome, navItems, titulo, subtitulo, header } = props
  return (
    <>
      <header className={styles.Header}>
        {isHome ? (
          <HeaderInicio titulo={titulo} subtitulo={subtitulo} />
        ) : (
          <HeaderPagina titulo={header} />
        )}
      </header>
      <Navbar navItems={navItems} titulo={titulo} />
    </>
  )
}

const HeaderInicio = (props) => {
  return (
    <div className={styles.Header__Inicio}>
      <Contenido {...props} />
    </div>
  )
}
const HeaderPagina = (props) => {
  return (
    <div className={styles.Header__Pagina}>
      <Contenido {...props} />
    </div>
  )
}

const Contenido = ({titulo, subtitulo}) => {
  return (
    <div className={styles.Contenido}>
      <h1>{titulo}</h1>
      {
        subtitulo &&
        <em>{subtitulo}</em>
      }
    </div>
  )
}

const Navbar = ({ navItems, titulo }) => {

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
        <Link href="/"><a className="navbar-brand">{titulo}</a></Link>
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
