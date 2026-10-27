import type { CollectionConfig } from 'payload'

import { collectionAccess } from '@/access'
import { auditCollection } from '@/hooks/audit'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: collectionAccess('testimonials'),
  admin: {
    defaultColumns: ['author', 'role', 'quote'],
    description: 'Student quotes shown in the home page carousel. Drag to reorder.',
    group: 'Academy',
    useAsTitle: 'author',
  },
  hooks: auditCollection('testimonials', 'author'),
  orderable: true,
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'author', type: 'text', required: true },
        {
          name: 'role',
          type: 'text',
          required: true,
          admin: { description: 'For example: Học viên · 22 tuổi, or the course they took.' },
        },
      ],
    },
  ],
}
