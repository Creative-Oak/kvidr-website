/**
 * The site's content, as Sanity documents.
 *
 * Every factual claim comes from the app repository's README, CHANGELOG,
 * docs/PRODUCT.md and LICENSE, or from decisions stated by the maintainer
 * (pricing, the iPhone app). Nothing is invented. Used by seed.mjs to create a
 * dataset from scratch, and by migrations to patch an existing one.
 */

/* ---------- portable text helpers ---------- */
let keySeed = 0
const key = () => `k${(keySeed++).toString(36)}${Date.now().toString(36).slice(-4)}`

/** Turns "plain text with [a link](https://…) and `code`" into a block. */
const block = (text, style = 'normal') => {
  const children = []
  const markDefs = []
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*/g

  let last = 0
  let match
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      children.push({_type: 'span', _key: key(), text: text.slice(last, match.index), marks: []})
    }
    if (match[1]) {
      const defKey = key()
      markDefs.push({_type: 'linkAnnotation', _key: defKey, href: match[2]})
      children.push({_type: 'span', _key: key(), text: match[1], marks: [defKey]})
    } else if (match[3]) {
      children.push({_type: 'span', _key: key(), text: match[3], marks: ['code']})
    } else {
      children.push({_type: 'span', _key: key(), text: match[4], marks: ['strong']})
    }
    last = pattern.lastIndex
  }
  if (last < text.length) {
    children.push({_type: 'span', _key: key(), text: text.slice(last), marks: []})
  }

  return {_type: 'block', _key: key(), style, markDefs, children}
}

const bullet = (text) => ({...block(text), listItem: 'bullet', level: 1})
const keyed = (items) => items.map((item) => ({_key: key(), ...item}))

const GITHUB = 'https://github.com/Creative-Oak/native-nextcloud-chat'

/* ---------- documents ---------- */

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  tagline: 'Native Nextcloud Talk for Mac and iPhone. Open source, MIT licensed.',
  githubUrl: GITHUB,
  priceAmount: 2.99,
  appStorePriceAmount: 3.99,
  licenceSeats: 5,
  priceCurrency: 'USD',
  contactEmail: 'hello@kvidr.app',
  // Changelog lives in the footer: five links do not fit a phone's header.
  navLinks: keyed([
    {_type: 'link', label: 'Pricing', href: '/pricing'},
    {_type: 'link', label: 'Blog', href: '/blog'},
    {_type: 'link', label: 'About', href: '/about'},
    {_type: 'link', label: 'Contact', href: '/contact'},
  ]),
  footerLinks: keyed([
    {_type: 'link', label: 'Home', href: '/'},
    {_type: 'link', label: 'Pricing', href: '/pricing'},
    {_type: 'link', label: 'Blog', href: '/blog'},
    {_type: 'link', label: 'Changelog', href: '/changelog'},
    {_type: 'link', label: 'About', href: '/about'},
    {_type: 'link', label: 'Contact', href: '/contact'},
  ]),
  footerNote:
    '© 2026 kvidr. The source is MIT licensed; the signed builds are paid.\nNextcloud and Nextcloud Talk are trademarks of Nextcloud GmbH. This project is independent, and is not affiliated with or endorsed by Nextcloud.',
  seo: {
    _type: 'seo',
    title: 'kvidr — native Nextcloud Talk for Mac and iPhone',
    description:
      'Nextcloud Talk as genuinely native apps for Mac and iPhone. MIT licensed: a small price for the signed build, or free to build yourself.',
  },
}

