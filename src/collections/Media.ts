import type { CollectionConfig } from 'payload'

import { collectionAccess } from '@/access'
import { auditCollection } from '@/hooks/audit'

export const Media: CollectionConfig = {
  slug: 'media',
  access: collectionAccess('media'),
  admin: { group: 'Library', useAsTitle: 'alt' },
  hooks: auditCollection('media', 'alt'),
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'card', width: 800, height: 1000, position: 'centre' },
      { name: 'wide', width: 1600, height: 1000, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      label: 'Image description',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describes the image for screen readers and search engines. Used everywhere the image appears.',
      },
    },
  ],
}
