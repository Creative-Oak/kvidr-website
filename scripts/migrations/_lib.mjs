/**
 * Shared machinery for content migrations.
 *
 * A migration names the documents it patches, the fields it sets on each, and
 * the exact revision each document must still be at. If any document has moved
 * on — edited in the Studio, or given an unpublished draft — nothing is written
 * at all. Values come from content.mjs, so the seed and every migration agree.
 */
import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'

import {documents} from '../content.mjs'

function loadEnv() {
  return Object.fromEntries(
    readFileSync(new URL('../../.env', import.meta.url), 'utf8')
      .split('\n')
      .filter((line) => line.includes('=') && !line.trimStart().startsWith('#'))
      .map((line) => {
        const i = line.indexOf('=')
        return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^"|"$/g, '')]
      }),
  )
}

/**
 * @param {object} options
 * @param {Record<string, {rev: string, fields: string[]}>} [options.patch]
 * @param {string[]} [options.create] document ids to create; refused if they exist
 */
export async function migrate({patch = {}, create = []}) {
  const dryRun = process.argv.includes('--dry-run')
  const env = loadEnv()
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

  const ids = [...Object.keys(patch), ...create]
  const found = await client.fetch(`*[_id in $ids]{_id, _rev}`, {
    ids: [...ids, ...ids.map((id) => `drafts.${id}`)],
  })
  const rev = Object.fromEntries(found.map((d) => [d._id, d._rev]))

  const problems = []
  for (const [id, {rev: expected, fields}] of Object.entries(patch)) {
    if (!rev[id]) problems.push(`${id}: missing`)
    else if (rev[id] !== expected) problems.push(`${id}: at ${rev[id]}, expected ${expected} — edited since`)
    for (const field of fields) {
      if (!(field in documents[id])) problems.push(`${id}.${field}: not defined in content.mjs`)
    }
  }
  for (const id of create) if (rev[id]) problems.push(`${id}: already exists`)
  for (const id of ids) if (rev[`drafts.${id}`]) problems.push(`${id}: has an unpublished draft`)

  if (problems.length) {
    console.error('Not migrating — nothing was written:\n' + problems.map((p) => `  • ${p}`).join('\n'))
    process.exit(1)
  }

  let tx = client.transaction()
  for (const [id, {rev: expected, fields}] of Object.entries(patch)) {
    console.log(`patch  ${id} @ ${expected}: ${fields.join(', ')}`)
    const set = Object.fromEntries(fields.map((f) => [f, documents[id][f]]))
    tx = tx.patch(id, (p) => p.ifRevisionId(expected).set(set))
  }
  for (const id of create) {
    console.log(`create ${id}`)
    tx = tx.create(documents[id])
  }

  if (dryRun) {
    console.log('\nDry run — nothing written.')
    return
  }
  const result = await tx.commit()
  console.log(`\nDone (transaction ${result.transactionId}).`)
}
