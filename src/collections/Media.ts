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
      // Logos are often exported on a big padded canvas; this copy is cut to the artwork so the
      // website can size it by its visible height.
      { name: 'logo', height: 240, withoutEnlargement: true, trimOptions: { threshold: 10 } },
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
