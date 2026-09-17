/**
 * Adds pricing and the iPhone app to an already-seeded dataset.
 *
 * Patches only the fields this change touched, taking their values from
 * content.mjs. It refuses to run against a document that has been edited in
 * the Studio or has an unpublished draft, because overwriting someone's
 * wording is worse than not updating it. Each patch is pinned to the revision
 * that was checked, so an edit landing mid-run fails the transaction instead
 * of being overwritten.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN="…" node scripts/migrations/2026-09-17-pricing-and-iphone.mjs [--dry-run] [--force]
 */
import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'

import {documents} from '../content.mjs'

const dryRun = process.argv.includes('--dry-run')
const force = process.argv.includes('--force')

const env = Object.fromEntries(
  readFileSync(new URL('../../.env', import.meta.url), 'utf8')
    .split('\n')
    .filter((line) => line.includes('=') && !line.trimStart().startsWith('#'))
    .map((line) => {
      const i = line.indexOf('=')
      return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^"|"$/g, '')]
    }),
)

const token = process.env.SANITY_WRITE_TOKEN
if (!token) throw new Error('SANITY_WRITE_TOKEN is required')

const client = createClient({
  projectId: env.PUBLIC_SANITY_PROJECT_ID,
  dataset: env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  token,
  useCdn: false,
  perspective: 'raw',
})

const FIELDS = {
  siteSettings: ['tagline', 'priceAmount', 'priceCurrency', 'footerNote', 'seo'],
  homePage: [
    'eyebrow',
    'heroPriceNote',
    'iosHeading',
    'iosStatus',
    'iosBody',
    'pricingHeading',
    'pricingIntro',
    'buyTitle',
    'buyBody',
    'buildTitle',
    'buildBody',
    'requirements',
    'ctaBody',
    'seo',
  ],
  aboutPage: ['body'],
}

const source = {
  siteSettings: documents.siteSettings,
  homePage: documents.homePage,
  aboutPage: documents.aboutPage,
}

const ids = Object.keys(FIELDS)
const existing = await client.fetch(
  `*[_id in $ids || _id in $drafts]{_id, _rev, _createdAt, _updatedAt}`,
  {ids, drafts: ids.map((id) => `drafts.${id}`)},
)

const problems = []
for (const id of ids) {
  const doc = existing.find((d) => d._id === id)
  if (!doc) problems.push(`${id}: does not exist — run seed.mjs instead`)
  else if (doc._createdAt !== doc._updatedAt && !force)
    problems.push(`${id}: changed since it was seeded — possibly by this migration already (${doc._updatedAt})`)
  if (existing.some((d) => d._id === `drafts.${id}`))
    problems.push(`${id}: has an unpublished draft — publish or discard it first`)
}

if (problems.length) {
  console.error('Not migrating:\n' + problems.map((p) => `  • ${p}`).join('\n'))
  console.error('\nResolve those, or pass --force to overwrite edited documents (never drafts).')
  process.exit(1)
}

let tx = client.transaction()
for (const id of ids) {
  const rev = existing.find((d) => d._id === id)._rev
  const set = Object.fromEntries(FIELDS[id].map((field) => [field, source[id][field]]))
  console.log(`${id} @ ${rev}: ${FIELDS[id].join(', ')}`)
  tx = tx.patch(id, (patch) => patch.ifRevisionId(rev).set(set))
}

if (dryRun) {
  console.log('\nDry run — nothing written.')
} else {
  const result = await tx.commit()
  console.log(`\nMigrated ${result.results.length} documents (transaction ${result.transactionId}).`)
}
