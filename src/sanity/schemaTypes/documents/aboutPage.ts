import {defineField, defineType} from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({
      name: 'headline',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'lede', type: 'text', rows: 4}),
    defineField({name: 'portrait', type: 'image', options: {hotspot: true}}),
    defineField({name: 'body', type: 'richText'}),
    defineField({name: 'seo', type: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'About page'})},
})
