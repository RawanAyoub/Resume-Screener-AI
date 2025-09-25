import { describe, it, expect } from 'vitest'

import { isValidEmail, validateJobDescription, validateFormData } from '@/services/validation'

describe('validation', () => {
  it('validates email format', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('invalid-email')).toBe(false)
    expect(isValidEmail('name@domain')).toBe(false)
  })

  it('validates job description minimum length', () => {
    expect(validateJobDescription('short')).toEqual({ ok: false, error: 'too_short' })
    const long = 'a'.repeat(80)
    expect(validateJobDescription(long)).toEqual({ ok: true })
  })

  it('validates full form data', () => {
    const errors = validateFormData({
      name: '',
      email: 'bad',
      job_id: '',
      job_description: 'short',
      resumeFile: null,
    })
    expect(errors.ok).toBe(false)
    expect(errors.errors.name).toBe('required')
    expect(errors.errors.email).toBe('invalid')
    expect(errors.errors.job_id).toBe('required')
    expect(errors.errors.job_description).toBe('too_short')
    expect(errors.errors.resumeFile).toBe('required')

    const good = validateFormData({
      name: 'Jane Doe',
      email: 'jane@doe.com',
      job_id: 'JD-1',
      job_description: 'a'.repeat(120),
      resumeFile: new File(['hello'], 'cv.txt', { type: 'text/plain' }),
    })
    expect(good.ok).toBe(true)
  })
})
