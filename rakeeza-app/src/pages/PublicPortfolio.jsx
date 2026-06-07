import { Link } from 'react-router-dom'
import { Sparkles, ArrowLeft, Github, Linkedin, Mail } from 'lucide-react'
import { useAppData } from '../hooks/useAppData.jsx'

const PublicPortfolio = () => {
  const { profile } = useAppData()
  // In a real app, you would fetch the user's profile based on the `username`
  // Here we use the local app data state.

  const { socialLinks } = profile || {}

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans">
      <div className="mx-auto flex min-h-screen w-full max-w-screen-lg flex-col px-4 py-8 sm:px-6 lg:px-12">
        {/* Navigation / Header */}
        <nav className="mb-12 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-steel transition hover:text-accent">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to App</span>
          </Link>
          <div className="inline-flex items-center gap-2 text-ink opacity-50">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-bold tracking-widest uppercase">Portfolio</span>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="mb-20 grid gap-8 md:grid-cols-[1fr_200px] md:items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Hi, I'm <span className="text-accent">{profile.name}</span>.
            </h1>
            <p className="max-w-2xl text-lg text-steel sm:text-xl">
              {profile.bio}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              {socialLinks?.github && (
                <a href={socialLinks.github} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-whisper bg-surface px-4 text-sm font-medium text-ink transition hover:bg-white/5">
                  <Github className="h-4 w-4" /> GitHub
                </a>
              )}
              {socialLinks?.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-whisper bg-surface px-4 text-sm font-medium text-ink transition hover:bg-white/5">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              )}
              {socialLinks?.email && (
                <a href={`mailto:${socialLinks.email}`} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-whisper bg-surface px-4 text-sm font-medium text-ink transition hover:bg-white/5">
                  <Mail className="h-4 w-4" /> Email Me
                </a>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <img src={profile.avatar} alt={profile.name} className="h-48 w-48 rounded-full border border-whisper shadow-diffused object-cover grayscale transition hover:grayscale-0" />
          </div>
        </header>

        {/* Skills Section */}
        <section className="mb-20">
          <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-steel">Core Expertise</h2>
          <div className="flex flex-wrap gap-3">
            {profile.skills.map((skill) => (
              <span key={skill} className="rounded-xl border border-whisper bg-surface/50 px-4 py-2 text-sm text-ink">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-20">
          <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-steel">Featured Work</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {profile.projects.map((project) => (
              <div key={project.id} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-whisper bg-surface/50 p-6 transition hover:bg-surface">
                <div className="mb-6">
                  <h3 className="mb-2 text-xl font-bold text-ink">{project.name}</h3>
                  <p className="text-sm text-steel line-clamp-3">{project.description}</p>
                </div>
                <div className="flex items-center gap-2 border-t border-whisper pt-4 text-xs font-medium text-accent">
                  {project.techStack}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto border-t border-whisper py-8 text-center text-sm text-steel">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </footer>
      </div>
    </div>
  )
}

export default PublicPortfolio
