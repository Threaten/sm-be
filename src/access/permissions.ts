/**
 * Central permission matrix for every collection and global.
 *
 * This is the ONE place to decide what each role may do. Collections and
 * globals never hard-code access rules; they call `collectionAccess(slug)` or
 * `globalAccess(slug)`, which read from the tables below.
 *
 * Rules:
 * - `super-admin` can always do everything. It is never listed below.
 * - `'public'` means anyone, including logged-out website visitors.
 * - An array lists the roles (besides super-admin) that are allowed.
 * - An empty array means super-admin only.
 *
 * The values below are a starting proposal. See PERMISSIONS.md for the
 * decisions that still need to be made.
 */

export const ROLES = ['super-admin', 'editor', 'staff'] as const
export type Role = (typeof ROLES)[number]
export type StaffRole = Exclude<Role, 'super-admin'>

export const ROLE_LABELS: Record<Role, string> = {
  'super-admin': 'Super admin',
  editor: 'Editor',
  staff: 'Staff',
}

type Rule = 'public' | StaffRole[]

export type CollectionRules = {
  read: Rule
  create: Rule
  update: Rule
  delete: Rule
}

export type GlobalRules = {
  read: Rule
  update: Rule
}

const EDITORS: StaffRole[] = ['editor']
const TEAM: StaffRole[] = ['editor', 'staff']
const NOBODY: StaffRole[] = []

export const collectionPermissions = {
  // Website content
  courses: { read: 'public', create: EDITORS, update: EDITORS, delete: EDITORS },
  staff: { read: 'public', create: EDITORS, update: EDITORS, delete: EDITORS },
  services: { read: 'public', create: EDITORS, update: EDITORS, delete: EDITORS },
  // Visitors see published posts only; drafts need a signed-in role (see News.ts).
  news: { read: 'public', create: EDITORS, update: EDITORS, delete: EDITORS },
  testimonials: { read: 'public', create: TEAM, update: TEAM, delete: EDITORS },
  gallery: { read: 'public', create: TEAM, update: TEAM, delete: EDITORS },
  media: { read: 'public', create: TEAM, update: TEAM, delete: EDITORS },

  // Leads. `create` stays public so the website contact form works.
  'contact-submissions': { read: TEAM, create: 'public', update: TEAM, delete: EDITORS },

  // System. Audit logs are written by hooks only, so create/update are closed
  // to everyone, super-admin included (see AuditLogs.ts).
  'audit-logs': { read: NOBODY, create: NOBODY, update: NOBODY, delete: NOBODY },

  // Users: everyone can always read and update their own account (see
  // Users/index.ts). These rules control access to OTHER people's accounts.
  users: { read: NOBODY, create: NOBODY, update: NOBODY, delete: NOBODY },
} satisfies Record<string, CollectionRules>

export const globalPermissions = {
  'site-settings': { read: 'public', update: NOBODY },
  'home-page': { read: 'public', update: EDITORS },
  'about-page': { read: 'public', update: EDITORS },
  'courses-page': { read: 'public', update: EDITORS },
  'team-page': { read: 'public', update: EDITORS },
  'services-page': { read: 'public', update: EDITORS },
  'news-page': { read: 'public', update: EDITORS },
  'gallery-page': { read: 'public', update: EDITORS },
  'contact-page': { read: 'public', update: EDITORS },
  'entry-popup': { read: 'public', update: TEAM },
} satisfies Record<string, GlobalRules>

export type PermissionCollectionSlug = keyof typeof collectionPermissions
export type PermissionGlobalSlug = keyof typeof globalPermissions
