/**
 * One-off migration from the old schema (one big `site-content` global,
 * hand-typed numbers, per-course alt text...) to the current one.
 *
 *   npm run migrate:v2
 *
 * Back up the database first (mongodump). The script is idempotent: once
 * the old `site-content` global is gone it only re-applies safe clean-ups.
 */
import { getPayload, type CollectionSlug, type GlobalSlug } from 'payload'
import config from '@payload-config'
import { Types } from 'mongoose'

import * as fallback from './seed/content'

type Doc = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

const context = { skipAudit: true }
const lines = (...parts: (string | undefined)[]) => parts.filter(Boolean).join('\n')
const stripArrow = (value?: string) => value?.replace(/\s*↗\s*$/, '')
const idOf = (value: unknown) =>
  value && typeof value === 'object' && '_id' in value ? String((value as Doc)._id) : value ? String(value) : undefined

/** The site is black, white and red only: old blue tones become black, everything else red. */
const ACCENTS: Record<string, 'red' | 'black'> = {
  'var(--cobalt)': 'black',
  'var(--blue)': 'black',
}
const toAccent = (old?: string) => (old && ACCENTS[old]) ?? 'red'

const intro = (intros: Doc[] | undefined, page: string, base: Doc) => {
  const old = intros?.find((item) => item.page === page)
  return old
    ? { eyebrow: old.eyebrow, title: old.title, copy: old.intro, accent: old.accent === 'cobalt' ? 'black' : 'red' }
    : base
}

