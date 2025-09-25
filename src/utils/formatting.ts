export function formatScore(value: number): string {
  // Accept either 0..1 ratio or 0..100 percentage per contract usage.
  // Treat small values up to ~2 as ratios to be lenient with callers.
  const isRatio = value <= 1.5
  const normalized = isRatio ? value * 100 : value
  const clamped = Math.max(0, Math.min(100, normalized))
  const pct = Math.round(clamped)
  return `${pct}%`
}

export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  if (maxLen < 4) return text.slice(0, maxLen)
  const head = Math.ceil((maxLen - 1) / 2)
  const tail = maxLen - 1 - head
  return `${text.slice(0, head)}…${text.slice(text.length - tail)}`
}

export function joinList(items: string[]): string {
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]!
  if (items.length === 2) return `${items[0]!} and ${items[1]!}`
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]!}`
}
