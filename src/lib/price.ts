import {clean} from '../sanity/lib/stega'

export interface PriceSettings {
  priceAmount?: number | null
  priceCurrency?: string | null
}

/** "$2.99" — or null when no price is set, so callers can hide what depends on it. */
export function formatPrice(settings: PriceSettings | null | undefined): string | null {
  const amount = settings?.priceAmount
  if (typeof amount !== 'number' || Number.isNaN(amount)) return null

  // The currency code is used as data, so the stega characters have to come off.
  const currency = clean(settings?.priceCurrency) || 'USD'
  try {
    return new Intl.NumberFormat('en-US', {style: 'currency', currency}).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency}`
  }
}

/**
 * Replaces {price} in editor-written copy. The surrounding text keeps its stega
 * encoding, so click-to-edit in Presentation still lands on the right field.
 */
export function withPrice(text: string | null | undefined, price: string | null): string {
  if (!text) return ''
  return price ? text.replaceAll('{price}', price) : text.replaceAll('{price}', '').trim()
}
