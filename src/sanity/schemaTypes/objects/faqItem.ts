import {defineField, defineType} from 'sanity'

export const faqItem = defineType({
  name: 'faqItem',
  title: 'Question',
  type: 'object',
  fields: [
    defineField({name: 'question', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'answer', type: 'richText', validation: (Rule) => Rule.required()}),
  ],
  preview: {select: {title: 'question'}},
})
