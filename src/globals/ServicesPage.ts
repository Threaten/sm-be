import { pageGlobal, pageIntroField, text } from './shared'

export const ServicesPage = pageGlobal('services-page', 'Services page', [
  pageIntroField,
  text('itemLinkLabel', 'Button under each service. Links to the contact page.'),
  {
    name: 'banner',
    type: 'group',
    admin: { description: 'The email shown here comes from Site settings → Contact.' },
    fields: [text('eyebrow'), text('title')],
  },
])
