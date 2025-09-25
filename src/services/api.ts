import axios from 'axios'
import type { ScreeningRequest, ScreeningResponse } from '@/types/api'

const client = axios.create({
  timeout: 60_000,
  headers: { 'Content-Type': 'application/json' },
})

export const screeningApi = {
  async screenResume(req: ScreeningRequest): Promise<ScreeningResponse> {
    const url = import.meta.env.VITE_N8N_WEBHOOK_URL
    if (!url) throw new Error('VITE_N8N_WEBHOOK_URL not set')
    const { data } = await client.post<ScreeningResponse>(url, req)
    return data
  },
}
