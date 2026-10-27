import type { CollectionConfig } from 'payload'

import { collectionAccess } from '@/access'

const rules = collectionAccess('audit-logs')

/** Append-only history of every change, written by the hooks in src/hooks/audit.ts. */
export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  labels: { singular: 'Audit log', plural: 'Audit logs' },
  access: {
    read: rules.read,
    delete: rules.delete,
    create: () => false,
    update: () => false,
  },
  admin: {
    defaultColumns: ['createdAt', 'action', 'resource', 'documentTitle', 'userEmail'],
    group: 'System',
    useAsTitle: 'documentTitle',
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'action',
      type: 'select',
      required: true,
      index: true,
      options: ['create', 'update', 'delete', 'login'],
    },
    {
      name: 'resourceType',
      type: 'select',
      required: true,
      options: ['collection', 'global'],
    },
    {
      name: 'resource',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'Collection or global slug.' },
    },
    { name: 'documentId', type: 'text', index: true },
    { name: 'documentTitle', type: 'text' },
    { name: 'changedFields', type: 'text', hasMany: true },
    { name: 'user', type: 'relationship', relationTo: 'users' },
    {
      name: 'userEmail',
      type: 'text',
      admin: { description: 'Kept so the entry still says who acted if the account is deleted.' },
    },
  ],
  timestamps: true,
}
