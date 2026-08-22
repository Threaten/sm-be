import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: anyone },
  admin: { useAsTitle: 'alt' },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'card', width: 800, height: 1000, position: 'centre' },
      { name: 'wide', width: 1600, height: 1000, position: 'centre' },
    ],
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
  ],
}
