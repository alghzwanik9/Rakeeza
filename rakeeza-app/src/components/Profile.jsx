import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Copy, ExternalLink, Trash2, Sparkles, Upload, Loader2 } from 'lucide-react'
import { generateProfessionalResume, generateHTMLPortfolio } from '../lib/aiAdvisorHelper'

const Profile = ({ profile, tasks, events, onAutoUpdate, onAddProject, onRemoveProject, onUpdateSocialLinks, onUpdateProfile, showToast }) => {
  const { t } = useTranslation()
  const [projectName, setProjectName] = useState('')
  const [projectTech, setProjectTech] = useState('React / AI')
  
  const socialLinks = profile.socialLinks || { linkedin: '', github: '', twitter: '', email: '' }
  const [links, setLinks] = useState(socialLinks)

  // Local state for seamless editing
  const [localName, setLocalName] = useState(profile.name || '')
  const [localTitle, setLocalTitle] = useState(profile.title || '')
  const [localBio, setLocalBio] = useState(profile.bio || '')
  const [newSkill, setNewSkill] = useState('')

  // Resume builder state
  const [resumePrompt, setResumePrompt] = useState('')
  const [generatedResume, setGeneratedResume] = useState('')
  const [isGeneratingResume, setIsGeneratingResume] = useState(false)

  // Portfolio builder state
  const [portfolioPrompt, setPortfolioPrompt] = useState('')
  const [generatedPortfolio, setGeneratedPortfolio] = useState('')
  const [isGeneratingPortfolio, setIsGeneratingPortfolio] = useState(false)

  // Sync local state when external profile changes without using useEffect (React best practice)
  const [prevProfileName, setPrevProfileName] = useState(profile.name)
  const [prevProfileTitle, setPrevProfileTitle] = useState(profile.title)
  const [prevProfileBio, setPrevProfileBio] = useState(profile.bio)

  if (profile.name !== prevProfileName) {
    setPrevProfileName(profile.name)
    setLocalName(profile.name || '')
  }
  if (profile.title !== prevProfileTitle) {
    setPrevProfileTitle(profile.title)
    setLocalTitle(profile.title || '')
  }
  if (profile.bio !== prevProfileBio) {
    setPrevProfileBio(profile.bio)
    setLocalBio(profile.bio || '')
  }

  const handleLinkChange = (e) => {
    const newLinks = { ...links, [e.target.name]: e.target.value }
    setLinks(newLinks)
    if (onUpdateSocialLinks) {
      onUpdateSocialLinks(newLinks)
    }
  }

  const handleBlur = (field, value) => {
    if (profile[field] !== value && onUpdateProfile) {
      onUpdateProfile({ [field]: value })
    }
  }

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault()
      const updatedSkills = [...new Set([...(profile.skills || []), newSkill.trim()])]
      if (onUpdateProfile) onUpdateProfile({ skills: updatedSkills })
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = profile.skills.filter(s => s !== skillToRemove)
    if (onUpdateProfile) onUpdateProfile({ skills: updatedSkills })
  }

  const handleUploadAvatar = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      if (onUpdateProfile) onUpdateProfile({ avatar: reader.result })
    }
    reader.readAsDataURL(file)
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/portfolio/${profile.name?.toLowerCase().replace(/\s+/g, '') || 'username'}`
    navigator.clipboard.writeText(url)
    if (showToast) showToast('Portfolio link copied to clipboard! 📋')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!projectName.trim()) return
    onAddProject({
      id: Date.now().toString(),
      name: projectName.trim(),
      description: 'A hands-on AI project with practical goals.',
      techStack: projectTech,
    })
    setProjectName('')
    setProjectTech('React / AI')
  }

  const handleGenerateResume = async () => {
    if (!resumePrompt.trim() || isGeneratingResume) return
    setIsGeneratingResume(true)
    setGeneratedResume('')
    
    try {
      const result = await generateProfessionalResume(resumePrompt, { profile, tasks, events })
      setGeneratedResume(result)
      if (showToast) showToast('Resume generated successfully! ✨')
    } catch (e) {
      console.error("Failed to generate resume:", e)
      if (showToast) showToast('Error generating resume.')
    } finally {
      setIsGeneratingResume(false)
    }
  }

  const copyResume = () => {
    if (!generatedResume) return
    navigator.clipboard.writeText(generatedResume)
    if (showToast) showToast('Resume copied to clipboard! 📋')
  }

  const handleGeneratePortfolio = async () => {
    if (!portfolioPrompt.trim() || isGeneratingPortfolio) return
    setIsGeneratingPortfolio(true)
    setGeneratedPortfolio('')
    
    try {
      const result = await generateHTMLPortfolio(portfolioPrompt, { profile })
      setGeneratedPortfolio(result)
      if (showToast) showToast('Portfolio generated successfully! ✨')
    } catch (e) {
      console.error("Failed to generate portfolio:", e)
      if (showToast) showToast('Error generating portfolio.')
    } finally {
      setIsGeneratingPortfolio(false)
    }
  }

  const copyPortfolio = () => {
    if (!generatedPortfolio) return
    navigator.clipboard.writeText(generatedPortfolio)
    if (showToast) showToast('Portfolio HTML copied to clipboard! 📋')
  }

  return (
    <section className="space-y-6">
      {/* Profile Details Section */}
      <div className="rounded-3xl border border-whisper bg-surface/80 p-6 shadow-diffused backdrop-blur-md">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="space-y-5 rounded-3xl border border-whisper bg-canvas/80 p-6 text-center relative group">
            <div className="relative mx-auto h-28 w-28 group/avatar">
              <img src={profile.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=default&backgroundColor=b6e3f4'} alt="Avatar" className="h-full w-full rounded-full border-4 border-whisper object-cover" />
              <label 
                title={t('profile.uploadAvatar', 'Upload Avatar')}
                className="absolute -bottom-2 -right-2 flex cursor-pointer items-center justify-center rounded-full bg-surface p-2 text-steel border border-whisper shadow-sm transition hover:text-accent hover:border-accent"
              >
                <Upload className="h-4 w-4" />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleUploadAvatar} 
                />
              </label>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <p className="text-sm uppercase tracking-[0.24em] text-steel">{t('profile.title', 'Profile')}</p>
              
              <input 
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                onBlur={() => handleBlur('name', localName)}
                placeholder={t('profile.namePlaceholder', 'Your Name')}
                className="w-full bg-transparent text-center text-2xl font-semibold text-ink outline-none transition-colors border border-transparent hover:border-whisper focus:border-accent rounded-xl py-1"
              />
              
              <input 
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                onBlur={() => handleBlur('title', localTitle)}
                placeholder={t('profile.titlePlaceholder', 'Your Title')}
                className="w-full bg-transparent text-center text-sm text-steel outline-none transition-colors border border-transparent hover:border-whisper focus:border-accent rounded-xl py-1"
              />
            </div>
            <button
              type="button"
              onClick={onAutoUpdate}
              title="Auto-generates a bio and skills based on your active tasks"
              className="w-full rounded-3xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent/90"
            >
              {t('profile.updateProfile', 'Update with AI ✨')}
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-steel mb-3">{t('profile.bioLabel', 'Bio')}</p>
              <textarea 
                value={localBio}
                onChange={(e) => setLocalBio(e.target.value)}
                onBlur={() => handleBlur('bio', localBio)}
                placeholder={t('profile.bioPlaceholder', 'Write something about yourself...')}
                rows={4}
                className="w-full resize-none rounded-3xl border border-whisper bg-canvas/80 p-5 text-ink outline-none transition focus:border-accent"
              />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-steel mb-3">{t('profile.skillsLabel', 'Skills')}</p>
              <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-whisper bg-canvas/80 p-5">
                {profile.skills?.map((skill) => (
                  <span key={skill} className="group flex items-center gap-1.5 rounded-2xl border border-whisper bg-surface px-3 py-1.5 text-sm text-ink transition hover:border-error">
                    {skill}
                    <button 
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-steel opacity-50 transition hover:text-error hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder={t('profile.skillPlaceholder', 'Type a skill and press Enter...')}
                  className="flex-1 min-w-[150px] bg-transparent text-sm text-ink outline-none px-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social & Portfolio Section */}
      <div className="rounded-3xl border border-whisper bg-surface/80 p-6 shadow-diffused backdrop-blur-md">
        <p className="text-sm uppercase tracking-[0.24em] text-steel mb-4">{t('profile.socialTitle', 'Social & Portfolio')}</p>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <input name="github" value={links.github} onChange={handleLinkChange} placeholder={t('profile.githubUrl', 'GitHub URL')} className="w-full rounded-2xl border border-whisper bg-canvas px-4 py-3 text-sm text-ink outline-none focus:border-accent" />
            <input name="twitter" value={links.twitter || ''} onChange={handleLinkChange} placeholder={t('profile.twitterUrl', 'Twitter URL')} className="w-full rounded-2xl border border-whisper bg-canvas px-4 py-3 text-sm text-ink outline-none focus:border-accent" />
            <input name="linkedin" value={links.linkedin} onChange={handleLinkChange} placeholder={t('profile.linkedinUrl', 'LinkedIn URL')} className="w-full rounded-2xl border border-whisper bg-canvas px-4 py-3 text-sm text-ink outline-none focus:border-accent" />
            <input name="email" value={links.email} onChange={handleLinkChange} placeholder={t('profile.emailUrl', 'Email Address')} className="w-full rounded-2xl border border-whisper bg-canvas px-4 py-3 text-sm text-ink outline-none focus:border-accent" />
          </div>
          
          <div className="rounded-2xl border border-whisper bg-canvas p-6 flex flex-col justify-center items-center text-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-secondary"></div>
            <p className="text-steel text-sm font-medium">{t('profile.publicPortfolioLiveAt', 'Your Public Portfolio is live!')}</p>
            
            <div className="w-full truncate rounded-xl bg-surface p-3 text-accent text-sm font-mono select-all border border-whisper">
              {window.location.origin}/portfolio/{profile.name?.toLowerCase().replace(/\s+/g, '') || 'username'}
            </div>
            
            <div className="flex gap-3 w-full">
              <button 
                onClick={handleCopyLink}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-whisper border border-whisper"
              >
                <Copy className="h-4 w-4" /> Copy Link
              </button>
              
              <a 
                href={`/portfolio/${profile.name?.toLowerCase().replace(/\s+/g, '') || 'username'}`} 
                target="_blank" 
                rel="noreferrer" 
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/90"
              >
                <ExternalLink className="h-4 w-4" /> Open
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="rounded-3xl border border-whisper bg-surface/80 p-6 shadow-diffused backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-steel">{t('profile.projectsLabel', 'Projects')}</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">{t('profile.subtitle', 'Featured Work')}</h2>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-3 w-full sm:w-[360px]">
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder={t('profile.newProjectTitle', 'Project Name')}
              className="w-full rounded-3xl border border-whisper bg-canvas/90 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
            />
            <input
              value={projectTech}
              onChange={(e) => setProjectTech(e.target.value)}
              placeholder={t('profile.newProjectTech', 'Tech Stack (e.g. React / Node)')}
              className="w-full rounded-3xl border border-whisper bg-canvas/90 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="rounded-3xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent/90"
            >
              {t('profile.addProject', 'Add Project')}
            </button>
          </form>
        </div>

        <div className="mt-8 grid gap-4">
          {profile.projects?.map((project) => (
            <div key={project.id} className="group relative rounded-3xl border border-whisper bg-canvas/80 p-5 transition hover:border-steel pr-12">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-xl font-semibold text-ink">{project.name}</h3>
                <span className="rounded-full border border-whisper bg-surface/80 px-3 py-1 text-sm text-steel">
                  {project.techStack}
                </span>
              </div>
              <p className="mt-3 text-steel">{project.description}</p>
              <button 
                onClick={() => onRemoveProject(project.id)}
                className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-2 text-error opacity-0 transition group-hover:opacity-100 hover:bg-error/10"
                title={t('profile.deleteProject', 'Delete Project')}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
          {(!profile.projects || profile.projects.length === 0) && (
            <p className="text-center text-steel py-4">{t('profile.noProjects', 'No projects yet. Add one above!')}</p>
          )}
        </div>
      </div>

      {/* AI Resume Builder Section */}
      <div className="rounded-3xl border-2 border-accent/20 bg-surface/80 p-6 shadow-diffused backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <p className="text-sm uppercase tracking-[0.24em] text-accent font-semibold">{t('profile.resumeBuilderTag', 'AI Resume Builder')}</p>
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-ink">{t('profile.resumeBuilderTitle', 'Generate a Professional Resume')}</h2>
            <p className="text-steel text-sm mt-1">{t('profile.resumeBuilderSubtitle', "We'll automatically include your tasks, projects, and skills.")}</p>
          </div>
        </div>

        <div className="space-y-4">
          <textarea 
            value={resumePrompt}
            onChange={(e) => setResumePrompt(e.target.value)}
            placeholder={t('profile.resumePromptPlaceholder', "What role are you applying for? (e.g. 'I am applying for a Junior React Developer role focusing on UI/UX at a tech startup.')")}
            rows={3}
            className="w-full resize-none rounded-3xl border border-whisper bg-canvas/80 p-5 text-ink outline-none transition focus:border-accent"
          />
          <button 
            onClick={handleGenerateResume}
            disabled={isGeneratingResume || !resumePrompt.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-ink px-6 py-3.5 text-sm font-semibold text-canvas transition hover:bg-ink/80 disabled:opacity-50"
          >
            {isGeneratingResume ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            {isGeneratingResume ? t('profile.generatingMagic', 'Generating Magic...') : t('profile.generateResume', 'Generate Resume ✨')}
          </button>
        </div>

        {generatedResume && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-ink">{t('profile.customResume', 'Your Custom Resume')}</h3>
              <button 
                onClick={copyResume}
                className="inline-flex items-center gap-2 rounded-xl bg-surface px-4 py-2 text-sm font-medium text-ink border border-whisper transition hover:border-accent"
              >
                <Copy className="h-4 w-4" /> {t('profile.copyText', 'Copy Text')}
              </button>
            </div>
            <div className="rounded-3xl border border-whisper bg-canvas p-6 overflow-hidden">
              <pre className="whitespace-pre-wrap font-sans text-sm text-ink leading-relaxed max-h-[400px] overflow-y-auto custom-scrollbar">
                {generatedResume}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* AI HTML Portfolio Generator Section */}
      <div className="rounded-3xl border-2 border-secondary/20 bg-surface/80 p-6 shadow-diffused backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-secondary" />
              <p className="text-sm uppercase tracking-[0.24em] text-secondary font-semibold">AI Portfolio Generator</p>
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Generate a Standalone HTML Portfolio</h2>
            <p className="text-steel text-sm mt-1">We'll write a complete, beautiful HTML page based on your profile.</p>
          </div>
        </div>

        <div className="space-y-4">
          <textarea 
            value={portfolioPrompt}
            onChange={(e) => setPortfolioPrompt(e.target.value)}
            placeholder="Describe the style you want (e.g. 'Dark mode, futuristic design, single page for a full-stack dev')"
            rows={3}
            className="w-full resize-none rounded-3xl border border-whisper bg-canvas/80 p-5 text-ink outline-none transition focus:border-secondary"
          />
          <button 
            onClick={handleGeneratePortfolio}
            disabled={isGeneratingPortfolio || !portfolioPrompt.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-secondary px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-secondary/90 disabled:opacity-50"
          >
            {isGeneratingPortfolio ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            {isGeneratingPortfolio ? 'Generating Magic...' : 'Generate HTML Portfolio ✨'}
          </button>
        </div>

        {generatedPortfolio && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-ink">Your Custom HTML Portfolio</h3>
              <button 
                onClick={copyPortfolio}
                className="inline-flex items-center gap-2 rounded-xl bg-surface px-4 py-2 text-sm font-medium text-ink border border-whisper transition hover:border-secondary"
              >
                <Copy className="h-4 w-4" /> Copy HTML Code
              </button>
            </div>
            
            {/* Live Preview Iframe */}
            <div className="w-full h-[600px] rounded-3xl border-2 border-whisper overflow-hidden bg-white">
              <iframe 
                srcDoc={generatedPortfolio} 
                className="w-full h-full border-none"
                title="Portfolio Preview"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Profile
