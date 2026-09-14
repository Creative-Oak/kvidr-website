import {defineField, defineType} from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'role', type: 'string'}),
    defineField({name: 'image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'bio', type: 'text', rows: 3}),
  ],
  preview: {select: {title: 'name', subtitle: 'role', media: 'image'}},
})
