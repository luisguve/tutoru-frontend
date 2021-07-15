import Head from 'next/head'
import SeccionEjercicios, { siteTitle } from '../components/SeccionEjercicios'
import utilStyles from '../styles/utils.module.css'
import { getEjercicios } from "../lib/contenidos"
import Link from "next/link"

export async function getStaticProps() {
  const ejercicios = await getEjercicios()
  return {
    props: {
      ejercicios
    }
  }
}

export default function Home({ ejercicios }) {
  const postsList = ejercicios.map(({ slug, titulo, descripcionCorta, categoria, categoriaFormato }) => (
    <li className={utilStyles.listItem} key={slug}>
      <Link href={`/${categoria}/${slug}`}><a>{categoriaFormato} - {titulo}</a></Link>
      <br />
      <div dangerouslySetInnerHTML={{ __html: descripcionCorta}}></div>
      <br />
    </li>
  ))
  return (
    <SeccionEjercicios home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {postsList}
        </ul>
      </section>
    </SeccionEjercicios>
  )
}
