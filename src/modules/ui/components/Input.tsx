import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { 
  label?: string
  error?: boolean
}

export function Input({ label, error, className, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(props.value ? String(props.value).length > 0 : false)

  const id = props.id || `input-${Math.random().toString(36).slice(2)}`

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    props.onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    props.onBlur?.(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0)
    props.onChange?.(e)
  }

  if (label) {
    return (
      <div className="relative">
        <motion.input
          id={id}
          {...(props as any)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className={cn(
            "peer w-full px-4 py-3 text-sm bg-white dark:bg-neutral-900 border-2 rounded-lg transition-all duration-200 outline-none",
            "border-neutral-200 dark:border-neutral-700",
            "focus:border-sky-400 dark:focus:border-sky-500",
            "text-neutral-900 dark:text-neutral-100",
            "placeholder-transparent",
            error && "border-red-400 dark:border-red-500 focus:border-red-400 dark:focus:border-red-500",
            className
          )}
          placeholder={label}
        />
        <motion.label
          htmlFor={id}
          className={cn(
            "absolute left-4 transition-all duration-200 pointer-events-none",
            "text-neutral-500 dark:text-neutral-400",
            "peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5",
            "peer-focus:text-xs peer-focus:-top-2 peer-focus:left-3 peer-focus:px-1",
            "peer-focus:bg-white dark:peer-focus:bg-neutral-900",
            isFocused || hasValue || props.value 
              ? "text-xs -top-2 left-3 px-1 bg-white dark:bg-neutral-900" 
              : "text-sm top-3.5",
            (isFocused || hasValue || props.value) && !error && "text-sky-600 dark:text-sky-400",
            error && "text-red-600 dark:text-red-400"
          )}
          animate={{
            scale: isFocused ? 1.05 : 1,
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut"
          }}
        >
          {label}
        </motion.label>
      </div>
    )
  }
  
  return (
    <motion.input
      {...(props as any)}
      className={cn(
        "w-full px-4 py-3 text-sm bg-white dark:bg-neutral-900 border-2 rounded-lg transition-all duration-200 outline-none",
        "border-neutral-200 dark:border-neutral-700",
        "focus:border-sky-400 dark:focus:border-sky-500",
        "text-neutral-900 dark:text-neutral-100",
        error && "border-red-400 dark:border-red-500 focus:border-red-400 dark:focus:border-red-500",
        className
      )}
      whileFocus={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    />
  )
}
