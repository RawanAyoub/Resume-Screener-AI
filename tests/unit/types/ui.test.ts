import { describe, it, expect } from 'vitest'
import type { FormState, UploadState, ScreeningState } from '@/types/ui'

// These tests assert existence and basic shape contracts for UI state types

describe('UI Types', () => {
  it('FormState exists with required fields', () => {
    const s: FormState = {
      currentStep: 1,
      isValid: false,
      errors: {},
      touched: {},
    }
    expect(typeof s.currentStep).toBe('number')
  })

  it('UploadState exists with required fields', () => {
    const u: UploadState = {
      file: null,
      progress: 0,
      status: 'idle',
      error: null,
      base64Content: null,
    }
    expect(u.status).toBe('idle')
  })

  it('ScreeningState exists with required fields', () => {
    const st: ScreeningState = {
      status: 'idle',
      progress: 0,
      result: null,
      error: null,
      requestId: null,
    }
    expect(st.status).toBe('idle')
  })
})
