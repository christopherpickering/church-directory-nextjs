import type { Page } from '@/payload-types'
import type React from 'react'

import { getCachedDocument } from '@/utilities/getDocument'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { notFound, redirect } from 'next/navigation'

interface Props {
  disableNotFound?: boolean
  url: string
}

interface RedirectItem {
  from: string
  to?: {
    url?: string
    reference?: {
      relationTo: 'pages'
      value?: string | { slug: string }
    }
  }
}

/* This component helps us with SSR based dynamic redirects */
export const PayloadRedirects: React.FC<Props> = async ({
  disableNotFound,
  url,
}) => {
  const redirects = (await getCachedRedirects()()) as unknown as RedirectItem[]

  const redirectItem = redirects.find((redirect) => redirect.from === url)

  if (redirectItem) {
    if (redirectItem.to?.url) {
      redirect(redirectItem.to.url)
    }

    let redirectUrl: string | undefined

    if (typeof redirectItem.to?.reference?.value === 'string') {
      const collection = redirectItem.to.reference.relationTo
      const id = redirectItem.to.reference.value

      const document = (await getCachedDocument(collection, id)()) as Page
      redirectUrl = document?.slug ? `/${document.slug}` : undefined
    } else {
      const slug =
        typeof redirectItem.to?.reference?.value === 'object'
          ? redirectItem.to?.reference?.value?.slug
          : undefined
      redirectUrl = slug ? `/${slug}` : undefined
    }

    if (redirectUrl) redirect(redirectUrl)
  }

  if (disableNotFound) return null

  notFound()
}
