import { mongooseAdapter } from '@payloadcms/db-mongodb'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { ContactSubmissions } from './collections/ContactSubmissions'
import { Courses } from './collections/Courses'
import { Gallery } from './collections/Gallery'
import { Media } from './collections/Media'
import { Services } from './collections/Services'
import { Staff } from './collections/Staff'
import { Users } from './collections/Users'
import { SiteContent } from './globals/SiteContent'
import { SiteSettings } from './globals/SiteSettings'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const serverURL = getServerSideURL()
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000'

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  collections: [
    Users,
    Media,
    Courses,
    Staff,
    Services,
    Gallery,
    ContactSubmissions,
  ],
  cors: {
    origins: [serverURL, frontendURL].filter(Boolean),
  },
  csrf: [serverURL, frontendURL].filter(Boolean),
  globals: [SiteSettings, SiteContent],
  secret: process.env.PAYLOAD_SECRET,
  serverURL,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
