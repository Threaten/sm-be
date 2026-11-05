'use client'

import { useRowLabel } from '@payloadcms/ui'

import { SOCIAL_PLATFORMS } from '@/fields/socialPlatforms'

/** Collapsed social link rows read "Instagram · @skillandmix" instead of "Social Link 01". */
export const SocialRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ platform?: string; label?: string; url?: string }>()
  const name = SOCIAL_PLATFORMS.find((option) => option.value === data?.platform)?.label ?? 'Link'
  const detail = data?.label || data?.url
  return <span>{detail ? `${name} · ${detail}` : `${name} ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`}</span>
}
