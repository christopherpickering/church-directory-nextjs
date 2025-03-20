import type { BeforeSync, DocToSync } from '@payloadcms/plugin-search/types'

export const beforeSyncWithSearch: BeforeSync = async ({
  originalDoc,
  searchDoc,
}: {
  originalDoc: { [key: string]: any }
  searchDoc: DocToSync
}) => {
  const modifiedDoc = { ...searchDoc }

  const { slug, id, title, meta } = originalDoc

  // add fields to search
  modifiedDoc.title = title
  modifiedDoc.description = meta?.description || ''
  modifiedDoc.slug = slug
  modifiedDoc.id = id

  return modifiedDoc
}
