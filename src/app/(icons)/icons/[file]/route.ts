import { APPLE_ICON_SIZE, getIconSource, ICON_SIZES, iconHeaders, renderIcon } from '@/utilities/icons'

/** `/icons/icon-{size}.png` for each advertised size, and `/icons/apple-touch-icon.png`. */
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params
  const match = /^icon-(\d+)\.png$/.exec(file)
  const size = file === 'apple-touch-icon.png' ? APPLE_ICON_SIZE : Number(match?.[1])
  if (size !== APPLE_ICON_SIZE && !ICON_SIZES.includes(size as (typeof ICON_SIZES)[number])) {
    return new Response(null, { status: 404 })
  }

  const png = await renderIcon(await getIconSource(), size, size === APPLE_ICON_SIZE)
  return new Response(new Uint8Array(png), { headers: iconHeaders('image/png') })
}
