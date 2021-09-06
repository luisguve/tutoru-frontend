import indiceCategorias from "./categorias"
import { API_URL } from "./urls"

export const titulo = "Tutor Universitario"

export const cargarNavItems = async () => {
  const submenu = await indiceCategorias.root()
  return [
    {
      Titulo_normal: "Ejercicios resueltos",
      Titulo_url: "#",
      hijos: submenu
    }
  ]
}

export const cargarInformacionSitio = async () => {
  const url = `${API_URL}/home`
  const home_res = await fetch(url)
  const home_json = await home_res.json()
  return home_json
}
