'use client'
import type { Page } from '@/payload-types'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import type React from 'react'

export type Props = {
  className?: string
  doc: Page
  relationTo: 'pages'
}

export const Card: React.FC<Props> = (props) => {
  const { className, doc } = props
  const href = `/${doc.slug}`

  return (
    <Link
      className={cn('group block h-full hover:no-underline', className)}
      href={href}
    >
      <div className="content">
        <h4 className="mb-4 text-xl">{doc.title}</h4>
      </div>
    </Link>
  )
}
