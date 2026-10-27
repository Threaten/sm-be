import { image, pageGlobal, text, textarea } from './shared'

const link = [text('label'), text('href', 'Internal path such as /courses, or a full URL.')]

const colour = (name: string, label: string) => ({
  name,
  label,
  type: 'text' as const,
  required: true,
  admin: { description: 'Hex colour, for example #F25C3B.' },
  validate: (value: unknown) =>
    typeof value === 'string' && /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)
      ? true
      : 'Use a hex colour such as #F25C3B.',
})

export const SiteSettings = pageGlobal(
  'site-settings',
  'Site settings',
  [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Header',
          fields: [
            {
              name: 'announcementBar',
              label: 'Top bar',
              type: 'group',
              admin: { description: 'Optional notice shown above the main navigation.' },
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: false },
                text('message'),
                { name: 'linkLabel', type: 'text' },
                { name: 'linkHref', type: 'text' },
              ],
            },
            {
              name: 'navigation',
              type: 'array',
              minRows: 1,
              admin: { description: 'Main menu. The order also numbers each page’s introduction.' },
              fields: link,
            },
            {
              name: 'headerCta',
              label: 'Header button',
              type: 'group',
              fields: link,
            },
          ],
        },
        {
          label: 'Contact & social',
          description: 'One source of truth: used by the footer, Contact page and Services page.',
          fields: [
            {
              name: 'contact',
              type: 'group',
              fields: [
                textarea('address', 'One line per row.'),
                text('mapUrl', 'Google Maps link for the address.'),
                { name: 'email', type: 'email', required: true },
                text('phone'),
                textarea('hours', 'Opening hours. One line per row.'),
              ],
            },
            {
              name: 'social',
              type: 'group',
              fields: [text('handle', 'For example @skillandmix.'), text('url')],
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            {
              name: 'footer',
              type: 'group',
              admin: { description: 'Footer links reuse the main navigation.' },
              fields: [
                text('tagline'),
                text('headline'),
                text('ctaLabel'),
                text('addressLabel'),
                text('contactLabel'),
                text('linksLabel'),
                text('copyright'),
              ],
            },
          ],
        },
        {
          label: 'Brand',
          fields: [
            {
              name: 'seo',
              label: 'Search & sharing',
              type: 'group',
              fields: [
                text('siteName'),
                textarea('description', 'Default description for search results and link previews.'),
                image('shareImage'),
              ],
            },
            {
              name: 'theme',
              type: 'group',
              admin: { description: 'Brand colours used across the whole website.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    colour('paper', 'Paper (background)'),
                    colour('ink', 'Ink (text)'),
                    colour('coral', 'Coral'),
                    colour('cobalt', 'Cobalt'),
                    colour('acid', 'Acid'),
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  'Site',
)
