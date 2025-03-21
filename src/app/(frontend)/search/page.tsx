import { Search } from '@/search/Component'
import configPromise from '@payload-config'
import type { Metadata } from 'next/types'
import { getPayload } from 'payload'
import PageClient from './page.client'

// type Args = {
//   searchParams: Promise<{
//     q: string
//   }>
// }

export default async function Page() {
  await getPayload({ config: configPromise })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">Search</h1>

          <div className="mx-auto max-w-[50rem]">
            <Search />
          </div>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Payload Website Template Search',
  }
}
