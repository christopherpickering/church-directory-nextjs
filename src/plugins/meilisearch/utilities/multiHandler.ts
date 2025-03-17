import { MeiliSearch } from 'meilisearch'
import { type PayloadHandler, addLocalesToRequestFromData } from 'payload'
import type { SearchPluginConfigWithLocales } from '../types'
import { buildHit } from './buildDoc'

export const multiHandler =
  (pluginConfig: SearchPluginConfigWithLocales): PayloadHandler =>
  async (req) => {
    addLocalesToRequestFromData(req)
    const { q, limit = 20, offset = 0 } = await req.json?.()

    const { collections: collectionsConfig } = pluginConfig

    const queries = collectionsConfig.map((x) => ({ indexUid: x.slug, q }))

    const client = new MeiliSearch({
      host: pluginConfig.host,
      apiKey: pluginConfig.apiKey,
    })

    const result = await client.multiSearch({
      federation: { limit, offset },
      queries,
    })

    return Response.json(
      {
        ...result,
        hits: await Promise.all(
          result.hits.map(async (x) =>
            buildHit({
              doc: x,
              locale: req.locale,
              payload: req.payload,
            }),
          ),
        ),
      },
      { status: 200 },
    )
  }
