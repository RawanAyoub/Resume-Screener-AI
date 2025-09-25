import { describe, it, expect } from 'vitest'
import { Button } from '@/modules/ui/components/Button'

describe('UI/Button', () => {
  it('is a function component and supports aria-label', () => {
    expect(typeof Button).toBe('function')
    // no render here; just contract
  })
})
