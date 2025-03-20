import { CollectionArchive } from '@/components/CollectionArchive'
import type { Page } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type React from 'react'

export type ArchiveBlockProps = {
  collection: 'pages'
  selectedDocs?: Page[]
}

export const ArchiveBlock: React.FC<ArchiveBlockProps> = async (props) => {
  const { selectedDocs } = props
  let pages: Page[] = []

  try {
    const payload = await getPayload({ config: configPromise })
    const fetchedPages = await payload.find({
      collection: 'pages',
      limit: 10,
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    pages = fetchedPages.docs
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  }

  if (selectedDocs) {
    pages = selectedDocs
  }

  if (!pages || pages.length === 0) {
    return null
  }

  return (
    <div>
      <CollectionArchive pages={pages} />
    </div>
  )
}
