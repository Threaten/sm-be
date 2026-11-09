import { APIError, type CollectionConfig, type Field } from 'payload'

import { superAdminOnly } from '@/access'
import {
  collectionResources,
  globalResources,
  OPERATION_LABELS,
  PERMISSIONS_VERSION,
  type ResourceDef,
} from '@/access/permissions'
import { auditCollection } from '@/hooks/audit'

type RoleData = { isGuest?: boolean } | undefined

/**
 * One block per resource with a checkbox per action it supports, e.g. "Courses: Create · Read · Update · Delete".
 * On the Guest role only the actions guests may ever have are shown; resources with none are hidden.
 */
const resourceFields = (resources: Record<string, ResourceDef>): Field[] =>
  Object.values(resources).map((resource) => ({
    name: resource.key,
    label: resource.label,
    type: 'group',
    admin: {
      description: resource.note,
      condition: (data: RoleData) => !data?.isGuest || resource.guest.length > 0,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'all',
            type: 'ui',
            admin: {
              components: {
                Field: {
                  path: '@/components/admin/SelectAllPermissions#SelectAllPermissions',
                  clientProps: {
                    operations: [...resource.operations],
                    guestOperations: [...resource.guest],
                  },
                },
              },
            },
          },
          ...resource.operations.map(
            (operation): Field => ({
              name: operation,
              label: OPERATION_LABELS[operation],
              type: 'checkbox',
              defaultValue: false,
              admin: {
                width: '22%',
                condition: (data: RoleData) => !data?.isGuest || resource.guest.includes(operation),
              },
            }),
          ),
        ],
      },
    ],
  }))

export const Roles: CollectionConfig = {
  slug: 'roles',
  labels: { singular: 'Role', plural: 'Roles' },
  access: {
    // Signed-in users can see role names (shown on their account); only super admins manage roles,
    // so nobody can grant themselves more access.
    read: ({ req: { user } }) => Boolean(user),
    create: superAdminOnly,
    update: superAdminOnly,
    delete: superAdminOnly,
  },
  admin: {
    defaultColumns: ['name', 'description', 'updatedAt'],
    description:
      'Tick what each role may see (Read) and do. Changes apply immediately to everyone with the role. Super admins can always do everything. The Guest role is what the website and anyone not signed in can do.',
    group: 'System',
    useAsTitle: 'name',
  },
  hooks: {
    ...auditCollection('roles', 'name'),
    beforeDelete: [
      async ({ id, req }) => {
        const role = await req.payload.findByID({ collection: 'roles', id, depth: 0, req, overrideAccess: true })
        if (role?.isGuest) {
          throw new APIError('The Guest role is built in and cannot be deleted.', 400, undefined, true)
        }
        const { totalDocs } = await req.payload.count({
          collection: 'users',
          where: { role: { equals: id } },
          req,
        })
        if (totalDocs > 0) {
          throw new APIError(
            `This role is assigned to ${totalDocs} user${totalDocs === 1 ? '' : 's'}. Give them another role first.`,
            400,
            undefined,
            true,
          )
        }
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'isGuest',
      label: 'Guest role',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      // Set once by src/access/syncRoles.ts; there is exactly one guest role.
      access: { create: () => false, update: () => false },
      admin: {
        position: 'sidebar',
        readOnly: true,
        description:
          'Built in. Applies to the website and every request without sign-in. It can only be given Read on content and Create on contact submissions.',
        condition: (data: RoleData) => Boolean(data?.isGuest),
      },
    },
    {
      // Stored-permission format version; syncRoles.ts upgrades older roles on startup.
      name: 'permissionsVersion',
      type: 'number',
      defaultValue: PERMISSIONS_VERSION,
      admin: { hidden: true },
    },
    {
      name: 'permissions',
      type: 'group',
      admin: { hideGutter: true },
      fields: [
        {
          type: 'collapsible',
          label: 'Website content & leads',
          fields: resourceFields(collectionResources),
        },
        {
          type: 'collapsible',
          label: 'Pages & site settings',
          fields: resourceFields(globalResources),
        },
      ],
    },
  ],
  timestamps: true,
}
