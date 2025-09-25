import { describe, it, expect } from 'vitest'

import { formatScore, truncate, joinList } from '@/utils/formatting'

describe('formatting utils', () => {
  it('formats score to percentage with 0-100 bounds', () => {
    expect(formatScore(0)).toBe('0%') // ratio 0
    expect(formatScore(0.87)).toBe('87%') // ratio 0.87
    expect(formatScore(100)).toBe('100%') // already percentage
    expect(formatScore(1.2)).toBe('100%') // above ratio treated as clamped percentage
    expect(formatScore(-0.5)).toBe('0%') // below min
  })

  it('truncates strings with ellipsis when needed', () => {
    expect(truncate('hello', 10)).toBe('hello')
    expect(truncate('0123456789', 5)).toBe('01…89')
  })

  it('joins list with commas and and', () => {
    expect(joinList([])).toBe('')
    expect(joinList(['A'])).toBe('A')
    expect(joinList(['A', 'B'])).toBe('A and B')
    expect(joinList(['A', 'B', 'C'])).toBe('A, B, and C')
  })
})
