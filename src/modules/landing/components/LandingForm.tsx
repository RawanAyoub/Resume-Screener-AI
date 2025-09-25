import React, { useMemo, useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IconSparkles, IconUpload } from '@tabler/icons-react'
import { FileUpload } from './FileUpload'
import { JobDescriptionForm } from './JobDescriptionForm'
import { Button } from '@/modules/ui/components/Button'
import { Card } from '@/modules/ui/components/Card'
import { Input } from '@/modules/ui/components/Input'
import { validateFormData } from '@/services/validation'
import { fileToBase64 } from '@/services/fileProcessing'
import { screeningApi } from '@/services/api'
import type { ScreeningFormData, ValidationErrors } from '@/types/forms'
import type { ScreeningResponse } from '@/types/api'
import { ResultsDisplay } from '@/modules/results/components/ResultsDisplay'
import { cn } from '@/lib/utils'

/**
 * Initial form state for resume screening.
 * All fields required by API contract.
 */
const INITIAL_FORM: ScreeningFormData = {
  name: '',
  email: '',
  job_id: '',
  job_description: '',
  resumeFile: null,
}

/**
 * LandingForm: main entry for candidate resume screening.
 * Handles validation, accessibility, API integration, and result rendering.
 */
export function LandingForm() {
  // Form state
  const [form, setForm] = useState<ScreeningFormData>({ ...INITIAL_FORM })
  // Refs for accessibility focus management
  const errorRefs = {
    name: useRef<HTMLDivElement>(null),
    email: useRef<HTMLDivElement>(null),
    job_id: useRef<HTMLDivElement>(null),
    job_description: useRef<HTMLDivElement>(null),
    resumeFile: useRef<HTMLDivElement>(null),
  }
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null)
  // Validation errors
  const [errors, setErrors] = useState<ValidationErrors>({})
  // Submission state
  const [submitting, setSubmitting] = useState(false)
  // API result
  const [result, setResult] = useState<ScreeningResponse | null>(null)
  // Error message for submit failures
  const [submitError, setSubmitError] = useState<string | null>(null)
  // Retry count for transient errors
  const [retryCount, setRetryCount] = useState(0)

  /**
   * Generic form field change handler.
   * @param key - field name
   * @param value - new value
   */
  const onChange = (key: keyof ScreeningFormData, value: any) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  // Memoized form validity (for disabling submit)
  const isValid = useMemo(() => validateFormData(form).ok, [form])

  /**
   * Form submit handler. Triggers validation and API call.
   */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setRetryCount(0)
    await submitWithRetry()
  }

  /**
   * Handles validation and API call with retry for transient errors.
   * Focuses first error for accessibility.
   */
  const submitWithRetry = async () => {
    const vr = validateFormData(form)
    if (!vr.ok) {
      setErrors(vr.errors)
      // Focus first error for accessibility
      const keys = Object.keys(vr.errors)
      if (keys.length > 0 && errorRefs[keys[0] as keyof typeof errorRefs]?.current) {
        errorRefs[keys[0] as keyof typeof errorRefs].current?.focus()
      }
      return
    }
    setErrors({})
    setSubmitting(true)
    let attempts = 0
    let lastError: any = null
    
    while (attempts < 2) {
      try {
        // Convert file to base64 for API
        const resume_file = await fileToBase64(form.resumeFile!)
        // API call
        const res = await screeningApi.screenResume({
          name: form.name,
          email: form.email,
          job_id: form.job_id,
          job_description: form.job_description,
          resume_file,
        })
        
        // Robust mapping for n8n response (array/object)
        let mapped: ScreeningResponse | null = null
        // Case 1: top-level object with candidate_info array
        if (res && Array.isArray(res.candidate_info) && res.candidate_info.length > 0) {
          const info = res.candidate_info[0]
          mapped = {
            candidate_info: {
              name: form.name,
              email: form.email,
              job_id: form.job_id,
            },
            job_description: form.job_description,
            screening_result: {
              ai_score: info.ai_score,
              pros: info.pros,
              cons: info.cons,
              missing_skills: info.missing_skills,
              analysis_explanation: info.analysis_explanation,
            },
            timestamp: '',
            status: 'completed',
          }
        }
        // Case 2: array of objects with candidate_info array
        else if (Array.isArray(res) && res.length > 0 && Array.isArray(res[0]?.candidate_info) && res[0].candidate_info.length > 0) {
          const info = res[0].candidate_info[0]
          mapped = {
            candidate_info: {
              name: form.name,
              email: form.email,
              job_id: form.job_id,
            },
            job_description: form.job_description,
            screening_result: {
              ai_score: info.ai_score,
              pros: info.pros,
              cons: info.cons,
              missing_skills: info.missing_skills,
              analysis_explanation: info.analysis_explanation,
            },
            timestamp: '',
            status: 'completed',
          }
        }
        // Case 3: already mapped ScreeningResponse
        else if (res && res.screening_result) {
          mapped = res as ScreeningResponse
        }
        
        console.log('API raw response:', res)
        console.log('Mapped screening result:', mapped)
        setResult(mapped)
        setSubmitError(null)
        setSubmitting(false)
        return
      } catch (err: any) {
        lastError = err
        const status = err?.response?.status
        if ([500, 502, 504].includes(status) && attempts === 0) {
          setRetryCount(attempts + 1)
          attempts++
          await new Promise((r) => setTimeout(r, 1200))
          continue
        }
        
        // Error handling for different status codes
        if (status === 413) setSubmitError('File too large (server)')
        else if (status === 415) setSubmitError('Unsupported file type (server)')
        else if (status === 422) setSubmitError('Invalid request (server)')
        else if ([500, 502, 504].includes(status)) setSubmitError('Server error, please try again later.')
        else setSubmitError('Submission failed. Please try again.')
        setSubmitting(false)
        return
      }
    }
    setSubmitError('Submission failed after retry. Please try again.')
    setSubmitting(false)
  }

  /**
   * Accessibility: focus results heading when results appear.
   */
  useEffect(() => {
    if (result && typeof result.screening_result === 'object') {
      resultsHeadingRef.current?.focus()
    }
  }, [result])

  /**
   * Renders the form, results, and error states with modern animated design.
   * - Results: shown if API returns valid screening_result
   * - Error: fallback if API response is invalid  
   * - Form: shown if no result yet
   */
  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
        {result && typeof result.screening_result === 'object' ? (
          // Results View
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md border-white/30 dark:border-neutral-700/30 shadow-lg">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4"
                >
                  <IconSparkles className="w-8 h-8 text-green-600 dark:text-green-400" />
                </motion.div>
                <h2 
                  ref={resultsHeadingRef} 
                  tabIndex={-1}
                  className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2"
                >
                  Screening Complete!
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Here are the AI-powered insights for your resume
                </p>
              </div>
              
              <ResultsDisplay result={result} />
              
              <motion.div 
                className="mt-8 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button 
                  onClick={() => { 
                    setForm({ ...INITIAL_FORM })
                    setResult(null)
                    setErrors({})
                    setSubmitError(null)
                    setRetryCount(0)
                  }}
                  variant="outline"
                  size="lg"
                >
                  Screen Another Resume
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        ) : result ? (
          // Error View  
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md border-red-200/50 dark:border-red-800/50 shadow-lg">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                  Processing Error
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  We couldn't process your resume. Please try again.
                </p>
                <details className="text-left mb-6">
                  <summary className="cursor-pointer text-sm text-neutral-500 mb-2">View technical details</summary>
                  <pre className="text-xs p-4 bg-neutral-100/50 dark:bg-neutral-800/50 rounded overflow-auto backdrop-blur-sm">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
                <Button 
                  onClick={() => { 
                    setForm({ ...INITIAL_FORM })
                    setResult(null)
                    setErrors({})
                    setSubmitError(null)
                    setRetryCount(0)
                  }}
                  variant="primary"
                >
                  Try Again
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          // Form View
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md border-white/30 dark:border-neutral-700/30 shadow-lg">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 dark:bg-sky-900 rounded-full mb-4"
                >
                  <IconSparkles className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                </motion.div>
                <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  AI Resume Screening
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                  Get instant, AI-powered insights on resume fit for your job posting
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Input 
                    label="Full Name" 
                    value={form.name} 
                    onChange={(e) => onChange('name', e.target.value)}
                    error={!!errors.name}
                    aria-describedby={errors.name ? 'err-name' : undefined}
                  />
                  {errors.name && (
                    <motion.div 
                      id="err-name" 
                      role="alert" 
                      tabIndex={-1} 
                      ref={errorRefs.name}
                      className="mt-1 text-sm text-red-600 dark:text-red-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Name is required
                    </motion.div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Input 
                    label="Email Address" 
                    type="email" 
                    value={form.email} 
                    onChange={(e) => onChange('email', e.target.value)}
                    error={!!errors.email}
                    aria-describedby={errors.email ? 'err-email' : undefined}
                  />
                  {errors.email && (
                    <motion.div 
                      id="err-email" 
                      role="alert" 
                      tabIndex={-1} 
                      ref={errorRefs.email}
                      className="mt-1 text-sm text-red-600 dark:text-red-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Please enter a valid email address
                    </motion.div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Input 
                    label="Job ID / Reference" 
                    value={form.job_id} 
                    onChange={(e) => onChange('job_id', e.target.value)}
                    error={!!errors.job_id}
                    aria-describedby={errors.job_id ? 'err-jobid' : undefined}
                  />
                  {errors.job_id && (
                    <motion.div 
                      id="err-jobid" 
                      role="alert" 
                      tabIndex={-1} 
                      ref={errorRefs.job_id}
                      className="mt-1 text-sm text-red-600 dark:text-red-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Job ID is required
                    </motion.div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <JobDescriptionForm 
                    value={form.job_description} 
                    onChange={(v) => onChange('job_description', v)}
                    error={!!errors.job_description}
                  />
                  {errors.job_description && (
                    <motion.div 
                      role="alert" 
                      tabIndex={-1} 
                      ref={errorRefs.job_description}
                      className="mt-1 text-sm text-red-600 dark:text-red-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Please provide a more detailed job description
                    </motion.div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <FileUpload onFileSelect={(f) => onChange('resumeFile', f)} />
                  {errors.resumeFile && (
                    <motion.div 
                      role="alert" 
                      tabIndex={-1} 
                      ref={errorRefs.resumeFile}
                      className="mt-1 text-sm text-red-600 dark:text-red-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.resumeFile === 'file_too_large' ? 'File too large (max 10MB)' : 
                       errors.resumeFile === 'unsupported_type' ? 'Unsupported file type' : 
                       'Resume file is required'}
                    </motion.div>
                  )}
                </motion.div>

                {submitError && (
                  <motion.div 
                    role="alert" 
                    aria-live="assertive"
                    className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {submitError}
                  </motion.div>
                )}

                {retryCount > 0 && (
                  <motion.div 
                    className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-700 dark:text-amber-400 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Retrying request... (Attempt {retryCount})
                  </motion.div>
                )}

                <motion.div 
                  className="flex gap-4 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button 
                    type="submit" 
                    disabled={submitting || !isValid} 
                    className="flex-1"
                    size="lg"
                  >
                    {submitting ? (
                      <motion.div 
                        className="flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Analyzing Resume...
                      </motion.div>
                    ) : (
                      <>
                        <IconSparkles className="w-5 h-5 mr-2" />
                        Start AI Screening
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => { 
                      setForm({ ...INITIAL_FORM })
                      setErrors({})
                      setSubmitError(null)
                    }}
                    size="lg"
                  >
                    Reset
                  </Button>
                </motion.div>
              </form>
            </Card>
          </motion.div>
        )}
    </motion.div>
  )
}
