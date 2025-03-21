import type { Page } from '@/payload-types'
import type React from 'react'
import { Card } from '../Card'

export type Props = {
  pages: Page[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { pages } = props

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {pages?.map((result, index) => {
        return (
          <div className="col-span-1" key={index}>
            <Card doc={result} relationTo="pages" />
          </div>
        )
      })}
    </div>
  )
}
