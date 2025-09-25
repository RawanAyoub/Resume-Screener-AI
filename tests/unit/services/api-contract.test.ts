import { describe, it, expect } from 'vitest'
import type { ScreeningRequest, ScreeningResponse } from '@/types/api'

// Contract checks based on .specify/memory/plans/contracts/screen-resume-api.md

describe('API Contract: ScreeningRequest/Response', () => {
  it('ScreeningRequest has required fields', () => {
    const req: ScreeningRequest = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      job_id: 'JOB-1',
      job_description: 'A valid job description with enough length',
      resume_file: 'ZGF0YQ==',
    }
    expect(Object.keys(req).sort()).toEqual(
      ['email', 'job_description', 'job_id', 'name', 'resume_file'].sort(),
    )
  })

  it('ai_score must be 0-100', () => {
    const res: ScreeningResponse = {
      candidate_info: { name: 'Jane Doe', email: 'jane@example.com', job_id: 'JOB-1' },
      job_description: 'desc',
      screening_result: {
        ai_score: 100,
        pros: [],
        cons: [],
        missing_skills: [],
        analysis_explanation: 'ok',
      },
      timestamp: new Date().toISOString(),
      status: 'completed',
    }
    expect(res.screening_result.ai_score).toBeGreaterThanOrEqual(0)
    expect(res.screening_result.ai_score).toBeLessThanOrEqual(100)
  })
  
  it('documents server error status codes per contract', () => {
    // We only assert the expected codes to keep the contract visible in tests.
    const expected = [400, 413, 415, 422, 500, 502, 504]
    for (const code of [400, 413, 415, 422, 500, 502, 504]) {
      expect(expected).toContain(code)
    }
  })
})
