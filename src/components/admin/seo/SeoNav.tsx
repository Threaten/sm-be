import type { ServerProps } from 'payload'

import React from 'react'

import { MobileNavScroll } from '../MobileNavScroll'
import { SeoNavGroup } from './SeoNavGroup'

/** Sidebar "SEO" group (after the other groups), for every logged-in admin user, plus the phone menu scroll helper. */
export function SeoNav({ user }: ServerProps) {
  return user ? (
    <>
      <SeoNavGroup />
      <MobileNavScroll />
    </>
  ) : null
}
