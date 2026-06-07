import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Sparkles } from 'lucide-react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

const Header = ({ streak, points, completion }) => {
  const { t } = useTranslation()
  const progress = Math.min(100, Math.max(0, completion))
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (progress / 100) * circumference

  // Animated values
  const pointsCount = useMotionValue(0)
  const roundedPoints = useTransform(pointsCount, Math.round)
  
  const streakCount = useMotionValue(0)
  const roundedStreak = useTransform(streakCount, Math.round)
  
  const completionCount = useMotionValue(0)
  const roundedCompletion = useTransform(completionCount, Math.round)

  useEffect(() => {
    const pointsAnim = animate(pointsCount, points, { duration: 1.5, ease: "easeOut" })
    const streakAnim = animate(streakCount, streak, { duration: 1.5, ease: "easeOut" })
    const completionAnim = animate(completionCount, progress, { duration: 1.5, ease: "easeOut" })
    
    return () => {
      pointsAnim.stop()
      streakAnim.stop()
      completionAnim.stop()
    }
  }, [points, streak, progress, pointsCount, streakCount, completionCount])

  return (
    <header className="space-y-6 p-6 sm:p-8 rounded-3xl border border-whisper bg-surface/80 shadow-diffused backdrop-blur-xl">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 rounded-full bg-canvas/80 px-4 py-2 text-sm text-steel shadow-inner ring-1 ring-whisper">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="font-semibold text-ink">{t('header.brand')}</span>
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-ink sm:text-4xl">{t('header.title')}</h1>
            <p className="mt-3 max-w-2xl text-steel sm:text-base">{t('header.subtitle')}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-whisper bg-surface/50 p-5 text-center transition hover:bg-surface">
            <p className="text-xs uppercase tracking-[0.2em] font-medium text-steel">{t('dashboard.streak')}</p>
            <motion.p className="mt-2 text-3xl font-bold text-accent">{roundedStreak}</motion.p>
          </div>
          <div className="rounded-2xl border border-whisper bg-surface/50 p-5 text-center transition hover:bg-surface">
            <p className="text-xs uppercase tracking-[0.2em] font-medium text-steel">{t('dashboard.points')}</p>
            <motion.p className="mt-2 text-3xl font-bold text-accent">{roundedPoints}</motion.p>
          </div>
        </div>

        <div className="rounded-2xl border border-whisper bg-surface/50 p-5 max-w-[180px] text-center transition hover:bg-surface relative overflow-hidden group">
          {/* Subtle glow effect behind the circle */}
          <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl rounded-full" />
          
          <p className="text-xs uppercase tracking-[0.2em] font-medium text-steel relative z-10">{t('dashboard.completion')}</p>
          <div className="relative mx-auto mt-4 h-20 w-20">
            <svg className="h-20 w-20 relative z-10" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} strokeWidth="8" className="fill-none stroke-canvas" />
              <motion.circle
                cx="50"
                cy="50"
                r={radius}
                strokeWidth="8"
                strokeLinecap="round"
                className="fill-none stroke-accent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <span className="absolute inset-0 grid place-items-center text-sm font-bold text-ink z-10">
              <span className="flex items-center">
                <motion.span>{roundedCompletion}</motion.span>%
              </span>
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
