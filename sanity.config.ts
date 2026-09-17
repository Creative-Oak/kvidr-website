import {visionTool} from '@sanity/vision'
import {createElement} from 'react'
import {defineConfig} from 'sanity'
import {presentationTool, defineLocations} from 'sanity/presentation'
import {structureTool, type StructureBuilder, type StructureResolver} from 'sanity/structure'

import {schemaTypes, singletonTypes} from './src/sanity/schemaTypes'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? 'production'

/**
 * Singletons get a fixed document id and are pinned to the top of the sidebar,
 * so there is never a second "Home page" to wonder about.
 */
const singleton = (S: StructureBuilder, type: string, title: string) =>
  S.listItem()
    .title(title)
    .id(type)
    .child(S.document().schemaType(type).documentId(type).title(title))

const structure: StructureResolver = (S) =>
  S.list()
    .title('kvidr')
    .items([
      singleton(S, 'homePage', 'Home page'),
      singleton(S, 'aboutPage', 'About page'),
      singleton(S, 'contactPage', 'Contact page'),
      S.divider(),
      S.documentTypeListItem('post').title('Blog'),
      S.documentTypeListItem('changelogEntry').title('Changelog'),
      S.documentTypeListItem('author').title('Authors'),
      S.divider(),
      singleton(S, 'siteSettings', 'Site settings'),
    ])

export default defineConfig({
  name: 'kvidr',
  title: 'kvidr',
  // The Studio lives on the same origin as the site, so it can use the mark.
  icon: () =>
    createElement('img', {
      src: '/brand/kvidr-mark.svg',
      alt: '',
      style: {width: '100%', height: '100%', objectFit: 'contain'},
    }),
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool({structure}),
    presentationTool({
      name: 'preview',
      title: 'Preview',
      previewUrl: {
        // The Studio is embedded in the site, so the preview is same-origin.
        preview: '/',
      },
      resolve: {
        locations: {
          homePage: defineLocations({
            message: 'This document is used on the front page.',
            locations: [{title: 'Home', href: '/'}],
          }),
          aboutPage: defineLocations({
            locations: [{title: 'About', href: '/about'}],
          }),
          contactPage: defineLocations({
            locations: [{title: 'Contact', href: '/contact'}],
          }),
          post: defineLocations({
            select: {title: 'title', slug: 'slug.current'},
            resolve: (doc) => ({
              locations: [
                {title: doc?.title || 'Post', href: `/blog/${doc?.slug}`},
                {title: 'Blog index', href: '/blog'},
              ],
            }),
          }),
          changelogEntry: defineLocations({
            select: {version: 'version'},
            resolve: (doc) => ({
              locations: [{title: `v${doc?.version}`, href: '/changelog'}],
            }),
          }),
          siteSettings: defineLocations({
            message: 'Site settings affect the header and footer of every page.',
            locations: [{title: 'Home', href: '/'}],
          }),
        },
      },
    }),
    visionTool({defaultApiVersion: '2025-02-19'}),
  ],
  schema: {
    types: schemaTypes,
    // Hide singletons from the global "create new" menu.
    templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },
  document: {
    // Remove the "duplicate"/"delete" actions from singletons.
    actions: (input, {schemaType}) =>
      singletonTypes.has(schemaType)
        ? input.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : input,
  },
})
