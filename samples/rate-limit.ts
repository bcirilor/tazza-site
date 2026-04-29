const store = new Map<string, number>()

export function rateLimit(key: string, windowMs = 30_000): boolean {
  const now = Date.now()
  const last = store.get(key)
  if (last && now - last < windowMs) return false
  store.set(key, now)
  return true
}
