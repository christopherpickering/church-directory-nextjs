import { searchPlugin } from '@payloadcms/plugin-search'
import type { Plugin } from 'payload'

import { beforeSyncWithSearch } from '@/search/beforeSync'
import { searchFields } from '@/search/fieldOverrides'

export const plugins: Plugin[] = [
  searchPlugin({
    collections: ['pages'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
]
