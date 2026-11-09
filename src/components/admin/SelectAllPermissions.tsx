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
}: UIFieldClientProps & { operations: string[] }) => {
  const parent = path.split('.').slice(0, -1).join('.')
  const paths = operations.map((operation) => `${parent}.${operation}`)

  const values = useFormFields(([fields]) => paths.map((fieldPath) => Boolean(fields[fieldPath]?.value)))
  const { dispatchFields, setModified } = useForm()

  const checked = values.every(Boolean)
  const partial = !checked && values.some(Boolean)

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
