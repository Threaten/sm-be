/**
 * Writes the course facts from the Website Brief sheet ("KHOÁ HỌC – COURSES
 * PAGE", kept in src/seed/content.ts) onto existing courses, matched by slug.
 * Only the fields the sheet provides are written; prices, images, schedule and
 * everything else stay as they are. Changes are recorded in the audit log.
 *
 *   npm run update:courses     (after npm run migrate:v2)
 */
import { getPayload } from 'payload'
import config from '@payload-config'

import { courses } from './seed/content'

type SheetField = 'level' | 'duration' | 'classSize' | 'syllabus'

/** Which facts each course row in the sheet actually gives. */
const FROM_SHEET: Record<string, SheetField[]> = {
  'bartender-co-ban': ['level', 'duration', 'classSize', 'syllabus'],
  'bartender-nang-cao': ['level', 'duration', 'syllabus'],
  'flair-bartending': ['level', 'duration', 'syllabus'],
  'bar-skill': ['level', 'duration', 'syllabus'],
  'mot-kem-mot': ['level', 'syllabus'],
}

async function updateCourses() {
  const payload = await getPayload({ config })
  const log = (message: string) => payload.logger.info(`[update:courses] ${message}`)

  const legacy = await payload.db.connection.db!.collection('globals').findOne({ globalType: 'site-content' })
  if (legacy) {
    payload.logger.error('[update:courses] This database still has the old schema. Run `npm run migrate:v2` first.')
    process.exit(1)
  }

  for (const course of courses) {
    const fields = FROM_SHEET[course.slug]
    if (!fields) continue

    const { docs } = await payload.find({
      collection: 'courses',
      where: { slug: { equals: course.slug } },
      limit: 1,
      depth: 0,
    })
    if (!docs[0]) {
      log(`skipped ${course.slug}: no course with this slug`)
      continue
    }

    const data = Object.fromEntries(fields.map((field) => [field, course[field]]))
    await payload.update({ collection: 'courses', id: docs[0].id, data })
    log(`updated ${course.slug}: ${fields.join(', ')}`)
  }

  process.exit(0)
}

await updateCourses()