const homePage = {
  _id: 'homePage',
  _type: 'homePage',

  eyebrow: 'Native Nextcloud Talk · Mac first, iPhone next',
  headline: 'Nextcloud Talk,\nnative on Mac\nand iPhone.',
  lede: 'Swift and SwiftUI, on each platform’s own terms. No Electron. No web view rendering your messages. Your conversations are on screen before the first network call returns.',
  heroPriceNote: 'Open source under MIT. The Mac app is from {price}, with updates included — or build it yourself, free.',
  statusNote: 'v1.0 — chat, complete. Calls are deliberately out of scope.',

  problemHeading: 'A good protocol, wearing a browser.',
  problemBody: [
    block(
      'Nextcloud Talk is a sound piece of infrastructure. Its HTTP API is documented, it long-polls properly, and it is yours to host. The trouble starts at the surface: a web app in a tab, or a web app wrapped in a desktop shell, which is the same web app with a worse relationship to your keyboard.',
    ),
    block(
      'So text selection behaves almost like text selection. On the Mac the menu bar is almost real; on a phone, it is a website pretending to be an app. Nothing is broken, exactly — it just never stops reminding you where it came from.',
    ),
    block(
      'kvidr takes the other half of the deal. Nextcloud is the backend and the protocol; Apple’s own Messages is the benchmark for how it should feel, on the Mac and on the iPhone. Where the two disagree, kvidr follows the platform.',
    ),
  ],

  qualitiesHeading: 'Six promises, written as acceptance criteria.',
  qualities: keyed([
    {
      _type: 'qualityItem',
      title: 'Instant',
      body: 'The cached conversation list is on screen before the first network call returns. Opening a cached conversation shows its messages in the same runloop turn.',
    },
    {
      _type: 'qualityItem',
      title: 'Native',
      body: 'The platform’s own controls, menus, text selection and navigation — and on the Mac, real menu bar commands and window restoration. Not approximations of them.',
    },
    {
      _type: 'qualityItem',
      title: 'Trustworthy unread',
      body: 'A message is never marked read because it was downloaded. Only because it was selected, in a key window, and actually put in front of you.',
    },
    {
      _type: 'qualityItem',
      title: 'Never janky',
      body: 'Scrolling a ten-thousand-message conversation stays smooth. One incoming message re-renders one row, not the whole transcript.',
    },
    {
      _type: 'qualityItem',
      title: 'Calm',
      body: 'Errors are quiet inline state, not modal alerts. Loading states are subtle. There is no spinner on launch.',
    },
    {
      _type: 'qualityItem',
      title: 'Offline-tolerant',
      body: 'No network means a slightly dimmer app, not an error page. Everything already fetched stays readable, and drafts survive quitting.',
    },
  ]),

  featuresHeading: 'Everything you actually do in a day.',
  featuresIntro:
    'Everything below ships in the Mac app today; the iPhone app is being built on the same foundations. Every feature is gated on what your server reports it can do, rather than on a version number — so anything your Nextcloud lacks is hidden, not broken.',
  features: keyed([
    {
      _type: 'featureItem',
      title: 'A sidebar that is already there',
      body: 'Avatars, favourites, unread counts and mention state, grouped into Favourites, Conversations and Archived. Painted from cache before any request is made.',
      symbol: 'sidebar',
    },
    {
      _type: 'featureItem',
      title: 'Messages as native text',
      body: 'Markdown, mentions, links, code, quotes, files and rich objects — rendered as real text with real selection. Never as HTML, never in a web view.',
      symbol: 'bubble',
    },
    {
      _type: 'featureItem',
      title: 'Replies, reactions, edits',
      body: 'Optimistic sending with retry, threaded replies, reactions with a who-reacted popover, and editing or deleting wherever the server allows it.',
      symbol: 'sync',
    },
    {
      _type: 'featureItem',
      title: 'Read markers that mean it',
      body: 'The conversation has to be selected, the app frontmost, the window key, and the transcript at the bottom. Four conditions, all required.',
      symbol: 'bell',
    },
    {
      _type: 'featureItem',
      title: 'Attachments, properly',
      body: 'Drag-and-drop, ⇧⌘A or paste, with real upload progress. Images preview inline with an in-app viewer. A name clash gets a number, not someone else’s overwritten file.',
      symbol: 'paperclip',
    },
    {
      _type: 'featureItem',
      title: 'Search that reaches the server',
      body: '⌥⌘F finds inside the open conversation instantly. ⇧⌘F searches your whole history on the server, across every conversation, and takes you to the message.',
      symbol: 'search',
    },
    {
      _type: 'featureItem',
      title: 'Live, without refreshing',
      body: 'Talk’s long poll with backoff and a visible reconnecting state. Notifications and a Dock badge, including a preview-free mode for shared screens.',
      symbol: 'bolt',
    },
    {
      _type: 'featureItem',
      title: 'An inspector, not a dashboard',
      body: 'A third column with conversation info, participants you can invite and remove, and shared files by kind. ⌘N creates a conversation using Nextcloud’s own people search.',
      symbol: 'keyboard',
    },
  ]),

  keyboardHeading: 'On the Mac, the whole app without the mouse.',
  keyboardIntro:
    'Every command has a shortcut, and ⌘/ opens a window listing all of them. A representative handful:',
  shortcuts: keyed([
    {_type: 'shortcutItem', keys: '⌘K', action: 'Go to conversation (quick switcher)'},
    {_type: 'shortcutItem', keys: '⌘F', action: 'Search conversations'},
    {_type: 'shortcutItem', keys: '⇧⌘F', action: 'Search messages on the server'},
    {_type: 'shortcutItem', keys: '⌥⌘F', action: 'Find in conversation'},
    {_type: 'shortcutItem', keys: '⌥⌘↑ / ⌥⌘↓', action: 'Previous / next conversation'},
    {_type: 'shortcutItem', keys: '⇧⌘]', action: 'Next unread conversation'},
    {_type: 'shortcutItem', keys: '⇧⌘K', action: 'Focus the message field'},
    {_type: 'shortcutItem', keys: '⌘↑', action: 'Edit your last message'},
    {_type: 'shortcutItem', keys: '⇧⌘R', action: 'Reply to the newest message'},
    {_type: 'shortcutItem', keys: '⇧⌘U', action: 'Mark as unread'},
    {_type: 'shortcutItem', keys: '⇧⌘A', action: 'Attach a file'},
    {_type: 'shortcutItem', keys: '⌘N', action: 'New conversation'},
    {_type: 'shortcutItem', keys: '⌥⌘I', action: 'Show conversation details'},
    {_type: 'shortcutItem', keys: '⌘/', action: 'Keyboard shortcuts'},
  ]),

  iosHeading: 'Next: the iPhone.',
  iosStatus: 'In development',
  iosBody: [
    block(
      'An iPhone app is in development, built the same way as the Mac app: Swift and SwiftUI, talking directly to the documented Nextcloud Talk APIs, with no web view anywhere near your messages.',
    ),
    block(
      'The Mac app already keeps everything below the interface in its own Swift package, with no SwiftUI in it. That is what makes an iPhone app a second interface rather than a second app.',
    ),
    block(
      'It is not ready, and there is no date yet. It will be its own purchase — buying the Mac app does not include it. Join the list at the bottom of this page to hear when it is ready.',
    ),
  ],

  privacyHeading: 'Your password is never typed into this app.',
  privacyBody: [
    block(
      'kvidr signs in with **Login Flow v2**. You type a server address; the app opens your browser; you approve it there; the app receives a device-specific app password. Your actual Nextcloud password is never typed into, and never seen by, this application.',
    ),
    block(
      'That app password lives in the macOS Keychain — never in preferences, never in the cache, never in a log — and it is revoked the moment you remove the account.',
    ),
    block('The rest of the posture follows from the same instinct:'),
    bullet('HTTPS is required. Plain HTTP is possible only for `localhost` and private-network addresses, and only after you turn it on deliberately.'),
    bullet('No remote HTML and no remote JavaScript, anywhere in the message pipeline. There is no `WKWebView` rendering chat content, so there is nothing for a message to execute in.'),
    bullet('There are no credentials in the repository, and no analytics inside the app.'),
    block(
      `All of which you can check rather than take on faith — the [source is on GitHub](${GITHUB}).`,
    ),
  ],

  pricingHeading: 'Free to read. Free to build.\n{price} to skip the build.',
  pricingIntro:
    'kvidr is MIT licensed, all of it. Paying buys convenience, not features: the app you buy and the app you compile are the same app, and future updates are included.',
  buyTitle: 'Buy the Mac app',
  buyBody:
    '{price} here, with a licence code for up to {seats} Macs — or {appStorePrice} on the Mac App Store. Signed and ready to run, with future updates included.',
  buildTitle: 'Build it yourself',
  buildBody:
    'Clone the repository, open it in Xcode 26 and sign it with your own Apple developer account. Everything you need is in the README, and nothing is held back.',

  requirementsHeading: 'A narrow tool. Here is exactly how narrow.',
  requirementsIntro:
    'This is not for everyone, and pretending otherwise would waste your time. If any line below is a no, kvidr is not yet for you.',
  requirements: keyed([
    {
      _type: 'qualityItem',
      title: 'On the Mac: macOS 26 or later',
      body: 'The app targets macOS 26 and uses Liquid Glass on its floating layer. There is no build for earlier versions.',
    },
    {
      _type: 'qualityItem',
      title: 'An iPhone — soon',
      body: 'The iPhone app is in development. What it needs will be listed here when it ships, not guessed at before.',
    },
    {
      _type: 'qualityItem',
      title: 'A Nextcloud server with Talk',
      body: 'Your own, or one you have an account on. kvidr is a client; it hosts nothing and stores nothing on anyone else’s behalf.',
    },
    {
      _type: 'qualityItem',
      title: 'The Mac app, or Xcode 26',
      body: 'Buy it here or on the Mac App Store, or compile it yourself in Xcode 26 and sign it with your own Apple developer account. Same app either way.',
    },
    {
      _type: 'qualityItem',
      title: 'Text chat only',
      body: 'Calls, audio, video and screen sharing are deliberately out of scope for v1. The architecture leaves room for them; nothing here depends on them.',
    },
  ]),

  ctaHeading: 'Want to know when there is something to download?',
  ctaBody:
    'kvidr was written without a macOS SDK — type-checked against stand-in frameworks and verified in CI, but not yet launched on a Mac. When the signed build is ready, and later the iPhone app, this list is how you will hear about it.',
  ctaSubscribeLabel: 'Keep me posted',

  seo: {
    _type: 'seo',
    title: 'kvidr — native Nextcloud Talk for Mac and iPhone',
    description:
      'Nextcloud Talk as genuinely native apps for Mac and iPhone. Instant from cache, no web view, MIT licensed — and a small price for the signed build.',
  },
}

