import AddressSearch from '@/components/AddressSearch'
import AuthenticatedLayout from '@/components/AuthLayout'
import { RichText } from '@/components/RichText'
import type { Page as PageType } from '@/payload-types'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { cache } from 'react'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function SlugPage({ params: paramsPromise }: Args) {
  const { slug = 'home' } = await paramsPromise

  const page: PageType | null = await queryPageBySlug({
    slug,
  })

  if (!page) {
    return notFound()
  }

  return (
    <div className="pt-16 pb-24">
      <AuthenticatedLayout>
        <div className="mx-auto space-y-8 ">
          <div className="space-y-4">
            <div className="prose max-w-none">
              {page.content && <RichText data={page.content} />}
            </div>
          </div>

          {/* Search and Map Section */}
          <div className="flex flex-col items-center space-y-8 md:space-y-12">
            {/* Search Section */}
            <div className="w-full max-w-2xl space-y-4">
              <h2 className="text-center font-semibold text-2xl">
                Search address
              </h2>
              <AddressSearch />
            </div>

            {/* Map Button */}
            <div className="w-full max-w-2xl">
              <a
                href="/map"
                className="flex w-full flex-col items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-center text-primary-foreground hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary sm:flex-row"
              >
                <span>Open map (Location)</span>
                <span className="text-gray-200 text-sm">
                  The map is loaded from www.openstreetmap.org
                </span>
              </a>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  )
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    overrideAccess: true,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
