/**
 * The Mac app is sold two ways — directly, with a licence code for several
 * Macs, and on the Mac App Store at a higher price — updates are included,
 * refunds are generous, and the iPhone app is a separate purchase.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN="…" node scripts/migrations/2026-09-17-direct-and-app-store-pricing.mjs [--dry-run]
 */
import {migrate} from './_lib.mjs'

await migrate({
  patch: {
    siteSettings: {
      rev: 's245AmQlOGrhBXdMrjLU9I',
      fields: ['priceAmount', 'appStorePriceAmount', 'licenceSeats'],
    },
    homePage: {
      rev: 's245AmQlOGrhBXdMrjMgpw',
      fields: ['heroPriceNote', 'iosBody', 'pricingIntro', 'buyTitle', 'buyBody', 'requirements'],
    },
    aboutPage: {rev: 's245AmQlOGrhBXdMrjLU9I', fields: ['body']},
    pricingPage: {
      rev: 's245AmQlOGrhBXdMrjLU9I',
      fields: ['lede', 'plans', 'sameAppNote', 'refundsHeading', 'refundsBody', 'faq', 'ctaBody', 'seo'],
    },
  },
})
