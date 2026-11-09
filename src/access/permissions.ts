/**
 * Every resource whose access can be granted from the admin panel.
 *
 * What each role may do is stored in the database (Roles collection) and can
 * be changed at any time in the admin panel; individual users can also get
 * allow/deny exceptions (Users → Permission exceptions). This file only lists
 * WHICH actions exist for each resource, plus the fixed rules that no role can
 * change:
 *
 * - Super admins (a checkbox on the user) can always do everything.
 * - Website content is always publicly readable, so the site keeps working.
 *   Its "read" is therefore not offered, except News, where "read" means
 *   seeing unpublished drafts.
 * - Anyone may create a contact submission (the website form).
 * - Audit logs are only ever written by the server.
 * - Every signed-in user can read and edit their own account.
 */

export const OPERATIONS = ['create', 'read', 'update', 'delete'] as const
export type Operation = (typeof OPERATIONS)[number]

export const OPERATION_LABELS: Record<Operation, string> = {
  create: 'Create',
  read: 'Read',
  update: 'Update',
  delete: 'Delete',
}

type ResourceDef = {
  /** Field name in the database. camelCase, because slugs with "-" are not valid field names. */
  key: string
  label: string
  operations: readonly Operation[]
  /** Shown under the resource in the role editor. */
  note?: string
}

const CONTENT_OPS = ['create', 'update', 'delete'] as const
const PAGE_OPS = ['update'] as const

export const collectionResources = {
  courses: { key: 'courses', label: 'Courses', operations: CONTENT_OPS },
  staff: { key: 'staff', label: 'Instructors', operations: CONTENT_OPS },
  services: { key: 'services', label: 'Services', operations: CONTENT_OPS },
  news: {
    key: 'news',
    label: 'News',
    operations: OPERATIONS,
    note: 'Read = see unpublished drafts. Published posts are always public.',
  },
  testimonials: { key: 'testimonials', label: 'Testimonials', operations: CONTENT_OPS },
  gallery: { key: 'gallery', label: 'Gallery', operations: CONTENT_OPS },
  media: {
    key: 'media',
    label: 'Media',
    operations: CONTENT_OPS,
    note: 'Needed by anyone who uploads images. Deleting media breaks pages that use it.',
  },
  'contact-submissions': {
    key: 'contactSubmissions',
    label: 'Contact submissions',
    operations: ['read', 'update', 'delete'],
    note: 'The website form can always create submissions.',
  },
  users: {
    key: 'users',
    label: 'Users',
    operations: OPERATIONS,
    note: "Other people's accounts. Everyone can always edit their own. Only super admins can change roles and exceptions.",
  },
  'audit-logs': { key: 'auditLogs', label: 'Audit logs', operations: ['read', 'delete'] },
} satisfies Record<string, ResourceDef>

export const globalResources = {
  'home-page': { key: 'homePage', label: 'Home page', operations: PAGE_OPS },
  'about-page': { key: 'aboutPage', label: 'About page', operations: PAGE_OPS },
  'courses-page': { key: 'coursesPage', label: 'Courses page', operations: PAGE_OPS },
  'team-page': { key: 'teamPage', label: 'Team page', operations: PAGE_OPS },
  'services-page': { key: 'servicesPage', label: 'Services page', operations: PAGE_OPS },
  'news-page': { key: 'newsPage', label: 'News page', operations: PAGE_OPS },
  'gallery-page': { key: 'galleryPage', label: 'Gallery page', operations: PAGE_OPS },
  'contact-page': { key: 'contactPage', label: 'Contact page', operations: PAGE_OPS },
  'entry-popup': { key: 'entryPopup', label: 'Entry popup', operations: PAGE_OPS },
  'site-settings': {
    key: 'siteSettings',
    label: 'Site settings',
    operations: PAGE_OPS,
    note: 'Navigation, contact details, theme and SEO for the whole site.',
  },
} satisfies Record<string, ResourceDef>

export type PermissionCollectionSlug = keyof typeof collectionResources
export type PermissionGlobalSlug = keyof typeof globalResources
export type ResourceSlug = PermissionCollectionSlug | PermissionGlobalSlug

export const allResources: Record<ResourceSlug, ResourceDef> = { ...collectionResources, ...globalResources }

/** Stored shape: `{ courses: { create: true, update: false, ... }, homePage: { update: true }, ... }`. */
export type PermissionSet = Record<string, Partial<Record<Operation, boolean>> | undefined>

/**
 * Starting roles, created automatically on a database with no roles yet
 * (and used when converting the old hard-coded editor/staff roles).
 * After that they live in the database and are edited in the admin panel.
 */
const grant = (
  entries: [ResourceSlug, readonly Operation[]][],
): PermissionSet =>
  Object.fromEntries(
    entries.map(([slug, ops]) => [allResources[slug].key, Object.fromEntries(ops.map((op) => [op, true]))]),
  )

const ALL_PAGES = (Object.keys(globalResources) as PermissionGlobalSlug[])
  .filter((slug) => slug !== 'site-settings')
  .map((slug): [ResourceSlug, readonly Operation[]] => [slug, PAGE_OPS])

export const DEFAULT_ROLES: { legacy: string; name: string; description: string; permissions: PermissionSet }[] = [
  {
    legacy: 'editor',
    name: 'Editor',
    description: 'Marketing / content lead: manages all website content and pages.',
    permissions: grant([
      ['courses', CONTENT_OPS],
      ['staff', CONTENT_OPS],
      ['services', CONTENT_OPS],
      ['news', OPERATIONS],
      ['testimonials', CONTENT_OPS],
      ['gallery', CONTENT_OPS],
      ['media', CONTENT_OPS],
      ['contact-submissions', ['read', 'update', 'delete']],
      ...ALL_PAGES,
    ]),
  },
  {
    legacy: 'staff',
    name: 'Staff',
    description: 'Front desk / instructors: testimonials, gallery photos, leads and the entry popup.',
    permissions: grant([
      ['news', ['read']],
      ['testimonials', ['create', 'update']],
      ['gallery', ['create', 'update']],
      ['media', ['create', 'update']],
      ['contact-submissions', ['read', 'update']],
      ['entry-popup', PAGE_OPS],
    ]),
  },
]
