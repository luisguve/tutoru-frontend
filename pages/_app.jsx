import '../styles/global.css'
import { AuthProvider } from "../context/AuthContext"
import { EjerciciosProvider } from "../context/EjerciciosContext"
import { ToastProvider } from 'react-toast-notifications';

export default function App({ Component, pageProps }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <EjerciciosProvider>
          <Component {...pageProps} />
        </EjerciciosProvider>
      </AuthProvider>
    </ToastProvider>
  )
}