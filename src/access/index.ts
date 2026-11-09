import type { Access, FieldAccess, PayloadRequest } from 'payload'

import {
  allResources,
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

const roleAllows = (permissions: PermissionSet | null | undefined, resource: ResourceSlug, operation: Operation) => {
  const granted = permissions?.[allResources[resource].key]
  if (!granted) return false
  // Anyone who may change something may also see it.
  if (operation === 'read') return Boolean(granted.read || granted.create || granted.update || granted.delete)
  return Boolean(granted[operation])
}

/**
 * Whether a signed-in user may perform `operation` on `resource`:
 * super admin → yes; a per-user exception → its allow/deny; otherwise → the role's checkbox.
 */
export const userCan = (user: MaybeUser, resource: ResourceSlug, operation: Operation): boolean => {
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
  return Boolean(role && typeof role === 'object' && roleAllows(role.permissions, resource, operation))
}

/** The Guest role's permissions, loaded once per request. */
const guestPermissions = async (req: PayloadRequest): Promise<PermissionSet | null> => {
  const cached = req.context.guestPermissions as PermissionSet | null | undefined
  if (cached !== undefined) return cached
  const { docs } = await req.payload.find({
    collection: 'roles',
    where: { isGuest: { equals: true } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  })
  const permissions = (docs[0]?.permissions as PermissionSet | undefined) ?? null
  req.context.guestPermissions = permissions
  return permissions
}

/**
 * Whether the current request may perform `operation` on `resource`.
 * Signed-in users (including API-key users) → their role and exceptions.
 * No user → the Guest role, limited to the actions guests may ever have.
 */
export const can = async (req: PayloadRequest, resource: ResourceSlug, operation: Operation) => {
  if (req.user) return userCan(req.user, resource, operation)
  if (!allResources[resource].guest.includes(operation)) return false
  const granted = (await guestPermissions(req))?.[allResources[resource].key]
  return Boolean(granted?.[operation])
}

export const superAdminOnly: Access = ({ req: { user } }) => isSuperAdmin(user)
export const superAdminField: FieldAccess = ({ req: { user } }) => isSuperAdmin(user)

/** Any signed-in user may open the admin panel; what they see there depends on their Read permissions. */
export const canUseAdmin = ({ req: { user } }: { req: PayloadRequest }) => Boolean(user)

const rule =
  (resource: ResourceSlug, operation: Operation): Access =>
  ({ req }) =>
    can(req, resource, operation)

export const collectionAccess = (slug: PermissionCollectionSlug) => ({
  read: rule(slug, 'read'),
  create: rule(slug, 'create'),
  update: rule(slug, 'update'),
  delete: rule(slug, 'delete'),
})

export const globalAccess = (slug: PermissionGlobalSlug) => ({
  read: rule(slug, 'read'),
  update: rule(slug, 'update'),
})
