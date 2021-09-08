import { useEffect } from "react"
import { ToastProvider } from 'react-toast-notifications'

import '../styles/global.scss'
import 'bootstrap/dist/css/bootstrap.css'

import { AuthProvider } from "../context/AuthContext"
import { EjerciciosProvider } from "../context/EjerciciosContext"
import { CarritoProvider } from "../context/CarritoContext"
import { LoginProvider } from "../context/LoginContext"
import Carrito from "../components/Carrito"
import LoginModal from "../components/LoginModal"

export default function App({ Component, pageProps }) {
  useEffect(() => {
    typeof document !== undefined ? require('bootstrap/dist/js/bootstrap') : null
  }, [])
  return (
    <ToastProvider>
      <AuthProvider>
        <EjerciciosProvider>
          <CarritoProvider>
            <LoginProvider>
              <Component {...pageProps} />
              <Carrito />
              <LoginModal />
            </LoginProvider>
          </CarritoProvider>
        </EjerciciosProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
