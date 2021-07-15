import '../styles/global.css'
import { AuthProvider } from "../context/AuthContext"
import { ToastProvider } from 'react-toast-notifications';

export default function App({ Component, pageProps }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ToastProvider>
  )
}