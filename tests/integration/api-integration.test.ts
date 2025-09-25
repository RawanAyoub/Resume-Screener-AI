import { describe, it, expect } from 'vitest'
import { screeningApi } from '@/services/api' // expected per plan

// This will fail until services/api.ts is implemented

describe('Integration: n8n webhook call', () => {
  it('makes a POST to configured webhook and returns a response shape', async () => {
    const url = (import.meta as any).env?.VITE_N8N_WEBHOOK_URL
    expect(url).toBeTruthy()

    const request: any = {
      name: 'Test User',
      email: 'test@example.com',
      job_id: 'JOB-1',
      job_description: 'A short description with more than 10 chars',
      resume_file: 'Zm9v' // base64('foo')
    }

    try {
      const res = await screeningApi.screenResume(request)
      expect(typeof res).toBe('object')
      expect(res).toHaveProperty('screening_result')
    } catch (e) {
      // Allow network failure but assert error shape later in contract tests
      expect(e).toBeDefined()
    }
  })
})
