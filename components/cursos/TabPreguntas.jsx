import { useState, useEffect, useContext } from "react"
import { useToasts } from "react-toast-notifications"

import AuthContext from "../../context/AuthContext"
import { STRAPI } from "../../lib/urls"

/*
data: null || [
  {
    "id": 1,
    "contenido": "Una pregunta sobre este curso",
    "curso": 1,
    "autor": 3,
    "created_by": 1,
    "updated_by": 1,
    "created_at": "2021-12-01T13:36:31.917Z",
    "updated_at": "2021-12-01T13:36:31.966Z"
  }
]
*/
const TabPreguntas = ({data, cursoID}) => {
  const { user } = useContext(AuthContext)
  const [preguntas, setPreguntas] = useState(null)
  const [preguntasUsuario, setPreguntasUsuario] = useState(null)
  const [dataPreguntas, setDataPreguntas] = useState(
    data ? data.filter(p => !user || (p.autor !== user.id)) : null
  )
  const [dataPreguntasUsuario, setDataPreguntasUsuario] = useState(
    data ? data.filter(p => user && (p.autor === user.id)) : null
  )
  useEffect(() => setDataPreguntas(
    data ? data.filter(p => !user || (p.autor !== user.id)) : null
  ), [data, user])
  useEffect(() => setDataPreguntasUsuario(
    data ? data.filter(p => user && (p.autor === user.id)) : null
  ), [data, user])
  useEffect(() => {
    if (dataPreguntas) {
      const totalPreguntas = dataPreguntas.reduce((col, pregunta) => {
        return [
          <Comentario pregunta={pregunta} key={pregunta.id} />,
          ...col
        ]
      }, [])
      setPreguntas(totalPreguntas)
    }
  }, [dataPreguntas])
  useEffect(() => {
    if (dataPreguntasUsuario) {
      const totalPreguntas = dataPreguntasUsuario.reduce((col, pregunta) => {
        return [
          <Comentario pregunta={pregunta} delUsuario={true} key={pregunta.id} />,
          ...col
        ]
      }, [])
      setPreguntasUsuario(totalPreguntas)
    }
  }, [dataPreguntasUsuario])

  const noPreguntas =
    (!preguntas || !preguntas.length) &&
    (!preguntasUsuario || !preguntasUsuario.length)
  return (
    <div className="mt-3">
      {
        user ?
          <FormPregunta
            preguntas={preguntas}
            actualizarPreguntas={setDataPreguntas}
            cursoID={cursoID}
          >
            <h4 className="text-center mb-0">Haz una pregunta</h4>
          </FormPregunta>
        : <h4 className="text-center mb-3">Inicia sesión para preguntar algo</h4>
      }
      {
        noPreguntas ?
          <p>Todavía no hay preguntas</p>
        : <>{preguntasUsuario}{preguntas}</>
      }
    </div>
  )
}

export default TabPreguntas

const FormPregunta = (props) => {
  const { addToast } = useToasts()
  const { preguntas, actualizarPreguntas, cursoID } = props
  const { user, token } = useContext(AuthContext)
  const [contenido, setContentido] = useState("")
  const [enviando, setEnviando] = useState(false)
  const handleInput = e => {
    setContentido(e.target.value)
  }
  const handleSubmit = async e => {
    e.preventDefault()
    if (!contenido) {
      return
    }
    const url = `${STRAPI}/masterclass/curso/${cursoID}/pregunta`
    const options = {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        contenido
      })
    }
    setEnviando(true)
    try {
      const res = await fetch(url, options)
      if (!res.ok) {
        throw await res.json()
      }
      const { id } = await res.json()
      addToast("La pregunta ha sido enviada", {appearance: "success"})
      // Actualizar lista de preguntas para incluir la nueva del usuario.
      const nuevaPregunta = {
        id,
        autor: user.id,
        contenido
      }
      const nuevasPreguntas = preguntas ? [nuevaPregunta, ...preguntas] : [nuevaPregunta]
      actualizarPreguntas(nuevasPreguntas)
      setContentido("")
    } catch(err) {
      console.log(err)
      addToast("No se pudo enviar la pregunta", {appearance: "error"})
    } finally {
      setEnviando(false)
    }
  }
  return (
    <>
      {props.children}
      <form className="mb-3" onSubmit={handleSubmit}>
        <div className="mb-1">
          <label htmlFor="pregunta-contenido" className="form-label">
            Escribe tu pregunta
          </label>
          <textarea
            className="form-control"
            id="pregunta-contenido"
            rows="3"
            onChange={handleInput}
            value={contenido}
            required
          ></textarea>
        </div>
        <div className="d-flex justify-content-end">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={enviando ? "disabled" : undefined}
          >{enviando ? "Enviando..." : "Enviar pregunta"}</button>
        </div>
      </form>
    </>
  )
}

