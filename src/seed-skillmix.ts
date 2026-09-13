import { getPayload } from 'payload'
import config from '@payload-config'
import {
  courses as frontendCourses,
  galleryImages,
  staff as frontendStaff,
} from '../../sm-fe/lib/data'

type PayloadClient = Awaited<ReturnType<typeof getPayload>>

async function uploadSeedImage(
  payload: PayloadClient,
  sourceURL: string,
  filename: string,
  alt: string,
): Promise<string> {
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs[0]) return String(existing.docs[0].id)

  const response = await fetch(sourceURL)
  if (!response.ok) throw new Error(`Could not download seed image: ${sourceURL}`)
  const data = Buffer.from(await response.arrayBuffer())
  const media = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data,
      mimetype: response.headers.get('content-type') || 'image/jpeg',
      name: filename,
      size: data.byteLength,
    },
    overrideAccess: true,
  })
  return String(media.id)
}

const courseTones = ['var(--pink)', 'var(--blue)', 'var(--lime)', 'var(--orange)']
const courses = frontendCourses.map((course, index) => ({
  ...course,
  classSize: course.classSize || '12 students',
  nextIntake: course.nextIntake || 'September 14',
  schedule: course.schedule || 'Tuesday evenings\n6:30 to 9:00',
  location: course.location || 'Ho Chi Minh City',
  imageAlt: course.imageAlt || `${course.title} class in progress`,
  imageCaption: course.imageCaption || 'Skill & Mix / Ho Chi Minh City',
  tone: courseTones[index % courseTones.length],
}))

const staff = frontendStaff

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
    number: '01',
    title: 'Private Classes',
    label: '8 to 24 guests',
    copy: 'A hands-on class built around your group. Everyone leaves knowing what they made and why it worked.',
    image:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=88',
  },
  {
    number: '02',
    title: 'Menu Development',
    label: 'For bars & restaurants',
    copy: 'Concept, costing, prep systems, training, and launch. Menus that sound like you and work on a real Friday night.',
    image:
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=88',
  },
  {
    number: '03',
    title: 'Bar Team Training',
    label: 'On site or at Skill & Mix',
    copy: 'Technique, station systems, hospitality language, and drills built around your actual operation.',
    image:
      'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=1200&q=88',
  },
]

