/**
 * Seeds a fresh database with the content in src/seed/content.ts,
 * downloading every image into Media.
 *
 *   npm run seed:skillmix
 *
 * Safe to re-run: documents are matched by slug/title and updated in place.
 * Runs with `skipAudit` so seeding does not flood the audit log.
 */
import { getPayload, type CollectionSlug, type Where } from 'payload'
import config from '@payload-config'

import * as content from './seed/content'

type PayloadClient = Awaited<ReturnType<typeof getPayload>>
type Image = { url: string; alt: string }

const context = { skipAudit: true }

async function upload(payload: PayloadClient, image: Image, filename: string): Promise<string> {
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })
  if (existing.docs[0]) return String(existing.docs[0].id)

  const response = await fetch(image.url)
  if (!response.ok) throw new Error(`Could not download seed image: ${image.url}`)
  const data = Buffer.from(await response.arrayBuffer())
  const media = await payload.create({
    collection: 'media',
    data: { alt: image.alt },
    file: {
      data,
      mimetype: response.headers.get('content-type') || 'image/jpeg',
      name: filename,
      size: data.byteLength,
    },
    context,
  })
  return String(media.id)
}

async function upsert(
  payload: PayloadClient,
  collection: CollectionSlug,
  where: Where,
  data: Record<string, unknown>,
) {
  const existing = await payload.find({ collection, where, limit: 1, depth: 0 })
  const doc = existing.docs[0]
    ? await payload.update({ collection, id: existing.docs[0].id, data, context })
    : await payload.create({ collection, data, context })
  return String(doc.id)
}

/** Plain paragraphs as a Lexical rich-text value. */
const richText = (paragraphs: string[]) => ({
  root: {
    type: 'root',
    version: 1,
    direction: 'ltr',
    format: '',
    indent: 0,
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      version: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
      textFormat: 0,
      children: [{ type: 'text', version: 1, text, format: 0, detail: 0, mode: 'normal', style: '' }],
    })),
  },
})

async function seed() {
  const payload = await getPayload({ config })
  payload.logger.info('Seeding Skill & Mix content...')

  for (const course of content.courses) {
    await upsert(payload, 'courses', { slug: { equals: course.slug } }, {
      ...course,
      image: await upload(payload, course.image, `course-${course.slug}.jpg`),
    })
  }

  const staffIds: Record<string, string> = {}
  for (const person of content.staff) {
    staffIds[person.slug] = await upsert(payload, 'staff', { slug: { equals: person.slug } }, {
      ...person,
      image: await upload(payload, person.image, `staff-${person.slug}.jpg`),
      bio: person.bio.map((paragraph) => ({ paragraph })),
      specialties: person.specialties.map((item) => ({ item })),
    })
  }

  for (const [index, service] of content.services.entries()) {
    await upsert(payload, 'services', { title: { equals: service.title } }, {
      ...service,
      image: await upload(payload, service.image, `service-${index + 1}.jpg`),
    })
  }

  for (const [index, item] of content.gallery.entries()) {
    await upsert(payload, 'gallery', { caption: { equals: item.caption } }, {
      caption: item.caption,
      image: await upload(payload, item.image, `gallery-${index + 1}.jpg`),
    })
  }

  for (const testimonial of content.testimonials) {
    await upsert(payload, 'testimonials', { author: { equals: testimonial.author } }, testimonial)
  }

  for (const post of content.news) {
    const { body, ...fields } = post
    await upsert(payload, 'news', { slug: { equals: post.slug } }, {
      ...fields,
      _status: 'published',
      image: await upload(payload, post.image, `news-${post.slug}.jpg`),
      content: richText(body),
    })
  }

  const { siteSettings, homePage, aboutPage, entryPopup } = content
  const globals: Record<string, Record<string, unknown>> = {
    'site-settings': {
      ...siteSettings,
      seo: { ...siteSettings.seo, shareImage: await upload(payload, siteSettings.seo.shareImage, 'share.jpg') },
    },
    'home-page': {
      ...homePage,
      hero: {
        ...homePage.hero,
        imageLeft: await upload(payload, homePage.hero.imageLeft, 'home-hero-left.jpg'),
        imageRight: await upload(payload, homePage.hero.imageRight, 'home-hero-right.jpg'),
      },
      manifesto: {
        ...homePage.manifesto,
        image: await upload(payload, homePage.manifesto.image, 'home-manifesto.jpg'),
      },
      featuredInstructor: {
        ...homePage.featuredInstructor,
        person: staffIds[homePage.featuredInstructor.person as string],
      },
    },
    'about-page': {
      ...aboutPage,
      story: {
        ...aboutPage.story,
        imageOne: await upload(payload, aboutPage.story.imageOne, 'story-one.jpg'),
        imageTwo: await upload(payload, aboutPage.story.imageTwo, 'story-two.jpg'),
      },
    },
    'courses-page': content.coursesPage,
    'team-page': content.teamPage,
    'services-page': content.servicesPage,
    'news-page': content.newsPage,
    'gallery-page': content.galleryPage,
    'contact-page': content.contactPage,
    'entry-popup': {
      ...entryPopup,
      slides: await Promise.all(
        entryPopup.slides.map(async (slide, index) => ({
          ...slide,
          image: slide.image ? await upload(payload, slide.image, `popup-${index + 1}.jpg`) : undefined,
        })),
      ),
    },
  }

  for (const [slug, data] of Object.entries(globals)) {
    await payload.updateGlobal({ slug: slug as Parameters<PayloadClient['updateGlobal']>[0]['slug'], data, context })
  }

  payload.logger.info('Skill & Mix seed complete.')
}

await seed()
process.exit(0)