async function migrate() {
  const payload = await getPayload({ config })
  const db = payload.db.connection.db!
  const log = (message: string) => payload.logger.info(`[migrate:v2] ${message}`)

  const globalsCollection = db.collection('globals')
  const oldContent = (await globalsCollection.findOne({ globalType: 'site-content' })) as Doc | null
  const oldSettings = ((await globalsCollection.findOne({ globalType: 'site-settings' })) ?? {}) as Doc

  /* Users: everyone who could log in before had full access. */
  const users = await db.collection('users').updateMany({ role: { $exists: false } }, { $set: { role: 'super-admin' } })
  log(`users given the super-admin role: ${users.modifiedCount}`)

  /* Courses */
  for (const course of await db.collection('courses').find().sort({ createdAt: 1 }).toArray()) {
    const set: Doc = {}
    if (!['red', 'black'].includes(course.accent)) set.accent = toAccent(course.tone)
    if (Array.isArray(course.syllabus) && course.syllabus.some((item: Doc) => 'item' in item)) {
      set.syllabus = course.syllabus.map((item: Doc) => ({
        id: item.id,
        title: item.title ?? item.item,
        ...(item.description ? { description: item.description } : {}),
      }))
    }
    if (course.imageAlt && course.image) {
      await db.collection('media').updateOne({ _id: course.image }, { $set: { alt: course.imageAlt } })
    }
    await db
      .collection('courses')
      .updateOne({ _id: course._id }, { $set: set, $unset: { index: '', imageAlt: '', tone: '' } })
  }
  log('courses: accent, syllabus titles, image alt text moved to Media')

  await db.collection('services').updateMany({}, { $unset: { number: '' } })

  /* Give existing documents a drag-and-drop order, keeping today's order. */
  const ordered: [CollectionSlug, string][] = [
    ['courses', 'courses'],
    ['staff', 'staffs'],
    ['services', 'services'],
    ['gallery', 'galleries'],
  ]
  for (const [slug, raw] of ordered) {
    for (const doc of await db.collection(raw).find({ _order: { $exists: false } }).sort({ createdAt: 1 }).toArray()) {
      await payload.update({ collection: slug, id: String(doc._id), data: {}, context })
    }
  }
  log('drag-and-drop order assigned')

  /* Contact submissions: course slugs → real relationships. */
  const courseIds = new Map(
    (await db.collection('courses').find({}, { projection: { slug: 1 } }).toArray()).map((doc) => [doc.slug, doc._id]),
  )
  for (const submission of await db.collection('contact-submissions').find({ 'courses.slug': { $exists: true } }).toArray()) {
    const ids = (submission.courses as Doc[]).map((item) => courseIds.get(item.slug)).filter(Boolean)
    await db.collection('contact-submissions').updateOne({ _id: submission._id }, { $set: { courses: ids } })
  }
  log('contact submissions linked to courses')

  if (!oldContent) {
    log('old site-content global not found; content already migrated.')
    process.exit(0)
  }

  /* Testimonials: global array → collection. */
  if ((await payload.count({ collection: 'testimonials' })).totalDocs === 0) {
    for (const item of (oldContent.homeTestimonials ?? []) as Doc[]) {
      await payload.create({
        collection: 'testimonials',
        data: { quote: item.quote, author: item.author, role: item.role },
        context,
      })
    }
  }
  log('testimonials moved to their own collection')

  const c = oldContent
  const firstStaff = await db.collection('staffs').findOne({}, { sort: { createdAt: 1 } })
  const contactPanels = (c.contactDetails ?? []) as Doc[]
  const [visit, email, phone] = contactPanels

  const popupSlides: Doc[] = []
  if (c.entryPopup?.title) {
    popupSlides.push({
      active: c.entryPopup.promotionActive ?? true,
      displayMode: 'image',
      eyebrow: c.entryPopup.eyebrow,
      title: c.entryPopup.title,
      copy: c.entryPopup.copy,
      image: idOf(c.entryPopup.image),
      ctaLabel: c.entryPopup.ctaLabel,
      ctaHref: c.entryPopup.ctaHref,
    })
  }
  for (const slide of (c.entryPopup?.additionalSlides ?? []) as Doc[]) {
    if (slide.imageAlt && slide.image) {
      await db.collection('media').updateOne({ _id: new Types.ObjectId(idOf(slide.image)) }, { $set: { alt: slide.imageAlt } })
    }
    popupSlides.push({
      active: slide.active ?? true,
      displayMode: slide.displayMode ?? 'image',
      eyebrow: slide.eyebrow,
      title: slide.title || 'Skill & Mix',
      copy: slide.copy,
      image: idOf(slide.image),
      ctaLabel: slide.ctaLabel,
      ctaHref: slide.ctaHref,
      videoUrl: slide.videoUrl,
    })
  }

  const globals: Partial<Record<GlobalSlug, Doc>> = {
    'site-settings': {
      announcementBar: oldSettings.announcementBar ?? fallback.siteSettings.announcementBar,
      navigation: oldSettings.navigation?.length ? oldSettings.navigation : fallback.siteSettings.navigation,
      headerCta: fallback.siteSettings.headerCta,
      contact: {
        address: oldSettings.footer?.address ?? fallback.siteSettings.contact.address,
        mapUrl: visit?.href?.startsWith('http') ? visit.href : fallback.siteSettings.contact.mapUrl,
        email: oldSettings.footer?.email ?? fallback.siteSettings.contact.email,
        phone: oldSettings.footer?.phone ?? fallback.siteSettings.contact.phone,
        hours: phone?.copy ?? fallback.siteSettings.contact.hours,
      },
      social: {
        handle: stripArrow(c.gallerySocial?.handle) ?? fallback.siteSettings.social.handle,
        url: c.gallerySocial?.href ?? fallback.siteSettings.social.url,
      },
      footer: { ...fallback.siteSettings.footer, ...oldSettings.footer },
      seo: { ...fallback.siteSettings.seo, shareImage: idOf(c.homeHero?.imageLeft) },
      theme: fallback.siteSettings.theme,
    },
    'home-page': {
      hero: {
        ...c.homeHero,
        imageLeft: idOf(c.homeHero?.imageLeft),
        imageRight: idOf(c.homeHero?.imageRight),
        burst: lines(c.homeHero?.burstTop, c.homeHero?.burstBottom),
        note: lines(c.homeHero?.noteLineOne, c.homeHero?.noteLineTwo),
      },
      marquee: c.marquees?.home,
      manifesto: {
        ...c.homeManifesto,
        image: idOf(c.homeManifesto?.image),
        stamp: lines(c.homeManifesto?.stampTop, c.homeManifesto?.stampBottom),
        linkLabel: fallback.homePage.manifesto.linkLabel,
      },
      featuredInstructor: {
        ...c.featuredInstructor,
        person: idOf(c.featuredInstructor?.person) ?? idOf(firstStaff?._id),
      },
      featuredCourses: c.featuredCourses,
      testimonials: fallback.homePage.testimonials,
    },
    'about-page': {
      intro: intro(c.pageIntros, 'about', fallback.aboutPage.intro),
      story: {
        ...c.story,
        imageOne: idOf(c.story?.imageOne),
        imageTwo: idOf(c.story?.imageTwo),
        stamp: lines(c.story?.stampTop, c.story?.stampBottom),
      },
      marquee: c.marquees?.about,
      values: {
        title: fallback.aboutPage.values.title,
        items: ((c.aboutValues ?? []) as Doc[]).map(({ title, copy }) => ({ title, copy })),
      },
    },
    'courses-page': {
      intro: intro(c.pageIntros, 'courses', fallback.coursesPage.intro),
      catalog: fallback.coursesPage.catalog,
      marquee: c.marquees?.courses,
      faq: c.courseFaq,
      help: c.courseHelp,
      detail: { ...fallback.coursesPage.detail, ...c.courseDetail },
    },
    'team-page': {
      intro: intro(c.pageIntros, 'staffs', fallback.teamPage.intro),
      cardLinkLabel: fallback.teamPage.cardLinkLabel,
      note: c.staffNote,
      profile: c.staffDetail,
    },
    'services-page': {
      intro: intro(c.pageIntros, 'services', fallback.servicesPage.intro),
      itemLinkLabel: fallback.servicesPage.itemLinkLabel,
      banner: { eyebrow: c.servicesBanner?.eyebrow, title: c.servicesBanner?.title },
    },
    'gallery-page': {
      intro: intro(c.pageIntros, 'gallery', fallback.galleryPage.intro),
      graffiti: fallback.galleryPage.graffiti,
      social: { copy: c.gallerySocial?.copy },
    },
    'contact-page': {
      intro: intro(c.pageIntros, 'contact', fallback.contactPage.intro),
      panels: {
        visitTitle: visit?.title,
        visitLinkLabel: stripArrow(visit?.linkText),
        emailTitle: email?.title,
        emailNote: email?.copy,
        phoneTitle: phone?.title,
      },
      form: fallback.contactPage.form,
    },
    'entry-popup': {
      enabled: c.entryPopup?.enabled ?? false,
      dismissLabel: c.entryPopup?.dismissLabel ?? fallback.entryPopup.dismissLabel,
      slides: popupSlides,
    },
  }

  for (const [slug, data] of Object.entries(globals)) {
    await payload.updateGlobal({ slug: slug as GlobalSlug, data: data!, context })
    log(`global ${slug} written`)
  }

  /* Drop everything the new schema no longer has. */
  await globalsCollection.updateOne(
    { globalType: 'site-settings' },
    {
      $unset: {
        'footer.address': '',
        'footer.email': '',
        'footer.phone': '',
        'footer.links': '',
        'theme.background': '',
        'theme.foreground': '',
        'theme.accent': '',
        'theme.cobalt': '',
        'theme.acid': '',
      },
    },
  )
  await globalsCollection.deleteOne({ globalType: 'site-content' })
  log('old site-content global removed. Done.')
  process.exit(0)
}

await migrate()
