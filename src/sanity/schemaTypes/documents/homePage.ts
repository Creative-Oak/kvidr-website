import {defineArrayMember, defineField, defineType} from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'problem', title: 'The problem'},
    {name: 'qualities', title: 'How it feels'},
    {name: 'features', title: 'Features'},
    {name: 'keyboard', title: 'Keyboard'},
    {name: 'ios', title: 'iPhone'},
    {name: 'privacy', title: 'Privacy'},
    {name: 'pricing', title: 'Price'},
    {name: 'requirements', title: 'Requirements'},
    {name: 'cta', title: 'Call to action'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // -- Hero
    defineField({
      name: 'eyebrow',
      type: 'string',
      group: 'hero',
      description: 'Small line above the headline.',
    }),
    defineField({
      name: 'headline',
      type: 'text',
      rows: 3,
      group: 'hero',
      description: 'Big and loud. Two short lines beat one long one.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lede',
      type: 'text',
      rows: 4,
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroScreenshot',
      title: 'Hero screenshot',
      type: 'captionedImage',
      group: 'hero',
      description: 'Until one exists, the site draws a placeholder window in its place.',
    }),
    defineField({
      name: 'heroPriceNote',
      title: 'Price note',
      type: 'string',
      group: 'hero',
      description: 'One line under the buttons. Write {price} to insert the price from Site settings.',
    }),
    defineField({
      name: 'statusNote',
      title: 'Status note',
      type: 'string',
      group: 'hero',
      description:
        'The honest line under the buttons, e.g. "v1.0 — chat, complete. Calls are out of scope."',
    }),

    // -- Problem
    defineField({name: 'problemHeading', title: 'Heading', type: 'text', rows: 2, group: 'problem'}),
    defineField({name: 'problemBody', title: 'Body', type: 'richText', group: 'problem'}),
    defineField({
      name: 'problemScreenshot',
      title: 'Screenshot',
      type: 'captionedImage',
      group: 'problem',
    }),

    // -- Qualities
    defineField({name: 'qualitiesHeading', title: 'Heading', type: 'text', rows: 2, group: 'qualities'}),
    defineField({
      name: 'qualities',
      type: 'array',
      group: 'qualities',
      of: [defineArrayMember({type: 'qualityItem'})],
      validation: (Rule) => Rule.max(6),
    }),

    // -- Features
    defineField({name: 'featuresHeading', title: 'Heading', type: 'text', rows: 2, group: 'features'}),
    defineField({name: 'featuresIntro', title: 'Intro', type: 'text', rows: 3, group: 'features'}),
    defineField({
      name: 'features',
      type: 'array',
      group: 'features',
      of: [defineArrayMember({type: 'featureItem'})],
    }),
    defineField({
      name: 'featureScreenshots',
      title: 'Screenshots',
      type: 'array',
      group: 'features',
      description: 'Shown in a scrolling row beneath the feature grid.',
      of: [defineArrayMember({type: 'captionedImage'})],
    }),

    // -- Keyboard
    defineField({name: 'keyboardHeading', title: 'Heading', type: 'text', rows: 2, group: 'keyboard'}),
    defineField({name: 'keyboardIntro', title: 'Intro', type: 'text', rows: 3, group: 'keyboard'}),
    defineField({
      name: 'shortcuts',
      type: 'array',
      group: 'keyboard',
      of: [defineArrayMember({type: 'shortcutItem'})],
    }),

    // -- iPhone
    defineField({name: 'iosHeading', title: 'Heading', type: 'text', rows: 2, group: 'ios'}),
    defineField({
      name: 'iosStatus',
      title: 'Status',
      type: 'string',
      group: 'ios',
      description: 'A short label beside the heading, e.g. "In development". Hidden once the App Store URL is set.',
    }),
    defineField({name: 'iosBody', title: 'Body', type: 'richText', group: 'ios'}),
    defineField({
      name: 'iosScreenshot',
      title: 'Screenshot',
      type: 'captionedImage',
      group: 'ios',
      description: 'A portrait iPhone screenshot. Until one exists, the site draws a stand-in.',
    }),

    // -- Privacy
    defineField({name: 'privacyHeading', title: 'Heading', type: 'text', rows: 2, group: 'privacy'}),
    defineField({name: 'privacyBody', title: 'Body', type: 'richText', group: 'privacy'}),

    // -- Pricing
    defineField({
      name: 'pricingHeading',
      title: 'Heading',
      type: 'text',
      rows: 2,
      group: 'pricing',
      description: 'Write {price} to insert the price.',
    }),
    defineField({name: 'pricingIntro', title: 'Intro', type: 'text', rows: 3, group: 'pricing'}),
    defineField({name: 'buyTitle', title: 'Buy — title', type: 'string', group: 'pricing'}),
    defineField({
      name: 'buyBody',
      title: 'Buy — body',
      type: 'text',
      rows: 3,
      group: 'pricing',
      description: 'Write {price} to insert the price.',
    }),
    defineField({name: 'buildTitle', title: 'Build — title', type: 'string', group: 'pricing'}),
    defineField({name: 'buildBody', title: 'Build — body', type: 'text', rows: 3, group: 'pricing'}),

    // -- Requirements
    defineField({
      name: 'requirementsHeading',
      title: 'Heading',
      type: 'text',
      rows: 2,
      group: 'requirements',
    }),
    defineField({
      name: 'requirementsIntro',
      title: 'Intro',
      type: 'text',
      rows: 3,
      group: 'requirements',
      description: 'Be honest here. A narrow audience told plainly is more persuasive than a hedge.',
    }),
    defineField({
      name: 'requirements',
      type: 'array',
      group: 'requirements',
      of: [defineArrayMember({type: 'qualityItem'})],
    }),

    // -- CTA
    defineField({name: 'ctaHeading', title: 'Heading', type: 'text', rows: 2, group: 'cta'}),
    defineField({name: 'ctaBody', title: 'Body', type: 'text', rows: 3, group: 'cta'}),
    defineField({
      name: 'ctaSubscribeLabel',
      title: 'Subscribe button label',
      type: 'string',
      group: 'cta',
      initialValue: 'Keep me posted',
    }),

    defineField({name: 'seo', type: 'seo', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Home page'})},
})
