/**
 * Shortens the iPhone plan's price note to "sold separately". The longer
 * version wrapped and knocked that column out of line with the others; the
 * questions below the plans already say the price is announced at launch.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN="…" node scripts/migrations/2026-09-17-iphone-price-note.mjs [--dry-run]
 */
import {migrate} from './_lib.mjs'

await migrate({
  patch: {
    pricingPage: {rev: 'g8Y6Q0oeVqC5OqcuM287pb', fields: ['plans']},
  },
})
