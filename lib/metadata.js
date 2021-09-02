import indiceCategorias from "./categorias"

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
