import type { SelectField } from 'payload'

/** The site is strictly black, white and red: a section is either red or black. */
export const accentOptions = [
  { label: 'Red', value: 'red' },
  { label: 'Black', value: 'black' },
]

export const accentField = (defaultValue: 'red' | 'black' = 'red'): SelectField => ({
  name: 'accent',
  type: 'select',
  required: true,
  defaultValue,
  options: accentOptions,
})
