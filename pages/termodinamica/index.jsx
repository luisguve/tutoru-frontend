import Link from "next/link"
import Head from "next/head"

import { getEjercicios } from "../../lib/contenidos"
import SeccionEjercicios, { siteTitle } from "../../components/SeccionEjercicios"
import ListaEjercicios from "../../components/categorias/ListaEjercicios"
import utilStyles from "../../styles/utils.module.css"

export async function getStaticProps() {
  const ejercicios = await getEjercicios("termodinamica")
  return {
    props: {
      ejercicios
    }
  }
}

export default function Ejercicios ({ ejercicios }) {
  return (
    <SeccionEjercicios>
      <Head>
        <title>{siteTitle} | Termodinámica</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <ListaEjercicios>
          {ejercicios}
        </ListaEjercicios>
      </section>
    </SeccionEjercicios>
  )
}
