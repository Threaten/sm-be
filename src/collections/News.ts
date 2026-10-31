import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

import { collectionAccess } from '@/access'
import { EmojiPasteFeature } from '@/components/admin/richText/EmojiPaste'
import { accentField } from '@/fields/accent'
import { slugField } from '@/fields/slug'
import { seoField } from '@/globals/shared'
import { auditCollection } from '@/hooks/audit'

/** Editor tools the website knows how to render (see sm-fe/components/RichText.tsx). */
const UNSUPPORTED_FEATURES = new Set([
  'align',
  'checklist',
  'indent',
  'inlineCode',
  'relationship',
  'subscript',
  'superscript',
])

const access = collectionAccess('news')

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News post', plural: 'News' },
  access: {
    ...access,
    // Visitors only ever see published posts; signed-in users with read access also see drafts.
    read: (args) => (args.req.user ? access.read(args) : { _status: { equals: 'published' } }),
  },
  admin: {
    defaultColumns: ['title', 'publishedAt', '_status'],
    description: 'Articles on the News page, newest first. Save as draft until a post is ready.',
    group: 'Academy',
    useAsTitle: 'title',
  },
  defaultSort: '-publishedAt',
  hooks: auditCollection('news', 'title'),
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    {
      name: 'publishedAt',
      label: 'Publish date',
      type: 'date',
      required: true,
      index: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
        description: 'Shown on the post and used to order the list.',
      },
    },
    { ...accentField(), admin: { position: 'sidebar', description: 'Block colour for this post.' } },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              maxLength: 300,
              admin: { description: 'One or two sentences for the news list and link previews.' },
            },
            { name: 'image', label: 'Cover image', type: 'upload', relationTo: 'media', required: true },
            { name: 'imageCaption', type: 'text', admin: { description: 'Optional tag on the cover photo.' } },
            {
              name: 'content',
              type: 'richText',
              required: true,
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures.filter((feature) => !UNSUPPORTED_FEATURES.has(feature.key)),
                  EmojiPasteFeature(),
                ],
              }),
            },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
  ],
}