const Comentario = ({ pregunta, delUsuario, esRespuesta }) => {
  const { user } = useContext(AuthContext)
  const [dataRespuestas, setDataRespuestas] = useState(pregunta.respuestas)
  const [respuestas, setRespuestas] = useState(null)
  const [verRespuestas, setVerRespuestas] = useState(false)

  useEffect(() => {
    if (dataRespuestas && dataRespuestas.length) {
      const totalRespuestas = dataRespuestas.map(respuesta => {
        const delUsuario = respuesta.autor === user.id
        return (
          <Comentario
            pregunta={respuesta}
            key={respuesta.id}
            esRespuesta={true}
            delUsuario={delUsuario}
          />
        )
      })
      setRespuestas(totalRespuestas)
    }
  }, [dataRespuestas])

  const handleNuevaRespuesta = r => {
    setDataRespuestas(dataRespuestas.concat(r))
  }
  const toggleRespuestas = e => {
    setVerRespuestas(!verRespuestas)
  }
  return (
    <div className={"d-flex flex-column ".concat(!esRespuesta ? "mb-3" : "")}>
      <div className="d-flex align-items-center mb-1">
        {
          delUsuario &&
          <span className="me-1"><strong>Tú:</strong></span>
        }
        <p className="border rounded-3 py-3 px-2 mb-0">
          {pregunta.contenido}
        </p>
      </div>
      {
        !esRespuesta ?
          (dataRespuestas.length > 0) ?
            <div className="ms-2">
              <button className="btn btn-link mb-1" onClick={toggleRespuestas}>
                {dataRespuestas.length}
                {dataRespuestas.length === 1 ? " respuesta" : " respuestas"}
              </button>
            </div>
          : <span>0 respuestas</span>
        : null
      }
      {
        verRespuestas &&
        <div className="ms-2 ms-md-4">
          {respuestas}
        </div>
      }
      {
        (user && !esRespuesta) &&
        <FormRespuesta
          agregarRespuesta={handleNuevaRespuesta}
          idPregunta={pregunta.id}
        />
      }
    </div>
  )
}

const FormRespuesta = ({ idPregunta, agregarRespuesta }) => {
  const { addToast } = useToasts()
  const { user, token } = useContext(AuthContext)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [contenido, setContentido] = useState("")
  const [enviando, setEnviando] = useState(false)
  const handleInput = e => {
    setContentido(e.target.value)
  }
  const handleSubmit = async e => {
    e.preventDefault()
    if (!contenido) {
      return
    }
    const url = `${STRAPI}/masterclass/respuesta/${idPregunta}`
    const options = {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        contenido
      })
    }
    setEnviando(true)
    try {
      const res = await fetch(url, options)
      if (!res.ok) {
        throw await res.json()
      }
      const { id } = await res.json()
      addToast("La respuesta ha sido enviada", {appearance: "success"})
      // Actualizar lista de respuestas para incluir la nueva.
      const nuevaRespuesta = {
        id,
        autor: user.id,
        contenido
      }
      agregarRespuesta(nuevaRespuesta)
      setContentido("")
      setMostrarForm(false)
    } catch(err) {
      console.log(err)
      addToast("No se pudo enviar la respuesta", {appearance: "error"})
    } finally {
      setEnviando(false)
    }
  }
  return (
    <>
      {
        !mostrarForm ?
          <button className="btn btn-light" onClick={() => setMostrarForm(true)}>Responder</button>
        : (
          <form onSubmit={handleSubmit}>
            <textarea
              className="form-control mb-1"
              id="pregunta-contenido"
              rows="3"
              onChange={handleInput}
              value={contenido}
              required
            ></textarea>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={enviando ? "disabled" : undefined}
            >{enviando ? "Enviando..." : "Responder"}</button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              disabled={enviando ? "disabled" : undefined}
              onClick={() => setMostrarForm(false)}
            >Cancelar</button>
          </form>
        )
      }
    </>
  )
}
