import {defineField, defineType} from 'sanity'

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL or path',
      type: 'string',
      description: 'An absolute URL (https://…) or an internal path (/blog).',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'href'},
  },
})
