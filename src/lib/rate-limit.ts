/**
 * A deliberately small in-memory limiter. It is per-process, so it resets on
 * deploy and does not survive horizontal scaling — which is fine for the load
 * a contact form on a landing page actually sees.
 *
 * Counting is split in two on purpose. A generous *attempt* budget stops
 * someone hammering the endpoint, while a much stricter *success* budget stops
 * someone actually sending mail through it. Keeping them separate means four
 * typos in a row do not lock a real person out for an hour.
 */
const hits = new Map<string, number[]>()

const recent = (key: string, windowMs: number): number[] => {
  const now = Date.now()
  const kept = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  hits.set(key, kept)
  return kept
}

const sweep = (windowMs: number) => {
  if (hits.size <= 5000) return
  const now = Date.now()
  for (const [key, times] of hits) {
    if (times.every((t) => now - t >= windowMs)) hits.delete(key)
  }
}

/** True while the key is under its limit. Does not count against it. */
export function withinLimit(key: string, limit: number, windowMs = 60 * 60 * 1000): boolean {
  return recent(key, windowMs).length < limit
}

/** Counts one use against the key. */
export function recordHit(key: string, windowMs = 60 * 60 * 1000): void {
  const times = recent(key, windowMs)
  times.push(Date.now())
  hits.set(key, times)
  sweep(windowMs)
}

/** Checks and counts in one step, for callers that want every attempt counted. */
export function rateLimit(key: string, limit: number, windowMs = 60 * 60 * 1000): boolean {
  if (!withinLimit(key, limit, windowMs)) return false
  recordHit(key, windowMs)
  return true
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}
