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
    { name: 'classSize', type: 'text', required: true, defaultValue: '12 students' },
    { name: 'nextIntake', type: 'text', required: true, defaultValue: 'September 14' },
    { name: 'schedule', type: 'textarea', required: true, defaultValue: 'Tuesday evenings\n6:30 to 9:00' },
    { name: 'location', type: 'text', required: true, defaultValue: 'Ho Chi Minh City' },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'image', type: 'text', required: true },
    { name: 'imageAlt', type: 'text', required: true, defaultValue: 'Cocktail class in progress' },
    { name: 'imageCaption', type: 'text', required: true, defaultValue: 'Skill & Mix / Ho Chi Minh City' },
    { name: 'tone', type: 'text', required: true },
    {
      name: 'syllabus',
      type: 'array',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
  ],
}
