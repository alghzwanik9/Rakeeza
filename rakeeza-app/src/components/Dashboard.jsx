import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Header from './Header.jsx'

const sprintOptions = [60, 120, 180]

const Dashboard = ({ tasks, points, streak, completion, timerControls }) => {
  const { t } = useTranslation()
  const { 
    selectedSprint, 
    selectedTaskId, 
    setSelectedTaskId, 
    secondsLeft, 
    isRunning, 
    startTimer, 
    pauseTimer, 
    resetTimer 
  } = timerControls || {}

  const [customHours, setCustomHours] = useState('')
  const [customMinutes, setCustomMinutes] = useState('')

  const activeTasks = useMemo(
    () => tasks.filter((task) => !task.completed).slice(0, 4),
    [tasks],
  )

  // Default to first task if none selected but tasks exist
  useEffect(() => {
    if (!selectedTaskId && activeTasks.length > 0) {
      if (setSelectedTaskId) setSelectedTaskId(activeTasks[0].id)
    }
  }, [activeTasks, selectedTaskId, setSelectedTaskId])

  const minutes = String(Math.floor((secondsLeft || 0) / 60)).padStart(2, '0')
  const seconds = String((secondsLeft || 0) % 60).padStart(2, '0')

  return (
    <section className="space-y-6">
      <Header streak={streak} points={points} completion={completion} />
      
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <div className="rounded-3xl border border-whisper bg-surface/80 p-6 shadow-diffused backdrop-blur-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-steel">{t('dashboard.title')}</p>
              <h2 className="mt-2 text-3xl font-semibold text-ink">{t('dashboard.subtitle')}</h2>
            </div>
            <div className="rounded-3xl bg-accent px-5 py-3 text-white shadow-lg shadow-accent/20">
              <p className="text-xs uppercase tracking-[0.22em] text-white/80">{t('dashboard.target')}</p>
              <p className="mt-1 text-2xl font-bold text-white">
                {Math.floor((selectedSprint || 60) / 60)}h {((selectedSprint || 60) % 60) > 0 ? `${(selectedSprint || 60) % 60}m` : ''}
              </p>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 rounded-3xl border border-whisper bg-canvas/70 p-8 text-center backdrop-blur-md relative overflow-hidden">
            {/* Glowing orb effect behind */}
            <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[100px]"></div>

            {activeTasks.length > 0 ? (
              <div className="z-10 flex flex-col items-center w-full max-w-xs mb-2">
                <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-3">المهمة الحالية للتركيز</p>
                <div className="relative w-full">
                  <select 
                    value={selectedTaskId || ''} 
                    onChange={(e) => setSelectedTaskId && setSelectedTaskId(e.target.value)}
                    className="w-full appearance-none text-center bg-surface/50 border border-whisper rounded-xl px-4 py-3 text-sm font-semibold text-ink outline-none cursor-pointer hover:border-accent transition-colors"
                    style={{ textAlignLast: 'center' }}
                  >
                    {activeTasks.map(task => (
                      <option key={task.id} value={task.id} className="text-left bg-surface">{task.title}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center px-2 text-steel">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            ) : (
               <div className="z-10 flex flex-col items-center w-full max-w-xs mb-2">
                 <p className="text-sm text-steel mb-2 bg-surface/50 px-4 py-2 rounded-xl border border-whisper">لا توجد مهام معلقة للبدء</p>
               </div>
            )}
            
            <div className="z-10 text-6xl font-bold text-ink tracking-tight drop-shadow-sm font-mono mt-2">{minutes}:{seconds}</div>
            
            <div className="z-10 mt-6 flex flex-col items-center justify-center gap-4 w-full">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {sprintOptions.map((minutesOption) => (
                  <button
                    key={minutesOption}
                    type="button"
                    onClick={() => {
                      if (resetTimer) resetTimer(minutesOption)
                      setCustomHours('')
                      setCustomMinutes('')
                    }}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                      selectedSprint === minutesOption
                        ? 'bg-accent text-white shadow-lg shadow-accent/20 border border-accent'
                        : 'bg-surface border border-whisper text-steel hover:bg-white/5 hover:text-ink'
                    }`}
                  >
                    {minutesOption / 60}h
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-2 bg-surface/50 p-2 rounded-2xl border border-whisper w-full max-w-sm justify-center">
                <input 
                  type="number" 
                  min="0"
                  placeholder="ساعة" 
                  value={customHours}
                  onChange={(e) => setCustomHours(e.target.value)}
                  className="w-20 rounded-xl border border-whisper bg-surface px-3 py-2 text-sm text-center outline-none focus:border-accent text-ink"
                />
                <span className="text-steel">:</span>
                <input 
                  type="number" 
                  min="0"
                  max="59"
                  placeholder="دقيقة" 
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  className="w-20 rounded-xl border border-whisper bg-surface px-3 py-2 text-sm text-center outline-none focus:border-accent text-ink"
                />
                <button
                  type="button"
                  onClick={() => {
                    const hrs = parseInt(customHours) || 0
                    const mins = parseInt(customMinutes) || 0
                    const totalMins = hrs * 60 + mins
                    if (totalMins > 0 && resetTimer) {
                      resetTimer(totalMins)
                    }
                  }}
                  className="mr-2 rounded-xl bg-ink px-4 py-2 text-sm font-medium text-canvas transition hover:bg-ink/80"
                >
                  تعيين
                </button>
              </div>
            </div>
            
            <div className="z-10 mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center w-full max-w-sm">
              {!isRunning ? (
                <button
                  type="button"
                  onClick={() => startTimer && startTimer()}
                  className="flex-1 rounded-2xl bg-accent px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition hover:bg-accent/90 active:scale-[0.98]"
                >
                  ابدأ الجلسة
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => pauseTimer && pauseTimer()}
                  className="flex-1 rounded-2xl bg-amber-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition hover:bg-amber-600 active:scale-[0.98]"
                >
                  إيقاف مؤقت
                </button>
              )}
              
              <button
                type="button"
                onClick={() => resetTimer && resetTimer()}
                className="rounded-2xl border border-whisper bg-surface px-6 py-4 text-sm font-semibold text-ink transition hover:bg-whisper active:scale-[0.98]"
              >
                إعادة ضبط
              </button>
            </div>
          </div>
        </div>

        <aside className="space-y-6 rounded-3xl border border-whisper bg-surface/80 p-6 shadow-diffused backdrop-blur-md">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-steel">{t('dashboard.subtitle')}</p>
            <h2 className="mt-3 text-2xl font-semibold text-ink">{t('dashboard.title')}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-whisper bg-canvas/70 p-4">
              <p className="text-sm text-steel">{t('dashboard.activeTasks')}</p>
              <p className="mt-2 text-3xl font-semibold text-ink">{activeTasks.length}</p>
            </div>
            <div className="rounded-3xl border border-whisper bg-canvas/70 p-4">
              <p className="text-sm text-steel">{t('dashboard.completion')}</p>
              <p className="mt-2 text-3xl font-semibold text-ink">{completion}%</p>
            </div>
            <div className="rounded-3xl border border-whisper bg-canvas/70 p-4">
              <p className="text-sm text-steel">{t('dashboard.streak')}</p>
              <p className="mt-2 text-3xl font-semibold text-amber-500">{streak} days</p>
            </div>
            <div className="rounded-3xl border border-whisper bg-canvas/70 p-4">
              <p className="text-sm text-steel">{t('dashboard.points')}</p>
              <p className="mt-2 text-3xl font-semibold text-accent">{points}</p>
            </div>
          </div>
          <div className="rounded-3xl border border-whisper bg-canvas/70 p-4">
            <p className="text-sm text-steel">{t('dashboard.topPending')}</p>
            <ul className="mt-4 space-y-3">
              {activeTasks.length ? (
                activeTasks.map((task) => (
                  <li key={task.id} className="rounded-2xl bg-surface/80 border border-whisper p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ink">{task.title}</p>
                        <p className="text-sm text-steel">
                          {t(`taskCategories.${task.category}`)} • {task.type === 'timed' ? `${task.duration}h ${t('taskTypes.timed')}` : task.type === 'deadline' ? task.deadline : t('taskTypes.standard')}
                        </p>
                      </div>
                      <span className="rounded-full bg-canvas border border-whisper px-3 py-1 text-xs uppercase tracking-[0.24em] text-steel">
                        {t(`taskTypes.${task.type}`)}
                      </span>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-steel">{t('dashboard.noPending')}</li>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default Dashboard
