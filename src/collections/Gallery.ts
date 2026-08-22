import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: { useAsTitle: 'caption' },
  access: {
    read: anyone,
  },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text', required: true },
  ],
}
