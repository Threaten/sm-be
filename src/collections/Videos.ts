import type { CollectionConfig } from 'payload'

import { collectionAccess } from '@/access'
import { auditCollection } from '@/hooks/audit'

/**
 * Video files for rich text (News → Content → Upload). Kept apart from Media so
 * image fields (course photos, gallery...) can never be given a video by mistake.
 * Files are served with byte-range support, so players can seek and Safari can play them.
 */
export const Videos: CollectionConfig = {
  slug: 'videos',
  labels: { singular: 'Video', plural: 'Videos' },
  access: collectionAccess('videos'),
  admin: {
    group: 'Library',
    useAsTitle: 'title',
    defaultColumns: ['title', 'filename', 'filesize', 'updatedAt'],
    description:
      'MP4 (H.264) plays in every browser; export as MP4 when you can. Keep files small (under ~100 MB): visitors download what they watch.',
  },
  hooks: auditCollection('videos', 'title'),
  upload: {
    staticDir: 'media/videos',
    mimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
  },
  fields: [
    {
      name: 'title',
      label: 'Video description',
      type: 'text',
      required: true,
      admin: { description: 'What the video shows. Read out by screen readers and used as the player label.' },
    },
    {
      name: 'poster',
      label: 'Poster image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional. Shown before the video plays. Without it, browsers show the first frame.' },
    },
  ],
}
