export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

// Supported resume file types: PDF, DOC, DOCX, TXT
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
] as const
