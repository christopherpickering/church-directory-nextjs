import { generateSearchIndex } from '@/plugins/meilisearch/utilities/generateSearchIndex'
import { MeiliSearch } from 'meilisearch'
import { ViewClient } from './index.client'
export const View = async (props) => {
  const { searchCollections, host, apiKey, pluginConfig } = props

  const client = new MeiliSearch({
    host,
    apiKey,
  })

  await generateSearchIndex(pluginConfig)

  const stats = await client.getStats()
  const health = await client.health()
  const version = await client.getVersion()

  return (
    <ViewClient
      searchCollections={searchCollections}
      stats={stats}
      health={health}
      version={version}
    />
  )
}
