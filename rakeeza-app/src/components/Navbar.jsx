import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe2, Sparkles, ClipboardList, CalendarDays, Trophy, User2, MessageSquare, Palette } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react"

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
  const currentLanguage = i18n.language || 'en'
  const isRTL = i18n.dir(currentLanguage) === 'rtl'
  const themes = ['dark', 'light', 'black', 'dracula', 'synthwave', 'cupcake']

  const changeLanguage = (lang) => {
    if (lang !== currentLanguage) {
      i18n.changeLanguage(lang)
    }
    setLangMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-whisper bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-4 sm:px-6 lg:px-12 xl:px-16">
        {/* Brand */}
        <Link to="/" className="inline-flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface shadow-diffused ring-1 ring-whisper">
            <Sparkles className="h-5 w-5 text-accent" />
          </div>
          <span className="hidden sm:block text-xl font-bold tracking-tight text-ink">
            {t('header.brand')}
          </span>
        </Link>

        {/* Main Navigation (Tabs) */}
        <div className="hidden md:flex items-center gap-1 bg-surface/50 p-1 rounded-2xl border border-whisper">
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

        {/* Actions */}
        <div className="flex items-center gap-4">
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
              <div
                className={`absolute top-full z-20 mt-2 flex w-full min-w-[120px] flex-col overflow-hidden rounded-xl border border-whisper bg-surface shadow-diffused ${
                  isRTL ? 'right-0' : 'left-auto right-0'
                }`}
              >
                {themes.map((tName) => (
                  <button
                    key={tName}
                    type="button"
                    onClick={() => {
                      setTheme(tName)
                      setThemeMenuOpen(false)
                    }}
                    className={`px-4 py-3 text-sm font-medium capitalize text-start transition-colors ${
                      theme === tName
                        ? 'bg-accent/10 text-accent'
                        : 'text-steel hover:bg-white/5 hover:text-ink'
                    }`}
                  >
                    {tName}
                  </button>
                ))}
              </div>
            )}
          </div>

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
              <div
                className={`absolute top-full z-20 mt-2 flex w-full min-w-[120px] flex-col overflow-hidden rounded-xl border border-whisper bg-surface shadow-diffused ${
                  isRTL ? 'right-0' : 'left-auto right-0'
                }`}
              >
                <button
                  type="button"
                  onClick={() => changeLanguage('en')}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    currentLanguage === 'en'
                      ? 'bg-accent/10 text-accent'
                      : 'text-steel hover:bg-white/5 hover:text-ink'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => changeLanguage('ar')}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    currentLanguage === 'ar'
                      ? 'bg-accent/10 text-accent'
                      : 'text-steel hover:bg-white/5 hover:text-ink'
                  }`}
                >
                  العربية
                </button>
              </div>
            )}
          </div>
          
          {/* Auth Buttons */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]">
                {currentLanguage === 'en' ? 'Sign In' : 'تسجيل الدخول'}
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
