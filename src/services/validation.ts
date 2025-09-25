import type { ScreeningFormData, ValidationErrors, ValidationResult } from '@/types/forms'
import { validateFile } from '@/services/fileProcessing'

export function isValidEmail(email: string): boolean {
  // simple robust email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validateJobDescription(text: string): { ok: true } | { ok: false; error: 'too_short' } {
  return text && text.length >= 80 ? { ok: true } : { ok: false, error: 'too_short' }
}

export function validateFormData(data: ScreeningFormData): ValidationResult {
  const errors: ValidationErrors = {}
  if (!data.name?.trim()) errors.name = 'required'
  if (!isValidEmail(data.email)) errors.email = 'invalid'
  if (!data.job_id?.trim()) errors.job_id = 'required'
  const jd = validateJobDescription(data.job_description)
  if (!jd.ok) errors.job_description = jd.error
  if (!data.resumeFile) errors.resumeFile = 'required'
  else {
    const vf = validateFile(data.resumeFile)
    if (!vf.ok) errors.resumeFile = vf.error
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors }
  return { ok: true }
}
