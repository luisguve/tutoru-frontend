import Head from "next/head"
import { useContext, useState } from "react"

import AuthContext from "../../context/AuthContext"
import EjerciciosContext from "../../context/EjerciciosContext"
import { API_URL } from "../../lib/urls"
import SeccionEjercicios, { siteTitle } from '../../components/SeccionEjercicios'
import BotonComprar from '../../components/BotonComprar'
import { getEjerciciosIds, getEjercicio } from '../../lib/contenidos'
import utilStyles from "../../styles/utils.module.css"

/*
* Este Hook verifica si el ejercicio esta en la lista de ejercicios que ha
* comprado el usuario, y si está, pide la solucion a Strapi.
*/
const useSolucion = async (IDsEjercicios, id, token) => {
  const [solucionDisponible, setSolucionDisponible] = useState(false)
  const [loadingSolucion, setLoadingSolucion] = useState(false)
  const [solucion, setSolucion] = useState(null)

  useEffect(() => {
    const fetchSolucion = async (id, token) => {
      try {
        setLoadingSolucion(true)
        const solucionUrl = `${API_URL}/solucion/${id}`
        const solucion_res = await fetch(solucionUrl, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        const data = await solucion_res.json()
        setSolucion(data)
      } catch (err) {}
      setLoadingSolucion(false)
    }

    // Verifica si el usuario adquirió el ejercicio
    if (IDsEjercicios && IDsEjercicios.length) {
      if (IDsEjercicios.includes(id)) {
        setSolucionDisponible(true)
        // Cargar la solucion
        fetchSolucion(id, token)
      }
    }
  }, [IDsEjercicios, id])

  return {
    solucionDisponible,
    solucion,
    loadingSolucion
  }
}

export default function Post({ ejercicio }) {
  const { titulo, id, descripcion, categoria, categoriaFormato } = ejercicio
  const { token } = useContext(AuthContext)
  const { IDsEjercicios } = useContext(EjerciciosContext)

  const {
    solucionDisponible,
    solucion,
    loadingSolucion
  } = useSolucion(IDsEjercicios, id, token)

  return (
    <SeccionEjercicios categoria={categoria} categoriaFormato={categoriaFormato}>
      <Head>
        <title>{siteTitle} | {categoriaFormato} | {titulo}</title>
      </Head>
      <h1>{categoriaFormato}</h1>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2>{titulo}</h2>
        <br />
        <div dangerouslySetInnerHTML={{ __html: descripcion}}></div>
        <br />
        {
          !solucionDisponible ?
          <div>
            <bold>${ejercicio.precio}</bold>
            <BotonComprar ejercicio={ejercicio} />
          </div>
          :
          loadingSolucion ?
            <h3 style={{textAlign: "center"}}>Cargando solucion...</h3>
          :
            <div dangerouslySetInnerHTML={{ __html: solucion}}></div>
        }
      </section>
    </SeccionEjercicios>
  )
}

export async function getStaticProps({ params }) {
  const ejercicio = await getEjercicio(params.slug)
  return {
    props: {
      ejercicio
    }
  }
}

export async function getStaticPaths() {
  const paths = getEjerciciosIds("termodinamica")
  return {
    paths,
    fallback: false
  }
}
