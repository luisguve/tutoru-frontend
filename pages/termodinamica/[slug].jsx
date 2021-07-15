import Head from "next/head"

import SeccionEjercicios, { siteTitle } from '../../components/SeccionEjercicios'
import BotonComprar from '../../components/BotonComprar'
import { getEjerciciosIds, getEjercicio } from '../../lib/contenidos'
import utilStyles from "../../styles/utils.module.css"

export default function Post({ ejercicio }) {
  const { titulo, descripcion, categoria, categoriaFormato } = ejercicio
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
        <bold>${ejercicio.precio}</bold>
        <BotonComprar ejercicio={ejercicio} />
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
