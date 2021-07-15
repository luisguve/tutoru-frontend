import Head from 'next/head'
import Layout, { siteTitle } from '../../components/layout'

export default function Posts() {
  return (
    <Layout>
      <Head>
        <title>{siteTitle} - Read My Posts</title>
      </Head>
      <h1>
      Read my posts!
      </h1>
    </Layout>
  )
}