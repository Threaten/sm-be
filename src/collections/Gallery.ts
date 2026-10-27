import type { CollectionConfig } from 'payload'

import { collectionAccess } from '@/access'
import { auditCollection } from '@/hooks/audit'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  labels: { singular: 'Gallery photo', plural: 'Gallery' },
  access: collectionAccess('gallery'),
  admin: { defaultColumns: ['caption', 'image'], group: 'Library', useAsTitle: 'caption' },
  hooks: auditCollection('gallery', 'caption'),
  orderable: true,
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text', required: true },
  ],
}
