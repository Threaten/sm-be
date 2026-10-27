import type { GlobalConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

const pageIntroFields = [
  { name: 'index', type: 'text' as const, required: true },
  { name: 'eyebrow', type: 'text' as const, required: true },
  { name: 'title', type: 'text' as const, required: true },
  { name: 'intro', type: 'textarea' as const, required: true },
  { name: 'accent', type: 'select' as const, options: ['coral', 'cobalt'], defaultValue: 'coral' },
]

export const SiteContent: GlobalConfig = {
  slug: 'site-content',
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Shared',
          description: 'Page introductions and text shared across multiple pages.',
          fields: [
            {
              name: 'pageIntros',
              type: 'array',
              fields: [
                {
                  name: 'page',
                  type: 'select',
                  required: true,
                  unique: true,
                  options: ['about', 'staffs', 'services', 'courses', 'gallery', 'contact'],
                },
                ...pageIntroFields,
              ],
            },
            {
              name: 'marquees',
              type: 'group',
              fields: [
                { name: 'home', type: 'text', required: true },
                { name: 'about', type: 'text', required: true },
                { name: 'courses', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Courses',
          description: 'Content for the courses listing page.',
          fields: [
            {
              name: 'courseFaq',
              label: 'Course FAQ',
              type: 'group',
              fields: [
                { name: 'eyebrow', type: 'text', required: true },
                { name: 'title', type: 'text', required: true },
                {
                  name: 'items',
                  type: 'array',
                  minRows: 1,
                  fields: [
                    { name: 'question', type: 'text', required: true },
                    { name: 'answer', type: 'textarea', required: true },
                  ],
                },
              ],
            },
            {
              name: 'courseHelp',
              type: 'group',
              fields: [
                { name: 'eyebrow', type: 'text', required: true },
                { name: 'title', type: 'textarea', required: true },
                { name: 'linkLabel', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Team',
          description: 'Content for the team listing page.',
          fields: [
            {
              name: 'staffNote',
              type: 'group',
              fields: [
                { name: 'eyebrow', type: 'text', required: true },
                { name: 'title', type: 'text', required: true },
                { name: 'copy', type: 'textarea', required: true },
                { name: 'linkLabel', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Course details',
          description: 'Labels and supporting copy used on individual course pages.',
          fields: [
            {
              name: 'courseDetail',
              type: 'group',
              fields: [
                { name: 'backLabel', type: 'text', required: true },
                { name: 'durationLabel', type: 'text', required: true },
                { name: 'tuitionLabel', type: 'text', required: true },
                { name: 'classSizeLabel', type: 'text', required: true },
                { name: 'reserveLabel', type: 'text', required: true },
                { name: 'syllabusEyebrow', type: 'text', required: true },
                { name: 'syllabusTitle', type: 'text', required: true },
                { name: 'syllabusCopy', type: 'textarea', required: true },
                { name: 'firstLessonCopy', type: 'textarea', required: true },
                { name: 'lessonCopy', type: 'textarea', required: true },
                { name: 'intakeLabel', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Team profiles',
          description: 'Labels and supporting copy used on individual team member pages.',
          fields: [
            {
              name: 'staffDetail',
              type: 'group',
              fields: [
                { name: 'backLabel', type: 'text', required: true },
                { name: 'profileLabel', type: 'text', required: true },
                { name: 'stamp', type: 'textarea', required: true },
                { name: 'bioLabel', type: 'text', required: true },
                { name: 'achievementsEyebrow', type: 'text', required: true },
                { name: 'achievementsTitle', type: 'text', required: true },
                { name: 'practiceEyebrow', type: 'text', required: true },
                { name: 'practiceTitle', type: 'text', required: true },
                { name: 'offDutyLabel', type: 'text', required: true },
                { name: 'favoritePourLabel', type: 'text', required: true },
                { name: 'nextLabel', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Home',
          description: 'Hero, manifesto, and quote content shown on the home page.',
          fields: [
            {
              name: 'featuredInstructor',
              label: 'Featured Instructor',
              type: 'group',
              fields: [
                {
                  name: 'eyebrow',
                  type: 'text',
                  required: true,
                  defaultValue: 'Giảng viên nổi bật',
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  defaultValue: 'Học trực tiếp từ người trong nghề.',
                },
                {
                  name: 'person',
                  type: 'relationship',
                  relationTo: 'staff',
                  admin: { description: 'Choose the instructor shown on the homepage.' },
                },
                {
                  name: 'linkLabel',
                  type: 'text',
                  required: true,
                  defaultValue: 'Gặp giảng viên',
                },
              ],
            },
            {
              name: 'featuredCourses',
              type: 'group',
              fields: [
                { name: 'eyebrow', type: 'text', required: true },
                { name: 'title', type: 'text', required: true },
                { name: 'linkLabel', type: 'text', required: true },
              ],
            },
            {
              name: 'homeHero',
              type: 'group',
              fields: [
                { name: 'kickerLeft', type: 'text', required: true },
                { name: 'kickerRight', type: 'text', required: true },
                { name: 'titleLineOne', type: 'text', required: true },
                { name: 'titleWord', type: 'text', required: true },
                { name: 'titleEmphasis', type: 'text', required: true },
                { name: 'titleLineThree', type: 'text', required: true },
                { name: 'summary', type: 'textarea', required: true },
                { name: 'buttonLabel', type: 'text', required: true },
                { name: 'imageLeft', type: 'upload', relationTo: 'media', required: true },
                { name: 'imageRight', type: 'upload', relationTo: 'media', required: true },
                { name: 'burstTop', type: 'text', required: true },
                { name: 'burstBottom', type: 'text', required: true },
                { name: 'noteLineOne', type: 'text', required: true },
                { name: 'noteLineTwo', type: 'text', required: true },
              ],
            },
            {
              name: 'homeManifesto',
              type: 'group',
              fields: [
                { name: 'eyebrow', type: 'text', required: true },
                { name: 'title', type: 'text', required: true },
                { name: 'copy', type: 'textarea', required: true },
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'stampTop', type: 'text', required: true },
                { name: 'stampBottom', type: 'text', required: true },
              ],
            },
            {
              name: 'homeTestimonials',
              label: 'Testimonials',
              type: 'array',
              minRows: 10,
              maxRows: 10,
              admin: {
                description: 'Ten short testimonials displayed in the homepage carousel.',
                isSortable: false,
              },
              fields: [
                { name: 'quote', type: 'textarea', required: true },
                { name: 'author', type: 'text', required: true },
                { name: 'role', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Popup',
          description: 'Promotion or news popup shown once when a visitor enters the website.',
          fields: [
            {
              name: 'entryPopup',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { description: 'Turn the website entry popup on or off.' },
                },
                {
                  name: 'promotionActive',
                  label: 'Promotion slide active',
                  type: 'checkbox',
                  defaultValue: true,
                },
                { name: 'eyebrow', type: 'text', required: true },
                { name: 'title', type: 'text', required: true },
                { name: 'copy', type: 'textarea', required: true },
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'ctaLabel', type: 'text', required: true },
                { name: 'ctaHref', type: 'text', required: true },
                { name: 'dismissLabel', type: 'text', required: true },
                {
                  name: 'additionalSlides',
                  label: 'Additional carousel slides',
                  type: 'array',
                  admin: { description: 'Add, reorder, and activate as many additional slides as needed.' },
                  fields: [
                    {
                      name: 'active',
                      type: 'checkbox',
                      defaultValue: true,
                      admin: { description: 'Only active slides appear in the popup carousel.' },
                    },
                    {
                      name: 'displayMode',
                      label: 'Slide type',
                      type: 'select',
                      required: true,
                      defaultValue: 'image',
                      options: [
                        { label: 'Text & image', value: 'image' },
                        { label: 'Video', value: 'video' },
                      ],
                    },
                    {
                      name: 'eyebrow',
                      type: 'text',
                      admin: { condition: (_, siblingData) => siblingData?.displayMode === 'image' },
                    },
                    {
                      name: 'title',
                      type: 'text',
                      admin: { condition: (_, siblingData) => siblingData?.displayMode === 'image' },
                    },
                    {
                      name: 'copy',
                      type: 'textarea',
                      admin: { condition: (_, siblingData) => siblingData?.displayMode === 'image' },
                    },
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      admin: { condition: (_, siblingData) => siblingData?.displayMode === 'image' },
                    },
                    {
                      name: 'imageAlt',
                      label: 'Image description',
                      type: 'text',
                      admin: { condition: (_, siblingData) => siblingData?.displayMode === 'image' },
                    },
                    {
                      name: 'videoUrl',
                      label: 'Video URL',
                      type: 'text',
                      admin: {
                        condition: (_, siblingData) => siblingData?.displayMode === 'video',
                        description: 'Paste a public YouTube, TikTok, Facebook, or Instagram video URL.',
                      },
                    },
                    {
                      name: 'ctaLabel',
                      type: 'text',
                      admin: { condition: (_, siblingData) => siblingData?.displayMode === 'image' },
                    },
                    {
                      name: 'ctaHref',
                      type: 'text',
                      admin: { condition: (_, siblingData) => siblingData?.displayMode === 'image' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'About',
          description: 'Story and values shown on the about page.',
          fields: [
            {
              name: 'story',
              type: 'group',
              fields: [
                { name: 'eyebrow', type: 'text', required: true },
                { name: 'title', type: 'text', required: true },
                { name: 'copy', type: 'textarea', required: true },
                { name: 'imageOne', type: 'upload', relationTo: 'media', required: true },
                { name: 'imageOneAlt', type: 'text', required: true },
                { name: 'imageOneCaption', type: 'text', required: true },
                { name: 'imageTwo', type: 'upload', relationTo: 'media', required: true },
                { name: 'imageTwoAlt', type: 'text', required: true },
                { name: 'stampTop', type: 'text', required: true },
                { name: 'stampBottom', type: 'text', required: true },
              ],
            },
            {
              name: 'aboutValues',
              type: 'array',
              fields: [
                { name: 'number', type: 'text', required: true },
                { name: 'title', type: 'text', required: true },
                { name: 'copy', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'Contact',
          description: 'Contact methods shown on the contact page.',
          fields: [
            {
              name: 'contactDetails',
              type: 'array',
              fields: [
                { name: 'number', type: 'text', required: true },
                { name: 'title', type: 'text', required: true },
                { name: 'href', type: 'text', required: true },
                { name: 'linkText', type: 'text', required: true },
                { name: 'copy', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'Services',
          description: 'Call-to-action content shown on the services page.',
          fields: [
            {
              name: 'servicesBanner',
              type: 'group',
              fields: [
                { name: 'eyebrow', type: 'text', required: true },
                { name: 'title', type: 'text', required: true },
                { name: 'email', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Gallery',
          description: 'Social link content shown on the gallery page.',
          fields: [
            {
              name: 'gallerySocial',
              type: 'group',
              fields: [
                { name: 'copy', type: 'text', required: true },
                { name: 'handle', type: 'text', required: true },
                { name: 'href', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
