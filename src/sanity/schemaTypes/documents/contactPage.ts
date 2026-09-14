import {defineField, defineType} from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact page',
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
    defineField({
      name: 'body',
      type: 'richText',
      description: 'Sits beside the form — where to file bugs, what not to send here.',
    }),
    defineField({name: 'seo', type: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Contact page'})},
})
