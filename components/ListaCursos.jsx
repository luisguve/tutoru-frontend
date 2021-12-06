import Link from "next/link"
import Slider from "react-slick"
import formatDuration from "format-duration"

import BotonAgregarCarrito from "./BotonAgregarCarrito"
import { MetadataCurso } from "./cursos/PaginaCurso"
import { useCurso, useCursoComprado } from "../hooks/articulo"
import styles from "../styles/ListaCurso.module.scss"

export const ListaCursosCarrusel = (props) => {
  const { categoria, cursos } = props
  if (cursos.length === 1) {
    return (
      <div className="px-lg-4 mt-3 mb-5">
        <ResumenCurso data={cursos[0]} categoria={categoria} />
      </div>
    )
  }
  const items = cursos.map(c => {
    return (
      <ResumenCurso
        key={c.slug}
        data={c}
        categoria={categoria}
      />
    )
  })
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3
  };
  return <Slider {...settings}>{items}</Slider>
}

export const ListaCursosCards = (props) => {
  const { categoria, cursos } = props
  const items = cursos.map(c => {
    return (
      <div className="col-12 col-lg-6 mb-1 mb-lg-3" key={c.id}>
        <ResumenCurso
          key={c.slug}
          data={c}
          categoria={categoria}
          small={true}
        />
      </div>
    )
  })
  return (
    <div className="row mx-0 mt-5">
      {items}
    </div>
  )
}

export const ResumenCurso = (props) => {
  const { data, categoria, small } = props
  const { datosCursoUsuario, loadingCurso } = useCurso(data.id)
  const cursoComprado = useCursoComprado(data.id)
  const url = `/${categoria}/cursos/${data.slug}`
  return (
    <div className={"card ".concat(small ? styles.carta : "")}>
      <img className="card-img-top" alt="thumbnail" src={data.thumbnail.formats.thumbnail.url} />
      <div className="card-body">
        <h5 className="card-title">
          <Link href={url}>
            <a className="legend">{data.titulo}</a>
          </Link>
        </h5>
        <p className="card-text mb-0">{data.videos} clases - {formatDuration(data.duracion*1000)}</p>
        {
          loadingCurso ?
            <p>Cargando informacion...</p>
          : datosCursoUsuario && <MetadataCurso data={datosCursoUsuario} />
        }
        {
          !cursoComprado && <strong className="d-block">${data.precio}</strong>
        }
        <div className={"d-flex align-items-center ".concat(styles.botones)}>
          <Link href={url}>
            <a className="btn btn-outline-primary me-2">Ver curso</a>
          </Link>
          {
            cursoComprado ?
              <Link href={url.concat("/ver")}>
                <a className="btn btn-success">Ir al curso</a>
              </Link>
            : <BotonAgregarCarrito articulo={data} />
          }
        </div>
      </div>
    </div>
  )
}
