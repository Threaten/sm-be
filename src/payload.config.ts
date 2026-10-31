import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { enTranslations } from '@payloadcms/translations/languages/en'
import sharp from 'sharp'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { AuditLogs } from './collections/AuditLogs'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { Courses } from './collections/Courses'
import { Gallery } from './collections/Gallery'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { Services } from './collections/Services'
import { Staff } from './collections/Staff'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { AboutPage } from './globals/AboutPage'
import { ContactPage } from './globals/ContactPage'
import { CoursesPage } from './globals/CoursesPage'
import { EntryPopup } from './globals/EntryPopup'
import { GalleryPage } from './globals/GalleryPage'
import { HomePage } from './globals/HomePage'
import { NewsPage } from './globals/NewsPage'
import { ServicesPage } from './globals/ServicesPage'
import { SiteSettings } from './globals/SiteSettings'
import { TeamPage } from './globals/TeamPage'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const serverURL = getServerSideURL()
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3003'

export default buildConfig({
  admin: {
    components: {
      graphics: {
        Icon: '@/components/admin/SkillMixBrand#SkillMixIcon',
        Logo: '@/components/admin/SkillMixBrand#SkillMixLogo',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      defaultOGImageType: 'off',
      description: 'Skill & Mix content management system.',
      // Generated from Site settings → Brand → Browser icon (src/app/(icons)), same as the website.
      icons: [
        { rel: 'icon', type: 'image/x-icon', sizes: '16x16 32x32 48x48', url: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', url: '/icons/icon-192.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', url: '/icons/apple-touch-icon.png' },
      ],
      openGraph: {
        description: 'Skill & Mix content management system.',
        siteName: 'Skill & Mix CMS',
        title: 'Skill & Mix CMS',
      },
      title: 'Admin',
      titleSuffix: '— Skill & Mix CMS',
    },
    user: Users.slug,
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  collections: [
    Courses,
    Staff,
    Services,
    News,
    Testimonials,
    ContactSubmissions,
    Media,
    Gallery,
    Users,
    AuditLogs,
  ],
  cors: {
    origins: [serverURL, frontendURL].filter(Boolean),
  },
  csrf: [serverURL, frontendURL].filter(Boolean),
  globals: [
    HomePage,
    AboutPage,
    CoursesPage,
    TeamPage,
    ServicesPage,
    NewsPage,
    GalleryPage,
    ContactPage,
    SiteSettings,
    EntryPopup,
  ],
  i18n: {
    translations: {
      en: {
        ...enTranslations,
        general: {
          ...enTranslations.general,
          payloadSettings: 'CMS Settings',
        },
      },
    },
  },
  secret: process.env.PAYLOAD_SECRET,
  serverURL,
  sharp,
  telemetry: false,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
