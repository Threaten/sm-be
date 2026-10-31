import { readFile } from 'fs/promises'
import path from 'path'
import { getPayload } from 'payload'
import sharp from 'sharp'
import config from '@payload-config'

/** Same sizes as the website (sm-fe/lib/icons.ts). */
export const ICON_SIZES = [48, 96, 144, 192, 512] as const
export const APPLE_ICON_SIZE = 180
const ICO_SIZES = [16, 32, 48]

/** The browser icon from Site settings → Brand, or the built-in CMS mark when none is uploaded. */
export async function getIconSource(): Promise<Buffer> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
    const favicon = settings.seo?.favicon
    if (favicon && typeof favicon === 'object' && favicon.filename) {
      const staticDir = payload.collections.media.config.upload.staticDir ?? 'media'
      return await readFile(path.resolve(staticDir, favicon.filename))
    }
  } catch (error) {
    console.error('[icons] could not load the Site settings favicon', error)
  }
  return readFile(path.resolve(process.cwd(), 'public/favicon.svg'))
}

/** A square PNG. Non-square uploads are fitted, not cropped. `opaque` fills transparency (Apple icons). */
export async function renderIcon(source: Buffer, size: number, opaque = false) {
  let image = sharp(source, { density: 300 }).resize(size, size, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  if (opaque) image = image.flatten({ background: '#ffffff' })
  return image.png().toBuffer()
}

/** A real multi-size .ico (PNG-compressed entries). */
export async function renderIco(source: Buffer) {
  const images = await Promise.all(ICO_SIZES.map((size) => renderIcon(source, size)))
  const header = Buffer.alloc(6 + 16 * images.length)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)
  let offset = header.length
  images.forEach((image, index) => {
    const entry = 6 + 16 * index
    header.writeUInt8(ICO_SIZES[index], entry)
    header.writeUInt8(ICO_SIZES[index], entry + 1)
    header.writeUInt16LE(1, entry + 4)
    header.writeUInt16LE(32, entry + 6)
    header.writeUInt32LE(image.length, entry + 8)
    header.writeUInt32LE(offset, entry + 12)
    offset += image.length
  })
  return Buffer.concat([header, ...images])
}

export const iconHeaders = (type: string) => ({
  'Content-Type': type,
  'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
})
