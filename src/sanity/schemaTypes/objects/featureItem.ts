import {defineField, defineType} from 'sanity'

export const featureItem = defineType({
  name: 'featureItem',
  title: 'Feature',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'body', type: 'text', rows: 3, validation: (Rule) => Rule.required()}),
    defineField({
      name: 'symbol',
      title: 'SF Symbol name',
      type: 'string',
      description:
        'Optional. Drawn as a small glyph beside the title, e.g. "keyboard", "lock", "bolt".',
      options: {
        list: [
          {title: 'Bolt (speed)', value: 'bolt'},
          {title: 'Lock (privacy)', value: 'lock'},
          {title: 'Keyboard', value: 'keyboard'},
          {title: 'Bubble (chat)', value: 'bubble'},
          {title: 'Paperclip (files)', value: 'paperclip'},
          {title: 'Bell (notifications)', value: 'bell'},
          {title: 'Magnifier (search)', value: 'search'},
          {title: 'Sidebar (layout)', value: 'sidebar'},
          {title: 'Arrow (sync)', value: 'sync'},
        ],
      },
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'body'}},
})
