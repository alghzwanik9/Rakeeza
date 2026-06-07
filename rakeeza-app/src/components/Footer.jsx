import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Sparkles, Github, Twitter, Linkedin } from 'lucide-react'

const Footer = () => {
  const { t } = useTranslation()

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
          <a href="https://github.com/alghzwanik9" target="_blank" rel="noopener noreferrer" className="transition hover:text-accent" title="GitHub">
            <Github className="h-5 w-5" />
          </a>
          <a href="https://github.com/alghzwanik9" target="_blank" rel="noopener noreferrer" className="transition hover:text-accent" title="Twitter">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="https://github.com/alghzwanik9" target="_blank" rel="noopener noreferrer" className="transition hover:text-accent" title="LinkedIn">
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