const aboutPage = {
  _id: 'aboutPage',
  _type: 'aboutPage',
  eyebrow: 'About',
  headline: 'Why this exists.',
  lede: 'A question worth answering properly: if Apple built lightweight native apps for Nextcloud Talk — on the Mac and on the iPhone — what would they feel like?',
  body: [
    block(
      'Self-hosting solves the part of messaging that is about ownership. It rarely solves the part that is about craft. You get your data back and hand over your afternoon to an interface that is technically fine and never quite pleasant.',
    ),
    block(
      'kvidr is an attempt to have both. Nextcloud supplies the backend and the protocol — documented HTTP APIs, a proper long poll, a server you control. The apps supply everything above that line, and take their cues from Apple’s Messages rather than from Talk’s web UI. The Mac came first; the iPhone is next.',
    ),
    block('What that rules out', 'h2'),
    block(
      'The list of things kvidr is not turned out to be as useful as the list of things it is. It is not Electron. It is not a wrapper around the Talk web app. It is not a `WKWebView` rendering chat content — no remote HTML, no remote JavaScript, anywhere in the message pipeline. It is not a port of Talk’s web sidebar, and not a Slack or Teams visual clone.',
    ),
    block(
      'Constraints like these are easy to write down and awkward to keep. They are the reason the app is small.',
    ),
    block('How it was built', 'h2'),
    block(
      'Most of kvidr was written without a macOS SDK to hand. The non-UI half is a Swift package that builds and tests on Linux, which is what keeps the layering honest. The UI half is type-checked by a tool that stands in modules named SwiftUI, AppKit and SwiftData and runs the real sources through the Swift 6 type checker against them — all of it in CI.',
    ),
    block(
      'That catches a great deal, and there are things it cannot catch: SwiftData’s macros, the Keychain, and how Liquid Glass actually renders. Those wait for a Mac.',
    ),
    block('Why it costs money, and why it does not have to', 'h2'),
    block(
      `Everything is [open on GitHub](${GITHUB}) under the MIT licence — the app, the architecture notes, the API audit and the implementation plan. Anyone with a Mac and an Apple developer account can build kvidr, sign it and run it without paying anything.`,
    ),
    block(
      'The signed app is for everyone who would rather press a button than open Xcode. It costs a small price — on this site, or a little more on the Mac App Store — and future updates are included. That is the entire business model: convenience for a little money, with no features held back from people who build it themselves.',
    ),
    block('What is next', 'h2'),
    block(
      'An iPhone app. Keeping everything below the interface in a separate Swift package is what makes that realistic: a second interface on the same foundations, rather than a second app written from scratch.',
    ),
  ],
  seo: {
    _type: 'seo',
    description:
      'Why kvidr exists: Nextcloud for the backend, Messages.app for the benchmark, and a short list of things it deliberately is not.',
  },
}

