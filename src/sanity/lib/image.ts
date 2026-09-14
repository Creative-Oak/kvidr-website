import {createImageUrlBuilder} from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/image-url'

const builder = createImageUrlBuilder({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
})

export function urlForImage(source: SanityImageSource) {
  return builder.image(source).auto('format').fit('max')
}

/** Sanity stores dimensions in the asset id — read them so we can reserve layout space. */
export function imageDimensions(source: any): {width: number; height: number} | null {
  const ref: string | undefined = source?.asset?._ref ?? source?.asset?._id
  if (!ref) return null
  const match = ref.match(/-(\d+)x(\d+)-/)
  if (!match) return null
  return {width: Number(match[1]), height: Number(match[2])}
}
