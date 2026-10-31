'use client'

import { $insertDataTransferForRichText } from '@lexical/clipboard'
import type { PluginComponent } from '@payloadcms/richtext-lexical'
import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_HIGH,
  PASTE_COMMAND,
} from '@payloadcms/richtext-lexical/lexical'
import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext'
import { useEffect } from 'react'

// Only emoji characters, with at least one picture: digits and "#" also count as emoji components.
const EMOJI = /^(?=.*(?:\p{Extended_Pictographic}|\p{Regional_Indicator}|\u20E3))(?:\p{Extended_Pictographic}|\p{Emoji_Component}|\u200D|\u20E3|\uFE0F|\s)+$/u

/** Facebook, Messenger, Twitter and others draw emoji as <img> tags whose alt text is the emoji. */
const isEmojiImage = (img: HTMLImageElement) => {
  const alt = img.getAttribute('alt') ?? ''
  return (alt.length <= 16 && EMOJI.test(alt)) || /emoji/i.test(img.getAttribute('src') ?? '')
}

/**
 * Pasted emoji images become plain emoji text. Without this, the upload feature turns every
 * pasted <img> into a new Media upload.
 */
const EmojiPastePlugin: PluginComponent = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(
    () =>
      editor.registerCommand(
        PASTE_COMMAND,
        (event) => {
          const clipboard = event instanceof ClipboardEvent ? event.clipboardData : null
          const html = clipboard?.getData('text/html')
          if (!clipboard || !html || !/<img/i.test(html)) return false

          const dom = new DOMParser().parseFromString(html, 'text/html')
          const emoji = Array.from(dom.querySelectorAll('img')).filter(isEmojiImage)
          if (!emoji.length) return false
          for (const img of emoji) img.replaceWith(dom.createTextNode(img.getAttribute('alt') ?? ''))

          const cleaned = dom.body.innerHTML
          const data = {
            getData: (type: string) => (type === 'text/html' ? cleaned : clipboard.getData(type)),
          } as DataTransfer

          event.preventDefault()
          editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) $insertDataTransferForRichText(data, selection, editor)
          })
          return true
        },
        COMMAND_PRIORITY_HIGH,
      ),
    [editor],
  )

  return null
}

export const EmojiPasteFeatureClient = createClientFeature({
  plugins: [{ Component: EmojiPastePlugin, position: 'normal' }],
})
