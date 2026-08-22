import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: { useAsTitle: 'title' },
  access: {
    read: anyone,
  },
  fields: [
    { name: 'number', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'label', type: 'text', required: true },
    { name: 'copy', type: 'textarea', required: true },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
  ],
}
