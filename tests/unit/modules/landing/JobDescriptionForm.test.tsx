import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { JobDescriptionForm } from '@/modules/landing/components/JobDescriptionForm'

describe('JobDescriptionForm', () => {
  it('renders a textarea and validates min length (>=10)', async () => {
    const onChange = vi.fn()
    render(<JobDescriptionForm value="" onChange={onChange} /> as any)
    const area = screen.getByLabelText(/job description/i)
    expect(area).toBeInTheDocument()
    fireEvent.change(area, { target: { value: 'short' } })
    
    // Wait for the validation message to appear (it has animation)
    await waitFor(() => {
      expect(screen.getByText(/provide a more detailed job description/i)).toBeInTheDocument()
    })
  })
})
