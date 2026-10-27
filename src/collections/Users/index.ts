import type { Access, CollectionConfig, FieldAccess } from 'payload'

import { canUseAdmin, collectionAccess, isSuperAdmin } from '@/access'
import { ROLE_LABELS, ROLES } from '@/access/permissions'
import { auditCollection, auditLogin } from '@/hooks/audit'

const rules = collectionAccess('users')

/** Access granted by the matrix, or the signed-in user's own account. */
const ruleOrSelf =
  (rule: Access): Access =>
  async (args) => {
    if (await rule(args)) return true
    const { user } = args.req
    return user ? { id: { equals: user.id } } : false
  }

const superAdminField: FieldAccess = ({ req: { user } }) => isSuperAdmin(user)

const audit = auditCollection('users', 'email')

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: canUseAdmin,
    read: ruleOrSelf(rules.read),
    update: ruleOrSelf(rules.update),
    create: rules.create,
    delete: rules.delete,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    group: 'System',
    useAsTitle: 'name',
  },
  auth: true,
  hooks: {
    ...audit,
    afterLogin: [auditLogin],
    beforeChange: [
      // The very first account (created on the "create first user" screen)
      // becomes the super admin so nobody is locked out of a fresh install.
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const { totalDocs } = await req.payload.count({ collection: 'users', req })
        if (totalDocs === 0) data.role = 'super-admin'
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'staff',
      saveToJWT: true,
      options: ROLES.map((value) => ({ label: ROLE_LABELS[value], value })),
      access: { create: superAdminField, update: superAdminField },
      admin: {
        position: 'sidebar',
        description: 'What this person can do is defined in src/access/permissions.ts.',
      },
    },
  ],
  timestamps: true,
}
