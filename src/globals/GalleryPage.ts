import { pageGlobal, pageIntroField, text, textarea } from './shared'

export const GalleryPage = pageGlobal('gallery-page', 'Gallery page', [
  pageIntroField,
  textarea('graffiti', 'Large scribbled words over the photo wall. One line per row.'),
  {
    name: 'social',
    type: 'group',
    admin: { description: 'The handle and link come from Site settings → Social.' },
    fields: [text('copy')],
  },
])
