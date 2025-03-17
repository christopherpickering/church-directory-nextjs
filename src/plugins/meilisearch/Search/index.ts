import type { CollectionConfig } from 'payload'

import type { SearchPluginConfigWithLocales } from '../types'
import { generateReindexHandler } from '../utilities/generateReindexHandler'
import { generateSearchIndexHandler } from '../utilities/generateSearchIndexHandler'
import { multiHandler } from '../utilities/multiHandler'
// all settings can be overridden by the config
export const generateSearchCollection = (
  pluginConfig: SearchPluginConfigWithLocales,
): CollectionConfig => {
  const host = pluginConfig?.host
  const apiKey = pluginConfig?.apiKey
  const searchCollections = (pluginConfig?.collections || []).map((x) => x.slug)

  const newConfig: CollectionConfig = {
    slug: 'search',
    fields: [],
    access: {
      create: (): boolean => false,
      read: (): boolean => true,
    },
    admin: {
      components: {
        views: {
          list: {
            Component: {
              path: './plugins/meilisearch/Search/ui/View#View',
              serverProps: {
                host,
                apiKey,
                searchCollections,
                pluginConfig,
              },
            },
          },
        },
      },

      group: 'Configuration',
    },
    endpoints: [
      {
        handler: generateReindexHandler(pluginConfig),
        method: 'post',
        path: '/reindex',
      },
      {
        handler: multiHandler(pluginConfig),
        method: 'post',
        path: '/multi',
      },
      {
        handler: generateSearchIndexHandler(pluginConfig),
        method: 'post',
        path: '/',
      },
    ],
    labels: {
      plural: 'Search',
      singular: 'Search',
    },
  }

  return newConfig
}
