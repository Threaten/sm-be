'use client'

import type { UIFieldClientProps } from 'payload'

import { CheckboxInput, useForm, useFormFields } from '@payloadcms/ui'

/**
 * "All" checkbox at the start of each resource row in the role editor.
 * Ticks or clears every action in the row; shows a partial state when only some are ticked.
 * It stores nothing itself; the real values are the sibling checkboxes.
 */
export const SelectAllPermissions = ({
  path,
  readOnly,
  operations,
  guestOperations,
}: UIFieldClientProps & { operations: string[]; guestOperations: string[] }) => {
  // On the Guest role only the actions guests may have are shown, so "All" only covers those.
  const isGuest = useFormFields(([fields]) => Boolean(fields.isGuest?.value))
  const parent = path.split('.').slice(0, -1).join('.')
  const paths = (isGuest ? guestOperations : operations).map((operation) => `${parent}.${operation}`)

  // A string ("101") rather than an array, so the box only re-renders when its own row changes.
  const values = useFormFields(([fields]) =>
    paths.map((fieldPath) => (fields[fieldPath]?.value ? '1' : '0')).join(''),
  )
  const { dispatchFields, setModified } = useForm()

  const checked = !values.includes('0')
  const partial = !checked && values.includes('1')

  return (
    <div className="field-type checkbox" style={{ flex: '0 0 auto', width: '12%' }}>
      <CheckboxInput
        id={`field-${path.replace(/\./g, '__')}`}
        label="All"
        checked={checked}
        partialChecked={partial}
        readOnly={readOnly}
        onToggle={() => {
          for (const fieldPath of paths) {
            dispatchFields({ type: 'UPDATE', path: fieldPath, value: !checked })
          }
          setModified(true)
        }}
      />
    </div>
  )
}
