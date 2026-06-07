import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { SignedIn, SignedOut } from "@clerk/clerk-react"

import { useAppData } from './hooks/useAppData.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Dashboard from './components/Dashboard.jsx'
import TaskList from './components/TaskList.jsx'
import Events from './components/Events.jsx'
import Achievements from './components/Achievements.jsx'
import Profile from './components/Profile.jsx'
import AiAdvisor from './components/AiAdvisor.jsx'
import LandingPage from './components/LandingPage.jsx'
import PublicPortfolio from './pages/PublicPortfolio.jsx'

const pageVariants = {
  initial: { opacity: 0, y: 15, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -15, scale: 0.98 }
}
const pageTransition = { type: 'spring', stiffness: 100, damping: 20 }

const AnimatedRoutes = ({ tasks, points, streak, completion, events, profile, addTask, toggleComplete, deleteTask, updateTask, addEvent, removeEvent, addProject, removeProject, autoUpdateProfile, updateSocialLinks, updateProfileDetails, showToast }) => {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <Dashboard tasks={tasks} points={points} streak={streak} completion={completion} />
          </motion.div>
        } />
        <Route path="/tasks" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <TaskList
              tasks={tasks}
              onAddTask={addTask}
              onToggleComplete={toggleComplete}
              onDeleteTask={deleteTask}
              updateTask={updateTask}
            />
          </motion.div>
        } />
        <Route path="/events" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <Events events={events} onAddEvent={addEvent} onRemoveEvent={removeEvent} />
          </motion.div>
        } />
        <Route path="/achievements" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <Achievements tasks={tasks} points={points} streak={streak} completion={completion} />
          </motion.div>
        } />
        <Route path="/profile" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <Profile 
              profile={profile} 
              onAutoUpdate={autoUpdateProfile} 
              onAddProject={addProject} 
              onUpdateSocialLinks={updateSocialLinks}
              onUpdateProfile={updateProfileDetails}
              onRemoveProject={removeProject}
              tasks={tasks}
              events={events}
              showToast={showToast}
            />
          </motion.div>
        } />
        <Route path="/advisor" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <AiAdvisor tasks={tasks} events={events} profile={profile} />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const { i18n } = useTranslation()
  const {
    tasks,
    events,
    points,
    streak,
    profile,
    completion,
    addTask,
    toggleComplete,
    deleteTask,
    updateTask,
    addEvent,
    removeEvent,
    addProject,
    removeProject,
    autoUpdateProfile,
    updateSocialLinks,
    updateProfileDetails,
    theme,
    setTheme,
    toastMessage,
    showToast,
  } = useAppData()

  const currentLanguage = i18n.language || 'en'
  const isRTL = i18n.dir(currentLanguage) === 'rtl'

  useEffect(() => {
    document.documentElement.lang = currentLanguage
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.setAttribute('data-theme', theme)
  }, [currentLanguage, isRTL, theme])

  return (
    <Router>
      <div className="min-h-screen bg-canvas text-ink font-sans selection:bg-accent/30 selection:text-ink flex flex-col">
        <Navbar theme={theme} setTheme={setTheme} />
        
        <Routes>
          {/* External routes outside the main dashboard layout */}
          <Route path="/portfolio/:username" element={<PublicPortfolio />} />
          
          {/* Main App Layout */}
          <Route path="/*" element={
            <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-12 xl:px-16 flex-1">
              <main className="w-full">
                <SignedIn>
                  <AnimatedRoutes 
                    tasks={tasks} events={events} points={points} streak={streak} profile={profile} completion={completion}
                    addTask={addTask} toggleComplete={toggleComplete} deleteTask={deleteTask} updateTask={updateTask}
                    addEvent={addEvent} removeEvent={removeEvent} addProject={addProject} removeProject={removeProject}
                    autoUpdateProfile={autoUpdateProfile} updateSocialLinks={updateSocialLinks}
                    updateProfileDetails={updateProfileDetails} showToast={showToast}
                  />
                </SignedIn>
                <SignedOut>
                  <LandingPage />
                </SignedOut>
              </main>
            </div>
          } />
        </Routes>

        <Footer />
        
        {/* DaisyUI Toast Notification */}
        {toastMessage && (
          <div className="toast toast-end z-[100]">
            <div className="alert alert-success shadow-lg text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{toastMessage}</span>
            </div>
          </div>
        )}
      </div>
    </Router>
  )
}

export default App

