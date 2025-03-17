import { MeiliSearch } from 'meilisearch'
import invariant from 'tiny-invariant'
import type { DeleteFromSearch } from '../../types'

invariant(
  process.env.MEILISEARCH_HOST,
  'MEILISEARCH_HOST is missing from .env.',
)

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST,
  apiKey: process.env.MEILISEARCH_API_KEY,
})

export const deleteFromSearch: DeleteFromSearch = async ({
  collection,
  doc,
  req: { payload },
}) => {
  try {
    const index = client.index(collection.slug)
    await index.deleteDocument(doc.id)
  } catch (err: unknown) {
    payload.logger.error({
      err,
      msg: `Error deleting ${collection.slug} doc ${doc.slug}.`,
    })
  }

  return doc
}
