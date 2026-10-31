import { image, pageGlobal, text, textarea } from './shared'

const link = [text('label'), text('href', 'Internal path such as /courses, or a full URL.')]

const colour = (name: string, label: string) => ({
  name,
  label,
  type: 'text' as const,
  required: true,
  admin: { description: 'Hex colour, for example #D7141A.' },
  validate: (value: unknown) =>
    typeof value === 'string' && /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)
      ? true
      : 'Use a hex colour such as #D7141A.',
})

const logoUpload = (name: string, label: string, description: string) => ({
  name,
  label,
  type: 'upload' as const,
  relationTo: 'media' as const,
  admin: { description },
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
              name: 'logo',
              type: 'group',
              admin: {
                description:
                  'Leave empty to show the built-in "skill&mix" wordmark. SVG or transparent PNG works best.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    logoUpload('image', 'Logo', 'Shown in the header on a light background.'),
                    logoUpload(
                      'imageOnDark',
                      'Logo on dark',
                      'Shown in the footer on a dark background. Leave empty to reuse the logo.',
                    ),
                  ],
                },
              ],
            },
            {
              name: 'seo',
              label: 'Search & sharing',
              type: 'group',
              admin: { description: 'Defaults for every page. Each page can override them in its own SEO section.' },
              fields: [
                text('siteName'),
                textarea('description', 'Default description for search results and link previews.'),
                image('shareImage'),
                {
                  name: 'siteUrl',
                  label: 'Website address',
                  type: 'text',
                  admin: {
                    description:
                      'Public address such as https://skillandmix.com. Used for canonical links, the sitemap and link previews.',
                  },
                  validate: (value: unknown) =>
                    !value || (typeof value === 'string' && /^https?:\/\/[^\s/]+/.test(value))
                      ? true
                      : 'Use a full address starting with https://',
                },
                {
                  name: 'keywords',
                  type: 'textarea',
                  admin: {
                    description: 'Separate with commas or new lines, for example: bartender, pha chế, TP.HCM.',
                  },
                },
                logoUpload('favicon', 'Browser icon', 'Tab and home-screen icon. Square image, at least 512 × 512 px.'),
                {
                  name: 'noIndex',
                  label: 'Hide the whole site from search engines',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { description: 'Turn on while the site is still in testing.' },
                },
              ],
            },
            {
              name: 'theme',
              type: 'group',
              admin: {
                description:
                  'The website uses only these three colours. Adjust the exact shades here.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    colour('white', 'White'),
                    colour('black', 'Black'),
                    colour('red', 'Red'),
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
