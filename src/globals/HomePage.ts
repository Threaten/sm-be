import { image, marqueeField, pageGlobal, text, textarea } from './shared'

export const HomePage = pageGlobal('home-page', 'Home page', [
  {
    type: 'tabs',
    tabs: [
      {
        label: 'Hero',
        fields: [
          {
            name: 'hero',
            type: 'group',
            fields: [
              {
                type: 'row',
                fields: [text('kickerLeft'), text('kickerRight')],
              },
              {
                type: 'collapsible',
                label: 'Headline (four parts)',
                fields: [
                  text('titleLineOne', 'First line, e.g. LEARN THE'),
                  text('titleWord', 'Second line, e.g. SKILL.'),
                  text('titleEmphasis', 'Highlighted word on the second line, e.g. MASTER'),
                  text('titleLineThree', 'Last line, e.g. THE MIX.'),
                ],
              },
              textarea('summary'),
              text('buttonLabel', 'Links to the courses page.'),
              { type: 'row', fields: [image('imageLeft'), image('imageRight')] },
              textarea('burst', 'Text inside the star sticker. One word per line.'),
              textarea('note', 'Handwritten note beside the photos. One line per row.'),
            ],
          },
          marqueeField(),
        ],
      },
      {
        label: 'Manifesto',
        fields: [
          {
            name: 'manifesto',
            type: 'group',
            fields: [
              text('eyebrow'),
              text('title'),
              textarea('copy'),
              image('image'),
              textarea('stamp', 'Round stamp on the photo. One word per line.'),
              text('linkLabel', 'Links to the about page.'),
            ],
          },
        ],
      },
      {
        label: 'Featured',
        fields: [
          {
            name: 'featuredInstructor',
            type: 'group',
            fields: [
              text('eyebrow'),
              text('title'),
              {
                name: 'person',
                type: 'relationship',
                relationTo: 'staff',
                required: true,
              },
              text('linkLabel'),
            ],
          },
          {
            name: 'featuredCourses',
            type: 'group',
            admin: { description: 'Lists every course, in the order set under Courses.' },
            fields: [text('eyebrow'), text('title'), text('linkLabel')],
          },
          {
            name: 'testimonials',
            type: 'group',
            admin: { description: 'Quotes are managed in the Testimonials collection.' },
            fields: [text('eyebrow')],
          },
        ],
      },
    ],
  },
])
