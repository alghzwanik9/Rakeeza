import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Github, Linkedin } from 'lucide-react'
import { useAppData } from '../hooks/useAppData.jsx'

const XLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const Footer = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { profile } = useAppData()
  
  const socialLinks = profile?.socialLinks || {}

  const handleMissingLink = (e) => {
    e.preventDefault()
    navigate('/profile')
  }

  return (
    <footer className="mt-12 w-full border-t border-whisper bg-canvas py-10">
      <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-12 xl:px-16">
        
        {/* Brand & Copyright */}
        <div className="flex flex-col items-center sm:items-start gap-2">
          <Link to="/" className="inline-flex items-center gap-2 opacity-80 transition hover:opacity-100">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="font-semibold text-ink">{t('header.brand')}</span>
          </Link>
          <p className="text-sm text-steel mt-2">
            تم التطوير بواسطة <a href="https://github.com/alghzwanik9" target="_blank" rel="noopener noreferrer" className="font-bold text-accent hover:underline">KMG || AI</a>
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 text-steel">
          <a 
            href={socialLinks.github || "#"} 
            target={socialLinks.github ? "_blank" : "_self"} 
            rel="noopener noreferrer" 
            className={`transition hover:text-accent ${!socialLinks.github && 'opacity-50 hover:opacity-100'}`} 
            title={socialLinks.github ? "GitHub" : "أضف حساب GitHub من الملف الشخصي"}
            onClick={!socialLinks.github ? handleMissingLink : undefined}
          >
            <Github className="h-5 w-5" />
          </a>
          <a 
            href={socialLinks.twitter || "#"} 
            target={socialLinks.twitter ? "_blank" : "_self"} 
            rel="noopener noreferrer" 
            className={`transition hover:text-accent ${!socialLinks.twitter && 'opacity-50 hover:opacity-100'}`} 
            title={socialLinks.twitter ? "X" : "أضف حساب X من الملف الشخصي"}
            onClick={!socialLinks.twitter ? handleMissingLink : undefined}
          >
            <XLogo className="h-5 w-5" />
          </a>
          <a 
            href={socialLinks.linkedin || "#"} 
            target={socialLinks.linkedin ? "_blank" : "_self"} 
            rel="noopener noreferrer" 
            className={`transition hover:text-accent ${!socialLinks.linkedin && 'opacity-50 hover:opacity-100'}`} 
            title={socialLinks.linkedin ? "LinkedIn" : "أضف حساب LinkedIn من الملف الشخصي"}
            onClick={!socialLinks.linkedin ? handleMissingLink : undefined}
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
