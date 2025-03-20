import Modal from './page.client'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = './' } = await paramsPromise

  const authPages = ['login', 'create-account', 'recover-password']

  if (!authPages.includes(slug)) {
    return
  }

  return <Modal slug={slug} />
}
