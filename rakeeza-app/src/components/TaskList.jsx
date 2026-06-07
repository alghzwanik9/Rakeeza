import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const categories = ['study', 'work', 'meetings']
const taskTypes = ['standard', 'timed', 'deadline']

const TaskList = ({ tasks, onAddTask, onToggleComplete, onDeleteTask, updateTask }) => {
  const { t } = useTranslation()
  const [title, setTitle] = useState('')
  const [type, setType] = useState('standard')
  const [category, setCategory] = useState('study')
  const [duration, setDuration] = useState(1)
  const [deadline, setDeadline] = useState('')
  const [notes, setNotes] = useState('')

  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editForm, setEditForm] = useState({})

  const activeCount = useMemo(() => tasks.filter((task) => !task.completed).length, [tasks])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!title.trim()) return
    onAddTask({
      id: Date.now().toString(),
      title: title.trim(),
      type,
      category,
      duration: type === 'timed' ? duration : 1,
      deadline: type === 'deadline' ? deadline : '',
      notes: notes.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    })
    setTitle('')
    setType('standard')
    setCategory('study')
    setDuration(1)
    setDeadline('')
    setNotes('')
  }

  const handleEditClick = (task) => {
    setEditingTaskId(task.id)
    setEditForm({ ...task })
  }

  const handleSaveEdit = (taskId) => {
    if (!editForm.title?.trim()) return
    updateTask(taskId, editForm)
    setEditingTaskId(null)
  }

  const handleCancelEdit = () => {
    setEditingTaskId(null)
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-whisper bg-surface/80 p-6 shadow-diffused backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] font-medium text-steel">{t('taskList.title')}</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">{t('taskList.subtitle')}</h2>
            <p className="mt-2 text-steel">{t('taskList.subtitle')}</p>
          </div>
          <div className="rounded-3xl bg-accent/10 px-4 py-3 text-accent ring-1 ring-accent/20">
            <p className="text-xs uppercase tracking-[0.24em] font-medium text-accent/80">{t('events.totalItems')}</p>
            <p className="mt-1 text-2xl font-bold">{activeCount}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="grid gap-5">
            <label className="space-y-2 text-sm font-medium text-steel">
              {t('taskList.taskName')}
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('taskList.enterTitle')}
                className="w-full rounded-2xl border border-whisper bg-canvas px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/30"
              />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-steel">
                {t('taskList.category')}
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-2xl border border-whisper bg-canvas px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/30"
                >
                  {categories.map((option) => (
                    <option key={option} value={option}>
                      {t(`taskCategories.${option}`)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm font-medium text-steel">
                {t('taskList.taskType')}
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-2xl border border-whisper bg-canvas px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/30"
                >
                  {taskTypes.map((option) => (
                    <option key={option} value={option}>
                      {t(`taskTypes.${option}`, option)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            
            <div className="grid gap-5 sm:grid-cols-2">
              {type === 'timed' && (
                <label className="space-y-2 text-sm font-medium text-steel">
                  {t('taskList.durationLabel')} (Hours)
                  <input
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full rounded-2xl border border-whisper bg-canvas px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/30"
                  />
                </label>
              )}
              {type === 'deadline' && (
                <label className="space-y-2 text-sm font-medium text-steel">
                  Deadline Date
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full rounded-2xl border border-whisper bg-canvas px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/30"
                  />
                </label>
              )}
            </div>

            <label className="space-y-2 text-sm font-medium text-steel">
              Notes / ملاحظات
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes here... أضف ملاحظاتك هنا..."
                className="w-full rounded-2xl border border-whisper bg-canvas px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/30 min-h-[80px]"
              />
            </label>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl border border-whisper bg-surface p-5">
            <div className="flex-1 space-y-3">
              <p className="text-sm uppercase tracking-[0.22em] font-medium text-steel">{t('taskList.previewTitle')}</p>
              <div className="rounded-2xl bg-canvas p-4 ring-1 ring-whisper">
                <p className="font-medium text-ink break-words">{title || t('taskList.enterTitle')}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-surface px-2 py-1 text-xs text-steel ring-1 ring-whisper">
                    {type === 'timed'
                      ? `${t(`taskTypes.${type}`, type)} • ${duration}h`
                      : type === 'deadline'
                      ? `${t(`taskTypes.${type}`, type)} • ${deadline}`
                      : t(`taskTypes.${type}`, type)}
                  </span>
                  <span className="rounded-full bg-surface px-2 py-1 text-xs text-steel ring-1 ring-whisper">{t(`taskCategories.${category}`)}</span>
                </div>
                {notes && (
                  <p className="mt-3 text-xs text-steel line-clamp-2">{notes}</p>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-2xl bg-accent px-5 py-4 text-sm font-semibold text-white transition active:scale-[0.98] hover:bg-accent/90"
            >
              {t('taskList.addTask')}
            </button>
          </div>
        </form>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-whisper bg-surface/50 p-12 text-center opacity-80 border-dashed">
          <div className="rounded-full bg-accent/10 p-5 ring-1 ring-accent/20">
            <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-xl font-semibold text-ink">{t('emptyState.tasks.title')}</p>
            <p className="mt-2 max-w-sm text-sm text-steel">
              {t('emptyState.tasks.description')}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <article key={task.id} className="group rounded-3xl border border-whisper bg-surface/80 p-5 shadow-diffused transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
              {editingTaskId === task.id ? (
                <div className="grid gap-4">
                  <input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full rounded-xl border border-whisper bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                    placeholder="Task Name"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <select
                      value={editForm.type}
                      onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                      className="w-full rounded-xl border border-whisper bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                    >
                      {taskTypes.map((option) => (
                        <option key={option} value={option}>{t(`taskTypes.${option}`, option)}</option>
                      ))}
                    </select>
                    {editForm.type === 'timed' && (
                      <input
                        type="number"
                        min="1"
                        value={editForm.duration || 1}
                        onChange={(e) => setEditForm({ ...editForm, duration: Number(e.target.value) })}
                        className="w-full rounded-xl border border-whisper bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                        placeholder="Hours"
                      />
                    )}
                    {editForm.type === 'deadline' && (
                      <input
                        type="date"
                        value={editForm.deadline || ''}
                        onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                        className="w-full rounded-xl border border-whisper bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                      />
                    )}
                  </div>
                  <textarea
                    value={editForm.notes || ''}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    placeholder="Notes / ملاحظات..."
                    className="w-full rounded-xl border border-whisper bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-accent min-h-[60px]"
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={handleCancelEdit} className="rounded-xl px-4 py-2 text-sm font-medium text-steel hover:bg-surface">Cancel</button>
                    <button onClick={() => handleSaveEdit(task.id)} className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90">Save</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <button
                        type="button"
                        onClick={() => onToggleComplete(task.id)}
                        className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all active:scale-90 ${task.completed ? 'border-accent bg-accent' : 'border-steel bg-transparent hover:border-accent'}`}
                      >
                        {task.completed && (
                          <svg className="h-3.5 w-3.5 text-canvas" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <div>
                        <h3 className={`text-lg font-semibold transition-colors ${task.completed ? 'text-steel line-through' : 'text-ink'}`}>
                          {task.title}
                        </h3>
                        <p className="text-sm text-steel flex flex-wrap gap-2 items-center mt-1">
                          <span>{t(`taskCategories.${task.category}`)}</span>
                          <span>•</span>
                          <span>{task.type === 'timed' ? `${task.duration}h` : task.type === 'deadline' ? task.deadline : t(`taskTypes.${task.type}`, task.type)}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-steel">
                      <span className="rounded-full border border-whisper bg-surface px-3 py-1">{t(`taskTypes.${task.type}`, task.type)}</span>
                      <span className={`rounded-full border px-3 py-1 ${task.completed ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                        {task.completed ? t('taskList.completed') : t('taskList.open')}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleEditClick(task)}
                        className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-blue-500 transition-colors hover:bg-blue-500 hover:text-white"
                      >
                        Edit / تعديل
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTask(task.id)}
                        className="rounded-full border border-red-500/30 px-3 py-1 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                      >
                        {t('events.remove')}
                      </button>
                    </div>
                  </div>
                  {task.notes && (
                    <div className="mt-4 rounded-2xl bg-surface/50 p-4 ring-1 ring-whisper">
                      <p className="text-xs font-medium uppercase tracking-[0.1em] text-steel mb-2">Notes / ملاحظات</p>
                      <p className="text-sm text-ink whitespace-pre-wrap">{task.notes}</p>
                    </div>
                  )}
                  {task.type === 'timed' && !task.completed && (
                    <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center border-t border-whisper pt-5">
                      <div className="rounded-2xl bg-surface/50 p-4 ring-1 ring-whisper">
                        <p className="text-sm text-steel">{t('taskList.durationLabel')} (Hours)</p>
                        <p className="mt-1 text-lg font-semibold text-ink">{task.duration} hours</p>
                      </div>
                      <label className="space-y-2 text-sm text-steel w-full sm:w-48">
                        Update Hours
                        <input
                          type="number"
                          min="1"
                          value={task.duration}
                          onChange={(e) => updateTask && updateTask(task.id, { duration: Number(e.target.value) })}
                          className="w-full rounded-xl border border-whisper bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                        />
                      </label>
                    </div>
                  )}
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default TaskList
