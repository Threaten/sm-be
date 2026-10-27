import type { SelectField } from 'payload'

/** One of the brand colours defined in Site settings → Theme. */
export const accentField = (defaultValue: 'coral' | 'cobalt' | 'acid' = 'coral'): SelectField => ({
  name: 'accent',
  type: 'select',
  required: true,
  defaultValue,
  options: [
    { label: 'Coral', value: 'coral' },
    { label: 'Cobalt', value: 'cobalt' },
    { label: 'Acid', value: 'acid' },
  ],
})
