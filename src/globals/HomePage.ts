import type { Field, GlobalAfterReadHook, GlobalConfig } from 'payload'

import { homeGuideDefaults } from './homeGuideDefaults'
import { image, marqueeField, pageGlobal, text, textarea } from './shared'

// The Guide & FAQ tab is optional: left empty, the website shows its built-in text.
const optional = (field: Field): Field => ({ ...field, required: false }) as Field
const optionalText = (name: string, description?: string) => optional(text(name, description))
const optionalTextarea = (name: string, description?: string) => optional(textarea(name, description))

const isEmpty = (value: unknown) =>
  value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)

/** Fills empty fields from `base`, the same way the website does, so the admin shows what the site shows. */
function withDefaults(value: unknown, base: unknown): unknown {
  if (isEmpty(value)) return structuredClone(base)
  if (typeof base !== 'object' || base === null || Array.isArray(base)) return value
  if (typeof value !== 'object' || value === null) return value
  const merged: Record<string, unknown> = { ...(value as Record<string, unknown>) }
  for (const [key, inner] of Object.entries(base)) merged[key] = withDefaults(merged[key], inner)
  return merged
}

// Editors see the built-in Guide & FAQ text in the form instead of empty fields; saving stores it.
const fillGuideDefaults: GlobalAfterReadHook = ({ doc }) => ({
  ...doc,
  guide: withDefaults(doc.guide, homeGuideDefaults.guide),
  faq: withDefaults(doc.faq, homeGuideDefaults.faq),
})

const homePage = pageGlobal('home-page', 'Home page', [
  {
    type: 'tabs',
    tabs: [
      {
        label: 'Hero',
        fields: [
          {
            name: 'hero',
            type: 'group',
            fields: [
              {
                type: 'row',
                fields: [text('kickerLeft'), text('kickerRight')],
              },
              {
                type: 'collapsible',
                label: 'Headline (four parts)',
                fields: [
                  text('titleLineOne', 'First line, e.g. LEARN THE'),
                  text('titleWord', 'Second line, e.g. SKILL.'),
                  text('titleEmphasis', 'Highlighted word on the second line, e.g. MASTER'),
                  text('titleLineThree', 'Last line, e.g. THE MIX.'),
                ],
              },
              textarea('summary'),
              text('buttonLabel', 'Links to the courses page.'),
              { type: 'row', fields: [image('imageLeft'), image('imageRight')] },
              textarea('burst', 'Text inside the star sticker. One word per line.'),
              textarea('note', 'Handwritten note beside the photos. One line per row.'),
            ],
          },
          marqueeField(),
        ],
      },
      {
        label: 'Manifesto',
        fields: [
          {
            name: 'manifesto',
            type: 'group',
            fields: [
              text('eyebrow'),
              text('title'),
              textarea('copy'),
              image('image'),
              textarea('stamp', 'Round stamp on the photo. One word per line.'),
              text('linkLabel', 'Links to the about page.'),
            ],
          },
        ],
      },
      {
        label: 'Featured',
        fields: [
          {
            name: 'featuredInstructor',
            type: 'group',
            fields: [
              text('eyebrow'),
              text('title'),
              {
                name: 'person',
                type: 'relationship',
                relationTo: 'staff',
                required: true,
              },
              text('linkLabel'),
            ],
          },
          {
            name: 'featuredCourses',
            type: 'group',
            admin: { description: 'Lists every course, in the order set under Courses.' },
            fields: [text('eyebrow'), text('title'), text('linkLabel')],
          },
          {
            name: 'testimonials',
            type: 'group',
            admin: { description: 'Quotes are managed in the Testimonials collection.' },
            fields: [text('eyebrow')],
          },
        ],
      },
      {
        label: 'Guide & FAQ',
        description:
          'Longer text under the courses that answers searches like "học bartender TP.HCM". The SEO agent may also update it. Clear a field to go back to the built-in text.',
        fields: [
          {
            name: 'guide',
            type: 'group',
            fields: [
              optionalText('eyebrow'),
              optionalText('title', 'Shown as a heading. Include the main search phrase, e.g. "Học bartender tại TP.HCM".'),
              optionalTextarea('intro'),
              {
                name: 'sections',
                type: 'array',
                fields: [
                  optionalText('heading'),
                  optionalTextarea('body', 'Plain text. Lines starting with "-" become a bulleted list.'),
                  {
                    type: 'row',
                    fields: [
                      optionalText('linkLabel', 'Optional link at the end of the section.'),
                      optionalText('linkHref', 'A page on this site, e.g. /courses/bartender-co-ban'),
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: 'faq',
            label: 'FAQ',
            type: 'group',
            admin: { description: 'Also sent to Google as FAQ data. Use questions people actually search.' },
            fields: [
              optionalText('eyebrow'),
              optionalText('title'),
              {
                name: 'items',
                type: 'array',
                fields: [optionalText('question'), optionalTextarea('answer')],
              },
            ],
          },
        ],
      },
    ],
  },
])

export const HomePage: GlobalConfig = {
  ...homePage,
  hooks: { ...homePage.hooks, afterRead: [...(homePage.hooks?.afterRead ?? []), fillGuideDefaults] },
}
