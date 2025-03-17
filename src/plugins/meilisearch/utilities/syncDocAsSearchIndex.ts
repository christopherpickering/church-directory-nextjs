import { MeiliSearch } from 'meilisearch'
import invariant from 'tiny-invariant'
import type { DocToSync, SyncDocArgs } from '../types'
import { buildDoc } from './buildDoc'

invariant(
  process.env.MEILISEARCH_HOST,
  'MEILISEARCH_HOST is missing from .env.',
)

export const syncDocAsSearchIndex = async ({
  collection,
  doc,
  locale,
  onSyncError,
  operation,
  pluginConfig,
  req: { payload },
  req,
}: SyncDocArgs) => {
  const { id, _status: status, slug } = doc || {}

  // escape early as we don't monitor drafts.
  if (status === 'draft') return doc

  const { collections: collectionsConfig } = pluginConfig

  const collectionConfig = collectionsConfig.filter(
    (x) => x.slug === collection,
  )[0]

  const { fields, excludedSlug = [] } = collectionConfig

  const client = new MeiliSearch({
    host: pluginConfig.host,
    apiKey: pluginConfig.apiKey,
  })

  const index = client.index(collection)

  const syncLocale = locale || req.locale

  const fieldsConfig = payload.collections[
    collection
  ].config.flattenedFields.filter((x: { name: string }) =>
    fields.map((x) => x.name).includes(x.name),
  )

  // traverse and see if any nested field is localized
  const dataToSave: DocToSync = await buildDoc({
    req,
    doc,
    fieldsConfig,
    collection,
    fields,
    syncLocale,
  })

  try {
    if (
      (operation === 'create' || operation === 'update') &&
      !excludedSlug.includes(slug)
    ) {
      // @ts-ignore
      await index.updateDocuments([dataToSave])
    }
  } catch (err: unknown) {
    payload.logger.error({
      err,
      msg: `Error syncing $searchSlugdocument related to ${collection} with id: '${id}'.`,
    })

    if (onSyncError) {
      onSyncError()
    }
  }

  return doc
}
