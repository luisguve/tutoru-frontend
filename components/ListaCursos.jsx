import Link from "next/link"
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
  const items = cursos.map((c, idx) => {
    return (
      <ResumenCursoCarousel
        key={c.slug}
        data={c}
        first={idx === 0}
        categoria={categoria}
      />
    )
  })
  const navigationButtons = cursos.map((c, idx) => {
    return (
      <button
        type="button"
        data-bs-target="#carouselExampleCaptions"
        key={"button-".concat(idx)}
        className={idx === 0 ? "active" : ""}
        aria-current={idx === 0 ? "true" : undefined}
        aria-label={"Slide ".concat(idx)}
        data-bs-slide-to={idx}
      ></button>
    )
  })
  return (
    <div
      id="carouselExampleCaptions"
      data-bs-ride="carousel"
      className={"carousel slide mt-3 mt-md-0 " + styles["carousel"]}
    >
      <div className="carousel-indicators">
        {navigationButtons}
      </div>
      <div className="carousel-inner">
        {items}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  )
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

export const ResumenCursoCarousel = (props) => {
  const { data, categoria, small, first } = props
  const { datosCursoUsuario, loadingCurso } = useCurso(data.id)
  const cursoComprado = useCursoComprado(data.id)
  const url = `/${categoria}/cursos/${data.slug}`
  return (
    <div
      data-bs-interval="3600000"
      className={
        "carousel-item "
        .concat(first ? " active " : "")
        .concat(styles["carousel-item"])
      }
    >
      <img
        className="d-block w-100"
        alt="thumbnail"
        src={data.thumbnail.formats.thumbnail.url}
      />
      <div
        className={
          "carousel-caption text-dark "
          .concat(styles["carousel-item-content"] + " ")
          .concat(styles["carousel-caption"])
        }
      >
        <h5>
          <Link href={url}>
            <a>{data.titulo}</a>
          </Link>
        </h5>
        <p className="mb-0">{data.videos} clases - {formatDuration(data.duracion*1000)}</p>
        {
          loadingCurso ?
            <p>Cargando informacion...</p>
          : datosCursoUsuario && <MetadataCurso data={datosCursoUsuario} center={true} />
        }
        {
          !cursoComprado && <strong className="d-block">${data.precio}</strong>
        }
        <div className="d-flex flex-column align-items-center">
          <div className={"d-flex align-items-center ".concat(styles.botones)}>
            <Link href={url}>
              <a className="btn btn-sm btn-outline-primary me-2">Ver curso</a>
            </Link>
            {
              cursoComprado ?
                <Link href={url.concat("/ver")}>
                  <a className="btn btn-sm btn-success">Ir al curso</a>
                </Link>
              : <BotonAgregarCarrito articulo={data} />
            }
          </div>
        </div>
      </div>
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
