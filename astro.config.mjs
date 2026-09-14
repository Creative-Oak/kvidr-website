import {defineConfig} from 'astro/config'
import {loadEnv} from 'vite'
import sanity from '@sanity/astro'
import react from '@astrojs/react'
import node from '@astrojs/node'
import sitemap from '@astrojs/sitemap'

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '')

const projectId = env.PUBLIC_SANITY_PROJECT_ID
const dataset = env.PUBLIC_SANITY_DATASET ?? 'production'
const visualEditing = env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === 'true'

if (!projectId) {
  throw new Error('PUBLIC_SANITY_PROJECT_ID is missing. Copy .env.example to .env.')
}

export default defineConfig({
  site: env.PUBLIC_SITE_URL ?? 'https://kvidr.app',
  output: 'server',
  adapter: node({mode: 'standalone'}),
  prefetch: {prefetchAll: true, defaultStrategy: 'viewport'},
  integrations: [
    sanity({
      projectId,
      dataset,
      apiVersion: '2025-02-19',
      // Visual editing needs fresh, uncached drafts; production reads may use the CDN.
      useCdn: !visualEditing,
      studioBasePath: '/studio',
      stega: {studioUrl: '/studio'},
    }),
    react(),
    sitemap({
      filter: (page) => !page.includes('/studio'),
    }),
  ],
  vite: {
    optimizeDeps: {
      // The visual editing island is shipped as .tsx inside node_modules, so
      // Vite treats it as source and does not pre-bundle what it imports.
      // @sanity/mutate reaches CommonJS lodash modules that then fail with
      // "does not provide an export named 'default'", which leaves the
      // Presentation overlay unable to connect. Naming them here forces the
      // pre-bundle that supplies the ESM interop.
      include: ['@sanity/mutate', '@sanity/visual-editing/react', 'lodash'],
    },
  },
})
