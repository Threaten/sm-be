import type { CollectionConfig } from 'payload'

import { collectionAccess } from '@/access'
import { slugField } from '@/fields/slug'
import { seoField } from '@/globals/shared'
import { auditCollection } from '@/hooks/audit'

export const Staff: CollectionConfig = {
  slug: 'staff',
  labels: { singular: 'Instructor', plural: 'Instructors' },
  access: collectionAccess('staff'),
  admin: {
    defaultColumns: ['name', 'role'],
    description: 'Shown on the Team page in this order.',
    group: 'Academy',
    useAsTitle: 'name',
  },
  hooks: auditCollection('staff', 'name'),
  orderable: true,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'shortName',
          type: 'text',
          required: true,
          admin: { description: 'First name used in buttons, e.g. "Meet Grace".' },
        },
      ],
    },
    slugField('name'),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profile',
          fields: [
            { name: 'role', type: 'text', required: true },
            {
              name: 'note',
              type: 'text',
              required: true,
              admin: { description: 'One-line teaser shown on the team card.' },
            },
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
            { name: 'quote', type: 'textarea', required: true },
            {
              name: 'bio',
              type: 'array',
              minRows: 1,
              fields: [{ name: 'paragraph', type: 'textarea', required: true }],
            },
          ],
        },
        {
          label: 'Teaching',
          fields: [
            { name: 'teachingFocus', type: 'textarea', required: true },
            {
              name: 'specialties',
              type: 'array',
              fields: [{ name: 'item', type: 'text', required: true }],
            },
            { name: 'favoritePour', type: 'text', required: true },
          ],
        },
        {
          label: 'Achievements',
          fields: [
            {
              name: 'achievements',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'year', type: 'text', required: true },
                    { name: 'title', type: 'text', required: true },
                    { name: 'organization', type: 'text', required: true },
                  ],
                },
              ],
            },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
  ],
}
