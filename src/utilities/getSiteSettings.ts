import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

export interface SiteSettings {
  title: string
  description: string
  meta?: {
    defaultImage?: {
      url: string
    }
    favicon?: {
      url: string
    }
  }
  contact?: {
    email?: string
    phone?: string
  }
}

export const getSiteSettings = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })

    const siteSettings = (await payload.findGlobal({
      slug: 'site-settings',
    })) as SiteSettings

    return siteSettings
  },
  ['site-settings'],
  { revalidate: 60 },
)
