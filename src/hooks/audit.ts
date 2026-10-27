import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionAfterLoginHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from 'payload'

type AuditAction = 'create' | 'update' | 'delete' | 'login'

type AuditEntry = {
  action: AuditAction
  resourceType: 'collection' | 'global'
  resource: string
  documentId?: string
  documentTitle?: string
  changedFields?: string[]
}

type Actor = { id: string | number; email?: string | null; collection?: string } | null | undefined

/** Fields that change on every save or hold secrets; never worth logging. */
const IGNORED_FIELDS = new Set([
  'id',
  '_id',
  '_order',
  'createdAt',
  'updatedAt',
  'globalType',
  'hash',
  'salt',
  'sessions',
  'loginAttempts',
  'lockUntil',
  'resetPasswordToken',
  'resetPasswordExpiration',
])

/** Set `context: { skipAudit: true }` on a Local API call to skip logging (seed, migrations). */
const shouldSkip = (req: PayloadRequest) => Boolean(req.context?.skipAudit)

const normalize = (value: unknown): string =>
  JSON.stringify(value, (_key, inner) =>
    inner && typeof inner === 'object' && 'id' in inner && !Array.isArray(inner)
      ? (inner as { id: unknown }).id
      : inner,
  ) ?? ''

const diffFields = (doc: Record<string, unknown>, previous: Record<string, unknown> = {}) =>
  [...new Set([...Object.keys(doc), ...Object.keys(previous)])]
    .filter((key) => !IGNORED_FIELDS.has(key))
    .filter((key) => normalize(doc[key]) !== normalize(previous[key]))

async function writeAuditLog(req: PayloadRequest, entry: AuditEntry, actor: Actor = req.user) {
  const user = actor && actor.collection === 'users' ? actor : null
  const target = entry.documentId ? `${entry.resource}/${entry.documentId}` : entry.resource
  req.payload.logger.info(
    `[audit] ${entry.action} ${target} by ${user?.email ?? 'anonymous'}` +
      (entry.changedFields?.length ? ` (${entry.changedFields.join(', ')})` : ''),
  )

  try {
    await req.payload.create({
      collection: 'audit-logs',
      data: { ...entry, user: user?.id as string | undefined, userEmail: user?.email ?? undefined },
      req,
      overrideAccess: true,
      context: { skipAudit: true },
    })
  } catch (error) {
    req.payload.logger.error({ err: error }, `[audit] could not record ${entry.action} ${target}`)
  }
}

const titleOf = (doc: Record<string, unknown>, titleField?: string) => {
  const value = titleField ? doc[titleField] : undefined
  return typeof value === 'string' && value ? value : undefined
}

export const auditCollection = (slug: string, titleField?: string) => {
  const afterChange: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
    if (shouldSkip(req)) return doc
    const changedFields = operation === 'update' ? diffFields(doc, previousDoc) : undefined
    if (operation === 'update' && !changedFields?.length) return doc

    await writeAuditLog(req, {
      action: operation,
      resourceType: 'collection',
      resource: slug,
      documentId: String(doc.id),
      documentTitle: titleOf(doc, titleField),
      changedFields,
    })
    return doc
  }

  const afterDelete: CollectionAfterDeleteHook = async ({ doc, id, req }) => {
    if (shouldSkip(req)) return doc
    await writeAuditLog(req, {
      action: 'delete',
      resourceType: 'collection',
      resource: slug,
      documentId: String(id),
      documentTitle: titleOf(doc, titleField),
    })
    return doc
  }

  return { afterChange: [afterChange], afterDelete: [afterDelete] }
}

export const auditLogin: CollectionAfterLoginHook = async ({ req, user }) => {
  if (shouldSkip(req)) return user
  await writeAuditLog(
    req,
    {
      action: 'login',
      resourceType: 'collection',
      resource: 'users',
      documentId: String(user.id),
      documentTitle: user.email,
    },
    { ...user, collection: 'users' },
  )
  return user
}

export const auditGlobal = (slug: string) => {
  const afterChange: GlobalAfterChangeHook = async ({ doc, previousDoc, req }) => {
    if (shouldSkip(req)) return doc
    const changedFields = diffFields(doc, previousDoc)
    if (!changedFields.length) return doc

    await writeAuditLog(req, {
      action: 'update',
      resourceType: 'global',
      resource: slug,
      changedFields,
    })
    return doc
  }

  return { afterChange: [afterChange] }
}
