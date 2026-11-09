/**
 * Every resource whose access can be granted from the admin panel.
 *
 * What each role may do is stored in the database (Roles collection) and
 * edited in the admin panel. Individual users can also get allow/deny
 * exceptions (Users → Permission exceptions). This file only lists WHICH
 * actions exist for each resource, plus the fixed rules no role can change:
 *
 * - Super admins (a checkbox on the user) can always do everything.
 * - Requests without a signed-in user (the website, any public API call) use
 *   the built-in Guest role. Guest can only ever be given the actions listed in
 *   `guest` below: reading content and sending the contact form. It can never
 *   edit content, see leads, or touch accounts.
 * - For signed-in users, Read controls whether the resource appears in the
 *   admin panel at all. Create, Update or Delete imply Read.
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

export type ResourceDef = {
  /** Field name in the database. camelCase, because slugs with "-" are not valid field names. */
  key: string
  label: string
  operations: readonly Operation[]
  /** The actions the Guest role may be given. Anything else is always denied to guests. */
  guest: readonly Operation[]
  /** Shown under the resource in the role editor. */
  note?: string
}

const READ: readonly Operation[] = ['read']
const NONE: readonly Operation[] = []
const PAGE_OPS: readonly Operation[] = ['read', 'update']

export const collectionResources = {
  courses: { key: 'courses', label: 'Courses', operations: OPERATIONS, guest: READ },
  staff: { key: 'staff', label: 'Instructors', operations: OPERATIONS, guest: READ },
  services: { key: 'services', label: 'Services', operations: OPERATIONS, guest: READ },
  news: {
    key: 'news',
    label: 'News',
    operations: OPERATIONS,
    guest: READ,
    note: 'Guests only ever see published posts. Signed-in users with Read also see drafts.',
  },
  testimonials: { key: 'testimonials', label: 'Testimonials', operations: OPERATIONS, guest: READ },
  gallery: { key: 'gallery', label: 'Gallery', operations: OPERATIONS, guest: READ },
  media: {
    key: 'media',
    label: 'Media',
    operations: OPERATIONS,
    guest: READ,
    note: 'Images on the website need Guest → Read. Deleting media breaks pages that use it.',
  },
  'contact-submissions': {
    key: 'contactSubmissions',
    label: 'Contact submissions',
    operations: OPERATIONS,
    guest: ['create'],
    note: 'The website contact form needs Guest → Create.',
  },
  users: {
    key: 'users',
    label: 'Users',
    operations: OPERATIONS,
    guest: NONE,
    note: "Other people's accounts. Everyone can always edit their own. Only super admins can change roles and exceptions.",
  },
  'audit-logs': { key: 'auditLogs', label: 'Audit logs', operations: ['read', 'delete'], guest: NONE },
} satisfies Record<string, ResourceDef>

export const globalResources = {
  'home-page': { key: 'homePage', label: 'Home page', operations: PAGE_OPS, guest: READ },
  'about-page': { key: 'aboutPage', label: 'About page', operations: PAGE_OPS, guest: READ },
  'courses-page': { key: 'coursesPage', label: 'Courses page', operations: PAGE_OPS, guest: READ },
  'team-page': { key: 'teamPage', label: 'Team page', operations: PAGE_OPS, guest: READ },
  'services-page': { key: 'servicesPage', label: 'Services page', operations: PAGE_OPS, guest: READ },
  'news-page': { key: 'newsPage', label: 'News page', operations: PAGE_OPS, guest: READ },
  'gallery-page': { key: 'galleryPage', label: 'Gallery page', operations: PAGE_OPS, guest: READ },
  'contact-page': { key: 'contactPage', label: 'Contact page', operations: PAGE_OPS, guest: READ },
  'entry-popup': { key: 'entryPopup', label: 'Entry popup', operations: PAGE_OPS, guest: READ },
  'site-settings': {
    key: 'siteSettings',
    label: 'Site settings',
    operations: PAGE_OPS,
    guest: READ,
    note: 'Navigation, contact details, theme and SEO for the whole site.',
  },
} satisfies Record<string, ResourceDef>

