import {defineField, defineType} from 'sanity'

export const captionedImage = defineType({
  name: 'captionedImage',
  title: 'Screenshot',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'Describe the screenshot for people using a screen reader.',
      validation: (Rule) => Rule.required().warning('Alt text keeps the site accessible.'),
    }),
    defineField({
      name: 'caption',
      type: 'string',
      description: 'Optional line shown under the window frame.',
    }),
    defineField({
      name: 'windowTitle',
      title: 'Window title',
      type: 'string',
      description: 'Shown in the fake macOS title bar. Defaults to "kvidr".',
    }),
  ],
})
