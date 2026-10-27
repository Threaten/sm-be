import { marqueeField, pageGlobal, pageIntroField, text, textarea } from './shared'

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
