# kvidr.app

The website for [kvidr](https://github.com/Magniswerfer/native-nextcloud-chat) — a native
macOS client for Nextcloud Talk.

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

- **Home page**, **About page**, **Contact page** and **Site settings** are singletons.
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

### The download button

`Site settings → Download URL` is intentionally empty. While it is empty, the hero's primary
button reads "Read the source" and points at GitHub. Fill it in and the button becomes
"Download for macOS". Nothing else needs to change.

## Deploying to Coolify

Build pack: **Dockerfile**. Port **4321**.

Set these as *both* build and runtime variables, because Astro inlines them at build time:

```
PUBLIC_SANITY_PROJECT_ID=9c35nr1d
PUBLIC_SANITY_DATASET=production
PUBLIC_SITE_URL=https://kvidr.app
PUBLIC_SANITY_VISUAL_EDITING_ENABLED=false
```

Set these as **runtime only** — never as build args, or they end up in image layers:

```
SANITY_API_READ_TOKEN=…      # only if you turn visual editing on in production
RESEND_API_KEY=…
RESEND_AUDIENCE_ID=…
RESEND_FROM_EMAIL=kvidr <hello@kvidr.app>
CONTACT_TO_EMAIL=…
```

The container runs as a non-root user and has a healthcheck on `/robots.txt` — chosen so a
Sanity outage does not restart the container.

### CORS

`https://kvidr.app` and `https://www.kvidr.app` are already allowed on the Sanity project.
Add any other origin that needs to host the Studio with:

```bash
npx sanity cors add https://example.com --credentials
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with live preview. |
| `npm run build` | Production build into `dist/`. |
| `npm run start` | Runs the built server (what the container does). |
| `npm run check` | Astro + TypeScript diagnostics. |
| `node scripts/og.mjs` | Regenerates `public/og.png` and `public/apple-touch-icon.png`. |
| `SANITY_WRITE_TOKEN=… node scripts/seed.mjs` | Re-seeds the dataset. **Overwrites Studio edits** — for bootstrapping only. |

## How it is put together

```
src/
├── components/     UI. WindowFrame + AppMock draw the macOS window and its stand-in.
├── layouts/        Layout.astro — head, fonts, header/footer, reveal motion, visual editing.
├── lib/            Framework-free helpers (shortcut parsing, rate limiting).
├── pages/          Routes, plus /api/subscribe and /api/contact.
├── sanity/
│   ├── lib/        loadQuery (drafts + stega), GROQ queries, image URLs, stega cleaning.
│   └── schemaTypes/  Documents and objects.
└── styles/global.css   Design tokens and primitives.
```

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