export type PermissionCollectionSlug = keyof typeof collectionResources
export type PermissionGlobalSlug = keyof typeof globalResources
export type ResourceSlug = PermissionCollectionSlug | PermissionGlobalSlug

export const allResources: Record<ResourceSlug, ResourceDef> = { ...collectionResources, ...globalResources }
const resourceSlugs = Object.keys(allResources) as ResourceSlug[]

/** Stored shape: `{ courses: { create: true, read: true, ... }, homePage: { read: true, update: false }, ... }`. */
export type PermissionSet = Record<string, Partial<Record<Operation, boolean>> | undefined>

/** Bump when the stored permission shape changes; syncRoles.ts upgrades older roles on startup. */
export const PERMISSIONS_VERSION = 2

const grant = (entries: [ResourceSlug, readonly Operation[]][]): PermissionSet => {
  const set: PermissionSet = {}
  for (const [slug, ops] of entries) {
    const key = allResources[slug].key
    set[key] = { ...set[key], ...Object.fromEntries(ops.map((op) => [op, true])) }
  }
  return set
}

/** Read on every resource except accounts and audit logs. */
const READ_ALL_CONTENT = resourceSlugs
  .filter((slug) => slug !== 'users' && slug !== 'audit-logs')
  .map((slug): [ResourceSlug, readonly Operation[]] => [slug, READ])

const PAGES_EXCEPT_SETTINGS = (Object.keys(globalResources) as PermissionGlobalSlug[])
  .filter((slug) => slug !== 'site-settings')
  .map((slug): [ResourceSlug, readonly Operation[]] => [slug, PAGE_OPS])

/**
 * The built-in Guest role: what the website (and anyone without signing in) can do.
 * Defaults to exactly what the website needs.
 */
export const GUEST_ROLE = {
  name: 'Guest',
  description: 'Visitors and the public website API (no sign-in). Can only read content and send the contact form.',
  permissions: grant(
    resourceSlugs
      .filter((slug) => allResources[slug].guest.length)
      .map((slug): [ResourceSlug, readonly Operation[]] => [slug, allResources[slug].guest]),
  ),
}

/**
 * Starting roles, created automatically on a database with no roles yet
 * (and used when converting the old hard-coded editor/staff roles).
 * After that they live in the database and are edited in the admin panel.
 */
export const DEFAULT_ROLES: { legacy: string; name: string; description: string; permissions: PermissionSet }[] = [
  {
    legacy: 'editor',
    name: 'Editor',
    description: 'Marketing / content lead: manages all website content and pages.',
    permissions: grant([
      ...READ_ALL_CONTENT,
      ['courses', OPERATIONS],
      ['staff', OPERATIONS],
      ['services', OPERATIONS],
      ['news', OPERATIONS],
      ['testimonials', OPERATIONS],
      ['gallery', OPERATIONS],
      ['media', OPERATIONS],
      ['contact-submissions', OPERATIONS],
      ...PAGES_EXCEPT_SETTINGS,
    ]),
  },
  {
    legacy: 'staff',
    name: 'Staff',
    description: 'Front desk / instructors: testimonials, gallery photos, leads and the entry popup.',
    permissions: grant([
      ...READ_ALL_CONTENT,
      ['testimonials', ['create', 'update']],
      ['gallery', ['create', 'update']],
      ['media', ['create', 'update']],
      ['contact-submissions', ['read', 'update']],
      ['entry-popup', PAGE_OPS],
    ]),
  },
]

/**
 * Upgrades a role saved before every resource had a Read checkbox. Back then every
 * signed-in user could see all website content, so Read is turned on wherever it is
 * new, keeping everyone's access the same.
 */
export const upgradeToV2 = (permissions: PermissionSet | null | undefined): PermissionSet => {
  const next: PermissionSet = { ...permissions }
  for (const slug of resourceSlugs) {
    if (slug === 'news' || slug === 'contact-submissions' || slug === 'users' || slug === 'audit-logs') continue
    const key = allResources[slug].key
    next[key] = { ...next[key], read: true }
  }
  return next
}
