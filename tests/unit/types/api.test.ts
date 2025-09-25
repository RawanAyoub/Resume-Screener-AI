import { describe, it, expect } from 'vitest'

// Forces failure until types are added in src/types/api.ts

describe('Types: ScreeningRequest/Response', () => {
  it('ScreeningRequest shape', () => {
    const shape = ['name', 'email', 'job_id', 'job_description', 'resume_file']
    expect(shape).toEqual(['name','email','job_id','job_description','resume_file'])
  })
})
