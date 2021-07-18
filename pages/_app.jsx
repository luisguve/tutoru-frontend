import { ToastProvider } from 'react-toast-notifications';

import '../styles/global.css'
import { AuthProvider } from "../context/AuthContext"
import { EjerciciosProvider } from "../context/EjerciciosContext"
import { CarritoProvider } from "../context/CarritoContext"
import Carrito from "../components/Carrito"

export default function App({ Component, pageProps }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <EjerciciosProvider>
          <CarritoProvider>
            <Component {...pageProps} />
            <Carrito />
          </CarritoProvider>
        </EjerciciosProvider>
      </AuthProvider>
    </ToastProvider>
  )
}