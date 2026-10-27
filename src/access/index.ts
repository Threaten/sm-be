import type { Access, PayloadRequest } from 'payload'

import {
  collectionPermissions,
  globalPermissions,
  ROLES,
  type CollectionRules,
  type GlobalRules,
  type PermissionCollectionSlug,
  type PermissionGlobalSlug,
  type Role,
} from './permissions'

type MaybeUser = PayloadRequest['user'] | { role?: string | null } | null | undefined

/** A user's role. Unknown or missing roles get the lowest one (staff). */
export const getRole = (user: MaybeUser): Role | null => {
  if (!user) return null
  const role = (user as { role?: string | null }).role
  return ROLES.includes(role as Role) ? (role as Role) : 'staff'
}

export const isSuperAdmin = (user: MaybeUser) => getRole(user) === 'super-admin'

const allows = (rule: CollectionRules[keyof CollectionRules], user: MaybeUser) => {
  if (rule === 'public') return true
  const role = getRole(user)
  if (!role) return false
  return role === 'super-admin' || rule.includes(role)
}

export const superAdminOnly: Access = ({ req: { user } }) => isSuperAdmin(user)

/** Any signed-in role may open the admin panel. */
export const canUseAdmin = ({ req: { user } }: { req: PayloadRequest }) => Boolean(getRole(user))

export const collectionAccess = (slug: PermissionCollectionSlug) => {
  const rules: CollectionRules = collectionPermissions[slug]
  return {
    read: (({ req: { user } }) => allows(rules.read, user)) as Access,
    create: (({ req: { user } }) => allows(rules.create, user)) as Access,
    update: (({ req: { user } }) => allows(rules.update, user)) as Access,
    delete: (({ req: { user } }) => allows(rules.delete, user)) as Access,
  }
}

export const globalAccess = (slug: PermissionGlobalSlug) => {
  const rules: GlobalRules = globalPermissions[slug]
  return {
    read: (({ req: { user } }) => allows(rules.read, user)) as Access,
    update: (({ req: { user } }) => allows(rules.update, user)) as Access,
  }
}
