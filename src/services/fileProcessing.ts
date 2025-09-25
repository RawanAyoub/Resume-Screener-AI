import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from '@/utils/constants'

export type FileValidationError = 'file_too_large' | 'unsupported_type'

export function validateFile(file: File): { ok: true } | { ok: false; error: FileValidationError } {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { ok: false, error: 'file_too_large' }
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type as any)) {
    return { ok: false, error: 'unsupported_type' }
  }
  return { ok: true }
}

export async function fileToBase64(file: File): Promise<string> {
  // Use FileReader for browser/jsdom compatibility
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') {
        const comma = result.indexOf(',')
        resolve(comma >= 0 ? result.slice(comma + 1) : result)
      } else if (result instanceof ArrayBuffer) {
        // Fallback: convert array buffer to base64
        const bytes = new Uint8Array(result)
        let binary = ''
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!)
        resolve(btoa(binary))
      } else {
        reject(new Error('Unsupported reader result'))
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
