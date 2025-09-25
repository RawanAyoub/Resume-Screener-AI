import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type CardProps = {
  children?: React.ReactNode
  className?: string
  animate?: boolean
}

export function Card({ children, className, animate = true }: CardProps) {
  if (animate) {
    return (
      <motion.div
        role="region"
        className={cn(
          "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: "easeOut"
        }}
        whileHover={{
          y: -4,
          transition: { duration: 0.2 }
        }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div
      role="region"
      className={cn(
        "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-sm overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  )
}
