/**
 * Seeds the Sanity dataset with the initial content for kvidr.app.
 *
 * The content itself lives in content.mjs.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN="…" node scripts/seed.mjs
 *
 * It uses createOrReplace on fixed document ids, so running it twice is safe,
 * but it WILL overwrite edits made in the Studio. Seed once, then edit there.
 */
import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'

import {documents} from './content.mjs'

const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
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
})

/* ---------- run ---------- */
const docs = Object.values(documents)
const tx = docs.reduce((t, doc) => t.createOrReplace(doc), client.transaction())
await tx.commit()

console.log(`Seeded ${docs.length} documents into ${env.PUBLIC_SANITY_PROJECT_ID}/${env.PUBLIC_SANITY_DATASET}:`)
for (const doc of docs) console.log(`  ${doc._type.padEnd(16)} ${doc._id}`)
