import type { GlobalConfig } from 'payload'
import { anyone } from '@/access/anyone'

export const SiteContent: GlobalConfig = {
  slug: 'site-content',
  access: {
    read: anyone,
  },
  fields: [
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
        { name: 'imageLeft', type: 'text', required: true },
        { name: 'imageRight', type: 'text', required: true },
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
        { name: 'image', type: 'text', required: true },
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
        { name: 'imageOne', type: 'text', required: true },
        { name: 'imageOneAlt', type: 'text', required: true },
        { name: 'imageOneCaption', type: 'text', required: true },
        { name: 'imageTwo', type: 'text', required: true },
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
