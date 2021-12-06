import { useContext } from "react"
import formatDuration from "format-duration"

import styles from "../../styles/PaginaCurso.module.scss"
import { STRAPI } from "../../lib/urls"
import AuthContext from "../../context/AuthContext"

export const ListaVideos = (props) => {
  const { data, clasesCompletadas, cursoID } = props
  const { token } = useContext(AuthContext)

  return (
    <ol className="list-unstyled">
      {
        data.map((v, idx) => {
          const completada = clasesCompletadas.find(c => c === v.id.toString())
          const marcarVisto = async e => {
            e.stopPropagation()
            const url = `${STRAPI}/masterclass/usuario-curso/marcar-visto?curso-id=${cursoID}&video-id=${v.id}`
            const options = {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
            try {
              const res= await fetch(url, options)
              if (!res.ok) {
                throw new Error(await res.json())
              }
            } catch(err) {
              console.log(err)
            }
          }
          return (
            <li
              className={"px-2 d-flex align-items-center ".concat(idx !== data.length - 1 ? "border-bottom" : "")}
              key={v.id}
            >  
              {
                token &&
                <input
                  type="checkbox"
                  className={"me-1 ".concat(styles.checkbox)}
                  onClick={marcarVisto}
                  onClick={marcarVisto}
                  defaultChecked={completada ? "checked" : undefined}
                />
              }
              <span className="me-1 me-sm-2 me-md-5">{idx + 1}.</span>
              <div className="pt-3">
                <p className="mb-0 small">{v.name}</p>
                <p className="small">{formatDuration(v.seconds*1000)}</p>
              </div>
            </li>
          )
        })
      }
    </ol>
  )
}

export const ListaVideosRep = (props) => {
  const {
      data,
      changeVideo,
      currentVideo,
      cursoID,
      clasesCompletadas
  } = props
  const { token } = useContext(AuthContext)
  return (
    <ol className="list-unstyled">
      {
        data.map((v, idx) => {
          const completada = clasesCompletadas.find(c => c === v.id.toString())
          const isCurrent = currentVideo === v.videoId
          let classCurrent = styles["no-video-actual"]
          if (isCurrent) {
            classCurrent = "bg-dark text-light"
          }
          const handleClick = () => {
            if (isCurrent) {
              return
            }
            changeVideo(v.id)
          }
          const marcarVisto = async e => {
            e.stopPropagation()
            const url = `${STRAPI}/masterclass/usuario-curso/marcar-visto?curso-id=${cursoID}&video-id=${v.id}`
            const options = {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
            try {
              const res= await fetch(url, options)
              if (!res.ok) {
                throw new Error(await res.json())
              }
            } catch(err) {
              console.log(err)
            }
          }
          return (
            <li
              className={"px-2 border-top d-flex align-items-center ".concat(classCurrent)}
              key={v.id}
              onClick={handleClick}
            >
              <input
                type="checkbox"
                className={"me-1 ".concat(styles.checkbox)}
                onClick={marcarVisto}
                defaultChecked={completada ? "checked" : undefined}
              />
              <span className="me-1 me-sm-2">{idx + 1}.</span>
              <div className="pt-3">
                <p className="mb-0 small">{v.name}</p>
                <p className="small">{formatDuration(v.seconds*1000)}</p>
              </div>
            </li>
          )
        })
      }
    </ol>
  )
}
