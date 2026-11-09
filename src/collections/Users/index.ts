import { APIError, type Access, type CollectionConfig } from 'payload'

import { can, canUseAdmin, isSuperAdmin, superAdminField } from '@/access'
import { allResources, OPERATION_LABELS, OPERATIONS, type ResourceSlug } from '@/access/permissions'
import { auditCollection, auditLogin } from '@/hooks/audit'

const notSuperAdmin = { isSuperAdmin: { not_equals: true } }

/**
 * Everyone can read and edit their own account. Users granted "Users" access in
 * their role can manage other accounts, but never a super admin's: otherwise
 * they could change its password and take it over.
 */
const access: CollectionConfig['access'] = {
  admin: canUseAdmin,
  read: ({ req: { user } }) => {
    if (!user) return false
    return can(user, 'users', 'read') || { id: { equals: user.id } }
  },
  create: ({ req: { user } }) => can(user, 'users', 'create'),
  update: (({ req: { user } }) => {
    if (!user) return false
    if (isSuperAdmin(user)) return true
    const self = { id: { equals: user.id } }
    return can(user, 'users', 'update') ? { or: [self, notSuperAdmin] } : self
  }) as Access,
  delete: (({ req: { user } }) => {
    if (!user) return false
    if (isSuperAdmin(user)) return true
    return can(user, 'users', 'delete') ? notSuperAdmin : false
  }) as Access,
}

const audit = auditCollection('users', 'email')

export const Users: CollectionConfig = {
  slug: 'users',
  access,
  admin: {
    defaultColumns: ['name', 'email', 'role', 'isSuperAdmin'],
    group: 'System',
    useAsTitle: 'name',
  },
  // depth 1 loads the role's permissions onto the signed-in user for every access check.
  auth: { depth: 1 },
  hooks: {
    ...audit,
    afterLogin: [auditLogin],
    beforeChange: [
      async ({ data, operation, originalDoc, req }) => {
        // The very first account (created on the "create first user" screen)
        // becomes a super admin so nobody is locked out of a fresh install.
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', req })
          if (totalDocs === 0) data.isSuperAdmin = true
        }
        // A super admin cannot demote themselves; another super admin has to do it.
        if (
          operation === 'update' &&
          req.user &&
          originalDoc?.id === req.user.id &&
          originalDoc?.isSuperAdmin &&
          data.isSuperAdmin === false
        ) {
          throw new APIError('You cannot remove your own super admin access.', 400, undefined, true)
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'isSuperAdmin',
      label: 'Super admin',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      access: { create: superAdminField, update: superAdminField },
      admin: {
        position: 'sidebar',
        description: 'Can do everything, including managing roles. Role and exceptions are ignored.',
      },
    },
    {
      name: 'role',
      type: 'relationship',
      relationTo: 'roles',
      index: true,
      access: { create: superAdminField, update: superAdminField },
      admin: {
        position: 'sidebar',
        description: 'What this person can do. Edit roles under System → Roles.',
        condition: (data) => !data?.isSuperAdmin,
      },
    },
    {
      name: 'permissionExceptions',
      label: 'Permission exceptions',
      type: 'array',
      access: { create: superAdminField, update: superAdminField },
      admin: {
        description:
          'Allow or deny a single action for this person only, overriding their role. Leave empty to use the role as is.',
        condition: (data) => !data?.isSuperAdmin,
        initCollapsed: false,
        components: { RowLabel: '@/components/admin/PermissionExceptionRowLabel#PermissionExceptionRowLabel' },
      },
      labels: { singular: 'Exception', plural: 'Exceptions' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'resource',
              type: 'select',
              required: true,
              options: Object.entries(allResources).map(([value, resource]) => ({
                label: resource.label,
                value,
              })),
              admin: { width: '40%' },
            },
            {
              name: 'operation',
              label: 'Action',
              type: 'select',
              required: true,
              options: OPERATIONS.map((value) => ({ label: OPERATION_LABELS[value], value })),
              admin: { width: '30%' },
              validate: (value: unknown, { siblingData }: { siblingData: { resource?: string } }) => {
                const resource = siblingData?.resource as ResourceSlug | undefined
                if (!value || !resource || !allResources[resource]) return true
                const { label, operations } = allResources[resource]
                return operations.includes(value as (typeof OPERATIONS)[number])
                  ? true
                  : `${label} only supports: ${operations.map((op) => OPERATION_LABELS[op]).join(', ')}.`
              },
            },
            {
              name: 'effect',
              type: 'select',
              required: true,
              defaultValue: 'allow',
              options: [
                { label: 'Allow', value: 'allow' },
                { label: 'Deny', value: 'deny' },
              ],
              admin: { width: '30%' },
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
