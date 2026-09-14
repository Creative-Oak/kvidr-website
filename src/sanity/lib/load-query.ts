import type {QueryParams} from 'sanity'
import {sanityClient} from 'sanity:client'

export const visualEditingEnabled =
  import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === 'true'

const token = import.meta.env.SANITY_API_READ_TOKEN

if (visualEditingEnabled && !token) {
  throw new Error(
    'SANITY_API_READ_TOKEN is required when PUBLIC_SANITY_VISUAL_EDITING_ENABLED is "true". ' +
      'Create a Viewer token at sanity.io/manage and add it to .env.',
  )
}

/**
 * Fetches a GROQ query, adding drafts + stega encoding when visual editing is on
 * so Presentation can map rendered text back to the field that produced it.
 */
export async function loadQuery<T>({
  query,
  params,
}: {
  query: string
  params?: QueryParams
}): Promise<{data: T}> {
  const {result} = await sanityClient.fetch<T>(query, params ?? {}, {
    filterResponse: false,
    perspective: visualEditingEnabled ? 'drafts' : 'published',
    resultSourceMap: visualEditingEnabled ? 'withKeyArraySelector' : false,
    stega: visualEditingEnabled,
    ...(visualEditingEnabled ? {token} : {}),
    useCdn: !visualEditingEnabled,
  })

  return {data: result}
}
