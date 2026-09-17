import groq from 'groq'

const imageFields = groq`
  _type,
  asset,
  alt,
  caption,
  windowTitle,
  "lqip": asset->metadata.lqip
`

const richTextFields = groq`
  ...,
  _type == "captionedImage" => { ${imageFields} }
`

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    tagline,
    githubUrl,
    downloadUrl,
    iosAppStoreUrl,
    priceAmount,
    priceCurrency,
    contactEmail,
    navLinks[]{label, href},
    footerLinks[]{label, href},
    footerNote,
    seo{title, description, image{${imageFields}}}
  }
`

export const homePageQuery = groq`
  *[_type == "homePage"][0]{
    eyebrow,
    headline,
    lede,
    heroPriceNote,
    statusNote,
    heroScreenshot{${imageFields}},

    problemHeading,
    problemBody[]{${richTextFields}},
    problemScreenshot{${imageFields}},

    qualitiesHeading,
    qualities[]{_key, title, body},

    featuresHeading,
    featuresIntro,
    features[]{_key, title, body, symbol},
    featureScreenshots[]{${imageFields}, "_key": _key},

    keyboardHeading,
    keyboardIntro,
    shortcuts[]{_key, keys, action},

    iosHeading,
    iosStatus,
    iosBody[]{${richTextFields}},
    iosScreenshot{${imageFields}},

    privacyHeading,
    privacyBody[]{${richTextFields}},

    pricingHeading,
    pricingIntro,
    buyTitle,
    buyBody,
    buildTitle,
    buildBody,

    requirementsHeading,
    requirementsIntro,
    requirements[]{_key, title, body},

    ctaHeading,
    ctaBody,
    ctaSubscribeLabel,

    seo{title, description, image{${imageFields}}}
  }
`

export const pricingPageQuery = groq`
  *[_type == "pricingPage"][0]{
    eyebrow,
    headline,
    lede,
    plans[]{_key, platform, title, priceType, priceNote, status, body, includes, action},
    sameAppNote,
    licenceHeading,
    licenceBody[]{${richTextFields}},
    faqHeading,
    faq[]{_key, question, answer[]{${richTextFields}}},
    ctaHeading,
    ctaBody,
    seo{title, description, image{${imageFields}}}
  }
`

export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0]{
    eyebrow,
    headline,
    lede,
    portrait{${imageFields}},
    body[]{${richTextFields}},
    seo{title, description, image{${imageFields}}}
  }
`

export const contactPageQuery = groq`
  *[_type == "contactPage"][0]{
    eyebrow,
    headline,
    lede,
    body[]{${richTextFields}},
    seo{title, description, image{${imageFields}}}
  }
`

export const postsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    coverImage{${imageFields}},
    author->{name, role}
  }
`

export const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    coverImage{${imageFields}},
    author->{name, role, image{${imageFields}}, bio},
    body[]{${richTextFields}},
    seo{title, description, image{${imageFields}}}
  }
`

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)].slug.current
`

export const changelogQuery = groq`
  *[_type == "changelogEntry"] | order(releasedAt desc){
    _id,
    version,
    releasedAt,
    headline,
    body[]{${richTextFields}}
  }
`