const pricingPage = {
  _id: 'pricingPage',
  _type: 'pricingPage',
  eyebrow: 'Pricing',
  headline: 'Open source.\nFairly priced.',
  lede: 'Every line of kvidr is MIT licensed and free to build. Buying it is for not having to — updates included, and it pays for the work.',
  plans: keyed([
    {
      _type: 'pricingPlan',
      platform: 'mac',
      title: 'Buy it here',
      priceType: 'signed',
      priceNote: 'licence code for up to {seats} Macs',
      body: 'Buy it on this site, download the signed app and activate it with your licence code. It costs less here, because there is no store in the middle.',
      includes: [
        'Activate on up to {seats} Macs',
        'Future updates included',
        'Refunds, no reason needed',
      ],
      action: 'buy',
    },
    {
      _type: 'pricingPlan',
      platform: 'mac',
      title: 'Mac App Store',
      priceType: 'appstore',
      priceNote: 'through your Apple Account',
      body: 'The same app, bought, installed and updated through the Mac App Store.',
      includes: [
        'Future updates included',
        'Installs and updates through the App Store',
        'Refunds handled by Apple',
      ],
      action: 'macappstore',
    },
    {
      _type: 'pricingPlan',
      platform: 'mac',
      title: 'Build it yourself',
      priceType: 'free',
      priceNote: 'under the MIT licence',
      body: 'Clone the repository, open it in Xcode 26 and sign it with your own Apple developer account.',
      includes: [
        'The same app you can buy',
        'Every line of source, plus the architecture notes',
        'Yours to read, change and share under MIT',
      ],
      action: 'source',
    },
    {
      _type: 'pricingPlan',
      platform: 'iphone',
      title: 'iPhone app',
      priceType: 'tba',
      priceNote: 'sold separately',
      status: 'In development',
      body: 'Built on the same foundations as the Mac app. It will be its own app and its own purchase: buying the Mac app does not include it.',
      includes: [
        'Swift and SwiftUI, with no web view',
        'Talks directly to your Nextcloud server',
        'The same foundations as the Mac app',
      ],
      action: 'appstore',
    },
  ]),
  sameAppNote:
    'Every version is the same app, built from the same source, and every purchase includes future updates. Paying buys the build, not features.',

  licenceHeading: 'What MIT means here',
  licenceBody: [
    block('The source of kvidr is published under the MIT licence. In practice:'),
    bullet('You may use, copy, modify, merge, publish, distribute, sublicense and sell copies of it — including commercially.'),
    bullet('The one condition: keep the copyright and licence notice with any copy or substantial part of it.'),
    bullet('It comes with no warranty of any kind.'),
    block(`That is a summary, not the licence. [Read the licence itself](${GITHUB}/blob/main/LICENSE) on GitHub.`),
  ],

  refundsHeading: 'Refunds',
  refundsBody: [
    block(
      'If kvidr is not right for you, you can have your money back. [Get in touch](/contact), say which purchase it was, and it will be refunded — no forms, and no reason needed.',
    ),
    block(
      'Mac App Store purchases are paid to Apple, so Apple handles those refunds. You can request one at [reportaproblem.apple.com](https://reportaproblem.apple.com).',
    ),
  ],

  faqHeading: 'Questions',
  faq: keyed([
    {
      _type: 'faqItem',
      question: 'If it is open source, why does it cost money?',
      answer: [
        block(
          'Because building and maintaining a good app takes time, and a small price for the convenient version is an honest way to pay for it. Nobody has to pay: the source is MIT licensed and anyone can build it.',
        ),
      ],
    },
    {
      _type: 'faqItem',
      question: 'Why is it cheaper here than on the Mac App Store?',
      answer: [
        block(
          'Buying here skips the store in the middle, so it costs less: {price} instead of {appStorePrice}. It is the same app either way, and both include future updates.',
        ),
      ],
    },
    {
      _type: 'faqItem',
      question: 'Is the paid app different from the one I can compile?',
      answer: [
        block(
          'No. It is the same app, built from the same source. You are paying for the build, the signing and not having to open Xcode — not for features.',
        ),
      ],
    },
    {
      _type: 'faqItem',
      question: 'Are future updates included?',
      answer: [block('Yes — whether you bought kvidr here or on the Mac App Store.')],
    },
    {
      _type: 'faqItem',
      question: 'How many Macs can I use it on?',
      answer: [
        block(
          'A licence code bought here activates kvidr on up to {seats} Macs. Bought on the Mac App Store, it installs on the Macs signed in to your Apple Account.',
        ),
      ],
    },
    {
      _type: 'faqItem',
      question: 'Can I get a refund?',
      answer: [
        block(
          'Yes. If kvidr is not right for you, ask and you will get your money back — no reason needed. [See refunds](/pricing#refunds) for how, including for Mac App Store purchases.',
        ),
      ],
    },
    {
      _type: 'faqItem',
      question: 'What do I need to build it myself?',
      answer: [
        block(
          `A Mac running macOS 26, Xcode 26, and an Apple developer account to sign it with. The [repository’s README](${GITHUB}#readme) walks through building and signing.`,
        ),
      ],
    },
    {
      _type: 'faqItem',
      question: 'Does buying the Mac app include the iPhone app?',
      answer: [
        block(
          'No. The iPhone app will be a separate app and a separate purchase. Its price has not been decided and will be announced when it is ready — join the list below to hear about it.',
        ),
      ],
    },
    {
      _type: 'faqItem',
      question: 'Do I need a Nextcloud server?',
      answer: [
        block(
          'Yes. kvidr is a client, so you need an account on a Nextcloud server with the Talk app installed — your own, or one run by someone else.',
        ),
      ],
    },
    {
      _type: 'faqItem',
      question: 'Is kvidr made by Nextcloud?',
      answer: [
        block(
          'No. kvidr is an independent client that talks to Nextcloud Talk’s documented APIs. Nextcloud and Nextcloud Talk are trademarks of Nextcloud GmbH, which is not affiliated with and does not endorse this project.',
        ),
      ],
    },
  ]),

  ctaHeading: 'Hear when it is ready',
  ctaBody:
    'One email when the Mac app is on sale, and one when the iPhone app is. Nothing else.',

  seo: {
    _type: 'seo',
    description:
      'kvidr is MIT licensed and free to build. The Mac app is {price} here or {appStorePrice} on the Mac App Store, with future updates included. The iPhone app is sold separately.',
  },
}

