import {defineConfig, passthroughImageService} from 'astro/config'
import {loadEnv} from 'vite'
import sanity from '@sanity/astro'
import react from '@astrojs/react'
import node from '@astrojs/node'
import sitemap from '@astrojs/sitemap'

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '')

/**
 * Inlines the server's dependencies into dist/ at build time.
 *
 * Without this the runtime image has to carry the entire installed dependency
 * tree — including the Studio's, which is client-side only and already compiled
 * into dist/client — for the sake of the twenty-odd packages the server
 * actually reaches. Bundling takes that from ~620 MB of node_modules to one
 * package.
 *
 * Build only: in dev, Vite would try to push CommonJS packages such as React
 * through its SSR transform pipeline, and the dev server fails to boot.
 * scripts/check-runtime-externals.mjs guards the result.
 */
function bundleServerDependencies() {
  return {
    name: 'kvidr:bundle-server-dependencies',
    hooks: {
      'astro:config:setup': ({command, updateConfig}) => {
        if (command !== 'build') return
        updateConfig({
          // sharp loads a native binary and can never be bundled. Nothing
          // should reach it now that images go through Sanity's CDN, but if
          // something does, leave it importable rather than broken.
          vite: {ssr: {noExternal: true, external: ['sharp']}},
        })
      },
    },
  }
}

const projectId = env.PUBLIC_SANITY_PROJECT_ID
const dataset = env.PUBLIC_SANITY_DATASET ?? 'production'
const visualEditing = env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === 'true'

if (!projectId) {
  throw new Error('PUBLIC_SANITY_PROJECT_ID is missing. Copy .env.example to .env.')
}

export default defineConfig({
  site: env.PUBLIC_SITE_URL ?? 'https://kvidr.app',
  output: 'server',
  // Every image on this site is served and resized by Sanity's CDN, so Astro's
  // own optimiser is never used. Saying so keeps sharp — and its ~27 MB of
  // platform binaries — out of the runtime image.
  image: {service: passthroughImageService()},
  adapter: node({mode: 'standalone'}),
  prefetch: {prefetchAll: true, defaultStrategy: 'viewport'},
  integrations: [
    bundleServerDependencies(),
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
