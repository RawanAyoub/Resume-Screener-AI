import { describe, it, expect } from 'vitest'

import { isFileApiSupported } from '@/utils/browser'

describe('browser utils', () => {
  it('detects File API support in jsdom', () => {
    expect(isFileApiSupported()).toBe(true)
  })
})
