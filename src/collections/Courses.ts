import type { CollectionConfig } from 'payload'

import { collectionAccess } from '@/access'
import { accentField } from '@/fields/accent'
import { slugField } from '@/fields/slug'
import { auditCollection } from '@/hooks/audit'

export const Courses: CollectionConfig = {
  slug: 'courses',
  access: collectionAccess('courses'),
  admin: {
    defaultColumns: ['title', 'level', 'duration', 'price'],
    description: 'Shown on the website in this order. Course numbers are added automatically.',
    group: 'Academy',
    useAsTitle: 'title',
  },
  hooks: auditCollection('courses', 'title'),
  orderable: true,
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    { ...accentField(), admin: { position: 'sidebar', description: 'Block colour for this course.' } },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            {
              name: 'level',
              type: 'text',
              required: true,
              admin: { description: 'Who the course is for.' },
            },
            { name: 'summary', type: 'textarea', required: true },
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
            { name: 'imageCaption', type: 'text', required: true },
          ],
        },
        {
          label: 'Schedule & tuition',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'duration', type: 'text', required: true },
                { name: 'classSize', type: 'text', required: true },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'nextIntake', type: 'text', required: true },
                { name: 'location', type: 'text', required: true },
              ],
            },
            {
              name: 'schedule',
              type: 'textarea',
              required: true,
              admin: { description: 'One line per row.' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  label: 'Regular price',
                  type: 'text',
                  required: true,
                  admin: { description: 'For example 8000000, or "Liên hệ".' },
                },
                {
                  name: 'promotionPrice',
                  label: 'Promotion price',
                  type: 'text',
                  admin: { description: 'Optional. When set, the regular price is crossed out.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Syllabus',
          fields: [
            {
              name: 'syllabus',
              type: 'array',
              minRows: 1,
              admin: { initCollapsed: true },
              fields: [
                { name: 'title', type: 'text', required: true },
                {
                  name: 'description',
                  type: 'textarea',
                  admin: { description: 'Optional. When set, the lesson opens to show it.' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
