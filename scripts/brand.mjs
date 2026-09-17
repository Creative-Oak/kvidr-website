/**
 * Derives every web-facing brand asset from the design sources in brand/source.
 *
 *   brand/source/logo.svg                        → public/brand/kvidr-mark.svg
 *                                                  public/favicon.svg
 *                                                  public/apple-touch-icon.png
 *   brand/source/kvidr-icon 3 Exports/*.png      → public/brand/app-icon-{light,dark}.{png,webp}
 *   (both)                                       → public/og.png
 *
 * The sources stay out of public/ on purpose: the Icon Composer bundles and
 * 1024 px exports come to ~6 MB, and anything in public/ is both served to the
 * world and copied into the container image.
 *
 * Run again whenever the sources change:  node scripts/brand.mjs
 */
import sharp from 'sharp'
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs'
import {fileURLToPath} from 'node:url'

const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url))
const EXPORTS = 'brand/source/kvidr-icon 3 Exports/kvidr-icon 3-iOS'

// The logo's own colours, read from its gradient stops.
export const BRAND = {
  skyDeep: '#2292ec',
  skyLight: '#5ac7fc',
  tealLight: '#4ad2d0',
  tealDeep: '#1da7b8',
  bird: '#c9e6fb',
}

const INK = '#122033'
const INK_2 = '#4a5a6d'

mkdirSync(root('public/brand'), {recursive: true})

/* ---- the mark ------------------------------------------------------------ */
// The source is drawn on a 3473² artboard with a lot of empty space around the
// artwork. Crop the viewBox to the art so it sits properly beside a wordmark.
const source = readFileSync(root('brand/source/logo.svg'), 'utf8')

const withViewBox = (viewBox) =>
  source
    .replace(/<\?xml[^>]*\?>\s*/, '')
    .replace(/<!DOCTYPE[^>]*>\s*/, '')
    .replace(/\s+xmlns:affinity="[^"]*"/, '')
    .replace(/width="100%" height="100%" viewBox="[^"]*"/, `viewBox="${viewBox}"`)

// Measured bounds of the artwork: x 191, y 552, 3091 × 2369.
const mark = withViewBox('150 511 3173 2451')
writeFileSync(root('public/brand/kvidr-mark.svg'), mark)

// Favicons are square, so centre the same art in a square box.
const squareMark = withViewBox('141 141 3191 3191')
writeFileSync(root('public/favicon.svg'), squareMark)

/* ---- touch icon ---------------------------------------------------------- */
// iOS masks its own corners and fills transparency with black, so this is a
// full-bleed square with the mark on the bird's pale sky.
const TOUCH = 180
const touchBg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${TOUCH}" height="${TOUCH}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e8f3fc"/>
  </linearGradient></defs>
  <rect width="${TOUCH}" height="${TOUCH}" fill="url(#g)"/>
</svg>`)
const touchMark = await sharp(Buffer.from(squareMark), {density: 72}).resize(148, 148).png().toBuffer()
await sharp(touchBg)
  .composite([{input: touchMark, left: 16, top: 18}])
  .png({compressionLevel: 9})
  .toFile(root('public/apple-touch-icon.png'))

/* ---- app icon, light and dark ------------------------------------------- */
for (const [variant, file] of [
  ['light', 'Default'],
  ['dark', 'Dark'],
]) {
  const input = root(`${EXPORTS}-${file}-1024@1x.png`)
  await sharp(input).resize(512, 512).png({compressionLevel: 9}).toFile(root(`public/brand/app-icon-${variant}.png`))
  await sharp(input).resize(512, 512).webp({quality: 88}).toFile(root(`public/brand/app-icon-${variant}.webp`))
}

/* ---- social card --------------------------------------------------------- */
const W = 1200
const H = 630
const DISPLAY = 'Helvetica Neue, Helvetica, Arial, sans-serif'

const card = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fbfdff"/><stop offset="1" stop-color="#eaf4fc"/>
    </linearGradient>
    <radialGradient id="sky" cx="80%" cy="30%" r="55%">
      <stop offset="0" stop-color="${BRAND.skyLight}" stop-opacity="0.30"/>
      <stop offset="1" stop-color="${BRAND.skyLight}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="teal" cx="92%" cy="88%" r="45%">
      <stop offset="0" stop-color="${BRAND.tealLight}" stop-opacity="0.26"/>
      <stop offset="1" stop-color="${BRAND.tealLight}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <rect width="${W}" height="${H}" fill="url(#teal)"/>

  <text x="80" y="118" font-family="${DISPLAY}" font-weight="700" font-size="52"
        letter-spacing="-2.4" fill="${INK}">kvidr</text>
  <text x="80" y="268" font-family="${DISPLAY}" font-weight="700" font-size="76"
        letter-spacing="-3.4" fill="${INK}">Nextcloud Talk,</text>
  <text x="80" y="352" font-family="${DISPLAY}" font-weight="700" font-size="76"
        letter-spacing="-3.4" fill="${INK}">native on Mac</text>
  <text x="80" y="436" font-family="${DISPLAY}" font-weight="700" font-size="76"
        letter-spacing="-3.4" fill="${INK}">and iPhone.</text>

  <rect x="80" y="508" width="${W - 160}" height="1" fill="${INK}" fill-opacity="0.12"/>
  <text x="80" y="556" font-family="${DISPLAY}" font-weight="600" font-size="25"
        letter-spacing="-0.4" fill="#1670c4">kvidr.app</text>
  <text x="${W - 80}" y="556" text-anchor="end" font-family="${DISPLAY}" font-weight="400"
        font-size="25" letter-spacing="-0.4" fill="${INK_2}">Open source · MIT licensed</text>
</svg>`)

const cardIcon = await sharp(root(`${EXPORTS}-Default-1024@1x.png`)).resize(300, 300).png().toBuffer()

await sharp(card)
  .composite([{input: cardIcon, left: W - 80 - 300, top: 110}])
  .png({compressionLevel: 9})
  .toFile(root('public/og.png'))

console.log('Brand assets written to public/ and public/brand/.')
