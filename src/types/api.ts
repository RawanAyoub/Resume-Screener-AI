export interface ScreeningRequest {
  name: string
  email: string
  job_id: string
  job_description: string
  resume_file: string // base64
}

export interface ScreeningResponse {
  candidate_info: {
    name: string
    email: string
    job_id: string
  }
  job_description: string
  screening_result: {
    ai_score: number
    pros: string[]
    cons: string[]
    missing_skills: string[]
    analysis_explanation: string
  }
  timestamp: string
  status: 'completed'
}
