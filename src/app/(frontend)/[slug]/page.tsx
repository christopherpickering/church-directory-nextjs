import AddressList from '@/components/AddressList'
import AuthenticatedLayout from '@/components/AuthLayout'
import HomeMap from '@/components/HomeMap'
import { RichText } from '@/components/RichText'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Page as PageType } from '@/payload-types'
import { getAddresses } from '@/utilities/getAddresses'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { cache } from 'react'

type Args = {
  params: Promise<{
    slug?: string
  }>
  searchParams?: Promise<{
    search?: string
    currentPage?: string
  }>
}

export default async function SlugPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: Args) {
  const { slug = 'home' } = await paramsPromise
  const { currentPage } = (await searchParamsPromise) || {}

  const page: PageType | null = await queryPageBySlug({
    slug,
  })

  if (!page) {
    return notFound()
  }

  const isHomepage = slug === 'home'
  const currentPageNumber = currentPage ? Number.parseInt(currentPage, 10) : 1

  const settings = await getSiteSettings()

  const addresses = isHomepage ? await getAddresses() : []

  if (!page) {
    return notFound()
  }

  return (
    <div className="w-full pt-16 pb-24">
      <AuthenticatedLayout title={settings?.title || 'Address Directory'}>
        <div className="container mx-auto space-y-8 px-4">
          {/* Page Content */}
          <div className="w-full space-y-2">
            <div className="prose max-w-none">
              {page.content && <RichText data={page.content} />}
            </div>
          </div>
          {isHomepage ? (
            // Homepage content with tabs for map and list
            <div className="w-full">
              <Tabs defaultValue="map" className="w-full">
                <TabsList className="mb-4 w-full justify-start">
                  <TabsTrigger value="map">Map View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>
                <TabsContent value="map" className="w-full">
                  <HomeMap />
                </TabsContent>
                <TabsContent value="list" className="w-full">
                  <AddressList
                    addresses={addresses}
                    initialPage={currentPageNumber}
                  />
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            // Non-homepage content
            <div>{/* Additional content for non-homepage */}</div>
          )}
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
