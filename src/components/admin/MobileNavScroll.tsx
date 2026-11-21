'use client'

import { useNav } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const PHONE = '(max-width: 768px)'

/**
 * On phones the open sidebar replaces the page and scrolls with it (see custom.scss).
 * Jump to the top of the menu when it opens, and back to where the page was when it closes
 * without navigating.
 */
export function MobileNavScroll() {
  const { navOpen } = useNav()
  const pathname = usePathname()
  const saved = useRef<{ y: number; path: string } | null>(null)

  useEffect(() => {
    if (!window.matchMedia(PHONE).matches) return
    if (navOpen) {
      saved.current = { y: window.scrollY, path: pathname }
      window.scrollTo(0, 0)
    } else if (saved.current) {
      const { y, path } = saved.current
      saved.current = null
      if (path === pathname) requestAnimationFrame(() => window.scrollTo(0, y))
    }
    // pathname is read, not watched: only opening and closing the menu should scroll.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navOpen])

  return null
}
