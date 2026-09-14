import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'nav', title: 'Navigation'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'tagline',
      type: 'string',
      group: 'general',
      description: 'Sits beside the wordmark in the footer. One short line.',
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'downloadUrl',
      title: 'Download URL',
      type: 'url',
      group: 'general',
      description:
        'Leave empty until there is a real build. While empty, the site says so honestly instead of showing a dead download button.',
    }),
    defineField({
      name: 'contactEmail',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'navLinks',
      title: 'Header links',
      type: 'array',
      group: 'nav',
      of: [defineArrayMember({type: 'link'})],
      validation: (Rule) => Rule.max(5),
    }),
    defineField({
      name: 'footerLinks',
      title: 'Footer links',
      type: 'array',
      group: 'nav',
      of: [defineArrayMember({type: 'link'})],
    }),
    defineField({
      name: 'footerNote',
      title: 'Footer note',
      type: 'text',
      rows: 3,
      group: 'general',
      description: 'Licence, credits, the small print.',
    }),
    defineField({name: 'seo', type: 'seo', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})
