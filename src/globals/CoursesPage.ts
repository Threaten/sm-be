import type { Field } from 'payload'

import { marqueeField, pageGlobal, pageIntroField, text, textarea } from './shared'

// Added after launch: optional, so saving this page never fails on them; the website has defaults.
const optionalText = (name: string): Field => ({ ...text(name), required: false } as Field)
const optionalTextarea = (name: string): Field => ({ ...textarea(name), required: false } as Field)

export const CoursesPage = pageGlobal('courses-page', 'Courses page', [
  {
    type: 'tabs',
    tabs: [
      {
        label: 'Listing',
        fields: [
          pageIntroField,
          {
            name: 'catalog',
            type: 'group',
            fields: [
              text('viewCourseLabel'),
              text('stickerLabel', 'Small line under the duration on each course sticker.'),
            ],
          },
          marqueeField(),
          {
            name: 'faq',
            label: 'FAQ',
            type: 'group',
            fields: [
              text('eyebrow'),
              text('title'),
              {
                name: 'items',
                type: 'array',
                minRows: 1,
                fields: [text('question'), textarea('answer')],
              },
            ],
          },
          {
            name: 'help',
            type: 'group',
            fields: [text('eyebrow'), textarea('title'), text('linkLabel')],
          },
        ],
      },
      {
        label: 'Course detail',
        description: 'Labels shared by every individual course page.',
        fields: [
          {
            name: 'detail',
            type: 'group',
            fields: [
              text('backLabel'),
              {
                type: 'row',
                fields: [text('durationLabel'), text('tuitionLabel'), text('classSizeLabel')],
              },
              text('reserveLabel'),
              {
                type: 'collapsible',
                label: 'About this course',
                admin: { description: 'Shown when a course has a description. Leave empty to use the default.' },
                fields: [optionalText('aboutEyebrow'), optionalText('aboutTitle')],
              },
              {
                type: 'collapsible',
                label: "What you'll earn",
                admin: { description: 'Shown when a course has outcomes. Leave empty to use the default.' },
                fields: [optionalText('outcomesEyebrow'), optionalText('outcomesTitle'), optionalTextarea('outcomesCopy')],
              },
              text('syllabusEyebrow'),
              text('syllabusTitle'),
              textarea('syllabusCopy'),
              text('intakeLabel'),
            ],
          },
        ],
      },
    ],
  },
])
