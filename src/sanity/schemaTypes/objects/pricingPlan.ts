import {defineArrayMember, defineField, defineType} from 'sanity'

export const pricingPlan = defineType({
  name: 'pricingPlan',
  title: 'Plan',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      type: 'string',
      options: {
        list: [
          {title: 'Mac', value: 'mac'},
          {title: 'iPhone', value: 'iphone'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'priceType',
      title: 'Price',
      type: 'string',
      description:
        'Prices come from Site settings, so this page can never disagree with the rest of the site.',
      options: {
        list: [
          {title: 'Mac price, bought here (from Site settings)', value: 'signed'},
          {title: 'Mac App Store price (from Site settings)', value: 'appstore'},
          {title: 'Free', value: 'free'},
          {title: 'To be announced', value: 'tba'},
        ],
        layout: 'radio',
      },
      initialValue: 'signed',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'priceNote',
      title: 'Under the price',
      type: 'string',
      description: 'A few words, e.g. "under the MIT licence". Tokens work here: {price}, {appStorePrice}, {seats}.',
    }),
    defineField({
      name: 'status',
      type: 'string',
      description: 'Optional badge, e.g. "In development".',
    }),
    defineField({
      name: 'body',
      type: 'text',
      rows: 3,
      description: 'Tokens: {price}, {appStorePrice}, {seats}.',
    }),
    defineField({
      name: 'includes',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'action',
      type: 'string',
      description: 'What the button does. Buy and App Store links come from Site settings.',
      options: {
        list: [
          {title: 'Buy the Mac app here', value: 'buy'},
          {title: 'Mac App Store', value: 'macappstore'},
          {title: 'Read the source', value: 'source'},
          {title: 'iPhone App Store (or the mailing list until it is live)', value: 'appstore'},
          {title: 'No button', value: 'none'},
        ],
      },
      initialValue: 'none',
    }),
  ],
  preview: {
    select: {title: 'title', platform: 'platform', priceType: 'priceType'},
    prepare: ({title, platform, priceType}) => ({
      title,
      subtitle: [platform === 'iphone' ? 'iPhone' : 'Mac', priceType].filter(Boolean).join(' · '),
    }),
  },
})
