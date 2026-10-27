import { pageGlobal, text } from './shared'

const isImageSlide = (_: unknown, siblingData: { displayMode?: string }) =>
  siblingData?.displayMode === 'image'

export const EntryPopup = pageGlobal(
  'entry-popup',
  'Entry popup',
  [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show the popup once when a visitor arrives.' },
    },
    text('dismissLabel', 'Text on the close-for-now button.'),
    {
      name: 'slides',
      type: 'array',
      admin: { description: 'Only active slides are shown, in this order.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'active', type: 'checkbox', defaultValue: true },
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
          ],
        },
        { name: 'eyebrow', type: 'text', admin: { condition: isImageSlide } },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: { description: 'For video slides this is read aloud to screen readers.' },
        },
        { name: 'copy', type: 'textarea', admin: { condition: isImageSlide } },
        { name: 'image', type: 'upload', relationTo: 'media', admin: { condition: isImageSlide } },
        {
          type: 'row',
          admin: { condition: isImageSlide },
          fields: [
            { name: 'ctaLabel', type: 'text' },
            { name: 'ctaHref', type: 'text' },
          ],
        },
        {
          name: 'videoUrl',
          label: 'Video URL',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.displayMode === 'video',
            description: 'Public YouTube, TikTok, Facebook or Instagram video link.',
          },
        },
      ],
    },
  ],
  'Site',
)
