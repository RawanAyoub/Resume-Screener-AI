import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FileUpload } from '@/modules/landing/components/FileUpload'

describe('FileUpload component contract', () => {
  it('is a function component', () => {
    expect(typeof FileUpload).toBe('function')
  })

  it('accepts accept and maxSize props', () => {
    const props = { accept: '.pdf', maxSize: 1024 }
    // Rendering with props should not throw and should set accept attribute
    render(<FileUpload {...(props as any)} /> as any)
    const input = screen.getByLabelText(/upload resume/i) as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(input.accept).toContain('.pdf')
  })
})
