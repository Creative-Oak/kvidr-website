/**
 * Generates public/og.png — the fallback social share card.
 *
 * This is only a fallback: anything uploaded to Site settings → SEO → Social
 * share image in the Studio overrides it, and so does a per-page SEO image.
 *
 * It is set in the macOS system grotesk rather than the site's Schibsted
 * Grotesk, because the rasteriser resolves fonts through fontconfig and only
 * sees fonts installed on the machine. Replace it from the Studio with a real
 * card whenever you have one.
 *
 * Usage: node scripts/og.mjs
 */
import sharp from 'sharp'
import {fileURLToPath} from 'node:url'

const W = 1200
const H = 630

const PAPER = '#faf7f1'
const INK = '#1a1b20'
const INK_2 = '#55565f'
const ACCENT = '#33538a'

const DISPLAY = 'Helvetica Neue, Helvetica, Arial, sans-serif'

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="78%" cy="14%" r="62%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="12%" cy="92%" r="50%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>

  <!-- mark -->
  <g transform="translate(80 66)">
    <rect width="76" height="76" rx="21" fill="${INK}"/>
    <g stroke="${PAPER}" stroke-width="6.2" stroke-linecap="round">
      <path d="M24 46.5v-7"/>
      <path d="M38 51v-21"/>
      <path d="M52 46.5v-14"/>
    </g>
  </g>
  <text x="176" y="120" font-family="${DISPLAY}" font-weight="700" font-size="54"
        letter-spacing="-2.6" fill="${INK}">kvidr</text>

  <!-- headline -->
  <text x="80" y="318" font-family="${DISPLAY}" font-weight="700" font-size="86"
        letter-spacing="-4" fill="${INK}">Nextcloud Talk,</text>
  <text x="80" y="410" font-family="${DISPLAY}" font-weight="700" font-size="86"
        letter-spacing="-4" fill="${INK}">as a real Mac app.</text>

  <!-- foot -->
  <rect x="80" y="508" width="${W - 160}" height="1" fill="${INK}" fill-opacity="0.13"/>
  <text x="80" y="556" font-family="${DISPLAY}" font-weight="600" font-size="25"
        letter-spacing="-0.4" fill="${ACCENT}">kvidr.app</text>
  <text x="${W - 80}" y="556" text-anchor="end" font-family="${DISPLAY}" font-weight="400"
        font-size="25" letter-spacing="-0.4" fill="${INK_2}">A native macOS client for Nextcloud Talk</text>
</svg>`

const out = fileURLToPath(new URL('../public/og.png', import.meta.url))
await sharp(Buffer.from(svg)).png({compressionLevel: 9}).toFile(out)
console.log(`Wrote ${out} (${W}×${H})`)

/* ---- apple-touch-icon ------------------------------------------------- */
const ICON = 180
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ICON}" height="${ICON}" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="${INK}"/>
  <g stroke="${PAPER}" stroke-width="2.6" stroke-linecap="round">
    <path d="M11 19.5v-3"/>
    <path d="M16 21.5v-9"/>
    <path d="M21 19.5v-6"/>
  </g>
</svg>`

const iconOut = fileURLToPath(new URL('../public/apple-touch-icon.png', import.meta.url))
await sharp(Buffer.from(iconSvg)).png({compressionLevel: 9}).toFile(iconOut)
console.log(`Wrote ${iconOut} (${ICON}×${ICON})`)
