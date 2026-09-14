import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'title',
      title: 'Meta title',
      type: 'string',
      description: 'Overrides the page title in search results and social cards. ~60 characters.',
      validation: (Rule) => Rule.max(70).warning('Longer titles get truncated in search results.'),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(170).warning('Aim for under 160 characters.'),
    }),
    defineField({
      name: 'image',
      title: 'Social share image',
      type: 'image',
      description: '1200×630 works best.',
      options: {hotspot: true},
    }),
  ],
})
