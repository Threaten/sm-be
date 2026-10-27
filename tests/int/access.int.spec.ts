import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import type { User } from '@/payload-types'

let payload: Payload
const users: Record<'superAdmin' | 'editor' | 'staff', User> = {} as never
const emails = {
  superAdmin: 'access-super@test.local',
  editor: 'access-editor@test.local',
  staff: 'access-staff@test.local',
}

const asUser = (user: User | null) => ({ user, overrideAccess: false as const })

describe('role permissions and audit log', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    await payload.delete({ collection: 'users', where: { email: { in: Object.values(emails) } } })
    users.superAdmin = await payload.create({
      collection: 'users',
      data: { email: emails.superAdmin, password: 'pw-123456', name: 'Super', role: 'super-admin' },
    })
    users.editor = await payload.create({
      collection: 'users',
      data: { email: emails.editor, password: 'pw-123456', name: 'Editor', role: 'editor' },
    })
    users.staff = await payload.create({
      collection: 'users',
      data: { email: emails.staff, password: 'pw-123456', name: 'Staff', role: 'staff' },
    })
  })

  afterAll(async () => {
    await payload.delete({ collection: 'users', where: { email: { in: Object.values(emails) } } })
  })

  it('lets anyone read public content', async () => {
    await expect(payload.find({ collection: 'courses', ...asUser(null) })).resolves.toBeDefined()
    await expect(payload.findGlobal({ slug: 'home-page', ...asUser(null) })).resolves.toBeDefined()
  })

  it('hides leads and audit logs from the public', async () => {
    await expect(payload.find({ collection: 'contact-submissions', ...asUser(null) })).rejects.toThrow()
    await expect(payload.find({ collection: 'audit-logs', ...asUser(null) })).rejects.toThrow()
  })

  it('applies the matrix to editor and staff', async () => {
    await expect(payload.find({ collection: 'contact-submissions', ...asUser(users.staff) })).resolves.toBeDefined()
    await expect(
      payload.updateGlobal({ slug: 'site-settings', data: {}, ...asUser(users.editor) }),
    ).rejects.toThrow()
    await expect(payload.find({ collection: 'audit-logs', ...asUser(users.editor) })).rejects.toThrow()
    await expect(payload.find({ collection: 'audit-logs', ...asUser(users.superAdmin) })).resolves.toBeDefined()
  })

  it('limits non-admins to their own account and their own role', async () => {
    const visible = await payload.find({ collection: 'users', ...asUser(users.staff) })
    expect(visible.docs.map((user) => user.email)).toEqual([emails.staff])

    const updated = await payload.update({
      collection: 'users',
      id: users.staff.id,
      data: { role: 'super-admin', name: 'Staff renamed' },
      ...asUser(users.staff),
    })
    expect(updated.role).toBe('staff')
    expect(updated.name).toBe('Staff renamed')
  })

  it('records who changed what', async () => {
    await payload.update({
      collection: 'users',
      id: users.editor.id,
      data: { name: 'Editor renamed' },
      user: users.superAdmin,
    })
    const { docs } = await payload.find({
      collection: 'audit-logs',
      where: { resource: { equals: 'users' }, documentId: { equals: String(users.editor.id) } },
      sort: '-createdAt',
      limit: 1,
    })
    expect(docs[0]).toMatchObject({ action: 'update', userEmail: emails.superAdmin, changedFields: ['name'] })
  })

  it('never lets anyone write audit logs through the API', async () => {
    await expect(
      payload.create({
        collection: 'audit-logs',
        data: { action: 'create', resourceType: 'collection', resource: 'x' },
        ...asUser(users.superAdmin),
      }),
    ).rejects.toThrow()
  })
})
