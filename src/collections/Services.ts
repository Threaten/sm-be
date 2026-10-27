import type { CollectionConfig } from 'payload'

import { collectionAccess } from '@/access'
import { auditCollection } from '@/hooks/audit'

export const Services: CollectionConfig = {
  slug: 'services',
  access: collectionAccess('services'),
  admin: {
    defaultColumns: ['title', 'label'],
    description: 'Shown on the Services page in this order. Numbers are added automatically.',
    group: 'Academy',
    useAsTitle: 'title',
  },
  hooks: auditCollection('services', 'title'),
  orderable: true,
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: { description: 'Short audience or format line, for example: 8 to 24 guests.' },
    },
    { name: 'copy', type: 'textarea', required: true },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
  ],
}
