import {defineField, defineType} from 'sanity'

export const qualityItem = defineType({
  name: 'qualityItem',
  title: 'Quality',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'body',
      type: 'text',
      rows: 3,
      description: 'One or two sentences. Concrete, not aspirational.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'body'}},
})
