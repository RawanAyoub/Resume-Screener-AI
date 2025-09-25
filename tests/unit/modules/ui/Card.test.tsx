import { describe, it, expect } from 'vitest'
import { Card } from '@/modules/ui/components/Card'

describe('UI/Card', () => {
  it('is a function component', () => {
    expect(typeof Card).toBe('function')
  })
})
