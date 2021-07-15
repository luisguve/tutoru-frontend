import Link from "next/link"
import Head from "next/head"

import { getEjercicios } from "../../lib/contenidos"
import SeccionEjercicios, { siteTitle } from "../../components/SeccionEjercicios"
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
  const postsList = ejercicios.map(({ slug, titulo, descripcionCorta }) => (
    <li className={utilStyles.listItem} key={slug}>
      <Link href={`/termodinamica/${slug}`}><a>{titulo}</a></Link>
      <br />
      <p dangerouslySetInnerHTML={{ __html: descripcionCorta}}></p>
      <br />
    </li>
  ))
  return (
    <SeccionEjercicios>
      <Head>
        <title>{siteTitle} | Termodinámica</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <ul className={utilStyles.list}>
          {postsList}
        </ul>
      </section>
    </SeccionEjercicios>
  )
}
