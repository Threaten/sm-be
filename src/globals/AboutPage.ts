import { image, marqueeField, pageGlobal, pageIntroField, text, textarea } from './shared'

export const AboutPage = pageGlobal('about-page', 'About page', [
  pageIntroField,
  {
    name: 'story',
    type: 'group',
    fields: [
      text('eyebrow'),
      text('title'),
      textarea('copy'),
      { type: 'row', fields: [image('imageOne'), image('imageTwo')] },
      text('imageOneCaption'),
      textarea('stamp', 'Star sticker text. One line per row.'),
    ],
  },
  marqueeField(),
  {
    name: 'values',
    type: 'group',
    fields: [
      text('title'),
      {
        name: 'items',
        type: 'array',
        minRows: 1,
        fields: [text('title'), textarea('copy')],
      },
    ],
  },
])
