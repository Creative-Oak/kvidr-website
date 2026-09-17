import {clean} from '../sanity/lib/stega'

export interface PriceSettings {
  priceAmount?: number | null
  appStorePriceAmount?: number | null
  licenceSeats?: number | null
  priceCurrency?: string | null
}

export interface PriceTokens {
  /** Mac app bought here, e.g. "$2.99". */
  price: string | null
  /** Mac app on the Mac App Store, e.g. "$3.99". */
  appStorePrice: string | null
  /** Macs per licence code, e.g. "5". */
  seats: string | null
}

const format = (amount: number | null | undefined, currency: string): string | null => {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return null
  try {
    return new Intl.NumberFormat('en-US', {style: 'currency', currency}).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency}`
  }
}

/** Every value copy can refer to, read once from Site settings. */
export function priceTokens(settings: PriceSettings | null | undefined): PriceTokens {
  // The currency code is used as data, so the stega characters have to come off.
  const currency = clean(settings?.priceCurrency) || 'USD'
  const seats = settings?.licenceSeats
  return {
    price: format(settings?.priceAmount, currency),
    appStorePrice: format(settings?.appStorePriceAmount, currency),
    seats: typeof seats === 'number' ? String(seats) : null,
  }
}

/** "$2.99" — or null when no price is set, so callers can hide what depends on it. */
export function formatPrice(settings: PriceSettings | null | undefined): string | null {
  return priceTokens(settings).price
}

/**
 * Replaces {price}, {appStorePrice} and {seats} in editor-written copy. The
 * surrounding text keeps its stega encoding, so click-to-edit in Presentation
 * still lands on the right field. A token with no value is removed rather than
 * shown raw.
 */
export function fill(text: string | null | undefined, tokens: PriceTokens): string {
  if (!text) return ''
  return replaceTokens(text, tokens).replace(/ {2,}/g, ' ').trim()
}

/**
 * Token replacement only — no tidying. Rich text is split into spans, and a
 * span's leading or trailing space is often the only thing separating a word
 * from the link beside it, so it must survive untouched.
 */
function replaceTokens(text: string, tokens: PriceTokens): string {
  return text.replace(/\{(price|appStorePrice|seats)\}/g, (_, key: keyof PriceTokens) => tokens[key] ?? '')
}

/** Kept for call sites that only know about the direct price. */
export function withPrice(text: string | null | undefined, price: string | null): string {
  return fill(text, {price, appStorePrice: null, seats: null})
}

/** The same replacement applied to every span of a Portable Text value. */
export function fillBlocks<T>(blocks: T, tokens: PriceTokens): T {
  if (!Array.isArray(blocks)) return blocks
  return blocks.map((block: any) =>
    block?._type === 'block' && Array.isArray(block.children)
      ? {
          ...block,
          children: block.children.map((child: any) =>
            typeof child?.text === 'string' ? {...child, text: replaceTokens(child.text, tokens)} : child,
          ),
        }
      : block,
  ) as T
}
