import React from 'react'
import { motion } from 'framer-motion'

interface FloatingCircle {
  id: number
  x: number
  size: number
  duration: number
  delay: number
  opacity: number
}

export function AnimatedBackground() {
  // Generate random circles
  const circles: FloatingCircle[] = React.useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Random x position (percentage)
      size: Math.random() * 8 + 4, // Random size between 4-12px
      duration: Math.random() * 20 + 15, // Random duration between 15-35s
      delay: Math.random() * 10, // Random delay up to 10s
      opacity: Math.random() * 0.3 + 0.1, // Random opacity between 0.1-0.4
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {circles.map((circle) => (
        <motion.div
          key={circle.id}
          className="absolute rounded-full bg-sky-200 dark:bg-sky-400 blur-sm"
          style={{
            left: `${circle.x}%`,
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            opacity: circle.opacity,
          }}
          initial={{ y: -20 }}
          animate={{ 
            y: '100vh',
            x: [0, 10, -10, 0], // Slight horizontal drift
          }}
          transition={{
            duration: circle.duration,
            delay: circle.delay,
            repeat: Infinity,
            ease: 'linear',
            x: {
              duration: circle.duration / 2,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }
          }}
        />
      ))}
    </div>
  )
}