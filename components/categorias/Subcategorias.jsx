import Link from "next/link"

export default function subcategorias({parentUrl, subcategorias}) {
  const subcategoriaRecursiva = ({parentUrl, subcategorias}) => {
    return subcategorias.map(s => {

      const { hijos } = s

      let subcategorias = null
      if (hijos.length) {
        subcategorias = subcategoriaRecursiva({
          parentUrl: `${parentUrl}/${s.Titulo_url}`,
          subcategorias: hijos
        })
      }

      return (<div key={s.Titulo_url}>
        <h5>
          <Link href={`${parentUrl}/${s.Titulo_url}`}>
            <a className="ms-1">{s.Aria_label || s.Titulo_normal} {
              !subcategorias && `(${s.ejercicios.length})`
            }</a>
          </Link>
          {
            subcategorias &&
            <div className="ms-4">
               {subcategorias}
            </div>
          }
        </h5>
      </div>)
    })
  }
  return subcategoriaRecursiva({parentUrl, subcategorias})
}