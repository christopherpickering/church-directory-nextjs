// storage-adapter-import-placeholder

import path from 'path'
import { fileURLToPath } from 'url'
import { type PayloadRequest, buildConfig } from 'payload'
import sharp from 'sharp' // sharp-import

import { defaultLexical } from '@/fields/defaultLexical'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'
import { plugins } from './plugins'
import { getServerSideURL } from './utilities/getURL'

import { postgresAdapter } from '@payloadcms/db-postgres'
import invariant from 'tiny-invariant'
import { Address } from './collections/Address'
import { Church } from './collections/Church'
import { Person } from './collections/Person'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const requiredEnvVars = ['PAYLOAD_SECRET', 'DATABASE_URI']

for (const envVar of requiredEnvVars) {
  invariant(process.env[envVar], `${envVar} is missing from env.`)
}
export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  // database-adapter-config-start
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  // database-adapter-config-end
  collections: [Pages, Media, Users, Church, Address, Person],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins: [...plugins],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
