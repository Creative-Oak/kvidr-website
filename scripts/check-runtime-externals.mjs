/**
 * Asserts that the built server only imports packages the runtime image ships.
 *
 * The server bundle is built with `ssr.noExternal`, so almost every dependency
 * is inlined into dist/ and the container carries a node_modules of a few
 * hundred kilobytes instead of the whole installed tree. That only holds while
 * nothing new escapes the bundle. If something does — a package with a dynamic
 * require, or a native binary — it would be missing at runtime and the site
 * would fail on boot, in production, with a module-not-found.
 *
 * This turns that into a loud build failure instead. If it fires, either add
 * the package to ALLOWED here and to the Dockerfile's runtime stage, or work
 * out why it refused to bundle.
 *
 * Usage: node scripts/check-runtime-externals.mjs
 */
import {readFileSync, readdirSync} from 'node:fs'
import {builtinModules} from 'node:module'
import path from 'node:path'

/** Packages the runtime image installs. Keep in sync with the Dockerfile. */
const ALLOWED = new Set(['picomatch'])

const SERVER_DIR = 'dist/server'

const files = []
;(function walk(dir) {
  for (const entry of readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (full.endsWith('.mjs') || full.endsWith('.js')) files.push(full)
  }
})(SERVER_DIR)

const SPECIFIER =
  /(?:^|[\s;}])(?:import|export)[\s\S]{0,2000}?from\s*["']([^"']+)["']|(?:^|[\s;=(])import\s*\(\s*["']([^"']+)["']\s*\)|require\(\s*["']([^"']+)["']\s*\)/g

const builtins = new Set(builtinModules)
const found = new Map()

for (const file of files) {
  const source = readFileSync(file, 'utf8')
  let match
  while ((match = SPECIFIER.exec(source)) !== null) {
    const spec = match[1] ?? match[2] ?? match[3]
    if (!spec) continue
    if (spec.startsWith('.') || spec.startsWith('/') || spec.startsWith('node:')) continue
    // Interpolated specifiers are Vite's dynamic-import shim, not real packages.
    if (spec.includes('${')) continue

    const pkg = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0]
    if (builtins.has(pkg)) continue
    if (!found.has(pkg)) found.set(pkg, file)
  }
}

const unexpected = [...found.keys()].filter((pkg) => !ALLOWED.has(pkg)).sort()

if (unexpected.length > 0) {
  console.error(
    `\n✗ The built server imports ${unexpected.length} package(s) the runtime image does not ship:\n`,
  )
  for (const pkg of unexpected) console.error(`    ${pkg}  (first seen in ${found.get(pkg)})`)
  console.error(
    '\n  Either add them to ALLOWED in this script and to the Dockerfile runtime stage,\n' +
      '  or find out why they did not bundle. Leaving it will break the container on boot.\n',
  )
  process.exit(1)
}

console.log(
  `✓ Runtime externals are as expected (${[...found.keys()].sort().join(', ') || 'none'}).`,
)
