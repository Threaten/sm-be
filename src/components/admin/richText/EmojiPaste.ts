import { createServerFeature } from '@payloadcms/richtext-lexical'

/** Keeps pasted emoji as text instead of image uploads. See EmojiPaste.client.tsx. */
export const EmojiPasteFeature = createServerFeature({
  key: 'emojiPaste',
  feature: {
    ClientFeature: '@/components/admin/richText/EmojiPaste.client#EmojiPasteFeatureClient',
  },
})
