import type { TextField } from 'payload'

/** Turns "Bartender Cơ Bản" into "bartender-co-ban". */
export const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** URL slug that fills itself from `sourceField` when left empty. */
export const slugField = (sourceField: string): TextField => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: `Used in the page URL. Leave empty to generate it from the ${sourceField}.`,
  },
  hooks: {
    beforeValidate: [
      ({ value, siblingData }) => {
        if (typeof value === 'string' && value.trim()) return slugify(value)
        const source = siblingData?.[sourceField]
        return typeof source === 'string' ? slugify(source) : value
      },
    ],
  },
})
