import { pageGlobal, pageIntroField, text } from './shared'

export const NewsPage = pageGlobal('news-page', 'News page', [
  {
    type: 'tabs',
    tabs: [
      {
        label: 'Listing',
        fields: [
          pageIntroField,
          text('readMoreLabel', 'Button on each post in the list.'),
          text('emptyLabel', 'Shown while there are no published posts.'),
        ],
      },
      {
        label: 'Post detail',
        description: 'Labels shared by every individual post.',
        fields: [
          {
            name: 'detail',
            type: 'group',
            fields: [
              text('backLabel'),
              text('publishedLabel', 'Shown before the publish date.'),
              text('moreTitle', 'Heading above the other recent posts at the end of a post.'),
            ],
          },
        ],
      },
    ],
  },
])
