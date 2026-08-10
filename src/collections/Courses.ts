import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: { useAsTitle: 'title' },
  access: {
    read: anyone,
  },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'index', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'level', type: 'text', required: true },
    { name: 'duration', type: 'text', required: true },
    { name: 'price', type: 'text', required: true },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'image', type: 'text', required: true },
    { name: 'tone', type: 'text', required: true },
    {
      name: 'syllabus',
      type: 'array',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
  ],
}
