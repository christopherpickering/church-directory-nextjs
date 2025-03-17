import type { Health, Stats, Version } from 'meilisearch'
import type { CustomComponent, PayloadServerReactComponent } from 'payload'

export type ViewProps = {
  searchCollections: string[]
}

export type ViewClientProps = {
  searchCollections: string[]
  stats: Stats
  health: Health
  version: Version
}

type ViewServerProps = {} & ViewProps

export type ViewClientComponent = ViewProps
export type ViewServerComponent = PayloadServerReactComponent<
  CustomComponent<ViewServerProps>
>
