import {defineField, defineType} from 'sanity'

export const changelogEntry = defineType({
  name: 'changelogEntry',
  title: 'Changelog entry',
  type: 'document',
  fields: [
    defineField({
      name: 'version',
      type: 'string',
      description: 'e.g. 1.0.0',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'releasedAt',
      title: 'Released at',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headline',
      type: 'string',
      description: 'One line summarising the release.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'body', type: 'richText'}),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'releasedAtDesc',
      by: [{field: 'releasedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'version', subtitle: 'headline'},
    prepare: ({title, subtitle}) => ({title: `v${title}`, subtitle}),
  },
})
