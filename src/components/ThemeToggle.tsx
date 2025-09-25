import React from 'react'
import { motion } from 'framer-motion'
import { IconSun, IconMoon } from '@tabler/icons-react'
import { useTheme } from '@/contexts/ThemeContext'

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <IconSun className="w-5 h-5 text-yellow-500" />
        ) : (
          <IconMoon className="w-5 h-5 text-neutral-700" />
        )}
      </motion.div>
    </motion.button>
  )
}