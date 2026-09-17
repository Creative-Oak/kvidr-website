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
      name: 'priceAmount',
      title: 'Price of the signed build',
      type: 'number',
      group: 'general',
      initialValue: 2.99,
      description:
        'Shown wherever the site talks about buying. Write {price} in copy to insert it, formatted.',
      validation: (Rule) => Rule.min(0).precision(2),
    }),
    defineField({
      name: 'priceCurrency',
      title: 'Currency',
      type: 'string',
      group: 'general',
      initialValue: 'USD',
      options: {
        list: [
          {title: 'US dollar', value: 'USD'},
          {title: 'Euro', value: 'EUR'},
          {title: 'Danish krone', value: 'DKK'},
          {title: 'British pound', value: 'GBP'},
        ],
      },
    }),
    defineField({
      name: 'downloadUrl',
      title: 'Mac purchase URL',
      type: 'url',
      group: 'general',
      description:
        'Where people buy the signed Mac build. Leave empty until it exists: while empty, the site says the signed build is coming instead of showing a dead button.',
    }),
    defineField({
      name: 'iosAppStoreUrl',
      title: 'iPhone App Store URL',
      type: 'url',
      group: 'general',
      description: 'Leave empty until the iPhone app is live. While empty, the iPhone section says it is in development.',
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
