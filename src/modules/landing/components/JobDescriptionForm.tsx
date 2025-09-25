import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { validateJobDescription } from '@/services/validation'

type JobDescriptionFormProps = {
  value: string
  onChange: (value: string) => void
  error?: boolean
}

export function JobDescriptionForm({ value, onChange, error }: JobDescriptionFormProps) {
  const [isFocused, setIsFocused] = useState(false)
  const validation = validateJobDescription(value)
  const hasError = error || !validation.ok
  const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length
  const minWords = 10

  const id = `job-description-${Math.random().toString(36).slice(2)}`

  return (
    <div className="w-full">
      <div className="relative">
        <motion.textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "peer w-full px-4 py-3 text-sm bg-white dark:bg-neutral-900 border-2 rounded-lg transition-all duration-200 outline-none resize-none min-h-[120px]",
            "border-neutral-200 dark:border-neutral-700",
            "focus:border-sky-400 dark:focus:border-sky-500",
            "text-neutral-900 dark:text-neutral-100",
            "placeholder-transparent",
            hasError && "border-red-400 dark:border-red-500 focus:border-red-400 dark:focus:border-red-500"
          )}
          placeholder="Job Description"
          rows={5}
          aria-label="Job Description"
        />
        <motion.label
          htmlFor={id}
          className={cn(
            "absolute left-4 transition-all duration-200 pointer-events-none",
            "text-neutral-500 dark:text-neutral-400",
            "peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5",
            "peer-focus:text-xs peer-focus:-top-2 peer-focus:left-3 peer-focus:px-1",
            "peer-focus:bg-white dark:peer-focus:bg-neutral-900",
            isFocused || value 
              ? "text-xs -top-2 left-3 px-1 bg-white dark:bg-neutral-900" 
              : "text-sm top-3.5",
            (isFocused || value) && !hasError && "text-sky-600 dark:text-sky-400",
            hasError && "text-red-600 dark:text-red-400"
          )}
          animate={{
            scale: isFocused ? 1.05 : 1,
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut"
          }}
        >
          Job Description
        </motion.label>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          {wordCount}/{minWords} words minimum
        </div>
        {hasError && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs text-red-600 dark:text-red-400"
            role="alert"
          >
            Please provide a more detailed job description
          </motion.div>
        )}
      </div>
      
      <motion.div 
        className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className={cn(
            "h-1 rounded-full transition-colors duration-300",
            wordCount >= minWords 
              ? "bg-green-500" 
              : wordCount > minWords / 2 
                ? "bg-yellow-500" 
                : "bg-red-500"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((wordCount / minWords) * 100, 100)}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </motion.div>
    </div>
  )
}