const siteSettings = {
  announcementBar: {
    enabled: true,
    message: 'Đăng ký tư vấn miễn phí cùng Skill & Mix.',
    linkLabel: 'Đăng ký ngay',
    linkHref: '/contact-us',
  },
  navigation: [
    { label: 'Trang Chủ', href: '/' },
    { label: 'Khoá Học', href: '/courses' },
    { label: 'Giảng Viên', href: '/staffs' },
    { label: 'Thư Viện', href: '/gallery' },
    { label: 'Dịch Vụ', href: '/services' },
  ],
  footer: {
    tagline: 'Skill & Mix Academy',
    address: '643 Nguyen Kiem Street\nDuc Nhuan Ward, Ho Chi Minh City',
    email: 'hello@skillandmix.com',
    phone: '+84 28 3822 0148',
    headline: 'Sẵn Sàng Bắt Đầu Hành Trình Bartender?',
    ctaLabel: 'Đăng Ký Tư Vấn Ngay',
    addressLabel: 'Địa Chỉ',
    contactLabel: 'Liên Hệ',
    linksLabel: 'Khám Phá',
    copyright: '© 2026 Skill & Mix Academy.',
    links: [
      { label: 'Trang Chủ', href: '/' },
      { label: 'Khoá Học', href: '/courses' },
      { label: 'Giảng Viên', href: '/staffs' },
      { label: 'Thư Viện', href: '/gallery' },
      { label: 'Dịch Vụ', href: '/services' },
      { label: 'Liên Hệ', href: '/contact-us' },
    ],
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
  pageIntros: [
    {
      page: 'about' as const,
      index: '01',
      eyebrow: 'Inside Skill & Mix',
      title: 'A SCHOOL FOR THIRSTY MINDS.',
      intro:
        'We built the class we wished existed: practical, demanding, generous, and a little bit chaotic.',
      accent: 'coral' as const,
    },
    {
      page: 'staffs' as const,
      index: '03',
      eyebrow: 'Giảng viên',
      title: 'GẶP GỠ ĐỘI NGŨ SKILL & MIX',
      intro:
        'Đội ngũ giảng viên của Skill & Mix là những người đang trực tiếp làm việc và tích lũy kinh nghiệm trong ngành Beverage & Hospitality. Mỗi người mang đến những góc nhìn, chuyên môn và trải nghiệm thực tế riêng trong quá trình đào tạo.',
      accent: 'cobalt' as const,
    },
    {
      page: 'services' as const,
      index: '05',
      eyebrow: 'Beyond the classroom',
      title: 'WE BRING THE BAR TO THE BRIEF.',
      intro: 'Private workshops, sharper menus, stronger teams. Tell us what needs mixing.',
      accent: 'coral' as const,
    },
    {
      page: 'courses' as const,
      index: '02',
      eyebrow: 'Khóa học',
      title: 'KHÓA HỌC BARTENDER TẠI SKILL & MIX',
      intro:
        'Từ nền tảng cơ bản đến những kỹ năng chuyên sâu, các khóa học tại Skill & Mix được xây dựng theo từng mục tiêu và trình độ. Học viên được tiếp cận kiến thức, thực hành kỹ năng và từng bước phát triển năng lực phù hợp với định hướng của mình.',
      accent: 'coral' as const,
    },
    {
      page: 'gallery' as const,
      index: '04',
      eyebrow: 'Inside the lab',
      title: 'MESSY HANDS. CLEAN DRINKS.',
      intro:
        'Classes, experiments, guest shifts, bad ideas that became good ideas, and the occasional perfect lemon peel.',
      accent: 'cobalt' as const,
    },
    {
      page: 'contact' as const,
      index: '06',
      eyebrow: 'Say hello',
      title: 'QUESTIONS? GOOD.',
      intro:
        'Ask about a course, plan a private class, bring us a strange brief, or just come see the room.',
      accent: 'coral' as const,
    },
  ],
  marquees: {
    home: 'Học Thật / Làm Thật / Sẵn Sàng Đi Làm',
    about: 'Palate first / Ego last',
    courses: 'Small class / Big practice',
  },
  featuredCourses: {
    eyebrow: 'Khoá học nổi bật',
    title: 'Các Khoá Học Tại Skill & Mix',
    linkLabel: 'Xem Chi Tiết ↗',
  },
  featuredInstructor: {
    eyebrow: 'Giảng viên nổi bật',
    title: 'Học trực tiếp cùng đội ngũ Skill & Mix.',
    linkLabel: 'Gặp Grace',
  },
  courseHelp: {
    eyebrow: 'Câu hỏi thường gặp',
    title: 'Bạn chưa biết nên bắt đầu với khóa học nào?',
    linkLabel: 'Liên hệ để được tư vấn',
  },
  courseFaq: {
    eyebrow: 'FAQ',
    title: 'Câu Hỏi Thường Gặp',
    items: [
      {
        question: 'Tôi chưa biết gì về pha chế, có học được không?',
        answer:
          'Hoàn toàn có thể. Khóa học được xây dựng theo từng cấp độ, trong đó khóa Bartender Cơ Bản phù hợp với người mới bắt đầu.',
      },
      {
        question: 'Skill & Mix có hỗ trợ giới thiệu việc làm không?',
        answer:
          'Skill & Mix có hỗ trợ kết nối và giới thiệu cơ hội phù hợp cho học viên sau khi hoàn thành khóa học, tùy theo năng lực và nhu cầu tuyển dụng tại từng thời điểm.',
      },
      {
        question: 'Tôi có thể học thử trước khi đăng ký không?',
        answer:
          'Bạn có thể đăng ký tham quan hoặc tham gia buổi trải nghiệm theo lịch của Skill & Mix để tìm hiểu thêm về phương pháp học và môi trường đào tạo.',
      },
      {
        question: 'Lịch học có linh hoạt không?',
        answer:
          'Lịch học được sắp xếp theo từng khóa và từng lớp. Bạn có thể liên hệ để được tư vấn lịch học phù hợp với thời gian của mình.',
      },
      {
        question: 'Tôi nên bắt đầu với khóa học nào?',
        answer:
          'Đội ngũ Skill & Mix sẽ tư vấn dựa trên nền tảng hiện tại, mục tiêu học và định hướng của bạn để lựa chọn khóa học phù hợp.',
      },
    ],
  },
  staffNote: {
    eyebrow: 'Học cùng đội ngũ',
    title: 'Muốn Học Trực Tiếp Cùng Đội Ngũ Skill & Mix?',
    copy: 'Mỗi hành trình học cần một người dẫn dắt phù hợp. Tại Skill & Mix, đội ngũ giảng viên đồng hành cùng học viên từ những kỹ năng nền tảng đến quá trình rèn luyện và phát triển theo mục tiêu riêng.',
    linkLabel: 'Đăng Ký Tư Vấn',
  },
  courseDetail: {
    backLabel: 'Tất cả khóa học',
    durationLabel: 'Thời lượng',
    tuitionLabel: 'Học phí',
    classSizeLabel: 'Sĩ số',
    reserveLabel: 'Đăng ký tư vấn',
    syllabusEyebrow: 'Nội dung khóa học',
    syllabusTitle: 'Bạn sẽ học',
    syllabusCopy:
      'Mỗi khóa học kết hợp kiến thức nền tảng, hướng dẫn trực tiếp và thực hành liên tục.',
    firstLessonCopy: 'Nắm vững nền tảng, thực hành từng bước và nhận góp ý trực tiếp từ giảng viên.',
    lessonCopy: 'Hiểu kỹ thuật, luyện tập đúng thao tác và ứng dụng vào môi trường làm việc thực tế.',
    intakeLabel: 'Lịch khai giảng',
  },
  staffDetail: {
    backLabel: 'All staff',
    profileLabel: 'Profile',
    stamp: 'Skill\n& Mix\nfaculty',
    bioLabel: 'Behind the apron',
    achievementsEyebrow: 'Awards & achievements',
    achievementsTitle: 'A few things worth raising a glass to.',
    practiceEyebrow: 'At the workbench',
    practiceTitle: 'What {name} teaches.',
    offDutyLabel: 'Off duty',
    favoritePourLabel: 'Favorite pour:',
    nextLabel: 'Next behind the bar',
  },
  homeHero: {
    kickerLeft: 'Trung tâm đào tạo bartender tại TP.HCM',
    kickerRight: 'Kỹ năng thực chiến · Kết nối nghề nghiệp',
    titleLineOne: 'LEARN THE',
    titleWord: 'SKILL.',
    titleEmphasis: 'MASTER',
    titleLineThree: 'THE MIX.',
    summary: 'Trung tâm đào tạo bartender tại TP.HCM – kỹ năng thực chiến, kết nối nghề nghiệp.',
    buttonLabel: 'Khám Phá Khoá Học',
    imageLeft:
      'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=1000&q=88',
    imageRight:
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=88',
    burstTop: 'Học',
    burstBottom: 'thật',
    noteLineOne: 'Tư vấn miễn phí.',
    noteLineTwo: 'Học thử trước khi quyết định.',
  },
  homeManifesto: {
    eyebrow: 'Về Skill & Mix',
    title: 'Tại Sao Chọn Skill & Mix?',
    copy: 'Skill & Mix không chỉ dạy cách pha chế – chúng tôi đào tạo bartender tự tin, chuyên nghiệp và sẵn sàng đi làm ngay. Nắm vững lý thuyết và thực hành, học từ bartender đang làm việc thực tế, kết nối cơ hội việc làm và lịch học linh hoạt.',
    image:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1400&q=88',
    stampTop: 'HỌC',
    stampBottom: 'THẬT',
  },
  homeTestimonials: [
    {
      quote:
        'Học rất thực tế, làm nhiều hơn ngồi nghe. Sau khóa mình tự tin hơn hẳn khi đứng quầy.',
      author: 'Minh Tú',
      role: 'Học viên · 22 tuổi',
    },
    {
      quote:
        'Trước khi học mình không biết gì về bartending. Giờ mình có thể tự tin pha những món cơ bản.',
      author: 'Thảo Vy',
      role: 'Học viên · 20 tuổi',
    },
    {
      quote: 'Không khí lớp vui, thầy sửa từng động tác và không làm mình ngại khi hỏi.',
      author: 'Hoàng Nam',
      role: 'Học viên · 25 tuổi',
    },
    {
      quote: 'Mình thích nhất là được thực hành liên tục. Học xong có thể áp dụng ngay khi đi làm.',
      author: 'Bảo Anh',
      role: 'Khoá Bartender Cơ Bản',
    },
    {
      quote: 'Lớp nhỏ nên được hướng dẫn rất kỹ. Mỗi buổi đều thấy tay mình chắc hơn một chút.',
      author: 'Linh Chi',
      role: 'Học viên',
    },
    {
      quote: 'Kiến thức dễ hiểu, không quá học thuật. Mình đi học sau giờ làm vẫn theo kịp.',
      author: 'Quốc Huy',
      role: 'Học viên buổi tối',
    },
    {
      quote:
        'Từ cách cầm jigger đến setup quầy đều được chỉ rõ. Những chi tiết nhỏ thật sự hữu ích.',
      author: 'Gia Hân',
      role: 'Khoá Bar Skill',
    },
    {
      quote: 'Mình đăng ký vì tò mò, cuối cùng lại tìm được một công việc mà mình thật sự thích.',
      author: 'Tuấn Kiệt',
      role: 'Cựu học viên',
    },
    {
      quote: 'Giảng viên gần gũi và feedback thẳng. Sai ở đâu là được sửa ngay ở đó.',
      author: 'Ngọc Mai',
      role: 'Khoá Nâng Cao',
    },
    {
      quote:
        'Buổi nào cũng vui nhưng vẫn học được rất nhiều. Đây là khóa học mình sẽ giới thiệu cho bạn bè.',
      author: 'Đức Anh',
      role: 'Học viên',
    },
  ],
  entryPopup: {
    enabled: true,
    eyebrow: 'Ưu đãi hiện tại',
    title: 'Đăng Ký Sớm – Giá Tốt Hơn',
    copy: 'Đăng ký trước hạn để nhận mức giảm, đặt cọc giữ chỗ và ưu đãi theo số suất còn lại.',
    ctaLabel: 'Xem Ưu Đãi',
    ctaHref: '/contact-us',
    dismissLabel: 'Để sau',
  },
  story: {
    eyebrow: 'One tiny bar. One big idea.',
    title: 'It started with six stools and a Tuesday night class.',
    copy: 'In 2026, Minh Anh pushed the bottles aside after service and invited a few curious regulars behind the bar. They asked better questions than most training manuals. Skill & Mix grew from there.',
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

async function upsertCourse(
  payload: Awaited<ReturnType<typeof getPayload>>,
  course: (typeof courses)[number],
) {
  const existing = await payload.find({
    collection: 'courses',
    depth: 0,
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

async function upsertStaff(
  payload: Awaited<ReturnType<typeof getPayload>>,
  person: (typeof staff)[number],
) {
  const existing = await payload.find({
    collection: 'staff',
    depth: 0,
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

async function upsertService(
  payload: Awaited<ReturnType<typeof getPayload>>,
  service: (typeof services)[number],
) {
  const existing = await payload.find({
    collection: 'services',
    depth: 0,
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
    depth: 0,
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
    const image = await uploadSeedImage(
      payload,
      course.image,
      `course-${course.slug}.jpg`,
      course.imageAlt,
    )
    await upsertCourse(payload, { ...course, image })
  }

  for (const person of staff) {
    const image = await uploadSeedImage(
      payload,
      person.image,
      `staff-${person.slug}.jpg`,
      `${person.name}, ${person.role}`,
    )
    await upsertStaff(payload, { ...person, image })
  }

  for (const service of services) {
    const image = await uploadSeedImage(
      payload,
      service.image,
      `service-${service.number}.jpg`,
      service.title,
    )
    await upsertService(payload, { ...service, image })
  }

  for (const [index, image] of galleryImages.entries()) {
    const media = await uploadSeedImage(
      payload,
      image,
      `gallery-${index + 1}.jpg`,
      galleryCaptions[index],
    )
    await upsertGalleryItem(payload, { image: media, caption: galleryCaptions[index] })
  }

  const uploadedSiteContent = {
    ...siteContent,
    homeHero: {
      ...siteContent.homeHero,
      imageLeft: await uploadSeedImage(
        payload,
        siteContent.homeHero.imageLeft,
        'home-hero-left.jpg',
        'Bartending class in progress',
      ),
      imageRight: await uploadSeedImage(
        payload,
        siteContent.homeHero.imageRight,
        'home-hero-right.jpg',
        'Finished cocktail',
      ),
    },
    homeManifesto: {
      ...siteContent.homeManifesto,
      image: await uploadSeedImage(
        payload,
        siteContent.homeManifesto.image,
        'home-manifesto.jpg',
        'Friends raising cocktails around a table',
      ),
    },
    story: {
      ...siteContent.story,
      imageOne: await uploadSeedImage(
        payload,
        siteContent.story.imageOne,
        'story-one.jpg',
        siteContent.story.imageOneAlt,
      ),
      imageTwo: await uploadSeedImage(
        payload,
        siteContent.story.imageTwo,
        'story-two.jpg',
        siteContent.story.imageTwoAlt,
      ),
    },
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: siteSettings,
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'site-content',
    data: uploadedSiteContent,
    overrideAccess: true,
  })

  payload.logger.info('Skill & Mix seed complete.')
}

await seedSkillMixData()
