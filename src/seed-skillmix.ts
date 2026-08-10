import { getPayload } from 'payload'
import config from '@payload-config'
import {
  courses as frontendCourses,
  galleryImages,
  staff as frontendStaff,
} from '../../fe/lib/data'

const courseTones = ['var(--pink)', 'var(--blue)', 'var(--lime)', 'var(--orange)']
const courses = frontendCourses.map((course, index) => ({
  ...course,
  tone: courseTones[index % courseTones.length],
}))

const staffDetails = {
  'nguyen-minh-anh': {
    shortName: 'Minh Anh',
    quote: 'The recipe is only the beginning. Your attention is the real ingredient.',
    specialties: ['Palate training', 'Classic structure', 'Ice & dilution', 'Menu direction'],
    teachingFocus: 'Helping students taste precisely, speak clearly, and trust what they notice.',
    favoritePour: 'A very cold Bamboo',
  },
  'tran-quoc-bao': {
    shortName: 'Quốc Bảo',
    quote: 'Speed is not rushing. Speed is removing every movement that does not help.',
    specialties: ['Station systems', 'High-volume service', 'Batching', 'Team training'],
    teachingFocus: 'Building calm, clean habits that survive the busiest night of the week.',
    favoritePour: "Tommy's Margarita",
  },
  'le-ngoc-mai': {
    shortName: 'Ngọc Mai',
    quote: 'Interesting is easy. Delicious is the discipline.',
    specialties: ['Fermentation', 'Acid adjustment', 'Infusions', 'Flavor mapping'],
    teachingFocus: 'Making modern preparation understandable, repeatable, and useful in service.',
    favoritePour: 'A saison with a side of amaro',
  },
  'pham-gia-huy': {
    shortName: 'Gia Huy',
    quote: 'Hospitality starts one second before someone has to ask.',
    specialties: ['Guest reading', 'Service language', 'Conflict recovery', 'Team culture'],
    teachingFocus: 'Turning technical service into a generous, human experience.',
    favoritePour: 'Half a Martini, then another',
  },
} as const

const staff = frontendStaff.map((person) => {
  const details = staffDetails[person.slug as keyof typeof staffDetails]
  return {
    ...person,
    ...details,
    bio: [
      `${person.name} brings deep practical experience and an exacting eye to every class at Skill & Mix.`,
      `${person.note} Their teaching turns professional habits into clear, repeatable movements.`,
    ],
    achievements: [],
  }
})

const galleryCaptions = [
  'After class',
  'Acid test',
  'Service drill',
  'Good ice',
  'Final round',
  'Tuesday, 8:42',
  'Research',
  'First shake',
  'Clean station',
]

const services = [
  {
    number: '01', title: 'Private Classes', label: '8 to 24 guests',
    copy: 'A hands-on class built around your group. Everyone leaves knowing what they made and why it worked.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=88',
  },
  {
    number: '02', title: 'Menu Development', label: 'For bars & restaurants',
    copy: 'Concept, costing, prep systems, training, and launch. Menus that sound like you and work on a real Friday night.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=88',
  },
  {
    number: '03', title: 'Bar Team Training', label: 'On site or at Skill & Mix',
    copy: 'Technique, station systems, hospitality language, and drills built around your actual operation.',
    image: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=1200&q=88',
  },
]

const siteSettings = {
  navigation: [
    { label: 'About', href: '/about' },
    { label: 'Staffs', href: '/staffs' },
    { label: 'Services', href: '/services' },
    { label: 'Courses', href: '/courses' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: '/contact-us' },
  ],
  footer: {
    tagline: "Don't overthink it",
    address: '643 Nguyen Kiem Street\nDuc Nhuan Ward, Ho Chi Minh City',
    email: 'hello@skillandmix.com',
    phone: '+84 28 3822 0148',
  },
  theme: {
    background: 'var(--paper)',
    foreground: 'var(--ink)',
    accent: 'var(--accent)',
    cobalt: 'var(--cobalt)',
    acid: 'var(--acid)',
  },
}

