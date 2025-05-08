import type { Metadata } from 'next'

import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type React from 'react'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  return {
    title: {
      default: settings?.title || 'Church Directory',
      template: `%s | ${settings?.title || 'Church Directory'}`,
    },
    description:
      settings?.description || 'A directory of churches and correspondants.',
    metadataBase: new URL(getServerSideURL()),
  }
}

export default async function RootLayout({
  children,
  addresses,
}: {
  children: React.ReactNode
  addresses: React.ReactNode
}) {
  const settings = await getSiteSettings()

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        {settings?.meta?.favicon ? (
          <>
            <link href={settings.meta.favicon.url} rel="icon" sizes="32x32" />
            <link
              href={settings.meta.favicon.url}
              rel="icon"
              type="image/svg+xml"
            />
          </>
        ) : (
          <>
            <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
          </>
        )}
        <title>{settings?.title || 'Church Directory'}</title>
        <meta
          name="description"
          content={
            settings?.description ||
            'A directory of churches and correspondants.'
          }
        />
      </head>
      <body>
        <Providers>
          <div className="container">{children}</div>
          {addresses}
        </Providers>
      </body>
    </html>
  )
}
