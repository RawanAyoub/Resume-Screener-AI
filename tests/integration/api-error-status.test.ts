import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import { screeningApi } from '@/services/api'

// We will mock axios.post to throw errors that mimic server responses
vi.mock('axios', async (orig) => {
  const mod: any = await orig()
  return {
    default: {
      create: () => ({
        post: async (url: string, body: any) => {
          if (body.__forceStatus === 413) {
            const err: any = new Error('Payload Too Large')
            err.response = { status: 413, statusText: 'Payload Too Large' }
            throw err
          }
          if (body.__forceStatus === 415) {
            const err: any = new Error('Unsupported Media Type')
            err.response = { status: 415, statusText: 'Unsupported Media Type' }
            throw err
          }
          if (body.__forceStatus === 422) {
            const err: any = new Error('Unprocessable Entity')
            err.response = { status: 422, statusText: 'Unprocessable Entity' }
            throw err
          }
          if (body.__forceStatus === 400) {
            const err: any = new Error('Bad Request')
            err.response = { status: 400, statusText: 'Bad Request' }
            throw err
          }
          if (body.__forceStatus === 500) {
            const err: any = new Error('Internal Server Error')
            err.response = { status: 500, statusText: 'Internal Server Error' }
            throw err
          }
          if (body.__forceStatus === 502) {
            const err: any = new Error('Bad Gateway')
            err.response = { status: 502, statusText: 'Bad Gateway' }
            throw err
          }
          if (body.__forceStatus === 504) {
            const err: any = new Error('Gateway Timeout')
            err.response = { status: 504, statusText: 'Gateway Timeout' }
            throw err
          }
          return { data: { ok: true } }
        },
      }),
    },
  }
})

describe('API error status handling (contract visibility)', () => {
  beforeEach(() => {
    ;(globalThis as any).importMeta = { env: { ...((import.meta as any).env || {}), VITE_N8N_WEBHOOK_URL: 'https://mock.local/webhook' } }
    ;(import.meta as any).env = (globalThis as any).importMeta.env
  })
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('surfaces 413 Payload Too Large', async () => {
    await expect(
      screeningApi.screenResume({
        name: 'a',
        email: 'a@a.com',
        job_id: '1',
        job_description: 'a'.repeat(100),
        resume_file: 'x',
        // test flag consumed by mocked axios
        __forceStatus: 413 as any,
      } as any),
    ).rejects.toHaveProperty('response.status', 413)
  })

  it('surfaces 415 Unsupported Media Type', async () => {
    await expect(
      screeningApi.screenResume({
        name: 'a',
        email: 'a@a.com',
        job_id: '1',
        job_description: 'a'.repeat(100),
        resume_file: 'x',
        __forceStatus: 415 as any,
      } as any),
    ).rejects.toHaveProperty('response.status', 415)
  })

  it('surfaces 422 Unprocessable Entity', async () => {
    await expect(
      screeningApi.screenResume({
        name: 'a',
        email: 'a@a.com',
        job_id: '1',
        job_description: 'a'.repeat(100),
        resume_file: 'x',
        __forceStatus: 422 as any,
      } as any),
    ).rejects.toHaveProperty('response.status', 422)
  })

  it('surfaces 400 Bad Request', async () => {
    await expect(
      screeningApi.screenResume({
        name: 'a',
        email: 'a@a.com',
        job_id: '1',
        job_description: 'a'.repeat(100),
        resume_file: 'x',
        __forceStatus: 400 as any,
      } as any),
    ).rejects.toHaveProperty('response.status', 400)
  })

  it('surfaces 500 Internal Server Error', async () => {
    await expect(
      screeningApi.screenResume({
        name: 'a',
        email: 'a@a.com',
        job_id: '1',
        job_description: 'a'.repeat(100),
        resume_file: 'x',
        __forceStatus: 500 as any,
      } as any),
    ).rejects.toHaveProperty('response.status', 500)
  })

  it('surfaces 502 Bad Gateway', async () => {
    await expect(
      screeningApi.screenResume({
        name: 'a',
        email: 'a@a.com',
        job_id: '1',
        job_description: 'a'.repeat(100),
        resume_file: 'x',
        __forceStatus: 502 as any,
      } as any),
    ).rejects.toHaveProperty('response.status', 502)
  })

  it('surfaces 504 Gateway Timeout', async () => {
    await expect(
      screeningApi.screenResume({
        name: 'a',
        email: 'a@a.com',
        job_id: '1',
        job_description: 'a'.repeat(100),
        resume_file: 'x',
        __forceStatus: 504 as any,
      } as any),
    ).rejects.toHaveProperty('response.status', 504)
  })
})
