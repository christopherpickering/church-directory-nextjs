import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  Config,
} from 'payload'

import type { SearchPluginConfig, SearchPluginConfigWithLocales } from './types'

import { generateSearchCollection } from './Search'
import { deleteFromSearch } from './Search/hooks/deleteFromSearch'
import { syncWithSearch } from './Search/hooks/syncWithSearch'

type CollectionAfterChangeHookArgs = Parameters<CollectionAfterChangeHook>[0]
type CollectionAfterDeleteHookArgs = Parameters<CollectionAfterDeleteHook>[0]

export const meilisearchPlugin =
  (incomingPluginConfig: SearchPluginConfig) =>
  (config: Config): Config => {
    const { collections } = config

    if (collections) {
      const locales = config.localization
        ? config.localization.locales.map((localeConfig) =>
            typeof localeConfig === 'string' ? localeConfig : localeConfig.code,
          )
        : []

      const pluginConfig: SearchPluginConfigWithLocales = {
        // write any config defaults here
        locales,
        reindexBatchSize: incomingPluginConfig?.reindexBatchSize || 50,
        ...incomingPluginConfig,
      }

      // add afterChange and afterDelete hooks to every search-enabled collection
      const collectionsWithSearchHooks = config?.collections
        ?.map((collection) => {
          const { hooks: existingHooks } = collection
          const enabledCollections = pluginConfig.collections.map((x) => x.slug)

          const isEnabled = enabledCollections.indexOf(collection.slug) > -1
          if (isEnabled) {
            return {
              ...collection,
              hooks: {
                ...collection.hooks,
                afterChange: [
                  ...(existingHooks?.afterChange || []),
                  async (args: CollectionAfterChangeHookArgs) => {
                    await syncWithSearch({
                      ...args,
                      collection: collection.slug,
                      pluginConfig,
                    })
                  },
                ],
                afterDelete: [
                  ...(existingHooks?.afterDelete || []),
                  async (args: CollectionAfterDeleteHookArgs) => {
                    await deleteFromSearch({
                      ...args,
                      pluginConfig,
                    })
                  },
                ],
              },
            }
          }

          return collection
        })
        .filter(Boolean)

      return {
        ...config,
        collections: [
          ...(collectionsWithSearchHooks || []),
          generateSearchCollection(pluginConfig),
        ],
      }
    }

    return config
  }
