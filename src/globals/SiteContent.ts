import type { GlobalConfig } from 'payload'
import { anyone } from '@/access/anyone'

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
  },
  fields: [
    {
      name: 'pageIntros',
      type: 'array',
      fields: [
        { name: 'page', type: 'select', required: true, unique: true, options: ['about', 'staffs', 'services', 'courses', 'gallery', 'contact'] },
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
      name: 'courseHelp',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', required: true },
        { name: 'title', type: 'textarea', required: true },
        { name: 'linkLabel', type: 'text', required: true },
      ],
    },
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
      name: 'homeQuote',
      type: 'group',
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'author', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
      ],
    },
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
    {
      name: 'servicesBanner',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'email', type: 'text', required: true },
      ],
    },
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
}
