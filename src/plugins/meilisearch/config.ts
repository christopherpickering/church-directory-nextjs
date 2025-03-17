import invariant from 'tiny-invariant'
import type { SearchPluginConfig } from './types'

invariant(process.env.MEILISEARCH_HOST, 'MEILISEARCH_HOST is missing from env.')

export const meilisearchPluginConfig: SearchPluginConfig = {
  apiKey: process.env.MEILISEARCH_API_KEY,
  host: process.env.MEILISEARCH_HOST,
  collections: [
    {
      slug: 'pages',
      priority: 10,
      excludedSlug: ['cart'],
      fields: [
        {
          name: 'slug',
          alias: 'url',
          transformer: (x) => `/pages/${x}`,
        },
        {
          name: 'title',
          localized: true,
        },
        {
          name: 'hero',
          localized: true,
          transformer: (x) => x.richText_text,
        },
        {
          name: 'layout',
          alias: 'content',
          localized: true,
          transformer: (x) =>
            x
              ?.filter((x) => x.blockType === 'content')?.[0]
              ?.columns?.map((x) => x.richText_text)
              ?.join(' ')
              .trim(),
        },
      ],
    },
    {
      slug: 'books',
      priority: 20,
      fields: [
        {
          name: 'title',
          localized: true,
        },
        {
          name: 'slug',
          alias: 'url',
          transformer: (x) => `/books/${x}`,
        },
        {
          name: 'description',
          localized: true,
          transformer: (x) => x.richText_text,
        },
        {
          name: 'author',
          filterable: true,
        },
        {
          name: 'language',
          filterable: true,
        },
        {
          name: 'status',
          filterable: true,
        },
      ],
    },
    {
      slug: 'chapters',
      priority: 30,
      fields: [
        {
          name: 'title',
          localized: true,
        },
        {
          name: 'slug',
          alias: 'url',
          transformer: (x) => `/chapters/${x}`,
        },
        {
          name: 'content',
          localized: true,
          transformer: (x) => x.richText_text,
        },
        {
          name: 'book',
          filterable: true,
          transformer: (x) => x?.title,
        },
        {
          name: 'chapterNumber',
          filterable: true,
        },
      ],
    },
  ],
}
