import { type PayloadHandler, addLocalesToRequestFromData } from 'payload'
import type { SearchPluginConfigWithLocales } from '../types'

import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'
import { buildHit } from './buildDoc'

export const generateSearchIndexHandler =
  (pluginConfig: SearchPluginConfigWithLocales): PayloadHandler =>
  async (req) => {
    addLocalesToRequestFromData(req)
    const { requests } = await req.json?.()

    const { searchClient } = instantMeiliSearch(
      pluginConfig.host, // Host
      pluginConfig.apiKey, // API key
    )

    //@ts-ignore
    const results = await searchClient.search(requests, { locales: req.locale })

    return Response.json(
      {
        results: await Promise.all(
          results.results.map(async (result) => ({
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
          })),
        ),
      },
      { status: 200 },
    )
  }
