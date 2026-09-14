/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

interface ImportMetaEnv {
  readonly PUBLIC_SANITY_PROJECT_ID: string
  readonly PUBLIC_SANITY_DATASET: string
  readonly PUBLIC_SANITY_VISUAL_EDITING_ENABLED: string
  readonly PUBLIC_SITE_URL: string
  readonly PUBLIC_UMAMI_SCRIPT_URL: string
  readonly PUBLIC_UMAMI_WEBSITE_ID: string
  readonly SANITY_API_READ_TOKEN: string
  readonly RESEND_API_KEY: string
  readonly RESEND_AUDIENCE_ID: string
  readonly RESEND_FROM_EMAIL: string
  readonly CONTACT_TO_EMAIL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
