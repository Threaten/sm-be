import type { Access, FieldAccess, PayloadRequest } from 'payload'

import {
  allResources,
  collectionResources,
  type Operation,
  type PermissionCollectionSlug,
  type PermissionGlobalSlug,
  type PermissionSet,
  type ResourceSlug,
} from './permissions'

/**
 * The signed-in user as loaded by Payload on every request. Users has
 * `auth.depth: 1`, so `role` arrives populated with its permissions and
 * permission changes apply on the very next request.
 */
type AccessUser = {
  isSuperAdmin?: boolean | null
  role?: { permissions?: PermissionSet | null } | string | null
  permissionExceptions?:
    | { resource?: string | null; operation?: string | null; effect?: string | null }[]
    | null
}

type MaybeUser = PayloadRequest['user'] | AccessUser | null | undefined

const asUser = (user: MaybeUser) => (user ?? null) as AccessUser | null

export const isSuperAdmin = (user: MaybeUser) => Boolean(asUser(user)?.isSuperAdmin)

/**
 * Whether a user may perform `operation` on `resource`:
 * super admin → yes; a per-user exception → its allow/deny; otherwise → the role's checkbox.
 */
export const can = (user: MaybeUser, resource: ResourceSlug, operation: Operation): boolean => {
  const current = asUser(user)
  if (!current) return false
  if (current.isSuperAdmin) return true
  if (!allResources[resource].operations.includes(operation)) return false

  const exception = current.permissionExceptions?.find(
    (row) => row.resource === resource && row.operation === operation,
  )
  if (exception?.effect === 'allow') return true
  if (exception?.effect === 'deny') return false

  const role = current.role
  if (!role || typeof role !== 'object') return false
  return Boolean(role.permissions?.[allResources[resource].key]?.[operation])
}

export const superAdminOnly: Access = ({ req: { user } }) => isSuperAdmin(user)
export const superAdminField: FieldAccess = ({ req: { user } }) => isSuperAdmin(user)

/** Any signed-in user may open the admin panel; what they see there depends on their permissions. */
export const canUseAdmin = ({ req: { user } }: { req: PayloadRequest }) => Boolean(user)

const PUBLIC: Access = () => true

export const collectionAccess = (slug: PermissionCollectionSlug) => {
  const { operations } = collectionResources[slug] as { operations: readonly Operation[] }
  const rule =
    (operation: Operation): Access =>
    ({ req: { user } }) =>
      can(user, slug, operation)
  return {
    // Website content is always public; only resources that offer "read" are restricted.
    read: operations.includes('read') ? rule('read') : PUBLIC,
    create: rule('create'),
    update: rule('update'),
    delete: rule('delete'),
  }
}

export const globalAccess = (slug: PermissionGlobalSlug) => ({
  read: PUBLIC,
  update: (({ req: { user } }) => can(user, slug, 'update')) as Access,
})
