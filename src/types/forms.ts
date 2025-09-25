import type { FileValidationError } from '@/services/fileProcessing'

export interface ScreeningFormData {
  name: string
  email: string
  job_id: string
  job_description: string
  resumeFile: File | null
}

export type ValidationErrors = Partial<{
  name: 'required'
  email: 'invalid'
  job_id: 'required'
  job_description: 'too_short'
  resumeFile: 'required' | FileValidationError
}>

export type ValidationResult = { ok: true } | { ok: false; errors: ValidationErrors }
