import type {SchemaTypeDefinition} from 'sanity'

import {aboutPage} from './documents/aboutPage'
import {author} from './documents/author'
import {changelogEntry} from './documents/changelogEntry'
import {contactPage} from './documents/contactPage'
import {homePage} from './documents/homePage'
import {post} from './documents/post'
import {pricingPage} from './documents/pricingPage'
import {siteSettings} from './documents/siteSettings'

import {captionedImage} from './objects/captionedImage'
import {faqItem} from './objects/faqItem'
import {featureItem} from './objects/featureItem'
import {link} from './objects/link'
import {pricingPlan} from './objects/pricingPlan'
import {qualityItem} from './objects/qualityItem'
import {richText} from './objects/richText'
import {seo} from './objects/seo'
import {shortcutItem} from './objects/shortcutItem'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  siteSettings,
  homePage,
  pricingPage,
  aboutPage,
  contactPage,
  post,
  author,
  changelogEntry,
  // Objects
  richText,
  captionedImage,
  seo,
  link,
  qualityItem,
  featureItem,
  shortcutItem,
  pricingPlan,
  faqItem,
]

/** Document types that exist exactly once. */
export const singletonTypes = new Set(['siteSettings', 'homePage', 'pricingPage', 'aboutPage', 'contactPage'])
