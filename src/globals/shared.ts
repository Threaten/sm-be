import type { Field, GlobalConfig } from 'payload'

import { globalAccess } from '@/access'
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
    {
      name: 'accent',
      type: 'select',
      required: true,
      defaultValue: 'coral',
      options: [
        { label: 'Coral', value: 'coral' },
        { label: 'Cobalt', value: 'cobalt' },
      ],
    },
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
  fields,
})
