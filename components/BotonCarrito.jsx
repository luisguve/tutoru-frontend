import { useContext } from "react"

import CarritoContext from "../context/CarritoContext"
import styles from "../styles/Carrito.module.scss"
import { useInformacion } from "../hooks/carrito"

export default function Carrito() {
  const { informacion } = useInformacion()
  const { setPaso1, setPaso2, setClass } = useContext(CarritoContext)
  const irPaso1 = () => {
    setPaso1(true)
    const className = `${styles.Contenedor__Carrito} ${styles.abierto}`
    setClass(className)
  }
  return (
    <button className={styles.Icono.concat(" btn btn-outline-success")} onClick={irPaso1}>
      Ver carrito {
        (informacion && informacion.articulos.length) ? `(${informacion.articulos.length})`: null
      }
    </button>
  )
}