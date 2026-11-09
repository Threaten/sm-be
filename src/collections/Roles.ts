import { APIError, type CollectionConfig, type Field } from 'payload'

import { superAdminOnly } from '@/access'
import {
  collectionResources,
  globalResources,
  OPERATION_LABELS,
  type Operation,
} from '@/access/permissions'
import { auditCollection } from '@/hooks/audit'

type Resource = { key: string; label: string; operations: readonly Operation[]; note?: string }

/** One block per resource with a checkbox per action it supports, e.g. "Courses: Create · Update · Delete". */
const resourceFields = (resources: Record<string, Resource>): Field[] =>
  Object.values(resources).map((resource) => ({
    name: resource.key,
    label: resource.label,
    type: 'group',
    admin: { description: resource.note },
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
                  clientProps: { operations: [...resource.operations] },
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
              admin: { width: '22%' },
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
      'Tick what each role may do. Changes apply immediately to everyone with the role. Super admins can always do everything.',
    group: 'System',
    useAsTitle: 'name',
  },
  hooks: {
    ...auditCollection('roles', 'name'),
    beforeDelete: [
      async ({ id, req }) => {
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
