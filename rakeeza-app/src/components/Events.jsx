import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const eventTypes = ['meeting', 'interview', 'review', 'deadline']

const Events = ({ events, onAddEvent, onRemoveEvent }) => {
  const { t } = useTranslation()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('09:00')
  const [type, setType] = useState('meeting')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!title.trim() || !date) return
    onAddEvent({
      id: Date.now().toString(),
      title: title.trim(),
      date,
      time,
      type,
    })
    setTitle('')
    setDate('')
    setTime('09:00')
    setType('meeting')
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-whisper bg-surface/80 p-6 shadow-diffused backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] font-medium text-steel">{t('events.title')}</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">{t('events.subtitle')}</h2>
            <p className="mt-2 text-steel">{t('events.subtitle')}</p>
          </div>
          <div className="rounded-3xl bg-accent/10 px-4 py-3 text-accent ring-1 ring-accent/20">
            <p className="text-xs uppercase tracking-[0.22em] font-medium text-accent/80">{t('events.totalItems')}</p>
            <p className="mt-1 text-2xl font-bold">{events.length}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 lg:grid-cols-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('advisor.placeholder')}
            className="rounded-2xl border border-whisper bg-canvas px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/30"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-2xl border border-whisper bg-canvas px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/30"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="rounded-2xl border border-whisper bg-canvas px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/30"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="min-w-[120px] rounded-2xl border border-whisper bg-canvas px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/30"
            >
              {eventTypes.map((option) => (
                <option key={option} value={option}>
                  {t(`eventTypes.${option}`)}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent/90 active:scale-[0.98]"
            >
              {t('events.addEvent')}
            </button>
          </div>
        </form>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-whisper bg-surface/50 p-12 text-center opacity-80 border-dashed">
          <div className="rounded-full bg-accent/10 p-5 ring-1 ring-accent/20">
            <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xl font-semibold text-ink">{t('emptyState.events.title')}</p>
            <p className="mt-2 max-w-sm text-sm text-steel">
              {t('emptyState.events.description')}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <article key={event.id} className="group rounded-3xl border border-whisper bg-surface/80 p-5 shadow-diffused transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] font-medium text-steel">{t(`eventTypes.${event.type}`)}</p>
                  <h3 className="mt-1 text-xl font-semibold text-ink">{event.title}</h3>
                </div>
                <div className="space-y-1 text-left sm:text-right text-steel font-medium">
                  <p>{event.date}</p>
                  <p>{event.time}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-steel border-t border-whisper pt-5">
                <span className="rounded-full border border-whisper bg-surface px-3 py-1">{t(`eventTypes.${event.type}`)}</span>
                <button
                  type="button"
                  onClick={() => onRemoveEvent(event.id)}
                  className="rounded-full border border-red-500/30 px-3 py-1 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                >
                  {t('events.remove')}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Events
