import { ThemeProvider } from '@/contexts/ThemeContext'
import { ThemeToggle } from '@/components/ThemeToggle'
import { AnimatedBackground } from '@/components/AnimatedBackground'
import { LandingForm } from '@/modules/landing/components/LandingForm'

export function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-300 relative">
        <AnimatedBackground />
        <ThemeToggle />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Resume Screening AI
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Enter your details and submit your resume for intelligent AI screening and analysis.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <LandingForm />
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
