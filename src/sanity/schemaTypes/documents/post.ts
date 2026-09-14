import {defineField, defineType} from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Blog post',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      description: 'Shown in the blog index and used as the meta description fallback.',
      validation: (Rule) => Rule.required().max(220),
    }),
    defineField({name: 'coverImage', type: 'captionedImage'}),
    defineField({name: 'author', type: 'reference', to: [{type: 'author'}]}),
    defineField({name: 'body', type: 'richText'}),
    defineField({name: 'seo', type: 'seo'}),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', subtitle: 'publishedAt', media: 'coverImage'},
    prepare: ({title, subtitle, media}) => ({
      title,
      subtitle: subtitle ? new Date(subtitle).toLocaleDateString('en-GB') : 'Unpublished',
      media,
    }),
  },
})