const siteContent = {
  homeHero: {
    kickerLeft: 'Ho Chi Minh City / Since 2026',
    kickerRight: 'Classes now mixing',
    titleLineOne: 'LEARN TO',
    titleWord: 'MIX',
    titleEmphasis: 'better',
    titleLineThree: 'DRINKS.',
    summary:
      'Cocktail classes for curious beginners, working bartenders, and anyone who wants sharper hands behind the bar.',
    buttonLabel: 'Find your course',
    imageLeft:
      'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=1000&q=88',
    imageRight:
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=88',
    burstTop: 'Sip',
    burstBottom: 'happens',
    noteLineOne: 'Serious technique.',
    noteLineTwo: 'No serious faces.',
  },
  homeManifesto: {
    eyebrow: "What we're about",
    title: 'Cocktails are a craft, not a secret club.',
    copy: 'We teach the why behind every move, then give you enough room to make the drink your own. Palate first. Ego last.',
    image:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1400&q=88',
    stampTop: 'NO BAD',
    stampBottom: 'QUESTIONS',
  },
  homeQuote: {
    quote: "We don't teach you to follow recipes. We teach you to notice things.",
    author: 'Nguyễn Minh Anh',
    role: 'Founder, head of taste',
  },
  story: {
    eyebrow: 'One tiny bar. One big idea.',
    title: 'It started with six stools and a Tuesday night class.',
    copy: "In 2026, Minh Anh pushed the bottles aside after service and invited a few curious regulars behind the bar. They asked better questions than most training manuals. Skill & Mix grew from there.",
    imageOne:
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1400&q=88',
    imageOneAlt: 'The warmly lit bar where Skill & Mix began',
    imageOneCaption: 'Our first classroom, 2026',
    imageTwo:
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1000&q=88',
    imageTwoAlt: 'Cocktail ingredients and glassware on a work bench',
    stampTop: 'Est. 2026',
    stampBottom: 'fresh pour',
  },
  aboutValues: [
    {
      number: '01',
      title: 'Taste before theory',
      copy: 'Your palate is the tool. We train it before we ask you to memorize anything.',
    },
    {
      number: '02',
      title: 'Clean is fast',
      copy: 'Good systems make speed feel calm. Every class builds habits that survive a busy shift.',
    },
    {
      number: '03',
      title: 'Hospitality wins',
      copy: 'A technically perfect drink can still be a bad experience. People come first.',
    },
    {
      number: '04',
      title: 'Stay curious',
      copy: 'The minute you know everything is the minute your drinks get boring.',
    },
  ],
  contactDetails: [
    {
      number: '01',
      title: 'Come by',
      href: 'https://www.google.com/maps/search/?api=1&query=643+Nguyen+Kiem+Street+Duc+Nhuan+Ward+Ho+Chi+Minh+City',
      linkText: 'Open maps ↗',
      copy: '643 Nguyen Kiem Street\nDuc Nhuan Ward, Ho Chi Minh City',
    },
    {
      number: '02',
      title: 'Write us',
      href: 'mailto:hello@skillandmix.com',
      linkText: 'hello@skillandmix.com',
      copy: 'We answer within two working days. Usually faster.',
    },
    {
      number: '03',
      title: 'Call',
      href: 'tel:+842838220148',
      linkText: '+84 28 3822 0148',
      copy: 'Monday to Friday\n10:00 to 18:00',
    },
  ],
  servicesBanner: {
    eyebrow: 'Need something stranger?',
    title: 'We like a brief with a little bite.',
    email: 'hello@skillandmix.com',
  },
  gallerySocial: {
    copy: 'More spills, drills, and questionable garnishes:',
    handle: '@skillandmix ↗',
    href: 'https://instagram.com',
  },
}

async function upsertCourse(payload: Awaited<ReturnType<typeof getPayload>>, course: (typeof courses)[number]) {
  const existing = await payload.find({
    collection: 'courses',
    where: { slug: { equals: course.slug } },
    limit: 1,
    overrideAccess: true,
  })

  const data = {
    ...course,
    syllabus: course.syllabus.map((item) => ({ item })),
  }

  if (existing.docs[0]) {
    await payload.update({
      collection: 'courses',
      id: existing.docs[0].id,
      data,
      overrideAccess: true,
    })
    return
  }

  await payload.create({ collection: 'courses', data, overrideAccess: true })
}

async function upsertStaff(payload: Awaited<ReturnType<typeof getPayload>>, person: (typeof staff)[number]) {
  const existing = await payload.find({
    collection: 'staff',
    where: { slug: { equals: person.slug } },
    limit: 1,
    overrideAccess: true,
  })

  const data = {
    ...person,
    bio: person.bio.map((paragraph) => ({ paragraph })),
    specialties: person.specialties.map((item) => ({ item })),
  }

  if (existing.docs[0]) {
    await payload.update({
      collection: 'staff',
      id: existing.docs[0].id,
      data,
      overrideAccess: true,
    })
    return
  }

  await payload.create({ collection: 'staff', data, overrideAccess: true })
}

async function upsertService(payload: Awaited<ReturnType<typeof getPayload>>, service: (typeof services)[number]) {
  const existing = await payload.find({
    collection: 'services',
    where: { number: { equals: service.number } },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs[0]) {
    await payload.update({
      collection: 'services',
      id: existing.docs[0].id,
      data: service,
      overrideAccess: true,
    })
    return
  }

  await payload.create({ collection: 'services', data: service, overrideAccess: true })
}

async function upsertGalleryItem(
  payload: Awaited<ReturnType<typeof getPayload>>,
  item: { image: string; caption: string },
) {
  const existing = await payload.find({
    collection: 'gallery',
    where: { caption: { equals: item.caption } },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs[0]) {
    await payload.update({
      collection: 'gallery',
      id: existing.docs[0].id,
      data: item,
      overrideAccess: true,
    })
    return
  }

  await payload.create({ collection: 'gallery', data: item, overrideAccess: true })
}

async function seedSkillMixData() {
  const payload = await getPayload({ config })

  payload.logger.info('Seeding Skill & Mix collections and globals...')

  for (const course of courses) {
    await upsertCourse(payload, course)
  }

  for (const person of staff) {
    await upsertStaff(payload, person)
  }

  for (const service of services) {
    await upsertService(payload, service)
  }

  for (const [index, image] of galleryImages.entries()) {
    await upsertGalleryItem(payload, { image, caption: galleryCaptions[index] })
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: siteSettings,
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'site-content',
    data: siteContent,
    overrideAccess: true,
  })

  payload.logger.info('Skill & Mix seed complete.')
}

await seedSkillMixData()
