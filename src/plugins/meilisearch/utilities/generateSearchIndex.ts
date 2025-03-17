import { locales } from '@/locales'
import { MeiliSearch } from 'meilisearch'
import type { SearchPluginConfigWithLocales } from '../types'

export const generateSearchIndex = async (
  pluginConfig: SearchPluginConfigWithLocales,
) => {
  const client = new MeiliSearch({
    host: pluginConfig.host,
    apiKey: pluginConfig.apiKey,
  })

  for (const collection of pluginConfig.collections) {
    // check if index exists
    const indexes = (await client.getIndexes())?.results?.map((x) => x.uid)

    // create index
    if (!indexes.includes(collection.slug))
      await client.createIndex(collection.slug)

    // update filterable attributes
    const filterableFields = collection.fields
      .filter((x) => x.filterable === true)
      .flatMap(({ name, localized }) => {
        if (localized) return locales.map((x) => `${name}_${x}`)
        return [name]
      })

    filterableFields &&
      (await client
        .index(collection.slug)
        .updateFilterableAttributes(filterableFields))

    // update locale fields
    await client.index(collection.slug).updateLocalizedAttributes(
      locales.map((locale) => ({
        attributePatterns: [`*_${locale}`],
        // let it auto guess locale since some locales don't exist in meili
        locales: [],
      })),
    )
  }
}
