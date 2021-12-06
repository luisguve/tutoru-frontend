import React, { Component, useState, useEffect, useContext, useRef } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { useToasts } from "react-toast-notifications"

import ArticulosContext from "../../context/ArticulosContext"
import AuthContext from "../../context/AuthContext"
import { useCurso } from "../../hooks/articulo"
import { STRAPI } from "../../lib/urls"
import Aliplayer from "../../components/Aliplayer"
import { ListaVideosRep } from "./ListaVideos"

const PaginaCursoRep = (props) => {
  const [dataRep, setDataRep] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errData, setErrData] = useState(null)
  const { addToast } = useToasts()
  const router = useRouter()
  const { id, videos, titulo } = props.resumen
  const { IDsCursos, loadingIDsArticulos } = useContext(ArticulosContext)
  const { token } = useContext(AuthContext)
  const fetchDataRep = async (videoId) => {
    setLoading(true)
    let url = ""
    if (videoId) {
      url = `${STRAPI}/masterclass/usuario-curso/data-rep-video?curso-id=${id}&video-id=${videoId}`
    } else {
      url = `${STRAPI}/masterclass/usuario-curso/${id}/data-rep`
    }
    const options = {
      headers: { Authorization: `Bearer ${token}` }
    }
    try {
      const resData = await fetch(url, options)
      const data = await resData.json()
      if (!resData.ok) {
        throw data
      }
      setErrData("")
      setDataRep(data)
    } catch(err) {
      console.log("catch error:", err)
      const {msg, error} = err
      setErrData({
        msg: "No se pudo cargar el video: " + (msg || error),
        videoId
      })
      // addToast("No se pudo cargar la página", {appearance: "error"})
    } finally {
      setLoading(false)
    }
  }
  useEffect(async () => {
    if (token && !loadingIDsArticulos && !dataRep) {
      fetchDataRep()
    }
  }, [loadingIDsArticulos, token])
  return (
    <div>
     <Head>
       <link rel="stylesheet" href="https://g.alicdn.com/de/prismplayer/2.9.16/skins/default/aliplayer-min.css" />
     </Head>
      {
        <div className="row mx-0 justify-content-end">
          <div className="col-12">
            <h1 className="fs-2">Curso: {titulo}</h1>
          </div>
          <div className="col-lg-8 px-0 px-md-2" style={{minHeight: 530}}>
            {
              (loading || loadingIDsArticulos) ?
                <div className="bg-dark d-flex flex-column align-items-center justify-content-center h-100">
                  <h3 className="text-light">Cargando...</h3>
                </div>
              : errData ?
                <div className="bg-dark d-flex flex-column align-items-center justify-content-center h-100">
                  <h5 className="text-danger">{errData.msg}</h5>
                  <button
                    className="btn btn-primary"
                    onClick={() => fetchDataRep(errData.videoId)}
                  >Cargar de nuevo</button>
                </div>
              : dataRep &&
                <>
                  <Reproductor
                    PlayAuth={dataRep.PlayAuth}
                    VideoId={dataRep.VideoId}
                  />
                  <VideoMetadata
                    videos={videos}
                    current={dataRep.VideoId}
                  />
                </>
            }
          </div>
          <div className="col-lg-4">
            <ListaVideosRep
              data={videos}
              changeVideo={fetchDataRep}
              currentVideo={dataRep ? dataRep.VideoId : ""}
              clasesCompletadas={dataRep ? dataRep.clasesCompletadas : []}
              cursoID={id}
            />
          </div>
        </div>
      }
    </div>
  )
}

const Reproductor = ({PlayAuth, VideoId}) => {
  const [instance, setInstance] = useState(null)

  const config = {
    id: "player-con",
    vid: VideoId,
    playauth: PlayAuth,
    qualitySort: "asc",
    format: "mp4",
    mediaType: "video",
    width: "100%",
    height: "500px",
    autoplay: true,
    isLive: false,
    rePlay: false,
    playsinline: true,
    preload: true,
    controlBarVisibility: "hover",
    useH5Prism: true,
    language: "en-us"
  }
  useEffect(() => {
    if (window) {
      Aliplayer.components = window.AliPlayerComponent;
    }
  }, [])

  if (!PlayAuth || !VideoId) {
    return null
  }

  useEffect(() => {
    if (!instance) {
      return
    }
    instance.replayByVidAndPlayAuth(VideoId, PlayAuth)
  }, [PlayAuth])

  return (
    <Aliplayer
      sourceUrl="https://g.alicdn.com/de/prismplayer/2.9.16/aliplayer-min.js"
      onGetInstance={instance => setInstance(instance)}
      config={config}
    ></Aliplayer>
  )
}

const VideoMetadata = ({videos, current}) => {
  let titulo = "0 - Sin titulo"
  for (var i = videos.length - 1; i >= 0; i--) {
    if (videos[i].videoId === current) {
      titulo = videos[i].name
      break
    }
  }
  return (
    <>
      <h4 className="mt-3">{titulo}</h4>
    </>
  )
}

export default PaginaCursoRep
