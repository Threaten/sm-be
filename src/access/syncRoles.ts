import type { Payload } from 'payload'

import { DEFAULT_ROLES, GUEST_ROLE, PERMISSIONS_VERSION, upgradeToV2, type PermissionSet } from './permissions'

const context = { skipAudit: true }

/**
 * Runs on every server start (payload.config.ts → onInit). Safe to repeat:
 *
 * 1. Creates the built-in Guest role if missing, with exactly what the website needs.
 * 2. A database with no other roles gets the starting Editor and Staff roles.
 * 3. Roles saved before every resource had a Read checkbox are upgraded so nobody loses access.
 * 4. Users still on the old hard-coded roles (`role: 'editor' | 'staff' | 'super-admin'`
 *    stored as text) are converted: super-admin → the Super admin checkbox,
 *    editor / staff → a link to the matching role. Unknown values get Staff.
 */
export async function syncRoles(payload: Payload) {
  const guest = await payload.find({
    collection: 'roles',
    where: { isGuest: { equals: true } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (!guest.docs[0]) {
    await payload.create({
      collection: 'roles',
      data: { ...GUEST_ROLE, isGuest: true, permissionsVersion: PERMISSIONS_VERSION },
      overrideAccess: true,
      context,
    })
    payload.logger.info('[roles] created the built-in Guest role')
  }

  const roleIds = new Map<string, string>()
  const { totalDocs: staffRoles } = await payload.count({
    collection: 'roles',
    where: { isGuest: { not_equals: true } },
    overrideAccess: true,
  })
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
    } else if (staffRoles === 0) {
      const created = await payload.create({
        collection: 'roles',
        data: {
          name: preset.name,
          description: preset.description,
          permissions: preset.permissions,
          permissionsVersion: PERMISSIONS_VERSION,
        },
        overrideAccess: true,
        context,
      })
      roleIds.set(preset.legacy, String(created.id))
      payload.logger.info(`[roles] created starting role "${preset.name}"`)
    }
  }

  const outdated = await payload.find({
    collection: 'roles',
    where: {
      and: [
        { isGuest: { not_equals: true } },
        { or: [{ permissionsVersion: { exists: false } }, { permissionsVersion: { less_than: 2 } }] },
      ],
    },
    pagination: false,
    depth: 0,
    overrideAccess: true,
  })
  for (const role of outdated.docs) {
    await payload.update({
      collection: 'roles',
      id: role.id,
      data: {
        permissions: upgradeToV2(role.permissions as PermissionSet),
        permissionsVersion: PERMISSIONS_VERSION,
      },
      overrideAccess: true,
      context,
    })
    payload.logger.info(`[roles] upgraded "${role.name}": Read turned on for website content it could already see`)
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
