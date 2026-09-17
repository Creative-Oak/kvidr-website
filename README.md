# kvidr.app

The website for [kvidr](https://github.com/Creative-Oak/native-nextcloud-chat) — native
Nextcloud Talk for Mac and iPhone. The Mac app came first; the iPhone app is in development. The app is MIT licensed; the
signed build costs a small price, and anyone can build it themselves for free.

Astro in SSR mode, Sanity for content, with Presentation live preview. Deployed as a
container on Coolify.

## Quick start

```bash
npm install
cp .env.example .env      # then fill in the values below
npm run dev               # http://localhost:4321, Studio at /studio
```

### Environment

| Variable | Required | Notes |
| --- | --- | --- |
| `PUBLIC_SANITY_PROJECT_ID` | yes | `9c35nr1d` |
| `PUBLIC_SANITY_DATASET` | yes | `production` |
| `PUBLIC_SITE_URL` | yes | Canonical origin. Used for canonical URLs, OG tags and the sitemap. |
| `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` | yes | `true` locally, `false` in production. |
| `SANITY_API_READ_TOKEN` | when visual editing is on | A **Viewer** token. Required for drafts and stega. |
| `RESEND_API_KEY` | for the forms | Without it, both forms return a clear "not connected yet" message instead of failing silently. |
| `RESEND_AUDIENCE_ID` | optional | If set, signups go to that Resend audience. If not, they arrive as email to `CONTACT_TO_EMAIL`. |
| `RESEND_FROM_EMAIL` | for the forms | Must be a verified Resend sender, e.g. `kvidr <hello@kvidr.app>`. |
| `CONTACT_TO_EMAIL` | for the forms | Where contact messages land. |
| `PUBLIC_UMAMI_SCRIPT_URL` | optional | Both Umami variables must be set or no script is emitted. |
| `PUBLIC_UMAMI_WEBSITE_ID` | optional | |

`PUBLIC_*` values are inlined at **build** time. Everything else is read at runtime.

## Editing content

The Studio is embedded at **`/studio`** — there is no separate studio to deploy.

- **Home page**, **Pricing page**, **About page**, **Contact page** and **Site settings** are singletons.
  They cannot be duplicated or deleted, and they are pinned to the top of the sidebar.
- **Blog** and **Changelog** are ordinary document lists.
- **Preview** (the tab next to Structure) opens Presentation: the site renders in a frame,
  and clicking any text jumps to the field that produced it.

Page *structure* is code; page *copy* is content. Sections whose content is empty do not
render, so removing all the shortcuts removes the keyboard section rather than leaving a
heading over nothing.

### Screenshots

The hero, the problem section and the feature gallery all take a screenshot. Until one is
uploaded, the hero draws a hand-built stand-in of the app and labels it as an illustration.
Upload real screenshots in the Studio and the stand-in disappears on its own.

### Price, purchase and the iPhone app

The Mac app is sold two ways, and both prices live once, in **Site settings**:

| Setting | Current | Token in copy |
| --- | --- | --- |
| Mac price — bought here (licence code) | $2.99 | `{price}` |
| Macs per licence code | 5 | `{seats}` |
| Mac price — Mac App Store | $3.99 | `{appStorePrice}` |

Copy on the home and pricing pages — including rich text such as FAQ answers — can write those
tokens and gets the formatted value. Change a price once and every page follows.

The purchase links are intentionally empty until they exist:

- **Mac purchase URL — bought here**: while empty, the hero says "Read the source" and the buy
  options say "On sale here soon". Once set, they become "Buy for Mac $2.99".
- **Mac App Store URL**: while empty, "Coming to the Mac App Store". Once set, a "Mac App
  Store $3.99" button appears beside the direct one.
- **iPhone App Store URL**: while empty, the iPhone section and plan show "In development" and
  point at the mailing list. Once set, they show "View on the App Store".

The iPhone app is a separate purchase; nothing on the site implies the Mac purchase covers it.
The home page emits `SoftwareApplication` structured data with one offer per way to buy.

**`/pricing`** is its own page, edited in **Pricing page**. Each plan picks a platform, a price
type (direct, Mac App Store, free, or to be announced — the prices themselves always come from
Site settings) and an action. It also carries a plain-language MIT summary, the refund policy
at **`/pricing#refunds`** — use that URL where a payment provider asks for a refund policy — and
questions rendered as native `<details>` and emitted as `FAQPage` structured data.

### Brand and colour

Design sources live in **`brand/source`** — `logo.svg` and the Icon Composer bundles and
exports. They are deliberately *not* in `public/`: that folder is served to the world and
baked into the image, and the sources are ~6 MB. `node scripts/brand.mjs` derives what the
site actually uses into `public/brand/`, `public/favicon.svg`, `public/apple-touch-icon.png`
and `public/og.png`. Change a source, rerun the script.

The palette is taken from the logo's gradient stops — sky `#2292ec → #5ac7fc`, teal
`#4ad2d0 → #1da7b8`, and the bird's pale `#c9e6fb`. Those raw values are only used
decoratively (glows, the mock app, the icon), because the light ends are too pale to carry
text. For text and buttons the sky is deepened to `--accent: #1670c4` and the teal to
`--teal: #0f7382`, which both pass WCAG AA on the paper and under white text. In dark mode
it flips: the logo's light ends are the legible ones, so they are used as-is.

Sky is the primary voice (links, buttons, the outgoing bubble); teal is the second (numbers,
alternating feature icons, the status dot) — the same way the teal bubble sits behind the
blue one in the icon.

### Two things worth knowing before you edit

**Glass belongs to the floating layer.** The app applies Liquid Glass to message actions,
panels and pills, and deliberately not to the transcript, because the transcript is content.
The site follows the same rule: the navigation bar, keycaps, window title bars and the
subscribe field are glass; headlines, prose and screenshots sit flat on the paper. Adding a
`backdrop-filter` to a block of text breaks the idea.

**Stega has to come off anything that is not displayed text.** Visual editing works by
hiding invisible characters inside strings so Presentation can map rendered text back to its
field. Those characters are harmless in a paragraph and destructive anywhere else — an icon
name stops matching, a shortcut grows phantom keycaps, a `<title>` fills with junk. Any
value used as logic, parsed as data, or written into an HTML attribute must go through
`clean()` from `src/sanity/lib/stega.ts` first. Displayed text must *not*, or you lose
click-to-edit on it.

## Licence

MIT. See [LICENSE](LICENSE).

Nextcloud and Nextcloud Talk are trademarks of Nextcloud GmbH. This project is independent
and is not affiliated with or endorsed by Nextcloud.
