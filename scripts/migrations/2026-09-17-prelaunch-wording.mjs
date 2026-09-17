/**
 * Follow-up to the pre-launch migration: removes the last lines that read as
 * if kvidr had already shipped.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN="…" node scripts/migrations/2026-09-17-prelaunch-wording.mjs [--dry-run]
 */
import {migrate} from './_lib.mjs'

await migrate({
  patch: {
    homePage: {rev: 's245AmQlOGrhBXdMrjThpS', fields: ['featuresIntro']},
    'changelog-1-0-0': {rev: 'PGy4AxUberIw2FMriARoIb', fields: ['headline', 'body']},
  },
})
