import { useEffect, useMemo, useState, useRef } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/clerk-react'

export function useAppData() {
  const { user } = useUser()
  
  const rawTasks = useQuery(api.tasks.get)
  const rawEvents = useQuery(api.events.get)
  const rawProfile = useQuery(api.profiles.get)

  // Map _id to id for seamless UI integration
  const tasks = useMemo(() => rawTasks ? rawTasks.map(t => ({ ...t, id: t._id })) : [], [rawTasks])
  const events = useMemo(() => rawEvents ? rawEvents.map(e => ({ ...e, id: e._id })) : [], [rawEvents])
  
  const profile = rawProfile || {
    name: user?.firstName || '',
    avatar: user?.imageUrl || '',
    title: '',
    bio: '',
    skills: [],
    socialLinks: { linkedin: '', github: '', email: '' },
    projects: [],
    points: 0,
    streak: 0,
  }

  const points = profile.points || 0
  const streak = profile.streak || 0

  const [theme, setTheme] = useState(localStorage.getItem('rakeeza-theme') || 'dark')
  const [toastMessage, setToastMessage] = useState(null)

  useEffect(() => {
    localStorage.setItem('rakeeza-theme', theme)
  }, [theme])

  // Mutations (Moved up for Timer access)
  const addTaskMutation = useMutation(api.tasks.add)
  const toggleCompleteMutation = useMutation(api.tasks.toggleComplete)
  const updateTaskMutation = useMutation(api.tasks.updateTask)
  const deleteTaskMutation = useMutation(api.tasks.remove)

  const addEventMutation = useMutation(api.events.add)
  const removeEventMutation = useMutation(api.events.remove)

  const updateProfileMutation = useMutation(api.profiles.initializeOrUpdateProfile)
  const addProjectMutation = useMutation(api.profiles.addProject)
  const removeProjectMutation = useMutation(api.profiles.removeProject)
  const updatePointsMutation = useMutation(api.profiles.updatePoints)

  // --- Global Persistent Timer Logic ---
  const updateTimerMutation = useMutation(api.profiles.updateTimer)

  const [selectedSprint, setSelectedSprint] = useState(60)
  const [selectedTaskId, setSelectedTaskId] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [endTime, setEndTime] = useState(null)
  const [secondsLeft, setSecondsLeft] = useState(60 * 60)

  // Sync from backend
  useEffect(() => {
    // Run asynchronously to avoid React strict cascading render warnings
    const timeoutId = setTimeout(() => {
      if (profile?.timer) {
        if (profile.timer.selectedSprint !== undefined) setSelectedSprint(profile.timer.selectedSprint)
        if (profile.timer.selectedTaskId !== undefined) setSelectedTaskId(profile.timer.selectedTaskId)
        if (profile.timer.isRunning !== undefined) setIsRunning(profile.timer.isRunning)
        setEndTime(profile.timer.endTime || null)
        
        if (!profile.timer.isRunning) {
          if (profile.timer.timeLeft !== undefined) {
            setSecondsLeft(profile.timer.timeLeft)
          } else {
            setSecondsLeft((profile.timer.selectedSprint || 60) * 60)
          }
        }
      } else {
        // Fallback for new profiles
        const localSprint = Number(localStorage.getItem('rakeeza-timer-sprint')) || 60
        setSelectedSprint(localSprint)
        setSecondsLeft(localSprint * 60)
      }
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [profile?.timer])

  // Request Notification permission on load
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission()
    }
  }, [])

  // Keep latest timer context in a ref to avoid resetting the interval
  const timerContextRef = useRef({ tasks, selectedTaskId, selectedSprint, points, endTime })
  useEffect(() => {
    timerContextRef.current = { tasks, selectedTaskId, selectedSprint, points, endTime }
  }, [tasks, selectedTaskId, selectedSprint, points, endTime])

  // The actual interval ticking
  useEffect(() => {
    if (!isRunning) return
    
    let isFinished = false

    const updateTimer = () => {
      if (isFinished) return

      const currentEndTime = timerContextRef.current.endTime
      if (!currentEndTime) return
      
      const remaining = Math.round((currentEndTime - Date.now()) / 1000)
      
      if (remaining <= 0) {
        isFinished = true
        setIsRunning(false)
        setSecondsLeft(0)
        setEndTime(null)
        
        const { tasks: currentTasks, selectedTaskId: currentTaskId, selectedSprint: currentSprint, points: currentPoints } = timerContextRef.current
        
        updateTimerMutation({
          timer: {
            endTime: undefined,
            timeLeft: 0,
            isRunning: false,
            selectedSprint: currentSprint,
            selectedTaskId: currentTaskId
          }
        }).catch(console.error)
        
        // Deduct time from the assigned task
        const currentTask = currentTasks.find(t => t.id === currentTaskId)
        
        if (currentTask && currentTask.type === 'timed' && typeof currentTask.duration === 'number') {
          const hoursSpent = currentSprint / 60
          const newDuration = Math.max(0, currentTask.duration - hoursSpent)
          
          if (newDuration === 0) {
            toggleCompleteMutation({ taskId: currentTask._id })
            updatePointsMutation({ points: currentPoints + 10 })
            setToastMessage(`تم إنجاز المهمة بالكامل: ${currentTask.title} ✨`)
          } else {
            updateTaskMutation({ taskId: currentTask._id, duration: newDuration })
            setToastMessage(`تم خصم ${hoursSpent} ساعة من مهمة: ${currentTask.title} ⏱️`)
          }
        }
        
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('استوديو التركيز: انتهت الجلسة!', {
            body: currentTask ? `عمل رائع في ${currentTask.title}! خذ قسطاً من الراحة الآن.` : 'عمل رائع! خذ قسطاً من الراحة الآن.',
          })
        }
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')
          audio.play().catch(err => console.log('Audio play failed', err))
        } catch (err) {
          console.log('Audio error', err)
        }
      } else {
        setSecondsLeft(remaining)
      }
    }

    const interval = setInterval(updateTimer, 1000)
    document.addEventListener('visibilitychange', updateTimer)
    
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', updateTimer)
    }
  }, [isRunning, toggleCompleteMutation, updatePointsMutation, updateTaskMutation, updateTimerMutation])

  const timerControls = {
    selectedSprint,
    selectedTaskId,
    setSelectedTaskId: (id) => {
      setSelectedTaskId(id)
      updateTimerMutation({
        timer: {
          endTime: endTime || undefined,
          timeLeft: isRunning ? undefined : secondsLeft,
          isRunning,
          selectedSprint,
          selectedTaskId: id
        }
      }).catch(console.error)
    },
    secondsLeft: secondsLeft,
    isRunning,
    startTimer: () => {
      const newEndTime = Date.now() + secondsLeft * 1000
      setEndTime(newEndTime)
      setIsRunning(true)
      updateTimerMutation({
        timer: {
          endTime: newEndTime,
          timeLeft: undefined,
          isRunning: true,
          selectedSprint,
          selectedTaskId
        }
      }).catch(console.error)
    },
    pauseTimer: () => {
      const remaining = isRunning && endTime ? Math.max(0, Math.round((endTime - Date.now()) / 1000)) : secondsLeft
      setEndTime(null)
      setIsRunning(false)
      setSecondsLeft(remaining)
      updateTimerMutation({
        timer: {
          endTime: undefined,
          timeLeft: remaining,
          isRunning: false,
          selectedSprint,
          selectedTaskId
        }
      }).catch(console.error)
    },
    resetTimer: (minutes) => {
      const newSprint = minutes || selectedSprint
      setIsRunning(false)
      setEndTime(null)
      setSelectedSprint(newSprint)
      setSecondsLeft(newSprint * 60)
      updateTimerMutation({
        timer: {
          endTime: undefined,
          timeLeft: newSprint * 60,
          isRunning: false,
          selectedSprint: newSprint,
          selectedTaskId
        }
      }).catch(console.error)
    }
  }

  // Mutations have been moved above the Timer Logic

  // Profile initialization
  useEffect(() => {
    if (user && rawProfile === null) {
        updateProfileMutation({
            name: user.firstName || '',
            avatar: user.imageUrl || ''
        })
    }
  }, [user, rawProfile, updateProfileMutation])

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const completion = useMemo(
    () => (tasks.length ? Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100) : 0),
    [tasks],
  )

  const addTask = (task) => {
      addTaskMutation({
          title: task.title,
          type: task.type,
          category: task.category,
          duration: task.duration,
          completed: false
      })
      .then(() => showToast('تمت إضافة المهمة بنجاح! ✨'))
      .catch((error) => {
          console.error("Add task error:", error);
          showToast('حدث خطأ أثناء الإضافة: ' + error.message);
      })
  }

  const toggleComplete = async (taskId) => {
    const task = tasks.find((item) => item.id === taskId)
    if (!task) return

    try {
      await toggleCompleteMutation({ taskId: task._id })
      
      const delta = !task.completed ? (task.type === 'timed' ? 10 : 5) : -(task.type === 'timed' ? 10 : 5)
      const newPoints = Math.max(0, points + delta)
      updatePointsMutation({ points: newPoints })

      if (!task.completed) {
        showToast(`Task completed: ${task.title} ✨`)
      }
    } catch (error) {
      console.error("Toggle complete error:", error);
      showToast('حدث خطأ: ' + error.message);
    }
  }

  const deleteTask = (taskId) => {
    const task = tasks.find((item) => item.id === taskId)
    if (task) {
      deleteTaskMutation({ taskId: task._id })
      .then(() => showToast('تم حذف المهمة.'))
      .catch((error) => {
          console.error("Delete task error:", error);
          showToast('حدث خطأ أثناء الحذف: ' + error.message);
      })
    }
  }

  const updateDuration = (taskId, newDuration) => {
    const task = tasks.find((item) => item.id === taskId)
    if (task) updateTaskMutation({ taskId: task._id, duration: newDuration })
  }

  const updateTask = (taskId, updates) => {
    const task = tasks.find((item) => item.id === taskId)
    if (task) {
      // Remove restricted properties from updates to prevent Convex error
      const cleanUpdates = { ...updates }
      delete cleanUpdates.id
      delete cleanUpdates._id
      delete cleanUpdates._creationTime
      delete cleanUpdates.userId
      updateTaskMutation({ taskId: task._id, ...cleanUpdates })
    }
  }

  const addEvent = (event) => addEventMutation({
      title: event.title,
      date: event.date,
      time: event.time,
      type: event.type
  })
  
  const removeEvent = (eventId) => {
    const event = events.find((item) => item.id === eventId)
    if (event) removeEventMutation({ eventId: event._id })
  }

  const addProject = (project) => addProjectMutation(project)
  const removeProject = (projectId) => removeProjectMutation({ projectId })

  const autoUpdateProfile = () => {
    const activeCategories = Array.from(new Set(tasks.filter((task) => !task.completed).map((task) => task.category)))
    const projectSkills = (profile.projects || []).flatMap((project) => project.techStack.split(',').map((skill) => skill.trim()))
    const aiSkills = ['NLP', 'CNN', 'Data Science', 'Product Design']

    const generatedSkills = Array.from(
      new Set([
        ...(profile.skills || []),
        ...activeCategories.map((category) =>
          category === 'study' ? 'Research' : category === 'work' ? 'Product Engineering' : 'Team Collaboration',
        ),
        ...projectSkills,
        ...aiSkills,
      ]),
    ).slice(0, 8)

    const generatedBio = `Final-year computer science student focused on AI, NLP, and hands-on product workflows. Currently balancing ${
      activeCategories.length ? activeCategories.join(', ') : 'cross-functional'
    } initiatives while building practical projects for research and career readiness.`

    updateProfileMutation({ bio: generatedBio, skills: generatedSkills })
  }

  const updateSocialLinks = (newLinks) => {
    updateProfileMutation({ socialLinks: { ...profile.socialLinks, ...newLinks } })
  }

  const updateProfileDetails = (details) => {
    updateProfileMutation(details)
  }
  
  const setStreak = () => {} // Streak logic omitted for now

  return {
    tasks,
    events,
    points,
    streak,
    profile,
    completion,
    addTask,
    toggleComplete,
    deleteTask,
    updateDuration,
    updateTask,
    addEvent,
    removeEvent,
    addProject,
    removeProject,
    autoUpdateProfile,
    updateSocialLinks,
    updateProfileDetails,
    setStreak,
    theme,
    setTheme,
    toastMessage,
    showToast,
    timerControls,
  }
}
