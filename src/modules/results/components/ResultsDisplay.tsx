import React from 'react'
import { motion } from 'framer-motion'
import { IconTrendingUp, IconTrendingDown, IconBulb, IconTarget, IconUser, IconClipboardCheck } from '@tabler/icons-react'
import type { ScreeningResponse } from '@/types/api'
import { formatScore, joinList, truncate } from '@/utils/formatting'
import { cn } from '@/lib/utils'

export function ResultsDisplay({ result }: { result: ScreeningResponse }) {
  const r = result?.screening_result
  if (!r) {
    return (
      <motion.div 
        role="alert" 
        className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <IconClipboardCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
        No screening result available
      </motion.div>
    )
  }

  const score = r.ai_score ?? 0
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800'
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
    return 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800'
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* AI Score */}
      <motion.div 
        variants={itemVariants}
        className={cn(
          'p-6 rounded-xl border text-center',
          getScoreBgColor(score)
        )}
      >
        <div className="flex items-center justify-center mb-3">
          <IconTarget className={cn('w-6 h-6 mr-2', getScoreColor(score))} />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            AI Match Score
          </h3>
        </div>
        <motion.div 
          className={cn('text-4xl font-bold mb-2', getScoreColor(score))}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          {formatScore(score)}
        </motion.div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {score >= 80 ? 'Excellent match for this role' : 
           score >= 60 ? 'Good match with some areas for improvement' : 
           'Moderate match - significant gaps identified'}
        </p>
      </motion.div>

      {/* Candidate Info */}
      <motion.div 
        variants={itemVariants}
        className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700"
      >
        <div className="flex items-center mb-3">
          <IconUser className="w-5 h-5 mr-2 text-neutral-600 dark:text-neutral-400" />
          <h4 className="font-medium text-neutral-900 dark:text-neutral-100">Candidate Information</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div>
            <span className="text-neutral-500 dark:text-neutral-400">Name:</span>
            <span className="ml-2 font-medium text-neutral-900 dark:text-neutral-100">
              {result.candidate_info?.name || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-neutral-500 dark:text-neutral-400">Email:</span>
            <span className="ml-2 font-medium text-neutral-900 dark:text-neutral-100">
              {result.candidate_info?.email || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-neutral-500 dark:text-neutral-400">Job ID:</span>
            <span className="ml-2 font-medium text-neutral-900 dark:text-neutral-100">
              {result.candidate_info?.job_id || 'N/A'}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        {r.pros && r.pros.length > 0 && (
          <motion.div 
            variants={itemVariants}
            className="p-6 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl"
          >
            <div className="flex items-center mb-4">
              <IconTrendingUp className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
              <h4 className="font-semibold text-green-800 dark:text-green-300">Strengths</h4>
            </div>
            <ul className="space-y-2">
              {r.pros.map((pro, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start text-sm text-green-700 dark:text-green-300"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  {pro}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Areas for Improvement */}
        {r.cons && r.cons.length > 0 && (
          <motion.div 
            variants={itemVariants}
            className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl"
          >
            <div className="flex items-center mb-4">
              <IconTrendingDown className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
              <h4 className="font-semibold text-red-800 dark:text-red-300">Areas for Improvement</h4>
            </div>
            <ul className="space-y-2">
              {r.cons.map((con, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start text-sm text-red-700 dark:text-red-300"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  {con}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>

      {/* Missing Skills */}
      {r.missing_skills && r.missing_skills.length > 0 && (
        <motion.div 
          variants={itemVariants}
          className="p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl"
        >
          <div className="flex items-center mb-4">
            <IconBulb className="w-5 h-5 mr-2 text-amber-600 dark:text-amber-400" />
            <h4 className="font-semibold text-amber-800 dark:text-amber-300">Missing Skills</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {r.missing_skills.map((skill, index) => (
              <motion.span 
                key={index}
                className="px-3 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-sm rounded-full border border-amber-200 dark:border-amber-700"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * index }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Analysis */}
      {r.analysis_explanation && (
        <motion.div 
          variants={itemVariants}
          className="p-6 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl"
        >
          <div className="flex items-center mb-4">
            <IconClipboardCheck className="w-5 h-5 mr-2 text-neutral-600 dark:text-neutral-400" />
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">Detailed Analysis</h4>
          </div>
          <motion.p 
            className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {r.analysis_explanation.length > 400 ? (
              <>
                {truncate(r.analysis_explanation, 400)}
                <details className="mt-3">
                  <summary className="cursor-pointer text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium">
                    Read full analysis
                  </summary>
                  <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                    {r.analysis_explanation}
                  </p>
                </details>
              </>
            ) : (
              r.analysis_explanation
            )}
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  )
}
