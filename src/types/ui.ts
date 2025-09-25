export interface FormState {
  currentStep: 1 | 2 | 3
  isValid: boolean
  errors: Record<string, string>
  touched: Record<string, boolean>
}

export interface UploadState {
  file: File | null
  progress: number
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error'
  error: string | null
  base64Content: string | null
}

export interface ScreeningState {
  status: 'idle' | 'submitting' | 'processing' | 'completed' | 'error'
  progress: number
  result: import('./api').ScreeningResponse | null
  error: string | null
  requestId: string | null
}
