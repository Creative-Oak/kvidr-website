/**
 * A deliberately small in-memory limiter. It is per-process, so it resets on
 * deploy and does not survive horizontal scaling — which is fine for the load
 * a contact form on a landing page actually sees.
 */
const hits = new Map<string, number[]>()

export function rateLimit(key: string, limit = 5, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)

  if (recent.length >= limit) {
    hits.set(key, recent)
    return false
  }

  recent.push(now)
  hits.set(key, recent)

  // Keep the map from growing without bound on a long-lived process.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= windowMs)) hits.delete(k)
    }
  }

  return true
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}
