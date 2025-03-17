import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  Field,
} from 'payload'

export type DocToSync = {
  id: number
  doc: {
    relationTo: string
    value: string
  }
  [key: string]: any
}

export type FieldsOverride = (args: { defaultFields: Field[] }) => Field[]

type TransformerFieldType = any

export type SearchPluginConfig = {
  host: string
  apiKey?: string
  collections: {
    slug: string
    fields: {
      filterable?: boolean
      localized?: boolean
      name: string
      alias?: string
      transformer?: (
        field: TransformerFieldType,
        doc?: any,
      ) => Promise<any> | any
    }[]
    priority?: number
    excludedSlug?: string[]
  }[]
  reindexBatchSize?: number
}

export type SearchPluginConfigWithLocales = SearchPluginConfig & {
  locales: string[]
  reindexBatchSize: number
}

export type SyncWithSearchArgs = {
  collection: string
  pluginConfig: SearchPluginConfig
} & Omit<Parameters<CollectionAfterChangeHook>[0], 'collection'>

export type SyncDocArgs = {
  locale?: string
  onSyncError?: () => void
} & Omit<SyncWithSearchArgs, 'context' | 'previousDoc'>

// Extend the `CollectionAfterChangeHook` with more function args
// Convert the `collection` arg from `SanitizedCollectionConfig` to a string
export type SyncWithSearch = (
  Args: SyncWithSearchArgs,
) => ReturnType<CollectionAfterChangeHook>

export type DeleteFromSearch = (
  Args: {
    pluginConfig: SearchPluginConfig
  } & Parameters<CollectionAfterDeleteHook>[0],
) => ReturnType<CollectionAfterDeleteHook>
