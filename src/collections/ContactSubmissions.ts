import type { CollectionConfig } from 'payload'

import { collectionAccess } from '@/access'
import { auditCollection } from '@/hooks/audit'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: { singular: 'Contact submission', plural: 'Contact submissions' },
  access: collectionAccess('contact-submissions'),
  admin: {
    defaultColumns: ['name', 'phone', 'courses', 'createdAt'],
    group: 'Leads',
    useAsTitle: 'name',
  },
  defaultSort: '-createdAt',
  hooks: auditCollection('contact-submissions', 'name'),
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'phone', type: 'text', required: true },
      ],
    },
    {
      name: 'courses',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
      required: true,
      minRows: 1,
    },
    { name: 'message', type: 'textarea', required: true },
  ],
  timestamps: true,
}
