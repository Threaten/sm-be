import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: { useAsTitle: 'title' },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: 'number', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'label', type: 'text', required: true },
    { name: 'copy', type: 'textarea', required: true },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
  ],
}
