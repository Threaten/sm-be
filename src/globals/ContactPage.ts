import { pageGlobal, pageIntroField, text, textarea } from './shared'

export const ContactPage = pageGlobal('contact-page', 'Contact page', [
  pageIntroField,
  {
    name: 'panels',
    label: 'Contact panels',
    type: 'group',
    admin: {
      description: 'Address, email, phone and hours come from Site settings → Contact.',
    },
    fields: [
      { type: 'row', fields: [text('visitTitle'), text('visitLinkLabel')] },
      { type: 'row', fields: [text('emailTitle'), text('emailNote')] },
      text('phoneTitle'),
    ],
  },
  {
    name: 'form',
    type: 'group',
    fields: [
      { type: 'row', fields: [text('eyebrow'), text('title')] },
      {
        type: 'row',
        fields: [text('nameLabel'), text('phoneLabel'), text('coursesLabel')],
      },
      { type: 'row', fields: [text('messageLabel'), text('messagePlaceholder')] },
      text('submitLabel'),
      { type: 'row', fields: [text('successTitle'), textarea('successCopy')] },
    ],
  },
])
