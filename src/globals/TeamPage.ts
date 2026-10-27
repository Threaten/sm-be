import { pageGlobal, pageIntroField, text, textarea } from './shared'

export const TeamPage = pageGlobal('team-page', 'Team page', [
  {
    type: 'tabs',
    tabs: [
      {
        label: 'Listing',
        fields: [
          pageIntroField,
          text('cardLinkLabel', 'Shown before the first name on each card, e.g. "Meet".'),
          {
            name: 'note',
            type: 'group',
            fields: [text('eyebrow'), text('title'), textarea('copy'), text('linkLabel')],
          },
        ],
      },
      {
        label: 'Instructor profile',
        description: 'Labels shared by every instructor page.',
        fields: [
          {
            name: 'profile',
            type: 'group',
            fields: [
              { type: 'row', fields: [text('backLabel'), text('profileLabel')] },
              textarea('stamp', 'One line per row.'),
              text('bioLabel'),
              { type: 'row', fields: [text('achievementsEyebrow'), text('achievementsTitle')] },
              {
                type: 'row',
                fields: [
                  text('practiceEyebrow'),
                  text('practiceTitle', 'Use {name} for the instructor’s first name.'),
                ],
              },
              { type: 'row', fields: [text('offDutyLabel'), text('favoritePourLabel')] },
              text('nextLabel'),
            ],
          },
        ],
      },
    ],
  },
])
