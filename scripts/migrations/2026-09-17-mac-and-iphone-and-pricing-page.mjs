/**
 * Reframes the copy from "a Mac app" to "Mac and iPhone", moves the GitHub
 * link to the repository's new home, and creates the pricing page.
 *
 * Every existing document is pinned to the exact revision it had after the
 * previous migration (or the seed, for the contact page). If anyone has edited
 * one since, the whole run stops before writing anything, so no wording typed
 * in the Studio is ever overwritten.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN="…" node scripts/migrations/2026-09-17-mac-and-iphone-and-pricing-page.mjs [--dry-run]
 */
import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'

import {documents} from '../content.mjs'

const dryRun = process.argv.includes('--dry-run')

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

/** Revision each document must still be at — the state this change was written against. */
const PATCHES = {
  siteSettings: {
    rev: 'pR5YZRSUSrCld27iTAESZ4',
    fields: ['tagline', 'githubUrl', 'navLinks', 'footerLinks', 'seo'],
  },
  homePage: {
    rev: 'pR5YZRSUSrCld27iTAESZ4',
    fields: ['headline', 'lede', 'problemBody', 'qualities', 'featuresIntro', 'keyboardHeading', 'requirements', 'seo'],
  },
  aboutPage: {rev: 'pR5YZRSUSrCld27iTAESZ4', fields: ['lede', 'body']},
  contactPage: {rev: 'PGy4AxUberIw2FMriARoIb', fields: ['seo']},
}

const CREATE = ['pricingPage']

const ids = [...Object.keys(PATCHES), ...CREATE]
const current = await client.fetch(`*[_id in $ids]{_id, _rev}`, {
  ids: [...ids, ...ids.map((id) => `drafts.${id}`)],
})
const byId = Object.fromEntries(current.map((d) => [d._id, d._rev]))

const problems = []
for (const [id, {rev}] of Object.entries(PATCHES)) {
  if (!byId[id]) problems.push(`${id}: missing`)
  else if (byId[id] !== rev) problems.push(`${id}: at revision ${byId[id]}, expected ${rev} — edited since`)
}
for (const id of CREATE) {
  if (byId[id]) problems.push(`${id}: already exists — edit it in the Studio instead`)
}
for (const id of ids) {
  if (byId[`drafts.${id}`]) problems.push(`${id}: has an unpublished draft`)
}

if (problems.length) {
  console.error('Not migrating — nothing was written:\n' + problems.map((p) => `  • ${p}`).join('\n'))
  process.exit(1)
}

let tx = client.transaction()
for (const [id, {rev, fields}] of Object.entries(PATCHES)) {
  const set = Object.fromEntries(fields.map((f) => [f, documents[id][f]]))
  console.log(`patch  ${id} @ ${rev}: ${fields.join(', ')}`)
  tx = tx.patch(id, (p) => p.ifRevisionId(rev).set(set))
}
for (const id of CREATE) {
  console.log(`create ${id}`)
  tx = tx.create(documents[id])
}

if (dryRun) {
  console.log('\nDry run — nothing written.')
} else {
  const result = await tx.commit()
  console.log(`\nDone (transaction ${result.transactionId}).`)
}
