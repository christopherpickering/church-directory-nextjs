// storage-adapter-import-placeholder

import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import sharp from 'sharp' // sharp-import

import { defaultLexical } from '@/fields/defaultLexical'
import { SiteSettings } from './collections/Globals'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'
import { plugins } from './plugins'
import { getServerSideURL } from './utilities/getURL'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import invariant from 'tiny-invariant'
import { Contacts } from './collections/Contact'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { Locations } from './collections/Location'
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
  collections: [Pages, Media, Users, Locations, Contacts, ContactSubmissions],
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM || 'no-reply@example.com',
        defaultFromName: process.env.SMTP_NAME || 'No Reply',
        transportOptions: {
          host: process.env.SMTP_HOST || '',
          auth: {
            pass: process.env.SMTP_PASS || '',
            user: process.env.SMTP_USER || '',
          },
          port: Number(process.env.SMTP_HOST) || 587,
          requireTLS: true,
          secure: Number(process.env.SMTP_PORT) === 465,
          tls: {
            rejectUnauthorized: false,
          },
        },
      })
    : nodemailerAdapter(),
  globals: [SiteSettings],
  cors: [getServerSideURL()].filter(Boolean),
  plugins: [...plugins],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
