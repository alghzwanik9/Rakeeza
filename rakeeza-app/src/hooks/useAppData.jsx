import { useEffect, useMemo, useState } from 'react'
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

  // Mutations
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
  }
}
