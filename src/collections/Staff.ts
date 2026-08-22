import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'

export const Staff: CollectionConfig = {
  slug: 'staff',
  admin: { useAsTitle: 'name' },
  access: {
    read: anyone,
  },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'name', type: 'text', required: true },
    { name: 'shortName', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'note', type: 'text', required: true },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'bio',
      type: 'array',
      fields: [{ name: 'paragraph', type: 'textarea', required: true }],
    },
    { name: 'quote', type: 'textarea', required: true },
    {
      name: 'specialties',
      type: 'array',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    { name: 'teachingFocus', type: 'textarea', required: true },
    { name: 'favoritePour', type: 'text', required: true },
    {
      name: 'achievements',
      type: 'array',
      fields: [
        { name: 'year', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'organization', type: 'text', required: true },
      ],
    },
  ],
}