const contactPage = {
  _id: 'contactPage',
  _type: 'contactPage',
  eyebrow: 'Contact',
  headline: 'Say something.',
  lede: 'Questions about the app, the approach, or running it against your own server. All of it is welcome.',
  body: [
    block('Where to put things', 'h2'),
    block(
      'Bugs and feature requests are better as GitHub issues than as email — they stay searchable, and other people find them. Use this form for anything else.',
    ),
    block(
      'Please do not send credentials, app passwords or server addresses you would rather keep private. Nothing here needs them.',
    ),
  ],
  seo: {
    _type: 'seo',
    description: 'Get in touch about kvidr — native Nextcloud Talk for Mac and iPhone.',
  },
}

const changelog100 = {
  _id: 'changelog-1-0-0',
  _type: 'changelogEntry',
  version: '1.0.0',
  releasedAt: '2026-09-14',
  headline: 'The first release: a native macOS client for Nextcloud Talk’s text chat.',
  body: [
    block('Accounts', 'h2'),
    bullet('Login Flow v2 only. You approve the app in your browser and it receives a device-specific app password; your Nextcloud password is never typed into, or seen by, this app.'),
    bullet('The app password lives in the macOS Keychain — never in preferences, the cache, or a log — and is revoked when you remove the account.'),
    bullet('Capability discovery on sign-in, refreshed when the server says its Talk configuration changed. Every feature is gated on a capability rather than a version number.'),

    block('Conversations', 'h2'),
    bullet('Sidebar with avatars, favourites, unread counts and mention state, grouped into Favourites, Conversations and Archived — painted from cache before any request is made.'),
    bullet('Incremental refresh using the server’s own modifiedSince cursor.'),
    bullet('Filter (⌘F), quick switcher (⌘K), next unread (⇧⌘]), mark as unread, favourite, mute, copy link, open in Nextcloud.'),
    bullet('⌘N creates a conversation — direct, group or open — using Nextcloud’s own people search.'),
    bullet('Moderator settings: rename, description, read-only, message expiration, link access and password, leave, delete.'),

    block('Reading', 'h2'),
    bullet('Backwards pagination, message grouping, day separators, and a new-messages marker that stays put while you read.'),
    bullet('Markdown, mentions, links, code, quotes and rich objects, rendered as native text — never as HTML, and never in a web view.'),
    bullet('Inline image previews with an in-app viewer that can save or open in Nextcloud.'),
    bullet('Read markers that move only when you have actually seen a message: conversation selected, app frontmost, window key, transcript at the bottom.'),
    bullet('Live updates over Talk’s long poll, with backoff and a visible reconnecting state.'),
    bullet('Everything readable offline from the cache.'),

    block('Writing', 'h2'),
    bullet('Optimistic sending with retry, replies, editing, deleting, reactions and a who-reacted popover.'),
    bullet('Mention autocomplete with Talk’s own participant search, including @all where the server permits it.'),
    bullet('Attachments by drag-and-drop, ⇧⌘A or paste, with real upload progress; a name clash gets a numbered name rather than overwriting someone’s file.'),
    bullet('Drafts survive quitting, including text typed in the last few hundred milliseconds.'),

    block('Finding things', 'h2'),
    bullet('⌥⌘F finds in the open conversation, over what you can see, instantly.'),
    bullet('⇧⌘F searches the server’s whole history — every conversation, or just this one — through Talk’s unified search provider, and takes you to the message.'),

    block('Around the app', 'h2'),
    bullet('A third-column inspector: conversation info, participants (invite and remove), and shared files by kind.'),
    bullet('Notifications and a Dock badge, with a preview-free mode for shared screens.'),
    bullet('Liquid Glass on macOS 26, applied to the floating layer — message actions, panels, reaction pills, upload rows — and deliberately not to the transcript, which is content.'),
    bullet('A keyboard shortcuts window (⌘/), because every command here has a shortcut.'),

    block('Not in this release', 'h2'),
    bullet('Calls. Deliberately out of scope; the architecture notes describe what is left open for them.'),
    bullet('Typing indicators and user-status editing, which need Talk’s signaling API.'),
    bullet('Interactive polls, voice messages, pins and reminders. Polls and voice messages are shown, not yet answered or played.'),
  ],
}

