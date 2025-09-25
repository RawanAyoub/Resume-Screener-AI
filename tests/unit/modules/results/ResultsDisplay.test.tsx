import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResultsDisplay } from '@/modules/results/components/ResultsDisplay'

describe('ResultsDisplay', () => {
  it('renders AI score 0-100 and lists pros/cons', () => {
    const result: any = {
      candidate_info: { name: 'A', email: 'a@a.com', job_id: 'J' },
      job_description: 'desc',
      screening_result: {
        ai_score: 75,
        pros: ['p1'],
        cons: ['c1'],
        missing_skills: [],
        analysis_explanation: 'ok',
      },
      timestamp: new Date().toISOString(),
      status: 'completed',
    }
    render(<ResultsDisplay result={result} /> as any)
    expect(screen.getByText(/75/)).toBeInTheDocument()
    expect(screen.getByText('p1')).toBeInTheDocument()
    expect(screen.getByText('c1')).toBeInTheDocument()
  })
})

describe('ResultsDisplay - extended fields', () => {
  it('renders missing skills and analysis explanation', () => {
    const result: any = {
      candidate_info: { name: 'A', email: 'a@a.com', job_id: 'J' },
      job_description: 'desc',
      screening_result: {
        ai_score: 0.93, // ratio
        pros: ['communicates well', 'team player'],
        cons: ['lacks leadership'],
        missing_skills: ['GraphQL', 'Docker'],
        analysis_explanation: 'Strong overall alignment with minor gaps.'
      },
      timestamp: new Date().toISOString(),
      status: 'completed',
    }
    render(<ResultsDisplay result={result} /> as any)
    expect(screen.getByText(/93%/)).toBeInTheDocument()
    expect(screen.getByText(/GraphQL/)).toBeInTheDocument()
    expect(screen.getByText(/Docker/)).toBeInTheDocument()
    expect(screen.getByText(/Strong overall alignment/)).toBeInTheDocument()
  })
})
