import {defineArrayMember, defineField, defineType} from 'sanity'

export const richText = defineType({
  name: 'richText',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Body', value: 'normal'},
        {title: 'Heading', value: 'h2'},
        {title: 'Subheading', value: 'h3'},
        {title: 'Lede', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
          {title: 'Code', value: 'code'},
        ],
        annotations: [
          defineArrayMember({
            name: 'linkAnnotation',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                type: 'string',
                validation: (Rule) => Rule.required(),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({type: 'captionedImage'}),
    defineArrayMember({
      name: 'codeBlock',
      title: 'Code',
      type: 'object',
      fields: [
        defineField({name: 'code', type: 'text', rows: 8, validation: (Rule) => Rule.required()}),
        defineField({name: 'language', type: 'string', initialValue: 'swift'}),
      ],
      preview: {select: {title: 'language', subtitle: 'code'}},
    }),
  ],
})
