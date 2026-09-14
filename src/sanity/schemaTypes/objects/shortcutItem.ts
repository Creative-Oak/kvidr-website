import {defineField, defineType} from 'sanity'

export const shortcutItem = defineType({
  name: 'shortcutItem',
  title: 'Shortcut',
  type: 'object',
  fields: [
    defineField({
      name: 'keys',
      type: 'string',
      description: 'Written as you would in a Mac menu, e.g. "⇧⌘]" or "⌥⌘F". Use "/" for either.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'action', type: 'string', validation: (Rule) => Rule.required()}),
  ],
  preview: {select: {title: 'keys', subtitle: 'action'}},
})
