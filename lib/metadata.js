import indiceCategorias from "./categorias"
import { STRAPI } from "./urls"

import coverFDT from "../public/img/cover_fenomenos_de_transporte.png"
import coverTermodinamica from "../public/img/cover_termodinamica.png"
import coverMV from "../public/img/cover_mecanica_vectorial.png"
import coverFE from "../public/img/cover_portada_fisica_electrica.png"
import coverED from "../public/img/cover_ecuaciones_diferenciales.png"

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
  const url = `${STRAPI}/home`
  const home_res = await fetch(url)
  const home_json = await home_res.json()
  return home_json
}

export const covers = {
  "fenomenos-de-transporte": coverFDT,
  "termodinamica": coverTermodinamica,
  "mecanica-vectorial": coverMV,
  "fisica-electrica": coverFE,
  "ecuaciones-diferenciales": coverED
}
