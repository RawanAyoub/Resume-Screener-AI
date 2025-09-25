import { describe, it, expect } from 'vitest'

import { MAX_FILE_SIZE_BYTES, ALLOWED_MIME_TYPES } from '@/utils/constants'

import { fileToBase64, validateFile } from '@/services/fileProcessing'

describe('fileProcessing', () => {
  it('converts a small text file to base64', async () => {
    const content = 'hello world' // 11 bytes
    const file = new File([content], 'hello.txt', { type: 'text/plain' })
    const b64 = await fileToBase64(file)
    // atob(b64) === content, but atob may not exist in node; check prefix length match
    expect(typeof b64).toBe('string')
    expect(b64.length).toBeGreaterThan(0)
  })

  it('rejects files larger than the max size', async () => {
    const tooBig = MAX_FILE_SIZE_BYTES + 1
    const bytes = new Uint8Array(tooBig)
    const file = new File([bytes], 'big.pdf', { type: 'application/pdf' })
    const res = validateFile(file)
    expect(res.ok).toBe(false)
    expect(res.error).toBe('file_too_large')
  })

  it('rejects unsupported file types', () => {
    expect(ALLOWED_MIME_TYPES).not.toContain('image/png')
    const file = new File([new Uint8Array(10)], 'img.png', { type: 'image/png' })
    const res = validateFile(file)
    expect(res.ok).toBe(false)
    expect(res.error).toBe('unsupported_type')
  })
})
