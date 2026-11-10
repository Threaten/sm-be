import type { Payload } from 'payload'

import { DEFAULT_ROLES, GUEST_ROLE, PERMISSIONS_VERSION, upgradeToV2, upgradeToV3, type PermissionSet } from './permissions'

const context = { skipAudit: true }

/**
 * Runs on every server start (payload.config.ts → onInit). Safe to repeat:
 *
 * 1. Creates the built-in Guest role if missing, with exactly what the website needs.
 * 2. A database with no other roles gets the starting Editor and Staff roles.
 * 3. Roles saved by an older version are upgraded so nobody loses access (Read checkboxes, Videos).
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

  // Read the raw documents: Payload fills in defaults on read (missing checkboxes → false, missing
  // version → current), which would hide exactly what this upgrade needs to see.
  const rawRoles = payload.db.collections.roles.collection
  const outdated = await rawRoles
    .find({ $or: [{ permissionsVersion: { $exists: false } }, { permissionsVersion: { $lt: PERMISSIONS_VERSION } }] })
    .toArray()
  for (const role of outdated) {
    const version = typeof role.permissionsVersion === 'number' ? role.permissionsVersion : 1
    let permissions = (role.permissions ?? {}) as PermissionSet
    // v2: every resource got a Read checkbox (the Guest role was created at v2, so it never needs this).
    if (version < 2 && !role.isGuest) permissions = upgradeToV2(permissions)
    // v3: the Videos collection; it inherits the role's Media access.
    if (version < 3) permissions = upgradeToV3(permissions)
    await payload.update({
      collection: 'roles',
      id: String(role._id),
      data: { permissions, permissionsVersion: PERMISSIONS_VERSION },
      overrideAccess: true,
      context,
    })
    payload.logger.info(`[roles] upgraded "${role.name}" to permissions v${PERMISSIONS_VERSION}`)
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
