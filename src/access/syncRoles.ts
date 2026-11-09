import type { Payload } from 'payload'

import { DEFAULT_ROLES } from './permissions'

const context = { skipAudit: true }

/**
 * Runs on every server start (payload.config.ts → onInit). Safe to repeat:
 *
 * 1. A database with no roles gets the starting Editor and Staff roles.
 * 2. Users still on the old hard-coded roles (`role: 'editor' | 'staff' | 'super-admin'`
 *    stored as text) are converted: super-admin → the Super admin checkbox,
 *    editor / staff → a link to the matching role. Unknown values get Staff,
 *    the lowest access, as before.
 */
export async function syncRoles(payload: Payload) {
  const roleIds = new Map<string, string>()

  const { totalDocs } = await payload.count({ collection: 'roles', overrideAccess: true })
  for (const preset of DEFAULT_ROLES) {
    const existing = await payload.find({
      collection: 'roles',
      where: { name: { equals: preset.name } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (existing.docs[0]) {
      roleIds.set(preset.legacy, String(existing.docs[0].id))
    } else if (totalDocs === 0) {
      const created = await payload.create({
        collection: 'roles',
        data: { name: preset.name, description: preset.description, permissions: preset.permissions },
        overrideAccess: true,
        context,
      })
      roleIds.set(preset.legacy, String(created.id))
      payload.logger.info(`[roles] created starting role "${preset.name}"`)
    }
  }

  // The old values are plain strings, which the relationship field cannot read, so convert them in Mongo directly.
  const users = payload.db.collections.users.collection
  const legacy = await users.find({ role: { $type: 'string' } }).toArray()
  if (!legacy.length) return

  const { Types } = await import('mongoose')
  for (const user of legacy) {
    const value = String(user.role)
    if (value === 'super-admin') {
      await users.updateOne({ _id: user._id }, { $set: { isSuperAdmin: true }, $unset: { role: '' } })
      continue
    }
    const roleId = roleIds.get(value) ?? roleIds.get('staff')
    await users.updateOne(
      { _id: user._id },
      roleId
        ? { $set: { role: new Types.ObjectId(roleId), isSuperAdmin: false } }
        : { $set: { isSuperAdmin: false }, $unset: { role: '' } },
    )
  }
  payload.logger.info(`[roles] converted ${legacy.length} user(s) from the old hard-coded roles`)
}
