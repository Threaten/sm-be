import type { PayloadRequest } from 'payload'

/** Collections that never appear on the public site; saving them needs no refresh. */
const PRIVATE_RESOURCES = new Set(['users', 'roles', 'contact-submissions', 'audit-logs'])

/**
 * Tells the frontend to drop its cached CMS data so an edit shows up on the next
 * page load. Fire-and-forget: a slow or offline frontend never blocks a save, and
 * the frontend's own 60s cache window still applies if this call fails.
 */
export function revalidateFrontend(req: PayloadRequest, resource: string) {
  if (PRIVATE_RESOURCES.has(resource)) return

  const frontendURL = process.env.FRONTEND_URL?.replace(/\/$/, '')
  const secret = process.env.REVALIDATE_SECRET
  if (!frontendURL || !secret) return

  fetch(`${frontendURL}/api/revalidate`, {
    method: 'POST',
    headers: { 'x-revalidate-secret': secret },
    signal: AbortSignal.timeout(5000),
  })
    .then((response) => {
      if (!response.ok) {
        req.payload.logger.warn(`[revalidate] frontend answered ${response.status} after ${resource} change`)
      }
    })
    .catch((error) => {
      req.payload.logger.warn({ err: error }, `[revalidate] could not reach frontend after ${resource} change`)
    })
}
