import { useState, useEffect } from "react"

import TabReviews from "./TabReviews"
import TabPreguntas from "./TabPreguntas"
import { ListaVideos } from "./ListaVideos"
import { useClasesCompletadas } from "../../hooks/articulo"

const TabsManager = (props) => {
  const {
    dataUsuarios,
    dataVideos,
    cursoID
  } = props

  const { clasesCompletadas } = useClasesCompletadas(cursoID)

  const tabs = [
    {
      id: "reseñas",
      component: (
        <TabReviews
          cursoID={cursoID}
          data={dataUsuarios ? dataUsuarios.reviews : null}
        />
      )
    },
    {
      id: "preguntas",
      component: (
        <TabPreguntas
          cursoID={cursoID}
          data={dataUsuarios ? dataUsuarios.preguntas : null}
        />
      )
    },
    {
      id: "lista-videos",
      component: (
        <ListaVideos
          clasesCompletadas={clasesCompletadas}
          cursoID={cursoID}
          data={dataVideos}
        />
      )
    }
  ]
  const [tabActual, setTabActual] = useState({idx: 0, data: tabs[0]})

  useEffect(() => {
    setTabActual({idx: tabActual.idx, data: tabs[tabActual.idx]})
  }, [dataUsuarios])

  const handleChange = id => {
    const idx = tabs.findIndex(t => t.id === id)
    setTabActual({idx, data: tabs[idx]})
  }
  return (
    <div className="col-12 px-0">
      <SelectorTabs tabActual={tabActual.data.id} changeTab={handleChange} />
      {tabActual.data.component}
    </div>
  )
}
const SelectorTabs = ({tabActual, changeTab}) => {
  const tabIDs = [
    {id: "reseñas", label:"Reseñas"},
    {id: "preguntas", label: "Preguntas"},
    {id: "lista-videos", label: "Lista de reproducción"}
  ]
  return (
    <div>
      {
        tabIDs.map(t => {
          return (
            <button
              className={"btn me-1 ".concat(t.id === tabActual ? "btn-dark" : "btn-light")}
              key={t.id}
              onClick={() => {changeTab(t.id)}}
            >{t.label}</button>
          )
        })
      }
    </div>
  )
}

export default TabsManager