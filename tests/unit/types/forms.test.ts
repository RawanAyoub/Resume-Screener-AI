import { describe, it, expect } from 'vitest'

import type { ScreeningFormData, ValidationErrors } from '@/types/forms'

describe('forms types', () => {
  it('declares shape for ScreeningFormData and ValidationErrors', () => {
    const data: ScreeningFormData = {
      name: 'John',
      email: 'john@example.com',
      job_id: 'JD-123',
      job_description: 'A'.repeat(200),
      resumeFile: new File(['cv'], 'cv.txt', { type: 'text/plain' }),
    }
    expect(data.name).toBeDefined()

    const errs: ValidationErrors = {
      name: 'required',
      email: 'invalid',
      job_id: 'required',
      job_description: 'too_short',
      resumeFile: 'required',
    }
    expect(Object.keys(errs).length).toBe(5)
  })
})