const author = {
  _id: 'author-magnus',
  _type: 'author',
  name: 'Magnus H. Kaspersen',
  role: 'Building kvidr',
}

const firstPost = {
  _id: 'post-no-web-view',
  _type: 'post',
  title: 'There is no web view in the message pipeline',
  slug: {_type: 'slug', current: 'no-web-view-in-the-message-pipeline'},
  publishedAt: '2026-09-14T09:00:00.000Z',
  excerpt:
    'The single constraint that shaped kvidr more than any other, and the three things it bought once it was non-negotiable.',
  author: {_type: 'reference', _ref: 'author-magnus'},
  body: [
    block(
      'Most of the design decisions in kvidr trace back to one line written early and never softened: no remote HTML and no remote JavaScript, anywhere in the message pipeline. No `WKWebView` renders chat content.',
    ),
    block(
      'It reads like a security rule, and it is one. But its real effect was on everything else.',
    ),
    block('You cannot borrow the web app’s rendering', 'h2'),
    block(
      'The cheap way to build a Talk client is to let the server’s own web UI draw the transcript and wrap it. Rule out the web view and that door closes. Markdown, mentions, links, code, quotes, files and rich objects all have to be rendered as native text.',
    ),
    block(
      'Which is more work, and then it is better. Native text has real selection, real find, real accessibility and real performance characteristics. One incoming message re-renders one row.',
    ),
    block('A message has nothing to execute in', 'h2'),
    block(
      'Chat content arrives from other people. If it is never HTML in a browser engine, then the whole category of "someone sent a message that ran something" stops applying. Not mitigated — absent.',
    ),
    block('It forces the layering to stay honest', 'h2'),
    block(
      'With no web view doing the heavy lifting, the non-UI half of the app has to stand on its own. It is a Swift package that builds and tests on Linux, with no SwiftUI anywhere in it. The moment something leaks across that boundary, the Linux build says so.',
    ),
    block(
      'The constraint turned out to be an architecture in disguise. Most of the good ones are.',
    ),
  ],
}

export const documents = {
  siteSettings,
  homePage,
  pricingPage,
  aboutPage,
  contactPage,
  author,
  firstPost,
  changelog100,
}
