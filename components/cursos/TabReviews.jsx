import { useContext, useState, useEffect } from "react"
import { useToasts } from "react-toast-notifications"
import ReactStars from "react-rating-stars-component"

import AuthContext from "../../context/AuthContext"
import { useCursoComprado } from "../../hooks/articulo"
import { STRAPI } from "../../lib/urls"

/**
  data: null || [
    {
      "id": 1,
      "review": 1,
      "usuario": 3,
      "comentario": "Este curso es muy recomendable",
      "calificacion": 5,
      "created_by": 1,
      "updated_by": 1,
      "created_at": "2021-12-01T13:42:06.510Z",
      "updated_at": "2021-12-01T13:42:06.562Z"
    }
  ]
*/
const TabReviews = ({data, cursoID}) => {
  const { addToast } = useToasts()
  const cursoComprado = useCursoComprado(cursoID)
  const [contenido, setContentido] = useState("")
  const [estrellas, setEstrellas] = useState(5)
  const [enviando, setEnviando] = useState(false)
  const [dataReviews, setDataReviews] = useState(data)
  const [reviews, setReviews] = useState(null)
  const [userReview, setUserReview] = useState({jsx: null, comentario: ""})
  const { user, token } = useContext(AuthContext)
  const handleEstrellas = rating => {
    setEstrellas(rating)
  }
  const handleInput = e => {
    setContentido(e.target.value)
  }
  const handleSubmit = async e => {
    e.preventDefault()
    const url = `${STRAPI}/masterclass/curso/${cursoID}/review`
    const options = {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        estrellas,
        contenido
      })
    }
    setEnviando(true)
    try {
      const res = await fetch(url, options)
      if (!res.ok) {
        if (res.status === 400) {
          addToast("La reseña ya ha sido enviada", {appearance: "error"})
          throw new Error("ReviewExiste")
        }
        throw await res.json()
      }
      addToast("La reseña ha sido enviada", {appearance: "success"})
      // Actualizar lista de reseñas para incluir la nueva del usuario.
      const nuevoReview = {
        id: dataReviews ? dataReviews.length + 1 : 1,
        usuario: user.id,
        comentario: contenido,
        calificacion: estrellas
      }
      const nuevosReviews = dataReviews ? [nuevoReview, ...dataReviews] : [nuevoReview]
      setDataReviews(nuevosReviews)
    } catch(err) {
      if (err.toString() !== "ReviewExiste") {
        console.log(err)
        addToast("No se pudo enviar la reseña", {appearance: "error"})
      }
    } finally {
      setEnviando(false)
    }
  }

  useEffect(() => setDataReviews(data), [data])
  useEffect(() => {
    if (dataReviews) {
      const totalReviews = dataReviews.reduce((col, rvw) => {
        if (!user) {
          setUserReview({jsx: null, comentario: ""})
        } else if (rvw.usuario === user.id) {
          const nuevoUserReview = {
            jsx: (
              <div className="mb-3">
                <p className="px-2 mb-0 d-flex">
                  <span className="me-2 d-flex align-items-center">Tu calificacion:</span>
                  <ReactStars
                    activeColor="#ffd700"
                    value={rvw.calificacion}
                    size={32}
                    edit={false}
                  />
                </p>
                {
                  rvw.comentario &&
                  <div className="d-flex align-items-center">
                    <span className="me-1"><strong>Tú:</strong></span>
                    <p className="border rounded-3 py-3 px-2 mb-0">{rvw.comentario}</p>
                  </div>
                }
              </div>
            ),
            comentario: rvw.comentario !== ""
          }
          setUserReview(nuevoUserReview)
          return col
        }
        // si no hay comentario: ignorar
        if (!rvw.comentario) {
          return col
        }
        return col.concat(
          <p
            className="border rounded-3 py-3 px-2 mb-3"
            key={rvw.id}
          >{rvw.comentario}</p>
        )
      }, [])
      setReviews(totalReviews)
    }
  }, [dataReviews, user])
  const noComentarios = (!reviews || !reviews.length) && !userReview.comentario

  return (
    <div className="mt-3">
      {
        /*
        1. El review del usuario puede no tener comentario
        2. No hay reseñas y el usuario no ha calificado el curso
        */
        noComentarios ?
          <>
            <p className="fw-bold">Todavía no hay comentarios</p>
            {userReview.jsx}
          </>
        : <>{userReview.jsx}{reviews}</>
      }
      {
        (cursoComprado && !userReview.jsx) &&
        <>
        <h5 className="text-center mt-lg-5 mb-0">Califica este curso</h5>
        <form onSubmit={handleSubmit}>
          <ReactStars
            activeColor="#ffd700"
            value={estrellas}
            size={44}
            onChange={handleEstrellas}
          />
          <div className="mb-3">
            <label htmlFor="comentario-contenido" className="form-label">
              Comentario (opcional)
            </label>
            <textarea
              className="form-control"
              id="comentario-contenido"
              rows="3"
              onChange={handleInput}
            ></textarea>
            <div className="form-text">El comentario es opcional</div>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={enviando ? "disabled" : undefined}
          >{enviando ? "Enviando..." : "Enviar reseña"}</button>
        </form>
        </>
      }
    </div>
  )
}

export default TabReviews