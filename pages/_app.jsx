import { useEffect } from "react"
import { useRouter } from "next/router"
import { ToastProvider } from 'react-toast-notifications'

import '../styles/global.scss'
import 'bootstrap/dist/css/bootstrap.css'

import { AuthProvider } from "../context/AuthContext"
import { ArticulosProvider } from "../context/ArticulosContext"
import { CarritoProvider } from "../context/CarritoContext"
import { LoginProvider } from "../context/LoginContext"
import Carrito from "../components/Carrito"
import LoginModal from "../components/LoginModal"
import * as ga from '../lib/ga'

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url)
    }
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on('routeChangeComplete', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
  useEffect(() => {
    typeof document !== undefined ? require('bootstrap/dist/js/bootstrap') : null
  }, [])
  return (
    <ToastProvider>
      <AuthProvider>
        <ArticulosProvider>
          <CarritoProvider>
            <LoginProvider>
              <Component {...pageProps} />
              <Carrito />
              <LoginModal />
            </LoginProvider>
          </CarritoProvider>
        </ArticulosProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
