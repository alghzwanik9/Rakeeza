import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Flame, Star, Trophy, Lock } from 'lucide-react'

const Achievements = ({ tasks, points, streak, completion }) => {
  const { t } = useTranslation()

  const completedTasksCount = tasks.filter(t => t.completed).length

  // Calculate achievements state
  const badges = [
    {
      id: 'taskCrusher',
      title: t('achievements.badgeTaskCrusher.name'),
      description: t('achievements.badgeTaskCrusher.description'),
      icon: CheckCircle2,
      isUnlocked: completedTasksCount >= 5,
      color: 'from-emerald-400 to-teal-500',
      iconColor: 'text-emerald-950',
      bgClass: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'streakMaster',
      title: t('achievements.badgeStreakMaster.name'),
      description: t('achievements.badgeStreakMaster.description'),
      icon: Flame,
      isUnlocked: streak >= 7,
      color: 'from-orange-400 to-red-500',
      iconColor: 'text-orange-950',
      bgClass: 'bg-orange-500/10 border-orange-500/20',
    },
    {
      id: 'pointsCollector',
      title: t('achievements.badgePointsCollector.name'),
      description: t('achievements.badgePointsCollector.description'),
      icon: Star,
      isUnlocked: points >= 100,
      color: 'from-amber-300 to-yellow-500',
      iconColor: 'text-amber-950',
      bgClass: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      id: 'perfectionist',
      title: t('achievements.badgePerfectionist.name'),
      description: t('achievements.badgePerfectionist.description'),
      icon: Trophy,
      isUnlocked: completion === 100 && tasks.length > 0,
      color: 'from-fuchsia-400 to-purple-500',
      iconColor: 'text-fuchsia-950',
      bgClass: 'bg-fuchsia-500/10 border-fuchsia-500/20',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } }
  }

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-surface bg-surface/50 p-8 shadow-diffused backdrop-blur-xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-[80px] pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />
        
        <div className="relative z-10">
          <p className="text-sm uppercase tracking-[0.24em] text-accent/80 font-semibold">{t('achievements.title')}</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-ink">{t('achievements.title')}</h2>
          <p className="mt-3 text-lg text-steel max-w-2xl leading-relaxed">{t('achievements.subtitle')}</p>
        </div>
      </div>

      {/* Badges Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {badges.map((badge) => {
          const Icon = badge.icon
          return (
            <motion.div 
              key={badge.id} 
              variants={itemVariants}
              className={`relative overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                badge.isUnlocked 
                  ? `${badge.bgClass} shadow-lg shadow-black/5` 
                  : 'border-whisper bg-surface/30 opacity-70 grayscale-[0.5]'
              }`}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner ${
                    badge.isUnlocked ? `bg-gradient-to-br ${badge.color}` : 'bg-surface border border-whisper'
                  }`}>
                    {badge.isUnlocked ? (
                      <Icon className={`h-7 w-7 ${badge.iconColor}`} />
                    ) : (
                      <Lock className="h-6 w-6 text-steel/50" />
                    )}
                  </div>
                  
                  <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full ${
                    badge.isUnlocked ? 'bg-ink text-canvas' : 'bg-surface border border-whisper text-steel'
                  }`}>
                    {badge.isUnlocked ? t('achievements.unlocked') : t('achievements.locked')}
                  </span>
                </div>
                
                <h3 className={`text-xl font-bold ${badge.isUnlocked ? 'text-ink' : 'text-steel'}`}>
                  {badge.title}
                </h3>
                <p className={`mt-2 text-sm leading-relaxed flex-grow ${badge.isUnlocked ? 'text-steel' : 'text-steel/60'}`}>
                  {badge.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}

export default Achievements
