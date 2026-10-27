import type { Field, GlobalConfig } from 'payload'

import { globalAccess } from '@/access'
import { accentField } from '@/fields/accent'
import type { PermissionGlobalSlug } from '@/access/permissions'
import { auditGlobal } from '@/hooks/audit'

/** Big title block at the top of every inner page. Its number comes from the navigation order. */
export const pageIntroField: Field = {
  name: 'intro',
  label: 'Page introduction',
  type: 'group',
  fields: [
    { name: 'eyebrow', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'copy', type: 'textarea', required: true },
    accentField(),
  ],
}

export const marqueeField = (description = 'Scrolling text band. Separate phrases with " / ".'): Field => ({
  name: 'marquee',
  type: 'text',
  required: true,
  admin: { description },
})

export const text = (name: string, description?: string): Field => ({
  name,
  type: 'text',
  required: true,
  ...(description ? { admin: { description } } : {}),
})

export const textarea = (name: string, description?: string): Field => ({
  name,
  type: 'textarea',
  required: true,
  ...(description ? { admin: { description } } : {}),
})

export const image = (name: string): Field => ({
  name,
  type: 'upload',
  relationTo: 'media',
  required: true,
})

/** Search-result and link-preview overrides. Anything left empty falls back to the page's own content. */
export const seoField: Field = {
  name: 'seo',
  label: 'SEO',
  type: 'group',
  admin: {
    description:
      'Optional. Overrides how this page appears in Google and in link previews. Empty fields use the page content.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      maxLength: 70,
      admin: { description: 'Browser tab and search-result title. Around 50–60 characters.' },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 200,
      admin: { description: 'Search-result snippet. Around 120–160 characters.' },
    },
    {
      name: 'image',
      label: 'Share image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Shown when the link is shared. 1200 × 630 px works best.' },
    },
    {
      name: 'noIndex',
      label: 'Hide from search engines',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}

/** Shared shell for the page globals: access from the matrix, audit hooks, "Pages" group. */
export const pageGlobal = (
  slug: PermissionGlobalSlug,
  label: string,
  fields: Field[],
  group = 'Pages',
): GlobalConfig => ({
  slug,
  label,
  access: globalAccess(slug),
  admin: { group },
  hooks: auditGlobal(slug),
  // Every public page gets its own SEO overrides; site-wide globals do not.
  fields: group === 'Pages' ? [...fields, seoField] : fields,
})
