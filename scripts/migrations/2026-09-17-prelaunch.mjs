/**
 * Pre-launch: says plainly that nothing has launched, takes prices and the
 * pricing link off the site, and turns the closing section into a launch
 * sign-up. The pricing page's own document is left as it is, for launch.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN="…" node scripts/migrations/2026-09-17-prelaunch.mjs [--dry-run]
 */
import {migrate} from './_lib.mjs'

await migrate({
  patch: {
    siteSettings: {rev: 'g8Y6Q0oeVqC5OqcuM287pb', fields: ['navLinks', 'footerLinks', 'footerNote', 'seo']},
    homePage: {
      rev: 'g8Y6Q0oeVqC5OqcuM287pb',
      fields: ['eyebrow', 'heroPriceNote', 'statusNote', 'iosBody', 'requirements', 'ctaHeading', 'ctaBody', 'ctaSubscribeLabel', 'seo'],
    },
    aboutPage: {rev: 'g8Y6Q0oeVqC5OqcuM287pb', fields: ['body']},
  },
})
