import { getIconSource, iconHeaders, renderIco } from '@/utilities/icons'

/** Admin tab icon as a 16/32/48px .ico, generated from Site settings → Brand → Browser icon. */
export async function GET() {
  const ico = await renderIco(await getIconSource())
  return new Response(new Uint8Array(ico), { headers: iconHeaders('image/x-icon') })
}
