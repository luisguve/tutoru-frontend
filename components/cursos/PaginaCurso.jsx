import { useContext } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import ReactStars from "react-rating-stars-component"
import formatDuration from "format-duration"

import BotonAgregarCarrito from "../../components/BotonAgregarCarrito"
import TabsManager from "./TabsManager"

import ArticulosContext from "../../context/ArticulosContext"
import AuthContext from "../../context/AuthContext"
import { useCurso, useCursoComprado } from "../../hooks/articulo"

const PaginaCurso = (props) => {
  const {
    id,
    titulo,
    thumbnail,
    videos,
    duracion,
    precio,
    descripcion,
  } = props.resumen
  const clases = videos.length
  const { user } = useContext(AuthContext)
  const { loadingIDsArticulos } = useContext(ArticulosContext)
  const { datosCursoUsuario, loadingCurso } = useCurso(id)
  const cursoComprado = useCursoComprado(id)
  const router = useRouter()
  const verCursoURL = `${router.asPath}/ver`

  return (
    <div>
      {
        user ?
          <h1 className="text-center">
            <Link href={verCursoURL}><a>{titulo}</a></Link>
          </h1>
        : <h1 className="text-center">{titulo}</h1>
      }
      <div className="container px-0 px-md-2">
        <div className="row flex-column-reverse flex-lg-row mt-2 mt-lg-5 mx-0">
          <div className="col-lg-6">
            {
              loadingIDsArticulos && !cursoComprado ?
                // El usuario esta cargando
                <>
                  <strong>${precio}</strong> 
                  <p>Cargando usuario...</p>
                </>
              :
                cursoComprado ?
                  // El usuario adquirió este curso
                  <Link href={verCursoURL}>
                    <a>Ir al curso</a>
                  </Link>
                :
                  // El usuario no tiene acceso a este curso
                  <>
                    <strong>${precio}</strong>
                    <div><BotonAgregarCarrito articulo={props.resumen} /></div>
                  </>
            }
            <p>{clases} clases - {formatDuration(duracion*1000)}</p>
            {
              loadingCurso ?
                <p>Cargando informacion...</p>
              : datosCursoUsuario && <MetadataCurso data={datosCursoUsuario} />
            }
          </div>
          <div className="col-lg-6 d-flex justify-content-center align-items-start px-0 px-md-2">
            <img className="img img-fluid" alt="thumbnail" src={thumbnail.url} />
          </div>
        </div>
        <div className="row mt-2 mt-lg-4 mx-0 border rounded-3 py-3">
          <p className="col-12">{descripcion}</p>
        </div>
        <div className="row mt-2 mt-lg-4 mx-0">
          <TabsManager
            dataUsuarios={datosCursoUsuario}
            dataVideos={videos}
            cursoID={id}
          />
        </div>
      </div>
    </div>
  )
}

export default PaginaCurso

export const MetadataCurso = ({data}) => {
  const {
    estudiantes,
    reviews,
    rating,
    preguntas
  } = data
  return (
    <div>
      <p className="mb-1">
        <ReactStars
          activeColor="#ffd700"
          value={rating}
          size={32}
          isHalf={true}
          edit={false}
        />
        {
          (reviews && reviews.length > 0) ?
            reviews.length === 1 ?
              `${rating}/5 según 1 estudiante`
            : `${rating}/5 según ${reviews.length} estudiantes`
          : `0 reseñas`
        }
      </p>
      <p className="mb-1">
        {
          estudiantes === 1 ?
            `1 estudiante`
          : `${estudiantes} estudiantes`
        }
      </p>
      <p className="mb-2">
        {
          (preguntas && preguntas.length > 0) ?
            preguntas.length === 1 ?
              `1 pregunta de clase`
            : `${preguntas.length} preguntas de clase`
          : `Todavía no hay preguntas`
        }
      </p>
    </div>
  )
}
