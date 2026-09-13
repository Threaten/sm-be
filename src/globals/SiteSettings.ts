import type { GlobalConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'announcementBar',
      label: 'Top Bar',
      type: 'group',
      admin: {
        description: 'Optional notification shown above the main navigation.',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Show or hide the top bar.' },
        },
        {
          name: 'message',
          type: 'text',
          required: true,
          defaultValue: 'Đăng ký tư vấn miễn phí cùng Skill & Mix.',
        },
        {
          name: 'linkLabel',
          type: 'text',
          admin: { description: 'Optional link text.' },
        },
        {
          name: 'linkHref',
          type: 'text',
          admin: { description: 'Optional internal path or full URL.' },
        },
      ],
    },
    {
      name: 'navigation',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      fields: [
        { name: 'tagline', type: 'text', required: true },
        { name: 'address', type: 'textarea', required: true },
        { name: 'email', type: 'text', required: true },
        { name: 'phone', type: 'text', required: true },
        { name: 'headline', type: 'text', required: true, defaultValue: 'Practice makes delicious.' },
        { name: 'ctaLabel', type: 'text', required: true, defaultValue: "Let's talk" },
        { name: 'addressLabel', type: 'text', required: true, defaultValue: 'Find us' },
        { name: 'contactLabel', type: 'text', required: true, defaultValue: 'Talk to us' },
        { name: 'linksLabel', type: 'text', required: true, defaultValue: 'Explore' },
        { name: 'copyright', type: 'text', required: true, defaultValue: '© 2026 Skill & Mix. Practice responsibly.' },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'theme',
      type: 'group',
      fields: [
        { name: 'background', type: 'text', required: true },
        { name: 'foreground', type: 'text', required: true },
        { name: 'accent', type: 'text', required: true },
        { name: 'cobalt', type: 'text', required: true },
        { name: 'acid', type: 'text', required: true },
      ],
    },
  ],
}
