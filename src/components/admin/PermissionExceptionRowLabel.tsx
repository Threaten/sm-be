'use client'

import { useRowLabel } from '@payloadcms/ui'

import { allResources, OPERATION_LABELS, type Operation, type ResourceSlug } from '@/access/permissions'

/** Collapsed exception rows read "Deny · Courses · Delete" instead of "Exception 01". */
export const PermissionExceptionRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ resource?: string; operation?: string; effect?: string }>()
  const resource = data?.resource ? allResources[data.resource as ResourceSlug]?.label : undefined
  const operation = data?.operation ? OPERATION_LABELS[data.operation as Operation] : undefined
  if (!resource || !operation) return <span>Exception {String((rowNumber ?? 0) + 1).padStart(2, '0')}</span>
  return <span>{`${data?.effect === 'deny' ? 'Deny' : 'Allow'} · ${resource} · ${operation}`}</span>
}
