import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe2, Sparkles, ClipboardList, CalendarDays, Trophy, User2, MessageSquare, Palette, Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react"
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { to: '/', labelKey: 'tabs.dashboard', Icon: Sparkles },
  { to: '/tasks', labelKey: 'tabs.tasks', Icon: ClipboardList },
  { to: '/events', labelKey: 'tabs.events', Icon: CalendarDays },
  { to: '/achievements', labelKey: 'tabs.achievements', Icon: Trophy },
  { to: '/profile', labelKey: 'tabs.profile', Icon: User2 },
  { to: '/advisor', labelKey: 'tabs.advisor', Icon: MessageSquare },
]

const Navbar = ({ theme, setTheme }) => {
  const { t, i18n } = useTranslation()
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const currentLanguage = i18n.language || 'en'
  const isRTL = i18n.dir(currentLanguage) === 'rtl'
  const themes = ['dark', 'light', 'black', 'dracula', 'synthwave', 'cupcake']

  const changeLanguage = (lang) => {
    if (lang !== currentLanguage) {
      i18n.changeLanguage(lang)
    }
    setLangMenuOpen(false)
    setMobileMenuOpen(false)
  }

  const changeTheme = (tName) => {
    setTheme(tName)
    setThemeMenuOpen(false)
    setMobileMenuOpen(false)
  }

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-whisper bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3 sm:py-4 sm:px-6 lg:px-12 xl:px-16">
        
        {/* Start: Hamburger + Brand */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden flex items-center justify-center h-10 w-10 shrink-0 rounded-xl bg-surface border border-whisper text-ink transition hover:bg-canvas"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Brand */}
          <Link to="/" className="inline-flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-surface shadow-diffused ring-1 ring-whisper">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <span className="hidden sm:block text-xl font-bold tracking-tight text-ink">
              {t('header.brand')}
            </span>
          </Link>
        </div>

        {/* Main Navigation (Desktop) */}
        <SignedIn>
          <div className="hidden lg:flex items-center gap-1 bg-surface/50 p-1 rounded-2xl border border-whisper">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all active:scale-[0.98] ${
                    isActive
                      ? 'bg-accent/10 text-accent shadow-diffused'
                      : 'text-steel hover:bg-white/5 hover:text-ink'
                  }`
                }
              >
                <link.Icon className="h-4 w-4" />
                <span>{t(link.labelKey)}</span>
              </NavLink>
            ))}
          </div>
        </SignedIn>

        {/* Actions (Desktop) */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 sm:gap-4">
            {/* Theme Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setThemeMenuOpen((open) => !open)
                  setLangMenuOpen(false)
                }}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-whisper bg-surface px-4 text-sm font-medium text-ink transition-all hover:bg-white/5 active:scale-[0.98] capitalize"
              >
                <Palette className="h-4 w-4 text-accent" />
                {theme}
              </button>
              {themeMenuOpen && (
                <div className={`absolute top-full z-20 mt-2 flex w-full min-w-[120px] flex-col overflow-hidden rounded-xl border border-whisper bg-surface shadow-diffused ${isRTL ? 'right-0' : 'left-auto right-0'}`}>
                  {themes.map((tName) => (
                    <button key={tName} onClick={() => changeTheme(tName)} className={`px-4 py-3 text-sm font-medium capitalize text-start transition-colors ${theme === tName ? 'bg-accent/10 text-accent' : 'text-steel hover:bg-white/5 hover:text-ink'}`}>
                      {tName}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setLangMenuOpen((open) => !open)
                  setThemeMenuOpen(false)
                }}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-whisper bg-surface px-4 text-sm font-medium text-ink transition-all hover:bg-white/5 active:scale-[0.98]"
              >
                <Globe2 className="h-4 w-4 text-accent" />
                {currentLanguage === 'en' ? 'English' : 'العربية'}
              </button>
              {langMenuOpen && (
                <div className={`absolute top-full z-20 mt-2 flex w-full min-w-[120px] flex-col overflow-hidden rounded-xl border border-whisper bg-surface shadow-diffused ${isRTL ? 'right-0' : 'left-auto right-0'}`}>
                  <button onClick={() => changeLanguage('en')} className={`px-4 py-3 text-sm font-medium transition-colors ${currentLanguage === 'en' ? 'bg-accent/10 text-accent' : 'text-steel hover:bg-white/5 hover:text-ink'}`}>English</button>
                  <button onClick={() => changeLanguage('ar')} className={`px-4 py-3 text-sm font-medium transition-colors ${currentLanguage === 'ar' ? 'bg-accent/10 text-accent' : 'text-steel hover:bg-white/5 hover:text-ink'}`}>العربية</button>
                </div>
              )}
            </div>
          </div>

          {/* Auth Buttons */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]">
                {currentLanguage === 'en' ? 'Sign In' : 'تسجيل'}
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="h-10 w-10 flex items-center justify-center shrink-0">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>

      {/* Mobile Menu Backdrop & Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm lg:hidden"
            />
            
            {/* Sidebar */}
            <motion.div 
              initial={{ x: isRTL ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '100%' : '-100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className={`fixed top-0 bottom-0 z-50 w-[80vw] max-w-sm bg-surface shadow-2xl lg:hidden flex flex-col overflow-y-auto ${isRTL ? 'right-0 border-l border-whisper' : 'left-0 border-r border-whisper'}`}
            >
              {/* Header inside sidebar */}
              <div className="flex items-center justify-between p-4 border-b border-whisper">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-canvas shadow-inner ring-1 ring-whisper">
                    <Sparkles className="h-4 w-4 text-accent" />
                  </div>
                  <span className="font-bold text-ink">{t('header.brand')}</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full p-2 text-steel hover:bg-canvas hover:text-ink transition-colors outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <SignedIn>
                <div className="flex flex-col gap-1 p-4">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-accent/10 text-accent border border-accent/20'
                            : 'text-steel hover:bg-white/5 hover:text-ink border border-transparent'
                        }`
                      }
                    >
                      <link.Icon className="h-5 w-5" />
                      <span>{t(link.labelKey)}</span>
                    </NavLink>
                  ))}
                </div>

                <div className="h-px w-full bg-whisper my-2" />
              </SignedIn>

              {/* Mobile Settings (Theme & Lang) */}
              <div className="flex flex-col gap-6 p-4 mt-auto mb-4">
                <div className="flex flex-col gap-3">
                  <span className="text-xs uppercase tracking-[0.2em] font-semibold text-steel">Theme</span>
                  <div className="flex flex-wrap gap-2">
                    {themes.map(tName => (
                      <button 
                        key={tName} 
                        onClick={() => changeTheme(tName)}
                        className={`px-4 py-2 text-xs font-medium rounded-xl capitalize transition-all ${theme === tName ? 'bg-accent text-white shadow-md shadow-accent/20' : 'bg-canvas text-steel hover:bg-white/5 hover:text-ink border border-whisper'}`}
                      >
                        {tName}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-xs uppercase tracking-[0.2em] font-semibold text-steel">Language</span>
                  <div className="flex gap-2">
                    <button onClick={() => changeLanguage('en')} className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all ${currentLanguage === 'en' ? 'bg-accent text-white shadow-md shadow-accent/20' : 'bg-canvas text-steel hover:bg-white/5 hover:text-ink border border-whisper'}`}>English</button>
                    <button onClick={() => changeLanguage('ar')} className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all ${currentLanguage === 'ar' ? 'bg-accent text-white shadow-md shadow-accent/20' : 'bg-canvas text-steel hover:bg-white/5 hover:text-ink border border-whisper'}`}>العربية</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
